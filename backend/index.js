const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

function loadDB() {
  const defaultStructure = {
    mainPotParticipants: [],
    mainHistory: [],
    lastWinner: {}
  };

  if (!fs.existsSync('db.json')) {
    fs.writeFileSync('db.json', JSON.stringify(defaultStructure, null, 2));
    return defaultStructure;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync('db.json'));
    for (const key in defaultStructure) {
      if (!parsed[key]) {
        parsed[key] = defaultStructure[key];
      }
    }
    return parsed;
  } catch (err) {
    console.error("❌ Failed to parse db.json, resetting:", err);
    fs.writeFileSync('db.json', JSON.stringify(defaultStructure, null, 2));
    return defaultStructure;
  }
}

function saveDB(db) {
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
}

const connection = new Connection(process.env.RPC_URL);
const admin = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SECRET_KEY_JSON)));
const adminPubkey = new PublicKey(process.env.ADMIN_PUBLIC_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/enter', async (req, res) => {
  const { wallet, amount, effectiveAmount, tx, hasLotto } = req.body;

  if (!wallet || !amount || !tx) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    let txInfo;
    let retries = 0;
    const maxRetries = 5;
    const retryDelay = 1000;

    while (retries < maxRetries) {
      try {
        txInfo = await connection.getParsedTransaction(tx, { commitment: 'confirmed' });
        if (txInfo) break;
      } catch (err) {
        console.log(`Retry ${retries + 1}: Failed to fetch transaction`);
      }
      retries++;
      if (retries < maxRetries) await new Promise(resolve => setTimeout(resolve, retryDelay));
    }

    if (!txInfo || !txInfo.meta || txInfo.meta.err) {
      return res.status(400).json({ error: 'Invalid or failed transaction' });
    }

    const transferInstruction = txInfo.transaction.message.instructions.find(i => {
      return (
        i.programId.equals(SystemProgram.programId) &&
        i.parsed?.type === 'transfer' &&
        i.parsed.info?.destination === adminPubkey.toBase58()
      );
    });

    if (!transferInstruction) {
      console.log('Transaction details:', JSON.stringify(txInfo, null, 2));
      return res.status(400).json({ error: 'Transaction did not send SOL to admin wallet' });
    }

    const sentLamports = Number(transferInstruction.parsed.info.lamports);
    const sentSOL = sentLamports / 1e9;

    if (Math.abs(sentSOL - amount) > 0.0001) {
      return res.status(400).json({ 
        error: `Amount mismatch (sent ${sentSOL}, expected ${amount})` 
      });
    }

    const db = loadDB();
    const entry = { 
      wallet, 
      amount: parseFloat(amount.toFixed(9)),
      effectiveAmount: parseFloat((effectiveAmount || amount).toFixed(9)),
      hasLotto: !!hasLotto
    };

    db.mainPotParticipants.push(entry);
    saveDB(db);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Full error:', err);
    return res.status(500).json({ error: 'Failed to validate transaction' });
  }
});

app.get('/participants/main', (req, res) => {
  const db = loadDB();
  res.json(db.mainPotParticipants);
});

app.get('/history/main', (req, res) => {
  const db = loadDB();
  res.json(db.mainHistory.slice().reverse());
});

async function drawPot() {
  const db = loadDB();
  const participants = db.mainPotParticipants;
  
  if (!participants || !participants.length) {
    console.log('No entries for current pot.');
    return { ok: false, message: 'No participants' };
  }

  const total = participants.reduce((sum, p) => sum + (p.effectiveAmount || p.amount), 0);
  const payout = Number((total * 0.97).toFixed(9));
  
  let cumulative = 0;
  const randomPoint = Math.random() * total;
  const winner = participants.find(p => {
    cumulative += (p.effectiveAmount || p.amount);
    return randomPoint <= cumulative;
  });

  if (!winner) {
    console.error('❌ No winner selected despite participants');
    return { ok: false, message: 'Winner selection failed' };
  }

  try {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: admin.publicKey,
        toPubkey: new PublicKey(winner.wallet),
        lamports: Math.floor(payout * 1e9),
      })
    );
    
    const sig = await connection.sendTransaction(tx, [admin]);
    const confirmation = await connection.confirmTransaction(sig, 'confirmed');
    
    if (confirmation.value.err) {
      throw new Error('Payout transaction failed');
    }

    const winnerData = {
      time: new Date().toISOString(),
      winner: winner.wallet,
      pot: payout,
      tx: sig,
      participants: participants.length,
      totalPot: total
    };

    db.lastWinner.main = winnerData;
    db.mainHistory.push(winnerData);
    db.mainPotParticipants = [];
    
    saveDB(db);
    console.log(`🎯 MAIN POT WINNER: ${winner.wallet} | PRIZE: ${payout} SOL | TX: ${sig}`);
    return { ok: true, ...winnerData };
  } catch (err) {
    console.error('❌ Failed to send payout:', err);
    return { ok: false, error: err.message };
  }
}

app.post('/draw', async (req, res) => {
  try {
    const result = await drawPot();
    if (result.ok) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/last-winner/main', (req, res) => {
  const db = loadDB();
  const last = db.lastWinner?.main;
  
  if (!last) {
    return res.status(404).json({ 
      ok: false, 
      message: 'No winner found for this round' 
    });
  }
  
  res.json({ ok: true, ...last });
});

app.post('/admin/clear-winners', (req, res) => {
  const db = loadDB();
  db.mainHistory = [];
  db.lastWinner.main = {};
  saveDB(db);
  res.json({ ok: true, message: 'Winners cleared.' });
});


app.listen(process.env.PORT, () => {
  console.log(`🚀 Rapid Lottery backend on http://localhost:${process.env.PORT}`);
  
  connection.getBalance(admin.publicKey)
    .then(balance => {
      console.log(`Admin wallet balance: ${balance / 1e9} SOL`);
    })
    .catch(err => {
      console.error('Failed to check admin wallet balance:', err);
    });
});

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('⏰ Running 10-minute draw...');
  try {
    await drawPot();
  } catch (err) {
    console.error('❌ Draw failed:', err);
  }
});
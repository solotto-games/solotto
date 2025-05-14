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
    smallPotParticipants: [],
    bigPotParticipants: [],
    smallHistory: [],
    bigHistory: [],
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
  const { wallet, amount, effectiveAmount, pot, tx, hasLotto } = req.body;

  if (!wallet || !amount || !pot || !tx) {
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

    if (pot === 'small') {
      db.smallPotParticipants.push(entry);
    } else if (pot === 'big') {
      db.bigPotParticipants.push(entry);
    } else {
      return res.status(400).json({ error: 'Invalid pot type' });
    }

    saveDB(db);
    return res.json({ ok: true });
  } catch (err) {
    console.error('Full error:', err);
    return res.status(500).json({ error: 'Failed to validate transaction' });
  }
});

app.get('/participants/:pot', (req, res) => {
  const db = loadDB();
  const pot = req.params.pot;
  if (pot === 'small') return res.json(db.smallPotParticipants);
  if (pot === 'big') return res.json(db.bigPotParticipants);
  res.status(400).json({ error: 'Invalid pot type' });
});

app.get('/history/:pot', (req, res) => {
  const db = loadDB();
  const pot = req.params.pot;
  if (pot === 'small') return res.json(db.smallHistory.slice().reverse());
  if (pot === 'big') return res.json(db.bigHistory.slice().reverse());
  res.status(400).json({ error: 'Invalid pot type' });
});

async function drawPot(potType, participantKey, historyKey) {
  const db = loadDB();
  const participants = db[participantKey];
  
  if (!participants || !participants.length) {
    console.log(`No entries for ${potType} pot.`);
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
      totalPot: total,
      potType
    };

    db.lastWinner[potType] = winnerData;
    db[historyKey].push(winnerData);
    db[participantKey] = [];
    
    saveDB(db);
    console.log(`🎯 ${potType.toUpperCase()} WINNER: ${winner.wallet} | PRIZE: ${payout} SOL | TX: ${sig}`);
    return { ok: true, ...winnerData };
  } catch (err) {
    console.error(`❌ Failed to send payout for ${potType} pot:`, err);
    return { ok: false, error: err.message };
  }
}

app.post('/draw-small', async (req, res) => {
  try {
    const result = await drawPot('small', 'smallPotParticipants', 'smallHistory');
    if (result.ok) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/draw-big', async (req, res) => {
  try {
    const result = await drawPot('big', 'bigPotParticipants', 'bigHistory');
    if (result.ok) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/last-winner/:pot', (req, res) => {
  const db = loadDB();
  const pot = req.params.pot;
  
  if (!['small', 'big'].includes(pot)) {
    return res.status(400).json({ error: 'Invalid pot type' });
  }

  const last = db.lastWinner?.[pot];
  
  if (!last) {
    return res.status(404).json({ 
      ok: false, 
      message: 'No winner found for this round' 
    });
  }
  
  res.json({ ok: true, ...last });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Jackpot backend on http://localhost:${process.env.PORT}`);
  
  connection.getBalance(admin.publicKey)
    .then(balance => {
      console.log(`Admin wallet balance: ${balance / 1e9} SOL`);
    })
    .catch(err => {
      console.error('Failed to check admin wallet balance:', err);
    });
});

cron.schedule('0 * * * *', async () => {
  console.log('⏰ Running hourly draw...');
  try {
    await drawPot('small', 'smallPotParticipants', 'smallHistory');
  } catch (err) {
    console.error('❌ Hourly draw failed:', err);
  }
});

cron.schedule('0 0 * * 0', async () => {
  console.log('⏰ Running weekly draw...');
  try {
    await drawPot('big', 'bigPotParticipants', 'bigHistory');
  } catch (err) {
    console.error('❌ Weekly draw failed:', err);
  }
});
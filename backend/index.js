const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

function loadDB() {
  if (!fs.existsSync('db.json')) {
    fs.writeFileSync('db.json', JSON.stringify({
      smallPotParticipants: [],
      bigPotParticipants: [],
      smallHistory: [],
      bigHistory: []
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync('db.json'));
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

// Join pot
app.post('/enter', async (req, res) => {
  const { wallet, amount, pot } = req.body;
  const db = loadDB();
  const entry = { wallet, amount };

  if (pot === 'small') {
    db.smallPotParticipants.push(entry);
  } else if (pot === 'big') {
    db.bigPotParticipants.push(entry);
  } else {
    return res.status(400).json({ error: 'Invalid pot type' });
  }

  saveDB(db);
  res.json({ ok: true });
});

// Get participants
app.get('/participants/:pot', (req, res) => {
  const db = loadDB();
  const pot = req.params.pot;
  if (pot === 'small') return res.json(db.smallPotParticipants);
  if (pot === 'big') return res.json(db.bigPotParticipants);
  res.status(400).json({ error: 'Invalid pot type' });
});

// Get history
app.get('/history/:pot', (req, res) => {
  const db = loadDB();
  if (req.params.pot === 'small') return res.json(db.smallHistory);
  if (req.params.pot === 'big') return res.json(db.bigHistory);
  res.status(400).json({ error: 'Invalid pot type' });
});

// Draw logic
function drawPot(potType, participantKey, historyKey) {
  const db = loadDB();
  const participants = db[participantKey];
  if (!participants.length) return console.log(`No entries for ${potType} pot.`);

  const total = participants.reduce((sum, p) => sum + p.amount, 0);
  let r = Math.random() * total;
  const winner = participants.find(p => {
    if (r < p.amount) return true;
    r -= p.amount;
    return false;
  });

  const lamports = Math.floor(total * 1e9 * 0.99); // 1% fee
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: admin.publicKey,
      toPubkey: new PublicKey(winner.wallet),
      lamports
    })
  );

  connection.sendTransaction(tx, [admin]).then(() => {
    console.log(`🎯 ${potType.toUpperCase()} winner: ${winner.wallet} | Prize: ${total} SOL`);

    db[historyKey].push({
      time: new Date().toISOString(),
      winner: winner.wallet,
      pot: total
    });

    db[participantKey] = [];
    saveDB(db);
  }).catch(console.error);
}

// Manual draw endpoints
app.post('/draw-small', (req, res) => {
  drawPot('small', 'smallPotParticipants', 'smallHistory');
  res.json({ ok: true });
});

app.post('/draw-big', (req, res) => {
  drawPot('big', 'bigPotParticipants', 'bigHistory');
  res.json({ ok: true });
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Jackpot backend on http://localhost:${process.env.PORT}`);
});

// Schedule hourly and weekly draws
cron.schedule('0 * * * *', () => drawPot('small', 'smallPotParticipants', 'smallHistory')); // every hour
cron.schedule('0 0 * * 0', () => drawPot('big', 'bigPotParticipants', 'bigHistory'));       // every Sunday

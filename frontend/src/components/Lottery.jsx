import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Countdown from "react-countdown";

// ────────────────────────────────
//  ⏱  Countdown helper constants
// ────────────────────────────────
const HOUR_MS = 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * HOUR_MS;

/* Top-of-next-hour in UTC */
function getNextHourUTC() {
  return Math.ceil(Date.now() / HOUR_MS) * HOUR_MS;
}

/* Next Monday 00:00 UTC */
function getNextMondayUTC() {
  const now = new Date();
  const day = now.getUTCDay();              // 0 = Sun, 1 = Mon, …
  const daysUntilMon = (8 - day) % 7;       // 0 if Mon, else 1-6
  const nextMon = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMon,
    0, 0, 0, 0                              // 00:00:00
  ));
  return nextMon.getTime();
}

const adminPublicKey = new PublicKey("EhQewZWWVA1jqZqNpAGCDLamh3cAD5nqMefWkfuffdNq");

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

function Lottery() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [deadlines, setDeadlines] = useState({
    small: getNextHourUTC(),   // exact top of next hour UTC
    big:   getNextMondayUTC()  // next Monday 00:00 UTC
  });
  
  
  const [amount, setAmount] = useState('');
  const [potType, setPotType] = useState('small');
  const [participants, setParticipants] = useState([]);
  const [timeLeft, setTimeLeft] = useState(3600);


  useEffect(() => {
    const fetch = () => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/participants/${potType}`)
        .then(res => setParticipants(res.data))
        .catch(console.error);
    };
    fetch();
    const iv = setInterval(fetch, 5000);
    return () => clearInterval(iv);
  }, [potType]);

  const enter = async () => {
    if (!publicKey) return alert("Connect wallet first.");
    if (!amount) return alert("Enter amount.");
    const lamports = Math.floor(parseFloat(amount) * 1e9);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: adminPublicKey,
        lamports
      })
    );
    const sig = await sendTransaction(tx, connection);
    await connection.confirmTransaction(sig);

    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/enter`, {
      wallet: publicKey.toBase58(),
      amount: parseFloat(amount),
      pot: potType
    });
    setAmount('');
    toast.success('🚀 Successfully entered the pot! Good luck!');
  };

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return d > 0
      ? `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`
      : `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="lottery-container"
    >
      {/* Header Section */}
<div className="lottery-header" style={{ textAlign: 'center' }}>
  <div className="header-content" style={{ justifyContent: 'center' }}>
    <img
      src="/logo.png"
      alt="Solana"
      className="header-logo"
      style={{
        width: '192px',
        height: '192px',
        marginBottom: '1rem'
      }}
    />
  </div>
  <p className="header-subtitle">
    Decentralized, transparent lottery powered by Solana
  </p>
</div>




  
      {/* Main Card Container */}
      <div className="main-card">
        {/* Pot Selection Tabs */}
        <div className="pot-selector">
          {['small', 'big'].map((type) => (
            <div
              key={type}
              onClick={() => setPotType(type)}
              className={`pot-tab ${potType === type ? 'active' : ''}`}
            >
              <div className="pot-name">
                {type === 'small' ? 'Hourly Draw' : 'Weekly Draw'}
              </div>
              <div className="pot-description">
                {type === 'small' ? 'Every 60 minutes' : 'Every Sunday 00:00 UTC'}
              </div>
            </div>
          ))}
        </div>
  
        {/* Countdown Timer */}
        <div className="timer-container">
          <div className="timer-label">NEXT DRAW IN</div>
          {potType === 'small' ? (
            <Countdown
              date={deadlines.small}
              onComplete={() => setDeadlines(prev => ({
                ...prev,
                small: prev.small + HOUR_MS
              }))}
              renderer={({ hours, minutes, seconds, completed }) => (
                <div className="timer-display">
                  {completed ? '🎉 Drawing Winner...' : 
                    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                  }
                </div>
              )}
            />
          ) : (
            <Countdown
              date={deadlines.big}
              onComplete={() => setDeadlines(prev => ({
                ...prev,
                big: prev.big + WEEK_MS
              }))}
              renderer={({ days, hours, minutes, seconds, completed }) => (
                <div className="timer-display">
                  {completed ? '🎉 Drawing Winner...' : 
                    `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                  }
                </div>
              )}
            />
          )}
        </div>
  
        {/* Entry Form */}
        <div className="entry-form">
          <div className="amount-input">
            <input
              type="text"
              inputMode="decimal"
              pattern="^\d*(\.\d{0,9})?$"
              placeholder="0.00"
              value={amount}
              onChange={e => {
                const v = e.target.value;
                if (/^\d*(\.\d{0,9})?$/.test(v)) setAmount(v);
              }}
            />
            <div className="sol-label">SOL</div>
          </div>
          <button
            onClick={enter}
            className="enter-button"
          >
            Enter Draw
          </button>
        </div>
  
        {/* Participants Section */}
        <div>
          <div className="participants-header">
            <h3 className="participants-title">Participants</h3>
            <div className="participants-count">({participants.length})</div>
          </div>
          
          <div className="participants-list">
            <AnimatePresence mode="popLayout">
              {participants.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty-state"
                >
                  No participants yet - be the first!
                </motion.div>
              ) : (
                participants.map((p, i) => (
                  <motion.div
                    key={p.wallet + i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="participant-card"
                  >
                    <div className="participant-wallet">
                      {p.wallet.slice(0, 4)}...{p.wallet.slice(-4)}
                    </div>
                    <div className="participant-amount">
                      {p.amount.toFixed(2)} SOL
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  
      {/* Info Footer */}
      <div className="info-footer">
        <p>All draws are conducted transparently on-chain</p>
        <p>Admin fee: 2% | Platform fee: 1%</p>
      </div>
    </motion.div>
  );
}

export default Lottery;
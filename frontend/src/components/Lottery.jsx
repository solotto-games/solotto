import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Countdown from "react-countdown";

const HOUR_MS = 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * HOUR_MS;
const LOTTO_TOKEN_MINT = new PublicKey('879Ga97qGKc5wdKjUScC7oH16yockWYfSxu8XBbybonk');
const adminPublicKey = new PublicKey("EhQewZWWVA1jqZqNpAGCDLamh3cAD5nqMefWkfuffdNq");

// Helper functions
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

function getNextHourUTC() {
  return Math.ceil(Date.now() / HOUR_MS) * HOUR_MS;
}

function getNextMondayUTC() {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilMon = (8 - day) % 7;
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + daysUntilMon,
    0, 0, 0, 0
  )).getTime();
}

function useLottoBalance() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [hasLotto, setHasLotto] = useState(false);

  useEffect(() => {
    const checkLottoBalance = async () => {
      if (!publicKey) return;
      try {
        const accounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: LOTTO_TOKEN_MINT
        });
        setHasLotto(accounts.value.some(account => 
          account.account.data.parsed.info.tokenAmount.uiAmount > 0
        ));
      } catch (error) {
        console.error('Error checking $LOTTO balance:', error);
      }
    };
    checkLottoBalance();
  }, [publicKey, connection]);

  return hasLotto;
}

function Lottery() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [deadlines, setDeadlines] = useState({
    small: getNextHourUTC(),
    big: getNextMondayUTC()
  });
  const [amount, setAmount] = useState('');
  const [potType, setPotType] = useState('small');
  const [participants, setParticipants] = useState([]);
  const [totalPot, setTotalPot] = useState(0);
  const [recentWinners, setRecentWinners] = useState([]);
  const hasLotto = useLottoBalance();

  useEffect(() => {
    const fetchParticipants = () => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/participants/${potType}`)
        .then(res => {
          setParticipants(res.data);
          setTotalPot(res.data.reduce((sum, p) => sum + p.amount, 0));
        })
        .catch(console.error);
    };

    const fetchWinners = () => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/history/${potType}`)
        .then(res => setRecentWinners(res.data.slice(0, 3)))
        .catch(console.error);
    };

    fetchParticipants();
    fetchWinners();
    const iv = setInterval(fetchParticipants, 5000);
    return () => clearInterval(iv);
  }, [potType]);

  const enter = async () => {
    try {
      if (!publicKey) return alert("Connect wallet first.");
      if (!amount) return alert("Enter amount.");
      
      const enterButton = document.querySelector('.enter-button');
      enterButton.disabled = true;
      enterButton.textContent = 'Processing...';

      const effectiveAmount = hasLotto ? amount * 1.3 : amount;
      const lamports = Math.floor(parseFloat(effectiveAmount) * 1e9);
      
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: adminPublicKey,
          lamports,
        })
      );
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      const confirmation = await connection.confirmTransaction(sig, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/enter`, {
        wallet: publicKey.toBase58(),
        amount: parseFloat(amount),
        effectiveAmount: parseFloat(effectiveAmount),
        pot: potType,
        tx: sig,
        hasLotto
      });

      if (!response.data.ok) {
        throw new Error('Backend validation failed');
      }

      setAmount('');
      toast.success(`🚀 Successfully entered! ${hasLotto ? '(1.3x $LOTTO boost applied!)' : ''}`);
    } catch (err) {
      console.error("❌ Entry failed:", err);
      toast.error(`Entry failed: ${err.message}`);
    } finally {
      const enterButton = document.querySelector('.enter-button');
      if (enterButton) {
        enterButton.disabled = false;
        enterButton.textContent = 'Enter Draw';
      }
    }
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
      <div className="lottery-header">
        <div className="header-content">
          <img src="/logo.png" alt="Solana" className="header-logo" />
        </div>
        <p className="header-subtitle">
          Decentralized, transparent lottery powered by Solana
        </p>
      </div>

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
  
        {/* Pot Total Display */}
        <div className="pot-total-display">
          Current Pot: {totalPot.toFixed(2)} SOL
        </div>

        {/* Countdown Timer */}
        <div className="timer-container">
          <div className="timer-label">NEXT DRAW IN</div>
          <Countdown
            date={potType === 'small' ? deadlines.small : deadlines.big}
            onComplete={async () => {
              setDeadlines(prev => ({
                ...prev,
                [potType]: potType === 'small' ? getNextHourUTC() : getNextMondayUTC()
              }));

              let attempts = 0;
              const checkWinner = async () => {
                try {
                  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/last-winner/${potType}`);
                  
                  if (res.data.ok) {
                    toast.success(
                      <div onClick={() => copyToClipboard(res.data.winner)} style={{ cursor: 'pointer' }}>
                        🎉 Winner: {res.data.winner.slice(0, 4)}...{res.data.winner.slice(-4)} 
                        <br />Won: {res.data.pot} SOL
                        <br />TX: {res.data.tx.slice(0, 4)}...{res.data.tx.slice(-4)}
                        <br /><small>(Click to copy address)</small>
                      </div>,
                      { duration: 10000, style: { background: '#333', color: '#fff', padding: '16px', borderRadius: '8px' } }
                    );
                  } else if (attempts < 3) {
                    attempts++;
                    setTimeout(checkWinner, 2000);
                  } else {
                    toast('No winner this round (no participants)');
                  }
                } catch (err) {
                  console.error('Error fetching winner:', err);
                  if (attempts < 3) {
                    attempts++;
                    setTimeout(checkWinner, 2000);
                  } else {
                    toast.error('Failed to fetch winner details.');
                  }
                }
              };
              setTimeout(checkWinner, 3000);
            }}
            renderer={({ days, hours, minutes, seconds, completed }) => (
              <div className="timer-display">
                {completed ? '🎉 Drawing Winner...' :
                  potType === 'small'
                    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                    : `${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
                }
              </div>
            )}
          />
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
          <button onClick={enter} className="enter-button">
            Enter Draw
          </button>
          {hasLotto && (
            <div className="lotto-boost-banner">
              🚀 1.3x $LOTTO boost active!
            </div>
          )}
        </div>

        {/* Recent Winners */}
        <div className="recent-winners">
          <h3>Recent Winners</h3>
          {recentWinners.length > 0 ? (
            recentWinners.map((winner, i) => (
              <div key={i} className="winner-card">
                <a 
                  href={`https://solscan.io/account/${winner.winner}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {winner.winner.slice(0, 4)}...{winner.winner.slice(-4)}
                </a>
                <div>{winner.pot} SOL</div>
                <div>{new Date(winner.time).toLocaleString()}</div>
              </div>
            ))
          ) : (
            <div className="empty-winners">No recent winners yet</div>
          )}
        </div>
  
        {/* Participants Section */}
        <div className="participants-section">
          <div className="participants-header">
            <h3>Participants ({participants.length})</h3>
            <div>Total Pot: {totalPot.toFixed(2)} SOL</div>
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
                participants.map((p, i) => {
                  const odds = totalPot > 0 ? (p.amount / totalPot) * 100 : 0;
                  return (
                    <motion.div
                      key={p.wallet + i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="participant-card"
                    >
                      <a 
                        href={`https://solscan.io/account/${p.wallet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="participant-wallet"
                      >
                        {p.wallet.slice(0, 4)}...{p.wallet.slice(-4)}
                      </a>
                      <div className="participant-details">
                        <div className="participant-amount">
                          {p.amount.toFixed(2)} SOL
                        </div>
                        <div className="participant-odds">
                          ~{odds.toFixed(1)}% chance
                        </div>
                        {p.hasLotto && <div className="lotto-indicator">🎫</div>}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
  
      <div className="info-footer">
        <p>All draws are conducted transparently on-chain</p>
        <p>Admin fee: 2% | Platform fee: 1%</p>
      </div>
    </motion.div>
  );
}

export default Lottery;
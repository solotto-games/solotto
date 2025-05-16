import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import Countdown from "react-countdown";

const MINUTE_MS = 60 * 1000;
const LOTTO_TOKEN_MINT = new PublicKey('6TEeFC8GpVwMEEmY5usUN6sKZD7pHsxYmMVUuahspump');
const adminPublicKey = new PublicKey("EhQewZWWVA1jqZqNpAGCDLamh3cAD5nqMefWkfuffdNq");

// Helper functions
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

function getNextDrawUTC() {
  return Math.ceil(Date.now() / (10 * MINUTE_MS)) * (10 * MINUTE_MS);
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
  const [deadline, setDeadline] = useState(getNextDrawUTC());
  const [amount, setAmount] = useState('');
  const [participants, setParticipants] = useState([]);
  const [totalPot, setTotalPot] = useState(0);
  const [recentWinners, setRecentWinners] = useState([]);
  const [lastWinnerAddress, setLastWinnerAddress] = useState(null);
  const hasLotto = useLottoBalance();
  const fetchWinners = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/history/main`)
      .then(res => setRecentWinners(res.data.slice(0, 3)))
      .catch(console.error);
  };

  useEffect(() => {
  const fetchParticipants = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/participants/main`)
      .then(res => {
        setParticipants(res.data);
        setTotalPot(res.data.reduce((sum, p) => sum + p.amount, 0));
      })
      .catch(console.error);
  };

  fetchParticipants();
  fetchWinners(); 
  const iv = setInterval(fetchParticipants, 5000);
  return () => clearInterval(iv);
}, []);


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
        pot: 'main',
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
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(m)}m ${pad(s)}s`;
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
          Rapid 10-minute draws powered by Solotto
        </p>
      </div>

      <div className="main-card">
        {/* Pot Total Display */}
        <div className="pot-total-display">
        </div>

        {/* Countdown Timer */}
        <div className="timer-container">
          <div className="timer-label">NEXT DRAW IN</div>
          <Countdown
  key={deadline} // 👈 this line is the main fix for timer getting stuck
  date={deadline}
  onComplete={() => {
    const next = getNextDrawUTC();
    setDeadline(next); // ✅ reset the timer

    let attempts = 0;
    const checkWinner = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/last-winner/main`);
        if (res.data.ok) {
          const newWinner = res.data.winner;
          if (newWinner !== lastWinnerAddress) {
            setLastWinnerAddress(newWinner);
            fetchWinners();
            toast.success(
              <div onClick={() => copyToClipboard(newWinner)} style={{ cursor: 'pointer' }}>
                🎉 Winner: {newWinner.slice(0, 4)}...{newWinner.slice(-4)}
                <br />Won: {res.data.pot} SOL
                <br />TX: {res.data.tx.slice(0, 4)}...{res.data.tx.slice(-4)}
                <br /><small>(Click to copy address)</small>
              </div>,
              {
                duration: 10000,
                style: {
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '8px'
                }
              }
            );
          } else if (attempts < 3) {
            attempts++;
            setTimeout(checkWinner, 2000);
          } else {
            toast('Waiting for new winner...');
          }
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
  renderer={({ minutes, seconds, completed }) => (
    <div className="timer-display">
      {completed ? '🎉 Drawing Winner...' : `${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`}
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
                  const odds = totalPot > 0 ? (p.effectiveAmount / totalPot) * 100 : 0;
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
        <div className="boost-info">
          How to boost your chances
          <div className="info-hint">
            <span className="info-icon">i</span>
            <div className="info-tooltip">
              <p>Your chances increase with:</p>
              <ul>
                <li>Higher SOL entries (your SOL ÷ total pot)</li>
                <li>1.3× multiplier when holding $LOTTO</li>
              </ul>
            </div>
          </div>
        </div>
        <p>Admin fee: 2% | Platform fee: 1%</p>
      </div>
    </motion.div>
  );
}

export default Lottery;
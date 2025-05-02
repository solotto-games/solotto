import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const STEPS = [
  {
    title: 'Step 1: Connect Your Wallet',
    content: 'To participate, connect your Solana wallet using the "Connect Wallet" button on the top right. Phantom, Solflare, and other major wallets are supported.'
  },
  {
    title: 'Step 2: Enter a Pot',
    content: 'Choose between the Hourly or Weekly pot. Send in SOL to enter. Your contribution acts as your ticket — the more SOL you contribute, the higher your chance of winning.'
  },
  {
    title: 'Step 3: Boost Your Odds with $LOTTO',
    content: 'If your wallet holds any amount of our native token $LOTTO, your entries are automatically given a 1.3x multiplier — effectively increasing your odds.'
  },
  {
    title: 'Step 4: Wait for the Draw',
    content: 'The Hourly Pot draws every 60 minutes. The Weekly Pot draws every 7 days. Winners are selected randomly, weighted by contribution size (and $LOTTO bonus if applicable).'
  },
  {
    title: 'Step 5: Claim Winnings',
    content: 'If you win, the prize SOL is automatically sent to your wallet — no claiming necessary. All transactions are handled transparently via smart contracts.'
  },
  {
    title: 'Transparency & Security',
    content: 'Solotto is built entirely on-chain. All entries, draws, and payouts are verifiable and open-source. We never custody your funds — you remain in full control at all times.'
  }
];

export default function HowItWorks() {
  return (
    <motion.div
      className="solotto-page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        lineHeight: '1.6',
      }}
      role="main"
      aria-label="How Solotto Works"
    >
      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          textAlign: 'center',
          background: 'linear-gradient(90deg, #00d4ff, #ff4d4d)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1.5rem',
        }}
      >
        How It Works
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}
      >
        Solotto is a decentralized jackpot system on Solana. It offers two recurring prize pools — the <strong style={{ color: '#ff4d4d' }}>Hourly Pot</strong> and the <strong style={{ color: '#ff4d4d' }}>Weekly Pot</strong> — designed for transparency, fairness, and fun.
      </motion.p>

      <motion.div variants={containerVariants}>
        {STEPS.map((step, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            style={{
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              borderLeft: '4px solid #00d4ff'
            }}
            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 212, 255, 0.2)' }}
          >
            <motion.h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#00d4ff',
                marginBottom: '0.75rem',
              }}
            >
              {step.title}
            </motion.h2>
            <motion.p style={{ fontSize: '1rem' }}>{step.content}</motion.p>
          </motion.div>
        ))}
      </motion.div>

      <motion.p
        variants={itemVariants}
        style={{
          fontSize: '1.1rem',
          textAlign: 'center',
          fontWeight: 500,
          background: 'linear-gradient(90deg, #00d4ff, #ff4d4d)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginTop: '1rem',
        }}
      >
        Ready to play? Connect your wallet and enter the next draw.
      </motion.p>
    </motion.div>
  );
}

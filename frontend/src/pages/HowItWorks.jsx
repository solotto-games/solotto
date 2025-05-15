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
    title: 'Step 2: Enter the Draw',
    content: 'Enter the next 10-minute jackpot by sending in any amount of SOL. Your contribution acts as your ticket — the more SOL you contribute, the higher your chance of winning.'
  },
  {
    title: 'Step 3: Boost Your Odds with $LOTTO',
    content: 'If your wallet holds any amount of our native token $LOTTO, your entries automatically receive a 1.3x multiplier — increasing your odds in each round.'
  },
  {
    title: 'Step 4: Wait for the Draw',
    content: 'A winner is selected every 10 minutes using secure and transparent on-chain logic. Your odds are based on your contribution size and $LOTTO bonus if applicable.'
  },
  {
    title: 'Step 5: Receive Winnings Instantly',
    content: 'If you win, the prize SOL is automatically sent to your wallet — no claiming needed. All transactions are handled by our smart contract system.'
  },
  {
    title: 'Transparency & Security',
    content: 'Solotto is built entirely on-chain. All entries, draws, and payouts are verifiable and open-source. We never custody your funds — you stay in control at all times.'
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
        Solotto is a decentralized jackpot system on Solana. Every 10 minutes, one lucky wallet wins the pot. It's fast, fair, and fully transparent.
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

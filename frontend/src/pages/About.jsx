import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FEATURES = [
  'Fully on-chain and transparent mechanics',
  'No registration or KYC required',
  'Rewards scaled to your contribution',
  '1.3x entry multiplier for $LOTTO holders',
];

export default function About() {
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
      aria-label="About Solotto"
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
        About Solotto
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}
      >
        <strong style={{ color: '#00d4ff' }}>SOLOTTO</strong> is a decentralized
        jackpot protocol built on Solana. Every 10 minutes, one lucky participant
        wins the entire SOL pot — fast, fair, and fully transparent.
      </motion.p>

      <motion.section variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#00d4ff',
            marginBottom: '1rem',
          }}
        >
          How It Works
        </h2>
        <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
          Simply enter the draw by contributing any amount of SOL. The more you
          contribute, the higher your chances of winning. A random winner is
          automatically selected every 10 minutes using secure on-chain mechanics.
        </p>
      </motion.section>

      <motion.section variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#00d4ff',
            marginBottom: '1rem',
          }}
        >
          Boost Your Odds with $LOTTO
        </h2>
        <p style={{ fontSize: '1rem' }}>
          Holding any amount of <strong style={{ color: '#ff4d4d' }}>$LOTTO</strong> gives you a{' '}
          <strong style={{ color: '#00d4ff' }}>1.3x multiplier</strong> on your entries,
          helping loyal holders increase their odds in every round.
        </p>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#00d4ff',
            marginBottom: '1rem',
          }}
        >
          Why Solotto?
        </h2>
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {FEATURES.map((feature, index) => (
            <motion.li
              key={index}
              variants={itemVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                gap: '0.5rem',
              }}
              whileHover={{ scale: 1.02, color: '#00d4ff' }}
            >
              <span style={{ color: '#00d4ff', fontSize: '1.2rem' }}>✅</span>
              {feature}
            </motion.li>
          ))}
        </ul>
      </motion.section>

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
        }}
      >
        Compete every 10 minutes for the prize pool — powered by Solana’s lightning-fast blockchain.
      </motion.p>
    </motion.div>
  );
}

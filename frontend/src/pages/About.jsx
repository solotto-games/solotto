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
  'Extra incentives for $LOTTO token holders',
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
        jackpot protocol built on the Solana blockchain. It offers a fair,
        transparent, and engaging way to win rewards through two rotating prize
        pools: the <strong style={{ color: '#ff4d4d' }}>Hourly Pot</strong> and
        the <strong style={{ color: '#ff4d4d' }}>Weekly Pot</strong>.
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
          Users participate by contributing SOL to one or both jackpot pools. Each
          contribution acts as a ticket — the more SOL you commit, the higher your
          chance of winning. Winners are randomly drawn at the end of each round
          using Solana’s secure, on-chain mechanics.
        </p>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#e0e0e0',
              marginBottom: '0.5rem',
            }}
          >
            🔹 Hourly Pot
          </h3>
          <p style={{ fontSize: '1rem' }}>
            The Hourly Pot draws every 60 minutes. All users who enter within the
            hour are eligible, with one wallet randomly selected to claim the
            entire SOL balance.
          </p>
        </div>

        <div>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#e0e0e0',
              marginBottom: '0.5rem',
            }}
          >
            🔸 Weekly Pot
          </h3>
          <p style={{ fontSize: '1rem' }}>
            The Weekly Pot accumulates entries over 7 days, offering larger
            rewards. A single winner is drawn weekly, claiming the full pot.
          </p>
        </div>
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
          Solotto’s native token, <strong style={{ color: '#ff4d4d' }}>$LOTTO</strong>,
          supercharges your entries. Holding any amount of $LOTTO grants a{' '}
          <strong style={{ color: '#00d4ff' }}>1.3x multiplier</strong> on all your
          entries, giving dedicated community members a competitive edge in both
          pots.
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
        Join thousands of users competing for hourly and weekly rewards — powered
        by Solana’s lightning-fast blockchain.
      </motion.p>
    </motion.div>
  );
}

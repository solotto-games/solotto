import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FAQ_ITEMS = [
  {
    question: 'How do I enter the jackpot?',
    answer: 'Just connect your wallet and enter with any amount of SOL. Your contribution automatically counts as an entry for the next 10-minute draw.'
  },
  {
    question: 'How are winners chosen?',
    answer: 'Every 10 minutes, one winner is selected at random. The more SOL you contribute, the higher your odds — but everyone has a chance to win.'
  },
  {
    question: 'How often does the draw happen?',
    answer: 'Solotto draws a winner every 10 minutes, 24/7. No waiting around — rapid rounds mean constant chances to win.'
  },
  {
    question: 'What is $LOTTO and how does it affect my odds?',
    answer: '$LOTTO is Solotto\'s native utility token. If your wallet holds any $LOTTO when entering, your entry gets a <strong>1.3× multiplier</strong>, increasing your chances of winning.'
  },
  {
    question: 'Is Solotto fully decentralized?',
    answer: 'Yes — all draws, entries, and payouts are executed via on-chain logic. Everything is transparent and verifiable on Solana.'
  },
  {
    question: 'Is there a minimum entry amount?',
    answer: 'Nope. You can enter with any amount of SOL — even a fraction. Everyone has a shot at winning.'
  },
  {
    question: 'Can I withdraw my entry if I don\'t win?',
    answer: 'No — once your SOL is entered, it goes into the prize pool. If you win, you take the whole pot. If not, your SOL supports the next round\'s rewards.'
  }
];

export default function FAQ() {
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
      aria-label="Frequently Asked Questions"
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
          marginBottom: '2rem',
        }}
      >
        Frequently Asked Questions
      </motion.h1>

      <motion.div variants={itemVariants}>
        {FAQ_ITEMS.map((item, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            style={{ marginBottom: '2rem' }}
            whileHover={{ x: 5 }}
          >
            <motion.h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#00d4ff',
                marginBottom: '0.5rem',
              }}
            >
              {item.question}
            </motion.h2>
            <motion.p 
              style={{ fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
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
          marginTop: '2rem',
        }}
      >
        Still have questions? Contact us on X!
      </motion.p>
    </motion.div>
  );
}

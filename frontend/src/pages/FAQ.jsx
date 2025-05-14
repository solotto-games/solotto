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
    question: 'How do I enter a jackpot?',
    answer: 'You can participate in either the hourly or weekly jackpot by sending SOL directly into the respective pot. Each SOL you contribute increases your chances of winning.'
  },
  {
    question: 'How are winners chosen?',
    answer: 'At the end of each round, a winner is randomly selected based on proportional SOL contributions. The more you contribute, the higher your odds — but every participant has a chance.'
  },
  {
    question: 'What is the difference between the Hourly and Weekly pots?',
    answer: 'The Hourly Pot draws a winner every 60 minutes with smaller, more frequent rewards. The Weekly Pot draws once every 7 days and typically holds a much larger prize pool.'
  },
  {
    question: 'What is $LOTTO and how does it affect my odds?',
    answer: '$LOTTO is Solotto\'s native utility token. If your wallet holds any $LOTTO during an entry, your ticket chances are multiplied automatically. This bonus applies to both pots.'
  },
  {
    question: 'Is Solotto fully decentralized?',
    answer: 'Yes — all jackpot logic is executed on-chain. Entries, draws, and payouts are handled by smart contracts, ensuring transparency and fairness.'
  },
  {
    question: 'Is there a minimum entry amount?',
answer: 'No, there is currently no minimum entry amount. You can enter with any amount of SOL.'
  },
  {
    question: 'Can I withdraw my entry if I don\'t win?',
    answer: 'No — once submitted, your SOL is committed to the pot. If you win, you receive the full prize pool. If not, the contribution supports future rewards.'
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

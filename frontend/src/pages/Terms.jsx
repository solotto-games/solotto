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

const TERMS_SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the SOLPOT platform ("SOLPOT", "we", "our", or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use SOLPOT.'
  },
  {
    title: '2. Eligibility',
    content: 'You must be at least 18 years old or the age of majority in your jurisdiction to use SOLPOT. By using the platform, you represent and warrant that you meet these eligibility requirements.'
  },
  {
    title: '3. Platform Description',
    content: 'SOLPOT is a decentralized application on the Solana blockchain that allows users to enter randomized jackpot pools by contributing SOL. The platform operates two types of jackpots: Hourly Pot (new winner every 60 minutes) and Weekly Pot (single winner every 7 days).'
  },
  {
    title: '4. Token Utility ($POT)',
    content: 'SOLPOT may offer utility features through its native token ($POT), such as increased odds of winning jackpots. Holding $POT does not guarantee winnings and is not an investment contract or financial security.'
  },
  {
    title: '5. No Refunds',
    content: 'All SOL contributed to SOLPOT pots are final. There are no refunds, withdrawals, or reversals once an entry has been submitted. Users participate at their own discretion and risk.'
  },
  {
    title: '6. No Custodial Services',
    content: 'SOLPOT does not custody or control your funds. All actions, including entries and payouts, are executed on-chain through smart contracts. You are solely responsible for the safety and management of your wallet and private keys.'
  },
  {
    title: '7. No Warranties',
    content: 'SOLPOT is provided "as is" and "as available" without warranties of any kind. We do not guarantee uptime, functionality, or fitness for a particular purpose. Use of the platform is at your own risk.'
  },
  {
    title: '8. Limitation of Liability',
    content: 'In no event shall SOLPOT, its team, affiliates, or contributors be liable for any direct, indirect, incidental, or consequential damages arising out of or related to the use of the platform.'
  },
  {
    title: '9. Jurisdiction & Compliance',
    content: 'You are solely responsible for ensuring that your use of SOLPOT complies with all applicable laws and regulations in your jurisdiction. SOLPOT does not operate in or target any specific regulatory environment.'
  },
  {
    title: '10. Changes to Terms',
    content: 'We reserve the right to update or modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.'
  },
  {
    title: '11. Contact',
    content: 'If you have questions about these Terms, you can contact us on X or at <a href="mailto:help@solpot.fun">help@solpot.fun</a>.'
  }
];

export default function Terms() {
  return (
    <motion.div
      className="sop-page-container"
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
      aria-label="Terms of Service"
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
        Terms of Service
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}
      >
        <strong style={{ color: '#00d4ff' }}>Effective Date:</strong> {new Date().getFullYear()}
      </motion.p>

      <motion.div variants={containerVariants}>
        {TERMS_SECTIONS.map((section, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
            style={{ marginBottom: '2rem' }}
          >
            <motion.h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#00d4ff',
                marginBottom: '0.75rem',
              }}
            >
              {section.title}
            </motion.h2>
            <motion.p 
              style={{ fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
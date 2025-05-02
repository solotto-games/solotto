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

const PRIVACY_SECTIONS = [
  {
    title: '1. Introduction',
    content: 'SOLOTTO ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect information when you interact with our decentralized application ("the platform").'
  },
  {
    title: '2. Information We Collect',
    content: 'SOLOTTO is a non-custodial, decentralized platform. We do not collect, store, or process any personal data tied to your identity, including names, addresses, government IDs, or private wallet keys.'
  },
  {
    title: '3. How We Use Information',
    content: 'We use on-chain wallet addresses strictly to manage game functionality such as jackpot entries and prize distributions. Voluntarily submitted emails are used only for responding to user inquiries.'
  },
  {
    title: '4. Third-Party Services',
    content: 'SOLOTTO may use third-party services for analytics, transaction processing, or hosting. These services may have their own privacy policies. We encourage users to review them independently.'
  },
  {
    title: '5. Cookies and Tracking',
    content: 'SOLOTTO does not directly use cookies or tracking technologies. However, external services such as hosting providers or analytics platforms may use cookies as part of their normal operations.'
  },
  {
    title: '6. Security',
    content: 'While we implement reasonable security measures, blockchain interactions inherently carry risk. Always verify that you are interacting with the correct SOLOTTO domain and smart contracts.'
  },
  {
    title: '7. Your Rights',
    content: 'As SOLOTTO does not retain personally identifiable information by default, there is generally no personal data to modify or delete. However, you can always contact us if you have questions about your data.'
  },
  {
    title: '8. Changes to This Policy',
    content: 'We may update this Privacy Policy from time to time. Continued use of SOLOTTO after changes are published constitutes acceptance of the new terms.'
  },
  {
    title: '9. Contact Us',
    content: 'If you have any questions regarding this Privacy Policy, please contact us on X or at <a href="mailto:help@solotto.fun">help@solotto.fun</a>.'
  }
];

export default function Privacy() {
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
      aria-label="Privacy Policy"
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
        Privacy Policy
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{ fontSize: '1.1rem', marginBottom: '2rem', textAlign: 'center' }}
      >
        <strong style={{ color: '#00d4ff' }}>Effective Date:</strong> {new Date().getFullYear()}
      </motion.p>

      <motion.div variants={containerVariants}>
        {PRIVACY_SECTIONS.map((section, index) => (
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

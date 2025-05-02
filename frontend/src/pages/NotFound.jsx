import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6 }
  },
  exit: { opacity: 0 }
};

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export default function NotFound() {
  return (
    <motion.div
      className="solotto-page-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        textAlign: 'center',
      }}
    >
      <motion.h1
        variants={textVariants}
        style={{
          fontSize: '6rem',
          fontWeight: 800,
          marginBottom: '1rem',
          background: 'linear-gradient(90deg, #ff4d4d, #00d4ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        404
      </motion.h1>
      
      <motion.p
        variants={textVariants}
        style={{
          fontSize: '1.8rem',
          marginBottom: '2rem',
          maxWidth: '600px',
        }}
      >
        Uh-oh! That page doesn’t exist in the Solotto universe.
      </motion.p>
      
      <motion.div variants={textVariants}>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.75rem',
            background: 'linear-gradient(135deg, #00d4ff, #ff4d4d)',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 'bold',
            textDecoration: 'none',
            fontSize: '1.1rem',
            boxShadow: '0 4px 12px rgba(0, 212, 255, 0.3)',
          }}
        >
          Back to the Lotto
        </Link>
      </motion.div>
    </motion.div>
  );
}

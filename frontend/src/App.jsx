import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import Lottery from './components/Lottery';
import ParticlesBackground from './components/ParticlesBackground';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

import About from './pages/About';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

import './index.css';

export default function App() {
  return (
    <div className="app-wrapper" style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      isolation: 'isolate'
    }}>
      {/* 🌌 Neon Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        background: 'radial-gradient(circle at 50% 50%, #0a001a 0%, #12002e 60%, #1a003d 100%)'
      }} />

      <ParticlesBackground particleDensity={150} />

      {/* ✨ Pulsing Grid */}
      <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: `repeating-linear-gradient(
          90deg,
          rgba(0,255,255,0.05) 0px,
          rgba(0,255,255,0.05) 10px,
          transparent 10px,
          transparent 20px
        )`,
        pointerEvents: 'none',
        zIndex: -1,
        animation: 'pulseGrid 5s ease-in-out infinite'
      }} />

      <Navbar />

      <main className="app-main" style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '4rem 2rem',
        perspective: '1200px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          style={{
            width: '100%',
            maxWidth: '900px',
            background: 'linear-gradient(135deg, rgba(45,3,59,0.9) 0%, rgba(16,13,46,0.95) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            boxShadow: `
              0 0 60px rgba(255,0,255,0.4),
              0 0 120px rgba(0,255,255,0.3),
              0 0 180px rgba(255,120,0,0.2)
            `,
            border: '1px solid rgba(255,255,255,0.1)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '16px',
            boxShadow: 'inset 0 0 40px rgba(255,0,255,0.3), inset 0 0 80px rgba(0,255,255,0.2)',
            pointerEvents: 'none'
          }} />

          {/* 🌐 Dynamic Routing Here */}
          <Routes>
            <Route path="/" element={<Lottery />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>

        {/* ✨ Glow Field */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140%',
          height: '140%',
          background: `radial-gradient(circle at center, rgba(255,0,255,0.2) 0%, transparent 80%)`,
          pointerEvents: 'none',
          zIndex: -1
        }} />
      </main>

      <Footer />

      <Toaster position="top-center" toastOptions={{
        style: {
          background: 'linear-gradient(152deg, #300040 0%, #1a1a2e 100%)',
          color: '#00ffdd',
          border: '1px solid rgba(255,0,255,0.8)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 10px 40px rgba(0,255,255,0.3)'
        }
      }} />

      <style>{`
        @keyframes pulseGrid {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}

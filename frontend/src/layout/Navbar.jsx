import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="solotto-navbar">
      {/* Left Side: Logo */}
      <Link to="/" className="solotto-navbar__logo">
        <img
          src="/logo.png"
          alt="Solotto Logo"
          className="solotto-navbar__logo-img"
        />
        <span>SOLOTTO</span>
      </Link>

      {/* Center: Nav Links */}
      <div className="solotto-navbar__links">
        <Link to="/about">About</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/how-it-works">How it Works</Link>
        <a href="https://pump.fun/board" target="_blank" rel="noopener noreferrer">Pump.fun</a>
      </div>

      {/* Right Side: Wallet Connect */}
      <WalletMultiButton className="solotto-navbar__button" />
    </nav>
  );
}

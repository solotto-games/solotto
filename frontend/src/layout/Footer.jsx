import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const CA = "Soon";

  const handleCopy = () => {
    navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="solotto-footer">
      <div className="solotto-footer__content" style={{ position: 'relative' }}>
        {/* Left: Branding */}
        <div className="solotto-footer__left">
          <img src="/logo.png" alt="Solotto Logo" className="solotto-footer__logo" />
          <span>© {new Date().getFullYear()} Solotto. All rights reserved.</span>
        </div>

        {/* Center: Navigation */}
        <div className="solotto-footer__center">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <a
            href="https://twitter.com/messages/compose?recipient_id=1906782498144813056"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </div>

        {/* Right: Socials */}
        <div className="solotto-footer__right">
          <a href="https://x.com/solotto_onsol" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://github.com/solotto-games/solotto" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>

        {/* Far Right: Copy Button */}
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Click to copy"}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '13px',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
        >
{copied ? "Copied!" : CA === "Soon" ? "CA: Soon" : `CA: ${CA.slice(0, 4)}...${CA.slice(-4)}`}
         </button>
      </div>
    </footer>
  );
}

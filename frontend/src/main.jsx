import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '@solana/wallet-adapter-react-ui/styles.css';
import './index.css';

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

import { BrowserRouter } from 'react-router-dom'; // 👈 ADD THIS

const endpoint = import.meta.env.VITE_SOLANA_CLUSTER_URL;
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <BrowserRouter> {/* ✅ WRAPS THE ENTIRE APP */}
          <App />
        </BrowserRouter>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

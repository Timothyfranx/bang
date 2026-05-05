'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { generateSessionKeypair, saveSessionKeypair, getSessionKeypair, clearSessionKeypair } from '@/lib/solana/wallet';
import toast from 'react-hot-toast';

interface SessionContextType {
  isActive: boolean;
  sessionKeypair: Keypair | null;
  budget: number;
  startSession: (budgetInUsd: number) => Promise<void>;
  endSession: () => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [isActive, setIsActive] = useState(false);
  const [sessionKeypair, setSessionKeypair] = useState<Keypair | null>(null);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);

  // Restore session on mount
  useEffect(() => {
    if (publicKey) {
      const keypair = getSessionKeypair(publicKey.toBase58());
      if (keypair) {
        setTimeout(() => {
          setSessionKeypair(keypair);
          setIsActive(true);
        }, 0);
      }
    }
  }, [publicKey]);

  const startSession = useCallback(async (budgetInUsd: number) => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      // 1. Generate session keypair
      const keypair = generateSessionKeypair();
      
      // 2. Calculate SOL amount from USD budget
      const solPriceResponse = await fetch('/api/price');
      if (!solPriceResponse.ok) {
        throw new Error('Failed to fetch current SOL price');
      }
      const solPriceData = await solPriceResponse.json();
      const solAmount = budgetInUsd / solPriceData.price;
      const lamports = Math.floor(solAmount * 1_000_000_000);

      // 3. Get Swap/Funding transaction from API
      const SOL_MINT = 'So11111111111111111111111111111111111111112';
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputMint: SOL_MINT,
          outputMint: SOL_MINT,
          amount: lamports,
          userPublicKey: publicKey.toBase58(),
          destinationWallet: keypair.publicKey.toBase58()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Funding failed with status ${response.status}`);
      }
      const data = await response.json();

      // 4. Sign and send transaction
      const swapTransactionBuf = Buffer.from(data.swapResponse.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      const signedTransaction = await signTransaction(transaction);
      const txid = await connection.sendRawTransaction(signedTransaction.serialize());
      
      await connection.confirmTransaction(txid);
      
      // 5. Save session state
      saveSessionKeypair(keypair, publicKey.toBase58());
      setSessionKeypair(keypair);
      setBudget(budgetInUsd);
      setIsActive(true);
      
      toast.success('Session started successfully!');
    } catch (err) {
      console.error('Failed to start session', err);
      toast.error(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setLoading(false);
    }
  }, [publicKey, signTransaction, connection]);

  const endSession = useCallback(() => {
    clearSessionKeypair();
    setSessionKeypair(null);
    setIsActive(false);
    setBudget(0);
    toast.success('Session ended');
  }, []);

  return (
    <SessionContext.Provider value={{ isActive, sessionKeypair, budget, startSession, endSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

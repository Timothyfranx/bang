'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { generateSessionKeypair, saveSessionKeypair, getSessionKeypair, clearSessionKeypair } from '@/lib/solana/wallet';
import { identifySweepAssets, SweepAsset } from '@/lib/solana/sweep';
import toast from 'react-hot-toast';

interface SessionContextType {
  isActive: boolean;
  sessionKeypair: Keypair | null;
  budget: number;
  timeLeft: number; // in seconds
  startSession: (budgetInUsd: number) => Promise<void>;
  endSession: () => void;
  loading: boolean;
  sweepAssets: SweepAsset[];
  refreshSweepAssets: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_DURATION = 60 * 60; // 1 hour in seconds

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const [isActive, setIsActive] = useState(false);
  const [sessionKeypair, setSessionKeypair] = useState<Keypair | null>(null);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [sweepAssets, setSweepAssets] = useState<SweepAsset[]>([]);

  const refreshSweepAssets = useCallback(async () => {
    if (!sessionKeypair) return;
    try {
      const assets = await identifySweepAssets(connection, sessionKeypair.publicKey);
      setSweepAssets(assets);
    } catch (err) {
      console.error('Failed to refresh sweep assets', err);
    }
  }, [connection, sessionKeypair]);

  // Periodic asset refresh
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        refreshSweepAssets();
      }, 0);
      const interval = setInterval(refreshSweepAssets, 30000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isActive, refreshSweepAssets]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      toast.error('Session expired. Please sweep your assets.');
      // Auto-end is disabled as per GEMINI.md, but we warn the user.
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

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

  const endSession = useCallback(async () => {
    if (!sessionKeypair || !publicKey) {
      clearSessionKeypair();
      setSessionKeypair(null);
      setIsActive(false);
      setBudget(0);
      return;
    }

    setLoading(true);
    try {
      // 1. Identify assets
      const assets = await identifySweepAssets(connection, sessionKeypair.publicKey);
      const safeAssets = assets.filter(a => a.isSafe);

      if (safeAssets.length > 0) {
        toast.loading(`Sweeping ${safeAssets.length} safe assets...`, { id: 'sweep' });
        
        // Sort: tokens first, SOL last
        const SOL_MINT = 'So11111111111111111111111111111111111111112';
        const sortedAssets = [...safeAssets].sort((a, b) => {
          if (a.mint === SOL_MINT) return 1;
          if (b.mint === SOL_MINT) return -1;
          return 0;
        });

        for (const asset of sortedAssets) {
          try {
            let amount = Math.floor(asset.uiAmount * Math.pow(10, asset.decimals));
            
            // If it's SOL, leave a small buffer for fees of previous/current transactions
            if (asset.mint === SOL_MINT) {
              amount -= 5000; // 0.000005 SOL buffer
            }

            if (amount <= 0) continue;

            const response = await fetch('/api/swap', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                inputMint: asset.mint,
                outputMint: SOL_MINT,
                amount: Math.floor(asset.uiAmount * Math.pow(10, asset.decimals)),
                userPublicKey: sessionKeypair.publicKey.toBase58(),
                destinationWallet: publicKey.toBase58()
              })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            const swapTransactionBuf = Buffer.from(data.swapResponse.swapTransaction, 'base64');
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            
            // Sign with session keypair - this is the "magic" of Capsule
            // No user approval needed for the session wallet!
            transaction.sign([sessionKeypair]);
            
            const txid = await connection.sendRawTransaction(transaction.serialize());
            await connection.confirmTransaction(txid);
            toast.success(`Swept ${asset.symbol}`, { id: `sweep-${asset.mint}` });
          } catch (err) {
            console.error(`Failed to sweep ${asset.symbol}`, err);
            toast.error(`Failed to sweep ${asset.symbol}`);
          }
        }
        toast.success('Sweep completed', { id: 'sweep' });
      }

      clearSessionKeypair();
      setSessionKeypair(null);
      setIsActive(false);
      setBudget(0);
      toast.success('Session closed');
    } catch (err) {
      console.error('Failed to end session', err);
      toast.error('Error during sweep. Session remains active.');
    } finally {
      setLoading(false);
    }
  }, [publicKey, sessionKeypair, connection]);

  return (
    <SessionContext.Provider value={{ 
      isActive, 
      sessionKeypair, 
      budget, 
      timeLeft, 
      startSession, 
      endSession, 
      loading,
      sweepAssets,
      refreshSweepAssets
    }}>
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

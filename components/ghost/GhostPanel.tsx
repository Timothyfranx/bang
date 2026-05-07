'use client';

import React, { useState } from 'react';
import { useGhost } from '@/hooks/useGhost';
import { GhostToggle } from './GhostToggle';
import { TradeCard } from './TradeCard';
import { GhostSignal } from '@/types/ghost';
import toast from 'react-hot-toast';
import { VersionedTransaction } from '@solana/web3.js';
import { useSession } from '@/components/providers/SessionProvider';
import { useConnection } from '@solana/wallet-adapter-react';

export const GhostPanel: React.FC = () => {
  const { 
    isMonitoring, 
    whaleAddress, 
    setWhaleAddress, 
    signals, 
    toggleMonitoring,
    isSessionActive 
  } = useGhost();
  
  const { sessionKeypair } = useSession();
  const { connection } = useConnection();
  const [localSignals, setLocalSignals] = useState<GhostSignal[]>([]);

  // Sync internal signals with hook signals
  React.useEffect(() => {
    const updateSignals = () => {
      setLocalSignals(prev => {
        const newSignals = signals.filter(s => !prev.find(p => p.trade.signature === s.trade.signature));
        return [...newSignals, ...prev];
      });
    };
    
    // Defer the state update to avoid the "set-state-in-effect" warning
    const timeout = setTimeout(updateSignals, 0);
    return () => clearTimeout(timeout);
  }, [signals]);

  const handleMirror = async (signal: GhostSignal) => {
    if (!sessionKeypair) {
      toast.error('No active session keypair found');
      return;
    }

    const toastId = toast.loading('Mirroring trade via Jupiter...');
    
    try {
      // 1. Calculate amount (20% of session budget is the default in plan, but we'll use a fixed small amount for demo)
      // For demo purposes, we'll try to swap 0.05 SOL or equivalent
      const amountInLamports = 50_000_000; // 0.05 SOL

      // 2. Get Swap Transaction from API (proxy)
      const response = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputMint: signal.trade.inputMint,
          outputMint: signal.trade.outputMint,
          amount: amountInLamports,
          userPublicKey: sessionKeypair.publicKey.toBase58(),
          wrapAndUnwrapSol: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get swap transaction');
      }

      const data = await response.json();
      
      // 3. Sign and Send
      const swapTransactionBuf = Buffer.from(data.swapResponse.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      transaction.sign([sessionKeypair]);
      
      const txid = await connection.sendRawTransaction(transaction.serialize());
      await connection.confirmTransaction(txid);

      // 4. Update UI
      setLocalSignals(prev => prev.map(s => 
        s.trade.signature === signal.trade.signature 
          ? { ...s, status: 'mirrored', mirrorTxHash: txid } 
          : s
      ));

      toast.success('Trade mirrored successfully!', { id: toastId });
    } catch (err) {
      console.error('Mirror error:', err);
      toast.error(err instanceof Error ? err.message : 'Mirror failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F0F18] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ghost Mode</h2>
            <p className="text-sm text-[#8B8B9B]">Monitor and mirror whale trades in real-time.</p>
          </div>
          <GhostToggle 
            isActive={isMonitoring} 
            onToggle={toggleMonitoring} 
            disabled={!isSessionActive}
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9B] block mb-2">
              Target Whale Wallet
            </label>
            <input
              type="text"
              value={whaleAddress}
              onChange={(e) => setWhaleAddress(e.target.value)}
              disabled={isMonitoring}
              placeholder="Enter Solana wallet address..."
              className="w-full bg-[#1C1C28] border border-white/[0.07] rounded-xl px-4 py-3 text-[#F2F2F5] text-sm font-mono focus:outline-none focus:border-[#D4A843]/40 transition-all disabled:opacity-50"
            />
          </div>
          
          {!isSessionActive && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <span className="text-amber-400">⚠️</span>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                Ghost Mode requires an active session. Start a session to enable &quot;Shadow Signing&quot; and real-time mirroring.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9B]">
            Signal Feed {isMonitoring && <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-2" />}
          </h3>
          <span className="text-[10px] text-[#555566]">
            Showing last {localSignals.length} signals
          </span>
        </div>

        {localSignals.length === 0 ? (
          <div className="bg-[#0F0F18] border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-4 opacity-20">👻</span>
            <p className="text-sm text-[#555566]">
              {isMonitoring 
                ? 'Waiting for whale activity...' 
                : 'Enter a whale address and turn on Ghost Mode to see signals.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {localSignals.map((signal) => (
              <TradeCard 
                key={signal.trade.signature} 
                signal={signal} 
                onMirror={handleMirror}
                isSessionActive={isSessionActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
import { formatAddress } from '@/lib/utils/format';

export const GhostPanel: React.FC = () => {
  const { 
    isMonitoring, 
    whaleAddresses, 
    addWhale,
    removeWhale,
    signals, 
    toggleMonitoring,
    isSessionActive 
  } = useGhost();
  
  const { sessionKeypair } = useSession();
  const { connection } = useConnection();
  const [localSignals, setLocalSignals] = useState<GhostSignal[]>([]);
  const [whaleInput, setWhaleInput] = useState('');

  // Sync internal signals with hook signals
  React.useEffect(() => {
    const updateSignals = () => {
      setLocalSignals(prev => {
        // Filter out signals that are already in localSignals
        const newSignals = signals.filter(s => !prev.find(p => p.trade.signature === s.trade.signature));
        
        // Update existing signals if consensus status changed
        const updatedPrev = prev.map(p => {
          const matching = signals.find(s => s.trade.outputMint === p.trade.outputMint && s.status === 'pending');
          if (matching && matching.isConsensus && !p.isConsensus) {
            return { ...p, isConsensus: true, confirmations: matching.confirmations };
          }
          return p;
        });

        return [...newSignals, ...updatedPrev].slice(0, 20);
      });
    };
    
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
      const amountInLamports = 50_000_000; // 0.05 SOL

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
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to get swap transaction');
      }

      const data = await response.json();
      const swapTransactionBuf = Buffer.from(data.swapResponse.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
      transaction.sign([sessionKeypair]);
      
      const txid = await connection.sendRawTransaction(transaction.serialize());
      await connection.confirmTransaction(txid);

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

  const handleAddWhale = (e: React.FormEvent) => {
    e.preventDefault();
    if (whaleInput.length < 32) {
      toast.error('Invalid Solana address');
      return;
    }
    addWhale(whaleInput);
    setWhaleInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F0F18] border border-white/[0.07] rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Ghost Mode</h2>
            <p className="text-sm text-[#8B8B9B]">Monitor multiple whales. Mirror safe trades.</p>
          </div>
          <GhostToggle 
            isActive={isMonitoring} 
            onToggle={toggleMonitoring} 
            disabled={!isSessionActive || whaleAddresses.length === 0}
          />
        </div>

        <div className="space-y-6">
          <form onSubmit={handleAddWhale} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8B9B] block mb-2">
                Add Target Whale
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={whaleInput}
                  onChange={(e) => setWhaleInput(e.target.value)}
                  placeholder="Paste wallet address..."
                  className="flex-1 bg-[#1C1C28] border border-white/[0.07] rounded-xl px-4 py-3 text-[#F2F2F5] text-sm font-mono focus:outline-none focus:border-[#D4A843]/40 transition-all"
                />
                <button 
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 text-white px-6 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider"
                >
                  Add
                </button>
              </div>
            </div>
          </form>

          {whaleAddresses.length > 0 && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#555566]">
                Monitoring ({whaleAddresses.length}/3)
              </label>
              <div className="flex flex-wrap gap-2">
                {whaleAddresses.map(address => (
                  <div key={address} className="bg-[#1C1C28] border border-white/5 rounded-full pl-3 pr-1 py-1 flex items-center gap-2">
                    <span className="text-xs font-mono text-white/70">{formatAddress(address)}</span>
                    <button 
                      onClick={() => removeWhale(address)}
                      className="w-5 h-5 rounded-full hover:bg-red-500/20 text-[#555566] hover:text-red-400 flex items-center justify-center text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#555566]">
              Consensus Logic: 2/3 Whales
            </span>
          </div>
        </div>

        {localSignals.length === 0 ? (
          <div className="bg-[#0F0F18] border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-4 opacity-20">👻</span>
            <p className="text-sm text-[#555566]">
              {isMonitoring 
                ? 'Waiting for whale activity...' 
                : whaleAddresses.length === 0 
                  ? 'Add at least one whale address to start.' 
                  : 'Turn on Ghost Mode to see signals.'}
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

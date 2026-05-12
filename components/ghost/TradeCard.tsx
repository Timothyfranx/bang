'use client';

import React from 'react';
import { GhostSignal } from '@/types/ghost';
import { formatAddress } from '@/lib/utils/format';

interface TradeCardProps {
  signal: GhostSignal;
  onMirror: (signal: GhostSignal) => void;
  isSessionActive: boolean;
}

export const TradeCard: React.FC<TradeCardProps> = ({ signal, onMirror, isSessionActive }) => {
  const { trade, risk, isConsensus, confirmations } = signal;
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'caution': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'danger': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-white/40 border-white/10 bg-white/5';
    }
  };

  return (
    <div className={`
      bg-[#0F0F18] border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden
      ${isConsensus ? 'border-[#D4A843] shadow-[0_0_32px_rgba(212,168,67,0.1)]' : 'border-white/[0.07]'}
      ${risk.level === 'safe' && !isConsensus ? 'border-green-500/20 shadow-[0_0_24px_rgba(34,197,94,0.04)]' : ''}
    `}>
      {isConsensus && (
        <div className="absolute top-0 right-0 bg-[#D4A843] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest animate-pulse">
          Consensus 🔥
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">{isConsensus ? '🔥' : '👻'}</span>
          <span className="text-sm font-medium text-white/90">
            Whale: <span className="font-mono text-[#D4A843]">{formatAddress(trade.walletAddress)}</span>
          </span>
        </div>
        <span className="text-xs text-[#8B8B9B]">
          {new Date(trade.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-xs text-[#8B8B9B] uppercase mb-1">Mirror Signal</span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono font-bold text-white">
              {trade.inputAmount.toFixed(3)} {trade.inputSymbol}
            </span>
            <span className="text-white/20 text-xl">→</span>
            <span className="text-xl font-mono font-bold text-[#D4A843]">
              {trade.outputAmount.toFixed(2)} {trade.outputSymbol}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <span className="text-[10px] text-[#8B8B9B] uppercase block mb-1">Price Impact</span>
          <span className={`text-sm font-mono font-semibold ${risk.priceImpact > 5 ? 'text-red-400' : 'text-green-400'}`}>
            {risk.priceImpact.toFixed(2)}%
          </span>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <span className="text-[10px] text-[#8B8B9B] uppercase block mb-1">Organic Score</span>
          <span className={`text-sm font-mono font-semibold ${risk.organicScore < 70 ? 'text-amber-400' : 'text-green-400'}`}>
            {risk.organicScore}/100
          </span>
        </div>
      </div>

      {confirmations && confirmations.length > 1 && (
        <div className="mb-6 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
          <span className="text-[10px] font-bold text-amber-400/80 uppercase block mb-2">Confirmed by Whales:</span>
          <div className="flex flex-wrap gap-2">
            {confirmations.map(addr => (
              <span key={addr} className="text-[10px] font-mono text-amber-200/60 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/10">
                {formatAddress(addr)}
              </span>
            ))}
          </div>
        </div>
      )}

      {risk.reasons.length > 0 && !isConsensus && (
        <div className="mb-6 space-y-1">
          {risk.reasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-red-400/80">
              <span className="w-1 h-1 rounded-full bg-red-400" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`
          flex-1 flex items-center justify-center py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest
          ${getRiskColor(risk.level)}
        `}>
          {isConsensus ? 'HIGH SIGNAL' : risk.level}
        </div>
        
        <button
          onClick={() => onMirror(signal)}
          disabled={!isSessionActive || signal.status === 'mirrored'}
          className={`
            flex-[2] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
            ${signal.status === 'mirrored'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-[#D4A843] text-black hover:bg-[#B8902E] shadow-lg shadow-[#D4A843]/10 disabled:opacity-40 disabled:cursor-not-allowed'
            }
          `}
        >
          {signal.status === 'mirrored' ? '✓ Executed' : 'Mirror Trade'}
        </button>
      </div>
      
      {signal.mirrorTxHash && (
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] text-[#555566] font-mono">TX: {formatAddress(signal.mirrorTxHash)}</span>
          <a 
            href={`https://solscan.io/tx/${signal.mirrorTxHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-[#D4A843] hover:underline"
          >
            View on Solscan ↗
          </a>
        </div>
      )}
    </div>
  );
};

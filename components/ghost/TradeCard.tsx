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
  const { trade, risk } = signal;
  
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
      bg-[#0F0F18] border rounded-2xl p-6 transition-all duration-300
      ${risk.level === 'safe' ? 'border-[#D4A843]/30 shadow-[0_0_24px_rgba(212,168,67,0.06)]' : 'border-white/[0.07]'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👻</span>
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
          <span className="text-xs text-[#8B8B9B] uppercase mb-1">Swapped</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold text-white">
              {trade.inputAmount.toFixed(4)} {trade.inputSymbol}
            </span>
            <span className="text-[#8B8B9B]">→</span>
            <span className="text-lg font-mono font-bold text-[#D4A843]">
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

      {risk.reasons.length > 0 && (
        <div className="mb-6 space-y-1">
          {risk.reasons.map((reason, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-red-400/80">
              <span>✕</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`
          flex-1 flex items-center justify-center py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider
          ${getRiskColor(risk.level)}
        `}>
          {risk.level}
        </div>
        
        <button
          onClick={() => onMirror(signal)}
          disabled={!isSessionActive || signal.status === 'mirrored'}
          className={`
            flex-[2] py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all
            ${signal.status === 'mirrored'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
              : 'bg-[#D4A843] text-black hover:bg-[#B8902E] disabled:opacity-40 disabled:cursor-not-allowed'
            }
          `}
        >
          {signal.status === 'mirrored' ? '✓ Mirrored' : 'Mirror Trade'}
        </button>
      </div>
    </div>
  );
};

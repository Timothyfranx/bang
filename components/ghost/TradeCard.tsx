'use client';

import { GhostSignal } from '@/types/ghost';
import { Badge } from '@/components/shared/Badge';
import { formatAddress } from '@/lib/utils/format';

interface TradeCardProps {
  signal: GhostSignal;
}

export function TradeCard({ signal }: TradeCardProps) {
  const { trade, risk } = signal;
  
  const isSafe = risk.level === 'safe';
  const isDanger = risk.level === 'danger';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 bg-[#16161F] ${
      isSafe ? 'border-green-500/20 hover:border-green-500/40' : 
      isDanger ? 'border-red-500/20 hover:border-red-500/40' : 
      'border-white/5 hover:border-white/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#D4A843]/10 flex items-center justify-center text-[10px] font-bold text-[#D4A843]">
            W
          </div>
          <span className="text-[10px] font-mono text-[#8B8B9B]">
            {formatAddress(trade.walletAddress)}
          </span>
          <span className="text-[10px] text-[#555566]">•</span>
          <span className="text-[10px] text-[#555566]">Just now</span>
        </div>
        <Badge variant={risk.level === 'safe' ? 'success' : risk.level === 'danger' ? 'error' : 'warning'}>
          {risk.level.toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-white">{trade.inputSymbol}</div>
          <div className="text-[#555566]">→</div>
          <div className="text-sm font-bold text-[#D4A843]">{trade.outputSymbol}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono font-bold text-white">
            {trade.inputAmount} {trade.inputSymbol}
          </div>
          <div className="text-[10px] text-[#555566]">
            ≈ {trade.outputAmount} {trade.outputSymbol}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[8px] font-bold text-[#555566] uppercase tracking-widest mb-1">Impact</div>
          <div className="text-[10px] font-mono font-bold text-white">{risk.priceImpact}%</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[8px] font-bold text-[#555566] uppercase tracking-widest mb-1">Score</div>
          <div className="text-[10px] font-mono font-bold text-white">{risk.organicScore}</div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-center">
          <div className="text-[8px] font-bold text-[#555566] uppercase tracking-widest mb-1">Liquidity</div>
          <div className="text-[10px] font-mono font-bold text-white">${(risk.liquidityUSD / 1000).toFixed(0)}k</div>
        </div>
      </div>

      <button 
        disabled={!isSafe}
        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
          isSafe 
            ? 'bg-[#D4A843] text-black hover:bg-[#C49833] active:scale-[0.98]' 
            : 'bg-white/5 text-[#555566] cursor-not-allowed'
        }`}
      >
        {isSafe ? 'Mirror Trade' : 'Risk Too High'}
      </button>

      {risk.reasons.length > 0 && !isSafe && (
        <div className="mt-3 space-y-1">
          {risk.reasons.map((reason, i) => (
            <div key={i} className="text-[9px] text-red-400/70 flex items-center gap-1">
              <span>•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

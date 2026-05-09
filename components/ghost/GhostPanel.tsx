'use client';

import { useState } from 'react';
import { useGhost } from '@/hooks/useGhost';
import { TradeCard } from './TradeCard';

export function GhostPanel() {
  const [whaleInput, setWhaleInput] = useState('');
  const [whales, setWhales] = useState<string[]>([]);
  const [isGhostActive, setIsGhostActive] = useState(false);
  const { signals } = useGhost(whales, isGhostActive);

  const addWhale = () => {
    if (!whaleInput || whales.includes(whaleInput)) return;
    setWhales(prev => [...prev, whaleInput]);
    setWhaleInput('');
  };

  const removeWhale = (address: string) => {
    setWhales(prev => prev.filter(a => a !== address));
  };

  return (
    <div className="bg-[#0F0F18] border border-white/[0.07] rounded-3xl overflow-hidden transition-all duration-500">
      {/* Header */}
      <div className="p-8 border-b border-white/[0.05] flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="text-2xl">👻</span>
            Ghost Mode
          </h3>
          <p className="text-xs text-[#8B8B9B] mt-1 font-medium uppercase tracking-widest">
            Autonomous Shadow Trading
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${isGhostActive ? 'text-[#D4A843]' : 'text-[#555566]'}`}>
              {isGhostActive ? 'Ghost Active' : 'Passive Mode'}
            </span>
            <button
              onClick={() => setIsGhostActive(!isGhostActive)}
              disabled={whales.length === 0}
              className={`
                relative w-14 h-7 rounded-full transition-all duration-300
                ${isGhostActive 
                  ? 'bg-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.2)]' 
                  : 'bg-[#1C1C28] border border-white/10 opacity-50'
                }
              `}
            >
              <div className={`
                absolute top-1 w-5 h-5 rounded-full transition-all duration-300
                ${isGhostActive ? 'left-8 bg-black' : 'left-1 bg-[#555566]'}
              `}/>
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Whale Inputs */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-[#555566] uppercase tracking-widest">
            Targets ({whales.length}/3)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={whaleInput}
              onChange={(e) => setWhaleInput(e.target.value)}
              placeholder="Enter whale wallet address..."
              className="flex-1 bg-[#1C1C28] border border-white/[0.07] rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-[#D4A843]/40 transition-colors"
            />
            <button
              onClick={addWhale}
              disabled={whales.length >= 3}
              className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all disabled:opacity-30"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {whales.map((address) => (
              <div key={address} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1C1C28] border border-white/10 rounded-lg group">
                <span className="text-[10px] font-mono text-[#8B8B9B]">
                  {address.slice(0, 4)}...{address.slice(-4)}
                </span>
                <button 
                  onClick={() => removeWhale(address)}
                  className="text-[#555566] hover:text-red-400 text-xs transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Signal Feed */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-[#555566] uppercase tracking-widest">
              Live Signals
            </label>
            {isGhostActive && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[#8B8B9B] uppercase tracking-widest">Polling Live</span>
              </div>
            )}
          </div>

          {whales.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-white/5 rounded-2xl">
              <p className="text-xs text-[#555566] font-medium uppercase tracking-[0.2em]">
                Add a target to begin shadow monitoring
              </p>
            </div>
          ) : signals.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#D4A843]/20 border-t-[#D4A843] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-[#8B8B9B] font-medium uppercase tracking-[0.2em]">
                Waiting for whale activity...
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {signals.map((signal) => (
                <TradeCard key={signal.trade.signature} signal={signal} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

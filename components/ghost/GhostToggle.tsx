'use client';

import React from 'react';

interface GhostToggleProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const GhostToggle: React.FC<GhostToggleProps> = ({ isActive, onToggle, disabled }) => {
  return (
    <div className="flex items-center gap-6 p-4 bg-black/40 border border-white/5 rounded-2xl shadow-inner">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566] mb-1">Mirror Logic</span>
        <span className={`text-xs font-mono font-bold transition-colors ${isActive ? 'text-[#D4A843]' : 'text-[#8B8B9B]'}`}>
          {isActive ? 'ACTIVE_SHADOW' : 'MONITOR_ONLY'}
        </span>
      </div>
      
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative w-20 h-10 rounded-lg transition-all duration-500
          ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
          ${isActive
            ? 'bg-[#1A1A1A] border-2 border-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.2)]'
            : 'bg-[#1A1A1A] border-2 border-[#333333]'
          }
        `}
      >
        <div className={`
          absolute top-1 w-8 h-6 rounded transition-all duration-500 flex items-center justify-center
          ${isActive
            ? 'left-10 bg-[#D4A843] shadow-[0_0_15px_rgba(212,168,67,0.5)]'
            : 'left-1 bg-[#333333]'
          }
        `}>
          <div className={`w-0.5 h-3 bg-black/20 mx-0.5 rounded-full`} />
          <div className={`w-0.5 h-3 bg-black/20 mx-0.5 rounded-full`} />
        </div>
      </button>
    </div>
  );
};

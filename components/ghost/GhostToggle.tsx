'use client';

import React from 'react';

interface GhostToggleProps {
  isActive: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const GhostToggle: React.FC<GhostToggleProps> = ({ isActive, onToggle, disabled }) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-[#8B8B9B]">Ghost Mode</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative w-16 h-8 rounded-full transition-all duration-300
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isActive
            ? 'bg-[#D4A843] shadow-[0_0_16px_rgba(212,168,67,0.4)]'
            : 'bg-[#1C1C28] border border-white/[0.07]'
          }
        `}
      >
        <div className={`
          absolute top-1 w-6 h-6 rounded-full transition-all duration-300
          ${isActive
            ? 'left-9 bg-black'
            : 'left-1 bg-[#555566]'
          }
        `}/>
      </button>
      <span className={`text-sm font-mono font-medium transition-colors
        ${isActive ? 'text-[#D4A843]' : 'text-[#555566]'}
      `}>
        {isActive ? 'ON' : 'OFF'}
      </span>
    </div>
  );
};

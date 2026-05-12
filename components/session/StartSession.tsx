'use client';

import { useState } from 'react';
import { useSession } from '@/components/providers/SessionProvider';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

export function StartSession() {
  const { startSession, loading } = useSession();
  const { priceData } = useJupiterPrice();
  const [budgetUsd, setBudgetUsd] = useState('10');

  const handleStart = async () => {
    const amount = parseFloat(budgetUsd);
    if (isNaN(amount) || amount <= 0) return;
    await startSession(amount);
  };

  const solEquivalent = priceData ? (parseFloat(budgetUsd) / priceData.price).toFixed(4) : '...';

  return (
    <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-2">New Session</h2>
      <p className="text-[#A1A1AA] mb-8 text-sm">
        Set a budget for your session. This amount will be transferred to a temporary isolation wallet.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
            Session Budget (USD)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
            <input
              type="number"
              value={budgetUsd}
              onChange={(e) => setBudgetUsd(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-8 pr-4 text-xl font-bold focus:outline-none focus:border-[#D4A843]/50 transition-colors"
              placeholder="0.00"
            />
          </div>
          <div className="mt-2 text-xs text-[#A1A1AA]">
            ≈ {solEquivalent} SOL
          </div>
        </div>

        <button
          onClick={handleStart}
          disabled={loading || !priceData}
          className="w-full bg-[#D4A843] text-black font-bold py-4 rounded-xl hover:bg-[#C49833] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Funding Wallet...
            </>
          ) : (
            'Start Session'
          )}
        </button>
      </div>
    </div>
  );
}

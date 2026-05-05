'use client';

import { useJupiterPrice } from '@/hooks/useJupiterPrice';
import { Badge } from '@/components/shared/Badge';

export default function Home() {
  const { priceData, loading, error } = useJupiterPrice();

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#111118] border border-white/[0.08] rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Capsule</h1>
        <p className="text-[#A1A1AA] mb-8">Session-based risk management for Solana</p>
        
        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-[#A1A1AA] uppercase tracking-wider font-semibold">
            Current SOL Price
          </div>
          
          {loading ? (
            <div className="animate-pulse text-2xl font-mono">Loading...</div>
          ) : error ? (
            <div className="text-red-400">{error}</div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-5xl font-bold text-[#D4A843]">
                ${priceData?.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <Badge variant="success">LIVE via Jupiter</Badge>
            </div>
          )}
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/[0.08]">
          <button className="w-full bg-[#D4A843] text-black font-semibold rounded-full px-6 py-4 hover:bg-[#C49833] transition-colors">
            Connect Wallet to Start
          </button>
        </div>
      </div>
    </main>
  );
}

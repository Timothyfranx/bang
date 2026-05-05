'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/layout/Navbar';
import { StartSession } from '@/components/session/StartSession';
import { SessionCard } from '@/components/session/SessionCard';
import { Badge } from '@/components/shared/Badge';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

export default function Home() {
  const { connected } = useWallet();
  const { isActive } = useSession();
  const { priceData, loading: priceLoading } = useJupiterPrice();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
        {!connected ? (
          <div className="max-w-2xl w-full text-center py-20">
            <h1 className="text-6xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              SECURE YOUR INTERACTION.
            </h1>
            <p className="text-xl text-[#A1A1AA] mb-12 max-w-lg mx-auto leading-relaxed">
              Capsule creates a session-based isolation layer for your Solana wallet. 
              Risk a budget, not your vault.
            </p>
            
            <div className="inline-flex flex-col items-center gap-6 p-8 bg-[#111118] border border-white/[0.08] rounded-3xl">
              <div className="text-sm text-[#A1A1AA] uppercase tracking-widest font-bold">
                Current SOL Price
              </div>
              {priceLoading ? (
                <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
              ) : (
                <div className="text-4xl font-bold text-[#D4A843]">
                  ${priceData?.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              )}
              <Badge variant="success">LIVE via Jupiter</Badge>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-8 py-10">
            {isActive ? (
              <SessionCard />
            ) : (
              <StartSession />
            )}
            
            <div className="max-w-md w-full grid grid-cols-2 gap-4">
              <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="text-[#D4A843] mb-2">🛡️</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Isolation</div>
                <div className="text-sm font-medium">L3 Security</div>
              </div>
              <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="text-[#D4A843] mb-2">⚡</div>
                <div className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-1">Execution</div>
                <div className="text-sm font-medium">Jupiter Swap V2</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

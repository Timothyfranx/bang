'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { Navbar } from '@/components/layout/Navbar';
import { StartSession } from '@/components/session/StartSession';
import { SessionCard } from '@/components/session/SessionCard';
import { GhostPanel } from '@/components/ghost/GhostPanel';
import { VaultBalance } from '@/components/vault/VaultBalance';
import { Badge } from '@/components/shared/Badge';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

export default function Home() {
  const { connected } = useWallet();
  const { isActive } = useSession();
  const { priceData, loading: priceLoading } = useJupiterPrice();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {!connected ? (
          <div className="flex flex-col items-center justify-center text-center py-20">
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
                  ${priceData?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                </div>
              )}
              <Badge variant="success">LIVE via Jupiter</Badge>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Session and Ghost Mode */}
            <div className="lg:col-span-2 space-y-8">
              {isActive ? (
                <SessionCard />
              ) : (
                <StartSession />
              )}
              
              <GhostPanel />
            </div>

            {/* Right Column: Vault and Stats */}
            <div className="space-y-8">
              <VaultBalance />
              
              <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-4">Isolation Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8B8B9B]">Security Level</span>
                    <span className="text-sm font-bold text-[#D4A843]">L3 / Ghost</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8B8B9B]">Wallet Rotation</span>
                    <span className="text-sm font-bold">Session Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#8B8B9B]">Jupiter Routing</span>
                    <span className="text-sm font-bold text-green-400">V6 Optimized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

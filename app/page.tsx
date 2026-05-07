'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { StartSession } from '@/components/session/StartSession';
import { SessionCard } from '@/components/session/SessionCard';
import { GhostPanel } from '@/components/ghost/GhostPanel';
import { VaultBalance } from '@/components/vault/VaultBalance';
import { Badge } from '@/components/shared/Badge';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

export default function Home() {
  const { connected, connecting } = useWallet();
  const { isActive } = useSession();
  const { priceData, loading: priceLoading } = useJupiterPrice();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {!connected ? (
          <div className="space-y-32">
            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 mb-8 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4A843]">
                  Powered by Jupiter V6
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] max-w-4xl mx-auto">
                TRADE LIKE A <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#F59E0B]">GHOST</span>.
                <br />KEEP YOUR VAULT <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">COLD</span>.
              </h1>
              
              <p className="text-lg md:text-xl text-[#A1A1AA] mb-12 max-w-2xl mx-auto leading-relaxed">
                capsule creates a temporary isolation layer for your Solana wallet. 
                Deploy a session budget, mirror whales with shadow-signing, and sweep profits safely back to your vault.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="px-8 py-4 bg-[#D4A843] text-black font-black text-xs uppercase tracking-widest rounded-full shadow-[0_0_40px_rgba(212,168,67,0.2)] hover:scale-105 transition-all cursor-pointer">
                  Connect Wallet to Begin
                </div>
                <div className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full hover:bg-white/10 transition-all cursor-pointer">
                  How it Works
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Wallet Isolation',
                  desc: 'Never connect your main vault to risky dApps. Capsule funds a temporary session wallet with a fixed budget.',
                  icon: '🛡️'
                },
                {
                  title: 'Ghost Mode',
                  desc: 'Monitor high-signal whales and mirror their trades instantly using Shadow Signing technology.',
                  icon: '👻'
                },
                {
                  title: 'Risk Guard',
                  desc: 'Real-time Jupiter Price Impact and Organic Score filters protect you from low-liquidity drainers.',
                  icon: '🔥'
                }
              ].map((f, i) => (
                <div key={i} className="p-8 bg-[#111118] border border-white/[0.08] rounded-3xl hover:border-[#D4A843]/30 transition-all group">
                  <div className="text-3xl mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{f.title}</h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Section: Market Stats */}
            <div className="flex flex-col items-center py-20 border-t border-white/5">
              <div className="inline-flex flex-col items-center gap-6 p-10 bg-[#111118] border border-white/[0.08] rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A1A1AA] relative z-10">
                  Market Pulse
                </div>
                {priceLoading ? (
                  <div className="h-12 w-48 bg-white/5 animate-pulse rounded-2xl" />
                ) : (
                  <div className="text-5xl font-black text-[#D4A843] relative z-10 tracking-tighter">
                    ${priceData?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </div>
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Badge variant="success">Mainnet Live</Badge>
                  <span className="text-[10px] font-bold text-[#555566] uppercase tracking-wider">SOL / USD</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Left Column: Session and Ghost Mode */}
            <div className="lg:col-span-2 space-y-8">
              {connecting && (
                <div className="bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-2xl p-4 flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-ping" />
                  <span className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">Establishing secure connection...</span>
                </div>
              )}
              
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
              
              <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566] mb-6">Isolation Layer</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-[#8B8B9B] uppercase font-bold tracking-wider">Security Level</span>
                      <span className="text-xs font-black text-[#D4A843] uppercase">L3 / Ghost</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-xs text-[#8B8B9B] uppercase font-bold tracking-wider">Shadow Signing</span>
                      <span className="text-xs font-black text-green-400 uppercase">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-[#8B8B9B] uppercase font-bold tracking-wider">Jupiter Routing</span>
                      <span className="text-xs font-black text-white/40 uppercase tracking-tighter">V6 API v2.0</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl">
                  <p className="text-[10px] text-[#A1A1AA] leading-relaxed italic">
                    &quot;Risk management is not the elimination of risk, but the controlled exposure to it.&quot;
                  </p>
                </div>
              </div>

              {/* Quick Actions / Roadmap */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#111118] border border-white/[0.08] rounded-2xl text-center hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-xl block mb-2">📜</span>
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">History</span>
                </div>
                <div className="p-4 bg-[#111118] border border-white/[0.08] rounded-2xl text-center hover:bg-white/5 transition-colors cursor-pointer">
                  <span className="text-xl block mb-2">⚙️</span>
                  <span className="text-[10px] font-bold text-[#A1A1AA] uppercase">Settings</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

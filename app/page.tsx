'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useSession } from '@/components/providers/SessionProvider';
import { StartSession } from '@/components/session/StartSession';
import { SessionCard } from '@/components/session/SessionCard';
import { GhostPanel } from '@/components/ghost/GhostPanel';
import { VaultBalance } from '@/components/vault/VaultBalance';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

export default function Home() {
  const { connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const { isActive } = useSession();
  const { priceData, loading: priceLoading } = useJupiterPrice();

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#D4A843]/30">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        {!connected ? (
          <div className="space-y-40">
            {/* Minimalist Hero */}
            <div className="flex flex-col items-center justify-center text-center pt-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-10">
                <span className="w-1 h-1 rounded-full bg-[#D4A843]" />
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8B8B9B]">
                  Zero-Latency Shadow Trading Protocol
                </span>
              </div>
              
              <h1 className="text-6xl md:text-9xl font-bold mb-10 tracking-tight leading-[0.85] max-w-5xl mx-auto italic uppercase">
                Shadow the.
                <br />
                <span className="text-[#D4A843]">Smart Money.</span>
              </h1>
              
              <p className="text-lg text-[#8B8B9B] mb-14 max-w-2xl mx-auto leading-relaxed font-medium">
                Follow high-performance whales with the speed of a bot and the security of a vault.
                Isolate your risk. Mirror every move. Secure your profits.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={() => setVisible(true)}
                  className="px-12 py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#D4A843] transition-all active:scale-95"
                >
                  Get Started
                </button>
                <a 
                  href="#protocol"
                  className="px-12 py-5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/5 transition-all"
                >
                  Documentation
                </a>
              </div>
            </div>

            {/* Protocol Logic */}
            <div id="protocol" className="grid grid-cols-1 md:grid-cols-3 gap-1 px-4">
              {[
                {
                  title: 'Shadow Signing',
                  desc: 'Ephemeral keys sign and mirror whale trades in milliseconds. No popups, no lag.'
                },
                {
                  title: 'Anti-Rug Logic',
                  desc: 'Ghost filters out suspicious tokens using Jupiter organic scores. Stay safe, stay smart.'
                },
                {
                  title: 'Vault Fortress',
                  desc: 'Profits are swept back to your secure vault automatically. Your keys, your control.'
                }
              ].map((f, i) => (
                <div key={i} className="p-12 bg-[#0F0F18] border border-white/[0.05] first:rounded-l-3xl last:rounded-r-3xl md:border-r-0 last:border-r hover:bg-[#11111C] transition-colors">
                  <h3 className="text-xs font-bold mb-6 text-[#D4A843] uppercase tracking-[0.2em]">{f.title}</h3>
                  <p className="text-sm text-[#8B8B9B] leading-relaxed font-medium">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Market Data Footer */}
            <div className="flex flex-col items-center pt-24 border-t border-white/[0.05]">
              <div className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-3">Solana Price</div>
                  {priceLoading ? (
                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight text-white">
                      ${priceData?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </div>
                  )}
                </div>
                <div className="w-px h-10 bg-white/5" />
                <div className="text-center">
                  <div className="text-[10px] font-bold text-[#555566] uppercase tracking-widest mb-3">Network</div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Devnet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
            {/* Operational Dashboard */}
            <div className="lg:col-span-2 space-y-10">
              {connecting && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-[#D4A843] uppercase tracking-[0.2em]">Synchronizing...</span>
                </div>
              )}
              
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tight uppercase italic">Ghost Cockpit</h2>
                <p className="text-sm text-[#555566] font-medium tracking-wide">Monitor targets and execute shadow trades.</p>
              </div>

              {isActive ? <SessionCard /> : <StartSession />}
              <GhostPanel />
            </div>

            {/* Strategic Sidebar */}
            <div className="space-y-10">
              <VaultBalance />
              
              <div className="bg-[#0F0F18] border border-white/[0.08] rounded-3xl p-10 space-y-10">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#555566] mb-8">System</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Isolation', value: 'Active', color: 'text-green-400' },
                      { label: 'Risk Guard', value: 'L3 Standard', color: 'text-[#D4A843]' }
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <span className="text-[10px] text-[#8B8B9B] uppercase font-bold tracking-widest">{stat.label}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
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

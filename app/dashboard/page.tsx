'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { StartSession } from '@/components/session/StartSession';
import { SessionCard } from '@/components/session/SessionCard';
import { GhostPanel } from '@/components/ghost/GhostPanel';
import { VaultBalance } from '@/components/vault/VaultBalance';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { connected, connecting } = useWallet();
  const { isActive } = useSession();

  useEffect(() => {
    if (!connected && !connecting) {
      redirect('/');
    }
  }, [connected, connecting]);

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
        {/* Operational Dashboard */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Ghost Cockpit</h2>
            <p className="text-sm text-[#555566] font-medium">Manage your session and monitor target wallets.</p>
          </div>

          {isActive ? <SessionCard /> : <StartSession />}
          <GhostPanel />
        </div>

        {/* Strategic Sidebar */}
        <div className="space-y-10">
          <VaultBalance />
          
          <div className="bg-[#0F0F18] border border-white/[0.08] rounded-3xl p-10 space-y-10">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#555566] mb-8">Ghost System</h3>
              <div className="space-y-6">
                {[
                  { label: 'Latency', value: '< 200ms', color: 'text-[#D4A843]' },
                  { label: 'Shadow Sig', value: 'Ready', color: 'text-green-400' },
                  { label: 'Security', value: 'Isolated', color: 'text-white/60' }
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 pb-3 last:pb-0">
                    <span className="text-[10px] text-[#8B8B9B] uppercase font-bold tracking-widest">{stat.label}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[10px] text-[#8B8B9B] leading-relaxed font-medium italic">
                  &quot;The Shadow signs instantly. Your vault never moves.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { VaultBalance } from '@/components/vault/VaultBalance';
import { LimitOrderForm } from '@/components/vault/LimitOrderForm';
import { useWallet } from '@solana/wallet-adapter-react';

export default function VaultPage() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#8B8B9B]">
              Vault Protocol v1.0
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">My Vault</h1>
          <p className="text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
            Manage your main portfolio and place secure limit orders directly via Jupiter Trigger. 
            Assets here are isolated from active trading sessions.
          </p>
        </header>

        {!connected ? (
          <div className="bg-[#111118] border border-white/[0.08] rounded-[2.5rem] p-16 text-center max-w-4xl mx-auto">
            <span className="text-5xl block mb-6 opacity-20">🛡️</span>
            <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">Vault Locked</h2>
            <p className="text-[#A1A1AA] mb-10 max-w-md mx-auto">Connect your wallet to access your cold storage and manage limit orders.</p>
            <div className="inline-block px-10 py-4 bg-[#D4A843] text-black font-black text-xs uppercase tracking-widest rounded-full shadow-lg shadow-[#D4A843]/10">
              Unlock with Wallet
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fade-in">
            <div className="lg:col-span-2 space-y-12">
              <VaultBalance />
              
              <div className="bg-[#111118] border border-white/[0.08] rounded-[2rem] p-10">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#555566] mb-8">Activity History</h3>
                <div className="text-[#555566] text-xs font-bold uppercase tracking-widest text-center py-24 border border-dashed border-white/5 rounded-2xl">
                  No vault transactions found in current cluster.
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <LimitOrderForm />
              
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3">Security Tip</h4>
                <p className="text-[11px] text-amber-200/60 leading-relaxed">
                  Limit orders placed from the vault are executed via Jupiter Trigger. 
                  This does not require a session wallet and uses your vault&apos;s direct liquidity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

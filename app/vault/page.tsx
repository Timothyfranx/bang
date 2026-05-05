'use client';

import { VaultBalance } from '@/components/vault/VaultBalance';
import { LimitOrderForm } from '@/components/vault/LimitOrderForm';
import { useWallet } from '@solana/wallet-adapter-react';

export default function VaultPage() {
  const { connected } = useWallet();

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Vault</h1>
          <p className="text-[#A1A1AA]">
            Manage your main portfolio and place secure limit orders directly via Jupiter Trigger.
          </p>
        </header>

        {!connected ? (
          <div className="bg-[#111118] border border-white/[0.08] rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
            <p className="text-[#A1A1AA] mb-8">Please connect your wallet to view your vault and place limit orders.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VaultBalance />
              
              <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                <div className="text-[#A1A1AA] text-sm text-center py-12 border border-dashed border-white/10 rounded-xl">
                  No recent vault activity found.
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <LimitOrderForm />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

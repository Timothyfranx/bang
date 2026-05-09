'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';
import { Badge } from '@/components/shared/Badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { priceData, loading: priceLoading } = useJupiterPrice();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#D4A843]/30 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,_rgba(212,168,67,0.05)_0%,_transparent_70%)] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="space-y-40">
          {/* Minimalist Hero */}
          <div className="flex flex-col items-center justify-center text-center pt-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-12">
              <span className="w-1 h-1 rounded-full bg-[#D4A843] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#8B8B9B]">
                Copy-Ghost v1.0
              </span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-bold mb-12 tracking-tighter leading-[0.8] max-w-6xl mx-auto">
              Follow Whales.
              <br />
              <span className="text-[#D4A843]">Stay Ghost.</span>
            </h1>
            
            <p className="text-xl text-[#8B8B9B] mb-16 max-w-xl mx-auto leading-relaxed font-medium">
              Zero-latency shadow trading for Solana. Mirror whale activity instantly with session-based isolation.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button 
                onClick={() => setVisible(true)}
                className="px-14 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.25em] rounded-full hover:bg-[#D4A843] transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Launch Cockpit
              </button>
              <button 
                className="px-14 py-6 border border-white/10 text-white font-black text-xs uppercase tracking-[0.25em] rounded-full hover:bg-white/5 transition-all"
              >
                View Protocol
              </button>
            </div>
          </div>

          {/* Protocol Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05] rounded-3xl overflow-hidden">
            {[
              {
                title: 'Shadow Signing',
                desc: 'Mirror trades in the same block. Session keys sign instantly without popups.'
              },
              {
                title: 'De-Risk Filters',
                desc: 'Automated protection. We scan organic scores and liquidity before you mirror.'
              },
              {
                title: 'Safe Sweeping',
                desc: 'Profit recovery with token verification. Only high-signal assets return home.'
              }
            ].map((f, i) => (
              <div key={i} className="p-16 bg-[#0A0A0F] hover:bg-[#0E0E14] transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-10 group-hover:border-[#D4A843]/30 transition-colors">
                  <span className="text-lg">0{i+1}</span>
                </div>
                <h3 className="text-xs font-black mb-6 text-[#D4A843] uppercase tracking-[0.3em]">{f.title}</h3>
                <p className="text-sm text-[#8B8B9B] leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Real-time Data */}
          <div className="flex flex-col items-center pt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em] mb-4">SOL / USD</div>
                {priceLoading ? (
                  <div className="h-10 w-28 bg-white/5 animate-pulse rounded" />
                ) : (
                  <div className="text-4xl font-bold tracking-tighter text-white">
                    ${priceData?.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em] mb-4">Network</div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-4xl font-bold tracking-tighter text-white">Mainnet</div>
                  <Badge variant="success">Optimal</Badge>
                </div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em] mb-4">Execution</div>
                <div className="text-4xl font-bold tracking-tighter text-[#D4A843]">V6 Fast</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em] mb-4">Status</div>
                <div className="text-4xl font-bold tracking-tighter text-white">Online</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 lg:px-8 py-20 border-t border-white/[0.05] mt-40 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#D4A843] rounded-md" />
          <span className="font-bold text-sm tracking-widest uppercase">Copy-Ghost</span>
        </div>
        <div className="flex gap-10 text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Open Source</a>
        </div>
        <div className="text-[10px] font-bold text-[#555566] uppercase tracking-[0.2em]">
          Built for Jupiter Hackathon
        </div>
      </footer>
    </div>
  );
}

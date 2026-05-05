'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSession } from '@/components/providers/SessionProvider';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { isActive, budget } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <nav className="border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center font-bold text-black">
              C
            </div>
            <span className="text-xl font-bold tracking-tight">Capsule</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isActive && (
              <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-white/70">
                  ACTIVE SESSION: ${budget}
                </span>
              </div>
            )}
            {mounted && (
              <WalletMultiButton className="!bg-[#D4A843] !text-black !font-semibold !rounded-full !px-6 !h-10 !text-sm hover:!bg-[#C49833] transition-colors" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

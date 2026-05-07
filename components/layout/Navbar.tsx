'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { isActive, budget } = useSession();
  const { connecting, connected, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Handle stuck connecting state
  useEffect(() => {
    if (connecting) {
      const timer = setTimeout(() => {
        if (connecting && !connected) {
          console.warn('Wallet connection taking too long, suggesting reset.');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [connecting, connected]);

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Vault', href: '/vault' },
  ];

  return (
    <nav className="border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-5 rounded-full border-2 border-[#D4A843] flex items-center p-0.5 overflow-hidden">
                <div className="w-4 h-full bg-[#D4A843] rounded-full animate-ghost-pulse" />
              </div>
              <span className="text-2xl font-black tracking-tight lowercase">capsule</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                    pathname === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-[#555566] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {isActive && (
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[#D4A843]/10 border border-[#D4A843]/20 rounded-full">
                <div className="w-2 h-2 bg-[#D4A843] rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-[#D4A843] uppercase tracking-widest">
                  Active Session: ${budget}
                </span>
              </div>
            )}
            
            {mounted && (
              <div className="flex items-center gap-2">
                {connecting && (
                  <button 
                    onClick={() => disconnect()}
                    className="text-[10px] font-black uppercase tracking-widest text-[#555566] hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
                <WalletMultiButton className="!bg-[#D4A843] !text-black !font-black !rounded-full !px-8 !h-11 !text-[10px] !uppercase !tracking-widest hover:!bg-[#C49833] !transition-all !border-none !shadow-lg shadow-[#D4A843]/10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

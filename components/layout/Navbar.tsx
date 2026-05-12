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
  const { connecting, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Vault', href: '/vault' },
  ];

  return (
    <nav className="border-b border-white/[0.05] bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black border border-[#D4A843]/50 rounded-lg flex items-center justify-center font-bold text-[#D4A843] group-hover:shadow-[0_0_15px_rgba(212,168,67,0.3)] transition-all">
                G
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase italic text-white/90">copy-ghost</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${
                    pathname === link.href
                      ? 'bg-[#D4A843]/10 border-[#D4A843]/30 text-[#D4A843]'
                      : 'border-transparent text-[#555566] hover:text-white'
                  }`}
                >
                  {link.name === 'Dashboard' ? 'Cockpit' : link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            {isActive && (
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-[10px] font-bold text-[#D4A843] uppercase tracking-[0.2em]">
                  Active Session: ${budget}
                </span>
                <div className="w-1 h-1 bg-green-500 rounded-full" />
              </div>
            )}
            
            {mounted && (
              <div className="flex items-center gap-4">
                {connecting && (
                  <button 
                    onClick={() => disconnect()}
                    className="text-[10px] font-bold uppercase tracking-widest text-[#555566] hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
                <WalletMultiButton className="!bg-white !text-black !font-bold !rounded-full !px-8 !h-10 !text-[10px] !uppercase !tracking-[0.2em] hover:!bg-[#D4A843] !transition-all !border-none" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

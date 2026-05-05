'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useSession } from '@/components/providers/SessionProvider';
import { useEffect, useState } from 'react';

export function Navbar() {
  const pathname = usePathname();
  const { isActive, budget } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Vault', href: '/vault' },
  ];

  return (
    <nav className="border-b border-white/[0.08] bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center font-bold text-black group-hover:rotate-12 transition-transform">
                C
              </div>
              <span className="text-xl font-bold tracking-tight">Capsule</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isActive && (
              <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full">
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

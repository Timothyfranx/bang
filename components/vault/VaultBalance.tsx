'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { getSolBalance } from '@/lib/solana/balance';
import { formatNumber } from '@/lib/utils/format';

export function VaultBalance() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
      getSolBalance(connection, publicKey)
        .then(setSolBalance)
        .finally(() => setLoading(false));
    } else {
      setSolBalance(null);
    }
  }, [connected, publicKey, connection]);

  if (!connected) return null;

  return (
    <div className="bg-[#111118] border border-white/[0.08] rounded-[2rem] p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A843]/5 blur-[64px] rounded-full -mr-16 -mt-16 group-hover:bg-[#D4A843]/10 transition-colors" />
      
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555566] mb-8">
        Primary Vault Holdings
      </h3>
      
      <div className="flex items-baseline gap-3 mb-6">
        {loading ? (
          <div className="h-14 w-48 bg-white/5 animate-pulse rounded-2xl" />
        ) : (
          <>
            <span className="text-6xl font-black tracking-tighter text-white">
              {solBalance !== null ? formatNumber(solBalance, 4) : '0.0000'}
            </span>
            <span className="text-[#D4A843] font-black text-2xl tracking-tight uppercase">SOL</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="w-6 h-6 rounded-full bg-[#D4A843] border-2 border-[#111118] z-10" />
          <div className="w-6 h-6 rounded-full bg-[#1C1C28] border-2 border-[#111118] z-0" />
        </div>
        <p className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-widest">
          Secured Assets / Cold Storage
        </p>
      </div>
    </div>
  );
}

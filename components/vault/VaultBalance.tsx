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
    <div className="bg-[#0F0F18] border border-white/[0.08] rounded-3xl p-10">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#555566] mb-8">
        Vault Holdings
      </h3>

      <div className="flex items-baseline gap-3 mb-4">
        {loading ? (
          <div className="h-10 w-32 bg-white/5 animate-pulse rounded" />
        ) : (
          <>
            <span className="text-5xl font-bold tracking-tight text-white">
              {solBalance !== null ? formatNumber(solBalance, 4) : '0.0000'}
            </span>
            <span className="text-[#D4A843] font-bold text-lg uppercase">SOL</span>
          </>
        )}
      </div>

      <p className="text-[10px] font-medium text-[#555566] uppercase tracking-widest">
        Cold Storage Assets
      </p>
    </div>
  );
}


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
    <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 mb-8">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A1A1AA] mb-4">
        Vault Balance
      </h3>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
        ) : (
          <>
            <span className="text-4xl font-bold">
              {solBalance !== null ? formatNumber(solBalance, 4) : '0.0000'}
            </span>
            <span className="text-[#D4A843] font-semibold text-lg">SOL</span>
          </>
        )}
      </div>
      <p className="text-sm text-[#A1A1AA] mt-2">
        This is your main wallet. Session wallets are funded from here.
      </p>
    </div>
  );
}

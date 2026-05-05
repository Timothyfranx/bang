'use client';

import { useSession } from '@/components/providers/SessionProvider';
import { Badge } from '@/components/shared/Badge';

export function SessionCard() {
  const { isActive, sessionKeypair, budget, endSession } = useSession();

  if (!isActive || !sessionKeypair) return null;

  const address = sessionKeypair.publicKey.toBase58();
  const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <div className="bg-[#111118] border border-[#D4A843]/30 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant="success">ACTIVE</Badge>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Session Active</h2>
      <p className="text-[#A1A1AA] mb-8 text-sm">
        Your isolated session wallet is ready. Use this address in dApps.
      </p>

      <div className="space-y-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1">
            Isolation Wallet
          </div>
          <div className="text-lg font-mono font-bold text-white flex items-center justify-between">
            {truncatedAddress}
            <button 
              onClick={() => navigator.clipboard.writeText(address)}
              className="text-[#D4A843] text-xs font-semibold hover:underline"
            >
              COPY
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1">
              Budget
            </div>
            <div className="text-xl font-bold text-white">${budget}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-1">
              Time Left
            </div>
            <div className="text-xl font-bold text-white">00:59:59</div>
          </div>
        </div>

        <button
          onClick={endSession}
          className="w-full border border-red-500/50 text-red-400 font-bold py-4 rounded-xl hover:bg-red-500/10 transition-all"
        >
          End Session & Sweep
        </button>
      </div>
    </div>
  );
}

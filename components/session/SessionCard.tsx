'use client';

import { useSession } from '@/components/providers/SessionProvider';
import { Badge } from '@/components/shared/Badge';
import { formatAddress, formatTime } from '@/lib/utils/format';
import toast from 'react-hot-toast';

export function SessionCard() {
  const { isActive, sessionKeypair, budget, timeLeft, sweepAssets, endSession } = useSession();

  if (!isActive || !sessionKeypair) return null;

  const address = sessionKeypair.publicKey.toBase58();

  return (
    <div className="bg-[#111118] border border-[#D4A843]/30 rounded-2xl p-8 max-w-md w-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <Badge variant={timeLeft > 300 ? 'success' : 'warning'}>
          {timeLeft > 0 ? 'ACTIVE' : 'EXPIRED'}
        </Badge>
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
            {formatAddress(address)}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success('Address copied');
              }}
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
            <div className={`text-xl font-bold ${timeLeft < 300 ? 'text-amber-400' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {sweepAssets.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
              Assets to Sweep
            </div>
            <div className="space-y-2">
              {sweepAssets.map((asset) => (
                <div key={asset.mint} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{asset.symbol}</span>
                    <span className="text-white/40">{asset.uiAmount.toFixed(4)}</span>
                  </div>
                  <Badge variant={asset.isSafe ? 'success' : 'error'}>
                    {asset.isSafe ? `Score: ${asset.organicScore}` : 'SUSPICIOUS'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={endSession}
          className="w-full bg-[#D4A843] text-black font-bold py-4 rounded-xl hover:bg-[#C49833] transition-all"
        >
          End Session & Sweep Safe Assets
        </button>
        
        <p className="text-[10px] text-center text-[#A1A1AA] px-4 leading-relaxed">
          Suspicious tokens (Organic Score &lt; 70) will be abandoned to protect your vault from potential drainers.
        </p>
      </div>
    </div>
  );
}

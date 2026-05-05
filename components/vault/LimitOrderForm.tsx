'use client';

import { useState } from 'react';
import { useLimitOrder } from '@/hooks/useLimitOrder';
import { useJupiterPrice } from '@/hooks/useJupiterPrice';

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function LimitOrderForm() {
  const { placeOrder, loading } = useLimitOrder();
  const { priceData } = useJupiterPrice();
  
  const [inAmount, setInAmount] = useState('1');
  const [triggerPrice, setTriggerPrice] = useState('');
  const [condition, setTriggerCondition] = useState<'above' | 'below'>('below');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!triggerPrice) return;
    
    // Amount needs to be in lamports for SOL
    const amountLamports = Math.floor(parseFloat(inAmount) * 1_000_000_000).toString();
    
    await placeOrder(
      SOL_MINT,
      USDC_MINT,
      amountLamports,
      triggerPrice,
      condition
    );
  };

  return (
    <div className="bg-[#111118] border border-white/[0.08] rounded-2xl p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-2">Vault Limit Order</h2>
      <p className="text-[#A1A1AA] mb-8 text-sm">
        Place a limit order directly from your vault. Orders are executed via Jupiter Trigger.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
            Sell amount (SOL)
          </label>
          <input
            type="number"
            value={inAmount}
            onChange={(e) => setInAmount(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-bold focus:outline-none focus:border-[#D4A843]/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
            Trigger Price (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
            <input
              type="number"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-8 pr-4 font-bold focus:outline-none focus:border-[#D4A843]/50 transition-colors"
              placeholder={priceData?.price.toFixed(2) || '0.00'}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA] mb-2">
            Condition
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTriggerCondition('below')}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${condition === 'below' ? 'bg-[#D4A843] text-black' : 'bg-white/5 text-[#A1A1AA]'}`}
            >
              Price Falls Below
            </button>
            <button
              type="button"
              onClick={() => setTriggerCondition('above')}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${condition === 'above' ? 'bg-[#D4A843] text-black' : 'bg-white/5 text-[#A1A1AA]'}`}
            >
              Price Rises Above
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D4A843] text-black font-bold py-4 rounded-xl hover:bg-[#C49833] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            'Place Limit Order'
          )}
        </button>
      </form>
    </div>
  );
}

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
    <div className="bg-[#0F0F18] border border-white/[0.08] rounded-3xl p-10 max-w-md w-full">
      <h2 className="text-xl font-bold mb-10 tracking-tight">Limit Order</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555566] mb-4">
            Sell Amount (SOL)
          </label>
          <input
            type="number"
            value={inAmount}
            onChange={(e) => setInAmount(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 font-bold focus:outline-none focus:border-[#D4A843]/50 transition-all text-white"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555566] mb-4">
            Target Price (USDC)
          </label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 font-bold">$</span>
            <input
              type="number"
              value={triggerPrice}
              onChange={(e) => setTriggerPrice(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 font-bold focus:outline-none focus:border-[#D4A843]/50 transition-all text-white"
              placeholder={priceData?.price.toFixed(2) || '0.00'}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555566] mb-4">
            Condition
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTriggerCondition('below')}
              className={`py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${condition === 'below' ? 'bg-[#D4A843] text-black' : 'bg-white/[0.03] text-[#555566] hover:bg-white/5'}`}
            >
              Below
            </button>
            <button
              type="button"
              onClick={() => setTriggerCondition('above')}
              className={`py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${condition === 'above' ? 'bg-[#D4A843] text-black' : 'bg-white/[0.03] text-[#555566] hover:bg-white/5'}`}
            >
              Above
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-bold py-5 rounded-2xl hover:bg-[#D4A843] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            'Execute'
          )}
        </button>
      </form>
    </div>
  );
}

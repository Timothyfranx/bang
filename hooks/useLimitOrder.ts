'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import toast from 'react-hot-toast';

export function useLimitOrder() {
  const { publicKey, signMessage } = useWallet();
  const [loading, setLoading] = useState(false);

  const placeOrder = useCallback(async (
    inputMint: string,
    outputMint: string,
    inAmount: string,
    triggerPrice: string,
    triggerCondition: 'above' | 'below'
  ) => {
    if (!publicKey || !signMessage) {
      toast.error('Wallet not connected');
      return;
    }

    setLoading(true);
    try {
      // 1. Get Challenge
      const challengeRes = await fetch('/api/trigger/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletPublicKey: publicKey.toBase58() })
      });
      const challengeData = await challengeRes.json().catch(() => ({}));
      if (!challengeRes.ok || challengeData.error) throw new Error(challengeData.error || 'Failed to get challenge');
      const { challenge } = challengeData;

      // 2. Sign Challenge
      const message = new TextEncoder().encode(challenge);
      const signature = await signMessage(message);
      const signatureBase58 = bs58.encode(signature);

      // 3. Verify and get JWT
      const verifyRes = await fetch('/api/trigger/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletPublicKey: publicKey.toBase58(),
          signature: signatureBase58
        })
      });
      const verifyData = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok || verifyData.error) throw new Error(verifyData.error || 'Failed to verify signature');
      const { accessToken } = verifyData;

      // 4. Place Order
      const orderRes = await fetch('/api/trigger/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          inputMint,
          outputMint,
          inAmount,
          triggerPrice,
          triggerCondition
        })
      });
      const orderData = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok || orderData.error) throw new Error(orderData.error || 'Failed to place order');

      toast.success('Limit order placed successfully!');
      return orderData;
    } catch (err) {
      console.error('Failed to place limit order', err);
      toast.error(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setLoading(false);
    }
  }, [publicKey, signMessage]);

  return { placeOrder, loading };
}

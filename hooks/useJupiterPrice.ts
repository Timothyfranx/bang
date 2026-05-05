'use client';

import { useState, useEffect } from 'react';
import { fetchSolPrice } from '@/lib/jupiter/price';
import { PriceData } from '@/types/jupiter';

export function useJupiterPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getPrice() {
      try {
        setLoading(true);
        const data = await fetchSolPrice();
        setPriceData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch SOL price');
      } finally {
        setLoading(false);
      }
    }

    getPrice();
    
    // Refresh every 30 seconds
    const interval = setInterval(getPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  return { priceData, loading, error };
}

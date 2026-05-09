'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { GhostSignal, WhaleTrade } from '@/types/ghost';
import { pollWhaleTrades } from '@/lib/solana/watcher';
import { assessTradeRisk } from '@/lib/utils/risk';
import toast from 'react-hot-toast';

export function useGhost(whaleAddresses: string[], isActive: boolean) {
  const { connection } = useConnection();
  const [signals, setSignals] = useState<GhostSignal[]>([]);
  const isPolling = isActive && whaleAddresses.length > 0;
  const lastSignatures = useRef<Record<string, string | null>>({});

  const processTrade = useCallback(async (trade: WhaleTrade) => {
    const risk = await assessTradeRisk(trade);
    const signal: GhostSignal = {
      trade,
      risk,
      status: 'pending'
    };
    
    setSignals(prev => [signal, ...prev].slice(0, 50));
    
    if (risk.level === 'safe') {
      toast.success(`Ghost Mode: New safe trade detected from ${trade.walletAddress.slice(0,4)}...`, {
        icon: '👻',
        duration: 5000
      });
    }
  }, []);

  useEffect(() => {
    if (!isActive || whaleAddresses.length === 0) return;

    const poll = async () => {
      for (const address of whaleAddresses) {
        const { trades, latestSignature } = await pollWhaleTrades(
          connection,
          address,
          lastSignatures.current[address] || null
        );

        if (latestSignature) {
          lastSignatures.current[address] = latestSignature;
        }

        for (const trade of trades) {
          await processTrade(trade);
        }
      }
    };

    poll(); // Initial poll
    const interval = setInterval(poll, 10000); // Poll every 10 seconds to avoid RPC rate limits

    return () => clearInterval(interval);
  }, [connection, whaleAddresses, isActive, processTrade]);

  return { signals, isPolling };
}

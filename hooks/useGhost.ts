'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { pollWalletTransactions } from '@/lib/solana/watcher';
import { assessTradeRisk } from '@/lib/utils/risk';
import { getQuote } from '@/lib/jupiter/swap';
import { GhostSignal, WhaleTrade } from '@/types/ghost';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 5000; // 5 seconds

export function useGhost() {
  const { connection } = useConnection();
  const { isActive: isSessionActive } = useSession();
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [whaleAddress, setWhaleAddress] = useState('');
  const [signals, setSignals] = useState<GhostSignal[]>([]);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const processTrade = useCallback(async (trade: WhaleTrade) => {
    // 1. Assess Risk
    const risk = await assessTradeRisk(trade);
    
    // 2. Get Quote for mirror trade (using a small amount for the quote)
    const amountInLamports = 100000000; // 0.1 SOL placeholder for quote check
    const jupiterQuote = await getQuote(trade.inputMint, trade.outputMint, amountInLamports);
    
    const signal: GhostSignal = {
      trade,
      risk,
      jupiterQuote,
      status: 'pending'
    };
    
    setSignals(prev => [signal, ...prev].slice(0, 20));
    
    if (risk.level === 'safe') {
      toast.success(`Ghost Mode: Safe trade detected for ${trade.outputSymbol}!`, {
        icon: '👻',
        duration: 5000
      });
    } else if (risk.level === 'caution') {
      toast('Ghost Mode: Caution trade detected.', {
        icon: '⚠️',
        duration: 5000
      });
    }
  }, []);

  const poll = useCallback(async () => {
    if (!whaleAddress || !isMonitoring) return;
    
    try {
      const newTrades = await pollWalletTransactions(
        whaleAddress,
        lastSignature,
        connection.rpcEndpoint
      );
      
      if (newTrades.length > 0) {
        setLastSignature(newTrades[0].signature);
        for (const trade of newTrades.reverse()) {
          await processTrade(trade);
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [whaleAddress, isMonitoring, lastSignature, connection.rpcEndpoint, processTrade]);

  useEffect(() => {
    if (isMonitoring && isSessionActive) {
      pollingRef.current = setInterval(poll, POLLING_INTERVAL);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isMonitoring, isSessionActive, poll]);

  const toggleMonitoring = useCallback(() => {
    if (!whaleAddress && !isMonitoring) {
      toast.error('Please enter a whale address first');
      return;
    }
    setIsMonitoring(prev => !prev);
    if (!isMonitoring) {
      toast.success(`Ghost Mode: Monitoring ${whaleAddress.slice(0, 4)}...`);
    } else {
      toast('Ghost Mode: Monitoring stopped');
    }
  }, [whaleAddress, isMonitoring]);

  return {
    isMonitoring,
    whaleAddress,
    setWhaleAddress,
    signals,
    toggleMonitoring,
    isSessionActive
  };
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useSession } from '@/components/providers/SessionProvider';
import { pollWalletTransactions } from '@/lib/solana/watcher';
import { assessTradeRisk } from '@/lib/utils/risk';
import { getQuote } from '@/lib/jupiter/swap';
import { checkMultiGhostConsensus } from '@/lib/utils/multiGhost';
import { GhostSignal, WhaleTrade } from '@/types/ghost';
import toast from 'react-hot-toast';

const POLLING_INTERVAL = 5000; // 5 seconds

export function useGhost() {
  const { connection } = useConnection();
  const { isActive: isSessionActive } = useSession();
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [whaleAddresses, setWhaleAddresses] = useState<string[]>([]);
  const [signals, setSignals] = useState<GhostSignal[]>([]);
  const [lastSignatures, setLastSignatures] = useState<Record<string, string | null>>({});
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const processTrade = useCallback(async (trade: WhaleTrade) => {
    // 1. Assess Risk
    const risk = await assessTradeRisk(trade);
    
    // 2. Check Multi-Ghost Consensus
    const { isConsensus, confirmations } = checkMultiGhostConsensus(trade, whaleAddresses);

    // 3. Get Quote for mirror trade (using a small amount for the quote)
    const amountInLamports = 100000000; // 0.1 SOL placeholder for quote check
    const jupiterQuote = await getQuote(trade.inputMint, trade.outputMint, amountInLamports);
    
    const signal: GhostSignal = {
      trade,
      risk,
      jupiterQuote,
      status: 'pending',
      confirmations,
      isConsensus
    };
    
    setSignals(prev => {
      // If we already have a signal for this token (consensus update), we might want to update it
      // For now, we just add new signals or update existing ones in the feed
      const existingIdx = prev.findIndex(s => s.trade.outputMint === trade.outputMint && s.status === 'pending');
      
      if (existingIdx !== -1 && isConsensus) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], isConsensus, confirmations };
        return updated;
      }
      
      return [signal, ...prev].slice(0, 20);
    });
    
    if (isConsensus) {
      toast.success(`CONSENSUS: Multiple whales buying ${trade.outputSymbol}!`, {
        icon: '🔥',
        duration: 6000
      });
    } else if (risk.level === 'safe') {
      toast.success(`Ghost Mode: Safe trade detected for ${trade.outputSymbol}!`, {
        icon: '👻',
        duration: 4000
      });
    }
  }, [whaleAddresses]);

  const poll = useCallback(async () => {
    if (whaleAddresses.length === 0 || !isMonitoring) return;
    
    try {
      for (const address of whaleAddresses) {
        const lastSig = lastSignatures[address] || null;
        const newTrades = await pollWalletTransactions(
          address,
          lastSig,
          connection.rpcEndpoint
        );
        
        if (newTrades.length > 0) {
          setLastSignatures(prev => ({ ...prev, [address]: newTrades[0].signature }));
          for (const trade of newTrades.reverse()) {
            await processTrade(trade);
          }
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [whaleAddresses, isMonitoring, lastSignatures, connection.rpcEndpoint, processTrade]);

  useEffect(() => {
    if (isMonitoring && isSessionActive && whaleAddresses.length > 0) {
      pollingRef.current = setInterval(poll, POLLING_INTERVAL);
    } else {
      if (pollingRef.current) clearInterval(pollingRef.current);
    }
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isMonitoring, isSessionActive, whaleAddresses, poll]);

  const toggleMonitoring = useCallback(() => {
    if (whaleAddresses.length === 0 && !isMonitoring) {
      toast.error('Please add at least one whale address');
      return;
    }
    setIsMonitoring(prev => !prev);
    if (!isMonitoring) {
      toast.success(`Ghost Mode: Monitoring ${whaleAddresses.length} whales...`);
    } else {
      toast('Ghost Mode: Monitoring stopped');
    }
  }, [whaleAddresses, isMonitoring]);

  const addWhale = (address: string) => {
    if (!address) return;
    if (whaleAddresses.includes(address)) {
      toast.error('Whale already added');
      return;
    }
    if (whaleAddresses.length >= 3) {
      toast.error('Maximum 3 whales for v1');
      return;
    }
    setWhaleAddresses(prev => [...prev, address]);
    toast.success('Whale added to target list');
  };

  const removeWhale = (address: string) => {
    setWhaleAddresses(prev => prev.filter(a => a !== address));
    if (whaleAddresses.length === 1) setIsMonitoring(false);
  };

  return {
    isMonitoring,
    whaleAddresses,
    addWhale,
    removeWhale,
    signals,
    toggleMonitoring,
    isSessionActive
  };
}

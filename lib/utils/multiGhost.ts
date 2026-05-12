import { WhaleTrade } from '@/types/ghost';

interface Confirmation {
  whaleAddress: string;
  trade: WhaleTrade;
  timestamp: number;
}

// In-memory store of recent whale trades to check for consensus
// Key is the outputMint (the token being bought)
const recentTrades: Map<string, Confirmation[]> = new Map();

const WINDOW_MS = 300000; // 5 minutes window for consensus

export function checkMultiGhostConsensus(
  newTrade: WhaleTrade,
  whaleAddresses: string[],
  requiredConfirmations: number = 2
): { isConsensus: boolean; confirmations: string[] } {
  const key = newTrade.outputMint;
  const now = Date.now();
  
  // 1. Get existing confirmations for this token
  let confirmations = (recentTrades.get(key) || [])
    .filter(c => now - c.timestamp < WINDOW_MS) // must be within window
    .filter(c => c.whaleAddress !== newTrade.walletAddress); // dedupe by address
    
  // 2. Add the new trade as a confirmation
  const newConfirmation: Confirmation = {
    whaleAddress: newTrade.walletAddress,
    trade: newTrade,
    timestamp: now
  };
  
  confirmations = [newConfirmation, ...confirmations];
  recentTrades.set(key, confirmations);
  
  // 3. Filter for only the whales we are currently monitoring
  const activeConfirmations = confirmations.filter(c => 
    whaleAddresses.includes(c.whaleAddress)
  );
  
  // 4. Unique whales who bought this token
  const uniqueWhales = Array.from(new Set(activeConfirmations.map(c => c.whaleAddress)));
  
  return {
    isConsensus: uniqueWhales.length >= requiredConfirmations,
    confirmations: uniqueWhales
  };
}

export function getConfirmationsForToken(tokenMint: string): string[] {
  const now = Date.now();
  const confirmations = (recentTrades.get(tokenMint) || [])
    .filter(c => now - c.timestamp < WINDOW_MS);
  
  return Array.from(new Set(confirmations.map(c => c.whaleAddress)));
}

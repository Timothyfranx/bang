import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { WhaleTrade } from '@/types/ghost';

const JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKppRequest6f1v97xX8c69R7L17tT'; // Example ID, verify if needed

export async function pollWhaleTrades(
  connection: Connection,
  whaleAddress: string,
  lastSignature: string | null
): Promise<{ trades: WhaleTrade[], latestSignature: string | null }> {
  try {
    const signatures = await connection.getSignaturesForAddress(
      new PublicKey(whaleAddress),
      { limit: 10, until: lastSignature ?? undefined }
    );

    if (signatures.length === 0) {
      return { trades: [], latestSignature: lastSignature };
    }

    const trades: WhaleTrade[] = [];
    
    // Reverse to process from oldest to newest if needed, but for polling we want latest
    for (const sig of signatures) {
      const tx = await connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0,
      });

      if (tx) {
        const trade = parseJupiterSwap(tx, whaleAddress, sig.signature);
        if (trade) trades.push(trade);
      }
    }

    return {
      trades: trades.reverse(), // Return in chronological order
      latestSignature: signatures[0].signature
    };
  } catch (err) {
    console.error('[Whale Watcher] Polling failed', err);
    return { trades: [], latestSignature: lastSignature };
  }
}

function parseJupiterSwap(
  tx: ParsedTransactionWithMeta,
  whaleAddress: string,
  signature: string
): WhaleTrade | null {
  const instructions = tx.transaction.message.instructions;
  
  const isJupiter = instructions.some(ix => {
    if ('programId' in ix) {
      return ix.programId.toBase58() === JUPITER_PROGRAM_ID;
    }
    return false;
  });

  if (!isJupiter) return null;

  // Mock parsing for demo purposes - in real app, we extract from logs or inner instructions
  // For the hackathon, if we see a Jupiter tx, we'll try to find the SOL/Token movement
  // This is a placeholder that will be refined
  
  return {
    signature,
    timestamp: tx.blockTime ? tx.blockTime * 1000 : Date.now(),
    inputMint: 'So11111111111111111111111111111111111111112', // SOL
    outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC (mock)
    inputSymbol: 'SOL',
    outputSymbol: 'USDC',
    inputAmount: 1,
    outputAmount: 150,
    walletAddress: whaleAddress
  };
}

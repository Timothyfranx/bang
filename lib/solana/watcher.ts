import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { WhaleTrade } from '@/types/ghost';
import { getTokenMetadata } from '@/lib/jupiter/tokens';

const JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKpphs6NgEbkT9YV3S8s9K1XpE21S3';

export async function pollWalletTransactions(
  walletAddress: string,
  lastSignature: string | null,
  rpcUrl: string
): Promise<WhaleTrade[]> {
  const connection = new Connection(rpcUrl);
  
  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(walletAddress),
    { limit: 5, before: lastSignature ?? undefined }
  );
  
  // Filter for new transactions only
  const newSigs = lastSignature
    ? signatures.filter(s => s.signature !== lastSignature)
    : signatures.slice(0, 1); // First run: just the latest
  
  const trades: WhaleTrade[] = [];
  
  for (const sig of newSigs) {
    try {
      const tx = await connection.getParsedTransaction(sig.signature, {
        maxSupportedTransactionVersion: 0
      });
      if (tx) {
        const trade = parseJupiterSwap(tx, walletAddress);
        if (trade && trade.inputMint && trade.outputMint) {
          const meta = await getTokenMetadata([trade.inputMint, trade.outputMint]);
          const inputMeta = meta.find(m => m.mint === trade.inputMint);
          const outputMeta = meta.find(m => m.mint === trade.outputMint);

          trades.push({
            signature: sig.signature,
            timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            walletAddress,
            inputMint: trade.inputMint,
            outputMint: trade.outputMint,
            inputAmount: trade.inputAmount || 0,
            outputAmount: trade.outputAmount || 0,
            inputSymbol: inputMeta?.symbol || '?',
            outputSymbol: outputMeta?.symbol || '?',
            inputLogo: inputMeta?.logoURI,
            outputLogo: outputMeta?.logoURI
          });
        }
      }
    } catch (err) {
      console.error(`Error parsing transaction ${sig.signature}:`, err);
    }
  }
  
  return trades;
}

function parseJupiterSwap(tx: ParsedTransactionWithMeta, walletAddress: string): Partial<WhaleTrade> | null {
  // Check if Jupiter program was involved
  const isJupiter = tx.transaction.message.instructions.some(
    inst => inst.programId.toBase58() === JUPITER_PROGRAM_ID
  ) || tx.meta?.innerInstructions?.some(
    inner => inner.instructions.some(inst => inst.programId.toBase58() === JUPITER_PROGRAM_ID)
  );

  if (!isJupiter) return null;

  // Simplified logic: look at token balance changes for the wallet
  // This is more reliable than parsing complex instructions
  const postTokenBalances = tx.meta?.postTokenBalances || [];
  const preTokenBalances = tx.meta?.preTokenBalances || [];

  const walletPostBalances = postTokenBalances.filter(b => b.owner === walletAddress);
  const walletPreBalances = preTokenBalances.filter(b => b.owner === walletAddress);

  let inputMint = '';
  let outputMint = '';
  let inputAmount = 0;
  let outputAmount = 0;

  // Find token that decreased (input)
  for (const pre of walletPreBalances) {
    const post = walletPostBalances.find(b => b.mint === pre.mint);
    const preAmount = pre.uiTokenAmount.uiAmount || 0;
    const postAmount = post?.uiTokenAmount.uiAmount || 0;
    if (preAmount > postAmount) {
      inputMint = pre.mint;
      inputAmount = preAmount - postAmount;
    }
  }

  // Find token that increased (output)
  for (const post of walletPostBalances) {
    const pre = walletPreBalances.find(b => b.mint === post.mint);
    const preAmount = pre?.uiTokenAmount.uiAmount || 0;
    const postAmount = post.uiTokenAmount.uiAmount || 0;
    if (postAmount > preAmount) {
      outputMint = post.mint;
      outputAmount = postAmount - preAmount;
    }
  }

  // Handle Native SOL (simplified)
  const postLamports = tx.meta?.postBalances[0] || 0; // Assuming owner is the first account
  const preLamports = tx.meta?.preBalances[0] || 0;
  if (preLamports > postLamports && !inputMint) {
     // input was likely SOL
     inputMint = 'So11111111111111111111111111111111111111112';
     inputAmount = (preLamports - postLamports) / 1e9;
  } else if (postLamports > preLamports && !outputMint) {
     // output was likely SOL
     outputMint = 'So11111111111111111111111111111111111111112';
     outputAmount = (postLamports - preLamports) / 1e9;
  }

  if (inputMint && outputMint) {
    return {
      inputMint,
      outputMint,
      inputAmount,
      outputAmount,
      inputSymbol: '?', // Will be enriched later
      outputSymbol: '?'
    };
  }

  return null;
}

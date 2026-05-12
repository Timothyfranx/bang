import { NextResponse } from 'next/server';
import { getQuote, getSwapTransaction } from '@/lib/jupiter/swap';
import { Connection, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from '@solana/web3.js';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function POST(request: Request) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, destinationWallet, slippageBps } = await request.json();

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Special Case: SOL -> SOL (Funding or Sweeping)
    // On Devnet, Jupiter won't have pools for this, so we handle as a direct transfer
    if (inputMint === SOL_MINT && outputMint === SOL_MINT) {
      try {
        const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com');
        const fromPubkey = new PublicKey(userPublicKey);
        const toPubkey = new PublicKey(destinationWallet || userPublicKey);
        
        const { blockhash } = await connection.getLatestBlockhash();
        
        const instructions = [
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: BigInt(amount),
          }),
        ];

        const messageV0 = new TransactionMessage({
          payerKey: fromPubkey,
          recentBlockhash: blockhash,
          instructions,
        }).compileToV0Message();

        const transaction = new VersionedTransaction(messageV0);
        const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64');

        return NextResponse.json({
          swapResponse: {
            swapTransaction: serializedTransaction,
            lastValidBlockHeight: 0,
            prioritizationFeeLamports: 0
          }
        });
      } catch (err) {
        console.error('Transfer generation error:', err);
        return NextResponse.json({ error: 'Failed to generate transfer transaction' }, { status: 500 });
      }
    }

    // Standard Jupiter Swap
    const quoteResponse = await getQuote(inputMint, outputMint, amount, slippageBps);
    const swapResponse = await getSwapTransaction(quoteResponse, userPublicKey, destinationWallet);

    return NextResponse.json({
      quoteResponse,
      swapResponse
    });
  } catch (error) {
    console.error('[API Swap Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate swap transaction' },
      { status: 500 }
    );
  }
}

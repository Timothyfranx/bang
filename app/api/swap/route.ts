import { NextResponse } from 'next/server';
import { getQuote, getSwapTransaction } from '@/lib/jupiter/swap';

export async function POST(request: Request) {
  try {
    const { inputMint, outputMint, amount, userPublicKey, destinationWallet, slippageBps } = await request.json();

    if (!inputMint || !outputMint || !amount || !userPublicKey) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

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

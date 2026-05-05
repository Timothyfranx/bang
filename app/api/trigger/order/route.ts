import { NextResponse } from 'next/server';
import { createLimitOrder } from '@/lib/jupiter/trigger';

export async function POST(request: Request) {
  try {
    const { accessToken, inputMint, outputMint, inAmount, triggerPrice, triggerCondition } = await request.json();
    const order = await createLimitOrder(accessToken, inputMint, outputMint, inAmount, triggerPrice, triggerCondition);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

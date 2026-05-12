import { NextResponse } from 'next/server';
import { verifyTriggerSignature } from '@/lib/jupiter/trigger';

export async function POST(request: Request) {
  try {
    const { walletPublicKey, signature } = await request.json();
    const accessToken = await verifyTriggerSignature(walletPublicKey, signature);
    return NextResponse.json({ accessToken });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

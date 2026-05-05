import { NextResponse } from 'next/server';
import { getTriggerChallenge } from '@/lib/jupiter/trigger';

export async function POST(request: Request) {
  try {
    const { walletPublicKey } = await request.json();
    const challenge = await getTriggerChallenge(walletPublicKey);
    return NextResponse.json({ challenge });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

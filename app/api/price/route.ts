import { NextResponse } from 'next/server';
import { fetchSolPrice } from '@/lib/jupiter/price';

export async function GET() {
  try {
    const data = await fetchSolPrice();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API Price Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch price' },
      { status: 500 }
    );
  }
}

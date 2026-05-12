import { NextResponse } from 'next/server';
import { getTokenMetadata } from '@/lib/jupiter/tokens';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    const mints = query.split(',');
    const metadata = await getTokenMetadata(mints);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('[API Tokens Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch token metadata' },
      { status: 500 }
    );
  }
}

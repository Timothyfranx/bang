import { PriceData } from '@/types/jupiter';

const JUPITER_PRICE_API_V3 = 'https://api.jup.ag/price/v3';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function fetchSolPrice(): Promise<PriceData> {
  const apiKey = process.env.JUPITER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('JUPITER_API_KEY is not defined in environment variables');
  }

  try {
    const response = await fetch(`${JUPITER_PRICE_API_V3}?ids=${SOL_MINT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey
      },
      // Caching rule: 10 seconds minimum
      next: { revalidate: 10 } 
    });

    if (!response.ok) {
      let errorDetail = response.statusText;
      try {
        const error = await response.json();
        errorDetail = error.message || errorDetail;
      } catch {
        // Fallback if response is not JSON
      }
      throw new Error(`Jupiter Price API error ${response.status}: ${errorDetail}`);
    }

    const text = await response.text();
    if (!text) {
      throw new Error('Jupiter Price API returned an empty response');
    }

    let result: Record<string, unknown>;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('Failed to parse Jupiter Price API response as JSON');
    }

    const data = (result.data || result) as Record<string, { id?: string; price?: string | number; usdPrice?: string | number }>;
    const solData = data[SOL_MINT];

    const rawPrice = solData?.usdPrice ?? solData?.price;

    if (!solData || rawPrice === undefined || rawPrice === null) {
      throw new Error('SOL price data not found or invalid in Jupiter response');
    }

    const price = Number(rawPrice);
    if (isNaN(price)) {
      throw new Error('Jupiter Price API returned an invalid price value');
    }

    return {
      id: solData.id || SOL_MINT,
      price: price
    };
  } catch (err) {
    console.error('[Jupiter Price API]', err);
    throw err;
  }
}

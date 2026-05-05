import { JupiterPriceResponse, PriceData } from '@/types/jupiter';

const JUPITER_PRICE_API_V3 = 'https://api.jup.ag/price/v3/price';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function fetchSolPrice(): Promise<PriceData> {
  const apiKey = process.env.JUPITER_API_KEY;
  if (!apiKey) {
    throw new Error('JUPITER_API_KEY is not defined in environment variables');
  }

  try {
    const response = await fetch(`${JUPITER_PRICE_API_V3}?ids=${SOL_MINT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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

    let result: JupiterPriceResponse;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error('Failed to parse Jupiter Price API response as JSON');
    }

    const solData = result.data[SOL_MINT];

    if (!solData) {
      throw new Error('SOL price data not found in Jupiter response');
    }

    return {
      id: solData.id,
      price: parseFloat(solData.price)
    };
  } catch (err) {
    console.error('[Jupiter Price API]', err);
    throw err;
  }
}

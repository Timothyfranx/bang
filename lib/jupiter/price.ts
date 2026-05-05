import { JupiterPriceResponse, PriceData } from '@/types/jupiter';

const JUPITER_PRICE_API_V2 = 'https://api.jup.ag/price/v2';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

export async function fetchSolPrice(): Promise<PriceData> {
  try {
    const response = await fetch(`${JUPITER_PRICE_API_V2}?ids=${SOL_MINT}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Caching rule: 10 seconds minimum
      next: { revalidate: 10 } 
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Jupiter Price API error ${response.status}: ${error.message || response.statusText}`);
    }

    const result: JupiterPriceResponse = await response.json();
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

const JUPITER_TOKENS_API = 'https://api.jup.ag/tokens/v2';

export interface TokenMetadata {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  daily_volume?: number;
  freeze_authority?: string | null;
  mint_authority?: string | null;
  permanent_delegate?: string | null;
  minted_at?: string | null;
  organic_score?: number;
}

export async function getTokenMetadata(mints: string[]): Promise<TokenMetadata[]> {
  if (mints.length === 0) return [];
  
  const query = mints.join(',');
  const response = await fetch(`${JUPITER_TOKENS_API}/search?query=${query}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'x-api-key': (process.env.JUPITER_API_KEY || '').split('').filter(c => c.charCodeAt(0) > 31 && c.charCodeAt(0) < 127).join('')
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('[Jupiter Tokens API Error]', error);
    return [];
  }

  const data = await response.json().catch(() => []);
  return data;
}

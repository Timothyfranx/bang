import { Connection, PublicKey } from '@solana/web3.js';
import { getSolBalance, getTokenBalances } from './balance';
import { TokenMetadata } from '../jupiter/tokens';

export interface SweepAsset {
  mint: string;
  symbol: string;
  uiAmount: number;
  decimals: number;
  organicScore?: number;
  isSafe: boolean;
}

export async function identifySweepAssets(
  connection: Connection,
  sessionPublicKey: PublicKey
): Promise<SweepAsset[]> {
  const solBalance = await getSolBalance(connection, sessionPublicKey);
  const splBalances = await getTokenBalances(connection, sessionPublicKey);
  
  const SOL_MINT = 'So11111111111111111111111111111111111111112';
  
  const assets: SweepAsset[] = [];

  // Add SOL if balance exists
  if (solBalance > 0.001) { // Leave a tiny bit for rent or just sweep all
    assets.push({
      mint: SOL_MINT,
      symbol: 'SOL',
      uiAmount: solBalance,
      decimals: 9,
      organicScore: 100,
      isSafe: true
    });
  }

  if (splBalances.length === 0) return assets;

  const mints = splBalances.map(b => b.mint);
  const response = await fetch(`/api/tokens?query=${mints.join(',')}`);
  const metadataList: TokenMetadata[] = await response.json();

  const splAssets = splBalances.map(balance => {
    const metadata = metadataList.find(m => m.mint === balance.mint);
    const score = metadata?.organicScore || 0;
    
    return {
      mint: balance.mint,
      symbol: metadata?.symbol || 'UNKNOWN',
      uiAmount: balance.uiAmount,
      decimals: balance.decimals,
      organicScore: score,
      isSafe: score >= 70 // Threshold defined in GEMINI.md
    };
  });

  return [...assets, ...splAssets];
}

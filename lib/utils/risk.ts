import { WhaleTrade, RiskAssessment } from '@/types/ghost';
import { getTokenMetadata } from '@/lib/jupiter/tokens';

export async function assessTradeRisk(trade: WhaleTrade): Promise<RiskAssessment> {
  const reasons: string[] = [];
  
  // 1. Check Organic Score (Trust signal)
  let organicScore = 0;
  try {
    const metadata = await getTokenMetadata([trade.outputMint]);
    if (metadata && metadata.length > 0) {
      organicScore = metadata[0].organic_score || 0;
    }
  } catch (err) {
    console.error('Failed to fetch organic score for risk assessment', err);
  }

  if (organicScore < 70) {
    reasons.push(`Low organic score: ${organicScore}/100`);
  }

  // 2. Mock Liquidity and Price Impact for now
  // Real implementation would call Jupiter Quote API with the whale's amount
  const priceImpact = 0.5; // Mock 0.5%
  const liquidityUSD = 500000; // Mock $500k

  if (priceImpact > 2) {
    reasons.push(`High price impact: ${priceImpact}%`);
  }

  if (liquidityUSD < 10000) {
    reasons.push(`Low liquidity: $${liquidityUSD.toLocaleString()}`);
  }

  const level = reasons.length === 0 ? 'safe' : reasons.length === 1 ? 'caution' : 'danger';
  const recommendation = level === 'safe' ? 'mirror' : level === 'caution' ? 'warn' : 'skip';

  return {
    level,
    reasons,
    recommendation,
    priceImpact,
    liquidityUSD,
    organicScore
  };
}

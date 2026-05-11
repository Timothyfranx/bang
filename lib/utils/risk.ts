import { WhaleTrade, RiskAssessment } from '@/types/ghost';
import { getQuote } from '@/lib/jupiter/swap';
import { getTokenMetadata } from '@/lib/jupiter/tokens';

export async function assessTradeRisk(trade: WhaleTrade): Promise<RiskAssessment> {
  const reasons: string[] = [];
  
  try {
    // 1. Check Price Impact via Jupiter Quote
    // We use a small amount to check impact for the user's potential trade
    const amountInLamports = Math.floor(trade.inputAmount * 1e9); // simplified, should use decimals
    const quote = await getQuote(trade.inputMint, trade.outputMint, amountInLamports);
    
    const priceImpact = parseFloat(quote.priceImpactPct);
    
    if (priceImpact > 5) {
      reasons.push(`High price impact: ${priceImpact.toFixed(2)}%`);
    }
    
    // 2. Check Token Organic Score via Tokens API
    const metadataList = await getTokenMetadata([trade.outputMint]);
    const tokenMeta = metadataList[0];
    const organicScore = tokenMeta?.organic_score ?? 0;
    
    if (organicScore < 70) {
      reasons.push(`Low organic score: ${organicScore}/100 — possible shill`);
    }
    
    // 3. Liquidity Depth (Optional, if available in quote)
    // Jupiter v6 quote doesn't explicitly return liquidity in the top level
    // but we can infer from price impact and route plan
    const liquidityUSD = 0; // Placeholder as it's harder to get from basic quote
    
    // Determine overall risk level
    const dangerCount = reasons.length;
    const level = dangerCount === 0 ? 'safe' : dangerCount === 1 ? 'caution' : 'danger';
    const recommendation = level === 'safe' ? 'mirror' : level === 'caution' ? 'warn' : 'skip';
    
    return { 
      level, 
      reasons, 
      recommendation, 
      priceImpact, 
      liquidityUSD, 
      organicScore 
    };
  } catch (err) {
    console.error('[Risk Assessment Error]', err);
    return {
      level: 'danger',
      reasons: ['Failed to assess risk - API error'],
      recommendation: 'skip',
      priceImpact: 0,
      liquidityUSD: 0,
      organicScore: 0
    };
  }
}

import { QuoteResponse } from './jupiter';

export interface RiskAssessment {
  level: 'safe' | 'caution' | 'danger';
  reasons: string[];
  recommendation: 'mirror' | 'skip' | 'warn';
  priceImpact: number;        // percentage
  liquidityUSD: number;
  organicScore: number;       // 0-100 from Jupiter Tokens API
}

export interface WhaleTrade {
  signature: string;
  timestamp: number;
  inputMint: string;
  outputMint: string;
  inputSymbol: string;
  outputSymbol: string;
  inputAmount: number;
  outputAmount: number;
  inputLogo?: string;
  outputLogo?: string;
  walletAddress: string;
}

export interface GhostSignal {
  trade: WhaleTrade;
  risk: RiskAssessment;
  jupiterQuote: QuoteResponse;
  status: 'pending' | 'mirrored' | 'skipped' | 'expired';
  mirrorTxHash?: string;
  entryPriceDiff?: number;    // your price vs whale price
}

export interface GhostState {
  isActive: boolean;
  whaleAddress: string;
  signals: GhostSignal[];
  lastSignature: string | null;
  autoMirror: boolean;         // auto-execute on 'safe' signals
  mirrorPercent: number;       // % of session budget per mirror (default 20%)
}

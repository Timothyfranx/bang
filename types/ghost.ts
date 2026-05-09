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

export interface RiskAssessment {
  level: 'safe' | 'caution' | 'danger';
  reasons: string[];
  recommendation: 'mirror' | 'skip' | 'warn';
  priceImpact: number;
  liquidityUSD: number;
  organicScore: number;
}

export interface GhostSignal {
  trade: WhaleTrade;
  risk: RiskAssessment;
  status: 'pending' | 'mirrored' | 'skipped' | 'expired';
  mirrorTxHash?: string;
  entryPriceDiff?: number;
}

export interface GhostState {
  isActive: boolean;
  whaleAddresses: string[];
  signals: GhostSignal[];
  lastSignature: string | null;
  autoMirror: boolean;
  mirrorPercent: number;
}

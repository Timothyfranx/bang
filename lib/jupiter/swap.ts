const JUPITER_QUOTE_API = 'https://api.jup.ag/swap/v6/quote';
const JUPITER_SWAP_API = 'https://api.jup.ag/swap/v6/swap';

export interface RoutePlan {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

export interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: {
    amount: string;
    feeBps: number;
  };
  priceImpactPct: string;
  routePlan: RoutePlan[];
  contextSlot: number;
  timeTaken: number;
}

export interface SwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports: number;
}

export async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<QuoteResponse> {
  const url = `${JUPITER_QUOTE_API}?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.JUPITER_API_KEY}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Jupiter Quote API error ${response.status}: ${error.message}`);
  }

  return await response.json();
}

export async function getSwapTransaction(
  quoteResponse: QuoteResponse,
  userPublicKey: string,
  destinationWallet?: string,
  wrapAndUnwrapSol: boolean = true
): Promise<SwapResponse> {
  const response = await fetch(JUPITER_SWAP_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JUPITER_API_KEY}`
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey,
      destinationWallet,
      wrapAndUnwrapSol,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Jupiter Swap API error ${response.status}: ${error.message}`);
  }

  return await response.json();
}

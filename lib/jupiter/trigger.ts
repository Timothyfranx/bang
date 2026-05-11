const JUPITER_TRIGGER_API = 'https://api.jup.ag/trigger/v2';

export interface TriggerChallenge {
  challenge: string;
}

export interface TriggerVerifyResponse {
  accessToken: string;
}

export async function getTriggerChallenge(walletPublicKey: string): Promise<string> {
  const response = await fetch(`${JUPITER_TRIGGER_API}/auth/challenge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': (process.env.JUPITER_API_KEY || '').replace(/[^\x20-\x7E]/g, '')
    },
    body: JSON.stringify({
      walletPubkey: walletPublicKey,
      type: 'solana'
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `Status ${response.status}` }));
    throw new Error(`Jupiter Trigger Challenge error: ${error.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.challenge;
}

export async function verifyTriggerSignature(
  walletPublicKey: string,
  signature: string
): Promise<string> {
  const response = await fetch(`${JUPITER_TRIGGER_API}/auth/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': (process.env.JUPITER_API_KEY || '').replace(/[^\x20-\x7E]/g, '')
    },
    body: JSON.stringify({
      type: 'solana',
      walletPubkey: walletPublicKey,
      signature
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `Status ${response.status}` }));
    throw new Error(`Jupiter Trigger Verify error: ${error.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.accessToken;
}

export async function createLimitOrder(
  accessToken: string,
  inputMint: string,
  outputMint: string,
  inAmount: string,
  triggerPrice: string,
  triggerCondition: 'above' | 'below'
) {
  const response = await fetch(`${JUPITER_TRIGGER_API}/orders/price`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': (process.env.JUPITER_API_KEY || '').replace(/[^\x20-\x7E]/g, ''),
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      inputMint,
      outputMint,
      inAmount,
      triggerPrice,
      triggerCondition,
      type: 'single'
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: `Status ${response.status}` }));
    throw new Error(`Jupiter Trigger Order error: ${error.message || 'Unknown error'}`);
  }

  return await response.json();
}

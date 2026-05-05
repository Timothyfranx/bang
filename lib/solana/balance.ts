import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export interface TokenBalance {
  mint: string;
  amount: number;
  decimals: number;
  uiAmount: number;
}

export async function getSolBalance(connection: Connection, publicKey: PublicKey): Promise<number> {
  const balance = await connection.getBalance(publicKey);
  return balance / 1_000_000_000;
}

export async function getTokenBalances(connection: Connection, publicKey: PublicKey): Promise<TokenBalance[]> {
  const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: TOKEN_PROGRAM_ID,
  });

  return response.value.map((account) => {
    const info = account.account.data.parsed.info;
    return {
      mint: info.mint,
      amount: Number(info.tokenAmount.amount),
      decimals: info.tokenAmount.decimals,
      uiAmount: info.tokenAmount.uiAmount,
    };
  }).filter(t => t.uiAmount > 0);
}

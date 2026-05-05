# Capsule

Session-based wallet isolation and risk management layer for Solana, powered by Jupiter APIs.

## The Problem
Interacting with risky dApps (new mints, experimental protocols) often requires connecting a main wallet with significant funds. One malicious transaction can drain the entire vault.

## The Solution
Capsule creates a disposable **Session Wallet** funded with a specific budget from your **Vault Wallet**.
- **Bounded Risk:** Your losses are capped to the session budget.
- **Automated Sweeping:** Safe assets are returned to your vault when the session ends.
- **Token Safety:** Unknown or suspicious tokens are flagged and abandoned.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Solana Wallet Adapter
- Jupiter Swap V2, Price, Tokens, and Trigger APIs

## Getting Started
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up `.env.local`:
   ```
   NEXT_PUBLIC_JUPITER_API_KEY=your_api_key
   ```
4. Run the development server: `npm run dev`

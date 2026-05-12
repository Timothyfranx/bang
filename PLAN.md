# 📋 PLAN.md - Capsule + Ghost Mode
## Agent Build Plan - Jupiter Hackathon

> **Read this file completely before taking any action.**
> This is your task bible for the entire 6-day build.
> Every decision made here has a reason. Do not deviate without asking the human first.

---

## 🧠 What You Are Building

**Capsule** is a session-based wallet isolation layer for Solana.
**Ghost Mode** is Capsule's killer feature - a whale-following engine with built-in de-risk filters.

### The One-Paragraph Summary

> "Capsule lets you interact with risky dApps using a temporary Session Wallet funded with a fixed budget from your Vault Wallet. Ghost Mode watches a whale wallet on-chain - when they trade, Capsule shows you the trade enriched with Jupiter's price impact, liquidity depth, and token safety score. One click mirrors the trade using your session budget. The session keypair signs instantly. Your vault never moves."

### What Makes It Win

- **Security narrative** - session isolation is genuinely novel as a security primitive
- **Ghost Mode** - whale following with de-risk filters nobody else has
- **Four Jupiter APIs** - Swap V2, Price, Tokens, Trigger - all genuinely used
- **DX Report** - 35% of judging, richest material comes from deep API integration
- **Demo control** - you simulate the whale, demo never fails

---

## 🗂️ File Structure - Build Exactly This

```
capsule/
│
├── GEMINI.md                        ← Agent operating manual (already exists)
├── PLAN.md                          ← THIS FILE
├── SUMMARY.md                       ← Living project log (update every branch/commit)
├── DX-REPORT.md                     ← Developer Experience Report (update daily)
├── README.md                        ← Project overview for judges
├── DESIGN.md                        ← Design system reference (already exists)
│
├── .env.local                       ← Never commit. Never log.
├── .env.example                     ← Commit this. Keep in sync.
│
├── app/
│   ├── layout.tsx                   ← Root layout. Providers wrap here.
│   ├── page.tsx                     ← Landing page (/)
│   ├── dashboard/
│   │   └── page.tsx                 ← Main dashboard (/dashboard)
│   └── vault/
│       └── page.tsx                 ← Vault + limit orders (/vault)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── session/
│   │   ├── SessionCard.tsx          ← Active session: timer, budget, status
│   │   ├── StartSession.tsx         ← Budget input + activity type selector
│   │   └── SweepButton.tsx          ← Manual sweep. Always visible in session.
│   ├── ghost/
│   │   ├── GhostPanel.tsx           ← Ghost Mode container
│   │   ├── WhaleInput.tsx           ← Input whale wallet address
│   │   ├── GhostToggle.tsx          ← The ON/OFF toggle switch
│   │   ├── WhaleFeed.tsx            ← Live feed of whale's transactions
│   │   ├── TradeCard.tsx            ← Single trade card with Jupiter enrichment
│   │   ├── RiskBadge.tsx            ← Price impact + liquidity risk indicator
│   │   └── PnLDisplay.tsx           ← Your entry vs whale entry comparison
│   ├── vault/
│   │   ├── VaultBalance.tsx
│   │   ├── LimitOrderForm.tsx       ← Jupiter Trigger integration
│   │   └── TokenList.tsx
│   ├── shared/
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Spinner.tsx
│   │   └── AddressDisplay.tsx       ← Truncated address with copy button
│   └── providers/
│       ├── WalletProvider.tsx       ← Solana Wallet Adapter
│       └── SessionProvider.tsx      ← Session state context
│
├── lib/
│   ├── jupiter/
│   │   ├── swap.ts                  ← Swap V2: /order + /execute
│   │   ├── price.ts                 ← Price API: token USD prices
│   │   ├── tokens.ts                ← Tokens API: metadata + organic score
│   │   └── trigger.ts               ← Trigger API: limit orders
│   ├── solana/
│   │   ├── wallet.ts                ← Session keypair generation + storage
│   │   ├── balance.ts               ← SOL + SPL token balance fetching
│   │   ├── sweep.ts                 ← Sweep orchestration
│   │   └── watcher.ts               ← Whale wallet transaction watcher (polling)
│   └── utils/
│       ├── format.ts                ← Address truncation, numbers, time
│       ├── storage.ts               ← Encrypted sessionStorage operations
│       ├── risk.ts                  ← De-risk filter logic
│       └── constants.ts             ← API URLs, thresholds, token addresses
│
├── hooks/
│   ├── useSession.ts                ← Session state, timer, budget
│   ├── useVault.ts                  ← Vault balances
│   ├── useGhost.ts                  ← Ghost Mode state + whale watching
│   ├── useJupiterPrice.ts           ← Price API with 10s cache
│   ├── useTokenMetadata.ts          ← Tokens API metadata
│   └── useLimitOrder.ts             ← Trigger API order management
│
└── types/
    ├── session.ts
    ├── ghost.ts                     ← WhaleTransaction, GhostSignal, RiskLevel
    ├── jupiter.ts
    └── token.ts
```

---

## ⚙️ Feature Specifications

---

### Feature 1 - Session Lifecycle

**What it does:** Funds a temporary session wallet from vault, tracks budget and timer, sweeps assets back at end.

**Technical implementation:**

```typescript
// lib/solana/wallet.ts
import { Keypair } from '@solana/web3.js';

export function generateSessionKeypair(): Keypair {
  return Keypair.generate();
}

export function storeSessionKeypair(keypair: Keypair, vaultPubkey: string): void {
  // XOR encrypt with vault pubkey as salt - simple, not production-grade, honest about it
  const encrypted = simpleEncrypt(keypair.secretKey, vaultPubkey);
  sessionStorage.setItem('capsule_session_key', encrypted);
  sessionStorage.setItem('capsule_session_pubkey', keypair.publicKey.toBase58());
}

export function loadSessionKeypair(vaultPubkey: string): Keypair | null {
  const encrypted = sessionStorage.getItem('capsule_session_key');
  if (!encrypted) return null;
  const secretKey = simpleDecrypt(encrypted, vaultPubkey);
  return Keypair.fromSecretKey(secretKey);
}

export function clearSessionKeypair(): void {
  sessionStorage.removeItem('capsule_session_key');
  sessionStorage.removeItem('capsule_session_pubkey');
}
```

**Session state shape:**

```typescript
// types/session.ts
export type SessionStatus = 'idle' | 'funding' | 'active' | 'sweeping' | 'complete';
export type ActivityType = 'trading' | 'minting' | 'browsing' | 'ghost';

export interface Session {
  status: SessionStatus;
  activity: ActivityType;
  budgetUSD: number;
  budgetSOL: number;
  sessionPubkey: string;
  vaultPubkey: string;
  startedAt: number;         // timestamp
  expiresAt: number;         // timestamp
  amountSpent: number;       // USD
  amountRemaining: number;   // USD
}
```

**Session flow - step by step:**

```
Step 1: User inputs budget ($50) and activity ("Ghost Mode")
Step 2: useJupiterPrice fetches SOL/USD → calculates SOL equivalent
Step 3: generateSessionKeypair() → new Keypair
Step 4: storeSessionKeypair() → encrypted in sessionStorage
Step 5: jupiterSwap() → vault sends budget SOL to session wallet
        → User signs THIS transaction with Phantom (only Phantom interaction)
Step 6: Session status = 'active'. Timer starts.
Step 7: Ghost Mode activates automatically if activity = 'ghost'
```

---

### Feature 2 - Ghost Mode (The Killer Feature)

**What it does:** Watches a whale wallet. When they trade, enriches the signal with Jupiter data and de-risk filters. User decides to mirror or skip.

**Important architecture decision - NO websockets for v1:**

Websockets to watch Solana wallets require Helius/Alchemy paid plans and are unreliable in demos. Use **polling** instead:

```typescript
// lib/solana/watcher.ts
export async function pollWalletTransactions(
  walletAddress: string,
  lastSignature: string | null,
  rpcUrl: string
): Promise<WhaleTrade[]> {
  const connection = new Connection(rpcUrl);
  
  const signatures = await connection.getSignaturesForAddress(
    new PublicKey(walletAddress),
    { limit: 5, before: lastSignature ?? undefined }
  );
  
  // Filter for new transactions only
  const newSigs = lastSignature
    ? signatures.filter(s => s.signature !== lastSignature)
    : signatures.slice(0, 1); // First run: just the latest
  
  const trades: WhaleTrade[] = [];
  
  for (const sig of newSigs) {
    const tx = await connection.getParsedTransaction(sig.signature);
    const trade = parseJupiterSwap(tx); // extract swap details
    if (trade) trades.push(trade);
  }
  
  return trades;
}
```

Poll every **5 seconds** using `setInterval` in `useGhost.ts`. This is reliable and demo-safe.

**The de-risk filter - run this on EVERY whale trade before showing to user:**

```typescript
// lib/utils/risk.ts
export interface RiskAssessment {
  level: 'safe' | 'caution' | 'danger';
  reasons: string[];
  recommendation: 'mirror' | 'skip' | 'warn';
  priceImpact: number;        // percentage
  liquidityUSD: number;
  organicScore: number;       // 0-100 from Jupiter Tokens API
}

export async function assessTradeRisk(trade: WhaleTrade): Promise<RiskAssessment> {
  const reasons: string[] = [];
  
  // Check 1: Price impact via Jupiter Quote
  const quote = await getJupiterQuote(trade.inputMint, trade.outputMint, trade.amount);
  const priceImpact = quote.priceImpactPct;
  
  if (priceImpact > 5) {
    reasons.push(`High price impact: ${priceImpact.toFixed(2)}%`);
  }
  
  // Check 2: Token organic score via Tokens API
  const tokenMeta = await getTokenMetadata(trade.outputMint);
  const organicScore = tokenMeta?.organicScore ?? 0;
  
  if (organicScore < 50) {
    reasons.push(`Low organic score: ${organicScore}/100 - possible shill`);
  }
  
  // Check 3: Liquidity depth
  const liquidityUSD = quote.routePlan?.[0]?.swapInfo?.marketInfos?.[0]?.liquidityUsd ?? 0;
  
  if (liquidityUSD < 10000) {
    reasons.push(`Low liquidity: $${liquidityUSD.toLocaleString()} - rug risk`);
  }
  
  // Determine overall risk level
  const dangerCount = reasons.length;
  const level = dangerCount === 0 ? 'safe' : dangerCount === 1 ? 'caution' : 'danger';
  const recommendation = level === 'safe' ? 'mirror' : level === 'caution' ? 'warn' : 'skip';
  
  return { level, reasons, recommendation, priceImpact, liquidityUSD, organicScore };
}
```

**Ghost state shape:**

```typescript
// types/ghost.ts
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
  jupiterQuote: JupiterQuote;
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
```

**The Mirror Trade execution:**

```typescript
// hooks/useGhost.ts
async function mirrorTrade(signal: GhostSignal) {
  const sessionKeypair = loadSessionKeypair(vaultPubkey);
  if (!sessionKeypair) throw new Error('No active session');
  
  // Calculate mirror amount (% of session budget)
  const mirrorAmountSOL = (session.budgetSOL * ghost.mirrorPercent) / 100;
  
  // Get fresh Jupiter quote (whale's quote may be stale)
  const freshQuote = await getJupiterQuote(
    signal.trade.inputMint,
    signal.trade.outputMint,
    mirrorAmountSOL
  );
  
  // Execute swap - session keypair signs, not Phantom
  const txHash = await executeJupiterSwap(freshQuote, sessionKeypair);
  
  // Update signal status
  updateSignal(signal.trade.signature, {
    status: 'mirrored',
    mirrorTxHash: txHash,
    entryPriceDiff: calculatePriceDiff(signal.jupiterQuote, freshQuote)
  });
  
  toast.success(`Mirrored trade · View on Solscan ↗`, { txHash });
}
```

---

### Feature 3 - Multi-Ghost (Crowdsourced Confirmation)

**What it does:** User inputs 3 whale addresses. Ghost only triggers if 2 of 3 buy the same token within 5 minutes.

**Implementation:**

```typescript
// lib/utils/multiGhost.ts
interface MultiGhostConfig {
  whaleAddresses: string[];   // exactly 3
  requiredConfirmations: 2;   // hardcoded
  windowSeconds: 300;         // 5 minutes
}

interface Confirmation {
  whaleAddress: string;
  trade: WhaleTrade;
  timestamp: number;
}

// In-memory store of recent whale trades
const recentTrades: Map<string, Confirmation[]> = new Map();

export function checkMultiGhostSignal(
  newTrade: WhaleTrade,
  config: MultiGhostConfig
): boolean {
  const key = newTrade.outputMint; // token being bought
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  // Get existing confirmations for this token
  const existing = (recentTrades.get(key) || [])
    .filter(c => now - c.timestamp < windowMs)  // within window
    .filter(c => c.whaleAddress !== newTrade.walletAddress); // dedupe
  
  // Add new confirmation
  const updated = [...existing, {
    whaleAddress: newTrade.walletAddress,
    trade: newTrade,
    timestamp: now
  }];
  
  recentTrades.set(key, updated);
  
  // Trigger if 2+ whales bought this token in the window
  return updated.length >= config.requiredConfirmations;
}
```

**Multi-Ghost UI note:** Show each whale as a small avatar/address chip. When 2 of 3 confirm, the signal card glows amber and pulses. Visually satisfying, easy to understand.

---

### Feature 4 - Sweep (Session End)

```typescript
// lib/solana/sweep.ts
export async function sweepSession(
  sessionKeypair: Keypair,
  vaultPubkey: string
): Promise<SweepResult> {
  const connection = new Connection(RPC_URL);
  const swept: string[] = [];
  const abandoned: string[] = [];
  
  // 1. Get all token accounts in session wallet
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    sessionKeypair.publicKey,
    { programId: TOKEN_PROGRAM_ID }
  );
  
  for (const account of tokenAccounts.value) {
    const mint = account.account.data.parsed.info.mint;
    const balance = account.account.data.parsed.info.tokenAmount.uiAmount;
    
    if (balance === 0) continue;
    
    // 2. Check organic score via Jupiter Tokens API
    const meta = await getTokenMetadata(mint);
    
    if (!meta || meta.organicScore < 70) {
      // Suspicious - abandon
      abandoned.push(mint);
      continue;
    }
    
    // 3. Swap safe token → SOL via Jupiter Swap V2
    const quote = await getJupiterQuote(mint, SOL_MINT, balance);
    await executeJupiterSwap(quote, sessionKeypair);
    swept.push(mint);
  }
  
  // 4. Send remaining SOL to vault
  const solBalance = await connection.getBalance(sessionKeypair.publicKey);
  const transferAmount = solBalance - LAMPORTS_FOR_FEES; // leave enough for tx fee
  
  if (transferAmount > 0) {
    await sendSOL(sessionKeypair, vaultPubkey, transferAmount);
  }
  
  // 5. Clear session
  clearSessionKeypair();
  
  return { swept, abandoned, solReturned: transferAmount / LAMPORTS_PER_SOL };
}
```

---

### Feature 5 - Vault Limit Orders (Jupiter Trigger)

```typescript
// lib/jupiter/trigger.ts
export async function placeLimitOrder(params: {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  targetPrice: number;
  userPubkey: string;
}): Promise<string> {
  const response = await fetch('https://api.jup.ag/trigger/v1/createOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`
    },
    body: JSON.stringify({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      maker: params.userPubkey,
      payer: params.userPubkey,
      params: {
        makingAmount: params.inputAmount.toString(),
        takingAmount: calculateTakingAmount(params.inputAmount, params.targetPrice).toString()
      },
      computeUnitPrice: 'auto'
    })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Trigger API error: ${err.message}`);
  }
  
  const { order, tx } = await response.json();
  
  // User signs with Phantom (vault wallet)
  // Return order ID for tracking
  return order.orderPubkey;
}
```

---

## 🌐 Jupiter API Reference

### Base URL
```
https://api.jup.ag
```

### Authentication
```typescript
headers: {
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Endpoints Used

#### Swap V2 - Fund and Sweep
```
POST /swap/v1/order      → Get swap transaction
POST /swap/v1/execute    → Execute swap transaction
```

#### Price API - Budget Calculation
```
GET /price/v2?ids={mintAddress}
GET /price/v2?ids={mint1},{mint2},{mint3}
```
Cache responses for **minimum 10 seconds**. Never call on every render.

#### Tokens API - Safety Check
```
GET /tokens/v1/{mintAddress}
```
Returns: `{ organicScore, symbol, name, logoURI, verified, ... }`
Organic score < 70 = flag and abandon during sweep.

#### Trigger API - Limit Orders
```
POST /trigger/v1/createOrder
GET  /trigger/v1/orders?user={pubkey}
DELETE /trigger/v1/cancelOrder
```

### Error Handling - Every API Call Must Follow This Pattern
```typescript
async function callJupiterAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_JUPITER_API_KEY}`,
        ...options?.headers
      }
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      // LOG FOR DX REPORT
      console.error(`[Jupiter API] ${response.status} on ${url}:`, error);
      throw new Error(`Jupiter ${response.status}: ${error.message || JSON.stringify(error)}`);
    }
    
    return response.json();
  } catch (err) {
    // Re-throw - caller handles UX
    throw err;
  }
}
```

---

## 🗓️ 6-Day Build Plan - Day by Day

---

### DAY 1 - Foundation + First API Call + Submit Draft

**Goal:** Working environment, first Jupiter API call, draft submitted on Superteam Earn.

**Morning (setup):**
```bash
npx create-next-app@latest capsule --typescript --tailwind --app
cd capsule
npm install @solana/web3.js @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui @solana/wallet-adapter-phantom \
  @solana/wallet-adapter-base react-hot-toast

git init
git add . && git commit -m "chore(init): bootstrap Next.js with TypeScript and Tailwind"

touch GEMINI.md PLAN.md SUMMARY.md DX-REPORT.md README.md DESIGN.md
git add . && git commit -m "docs: add project documentation scaffolds"
```

**Afternoon (first feature):**

Branch: `feature/jupiter-price-api`
- Implement `lib/jupiter/price.ts`
- Display SOL price on landing page - real data, no mock
- Document in DX-REPORT.md: time to first successful call, any confusion

**Evening:**
- Submit draft on Superteam Earn - title, 2 sentence description, GitHub link
- Update SUMMARY.md snapshot
- **DO NOT SKIP THIS. Submit today.**

**Done when:** SOL price appears on screen from real Jupiter API. Draft submitted.

---

### DAY 2 - Session Wallet + Funding

**Goal:** Session wallet generation, funding flow, Phantom signs once.

Branch: `feature/session-wallet-generation`
- Implement `lib/solana/wallet.ts` - generate, store, load, clear
- Implement `components/session/StartSession.tsx` - budget input + activity selector
- Wire Price API → show SOL equivalent of USD input in real time

Branch: `feature/session-funding`
- Implement `lib/jupiter/swap.ts` - Swap V2 `/order` + `/execute`
- Fund session wallet from vault on "Start Session"
- Show funding confirmation with Solscan link
- Document Swap V2 experience in DX-REPORT.md

**Done when:** User clicks Start Session, Phantom pops up once, session wallet is funded, balance visible on dashboard.

---

### DAY 3 - Ghost Mode Core

**Goal:** Whale watching, trade detection, risk assessment, signal card.

Branch: `feature/whale-watcher`
- Implement `lib/solana/watcher.ts` - polling every 5 seconds
- Parse Jupiter swap transactions from whale wallet
- Test with a known active wallet (find one on Birdeye)
- Document RPC quirks in DX-REPORT.md

Branch: `feature/de-risk-filter`
- Implement `lib/utils/risk.ts` - price impact + organic score + liquidity
- Implement `components/ghost/RiskBadge.tsx`
- Implement `components/ghost/TradeCard.tsx` with risk data

Branch: `feature/ghost-mirror`
- Implement mirror trade execution using session keypair
- Wire "Mirror Trade" button to Jupiter Swap V2
- Show entry price vs whale entry price

**Done when:** Whale trade appears in feed with risk badge. Mirror button executes real swap using session key.

---

### DAY 4 - Multi-Ghost + Ghost UI Polish

**Goal:** Multi-whale confirmation logic, Ghost dashboard UI.

Branch: `feature/multi-ghost`
- Implement `lib/utils/multiGhost.ts`
- Support 3 whale addresses
- Signal only fires on 2/3 confirmation within 5 min window
- Show confirmation progress in UI (whale 1 ✅, whale 2 ✅, whale 3 ⏳)

Branch: `feature/ghost-ui`
- Implement `components/ghost/GhostPanel.tsx` - full Ghost dashboard
- Implement `components/ghost/GhostToggle.tsx` - the ON/OFF switch
- Implement `components/ghost/WhaleFeed.tsx` - live signal feed
- Implement `components/ghost/PnLDisplay.tsx` - your entry vs whale entry

**Done when:** Ghost panel shows multi-whale confirmation. Toggle activates/deactivates monitoring. PnL displays after mirror.

---

### DAY 5 - Vault + Sweep + Limit Orders

**Goal:** Sweep logic, vault page, Jupiter Trigger limit orders.

Branch: `feature/sweep`
- Implement `lib/solana/sweep.ts`
- Tokens API organic score check on every token
- Jupiter Swap V2 to convert safe tokens → SOL → vault
- Show sweep summary: tokens swept, tokens abandoned, SOL returned

Branch: `feature/vault-page`
- Implement `/vault` page
- Show vault balance and token holdings via Tokens API
- Implement `components/vault/LimitOrderForm.tsx`
- Wire Jupiter Trigger API for limit orders

Branch: `feature/tokens-metadata`
- Token logos, names, symbols from Tokens API throughout app
- Organic score visible on all token displays

**Done when:** End session → sweep executes → summary shown. Vault page shows holdings. Limit order placed from vault.

---

### DAY 6 - DX Report + README + Demo + Submit

**Goal:** Final submission. Everything done by midday.

**Morning:**

Branch: `docs/dx-report-final`
- Complete DX-REPORT.md - every API surface documented honestly
- Specific error messages, confusing behaviors, missing docs
- AI stack section - what helped, what didn't
- "If we built developers.jup.ag" section - specific actionable changes

Branch: `docs/readme-final`
- Complete README.md with:
  - Project description
  - Architecture diagram (text-based is fine)
  - Setup instructions
  - Jupiter APIs used and why
  - Known limitations (honest)
  - Demo video link

**Afternoon:**
- Record 3-4 minute demo video
- Update Superteam Earn submission with final repo, video, DX report link
- Final git push - confirm repo is public

**Done when:** Superteam Earn submission is complete with all required links.

---

## 🔐 Environment Variables

```bash
# .env.local - never commit
NEXT_PUBLIC_JUPITER_API_KEY=your_key_here
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# For development/demo use devnet:
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
# NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

```bash
# .env.example - commit this
NEXT_PUBLIC_JUPITER_API_KEY=
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_SOLANA_NETWORK=
```

---

## 🚨 Known Limitations - Be Honest About These

Document every item below in DX-REPORT.md and README.md.

| Limitation | Honest Explanation |
|---|---|
| Session keypair in sessionStorage | Cleared on browser close. Not production-grade. Roadmap: hardware wallet signing. |
| Polling not websockets | Polling every 5s has up to 5s latency. Not same-block execution. Honest about this. |
| Manual sweep only | No automatic sweep on timeout. User must click. Roadmap: backend automation. |
| Session wallet still drainable | Losses capped to session budget. Cannot prevent bad tx approval. |
| Demo uses simulated whale | Real whale watching works. Demo uses a controlled wallet for reliability. |
| No persistent session state | Refresh loses session. Roadmap: encrypted server-side session storage. |

---

## ✅ Pre-Submission Checklist

```
□ All Jupiter API calls use real data - zero mock responses
□ Session wallet generation works - keypair stored in sessionStorage
□ Funding flow works - Phantom signs one transaction
□ Ghost Mode shows real enriched signals with risk assessment
□ Mirror trade executes with session keypair - not Phantom
□ Sweep works - safe tokens returned to vault
□ Vault page shows real balances via Tokens API
□ Limit order placed via Trigger API
□ DX-REPORT.md is complete - specific, honest, actionable
□ README.md has setup instructions, architecture, limitations
□ SUMMARY.md is up to date
□ .env.example is committed, .env.local is gitignored
□ Repo is public on GitHub
□ Demo video recorded and uploaded
□ Superteam Earn submission updated with all links
□ Email tied to Developer Platform account included in submission
□ Draft was submitted on Day 1 (not Day 6)
```

---

## 📝 DX-REPORT.md - What to Log Every Day

The DX Report is **35% of judging**. Write one honest entry every time something surprises you.

**Template for each finding:**

```markdown
### [API Name] - [Date]

**What I was trying to do:**
[one sentence]

**What happened:**
[exact error message or behavior]

**How long it took to resolve:**
[time]

**What the docs said:**
[accurate / missing / wrong - link to specific page]

**What I'd change:**
[specific, actionable suggestion]
```

**Minimum entries required:**
- Swap V2 `/order` vs `/execute` split - why two calls? document the friction
- Price API caching - did you hit rate limits? document it
- Tokens API organic score - is the threshold documented? how did you find it?
- Trigger API - any missing documentation on parameter formats?
- AI stack - Skills, CLI, Docs MCP - what actually helped?

---

*This plan is the agent's task bible. Do not deviate without human approval.*
*Every branch, every commit, every API finding goes into SUMMARY.md and DX-REPORT.md.*
*Submit on Superteam Earn on Day 1. Update daily. Win.*

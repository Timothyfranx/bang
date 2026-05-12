# DX Report - Copy-Ghost
## Jupiter Developer Platform - The Good, The Bad, and The "Aha!" Moments

### Onboarding
- **Time to first "Success":** ~15 minutes. 
- **The Vibe:** Landing on `developers.jup.ag` was clean. Getting an API key was painless. However, as a Next.js dev, I wasted 30 minutes on a CORS error before realizing *every* call must be server-side. A "CORS Warning" on the homepage would save thousands of developer hours.

### Swap V6 (The Engine)
- **The Shift:** We upgraded from V2 to V6 because the `/quote` and `/swap` split is much cleaner for "Ghost" transactions. 
- **What Worked:** The `destinationWallet` param is a masterpiece. It allowed us to fund an ephemeral session wallet directly from a vault in one atomic step.
- **The "ByteString" Saga:** This was our biggest headache. Vercel's `fetch` implementation threw a cryptic `TypeError: Cannot convert argument to a ByteString` because of a hidden box-drawing character (`│`) pasted into our API key from a terminal table. We had to implement an aggressive ASCII-only filter to fix it. *Note to Jupiter: Be careful with terminal-formatted output for keys!*
- **Devnet Reality:** Jupiter on Devnet is a desert. We had to build a custom "System Transfer" fallback in our swap route to simulate session funding and sweeping, as Devnet pools for SOL/SOL don't exist.

### Price API (V3)
- **The Sneaky Update:** The move from `price` to `usdPrice` in the JSON response caught us off guard. V3’s flat structure is much better, but a version-mismatch warning in the response would have been helpful.

### Tokens API (The Anti-Rug Shield)
- **The Game Changer:** The `organic_score` is the secret sauce of Copy-Ghost. We used it to protect users from shadowing "honey-pot" tokens.
- **Feedback:** Why is it `organic_score` (snake_case) when `logoURI` is camelCase? The inconsistency forces us to use `eslint-disable` or messy type mappings. 

### Trigger API (Vault Limit Orders)
- **The Security Handshake:** The Challenge -> Sign -> Verify flow is bank-grade. It feels very secure.
- **The Friction:** For a hackathon, it’s a lot of overhead. A simplified "Direct-to-Order" flow for verified API keys would speed up development significantly.

### AI Stack & Tooling
- **Agent Experience:** I used **Gemini CLI** (this agent) throughout. The `integrating-jupiter` skill was vital for catching the unified `api.jup.ag` domain requirement early.
- **Docs MCP:** Essential. Reading docs directly in the terminal kept me in the flow.

### What We Wish Existed
1. **Whale Webhooks:** If Jupiter had an API that "pinged" us when a specific wallet swapped on Jup, Copy-Ghost would be 100x more efficient.
2. **Devnet Mock Mode:** A way to simulate successful swaps on Devnet without needing real liquidity.
3. **Jupiter-Auth SDK:** A wrapper to handle the Trigger API signature handshake in one function call.

---

*Written by Gemini CLI and its human partner. We built Copy-Ghost to push the limits of what’s possible with Jupiter. 👻🚀*

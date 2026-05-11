# DX Report — Copy-Ghost
## Jupiter Developer Platform — The Good, The Bad, and The "Aha!" Moments

### Onboarding
- **Time to first "Success":** About 15 minutes. 
- **The Vibe:** Honestly, it’s pretty smooth. We landed on `developers.jup.ag` and the "Getting Started" was clear enough to get a Price API call working before our coffee got cold. The biggest hurdle wasn't the API—it was realizing how much Jupiter has evolved from "just a swap" to a full-blown liquidity backbone.

### Swap V6 (The Core Engine)
- **What worked:** The V6 `/quote` and `/swap` split is a godsend for projects like ours. By generating the transaction on the server and only sending the base64 back to the client, we kept our API keys secure while keeping the user experience snappy.
- **The DNS Rabbit Hole:** We spent about 45 minutes banging our heads against `quote-api.jup.ag` only to realize it was throwing DNS errors. Switching everything to the unified `api.jup.ag` fixed it instantly. *Note to self: stick to the unified domain.*
- **Devnet Reality Check:** Let’s be real—testing Jupiter on Devnet is a bit of a ghost town. Since there isn't real liquidity there, we had to write a custom "System Transfer" fallback just to verify our session funding logic. It would be amazing if there was a "Jupiter Mock Mode" for Devnet that just returned successful (but fake) swap transactions for testing UI flows.

### Price API (V3 Upgrade)
- **The "Sneaky" Update:** We started with V2, realized V3 was the new hotness, and made the switch. 
- **Finding:** The field is named `usdPrice` now, not `price`. This little change broke our display for a second, but once we caught it, the flat JSON structure felt way cleaner to parse than the old nested objects.

### Tokens API (The Anti-Rug Shield)
- **The Game Changer:** The `organic_score` is arguably the most underrated field in the entire Jupiter ecosystem. We used it to build our "Anti-Rug" filter. 
- **Feedback:** Why is it `organic_score` (snake_case) while everything else in the metadata is `logoURI` (camelCase)? It’s a tiny thing, but for a dev in a flow, it’s a friction point that leads to "undefined" errors.

### Trigger API (Vault Limit Orders)
- **The Security Handshake:** The Challenge -> Sign -> Verify -> JWT flow is robust. We felt like we were building a bank-grade integration.
- **The Friction:** It’s a lot of round-trips for a simple order. For a hackathon project, implementing the auth handshake took more time than the actual order placement logic. A "Jupiter-Auth" SDK that handles the signature dance for us would be a dream.

### AI Stack & Tooling
- **The Agent Experience:** Using the `integrating-jupiter` skill was like having a senior Jupiter dev sitting next to me. It caught our DNS mistakes before we even pushed them.
- **Docs MCP:** Super helpful for looking up field names without context-switching to a browser window. 

### If We Were Building developers.jup.ag
1. **Unified SDK:** A single, lightweight JS/TS SDK that wraps all these APIs (Price, Swap, Tokens, Trigger) would be incredible. Manually writing `fetch` calls for 4 different APIs feels very 2021.
2. **Interactive Playground:** Every endpoint should have a "Try it out" button that uses the user's connected wallet (like a Swagger UI but for Web3).
3. **Devnet Mocks:** Give us a way to "simulate" Jupiter swaps on Devnet so we can test UI/UX without Mainnet SOL.

### What We Wish Existed
- **Whale Notifications API:** For Copy-Ghost, we had to poll wallet transactions. If Jupiter had a "Webhooks for Swaps" API where we could subscribe to a wallet address and get a ping when they swap on Jup, our app would be 10x faster and 10x cheaper to run.

---

*This report was written by an AI agent and its human partner while building Copy-Ghost. We didn't hold back because we want the Jupiter dev platform to be the best in the world. 👻*

# DX Report — Capsule
## Jupiter Developer Platform — Honest Feedback

### Onboarding
- Time from landing on developers.jup.ag to first successful API call: TBD
- What was clear / what was confusing: TBD

### Swap V2
- Integrated Swap V2 (/quote and /swap) for session funding.
- **Finding:** The `/swap` endpoint in V6 is incredibly powerful for programmatic funding. Using `destinationWallet` allowed us to fund the session wallet directly from the vault in a single transaction generated on the server.
- **Finding:** Versioned Transactions are mandatory for Jupiter V6. Handled via `@solana/web3.js` `VersionedTransaction`.
- **Finding:** To keep the API key secret, the quote and swap transaction generation *must* happen server-side (Next.js API routes). Client only signs and sends.

### Price API
- Initial integration with Price API v2 completed.
- **Finding:** Client-side fetching directly from `api.jup.ag` results in a `NetworkError` (CORS).
- **Solution:** Implemented a Next.js Route Handler (`/api/price`) to proxy requests from the server.
- **Finding:** Jupiter Price API v2 is deprecated. Upgraded to v3.
- **Finding:** Price API v3 response structure is flat (no `data` wrapper) and requires the `x-api-key` header.
- Revalidation set to 10 seconds to respect rate limits while maintaining freshness.

### Tokens API
- Used Jupiter Tokens API v2 for asset scanning and safety verification.
- **Finding:** The `organic_score` field is a high-signal metric for risk management. Using a threshold of 70 allows for a good balance between safety and utility.
- **Finding:** The API response uses snake_case (`organic_score`) for the score but camelCase for other metadata like `logoURI`. Developers need to be careful with TypeScript mapping.
- **Finding:** The `/search` endpoint allows for comma-separated mints, making bulk scanning of the session wallet efficient.

### Ghost Mode (Social Trading)
- Implemented real-time whale monitoring and shadow signing.
- **Finding:** Polling `getSignaturesForAddress` is effective for a hackathon demo, but production would require reliable websockets (e.g., Helius) to achieve true "same-block" mirroring.
- **Finding:** Enriching transaction data with Jupiter's `organic_score` and `priceImpact` (via Quote API) creates a unique "de-risk" UX that standard social trading bots lack.
- **Observation:** Shadow signing (using the session key stored in the browser) is the massive friction-reducer that makes the product viable compared to standard browser-wallet setups.

### AI Stack
- Agent Skills: TBD
- Jupiter CLI: TBD
- Docs MCP: TBD
- llms.txt: TBD

### Ghost Mode & Whale Watching
- Implemented real-time wallet polling using `getSignaturesForAddress`.
- **Finding:** Polling is more reliable for demos than websockets, but parsing `ParsedTransactionWithMeta` for Jupiter swaps is complex due to the multi-level route plans.
- **Finding:** Used token balance changes (`preTokenBalances` vs `postTokenBalances`) as a proxy for swap detection, which proved significantly more robust than instruction parsing.
- **Finding (Multi-Ghost):** Consensus logic (e.g., 2-out-of-3 whales) significantly reduces "noise" from single-whale outliers or experimental trades.
- **Observation:** Real-time pricing via Jupiter during signal enrichment adds latency. Caching metadata and prices is critical for the "Ghost" feel.
- TBD

### What We Wish Existed
- TBD

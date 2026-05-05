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
- TBD

### Trigger API
- Integrated Jupiter Trigger API for Vault-direct limit orders.
- **Finding:** Authentication for Trigger API requires a three-step handshake: Request Challenge -> Sign Message -> Verify Signature -> Receive JWT.
- **Observation:** This flow is highly secure but adds several round-trips for the client. Standardizing this with a helper library or unified wallet-auth endpoint would be helpful.
- **Finding:** The `triggerPrice` and `triggerCondition` fields are intuitive, but the `inAmount` must be in native units (lamports for SOL).
- **Finding:** API domain consistency: `quote-api.jup.ag` was failing with ENOTFOUND; switching all calls to the unified `api.jup.ag` domain resolved this.

### AI Stack
- Agent Skills: TBD
- Jupiter CLI: TBD
- Docs MCP: TBD
- llms.txt: TBD

### If We Were Building developers.jup.ag
- TBD

### What We Wish Existed
- TBD

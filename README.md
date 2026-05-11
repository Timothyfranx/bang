# 👻 Copy-Ghost

### Zero-Latency Shadow Trading on Solana — Powered by Jupiter

**Copy-Ghost** is a latency-optimized, session-based "shadow trading" layer that allows users to shadow high-performance whale wallets in real-time. Built for the Jupiter Hackathon, it combines the security of vault-isolated ephemeral wallets with the speed of a specialized bot.

---

## 🚀 The Vision

Social trading on Solana is often slow and risky. You either give your private keys to a Telegram bot or you're too slow to follow whale alerts. 

**Copy-Ghost flips this:**
- **Zero-Latency Mirroring:** Signs trades in the browser using ephemeral session keys. No popups, no lag.
- **Vault Fortress:** Your main funds stay in your vault. Only a small "hunting budget" is isolated in the session.
- **Anti-Rug Guard:** Automatically checks Jupiter's `organic_score` before following any trade.
- **Multi-Ghost Consensus:** Minimizes risk by only mirroring trades that 2 out of 3 targets agree on.

---

## 🛠️ Technical Stack

- **Execution Engine:** Jupiter Swap V6 (Quote & Execute APIs)
- **Safety Layer:** Jupiter Tokens API (Organic Score Verification)
- **Framework:** Next.js 14 (App Router)
- **Monitoring:** Real-time polling of target wallet activity on-chain.
- **Security:** Ephemeral keys stored encrypted in `sessionStorage`, cleared on session end.

---

## 📖 How to Use

1. **Start a Session:** Connect your vault wallet and fund a temporary "Ghost" wallet with a small budget (e.g., 0.1 SOL).
2. **Target Whales:** Add up to 3 whale addresses to your monitoring list.
3. **Engage Ghost Mode:** Toggle the "Active Shadow" switch in the Cockpit.
4. **Mirror Move:** When targets trade, the Ghost detects it and provides an instant "Mirror" signal.
5. **Secure Profits:** End the session to sweep all recovered assets back to your main vault.

---

## ⚖️ License

MIT. Created with 👻 for the Jupiter Hackathon.

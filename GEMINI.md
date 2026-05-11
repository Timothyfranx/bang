# 🤖 GEMINI.md — Copy-Ghost Agent Context

> **Read this file completely before taking any action, writing any code, or running any command.**
> This is your operating manual. Not a suggestion. Not a reference. Your law.
> If you have not read this file in full, you are not ready to act.

---

## 🧠 Who You Are

You are a **senior full-stack engineer and AI pair-programmer** permanently embedded in the Copy-Ghost project. You have deep expertise in Next.js, TypeScript, React, Solana web3.js, Jupiter APIs, and real-time on-chain monitoring.

You are **not a code generator**. You are an engineering collaborator with taste, discipline, and judgment. You think before you type. You explain before you act. You commit before you move on.

Your three core obligations every single session:
1. **Read before you touch** — understand the relevant files before changing anything.
2. **Follow the Git workflow** — no exceptions, no shortcuts, not even for a one-line change.
3. **Update SUMMARY.md** — on every branch open and every commit, without being asked.

If you are ever unsure whether to proceed, **stop and ask**. The cost of one clarifying question is always lower than the cost of an undone mistake.

---

## 📖 Project: Copy-Ghost

A latency-optimized, session-based "shadow trading" layer for Solana, powered by Jupiter APIs and Helius/Alchemy webhooks.

### The Core Concept

> "Copy-Ghost allows users to 'shadow' high-performance whale wallets in real-time. Instead of depositing funds into a third-party bot, users fund an ephemeral Session Wallet (the 'Ghost') that mirrors the target's trades using Jupiter's routing. The user retains absolute control, risk is capped by the session budget, and assets are swept back to a secure vault."

### Mental Model

```
Whale Wallet  =  The Target         (The one you're shadowing)
Ghost Wallet  =  Your Shadow       (Ephemeral, latency-optimized)
Vault Wallet  =  Your Fortress     (Where profits are secured)
```

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode ON) |
| Styling | Tailwind CSS (Hacker Terminal Aesthetic) |
| Wallet | Solana Wallet Adapter + Phantom |
| Jupiter APIs | Swap V6 (Quote & Execute), Price, Tokens (Safety) |
| Monitoring | Helius / Alchemy (Websockets for Whale activity) |

---

## 🗂️ Codebase Map

```
copy-ghost/
│
├── GEMINI.md                  ← YOU ARE HERE. Read every session.
├── SUMMARY.md                 ← LIVING PROJECT LOG. Update on every branch and commit.
├── README.md                  ← Project overview and setup instructions.
├── DX-REPORT.md               ← Developer Experience Report (35% of judging). Update daily.
│
├── app/
│   ├── layout.tsx             ← Root layout.
│   ├── page.tsx               ← Landing page / Dashboard (The Cockpit).
│   └── vault/
│       └── page.tsx           ← Vault overview.
│
├── components/
│   ├── ghost/
│   │   ├── TargetMonitor.tsx  ← Live feed of whale activity.
│   │   ├── GhostToggle.tsx    ← Shadow mode switch (Active/Passive).
│   │   └── TradeCard.tsx      ← Real-time trade comparison (Whale vs You).
│   ├── layout/
│   │   └── Navbar.tsx         ← Top nav with branding.
│   └── session/
│       └── SessionCard.tsx    ← Session budget and timer.
│
├── lib/
│   ├── jupiter/               ← Jupiter API wrappers.
│   ├── solana/                ← Wallet and sweep logic.
│   └── utils/                 ← Multi-ghost consensus and formatting.
```

---

## ⚙️ Core Feature Map

### Feature 1 — Shadow Lifecycle (The "Ghost Cockpit")

```
User selects "Target Wallet" (Whale address)
        ↓
Inputs budget ($) and starts session
        ↓
App opens WebSocket to listen for Whale's Jupiter transactions
        ↓
Whale Swaps Token A → Token B
        ↓
Ghost detects event → calls Jupiter Swap V6 Quote for user budget
        ↓
Ghost signs with ephemeral key → sends to Transaction Submission API
        ↓
Trade executes (Target: Zero-Latency mirroring)
```

### Feature 2 — The Anti-Rug Filter

```
Whale buys Token X
        ↓
Ghost checks Jupiter Tokens API for organic_score
        ↓
Score < 70 (Suspicious) → Ghost refuses to follow → Toast: "Ghost protected you from a rug."
Score >= 70 (Safe) → Ghost follows trade
```

### Feature 3 — Multi-Ghost Consensus (The "Multi-Ghost")

```
User monitors 3 whales
        ↓
Ghost only triggers if 2/3 targets buy the same token in a 5-min window
        ↓
Minimizes exposure to single-whale "top-buying" or mistakes
```

---

## 🌿 Git Workflow — THE GOLDEN RULES

### Rule 1: `main` is sacred. You never commit to it. Ever.
### Rule 2: A branch for everything. Everything.
### Rule 3: Commit every change. Every single one.
### Rule 4: Pre-Commit Checklist — Run Every Time

---

## 📝 DX-REPORT.md — Your Most Important Deliverable

Log every surprise, confusion, or delight regarding Jupiter APIs. This is 35% of the score.

---

## 🚨 Hard Rules — Never Break These

### Security
- Never log private keys, seed phrases, or raw keypairs
- Never commit `.env.local`
- Always clear session keypair on session end

### Jupiter API
- All calls through `lib/jupiter/`
- Check organic_score before following trades or sweeping
- Log every API interaction to DX-REPORT.md

# 🎨 DESIGN.md — Capsule Design System
## Brand, UI, and UX Reference for AI Agents and Human Collaborators

> **Read this before writing a single line of CSS or JSX.**
> Every visual decision in this project flows from this document.
> If something isn't covered here, ask the human before inventing a style.

---

## 🧠 Design Philosophy

Capsule is a security tool for people who trade on Solana. The design must communicate three things instantly:

1. **Trust** — this protects your money. It must feel solid, serious, and reliable.
2. **Speed** — Ghost Mode is about fast execution. The UI must feel snappy, real-time, alive.
3. **Simplicity** — non-crypto users must understand what's happening at a glance.

### The One Design Rule

> **Every element earns its place or it's removed.**

No decorative elements for the sake of it. No gradients because they look cool. Every visual choice has a function. Capsule looks expensive because it's precise — not because it's flashy.

### Aesthetic Direction

**Refined Dark Fintech** — think Bloomberg Terminal meets Linear.app.

- Dark, near-black backgrounds with surgical precision
- One warm accent color (amber/gold) — used sparingly, never everywhere
- Monospace font for addresses, numbers, and data
- Clean sans-serif for everything else
- Subtle borders — not shadows
- Data-dense but never cluttered

**What to avoid:**
- Purple gradients — every generic crypto app uses these
- Neon green "hacker" aesthetics — cliché
- Glass morphism — overdone
- Gradient text on logos — cheap
- Excessive animations — this is a security tool, not a game
- Comic Sans, heavy display fonts, or anything playful

---

## 🎨 Color System

### Core Palette

```css
:root {
  /* Backgrounds */
  --bg-base:        #09090E;   /* Page background — deepest dark */
  --bg-surface:     #0F0F18;   /* Card backgrounds */
  --bg-elevated:    #16161F;   /* Modals, dropdowns, tooltips */
  --bg-subtle:      #1C1C28;   /* Hover states, input backgrounds */

  /* Borders */
  --border-default: rgba(255, 255, 255, 0.07);  /* Standard card borders */
  --border-strong:  rgba(255, 255, 255, 0.12);  /* Focused inputs, active states */
  --border-accent:  rgba(212, 168, 67, 0.30);   /* Amber-tinted borders */

  /* Accent — Amber Gold */
  --accent:         #D4A843;   /* Primary accent — use sparingly */
  --accent-dim:     #B8902E;   /* Hover state for accent */
  --accent-muted:   rgba(212, 168, 67, 0.12);  /* Accent backgrounds */
  --accent-glow:    rgba(212, 168, 67, 0.08);  /* Subtle glow effects */

  /* Text */
  --text-primary:   #F2F2F5;   /* Main body text */
  --text-secondary: #8B8B9B;   /* Labels, captions, metadata */
  --text-tertiary:  #555566;   /* Placeholder text, disabled */
  --text-accent:    #D4A843;   /* Accent text — links, highlights */

  /* Semantic Colors */
  --success:        #22C55E;   /* Confirmed, swept, safe */
  --success-bg:     rgba(34, 197, 94, 0.10);
  --warning:        #F59E0B;   /* Caution, pending, low score */
  --warning-bg:     rgba(245, 158, 11, 0.10);
  --danger:         #EF4444;   /* High risk, danger, failed */
  --danger-bg:      rgba(239, 68, 68, 0.10);
  --info:           #3B82F6;   /* Informational */
  --info-bg:        rgba(59, 130, 246, 0.10);

  /* Ghost Mode Specific */
  --ghost-active:   #D4A843;   /* Ghost ON state */
  --ghost-inactive: #555566;   /* Ghost OFF state */
  --ghost-pulse:    rgba(212, 168, 67, 0.15); /* Pulse animation background */
}
```

### Color Usage Rules

| Color | Use For | Never Use For |
|---|---|---|
| `--accent` (#D4A843) | Primary CTA buttons, active states, key numbers | Backgrounds, large fills, decorative elements |
| `--bg-surface` | All cards and panels | Page background directly |
| `--border-default` | All standard borders | Text, icons |
| `--text-secondary` | Labels, metadata, timestamps | Main content text |
| `--success` | Confirmed txs, safe tokens, swept | General positive framing |
| `--danger` | High risk signals, failed txs | Warnings (use --warning instead) |

---

## 🔤 Typography

### Font Stack

```css
/* Display — for headlines and large numbers */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

/* Monospace — for addresses, hashes, numbers, code */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --font-display:  'DM Sans', -apple-system, sans-serif;
  --font-mono:     'JetBrains Mono', 'Fira Code', monospace;
}

body {
  font-family: var(--font-display);
}
```

### Type Scale

```css
/* Headlines */
.text-hero    { font-size: 3rem;   font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; }
.text-h1      { font-size: 2rem;   font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
.text-h2      { font-size: 1.5rem; font-weight: 600; line-height: 1.3; }
.text-h3      { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }

/* Body */
.text-body    { font-size: 0.9375rem; font-weight: 400; line-height: 1.6; }
.text-small   { font-size: 0.8125rem; font-weight: 400; line-height: 1.5; }
.text-xs      { font-size: 0.75rem;   font-weight: 400; line-height: 1.4; }

/* Mono — always use for these */
.text-address { font-family: var(--font-mono); font-size: 0.8125rem; }
.text-hash    { font-family: var(--font-mono); font-size: 0.75rem; }
.text-number  { font-family: var(--font-mono); font-weight: 600; }
.text-amount  { font-family: var(--font-mono); font-size: 1.5rem; font-weight: 600; }
```

### Typography Rules

- **Wallet addresses** — always monospace, always truncated (`0xBDB8...6534`), always with copy button
- **Transaction hashes** — always monospace, always truncated, always linkable to Solscan
- **Dollar amounts** — monospace, two decimal places, green if positive, red if negative
- **SOL amounts** — monospace, 4 decimal places maximum
- **Timestamps** — secondary color, relative format ("2 mins ago") with full datetime on hover
- **Token symbols** — uppercase, bold, primary color (`SOL`, `USDC`, `WIF`)

---

## 🏷️ Logo & Brand

### Logo Concept

The Capsule logo is a **capsule shape** (a rectangle with fully rounded ends) with a clean wordmark.

```
 ╭──────────╮
 │  CAPSULE │
 ╰──────────╯
```

The capsule shape represents containment — your assets are contained, isolated, protected. It also suggests medicine/pharmaceuticals — you take the right dose, not everything at once.

### Logo Variants

**Primary (light text on dark):**
```tsx
<div className="flex items-center gap-2">
  {/* Capsule icon — SVG */}
  <svg width="28" height="16" viewBox="0 0 28 16">
    <rect x="0" y="0" width="28" height="16" rx="8"
          fill="none" stroke="#D4A843" strokeWidth="1.5"/>
    <rect x="2" y="2" width="11" height="12" rx="5.5"
          fill="#D4A843" opacity="0.9"/>
  </svg>
  {/* Wordmark */}
  <span style={{
    fontFamily: 'DM Sans',
    fontWeight: 700,
    fontSize: '1.125rem',
    letterSpacing: '-0.02em',
    color: '#F2F2F5'
  }}>
    capsule
  </span>
</div>
```

**Ghost Mode badge (when active):**
```tsx
<div className="flex items-center gap-1.5">
  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
    Ghost Active
  </span>
</div>
```

### Brand Voice

- **Precise** — "Your vault is protected" not "Your funds are super safe!!!"
- **Technical but accessible** — "Session wallet" not "burner wallet" or "hot wallet 2.0"
- **Direct** — "Session ended. 0.58 SOL returned." not "Great job! Your session is complete!"
- **Honest** — "Session wallet can still be drained. Budget limits your exposure." — say it plainly

---

## 🧩 Component Library

### Cards

```tsx
/* Standard card */
<div className="
  bg-[#0F0F18]
  border border-white/[0.07]
  rounded-2xl
  p-6
">

/* Highlighted card (active session, Ghost ON) */
<div className="
  bg-[#0F0F18]
  border border-amber-400/30
  rounded-2xl
  p-6
  shadow-[0_0_24px_rgba(212,168,67,0.06)]
">

/* Danger card (high risk signal) */
<div className="
  bg-[#0F0F18]
  border border-red-500/30
  rounded-2xl
  p-6
">
```

### Buttons

```tsx
/* Primary — amber, used for main actions only */
<button className="
  bg-[#D4A843] text-black
  font-semibold text-sm
  rounded-full
  px-5 py-2.5
  hover:bg-[#B8902E]
  disabled:opacity-40 disabled:cursor-not-allowed
  transition-colors duration-150
">

/* Secondary — transparent with amber border */
<button className="
  border border-[#D4A843]/40 text-[#D4A843]
  font-medium text-sm
  rounded-full
  px-5 py-2.5
  hover:bg-[#D4A843]/10
  transition-colors duration-150
">

/* Ghost — no border, subtle */
<button className="
  text-[#8B8B9B]
  font-medium text-sm
  rounded-full
  px-4 py-2
  hover:text-[#F2F2F5] hover:bg-white/[0.05]
  transition-colors duration-150
">

/* Danger — for sweep, disconnect, high-risk actions */
<button className="
  border border-red-500/40 text-red-400
  font-medium text-sm
  rounded-full
  px-5 py-2.5
  hover:bg-red-500/10
  transition-colors duration-150
">
```

### Badges / Status Pills

```tsx
/* Session Active */
<span className="
  bg-green-500/10 text-green-400
  text-xs font-medium font-mono
  px-2.5 py-1 rounded-full
  uppercase tracking-wider
">ACTIVE</span>

/* Ghost Mode ON */
<span className="
  bg-amber-500/10 text-amber-400
  text-xs font-medium font-mono
  px-2.5 py-1 rounded-full
  uppercase tracking-wider
  animate-pulse
">GHOST ON</span>

/* Risk: Safe */
<span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-full">
  ✓ Safe
</span>

/* Risk: Caution */
<span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-0.5 rounded-full">
  ⚠ Caution
</span>

/* Risk: Danger */
<span className="bg-red-500/10 text-red-400 text-xs px-2 py-0.5 rounded-full">
  ✕ High Risk
</span>

/* Testnet warning */
<span className="
  bg-amber-500/10 text-amber-400
  text-xs font-medium
  px-3 py-1 rounded-full
  border border-amber-500/20
">
  ⚠ Devnet
</span>
```

### Inputs

```tsx
/* Standard text input */
<input className="
  w-full
  bg-[#1C1C28]
  border border-white/[0.07]
  rounded-xl
  px-4 py-3
  text-[#F2F2F5] text-sm
  placeholder-[#555566]
  focus:outline-none
  focus:border-amber-400/40
  focus:bg-[#1C1C28]
  transition-colors duration-150
"/>

/* Address input (monospace) */
<input className="
  w-full
  bg-[#1C1C28]
  border border-white/[0.07]
  rounded-xl
  px-4 py-3
  text-[#F2F2F5] text-sm font-mono
  placeholder-[#555566]
  focus:outline-none
  focus:border-amber-400/40
  transition-colors duration-150
"
placeholder="Enter wallet address..."
/>

/* Amount input with currency prefix */
<div className="relative">
  <span className="
    absolute left-4 top-1/2 -translate-y-1/2
    text-[#8B8B9B] text-sm
  ">$</span>
  <input className="
    w-full
    bg-[#1C1C28]
    border border-white/[0.07]
    rounded-xl
    pl-8 pr-4 py-3
    text-[#F2F2F5] text-sm font-mono
    focus:outline-none focus:border-amber-400/40
  "/>
</div>
```

### The Ghost Toggle

This is the most important UI element. It must feel physical and satisfying.

```tsx
/* Ghost Mode Toggle — the centerpiece of Ghost Panel */
<button
  onClick={toggleGhost}
  className={`
    relative w-16 h-8 rounded-full
    transition-all duration-300
    ${isActive
      ? 'bg-amber-400 shadow-[0_0_16px_rgba(212,168,67,0.4)]'
      : 'bg-[#1C1C28] border border-white/[0.07]'
    }
  `}
>
  <div className={`
    absolute top-1 w-6 h-6 rounded-full
    transition-all duration-300
    ${isActive
      ? 'left-9 bg-black'
      : 'left-1 bg-[#555566]'
    }
  `}/>
</button>

/* Label alongside toggle */
<div className="flex items-center gap-3">
  <span className="text-sm text-[#8B8B9B]">Ghost Mode</span>
  {/* toggle above */}
  <span className={`text-sm font-mono font-medium
    ${isActive ? 'text-amber-400' : 'text-[#555566]'}
  `}>
    {isActive ? 'ON' : 'OFF'}
  </span>
</div>
```

### Loading States

```tsx
/* Spinner — for async actions */
<div className="
  w-4 h-4 rounded-full
  border-2 border-white/20 border-t-amber-400
  animate-spin
"/>

/* Skeleton — for loading content */
<div className="
  h-4 w-32 rounded
  bg-white/[0.05]
  animate-pulse
"/>

/* Button loading state */
<button disabled className="... opacity-70">
  <div className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin"/>
  <span>Processing...</span>
</button>
```

### Toast Notifications

```tsx
// Use react-hot-toast with custom styles
import toast from 'react-hot-toast';

// Success
toast.success('Session started · 0.62 SOL funded', {
  style: {
    background: '#0F0F18',
    color: '#F2F2F5',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    fontSize: '0.875rem',
  },
  iconTheme: { primary: '#22C55E', secondary: '#0F0F18' }
});

// Error
toast.error('Swap failed: insufficient balance', {
  style: {
    background: '#0F0F18',
    color: '#F2F2F5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
  }
});

// With Solscan link — custom component
toast.custom(() => (
  <div className="bg-[#0F0F18] border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
    <span className="text-green-400">✓</span>
    <span className="text-sm text-[#F2F2F5]">Trade mirrored</span>
    <a href={solscanUrl} target="_blank"
       className="text-xs text-amber-400 hover:underline ml-auto">
      View ↗
    </a>
  </div>
));
```

---

## 📐 Layout System

### Page Structure

```tsx
/* Root layout */
<div className="min-h-screen bg-[#09090E] text-[#F2F2F5]">
  <Navbar />                          {/* Fixed top, 64px height */}
  <main className="
    max-w-6xl mx-auto
    px-4 sm:px-6 lg:px-8
    pt-20 pb-16                       {/* pt-20 clears fixed navbar */}
  ">
    {children}
  </main>
  <Footer />
</div>
```

### Dashboard Grid

```tsx
/* Two-column dashboard */
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left column — 2/3 width */}
  <div className="lg:col-span-2 space-y-6">
    <SessionCard />
    <GhostPanel />
  </div>
  {/* Right column — 1/3 width */}
  <div className="space-y-6">
    <VaultBalance />
    <QuickActions />
  </div>
</div>
```

### Navbar

```tsx
<nav className="
  fixed top-0 left-0 right-0 z-50
  h-16
  bg-[#09090E]/80 backdrop-blur-xl
  border-b border-white/[0.05]
">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
    {/* Logo left */}
    <Logo />

    {/* Center — testnet banner */}
    <span className="text-xs text-amber-400/70 font-mono hidden sm:block">
      Devnet
    </span>

    {/* Right — wallet */}
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          <span className="text-sm text-[#8B8B9B] font-mono hidden sm:block">
            {truncateAddress(address)}
          </span>
          <button onClick={disconnect}
                  className="text-xs text-[#8B8B9B] hover:text-red-400 transition-colors">
            Disconnect
          </button>
        </>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  </div>
</nav>
```

---

## 🖥️ Page Designs

### Landing Page (`/`)

**Layout:** Centered, single column, minimal.

```
─────────────────────────────────────
  [Logo]                [Launch App]
─────────────────────────────────────

  ← 160px top padding →

  Your wallet.                        ← Hero headline, 3rem, bold
  Isolated. Protected.

  Capsule gives every risky dApp      ← Subheadline, #8B8B9B
  its own budget. Ghost Mode follows
  the smart money so you don't have to.

  [  Launch App  ]  [  Read the Docs  ]   ← CTA buttons

  ← 80px gap →

  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │ 🔒           │  │ 👻           │  │ ⚡            │
  │ Session      │  │ Ghost Mode   │  │ Jupiter       │
  │ Isolation    │  │              │  │ Powered       │
  │              │  │              │  │               │
  │ Cap your     │  │ Follow smart │  │ Best prices   │
  │ exposure to  │  │ money with   │  │ on every      │
  │ the session  │  │ de-risk      │  │ swap, always  │
  │ budget only  │  │ filters      │  │               │
  └──────────────┘  └──────────────┘  └──────────────┘

  ← 60px gap →

  Built on Jupiter · Solana · Open Source

─────────────────────────────────────
```

### Dashboard (`/dashboard`)

```
─────────────────────────────────────
  [Logo]        [Devnet]    [0xBDB8...6534] [Disconnect]
─────────────────────────────────────

  ┌─────────────────────────────────┐  ┌──────────────────┐
  │ Session                   IDLE  │  │ Vault Balance     │
  │                                 │  │                   │
  │ [  Activity Type  ▾]            │  │ 4.2831 SOL        │
  │ [  Budget: $ ____  ]            │  │ $823.40           │
  │ [  SOL equiv: 0.62]             │  │                   │
  │                                 │  │ 3 tokens ›        │
  │ [ Start Session ]               │  │                   │
  └─────────────────────────────────┘  └──────────────────┘

  ┌─────────────────────────────────┐  ┌──────────────────┐
  │ Ghost Mode                      │  │ Quick Actions     │
  │                                 │  │                   │
  │ [Whale Address Input]           │  │ [Set Limit Order] │
  │ [+ Add whale] (up to 3)         │  │                   │
  │                                 │  │ [View Vault ›]    │
  │ Ghost Mode  [  OFF ——●  ]       │  │                   │
  │                                 │  └──────────────────┘
  │ ── Signal Feed ──               │
  │                                 │
  │ [Trade Card]                    │
  │ [Trade Card]                    │
  └─────────────────────────────────┘

─────────────────────────────────────
```

### Trade Card (Ghost Signal)

```
┌─────────────────────────────────────────────────────┐
│  👻 Whale: 0xBDB8...6534          2 mins ago        │
│  ─────────────────────────────────────────────────  │
│  SOL → WIF                                          │
│  [SOL logo] → [WIF logo]                            │
│  1.24 SOL → 43,891 WIF                              │
│                                                     │
│  Price Impact: 0.12%  ✓    Organic Score: 87  ✓    │
│  Liquidity: $2.4M    ✓                              │
│                                                     │
│  ┌─────────────┐  ┌───────────────────────────┐    │
│  │  [SAFE] ✓   │  │  Mirror Trade  (20% budget)│    │
│  └─────────────┘  └───────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## 📱 Responsive Rules

```
Mobile (< 640px):
  - Single column layout
  - Navbar: logo + wallet connect only
  - Cards: full width, reduced padding (p-4)
  - Ghost feed: compressed trade cards
  - No horizontal scrolling ever

Tablet (640px - 1024px):
  - Single column, wider cards
  - Navbar: add testnet badge
  - Ghost feed: full cards

Desktop (> 1024px):
  - Two/three column grid
  - Full navbar
  - All features visible
```

---

## ✨ Animation Guidelines

**Use animation purposefully. Not everywhere.**

```css
/* Page load — staggered card reveal */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card { animation: fadeUp 0.3s ease forwards; }
.card:nth-child(2) { animation-delay: 0.05s; }
.card:nth-child(3) { animation-delay: 0.10s; }

/* Ghost signal arrival */
@keyframes signalPulse {
  0%   { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.4); }
  70%  { box-shadow: 0 0 0 8px rgba(212, 168, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0); }
}

.new-signal { animation: signalPulse 0.6s ease; }

/* Session timer — urgent pulse when < 5 mins */
@keyframes urgentPulse {
  0%, 100% { color: #EF4444; }
  50%       { color: #F87171; }
}

.timer-urgent { animation: urgentPulse 1s ease infinite; }
```

**Animation rules:**
- Page transitions: fade + translate Y 12px, 300ms ease
- New Ghost signals: single amber pulse on card border
- Toggle: 300ms transition on background and thumb position
- Buttons: 150ms color transition only — no scale transforms
- Session timer: pulse only when under 5 minutes remaining
- Never animate layout (no width/height transitions)
- Respect `prefers-reduced-motion` — wrap all animations:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚫 Design Anti-Patterns

Never do any of the following:

| Anti-Pattern | Why Not | Do Instead |
|---|---|---|
| Purple/blue gradients | Every crypto app. Generic. | Flat dark surfaces with amber accent |
| Gradient text | Looks cheap on dark bg | Solid `--text-accent` for emphasis |
| Glassmorphism | Overdone since 2021 | Solid surface with subtle border |
| Green "matrix" aesthetic | Hacker cliché | Clean dark with amber only |
| Emoji as primary UI elements | Unprofessional | Use SVG icons or Unicode sparingly |
| `Inter` or `Space Grotesk` | Default AI font choices | `DM Sans` + `JetBrains Mono` |
| Shadows everywhere | Heavy, dated | Borders only. One shadow for glow effect on active Ghost card. |
| Centered all caps headers | Overused in crypto | Left-aligned, mixed case |
| Loading spinners that block the whole page | Terrible UX | Skeleton loaders per section |
| Raw wallet addresses without truncation | Unreadable | Always `0xBDB8...6534` with copy |

---

*This design system is the visual contract for Capsule. Every component follows these rules. Propose changes via a `style/` branch — same as code.*

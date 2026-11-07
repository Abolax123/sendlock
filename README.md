# Sendlock ↗ LAB

> **Trustless Cross-Border P2P & Escrow Settlement Protocol powered by Blaaiz**  
> Built for the **GDG Ilorin Blaaiz Buildathon 2026** (DevFest Ilorin edition).

Sendlock solves the single biggest fear in cross-border money movement and peer-to-peer (P2P) trading: **sending money to the wrong account or facing counterparty scam/dispute**.

Traditional remittance sends money blind and hopes for the best. Sendlock verifies and secures the moment before payout: funds are locked in Blaaiz multi-currency escrow, recipient bank accounts are verified with instant real-time NIBSS lookup, and the payout is released **only after the recipient confirms their verified destination account**. If unconfirmed within the safety window, 100% of the funds return automatically.

---

## 🎨 UI Architecture: Dexoryn Lab Aesthetic

The user interface is designed to match the high-end dark terminal aesthetic of [Dexoryn Lab](https://dexoryn-lab.vercel.app/):
- **Typography**: Signature editorial contrast blending *Instrument Serif* (italic accents), *Inter Tight* (clean geometric sans), and *JetBrains Mono* (financial precision).
- **Atmosphere**: Animated subtle noise grain overlay, dynamic mouse-tracking spotlight radial glow, glowing pill tags, and pulsing live status indicators.
- **Interactive Landing Page**:
  - **Live Terminal Monitor**: Real-time route graphic (`GBP / USD / EUR → Blaaiz Escrow → NGN`), conversion rates, and countdown safety timer.
  - **The Escrow Forge**: Live interactive P2P calculator and NUBAN bank account resolver right on the landing page.
  - **P2P Liquidity Radar**: Real-time orderbook of peer trades protected by smart escrow.
  - **4-Stage How-It-Works Bento Pipeline**: Lock → Verify → Cryptographic Approval → Settlement.
  - **Trust Layer Sentinels**: Name-Mismatch Sentinel, Zero-Trust Recipient Confirmation, and 24h Expiry/Refund.
  - **Protocol Comparison Matrix & Interactive FAQ Accordion**.
  - **Monolithic Outlined Brand Footer**.

---

## 🛠 Tech Stack & Architecture

```text
React 19 / Vite Browser (Dexoryn UI) 
       ↓ 
Express 5 Server (Node / TypeScript tsx) 
       ↓ 
Prisma ORM 6 (SQLite / WAL Mode) 
       ↓ 
Blaaiz Multi-Currency Rails (Collection → FX Conversion → Local Payouts)
```

- **Frontend**: React 19, React Router 7, Vite 6, Tailwind CSS, Lucide Icons, DM/JetBrains Mono & Instrument Serif typography.
- **Backend API**: Express 5, TypeScript (`tsx`), Prisma ORM 6 with SQLite.
- **Payment & Escrow Engine**:
  - **Blaaiz Adapter** (`server/src/lib/blaaiz.ts`): Multi-currency virtual collections (GBP, USD, EUR, CAD, USDT), real-time FX quotes, NIBSS bank account resolution, webhook HMAC verification, and sandbox/mock toggle.
  - **Trust & Risk Engine** (`server/src/lib/risk.ts`): Inspired by Mohammed Yayah's DevFest keynote (*"AI Can Write the Code. Can You Trust It?"*), evaluating recipient name similarity, transaction history, and anomaly flags.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Prepare Database
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

### 3. Run Development Servers
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

> **Sandbox / Mock Mode**: `server/.env` defaults to `MOCK_MODE=true` for zero-friction hackathon demos. For live Blaaiz sandbox access, set `MOCK_MODE=false`, configure your `BLAAIZ_API_KEY` or OAuth client credentials, and set `BLAAIZ_WEBHOOK_SECRET`.

---

## 🎙 2-Minute Pitch Demo Walkthrough

1. **The Hero Story**: Open `http://localhost:5173`. Point out the headline *"Cross-border P2P, without the counterparty risk"* and the live terminal monitor showing funds held in Blaaiz escrow.
2. **Interactive Simulator**: Scroll to **The Escrow Forge**. Select `GBP`, type `250`, pick **GTBank**, and type account number `0123456780`. Show that the bank record instantly resolves to `Tunde Adeyemi` with a green verification badge.
3. **P2P Radar**: Scroll to the **P2P Liquidity Radar** orderbook showing peer offers across GBP, USD, EUR, and USDT.
4. **Create & Lock Escrow**: Click **Launch App** or **Trade**. Enter `100 GBP`, pick GTBank and `0123456780`, and click **Lock & Pay with Blaaiz**.
5. **Smart Escrow in Action**: On the status page, click **Simulate Blaaiz Payment**. The transfer moves from *Awaiting Payment* to **Held in Escrow**. Emphasize to the judges: **funds are safely vaulted in Blaaiz; no payout has occurred yet!**
6. **Recipient Confirmation**: Click **Open Recipient Confirmation View**. Show the mobile-optimized verification card showing the exact verified bank account. Click **Confirm & Receive Payout**. The transfer transitions to **Paid** and the local payout is dispatched.
7. **Name-Mismatch & Refund Stories**:
   - Create another transfer where the entered recipient name differs from the account name to show the amber **Name-Mismatch Sentinel** warning.
   - On a held transfer, click **Simulate 24h Expiry & Refund** to demonstrate the automated 100% refund path back to the sender.

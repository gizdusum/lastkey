# 🔑 LastKey

> AI-powered access continuity on Etherlink (Tezos EVM)

**Built for the [Tezos EVM AI Hackathon](https://tezosevm.nowmedia.co) · April 2026**

---

## The Problem

Over **$140 billion** in crypto is effectively inaccessible because self-custodied wallets have no native continuity rail. Death is one case, but not the only one. Lost devices, long absences, forgotten recovery flows, and unexpected life events can all lock assets away permanently.

## The Solution

LastKey lets a user describe an access continuity plan in plain English. AI structures that plan into validated beneficiary data, the plan is anchored on Etherlink, and a monitoring agent tracks long-term inactivity. If the wallet remains unchecked for **300 days**, the smart contract can execute the distribution exactly as defined.

This makes continuity:

- understandable for normal users
- enforceable onchain
- independent from intermediaries

---

## How It Works

1. **Connect wallet** on Etherlink Shadownet
2. **Write your plan** in natural language:
   `If I'm unreachable for 300 days, send 70% to my family and 30% to my foundation`
3. **AI structures it** into validated beneficiaries using OpenAI GPT-4o-mini
4. **Create vault** onchain with Etherlink smart contract rules + initial XTZ balance
5. **Agent monitors** all vaults every 24 hours
6. **Day 293** — alert email is sent and recorded onchain through `markWarningIssued()`
7. **Day 300** — `executeInheritance()` can distribute vault funds automatically
8. **Owner can check in** at any time using `pingActivity()` to reset the timer

---

## Live Deployment

- **GitHub:** [github.com/gizdusum/lastkey](https://github.com/gizdusum/lastkey)
- **Demo URL:** [lastkey.xyz](https://lastkey.xyz)
- **Contract Address:** `0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e`
- **Explorer:** [shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e](https://shadownet.explorer.etherlink.com/address/0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e)
- **Network:** Etherlink Shadownet
- **Chain ID:** `127823`
- **Demo wallet:** `0xb61C1007506d31620895dfd118fa2b12CF3A2484`

Verified onchain transactions:

- **createVault:** [0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc](https://shadownet.explorer.etherlink.com/tx/0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc)
- **pingActivity:** [0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354](https://shadownet.explorer.etherlink.com/tx/0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Etherlink (Tezos EVM), Chain ID `127823` |
| Smart Contract | Solidity `^0.8.20` |
| AI Structuring | OpenAI GPT-4o-mini |
| Monitoring Agent | Node.js + `node-cron` + `ethers` |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Wallet Connection | wagmi v2 + injected wallets (MetaMask / Rabby) |
| Email | Nodemailer (Gmail SMTP) |

---

## Project Structure

```text
deaddrop/
├── contracts/
│   └── DeadDrop.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── DeadDrop.test.js
├── agent/
│   ├── index.js
│   ├── monitor.js
│   ├── parser.js
│   ├── emailer.js
│   └── executor.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/abi/
└── DEMO_SCRIPT.md
```

---

## Smart Contract

**DeadDrop.sol** is the deployed Solidity contract behind LastKey. It manages vault creation, inactivity tracking, beneficiary distribution, and agent execution.

### Core Functions

| Function | Access | Purpose |
|----------|--------|---------|
| `createVault()` | public | Store continuity rules + deposit XTZ |
| `pingActivity()` | vault owner | Reset the 300-day continuity counter |
| `depositToVault()` | vault owner | Add more XTZ to an existing vault |
| `markWarningIssued()` | authorized AI agent | Record day-293 alert onchain |
| `executeInheritance()` | authorized AI agent | Distribute funds after threshold |
| `getVaultStatus()` | public view | Read vault health, balance, countdown |
| `getBeneficiaries()` | public view | Read vault beneficiary configuration |

### Key Design Choice

LastKey does **not** claim to detect literal death.  
It implements an **access continuity switch**:

- long inactivity
- alert grace period
- automated execution if there is no check-in

That keeps the product honest, demoable, and enforceable onchain.

---

## AI Agent

The LastKey agent runs as a Node.js service and performs four jobs:

1. Poll all registered vaults every 24 hours
2. Check continuity thresholds
3. Trigger `markWarningIssued()` when the alert threshold is reached
4. Trigger `executeInheritance()` after the final threshold

### NLP Structuring

The same agent stack also exposes natural-language structuring logic:

- input: plain-English continuity plan
- output: structured JSON beneficiaries
- validation: addresses, percentages, total sum = `10000` basis points

This is what bridges human intent to smart contract inputs.

---

## Frontend

The frontend provides two clear states:

### Landing

- explains the continuity problem
- explains the Etherlink deployment
- explains the 300-day continuity model

### Dashboard

- wallet connection
- natural-language continuity form
- AI-structured preview
- vault creation flow
- live vault status from chain
- `I'm Still Here` check-in action

---

## Setup

### Prerequisites

- Node.js 18+
- funded Etherlink Shadownet wallet
- OpenAI API key
- Gmail App Password for alert emails

### Root Install

```bash
cd deaddrop
npm install
```

### Contract

```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network etherlink
```

### Agent

```bash
node agent/index.js --test
node agent/index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

---

## Environment Variables

### Root `.env`

```bash
ETHERLINK_RPC_URL=https://node.shadownet.etherlink.com
DEADDROP_CONTRACT_ADDRESS=0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e
AGENT_ADDRESS=0xb61C1007506d31620895dfd118fa2b12CF3A2484
AGENT_PRIVATE_KEY=0x...
OPENAI_API_KEY=sk-...
EMAIL_USER=your@gmail.com
EMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend `.env.local`

```bash
NEXT_PUBLIC_DEADDROP_ADDRESS=0xe86D9e5029ca5fb68c133AaB98673bc370D5e04e
NEXT_PUBLIC_ETHERLINK_CHAIN_ID=127823
NEXT_PUBLIC_ETHERLINK_RPC_URL=https://node.shadownet.etherlink.com
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
```

---

## Hackathon Fit

LastKey maps directly to the Tezos EVM AI Hackathon criteria:

- ✅ **AI agents interacting with smart contracts**
  - AI structures natural language into contract-ready inputs
  - AI monitoring agent calls contract functions autonomously

- ✅ **Creative application**
  - access continuity is a real, emotional, financially meaningful Web3 problem

- ✅ **Ecosystem impact**
  - proves Etherlink can host long-lived, low-cost AI-triggered automation

- ✅ **Tezos EVM deployment**
  - deployed on Etherlink Shadownet with real verified transactions

---

## Why Etherlink?

LastKey depends on low-cost, frequent agent monitoring.

Etherlink matters because it gives us:

- **low gas fees** for repeated monitoring actions
- **fast finality** for reliable alert and execution transactions
- **full EVM compatibility** so Solidity and standard tooling work immediately

---

## Disclaimer

This is a hackathon prototype. Do not use with real mainnet funds.

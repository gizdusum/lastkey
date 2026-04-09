# LastKey Demo Script — 3 Minutes

## 0:00 - 0:20 — Problem

"Over 140 billion dollars in crypto is effectively at risk because Web3 has no native access continuity mechanism. LastKey solves that with programmable continuity on Etherlink."

## 0:20 - 0:40 — Landing + Wallet

- Open the LastKey site
- Show the landing hero
- Explain:
  - plain-English continuity planning
  - 300-day window
  - Etherlink deployment
- Connect wallet

Use demo wallet if needed:

`0xb61C1007506d31620895dfd118fa2b12CF3A2484`

## 0:40 - 1:15 — Plan Structuring

- Paste this plan:

`If I'm unreachable for 300 days, send 70% to my family at 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 and 30% to my foundation at 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

- Add alert email
- Keep `0.01 XTZ` as initial balance
- Click **Structure Plan**
- Show the beneficiary preview:
  - family → 70%
  - foundation → 30%

Explain:

"LastKey turns human intent into exact smart contract parameters. The user does not need to handcraft arrays, percentages, or basis points."

## 1:15 - 1:45 — Anchor Plan

- Click **Anchor on Etherlink**
- Approve transaction in wallet
- Show success toast

Reference confirmed create tx:

- [0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc](https://shadownet.explorer.etherlink.com/tx/0x58e40f8e3e8176fd10991cec9066b86b737e9503f9c4a5196f9891119522d8fc)

## 1:45 - 2:10 — LastKey Status

- Show vault dashboard
- Highlight:
  - protected vault
  - 0 days since check-in
  - 300 days remaining
  - 2 beneficiaries
  - locked balance

Explain:

"Everything critical is now onchain: the continuity contract exists, the beneficiaries exist, and the countdown state is publicly readable."

## 2:10 - 2:35 — Check-In

- Click **I'm Still Here — Reset Timer**
- Approve transaction
- Show success state
- Open explorer link

Reference confirmed ping tx:

- [0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354](https://shadownet.explorer.etherlink.com/tx/0x6718c56f9383d0b4db84d83d0661de38e6534680835b3f35d2e79bf4d8825354)

Explain:

"The owner can always check in onchain. That resets the continuity window and prevents execution."

## 2:35 - 2:55 — Agent Loop

- Switch to terminal
- Run:

```bash
node agent/index.js --test
```

- Show:
  - agent online
  - contract address
  - vault scan
  - continuity counters

Explain:

"In production, this agent checks vaults every 24 hours, sends alert emails at day 293, and can trigger execution at day 300."

## 2:55 - 3:00 — Close

"LastKey brings access continuity to Web3 by turning plain-English intent into enforceable onchain rules on Etherlink."

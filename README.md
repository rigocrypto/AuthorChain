# AuthorChain

AI-powered Web3 publishing for independent authors. Upload books, generate AI
marketing assets, publish a public sales page, sell via Stripe & USDC, and
register proof of authorship on-chain.

> Positioning: not an Amazon replacement — a **creator-first** platform giving
> authors AI tools, instant payments, transparent royalties, and digital ownership.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- API routes for the backend; **PostgreSQL** via Prisma (Phase 2)
- AI agents (Copy / Launch / Community) with mock fallback when no API key
- Payments: Stripe (cards) + USDC on Base
- Solidity registry contract on Base Sepolia
- Pluggable off-chain storage (local now; IPFS / Arweave / S3 later)

## Getting started

```bash
npm install
cp .env.example .env.local   # all keys optional in Phase 1
npm run dev                  # http://localhost:3000
```

## Project structure

```text
src/
  app/
    (marketing)/         # public site (own header/footer)
      page.tsx           # landing — "Publish. Own. Earn. Grow."
      book/[slug]/       # public book sales page
    dashboard/           # author app (own sidebar + header)
      page.tsx           # overview (stats, recent sales, top book, agent activity)
      upload/  books/  agents/  sales/
  components/
    ui/                  # Button, Card, StatusBadge
    dashboard/           # sidebar, header, page shell
    book-card.tsx  agent-card.tsx  logo.tsx  site-header.tsx  site-footer.tsx
  lib/
    mock-data.ts         # Phase-1 mock author/books/sales/stats
    ai/agents/           # copy / launch / community (+ pricing/opportunity previews)
    storage/             # StorageDriver interface + local driver
    payments/            # stripe + usdc boundaries
    blockchain/          # on-chain registry client
    db.ts                # Prisma client (Phase 2)
prisma/                  # schema (Phase 2)
contracts/               # Hardhat + Solidity registry (Phase 7)
```

## Roadmap

1. **Foundation** ✅ — Next.js + TS + Tailwind, layout, pages, lib scaffolding.
2. **Data layer** — Prisma schema (Author, Book, Sale, Royalty) + Postgres.
3. **Auth + upload** — author auth, book metadata, local storage driver wired.
4. **Pages live** — dashboard, my books, public book, sales backed by data.
5. **AI agents** — live Claude generation behind the existing mock boundary.
6. **Payments** — Stripe checkout + USDC on Base, status tracking, earnings.
7. **Blockchain** — Solidity registry, Base Sepolia deploy, register on publish.

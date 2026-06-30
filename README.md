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
npm install                  # also runs `prisma generate` (postinstall)
cp .env.example .env         # Prisma + Next both read .env

# 1. Start PostgreSQL (Docker)
npm run db:up                # docker compose up -d

# 2. Create the schema + tables
npm run db:migrate           # prisma migrate dev

# 3. Seed the demo author (Rigo Vivas) + books/sales
npm run db:seed

# 4. Run the app
npm run dev                  # http://localhost:3000
```

> Requires Docker Desktop running. To stop the DB: `npm run db:down`
> (data persists in a named volume; `docker compose down -v` wipes it).

## Database

PostgreSQL via **Prisma** ([prisma/schema.prisma](prisma/schema.prisma)). Models:
`Author`, `Book`, `BookFile`, `Sale`, `Royalty`, `AgentOutput`,
`BlockchainRegistration`.

| Script | What it does |
| --- | --- |
| `npm run db:up` / `db:down` | start / stop the Postgres container |
| `npm run db:migrate` | create & apply a migration (dev) |
| `npm run db:reset` | drop, re-migrate, and re-seed |
| `npm run db:seed` | load the demo author + books/sales |
| `npm run db:studio` | open Prisma Studio |

Auth is a placeholder: [src/lib/auth/session.ts](src/lib/auth/session.ts)
returns the seeded demo author. Swap this one function for NextAuth/Clerk/
Supabase in Phase 3 — callers don't change. The UI reads through a thin
data-access layer ([src/lib/data/](src/lib/data/)) that returns plain DTOs, so
it never depends on Prisma directly.

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
    db.ts                # Prisma client singleton
    auth/session.ts      # placeholder auth (returns demo author)
    data/                # data-access layer → DTOs (books, stats)
    cover.ts             # deterministic placeholder cover gradients
    ai/agents/           # copy / launch / community (+ pricing/opportunity previews)
    storage/             # StorageDriver interface + local driver
    payments/            # stripe + usdc boundaries
    blockchain/          # on-chain registry client
prisma/
  schema.prisma          # 7 models
  seed.ts                # demo data
docker-compose.yml       # local PostgreSQL
contracts/               # Hardhat + Solidity registry (Phase 7)
```

## Roadmap

1. **Foundation** ✅ — Next.js + TS + Tailwind, layout, pages, lib scaffolding.
2. **Data layer** ✅ — Prisma schema + Postgres, data-access layer, seed, upload→DB.
3. **Auth + storage** — real auth (replace the placeholder) + manuscript file upload.
4. **Pages live** — dashboard, my books, public book, sales backed by data.
5. **AI agents** — live Claude generation behind the existing mock boundary.
6. **Payments** — Stripe checkout + USDC on Base, status tracking, earnings.
7. **Blockchain** — Solidity registry, Base Sepolia deploy, register on publish.

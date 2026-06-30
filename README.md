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

## Payments (Stripe)

Card checkout uses **Stripe Checkout**. A purchase flows:
public book page → `startCheckoutAction` → Stripe hosted checkout →
`checkout.session.completed` webhook → `Sale` + `Royalty` created (idempotent).

Prices are always read server-side from the database — never trusted from the
client. If `STRIPE_SECRET_KEY` is unset, the buy button shows a
"payments unavailable" state and the webhook returns `503` instead of crashing.

### Local testing

1. Add your test keys to `.env` (see [.env.example](.env.example)):

   ```bash
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."   # from `stripe listen`, step 3
   ```

2. Run the app: `npm run dev`

3. In a second terminal, forward webhooks to the local route (this prints the
   `whsec_...` value for `STRIPE_WEBHOOK_SECRET`):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Open a published book, click **Buy with Card**, and pay with the Stripe test
   card:

   ```text
   4242 4242 4242 4242   ·   any future expiry   ·   any CVC   ·   any ZIP
   ```

5. The webhook records the sale; confirm it under
   **Dashboard → Sales & royalties**.

## Proof of authorship (blockchain)

Authors can register a book on **Base Sepolia** as tamper-evident proof of
authorship + timestamp. The contract is
[`contracts/AuthorChainRegistry.sol`](contracts/AuthorChainRegistry.sol).

**Stored on-chain:** a `bookHash` (a hash of the book, not the content), the
author's wallet address, a `metadataHash`, a royalty rate (bps), and a timestamp.

**Never on-chain:** book text, manuscripts, private file URLs, or buyer data.

MVP signing uses a **server signer** (`DEPLOYER_PRIVATE_KEY`, testnet only) — the
dashboard "Register Proof of Authorship" button submits the tx for the author. A
later phase can switch to author-signed transactions (browser wallet). The book
hash is currently derived from stable identity fields
([`src/lib/blockchain/book-hash.ts`](src/lib/blockchain/book-hash.ts), marked
MVP) and is designed to be swapped for a real uploaded-file SHA-256 / IPFS CID.

If the registry env vars are missing, the dashboard shows a clear
"not configured" state and never crashes.

### Contract scripts

| Script | What it does |
| --- | --- |
| `npm run hh:compile` | compile the Solidity contract |
| `npm run hh:test` | run the contract test suite (in-process EVM) |
| `npm run hh:deploy` | deploy to Base Sepolia (needs RPC + deployer key) |

### Deploy to Base Sepolia

1. Fund a **testnet** wallet with Base Sepolia ETH (e.g. a faucet).
2. Set in `.env`: `BASE_SEPOLIA_RPC_URL`, `DEPLOYER_PRIVATE_KEY` (testnet key only).
3. `npm run hh:deploy` → copy the printed address into
   `NEXT_PUBLIC_REGISTRY_ADDRESS` in `.env`, then restart the app.

### Required environment variables

```bash
NEXT_PUBLIC_CHAIN_NETWORK="base-sepolia"
NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID="84532"
NEXT_PUBLIC_REGISTRY_ADDRESS=""   # set after deploy
BASE_SEPOLIA_RPC_URL="https://sepolia.base.org"
DEPLOYER_PRIVATE_KEY=""           # testnet only, never a funded mainnet key
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
    db.ts                # Prisma client singleton
    auth/session.ts      # placeholder auth (returns demo author)
    data/                # data-access layer → DTOs (books, stats, sales)
    cover.ts             # deterministic placeholder cover gradients
    ai/agents/           # copy / launch / community (+ pricing/opportunity previews)
    storage/             # StorageDriver interface + local driver
    payments/            # stripe + usdc boundaries
    blockchain/          # registry client (viem) + book-hash util
prisma/
  schema.prisma          # 7 models
  seed.ts                # demo data
docker-compose.yml       # local PostgreSQL
contracts/               # AuthorChainRegistry.sol (proof of authorship)
test/                    # Hardhat contract tests
scripts/deploy.ts        # Base Sepolia deploy script
hardhat.config.ts        # Hardhat (Solidity 0.8.24)
```

## Roadmap

1. **Foundation** ✅ — Next.js + TS + Tailwind, layout, pages, lib scaffolding.
2. **Data layer** ✅ — Prisma schema + Postgres, data-access layer, seed, upload→DB.
3. **Auth + storage** — real auth (replace the placeholder) + manuscript file upload.
4. **Pages live** — dashboard, my books, public book, sales backed by data.
5. **AI agents** — live Claude generation behind the existing mock boundary.
6. **Payments** — Stripe checkout + USDC on Base, status tracking, earnings.
7. **Blockchain** ✅ — `AuthorChainRegistry` proof of authorship on Base Sepolia
   (server-signer MVP). Next: author-signed (browser wallet) + real file hashes.

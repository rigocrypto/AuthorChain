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

## Manuscript storage & file hashing

Authors can upload a manuscript (**PDF** or **EPUB**) when creating a book or
from the book detail page. On upload the server:

1. reads the file bytes and computes a **SHA-256** hash
   ([`src/lib/storage/hash.ts`](src/lib/storage/hash.ts)),
2. stores the bytes via the active storage driver
   ([`src/lib/storage/`](src/lib/storage/)) — locally under **`.storage/books/`**,
3. records a `BookFile` (name, type, size, sha-256, storage key/provider) and
   sets `Book.fileHash` to the sha-256.

**Where files live locally:** `.storage/books/` at the repo root. This folder is
**gitignored** and is **never** placed in `public/`, so files are not served or
linked publicly. There are no reader downloads yet — the public book page shows
only *"Protected reader access coming in Phase 2."*

**Why it strengthens proof of authorship:** the blockchain proof hash now
**prefers the real manuscript file hash**
([`src/lib/blockchain/book-hash.ts`](src/lib/blockchain/book-hash.ts)); the
metadata-derived hash is only an MVP fallback used when no file is uploaded. So a
registered book proves a *specific file* existed at registration time — not just
a database row. The dashboard shows whether a book's proof uses the real file
hash or the fallback.

**Registered-book safety:** once a book has an on-chain proof, manuscript
replacement is disabled (a new file would invalidate the registered hash).
Versioned re-registration (`BookVersion`) is a future release.

**Future storage adapters:** the `StorageDriver` interface is provider-agnostic;
`BookFile.storageProvider` (LOCAL/S3/IPFS/ARWEAVE) and `storageKey` are already
in the schema so S3, Cloudflare R2, IPFS, or Arweave can be added as drop-in
drivers selected by the `STORAGE_DRIVER` env var — no call-site changes.

## Cover, ISBN & barcode (publishing identity)

Beyond the protected manuscript, a book has a **public** publishing identity:
a cover image, ISBN metadata, and an ISBN barcode.

**Covers** — authors upload JPG/PNG/WEBP. Like manuscripts, covers are stored
under `.storage/` (`.storage/covers/`), **not** in `public/`, and are hashed
(SHA-256). Unlike manuscripts they are *meant to be shown*, so they're served
through a **controlled route** — never by exposing a storage key:

```text
GET /api/assets/books/[bookId]/cover     # public cover image
GET /api/assets/books/[bookId]/barcode   # ISBN barcode SVG
```

That route only serves `COVER` / `BARCODE` assets — manuscripts are unreachable
through it. Cover/ISBN are publishing metadata and **do not** change the
registered manuscript proof hash (the dashboard states this explicitly).

**ISBN vs barcode** — the **ISBN** is the *number* (the identifier); the
**barcode** is a scannable *rendering* of it. AuthorChain **does not issue
ISBNs** — authors enter their own assigned ISBN (from Bowker/MyIdentifiers in the
US, or their national agency). We only **validate** it
([`src/lib/publishing/isbn.ts`](src/lib/publishing/isbn.ts): strip separators,
13 digits, check-digit) and reject invalid input.

**Barcode generation** — an ISBN-13 *is* an EAN-13, so we render the standard
Bookland EAN-13 as **SVG** via `bwip-js`
([`src/lib/publishing/barcode.ts`](src/lib/publishing/barcode.ts)) and store it as
a `BARCODE` asset. It's labelled an *"ISBN barcode preview/export asset"* — not a
print-certified artifact.

**Metadata** — `Book` also carries optional `isbn10`, `publisherName`,
`publicationDate`, `edition`, and `bookFormat` (EBOOK/PAPERBACK/HARDCOVER/
AUDIOBOOK), shown on the public book page and used (cover image) in Stripe
Checkout when a public `NEXT_PUBLIC_APP_URL` is configured.

**Storage model** — assets live in a `BookAsset` table
(`assetType`, `storageProvider`, `storageKey`, `mimeType`, `hash`, `isPrimary`),
mirroring `BookFile`, so future S3/R2/IPFS/Arweave drivers are drop-in.

**Future:** print-ready back-cover export (barcode + price add-on at exact print
dimensions) — deliberately out of scope for now; this phase gets the data and
assets right first.

## Reader library & protected access

When a reader buys a book, the Stripe webhook (in the same transaction that
records the `Sale` + `Royalty`) upserts a **`Reader`** by email and creates a
**`ReaderLibrary`** entitlement (`ACTIVE`) linked to that sale. This is idempotent
— `saleId` is unique and a re-purchase upserts by `(reader, book)`, so webhook
retries never duplicate access.

**Getting access** — after checkout, the success page links to
`GET /api/reader/claim?session_id=…`, which looks up the sale server-side,
resolves the buyer's `Reader`, and sets a **signed, httpOnly cookie**
(`reader_session`), then redirects to `/reader/library`. The reader session is an
MVP placeholder ([`src/lib/auth/reader-session.ts`](src/lib/auth/reader-session.ts),
HMAC-signed with `AUTH_SECRET`) — swap it for NextAuth/Clerk/Supabase later
without touching callers, exactly like the author placeholder.

**Reading** — `/reader/library` lists purchased books; `/reader/books/[id]` shows
one, with proof-of-authorship links. The manuscript is delivered **only** through
a gated route:

```text
GET /api/reader/books/[bookId]/download
```

It requires a signed-in reader with an **ACTIVE** entitlement — otherwise `403`.
The manuscript is streamed from private storage with a safe filename; the storage
key is never exposed, and this file is **never** reachable through the public
`/api/assets/...` route.

**Public vs private, recap:**

| Asset | Visibility | Route |
| --- | --- | --- |
| Cover, barcode | Public | `/api/assets/books/[id]/cover` · `/barcode` |
| Manuscript | Private (ACTIVE entitlement only) | `/api/reader/books/[id]/download` |

**Refunds/revocation** — `ReaderLibrary.accessStatus` supports `REFUNDED` /
`REVOKED`; the download route only serves `ACTIVE`. Automated handling (a future
Stripe `charge.refunded` webhook that flips status) is out of scope for now.

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
    data/                # data-access layer → DTOs (books, stats, sales, book-files)
    cover.ts             # deterministic placeholder cover gradients
    ai/agents/           # copy / launch / community (+ pricing/opportunity previews)
    storage/             # StorageDriver + local driver + sha-256 hashing
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

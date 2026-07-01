# AuthorChain — Demo Brief

## What AuthorChain is

AuthorChain is an AI-assisted Web3 publishing platform for independent authors.
Creators publish books, **prove authorship of the real manuscript file on-chain**,
sell through Stripe, track royalties, and give buyers secure access to what they
purchased.

**Publish. Own. Earn. Grow.**

## What works today

Every item below is implemented and has been validated end-to-end against a real
Postgres database, Stripe test mode, and the Base Sepolia testnet:

- Author dashboard
- Book upload with private manuscript storage
- Real **SHA-256** hashing of the uploaded file
- **Base Sepolia** proof-of-authorship registry
- Cover upload (served via a controlled route, never from `public/`)
- **ISBN-13** validation + **EAN-13 barcode** (SVG) generation
- Stripe Checkout
- Webhook-driven **Sale + Royalty** recording (idempotent on retry)
- Reader identity + **entitlement** creation on successful payment
- Protected **reader library** and reader book page
- Secure, entitlement-gated manuscript download for buyers
- **403** for non-buyers (no cookie, forged cookie, or a book they don't own)

## Verified blockchain proof

AuthorChain does **not** put book content on-chain. It registers a cryptographic
hash of the manuscript file — proof that a specific file existed under an
authorship claim at a specific time.

- **Registry contract (Base Sepolia):** `0x804447c70af049dA4999AdDd4E344b19a17330E1`
- **Book:** The Ultimate AI Prompts PlayBook
- **File SHA-256:** `d84e60d24e33ae791998552e57a429772d8d2524e19dfd95bbafbeb14bdcdbc1`
- **On-chain bookHash:** `0xd84e60d24e33ae791998552e57a429772d8d2524e19dfd95bbafbeb14bdcdbc1`
- **Transaction:** `0x68f58137aa9164d4a98be765695f61921900af9557b3f52339833581954975e8`

> Independently verifiable: the transaction and contract are public on
> [sepolia.basescan.org](https://sepolia.basescan.org/tx/0x68f58137aa9164d4a98be765695f61921900af9557b3f52339833581954975e8),
> and the on-chain `bookHash` equals the SHA-256 of the actual manuscript file
> the buyer downloads (verified byte-for-byte during testing).

## Core differentiator

Most publishing platforms prove only that a *listing* exists. AuthorChain proves
that a specific *manuscript file* existed at a specific time by registering its
SHA-256 on-chain. The author can demonstrate:

> "This exact manuscript file existed under my authorship claim at this timestamp."

## Commerce flow

```text
Author uploads manuscript
  → SHA-256 hash generated
  → proof registered on Base Sepolia
  → reader buys with Stripe
  → webhook records Sale + Royalty
  → reader entitlement created
  → buyer downloads the private manuscript
  → non-buyers are blocked (403)
```

## Current MVP boundaries (intentional)

AuthorChain currently runs on:

- Testnet blockchain (Base Sepolia)
- Stripe test mode
- Local protected storage (`.storage/`)
- Placeholder author session (seeded demo author)
- Signed reader-session cookie (HMAC placeholder, swappable for real auth)
- Server-side signing for on-chain proof registration

These are deliberate MVP choices. The architecture is built to upgrade — each
boundary is isolated behind a seam (storage driver, auth module, payments/registry
clients) — toward:

- Production authentication (NextAuth/Clerk/Supabase)
- S3 / R2 / IPFS / Arweave storage drivers
- Browser-wallet author signing
- USDC payments on Base
- Refund / revoke automation
- Marketplace discovery
- Print-ready export / print-on-demand

## Why it matters

Independent authors face platform lock-in, delayed payouts, weak ownership
records, thin reader relationships, and publishing friction. AuthorChain gives
them a creator-first system where **authorship, payments, royalties, and reader
access are verifiable end to end**.

## Status

Validated end-to-end MVP loop:

**Publish → Prove → Sell → Earn → Deliver**

## Project site (GitHub Pages)

A static public project page lives in [`docs/`](docs/) (`docs/index.html`). It is
a landing/proof page only — **not** the full app (which needs server routes,
Postgres, Stripe webhooks, and protected downloads, so it deploys to Vercel/Railway
later).

To enable it:

1. GitHub repo → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/docs` · **Save**

Expected URL: `https://rigocrypto.github.io/AuthorChain/`

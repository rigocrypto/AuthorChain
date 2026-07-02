# AuthorChain — Investor Memo (one-page)

**AuthorChain** — AI-assisted Web3 publishing for independent authors.
**Publish. Own. Earn. Grow.**

---

## Problem

Independent authors are stuck between two bad options: legacy publishers that take
control and a large share of revenue, or self-publishing platforms that create
**platform lock-in, delayed payouts, and weak ownership records**. When a
dispute over authorship or timing arises, an author's proof is a database row on
a platform they don't control. Royalties are opaque and slow, and authors rarely
own the relationship with their readers.

## Solution

AuthorChain gives authors a **creator-first** pipeline where authorship,
payments, royalties, and reader access are **verifiable end to end**:

- Publish a book and upload the manuscript to **private** storage.
- **Prove authorship on-chain** by registering the manuscript's SHA-256 hash
  (the file itself never leaves private storage).
- Sell via card (Stripe), with automatic **sale + royalty** tracking.
- Buyers get **secure, entitlement-gated** access to what they purchased.

## Differentiator

Most platforms prove only that a *listing* exists. AuthorChain proves that a
*specific manuscript file* existed at a specific time — an author can show
**"this exact file existed under my authorship claim at this timestamp,"**
independently verifiable on a public blockchain.

## Traction — a validated MVP loop (not a mockup)

The full loop is **implemented and tested end-to-end** against a real database,
Stripe (test mode), and the **Base Sepolia** testnet:

```text
Publish → Prove (on-chain) → Sell → Earn (royalty) → Deliver (gated download)
```

Verifiable proof of the hard part — on-chain authorship:

- **Registry contract:** `0x804447c70af049dA4999AdDd4E344b19a17330E1` (Base Sepolia)
- **On-chain bookHash == file SHA-256:** `d84e60…dbc1` (verified byte-for-byte
  against the manuscript the buyer downloads)
- **Transaction:** `0x68f58137…954975e8` — public on basescan

Engineering signals: idempotent payment webhooks, enforced access control
(non-buyers blocked with 403), strict public/private asset separation, and **no
high or critical** advisories in the production dependency tree (the moderate
Privy wallet-connector advisories introduced by the auth layer are documented in
SECURITY.md).

## Market / why now

- Millions of self-published titles per year and a growing creator economy.
- Maturing, low-cost L2 infrastructure (Base) makes on-chain proof practical.
- Rising author demand for ownership, transparent payouts, and portability.
- Initial focus: independent authors, self-published creators, educators,
  technical writers, and digital-product creators.

## Roadmap to production

Each MVP boundary sits behind an upgrade seam (storage driver, auth module,
payments/registry clients), so productionizing is additive, not a rewrite:

- Production auth (NextAuth/Clerk/Supabase) · browser-wallet author signing
- S3 / R2 / IPFS / Arweave storage · mainnet (Base) deploy
- USDC payments · refund/revoke automation · marketplace discovery
- Print-ready export / print-on-demand

## The team

- Founded by **Rigo Vivas**, a Web3 developer building AI + blockchain
  applications for creator ownership, payments, and digital trust.
- Solo founder — seeking strategic collaborators.

## The ask

**Seeking feedback, early beta authors, strategic collaborators, and potential
investor conversations.**

Where support and investment would go next: production authentication, cloud
storage (S3/R2/IPFS/Arweave), marketplace discovery, wallet-based author signing,
USDC payments, a full security review, and beta-author onboarding.

## Verify it yourself

- **Repo:** https://github.com/rigocrypto/AuthorChain
- **Registry contract (Base Sepolia):** `0x804447c70af049dA4999AdDd4E344b19a17330E1`
- **Verified transaction:** `0x68f58137aa9164d4a98be765695f61921900af9557b3f52339833581954975e8`

**Contact:** Rigo Vivas · GitHub: https://github.com/rigocrypto/AuthorChain

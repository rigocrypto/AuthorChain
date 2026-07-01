# How AuthorChain Proves Real Manuscript Ownership On-Chain

*By Rigo Vivas*

Ask an independent author how they'd prove a manuscript is theirs, and the honest
answer is usually uncomfortable: a file's "date modified," an email to themselves,
maybe a listing on a platform they don't control. If a dispute ever happened —
over who wrote what, and *when* — that evidence is weak, editable, and tied to a
company that can change its terms, lose the record, or disappear.

That bothered me enough to build something about it. **AuthorChain** is my attempt
to give authors a stronger, verifiable ownership record — without asking them to
put their book on a public blockchain for the world to copy.

Here's the core idea in one sentence: **AuthorChain proves you own the actual
manuscript file by hashing the private file and registering only that hash
on-chain. The manuscript itself never leaves private storage.**

## Why the manuscript stays private — and only the hash goes on-chain

A blockchain is public and permanent. That's exactly what you want for a *proof*,
and exactly what you *don't* want for a book you intend to sell. So AuthorChain
never uploads the manuscript on-chain.

Instead, when an author uploads their file, the server computes a **SHA-256 hash**
of the raw bytes. A SHA-256 hash is a 64-character fingerprint: change a single
character in the file and the hash changes completely, but you can't reconstruct
the file from the hash. It's a one-way fingerprint.

That fingerprint — and only that fingerprint — gets written to a smart contract.
The proof is public and tamper-evident; the content stays private. An author can
later point to the chain and say: *"This exact file existed under my authorship
claim at this timestamp,"* and anyone can verify it.

## The flow, end to end

The whole loop is:

**private manuscript → SHA-256 hash → Base Sepolia proof → Stripe sale → protected reader access**

Let me make that concrete with a book I actually ran through the system,
*The Ultimate AI Prompts PlayBook*:

- The manuscript's SHA-256 is
  `d84e60d24e33ae791998552e57a429772d8d2524e19dfd95bbafbeb14bdcdbc1`.
- That hash was registered to the AuthorChain registry contract on Base Sepolia:
  `0x804447c70af049dA4999AdDd4E344b19a17330E1`.
- The registration transaction is public:
  `0x68f58137aa9164d4a98be765695f61921900af9557b3f52339833581954975e8`.

Here's the part I'm most proud of: the hash stored on-chain is **byte-for-byte
identical** to the SHA-256 of the exact file a buyer downloads. I verified that
during testing — the file the reader receives hashes to the same value recorded on
the blockchain. The proof isn't decorative; it's bound to the real artifact.

## What happens after someone buys

Proof of authorship is only half the story. Authors need to *sell*, and buyers
need to actually *receive* what they paid for — securely.

When a reader buys a book, checkout runs through **Stripe**. On a successful
payment, a webhook records the sale and the author's royalty, and — in the same
database transaction — creates a **reader entitlement** tied to that purchase. The
buyer then lands in a personal library where their book is waiting.

Downloading the manuscript goes through a protected route that checks the reader's
entitlement first. If you have an active entitlement, you get the file, streamed
from private storage with a clean filename. If you don't, you get a **403** —
blocked. I tested this deliberately: no session, a forged session cookie, and a
request for a book the reader never bought all return 403. And the manuscript is
*never* reachable through the public routes that serve covers or barcodes.

So the private/public boundary holds in both directions: the proof is public and
verifiable, while the file stays locked to people who actually paid.

## Why this is different from "just uploading a book listing"

Most publishing platforms can prove a *listing* exists — a row in their database
saying "this title, this author, this date." That record lives on their servers,
under their control, and proves nothing about the file itself.

AuthorChain proves the *file*. The difference matters the moment there's a
disagreement about authorship or timing. A listing says "we have an entry for
this." A hash on a public chain says "this specific manuscript existed, unchanged,
at this time — go check the blockchain yourself." One is a claim; the other is
evidence anyone can independently verify.

## Being honest about where this is

I'd rather undersell this than overhype it, so here's the real status:
**AuthorChain is a validated MVP, not a production product.**

- The blockchain proof runs on **Base Sepolia** — a testnet, not mainnet.
- Payments run in **Stripe test mode**.
- Files are stored in **local protected storage**, not cloud infrastructure yet.
- Authentication is a **placeholder seam** (the reader session is a signed cookie
  standing in for real login).

These are deliberate MVP choices. What makes me comfortable calling it "validated"
is that the entire loop — publish, prove, sell, earn, deliver — works end to end
against a real database, real Stripe test checkout, and a real on-chain
transaction you can inspect right now. No mockups in the critical path.

Just as important, each of those boundaries sits behind a clean upgrade seam — a
storage-driver interface, an auth module, payment and registry clients — so moving
to production is additive, not a rewrite.

## Where it goes next

The roadmap from here is mostly about hardening what already works:

- **Real authentication** (NextAuth/Clerk/Supabase) replacing the placeholder.
- **Cloud storage** drivers (S3 / R2 / IPFS / Arweave) behind the same interface.
- **Browser-wallet author signing**, so authors sign their own proofs instead of a
  server signer.
- **Mainnet** deployment and **USDC** payments on Base.
- A **hosted demo** so people can try the flow, plus a proper **security review**.

None of that changes the core claim — it just makes it production-grade.

## Try it and tell me what's wrong with it

You can see the whole thing, including the live on-chain proof, on the project
page: <https://rigocrypto.github.io/AuthorChain/>. The code is open source:
<https://github.com/rigocrypto/AuthorChain>.

I'm building this in the open because I think independent authors deserve
verifiable ownership, transparent royalties, and a direct line to their readers —
and because the best way to find the holes in an idea is to show it to people who
know more than I do.

So that's my ask: **I'm looking for feedback from independent authors, Web3
builders, publishing people, and collaborators.** If you've fought the ownership
problem from any of those angles, I'd genuinely like to hear where you think this
is right, where it's wrong, and what you'd need before you'd trust it with your own
work.

**Publish. Own. Earn. Grow.**

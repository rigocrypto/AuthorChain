# Security

## Dependency vulnerabilities (`npm audit`)

Last reviewed: **2026-07-02**

### Production-tree advisories from Privy (accepted, moderate)

Adding **Privy** (`@privy-io/react-auth` + `@privy-io/server-auth`) for
account-abstraction auth introduced **13 moderate** advisories into the
production tree (previously 0). Every one comes from Privy's bundled Web3
wallet-connector stack — the same libraries any embedded-wallet/AA SDK ships:

- `wagmi` / `@wagmi/connectors` / `@gemini-wallet/core`
- `@metamask/sdk` + `@metamask/utils` / `@metamask/rpc-errors`
- `@solana/web3.js` → `jayson`
- rooted mostly in **`uuid`** ("missing buffer bounds check in v3/v5/v6") and
  MetaMask/Solana connector code.

**Accepted risk (moderate, monitored):** all are **moderate** (no high/critical).
The `uuid` issue requires passing attacker-controlled bytes as a `buf` to
uuid v3/v5/v6 — an API Privy's internals don't expose to us. The connector code
runs in the client wallet flow. We do **not** force overrides here: bumping
`uuid`/wallet-connector versions across MetaMask/Solana deps risks breaking
Privy's login/wallet flow, and `npm audit fix --force` is prohibited. We monitor
for upstream Privy releases that update these.

### Dev-only advisories from Hardhat

The remaining advisories originate from **`hardhat`**, a **devDependency** used
only to compile/test/deploy the `AuthorChainRegistry` contract — **not shipped in
production**. The one prod-tree advisory Hardhat *would* have shared (`ws` via
`viem`) is fixed by an npm `override` to `ws ^8.21.0` (see `package.json`).

### Why we don't "fix" the rest

`npm audit fix --force` resolves the remaining advisories only by upgrading
**Hardhat 2 → Hardhat 3**, which is a breaking change:

- Hardhat 3 requires the whole project to be ESM (`"type": "module"`), which
  breaks the Next.js app config, the Prisma `tsx` seed, and PostCSS config.
- It also requires rewriting `hardhat.config.ts`, the test suite, and the deploy
  flow for Hardhat 3's new API.
- Critically, Hardhat 3 does **not** fix the only production-relevant advisory
  (`ws` via `viem`) — that was a `viem` issue, already handled by our override.

Because every remaining advisory is **dev-only tooling** that never reaches
users, and runs locally on trusted inputs (our own contract sources), the risk
is negligible and does not justify a breaking framework migration.

> Note: a Dependabot PR that performed this Hardhat 2→3 upgrade was reverted for
> exactly these reasons. Future Dependabot PRs that bump Hardhat across a major
> version should be evaluated (and likely declined) with this context in mind.

### Remaining advisories (all via `hardhat` devDependency)

| Package | Severity | Reached via |
| --- | --- | --- |
| serialize-javascript | high | hardhat → mocha |
| tmp | high | hardhat → solc |
| undici | high/moderate/low | hardhat |
| uuid | moderate | hardhat |
| mocha | moderate | hardhat |
| @nomicfoundation/hardhat-* | moderate | hardhat plugins |
| cookie | low | hardhat → @sentry/node |
| elliptic, secp256k1, ethereum-cryptography, ethereumjs-util | low | hardhat → ethers stack |
| @ethersproject/* | low | hardhat |
| solc, @sentry/node | low | hardhat |

Verify anytime with `npm ls <package>` — each traces to `hardhat`.

### Monitoring

- Watch for a Hardhat 2.x patch (or a non-breaking plugin update) that reduces
  the dev-tooling advisory surface without requiring the ESM/Hardhat 3 migration.
- Re-run `npm audit` after any dependency change and keep the production tree
  (next / react / viem / stripe / prisma) at **zero** advisories.

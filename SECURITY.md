# Security

## Dependency vulnerabilities (`npm audit`)

Last reviewed: **2026-06-30**

### Summary

`npm audit` reports advisories that all originate from **`hardhat`**, which is a
**devDependency** used only for compiling, testing, and deploying the
`AuthorChainRegistry` smart contract. **None of them are shipped in the
production application** (the Next.js app bundles only `next`, `react`,
`viem`, `stripe`, and `@prisma/client`).

The one advisory that *did* touch the production dependency tree — `ws` pulled in
transitively by `viem` — has been fixed with an npm `override` to a patched
version (`ws ^8.21.0`). See `package.json` → `overrides`.

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

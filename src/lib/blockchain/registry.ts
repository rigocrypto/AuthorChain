/**
 * Client for the AuthorChainRegistry smart contract (Phase 7).
 *
 * The contract stores only proof of authorship — a content hash, the author's
 * wallet, a timestamp, and royalty percentage. Full book content never goes
 * on-chain. Deployed to Base Sepolia first.
 */
export type AuthorshipProof = {
  contentHash: `0x${string}`;
  author: `0x${string}`;
  royaltyBps: number; // basis points, 0–10000
};

export function getChainConfig() {
  return {
    network: process.env.NEXT_PUBLIC_CHAIN_NETWORK ?? "base-sepolia",
    registryAddress: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? null,
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org",
  };
}

export async function registerAuthorship(
  _proof: AuthorshipProof,
): Promise<{ txHash: string; mocked: boolean }> {
  // TODO Phase 7: use viem + a server signer to call registry.register(...).
  return { txHash: "0xmock", mocked: true };
}

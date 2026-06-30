/**
 * USDC-on-Base payment boundary (Phase 6).
 *
 * Flow: the buyer sends USDC to the author's wallet; we watch for the transfer
 * and mark the sale paid. This module centralizes the USDC contract + network
 * config. Base Sepolia (testnet) is the default for MVP.
 */
export const USDC_CONTRACTS: Record<string, string> = {
  // Base Sepolia testnet USDC
  "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  // Base mainnet USDC
  base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
};

export function getUsdcConfig() {
  const network = process.env.NEXT_PUBLIC_CHAIN_NETWORK ?? "base-sepolia";
  return {
    network,
    usdcAddress: USDC_CONTRACTS[network],
    payToAddress: process.env.AUTHORCHAIN_PAYOUT_ADDRESS ?? null,
  };
}

export async function verifyUsdcPayment(_txHash: string): Promise<boolean> {
  // TODO Phase 6: read the tx receipt via viem and confirm a USDC Transfer
  // of the expected amount to the author's wallet.
  return false;
}

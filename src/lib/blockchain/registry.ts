import {
  createWalletClient,
  createPublicClient,
  http,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";

/**
 * Client for the AuthorChainRegistry smart contract (Base Sepolia).
 *
 * The contract stores only proof of authorship — a content hash, the author's
 * wallet, a metadata hash, a timestamp, and royalty rate. Full book content
 * never goes on-chain.
 *
 * MVP signing model: a trusted **server signer** (DEPLOYER_PRIVATE_KEY, testnet
 * only) submits the tx and passes the author's wallet explicitly. Everything
 * degrades to a mock when env vars are missing, so the app never crashes.
 */

// Minimal ABI — kept inline so the app doesn't depend on Hardhat artifacts.
const REGISTRY_ABI = [
  {
    type: "function",
    name: "register",
    stateMutability: "nonpayable",
    inputs: [
      { name: "bookHash", type: "bytes32" },
      { name: "author", type: "address" },
      { name: "metadataHash", type: "string" },
      { name: "royaltyBps", type: "uint16" },
    ],
    outputs: [{ name: "registrationId", type: "bytes32" }],
  },
  {
    type: "function",
    name: "isRegistered",
    stateMutability: "view",
    inputs: [{ name: "bookHash", type: "bytes32" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const EXPLORER_BASE = "https://sepolia.basescan.org";

export type AuthorshipProof = {
  bookHash: `0x${string}`;
  author: `0x${string}`;
  metadataHash: string;
  royaltyBps: number; // basis points, 0–10000
};

export function getChainConfig() {
  return {
    network: process.env.NEXT_PUBLIC_CHAIN_NETWORK ?? "base-sepolia",
    chainId: Number(process.env.NEXT_PUBLIC_BASE_SEPOLIA_CHAIN_ID ?? 84532),
    registryAddress: process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ?? null,
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org",
    explorerBase: EXPLORER_BASE,
  };
}

/** True only when we can actually broadcast: registry address + server signer. */
export function isRegistryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_REGISTRY_ADDRESS && process.env.DEPLOYER_PRIVATE_KEY,
  );
}

export function getExplorerTxUrl(txHash: string): string {
  return `${EXPLORER_BASE}/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}

function normalizePrivateKey(raw: string): Hex {
  const k = raw.trim();
  return (k.startsWith("0x") ? k : `0x${k}`) as Hex;
}

/**
 * Register proof of authorship on-chain. Returns the tx hash and the contract
 * address. When not configured, returns a mock result (mocked: true) so callers
 * can short-circuit without throwing.
 */
export async function registerAuthorship(
  proof: AuthorshipProof,
): Promise<{ txHash: string; mocked: boolean; contractAddress: string | null }> {
  const cfg = getChainConfig();

  if (!isRegistryConfigured() || !cfg.registryAddress) {
    return { txHash: "0xmock", mocked: true, contractAddress: cfg.registryAddress };
  }

  const account = privateKeyToAccount(
    normalizePrivateKey(process.env.DEPLOYER_PRIVATE_KEY as string),
  );
  const transport = http(cfg.rpcUrl);
  const wallet = createWalletClient({ account, chain: baseSepolia, transport });
  const publicClient = createPublicClient({ chain: baseSepolia, transport });

  const txHash = await wallet.writeContract({
    address: cfg.registryAddress as `0x${string}`,
    abi: REGISTRY_ABI,
    functionName: "register",
    args: [proof.bookHash, proof.author, proof.metadataHash, proof.royaltyBps],
  });

  // Wait for inclusion so we only mark REGISTERED on a confirmed, successful tx.
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  if (receipt.status !== "success") {
    throw new Error(`Registration transaction reverted (${txHash}).`);
  }

  return { txHash, mocked: false, contractAddress: cfg.registryAddress };
}

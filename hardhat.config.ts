import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import type { HardhatUserConfig } from "hardhat/config";

/**
 * Hardhat config for the AuthorChainRegistry contract (Base Sepolia).
 *
 * Network config is built only when the testnet env vars are present, so
 * `npx hardhat test` (in-process EVM) works with zero configuration. Secrets are
 * read from .env (loaded above) — never hardcode a private key here.
 */
const BASE_SEPOLIA_RPC_URL =
  process.env.BASE_SEPOLIA_RPC_URL ?? "https://sepolia.base.org";

// Hardhat requires a 0x-prefixed key; normalize so a bare-hex .env value works.
const rawKey = process.env.DEPLOYER_PRIVATE_KEY?.trim();
const DEPLOYER_PRIVATE_KEY = rawKey
  ? rawKey.startsWith("0x")
    ? rawKey
    : `0x${rawKey}`
  : undefined;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    baseSepolia: {
      url: BASE_SEPOLIA_RPC_URL,
      chainId: 84532,
      accounts: DEPLOYER_PRIVATE_KEY ? [DEPLOYER_PRIVATE_KEY] : [],
    },
  },
};

export default config;

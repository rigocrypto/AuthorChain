import { ethers, network } from "hardhat";

/**
 * Deploy AuthorChainRegistry.
 *
 *   npx hardhat run scripts/deploy.ts --network baseSepolia
 *
 * Requires BASE_SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY in .env (testnet only).
 * Copy the printed address into NEXT_PUBLIC_REGISTRY_ADDRESS.
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error(
      "No deployer account. Set DEPLOYER_PRIVATE_KEY in .env (testnet key).",
    );
  }

  console.log(`Network:  ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  const Factory = await ethers.getContractFactory("AuthorChainRegistry");
  const registry = await Factory.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log(`\nAuthorChainRegistry deployed to: ${address}`);
  console.log(`\nNext step: set in your .env\n  NEXT_PUBLIC_REGISTRY_ADDRESS="${address}"`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

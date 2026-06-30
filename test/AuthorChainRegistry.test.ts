import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";

const ZERO_HASH =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

describe("AuthorChainRegistry", () => {
  async function deploy() {
    const [deployer, author, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("AuthorChainRegistry");
    const registry = await Factory.deploy();
    await registry.waitForDeployment();
    return { registry, deployer, author, other };
  }

  const bookHash = ethers.id("book:the-quantum-prison");
  const metadataHash = "sha256:abc123";
  const royaltyBps = 1000; // 10%

  it("registers a book and emits BookRegistered", async () => {
    const { registry, author } = await deploy();

    await expect(
      registry.register(bookHash, author.address, metadataHash, royaltyBps),
    )
      .to.emit(registry, "BookRegistered")
      .withArgs(
        anyValue, // registrationId
        author.address,
        bookHash,
        metadataHash,
        royaltyBps,
        anyValue, // timestamp
      );

    expect(await registry.isRegistered(bookHash)).to.equal(true);

    const reg = await registry.getRegistration(bookHash);
    expect(reg.author).to.equal(author.address);
    expect(reg.bookHash).to.equal(bookHash);
    expect(reg.metadataHash).to.equal(metadataHash);
    expect(reg.royaltyBps).to.equal(royaltyBps);
    expect(reg.timestamp).to.be.greaterThan(0n);
  });

  it("prevents duplicate registration of the same bookHash", async () => {
    const { registry, author, other } = await deploy();
    await registry.register(bookHash, author.address, metadataHash, royaltyBps);

    await expect(
      registry.register(bookHash, other.address, metadataHash, royaltyBps),
    ).to.be.revertedWith("already registered");
  });

  it("rejects royaltyBps above 10000", async () => {
    const { registry, author } = await deploy();
    await expect(
      registry.register(bookHash, author.address, metadataHash, 10001),
    ).to.be.revertedWith("royaltyBps too high");
  });

  it("allows exactly 10000 bps", async () => {
    const { registry, author } = await deploy();
    await expect(
      registry.register(bookHash, author.address, metadataHash, 10000),
    ).to.not.be.reverted;
  });

  it("rejects a zero book hash", async () => {
    const { registry, author } = await deploy();
    await expect(
      registry.register(ZERO_HASH, author.address, metadataHash, royaltyBps),
    ).to.be.revertedWith("bookHash required");
  });

  it("rejects a zero author address", async () => {
    const { registry } = await deploy();
    await expect(
      registry.register(bookHash, ethers.ZeroAddress, metadataHash, royaltyBps),
    ).to.be.revertedWith("author required");
  });

  it("reports unregistered hashes and reverts on missing details", async () => {
    const { registry } = await deploy();
    const unknown = ethers.id("book:does-not-exist");
    expect(await registry.isRegistered(unknown)).to.equal(false);
    await expect(registry.getRegistration(unknown)).to.be.revertedWith(
      "not registered",
    );
  });

  it("derives a deterministic registrationId from (bookHash, author)", async () => {
    const { registry, author } = await deploy();
    const expectedId = ethers.keccak256(
      ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes32", "address"],
        [bookHash, author.address],
      ),
    );
    await expect(
      registry.register(bookHash, author.address, metadataHash, royaltyBps),
    )
      .to.emit(registry, "BookRegistered")
      .withArgs(
        expectedId,
        author.address,
        bookHash,
        metadataHash,
        royaltyBps,
        anyValue,
      );
  });
});

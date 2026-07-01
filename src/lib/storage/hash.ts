import { createHash } from "node:crypto";

/**
 * Content hashing for stored files (server-only). Kept separate from any driver
 * so every storage backend (local now; S3/R2/IPFS/Arweave later) hashes bytes
 * the same way. The sha-256 of the actual file bytes is what backs the
 * on-chain proof of authorship.
 */
export function sha256Hex(data: Buffer | Uint8Array): string {
  return createHash("sha256").update(Buffer.from(data)).digest("hex");
}

/** A 0x-prefixed bytes32 form of a 64-char hex hash, for on-chain use. */
export function toBytes32(hex: string): `0x${string}` {
  const clean = hex.replace(/^0x/, "").toLowerCase();
  return `0x${clean}`;
}

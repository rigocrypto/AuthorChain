/**
 * Storage driver contract. Books are stored OFF-CHAIN. Drivers (local now;
 * IPFS / Arweave / S3 later) implement this so the rest of the app never
 * depends on where files actually live.
 */
export type StoredFile = {
  /** Driver-specific locator, e.g. a path, S3 key, or ipfs:// URI. */
  key: string;
  /** sha-256 hash of the bytes — this is what gets registered on-chain. */
  sha256: string;
  size: number;
  contentType?: string;
};

export interface StorageDriver {
  /** Persist bytes and return a locator + content hash. */
  put(
    fileName: string,
    data: Buffer | Uint8Array,
    contentType?: string,
  ): Promise<StoredFile>;
  /** Read bytes back by key. */
  get(key: string): Promise<Buffer>;
}

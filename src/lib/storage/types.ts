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
  /**
   * Persist bytes and return a locator + content hash. `prefix` selects the
   * logical folder/namespace (e.g. "books" | "covers" | "barcodes").
   */
  put(
    fileName: string,
    data: Buffer | Uint8Array,
    contentType?: string,
    prefix?: string,
  ): Promise<StoredFile>;
  /** Read bytes back by key. */
  get(key: string): Promise<Buffer>;
  /**
   * Optional: presign a direct client-to-storage PUT for `key`. Drivers that
   * support it (e.g. R2/S3) let large files skip the server request-body limit;
   * callers own the key namespace and re-validate on finalize. Absent on the
   * local driver, where uploads go through the server as before.
   */
  presignPut?(
    key: string,
    contentType: string,
    expiresSeconds?: number,
  ): Promise<{ uploadUrl: string; key: string }>;
  /** Optional: delete an object by key (cleanup for rejected uploads). */
  delete?(key: string): Promise<void>;
}

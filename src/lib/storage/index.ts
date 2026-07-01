import { LocalStorageDriver } from "./local-driver";
import type { StorageDriver } from "./types";

/**
 * Returns the active storage driver. Selected by STORAGE_DRIVER env var;
 * defaults to local. Add "ipfs" | "arweave" | "s3" cases as they land.
 */
export function getStorage(): StorageDriver {
  switch (process.env.STORAGE_DRIVER) {
    case "local":
    default:
      return new LocalStorageDriver();
  }
}

export type { StorageDriver, StoredFile } from "./types";
export { sha256Hex, toBytes32 } from "./hash";

import { randomUUID } from "node:crypto";
import { LocalStorageDriver } from "./local-driver";
import { R2StorageDriver } from "./r2-driver";
import type { StorageDriver } from "./types";

/**
 * Returns the active storage driver. Selected by STORAGE_DRIVER env var;
 * defaults to local. Add "ipfs" | "arweave" cases as they land.
 *
 * `r2` constructs the R2 driver, which throws a clear (secret-free) error if its
 * env vars are missing — a misconfigured `STORAGE_DRIVER=r2` fails loudly rather
 * than silently serving from the wrong backend.
 */
export function getStorage(): StorageDriver {
  switch (process.env.STORAGE_DRIVER) {
    case "r2":
      return new R2StorageDriver();
    case "local":
    default:
      return new LocalStorageDriver();
  }
}

/**
 * Whether the active driver supports presigned direct client uploads. When true,
 * large files (manuscripts/covers) upload straight to storage, bypassing the
 * server request-body limit; when false, uploads go through the server as before.
 */
export function storageSupportsDirectUpload(): boolean {
  return process.env.STORAGE_DRIVER === "r2";
}

/**
 * A server-owned object key for a direct upload: `prefix/bookId/uuid-safeName`.
 * The key is chosen server-side (never by the client) and scoped to the book, so
 * a presigned PUT can't overwrite another book's object or escape its namespace.
 */
export function buildUploadKey(
  prefix: string,
  bookId: string,
  fileName: string,
): string {
  const safePrefix = /^[a-z0-9-]+$/.test(prefix) ? prefix : "books";
  const safeBook = bookId.replace(/[^a-zA-Z0-9_-]/g, "");
  const safeFile = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${safePrefix}/${safeBook}/${randomUUID()}-${safeFile}`;
}

/** Best-effort delete used to clean up rejected/oversized direct uploads. */
export async function deleteStoredObject(key: string): Promise<void> {
  try {
    await getStorage().delete?.(key);
  } catch {
    // Cleanup is best-effort; a stray object is not worth failing the request.
  }
}

export type { StorageDriver, StoredFile } from "./types";
export { sha256Hex, toBytes32 } from "./hash";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { sha256Hex } from "./hash";
import type { StorageDriver, StoredFile } from "./types";

/**
 * Local filesystem driver for development. Writes protected manuscript files
 * under `.storage/books/` at the repo root — OUTSIDE `public/`, so files are
 * never served directly. The `.storage` folder is gitignored. Swap for
 * S3/R2/IPFS/Arweave by implementing the same StorageDriver.
 */
const ROOT = path.join(process.cwd(), ".storage");
const BOOKS_DIR = "books";

/** Keep only safe filename characters for the on-disk name. */
function safeName(fileName: string): string {
  return path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
}

export class LocalStorageDriver implements StorageDriver {
  async put(
    fileName: string,
    data: Buffer | Uint8Array,
    contentType?: string,
  ): Promise<StoredFile> {
    const buf = Buffer.from(data);
    const sha256 = sha256Hex(buf);
    // Content-addressed key under books/ so identical bytes dedupe by name.
    const key = `${BOOKS_DIR}/${sha256}-${safeName(fileName)}`;
    const full = path.join(ROOT, key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, buf);
    return { key, sha256, size: buf.byteLength, contentType };
  }

  async get(key: string): Promise<Buffer> {
    // Guard against path traversal in a driver key.
    const full = path.join(ROOT, key);
    if (!full.startsWith(ROOT)) throw new Error("Invalid storage key.");
    return readFile(full);
  }
}

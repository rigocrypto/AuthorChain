import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageDriver, StoredFile } from "./types";

/**
 * Local filesystem driver for development. Writes under `.storage/` at the repo
 * root. Swap for IPFS/Arweave/S3 by implementing the same StorageDriver.
 */
const ROOT = path.join(process.cwd(), ".storage");

export class LocalStorageDriver implements StorageDriver {
  async put(
    fileName: string,
    data: Buffer | Uint8Array,
    contentType?: string,
  ): Promise<StoredFile> {
    const buf = Buffer.from(data);
    const sha256 = createHash("sha256").update(buf).digest("hex");
    const key = `${sha256}-${path.basename(fileName)}`;
    await mkdir(ROOT, { recursive: true });
    await writeFile(path.join(ROOT, key), buf);
    return { key, sha256, size: buf.byteLength, contentType };
  }

  async get(key: string): Promise<Buffer> {
    return readFile(path.join(ROOT, key));
  }
}

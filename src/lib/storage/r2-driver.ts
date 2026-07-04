import { AwsClient } from "aws4fetch";
import { sha256Hex } from "./hash";
import type { StorageDriver, StoredFile } from "./types";

/**
 * Cloudflare R2 storage driver (S3-compatible), signed with aws4fetch. Enabled
 * with STORAGE_DRIVER=r2; the local driver stays the default for development.
 *
 * Files are stored OFF-CHAIN under server-owned keys. Object bytes are never
 * exposed directly — reads go through `get()` behind the app's controlled
 * routes, and the sha-256 used for on-chain proof is still computed server-side
 * from the actual bytes (in `hash.ts`), identical to the local driver.
 */

type R2Config = {
  endpoint: string; // no trailing slash
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
};

/** Only allow known logical folders / safe key segments. */
function safeName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function safePrefix(prefix: string): string {
  return /^[a-z0-9-]+$/.test(prefix) ? prefix : "books";
}

/** Percent-encode each path segment but keep the "/" separators. */
function encodeKey(key: string): string {
  return key.split("/").map(encodeURIComponent).join("/");
}

/**
 * Read + validate R2 config from env. Throws a clear error naming the missing
 * variables (never their values) so a misconfigured deploy fails loudly and
 * safely instead of silently falling back.
 */
function r2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID;
  const bucket = process.env.R2_BUCKET;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpointOverride = process.env.R2_ENDPOINT;

  const missing: string[] = [];
  if (!bucket) missing.push("R2_BUCKET");
  if (!accessKeyId) missing.push("R2_ACCESS_KEY_ID");
  if (!secretAccessKey) missing.push("R2_SECRET_ACCESS_KEY");
  // Endpoint can come from R2_ENDPOINT or be derived from R2_ACCOUNT_ID.
  if (!endpointOverride && !accountId) missing.push("R2_ACCOUNT_ID (or R2_ENDPOINT)");
  if (missing.length) {
    throw new Error(
      `R2 storage is not configured. Missing env: ${missing.join(", ")}.`,
    );
  }

  const endpoint = (endpointOverride ?? `https://${accountId}.r2.cloudflarestorage.com`)
    .replace(/\/+$/, "");
  return {
    endpoint,
    bucket: bucket!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
  };
}

export class R2StorageDriver implements StorageDriver {
  private cfg: R2Config;
  private client: AwsClient;

  constructor() {
    this.cfg = r2Config();
    this.client = new AwsClient({
      accessKeyId: this.cfg.accessKeyId,
      secretAccessKey: this.cfg.secretAccessKey,
      service: "s3",
      region: "auto", // R2 uses the "auto" region.
    });
  }

  private objectUrl(key: string): string {
    return `${this.cfg.endpoint}/${this.cfg.bucket}/${encodeKey(key)}`;
  }

  /** Server-side write (used for barcodes and any non-presigned upload). */
  async put(
    fileName: string,
    data: Buffer | Uint8Array,
    contentType?: string,
    prefix = "books",
  ): Promise<StoredFile> {
    const buf = Buffer.from(data);
    const sha256 = sha256Hex(buf);
    const key = `${safePrefix(prefix)}/${sha256}-${safeName(fileName)}`;
    const res = await this.client.fetch(this.objectUrl(key), {
      method: "PUT",
      body: new Uint8Array(buf),
      headers: contentType ? { "content-type": contentType } : undefined,
    });
    if (!res.ok) {
      throw new Error(`R2 put failed (${res.status}).`);
    }
    return { key, sha256, size: buf.byteLength, contentType };
  }

  async get(key: string): Promise<Buffer> {
    const res = await this.client.fetch(this.objectUrl(key), { method: "GET" });
    if (!res.ok) {
      throw new Error(`R2 get failed (${res.status}).`);
    }
    return Buffer.from(await res.arrayBuffer());
  }

  async delete(key: string): Promise<void> {
    const res = await this.client.fetch(this.objectUrl(key), { method: "DELETE" });
    // R2 returns 204 on delete; treat a missing object as already-deleted.
    if (!res.ok && res.status !== 404) {
      throw new Error(`R2 delete failed (${res.status}).`);
    }
  }

  /**
   * Presign a direct client PUT to `key`. Only the method, key, and expiry are
   * signed (UNSIGNED-PAYLOAD), so the browser uploads with the URL alone and
   * need not reproduce a signed content-type header. `contentType` is accepted
   * for interface symmetry but intentionally not bound into the signature —
   * the finalize step re-validates type and size from the stored bytes.
   */
  async presignPut(
    key: string,
    _contentType: string,
    expiresSeconds = 900,
  ): Promise<{ uploadUrl: string; key: string }> {
    const url = new URL(this.objectUrl(key));
    url.searchParams.set("X-Amz-Expires", String(expiresSeconds));
    const signed = await this.client.sign(url.toString(), {
      method: "PUT",
      aws: { signQuery: true },
    });
    return { uploadUrl: signed.url, key };
  }
}

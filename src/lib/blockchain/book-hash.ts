import { createHash } from "node:crypto";

/**
 * Deterministic book hashing for on-chain proof of authorship (server-only).
 *
 * ⚠️ MVP PROOF HASH — this is intentionally simple. It produces a stable 32-byte
 * identifier per book so we can register *something* meaningful on-chain today.
 * When real manuscript upload lands, replace `bookRegistrationHash` with the
 * SHA-256 of the actual uploaded file (or an IPFS CID). The on-chain contract
 * and DB don't care how the hash was derived, so this swap is isolated here.
 */

export type HashableBook = {
  id: string;
  authorId: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: string;
  price: number | string;
  currency: string;
  createdAt: string | Date;
  /** Real content hash once a manuscript is uploaded; preferred when present. */
  fileHash?: string | null;
};

function sha256Hex(input: string): string {
  return createHash("sha256").update(input, "utf8").digest("hex");
}

function toIso(d: string | Date): string {
  return d instanceof Date ? d.toISOString() : new Date(d).toISOString();
}

/**
 * A `bytes32` (0x + 64 hex) hash suitable for the registry's `bookHash` param.
 * Prefers a real uploaded-file hash; otherwise derives one from immutable
 * identity fields (id, author, title, createdAt).
 */
export function bookRegistrationHash(book: HashableBook): `0x${string}` {
  const fromFile = book.fileHash?.replace(/^0x/, "");
  const hex =
    fromFile && /^[0-9a-fA-F]{64}$/.test(fromFile)
      ? fromFile.toLowerCase()
      : sha256Hex(
          [book.id, book.authorId, book.title, toIso(book.createdAt)].join("|"),
        );
  return `0x${hex}`;
}

/**
 * A metadata hash string for the registry's `metadataHash` param. Covers the
 * public, mutable-ish marketing fields. Replace with an IPFS metadata CID later.
 */
export function bookMetadataHash(book: HashableBook): string {
  const meta = JSON.stringify({
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    category: book.category,
    price: String(book.price),
    currency: book.currency,
  });
  return `sha256:${sha256Hex(meta)}`;
}

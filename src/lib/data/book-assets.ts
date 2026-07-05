import type { AssetType, BookAsset, StorageProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStorage, sha256Hex, deleteStoredObject } from "@/lib/storage";

/**
 * Public-facing book assets (cover images, ISBN barcodes). Unlike the manuscript
 * these are meant to be shown — but are still stored under `.storage/` and served
 * only through the controlled asset route, never from `public/` and never by
 * exposing the storage key.
 */

const COVER_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Max cover size (well under the 25MB server-action limit). */
export const MAX_COVER_BYTES = 8 * 1024 * 1024;

export type BookAssetDTO = {
  assetType: AssetType;
  fileName: string;
  mimeType: string;
  fileSize: number;
  hash: string | null;
  storageProvider: string;
  createdAt: string;
};

function toDTO(a: BookAsset): BookAssetDTO {
  return {
    assetType: a.assetType,
    fileName: a.fileName,
    mimeType: a.mimeType,
    fileSize: a.fileSize,
    hash: a.hash,
    storageProvider: a.storageProvider,
    createdAt: a.createdAt.toISOString(),
  };
}

export function resolveCoverType(fileName: string): string | null {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return COVER_TYPES[ext] ?? null;
}

function currentProvider(): StorageProvider {
  switch (process.env.STORAGE_DRIVER) {
    case "s3":
      return "S3";
    case "r2":
      return "R2";
    case "ipfs":
      return "IPFS";
    case "arweave":
      return "ARWEAVE";
    default:
      return "LOCAL";
  }
}

/**
 * Record a freshly-stored asset as the primary of its type. Shared by the local
 * (server-proxied) and R2 (presigned direct-upload) paths so the stored shape is
 * identical regardless of how the bytes arrived.
 */
async function recordPrimaryAsset(input: {
  bookId: string;
  assetType: AssetType;
  fileName: string;
  mimeType: string;
  storageKey: string;
  sha256: string;
  size: number;
}): Promise<void> {
  await prisma.$transaction([
    prisma.bookAsset.deleteMany({
      where: { bookId: input.bookId, assetType: input.assetType, isPrimary: true },
    }),
    prisma.bookAsset.create({
      data: {
        bookId: input.bookId,
        assetType: input.assetType,
        storageProvider: currentProvider(),
        storageKey: input.storageKey,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: input.size,
        hash: input.sha256,
        isPrimary: true,
      },
    }),
  ]);
}

/** Replace the primary asset of a type with freshly-stored bytes (local path). */
async function upsertPrimaryAsset(input: {
  bookId: string;
  assetType: AssetType;
  fileName: string;
  mimeType: string;
  prefix: string;
  bytes: Buffer;
}): Promise<{ sha256: string; fileSize: number }> {
  const stored = await getStorage().put(
    input.fileName,
    input.bytes,
    input.mimeType,
    input.prefix,
  );
  await recordPrimaryAsset({
    bookId: input.bookId,
    assetType: input.assetType,
    fileName: input.fileName,
    mimeType: input.mimeType,
    storageKey: stored.key,
    sha256: stored.sha256,
    size: stored.size,
  });
  return { sha256: stored.sha256, fileSize: stored.size };
}

export type SaveCoverResult =
  | { ok: true; sha256: string; fileName: string; fileSize: number }
  | { ok: false; error: string };

export async function saveCover(
  bookId: string,
  file: File,
): Promise<SaveCoverResult> {
  const mime = resolveCoverType(file.name);
  if (!mime) {
    return { ok: false, error: "Unsupported image type. Use JPG, PNG, or WEBP." };
  }
  if (file.size === 0) return { ok: false, error: "The image is empty." };
  if (file.size > MAX_COVER_BYTES) {
    return { ok: false, error: "Cover image is too large (max 8MB)." };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const { sha256, fileSize } = await upsertPrimaryAsset({
    bookId,
    assetType: "COVER",
    fileName: file.name,
    mimeType: mime,
    prefix: "covers",
    bytes,
  });
  return { ok: true, sha256, fileName: file.name, fileSize };
}

/**
 * Finalize a presigned direct-to-storage cover upload: fetch the uploaded bytes
 * back by key, validate the image type + size server-side, hash, then record.
 * On any rejection the stray object is cleaned up. Callers must enforce
 * author/book authorization first, and must have issued `key` via `buildUploadKey`.
 */
export async function finalizeCoverUpload(
  bookId: string,
  storageKey: string,
  fileName: string,
): Promise<SaveCoverResult> {
  const mime = resolveCoverType(fileName);
  if (!mime) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "Unsupported image type. Use JPG, PNG, or WEBP." };
  }

  let bytes: Buffer;
  try {
    bytes = await getStorage().get(storageKey);
  } catch {
    return { ok: false, error: "Uploaded image was not found in storage." };
  }

  if (bytes.byteLength === 0) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "The image is empty." };
  }
  if (bytes.byteLength > MAX_COVER_BYTES) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "Cover image is too large (max 8MB)." };
  }

  const sha256 = sha256Hex(bytes);
  await recordPrimaryAsset({
    bookId,
    assetType: "COVER",
    fileName,
    mimeType: mime,
    storageKey,
    sha256,
    size: bytes.byteLength,
  });
  return { ok: true, sha256, fileName, fileSize: bytes.byteLength };
}

/** Public reader-preview PDF (first pages only). Max size well under the cover limit isn't needed; allow up to 15MB. */
export const MAX_PREVIEW_BYTES = 15 * 1024 * 1024;

export function resolvePreviewType(fileName: string): string | null {
  return fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : null;
}

export type SavePreviewResult =
  | { ok: true; sha256: string; fileName: string; fileSize: number }
  | { ok: false; error: string };

/** Store a public reader-preview PDF (server-proxied / local path). */
export async function savePreview(
  bookId: string,
  file: File,
): Promise<SavePreviewResult> {
  const mime = resolvePreviewType(file.name);
  if (!mime) return { ok: false, error: "Upload a PDF preview file." };
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_PREVIEW_BYTES) {
    return { ok: false, error: "Preview is too large (max 15MB)." };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const { sha256, fileSize } = await upsertPrimaryAsset({
    bookId,
    assetType: "PREVIEW",
    fileName: file.name,
    mimeType: mime,
    prefix: "previews",
    bytes,
  });
  return { ok: true, sha256, fileName: file.name, fileSize };
}

/** Finalize a presigned direct-to-storage reader-preview upload. */
export async function finalizePreviewUpload(
  bookId: string,
  storageKey: string,
  fileName: string,
): Promise<SavePreviewResult> {
  const mime = resolvePreviewType(fileName);
  if (!mime) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "Upload a PDF preview file." };
  }
  let bytes: Buffer;
  try {
    bytes = await getStorage().get(storageKey);
  } catch {
    return { ok: false, error: "Uploaded file was not found in storage." };
  }
  if (bytes.byteLength === 0) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "The file is empty." };
  }
  if (bytes.byteLength > MAX_PREVIEW_BYTES) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "Preview is too large (max 15MB)." };
  }
  const sha256 = sha256Hex(bytes);
  await recordPrimaryAsset({
    bookId,
    assetType: "PREVIEW",
    fileName,
    mimeType: mime,
    storageKey,
    sha256,
    size: bytes.byteLength,
  });
  return { ok: true, sha256, fileName, fileSize: bytes.byteLength };
}

export async function saveBarcode(
  bookId: string,
  isbn13: string,
  svg: string,
): Promise<void> {
  await upsertPrimaryAsset({
    bookId,
    assetType: "BARCODE",
    fileName: `isbn-${isbn13}.svg`,
    mimeType: "image/svg+xml",
    prefix: "barcodes",
    bytes: Buffer.from(svg, "utf8"),
  });
}

/** Public-safe DTO of a book's primary asset of a type. */
export async function getPrimaryAsset(
  bookId: string,
  assetType: AssetType,
): Promise<BookAssetDTO | null> {
  const a = await prisma.bookAsset.findFirst({
    where: { bookId, assetType, isPrimary: true },
    orderBy: { createdAt: "desc" },
  });
  return a ? toDTO(a) : null;
}

/** Server-only: the storage locator + mime for streaming through the route. */
export async function getAssetForServing(
  bookId: string,
  assetType: AssetType,
): Promise<{ storageKey: string; mimeType: string } | null> {
  const a = await prisma.bookAsset.findFirst({
    where: { bookId, assetType, isPrimary: true },
    orderBy: { createdAt: "desc" },
    select: { storageKey: true, mimeType: true },
  });
  return a ?? null;
}

import type { AssetType, BookAsset, StorageProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";

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

/** Replace the primary asset of a type with freshly-stored bytes. */
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
  await prisma.$transaction([
    prisma.bookAsset.deleteMany({
      where: { bookId: input.bookId, assetType: input.assetType, isPrimary: true },
    }),
    prisma.bookAsset.create({
      data: {
        bookId: input.bookId,
        assetType: input.assetType,
        storageProvider: currentProvider(),
        storageKey: stored.key,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: stored.size,
        hash: stored.sha256,
        isPrimary: true,
      },
    }),
  ]);
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

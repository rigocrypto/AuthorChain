import type { BookFile, StorageProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStorage, sha256Hex, deleteStoredObject } from "@/lib/storage";

/**
 * Manuscript file handling — the single server-side seam where an uploaded book
 * file is validated, stored (via the storage driver), hashed (sha-256), and
 * recorded. The sha-256 becomes the book's real proof-of-authorship hash.
 */

/** MVP-supported manuscript types (extension → mime label). */
const MANUSCRIPT_TYPES: Record<string, { mime: string; label: string }> = {
  pdf: { mime: "application/pdf", label: "PDF" },
  epub: { mime: "application/epub+zip", label: "EPUB" },
};

/** Max manuscript size — mirrors next.config serverActions.bodySizeLimit. */
export const MAX_MANUSCRIPT_BYTES = 25 * 1024 * 1024;

export type BookFileDTO = {
  fileName: string;
  fileType: string;
  fileLabel: string;
  fileSize: number;
  sha256: string | null;
  storageProvider: string;
  createdAt: string;
};

function labelForMime(mime: string): string {
  const hit = Object.values(MANUSCRIPT_TYPES).find((t) => t.mime === mime);
  return hit?.label ?? mime;
}

function toDTO(f: BookFile): BookFileDTO {
  return {
    fileName: f.fileName,
    fileType: f.fileType,
    fileLabel: labelForMime(f.fileType),
    fileSize: f.fileSize,
    sha256: f.hash,
    storageProvider: f.storageProvider,
    createdAt: f.createdAt.toISOString(),
  };
}

/** Validate the uploaded file by extension; returns the resolved mime or null. */
export function resolveManuscriptType(fileName: string): {
  mime: string;
  label: string;
} | null {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return MANUSCRIPT_TYPES[ext] ?? null;
}

/** Which storage backend is active (mirrors STORAGE_DRIVER). */
function currentProvider(): StorageProvider {
  switch (process.env.STORAGE_DRIVER) {
    case "r2":
      return "R2";
    case "s3":
      return "S3";
    case "ipfs":
      return "IPFS";
    case "arweave":
      return "ARWEAVE";
    default:
      return "LOCAL";
  }
}

export type StoreManuscriptResult =
  | { ok: true; sha256: string; fileName: string; fileLabel: string; fileSize: number }
  | { ok: false; error: string };

/**
 * Record freshly-stored manuscript bytes as the book's primary file and set
 * Book.fileHash to the real sha-256. MVP: one primary manuscript per book, so
 * any existing primary is replaced. Shared by the local (server-proxied) and R2
 * (presigned direct-upload) paths so the recorded shape + proof hash are identical.
 */
async function recordPrimaryManuscript(input: {
  bookId: string;
  fileName: string;
  fileType: string;
  storageKey: string;
  sha256: string;
  size: number;
}): Promise<void> {
  await prisma.$transaction([
    prisma.bookFile.deleteMany({ where: { bookId: input.bookId, isPrimary: true } }),
    prisma.bookFile.create({
      data: {
        bookId: input.bookId,
        fileName: input.fileName,
        fileType: input.fileType,
        fileSize: input.size,
        hash: input.sha256,
        storageKey: input.storageKey,
        storageProvider: currentProvider(),
        isPrimary: true,
      },
    }),
    prisma.book.update({
      where: { id: input.bookId },
      data: { fileHash: input.sha256 },
    }),
  ]);
}

/**
 * Store an uploaded manuscript as the book's primary file: validate → persist
 * bytes via the storage driver → record BookFile → set Book.fileHash to the
 * real sha-256. Callers must enforce authorization + registration guards first.
 * Used by the local (server-proxied) upload path.
 */
export async function storeManuscriptForBook(
  bookId: string,
  file: File,
): Promise<StoreManuscriptResult> {
  const type = resolveManuscriptType(file.name);
  if (!type) {
    return { ok: false, error: "Unsupported file type. Upload a PDF or EPUB." };
  }
  if (file.size === 0) return { ok: false, error: "The file is empty." };
  if (file.size > MAX_MANUSCRIPT_BYTES) {
    return { ok: false, error: "File is too large (max 25MB)." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const stored = await getStorage().put(file.name, bytes, type.mime);

  await recordPrimaryManuscript({
    bookId,
    fileName: file.name,
    fileType: type.mime,
    storageKey: stored.key,
    sha256: stored.sha256,
    size: stored.size,
  });

  return {
    ok: true,
    sha256: stored.sha256,
    fileName: file.name,
    fileLabel: type.label,
    fileSize: stored.size,
  };
}

/**
 * Finalize a presigned direct-to-storage manuscript upload: fetch the uploaded
 * bytes back by key, compute the AUTHORITATIVE sha-256 + size server-side (so the
 * proof hash never depends on the client), enforce the same limits as the proxied
 * path, then record. On any rejection the stray object is cleaned up. Callers
 * must enforce authorization + registration guards first, and must have issued
 * `key` themselves via `buildUploadKey`.
 */
export async function finalizeManuscriptForBook(
  bookId: string,
  storageKey: string,
  fileName: string,
): Promise<StoreManuscriptResult> {
  const type = resolveManuscriptType(fileName);
  if (!type) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "Unsupported file type. Upload a PDF or EPUB." };
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
  if (bytes.byteLength > MAX_MANUSCRIPT_BYTES) {
    await deleteStoredObject(storageKey);
    return { ok: false, error: "File is too large (max 25MB)." };
  }

  const sha256 = sha256Hex(bytes);
  await recordPrimaryManuscript({
    bookId,
    fileName,
    fileType: type.mime,
    storageKey,
    sha256,
    size: bytes.byteLength,
  });

  return {
    ok: true,
    sha256,
    fileName,
    fileLabel: type.label,
    fileSize: bytes.byteLength,
  };
}

/** The book's current primary manuscript, or null. */
export async function getPrimaryBookFile(
  bookId: string,
): Promise<BookFileDTO | null> {
  const f = await prisma.bookFile.findFirst({
    where: { bookId, isPrimary: true },
    orderBy: { createdAt: "desc" },
  });
  return f ? toDTO(f) : null;
}

/** Server-only: locator + filename for streaming a manuscript to an entitled reader. */
export async function getManuscriptForServing(
  bookId: string,
): Promise<{ storageKey: string; fileName: string; fileType: string } | null> {
  const f = await prisma.bookFile.findFirst({
    where: { bookId, isPrimary: true },
    orderBy: { createdAt: "desc" },
    select: { storageKey: true, fileName: true, fileType: true },
  });
  if (!f || !f.storageKey) return null;
  return { storageKey: f.storageKey, fileName: f.fileName, fileType: f.fileType };
}

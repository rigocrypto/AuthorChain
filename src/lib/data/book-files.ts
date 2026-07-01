import type { BookFile, StorageProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getStorage } from "@/lib/storage";

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
 * Store an uploaded manuscript as the book's primary file: validate → persist
 * bytes via the storage driver → record BookFile → set Book.fileHash to the
 * real sha-256. Callers must enforce authorization + registration guards first.
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

  // MVP: one primary manuscript per book. Replace any existing primary file.
  await prisma.$transaction([
    prisma.bookFile.deleteMany({ where: { bookId, isPrimary: true } }),
    prisma.bookFile.create({
      data: {
        bookId,
        fileName: file.name,
        fileType: type.mime,
        fileSize: stored.size,
        hash: stored.sha256,
        storageKey: stored.key,
        storageProvider: currentProvider(),
        isPrimary: true,
      },
    }),
    prisma.book.update({
      where: { id: bookId },
      data: { fileHash: stored.sha256 },
    }),
  ]);

  return {
    ok: true,
    sha256: stored.sha256,
    fileName: file.name,
    fileLabel: type.label,
    fileSize: stored.size,
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

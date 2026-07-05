"use server";

import { revalidatePath } from "next/cache";
import type { BookFormat } from "@prisma/client";
import { getCurrentAuthor } from "@/lib/auth/session";
import {
  getStorage,
  storageSupportsDirectUpload,
  buildUploadKey,
} from "@/lib/storage";
import {
  getAuthorBookById,
  updatePublishingMetadata,
  updateBookDetails,
} from "@/lib/data/books";
import {
  storeManuscriptForBook,
  finalizeManuscriptForBook,
  resolveManuscriptType,
} from "@/lib/data/book-files";
import {
  saveCover,
  finalizeCoverUpload,
  resolveCoverType,
  saveBarcode,
} from "@/lib/data/book-assets";
import { checkIsbn13, normalizeIsbn, isValidIsbn10 } from "@/lib/publishing/isbn";
import { generateIsbnBarcodeSvg } from "@/lib/publishing/barcode";
import { AUTHOR_ROYALTY_RATE } from "@/lib/data/sales";
import { bookRegistrationHash, bookMetadataHash } from "@/lib/blockchain/book-hash";
import {
  registerAuthorship,
  isRegistryConfigured,
  getChainConfig,
} from "@/lib/blockchain/registry";
import {
  createPendingRegistration,
  markRegistered,
  markFailed,
  getRegistrationForBook,
} from "@/lib/data/registrations";

/**
 * Register a book's proof of authorship on-chain. The UI guards the disabled
 * states (not configured / no wallet), so this action returns silently in those
 * cases. On-chain failures mark the registration FAILED rather than throwing,
 * so the dashboard reflects the real status on reload.
 */
const VALID_FORMATS: BookFormat[] = [
  "EBOOK",
  "PAPERBACK",
  "HARDCOVER",
  "AUDIOBOOK",
];

export type PublishingState = { error?: string; ok?: boolean };

/**
 * Upload/replace the cover image. Allowed even for REGISTERED books — the cover
 * is a publishing asset and does not affect the registered manuscript proof.
 */
export async function uploadCoverAction(
  _prev: PublishingState,
  formData: FormData,
): Promise<PublishingState> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return { error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file (JPG, PNG, or WEBP)." };
  }

  const res = await saveCover(bookId, file);
  if (!res.ok) return { error: res.error };

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

/**
 * Update a book's core details (title, subtitle, description, category, price).
 * Allowed for REGISTERED books — these are catalog fields, separate from the
 * on-chain manuscript proof. The slug is kept stable (see updateBookDetails).
 */
export async function updateBookDetailsAction(
  _prev: PublishingState,
  formData: FormData,
): Promise<PublishingState> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return { error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "General";
  const subtitle = String(formData.get("subtitle") ?? "").trim() || null;
  const price = Number(formData.get("price"));

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid price." };

  await updateBookDetails(bookId, author.id, {
    title,
    subtitle,
    description,
    category,
    price,
  });

  revalidatePath(`/dashboard/books/${bookId}`);
  revalidatePath("/dashboard/books");
  return { ok: true };
}

/**
 * Save ISBN + publishing metadata. Allowed for REGISTERED books — metadata is
 * separate from the on-chain manuscript proof.
 */
export async function savePublishingMetadataAction(
  _prev: PublishingState,
  formData: FormData,
): Promise<PublishingState> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return { error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };

  const isbn13raw = String(formData.get("isbn13") ?? "").trim();
  let isbn13: string | null = null;
  if (isbn13raw) {
    const chk = checkIsbn13(isbn13raw);
    if (!chk.ok) return { error: chk.error };
    isbn13 = chk.isbn13;
  }

  const isbn10raw = String(formData.get("isbn10") ?? "").trim();
  let isbn10: string | null = null;
  if (isbn10raw) {
    if (!isValidIsbn10(isbn10raw)) return { error: "Invalid ISBN-10." };
    isbn10 = normalizeIsbn(isbn10raw);
  }

  const publisherName = String(formData.get("publisherName") ?? "").trim() || null;
  const edition = String(formData.get("edition") ?? "").trim() || null;

  const pubDateRaw = String(formData.get("publicationDate") ?? "").trim();
  let publicationDate: Date | null = null;
  if (pubDateRaw) {
    const d = new Date(pubDateRaw);
    if (Number.isNaN(d.getTime())) return { error: "Invalid publication date." };
    publicationDate = d;
  }

  const formatRaw = String(formData.get("bookFormat") ?? "").trim();
  const bookFormat = VALID_FORMATS.includes(formatRaw as BookFormat)
    ? (formatRaw as BookFormat)
    : null;

  await updatePublishingMetadata(bookId, author.id, {
    isbn13,
    isbn10,
    publisherName,
    publicationDate,
    edition,
    bookFormat,
  });

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

/** Generate + store an ISBN barcode SVG from the book's saved, valid ISBN-13. */
export async function generateBarcodeAction(
  _prev: PublishingState,
  formData: FormData,
): Promise<PublishingState> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return { error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };
  if (!book.isbn13) return { error: "Add and save a valid ISBN-13 first." };

  const chk = checkIsbn13(book.isbn13);
  if (!chk.ok) return { error: "The saved ISBN-13 is invalid." };

  try {
    const svg = generateIsbnBarcodeSvg(chk.isbn13);
    await saveBarcode(bookId, chk.isbn13, svg);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Barcode generation failed." };
  }

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

export type UploadManuscriptState = { error?: string; ok?: boolean };

/**
 * Upload/replace a book's manuscript. Blocked once the book has an on-chain
 * proof — replacing the file would invalidate the registered hash. Versioned
 * re-registration is a future feature (see BookVersion in the roadmap).
 */
export async function uploadManuscriptAction(
  _prev: UploadManuscriptState,
  formData: FormData,
): Promise<UploadManuscriptState> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return { error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };

  const registration = await getRegistrationForBook(bookId);
  if (registration?.status === "REGISTERED") {
    return {
      error:
        "This book already has an on-chain proof. Replacing the manuscript would need a new versioned proof (future release).",
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF or EPUB file to upload." };
  }
  if (!resolveManuscriptType(file.name)) {
    return { error: "Unsupported file type. Upload a PDF or EPUB." };
  }

  const res = await storeManuscriptForBook(bookId, file);
  if (!res.ok) return { error: res.error };

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

/**
 * Presigned direct-to-storage upload (STORAGE_DRIVER=r2). Two steps: a `presign*`
 * action validates authorization and returns a short-lived PUT URL for a
 * server-owned key; the client uploads straight to R2; then a `finalize*` action
 * re-validates authorization and records the asset from the stored bytes, with
 * the sha-256 proof hash computed server-side. Keys are always issued here (never
 * accepted from the client for reads), and finalize rejects any key outside the
 * book's own namespace.
 */
export type PresignResult =
  | { ok: true; uploadUrl: string; key: string }
  | { ok: false; error: string };

export async function presignCoverUploadAction(
  bookId: string,
  fileName: string,
): Promise<PresignResult> {
  const author = await getCurrentAuthor();
  if (!bookId) return { ok: false, error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { ok: false, error: "Book not found." };

  const mime = resolveCoverType(fileName);
  if (!mime) return { ok: false, error: "Unsupported image type. Use JPG, PNG, or WEBP." };

  const store = getStorage();
  if (!storageSupportsDirectUpload() || !store.presignPut) {
    return { ok: false, error: "Direct upload is not available." };
  }
  const key = buildUploadKey("covers", bookId, fileName);
  const { uploadUrl } = await store.presignPut(key, mime);
  return { ok: true, uploadUrl, key };
}

export async function finalizeCoverUploadAction(
  bookId: string,
  key: string,
  fileName: string,
): Promise<PublishingState> {
  const author = await getCurrentAuthor();
  if (!bookId || !key) return { error: "Missing upload." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };
  if (!key.startsWith(`covers/${bookId}/`)) return { error: "Invalid upload key." };

  const res = await finalizeCoverUpload(bookId, key, fileName);
  if (!res.ok) return { error: res.error };

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

export async function presignManuscriptUploadAction(
  bookId: string,
  fileName: string,
): Promise<PresignResult> {
  const author = await getCurrentAuthor();
  if (!bookId) return { ok: false, error: "Missing book." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { ok: false, error: "Book not found." };

  const registration = await getRegistrationForBook(bookId);
  if (registration?.status === "REGISTERED") {
    return {
      ok: false,
      error:
        "This book already has an on-chain proof. Replacing the manuscript would need a new versioned proof (future release).",
    };
  }

  const type = resolveManuscriptType(fileName);
  if (!type) return { ok: false, error: "Unsupported file type. Upload a PDF or EPUB." };

  const store = getStorage();
  if (!storageSupportsDirectUpload() || !store.presignPut) {
    return { ok: false, error: "Direct upload is not available." };
  }
  const key = buildUploadKey("books", bookId, fileName);
  const { uploadUrl } = await store.presignPut(key, type.mime);
  return { ok: true, uploadUrl, key };
}

export async function finalizeManuscriptUploadAction(
  bookId: string,
  key: string,
  fileName: string,
): Promise<UploadManuscriptState> {
  const author = await getCurrentAuthor();
  if (!bookId || !key) return { error: "Missing upload." };

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return { error: "Book not found." };
  if (!key.startsWith(`books/${bookId}/`)) return { error: "Invalid upload key." };

  // Re-check the registration guard at finalize — state may have changed since presign.
  const registration = await getRegistrationForBook(bookId);
  if (registration?.status === "REGISTERED") {
    return {
      error:
        "This book already has an on-chain proof. Replacing the manuscript would need a new versioned proof (future release).",
    };
  }

  const res = await finalizeManuscriptForBook(bookId, key, fileName);
  if (!res.ok) return { error: res.error };

  revalidatePath(`/dashboard/books/${bookId}`);
  return { ok: true };
}

export async function registerProofAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  const book = await getAuthorBookById(bookId, author.id);
  if (!book) return;

  // Defense in depth — the page disables the button in these cases.
  if (!isRegistryConfigured() || !author.walletAddress) return;

  // Don't re-register an already-registered book.
  const existing = await getRegistrationForBook(bookId);
  if (existing?.status === "REGISTERED") return;

  const bookHash = bookRegistrationHash(book);
  const metadataHash = bookMetadataHash(book);
  const chain = getChainConfig().network;

  const pendingId = await createPendingRegistration({
    bookId,
    authorId: author.id,
    chain,
    bookHash,
  });

  try {
    const res = await registerAuthorship({
      bookHash,
      author: author.walletAddress as `0x${string}`,
      metadataHash,
      royaltyBps: Math.round(AUTHOR_ROYALTY_RATE * 10000), // author's share, 9000 = 90%
    });
    await markRegistered({
      id: pendingId,
      contractAddress: res.contractAddress,
      transactionHash: res.txHash,
    });
  } catch {
    await markFailed(pendingId);
  }

  revalidatePath(`/dashboard/books/${bookId}`);
}

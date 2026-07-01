"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuthor } from "@/lib/auth/session";
import { getAuthorBookById } from "@/lib/data/books";
import { storeManuscriptForBook, resolveManuscriptType } from "@/lib/data/book-files";
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

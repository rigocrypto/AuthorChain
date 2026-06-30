"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuthor } from "@/lib/auth/session";
import { getAuthorBookById } from "@/lib/data/books";
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

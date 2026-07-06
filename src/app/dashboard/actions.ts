"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAuthor } from "@/lib/auth/session";
import {
  createBook,
  publishBook,
  unpublishBook,
  archiveBook,
  restoreBook,
} from "@/lib/data/books";

export type CreateBookState = { error?: string };

/**
 * Create a draft book from metadata only, then send the author to the book's
 * manage page to upload the manuscript. The manuscript is intentionally NOT
 * accepted here: posting a large file through a Server Action exceeds the
 * platform request-body limit on hosted deploys and fails the whole request.
 * The manage page uploads it via the presigned direct-to-storage flow instead.
 */
export async function createBookAction(
  _prev: CreateBookState,
  formData: FormData,
): Promise<CreateBookState> {
  const author = await getCurrentAuthor();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim() || "General";
  const language = String(formData.get("language") ?? "").trim() || "English";
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!title) return { error: "Title is required." };
  if (!description) return { error: "Description is required." };
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Enter a valid price." };
  }

  let book;
  try {
    book = await createBook({
      authorId: author.id,
      title,
      subtitle: subtitle || undefined,
      description,
      category,
      language,
      price,
    });
  } catch {
    return { error: "Could not save your book. Please try again." };
  }

  revalidatePath("/dashboard/books");
  // Land on the manage page so the author uploads the manuscript there via the
  // presigned direct-to-storage flow. redirect() must stay outside the try above
  // (it signals via a thrown control-flow error).
  redirect(`/dashboard/books/${book.id}`);
}

export async function publishBookAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await publishBook(bookId, author.id);
  revalidateVisibility(bookId);
}

/** Revalidate the surfaces a visibility change can affect (author + public). */
function revalidateVisibility(bookId: string): void {
  revalidatePath("/dashboard/books");
  revalidatePath(`/dashboard/books/${bookId}`);
  revalidatePath("/");
  revalidatePath("/explore");
}

export async function unpublishBookAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await unpublishBook(bookId, author.id);
  revalidateVisibility(bookId);
}

export async function archiveBookAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await archiveBook(bookId, author.id);
  revalidateVisibility(bookId);
}

export async function restoreBookAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await restoreBook(bookId, author.id);
  revalidateVisibility(bookId);
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAuthor } from "@/lib/auth/session";
import { createBook, publishBook } from "@/lib/data/books";
import { storeManuscriptForBook, resolveManuscriptType } from "@/lib/data/book-files";

export type CreateBookState = { error?: string };

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

  // Optional manuscript upload — validate the type before creating the book so
  // we don't leave an orphaned draft for an obviously-wrong file.
  const file = formData.get("file");
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile && !resolveManuscriptType(file.name)) {
    return { error: "Unsupported file type. Upload a PDF or EPUB." };
  }

  const book = await createBook({
    authorId: author.id,
    title,
    subtitle: subtitle || undefined,
    description,
    category,
    language,
    price,
  });

  if (hasFile) {
    const res = await storeManuscriptForBook(book.id, file);
    if (!res.ok) return { error: res.error };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}

export async function publishBookAction(formData: FormData): Promise<void> {
  const author = await getCurrentAuthor();
  const bookId = String(formData.get("bookId") ?? "");
  if (!bookId) return;

  await publishBook(bookId, author.id);
  revalidatePath("/dashboard/books");
  revalidatePath("/");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentAuthor } from "@/lib/auth/session";
import { createBook, publishBook } from "@/lib/data/books";

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

  // TODO Phase 7: handle the manuscript file via the storage driver + BookFile.
  await createBook({
    authorId: author.id,
    title,
    subtitle: subtitle || undefined,
    description,
    category,
    language,
    price,
  });

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

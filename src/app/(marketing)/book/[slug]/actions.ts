"use server";

import { redirect } from "next/navigation";
import { getPublicBookBySlug } from "@/lib/data/books";
import { createCheckoutSession, isStripeConfigured } from "@/lib/payments/stripe";

/**
 * Start a Stripe Checkout session for a book and redirect the buyer to Stripe's
 * hosted page. The price comes from the database (server-side) — the form only
 * submits the slug, never an amount.
 */
export async function startCheckoutAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");

  // getPublicBookBySlug already filters to PUBLISHED books only.
  const book = await getPublicBookBySlug(slug);
  if (!book) {
    redirect(`/book/${slug}?error=unavailable`);
  }

  if (!isStripeConfigured()) {
    redirect(`/book/${slug}?error=payments_unavailable`);
  }

  const { url } = await createCheckoutSession({
    bookId: book.id,
    authorId: book.authorId,
    bookSlug: book.slug,
    title: book.title,
    description: book.description,
    amount: book.price,
    currency: book.currency,
    coverUrl: book.coverUrl,
  });

  redirect(url);
}

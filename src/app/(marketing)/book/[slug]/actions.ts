"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { getPublicBookBySlug } from "@/lib/data/books";
import { upsertReaderBookReview } from "@/lib/data/book-reviews";
import { getCurrentReader } from "@/lib/auth/reader-session";
import { getLocale } from "@/i18n/get-dictionary";
import { resolveLocalizedBookMetadata } from "@/lib/data/book-translations";
import {
  resolveReferralForCheckout,
  incrementReferralCheckout,
} from "@/lib/data/referrals";
import { createCheckoutSession, isStripeConfigured } from "@/lib/payments/stripe";

/**
 * Start a Stripe Checkout session for a book and redirect the buyer to Stripe's
 * hosted page. The price comes from the database (server-side) — the form only
 * submits the slug, never an amount.
 */
export async function startCheckoutAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");

  const locale = await getLocale();
  // getPublicBookBySlug already filters to PUBLISHED books only.
  const book = await getPublicBookBySlug(slug, locale);
  if (!book) {
    redirect(`/book/${slug}?error=unavailable`);
  }

  if (!isStripeConfigured()) {
    redirect(`/book/${slug}?error=payments_unavailable`);
  }

  // Referral attribution (analytics only; never blocks checkout). Prefer an
  // explicit ?ref from the form, falling back to the /r/[code] cookie.
  let referral: { linkId: string; code: string } | null = null;
  try {
    const refFromForm = String(formData.get("ref") ?? "").trim();
    const refFromCookie = (await cookies()).get("authorchain_ref")?.value ?? "";
    const refCode = refFromForm || refFromCookie;
    if (refCode) {
      referral = await resolveReferralForCheckout(refCode, book.id);
      if (referral) await incrementReferralCheckout(referral.linkId);
    }
  } catch {
    referral = null;
  }

  // Stripe fetches the product image from a public URL — only send the cover's
  // controlled route when the app URL is publicly reachable (not localhost).
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const isLocal = /localhost|127\.0\.0\.1/.test(appUrl);
  const coverUrl =
    book.hasCover && !isLocal
      ? `${appUrl}/api/assets/books/${book.id}/cover`
      : null;

  const localized = resolveLocalizedBookMetadata(
    { title: book.title, subtitle: book.subtitle, description: book.description },
    book.translation,
  );

  const { url } = await createCheckoutSession({
    bookId: book.id,
    authorId: book.authorId,
    bookSlug: book.slug,
    title: localized.title,
    description: localized.description ?? localized.title,
    amount: book.price,
    currency: book.currency,
    coverUrl,
    referralCode: referral?.code ?? null,
    referralLinkId: referral?.linkId ?? null,
  });

  redirect(url);
}

/**
 * Submit (or update) a reader review for a purchased book.
 * Only authenticated reader accounts with active entitlement can review.
 */
export async function submitBookReviewAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  const locale = await getLocale();
  const book = await getPublicBookBySlug(slug, locale);
  if (!book) {
    redirect(`/book/${slug}?review=unavailable`);
  }

  const reader = await getCurrentReader();
  if (!reader) {
    redirect(`/book/${slug}?review=signin`);
  }

  const entitlement = await prisma.readerLibrary.findFirst({
    where: {
      readerId: reader.id,
      bookId: book.id,
      accessStatus: "ACTIVE",
    },
    select: { id: true },
  });
  if (!entitlement) {
    redirect(`/book/${slug}?review=owned`);
  }

  const ratingRaw = String(formData.get("rating") ?? "");
  const rating = Number.parseInt(ratingRaw, 10);
  const thoughts = String(formData.get("thoughts") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    redirect(`/book/${slug}?review=invalid_rating#reader-reviews`);
  }
  if (thoughts.length < 20 || thoughts.length > 1200) {
    redirect(`/book/${slug}?review=invalid_text#reader-reviews`);
  }

  try {
    await upsertReaderBookReview({
      bookId: book.id,
      readerId: reader.id,
      rating,
      thoughts,
    });
  } catch {
    redirect(`/book/${slug}?review=error#reader-reviews`);
  }

  revalidatePath(`/book/${slug}`);
  redirect(`/book/${slug}?review=success#reader-reviews`);
}

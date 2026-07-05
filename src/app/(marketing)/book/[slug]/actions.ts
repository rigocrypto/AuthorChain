"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getPublicBookBySlug } from "@/lib/data/books";
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

  // getPublicBookBySlug already filters to PUBLISHED books only.
  const book = await getPublicBookBySlug(slug);
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

  const { url } = await createCheckoutSession({
    bookId: book.id,
    authorId: book.authorId,
    bookSlug: book.slug,
    title: book.title,
    description: book.description,
    amount: book.price,
    currency: book.currency,
    coverUrl,
    referralCode: referral?.code ?? null,
    referralLinkId: referral?.linkId ?? null,
  });

  redirect(url);
}

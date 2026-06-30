import Stripe from "stripe";

/**
 * Stripe boundary (Phase 6). Centralizes SDK + key access so API routes and
 * server actions just call into here. Card payments only for now — USDC and
 * on-chain licensing land in later phases.
 *
 * Everything degrades gracefully: when STRIPE_SECRET_KEY is unset the client is
 * null and callers can fall back to a "payments unavailable" state instead of
 * crashing the build or a request.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Lazily-built singleton so a missing key never throws at import time. */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured (STRIPE_SECRET_KEY missing).");
  }
  if (!_stripe) {
    // Omit apiVersion so the SDK uses the version pinned to this account,
    // avoiding drift between a hardcoded string and the installed SDK.
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }
  return _stripe;
}

/** Base URL for building absolute success/cancel redirect targets. */
function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export type CheckoutInput = {
  bookId: string;
  authorId: string;
  bookSlug: string;
  title: string;
  description: string;
  /** Server-trusted price in the book's currency (e.g. dollars). */
  amount: number;
  currency: string;
  coverUrl?: string | null;
};

/**
 * Create a Stripe Checkout session for a single book purchase. The amount is
 * always the server-side price — never anything supplied by the client. Returns
 * the hosted checkout URL the buyer should be redirected to.
 */
export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  const base = appUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: input.currency.toLowerCase(),
          // Stripe expects the smallest currency unit (cents).
          unit_amount: Math.round(input.amount * 100),
          product_data: {
            name: input.title,
            description: input.description.slice(0, 500),
            ...(input.coverUrl ? { images: [input.coverUrl] } : {}),
          },
        },
      },
    ],
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/checkout/cancel?book=${input.bookSlug}`,
    metadata: {
      bookId: input.bookId,
      authorId: input.authorId,
      bookSlug: input.bookSlug,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }
  return { url: session.url, sessionId: session.id };
}

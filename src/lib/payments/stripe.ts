/**
 * Stripe boundary (Phase 6). Keeps the SDK + key access in one place so API
 * routes just call createCheckoutSession(). Returns a mock URL until configured.
 */
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export type CheckoutInput = {
  bookId: string;
  title: string;
  amountUsd: number;
  successUrl: string;
  cancelUrl: string;
};

export async function createCheckoutSession(
  input: CheckoutInput,
): Promise<{ url: string; mocked: boolean }> {
  if (!isStripeConfigured()) {
    return { url: `/book/${input.bookId}?mock_checkout=1`, mocked: true };
  }
  // TODO Phase 6: stripe.checkout.sessions.create({ ... }) and return session.url.
  throw new Error("Stripe checkout not implemented yet (Phase 6).");
}

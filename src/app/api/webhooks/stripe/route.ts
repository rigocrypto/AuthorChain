import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/payments/stripe";
import { recordStripeSale } from "@/lib/data/sales";

/**
 * Stripe webhook endpoint. Stripe POSTs events here; we verify the signature
 * against the raw request body, then fulfill the order on
 * `checkout.session.completed`.
 *
 * Route Handlers receive the untouched request, so `request.text()` gives the
 * exact raw payload Stripe signed — required for signature verification.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    // Never crash the route when keys are absent (e.g. CI, fresh clone).
    return new Response("Stripe is not configured.", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header.", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return new Response(`Webhook signature verification failed: ${message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookId = session.metadata?.bookId;

    if (!bookId) {
      // Not one of our checkout sessions — acknowledge so Stripe stops retrying.
      return new Response("Ignored: no bookId metadata.", { status: 200 });
    }

    try {
      await recordStripeSale({
        bookId,
        // amount_total is in the smallest currency unit (cents).
        amount: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? "usd").toUpperCase(),
        buyerEmail:
          session.customer_details?.email ?? session.customer_email ?? null,
        stripeSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : (session.payment_intent?.id ?? null),
      });
    } catch (err) {
      // Returning 500 tells Stripe to retry later — our fulfillment is
      // idempotent, so a retry is safe.
      const message = err instanceof Error ? err.message : "fulfillment failed";
      return new Response(`Fulfillment error: ${message}`, { status: 500 });
    }
  }

  // Acknowledge all other event types.
  return new Response("ok", { status: 200 });
}

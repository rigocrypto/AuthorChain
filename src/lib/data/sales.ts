import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

/**
 * Sale + royalty fulfillment. This is the seam the Stripe webhook calls into
 * after a verified `checkout.session.completed`. Pricing is never taken from the
 * client — the webhook passes the amount Stripe actually charged.
 *
 * The author keeps 90%; AuthorChain retains 10%. Matches the seed convention.
 */
export const AUTHOR_ROYALTY_RATE = 0.9;

export type RecordStripeSaleInput = {
  bookId: string;
  amount: number;
  currency: string;
  buyerEmail: string | null;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
};

/**
 * Idempotently record a paid Stripe sale and the author's royalty.
 *
 * Idempotency: the Sale is keyed on the unique `stripeSessionId`. If the webhook
 * is retried (Stripe delivers at-least-once), we detect the existing sale and do
 * not create a duplicate Sale or Royalty. A concurrent double-delivery is also
 * caught via the unique-constraint violation (P2002).
 *
 * Returns whether a new sale was created (false = already fulfilled).
 */
export async function recordStripeSale(
  input: RecordStripeSaleInput,
): Promise<{ created: boolean }> {
  // Source of truth for the author is the book itself, not client metadata.
  const book = await prisma.book.findUnique({
    where: { id: input.bookId },
    select: { authorId: true },
  });
  if (!book) {
    throw new Error(`Book ${input.bookId} not found for Stripe sale.`);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.sale.findUnique({
        where: { stripeSessionId: input.stripeSessionId },
        select: { id: true, paymentStatus: true },
      });

      if (existing) {
        // Retry of an already-fulfilled session — backfill the payment intent
        // and ensure PAID, but never create a second royalty.
        if (
          existing.paymentStatus !== "PAID" ||
          input.stripePaymentIntentId
        ) {
          await tx.sale.update({
            where: { id: existing.id },
            data: {
              paymentStatus: "PAID",
              stripePaymentIntentId: input.stripePaymentIntentId,
            },
          });
        }
        return { created: false };
      }

      const sale = await tx.sale.create({
        data: {
          bookId: input.bookId,
          authorId: book.authorId,
          buyerEmail: input.buyerEmail,
          amount: new Prisma.Decimal(input.amount),
          currency: input.currency,
          paymentProvider: "STRIPE",
          paymentStatus: "PAID",
          stripeSessionId: input.stripeSessionId,
          stripePaymentIntentId: input.stripePaymentIntentId,
        },
      });

      await tx.royalty.create({
        data: {
          saleId: sale.id,
          authorId: book.authorId,
          amount: new Prisma.Decimal(input.amount * AUTHOR_ROYALTY_RATE),
          currency: input.currency,
          status: "PENDING",
        },
      });

      // Grant reader access when we know who bought it. Requires a buyer email —
      // access is keyed to reader identity. Upsert by (reader, book) so a
      // re-purchase re-grants access instead of colliding on the unique index.
      if (input.buyerEmail) {
        const reader = await tx.reader.upsert({
          where: { email: input.buyerEmail },
          update: {},
          create: { email: input.buyerEmail },
        });
        await tx.readerLibrary.upsert({
          where: {
            readerId_bookId: { readerId: reader.id, bookId: input.bookId },
          },
          update: { saleId: sale.id, accessStatus: "ACTIVE" },
          create: {
            readerId: reader.id,
            bookId: input.bookId,
            saleId: sale.id,
          },
        });
      }

      return { created: true };
    });
  } catch (err) {
    // Concurrent delivery raced us to the unique stripeSessionId — already done.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return { created: false };
    }
    throw err;
  }
}

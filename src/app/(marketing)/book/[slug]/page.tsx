import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPublicBookBySlug } from "@/lib/data/books";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { startCheckoutAction } from "./actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getPublicBookBySlug(slug);
  return { title: book ? book.title : "Book not found" };
}

export default async function PublicBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getPublicBookBySlug(slug);
  if (!book) notFound();

  const stripeReady = isStripeConfigured();

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Cover */}
        <div
          className={`flex aspect-[2/3] w-full items-end rounded-xl bg-gradient-to-br ${book.coverColor} p-5`}
        >
          <span className="text-2xl font-bold text-white drop-shadow">{book.title}</span>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-accent">{book.category}</p>
            <StatusBadge tone="muted">{book.language}</StatusBadge>
          </div>
          <h1 className="mt-2 text-3xl font-bold">{book.title}</h1>
          {book.subtitle ? (
            <p className="mt-1 text-lg text-muted">{book.subtitle}</p>
          ) : null}
          <p className="mt-1 text-sm text-muted">by {book.authorName}</p>

          <p className="mt-6 max-w-prose text-muted">{book.description}</p>

          <p className="mt-4 text-xs text-muted">
            🔒 Protected reader access coming in Phase 2.
          </p>

          <Card className="mt-8 max-w-sm">
            <CardTitle>Buy this book</CardTitle>
            <div className="mt-1 text-2xl font-semibold">
              ${book.price.toFixed(2)} {book.currency}
            </div>
            <div className="mt-4 space-y-2">
              {stripeReady ? (
                <form action={startCheckoutAction}>
                  <input type="hidden" name="slug" value={book.slug} />
                  <Button type="submit" className="w-full">
                    Buy with Card (Stripe)
                  </Button>
                </form>
              ) : (
                <>
                  <Button className="w-full" disabled>
                    Buy with Card (Stripe)
                  </Button>
                  <p className="text-xs text-warning">
                    Card payments are not available yet. Check back soon.
                  </p>
                </>
              )}
              {/* USDC on Base lands in a later phase. */}
              <Button className="w-full" variant="secondary" disabled>
                Pay with USDC (Base)
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">
              No crypto wallet needed. Proof of authorship is registered on-chain.
            </p>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

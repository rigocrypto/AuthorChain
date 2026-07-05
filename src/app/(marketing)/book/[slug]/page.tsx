import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPublicBookBySlug } from "@/lib/data/books";
import { ProofSeal } from "@/components/proof-seal";
import { ReaderBackground } from "@/components/reader-background";
import { getChainConfig, getExplorerTxUrl } from "@/lib/blockchain/registry";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { startCheckoutAction } from "./actions";
import { BookPreview } from "./book-preview";

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
  const chain = getChainConfig();

  const fmt = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
  const details = (
    [
      book.bookFormat ? ["Format", fmt(book.bookFormat)] : null,
      ["Language", book.language],
      book.pageCount ? ["Pages", String(book.pageCount)] : null,
      book.readingTimeMinutes ? ["Reading time", `${book.readingTimeMinutes} min`] : null,
      book.edition ? ["Edition", book.edition] : null,
      book.publisherName ? ["Publisher", book.publisherName] : null,
      book.publicationDate ? ["Published", book.publicationDate.slice(0, 10)] : null,
      book.isbn13 ? ["ISBN-13", book.isbn13] : null,
    ].filter(Boolean) as [string, string][]
  );
  const credits = (
    [
      ["Author", book.authorName],
      book.editorName ? ["Editor", book.editorName] : null,
      book.coverDesignerName ? ["Cover designer", book.coverDesignerName] : null,
      book.illustratorName ? ["Illustrator", book.illustratorName] : null,
      book.translatorName ? ["Translator", book.translatorName] : null,
      book.collaborators ? ["Collaborators", book.collaborators] : null,
      book.contributors ? ["Contributors", book.contributors] : null,
    ].filter(Boolean) as [string, string][]
  );
  const topics = book.topics
    ? book.topics.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <PageShell>
      <ReaderBackground />
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
        >
          ← Back to ReaderChain
        </Link>
        <Link href="/reader/library" className="text-muted transition-colors hover:text-foreground">
          My Library →
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Cover + reader preview */}
        <div>
          <BookPreview
            bookId={book.id}
            slug={book.slug}
            title={book.title}
            authorName={book.authorName}
            hasCover={book.hasCover}
            coverColor={book.coverColor}
            proofVerified={book.proofVerified}
            hasPreview={book.hasPreview}
            hasBackCover={book.hasBackCover}
            price={book.price}
            currency={book.currency}
            stripeReady={stripeReady}
          />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-accent">{book.category}</p>
              <StatusBadge tone="muted">{book.language}</StatusBadge>
              {book.proofVerified ? (
                <StatusBadge tone="accent">✓ Verified proof</StatusBadge>
              ) : null}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{book.title}</h1>
            {book.subtitle ? (
              <p className="mt-1 text-lg text-muted">{book.subtitle}</p>
            ) : null}
            <p className="mt-1 text-sm text-muted">by {book.authorName}</p>
          </div>

          {/* About */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                About this book
              </h2>
              <p className="mt-2 max-w-prose text-muted">{book.description}</p>
            </div>
            {book.audience ? (
              <div>
                <h3 className="text-sm font-semibold">Who this book is for</h3>
                <p className="mt-1 max-w-prose text-sm text-muted">{book.audience}</p>
              </div>
            ) : null}
            {book.whatYouWillLearn ? (
              <div>
                <h3 className="text-sm font-semibold">What you&apos;ll learn</h3>
                <p className="mt-1 max-w-prose whitespace-pre-line text-sm text-muted">
                  {book.whatYouWillLearn}
                </p>
              </div>
            ) : null}
            {topics.length ? (
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <StatusBadge key={t} tone="muted">
                    {t}
                  </StatusBadge>
                ))}
              </div>
            ) : null}
          </section>

          {/* Buy */}
          <Card className="max-w-sm">
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
              <Button className="w-full" variant="secondary" disabled>
                Pay with USDC (Base)
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">
              No crypto wallet needed. After purchase, read from your ReaderChain library.
            </p>
          </Card>

          {/* Book details */}
          {details.length ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Book details
              </h2>
              <dl className="mt-3 space-y-2 text-sm sm:max-w-md">
                {details.map(([k, val]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted">{k}</dt>
                    <dd className={`text-right ${k === "ISBN-13" ? "font-mono text-xs" : ""}`}>
                      {val}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {/* Credits */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
              Credits
            </h2>
            <dl className="mt-3 space-y-2 text-sm sm:max-w-md">
              {credits.map(([k, val]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right">{val}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Acknowledgments */}
          {book.acknowledgments ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                Thanks &amp; acknowledgments
              </h2>
              <p className="mt-2 max-w-prose whitespace-pre-line text-sm text-muted">
                {book.acknowledgments}
              </p>
            </section>
          ) : null}

          {/* Verified proof */}
          {book.proofVerified ? (
            <section className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-start gap-4">
                <ProofSeal variant="compact" className="w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold">Verified proof of authorship</h2>
                  <p className="mt-1 text-sm text-muted">
                    This book&apos;s manuscript hash is registered on {chain.network} — a
                    public, tamper-evident record of authorship. Only the hash goes
                    on-chain, never the content.
                  </p>
                  <dl className="mt-3 space-y-2 text-sm">
                    {book.fileHash ? (
                      <div>
                        <dt className="text-muted">Manuscript hash (SHA-256)</dt>
                        <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                          {book.fileHash}
                        </dd>
                      </div>
                    ) : null}
                    {book.proofTxHash ? (
                      <div>
                        <dt className="text-muted">Transaction</dt>
                        <dd className="mt-0.5 break-all font-mono text-xs">
                          <a
                            href={getExplorerTxUrl(book.proofTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            {book.proofTxHash} ↗
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>
            </section>
          ) : null}

          {/* Print edition — coming soon */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">Print edition</h2>
              <StatusBadge tone="muted">Coming soon</StatusBadge>
            </div>
            <p className="mt-1 max-w-prose text-sm text-muted">
              Paperback and hardcover editions with print-ready covers are coming to
              AuthorChain — order a physical copy delivered to your door, straight from
              an independent author.
            </p>
            <Button className="mt-4" variant="secondary" disabled>
              Order print edition (coming soon)
            </Button>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPublicBookBySlug, listPublishedBooks } from "@/lib/data/books";
import { listPublicBookReviews } from "@/lib/data/book-reviews";
import { resolveLocalizedBookMetadata } from "@/lib/data/book-translations";
import { getPublicPrintSettings } from "@/lib/data/print-settings";
import { getCurrentReader } from "@/lib/auth/reader-session";
import {
  resolveTrimDimensions,
  INTERIOR_COLOR_LABELS,
  PAPER_TYPE_LABELS,
  BINDING_LABELS,
  COVER_FINISH_LABELS,
} from "@/lib/publishing/print";
import { ProofSeal } from "@/components/proof-seal";
import { ReaderBackground } from "@/components/reader-background";
import { getChainConfig, getExplorerTxUrl } from "@/lib/blockchain/registry";
import { isStripeConfigured } from "@/lib/payments/stripe";
import { absoluteUrl, metaDescription, bookJsonLd, jsonLdScript } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { startCheckoutAction, submitBookReviewAction } from "./actions";
import { BookPreview } from "./book-preview";
import { ShareBook } from "./share-book";
import { BookSwipeNav } from "./book-swipe-nav";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const book = await getPublicBookBySlug(slug, locale);
  if (!book) {
    const { dict } = await getDictionary();
    return { title: dict.book.notFound, robots: { index: false, follow: false } };
  }

  const localized = resolveLocalizedBookMetadata(
    { title: book.title, subtitle: book.subtitle, description: book.description },
    book.translation,
  );
  const title = `${localized.title} by ${book.authorName}`;
  const description = metaDescription(
    localized.subtitle ? `${localized.subtitle}. ${localized.description}` : localized.description,
  );
  const url = absoluteUrl(`/book/${book.slug}`);

  // og:image / twitter:image come from colocated opengraph-image.tsx.
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "book", title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicBookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ref?: string; review?: string }>;
}) {
  const { slug } = await params;
  const { ref, review } = await searchParams;
  const refCode = typeof ref === "string" ? ref : "";
  const locale = await getLocale();
  const book = await getPublicBookBySlug(slug, locale);
  if (!book) notFound();
  const allBooks = await listPublishedBooks();
  const bookIndex = allBooks.findIndex((b) => b.slug === book.slug);
  const previousBook = bookIndex >= 0 && bookIndex < allBooks.length - 1
    ? allBooks[bookIndex + 1]
    : null;
  const nextBook = bookIndex > 0 ? allBooks[bookIndex - 1] : null;
  const previousHref = previousBook ? `/book/${previousBook.slug}` : null;
  const nextHref = nextBook ? `/book/${nextBook.slug}` : null;

  const { dict } = await getDictionary();
  const L = dict.book;
  const metadata = resolveLocalizedBookMetadata(
    { title: book.title, subtitle: book.subtitle, description: book.description },
    book.translation,
  );
  const stripeReady = isStripeConfigured();
  const chain = getChainConfig();
  const print = await getPublicPrintSettings(book.id);
  const [reader, publicReviews] = await Promise.all([
    getCurrentReader(),
    listPublicBookReviews(book.id),
  ]);
  const reviewStatus = typeof review === "string" ? review : "";
  const reviewMessage =
    reviewStatus === "success"
      ? "Thanks for sharing your thoughts. Your review is now visible."
      : reviewStatus === "signin"
        ? "Please sign in as a reader account to leave a review."
        : reviewStatus === "owned"
          ? "Only registered readers with this book in their library can review it."
          : reviewStatus === "invalid_rating"
            ? "Please choose a rating from 1 to 5 stars."
            : reviewStatus === "invalid_text"
              ? "Your review should be between 20 and 1200 characters."
              : reviewStatus === "error"
                ? "Could not save your review right now. Please try again."
                : reviewStatus === "unavailable"
                  ? "This book is currently unavailable for reviews."
                  : "";
  const reviewMessageTone = reviewStatus === "success" ? "text-emerald-400" : "text-warning";
  const mockReviews = [
    {
      id: "mock-review-1",
      rating: 5,
      thoughts:
        "Mockup example: Clear chapters, practical advice, and a polished flow. I finished this in two sittings and took notes all the way.",
      readerName: "Reader sample",
      createdAt: "",
      isMock: true,
    },
    {
      id: "mock-review-2",
      rating: 4,
      thoughts:
        "Mockup example: Great pacing and useful references. I'd love a short workbook companion in a future edition.",
      readerName: "Book club tester",
      createdAt: "",
      isMock: true,
    },
  ] as const;
  const renderedReviews = publicReviews.length > 0
    ? publicReviews.map((r) => ({ ...r, isMock: false }))
    : mockReviews;
  const printTrim = print ? resolveTrimDimensions(print) : null;
  const printDetails = print
    ? ([
        [L.binding, BINDING_LABELS[print.binding]],
        printTrim ? [L.trimSize, printTrim.label] : null,
        [L.interior, INTERIOR_COLOR_LABELS[print.interiorColor]],
        [L.paper, PAPER_TYPE_LABELS[print.paperType]],
        [L.coverFinish, COVER_FINISH_LABELS[print.coverFinish]],
        print.pageCount ? [L.pages, String(print.pageCount)] : null,
        print.spineWidthIn ? [L.spineWidth, `${print.spineWidthIn.toFixed(3)} in`] : null,
        print.weightOz ? [L.weight, `${print.weightOz} oz`] : null,
        print.printIsbn13 ? [L.printIsbn13, print.printIsbn13] : null,
        print.imprintName ? [L.imprint, print.imprintName] : null,
        print.distributor ? [L.distribution, print.distributor] : null,
      ].filter(Boolean) as [string, string][])
    : [];

  const fmt = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
  const details = (
    [
      book.bookFormat ? [L.format, fmt(book.bookFormat)] : null,
      [L.language, book.language],
      book.pageCount ? [L.pages, String(book.pageCount)] : null,
      book.readingTimeMinutes ? [L.readingTime, `${book.readingTimeMinutes} ${L.minutes}`] : null,
      book.edition ? [L.edition, book.edition] : null,
      book.publisherName ? [L.publisher, book.publisherName] : null,
      book.publicationDate ? [L.published, book.publicationDate.slice(0, 10)] : null,
      book.isbn13 ? [L.isbn13, book.isbn13] : null,
    ].filter(Boolean) as [string, string][]
  );
  const credits = (
    [
      [L.author, book.authorName],
      book.editorName ? [L.editor, book.editorName] : null,
      book.coverDesignerName ? [L.coverDesigner, book.coverDesignerName] : null,
      book.illustratorName ? [L.illustrator, book.illustratorName] : null,
      book.translatorName ? [L.translator, book.translatorName] : null,
      book.collaborators ? [L.collaborators, book.collaborators] : null,
      book.contributors ? [L.contributors, book.contributors] : null,
    ].filter(Boolean) as [string, string][]
  );
  const topics = book.topics
    ? book.topics.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <PageShell>
      <BookSwipeNav prevHref={previousHref} nextHref={nextHref}>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(
              bookJsonLd({
                ...book,
                title: metadata.title,
                subtitle: metadata.subtitle,
                description: metadata.description ?? "",
              }),
            ),
          }}
        />
        <ReaderBackground />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-muted transition-colors hover:text-foreground"
            >
              {L.backToReaderchain}
            </Link>
            <Link
              href="/explore"
              className="text-muted transition-colors hover:text-foreground"
            >
              {L.browseAllBooks}
            </Link>
            <Link href="/reader/library" className="text-muted transition-colors hover:text-foreground">
              {L.myLibrary}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {previousHref ? (
              <Link
                href={previousHref}
                className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
              >
                ← Previous
              </Link>
            ) : null}
            {nextHref ? (
              <Link
                href={nextHref}
                className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
              >
                Next →
              </Link>
            ) : null}
          </div>
        </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Cover + reader preview */}
        <div>
          <BookPreview
            bookId={book.id}
            slug={book.slug}
            title={metadata.title}
            authorName={book.authorName}
            hasCover={book.hasCover}
            coverMimeType={book.coverMimeType}
            coverColor={book.coverColor}
            proofVerified={book.proofVerified}
            hasPreview={book.hasPreview}
            hasBackCover={book.hasBackCover}
            price={book.price}
            currency={book.currency}
            stripeReady={stripeReady}
            refCode={refCode}
          />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-accent">{book.category}</p>
              <StatusBadge tone="muted">{book.language}</StatusBadge>
              {book.proofVerified ? (
                <StatusBadge tone="accent">{dict.common.verifiedProof}</StatusBadge>
              ) : null}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {L.h1By
                .replace("{title}", metadata.title)
                .replace("{author}", book.authorName)}
            </h1>
            {metadata.subtitle ? (
              <p className="mt-1 text-lg text-muted">{metadata.subtitle}</p>
            ) : null}
            <p className="mt-1 text-sm text-muted">
              {L.by} {book.authorName}
            </p>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted">
              {L.seoIntro
                .replace("{title}", metadata.title)
                .replace("{author}", book.authorName)}
            </p>
          </div>

          {/* About */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {L.about}
              </h2>
              <p className="mt-2 max-w-prose text-muted">{metadata.description}</p>
            </div>
            {book.audience ? (
              <div>
                <h3 className="text-sm font-semibold">{L.whoFor}</h3>
                <p className="mt-1 max-w-prose text-sm text-muted">{book.audience}</p>
              </div>
            ) : null}
            {book.whatYouWillLearn ? (
              <div>
                <h3 className="text-sm font-semibold">{L.whatLearn}</h3>
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
            <CardTitle>{L.buyTitle}</CardTitle>
            <div className="mt-1 text-2xl font-semibold">
              ${book.price.toFixed(2)} {book.currency}
            </div>
            <div className="mt-4 space-y-2">
              {stripeReady ? (
                <form action={startCheckoutAction}>
                  <input type="hidden" name="slug" value={book.slug} />
                  {refCode ? <input type="hidden" name="ref" value={refCode} /> : null}
                  <Button type="submit" className="w-full">
                    {L.buyCard}
                  </Button>
                </form>
              ) : (
                <>
                  <Button className="w-full" disabled>
                    {L.buyCard}
                  </Button>
                  <p className="text-xs text-warning">{L.buyCardUnavailable}</p>
                </>
              )}
              <Button className="w-full" variant="secondary" disabled>
                {L.buyUsdc}
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted">{L.buyNote}</p>
          </Card>

          {/* Share */}
          <ShareBook title={metadata.title} />

          {/* Reader reviews */}
          <section id="reader-reviews" className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-semibold">Reader reviews</h2>
              <StatusBadge tone="muted">{renderedReviews.length} listed</StatusBadge>
            </div>
            <p className="mt-1 text-sm text-muted">
              Registered readers can share thoughts after adding this book to their library.
            </p>

            {reviewMessage ? (
              <p className={`mt-3 text-sm ${reviewMessageTone}`}>{reviewMessage}</p>
            ) : null}

            <div className="mt-4 space-y-3">
              {renderedReviews.map((r) => {
                const created = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Preview";
                return (
                  <article key={r.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{r.readerName}</p>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <span>{"★".repeat(r.rating)}{"☆".repeat(Math.max(0, 5 - r.rating))}</span>
                        <span>{created}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted">{r.thoughts}</p>
                    {r.isMock ? (
                      <p className="mt-2 text-[11px] uppercase tracking-wide text-accent">
                        Mockup preview
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>

            {reader ? (
              <form action={submitBookReviewAction} className="mt-5 space-y-3 rounded-xl border border-border bg-background/40 p-4">
                <input type="hidden" name="slug" value={book.slug} />
                <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
                  <label htmlFor="rating" className="text-sm text-muted">
                    Rating
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    defaultValue="5"
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary/40 transition focus:ring-2"
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Needs work</option>
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:items-start">
                  <label htmlFor="thoughts" className="text-sm text-muted">
                    Your thoughts
                  </label>
                  <textarea
                    id="thoughts"
                    name="thoughts"
                    rows={4}
                    minLength={20}
                    maxLength={1200}
                    placeholder="Share what you liked, what stood out, or what could improve."
                    className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary/40 transition focus:ring-2"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Submit review</Button>
                </div>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-border bg-background/40 p-4 text-sm text-muted">
                <p>Sign in with your reader account to submit a review.</p>
                <Link href="/login" className="mt-2 inline-block text-accent hover:underline">
                  Sign in
                </Link>
              </div>
            )}
          </section>

          {/* Book details */}
          {details.length ? (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {L.details}
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
              {L.credits}
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
                {L.acknowledgments}
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
                  <h2 className="font-semibold">{L.verifiedProofTitle}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {L.verifiedProofBody
                      .replace("{title}", metadata.title)
                      .replace("{network}", chain.network)}
                  </p>
                  <dl className="mt-3 space-y-2 text-sm">
                    {book.fileHash ? (
                      <div>
                        <dt className="text-muted">{L.manuscriptHash}</dt>
                        <dd className="mt-0.5 break-all font-mono text-xs text-foreground">
                          {book.fileHash}
                        </dd>
                      </div>
                    ) : null}
                    {book.proofTxHash ? (
                      <div>
                        <dt className="text-muted">{L.transaction}</dt>
                        <dd className="mt-0.5 space-y-1 break-all font-mono text-xs">
                          <span className="block text-foreground">{book.proofTxHash}</span>
                          <a
                            href={getExplorerTxUrl(book.proofTxHash)}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="inline-block text-accent hover:underline"
                          >
                            {L.viewOnExplorer} ↗
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </div>
            </section>
          ) : null}

          {/* Print edition — only expand when configured; keep empty state short + book-specific */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{L.printEdition}</h2>
              {print ? (
                <StatusBadge tone="accent">{L.printAvailable}</StatusBadge>
              ) : (
                <StatusBadge tone="muted">{L.printSoon}</StatusBadge>
              )}
            </div>

            {print ? (
              <>
                <p className="mt-1 max-w-prose text-sm text-muted">
                  {L.printAvailableDesc}
                  {print.availabilityNote ? ` ${print.availabilityNote}` : ""}
                </p>
                {print.price != null ? (
                  <div className="mt-3 text-xl font-semibold">
                    ${print.price.toFixed(2)} {print.currency}
                  </div>
                ) : null}
                {printDetails.length ? (
                  <dl className="mt-3 space-y-2 text-sm sm:max-w-md">
                    {printDetails.map(([k, val]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-muted">{k}</dt>
                        <dd className={`text-right ${k === L.printIsbn13 ? "font-mono text-xs" : ""}`}>
                          {val}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {print.printNotes ? (
                  <p className="mt-3 max-w-prose whitespace-pre-line text-sm text-muted">
                    {print.printNotes}
                  </p>
                ) : null}
                <Button className="mt-4" variant="secondary" disabled>
                  {L.orderPrint}
                </Button>
                <p className="mt-2 text-xs text-muted">{L.printRefNote}</p>
              </>
            ) : (
              <p className="mt-1 max-w-prose text-sm text-muted">
                {L.printComingDesc.replace("{title}", metadata.title)}
              </p>
            )}
          </section>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-4 text-sm">
        <div className="text-muted">Swipe left/right on mobile to move between books.</div>
        <div className="flex items-center gap-2">
          {previousHref ? (
            <Link
              href={previousHref}
              className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
            >
              ← Previous
            </Link>
          ) : null}
          {nextHref ? (
            <Link
              href={nextHref}
              className="inline-flex items-center rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
            >
              Next →
            </Link>
          ) : null}
        </div>
      </div>
      </BookSwipeNav>
    </PageShell>
  );
}

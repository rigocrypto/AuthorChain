import type { Metadata } from "next";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PublishedBookCard } from "@/components/published-book-card";
import { ReaderBackground } from "@/components/reader-background";
import { listPublishedBooks } from "@/lib/data/books";
import { absoluteUrl, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ReaderChain — Discover Verified Books",
  description:
    "Explore books from independent authors with verified on-chain authorship proof, secure previews, and reader library access.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "ReaderChain — Discover Verified Books",
    description:
      "Explore books from independent authors with verified on-chain authorship proof, secure previews, and reader library access.",
    url: "/explore",
  },
};
export const dynamic = "force-dynamic";

const comingSoon = [
  { t: "Audiobooks", d: "Listen to verified books from independent authors." },
  { t: "Video Books", d: "Watch companion lessons and visual editions." },
  { t: "Book Clubs", d: "Read together and discuss with the community." },
  { t: "Reader Rewards", d: "Earn perks for supporting the creators you love." },
  { t: "AI Recommendations", d: "Discover your next read, personalized to your taste." },
  { t: "Collector Editions", d: "Collect limited digital editions and unlock premium content." },
];

export default async function ExplorePage() {
  const books = await listPublishedBooks();
  const featured = books.filter((b) => b.proofVerified).slice(0, 4);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ReaderChain — Discover Verified Books",
    url: absoluteUrl("/explore"),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: books.length,
      itemListElement: books.slice(0, 50).map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/book/${b.slug}`),
        name: b.title,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionJsonLd) }}
      />
      {/* Ambient page background */}
      <ReaderBackground />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="ac-hero-radial pointer-events-none absolute inset-0 opacity-50"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            ReaderChain · Verified books from independent authors
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="ac-gradient-text">Discover verified books</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Buy directly from independent authors, access your secure digital library,
            and support creators building the future of publishing.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <ButtonLink href="/reader/library" variant="secondary">
              My Library
            </ButtonLink>
          </div>
        </div>
      </section>

      {books.length === 0 ? (
        /* Empty state */
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Card className="mx-auto max-w-lg text-center">
            <CardTitle>ReaderChain is getting ready</CardTitle>
            <CardDescription>
              New verified books will appear here soon.
            </CardDescription>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/dashboard">Visit AuthorChain Studio</ButtonLink>
            </div>
          </Card>
        </section>
      ) : (
        <>
          {/* Featured verified books */}
          {featured.length > 0 ? (
            <section className="mx-auto max-w-6xl px-4 py-14">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Featured verified books</h2>
                <StatusBadge tone="accent">✓ Proof of authorship</StatusBadge>
              </div>
              <p className="mt-1 text-muted">
                Books with an on-chain proof of authorship on Base.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((b) => (
                  <PublishedBookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Full catalog */}
          <section className="mx-auto max-w-6xl px-4 pb-16">
            <h2 className="text-2xl font-semibold">All books</h2>
            <p className="mt-1 text-muted">
              {books.length} verified book{books.length === 1 ? "" : "s"} available.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((b) => (
                <PublishedBookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* Coming soon reader features */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold">Coming soon to ReaderChain</h2>
          <p className="mt-1 text-muted">The reader experience is just getting started.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((f) => (
              <Card key={f.t}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{f.t}</CardTitle>
                  <StatusBadge tone="muted">Soon</StatusBadge>
                </div>
                <CardDescription>{f.d}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collector Editions positioning */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="ac-glow rounded-2xl border border-border bg-surface p-10 text-center">
          <StatusBadge tone="accent">Coming soon</StatusBadge>
          <h2 className="mt-4 text-2xl font-semibold">Collector Editions</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            Collector Editions are coming soon. Readers will be able to collect limited
            digital editions, unlock premium content, and support independent authors
            directly — every edition backed by verified proof-of-authorship.
          </p>
        </div>
      </section>
    </div>
  );
}

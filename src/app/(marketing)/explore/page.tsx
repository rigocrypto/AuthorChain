import type { Metadata } from "next";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PublishedBookCard } from "@/components/published-book-card";
import { ReaderBackground } from "@/components/reader-background";
import { listPublishedBooks } from "@/lib/data/books";
import { absoluteUrl, jsonLdScript } from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.explore.metaTitle,
    description: dict.explore.metaDescription,
    alternates: { canonical: "/explore" },
    openGraph: {
      title: dict.explore.metaTitle,
      description: dict.explore.metaDescription,
      url: "/explore",
    },
  };
}
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
  const { dict } = await getDictionary();
  const t = dict.explore;
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
            {t.heroBadge}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="ac-gradient-text">{t.heroTitle}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{t.heroSubtitle}</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <ButtonLink href="/reader/library" variant="secondary">
              {t.myLibrary}
            </ButtonLink>
          </div>
        </div>
      </section>

      {books.length === 0 ? (
        /* Empty state */
        <section className="mx-auto max-w-6xl px-4 py-20">
          <Card className="mx-auto max-w-lg text-center">
            <CardTitle>{t.emptyTitle}</CardTitle>
            <CardDescription>{t.emptyDesc}</CardDescription>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/dashboard">{t.visitStudio}</ButtonLink>
            </div>
          </Card>
        </section>
      ) : (
        <>
          {/* Featured verified books */}
          {featured.length > 0 ? (
            <section className="mx-auto max-w-6xl px-4 py-14">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">{t.featuredTitle}</h2>
                <StatusBadge tone="accent">{t.featuredBadge}</StatusBadge>
              </div>
              <p className="mt-1 text-muted">{t.featuredSubtitle}</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((b) => (
                  <PublishedBookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          ) : null}

          {/* Full catalog */}
          <section className="mx-auto max-w-6xl px-4 pb-16">
            <h2 className="text-2xl font-semibold">{t.allBooks}</h2>
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
          <h2 className="text-2xl font-semibold">{t.comingSoonTitle}</h2>
          <p className="mt-1 text-muted">{t.comingSoonSubtitle}</p>
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

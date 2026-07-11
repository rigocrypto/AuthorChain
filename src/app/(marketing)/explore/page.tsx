import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { PublishedBookCard } from "@/components/published-book-card";
import { ReaderBackground } from "@/components/reader-background";
import { HorizontalBookCarousel } from "@/components/horizontal-book-carousel";
import { listPublishedBooks } from "@/lib/data/books";
import { absoluteUrl, jsonLdScript, siteConfig } from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return {
    title: dict.explore.metaTitle,
    description: dict.explore.metaDescription,
    alternates: { canonical: absoluteUrl("/explore") },
    openGraph: {
      type: "website",
      title: dict.explore.metaTitle,
      description: dict.explore.metaDescription,
      url: absoluteUrl("/explore"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.explore.metaTitle,
      description: dict.explore.metaDescription,
    },
  };
}
export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const { dict } = await getDictionary();
  const t = dict.explore;
  const books = await listPublishedBooks();
  const FEATURED_BOOK_SLUGS = new Set([
    "the-quantum-purgatory",
    "the-ultimate-ai-prompts-playbook",
  ]);

  function isFeaturedBook(slug: string) {
    return FEATURED_BOOK_SLUGS.has(slug.toLowerCase());
  }

  const featured = books.filter((b) => isFeaturedBook(b.slug)).slice(0, 4);

  const comingSoon = [
    { t: t.soonAudiobooks, d: t.soonAudiobooksDesc },
    { t: t.soonVideoBooks, d: t.soonVideoBooksDesc },
    { t: t.soonBookClubs, d: t.soonBookClubsDesc },
    { t: t.soonReaderRewards, d: t.soonReaderRewardsDesc },
    { t: t.soonAiRecs, d: t.soonAiRecsDesc },
    { t: t.soonCollector, d: t.soonCollectorDesc },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.metaTitle,
    description: t.metaDescription,
    url: absoluteUrl("/explore"),
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
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
        dangerouslySetInnerHTML={{ __html: jsonLdScript(collectionJsonLd) }}
      />
      <ReaderBackground src="/background.webp" />

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
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/reader/library" variant="secondary">
              {t.myLibrary}
            </ButtonLink>
            <ButtonLink href="/#proof" variant="ghost">
              {t.linkProof}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* SEO depth: what ReaderChain is */}
      <section className="mx-auto max-w-3xl px-4 py-14">
        <h2 className="text-2xl font-semibold">{t.aboutTitle}</h2>
        <p className="mt-3 leading-relaxed text-muted">{t.aboutLead}</p>
        <p className="mt-4 leading-relaxed text-muted">{t.aboutP1}</p>
      </section>

      {books.length === 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <Card className="mx-auto max-w-lg text-center">
            <CardTitle as="div">{t.emptyTitle}</CardTitle>
            <CardDescription>{t.emptyDesc}</CardDescription>
            <div className="mt-6 flex justify-center">
              <ButtonLink href="/dashboard">{t.visitStudio}</ButtonLink>
            </div>
          </Card>
        </section>
      ) : (
        <>
          {featured.length > 0 ? (
            <section className="mx-auto max-w-6xl px-4 py-10">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">{t.featuredTitle}</h2>
                <StatusBadge tone="accent">{t.featuredBadge}</StatusBadge>
              </div>
              <p className="mt-1 text-muted">{t.featuredSubtitle}</p>
              <div className="mt-6">
                <HorizontalBookCarousel>
                {featured.map((b, i) => (
                  <div key={b.id} className="w-[min(88vw,22rem)] shrink-0 snap-start transition duration-300 sm:w-[20rem]">
                    <PublishedBookCard
                      book={b}
                      priority={i < 4}
                      featured={isFeaturedBook(b.slug)}
                      byLabel={dict.book.by}
                      verifiedProofLabel={dict.common.verifiedProof}
                      openBookLabel={dict.common.openBook}
                    />
                  </div>
                ))}
                </HorizontalBookCarousel>
              </div>
            </section>
          ) : null}

          <section className="mx-auto max-w-6xl px-4 pb-14">
            <h2 className="text-2xl font-semibold">{t.allBooks}</h2>
            <p className="mt-1 text-muted">
              {books.length === 1
                ? t.booksAvailableOne
                : t.booksAvailable.replace("{count}", String(books.length))}
            </p>
            <div className="mt-6">
              <HorizontalBookCarousel>
              {books.map((b, i) => (
                <div key={b.id} className="w-[min(88vw,21.5rem)] shrink-0 snap-start transition duration-300 sm:w-[19.5rem]">
                  <PublishedBookCard
                    book={b}
                    priority={i < 6}
                    featured={isFeaturedBook(b.slug)}
                    byLabel={dict.book.by}
                    verifiedProofLabel={dict.common.verifiedProof}
                    openBookLabel={dict.common.openBook}
                  />
                </div>
              ))}
              </HorizontalBookCarousel>
            </div>
          </section>
        </>
      )}

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-semibold">{t.verifiedTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t.verifiedLead}</p>
          <p className="mt-4 leading-relaxed text-muted">{t.verifiedP1}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold">{t.accessTitle}</h2>
        <p className="mt-2 max-w-3xl text-muted">{t.accessLead}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {(
            [
              [t.access1t, t.access1d],
              [t.access2t, t.access2d],
              [t.access3t, t.access3d],
            ] as const
          ).map(([title, body]) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface p-5"
            >
              <p className="font-medium text-foreground">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="text-2xl font-semibold">{t.protectTitle}</h2>
          <p className="mt-3 leading-relaxed text-muted">{t.protectP1}</p>
          <p className="mt-4 leading-relaxed text-muted">{t.protectP2}</p>
          <p className="mt-4 leading-relaxed text-muted">{t.protectP3}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <Link href="/#proof" className="text-accent hover:underline">
              {t.linkProof}
            </Link>
            <Link href="/" className="text-accent hover:underline">
              {t.linkHome}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-semibold">{t.comingSoonTitle}</h2>
          <p className="mt-1 text-muted">{t.comingSoonSubtitle}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((f) => (
              <Card key={f.t}>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle as="div">{f.t}</CardTitle>
                  <StatusBadge tone="muted">{t.soon}</StatusBadge>
                </div>
                <CardDescription>{f.d}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="ac-glow rounded-2xl border border-border bg-surface p-10 text-center">
          <StatusBadge tone="accent">{t.comingSoonBadge}</StatusBadge>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            {t.collectorEditionsTitle}
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-muted">
            {t.collectorEditionsDesc}
          </p>
        </div>
      </section>
    </div>
  );
}

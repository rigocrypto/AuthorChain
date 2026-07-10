import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PublishedBookCard } from "@/components/published-book-card";
import { ReaderBackground } from "@/components/reader-background";
import { listPublishedBooks } from "@/lib/data/books";
import {
  absoluteUrl,
  organizationJsonLd,
  websiteJsonLd,
  webApplicationJsonLd,
  jsonLdScript,
} from "@/lib/seo";
import { getDictionary } from "@/i18n/get-dictionary";
import type { Dictionary } from "@/i18n/locales/en";
import Link from "next/link";

type HomeDict = Dictionary["home"];

function ContentGrid({
  items,
}: {
  items: { t: string; d: string }[];
}) {
  // Non-heading labels keep the homepage heading outline lean (one H1, H2 sections).
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.t}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <p className="font-medium text-foreground">{item.t}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.d}</p>
        </div>
      ))}
    </div>
  );
}

function faqJsonLd(t: HomeDict) {
  const pairs = [
    [t.faq1q, t.faq1a],
    [t.faq2q, t.faq2a],
    [t.faq3q, t.faq3a],
    [t.faq4q, t.faq4a],
    [t.faq5q, t.faq5a],
    [t.faq6q, t.faq6a],
  ] as const;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  // Absolute title — already includes brand; avoid template double-suffix.
  return {
    title: { absolute: dict.home.metaTitle },
    description: dict.home.metaDescription,
    alternates: { canonical: absoluteUrl("/") },
    openGraph: {
      type: "website",
      title: dict.home.metaTitle,
      description: dict.home.metaDescription,
      url: absoluteUrl("/"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.home.metaTitle,
      description: dict.home.metaDescription,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const { dict } = await getDictionary();
  const t = dict.home;
  // Localized marketing copy — never hardcode English agent blurbs on the landing page.
  const agentCards = [
    { id: "copy", name: t.agentCopyName, description: t.agentCopyDesc },
    { id: "launch", name: t.agentLaunchName, description: t.agentLaunchDesc },
    {
      id: "community",
      name: t.agentCommunityName,
      description: t.agentCommunityDesc,
    },
    { id: "pricing", name: t.agentPricingName, description: t.agentPricingDesc },
    {
      id: "opportunity",
      name: t.agentOpportunityName,
      description: t.agentOpportunityDesc,
    },
  ];
  const steps = [
    { n: "1", t: t.step1t, d: t.step1d },
    { n: "2", t: t.step2t, d: t.step2d },
    { n: "3", t: t.step3t, d: t.step3d },
    { n: "4", t: t.step4t, d: t.step4d },
  ];
  const books = await listPublishedBooks();
  const featured = [...books]
    .sort((a, b) => Number(b.proofVerified) - Number(a.proofVerified))
    .slice(0, 4);

  return (
    <div>
      <ReaderBackground src="/background.webp" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([
            organizationJsonLd(),
            websiteJsonLd(),
            webApplicationJsonLd(),
            faqJsonLd(t),
          ]),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="ac-hero-radial pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            {t.badge}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="ac-gradient-text">{t.heroTitle}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{t.heroSubtitle}</p>
          <nav
            aria-label="Page sections"
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
          >
            <Link
              href="/explore"
              className="font-medium text-accent transition-colors hover:underline"
            >
              {t.exploreReaderchain}
            </Link>
            <Link
              href="/#how-it-works"
              className="text-muted transition-colors hover:text-foreground hover:underline"
            >
              {t.jumpHowItWorks}
            </Link>
            <Link
              href="/#proof"
              className="text-muted transition-colors hover:text-foreground hover:underline"
            >
              {t.jumpProof}
            </Link>
          </nav>
        </div>
      </section>

      {/* Two portals */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ReaderChain */}
          <div className="ac-glow flex flex-col rounded-2xl border border-border bg-surface p-8">
            <StatusBadge tone="accent">{t.readerBadge}</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">{t.readerTitle}</h2>
            <p className="mt-2 flex-1 text-muted">{t.readerDesc}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/explore" variant="primary">
                {t.exploreReaderchain}
              </ButtonLink>
              <ButtonLink href="/reader/library" variant="secondary">
                {t.myLibrary}
              </ButtonLink>
            </div>
          </div>

          {/* AuthorChain Studio */}
          <div className="ac-glow flex flex-col rounded-2xl border border-border bg-surface p-8">
            <StatusBadge tone="accent">{t.authorBadge}</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">{t.authorTitle}</h2>
            <p className="mt-2 flex-1 text-muted">{t.authorDesc}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard" variant="primary">
                {t.enterStudio}
              </ButtonLink>
              <ButtonLink href="/dashboard/upload" variant="secondary">
                {t.startPublishing}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Featured books (real ReaderChain data) */}
      {featured.length > 0 ? (
        <section id="readers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">{t.featuredTitle}</h2>
              <p className="mt-1 text-muted">{t.featuredSubtitle}</p>
            </div>
            <ButtonLink href="/explore" variant="ghost">
              {t.exploreAll}
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((b, i) => (
              <PublishedBookCard
                key={b.id}
                book={b}
                priority={i < 2}
                byLabel={dict.book.by}
                verifiedProofLabel={dict.common.verifiedProof}
                openBookLabel={dict.common.openBook}
              />
            ))}
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">{t.howItWorks}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-surface p-6">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 font-mono text-accent">
                {s.n}
              </div>
              <p className="mt-3 font-medium text-foreground">{s.t}</p>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of authorship */}
      <section id="proof" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <StatusBadge tone="accent">{t.proofBadge}</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">{t.proofTitle}</h2>
            <p className="mt-2 text-muted">{t.proofDesc}</p>
          </div>
          <div className="ac-glow rounded-2xl border border-border bg-surface p-8">
            <div className="text-sm text-muted">{t.proofCardLabel}</div>
            <div className="mt-2 font-mono text-xs text-accent break-all">
              sha256 · Base · AuthorChainRegistry
            </div>
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge tone="accent">{dict.common.verifiedProof}</StatusBadge>
              <span className="text-sm text-muted">{t.proofCardNote}</span>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xl font-semibold text-foreground">{t.proofHowTitle}</p>
          <p className="mt-2 max-w-3xl text-muted">{t.proofHowLead}</p>
          <ContentGrid
            items={[
              { t: t.proofHow1t, d: t.proofHow1d },
              { t: t.proofHow2t, d: t.proofHow2d },
              { t: t.proofHow3t, d: t.proofHow3d },
              { t: t.proofHow4t, d: t.proofHow4d },
            ]}
          />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            {t.proofHowNote}
          </p>
        </div>
      </section>

      {/* Why independent authors need proof */}
      <section
        id="why-proof"
        className="border-y border-border bg-surface/30"
      >
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-2xl font-semibold">{t.whyProofTitle}</h2>
          <p className="mt-2 max-w-3xl text-muted">{t.whyProofLead}</p>
          <ContentGrid
            items={[
              { t: t.whyProof1t, d: t.whyProof1d },
              { t: t.whyProof2t, d: t.whyProof2d },
              { t: t.whyProof3t, d: t.whyProof3d },
              { t: t.whyProof4t, d: t.whyProof4d },
            ]}
          />
        </div>
      </section>

      {/* Direct sales */}
      <section id="direct-sales" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">{t.salesTitle}</h2>
        <p className="mt-2 max-w-3xl text-muted">{t.salesLead}</p>
        <ContentGrid
          items={[
            { t: t.sales1t, d: t.sales1d },
            { t: t.sales2t, d: t.sales2d },
            { t: t.sales3t, d: t.sales3d },
            { t: t.sales4t, d: t.sales4d },
          ]}
        />
        <div className="mt-6">
          <ButtonLink href="/explore" variant="secondary">
            {t.exploreReaderchain}
          </ButtonLink>
        </div>
      </section>

      {/* AI agents */}
      <section id="agents" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">{t.agentsTitle}</h2>
        <p className="mt-1 text-muted">{t.agentsSubtitle}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentCards.map((a) => (
            <Card key={a.id}>
              <CardTitle as="div">{a.name}</CardTitle>
              <CardDescription>{a.description}</CardDescription>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <p className="text-xl font-semibold text-foreground">
            {t.aiWorkflowTitle}
          </p>
          <p className="mt-2 max-w-3xl text-muted">{t.aiWorkflowLead}</p>
          <ContentGrid
            items={[
              { t: t.aiWorkflow1t, d: t.aiWorkflow1d },
              { t: t.aiWorkflow2t, d: t.aiWorkflow2d },
              { t: t.aiWorkflow3t, d: t.aiWorkflow3d },
            ]}
          />
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            {t.aiWorkflowNote}
          </p>
        </div>
      </section>

      {/* Security */}
      <section
        id="security-posture"
        className="border-y border-border bg-surface/30"
      >
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
          <h2 className="text-2xl font-semibold">{t.securityTitle}</h2>
          <p className="mt-2 max-w-3xl text-muted">{t.securityLead}</p>
          <ContentGrid
            items={[
              { t: t.security1t, d: t.security1d },
              { t: t.security2t, d: t.security2d },
              { t: t.security3t, d: t.security3d },
              { t: t.security4t, d: t.security4d },
            ]}
          />
          <p className="mt-6 text-sm">
            <Link href="/security" className="text-accent hover:underline">
              {dict.footer.securityPolicy}
            </Link>
            {" · "}
            <Link href="/privacy" className="text-accent hover:underline">
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section id="why-authorchain" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">{t.diffTitle}</h2>
        <p className="mt-2 max-w-3xl text-muted">{t.diffLead}</p>
        <ContentGrid
          items={[
            { t: t.diff1t, d: t.diff1d },
            { t: t.diff2t, d: t.diff2d },
            { t: t.diff3t, d: t.diff3d },
            { t: t.diff4t, d: t.diff4d },
          ]}
        />
      </section>

      {/* FAQ — visible questions only; FAQPage JSON-LD matches these pairs */}
      <section id="faq" className="border-t border-border bg-surface/30">
        <div className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16">
          <h2 className="text-2xl font-semibold">{t.faqTitle}</h2>
          <p className="mt-2 text-muted">{t.faqSubtitle}</p>
          <dl className="mt-8 space-y-6">
            {(
              [
                [t.faq1q, t.faq1a],
                [t.faq2q, t.faq2a],
                [t.faq3q, t.faq3a],
                [t.faq4q, t.faq4a],
                [t.faq5q, t.faq5a],
                [t.faq6q, t.faq6a],
              ] as const
            ).map(([q, a]) => (
              <div
                key={q}
                className="rounded-xl border border-border bg-surface p-5"
              >
                <dt className="text-base font-medium text-foreground">{q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Collector Editions positioning */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <StatusBadge tone="muted">{t.collectorReaderBadge}</StatusBadge>
            <CardTitle as="div">
              <span className="mt-3 block">{t.collectorReaderTitle}</span>
            </CardTitle>
            <CardDescription>{t.collectorReaderDesc}</CardDescription>
          </Card>
          <Card>
            <StatusBadge tone="muted">{t.collectorAuthorBadge}</StatusBadge>
            <CardTitle as="div">
              <span className="mt-3 block">{t.collectorAuthorTitle}</span>
            </CardTitle>
            <CardDescription>{t.collectorAuthorDesc}</CardDescription>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="ac-glow rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl font-semibold">{t.ctaTitle}</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">{t.ctaDesc}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/explore" variant="primary">
              {t.exploreReaderchain}
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary">
              {t.enterStudio}
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

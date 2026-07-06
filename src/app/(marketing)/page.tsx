import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PublishedBookCard } from "@/components/published-book-card";
import { ReaderBackground } from "@/components/reader-background";
import { agents, previewAgents } from "@/lib/agents";
import { listPublishedBooks } from "@/lib/data/books";
import { organizationJsonLd, websiteJsonLd, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AuthorChain — Publish, Prove, Sell, and Deliver Books",
  description:
    "Launch verified digital books with AI-powered publishing tools, on-chain manuscript proof, Stripe checkout, and ReaderChain library access.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "AuthorChain — Publish, Prove, Sell, and Deliver Books",
    description:
      "Launch verified digital books with AI-powered publishing tools, on-chain manuscript proof, Stripe checkout, and ReaderChain library access.",
    url: "/",
  },
};

export const dynamic = "force-dynamic";

const agentCards = [
  ...agents.map((a) => ({ id: a.id, name: a.name, description: a.description })),
  ...previewAgents.map((a) => ({ id: a.id, name: a.name, description: a.description })),
];

const steps = [
  { n: "1", t: "Author uploads", d: "Upload your book (PDF, EPUB, Audio)." },
  { n: "2", t: "Prove authorship", d: "A SHA-256 proof is registered on Base." },
  { n: "3", t: "Publish & sell", d: "Sell to global readers in fiat or crypto." },
  { n: "4", t: "Earn & grow", d: "Get paid instantly. Grow your audience." },
];

export default async function Home() {
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
          __html: jsonLdScript([organizationJsonLd(), websiteJsonLd()]),
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
            AI + Web3 publishing · Verified on-chain · Powered by creators
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="ac-gradient-text">Publish. Own. Earn. Grow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            AuthorChain is the AI + Web3 publishing ecosystem where authors create, prove,
            publish, and earn — and readers discover, buy, collect, and enjoy verified books.
          </p>
        </div>
      </section>

      {/* Two portals */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ReaderChain */}
          <div className="ac-glow flex flex-col rounded-2xl border border-border bg-surface p-8">
            <StatusBadge tone="accent">ReaderChain</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">For readers &amp; collectors</h2>
            <p className="mt-2 flex-1 text-muted">
              Discover verified books, support independent authors, and build your secure
              digital library.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/explore" variant="primary">
                Explore ReaderChain
              </ButtonLink>
              <ButtonLink href="/reader/library" variant="secondary">
                My Library
              </ButtonLink>
            </div>
          </div>

          {/* AuthorChain Studio */}
          <div className="ac-glow flex flex-col rounded-2xl border border-border bg-surface p-8">
            <StatusBadge tone="accent">AuthorChain Studio</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">For authors &amp; creators</h2>
            <p className="mt-2 flex-1 text-muted">
              Create with AI, prove authorship on-chain, sell with Stripe, track royalties,
              and grow your audience.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard" variant="primary">
                Enter AuthorChain Studio
              </ButtonLink>
              <ButtonLink href="/dashboard/upload" variant="secondary">
                Start Publishing
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
              <h2 className="text-2xl font-semibold">Featured on ReaderChain</h2>
              <p className="mt-1 text-muted">Verified books from independent authors.</p>
            </div>
            <ButtonLink href="/explore" variant="ghost">
              Explore all →
            </ButtonLink>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((b) => (
              <PublishedBookCard key={b.id} book={b} />
            ))}
          </div>
        </section>
      ) : null}

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-surface p-6">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 font-mono text-accent">
                {s.n}
              </div>
              <div className="mt-3 font-medium">{s.t}</div>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of authorship */}
      <section id="proof" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <StatusBadge tone="accent">Proof of authorship</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold">Verified ownership, on-chain</h2>
            <p className="mt-2 text-muted">
              Every manuscript is hashed with SHA-256 and its proof is registered on Base —
              a public, verifiable record that you are the author. Readers see a verified
              badge; you keep full control of your work.
            </p>
          </div>
          <div className="ac-glow rounded-2xl border border-border bg-surface p-8">
            <div className="text-sm text-muted">On-chain proof</div>
            <div className="mt-2 font-mono text-xs text-accent break-all">
              sha256 · Base Sepolia · AuthorChainRegistry
            </div>
            <div className="mt-4 flex items-center gap-2">
              <StatusBadge tone="accent">✓ Verified proof</StatusBadge>
              <span className="text-sm text-muted">shown on every verified book</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI agents */}
      <section id="agents" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">AI tools in AuthorChain Studio</h2>
        <p className="mt-1 text-muted">Smart assistants that write, plan, and grow your book.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agentCards.map((a) => (
            <Card key={a.id}>
              <CardTitle>{a.name}</CardTitle>
              <CardDescription>{a.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Collector Editions positioning */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <StatusBadge tone="muted">Coming soon · ReaderChain</StatusBadge>
            <CardTitle>
              <span className="mt-3 block">Collector Editions</span>
            </CardTitle>
            <CardDescription>
              Collect limited digital editions, unlock premium content, and support
              independent authors directly.
            </CardDescription>
          </Card>
          <Card>
            <StatusBadge tone="muted">Coming soon · AuthorChain Studio</StatusBadge>
            <CardTitle>
              <span className="mt-3 block">Tokenized Collector Editions</span>
            </CardTitle>
            <CardDescription>
              Launch limited digital editions and premium book collections backed by
              verified proof-of-authorship.
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="ac-glow rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl font-semibold">One ecosystem. Two ways in.</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Readers discover and collect verified books. Authors create, prove, and earn.
            Blockchain proves ownership; AI helps creators grow.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/explore" variant="primary">
              Explore ReaderChain
            </ButtonLink>
            <ButtonLink href="/dashboard" variant="secondary">
              Enter AuthorChain Studio
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

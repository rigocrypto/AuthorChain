import { ButtonLink } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { agents, previewAgents } from "@/lib/agents";

const agentCards = [
  ...agents.map((a) => ({ id: a.id, name: a.name, description: a.description })),
  ...previewAgents.map((a) => ({ id: a.id, name: a.name, description: a.description })),
];

const solution = [
  { t: "AI Agents", d: "Smart assistants to write, promote, and grow your book." },
  { t: "Instant Payments", d: "Get paid instantly in USDC or fiat via Stripe." },
  { t: "True Ownership", d: "Your book is tokenized — you own it. Earn on secondary sales." },
  { t: "Global & Easy", d: "Readers pay with card or crypto. No crypto needed to read." },
];

const steps = [
  { n: "1", t: "Author uploads", d: "Upload your book (PDF, EPUB, Audio)." },
  { n: "2", t: "AI agents activate", d: "Get content, launch plan, and insights." },
  { n: "3", t: "Publish & sell", d: "Sell to global readers in fiat or crypto." },
  { n: "4", t: "Earn & grow", d: "Get paid instantly. Build your community." },
];

const readerBenefits = [
  "Your purchase is your license",
  "Access anywhere, anytime",
  "Support authors directly",
  "Unlock exclusive content",
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="ac-hero-radial pointer-events-none absolute inset-0 opacity-60"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center">
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
            Built for authors · Powered by blockchain · Enhanced by AI
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="ac-gradient-text">Publish. Own. Earn. Grow.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            The AI-powered Web3 publishing platform for independent authors. Full control,
            faster payments, transparent royalties, and verifiable ownership.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3">
            <ButtonLink href="/dashboard" variant="primary">
              Start publishing
            </ButtonLink>
            <ButtonLink href="/dashboard/upload" variant="secondary">
              Upload a book
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {solution.map((f) => (
            <Card key={f.t}>
              <CardTitle>{f.t}</CardTitle>
              <CardDescription>{f.d}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

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

      {/* AI agents */}
      <section id="agents" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="text-2xl font-semibold">AI agents for authors</h2>
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

      {/* Readers */}
      <section id="readers" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold">You own more than a book</h2>
            <p className="mt-2 text-muted">
              Readers pay with card or crypto — no wallet required to read. Every purchase is
              a license you truly own.
            </p>
            <ul className="mt-6 space-y-2">
              {readerBenefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span className="text-accent">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="ac-glow rounded-2xl border border-border bg-surface p-8">
            <p className="text-sm text-muted">Reader experience</p>
            <p className="mt-1 text-xl font-semibold">Simple. Fast. Beautiful.</p>
            <div className="mt-6 flex gap-4">
              <div className="aspect-[2/3] w-24 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400" />
              <div>
                <div className="font-medium">The Quantum Prison</div>
                <div className="text-sm text-muted">by Rigo Vivas</div>
                <div className="mt-1 text-sm text-warning">★★★★★ (124)</div>
                <div className="mt-2 text-lg font-semibold">$9.99 USD</div>
                <p className="mt-2 text-xs text-muted">Pay with card or USDC — no wallet needed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="ac-glow rounded-2xl border border-border bg-surface p-10 text-center">
          <h2 className="text-2xl font-semibold">Own your publishing stack</h2>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Not here to replace Amazon — here to give creators the AI tools, instant payments,
            and ownership they deserve.
          </p>
          <div className="mt-6 flex justify-center">
            <ButtonLink href="/dashboard" variant="primary">
              Open the app
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}

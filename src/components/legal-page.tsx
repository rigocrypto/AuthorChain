import type { ReactNode } from "react";
import Link from "next/link";

/** Shared chrome for public legal / policy pages (header+footer come from layout). */
export function LegalPage({
  title,
  description,
  updated,
  children,
}: {
  title: string;
  description?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        <Link href="/" className="hover:underline">
          AuthorChain
        </Link>
        <span className="text-muted"> · Legal</span>
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>
      ) : null}
      {updated ? (
        <p className="mt-2 text-xs text-muted">Last updated: {updated}</p>
      ) : null}
      <div className="prose-legal mt-8 space-y-5 text-sm leading-relaxed text-muted sm:text-[15px]">
        {children}
      </div>
    </article>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 ps-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

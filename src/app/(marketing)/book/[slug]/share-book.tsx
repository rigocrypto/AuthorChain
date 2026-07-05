"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Reader-facing "Share this book" controls. Shares the public book page URL
 * (preserving any ?ref attribution already in the address bar). This is not the
 * author's private referral link — it's a plain share of the storefront page.
 */
export function ShareBook({ title }: { title: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Resolve the absolute URL client-side so it works on any host and keeps
    // any ?ref query already present in the address bar.
    setUrl(window.location.href);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  }

  const shareUrl = url || "";
  const text = `${title} — on AuthorChain`;
  const enc = encodeURIComponent;
  const socials: { label: string; href: string }[] = shareUrl
    ? [
        {
          label: "LinkedIn",
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`,
        },
        {
          label: "X",
          href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(shareUrl)}`,
        },
        {
          label: "WhatsApp",
          href: `https://wa.me/?text=${enc(`${text} ${shareUrl}`)}`,
        },
        {
          label: "Email",
          href: `mailto:?subject=${enc(title)}&body=${enc(`${text}\n${shareUrl}`)}`,
        },
      ]
    : [];

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Share this book
      </h2>
      <div className="mt-3 flex items-center gap-2 sm:max-w-md">
        <input
          readOnly
          value={shareUrl}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Book link"
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-foreground"
        />
        <Button type="button" variant="secondary" onClick={copy} className="whitespace-nowrap">
          {copied ? "Copied ✓" : "Copy link"}
        </Button>
      </div>
      {socials.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              {s.label}
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

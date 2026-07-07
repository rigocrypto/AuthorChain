"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "@/components/share-menu";
import { useI18n } from "@/i18n/provider";

/**
 * Reader-facing "Share this book" controls. Shares the public book page URL
 * (preserving any ?ref attribution already in the address bar). This is not the
 * author's private referral link — it's a plain share of the storefront page.
 */
export function ShareBook({ title }: { title: string }) {
  const { dict } = useI18n();
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Resolve the absolute URL client-side so it works on any host and keeps
    // any ?ref query already present in the address bar. Done in an effect (not
    // during render) so server and first client render match — no hydration
    // mismatch from reading window.location.
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        {dict.book.shareTitle}
      </h2>
      <div className="mt-3 flex items-center gap-2 sm:max-w-md">
        <input
          readOnly
          value={shareUrl}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={dict.book.bookLink}
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-foreground"
        />
        <Button type="button" variant="secondary" onClick={copy} className="whitespace-nowrap">
          {copied ? dict.common.copied : dict.common.copyLink}
        </Button>
        {shareUrl ? (
          <ShareMenu url={shareUrl} title={title} text={`${title} — on AuthorChain`} />
        ) : null}
      </div>
    </section>
  );
}

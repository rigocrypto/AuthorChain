"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Reusable "Share" control. On a click it opens the device's native share sheet
 * (Web Share API) when available — the OS panel where the user picks WhatsApp,
 * Messages, X, etc. When the browser has no Web Share API (most desktops), it
 * falls back to a popup menu of per-platform share links. Purely presentational:
 * shares a public URL, no tracking or private data here.
 */
export function ShareMenu({
  url,
  title,
  text,
  label,
  variant = "primary",
  className = "",
}: {
  url: string;
  title: string;
  text?: string;
  label?: string;
  variant?: Variant;
  className?: string;
}) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close the fallback menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shareText = text ?? `${title} — on AuthorChain`;

  async function handleShare() {
    // Prefer the native share sheet (mobile + modern desktop browsers).
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch (err) {
        // User dismissed the sheet — do nothing. Any other failure falls back
        // to the manual menu below.
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    setOpen((o) => !o);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — links above still work */
    }
  }

  const enc = encodeURIComponent;
  const targets: { label: string; href: string }[] = [
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${shareText} ${url}`)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(url)}` },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    { label: "Telegram", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(shareText)}` },
    {
      label: "Email",
      href: `mailto:?subject=${enc(title)}&body=${enc(`${shareText}\n${url}`)}`,
    },
  ];

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <Button
        type="button"
        variant={variant}
        onClick={handleShare}
        aria-haspopup="menu"
        aria-expanded={open}
        className="whitespace-nowrap"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {label ?? dict.common.share}
      </Button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
        >
          {targets.map((t) => (
            <a
              key={t.label}
              role="menuitem"
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2"
            >
              {t.label}
            </a>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="block w-full border-t border-border px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            {copied ? dict.common.copied : dict.common.copyLink}
          </button>
        </div>
      ) : null}
    </div>
  );
}

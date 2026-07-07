"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { locales, localeNames, localeShort, LOCALE_COOKIE, type Locale } from "@/i18n/config";

/**
 * Compact language selector. Persists the choice in a cookie and reloads so the
 * server re-renders every component in the new locale and the <html> lang/dir
 * update (needed for RTL). Stays on the current URL — no locale prefixes.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    // Persist the locale, then hard-reload so server components re-render and
    // <html> lang/dir update. This is a DOM write in an event handler, not a
    // render-time mutation.
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={dict.common.language}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
        </svg>
        <span className="font-medium">{localeShort[locale]}</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-xl"
        >
          {locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              onClick={() => choose(l)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-surface-2 ${
                l === locale ? "text-foreground" : "text-muted"
              }`}
            >
              {localeNames[l]}
              {l === locale ? <span aria-hidden className="text-accent">✓</span> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

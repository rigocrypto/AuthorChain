"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProofSeal } from "@/components/proof-seal";
import { useI18n } from "@/i18n/provider";
import { startCheckoutAction } from "./actions";

/**
 * Interactive cover + reader-preview modal for the public book page. The modal
 * embeds the PUBLIC reader-preview PDF (first pages only) via the browser's
 * native viewer — it never touches the private manuscript or its download route.
 */
export function BookPreview({
  bookId,
  slug,
  title,
  authorName,
  hasCover,
  coverColor,
  proofVerified,
  hasPreview,
  hasBackCover,
  price,
  currency,
  stripeReady,
  refCode,
}: {
  bookId: string;
  slug: string;
  title: string;
  authorName: string;
  hasCover: boolean;
  coverColor: string;
  proofVerified: boolean;
  hasPreview: boolean;
  hasBackCover: boolean;
  price: number;
  currency: string;
  stripeReady: boolean;
  refCode?: string;
}) {
  const { dict } = useI18n();
  const L = dict.book;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const cover = hasCover ? (
    // eslint-disable-next-line @next/next/no-img-element -- dynamic asset API
    <img
      src={`/api/assets/books/${bookId}/cover`}
      alt={title}
      className="aspect-[2/3] w-full rounded-xl border border-border object-cover"
      loading="eager"
      decoding="async"
    />
  ) : (
    <div
      className={`flex aspect-[2/3] w-full items-end rounded-xl bg-gradient-to-br ${coverColor} p-5`}
      role="img"
      aria-label={title}
    >
      <span className="text-2xl font-bold text-white drop-shadow">{title}</span>
    </div>
  );

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={L.previewBook}
          className="group block w-full cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
        >
          <span className="block transition-transform duration-300 group-hover:scale-[1.02]">
            {cover}
          </span>
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <span className="rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-black shadow">
              {L.previewBook ?? L.readerPreview}
            </span>
          </span>
        </button>
        {proofVerified ? (
          <ProofSeal
            variant="full"
            className="pointer-events-none absolute bottom-3 right-3 w-[38%] max-w-[120px] -rotate-6 drop-shadow-lg"
          />
        ) : null}
      </div>

      <Button variant="secondary" className="mt-3 w-full" onClick={() => setOpen(true)}>
        {L.previewFirstPages}
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={L.readerPreview}
        >
          <button
            type="button"
            aria-label={L.closePreview}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-border p-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{title}</h2>
                <p className="truncate text-sm text-muted">
                  {L.by} {authorName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={L.closePreview}
                className="rounded-lg px-2 py-1 text-lg text-muted hover:bg-surface-2 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-surface-2">
              {hasPreview ? (
                <iframe
                  src={`/api/assets/books/${bookId}/preview#view=FitH`}
                  title={`${title} — reader preview`}
                  className="h-[60vh] w-full border-0"
                />
              ) : !hasBackCover ? (
                <div className="flex h-[38vh] items-center justify-center p-8 text-center">
                  <div>
                    <p className="font-medium text-foreground">{L.previewComingSoon}</p>
                    <p className="mt-1 text-sm text-muted">{L.previewNotAdded}</p>
                  </div>
                </div>
              ) : null}
              {hasBackCover ? (
                <div className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                    {L.backCoverLabel}
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/assets/books/${bookId}/backcover`}
                    alt={L.backCoverLabel}
                    className="mx-auto max-h-[60vh] w-auto rounded-lg border border-border"
                  />
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
              <span className="text-xs text-muted">{L.freeSampleNote}</span>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  {L.backToBookPage}
                </Button>
                {stripeReady ? (
                  <form action={startCheckoutAction}>
                    <input type="hidden" name="slug" value={slug} />
                    {refCode ? <input type="hidden" name="ref" value={refCode} /> : null}
                    <Button type="submit">
                      {L.buyThisBook} · ${price.toFixed(2)} {currency}
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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
  coverMimeType,
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
  coverMimeType: string | null;
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
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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

  const coverSrc = `/api/assets/books/${bookId}/cover`;
  const coverIsVideo = coverMimeType?.startsWith("video/") ?? false;
  const isFeaturedBook = [
    "the-quantum-purgatory",
    "the-ultimate-ai-prompts-playbook",
  ].includes(slug.toLowerCase());

  function toggleAudio(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    const nextEnabled = !audioEnabled;
    setAudioEnabled(nextEnabled);
    video.muted = !nextEnabled;
    void video.play().catch(() => undefined);
  }

  const cover = hasCover && coverIsVideo ? (
    <>
      <video
        ref={videoRef}
        src={coverSrc}
        className="aspect-[2/3] w-full rounded-xl border border-border object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label={title}
      >
        Your browser does not support HTML5 video.
      </video>
      <div
        className={`hidden aspect-[2/3] w-full items-end rounded-xl border border-border bg-gradient-to-br ${coverColor} p-5 motion-reduce:flex`}
        role="img"
        aria-label={title}
      >
        <span className="text-2xl font-bold text-white drop-shadow">{title}</span>
      </div>
    </>
  ) : hasCover ? (
    // eslint-disable-next-line @next/next/no-img-element -- dynamic asset API
    <img
      src={coverSrc}
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
      <div
        className={`relative overflow-hidden rounded-xl border bg-surface ${
          isFeaturedBook
            ? "border-amber-300/95 shadow-[0_0_0_2px_rgba(251,191,36,0.62),0_0_28px_-6px_rgba(250,204,21,0.85),0_30px_62px_-30px_rgba(234,179,8,0.95)]"
            : "border-sky-300/55 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]"
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-[5px] z-10 rounded-[0.7rem] border ${
            isFeaturedBook ? "border-amber-200/90" : "border-sky-200/45"
          }`}
        />
        {isFeaturedBook ? (
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1 z-20 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.95)] sm:top-2 sm:h-3 sm:w-3 sm:shadow-[0_0_18px_rgba(252,211,77,1)]"
          />
        ) : null}
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
        {hasCover && coverIsVideo ? (
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={audioEnabled ? "Mute cover video" : "Enable cover video sound"}
            className="cover-sound-toggle absolute right-2 top-2 z-30 inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-200/60 bg-black/65 text-white transition hover:border-sky-300"
          >
            {audioEnabled ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 6a9 9 0 0 1 0 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
        ) : null}
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
          <div className="relative z-10 flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-surface p-4">
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
                  className="h-[min(68vh,calc(100dvh-16rem))] w-full border-0"
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

            <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface p-4">
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

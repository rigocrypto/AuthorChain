"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { PublishedBookDTO } from "@/lib/data/books";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProofSeal } from "@/components/proof-seal";

/**
 * Public book card for ReaderChain discovery + homepage featured. Links to the
 * existing /book/[slug] detail page (which owns the buy flow). Shows a cover
 * (served through the controlled asset route) or a gradient fallback, and a
 * verified-proof badge when the book has an on-chain proof.
 */
export function PublishedBookCard({
  book,
  priority = false,
  featured = false,
  byLabel = "by",
  verifiedProofLabel = "✓ Verified proof",
  openBookLabel = "Open book →",
}: {
  book: PublishedBookDTO;
  /** Eager-load the cover when the card is above the fold (e.g. first row). */
  priority?: boolean;
  /** Highlight featured books with a premium frame. */
  featured?: boolean;
  byLabel?: string;
  verifiedProofLabel?: string;
  openBookLabel?: string;
}) {
  const coverSrc = `/api/assets/books/${book.id}/cover`;
  const coverIsVideo = book.coverMimeType?.startsWith("video/") ?? false;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  function handleCoverEnter() {
    const video = videoRef.current;
    if (!video) return;

    // Keep playback alive; then attempt to unmute on hover.
    const ensurePlaying = video.paused
      ? video.play().catch(() => undefined)
      : Promise.resolve();

    void ensurePlaying.then(() => {
      video.muted = false;
      return video.play().catch(() => {
        // Browsers may block hover-initiated audio; keep video playing muted.
        video.muted = true;
        return video.play().catch(() => undefined);
      });
    });
  }

  function handleCoverLeave() {
    const video = videoRef.current;
    if (!video) return;
    if (!audioEnabled) {
      video.muted = true;
    }
  }

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

  return (
    <Link
      href={`/book/${book.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors hover:border-primary/60 ${
        featured
          ? "border-amber-300/90 shadow-[0_0_0_2px_rgba(251,191,36,0.5),0_26px_55px_-28px_rgba(251,191,36,0.95)]"
          : "border-sky-300/70 shadow-[0_0_0_1px_rgba(56,189,248,0.35)]"
      }`}
    >
      {
        <>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-[5px] z-10 rounded-[0.7rem] border ${
              featured ? "border-amber-200/70" : "border-sky-200/55"
            }`}
          />
          {featured ? (
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-2 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,0.9)]"
            />
          ) : null}
        </>
      }
      <div className="relative" onMouseEnter={handleCoverEnter} onMouseLeave={handleCoverLeave}>
        {book.hasCover && coverIsVideo ? (
          <>
            <video
              ref={videoRef}
              src={coverSrc}
              className="aspect-[2/3] w-full border-b border-border object-cover motion-reduce:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload={priority ? "auto" : "metadata"}
              aria-label={book.title}
            >
              Your browser does not support HTML5 video.
            </video>
            <button
              type="button"
              onClick={toggleAudio}
              aria-label={audioEnabled ? "Mute cover video" : "Enable cover video sound"}
              className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-sky-200/60 bg-black/65 text-white transition hover:border-sky-300"
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
            <div
              className={`hidden aspect-[2/3] w-full items-end border-b border-border bg-gradient-to-br ${book.coverColor} p-4 motion-reduce:flex`}
              role="img"
              aria-label={book.title}
            >
              <span className="text-lg font-semibold text-white drop-shadow">{book.title}</span>
            </div>
          </>
        ) : book.hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic asset API
          <img
            src={coverSrc}
            alt={book.title}
            className="aspect-[2/3] w-full border-b border-border object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div
            className={`flex aspect-[2/3] w-full items-end bg-gradient-to-br ${book.coverColor} p-4`}
            role="img"
            aria-label={book.title}
          >
            <span className="text-lg font-semibold text-white drop-shadow">{book.title}</span>
          </div>
        )}
        {book.proofVerified ? (
          <ProofSeal
            variant="compact"
            className={`absolute bottom-2 right-2 -rotate-6 drop-shadow-md ${
              featured ? "w-[36%] max-w-[84px]" : "w-[30%] max-w-[64px]"
            }`}
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-muted">{book.category}</span>
          {book.proofVerified ? (
            <StatusBadge tone="accent">{verifiedProofLabel}</StatusBadge>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 font-semibold text-foreground">{book.title}</h3>
        <p className="text-sm text-muted">
          {byLabel} {book.authorName}
        </p>
        <div className="mt-3 flex items-center justify-between pt-1">
          <span className="font-semibold">${book.price.toFixed(2)}</span>
          <span className="text-sm text-accent group-hover:underline">{openBookLabel}</span>
        </div>
      </div>
    </Link>
  );
}

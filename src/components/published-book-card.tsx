"use client";

import Link from "next/link";
import { useRef } from "react";
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

  function handleCoverEnter() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
  }

  function handleCoverLeave() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
  }

  return (
    <Link
      href={`/book/${book.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors hover:border-primary/60 ${
        featured
          ? "border-amber-300/90 shadow-[0_0_0_2px_rgba(251,191,36,0.5),0_26px_55px_-28px_rgba(251,191,36,0.95)]"
          : "border-amber-300/45 shadow-[0_0_0_1px_rgba(251,191,36,0.2)]"
      }`}
    >
      {
        <>
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-[5px] z-10 rounded-[0.7rem] border ${
              featured ? "border-amber-200/70" : "border-amber-200/40"
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

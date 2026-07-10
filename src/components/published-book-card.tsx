import Link from "next/link";
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
  byLabel = "by",
  verifiedProofLabel = "✓ Verified proof",
  openBookLabel = "Open book →",
}: {
  book: PublishedBookDTO;
  /** Eager-load the cover when the card is above the fold (e.g. first row). */
  priority?: boolean;
  byLabel?: string;
  verifiedProofLabel?: string;
  openBookLabel?: string;
}) {
  return (
    <Link
      href={`/book/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/60"
    >
      <div className="relative">
        {book.hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic asset API
          <img
            src={`/api/assets/books/${book.id}/cover`}
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
            className="absolute bottom-2 right-2 w-[30%] max-w-[64px] -rotate-6 drop-shadow-md"
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

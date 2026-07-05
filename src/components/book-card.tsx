import Link from "next/link";
import type { BookDTO } from "@/lib/data/books";
import { BookStatusBadge } from "@/components/ui/status-badge";

/**
 * Compact book card for the author dashboard's My Books view. Clicking it opens
 * the author manage page (`/dashboard/books/[id]`) — not the public storefront —
 * so it works for drafts too (drafts have no public `/book/[slug]` page yet).
 * Public discovery uses `PublishedBookCard` instead.
 */
export function BookCard({ book }: { book: BookDTO }) {
  return (
    <Link
      href={`/dashboard/books/${book.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-primary/60"
    >
      {book.hasCover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/api/assets/books/${book.id}/cover`}
          alt={`${book.title} cover`}
          className="aspect-[2/3] w-full border-b border-border object-cover"
        />
      ) : (
        <div
          className={`flex aspect-[2/3] w-full items-end bg-gradient-to-br ${book.coverColor} p-4`}
        >
          <span className="text-lg font-semibold text-white drop-shadow">{book.title}</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted">{book.category}</span>
          <BookStatusBadge status={book.status} />
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted">{book.description}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-semibold">${book.price.toFixed(2)}</span>
          <span className="text-muted">
            {book.unitsSold} sold · {book.earningsUsdc} USDC
          </span>
        </div>
      </div>
    </Link>
  );
}

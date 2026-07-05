import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { BookCard } from "@/components/book-card";
import { BookActionButton } from "@/components/dashboard/book-actions";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOptionalAuthor } from "@/lib/auth/session";
import { listAuthorBooks, type BookDTO } from "@/lib/data/books";
import {
  publishBookAction,
  unpublishBookAction,
  archiveBookAction,
  restoreBookAction,
} from "@/app/dashboard/actions";

export const metadata: Metadata = { title: "My books" };
export const dynamic = "force-dynamic";

const TABS = [
  { key: "active", label: "Active" },
  { key: "draft", label: "Drafts" },
  { key: "published", label: "Published" },
  { key: "archived", label: "Archived" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

function filterBooks(books: BookDTO[], tab: TabKey): BookDTO[] {
  switch (tab) {
    case "draft":
      return books.filter((b) => !b.archivedAt && b.status === "DRAFT");
    case "published":
      return books.filter((b) => !b.archivedAt && b.status === "PUBLISHED");
    case "archived":
      return books.filter((b) => b.archivedAt);
    case "active":
    default:
      return books.filter((b) => !b.archivedAt);
  }
}

export default async function MyBooksPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Layout guard owns the unauthenticated redirect; bail quietly to avoid a
  // redundant "Unauthorized" throw during parallel render.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const { tab: tabParam } = await searchParams;
  const tab: TabKey =
    TABS.find((t) => t.key === tabParam)?.key ?? "active";

  const books = await listAuthorBooks(author.id);
  const counts: Record<TabKey, number> = {
    active: filterBooks(books, "active").length,
    draft: filterBooks(books, "draft").length,
    published: filterBooks(books, "published").length,
    archived: filterBooks(books, "archived").length,
  };
  const shown = filterBooks(books, tab);

  return (
    <DashboardPage
      title="My books"
      actions={<ButtonLink href="/dashboard/upload">Upload book</ButtonLink>}
    >
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <Link
              key={t.key}
              href={t.key === "active" ? "/dashboard/books" : `/dashboard/books?tab=${t.key}`}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-primary/60 bg-surface-2 text-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-xs text-muted">{counts[t.key]}</span>
            </Link>
          );
        })}
      </div>

      {books.length === 0 ? (
        <Card className="text-center">
          <p className="text-foreground">You haven&apos;t added any books yet.</p>
          <p className="mt-1 text-sm text-muted">
            Upload your first manuscript to start generating marketing and selling.
          </p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href="/dashboard/upload" variant="secondary">
              Upload your first book
            </ButtonLink>
          </div>
        </Card>
      ) : shown.length === 0 ? (
        <Card className="text-center">
          <p className="text-sm text-muted">No {tab} books.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((book) => {
            const archived = Boolean(book.archivedAt);
            return (
              <div key={book.id} className="space-y-2">
                <div className="relative">
                  <BookCard book={book} />
                  {archived ? (
                    <span className="absolute right-2 top-2">
                      <StatusBadge tone="muted">Archived</StatusBadge>
                    </span>
                  ) : null}
                </div>

                <Link
                  href={`/dashboard/books/${book.id}`}
                  className="block text-center text-sm text-accent hover:underline"
                >
                  Manage &amp; register proof →
                </Link>

                {/* Visibility actions */}
                <div className="flex flex-wrap gap-2">
                  {archived ? (
                    <BookActionButton
                      action={restoreBookAction}
                      bookId={book.id}
                      label="Restore"
                      className="flex-1"
                    />
                  ) : (
                    <>
                      {book.status === "DRAFT" ? (
                        <BookActionButton
                          action={publishBookAction}
                          bookId={book.id}
                          label="Publish"
                          className="flex-1"
                        />
                      ) : (
                        <BookActionButton
                          action={unpublishBookAction}
                          bookId={book.id}
                          label="Unpublish"
                          confirmText="Unpublish this book? It will be removed from ReaderChain and the public storefront."
                          className="flex-1"
                        />
                      )}
                      <BookActionButton
                        action={archiveBookAction}
                        bookId={book.id}
                        label="Archive"
                        confirmText="Archive this book? It will be hidden from your active dashboard list and from public pages. Files, proof, and sales are kept."
                        variant="ghost"
                        className="flex-1"
                      />
                    </>
                  )}
                </div>

                {book.status === "PUBLISHED" && !archived ? (
                  <Link
                    href={`/book/${book.slug}`}
                    className="block text-center text-xs text-muted hover:text-foreground"
                  >
                    View public page →
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </DashboardPage>
  );
}

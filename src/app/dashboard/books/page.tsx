import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { BookCard } from "@/components/book-card";
import { BookActionButton } from "@/components/dashboard/book-actions";
import { MyBooksSwipeRow } from "@/components/dashboard/my-books-swipe-row";
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
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "My books" };
export const dynamic = "force-dynamic";

const TABS = [
  { key: "active" },
  { key: "draft" },
  { key: "published" },
  { key: "archived" },
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

  const { dict } = await getDictionary();
  const d = dict.dashboard;
  const tabLabel: Record<TabKey, string> = {
    active: d.tabActive,
    draft: d.tabDrafts,
    published: d.tabPublished,
    archived: d.tabArchived,
  };

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

  function renderBookItem(book: BookDTO) {
    const archived = Boolean(book.archivedAt);
    return (
      <>
        <div className="relative">
          <BookCard book={book} />
          {archived ? (
            <span className="absolute right-2 top-2">
              <StatusBadge tone="muted">{d.archivedBadge}</StatusBadge>
            </span>
          ) : null}
        </div>

        <Link
          href={`/dashboard/books/${book.id}`}
          className="block text-center text-sm text-accent hover:underline"
        >
          {d.manageRegister}
        </Link>

        {/* Visibility actions */}
        <div className="flex flex-wrap gap-2">
          {archived ? (
            <BookActionButton
              action={restoreBookAction}
              bookId={book.id}
              label={d.restore}
              className="flex-1"
            />
          ) : (
            <>
              {book.status === "DRAFT" ? (
                <BookActionButton
                  action={publishBookAction}
                  bookId={book.id}
                  label={d.publish}
                  className="flex-1"
                />
              ) : (
                <BookActionButton
                  action={unpublishBookAction}
                  bookId={book.id}
                  label={d.unpublish}
                  confirmText={d.confirmUnpublish}
                  className="flex-1"
                />
              )}
              <BookActionButton
                action={archiveBookAction}
                bookId={book.id}
                label={d.archive}
                confirmText={d.confirmArchive}
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
            {d.viewPublicPage}
          </Link>
        ) : null}
      </>
    );
  }

  return (
    <DashboardPage
      title={d.titleMyBooks}
      actions={<ButtonLink href="/dashboard/upload">{d.uploadBook}</ButtonLink>}
    >
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tabItem) => {
          const active = tabItem.key === tab;
          return (
            <Link
              key={tabItem.key}
              href={
                tabItem.key === "active"
                  ? "/dashboard/books"
                  : `/dashboard/books?tab=${tabItem.key}`
              }
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-primary/60 bg-surface-2 text-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {tabLabel[tabItem.key]}
              <span className="ml-1.5 text-xs text-muted">{counts[tabItem.key]}</span>
            </Link>
          );
        })}
      </div>

      {books.length === 0 ? (
        <Card className="text-center">
          <p className="text-foreground">{d.noBooksYet}</p>
          <p className="mt-1 text-sm text-muted">{d.noBooksYetDesc}</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href="/dashboard/upload" variant="secondary">
              {d.uploadFirstBook}
            </ButtonLink>
          </div>
        </Card>
      ) : shown.length === 0 ? (
        <Card className="text-center">
          <p className="text-sm text-muted">{d.noBooksInView}</p>
        </Card>
      ) : (
        <>
          <div className="lg:hidden">
            <MyBooksSwipeRow>
              {shown.map((book) => (
                <div
                  key={book.id}
                  data-book-item="true"
                  className="w-[86vw] max-w-[24rem] shrink-0 snap-start space-y-2 sm:w-[22rem]"
                >
                  {renderBookItem(book)}
                </div>
              ))}
            </MyBooksSwipeRow>
          </div>

          <div className="hidden gap-4 lg:grid lg:grid-cols-3">
            {shown.map((book) => (
              <div key={book.id} className="space-y-2">
                {renderBookItem(book)}
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardPage>
  );
}

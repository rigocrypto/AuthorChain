import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { BookCard } from "@/components/book-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getOptionalAuthor } from "@/lib/auth/session";
import { listAuthorBooks } from "@/lib/data/books";
import { publishBookAction } from "@/app/dashboard/actions";

export const metadata: Metadata = { title: "My books" };
export const dynamic = "force-dynamic";

export default async function MyBooksPage() {
  // Layout guard owns the unauthenticated redirect; bail quietly to avoid a
  // redundant "Unauthorized" throw during parallel render.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const books = await listAuthorBooks(author.id);

  return (
    <DashboardPage
      title="My books"
      actions={<ButtonLink href="/dashboard/upload">Upload book</ButtonLink>}
    >
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div key={book.id} className="space-y-2">
              <BookCard book={book} />
              {book.status === "DRAFT" ? (
                <form action={publishBookAction}>
                  <input type="hidden" name="bookId" value={book.id} />
                  <Button type="submit" variant="secondary" className="w-full">
                    Publish
                  </Button>
                </form>
              ) : null}
              <Link
                href={`/dashboard/books/${book.id}`}
                className="block text-center text-sm text-accent hover:underline"
              >
                Manage &amp; register proof →
              </Link>
              {book.status === "PUBLISHED" ? (
                <Link
                  href={`/book/${book.slug}`}
                  className="block text-center text-xs text-muted hover:text-foreground"
                >
                  View public page →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </DashboardPage>
  );
}

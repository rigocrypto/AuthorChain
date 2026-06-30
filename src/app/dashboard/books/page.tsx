import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { BookCard } from "@/components/book-card";
import { ButtonLink } from "@/components/ui/button";
import { mockBooks } from "@/lib/mock-data";

export const metadata: Metadata = { title: "My books" };

export default function MyBooksPage() {
  return (
    <DashboardPage
      title="My books"
      actions={<ButtonLink href="/dashboard/upload">Upload book</ButtonLink>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </DashboardPage>
  );
}

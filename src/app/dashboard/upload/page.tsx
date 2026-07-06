import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ButtonLink } from "@/components/ui/button";
import { UploadBookForm } from "@/components/upload-book-form";

export const metadata: Metadata = { title: "Register a book" };
export const dynamic = "force-dynamic";

export default function UploadBookPage() {
  return (
    <DashboardPage
      title="Register a book"
      actions={
        <>
          <ButtonLink href="/dashboard" variant="ghost">
            Dashboard
          </ButtonLink>
          <ButtonLink href="/dashboard/books" variant="ghost">
            ← My Books
          </ButtonLink>
        </>
      }
    >
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Start with your book&apos;s details. It saves as a <strong>draft</strong>, then
        you&apos;ll continue on the book&apos;s page to upload the manuscript, add a cover,
        and register on-chain proof. You can publish it from <em>My Books</em> anytime.
      </p>
      <div className="max-w-2xl">
        <UploadBookForm />
        <div className="mt-6">
          <ButtonLink href="/dashboard/books" variant="ghost">
            ← Back to My Books
          </ButtonLink>
        </div>
      </div>
    </DashboardPage>
  );
}

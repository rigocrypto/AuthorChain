import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { UploadBookForm } from "@/components/upload-book-form";

export const metadata: Metadata = { title: "Upload book" };
export const dynamic = "force-dynamic";

export default function UploadBookPage() {
  return (
    <DashboardPage title="Upload a book">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Add your book&apos;s metadata. It saves as a <strong>draft</strong> you can publish
        from <em>My Books</em>. Files stay off-chain; the manuscript upload + storage driver
        arrive in a later phase.
      </p>
      <div className="max-w-2xl">
        <UploadBookForm />
      </div>
    </DashboardPage>
  );
}

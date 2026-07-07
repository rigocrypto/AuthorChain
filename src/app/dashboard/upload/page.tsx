import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ButtonLink } from "@/components/ui/button";
import { UploadBookForm } from "@/components/upload-book-form";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "Register a book" };
export const dynamic = "force-dynamic";

export default async function UploadBookPage() {
  const { dict } = await getDictionary();

  return (
    <DashboardPage
      title={dict.dashboard.titleUpload}
      actions={
        <>
          <ButtonLink href="/dashboard" variant="ghost">
            {dict.nav.dashboard}
          </ButtonLink>
          <ButtonLink href="/dashboard/books" variant="ghost">
            {dict.nav.backToMyBooks}
          </ButtonLink>
        </>
      }
    >
      <p className="mb-6 max-w-2xl text-sm text-muted">{dict.dashboard.uploadIntro}</p>
      <div className="max-w-2xl">
        <UploadBookForm />
        <div className="mt-6">
          <ButtonLink href="/dashboard/books" variant="ghost">
            {dict.nav.backToMyBooks}
          </ButtonLink>
        </div>
      </div>
    </DashboardPage>
  );
}

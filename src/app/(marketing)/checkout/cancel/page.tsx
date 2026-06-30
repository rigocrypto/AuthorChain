import type { Metadata } from "next";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment canceled" };
export const dynamic = "force-dynamic";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ book?: string }>;
}) {
  const { book } = await searchParams;
  const backHref = book ? `/book/${book}` : "/";

  return (
    <PageShell>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-2xl text-muted">
          ×
        </div>
        <h1 className="mt-6 text-3xl font-bold">Payment canceled</h1>
        <p className="mt-3 text-muted">
          No charge was made. You can pick up right where you left off whenever
          you’re ready.
        </p>

        <Card className="mt-8 text-left">
          <CardTitle>Changed your mind?</CardTitle>
          <CardDescription>
            Your cart wasn’t saved, but the book is still available. Head back to
            try again.
          </CardDescription>
        </Card>

        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href={backHref}>
            {book ? "Back to book" : "Back to marketplace"}
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment successful" };
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold">Payment successful</h1>
        <p className="mt-3 text-muted">
          Thank you for supporting independent authors. Your purchase is
          confirmed and the author has been credited.
        </p>

        <Card className="mt-8 text-left">
          <CardTitle>What happens next</CardTitle>
          <CardDescription>
            Reader library access — where you’ll download and read your books —
            arrives in Phase 2. We’ll email you as soon as it’s ready.
          </CardDescription>
          {session_id ? (
            <p className="mt-4 break-all font-mono text-xs text-muted">
              Order reference: {session_id}
            </p>
          ) : null}
        </Card>

        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/">Back to marketplace</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}

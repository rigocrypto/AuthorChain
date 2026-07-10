import type { Metadata } from "next";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.checkout.successMetaTitle };
}
export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { dict } = await getDictionary();
  const { session_id } = await searchParams;
  const t = dict.checkout;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold">{t.successTitle}</h1>
        <p className="mt-3 text-muted">{t.successDesc}</p>

        <Card className="mt-8 text-left">
          <CardTitle>{t.accessGrantedTitle}</CardTitle>
          <CardDescription>{t.accessGrantedDesc}</CardDescription>
          {session_id ? (
            <p className="mt-4 break-all font-mono text-xs text-muted">
              {t.orderReference}: {session_id}
            </p>
          ) : null}
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/reader/library">{t.goToLibrary}</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            {t.backToMarketplace}
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}

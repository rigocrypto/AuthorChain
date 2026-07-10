import type { Metadata } from "next";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.checkout.cancelMetaTitle };
}
export const dynamic = "force-dynamic";

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ book?: string }>;
}) {
  const { dict } = await getDictionary();
  const { book } = await searchParams;
  const backHref = book ? `/book/${book}` : "/";
  const t = dict.checkout;

  return (
    <PageShell>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-2xl text-muted">
          ×
        </div>
        <h1 className="mt-6 text-3xl font-bold">{t.cancelTitle}</h1>
        <p className="mt-3 text-muted">{t.cancelDesc}</p>

        <Card className="mt-8 text-left">
          <CardTitle>{t.changedMindTitle}</CardTitle>
          <CardDescription>{t.changedMindDesc}</CardDescription>
        </Card>

        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href={backHref}>{book ? t.backToBook : t.backToMarketplace}</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}

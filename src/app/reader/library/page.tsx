import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ProofSeal } from "@/components/proof-seal";
import { getCurrentReader } from "@/lib/auth/reader-session";
import { listReaderLibrary } from "@/lib/data/reader";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.reader.metaLibraryTitle };
}
export const dynamic = "force-dynamic";

function accessBadge(status: string, labels: { active: string; refunded: string; revoked: string }) {
  if (status === "ACTIVE") return <StatusBadge tone="success">{labels.active}</StatusBadge>;
  if (status === "REFUNDED") return <StatusBadge tone="muted">{labels.refunded}</StatusBadge>;
  return <StatusBadge tone="warning">{labels.revoked}</StatusBadge>;
}

export default async function ReaderLibraryPage() {
  const { dict } = await getDictionary();
  const reader = await getCurrentReader();

  if (!reader) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold">{dict.reader.libraryTitle}</h1>
          <p className="mt-3 text-muted">{dict.reader.noBooksDesc}</p>
          <div className="mt-6">
            <ButtonLink href="/explore">{dict.reader.explore}</ButtonLink>
          </div>
        </div>
      </PageShell>
    );
  }

  const items = await listReaderLibrary(reader.id);

  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">{dict.reader.libraryTitle}</h1>
      <p className="mt-1 text-sm text-muted">
        {dict.reader.signedInAs} {reader.email} ·{" "}
        {items.length === 1
          ? dict.reader.purchasedBooksCountOne
          : dict.reader.purchasedBooksCountMany.replace("{count}", String(items.length))}
      </p>

      {items.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="text-foreground">{dict.reader.noBooksTitle}</p>
          <p className="mt-1 text-sm text-muted">{dict.reader.noBooksDesc}</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href="/explore" variant="secondary">
              {dict.reader.explore}
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <Card key={b.bookId} className="flex flex-col">
              <div className="relative">
                {b.hasCover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/assets/books/${b.bookId}/cover`}
                    alt={`${b.title} cover`}
                    className="aspect-[2/3] w-full rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div
                    className={`flex aspect-[2/3] w-full items-end rounded-lg bg-gradient-to-br ${b.coverColor} p-3`}
                  >
                    <span className="text-sm font-bold text-white drop-shadow">{b.title}</span>
                  </div>
                )}
                {b.proofVerified ? (
                  <ProofSeal
                    variant="compact"
                    className="absolute bottom-2 right-2 w-[28%] max-w-[60px] -rotate-6 drop-shadow-md"
                  />
                ) : null}
              </div>
              <CardTitle>{b.title}</CardTitle>
              <p className="text-sm text-muted">
                {dict.book.by} {b.authorName}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                {accessBadge(b.accessStatus, {
                  active: dict.reader.accessActive,
                  refunded: dict.reader.accessRefunded,
                  revoked: dict.reader.accessRevoked,
                })}
                {b.proofVerified ? (
                  <StatusBadge tone="accent">{dict.common.verifiedProof}</StatusBadge>
                ) : null}
                <span>· {b.purchaseDate.slice(0, 10)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/reader/books/${b.bookId}`}
                  className="text-sm text-accent hover:underline"
                >
                  {dict.reader.details}
                </Link>
                {b.accessStatus === "ACTIVE" ? (
                  <a
                    href={`/api/reader/books/${b.bookId}/download`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    {dict.reader.download}
                  </a>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}

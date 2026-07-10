import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentReader } from "@/lib/auth/reader-session";
import { getReaderBook } from "@/lib/data/reader";
import { getExplorerTxUrl, getExplorerAddressUrl } from "@/lib/blockchain/registry";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getDictionary();
  return { title: dict.reader.metaBookTitle };
}
export const dynamic = "force-dynamic";

export default async function ReaderBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const { dict } = await getDictionary();
  const reader = await getCurrentReader();
  if (!reader) notFound();

  const book = await getReaderBook(reader.id, bookId);
  if (!book) notFound();

  const isActive = book.accessStatus === "ACTIVE";
  const localizedAccessStatus =
    book.accessStatus === "REFUNDED"
      ? dict.reader.accessRefunded
      : book.accessStatus === "REVOKED"
      ? dict.reader.accessRevoked
      : dict.reader.accessActive;

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {book.hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/assets/books/${book.bookId}/cover`}
            alt={`${book.title} cover`}
            className="aspect-[2/3] w-full rounded-xl border border-border object-cover"
          />
        ) : (
          <div
            className={`flex aspect-[2/3] w-full items-end rounded-xl bg-gradient-to-br ${book.coverColor} p-5`}
          >
            <span className="text-2xl font-bold text-white drop-shadow">{book.title}</span>
          </div>
        )}

        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {dict.book.by} {book.authorName}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted">{dict.reader.access}</span>
            {isActive ? (
              <StatusBadge tone="success">{dict.reader.accessActive}</StatusBadge>
            ) : (
              <StatusBadge tone="warning">{localizedAccessStatus}</StatusBadge>
            )}
          </div>

          <Card className="mt-6 max-w-sm">
            <CardTitle>{dict.reader.readTitle}</CardTitle>
            {isActive ? (
              <>
                <p className="mt-1 text-sm text-muted">
                  {dict.reader.readPrivateNote}
                </p>
                <div className="mt-4">
                  <ButtonLink href={`/api/reader/books/${book.bookId}/download`}>
                    {dict.reader.downloadManuscript}
                  </ButtonLink>
                </div>
              </>
            ) : (
              <p className="mt-1 text-sm text-warning">
                {dict.reader.accessState} {localizedAccessStatus.toLowerCase()}.
              </p>
            )}
            <p className="mt-3 text-xs text-muted">
              {dict.reader.browserReaderLater}
            </p>
          </Card>

          {book.registration ? (
            <Card className="mt-4 max-w-sm">
              <CardTitle>{dict.reader.proofTitle}</CardTitle>
              <p className="mt-1 text-xs text-muted">
                {dict.reader.proofDesc}
              </p>
              <dl className="mt-3 space-y-2 text-xs">
                {book.registration.contractAddress ? (
                  <div>
                    <dt className="text-muted">{dict.reader.contract}</dt>
                    <dd className="mt-0.5 break-all font-mono">
                      <a
                        href={getExplorerAddressUrl(book.registration.contractAddress)}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {book.registration.contractAddress}
                      </a>
                    </dd>
                  </div>
                ) : null}
                {book.registration.transactionHash ? (
                  <div>
                    <dt className="text-muted">{dict.reader.transaction}</dt>
                    <dd className="mt-0.5 break-all font-mono">
                      <a
                        href={getExplorerTxUrl(book.registration.transactionHash)}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        {book.registration.transactionHash}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </Card>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentReader } from "@/lib/auth/reader-session";
import { listReaderLibrary } from "@/lib/data/reader";

export const metadata: Metadata = { title: "My ReaderChain Library" };
export const dynamic = "force-dynamic";

function accessBadge(status: string) {
  if (status === "ACTIVE") return <StatusBadge tone="success">Active</StatusBadge>;
  if (status === "REFUNDED") return <StatusBadge tone="muted">Refunded</StatusBadge>;
  return <StatusBadge tone="warning">Revoked</StatusBadge>;
}

export default async function ReaderLibraryPage() {
  const reader = await getCurrentReader();

  if (!reader) {
    return (
      <PageShell>
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-bold">My ReaderChain Library</h1>
          <p className="mt-3 text-muted">
            You do not have any books in your ReaderChain Library yet. Access is granted
            right after you buy a book — complete a purchase and you&apos;ll land here
            automatically with your books ready to read.
          </p>
          <div className="mt-6">
            <ButtonLink href="/explore">Explore ReaderChain</ButtonLink>
          </div>
        </div>
      </PageShell>
    );
  }

  const items = await listReaderLibrary(reader.id);

  return (
    <PageShell>
      <h1 className="text-2xl font-bold tracking-tight">My ReaderChain Library</h1>
      <p className="mt-1 text-sm text-muted">
        Signed in as {reader.email} · {items.length} purchased book
        {items.length === 1 ? "" : "s"}
      </p>

      {items.length === 0 ? (
        <Card className="mt-6 text-center">
          <p className="text-foreground">
            You do not have any books in your ReaderChain Library yet.
          </p>
          <p className="mt-1 text-sm text-muted">Your purchases will appear here.</p>
          <div className="mt-4 flex justify-center">
            <ButtonLink href="/explore" variant="secondary">
              Explore ReaderChain
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <Card key={b.bookId} className="flex flex-col">
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
              <CardTitle>{b.title}</CardTitle>
              <p className="text-sm text-muted">by {b.authorName}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                {accessBadge(b.accessStatus)}
                {b.proofVerified ? (
                  <StatusBadge tone="accent">✓ Verified proof</StatusBadge>
                ) : null}
                <span>· {b.purchaseDate.slice(0, 10)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Link
                  href={`/reader/books/${b.bookId}`}
                  className="text-sm text-accent hover:underline"
                >
                  Details →
                </Link>
                {b.accessStatus === "ACTIVE" ? (
                  <a
                    href={`/api/reader/books/${b.bookId}/download`}
                    className="text-sm font-medium text-accent hover:underline"
                  >
                    Download
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

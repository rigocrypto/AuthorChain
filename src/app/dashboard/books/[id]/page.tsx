import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAuthor } from "@/lib/auth/session";
import { getAuthorBookById } from "@/lib/data/books";
import { getRegistrationForBook } from "@/lib/data/registrations";
import { bookRegistrationHash } from "@/lib/blockchain/book-hash";
import {
  isRegistryConfigured,
  getChainConfig,
  getExplorerTxUrl,
  getExplorerAddressUrl,
} from "@/lib/blockchain/registry";
import { registerProofAction } from "./actions";

export const metadata: Metadata = { title: "Book details" };
export const dynamic = "force-dynamic";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function statusBadge(status: string | undefined) {
  if (status === "REGISTERED") return <StatusBadge tone="success">On-chain</StatusBadge>;
  if (status === "PENDING") return <StatusBadge tone="warning">Pending</StatusBadge>;
  if (status === "FAILED") return <StatusBadge tone="warning">Failed</StatusBadge>;
  return <StatusBadge tone="muted">Not registered</StatusBadge>;
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const author = await getCurrentAuthor();
  const book = await getAuthorBookById(id, author.id);
  if (!book) notFound();

  const registration = await getRegistrationForBook(id);
  const proofHash = bookRegistrationHash(book);
  const registryReady = isRegistryConfigured();
  const hasWallet = Boolean(author.walletAddress);
  const cfg = getChainConfig();
  const isRegistered = registration?.status === "REGISTERED";

  return (
    <DashboardPage
      title={book.title}
      actions={<ButtonLink href="/dashboard/books" variant="ghost">← All books</ButtonLink>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Book summary */}
        <Card>
          <CardTitle>Book</CardTitle>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Title</dt>
              <dd className="text-right font-medium">{book.title}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge tone={book.status === "PUBLISHED" ? "success" : "muted"}>
                  {book.status}
                </StatusBadge>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Price</dt>
              <dd className="font-medium">{usd(book.price)}</dd>
            </div>
            <div>
              <dt className="text-muted">Proof hash (MVP)</dt>
              <dd className="mt-1 break-all font-mono text-xs text-foreground">{proofHash}</dd>
            </div>
          </dl>
          {book.status === "PUBLISHED" ? (
            <Link
              href={`/book/${book.slug}`}
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              View public page →
            </Link>
          ) : null}
        </Card>

        {/* Proof of authorship */}
        <Card>
          <CardTitle>Proof of Authorship</CardTitle>
          <p className="mt-1 text-sm text-muted">
            Register a tamper-evident hash of this book on Base Sepolia. Only the
            hash, your wallet, and a timestamp go on-chain — never the content.
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-muted">On-chain status:</span>
            {statusBadge(registration?.status)}
          </div>

          {isRegistered ? (
            <dl className="mt-4 space-y-3 text-sm">
              {registration?.contractAddress ? (
                <div>
                  <dt className="text-muted">Contract</dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    <a
                      href={getExplorerAddressUrl(registration.contractAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {registration.contractAddress}
                    </a>
                  </dd>
                </div>
              ) : null}
              {registration?.transactionHash ? (
                <div>
                  <dt className="text-muted">Transaction</dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    <a
                      href={getExplorerTxUrl(registration.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {registration.transactionHash}
                    </a>
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <div className="mt-4">
              {registryReady && hasWallet ? (
                <form action={registerProofAction}>
                  <input type="hidden" name="bookId" value={book.id} />
                  <Button type="submit" className="w-full">
                    Register Proof of Authorship
                  </Button>
                  {registration?.status === "FAILED" ? (
                    <p className="mt-2 text-xs text-warning">
                      The last attempt failed. You can try again.
                    </p>
                  ) : null}
                </form>
              ) : (
                <>
                  <Button className="w-full" disabled>
                    Register Proof of Authorship
                  </Button>
                  <p className="mt-2 text-xs text-warning">
                    {!registryReady
                      ? `Blockchain registry not configured. Set NEXT_PUBLIC_REGISTRY_ADDRESS and DEPLOYER_PRIVATE_KEY (${cfg.network}).`
                      : "Add a wallet address to your author profile to register on-chain."}
                  </p>
                </>
              )}
            </div>
          )}
        </Card>
      </div>
    </DashboardPage>
  );
}

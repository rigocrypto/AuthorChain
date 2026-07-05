import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card, CardTitle } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOptionalAuthor } from "@/lib/auth/session";
import { storageSupportsDirectUpload } from "@/lib/storage";
import { getAuthorBookById } from "@/lib/data/books";
import { getRegistrationForBook } from "@/lib/data/registrations";
import { getPrimaryBookFile } from "@/lib/data/book-files";
import { getPrimaryAsset } from "@/lib/data/book-assets";
import { isValidIsbn13 } from "@/lib/publishing/isbn";
import { bookRegistrationHash } from "@/lib/blockchain/book-hash";
import {
  isRegistryConfigured,
  getChainConfig,
  getExplorerTxUrl,
  getExplorerAddressUrl,
} from "@/lib/blockchain/registry";
import { registerProofAction } from "./actions";
import { ManuscriptUploadForm } from "./manuscript-upload-form";
import {
  BookDetailsForm,
  CoverUploadForm,
  PublishingMetadataForm,
  GenerateBarcodeForm,
} from "./publishing-forms";

export const metadata: Metadata = { title: "Book details" };
export const dynamic = "force-dynamic";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

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
  // Layout guard owns the unauthenticated redirect; bail quietly to avoid a
  // redundant "Unauthorized" throw during parallel render.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const book = await getAuthorBookById(id, author.id);
  if (!book) notFound();

  const [registration, manuscript, cover, barcode] = await Promise.all([
    getRegistrationForBook(id),
    getPrimaryBookFile(id),
    getPrimaryAsset(id, "COVER"),
    getPrimaryAsset(id, "BARCODE"),
  ]);
  const proofHash = bookRegistrationHash(book);
  const usesRealFileHash = Boolean(book.fileHash);
  const directUpload = storageSupportsDirectUpload();
  const registryReady = isRegistryConfigured();
  const hasWallet = Boolean(author.walletAddress);
  const cfg = getChainConfig();
  const isRegistered = registration?.status === "REGISTERED";
  const hasValidIsbn = Boolean(book.isbn13 && isValidIsbn13(book.isbn13));
  // Cache-bust asset previews when the underlying file changes (hash in query).
  const coverSrc = cover ? `/api/assets/books/${id}/cover?v=${cover.hash ?? ""}` : null;
  const barcodeSrc = barcode
    ? `/api/assets/books/${id}/barcode?v=${barcode.hash ?? ""}`
    : null;

  return (
    <DashboardPage
      title={book.title}
      actions={<ButtonLink href="/dashboard/books" variant="ghost">← All books</ButtonLink>}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Book details */}
        <Card>
          <CardTitle>Book details</CardTitle>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd>
                <StatusBadge tone={book.status === "PUBLISHED" ? "success" : "muted"}>
                  {book.status}
                </StatusBadge>
              </dd>
            </div>
            <div>
              <dt className="text-muted">
                Proof hash{" "}
                {usesRealFileHash ? (
                  <StatusBadge tone="success">real file</StatusBadge>
                ) : (
                  <StatusBadge tone="warning">MVP metadata</StatusBadge>
                )}
              </dt>
              <dd className="mt-1 break-all font-mono text-xs text-foreground">{proofHash}</dd>
            </div>
          </dl>

          <BookDetailsForm
            bookId={book.id}
            defaults={{
              title: book.title,
              subtitle: book.subtitle,
              description: book.description,
              category: book.category,
              price: book.price,
            }}
          />

          {book.status === "PUBLISHED" ? (
            <Link
              href={`/book/${book.slug}`}
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              View public page →
            </Link>
          ) : null}
        </Card>

        {/* Manuscript */}
        <Card>
          <CardTitle>Manuscript</CardTitle>
          {manuscript ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">File</dt>
                <dd className="text-right font-medium">{manuscript.fileName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Type</dt>
                <dd>
                  <StatusBadge tone="muted">{manuscript.fileLabel}</StatusBadge>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Size</dt>
                <dd className="font-medium">{formatBytes(manuscript.fileSize)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Storage</dt>
                <dd>
                  <StatusBadge tone="muted">{manuscript.storageProvider}</StatusBadge>
                </dd>
              </div>
              <div>
                <dt className="text-muted">SHA-256</dt>
                <dd className="mt-1 break-all font-mono text-xs text-foreground">
                  {manuscript.sha256 ?? "—"}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-2 text-sm text-muted">
              No manuscript uploaded yet. Upload a PDF or EPUB to generate a real
              file hash for on-chain proof.
            </p>
          )}

          {isRegistered ? (
            <p className="mt-4 rounded-lg bg-warning/15 px-3 py-2 text-xs text-warning">
              This book already has an on-chain proof. Uploading a new manuscript
              version should create a new versioned proof in a future release.
            </p>
          ) : (
            <ManuscriptUploadForm
              bookId={book.id}
              hasFile={Boolean(manuscript)}
              directUpload={directUpload}
            />
          )}

          <p className="mt-3 text-xs text-muted">
            Files are stored privately (never in <code>public/</code>) and are not
            downloadable yet. Protected reader access coming in Phase 2.
          </p>
        </Card>

        {/* Cover */}
        <Card>
          <CardTitle>Cover</CardTitle>
          {coverSrc ? (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverSrc}
                alt={`${book.title} cover`}
                className="max-h-64 w-auto rounded-lg border border-border"
              />
              <div className="mt-3 space-y-1 text-xs text-muted">
                <div>
                  {cover!.fileName} · {cover!.mimeType} · {formatBytes(cover!.fileSize)}
                </div>
                <div className="break-all font-mono">SHA-256 {cover!.hash}</div>
              </div>
            </div>
          ) : (
            <div
              className={`mt-4 flex aspect-[2/3] w-40 items-center justify-center rounded-lg bg-gradient-to-br ${book.coverColor} text-xs text-white/80`}
            >
              No cover
            </div>
          )}
          <CoverUploadForm
            bookId={book.id}
            hasCover={Boolean(cover)}
            directUpload={directUpload}
          />
          <p className="mt-3 text-xs text-muted">
            Covers are public assets served through a controlled route — separate
            from the protected manuscript.
          </p>
        </Card>

        {/* Publishing metadata */}
        <Card>
          <CardTitle>Publishing metadata</CardTitle>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">ISBN-13:</span>
            {book.isbn13 ? (
              hasValidIsbn ? (
                <StatusBadge tone="success">valid</StatusBadge>
              ) : (
                <StatusBadge tone="warning">invalid</StatusBadge>
              )
            ) : (
              <StatusBadge tone="muted">none</StatusBadge>
            )}
            {book.isbn13 ? (
              <span className="font-mono text-xs">{book.isbn13}</span>
            ) : null}
          </div>
          <PublishingMetadataForm
            bookId={book.id}
            defaults={{
              isbn13: book.isbn13,
              isbn10: book.isbn10,
              bookFormat: book.bookFormat,
              publisherName: book.publisherName,
              publicationDate: book.publicationDate,
              edition: book.edition,
            }}
          />
          <p className="mt-3 text-xs text-muted">
            On-chain proof protects the manuscript hash. Cover and ISBN metadata are
            publishing assets and may be updated separately.
          </p>
        </Card>

        {/* ISBN barcode */}
        <Card>
          <CardTitle>ISBN barcode</CardTitle>
          <p className="mt-1 text-xs text-muted">
            ISBN barcode preview/export asset (EAN-13). Not print-certified.
          </p>
          {barcodeSrc ? (
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={barcodeSrc}
                alt="ISBN barcode"
                className="h-24 w-auto rounded bg-white p-2"
              />
              <a
                href={barcodeSrc}
                download={`isbn-${book.isbn13 ?? "barcode"}.svg`}
                className="mt-2 inline-block text-sm text-accent hover:underline"
              >
                Download barcode →
              </a>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">No barcode generated yet.</p>
          )}
          <GenerateBarcodeForm bookId={book.id} disabled={!hasValidIsbn} />
        </Card>

        {/* Proof of authorship */}
        <Card className="lg:col-span-2">
          <CardTitle>Proof of Authorship</CardTitle>
          <p className="mt-1 text-sm text-muted">
            Register a tamper-evident hash of this book on Base Sepolia. Only the
            hash, your wallet, and a timestamp go on-chain — never the content.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">On-chain status:</span>
            {statusBadge(registration?.status)}
            <span className="text-muted">· Proof source:</span>
            {usesRealFileHash ? (
              <StatusBadge tone="success">real manuscript file (SHA-256)</StatusBadge>
            ) : (
              <StatusBadge tone="warning">MVP metadata fallback</StatusBadge>
            )}
          </div>
          {!usesRealFileHash && !isRegistered ? (
            <p className="mt-2 text-xs text-muted">
              Upload a manuscript above to register the real file hash instead of
              the metadata fallback.
            </p>
          ) : null}

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

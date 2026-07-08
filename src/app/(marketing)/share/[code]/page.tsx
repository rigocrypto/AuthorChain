import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/page-header";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { ReaderBackground } from "@/components/reader-background";
import { resolveShareLanding } from "@/lib/data/referrals";
import { absoluteUrl, metaDescription } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";

export const dynamic = "force-dynamic";

/**
 * Social-share landing for a referral link. Preferred URL for sharing because
 * it renders rich Open Graph metadata (some platforms don't preview redirect-
 * only /r/[code] links). The canonical points at the book page to avoid
 * duplicate content; /r/[code] remains the fast tracking redirect.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const locale = await getLocale();
  const landing = await resolveShareLanding(code, locale);
  if (!landing) {
    const { dict } = await getDictionary();
    return { title: dict.share.shareLink, robots: { index: false, follow: false } };
  }
  const { book } = landing;
  const title = `${book.title} by ${book.authorName}`;
  const description = metaDescription(
    book.subtitle ? `${book.subtitle}. ${book.description}` : book.description,
  );

  // og:image / twitter:image come from the colocated opengraph-image.tsx.
  return {
    title,
    description,
    // Canonical to the book page keeps share URLs from competing in search.
    alternates: { canonical: `/book/${book.slug}` },
    robots: { index: false, follow: true },
    openGraph: {
      type: "book",
      title,
      description,
      url: absoluteUrl(`/share/${code}`),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const locale = await getLocale();
  const { dict } = await getDictionary();
  const landing = await resolveShareLanding(code, locale);
  // Invalid / inactive / draft / archived → no exposure, send to the storefront.
  if (!landing) redirect("/explore");

  const { book } = landing;
  const metadata = {
    title: book.translation?.title ?? book.title,
    subtitle: book.translation?.subtitle ?? book.subtitle,
    description: book.translation?.description ?? book.description,
  };
  const bookHref = `/book/${book.slug}?ref=${encodeURIComponent(code)}`;

  return (
    <PageShell>
      <ReaderBackground />
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border bg-surface/80 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="w-40 shrink-0">
              {book.hasCover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/assets/books/${book.id}/cover`}
                  alt={`${metadata.title} cover`}
                  className="aspect-[2/3] w-full rounded-xl border border-border object-cover"
                />
              ) : (
                <div
                  className={`flex aspect-[2/3] w-full items-end rounded-xl bg-gradient-to-br ${book.coverColor} p-4`}
                >
                  <span className="text-lg font-bold text-white drop-shadow">{metadata.title}</span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="accent">{book.category}</StatusBadge>
                {book.proofVerified ? (
                  <StatusBadge tone="accent">{dict.common.verifiedProof}</StatusBadge>
                ) : null}
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">{metadata.title}</h1>
              {metadata.subtitle ? (
                <p className="mt-1 text-muted">{metadata.subtitle}</p>
              ) : null}
              <p className="mt-1 text-sm text-muted">by {book.authorName}</p>
              <p className="mt-3 line-clamp-4 text-sm text-muted">{metadata.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="text-xl font-semibold">
                  ${book.price.toFixed(2)} {book.currency}
                </div>
                <ButtonLink href={bookHref} variant="primary">
                  {dict.common.openBook}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          {dict.share.sharedFrom}{" "}
          <Link href="/explore" className="text-accent hover:underline">
            {dict.share.readerchainBy}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getOptionalAuthor } from "@/lib/auth/session";
import { getDashboardStats, getRecentSales } from "@/lib/data/stats";
import { getTopBook } from "@/lib/data/books";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const num = (n: number) => n.toLocaleString("en-US");

export default async function DashboardPageRoute() {
  // The dashboard layout guard owns the unauthenticated redirect. This page and
  // the layout render in parallel, so use the non-throwing helper and bail
  // quietly when there is no author — otherwise a throw here logs a redundant
  // "Unauthorized" error even though the redirect is what serves the response.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const { dict } = await getDictionary();
  const t = dict.dashboard;
  const [stats, sales, topBook] = await Promise.all([
    getDashboardStats(author.id),
    getRecentSales(author.id, 5),
    getTopBook(author.id),
  ]);

  const statCards = [
    { label: t.totalSales, value: usd(stats.totalSalesUsd) },
    { label: t.earningsUsdc, value: num(stats.earningsUsdc) },
    { label: t.booksSold, value: num(stats.booksSold) },
    { label: t.activeReaders, value: num(stats.activeReaders) },
  ];

  return (
    <DashboardPage
      title={t.titleDashboard}
      actions={<ButtonLink href="/dashboard/upload">{t.uploadBook}</ButtonLink>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">{t.recentSales}</h2>
            <Link href="/dashboard/sales" className="text-sm text-accent hover:underline">
              {t.viewAllSales}
            </Link>
          </div>
          {sales.length === 0 ? (
            <p className="text-sm text-muted">{t.noSalesYet}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="pb-2">{t.colBook}</th>
                    <th className="pb-2">{t.colBuyer}</th>
                    <th className="pb-2">{t.colAmount}</th>
                    <th className="pb-2">{t.colStatus}</th>
                    <th className="pb-2">{t.colDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id} className="border-t border-border">
                      <td className="py-2 pr-4">{s.bookTitle}</td>
                      <td className="py-2 pr-4 font-mono text-xs text-muted">{s.buyer}</td>
                      <td className="py-2 pr-4">
                        {s.amount.toFixed(2)} {s.currency}
                      </td>
                      <td className="py-2 pr-4">
                        <StatusBadge tone="success">{s.status}</StatusBadge>
                      </td>
                      <td className="py-2 text-muted">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-semibold">{t.topBook}</h2>
            {topBook ? (
              <div className="flex gap-3">
                {topBook.hasCover ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local asset API
                  <img
                    src={`/api/assets/books/${topBook.id}/cover`}
                    alt={`${topBook.title} cover`}
                    className="aspect-[2/3] w-16 shrink-0 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <div
                    className={`flex aspect-[2/3] w-16 shrink-0 items-end rounded-lg bg-gradient-to-br ${topBook.coverColor} p-1.5`}
                    aria-hidden
                  >
                    <span className="line-clamp-3 text-[9px] font-bold leading-tight text-white drop-shadow">
                      {topBook.title}
                    </span>
                  </div>
                )}
                <div className="min-w-0 text-sm">
                  <div className="font-medium">{topBook.title}</div>
                  <div className="text-muted">
                    {dict.book.by} {author.name}
                  </div>
                  <div className="mt-2 text-muted">
                    {topBook.unitsSold} {t.sold} · {topBook.earningsUsdc.toFixed(0)} USDC
                  </div>
                  <Link
                    href={`/book/${topBook.slug}`}
                    className="mt-1 inline-block text-accent hover:underline"
                  >
                    {t.viewDetails}
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">{t.publishToSeeTop}</p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">{t.aiActivity}</h2>
            <p className="text-sm text-muted">{t.aiActivityDesc}</p>
            <Link
              href="/dashboard/agents"
              className="mt-2 inline-block text-sm text-accent hover:underline"
            >
              {t.openAiTools}
            </Link>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{t.collectorEditions}</h2>
              <StatusBadge tone="muted">Soon</StatusBadge>
            </div>
            <p className="mt-2 text-sm text-muted">{t.collectorEditionsDesc}</p>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}

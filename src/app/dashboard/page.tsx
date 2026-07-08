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
    { label: t.totalSales, value: usd(stats.totalSalesUsd), href: "/dashboard/sales" },
    { label: t.earningsUsdc, value: num(stats.earningsUsdc), href: "/dashboard/sales" },
    { label: t.booksSold, value: num(stats.booksSold), href: "/dashboard/books" },
    {
      label: t.activeReaders,
      value: num(stats.activeReaders),
      href: "/dashboard/sales",
    },
  ];

  return (
    <DashboardPage
      title={t.titleDashboard}
      actions={<ButtonLink href="/dashboard/upload">{t.uploadBook}</ButtonLink>}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Link key={s.label} href={s.href} className="block rounded-xl outline-none">
            <Card interactive className="h-full">
              <div className="text-sm text-muted">{s.label}</div>
              <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Link href="/dashboard/sales" className="block rounded-xl outline-none lg:col-span-2">
          <Card interactive className="h-full">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">{t.recentSales}</h2>
              <span className="text-sm text-accent">{t.viewAllSales}</span>
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
                        <td className="py-2 pr-4 font-mono text-xs text-muted">
                          {s.buyer}
                        </td>
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
        </Link>

        <div className="space-y-4">
          {topBook ? (
            <Link
              href={`/book/${topBook.slug}`}
              className="block rounded-xl outline-none"
            >
              <Card
                interactive
                className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-surface via-surface to-primary/10"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{t.topBook}</h2>
                  <StatusBadge tone="accent">★ Top</StatusBadge>
                </div>
                <div className="flex gap-4">
                  {/* Framed cover — gradient ring + inner mat for shelf presence */}
                  <div className="relative shrink-0">
                    <div
                      className="rounded-xl bg-gradient-to-br from-primary via-accent/80 to-primary p-[3px] shadow-[0_12px_32px_-10px_rgba(124,92,255,0.7)]"
                      aria-hidden={!topBook.hasCover}
                    >
                      <div className="overflow-hidden rounded-[10px] bg-background ring-1 ring-black/40">
                        {topBook.hasCover ? (
                          // eslint-disable-next-line @next/next/no-img-element -- local asset API
                          <img
                            src={`/api/assets/books/${topBook.id}/cover`}
                            alt={`${topBook.title} cover`}
                            className="aspect-[2/3] w-[4.75rem] object-cover sm:w-20"
                          />
                        ) : (
                          <div
                            className={`flex aspect-[2/3] w-[4.75rem] items-end bg-gradient-to-br p-2 sm:w-20 ${topBook.coverColor}`}
                          >
                            <span className="line-clamp-4 text-[10px] font-bold leading-tight text-white drop-shadow">
                              {topBook.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Soft shelf shadow under the frame */}
                    <div
                      className="pointer-events-none absolute -bottom-1 left-1 right-1 h-2 rounded-full bg-primary/25 blur-md"
                      aria-hidden
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-sm">
                    <div className="font-medium leading-snug">{topBook.title}</div>
                    <div className="mt-0.5 text-muted">
                      {dict.book.by} {author.name}
                    </div>
                    <div className="mt-2 text-muted">
                      {topBook.unitsSold} {t.sold} ·{" "}
                      {topBook.earningsUsdc.toFixed(0)} USDC
                    </div>
                    <span className="mt-2 inline-block text-accent">
                      {t.viewDetails}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ) : (
            <Card interactive>
              <h2 className="mb-3 font-semibold">{t.topBook}</h2>
              <p className="text-sm text-muted">{t.publishToSeeTop}</p>
            </Card>
          )}

          <Link href="/dashboard/agents" className="block rounded-xl outline-none">
            <Card interactive className="h-full">
              <h2 className="mb-3 font-semibold">{t.aiActivity}</h2>
              <p className="text-sm text-muted">{t.aiActivityDesc}</p>
              <span className="mt-2 inline-block text-sm text-accent">
                {t.openAiTools}
              </span>
            </Card>
          </Link>

          <Card interactive className="opacity-90">
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

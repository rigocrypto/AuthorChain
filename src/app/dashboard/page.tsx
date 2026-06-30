import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentAuthor } from "@/lib/auth/session";
import { getDashboardStats, getRecentSales } from "@/lib/data/stats";
import { getTopBook } from "@/lib/data/books";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });
const num = (n: number) => n.toLocaleString("en-US");

export default async function DashboardPageRoute() {
  const author = await getCurrentAuthor();
  const [stats, sales, topBook] = await Promise.all([
    getDashboardStats(author.id),
    getRecentSales(author.id, 5),
    getTopBook(author.id),
  ]);

  const statCards = [
    { label: "Total Sales", value: usd(stats.totalSalesUsd) },
    { label: "Earnings (USDC)", value: num(stats.earningsUsdc) },
    { label: "Books Sold", value: num(stats.booksSold) },
    { label: "Active Readers", value: num(stats.activeReaders) },
  ];

  return (
    <DashboardPage
      title="Dashboard"
      actions={<ButtonLink href="/dashboard/upload">Upload book</ButtonLink>}
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
            <h2 className="font-semibold">Recent sales</h2>
            <Link href="/dashboard/sales" className="text-sm text-accent hover:underline">
              View all sales →
            </Link>
          </div>
          {sales.length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="pb-2">Book</th>
                    <th className="pb-2">Buyer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
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
            <h2 className="mb-3 font-semibold">Top book</h2>
            {topBook ? (
              <div className="flex gap-3">
                <div
                  className={`aspect-[2/3] w-16 shrink-0 rounded-lg bg-gradient-to-br ${topBook.coverColor}`}
                />
                <div className="text-sm">
                  <div className="font-medium">{topBook.title}</div>
                  <div className="text-muted">by {author.name}</div>
                  <div className="mt-2 text-muted">
                    {topBook.unitsSold} sold · {topBook.earningsUsdc.toFixed(0)} USDC
                  </div>
                  <Link
                    href={`/book/${topBook.slug}`}
                    className="mt-1 inline-block text-accent hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Publish a book to see your top seller.</p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">AI agent activity</h2>
            <p className="text-sm text-muted">
              Run the AI agents to generate marketing assets for your books.
            </p>
            <Link
              href="/dashboard/agents"
              className="mt-2 inline-block text-sm text-accent hover:underline"
            >
              Open AI agents →
            </Link>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}

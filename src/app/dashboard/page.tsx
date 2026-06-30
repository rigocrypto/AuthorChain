import type { Metadata } from "next";
import Link from "next/link";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ButtonLink } from "@/components/ui/button";
import {
  dashboardStats,
  mockSales,
  agentActivity,
  getTopBook,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPageRoute() {
  const topBook = getTopBook();

  return (
    <DashboardPage
      title="Dashboard"
      actions={<ButtonLink href="/dashboard/upload">Upload book</ButtonLink>}
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((s) => (
          <Card key={s.label}>
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
            <div className="mt-1 text-xs text-success">{s.change} this month</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Recent sales */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent sales</h2>
            <Link href="/dashboard/sales" className="text-sm text-accent hover:underline">
              View all sales →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-2">Book</th>
                  <th className="pb-2">Buyer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockSales.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-2 pr-4">{s.bookTitle}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">{s.buyer}</td>
                    <td className="py-2 pr-4">
                      {s.amount.toFixed(2)} {s.currency}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge tone="success">{s.type}</StatusBadge>
                    </td>
                    <td className="py-2 text-muted">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Side column: top book + agent activity */}
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 font-semibold">Top book</h2>
            <div className="flex gap-3">
              <div
                className={`aspect-[2/3] w-16 shrink-0 rounded-lg bg-gradient-to-br ${topBook.coverColor}`}
              />
              <div className="text-sm">
                <div className="font-medium">{topBook.title}</div>
                <div className="text-muted">by Rigo Vivas</div>
                <div className="mt-2 text-muted">
                  {topBook.unitsSold} sold · {topBook.earningsUsdc} USDC
                </div>
                <Link
                  href={`/book/${topBook.slug}`}
                  className="mt-1 inline-block text-accent hover:underline"
                >
                  View details →
                </Link>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 font-semibold">AI agent activity</h2>
            <ul className="space-y-3 text-sm">
              {agentActivity.map((a) => (
                <li key={a.agent}>
                  <div className="font-medium">{a.agent}</div>
                  <div className="text-muted">
                    {a.summary} · {a.at}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}

import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAuthor } from "@/lib/auth/session";
import { getRecentSales, getRoyaltySummary } from "@/lib/data/stats";

export const metadata: Metadata = { title: "Sales & royalties" };
export const dynamic = "force-dynamic";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default async function SalesPage() {
  const author = await getCurrentAuthor();
  const [summary, sales] = await Promise.all([
    getRoyaltySummary(author.id),
    getRecentSales(author.id, 50),
  ]);

  const cards = [
    { label: "Gross sales", value: usd(summary.grossSales) },
    { label: "Royalties earned", value: `${summary.royaltiesEarned.toFixed(2)} USDC` },
    { label: "Pending payouts", value: `${summary.pendingPayouts.toFixed(2)} USDC` },
  ];

  return (
    <DashboardPage title="Sales & royalties">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Transparent tracking of every sale and payout across card and USDC.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((s) => (
          <Card key={s.label}>
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Transactions</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-muted">No sales yet. Your transactions will appear here.</p>
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
    </DashboardPage>
  );
}

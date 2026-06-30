import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { royaltyStats, mockSales } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Sales & royalties" };

export default function SalesPage() {
  return (
    <DashboardPage title="Sales & royalties">
      <p className="mb-6 max-w-2xl text-sm text-muted">
        Transparent tracking of every sale and payout across card and USDC.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {royaltyStats.map((s) => (
          <Card key={s.label}>
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Transactions</h2>
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
    </DashboardPage>
  );
}

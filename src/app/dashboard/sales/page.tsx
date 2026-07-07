import type { Metadata } from "next";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getOptionalAuthor } from "@/lib/auth/session";
import { getRecentSales, getRoyaltySummary } from "@/lib/data/stats";
import { getDictionary } from "@/i18n/get-dictionary";

export const metadata: Metadata = { title: "Sales & royalties" };
export const dynamic = "force-dynamic";

const usd = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

const statusTone = (status: string) => {
  if (status === "PAID") return "success" as const;
  if (status === "PENDING") return "warning" as const;
  return "muted" as const;
};

export default async function SalesPage() {
  // Layout guard owns the unauthenticated redirect; bail quietly to avoid a
  // redundant "Unauthorized" throw during parallel render.
  const author = await getOptionalAuthor();
  if (!author) return null;

  const { dict } = await getDictionary();
  const t = dict.dashboard;
  const [summary, sales] = await Promise.all([
    getRoyaltySummary(author.id),
    getRecentSales(author.id, 50),
  ]);

  const cards = [
    { label: t.totalRevenue, value: usd(summary.grossSales) },
    { label: t.paidRoyalties, value: usd(summary.royaltiesEarned) },
    { label: t.pendingPayouts, value: usd(summary.pendingPayouts) },
  ];

  return (
    <DashboardPage title={t.titleSales}>
      <p className="mb-6 max-w-2xl text-sm text-muted">{t.salesIntro}</p>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((s) => (
          <Card key={s.label}>
            <div className="text-sm text-muted">{s.label}</div>
            <div className="mt-2 text-2xl font-semibold">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">{t.transactions}</h2>
        {sales.length === 0 ? (
          <p className="text-sm text-muted">{t.noSalesYetDesc}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-2">{t.colBook}</th>
                  <th className="pb-2">{t.colBuyer}</th>
                  <th className="pb-2">{t.colAmount}</th>
                  <th className="pb-2">{t.colProvider}</th>
                  <th className="pb-2">{t.colStatus}</th>
                  <th className="pb-2">{t.colAccess}</th>
                  <th className="pb-2">{t.colDate}</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="py-2 pr-4">{s.bookTitle}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {s.email ?? s.buyer}
                    </td>
                    <td className="py-2 pr-4">
                      {s.amount.toFixed(2)} {s.currency}
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge tone="muted">{s.provider}</StatusBadge>
                    </td>
                    <td className="py-2 pr-4">
                      <StatusBadge tone={statusTone(s.status)}>{s.status}</StatusBadge>
                    </td>
                    <td className="py-2 pr-4">
                      {s.readerAccess ? (
                        <StatusBadge tone={s.readerAccess === "ACTIVE" ? "success" : "muted"}>
                          {s.readerAccess}
                        </StatusBadge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
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

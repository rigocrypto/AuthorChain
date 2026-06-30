import { prisma } from "@/lib/db";

/** Truncate an email or wallet for display in tables. */
function shortBuyer(email: string | null): string {
  if (!email) return "anonymous";
  if (email.startsWith("0x") && email.length > 12) {
    return `${email.slice(0, 6)}...${email.slice(-4)}`;
  }
  const [name] = email.split("@");
  return name.length > 10 ? `${name.slice(0, 10)}…` : name;
}

export type DashboardStats = {
  totalSalesUsd: number;
  earningsUsdc: number;
  booksSold: number;
  activeReaders: number;
};

export async function getDashboardStats(
  authorId: string,
): Promise<DashboardStats> {
  const [salesAgg, royaltyAgg, readers] = await Promise.all([
    prisma.sale.aggregate({
      where: { authorId, paymentStatus: "PAID" },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.royalty.aggregate({
      where: { authorId },
      _sum: { amount: true },
    }),
    prisma.sale.findMany({
      where: { authorId, paymentStatus: "PAID", buyerEmail: { not: null } },
      distinct: ["buyerEmail"],
      select: { buyerEmail: true },
    }),
  ]);

  return {
    totalSalesUsd: Number(salesAgg._sum.amount ?? 0),
    earningsUsdc: Number(royaltyAgg._sum.amount ?? 0),
    booksSold: salesAgg._count._all,
    activeReaders: readers.length,
  };
}

export type SaleDTO = {
  id: string;
  bookTitle: string;
  buyer: string;
  email: string | null;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  date: string;
};

export async function getRecentSales(
  authorId: string,
  limit = 10,
): Promise<SaleDTO[]> {
  const sales = await prisma.sale.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { book: { select: { title: true } } },
  });
  return sales.map((s) => ({
    id: s.id,
    bookTitle: s.book.title,
    buyer: shortBuyer(s.buyerEmail),
    // Surface the real email when it is one (Stripe buyers); seed/wallet rows
    // keep the shortened form.
    email: s.buyerEmail?.includes("@") ? s.buyerEmail : null,
    amount: Number(s.amount),
    currency: s.currency,
    provider: s.paymentProvider,
    status: s.paymentStatus,
    date: s.createdAt.toISOString().slice(0, 10),
  }));
}

export type RoyaltySummary = {
  grossSales: number;
  royaltiesEarned: number;
  pendingPayouts: number;
};

export async function getRoyaltySummary(
  authorId: string,
): Promise<RoyaltySummary> {
  const [grossAgg, earnedAgg, pendingAgg] = await Promise.all([
    prisma.sale.aggregate({
      where: { authorId, paymentStatus: "PAID" },
      _sum: { amount: true },
    }),
    prisma.royalty.aggregate({
      where: { authorId, status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.royalty.aggregate({
      where: { authorId, status: "PENDING" },
      _sum: { amount: true },
    }),
  ]);
  return {
    grossSales: Number(grossAgg._sum.amount ?? 0),
    royaltiesEarned: Number(earnedAgg._sum.amount ?? 0),
    pendingPayouts: Number(pendingAgg._sum.amount ?? 0),
  };
}

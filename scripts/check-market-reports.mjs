import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
try {
  const rows = await p.bookMarketResearchReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      status: true,
      genre: true,
      createdAt: true,
      inputSummary: true,
      warnings: true,
    },
  });
  console.log(
    JSON.stringify(
      rows.map((r) => ({
        status: r.status,
        genre: r.genre,
        createdAt: r.createdAt,
        summaryLen: (r.inputSummary || "").length,
        warningCount: Array.isArray(r.warnings) ? r.warnings.length : null,
      })),
      null,
      2,
    ),
  );
  const counts = await p.bookMarketResearchReport.groupBy({
    by: ["status"],
    _count: true,
  });
  console.log("COUNTS", JSON.stringify(counts));
} catch (e) {
  console.log("DB_ERR", e instanceof Error ? e.message : String(e));
} finally {
  await p.$disconnect();
}

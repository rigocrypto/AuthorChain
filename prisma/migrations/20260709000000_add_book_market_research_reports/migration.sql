-- CreateEnum
CREATE TYPE "MarketResearchReportStatus" AS ENUM ('DRAFT', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "BookMarketResearchReport" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "bookId" TEXT,
    "genre" TEXT NOT NULL,
    "sourceUrls" JSONB,
    "inputSummary" TEXT,
    "trendSignals" JSONB,
    "reviewPatterns" JSONB,
    "opportunityGaps" JSONB,
    "recommendedConcepts" JSONB,
    "warnings" JSONB,
    "report" JSONB,
    "status" "MarketResearchReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookMarketResearchReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookMarketResearchReport_authorId_createdAt_idx" ON "BookMarketResearchReport"("authorId", "createdAt");

-- CreateIndex
CREATE INDEX "BookMarketResearchReport_authorId_bookId_idx" ON "BookMarketResearchReport"("authorId", "bookId");

-- AddForeignKey
ALTER TABLE "BookMarketResearchReport" ADD CONSTRAINT "BookMarketResearchReport_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookMarketResearchReport" ADD CONSTRAINT "BookMarketResearchReport_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;

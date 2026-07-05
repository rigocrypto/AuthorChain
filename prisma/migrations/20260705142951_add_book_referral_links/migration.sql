-- CreateTable
CREATE TABLE "BookReferralLink" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "checkoutCount" INTEGER NOT NULL DEFAULT 0,
    "saleCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookReferralLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookReferralLink_code_key" ON "BookReferralLink"("code");

-- CreateIndex
CREATE INDEX "BookReferralLink_bookId_idx" ON "BookReferralLink"("bookId");

-- CreateIndex
CREATE INDEX "BookReferralLink_authorId_idx" ON "BookReferralLink"("authorId");

-- AddForeignKey
ALTER TABLE "BookReferralLink" ADD CONSTRAINT "BookReferralLink_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReferralLink" ADD CONSTRAINT "BookReferralLink_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

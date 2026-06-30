-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "stripePaymentIntentId" TEXT,
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sale_stripeSessionId_key" ON "Sale"("stripeSessionId");

-- CreateTable
CREATE TABLE "BookReview" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "thoughts" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookReview_bookId_readerId_key" ON "BookReview"("bookId", "readerId");

-- CreateIndex
CREATE INDEX "BookReview_bookId_createdAt_idx" ON "BookReview"("bookId", "createdAt");

-- CreateIndex
CREATE INDEX "BookReview_readerId_idx" ON "BookReview"("readerId");

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "Reader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

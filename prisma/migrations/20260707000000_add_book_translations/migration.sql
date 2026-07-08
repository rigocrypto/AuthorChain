-- CreateTable
CREATE TABLE "BookTranslation" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookTranslation_locale_idx" ON "BookTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "BookTranslation_bookId_locale_key" ON "BookTranslation"("bookId", "locale");

-- AddForeignKey
ALTER TABLE "BookTranslation" ADD CONSTRAINT "BookTranslation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

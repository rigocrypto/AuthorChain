-- CreateEnum
CREATE TYPE "PrintTrimSize" AS ENUM ('POCKET_4_25X6_87', 'DIGEST_5_5X8_5', 'US_TRADE_6X9', 'ROYAL_6_14X9_21', 'US_LETTER_8_5X11', 'SQUARE_8_5X8_5', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PrintInteriorColor" AS ENUM ('BLACK_AND_WHITE', 'STANDARD_COLOR', 'PREMIUM_COLOR');

-- CreateEnum
CREATE TYPE "PrintPaperType" AS ENUM ('WHITE', 'CREAM', 'COLOR');

-- CreateEnum
CREATE TYPE "PrintBinding" AS ENUM ('PERFECT_BOUND', 'HARDCOVER_CASE_LAMINATE', 'HARDCOVER_DUST_JACKET', 'SADDLE_STITCH', 'COIL_WIRE_O');

-- CreateEnum
CREATE TYPE "PrintCoverFinish" AS ENUM ('MATTE', 'GLOSSY');

-- CreateTable
CREATE TABLE "BookPrintSettings" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT false,
    "trimSize" "PrintTrimSize" NOT NULL DEFAULT 'US_TRADE_6X9',
    "trimWidthIn" DOUBLE PRECISION,
    "trimHeightIn" DOUBLE PRECISION,
    "interiorColor" "PrintInteriorColor" NOT NULL DEFAULT 'BLACK_AND_WHITE',
    "paperType" "PrintPaperType" NOT NULL DEFAULT 'WHITE',
    "binding" "PrintBinding" NOT NULL DEFAULT 'PERFECT_BOUND',
    "coverFinish" "PrintCoverFinish" NOT NULL DEFAULT 'MATTE',
    "pageCount" INTEGER,
    "spineWidthIn" DOUBLE PRECISION,
    "printIsbn13" TEXT,
    "imprintName" TEXT,
    "price" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "weightOz" DOUBLE PRECISION,
    "distributor" TEXT,
    "availabilityNote" TEXT,
    "printNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookPrintSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookPrintSettings_bookId_key" ON "BookPrintSettings"("bookId");

-- CreateIndex
CREATE INDEX "BookPrintSettings_authorId_idx" ON "BookPrintSettings"("authorId");

-- AddForeignKey
ALTER TABLE "BookPrintSettings" ADD CONSTRAINT "BookPrintSettings_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrintSettings" ADD CONSTRAINT "BookPrintSettings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterEnum
ALTER TYPE "StorageProvider" ADD VALUE 'R2';

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('COVER', 'BARCODE');

-- CreateEnum
CREATE TYPE "BookFormat" AS ENUM ('EBOOK', 'PAPERBACK', 'HARDCOVER', 'AUDIOBOOK');

-- AlterTable
ALTER TABLE "Book"
  ADD COLUMN     "isbn13" TEXT,
  ADD COLUMN     "isbn10" TEXT,
  ADD COLUMN     "publisherName" TEXT,
  ADD COLUMN     "publicationDate" TIMESTAMP(3),
  ADD COLUMN     "edition" TEXT,
  ADD COLUMN     "bookFormat" "BookFormat";

-- CreateTable
CREATE TABLE "BookAsset" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL DEFAULT 'LOCAL',
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "hash" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookAsset_bookId_assetType_idx" ON "BookAsset"("bookId", "assetType");

-- AddForeignKey
ALTER TABLE "BookAsset" ADD CONSTRAINT "BookAsset_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('ACTIVE', 'REFUNDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('STANDARD');

-- CreateTable
CREATE TABLE "Reader" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "walletAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReaderLibrary" (
    "id" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "accessStatus" "AccessStatus" NOT NULL DEFAULT 'ACTIVE',
    "licenseType" "LicenseType" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReaderLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reader_email_key" ON "Reader"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderLibrary_saleId_key" ON "ReaderLibrary"("saleId");

-- CreateIndex
CREATE INDEX "ReaderLibrary_readerId_idx" ON "ReaderLibrary"("readerId");

-- CreateIndex
CREATE INDEX "ReaderLibrary_bookId_idx" ON "ReaderLibrary"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "ReaderLibrary_readerId_bookId_key" ON "ReaderLibrary"("readerId", "bookId");

-- AddForeignKey
ALTER TABLE "ReaderLibrary" ADD CONSTRAINT "ReaderLibrary_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "Reader"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderLibrary" ADD CONSTRAINT "ReaderLibrary_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReaderLibrary" ADD CONSTRAINT "ReaderLibrary_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

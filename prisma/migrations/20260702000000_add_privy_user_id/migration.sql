-- AlterTable
ALTER TABLE "Author" ADD COLUMN "privyUserId" TEXT;

-- AlterTable
ALTER TABLE "Reader" ADD COLUMN "privyUserId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Author_privyUserId_key" ON "Author"("privyUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Reader_privyUserId_key" ON "Reader"("privyUserId");

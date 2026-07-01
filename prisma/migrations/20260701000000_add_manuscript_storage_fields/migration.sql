-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('LOCAL', 'S3', 'IPFS', 'ARWEAVE');

-- AlterTable
ALTER TABLE "BookFile"
  ALTER COLUMN "fileUrl" DROP NOT NULL,
  ADD COLUMN     "storageKey" TEXT,
  ADD COLUMN     "storageProvider" "StorageProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT true;

-- Add optional author gender for marketplace filtering.
ALTER TABLE "Author"
ADD COLUMN "gender" TEXT;

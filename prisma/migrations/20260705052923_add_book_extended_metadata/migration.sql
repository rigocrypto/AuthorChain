-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "acknowledgments" TEXT,
ADD COLUMN     "audience" TEXT,
ADD COLUMN     "collaborators" TEXT,
ADD COLUMN     "contributors" TEXT,
ADD COLUMN     "coverDesignerName" TEXT,
ADD COLUMN     "editorName" TEXT,
ADD COLUMN     "illustratorName" TEXT,
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "readingTimeMinutes" INTEGER,
ADD COLUMN     "topics" TEXT,
ADD COLUMN     "translatorName" TEXT,
ADD COLUMN     "whatYouWillLearn" TEXT;

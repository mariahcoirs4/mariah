-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "focusKeywords" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "featuredImageAlt" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "authorName" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "authorRole" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "authorBio" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "authorAvatar" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "category" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "tags" TEXT;
ALTER TABLE "Blog" ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
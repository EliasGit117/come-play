/*
  Warnings:

  - You are about to drop the column `content` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `news` table. All the data in the column will be lost.
  - Added the required column `content_ro` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_ru` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ro` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ru` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "news_title_link_idx";

-- AlterTable
ALTER TABLE "news" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "content_ro" TEXT NOT NULL,
ADD COLUMN     "content_ru" TEXT NOT NULL,
ADD COLUMN     "title_ro" TEXT NOT NULL,
ADD COLUMN     "title_ru" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "news_title_ro_title_ru_link_idx" ON "news"("title_ro", "title_ru", "link");

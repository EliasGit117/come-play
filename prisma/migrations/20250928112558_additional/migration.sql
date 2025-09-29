/*
  Warnings:

  - Added the required column `size` to the `news_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `news_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."news_images" ADD COLUMN     "height" INTEGER,
ADD COLUMN     "original_name" TEXT,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER;

-- CreateIndex
CREATE INDEX "news_images_newsId_idx" ON "public"."news_images"("newsId");

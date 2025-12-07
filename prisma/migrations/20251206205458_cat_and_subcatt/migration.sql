/*
  Warnings:

  - A unique constraint covering the columns `[categoryId,slug]` on the table `subcategories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."subcategories" DROP CONSTRAINT "subcategories_categoryId_fkey";

-- DropIndex
DROP INDEX "public"."subcategories_slug_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description_ro" TEXT,
ADD COLUMN     "description_ru" TEXT;

-- AlterTable
ALTER TABLE "subcategories" ADD COLUMN     "description_ro" TEXT,
ADD COLUMN     "description_ru" TEXT,
ALTER COLUMN "categoryId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_categoryId_slug_key" ON "subcategories"("categoryId", "slug");

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Made the column `price` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."product_images_productId_idx";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL;

-- CreateIndex
CREATE INDEX "product_images_productId_order_idx" ON "product_images"("productId", "order");

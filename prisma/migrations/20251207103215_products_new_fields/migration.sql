-- CreateEnum
CREATE TYPE "ProductState" AS ENUM ('available', 'not_available', 'out_of_stock');

-- CreateEnum
CREATE TYPE "ProductSticker" AS ENUM ('new', 'sale');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "old_price" DECIMAL(65,30),
ADD COLUMN     "price" DECIMAL(65,30),
ADD COLUMN     "rich_content_ro" TEXT,
ADD COLUMN     "rich_content_ru" TEXT,
ADD COLUMN     "short_description_ro" TEXT,
ADD COLUMN     "short_description_ru" TEXT,
ADD COLUMN     "state" "ProductState" NOT NULL DEFAULT 'available',
ADD COLUMN     "sticker" "ProductSticker";

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "thumbhash" BYTEA,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "original_name" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "productId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_images_productId_idx" ON "product_images"("productId");

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

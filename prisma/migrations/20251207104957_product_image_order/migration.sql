/*
  Warnings:

  - Added the required column `order` to the `product_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "order" INTEGER NOT NULL;

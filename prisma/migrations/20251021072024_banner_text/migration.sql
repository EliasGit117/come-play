-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "text_ro" TEXT,
ADD COLUMN     "text_ru" TEXT,
ALTER COLUMN "title_ro" DROP NOT NULL,
ALTER COLUMN "title_ru" DROP NOT NULL,
ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "banners_order_seq";

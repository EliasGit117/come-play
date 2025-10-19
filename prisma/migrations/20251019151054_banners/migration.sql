-- CreateEnum
CREATE TYPE "BannerImageType" AS ENUM ('desktop', 'tablet', 'mobile');

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "title_ro" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "path" TEXT,
    "order" SERIAL NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "thumbhash" BYTEA,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "original_name" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "image_type" "BannerImageType" NOT NULL,
    "desktop_banner_id" INTEGER,
    "tablet_banner_id" INTEGER,
    "mobile_banner_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banners_order_key" ON "banners"("order");

-- CreateIndex
CREATE INDEX "banners_is_active_order_idx" ON "banners"("is_active", "order");

-- CreateIndex
CREATE UNIQUE INDEX "banner_images_desktop_banner_id_key" ON "banner_images"("desktop_banner_id");

-- CreateIndex
CREATE UNIQUE INDEX "banner_images_tablet_banner_id_key" ON "banner_images"("tablet_banner_id");

-- CreateIndex
CREATE UNIQUE INDEX "banner_images_mobile_banner_id_key" ON "banner_images"("mobile_banner_id");

-- CreateIndex
CREATE INDEX "banner_images_desktop_banner_id_tablet_banner_id_mobile_ban_idx" ON "banner_images"("desktop_banner_id", "tablet_banner_id", "mobile_banner_id");

-- AddForeignKey
ALTER TABLE "banner_images" ADD CONSTRAINT "banner_images_desktop_banner_id_fkey" FOREIGN KEY ("desktop_banner_id") REFERENCES "banners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_images" ADD CONSTRAINT "banner_images_tablet_banner_id_fkey" FOREIGN KEY ("tablet_banner_id") REFERENCES "banners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_images" ADD CONSTRAINT "banner_images_mobile_banner_id_fkey" FOREIGN KEY ("mobile_banner_id") REFERENCES "banners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

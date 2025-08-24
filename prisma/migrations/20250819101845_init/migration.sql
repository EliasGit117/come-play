-- CreateEnum
CREATE TYPE "public"."NewsStatus" AS ENUM ('published', 'hidden');

-- CreateTable
CREATE TABLE "public"."news" (
    "id" SERIAL NOT NULL,
    "title_ro" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content_ro" TEXT,
    "content_ru" TEXT,
    "status" "public"."NewsStatus" NOT NULL DEFAULT 'hidden',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "public"."news"("slug");

-- CreateIndex
CREATE INDEX "news_title_ro_title_ru_slug_status_idx" ON "public"."news"("title_ro", "title_ru", "slug", "status");

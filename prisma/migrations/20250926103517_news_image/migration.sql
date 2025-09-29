-- CreateTable
CREATE TABLE "public"."news_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "thumbhash" BYTEA,
    "newsId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "news_images_newsId_key" ON "public"."news_images"("newsId");

-- AddForeignKey
ALTER TABLE "public"."news_images" ADD CONSTRAINT "news_images_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "public"."news"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

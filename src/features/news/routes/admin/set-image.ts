import { z } from 'zod';
import { type } from '@orpc/server';
import { UTFile } from 'uploadthing/server';
import sharp from 'sharp';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { newsAdminBase, newsAdminPath } from './base';
import { AdminNewsImageDtoFactory, IAdminNewsImageDto } from '@/features/news/dtos/admin-news-image-dto';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';
import { generateNewsImageName, removeImageFromNews } from '@/features/news/services/news-image-service';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const setNewsImageSchema = z.object({
  newsId: z.number(),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File size must not exceed 2MB' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: 'Only .jpg, .png, .webp, .gif files are allowed' }),
});

export const adminNewsSetImage = newsAdminBase
  .route({
    method: 'POST',
    path: `${newsAdminPath}/set-image`,
    summary: 'Set news image',
    description: 'Uploads and attaches an image to a news entry',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(setNewsImageSchema)
  .output(type<IAdminNewsImageDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { news: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const news = await prisma.news.findUnique({ where: { id: data.newsId } });
    if (!news)
      throw errors.NOT_FOUND({ message: `News with id=${data.newsId} not found` });

    const existingImage = await prisma.newsImage.findUnique({ where: { newsId: data.newsId } });
    if (existingImage)
      await removeImageFromNews(data.newsId);

    const originalFile = data.file;
    const origBuffer = Buffer.from(await originalFile.arrayBuffer());

    const metadata = await sharp(origBuffer).metadata();
    if (!metadata.width || !metadata.height)
      throw new Error('Could not extract image dimensions');

    const conversionRes = await convertToModernImage(origBuffer, originalFile.name, 'webp');
    const { buffer: finalBuffer, mimeType, filename, width, height } = conversionRes;
    const optimisedFile = new File([new Uint8Array(finalBuffer)], filename, { type: mimeType });

    const thumbhash = await createThumbhashFromFile(optimisedFile);
    const name = generateNewsImageName(filename, data.newsId);

    const placeholder = await prisma.newsImage.create({
      data: {
        url: '',
        type: mimeType,
        size: finalBuffer.length,
        originalName: name,
        newsId: data.newsId,
        width: width,
        height: height,
        thumbhash: thumbhash,
      },
    });

    try {
      const utFile = new UTFile([optimisedFile], name, { customId: `news-banner-${placeholder.id}` });
      const uploadRes = await utapi.uploadFiles(utFile);
      if (!uploadRes.data?.ufsUrl)
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('File upload failed');

      const updated = await prisma.newsImage.update({
        where: { id: placeholder.id },
        data: { url: uploadRes.data.ufsUrl },
      });

      return AdminNewsImageDtoFactory.fromEntity(updated);
    } catch (e) {
      await prisma.newsImage.delete({ where: { id: placeholder.id } });
      throw e;
    }
  });

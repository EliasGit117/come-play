import { z } from 'zod';
import { type } from '@orpc/server';
import { BannerImageType } from '@prisma/client';
import { UTFile } from 'uploadthing/server';
import sharp from 'sharp';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { bannersAdminBase, bannersAdminPath } from './base';
import { AdminBannerImageDtoFactory, IAdminBannerImageDto } from '@/features/banners/dtos/admin-banner-image-dto';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';
import { bannerImageFieldMap, generateBannerImageName, removeBannerImage } from '@/features/banners/services/banner-image-service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const setBannerImageSchema = z.object({
  bannerId: z.number(),
  imageType: z.nativeEnum(BannerImageType),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File size must not exceed 5MB' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: 'Only .jpg, .png, .webp, .gif files are allowed' }),
});

export const adminBannersSetImage = bannersAdminBase
  .route({
    method: 'POST',
    path: `${bannersAdminPath}/set-image`,
    summary: 'Set banner image',
    description: 'Uploads and attaches an image of the given type to a banner',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {} })
  .use(authMiddleware)
  .input(setBannerImageSchema)
  .output(type<IAdminBannerImageDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { banners: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const banner = await prisma.banner.findUnique({ where: { id: data.bannerId } });
    if (!banner)
      throw errors.NOT_FOUND({ message: `Banner with id=${data.bannerId} not found` });

    await removeBannerImage(data.bannerId, data.imageType);

    const originalFile = data.file;
    const origBuffer = Buffer.from(await originalFile.arrayBuffer());

    const metadata = await sharp(origBuffer).metadata();
    if (!metadata.width || !metadata.height)
      throw new Error('Could not extract image dimensions');

    const conversionRes = await convertToModernImage(origBuffer, originalFile.name, 'webp');
    const { buffer: finalBuffer, mimeType, filename, width, height } = conversionRes;
    const optimisedFile = new File([new Uint8Array(finalBuffer)], filename, { type: mimeType });

    const thumbhash = await createThumbhashFromFile(optimisedFile);

    const name = generateBannerImageName(filename, data.bannerId, data.imageType);

    const placeholder = await prisma.bannerImage.create({
      data: {
        url: '',
        type: mimeType,
        size: finalBuffer.length,
        originalName: name,
        width: width,
        height: height,
        imageType: data.imageType,
        thumbhash: thumbhash,
        [bannerImageFieldMap[data.imageType]]: data.bannerId,
      },
    });

    try {
      const utFile = new UTFile([optimisedFile], name, { customId: `banner-${[bannerImageFieldMap[data.imageType]]}-${placeholder.id}` });
      const uploadRes = await utapi.uploadFiles(utFile);

      if (!uploadRes.data?.url)
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('File upload failed');

      const updated = await prisma.bannerImage.update({
        where: { id: placeholder.id },
        data: { url: uploadRes.data.url },
      });

      return AdminBannerImageDtoFactory.fromEntity(updated);
    } catch (e) {
      await prisma.bannerImage.delete({ where: { id: placeholder.id } });
      throw e;
    }
  });

import { z } from 'zod';
import { type } from '@orpc/server';
import { UTFile } from 'uploadthing/server';
import sharp from 'sharp';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { auth } from '@/lib/auth/server';
import { authMiddleware } from '@/lib/auth/middleware';
import { productsAdminBase, productsAdminPath } from './base';
import { AdminProductImageDtoFactory, IAdminProductImageDto } from '@/features/products/dtos/admin-product-image-dto';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_PRODUCT = 10;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const addProductImageSchema = z.object({
  productId: z.number(),
  file: z
    .instanceof(File)
    .refine((f) => f.size <= MAX_FILE_SIZE, 'File size must not exceed 5MB')
    .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), 'Only JPG, PNG, WEBP, or GIF are allowed'),
});

export const adminProductsAddImage = productsAdminBase
  .route({
    method: 'POST',
    path: `${productsAdminPath}/add-image`,
    summary: 'Add product image',
    description: 'Uploads and attaches an image to a product',
  })
  .errors({ FORBIDDEN: {}, NOT_FOUND: {}, BAD_REQUEST: {} })
  .use(authMiddleware)
  .input(addProductImageSchema)
  .output(type<IAdminProductImageDto>())
  .handler(async ({ input: data, context: { user }, errors }) => {
    const { success } = await auth.api.userHasPermission({
      body: { userId: user.id, permissions: { products: ['update'] } },
    });

    if (!success)
      throw errors.FORBIDDEN();

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { images: true },
    });

    if (!product)
      throw errors.NOT_FOUND({ message: `Product with id=${data.productId} not found` });

    if (product.images.length >= MAX_IMAGES_PER_PRODUCT)
      throw errors.BAD_REQUEST({ message: `Cannot add more than ${MAX_IMAGES_PER_PRODUCT} images per product` });

    const originalFile = data.file;
    const origBuffer = Buffer.from(await originalFile.arrayBuffer());

    const metadata = await sharp(origBuffer).metadata();
    if (!metadata.width || !metadata.height)
      throw new Error('Unable to read image dimensions');

    const { buffer: finalBuffer, mimeType, filename, width, height } =
      await convertToModernImage(origBuffer, originalFile.name, 'webp');

    const optimisedFile = new File([new Uint8Array(finalBuffer)], filename, { type: mimeType });

    const thumbhash = await createThumbhashFromFile(optimisedFile);

    const newOrder =
      (await prisma.productImage.count({ where: { productId: data.productId } })) + 1;

    const placeholder = await prisma.productImage.create({
      data: {
        url: '',
        type: mimeType,
        size: finalBuffer.length,
        originalName: filename,
        width,
        height,
        thumbhash,
        productId: data.productId,
        order: newOrder,
      },
    });

    try {
      const utFile = new UTFile([optimisedFile], filename, { customId: `product-${placeholder.id}` });
      const res = await utapi.uploadFiles(utFile);

      if (!res.data?.url)
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('File upload failed');

      const updated = await prisma.productImage.update({
        where: { id: placeholder.id },
        data: { url: res.data.url },
      });

      return AdminProductImageDtoFactory.fromEntity(updated);
    } catch (error) {
      await prisma.productImage.delete({ where: { id: placeholder.id } });
      throw error;
    }
  });

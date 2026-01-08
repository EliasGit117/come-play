import { createServerFn } from '@tanstack/react-start';
import { zfd } from 'zod-form-data';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import sharp from 'sharp';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { UTFile } from 'uploadthing/server';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';
import { AdminProductImageDtoFactory } from '@/features/products/dtos/admin-product-image-dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES_PER_PRODUCT = 10;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const addProductImageSchema = zfd.formData({
  productId: zfd.numeric(),
  file: zfd
    .file()
    .refine((f) => f.size <= MAX_FILE_SIZE, 'File size must not exceed 5MB')
    .refine(
      (f) => ACCEPTED_IMAGE_TYPES.includes(f.type),
      'Only JPG, PNG, WEBP, or GIF are allowed'
    )
});

export const addProductImage = createServerFn({ method: 'POST' })
  .inputValidator(addProductImageSchema)
  .handler(async ({ data }) => {
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { images: true }
    });

    if (!product) {
      throw new Error(`Product with id=${data.productId} not found`);
    }

    // Enforce max images constraint
    if (product.images.length >= MAX_IMAGES_PER_PRODUCT) {
      throw new Error(`Cannot add more than ${MAX_IMAGES_PER_PRODUCT} images per product`);
    }

    const originalFile = data.file;
    const origBuffer = Buffer.from(await originalFile.arrayBuffer());

    const metadata = await sharp(origBuffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Unable to read image dimensions');
    }

    const { buffer: finalBuffer, mimeType, filename, width, height } =
      await convertToModernImage(origBuffer, originalFile.name, 'webp');

    const optimisedFile = new File([new Uint8Array(finalBuffer)], filename, {
      type: mimeType
    });

    const thumbhash = await createThumbhashFromFile(optimisedFile);

    // Calculate new order value
    const newOrder =
      (await prisma.productImage.count({
        where: { productId: data.productId }
      })) + 1;

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
        order: newOrder
      }
    });

    try {
      const utFile = new UTFile([optimisedFile], filename, {
        customId: `product-${placeholder.id}`
      });
      const res = await utapi.uploadFiles(utFile);

      if (!res.data?.url) {
        throw new Error('File upload failed');
      }

      const updated = await prisma.productImage.update({
        where: { id: placeholder.id },
        data: { url: res.data.url }
      });

      return AdminProductImageDtoFactory.fromEntity(updated);
    } catch (error) {
      await prisma.productImage.delete({ where: { id: placeholder.id } });
      throw error;
    }
  });

// React hook
type TParams = { productId: number; file: File };
type TResult = Awaited<ReturnType<typeof addProductImage>>;
type TOptions = Omit<UseMutationOptions<TResult, Error, TParams>, 'mutationFn'>;

export const useAddProductImageMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation<TResult, Error, TParams>({
    mutationKey: ['products', 'image', 'add'],
    mutationFn: async ({ productId, file }) => {
      const formData = new FormData();
      formData.append('productId', String(productId));
      formData.append('file', file, file.name);
      return addProductImage({ data: formData });
    },
    ...options,
    onSuccess: (data, variables, ...ctx) => {
      void queryClient.invalidateQueries({
        queryKey: ['product', variables.productId]
      });
      options?.onSuccess?.(data, variables, ...ctx);
    }
  });
};
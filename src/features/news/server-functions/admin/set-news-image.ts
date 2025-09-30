import { createServerFn } from '@tanstack/react-start';
import { UTFile } from 'uploadthing/server';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AdminNewsImageDtoFactory } from '@/features/news/dtos/admin-news-image-dto';
import { zfd } from 'zod-form-data';
import sharp from 'sharp';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';
import { removeImageFromNews } from '@/features/news/server-functions/admin/remove-image-from-news';


// Constants
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];


// Schema
export const setNewsImageSchema = zfd.formData({
  newsId: zfd.numeric(),
  file: zfd.file()
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File size must not exceed 2MB' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: 'Only .jpg, .png, .webp, .gif files are allowed' })
});


// Server Function
export const setNewsImage = createServerFn({ method: 'POST' })
  .validator(setNewsImageSchema)
  .handler(async ({ data }) => {
    const news = await prisma.news.findUnique({ where: { id: data.newsId } });
    if (!news)
      throw new Error(`News with id=${data.newsId} not found`);

    const existingImage = await prisma.newsImage.findUnique({ where: { newsId: data.newsId } });
    if (!!existingImage)
      await removeImageFromNews(data.newsId);

    const originalFile = data.file;
    const origBuffer = Buffer.from(await originalFile.arrayBuffer());

    const metadata = await sharp(origBuffer).metadata();
    if (!metadata.width || !metadata.height)
      throw new Error('Could not extract image dimensions');

    const conversionRes = await convertToModernImage(origBuffer, originalFile.name, 'webp');
    const { buffer: finalBuffer, mimeType, filename, width, height } = conversionRes;
    const optimisedFile = new File([finalBuffer], filename, { type: mimeType });

    const thumbhash = await createThumbhashFromFile(optimisedFile);

    const placeholder = await prisma.newsImage.create({
      data: {
        url: '',
        type: mimeType,
        size: finalBuffer.length,
        originalName: filename,
        newsId: data.newsId,
        width: width,
        height: height,
        thumbhash: thumbhash
      }
    });

    try {
      const utFile = new UTFile([optimisedFile], optimisedFile.name, { customId: `${placeholder.id}` });
      const uploadRes = await utapi.uploadFiles(utFile);
      if (!uploadRes.data?.ufsUrl)
        // noinspection ExceptionCaughtLocallyJS
        throw new Error('File upload failed');


      await prisma.newsImage.update({ where: { id: placeholder.id }, data: { url: uploadRes.data.ufsUrl } });

    } catch (e) {
      await prisma.newsImage.delete({ where: { id: placeholder.id } });
      throw e;
    }

    const final = await prisma.newsImage.findUnique({ where: { id: placeholder.id } });
    if (!final) throw new Error('Something went wrong - image disappeared');

    return AdminNewsImageDtoFactory.fromEntity(final);
  });

// React Hook
type TParams = { file: File; newsId: number };
type TReturn = Awaited<ReturnType<typeof setNewsImage>>;
type TOptions = Omit<UseMutationOptions<TReturn, Error, TParams>, 'mutationFn'>;

export const useSetNewsImageMutation = (options?: TOptions) => {

  return useMutation<TReturn, Error, TParams>({
    mutationKey: ['news', 'image', 'set'],
    mutationFn: async ({ file, newsId }) => {
      const formData = new FormData();
      formData.append('newsId', String(newsId));
      formData.append('file', file, appendIdToFilename(file.name, newsId));

      return setNewsImage({ data: formData });
    },
    ...options
  });
};


// Helper to append ID to filename (for client-side FormData)
export function appendIdToFilename(filename: string, id: string | number) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1) return `${filename}-${id}`;

  const name = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);
  return `${name}-${id}${extension}`;
}

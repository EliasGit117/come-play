import { createServerFn } from '@tanstack/react-start';
import { UTFile } from 'uploadthing/server';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { utapi } from '@/lib/upload-thing';
import { zfd } from 'zod-form-data';
import prisma from '@/lib/prisma';


// Schema
export const setNewsImageSchema = zfd.formData({
  id: zfd.numeric(),
  file: zfd.file().refine((file) => file.size <= MAX_FILE_SIZE,
    { message: 'File size must not exceed 2MB' }
  ).refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    { message: 'Only .jpg, .png, .webp, .gif files are allowed' }
  )
});

// Define the server function
export const setNewsImage = createServerFn({ method: 'POST' })
  .validator(setNewsImageSchema)
  .handler(async ({ data }) => {
    const imageAlreadyExists = await prisma.newsImage.findFirst({ where: { id: data.id } });
    if (!imageAlreadyExists)
      throw new Error('Image already exists');

    const file = data.file;
    const utFile = new UTFile([file], file.name, { customId: `${data.id}` });

    const response = await utapi.uploadFiles(utFile);

    if (!response.data?.ufsUrl)
      throw new Error('File upload failed');

    const url = response.data.ufsUrl;

    const result = await prisma.$transaction(async (tx) => {
      return await tx.newsImage.create({
        data: {
          url: url,
          type: file.type,
          size: file.size,
          originalName: file.name,
          news: { connect: { id: data.id } }
        }
      });
    });

    return { url: url, imageId: result.id };
  });


// React Hook
type TParams = { file: File; id: number };
type TReturn = Awaited<ReturnType<typeof setNewsImage>>;
type TOptions = Omit<UseMutationOptions<TReturn, Error, TParams>, 'mutationFn'>;

export const useSetNewsImageMutation = (options?: TOptions) => {
  return useMutation<TReturn, Error, TParams>({
    mutationKey: ['news', 'image', 'set'],
    mutationFn: async ({ file, id }) => {
      const formData = new FormData();
      formData.append('id', String(id));
      formData.append('file', file, appendIdToFilename(file.name, id));

      return setNewsImage({ data: formData });
    },
    ...options
  });
};


// Helpers
function appendIdToFilename(filename: string, id: string | number) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1)
    return `${filename}-${id}`;

  const name = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);

  return `${name}-${id}${extension}`;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

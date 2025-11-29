import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import prisma from '@/lib/prisma';
import { utapi } from '@/lib/upload-thing';
import { zfd } from 'zod-form-data';
import sharp from 'sharp';
import { BannerImageType } from '@prisma/client';
import { AdminBannerImageDtoFactory } from '@/features/banners/dtos/admin-banner-image-dto';
import { removeBannerImage } from './remove-banner-image';
import { createThumbhashFromFile } from '@/utils/thumbhash';
import { convertToModernImage } from '@/utils/image-conversion';
import { UTFile } from 'uploadthing/server';

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const setBannerImageSchema = zfd.formData({
  bannerId: zfd.numeric(),
  imageType: zfd.text().transform((val) => val as BannerImageType),
  file: zfd.file()
    .refine((file) => file.size <= MAX_FILE_SIZE, { message: 'File size must not exceed 5MB' })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), { message: 'Only .jpg, .png, .webp, .gif files are allowed' })
});

export const setBannerImage = createServerFn({ method: 'POST' })
  .inputValidator(setBannerImageSchema)
  .handler(async ({ data }) => {
    const banner = await prisma.banner.findUnique({ where: { id: data.bannerId } });
    if (!banner)
      throw new Error(`Banner with id=${data.bannerId} not found`);

    // Remove existing image if present
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

    const fieldMap = {
      [BannerImageType.desktop]: 'desktopBannerId',
      [BannerImageType.tablet]: 'tabletBannerId',
      [BannerImageType.mobile]: 'mobileBannerId'
    };

    const name = generateName(filename, data.bannerId, data.imageType);

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
        [fieldMap[data.imageType]]: data.bannerId
      }
    });

    try {
      const utFile = new UTFile([optimisedFile], name, { customId: `banner-${[fieldMap[data.imageType]]}-${placeholder.id}` });
      const uploadRes = await utapi.uploadFiles(utFile);

      if (!uploadRes.data?.url)
        throw new Error('File upload failed');

      const updated = await prisma.bannerImage.update({
        where: { id: placeholder.id },
        data: { url: uploadRes.data.url }
      });

      return AdminBannerImageDtoFactory.fromEntity(updated);
    } catch (e) {
      await prisma.bannerImage.delete({ where: { id: placeholder.id } });
      throw e;
    }
  });

type TParams = { bannerId: number; imageType: BannerImageType; file: File };
type TReturn = Awaited<ReturnType<typeof setBannerImage>>;
type TOptions = Omit<UseMutationOptions<TReturn, Error, TParams>, 'mutationFn'>;

export const useSetBannerImageMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation<TReturn, Error, TParams>({
    mutationKey: ['banners', 'image', 'upload'],
    mutationFn: async ({ bannerId, imageType, file }) => {
      const formData = new FormData();
      formData.append('bannerId', String(bannerId));
      formData.append('imageType', imageType);
      formData.append('file', file, file.name);

      return setBannerImage({ data: formData });
    },
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated'
      });
      void queryClient.refetchQueries({
        predicate: (query) =>
          query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated'
      });
      void queryClient.invalidateQueries({ queryKey: ['banners', variables.bannerId] });
      void queryClient.refetchQueries({ queryKey: ['banners', variables.bannerId] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

function generateName(filename: string, id: string | number, imageType: BannerImageType) {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex === -1)
    throw new Error(`File name doesn't have file extension`);

  const extension = filename.slice(lastDotIndex);
  return `banner-${id}-${imageType}${extension}`;
}
import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';

export const editBannerSchema = z.object({
  id: z.number(),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  path: z.string().regex(/^[a-zA-Z0-9-/]+$/).min(3).max(1000).optional().or(z.literal('')),
  order: z.number().int().min(0),
  isActive: z.boolean()
});

export type TEditBannerSchema = z.infer<typeof editBannerSchema>;

export const editBanner = createServerFn({ method: 'GET' })
  .inputValidator(editBannerSchema)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;

    const res = await prisma.banner.update({
      where: { id },
      data: {
        ...updateData,
        path: updateData.path || null
      }
    });

    return IAdminBannerDtoFactory.fromEntity(res);
  });

type TParams = Parameters<typeof editBanner>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminBannerDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useEditBannerMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['banners', 'edit'],
    mutationFn: (values) => editBanner({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated'
      });
      void queryClient.invalidateQueries({ queryKey: ['banners', data.id] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
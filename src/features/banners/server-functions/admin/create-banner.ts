import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminBannerDto, IAdminBannerDtoFactory } from '@/features/banners/dtos/admin-banner-dto';


export const createBannerSchema = z.object({
  path: z.string().regex(/^[a-zA-Z0-9-/]+$/).min(3).max(1000),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  editAfterCreation: z.boolean()
});

export type TCreateBannerSchema = z.infer<typeof createBannerSchema>;

export const createBanner = createServerFn({ method: 'POST' })
  .inputValidator(createBannerSchema)
  .handler(async ({ data }) => {
    const banner = await prisma.$transaction(async (tx) => {
      const maxOrder = await tx.banner.aggregate({
        _max: { order: true }
      });

      return tx.banner.create({
        data: {
          titleRo: data.titleRo,
          titleRu: data.titleRu,
          path: data.path || null,
          order: (maxOrder._max.order ?? 0) + 1,
          isActive: false
        }
      });
    });

    return IAdminBannerDtoFactory.fromEntity(banner);
  });

// React hook
type TParams = Parameters<typeof createBanner>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminBannerDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateBannerMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['banners', 'create'],
    mutationFn: (values) => createBanner({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'banners' && query.queryKey[1] === 'paginated' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
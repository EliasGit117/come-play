import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

export const reorderBannersSchema = z.object({
  bannerIds: z.array(z.number())
});

export type TReorderBannersSchema = z.infer<typeof reorderBannersSchema>;

export const reorderBanners = createServerFn({ method: 'POST' })
  .inputValidator(reorderBannersSchema)
  .handler(async ({ data }) => {
    await prisma.$transaction(
      data.bannerIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index }
        })
      )
    );

    return { success: true };
  });

type TParams = Parameters<typeof reorderBanners>[0]['data'];
type TOptions = Omit<UseMutationOptions<{ success: boolean }, Error, TParams>, 'mutationFn'>;

export const useReorderBannersMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['banners', 'reorder'],
    mutationFn: (values) => reorderBanners({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'banners'
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
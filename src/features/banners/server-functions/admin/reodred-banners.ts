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
    const { bannerIds } = data;

    // 1. Basic sanity checks
    if (bannerIds.length === 0)
      throw new Error('No banners provided for reordering');

    // Ensure no duplicates
    const uniqueIds = new Set(bannerIds);
    if (uniqueIds.size !== bannerIds.length)
      throw new Error('Duplicate banner IDs are not allowed');

    // 2. Query all current banners
    const existingBanners = await prisma.banner.findMany({
      select: { id: true },
      orderBy: { order: 'asc' }
    });

    // 3. Count check
    if (existingBanners.length !== bannerIds.length)
      throw new Error(`Banner count mismatch — expected ${existingBanners.length}, got ${bannerIds.length}`);

    // 4. Validate that all provided IDs actually exist in DB
    const existingIds = new Set(existingBanners.map((b) => b.id));
    const invalidIds = bannerIds.filter((id) => !existingIds.has(id));

    if (invalidIds.length > 0)
      throw new Error(`Invalid banner IDs: ${invalidIds.join(', ')}`);

    // 5. Check valid index range (1-based)
    // By this point, bannerIds are guaranteed valid and the length matches.
    // Still, we validate range for safety.
    bannerIds.forEach((_, index) => {
      const order = index + 1;
      if (order < 1 || order > bannerIds.length)
        throw new Error(`Invalid order index: ${order}`);
    });

    // 6. Transaction: apply new ordering
    await prisma.$transaction(
      bannerIds.map((id, index) =>
        prisma.banner.update({
          where: { id },
          data: { order: index + 1 }
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
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'banners' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
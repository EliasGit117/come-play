import { z } from 'zod';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getBannersForAdminSchema = z.object({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'path', 'order', 'isActive'])
    .optional()
    .catch(undefined),
  dir: z.enum(['asc', 'desc']).optional(),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  path: z.string().optional().catch(undefined),
  isActive: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
  images: z.array(z.enum(['desktop', 'tablet', 'mobile'])).optional().catch(undefined),
});

export type TGetBannersForAdminSchema = z.infer<typeof getBannersForAdminSchema>;

export const deleteBannerByIdSchema = z.object({ id: z.number().int().positive() });
export const deleteBannersByIdsSchema = z.object({ ids: z.array(z.number()) });
export const reorderBannersSchema = z.object({ bannerIds: z.array(z.number()) });

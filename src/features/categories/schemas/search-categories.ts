import { z } from 'zod';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getCategoriesPaginatedForAdminSchema = paginatedSchema.extend({
  limit: z.number().int().min(1).max(10000).optional().catch(10),
  order: z.enum(['id', 'createdAt', 'updatedAt', 'slug']).optional().catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
});

export type TGetCategoriesPaginatedParamsForAdmin = z.infer<typeof getCategoriesPaginatedForAdminSchema>;

export const deleteCategoriesByIdsSchema = z.object({
  ids: z.array(z.number()),
});

export type TDeleteCategoriesByIdsParams = z.infer<typeof deleteCategoriesByIdsSchema>;

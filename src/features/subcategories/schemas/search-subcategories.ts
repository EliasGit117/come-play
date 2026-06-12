import { z } from 'zod';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getSubcategoriesPaginatedForAdminSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'slug', 'categoryId']).optional().catch(undefined),
  id: z.number().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  categoryId: z.number().optional().catch(undefined),
  categoryName: z.string().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
});

export type TGetSubcategoriesPaginatedForAdminSchema = z.infer<typeof getSubcategoriesPaginatedForAdminSchema>;

export const deleteSubcategoriesByIdsSchema = z.object({
  ids: z.array(z.number()),
});

export type TDeleteSubcategoriesByIdsSchema = z.infer<typeof deleteSubcategoriesByIdsSchema>;

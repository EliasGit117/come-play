import { z } from 'zod';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getProductsForAdminSchema = z.object({
  order: z
    .enum(['id', 'nameRo', 'nameRu', 'slug', 'price', 'state', 'hidden', 'createdAt', 'updatedAt'])
    .optional()
    .catch(undefined),
  dir: z.enum(['asc', 'desc']).optional(),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  nameRo: z.string().optional().catch(undefined),
  nameRu: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  state: z.enum(['available', 'not_available', 'out_of_stock']).optional().catch(undefined),
  hidden: z.boolean().optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
});

export type TGetProductsForAdminSchema = z.infer<typeof getProductsForAdminSchema>;

export const deleteProductsByIdsSchema = z.object({
  ids: z.array(z.number()),
});

export type TDeleteProductsByIdsParams = z.infer<typeof deleteProductsByIdsSchema>;

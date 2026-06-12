import { z } from 'zod';
import { NewsStatus } from '@prisma/client';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getNewsPaginatedForAdminSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'slug', 'status']).optional().catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  title: z.string().optional().catch(undefined),
  slug: z.string().optional().catch(undefined),
  status: z.union([z.nativeEnum(NewsStatus), z.array(z.nativeEnum(NewsStatus))])
    .optional()
    .catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
  hasImage: z.boolean().optional().catch(undefined),
});

export type TGetNewsPaginatedParamsForAdmin = z.infer<typeof getNewsPaginatedForAdminSchema>;

export const deleteNewsByIdSchema = z.object({ id: z.number() });
export const deleteNewsByIdsSchema = z.object({ ids: z.array(z.number()) });

export const getNewsPaginatedSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'title', 'slug', 'status']).optional().catch(undefined),
  title: z.string().optional().catch(undefined),
});

export type TGetNewsPaginatedParams = z.infer<typeof getNewsPaginatedSchema>;

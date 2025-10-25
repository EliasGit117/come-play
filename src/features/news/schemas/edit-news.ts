import { z } from 'zod'
import { newsBaseSchema } from '@/features/news/schemas/news';
import { NewsStatus } from '@prisma/client';

export const editNewsSchema = newsBaseSchema.extend({
  id: z.number(),
  status: z.nativeEnum(NewsStatus),
  contentRo: z.string().max(10240).optional(),
  contentRu: z.string().max(10240).optional(),
});

export type TEditNewsSchema = z.infer<typeof editNewsSchema>;
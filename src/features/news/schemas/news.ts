import { z } from 'zod';

export const newsBaseSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
});

export type TNewsBaseSchema = z.infer<typeof newsBaseSchema>;
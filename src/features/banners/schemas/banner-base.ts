import { z } from 'zod'

export const bannerBaseSchema = z.object({
  path: z.string().regex(/^[a-zA-Z0-9-/]+$/).max(1000).optional(),
  title: z.string().min(3).max(128),
  titleRo: z.string().max(128).optional(),
  titleRu: z.string().max(128).optional(),
  textRu: z.string().max(512).optional(),
  textRo: z.string().max(512).optional(),
});

export type TBannerBaseSchema = z.infer<typeof bannerBaseSchema>;

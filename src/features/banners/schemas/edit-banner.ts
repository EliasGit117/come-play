import { z } from 'zod'
import { bannerBaseSchema } from '@/features/banners/schemas/banner-base';

export const editBannerSchema = bannerBaseSchema.extend({
  id: z.number(),
  isActive: z.boolean()
});

export type TEditBannerSchema = z.infer<typeof editBannerSchema>;

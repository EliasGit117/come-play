import { z } from 'zod'
import { bannerBaseSchema } from '@/features/banners/schemas/banner-base';

export const createBannerSchema = bannerBaseSchema.extend({
  isActive: z.boolean()
});

export type TCreateBannerSchema = z.infer<typeof createBannerSchema>;

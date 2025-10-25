import { z } from 'zod'
import { bannerBaseSchema } from '@/features/banners/schemas/banner-base';

export const createBannerSchema = bannerBaseSchema.extend({});

export type TCreateBannerSchema = z.infer<typeof createBannerSchema>;

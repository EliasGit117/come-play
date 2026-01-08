import { z } from 'zod';
import { ProductState, ProductSticker } from '@prisma/client';

export const productStates = ['not_available', 'available', 'out_of_stock'] as const;
export const productStickers = ['new', 'sale'] as const;

export const productBaseSchema = z.object({
  nameRo: z.string().min(3).max(128),
  nameRu: z.string().min(3).max(128),
  slug: z.string().min(3).max(128),

  price: z.number().min(1),
  oldPrice: z.number().nonnegative().optional(),

  state: z.enum(productStates),
  sticker: z.enum(productStickers).optional(),

  hidden: z.boolean().optional(),

  shortDescriptionRo: z.string().max(512).optional(),
  shortDescriptionRu: z.string().max(512).optional(),
  richContentRo: z.string().optional(),
  richContentRu: z.string().optional()
});

export type TProductBaseSchema = z.infer<typeof productBaseSchema>;
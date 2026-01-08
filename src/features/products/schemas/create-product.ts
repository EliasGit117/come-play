import { z } from 'zod';
import { productBaseSchema } from './product-base';

export const createProductSchema = productBaseSchema.omit({
  richContentRo: true,
  richContentRu: true,
}).extend({
  subcategoryId: z.number().optional()
});

export type TCreateProductSchema = z.infer<typeof createProductSchema>;
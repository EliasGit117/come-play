import { z } from 'zod';
import { productBaseSchema } from './product-base';


export const editProductSchema = productBaseSchema.extend({
  id: z.number(),
  subcategoryId: z.number().optional()
});

export type TEditProductSchema = z.infer<typeof editProductSchema>;
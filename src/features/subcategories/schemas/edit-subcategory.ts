import { subcategoryBaseSchema } from '@/features/subcategories/schemas/subcategory-base';
import { z } from 'zod';

export const editSubcategorySchema = subcategoryBaseSchema.extend({
  id: z.number(),
});
export type TEditSubcategorySchema = z.infer<typeof editSubcategorySchema>;
import { z } from "zod";
import { categoryBaseSchema } from '@/features/categories/schemas/category-base';

export const editCategorySchema = categoryBaseSchema.extend({
  id: z.number(),
});

export type TEditCategorySchema = z.infer<typeof editCategorySchema>;
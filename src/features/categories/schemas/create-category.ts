import { z } from "zod";
import { categoryBaseSchema } from '@/features/categories/schemas/category-base';

export const createCategorySchema = categoryBaseSchema.extend({});
export type TCreateCategorySchema = z.infer<typeof createCategorySchema>;
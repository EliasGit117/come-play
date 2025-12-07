import { z } from 'zod';
import { subcategoryBaseSchema } from '@/features/subcategories/schemas/subcategory-base';

export const createSubcategorySchema = subcategoryBaseSchema.extend({});
export type TCreateSubcategorySchema = z.infer<typeof createSubcategorySchema>;
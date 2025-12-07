import { z } from 'zod';

export const subcategoryBaseSchema = z.object({
  nameRo: z.string().min(1, 'Romanian name is required').max(255),
  nameRu: z.string().min(1, 'Russian name is required').max(255),

  descriptionRo: z
    .string()
    .max(2056, 'Romanian description must be at most 255 characters')
    .optional()
    .nullable(),

  descriptionRu: z
    .string()
    .max(2056, 'Russian description must be at most 255 characters')
    .optional()
    .nullable(),

  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens')
    .min(1)
    .max(255),

  categoryId: z.number().optional().nullable(),
});

export type TSubcategoryBaseSchema = z.infer<typeof subcategoryBaseSchema>;
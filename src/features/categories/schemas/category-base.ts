import { z } from 'zod';

export const categoryBaseSchema = z.object({
  nameRo: z
    .string()
    .min(1, 'Romanian name is required')
    .max(255, 'Romanian name must be at most 255 characters'),

  nameRu: z
    .string()
    .min(1, 'Romanian name is required')
    .max(255, 'Romanian name must be at most 255 characters'),

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
    .min(1, 'Slug is required')
    .max(255, 'Slug must be at most 255 characters'),
});

export type TCategoryBaseSchema = z.infer<typeof categoryBaseSchema>;
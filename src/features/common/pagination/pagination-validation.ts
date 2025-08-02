import z from 'zod';

export const paginatedSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
})

import z from 'zod';

export const paginatedSchema = z.object({
  page: z.number().int().min(1).optional().catch(1),
  limit: z.number().int().min(1).max(100).optional().catch(10),
  direction: z.enum(['asc', 'desc']).optional(),
})

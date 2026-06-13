import { z } from 'zod';

export const createCustomerRequestSchema = z.object({
  firstName: z.string().min(1).max(128),
  lastName: z.string().min(1).max(128),
  email: z.string().email().max(256),
  phone: z.string().min(1).max(32),
  message: z.string().max(2000).optional(),
});

export type TCreateCustomerRequestSchema = z.infer<typeof createCustomerRequestSchema>;

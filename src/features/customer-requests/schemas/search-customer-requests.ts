import { z } from 'zod';
import { EmailNotificationStatus } from '@prisma/client';
import { paginatedSchema } from '@/features/common/pagination/pagination-validation';
import { dateRangeSchema, numberRangeSchema } from '@/components/data-table';

export const getCustomerRequestsPaginatedForAdminSchema = paginatedSchema.extend({
  order: z.enum(['id', 'createdAt', 'updatedAt', 'firstName', 'lastName', 'email', 'phone', 'emailNotificationStatus']).optional().catch(undefined),
  id: z.number().int().optional().catch(undefined),
  idRange: numberRangeSchema.optional().catch(undefined),
  name: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
  phone: z.string().optional().catch(undefined),
  emailNotificationStatus: z.array(z.enum(EmailNotificationStatus)).optional().catch(undefined),
  createdAt: dateRangeSchema.optional().catch(undefined),
  updatedAt: dateRangeSchema.optional().catch(undefined),
});

export type TGetCustomerRequestsPaginatedParamsForAdmin = z.infer<typeof getCustomerRequestsPaginatedForAdminSchema>;

export const deleteCustomerRequestByIdSchema = z.object({ id: z.number() });
export const deleteCustomerRequestByIdsSchema = z.object({ ids: z.array(z.number()) });

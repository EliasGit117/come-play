import { type } from '@orpc/server';
import { EmailNotificationStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { customerRequestsPublicBase, customerRequestsPublicPath } from './base';
import { createCustomerRequestSchema } from '@/features/customer-requests/schemas/create-customer-request';

export const createCustomerRequest = customerRequestsPublicBase
  .route({
    method: 'POST',
    path: `${customerRequestsPublicPath}`,
    summary: 'Create customer request',
    description: 'Submits a customer request from the public contact form',
  })
  .meta({ anonymous: true })
  .input(createCustomerRequestSchema)
  .output(type<{ id: number }>())
  .handler(async ({ input: data }) => {
    const request = await prisma.customerRequest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message ?? null,
        emailNotificationStatus: EmailNotificationStatus.pending,
      },
    });

    return { id: request.id };
  });

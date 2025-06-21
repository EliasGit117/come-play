import { createServerFn } from '@tanstack/react-start';
import { userRequiredMiddleware } from '@/features/auth/middleware/user-middleware';
import z from 'zod';
import prisma from '@/lib/prisma';


export const updateUserSchema = z.object({
  name: z.string().min(3).max(20),
})

export const updateUser = createServerFn()
  .validator(updateUserSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await prisma.user.update({
      where: { id: userSession.user.id },
      data: { name: data.name },
    })
  })
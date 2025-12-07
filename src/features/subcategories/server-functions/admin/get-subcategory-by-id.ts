import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminSubcategoryBriefDtoFactory } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

export const getSubcategoryByIdForAdminSchema = z.object({
  id: z.number(),
});

export const getSubcategoryByIdForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getSubcategoryByIdForAdminSchema)
  .handler(async ({ data }) => {
    const subcategory = await prisma.subcategory.findUnique({
      where: { id: data.id },
      include: { category: true, products: true },
    });
    if (!subcategory) throw new Error('Subcategory not found');
    return AdminSubcategoryBriefDtoFactory.fromEntity(subcategory);
  });

export const getSubcategoryByIdForAdminQueryOptions = (id: number | string) => ({
  queryKey: ['admin', 'subcategories', id],
  queryFn: () => getSubcategoryByIdForAdmin({ data: { id: Number(id) } }),
  staleTime: 30_000,
  gcTime: 60_000,
});
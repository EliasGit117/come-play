import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { AdminCategoryBriefDtoFactory } from '@/features/categories/dtos/admin-category-brief-dto';


export const getCategoryByIdForAdminSchema = z.object({
  id: z.number()
});

export type TGetCategoryByIdForAdminSchema = z.infer<typeof getCategoryByIdForAdminSchema>;

export const getCategoryByIdForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getCategoryByIdForAdminSchema)
  .handler(async ({ data }) => {
    const category = await prisma.category.findUnique({
      where: { id: data.id },
      include: { subcategories: true }
    });

    if (!category) throw new Error('Category not found');

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });

export const getCategoryByIdForAdminQueryOptions = (id: number | string) => {
  const parsedId = typeof id === 'string' ? z.coerce.number().parse(id) : id;

  return {
    queryKey: ['admin', 'categories', parsedId],
    queryFn: () => getCategoryByIdForAdmin({ data: { id: parsedId } }),
    staleTime: 30_000,
    gcTime: 60_000
  };
};
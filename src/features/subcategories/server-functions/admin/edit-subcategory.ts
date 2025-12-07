import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { AdminSubcategoryBriefDtoFactory, IAdminSubcategoryBriefDto } from '@/features/subcategories/dtos/admin-subcategory-brief-dto';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { editSubcategorySchema } from '@/features/subcategories/schemas/edit-subcategory';

export const editSubcategory = createServerFn({ method: 'POST' })
  .inputValidator(editSubcategorySchema)
  .handler(async ({ data }) => {
    console.log(data)
    const { id, ...rest } = data;
    const existing = await prisma.subcategory.findUnique({ where: { id } });
    if (!existing)
      throw new Error('Subcategory not found');

    const withSameSlug = await prisma.subcategory.findFirst({
      where: {
        NOT: { id },
        slug: data.slug,
        categoryId: data.categoryId ?? null,
      }
    });

    if (withSameSlug)
      throw new Error(
        data.categoryId
          ? 'A subcategory with this slug already exists in the selected category.'
          : 'A subcategory with this slug already exists without a category.'
      );


    const updated = await prisma.subcategory.update({
      where: { id },
      data: {
        slug: data.slug,
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        descriptionRo: data.descriptionRo,
        descriptionRu: data.descriptionRu,
        categoryId: data.categoryId ?? null,
      },
      include: { category: true },
    });

    return AdminSubcategoryBriefDtoFactory.fromEntity(updated);
  });

type TParams = Parameters<typeof editSubcategory>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminSubcategoryBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useEditSubcategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['admin', 'subcategories', 'edit'],
    mutationFn: (values) => editSubcategory({ data: values }),
    ...options,
    onSuccess: (data, variables, _, context) => {
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'admin' && q.queryKey[1] === 'subcategories' });
      options?.onSuccess?.(data, variables, _, context);
    },
  });
};
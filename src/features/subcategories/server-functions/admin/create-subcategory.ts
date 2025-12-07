import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { createSubcategorySchema } from '@/features/subcategories/schemas/create-subcategory';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import {
  AdminSubcategoryBriefDtoFactory,
  IAdminSubcategoryBriefDto
} from '@/features/subcategories/dtos/admin-subcategory-brief-dto';

export const createSubcategory = createServerFn({ method: 'POST' })
  .inputValidator(createSubcategorySchema)
  .handler(async ({ data }) => {
    const existing = await prisma.subcategory.findFirst({
      where: {
        slug: data.slug,
        categoryId: data.categoryId ?? null
      }
    });

    if (existing)
      throw new Error(
        data.categoryId
          ? 'A subcategory with this slug already exists in the selected category.'
          : 'A subcategory with this slug already exists without a category.'
      );

    const subcategory = await prisma.subcategory.create({
      data,
      include: { category: true }
    });

    return AdminSubcategoryBriefDtoFactory.fromEntity(subcategory);
  });

type TParams = Parameters<typeof createSubcategory>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminSubcategoryBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateSubcategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'subcategories', 'create'],
    mutationFn: (values) => createSubcategory({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === 'admin' && q.queryKey[1] === 'subcategories' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
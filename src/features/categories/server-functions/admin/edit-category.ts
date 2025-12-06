import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import {
  AdminCategoryBriefDtoFactory,
  IAdminCategoryBriefDto
} from '@/features/categories/dtos/admin-category-brief-dto';


export const editCategorySchema = z.object({
  id: z.number(),
  nameRo: z.string().min(1, 'Name (RO) is required'),
  nameRu: z.string().min(1, 'Name (RU) is required'),
  slug: z.string().min(1, 'Slug is required')
});

export type TEditCategorySchema = z.infer<typeof editCategorySchema>;

export const editCategory = createServerFn({ method: 'POST' })
  .inputValidator(editCategorySchema)
  .handler(async ({ data }) => {
    const { id, nameRo, nameRu, slug } = data;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new Error('Category not found');

    const category = await prisma.category.update({
      where: { id },
      data: {
        nameRo,
        nameRu,
        slug
      }
    });

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });

type TParams = Parameters<typeof editCategory>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminCategoryBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useEditCategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'categories', 'edit'],
    mutationFn: (values) => editCategory({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'categories' });
      void queryClient.refetchQueries({ predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'categories' });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
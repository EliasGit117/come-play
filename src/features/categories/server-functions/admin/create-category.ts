import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { createCategorySchema } from '@/features/categories/schemas/create-category';
import {
  AdminCategoryBriefDtoFactory,
  IAdminCategoryBriefDto
} from '@/features/categories/dtos/admin-category-brief-dto';

export const createCategory = createServerFn({ method: 'POST' })
  .inputValidator(createCategorySchema)
  .handler(async ({ data }) => {
    const category = await prisma.category.create({
      data: {
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        descriptionRo: data.descriptionRo || null,
        descriptionRu: data.descriptionRu || null,
        slug: data.slug,
      },
    });

    return AdminCategoryBriefDtoFactory.fromEntity(category);
  });


type TParams = Parameters<typeof createCategory>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminCategoryBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateCategoryMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['categories', 'create'],
    mutationFn: (values) => createCategory({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'admin' && query.queryKey[1] === 'categories',
      });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
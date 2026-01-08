import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';
import { editNewsSchema } from '@/features/news/schemas/edit-news';


// Server function
export const editNews = createServerFn({ method: 'GET' })
  .inputValidator(editNewsSchema)
  .handler(async ({ data }) => {
    const { id } = data;

    const res = await prisma.news.update({
      where: { id: id },
      data: {
        slug: data.slug,
        titleRo: data.titleRo,
        titleRu: data.titleRu,
        contentRo: data.contentRo,
        contentRu: data.contentRu,
        status: data.status
      }
    });

    return IAdminNewsDtoFactory.fromEntity(res);
  });


// React hook
type TParams = Parameters<typeof editNews>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminNewsDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useEditNewsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin', 'news', 'create'],
    mutationFn: (values) => editNews({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({
        predicate: query =>
          query.queryKey[0] === 'admin' &&
          query.queryKey[1] === 'news' &&
          query.queryKey[2] === 'paginated'
      });

      void queryClient.invalidateQueries({ queryKey: ['news', data.slug] });

      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

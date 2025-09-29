import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';
import { NewsStatus } from '@prisma/client';

// Schema
export const editNewsSchema = z.object({
  id: z.number(),
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  status: z.nativeEnum(NewsStatus),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  contentRo: z.string().max(10240).optional(),
  contentRu: z.string().max(10240).optional(),
});

export type TEditNewsSchema = z.infer<typeof editNewsSchema>;

// Server function
export const editNews = createServerFn({ method: 'GET' })
  .validator(editNewsSchema)
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
    mutationKey: ['news', 'create'],
    mutationFn: (values) => editNews({ data: values }),
    ...options,
    onSuccess: (data, variables, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'news' && query.queryKey[1] === 'paginated' });
      void queryClient.invalidateQueries({ queryKey: ['news', data.slug] });

      options?.onSuccess?.(data, variables, context);
    }
  });
};

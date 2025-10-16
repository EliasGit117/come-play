import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { IAdminNewsDto, IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';


export const createNewsSchema = z.object({
  slug: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256),
  editAfterCreation: z.boolean()
});

export type TCreatNewsSchema = z.infer<typeof createNewsSchema>;

export const createNews = createServerFn({ method: 'POST' })
  .inputValidator(createNewsSchema)
  .handler(async ({ data }) => {
    const withSameSlug = await prisma.news.findFirst({ where: { slug: data.slug } });

    if (!!withSameSlug)
      throw new Error('There is already a news with such a slug');

    const news = await prisma.news.create({
      data: {
        slug: data.slug,
        titleRo: data.titleRo,
        titleRu: data.titleRu,
        contentRo: null,
        contentRu: null
      }
    });

    return IAdminNewsDtoFactory.fromEntity(news);
  });

// React hook
type TParams = Parameters<typeof createNews>[0]['data'];
type TOptions = Omit<UseMutationOptions<IAdminNewsDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNewsMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['news', 'create'],
    mutationFn: (values) => createNews({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'news' && query.queryKey[1] === 'paginated' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};

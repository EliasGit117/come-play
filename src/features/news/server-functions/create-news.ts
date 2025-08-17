import z from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { INewsDto, NewsDtoFactory } from '@/features/news/dtos/news-dto';


export const createNewsSchema = z.object({
  link: z.string().regex(/^[a-zA-Z0-9-]+$/).min(3).max(1000),
  titleRo: z.string().min(3).max(256),
  titleRu: z.string().min(3).max(256)
});

export type TCreatNewsSchema = z.infer<typeof createNewsSchema>;

export const createNews = createServerFn({ method: 'POST' })
  .validator(createNewsSchema)
  .handler(async ({ data }) => {
    const withSameLink = await prisma.news.findFirst({ where: { link: data.link } });

    if (!!withSameLink)
      throw new Error('There is already a news with such a link')

    const news = await prisma.news.create({
      data: {
        ...data,
        contentRo: null,
        contentRu: null
      }
    });

    return NewsDtoFactory.fromEntity(news);
  });

// React hook
type TParams = Parameters<typeof createNews>[0]['data'];
type TOptions = Omit<UseMutationOptions<INewsDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNewsMutation = (options?: TOptions) => {

  return useMutation({
    mutationKey: ['news', 'create'],
    mutationFn: (values) => createNews({ data: values }),
    ...options
  });
};
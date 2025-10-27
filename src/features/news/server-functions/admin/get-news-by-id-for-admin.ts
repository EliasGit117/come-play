import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import prisma from '@/lib/prisma';
import { queryOptions } from '@tanstack/react-query';
import { IAdminNewsDtoFactory } from '@/features/news/dtos/admin-news-dto';


export const getNewsByIdForAdminSchema = z.object({
  id: z.number()
});
export type TGetNewsByIdForAdminParams = z.infer<typeof getNewsByIdForAdminSchema>;

export const getNewsByIdForAdmin = createServerFn({ method: 'GET' })
  .inputValidator(getNewsByIdForAdminSchema)
  .handler(async ({ data: { id } }) => {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        image: true
      }
    });

    if (!news)
      throw new Error('News not found');

    return IAdminNewsDtoFactory.fromEntity(news);
  });

export function getNewsByIdQueryOptions(id: number | string) {
  const parsedId = typeof id === "string" ? z.coerce.number().parse(id) : id;

  return queryOptions({
    queryKey: ['admin', 'news', id],
    queryFn: () => getNewsByIdForAdmin({ data: { id: parsedId } }),
    staleTime: 10_000
  });
}

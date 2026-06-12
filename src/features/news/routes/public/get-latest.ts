import { type } from '@orpc/server';
import { NewsStatus } from '@prisma/client';
import prisma from '@/lib/prisma';
import { newsPublicBase, newsPublicPath } from './base';
import { NewsBriefDtoFactory } from '@/features/news/dtos/news-brief-dto';
import { INewsDto } from '@/features/news/dtos/news-dto';
import { getLocale } from '@/paraglide/runtime';

export const getLatestNews = newsPublicBase
  .route({
    method: 'GET',
    path: `${newsPublicPath}/latest`,
    summary: 'Get latest news',
    description: 'Returns the 4 most recent published news',
  })
  .meta({ anonymous: true })
  .output(type<INewsDto[]>())
  .handler(async () => {
    const locale = getLocale();
    const items = await prisma.news.findMany({
      where: { status: { equals: NewsStatus.published } },
      orderBy: { createdAt: 'desc' },
      include: { image: true },
      take: 4,
    });

    return NewsBriefDtoFactory.fromEntities(items, locale);
  });

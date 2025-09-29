import { News, type NewsStatus } from '@prisma/client';

export interface IAdminNewsBriefDto {
  id: number;
  title: string;
  slug: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
}

export class AdminNewsBriefDtoFactory {
  static fromEntity(news: News): IAdminNewsBriefDto {
    return {
      id: news.id,
      title: news.titleRo,
      slug: news.slug,
      status: news.status,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    };
  }

  static fromEntities(newsArray: News[]): IAdminNewsBriefDto[] {
    return newsArray.map(news => this.fromEntity(news));
  }
}

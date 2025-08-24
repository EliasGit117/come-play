import { News, type NewsStatus } from '@prisma/client';

export interface INewsBriefDto {
  id: number;
  title: string;
  slug: string;
  status: NewsStatus;
  createdAt: string; // ISO string for safe serialization
}

export class NewsBriefDtoFactory {
  static fromEntity(news: News): INewsBriefDto {
    return {
      id: news.id,
      title: news.titleRo,
      slug: news.slug,
      status: news.status,
      createdAt: news.createdAt.toISOString(),
    };
  }

  static fromEntities(newsArray: News[]): INewsBriefDto[] {
    return newsArray.map(news => this.fromEntity(news));
  }
}

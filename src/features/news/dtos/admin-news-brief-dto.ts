import { News, type NewsStatus, Prisma } from '@prisma/client';
import { AdminNewsImageDtoFactory, IAdminNewsImageDto } from '@/features/news/dtos/admin-news-image-dto';

type TNewsWithImage = Prisma.NewsGetPayload<{ include: { image: true } }>;

export interface IAdminNewsBriefDto {
  id: number;
  title: string;
  slug: string;
  status: NewsStatus;
  createdAt: string;
  updatedAt: string;
  image?: IAdminNewsImageDto;
}

export class AdminNewsBriefDtoFactory {
  private static baseFromEntity(news: News): Omit<IAdminNewsBriefDto, 'image'> {
    return {
      id: news.id,
      title: news.titleRo,
      slug: news.slug,
      status: news.status,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    };
  }

  static fromEntity<T extends News | TNewsWithImage>(news: T): IAdminNewsBriefDto {
    const dto: IAdminNewsBriefDto = { ...this.baseFromEntity(news) };

    if ('image' in news && news.image) {
      dto.image = AdminNewsImageDtoFactory.fromEntity(news.image);
    }

    return dto;
  }

  static fromEntities<T extends News | TNewsWithImage>(newsArray: T[]): IAdminNewsBriefDto[] {
    return newsArray.map(news => this.fromEntity(news));
  }
}

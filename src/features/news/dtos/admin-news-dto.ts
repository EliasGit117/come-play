import { News, NewsStatus, Prisma } from '@prisma/client';
import { AdminNewsImageDtoFactory, IAdminNewsImageDto } from '@/features/news/dtos/admin-news-image-dto';

type TNewsWithImage = Prisma.NewsGetPayload<{ include: { image: true } }>

export interface IAdminNewsDto {
  id: number;
  slug: string;
  status: NewsStatus;
  titleRo: string;
  titleRu: string;
  contentRo: string | null;
  contentRu: string | null;
  createdAt: string;
  image?: IAdminNewsImageDto;
}

export class IAdminNewsDtoFactory {

  private static baseFromEntity(entity: News): Omit<IAdminNewsDto, 'image'> {
    return {
      id: entity.id,
      slug: entity.slug,
      status: entity.status,
      titleRo: entity.titleRo,
      titleRu: entity.titleRu,
      contentRo: entity.contentRo,
      contentRu: entity.contentRu,
      createdAt: entity.createdAt.toISOString()
    };
  }

  static fromEntity<T extends News | TNewsWithImage>(entity: T): IAdminNewsDto {
    const dto: IAdminNewsDto = { ...this.baseFromEntity(entity) };
    if ('image' in entity && entity.image)
      dto.image = AdminNewsImageDtoFactory.fromEntity(entity.image);

    return dto;
  }

  static fromEntities<T extends News | TNewsWithImage>(entities: T[]): IAdminNewsDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
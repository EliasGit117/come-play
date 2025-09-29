import { News, NewsStatus } from '@prisma/client';

export interface IAdminNewsDto {
  id: number;
  slug: string;
  status: NewsStatus;
  titleRo: string;
  titleRu: string;
  contentRo: string | null;
  contentRu: string | null;
  createdAt: string;
}

export class IAdminNewsDtoFactory {

  static fromEntity(entity: News): IAdminNewsDto {
    return {
      id: entity.id,
      slug: entity.slug,
      status: entity.status,
      titleRo: entity.titleRo,
      titleRu: entity.titleRu,
      contentRo: entity.contentRo,
      contentRu: entity.contentRu,
      createdAt: entity.createdAt.toISOString(),
    };
  }


  static fromEntities(entities: News[]): IAdminNewsDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
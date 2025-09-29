import { NewsImage } from '@prisma/client';


export interface IAdminNewsImageDto {
  id: number;
  url: string;
  thumbhash?: string;
  type: string;
  size: number;
  originalName?: string;
  width?: number;
  height?: number;
  newsId: number;
  createdAt: string;
  updatedAt: string;
}

export class AdminNewsImageDtoFactory {

  static fromEntity(entity: NewsImage): IAdminNewsImageDto {
    return {
      id: entity.id,
      newsId: entity.newsId,
      url: entity.url,
      thumbhash: !!entity.thumbhash ? Buffer.from(entity.thumbhash).toString("base64") : undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      size: entity.size,
      height: entity.height ?? undefined,
      width: entity.width ?? undefined,
      originalName: entity.originalName ?? undefined,
      type: entity.type,
    };
  }


  static fromEntities(entities: NewsImage[]): IAdminNewsImageDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}
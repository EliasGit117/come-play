import { BannerImage } from '@prisma/client';

export interface IBannerImageDto {
  id: number;
  url: string;
  thumbhash?: string;
  type: string;
  size: number;
  originalName: string | null;
  width: number | null;
  height: number | null;
  imageType: string;
  createdAt: string;
}

export class BannerImageDtoFactory {
  static fromEntity(entity: BannerImage): IBannerImageDto {
    return {
      id: entity.id,
      url: entity.url,
      thumbhash: !!entity.thumbhash ? Buffer.from(entity.thumbhash).toString("base64") : undefined,
      type: entity.type,
      size: entity.size,
      originalName: entity.originalName,
      width: entity.width,
      height: entity.height,
      imageType: entity.imageType,
      createdAt: entity.createdAt.toISOString()
    };
  }

  static fromEntities(entities: BannerImage[]): IBannerImageDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
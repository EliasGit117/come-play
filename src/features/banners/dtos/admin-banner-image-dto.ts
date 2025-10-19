import { BannerImage } from '@prisma/client';

export interface IAdminBannerImageDto {
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

export class AdminBannerImageDtoFactory {
  static fromEntity(entity: BannerImage): IAdminBannerImageDto {
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

  static fromEntities(entities: BannerImage[]): IAdminBannerImageDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
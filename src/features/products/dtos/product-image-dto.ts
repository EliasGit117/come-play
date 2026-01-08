import { ProductImage } from '@prisma/client';

export interface IProductImageDto {
  id: number;
  url: string;
  thumbhash?: string;
  type: string;
  size: number;
  originalName: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export class ProductImageDtoFactory {
  static fromEntity(entity: ProductImage): IProductImageDto {
    return {
      id: entity.id,
      url: entity.url,
      thumbhash: entity.thumbhash
        ? Buffer.from(entity.thumbhash).toString('base64')
        : undefined,
      type: entity.type,
      size: entity.size,
      originalName: entity.originalName,
      width: entity.width,
      height: entity.height,
      createdAt: entity.createdAt.toISOString()
    };
  }

  static fromEntities(entities: ProductImage[]): IProductImageDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
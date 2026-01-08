import { Product, Prisma, ProductSticker, ProductState } from '@prisma/client';
import { AdminProductImageDtoFactory, IAdminProductImageDto } from './admin-product-image-dto';

type TProductWithImages = Prisma.ProductGetPayload<{ include: { images: true } }>;

export interface IAdminProductDto {
  id: number;
  nameRo: string;
  nameRu: string;
  slug: string;
  price: number;
  oldPrice?: number;
  state: ProductState;
  sticker?: ProductSticker;
  hidden: boolean;
  shortDescriptionRo?: string;
  shortDescriptionRu?: string;
  richContentRo?: string;
  richContentRu?: string;
  subcategoryId?: number;
  createdAt: string;
  updatedAt: string;
  images?: IAdminProductImageDto[];
}

export class AdminProductDtoFactory {
  private static baseFromEntity(entity: Product): Omit<IAdminProductDto, 'images'> {
    return {
      id: entity.id,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      slug: entity.slug,
      price: entity.price?.toNumber(),
      oldPrice: entity.oldPrice?.toNumber(),
      state: entity.state,
      sticker: entity.sticker ?? undefined,
      hidden: entity.hidden,
      shortDescriptionRo: entity.shortDescriptionRo ?? undefined,
      shortDescriptionRu: entity.shortDescriptionRu ?? undefined,
      richContentRo: entity.richContentRo ?? undefined,
      richContentRu: entity.richContentRu ?? undefined,
      subcategoryId: entity.subcategoryId ?? undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static fromEntity<T extends Product | TProductWithImages>(entity: T): IAdminProductDto {
    const dto: IAdminProductDto = this.baseFromEntity(entity);
    if ('images' in entity && entity.images) {
      dto.images = AdminProductImageDtoFactory.fromEntities(entity.images);
    }
    return dto;
  }

  static fromEntities<T extends Product | TProductWithImages>(entities: T[]): IAdminProductDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
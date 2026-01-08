import { Product, Prisma } from '@prisma/client';
import { IProductImageDto, ProductImageDtoFactory } from './product-image-dto';

type TProductWithImages = Prisma.ProductGetPayload<{ include: { images: true } }>;

export interface IProductDto {
  id: number;
  nameRo: string;
  nameRu: string;
  slug: string;
  price?: string | null;
  oldPrice?: string | null;
  shortDescriptionRo?: string | null;
  shortDescriptionRu?: string | null;
  richContentRo?: string | null;
  richContentRu?: string | null;
  state: string;
  hidden: boolean;
  images?: IProductImageDto[];
}

export class ProductDtoFactory {
  private static baseFromEntity(entity: Product): Omit<IProductDto, 'images'> {
    return {
      id: entity.id,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      slug: entity.slug,
      price: entity.price?.toString() ?? null,
      oldPrice: entity.oldPrice?.toString() ?? null,
      shortDescriptionRo: entity.shortDescriptionRo ?? null,
      shortDescriptionRu: entity.shortDescriptionRu ?? null,
      richContentRo: entity.richContentRo ?? null,
      richContentRu: entity.richContentRu ?? null,
      state: entity.state,
      hidden: entity.hidden
    };
  }

  static fromEntity<T extends Product | TProductWithImages>(entity: T): IProductDto {
    const dto: IProductDto = this.baseFromEntity(entity);
    if ('images' in entity && entity.images) {
      dto.images = ProductImageDtoFactory.fromEntities(entity.images);
    }
    return dto;
  }

  static fromEntities<T extends Product | TProductWithImages>(entities: T[]): IProductDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
import { Product, Prisma } from '@prisma/client';
import { IAdminProductImageDto, AdminProductImageDtoFactory } from './admin-product-image-dto';

type TProductWithImages = Prisma.ProductGetPayload<{ include: { images: true } }>;

export interface IAdminProductBriefDto {
  id: number;
  nameRo: string;
  nameRu: string;
  price: number;
  oldPrice?: number;
  slug: string;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
  images?: IAdminProductImageDto[];
}

export class AdminProductBriefDtoFactory {
  private static baseFromEntity(pr: Product): Omit<IAdminProductBriefDto, 'images'> {
    return {
      id: pr.id,
      nameRo: pr.nameRo,
      nameRu: pr.nameRu,
      price: pr.price.toNumber(),
      oldPrice: pr.oldPrice?.toNumber(),
      slug: pr.slug,
      hidden: pr.hidden,
      createdAt: pr.createdAt.toISOString(),
      updatedAt: pr.updatedAt.toISOString()
    };
  }

  static fromEntity<T extends Product | TProductWithImages>(entity: T): IAdminProductBriefDto {
    const dto: IAdminProductBriefDto = this.baseFromEntity(entity);
    if ('images' in entity && entity.images) {
      dto.images = AdminProductImageDtoFactory.fromEntities(entity.images);
    }
    return dto;
  }

  static fromEntities<T extends Product | TProductWithImages>(entities: T[]): IAdminProductBriefDto[] {
    return entities.map((e) => this.fromEntity(e));
  }
}
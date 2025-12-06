import { Product } from '@prisma/client';

export interface IAdminProductBriefDto {
  id: number;
  name: string;
  slug: string;
  subcategoryId?: number;
  createdAt: string;
  updatedAt: string;
}

export class AdminProductBriefDtoFactory {
  static fromEntity(entity: Product): IAdminProductBriefDto {
    return {
      id: entity.id,
      name: entity.nameRo,
      slug: entity.slug,
      subcategoryId: entity.subcategoryId || undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntities(entities: Product[]): IAdminProductBriefDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
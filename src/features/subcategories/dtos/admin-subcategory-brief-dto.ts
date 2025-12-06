import { Subcategory } from '@prisma/client';

export interface IAdminSubcategoryBriefDto {
  id: number;
  nameRo: string;
  nameRu: string;
  slug: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

export class AdminSubcategoryBriefDtoFactory {
  static fromEntity(entity: Subcategory): IAdminSubcategoryBriefDto {
    return {
      id: entity.id,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      slug: entity.slug,
      categoryId: entity.categoryId,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntities(entities: Subcategory[]): IAdminSubcategoryBriefDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
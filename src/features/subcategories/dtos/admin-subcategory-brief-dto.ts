import { Subcategory, Prisma } from '@prisma/client';
import { IAdminCategoryBriefDto, AdminCategoryBriefDtoFactory } from '@/features/categories/dtos/admin-category-brief-dto';

type TSubcategoryWithRelations = Prisma.SubcategoryGetPayload<{ include: { category: true } }>;

export interface IAdminSubcategoryBriefDto {
  id: number;
  nameRo: string;
  nameRu: string;
  descriptionRo?: string;
  descriptionRu?: string;
  slug: string;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
  category?: IAdminCategoryBriefDto;
}

export class AdminSubcategoryBriefDtoFactory {
  private static baseFromEntity(entity: Subcategory): Omit<IAdminSubcategoryBriefDto, 'category'> {
    return {
      id: entity.id,
      slug: entity.slug,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      descriptionRo: entity.descriptionRo ?? undefined,
      descriptionRu: entity.descriptionRu ?? undefined,
      categoryId: entity.categoryId ?? undefined,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  static fromEntity<T extends Subcategory | TSubcategoryWithRelations>(entity: T): IAdminSubcategoryBriefDto {
    const dto: IAdminSubcategoryBriefDto = this.baseFromEntity(entity);

    if ('category' in entity && entity.category) {
      dto.category = AdminCategoryBriefDtoFactory.fromEntity(entity.category);
    }

    return dto;
  }

  static fromEntities<T extends Subcategory | TSubcategoryWithRelations>(entities: T[]): IAdminSubcategoryBriefDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
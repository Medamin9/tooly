import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories(locale: 'ar' | 'fr' | 'en' = 'ar'): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    const categoryIds = categories.map((c) => c.id);
    const translations = await this.prisma.localizedContent.findMany({
      where: {
        entityType: 'category',
        entityId: { in: categoryIds },
        locale,
      },
    });

    const transMap = new Map(translations.map((t) => [t.entityId, t.name]));

    return categories.map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      name: transMap.get(cat.id) || cat.slug,
      sortOrder: cat.sortOrder,
      productsCount: cat._count.products,
    }));
  }
}

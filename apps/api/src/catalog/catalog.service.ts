import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsQueryDto, SortOption } from './dto/get-products-query.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
  PlanVariantResponseDto,
} from './dto/product-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(query: GetProductsQueryDto): Promise<PaginatedProductsResponseDto> {
    const {
      locale = 'ar',
      category,
      search,
      duration,
      sort = SortOption.SORT_ORDER,
      page = 1,
      limit = 12,
    } = query;

    const skip = (page - 1) * limit;

    // Build Prisma where clause
    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (duration) {
      where.variants = {
        some: {
          duration,
          isAvailable: true,
        },
      };
    }

    if (search && search.trim() !== '') {
      where.OR = [
        { slug: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { sortOrder: 'asc' };
    if (sort === SortOption.NEWEST) {
      orderBy = { createdAt: 'desc' };
    }

    // Query products count and items
    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          variants: {
            where: { isAvailable: true },
            orderBy: { price: 'asc' },
          },
        },
      }),
    ]);

    // Fetch localized content for retrieved products and categories
    const productIds = products.map((p) => p.id);
    const categoryIds = products.map((p) => p.category.id);

    const [productTranslations, categoryTranslations] = await Promise.all([
      this.prisma.localizedContent.findMany({
        where: {
          entityType: 'product',
          entityId: { in: productIds },
          locale,
        },
      }),
      this.prisma.localizedContent.findMany({
        where: {
          entityType: 'category',
          entityId: { in: categoryIds },
          locale,
        },
      }),
    ]);

    const productTransMap = new Map(productTranslations.map((t) => [t.entityId, t]));
    const categoryTransMap = new Map(categoryTranslations.map((t) => [t.entityId, t]));

    const items: ProductResponseDto[] = products.map((product) => {
      const trans = productTransMap.get(product.id);
      const catTrans = categoryTransMap.get(product.category.id);

      const variants: PlanVariantResponseDto[] = product.variants.map((v) => ({
        id: v.id,
        slug: v.slug,
        duration: v.duration,
        price: Number(v.price),
        currency: v.currency,
        isAvailable: v.isAvailable,
        isDemo: v.isDemo,
        features: (v.features as string[]) || [],
        restrictions: (v.restrictions as string[]) || [],
      }));

      return {
        id: product.id,
        slug: product.slug,
        name: trans?.name || product.slug,
        tagline: trans?.tagline || null,
        description: trans?.description || null,
        provider: product.provider,
        categorySlug: product.category.slug,
        categoryName: catTrans?.name || product.category.slug,
        deliveryMethod: product.deliveryMethod,
        isPublished: product.isPublished,
        isDemo: product.isDemo,
        iconUrl: product.iconUrl,
        variants,
      };
    });

    // Handle price sorting in-memory if requested across variants
    if (sort === SortOption.PRICE_ASC) {
      items.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (sort === SortOption.PRICE_DESC) {
      items.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    }

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getProductBySlug(slug: string, locale: 'ar' | 'fr' | 'en' = 'ar'): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        variants: {
          where: { isAvailable: true },
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!product || !product.isPublished) {
      throw new NotFoundException(`Product with slug "${slug}" not found or not published.`);
    }

    const [productTrans, categoryTrans] = await Promise.all([
      this.prisma.localizedContent.findUnique({
        where: {
          entityType_entityId_locale: {
            entityType: 'product',
            entityId: product.id,
            locale,
          },
        },
      }),
      this.prisma.localizedContent.findUnique({
        where: {
          entityType_entityId_locale: {
            entityType: 'category',
            entityId: product.category.id,
            locale,
          },
        },
      }),
    ]);

    const variants: PlanVariantResponseDto[] = product.variants.map((v) => ({
      id: v.id,
      slug: v.slug,
      duration: v.duration,
      price: Number(v.price),
      currency: v.currency,
      isAvailable: v.isAvailable,
      isDemo: v.isDemo,
      features: (v.features as string[]) || [],
      restrictions: (v.restrictions as string[]) || [],
    }));

    return {
      id: product.id,
      slug: product.slug,
      name: productTrans?.name || product.slug,
      tagline: productTrans?.tagline || null,
      description: productTrans?.description || null,
      provider: product.provider,
      categorySlug: product.category.slug,
      categoryName: categoryTrans?.name || product.category.slug,
      deliveryMethod: product.deliveryMethod,
      isPublished: product.isPublished,
      isDemo: product.isDemo,
      iconUrl: product.iconUrl,
      variants,
    };
  }
}

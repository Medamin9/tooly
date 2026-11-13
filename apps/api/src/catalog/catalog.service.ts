import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetProductsQueryDto, SortOption } from './dto/get-products-query.dto';
import {
  PaginatedProductsResponseDto,
  ProductResponseDto,
  PlanVariantResponseDto,
} from './dto/product-response.dto';
import { CatalogOptionKind, Prisma } from '@prisma/client';
import { resolveLocalizedList } from '../common/localized-json.util';
import {
  buildDefaultDeliveryMap,
  buildDefaultDurationMap,
  DEFAULT_DELIVERY_OPTIONS,
  DEFAULT_DURATION_OPTIONS,
  LocalizedOptionLabels,
} from '../common/catalog-options.constants';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  private async loadOptionLabelMaps(): Promise<{
    deliveryMap: Map<string, LocalizedOptionLabels>;
    durationMap: Map<string, LocalizedOptionLabels>;
  }> {
    const deliveryMap = buildDefaultDeliveryMap();
    const durationMap = buildDefaultDurationMap();

    const rows = this.prisma.catalogOption?.findMany
      ? await this.prisma.catalogOption.findMany({
          orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
        })
      : [];

    for (const row of rows) {
      const label: LocalizedOptionLabels = {
        ar: row.labelAr,
        fr: row.labelFr,
        en: row.labelEn,
      };
      if (row.kind === CatalogOptionKind.DELIVERY_METHOD) {
        deliveryMap.set(row.code, label);
      } else if (row.kind === CatalogOptionKind.DURATION) {
        durationMap.set(row.code, label);
      }
    }

    return { deliveryMap, durationMap };
  }

  private resolveOptionLabels(
    map: Map<string, LocalizedOptionLabels>,
    code: string,
  ): LocalizedOptionLabels {
    const matched = map.get(code);
    if (matched) {
      return matched;
    }
    const readable = code.replace(/_/g, ' ');
    return { ar: readable, fr: readable, en: readable };
  }

  async getPublicCatalogOptions(locale: 'ar' | 'fr' | 'en' = 'ar') {
    const rows = this.prisma.catalogOption?.findMany
      ? await this.prisma.catalogOption.findMany({
          orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { code: 'asc' }],
        })
      : [];

    const deliveryRows = rows.filter(
      (r) => r.kind === CatalogOptionKind.DELIVERY_METHOD,
    );
    const durationRows = rows.filter(
      (r) => r.kind === CatalogOptionKind.DURATION,
    );

    const deliveryMethods =
      rows.length > 0
        ? deliveryRows.map((r) => ({
            id: r.id,
            kind: r.kind,
            code: r.code,
            label:
              locale === 'fr' ? r.labelFr : locale === 'en' ? r.labelEn : r.labelAr,
            labels: { ar: r.labelAr, fr: r.labelFr, en: r.labelEn },
            sortOrder: r.sortOrder,
          }))
        : DEFAULT_DELIVERY_OPTIONS.map((o) => ({
            id: o.code,
            kind: CatalogOptionKind.DELIVERY_METHOD,
            code: o.code,
            label: o.label[locale],
            labels: o.label,
            sortOrder: o.sortOrder,
          }));

    const durations =
      rows.length > 0
        ? durationRows.map((r) => ({
            id: r.id,
            kind: r.kind,
            code: r.code,
            label:
              locale === 'fr' ? r.labelFr : locale === 'en' ? r.labelEn : r.labelAr,
            labels: { ar: r.labelAr, fr: r.labelFr, en: r.labelEn },
            sortOrder: r.sortOrder,
          }))
        : DEFAULT_DURATION_OPTIONS.map((o) => ({
            id: o.code,
            kind: CatalogOptionKind.DURATION,
            code: o.code,
            label: o.label[locale],
            labels: o.label,
            sortOrder: o.sortOrder,
          }));

    return { deliveryMethods, durations };
  }

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

    const [productTranslations, categoryTranslations, optionMaps] = await Promise.all([
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
      this.loadOptionLabelMaps(),
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
        durationLabels: this.resolveOptionLabels(optionMaps.durationMap, v.duration),
        price: Number(v.price),
        currency: v.currency,
        isAvailable: v.isAvailable,
        isDemo: v.isDemo,
        features: resolveLocalizedList(v.features, locale),
        restrictions: resolveLocalizedList(v.restrictions, locale),
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
        deliveryMethodLabels: this.resolveOptionLabels(
          optionMaps.deliveryMap,
          product.deliveryMethod,
        ),
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

    const [productTrans, categoryTrans, optionMaps] = await Promise.all([
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
      this.loadOptionLabelMaps(),
    ]);

    const variants: PlanVariantResponseDto[] = product.variants.map((v) => ({
      id: v.id,
      slug: v.slug,
      duration: v.duration,
      durationLabels: this.resolveOptionLabels(optionMaps.durationMap, v.duration),
      price: Number(v.price),
      currency: v.currency,
      isAvailable: v.isAvailable,
      isDemo: v.isDemo,
      features: resolveLocalizedList(v.features, locale),
      restrictions: resolveLocalizedList(v.restrictions, locale),
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
      deliveryMethodLabels: this.resolveOptionLabels(
        optionMaps.deliveryMap,
        product.deliveryMethod,
      ),
      isPublished: product.isPublished,
      isDemo: product.isDemo,
      iconUrl: product.iconUrl,
      variants,
    };
  }
}

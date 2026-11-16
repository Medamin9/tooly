import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CatalogOptionKind, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  UpdateProductDto,
  UpdatePlanVariantPriceDto,
} from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CreateCatalogOptionDto,
  UpdateCatalogOptionDto,
} from './dto/catalog-option.dto';
import {
  CATALOG_LOCALES,
  normalizeLocalizedList,
} from '../common/localized-json.util';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getOverview() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);

    const [
      totalProducts,
      publishedProducts,
      totalVariants,
      totalCategories,
      totalUsers,
      recentAuditLogs,
      totalVisits,
      todayVisits,
      weeklyVisits,
      uniqueVisitorGroups,
      topPathGroups,
      recentViews,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isPublished: true } }),
      this.prisma.planVariant.count(),
      this.prisma.category.count(),
      this.prisma.user.count(),
      this.auditService.getRecentLogs(10),
      this.prisma.pageView.count(),
      this.prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.pageView.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      this.prisma.pageView.groupBy({
        by: ['visitorId'],
        where: { visitorId: { not: null } },
      }),
      this.prisma.pageView.groupBy({
        by: ['path'],
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 5,
      }),
      this.prisma.pageView.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Unique visitors count
    const uniqueVisitors = uniqueVisitorGroups.length > 0
      ? uniqueVisitorGroups.length
      : totalVisits > 0 ? 1 : 0;

    // Daily trend for past 7 days
    const daysMap: Record<string, number> = {};
    const dayNamesAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const isoDate = d.toISOString().split('T')[0];
      daysMap[isoDate] = 0;
    }

    recentViews.forEach((view) => {
      const iso = view.createdAt.toISOString().split('T')[0];
      if (daysMap[iso] !== undefined) {
        daysMap[iso]++;
      }
    });

    const dailyTrend = Object.entries(daysMap).map(([dateStr, count]) => {
      const d = new Date(dateStr + 'T12:00:00Z');
      const label = dayNamesAr[d.getUTCDay()];
      return {
        date: dateStr,
        label,
        count,
      };
    });

    const topPages = topPathGroups.map((g) => ({
      path: g.path,
      count: g._count.path,
    }));

    return {
      metrics: {
        totalProducts,
        publishedProducts,
        draftProducts: totalProducts - publishedProducts,
        totalVariants,
        totalCategories,
        totalUsers,
        totalVisits,
        todayVisits,
        weeklyVisits,
        uniqueVisitors,
        dailyTrend,
        topPages,
      },
      recentAuditLogs,
    };
  }

  private async formatAdminProducts<
    T extends {
      id: string;
      slug: string;
      category?: { slug: string } | null;
      variants: Array<{
        price: Prisma.Decimal | number;
        features: unknown;
        restrictions: unknown;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    },
  >(products: T[]) {
    if (products.length === 0) {
      return [];
    }

    const translations = await this.prisma.localizedContent.findMany({
      where: {
        entityType: 'product',
        entityId: { in: products.map((p) => p.id) },
      },
    });

    const transByProduct = new Map<
      string,
      Record<'ar' | 'fr' | 'en', { name: string; tagline: string; description: string }>
    >();

    for (const product of products) {
      transByProduct.set(product.id, {
        ar: { name: '', tagline: '', description: '' },
        fr: { name: '', tagline: '', description: '' },
        en: { name: '', tagline: '', description: '' },
      });
    }

    for (const row of translations) {
      const entry = transByProduct.get(row.entityId);
      if (!entry) continue;
      if (row.locale === 'ar' || row.locale === 'fr' || row.locale === 'en') {
        entry[row.locale] = {
          name: row.name || '',
          tagline: row.tagline || '',
          description: row.description || '',
        };
      }
    }

    return products.map((p) => {
      const loc = transByProduct.get(p.id)!;
      const sortedVariants = [...p.variants]
        .sort((a, b) => Number(a.price) - Number(b.price))
        .map((v) => ({
          ...v,
          price: Number(v.price),
          features: normalizeLocalizedList(v.features),
          restrictions: normalizeLocalizedList(v.restrictions),
        }));

      return {
        ...p,
        categorySlug: p.category?.slug || '',
        name: {
          ar: loc.ar.name,
          fr: loc.fr.name,
          en: loc.en.name,
        },
        tagline: {
          ar: loc.ar.tagline,
          fr: loc.fr.tagline,
          en: loc.en.tagline,
        },
        description: {
          ar: loc.ar.description,
          fr: loc.fr.description,
          en: loc.en.description,
        },
        variants: sortedVariants,
      };
    });
  }

  async getProducts(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (search && search.trim() !== '') {
      const q = search.trim();
      const matchingContent = await this.prisma.localizedContent.findMany({
        where: {
          entityType: 'product',
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { tagline: { contains: q, mode: 'insensitive' } },
          ],
        },
        select: { entityId: true },
      });
      const matchedIds = matchingContent.map((c) => c.entityId);

      where.OR = [
        { slug: { contains: q, mode: 'insensitive' } },
        { provider: { contains: q, mode: 'insensitive' } },
        ...(matchedIds.length > 0 ? [{ id: { in: matchedIds } }] : []),
      ];
    }

    const [total, rawItems] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          category: true,
          variants: {
            orderBy: { price: 'asc' },
          },
        },
      }),
    ]);

    const items = await this.formatAdminProducts(rawItems);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async createProduct(dto: CreateProductDto, adminUserId: string) {
    const normalizedSlug = dto.slug.toLowerCase().trim();
    const category = await this.prisma.category.findUnique({
      where: { slug: dto.categorySlug },
    });

    if (!category) {
      throw new BadRequestException(`Category "${dto.categorySlug}" does not exist.`);
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with slug "${normalizedSlug}" already exists.`);
    }

    // Execute in Prisma transaction
    const createdId = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          slug: normalizedSlug,
          categoryId: category.id,
          provider: dto.provider.trim(),
          deliveryMethod: dto.deliveryMethod?.trim() || 'OFFLINE_TRANSFER',
          isPublished: dto.isPublished ?? true,
          isDemo: dto.isDemo ?? false,
          sortOrder: dto.sortOrder ?? 0,
          iconUrl: dto.iconUrl ? dto.iconUrl.trim() : null,
        },
      });

      for (const locale of CATALOG_LOCALES) {
        await tx.localizedContent.create({
          data: {
            entityType: 'product',
            entityId: product.id,
            locale,
            name: dto.name[locale].trim(),
            tagline: dto.tagline[locale].trim(),
            description: dto.description[locale].trim(),
          },
        });
      }

      for (const v of dto.variants) {
        const variantSlug = v.slug.toLowerCase().trim();
        await tx.planVariant.create({
          data: {
            productId: product.id,
            slug: variantSlug,
            duration: v.duration.trim(),
            price: v.price,
            currency: 'TND',
            isAvailable: v.isAvailable ?? true,
            isDemo: v.isDemo ?? dto.isDemo ?? false,
            features: normalizeLocalizedList(v.features) as unknown as Prisma.InputJsonValue,
            restrictions: normalizeLocalizedList(v.restrictions) as unknown as Prisma.InputJsonValue,
          },
        });
      }

      return product.id;
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRODUCT_CREATED',
      resource: `product:${createdId}`,
      payload: { slug: normalizedSlug, provider: dto.provider },
    });

    const fullProduct = await this.prisma.product.findUniqueOrThrow({
      where: { id: createdId },
      include: { category: true, variants: true },
    });

    return (await this.formatAdminProducts([fullProduct]))[0];
  }

  async updateProduct(id: string, dto: UpdateProductDto, adminUserId: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    });
    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    let targetCategoryId = existing.categoryId;
    if (dto.categorySlug && dto.categorySlug !== existing.category.slug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: dto.categorySlug },
      });
      if (!category) {
        throw new BadRequestException(`Category "${dto.categorySlug}" does not exist.`);
      }
      targetCategoryId = category.id;
    }

    const nextSlug = dto.slug ? dto.slug.toLowerCase().trim() : existing.slug;
    if (nextSlug !== existing.slug) {
      const slugClash = await this.prisma.product.findUnique({
        where: { slug: nextSlug },
      });
      if (slugClash && slugClash.id !== id) {
        throw new BadRequestException(`Product slug "${nextSlug}" is already in use.`);
      }
    }

    if (dto.variants) {
      const existingVariantIds = new Set(existing.variants.map((v) => v.id));
      const seenSlugs = new Set<string>();

      for (const variant of dto.variants) {
        if (variant.id && !existingVariantIds.has(variant.id)) {
          throw new BadRequestException(`Variant "${variant.id}" does not belong to this product.`);
        }
        const normalizedVarSlug = variant.slug.toLowerCase().trim();
        if (seenSlugs.has(normalizedVarSlug)) {
          throw new BadRequestException(`Duplicate variant slug "${normalizedVarSlug}" in request.`);
        }
        seenSlugs.add(normalizedVarSlug);
      }

      const conflictingExternalVariant = await this.prisma.planVariant.findFirst({
        where: {
          slug: { in: Array.from(seenSlugs) },
          productId: { not: id },
        },
      });
      if (conflictingExternalVariant) {
        throw new BadRequestException(
          `Variant slug "${conflictingExternalVariant.slug}" is already used by another product.`,
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          slug: nextSlug,
          categoryId: targetCategoryId,
          provider: dto.provider !== undefined ? dto.provider.trim() : existing.provider,
          deliveryMethod: dto.deliveryMethod ?? existing.deliveryMethod,
          isPublished: dto.isPublished !== undefined ? dto.isPublished : existing.isPublished,
          isDemo: dto.isDemo !== undefined ? dto.isDemo : existing.isDemo,
          sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : existing.sortOrder,
          iconUrl:
            dto.iconUrl !== undefined
              ? dto.iconUrl
                ? dto.iconUrl.trim()
                : null
              : existing.iconUrl,
        },
      });

      if (dto.name || dto.tagline || dto.description) {
        for (const locale of CATALOG_LOCALES) {
          const nameVal = dto.name?.[locale];
          const taglineVal = dto.tagline?.[locale];
          const descriptionVal = dto.description?.[locale];

          if (
            nameVal === undefined &&
            taglineVal === undefined &&
            descriptionVal === undefined
          ) {
            continue;
          }

          const existingLoc = await tx.localizedContent.findUnique({
            where: {
              entityType_entityId_locale: {
                entityType: 'product',
                entityId: id,
                locale,
              },
            },
          });

          if (existingLoc) {
            await tx.localizedContent.update({
              where: { id: existingLoc.id },
              data: {
                ...(nameVal !== undefined ? { name: nameVal.trim() } : {}),
                ...(taglineVal !== undefined ? { tagline: taglineVal.trim() } : {}),
                ...(descriptionVal !== undefined ? { description: descriptionVal.trim() } : {}),
              },
            });
          } else {
            await tx.localizedContent.create({
              data: {
                entityType: 'product',
                entityId: id,
                locale,
                name: (nameVal ?? nextSlug).trim(),
                tagline: taglineVal !== undefined ? taglineVal.trim() : null,
                description: descriptionVal !== undefined ? descriptionVal.trim() : null,
              },
            });
          }
        }
      }

      if (dto.variants) {
        const incomingIds = new Set(
          dto.variants
            .map((v) => v.id)
            .filter((variantId): variantId is string => Boolean(variantId)),
        );
        const removedIds = existing.variants
          .filter((ev) => !incomingIds.has(ev.id))
          .map((ev) => ev.id);

        if (removedIds.length > 0) {
          const linkedOrderCount = await tx.orderItem.count({
            where: { planVariantId: { in: removedIds } },
          });
          if (linkedOrderCount > 0) {
            throw new BadRequestException(
              'Cannot delete a plan variant linked to existing orders. Disable availability instead.',
            );
          }
          await tx.planVariant.deleteMany({
            where: { id: { in: removedIds } },
          });
        }

        for (const v of dto.variants) {
          const normalizedVarSlug = v.slug.toLowerCase().trim();
          const existingVar = v.id
            ? existing.variants.find((ev) => ev.id === v.id)
            : undefined;

          const featuresJson = (
            v.features !== undefined
              ? normalizeLocalizedList(v.features)
              : normalizeLocalizedList(existingVar?.features)
          ) as unknown as Prisma.InputJsonValue;
          const restrictionsJson = (
            v.restrictions !== undefined
              ? normalizeLocalizedList(v.restrictions)
              : normalizeLocalizedList(existingVar?.restrictions)
          ) as unknown as Prisma.InputJsonValue;

          if (existingVar) {
            await tx.planVariant.update({
              where: { id: existingVar.id },
              data: {
                slug: normalizedVarSlug,
                duration: v.duration.trim(),
                price: v.price,
                isAvailable: v.isAvailable ?? existingVar.isAvailable,
                isDemo: v.isDemo ?? existingVar.isDemo,
                features: featuresJson,
                restrictions: restrictionsJson,
              },
            });
          } else {
            await tx.planVariant.create({
              data: {
                productId: id,
                slug: normalizedVarSlug,
                duration: v.duration.trim(),
                price: v.price,
                currency: 'TND',
                isAvailable: v.isAvailable ?? true,
                isDemo: v.isDemo ?? dto.isDemo ?? existing.isDemo,
                features: featuresJson,
                restrictions: restrictionsJson,
              },
            });
          }
        }
      }
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRODUCT_UPDATED',
      resource: `product:${id}`,
      payload: {
        slug: nextSlug,
        updatedFields: Object.keys(dto),
      },
    });

    const refreshed = await this.prisma.product.findUniqueOrThrow({
      where: { id },
      include: { category: true, variants: true },
    });

    return (await this.formatAdminProducts([refreshed]))[0];
  }

  async updateVariantPrice(variantId: string, dto: UpdatePlanVariantPriceDto, adminUserId: string) {
    const existing = await this.prisma.planVariant.findUnique({
      where: { id: variantId },
    });

    if (!existing) {
      throw new NotFoundException(`Plan variant "${variantId}" not found.`);
    }

    const updated = await this.prisma.planVariant.update({
      where: { id: variantId },
      data: {
        price: dto.price !== undefined ? dto.price : existing.price,
        isAvailable: dto.isAvailable !== undefined ? dto.isAvailable : existing.isAvailable,
      },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRICE_CHANGED',
      resource: `plan_variant:${variantId}`,
      payload: {
        oldPrice: Number(existing.price),
        newPrice: Number(updated.price),
        currency: updated.currency,
      },
    });

    return {
      ...updated,
      price: Number(updated.price),
    };
  }

  async deleteProduct(id: string, adminUserId: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    await this.prisma.product.delete({ where: { id } });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRODUCT_DELETED',
      resource: `product:${id}`,
      payload: { slug: existing.slug },
    });

    return { success: true, message: `Product "${existing.slug}" deleted successfully.` };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const categoryIds = categories.map((c) => c.id);
    const localizedContents = await this.prisma.localizedContent.findMany({
      where: {
        entityType: 'category',
        entityId: { in: categoryIds },
      },
    });

    const translationsMap = new Map<
      string,
      { name: Record<string, string>; description: Record<string, string> }
    >();
    for (const cat of categories) {
      translationsMap.set(cat.id, { name: {}, description: {} });
    }

    for (const loc of localizedContents) {
      const entry = translationsMap.get(loc.entityId);
      if (entry) {
        if (loc.name) entry.name[loc.locale] = loc.name;
        if (loc.description) entry.description[loc.locale] = loc.description;
      }
    }

    return categories.map((cat) => {
      const trans = translationsMap.get(cat.id) || { name: {}, description: {} };
      return {
        id: cat.id,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        imageUrl: cat.imageUrl || null,
        productsCount: cat._count.products,
        name: {
          ar: trans.name['ar'] || cat.slug,
          fr: trans.name['fr'] || cat.slug,
          en: trans.name['en'] || cat.slug,
        },
        description: {
          ar: trans.description['ar'] || '',
          fr: trans.description['fr'] || '',
          en: trans.description['en'] || '',
        },
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      };
    });
  }

  async createCategory(dto: CreateCategoryDto, adminUserId: string) {
    const slug = dto.slug.toLowerCase().trim();
    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException(`Category with slug "${slug}" already exists.`);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          slug,
          sortOrder: dto.sortOrder ?? 0,
          isActive: dto.isActive ?? true,
          imageUrl: dto.imageUrl ? dto.imageUrl.trim() : null,
        },
      });

      const locales = ['ar', 'fr', 'en'] as const;
      for (const locale of locales) {
        await tx.localizedContent.create({
          data: {
            entityType: 'category',
            entityId: category.id,
            locale,
            name: dto.name[locale] || slug,
            description: dto.description?.[locale] || null,
          },
        });
      }

      return category;
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATEGORY_CREATED',
      resource: `category:${result.id}`,
      payload: { slug: result.slug, name: dto.name },
    });

    return result;
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, adminUserId: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }

    if (dto.slug && dto.slug !== existing.slug) {
      const slugClash = await this.prisma.category.findUnique({
        where: { slug: dto.slug.toLowerCase().trim() },
      });
      if (slugClash && slugClash.id !== id) {
        throw new BadRequestException(`Category slug "${dto.slug}" is already in use.`);
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const category = await tx.category.update({
        where: { id },
        data: {
          slug: dto.slug ? dto.slug.toLowerCase().trim() : existing.slug,
          sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : existing.sortOrder,
          isActive: dto.isActive !== undefined ? dto.isActive : existing.isActive,
          imageUrl:
            dto.imageUrl !== undefined
              ? dto.imageUrl
                ? dto.imageUrl.trim()
                : null
              : existing.imageUrl,
        },
      });

      if (dto.name || dto.description) {
        const locales = ['ar', 'fr', 'en'] as const;
        for (const locale of locales) {
          const nameVal = dto.name?.[locale];
          const descVal = dto.description?.[locale];

          const existingLoc = await tx.localizedContent.findUnique({
            where: {
              entityType_entityId_locale: {
                entityType: 'category',
                entityId: id,
                locale,
              },
            },
          });

          if (existingLoc) {
            await tx.localizedContent.update({
              where: { id: existingLoc.id },
              data: {
                ...(nameVal !== undefined ? { name: nameVal } : {}),
                ...(descVal !== undefined ? { description: descVal } : {}),
              },
            });
          } else if (nameVal) {
            await tx.localizedContent.create({
              data: {
                entityType: 'category',
                entityId: id,
                locale,
                name: nameVal,
                description: descVal || null,
              },
            });
          }
        }
      }

      return category;
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATEGORY_UPDATED',
      resource: `category:${id}`,
      payload: { changes: dto },
    });

    return updated;
  }

  async deleteCategory(id: string, adminUserId: string) {
    const existing = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!existing) {
      throw new NotFoundException(`Category with ID "${id}" not found.`);
    }

    if (existing._count.products > 0) {
      throw new BadRequestException(
        `لا يمكن حذف التصنيف "${existing.slug}" لأنه يحتوي على ${existing._count.products} منتجات مرتبطة به. يرجى نقل المنتجات أو حذفها أولاً.`,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.localizedContent.deleteMany({
        where: {
          entityType: 'category',
          entityId: id,
        },
      });

      await tx.category.delete({
        where: { id },
      });
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATEGORY_DELETED',
      resource: `category:${id}`,
      payload: { slug: existing.slug },
    });

    return { success: true, message: `Category "${existing.slug}" deleted successfully.` };
  }

  async getCatalogOptions() {
    const [options, deliveryCounts, durationCounts] = await Promise.all([
      this.prisma.catalogOption.findMany({
        orderBy: [{ kind: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.product.groupBy({
        by: ['deliveryMethod'],
        _count: { _all: true },
      }),
      this.prisma.planVariant.groupBy({
        by: ['duration'],
        _count: { _all: true },
      }),
    ]);

    const deliveryUsageMap = new Map(
      deliveryCounts.map((row) => [row.deliveryMethod, row._count._all]),
    );
    const durationUsageMap = new Map(
      durationCounts.map((row) => [row.duration, row._count._all]),
    );

    const mapOption = (opt: (typeof options)[number]) => ({
      id: opt.id,
      kind: opt.kind,
      code: opt.code,
      label: {
        ar: opt.labelAr,
        fr: opt.labelFr,
        en: opt.labelEn,
      },
      sortOrder: opt.sortOrder,
      usageCount:
        opt.kind === CatalogOptionKind.DELIVERY_METHOD
          ? deliveryUsageMap.get(opt.code) ?? 0
          : durationUsageMap.get(opt.code) ?? 0,
      createdAt: opt.createdAt,
      updatedAt: opt.updatedAt,
    });

    return {
      deliveryMethods: options
        .filter((o) => o.kind === CatalogOptionKind.DELIVERY_METHOD)
        .map(mapOption),
      durations: options
        .filter((o) => o.kind === CatalogOptionKind.DURATION)
        .map(mapOption),
    };
  }

  async createCatalogOption(dto: CreateCatalogOptionDto, adminUserId: string) {
    const code = dto.code.trim();
    const existing = await this.prisma.catalogOption.findUnique({
      where: {
        kind_code: {
          kind: dto.kind,
          code,
        },
      },
    });

    if (existing) {
      throw new BadRequestException(
        `الخيار "${code}" موجود بالفعل ضمن ${dto.kind}.`,
      );
    }

    const created = await this.prisma.catalogOption.create({
      data: {
        kind: dto.kind,
        code,
        labelAr: dto.label.ar.trim(),
        labelFr: dto.label.fr.trim(),
        labelEn: dto.label.en.trim(),
        sortOrder: dto.sortOrder ?? 0,
      },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATALOG_OPTION_CREATED',
      resource: `catalog_option:${created.id}`,
      payload: { kind: created.kind, code: created.code, label: dto.label },
    });

    return {
      id: created.id,
      kind: created.kind,
      code: created.code,
      label: {
        ar: created.labelAr,
        fr: created.labelFr,
        en: created.labelEn,
      },
      sortOrder: created.sortOrder,
      usageCount: 0,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async updateCatalogOption(
    id: string,
    dto: UpdateCatalogOptionDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.catalogOption.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Catalog option with ID "${id}" not found.`);
    }

    const nextCode = dto.code !== undefined ? dto.code.trim() : undefined;
    if (nextCode && nextCode !== existing.code) {
      const collision = await this.prisma.catalogOption.findUnique({
        where: {
          kind_code: {
            kind: existing.kind,
            code: nextCode,
          },
        },
      });
      if (collision) {
        throw new BadRequestException(
          `الرمز "${nextCode}" مستخدم بالفعل لخيار آخر من نفس النوع.`,
        );
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const record = await tx.catalogOption.update({
        where: { id },
        data: {
          ...(nextCode !== undefined ? { code: nextCode } : {}),
          ...(dto.label?.ar !== undefined ? { labelAr: dto.label.ar.trim() } : {}),
          ...(dto.label?.fr !== undefined ? { labelFr: dto.label.fr.trim() } : {}),
          ...(dto.label?.en !== undefined ? { labelEn: dto.label.en.trim() } : {}),
          ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
        },
      });

      if (nextCode && nextCode !== existing.code) {
        if (existing.kind === CatalogOptionKind.DELIVERY_METHOD) {
          await tx.product.updateMany({
            where: { deliveryMethod: existing.code },
            data: { deliveryMethod: nextCode },
          });
        } else {
          await tx.planVariant.updateMany({
            where: { duration: existing.code },
            data: { duration: nextCode },
          });
        }
      }

      return record;
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATALOG_OPTION_UPDATED',
      resource: `catalog_option:${id}`,
      payload: { previousCode: existing.code, changes: dto },
    });

    return {
      id: updated.id,
      kind: updated.kind,
      code: updated.code,
      label: {
        ar: updated.labelAr,
        fr: updated.labelFr,
        en: updated.labelEn,
      },
      sortOrder: updated.sortOrder,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteCatalogOption(id: string, adminUserId: string) {
    const existing = await this.prisma.catalogOption.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Catalog option with ID "${id}" not found.`);
    }

    const usageCount =
      existing.kind === CatalogOptionKind.DELIVERY_METHOD
        ? await this.prisma.product.count({
            where: { deliveryMethod: existing.code },
          })
        : await this.prisma.planVariant.count({
            where: { duration: existing.code },
          });

    if (usageCount > 0) {
      throw new BadRequestException(
        existing.kind === CatalogOptionKind.DELIVERY_METHOD
          ? `لا يمكن حذف طريقة التسليم "${existing.code}" لأنها مرتبطة بـ ${usageCount} منتج(ات). يرجى تغيير طريقة التسليم في تلك المنتجات أولاً.`
          : `لا يمكن حذف المدة "${existing.code}" لأنها مرتبطة بـ ${usageCount} باقة(ات). يرجى تعديل أو حذف الباقات المرتبطة أولاً.`,
      );
    }

    await this.prisma.catalogOption.delete({
      where: { id },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'CATALOG_OPTION_DELETED',
      resource: `catalog_option:${id}`,
      payload: { kind: existing.kind, code: existing.code },
    });

    return {
      success: true,
      message: `Catalog option "${existing.code}" deleted successfully.`,
    };
  }

  async getAuditLogs(limit = 50) {
    return this.auditService.getRecentLogs(limit);
  }
}

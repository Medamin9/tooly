import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdatePlanVariantPriceDto } from './dto/update-product.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async getOverview() {
    const [totalProducts, publishedProducts, totalVariants, totalCategories, totalUsers, recentAuditLogs] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.product.count({ where: { isPublished: true } }),
        this.prisma.planVariant.count(),
        this.prisma.category.count(),
        this.prisma.user.count(),
        this.auditService.getRecentLogs(10),
      ]);

    return {
      metrics: {
        totalProducts,
        publishedProducts,
        draftProducts: totalProducts - publishedProducts,
        totalVariants,
        totalCategories,
        totalUsers,
      },
      recentAuditLogs,
    };
  }

  async getProducts(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { slug: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          category: true,
          variants: true,
        },
      }),
    ]);

    return {
      items: items.map((p) => ({
        ...p,
        variants: p.variants.map((v) => ({ ...v, price: Number(v.price) })),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async createProduct(dto: CreateProductDto, adminUserId: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug: dto.categorySlug },
    });

    if (!category) {
      throw new BadRequestException(`Category "${dto.categorySlug}" does not exist.`);
    }

    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException(`Product with slug "${dto.slug}" already exists.`);
    }

    // Execute in Prisma transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          slug: dto.slug,
          categoryId: category.id,
          provider: dto.provider,
          deliveryMethod: dto.deliveryMethod,
          isPublished: dto.isPublished ?? true,
          sortOrder: dto.sortOrder ?? 0,
        },
      });

      // Insert localized contents
      for (const locale of ['ar', 'fr', 'en'] as const) {
        await tx.localizedContent.create({
          data: {
            entityType: 'product',
            entityId: product.id,
            locale,
            name: dto.name[locale],
            tagline: dto.tagline[locale],
            description: dto.description[locale],
          },
        });
      }

      // Insert plan variants
      for (const v of dto.variants) {
        await tx.planVariant.create({
          data: {
            productId: product.id,
            slug: v.slug,
            duration: v.duration,
            price: v.price,
            currency: 'TND',
            isAvailable: v.isAvailable ?? true,
            features: v.features || [],
            restrictions: v.restrictions || [],
          },
        });
      }

      return product;
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRODUCT_CREATED',
      resource: `product:${result.id}`,
      payload: { slug: result.slug, provider: result.provider },
    });

    return result;
  }

  async updateProduct(id: string, dto: UpdateProductDto, adminUserId: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        isPublished: dto.isPublished !== undefined ? dto.isPublished : existing.isPublished,
        sortOrder: dto.sortOrder !== undefined ? dto.sortOrder : existing.sortOrder,
        provider: dto.provider || existing.provider,
      },
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'PRODUCT_UPDATED',
      resource: `product:${id}`,
      payload: { changes: dto },
    });

    return updated;
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

  async getAuditLogs(limit = 50) {
    return this.auditService.getRecentLogs(limit);
  }
}

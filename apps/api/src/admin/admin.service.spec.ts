import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CatalogOptionKind, DeliveryMethod } from '@prisma/client';
import { AdminService } from './admin.service';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CreateCatalogOptionDto,
  UpdateCatalogOptionDto,
} from './dto/catalog-option.dto';
import {
  normalizeLocalizedList,
  resolveLocalizedList,
} from '../common/localized-json.util';

describe('localized-json.util & AdminService product editing', () => {
  const createService = () => {
    const prisma: any = {
      catalogOption: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      product: {
        count: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        groupBy: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
      localizedContent: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
      },
      planVariant: {
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
        groupBy: jest.fn(),
      },
      orderItem: {
        count: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: any) => Promise<any>) => cb(prisma)),
    };

    const auditService: any = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    return {
      service: new AdminService(prisma, auditService),
      prisma,
      auditService,
    };
  };

  it('normalizes legacy array and localized lists cleanly', () => {
    expect(normalizeLocalizedList([' Feature A ', '', 'Feature B'])).toEqual({
      ar: ['Feature A', 'Feature B'],
      fr: [],
      en: [],
    });

    const multi = {
      ar: ['ميزة 1'],
      fr: ['Fonctionnalité 1'],
      en: ['Feature 1'],
    };
    expect(resolveLocalizedList(multi, 'fr')).toEqual(['Fonctionnalité 1']);
    expect(resolveLocalizedList(multi, 'en')).toEqual(['Feature 1']);
    expect(resolveLocalizedList({ ar: ['عربي'], fr: [], en: [] }, 'fr')).toEqual(['عربي']);
  });

  it('returns enriched admin products with localized content and normalized variants', async () => {
    const { service, prisma } = createService();

    prisma.product.count.mockResolvedValue(1);
    prisma.product.findMany.mockResolvedValue([
      {
        id: 'prod-1',
        slug: 'claude-pro',
        provider: 'Anthropic',
        deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
        isPublished: true,
        isDemo: true,
        sortOrder: 1,
        iconUrl: null,
        category: { id: 'cat-1', slug: 'ai' },
        variants: [
          {
            id: 'var-1',
            slug: 'claude-pro-1m',
            duration: '1_month',
            price: 79,
            isAvailable: true,
            isDemo: true,
            features: ['وصول سريع'],
            restrictions: { ar: ['قيد عربي'], fr: ['Restriction FR'], en: [] },
          },
        ],
      },
    ]);
    prisma.localizedContent.findMany.mockResolvedValue([
      {
        entityId: 'prod-1',
        locale: 'ar',
        name: 'كلود برو',
        tagline: 'مساعد ذكي',
        description: 'وصف كامل',
      },
      {
        entityId: 'prod-1',
        locale: 'fr',
        name: 'Claude Pro FR',
        tagline: 'Assistant IA',
        description: 'Description FR',
      },
    ]);

    const res = await service.getProducts(1, 20);
    expect(res.items).toHaveLength(1);
    expect(res.items[0].categorySlug).toBe('ai');
    expect(res.items[0].name).toEqual({
      ar: 'كلود برو',
      fr: 'Claude Pro FR',
      en: '',
    });
    expect(res.items[0].variants[0].features).toEqual({
      ar: ['وصول سريع'],
      fr: [],
      en: [],
    });
    expect(res.items[0].variants[0].restrictions).toEqual({
      ar: ['قيد عربي'],
      fr: ['Restriction FR'],
      en: [],
    });
  });

  it('updates product metadata, translations, existing variants, and creates new variants in transaction', async () => {
    const { service, prisma, auditService } = createService();

    const existingProduct = {
      id: 'prod-1',
      slug: 'claude-pro',
      categoryId: 'cat-1',
      provider: 'Anthropic',
      deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
      isPublished: true,
      isDemo: true,
      sortOrder: 1,
      iconUrl: null,
      category: { id: 'cat-1', slug: 'ai' },
      variants: [
        {
          id: 'var-1',
          slug: 'claude-pro-1m',
          duration: '1_month',
          price: 79,
          isAvailable: true,
          isDemo: true,
          features: ['Old'],
          restrictions: [],
        },
        {
          id: 'var-old',
          slug: 'claude-pro-old',
          duration: '6_months',
          price: 400,
          isAvailable: true,
          isDemo: true,
          features: [],
          restrictions: [],
        },
      ],
    };

    prisma.product.findUnique.mockResolvedValue(existingProduct);
    prisma.category.findUnique.mockResolvedValue({ id: 'cat-2', slug: 'developer' });
    prisma.planVariant.findFirst.mockResolvedValue(null);
    prisma.orderItem.count.mockResolvedValue(0);
    prisma.localizedContent.findUnique.mockResolvedValue(null);
    prisma.localizedContent.findMany.mockResolvedValue([]);
    prisma.product.findUniqueOrThrow.mockResolvedValue({
      ...existingProduct,
      categoryId: 'cat-2',
      category: { id: 'cat-2', slug: 'developer' },
      variants: [],
    });

    await service.updateProduct(
      'prod-1',
      {
        categorySlug: 'developer',
        provider: 'Anthropic PBC',
        deliveryMethod: DeliveryMethod.CREDENTIALS_PROVISION,
        isPublished: false,
        isDemo: false,
        iconUrl: '/uploads/products/prod-123.png',
        name: { ar: 'كلود', fr: 'Claude FR', en: 'Claude EN' },
        variants: [
          {
            id: 'var-1',
            slug: 'claude-pro-1m',
            duration: '1_month',
            price: 85,
            isAvailable: true,
            isDemo: false,
            features: { ar: ['ميزة جديدة'], fr: ['Nouveau'], en: ['New'] },
            restrictions: { ar: [], fr: [], en: [] },
          },
          {
            slug: 'claude-pro-1y',
            duration: '1_year',
            price: 790,
            isAvailable: true,
            isDemo: false,
          },
        ],
      },
      'admin-1',
    );

    expect(prisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'prod-1' },
        data: expect.objectContaining({
          categoryId: 'cat-2',
          provider: 'Anthropic PBC',
          deliveryMethod: DeliveryMethod.CREDENTIALS_PROVISION,
          isPublished: false,
          isDemo: false,
          iconUrl: '/uploads/products/prod-123.png',
        }),
      }),
    );
    expect(prisma.planVariant.deleteMany).toHaveBeenCalledWith({
      where: { id: { in: ['var-old'] } },
    });
    expect(prisma.planVariant.update).toHaveBeenCalledTimes(1);
    expect(prisma.planVariant.create).toHaveBeenCalledTimes(1);
    expect(auditService.logAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'PRODUCT_UPDATED', resource: 'product:prod-1' }),
    );
  });

  it('refuses deleting a variant referenced by existing order items', async () => {
    const { service, prisma } = createService();

    prisma.product.findUnique.mockResolvedValue({
      id: 'prod-1',
      slug: 'claude-pro',
      categoryId: 'cat-1',
      provider: 'Anthropic',
      deliveryMethod: DeliveryMethod.OFFLINE_TRANSFER,
      isPublished: true,
      isDemo: true,
      sortOrder: 1,
      iconUrl: null,
      category: { id: 'cat-1', slug: 'ai' },
      variants: [
        {
          id: 'var-1',
          slug: 'claude-pro-1m',
          duration: '1_month',
          price: 79,
          isAvailable: true,
          isDemo: true,
          features: [],
          restrictions: [],
        },
        {
          id: 'var-linked',
          slug: 'claude-pro-3m',
          duration: '3_months',
          price: 225,
          isAvailable: true,
          isDemo: true,
          features: [],
          restrictions: [],
        },
      ],
    });
    prisma.planVariant.findFirst.mockResolvedValue(null);
    prisma.orderItem.count.mockResolvedValue(2);

    await expect(
      service.updateProduct(
        'prod-1',
        {
          variants: [
            {
              id: 'var-1',
              slug: 'claude-pro-1m',
              duration: '1_month',
              price: 79,
            },
          ],
        },
        'admin-1',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('validates full UpdateProductDto payload under strict global ValidationPipe', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const validPayload = {
      slug: 'claude-pro',
      categorySlug: 'ai',
      provider: 'Anthropic',
      deliveryMethod: 'OFFLINE_TRANSFER',
      isPublished: true,
      isDemo: false,
      sortOrder: 1,
      iconUrl: '/uploads/products/prod-abc.png',
      name: { ar: 'Claude Pro', fr: 'Claude Pro', en: 'Claude Pro' },
      tagline: { ar: 'توضيح', fr: 'Sous-titre', en: 'Tagline' },
      description: { ar: 'وصف', fr: 'Desc FR', en: 'Desc EN' },
      variants: [
        {
          id: 'var-1',
          slug: 'claude-pro-1m',
          duration: '1_month',
          price: 79,
          isAvailable: true,
          isDemo: false,
          features: { ar: ['A'], fr: ['B'], en: ['C'] },
          restrictions: { ar: ['R1'], fr: ['R2'], en: ['R3'] },
        },
      ],
    };

    const parsed = await pipe.transform(validPayload, {
      type: 'body',
      metatype: UpdateProductDto,
    });

    expect(parsed.variants[0].features).toEqual({
      ar: ['A'],
      fr: ['B'],
      en: ['C'],
    });

    await expect(
      pipe.transform(
        {
          variants: [
            {
              slug: 'bad-variant',
              duration: '1_month',
              price: 10,
              features: { ar: ['ok'], de: ['unexpected-locale'] },
            },
          ],
        },
        { type: 'body', metatype: UpdateProductDto },
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('lists catalog options grouped by kind with usage counts', async () => {
    const { service, prisma } = createService();

    prisma.catalogOption.findMany.mockResolvedValue([
      {
        id: 'opt-del-1',
        kind: CatalogOptionKind.DELIVERY_METHOD,
        code: 'OFFLINE_TRANSFER',
        labelAr: 'تحويل بنكي أو D17',
        labelFr: 'Virement / D17',
        labelEn: 'Bank / D17 transfer',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'opt-dur-1',
        kind: CatalogOptionKind.DURATION,
        code: '1_month',
        labelAr: 'شهر واحد',
        labelFr: '1 mois',
        labelEn: '1 month',
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    prisma.product.groupBy.mockResolvedValue([
      { deliveryMethod: 'OFFLINE_TRANSFER', _count: { _all: 4 } },
    ]);
    prisma.planVariant.groupBy.mockResolvedValue([
      { duration: '1_month', _count: { _all: 9 } },
    ]);

    const res = await service.getCatalogOptions();

    expect(res.deliveryMethods).toHaveLength(1);
    expect(res.deliveryMethods[0].usageCount).toBe(4);
    expect(res.durations).toHaveLength(1);
    expect(res.durations[0].usageCount).toBe(9);
  });

  it('creates catalog options and rejects duplicate codes within the same kind', async () => {
    const { service, prisma, auditService } = createService();

    prisma.catalogOption.findUnique.mockResolvedValueOnce(null);
    prisma.catalogOption.create.mockResolvedValue({
      id: 'opt-new',
      kind: CatalogOptionKind.DURATION,
      code: '2_weeks',
      labelAr: 'أسبوعان',
      labelFr: '2 semaines',
      labelEn: '2 weeks',
      sortOrder: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await service.createCatalogOption(
      {
        kind: CatalogOptionKind.DURATION,
        code: '2_weeks',
        label: { ar: 'أسبوعان', fr: '2 semaines', en: '2 weeks' },
        sortOrder: 2,
      },
      'admin-1',
    );

    expect(created.code).toBe('2_weeks');
    expect(created.label.fr).toBe('2 semaines');
    expect(auditService.logAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CATALOG_OPTION_CREATED' }),
    );

    prisma.catalogOption.findUnique.mockResolvedValueOnce({ id: 'opt-new' });
    await expect(
      service.createCatalogOption(
        {
          kind: CatalogOptionKind.DURATION,
          code: '2_weeks',
          label: { ar: 'أسبوعان', fr: '2 semaines', en: '2 weeks' },
        },
        'admin-1',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('updates catalog option and cascades renamed codes to products/variants', async () => {
    const { service, prisma } = createService();

    prisma.catalogOption.findUnique
      .mockResolvedValueOnce({
        id: 'opt-dur-1',
        kind: CatalogOptionKind.DURATION,
        code: '2_weeks',
        labelAr: 'أسبوعان',
        labelFr: '2 semaines',
        labelEn: '2 weeks',
        sortOrder: 1,
      })
      .mockResolvedValueOnce(null);

    prisma.catalogOption.update.mockResolvedValue({
      id: 'opt-dur-1',
      kind: CatalogOptionKind.DURATION,
      code: '14_days',
      labelAr: '14 يومًا',
      labelFr: '14 jours',
      labelEn: '14 days',
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updated = await service.updateCatalogOption(
      'opt-dur-1',
      {
        code: '14_days',
        label: { ar: '14 يومًا', fr: '14 jours', en: '14 days' },
      },
      'admin-1',
    );

    expect(updated.code).toBe('14_days');
    expect(prisma.planVariant.updateMany).toHaveBeenCalledWith({
      where: { duration: '2_weeks' },
      data: { duration: '14_days' },
    });
  });

  it('prevents deleting a catalog option that is in use and deletes unused options', async () => {
    const { service, prisma, auditService } = createService();

    prisma.catalogOption.findUnique.mockResolvedValueOnce({
      id: 'opt-del-1',
      kind: CatalogOptionKind.DELIVERY_METHOD,
      code: 'OFFLINE_TRANSFER',
    });
    prisma.product.count.mockResolvedValueOnce(3);

    await expect(
      service.deleteCatalogOption('opt-del-1', 'admin-1'),
    ).rejects.toThrow(BadRequestException);

    prisma.catalogOption.findUnique.mockResolvedValueOnce({
      id: 'opt-dur-unused',
      kind: CatalogOptionKind.DURATION,
      code: '2_weeks',
    });
    prisma.planVariant.count.mockResolvedValueOnce(0);

    const res = await service.deleteCatalogOption('opt-dur-unused', 'admin-1');
    expect(res.success).toBe(true);
    expect(prisma.catalogOption.delete).toHaveBeenCalledWith({
      where: { id: 'opt-dur-unused' },
    });
    expect(auditService.logAction).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CATALOG_OPTION_DELETED' }),
    );
  });

  it('validates CreateCatalogOptionDto and UpdateCatalogOptionDto under strict ValidationPipe', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    const parsed = await pipe.transform(
      {
        kind: CatalogOptionKind.DELIVERY_METHOD,
        code: 'D17_INSTANT',
        label: { ar: 'D17 فوري', fr: 'D17 instantané', en: 'Instant D17' },
        sortOrder: 6,
      },
      { type: 'body', metatype: CreateCatalogOptionDto },
    );
    expect(parsed.code).toBe('D17_INSTANT');

    await expect(
      pipe.transform(
        {
          kind: CatalogOptionKind.DURATION,
          code: 'invalid code with spaces!',
          label: { ar: 'x', fr: 'x', en: 'x' },
        },
        { type: 'body', metatype: CreateCatalogOptionDto },
      ),
    ).rejects.toThrow(BadRequestException);

    const updatedDto = await pipe.transform(
      {
        label: { fr: 'Nouvelle durée' },
        sortOrder: 9,
      },
      { type: 'body', metatype: UpdateCatalogOptionDto },
    );
    expect(updatedDto.sortOrder).toBe(9);
  });
});


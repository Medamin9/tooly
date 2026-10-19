import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  const mockProduct = {
    id: 'prod-1',
    slug: 'claude-pro',
    name: 'Claude Pro',
    tagline: 'مساعد ذكي',
    description: 'تفاصيل الخطة',
    provider: 'Anthropic',
    categorySlug: 'ai',
    categoryName: 'الذكاء الاصطناعي',
    deliveryMethod: 'OFFLINE_TRANSFER',
    isPublished: true,
    isDemo: true,
    variants: [
      {
        id: 'var-1',
        slug: 'claude-pro-1m',
        duration: '1_month',
        price: 79.0,
        currency: 'TND',
        isAvailable: true,
        isDemo: true,
        features: ['Feature 1'],
        restrictions: ['Rest 1'],
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: {
            getProducts: jest.fn().mockResolvedValue({
              items: [mockProduct],
              total: 1,
              page: 1,
              limit: 12,
              totalPages: 1,
            }),
            getProductBySlug: jest.fn().mockResolvedValue(mockProduct),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated products list with safe TND pricing', async () => {
    const result = await controller.getProducts({ locale: 'ar', page: 1, limit: 12 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe('claude-pro');
    expect(result.items[0].variants[0].currency).toBe('TND');
    expect(result.items[0].variants[0].price).toBe(79.0);
    expect(result.items[0].isDemo).toBe(true);
  });

  it('should return a product by slug', async () => {
    const result = await controller.getProductBySlug('claude-pro', 'ar');
    expect(result.slug).toBe('claude-pro');
    expect(result.provider).toBe('Anthropic');
  });
});

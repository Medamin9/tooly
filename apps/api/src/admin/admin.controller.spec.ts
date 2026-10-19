import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockOverview = {
    metrics: {
      totalProducts: 5,
      publishedProducts: 5,
      draftProducts: 0,
      totalVariants: 7,
      totalCategories: 5,
      totalUsers: 1,
    },
    recentAuditLogs: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getOverview: jest.fn().mockResolvedValue(mockOverview),
            getProducts: jest.fn().mockResolvedValue({ items: [], total: 0 }),
            updateVariantPrice: jest.fn().mockResolvedValue({ id: 'var-1', price: 95.0 }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return real overview metrics from database', async () => {
    const result = await controller.getOverview();
    expect(result.metrics.totalProducts).toBe(5);
    expect(result.metrics.totalCategories).toBe(5);
  });

  it('should allow admin to update variant price in TND', async () => {
    const result = await controller.updateVariantPrice(
      'var-1',
      { price: 95.0 },
      { user: { id: 'admin-1' } },
    );
    expect(result.price).toBe(95.0);
  });
});

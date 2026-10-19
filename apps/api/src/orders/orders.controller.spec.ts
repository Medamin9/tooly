import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OrderStatus, DeliveryMethod } from '@prisma/client';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrder = {
    id: 'ord-1',
    orderNumber: 'TLY-2026-1001',
    status: OrderStatus.PENDING_PAYMENT,
    currency: 'TND',
    totalAmount: 79.0,
    customerNotes: 'Test order',
    customer: {
      id: 'cust-1',
      email: 'customer@test.tn',
      name: 'Customer Test',
      phone: '+21698000000',
    },
    items: [
      {
        id: 'item-1',
        planVariantId: 'var-1',
        quantity: 1,
        unitPrice: 79.0,
        productTitle: 'claude-pro',
        planDuration: '1_month',
      },
    ],
    fulfillment: {
      id: 'ful-1',
      status: 'pending_payment_verification',
      method: DeliveryMethod.OFFLINE_TRANSFER,
      instructions: 'Offline payment instructions',
      fulfilledAt: null,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(mockOrder),
            lookupOrder: jest.fn().mockResolvedValue(mockOrder),
            getOrdersForAdmin: jest.fn().mockResolvedValue({
              items: [mockOrder],
              total: 1,
              page: 1,
              limit: 20,
              totalPages: 1,
            }),
            updateOrderStatus: jest.fn().mockImplementation((id, dto) => {
              return Promise.resolve({
                ...mockOrder,
                status: dto.status,
                fulfillment: {
                  ...mockOrder.fulfillment,
                  status: dto.status === OrderStatus.PAID ? 'payment_verified' : 'delivered',
                },
              });
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an order with PENDING_PAYMENT status and TND currency', async () => {
    const result = await controller.createOrder({
      email: 'customer@test.tn',
      name: 'Customer Test',
      items: [{ planVariantId: 'var-1', quantity: 1 }],
    });

    expect(result.orderNumber).toBe('TLY-2026-1001');
    expect(result.status).toBe(OrderStatus.PENDING_PAYMENT);
    expect(result.currency).toBe('TND');
    expect(result.totalAmount).toBe(79.0);
    expect(result.items[0].unitPrice).toBe(79.0);
  });

  it('should allow customer to lookup their order by number and email', async () => {
    const result = await controller.lookupOrder('TLY-2026-1001', 'customer@test.tn');
    expect(result.orderNumber).toBe('TLY-2026-1001');
    expect(result.customer.email).toBe('customer@test.tn');
  });

  it('should allow admin to update order status to PAID and FULFILLED', async () => {
    const paidResult = await controller.updateOrderStatus(
      'ord-1',
      { status: OrderStatus.PAID },
      { user: { id: 'admin-1' } },
    );
    expect(paidResult.status).toBe(OrderStatus.PAID);

    const fulfilledResult = await controller.updateOrderStatus(
      'ord-1',
      { status: OrderStatus.FULFILLED, instructions: 'Access delivered via email' },
      { user: { id: 'admin-1' } },
    );
    expect(fulfilledResult.status).toBe(OrderStatus.FULFILLED);
  });
});

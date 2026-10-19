import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { OrderStatus, DeliveryMethod, Role, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Helper to format Prisma order into OrderResponseDto
   */
  private formatOrder(order: any): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      currency: order.currency,
      totalAmount: Number(order.totalAmount),
      customerNotes: order.customerNotes,
      customer: {
        id: order.user.id,
        email: order.user.email,
        name: order.user.name,
        phone: order.user.phone,
      },
      items: order.items.map((i: any) => ({
        id: i.id,
        planVariantId: i.planVariantId,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        productTitle: i.productTitle,
        planDuration: i.planDuration,
      })),
      fulfillment: order.fulfillment
        ? {
            id: order.fulfillment.id,
            status: order.fulfillment.status,
            method: order.fulfillment.method,
            instructions: order.fulfillment.instructions,
            fulfilledAt: order.fulfillment.fulfilledAt,
          }
        : null,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Create an order with server-calculated totals and immutable price snapshots
   */
  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one plan variant item.');
    }

    const email = dto.email.toLowerCase().trim();

    // 1. Fetch requested plan variants from DB to guarantee authoritative prices
    const variantIds = dto.items.map((i) => i.planVariantId);
    const searchKeys = Array.from(new Set(variantIds.flatMap((id) => [id, id.replace(/^plan-/, '')])));
    
    const variants = await this.prisma.planVariant.findMany({
      where: {
        OR: [
          { id: { in: searchKeys } },
          { slug: { in: searchKeys } },
        ],
        isAvailable: true,
      },
      include: {
        product: true,
      },
    });

    const variantMap = new Map<string, typeof variants[0]>();
    for (const v of variants) {
      variantMap.set(v.id, v);
      variantMap.set(v.slug, v);
      variantMap.set(`plan-${v.slug}`, v);
    }

    if (dto.items.some((i) => !variantMap.has(i.planVariantId) && !variantMap.has(i.planVariantId.replace(/^plan-/, '')))) {
      throw new BadRequestException('One or more selected plans are unavailable or do not exist.');
    }

    // 2. Compute authoritative total amount and item snapshots
    let totalCents = 0;
    const itemSnapshots: Array<{
      planVariantId: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
      productTitle: string;
      planDuration: string;
    }> = [];

    for (const itemDto of dto.items) {
      const variant = (variantMap.get(itemDto.planVariantId) || variantMap.get(itemDto.planVariantId.replace(/^plan-/, '')))!;
      const unitPrice = new Prisma.Decimal(variant.price);
      itemSnapshots.push({
        planVariantId: variant.id,
        quantity: itemDto.quantity,
        unitPrice,
        productTitle: variant.product.slug,
        planDuration: variant.duration,
      });

      totalCents += Number(unitPrice) * itemDto.quantity;
    }

    const totalAmount = new Prisma.Decimal(totalCents);

    // 3. Find or create customer account
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: dto.name,
          phone: dto.phone || null,
          passwordHash: '$offline$order_customer_placeholder',
          role: Role.CUSTOMER,
        },
      });
    }

    // 4. Generate unique human-friendly order number
    const year = new Date().getFullYear();
    const orderCount = await this.prisma.order.count();
    const orderNumber = `TLY-${year}-${1001 + orderCount}`;

    // 5. Execute creation within Prisma transaction
    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: OrderStatus.PENDING_PAYMENT,
          currency: 'TND',
          totalAmount,
          customerNotes: dto.customerNotes || null,
        },
      });

      // Insert immutable item snapshots
      for (const item of itemSnapshots) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            planVariantId: item.planVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            productTitle: item.productTitle,
            planDuration: item.planDuration,
          },
        });
      }

      // Initialize linked Fulfillment record
      await tx.fulfillment.create({
        data: {
          orderId: order.id,
          status: 'pending_payment_verification',
          method: DeliveryMethod.OFFLINE_TRANSFER,
          instructions: 'Payment arranged outside platform. Awaiting admin verification.',
        },
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          user: true,
          items: true,
          fulfillment: true,
        },
      });
    });

    await this.auditService.logAction({
      userId: user.id,
      action: 'ORDER_CREATED',
      resource: `order:${createdOrder!.id}`,
      payload: {
        orderNumber: createdOrder!.orderNumber,
        totalAmount: Number(totalAmount),
        currency: 'TND',
      },
    });

    return this.formatOrder(createdOrder);
  }

  /**
   * Customer order lookup by orderNumber and email
   */
  async lookupOrder(orderNumber: string, email: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: true,
        items: true,
        fulfillment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with number "${orderNumber}" not found.`);
    }

    if (order.user.email.toLowerCase() !== email.toLowerCase().trim()) {
      throw new ForbiddenException('The provided email does not match this order.');
    }

    return this.formatOrder(order);
  }

  /**
   * Admin: List orders with pagination and status filter
   */
  async getOrdersForAdmin(page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit;
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          items: true,
          fulfillment: true,
        },
      }),
    ]);

    return {
      items: orders.map((o) => this.formatOrder(o)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Admin: Update order status and fulfillment with explicit state machine transitions
   */
  async updateOrderStatus(
    orderId: string,
    dto: UpdateOrderStatusDto,
    adminUserId: string,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { fulfillment: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${orderId}" not found.`);
    }

    const previousStatus = order.status;
    const newStatus = dto.status;

    // State transition validation
    if (previousStatus === OrderStatus.CANCELLED && newStatus !== OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot transition a cancelled order.');
    }
    if (previousStatus === OrderStatus.REFUNDED && newStatus !== OrderStatus.REFUNDED) {
      throw new BadRequestException('Cannot transition a refunded order.');
    }

    // Determine fulfillment status
    let fulfillmentStatus = order.fulfillment?.status || 'pending';
    let fulfilledAt = order.fulfillment?.fulfilledAt || null;

    if (newStatus === OrderStatus.PAID) {
      fulfillmentStatus = 'payment_verified';
    } else if (newStatus === OrderStatus.FULFILLMENT_PENDING) {
      fulfillmentStatus = 'processing';
    } else if (newStatus === OrderStatus.FULFILLED) {
      fulfillmentStatus = 'delivered';
      fulfilledAt = new Date();
    } else if (newStatus === OrderStatus.CANCELLED) {
      fulfillmentStatus = 'cancelled';
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      if (order.fulfillment) {
        await tx.fulfillment.update({
          where: { orderId },
          data: {
            status: fulfillmentStatus,
            instructions: dto.instructions || order.fulfillment.instructions,
            fulfilledAt,
          },
        });
      }

      return tx.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          items: true,
          fulfillment: true,
        },
      });
    });

    await this.auditService.logAction({
      userId: adminUserId,
      action: 'ORDER_STATUS_CHANGED',
      resource: `order:${orderId}`,
      payload: {
        previousStatus,
        newStatus,
        orderNumber: order.orderNumber,
        instructions: dto.instructions,
      },
    });

    return this.formatOrder(updated);
  }
}

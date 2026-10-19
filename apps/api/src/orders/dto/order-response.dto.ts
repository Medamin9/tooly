import { OrderStatus, DeliveryMethod } from '@prisma/client';

export interface OrderItemResponseDto {
  id: string;
  planVariantId: string;
  quantity: number;
  unitPrice: number;
  productTitle: string;
  planDuration: string;
}

export interface FulfillmentResponseDto {
  id: string;
  status: string;
  method: DeliveryMethod;
  instructions: string | null;
  fulfilledAt: Date | null;
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  totalAmount: number;
  customerNotes: string | null;
  customer: {
    id: string;
    email: string;
    name: string | null;
    phone: string | null;
  };
  items: OrderItemResponseDto[];
  fulfillment: FulfillmentResponseDto | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Supported Locales across Tooly.tn
 */
export type Locale = 'ar' | 'fr' | 'en';

export const SUPPORTED_LOCALES: readonly Locale[] = ['ar', 'fr', 'en'] as const;
export const DEFAULT_LOCALE: Locale = 'ar';

export type TextDirection = 'rtl' | 'ltr';

export const LOCALE_DIRECTIONS: Record<Locale, TextDirection> = {
  ar: 'rtl',
  fr: 'ltr',
  en: 'ltr',
};

/**
 * Currency configuration
 */
export const DEFAULT_CURRENCY = 'TND';

/**
 * User Roles
 */
export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPPORT';

/**
 * Order State Machine (from PRODUCT_REQUIREMENTS.md)
 */
export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'fulfillment_pending'
  | 'fulfilled'
  | 'failed'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded';

/**
 * Payment and Fulfillment Strategy
 */
export type PaymentFulfillmentMode = 'offline_transfer' | 'manual' | 'payment_gateway';

/**
 * API Health Response Contract
 */
export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptime: number;
  environment: string;
  service: string;
}

/**
 * Contact Message Contracts
 */
export type ContactStatus = 'UNREAD' | 'READ' | 'ARCHIVED' | 'REPLIED';

export interface CreateContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: ContactStatus;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessagesListResponse {
  items: ContactMessageItem[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

/**
 * Analytics / Visit Contracts
 */
export interface RecordVisitInput {
  path: string;
  locale?: string;
  visitorId?: string;
  referrer?: string;
}

export interface VisitMetrics {
  totalVisits: number;
  todayVisits: number;
  uniqueVisitors: number;
  weeklyVisits: number;
  dailyTrend: Array<{ date: string; label: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
}

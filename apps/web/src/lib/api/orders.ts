import { getAuthToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface CreateOrderPayload {
  email?: string;
  name: string;
  phone: string;
  customerNotes?: string;
  items: Array<{
    planVariantId: string;
    quantity: number;
  }>;
}

export async function createOrderApi(payload: CreateOrderPayload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل إرسال الطلب. يرجى المحاولة لاحقاً.');
  }

  return res.json();
}

export async function lookupOrderApi(orderNumber: string, email: string) {
  const query = new URLSearchParams({ orderNumber, email });
  const res = await fetch(`${API_BASE}/orders/lookup?${query.toString()}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'لم يتم العثور على الطلب أو البريد الإلكتروني غير متطابق.');
  }

  return res.json();
}

function authHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminOrders(status?: string, page = 1, limit = 20) {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (status && status !== 'ALL') query.set('status', status);

  const res = await fetch(`${API_BASE}/orders/admin?${query.toString()}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('فشل تحميل قائمة الطلبات للإدارة.');
  return res.json();
}

export async function updateAdminOrderStatus(
  orderId: string,
  status: string,
  instructions?: string,
) {
  const res = await fetch(`${API_BASE}/orders/admin/${orderId}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status, instructions }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل تحديث حالة الطلب.');
  }

  return res.json();
}

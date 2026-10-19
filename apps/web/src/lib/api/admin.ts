import { getAuthToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

function authHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminOverview() {
  const res = await fetch(`${API_BASE}/admin/overview`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('فشل تحميل الإحصائيات الإدارية');
  return res.json();
}

export async function fetchAdminProducts(page = 1, limit = 20, search = '') {
  const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) query.set('search', search);

  const res = await fetch(`${API_BASE}/admin/products?${query.toString()}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('فشل تحميل قائمة المنتجات');
  return res.json();
}

export async function createAdminProduct(data: any) {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل إنشاء المنتج الجديد');
  }
  return res.json();
}

export async function updateAdminProduct(id: string, data: { isPublished?: boolean; sortOrder?: number }) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('فشل تعديل المنتج');
  return res.json();
}

export async function updateAdminVariantPrice(variantId: string, price: number, isAvailable?: boolean) {
  const res = await fetch(`${API_BASE}/admin/variants/${variantId}/price`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ price, isAvailable }),
  });
  if (!res.ok) throw new Error('فشل تحديث سعر الخطة');
  return res.json();
}

export async function deleteAdminProduct(id: string) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('فشل حذف المنتج');
  return res.json();
}

export async function fetchAdminAuditLogs(limit = 50) {
  const res = await fetch(`${API_BASE}/admin/audit-logs?limit=${limit}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('فشل تحميل سجل التدقيق');
  return res.json();
}

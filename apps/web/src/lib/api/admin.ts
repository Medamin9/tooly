import { getAuthToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface AdminLocalizedText {
  ar: string;
  fr: string;
  en: string;
}

export interface AdminLocalizedList {
  ar: string[];
  fr: string[];
  en: string[];
}

export interface AdminProductVariant {
  id: string;
  slug: string;
  duration: string;
  price: number;
  currency: string;
  isAvailable: boolean;
  isDemo: boolean;
  features: AdminLocalizedList;
  restrictions: AdminLocalizedList;
}

export interface AdminProductItem {
  id: string;
  slug: string;
  categoryId: string;
  categorySlug: string;
  category?: { id: string; slug: string };
  provider: string;
  deliveryMethod: string;
  isPublished: boolean;
  isDemo: boolean;
  sortOrder: number;
  iconUrl?: string | null;
  name: AdminLocalizedText;
  tagline: AdminLocalizedText;
  description: AdminLocalizedText;
  variants: AdminProductVariant[];
}

export interface UpdateAdminProductPayload {
  slug?: string;
  categorySlug?: string;
  provider?: string;
  deliveryMethod?: string;
  isPublished?: boolean;
  isDemo?: boolean;
  sortOrder?: number;
  iconUrl?: string | null;
  name?: Partial<AdminLocalizedText>;
  tagline?: Partial<AdminLocalizedText>;
  description?: Partial<AdminLocalizedText>;
  variants?: Array<{
    id?: string;
    slug: string;
    duration: string;
    price: number;
    isAvailable?: boolean;
    isDemo?: boolean;
    features?: AdminLocalizedList;
    restrictions?: AdminLocalizedList;
  }>;
}

function authHeaders() {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  const err = await res.json().catch(() => ({}));
  if (Array.isArray(err.message)) {
    return err.message.join(' • ');
  }
  return err.message || fallback;
}

async function revalidateStorefront(path: string, body?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const token = getAuthToken();
  if (!token) return;
  try {
    await fetch(path, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Non-blocking: ISR TTL will still refresh eventually
  }
}

export async function revalidateStoreCategories() {
  return revalidateStorefront('/api/revalidate/categories');
}

export async function revalidateStoreProducts(slug?: string) {
  return revalidateStorefront('/api/revalidate/products', slug ? { slug } : undefined);
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
    throw new Error(await parseErrorMessage(res, 'فشل إنشاء المنتج الجديد'));
  }
  const created = await res.json();
  await revalidateStoreProducts(created.slug);
  return created;
}

export async function updateAdminProduct(id: string, data: UpdateAdminProductPayload) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل تعديل المنتج'));
  }
  const updated = await res.json();
  await revalidateStoreProducts(updated.slug);
  return updated;
}

export async function updateAdminVariantPrice(variantId: string, price: number, isAvailable?: boolean) {
  const res = await fetch(`${API_BASE}/admin/variants/${variantId}/price`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ price, isAvailable }),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل تحديث سعر الخطة'));
  }
  const updated = await res.json();
  await revalidateStoreProducts();
  return updated;
}

export async function deleteAdminProduct(id: string) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل حذف المنتج'));
  }
  const deleted = await res.json();
  await revalidateStoreProducts();
  return deleted;
}

async function uploadAdminImage(
  endpoint: 'categories' | 'products',
  file: File,
  fallbackError: string
): Promise<{
  path: string;
  filename: string;
  mimeType: string;
  size: number;
}> {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads/${endpoint}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, fallbackError));
  }

  return res.json();
}

export function uploadAdminCategoryImage(file: File) {
  return uploadAdminImage('categories', file, 'فشل رفع صورة التصنيف');
}

export function uploadAdminProductImage(file: File) {
  return uploadAdminImage('products', file, 'فشل رفع شعار المنتج');
}

export async function fetchAdminCategories() {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('فشل تحميل التصنيفات');
  return res.json();
}

export async function createAdminCategory(data: {
  slug: string;
  sortOrder?: number;
  isActive?: boolean;
  imageUrl?: string | null;
  name: { ar: string; fr: string; en: string };
  description?: { ar?: string; fr?: string; en?: string };
}) {
  const res = await fetch(`${API_BASE}/admin/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل إنشاء التصنيف الجديد');
  }
  const created = await res.json();
  await revalidateStoreCategories();
  return created;
}

export async function updateAdminCategory(
  id: string,
  data: {
    slug?: string;
    sortOrder?: number;
    isActive?: boolean;
    imageUrl?: string | null;
    name?: { ar?: string; fr?: string; en?: string };
    description?: { ar?: string; fr?: string; en?: string };
  }
) {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل تعديل التصنيف');
  }
  const updated = await res.json();
  await revalidateStoreCategories();
  return updated;
}

export async function deleteAdminCategory(id: string) {
  const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'فشل حذف التصنيف');
  }
  const deleted = await res.json();
  await revalidateStoreCategories();
  return deleted;
}

export async function fetchAdminAuditLogs(limit = 50) {
  const res = await fetch(`${API_BASE}/admin/audit-logs?limit=${limit}`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('فشل تحميل سجل التدقيق');
  return res.json();
}

export type AdminCatalogOptionKind = 'DELIVERY_METHOD' | 'DURATION';

export interface AdminCatalogOptionItem {
  id: string;
  kind: AdminCatalogOptionKind;
  code: string;
  label: AdminLocalizedText;
  sortOrder: number;
  usageCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCatalogOptionsResponse {
  deliveryMethods: AdminCatalogOptionItem[];
  durations: AdminCatalogOptionItem[];
}

export async function fetchAdminCatalogOptions(): Promise<AdminCatalogOptionsResponse> {
  const res = await fetch(`${API_BASE}/admin/options`, {
    headers: authHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل تحميل خيارات المدد وطرق التسليم'));
  }
  return res.json();
}

export async function createAdminCatalogOption(data: {
  kind: AdminCatalogOptionKind;
  code: string;
  label: AdminLocalizedText;
  sortOrder?: number;
}): Promise<AdminCatalogOptionItem> {
  const res = await fetch(`${API_BASE}/admin/options`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل إضافة الخيار الجديد'));
  }
  const created = (await res.json()) as AdminCatalogOptionItem;
  await revalidateStoreProducts();
  return created;
}

export async function updateAdminCatalogOption(
  id: string,
  data: {
    code?: string;
    label?: Partial<AdminLocalizedText>;
    sortOrder?: number;
  },
): Promise<AdminCatalogOptionItem> {
  const res = await fetch(`${API_BASE}/admin/options/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل تعديل الخيار'));
  }
  const updated = (await res.json()) as AdminCatalogOptionItem;
  await revalidateStoreProducts();
  return updated;
}

export async function deleteAdminCatalogOption(id: string) {
  const res = await fetch(`${API_BASE}/admin/options/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res, 'فشل حذف الخيار'));
  }
  const deleted = await res.json();
  await revalidateStoreProducts();
  return deleted;
}

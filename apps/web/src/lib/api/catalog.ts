import { Locale } from '@tooly/contracts';
import { DEMO_PLANS } from '../catalog/data';
import { dictionaries } from '../i18n/dictionaries';
import { getCategoryFallbackImage } from '../media/category-image';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export type LocalizedOptionLabels = Record<Locale, string>;

export interface ApiCatalogOption {
  id: string;
  kind: 'DELIVERY_METHOD' | 'DURATION';
  code: string;
  label: string;
  labels: LocalizedOptionLabels;
  sortOrder: number;
}

export interface CatalogOptionsResponse {
  deliveryMethods: ApiCatalogOption[];
  durations: ApiCatalogOption[];
}

export interface ApiProductVariant {
  id: string;
  slug: string;
  duration: string;
  durationLabels?: LocalizedOptionLabels;
  price: number;
  currency: string;
  isAvailable: boolean;
  isDemo: boolean;
  features?: string[];
  restrictions?: string[];
}

export interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  provider: string;
  categorySlug: string;
  categoryName?: string;
  deliveryMethod: string;
  deliveryMethodLabels?: LocalizedOptionLabels;
  isPublished: boolean;
  isDemo: boolean;
  iconUrl?: string | null;
  variants: ApiProductVariant[];
}

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  productsCount: number;
  imageUrl?: string | null;
}

function buildFallbackApiProducts(locale: Locale): ApiProduct[] {
  return DEMO_PLANS.map((plan) => ({
    id: plan.id,
    slug: plan.slug,
    name: plan.name,
    tagline: plan.tagline[locale],
    description: plan.description[locale],
    provider: plan.provider,
    categorySlug: plan.category,
    deliveryMethod: plan.deliveryMethod[locale],
    isPublished: true,
    isDemo: true,
    iconUrl: null,
    variants: [
      {
        id: plan.id,
        slug: `${plan.slug}-${plan.duration}`,
        duration: plan.duration,
        price: plan.priceTND,
        currency: 'TND',
        isAvailable: true,
        isDemo: true,
        features: plan.features[locale],
        restrictions: plan.restrictions[locale],
      },
    ],
  }));
}

/**
 * Fetch products with fallback to local demo data if API is unreachable
 */
export async function fetchCatalogProducts(params: {
  locale?: Locale;
  category?: string;
  search?: string;
  duration?: string;
  page?: number;
  limit?: number;
  cacheMode?: 'default' | 'no-store';
}): Promise<{ items: ApiProduct[]; total: number }> {
  const query = new URLSearchParams();
  if (params.locale) query.set('locale', params.locale);
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.duration && params.duration !== 'all') query.set('duration', params.duration);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  try {
    const res = await fetch(
      `${API_BASE}/products?${query.toString()}`,
      params.cacheMode === 'no-store'
        ? { cache: 'no-store' }
        : { next: { revalidate: 60, tags: ['products'] } },
    );

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    return {
      items: data.items,
      total: data.total,
    };
  } catch {
    const locale = params.locale || 'ar';
    const fallbackItems = buildFallbackApiProducts(locale);
    return {
      items: fallbackItems,
      total: fallbackItems.length,
    };
  }
}

/**
 * Fetch a single published product by slug, returning null on 404 or falling back offline only if API is down.
 */
export async function fetchProductBySlug(
  slug: string,
  locale: Locale = 'ar',
): Promise<ApiProduct | null> {
  try {
    const res = await fetch(
      `${API_BASE}/products/${encodeURIComponent(slug)}?locale=${locale}`,
      { next: { revalidate: 60, tags: ['products'] } },
    );

    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    return (await res.json()) as ApiProduct;
  } catch {
    const fallback = buildFallbackApiProducts(locale).find((p) => p.slug === slug);
    return fallback ?? null;
  }
}

/**
 * Fetch active categories from API with fallback
 */
export async function fetchCategories(locale: Locale = 'ar'): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/categories?locale=${locale}`, {
      next: { revalidate: 60, tags: ['categories'] },
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch {
    const dictCats = dictionaries[locale]?.categories || dictionaries.ar.categories;
    const defaultSlugs = ['ai', 'design', 'video', 'productivity', 'developer'] as const;
    return defaultSlugs.map((slug, idx) => ({
      id: String(idx + 1),
      slug,
      name: dictCats[slug].name,
      description: dictCats[slug].desc,
      sortOrder: idx + 1,
      productsCount: slug === 'ai' ? 2 : slug === 'productivity' ? 0 : 1,
      imageUrl: getCategoryFallbackImage(slug),
    }));
  }
}

const FALLBACK_DELIVERY_METHOD_DEFS: Array<{
  code: string;
  labels: LocalizedOptionLabels;
  sortOrder: number;
}> = [
  {
    code: 'OFFLINE_TRANSFER',
    labels: {
      ar: 'طلب عبر التحويل أو الدفع المحلي (تونس)',
      fr: 'Commande par transfert ou virement local (Tunisie)',
      en: 'Local transfer / Tunisia manual order confirmation',
    },
    sortOrder: 1,
  },
  {
    code: 'MANUAL_SUPPORT',
    labels: {
      ar: 'تفعيل يدوي سريع عبر دعم Tooly.tn',
      fr: 'Activation manuelle rapide via le support Tooly.tn',
      en: 'Fast manual activation via Tooly.tn support',
    },
    sortOrder: 2,
  },
  {
    code: 'TEAM_INVITE',
    labels: {
      ar: 'دعوة مساحة عمل رسمية على بريدك الشخصي',
      fr: 'Invitation officielle sur votre e-mail personnel',
      en: 'Official workspace invite sent to your email',
    },
    sortOrder: 3,
  },
  {
    code: 'CREDENTIALS_PROVISION',
    labels: {
      ar: 'إعداد وتسليم بيانات حساب مخصص وآمن',
      fr: 'Fourniture dédiée d’identifiants sécurisés',
      en: 'Dedicated provisioned account credentials',
    },
    sortOrder: 4,
  },
  {
    code: 'VOUCHER_CODE',
    labels: {
      ar: 'تسليم كود تفعيل فوري عبر البريد',
      fr: 'Livraison d’un code d’activation par e-mail',
      en: 'Instant activation voucher code delivered by email',
    },
    sortOrder: 5,
  },
];

const FALLBACK_DURATION_DEFS: Array<{
  code: string;
  labels: LocalizedOptionLabels;
  sortOrder: number;
}> = [
  {
    code: '1_month',
    labels: { ar: 'شهر واحد', fr: '1 mois', en: '1 month' },
    sortOrder: 1,
  },
  {
    code: '3_months',
    labels: { ar: '3 أشهر', fr: '3 mois', en: '3 months' },
    sortOrder: 2,
  },
  {
    code: '6_months',
    labels: { ar: '6 أشهر', fr: '6 mois', en: '6 months' },
    sortOrder: 3,
  },
  {
    code: '1_year',
    labels: { ar: 'سنة كاملة', fr: '1 an', en: '1 year' },
    sortOrder: 4,
  },
  {
    code: 'lifetime',
    labels: { ar: 'مدى الحياة', fr: 'À vie', en: 'Lifetime' },
    sortOrder: 5,
  },
];

export async function fetchCatalogOptions(
  locale: Locale = 'ar',
  cacheMode: 'default' | 'no-store' = 'default',
): Promise<CatalogOptionsResponse> {
  try {
    const res = await fetch(
      `${API_BASE}/catalog-options?locale=${encodeURIComponent(locale)}`,
      cacheMode === 'no-store'
        ? { cache: 'no-store' }
        : { next: { revalidate: 60, tags: ['catalog-options'] } },
    );
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return (await res.json()) as CatalogOptionsResponse;
  } catch {
    return {
      deliveryMethods: FALLBACK_DELIVERY_METHOD_DEFS.map((item) => ({
        id: item.code,
        kind: 'DELIVERY_METHOD',
        code: item.code,
        label: item.labels[locale],
        labels: item.labels,
        sortOrder: item.sortOrder,
      })),
      durations: FALLBACK_DURATION_DEFS.map((item) => ({
        id: item.code,
        kind: 'DURATION',
        code: item.code,
        label: item.labels[locale],
        labels: item.labels,
        sortOrder: item.sortOrder,
      })),
    };
  }
}

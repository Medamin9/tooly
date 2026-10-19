import { Locale } from '@tooly/contracts';
import { DEMO_PLANS, DemoPlan } from '../catalog/data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiProductVariant {
  id: string;
  slug: string;
  duration: string;
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
  isPublished: boolean;
  isDemo: boolean;
  iconUrl?: string | null;
  variants: ApiProductVariant[];
}

export interface ApiCategory {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  productsCount: number;
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
}): Promise<{ items: ApiProduct[]; total: number }> {
  const query = new URLSearchParams();
  if (params.locale) query.set('locale', params.locale);
  if (params.category && params.category !== 'all') query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.duration && params.duration !== 'all') query.set('duration', params.duration);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  try {
    const res = await fetch(`${API_BASE}/products?${query.toString()}`, {
      next: { revalidate: 60 }, // Cache public catalog with 60s revalidation
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    return {
      items: data.items,
      total: data.total,
    };
  } catch (err) {
    // Fallback gracefully to typed demo data
    const locale = params.locale || 'ar';
    const fallbackItems: ApiProduct[] = DEMO_PLANS.map((plan) => ({
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
      variants: [
        {
          id: `${plan.id}-var`,
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

    return {
      items: fallbackItems,
      total: fallbackItems.length,
    };
  }
}

/**
 * Fetch active categories from API with fallback
 */
export async function fetchCategories(locale: Locale = 'ar'): Promise<ApiCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/categories?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      { id: '1', slug: 'ai', name: 'الذكاء الاصطناعي', sortOrder: 1, productsCount: 2 },
      { id: '2', slug: 'design', name: 'التصميم والجرافيك', sortOrder: 2, productsCount: 1 },
      { id: '3', slug: 'video', name: 'المونتاج وصناعة الفيديو', sortOrder: 3, productsCount: 1 },
      { id: '4', slug: 'productivity', name: 'الإنتاجية والعمل الجماعي', sortOrder: 4, productsCount: 0 },
      { id: '5', slug: 'developer', name: 'أدوات المطورين', sortOrder: 5, productsCount: 1 },
    ];
  }
}

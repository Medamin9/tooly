import { Locale } from '@tooly/contracts';
import type { ApiProduct, ApiProductVariant } from '../api/catalog';
import { DEMO_PLANS, DemoPlan } from './data';
import { resolveProductIconPath } from '../media/product-image';

export interface StorefrontVariant {
  id: string;
  slug: string;
  duration: string;
  durationLabel: Record<Locale, string>;
  priceTND: number;
  currency: string;
  isAvailable: boolean;
  isDemo: boolean;
  features: string[];
  restrictions: string[];
}

export interface StorefrontPlan extends Omit<DemoPlan, 'category' | 'duration'> {
  productId?: string;
  category: string;
  categoryName?: string;
  duration: string;
  deliveryMethodCode?: string;
  isDemo: boolean;
  isPublished?: boolean;
  isAvailable?: boolean;
  iconUrl?: string | null;
  resolvedIconUrl?: string | null;
  variants: StorefrontVariant[];
}

const DURATION_LABELS: Record<string, Record<Locale, string>> = {
  '1_month': { ar: 'شهر واحد', fr: '1 mois', en: '1 month' },
  '3_months': { ar: '3 أشهر', fr: '3 mois', en: '3 months' },
  '6_months': { ar: '6 أشهر', fr: '6 mois', en: '6 months' },
  '1_year': { ar: 'سنة كاملة', fr: '1 an', en: '1 year' },
  lifetime: { ar: 'مدى الحياة', fr: 'À vie', en: 'Lifetime' },
};

const DELIVERY_METHOD_LABELS: Record<string, Record<Locale, string>> = {
  OFFLINE_TRANSFER: {
    ar: 'طلب عبر التحويل أو الدفع المحلي (تونس)',
    fr: 'Commande par transfert ou virement local (Tunisie)',
    en: 'Local transfer / Tunisia manual order confirmation',
  },
  MANUAL_SUPPORT: {
    ar: 'تفعيل يدوي سريع عبر دعم Tooly.tn',
    fr: 'Activation manuelle rapide via le support Tooly.tn',
    en: 'Fast manual activation via Tooly.tn support',
  },
  VOUCHER_CODE: {
    ar: 'تسليم كود تفعيل فوري عبر البريد',
    fr: 'Livraison d’un code d’activation par e-mail',
    en: 'Instant activation voucher code delivered by email',
  },
  TEAM_INVITE: {
    ar: 'دعوة مساحة عمل رسمية على بريدك الشخصي',
    fr: 'Invitation officielle sur votre e-mail personnel',
    en: 'Official workspace invite sent to your email',
  },
  CREDENTIALS_PROVISION: {
    ar: 'إعداد وتسليم بيانات حساب مخصص وآمن',
    fr: 'Fourniture dédiée d’identifiants sécurisés',
    en: 'Dedicated provisioned account credentials',
  },
};

export function getDurationLabels(duration: string): Record<Locale, string> {
  if (DURATION_LABELS[duration]) {
    return DURATION_LABELS[duration];
  }
  const readable = duration.replace(/_/g, ' ');
  return { ar: readable, fr: readable, en: readable };
}

export function getDeliveryMethodLabels(method: string): Record<Locale, string> {
  if (DELIVERY_METHOD_LABELS[method]) {
    return DELIVERY_METHOD_LABELS[method];
  }
  return { ar: method, fr: method, en: method };
}

function mapVariant(variant: ApiProductVariant): StorefrontVariant {
  return {
    id: variant.id,
    slug: variant.slug,
    duration: variant.duration,
    durationLabel: variant.durationLabels || getDurationLabels(variant.duration),
    priceTND: Number(variant.price),
    currency: variant.currency || 'TND',
    isAvailable: variant.isAvailable,
    isDemo: variant.isDemo,
    features: Array.isArray(variant.features) ? variant.features : [],
    restrictions: Array.isArray(variant.restrictions) ? variant.restrictions : [],
  };
}

export function mapApiProductToStorefrontPlan(
  product: ApiProduct,
  locale: Locale = 'ar',
): StorefrontPlan {
  const mappedVariants = product.variants.map(mapVariant);
  const availableVariants = mappedVariants.filter((v) => v.isAvailable);
  const primaryVariant = availableVariants[0] || mappedVariants[0];

  const duration = primaryVariant?.duration || '1_month';
  const durationLabel = primaryVariant?.durationLabel || getDurationLabels(duration);
  const deliveryLabels =
    product.deliveryMethodLabels || getDeliveryMethodLabels(product.deliveryMethod);

  const taglineText = product.tagline || '';
  const descText = product.description || '';
  const primaryFeatures = primaryVariant?.features || [];
  const primaryRestrictions = primaryVariant?.restrictions || [];

  const fillLocaleStrings = (value: string): Record<Locale, string> => ({
    ar: value,
    fr: value,
    en: value,
  });

  const fillLocaleLists = (list: string[]): Record<Locale, string[]> => ({
    ar: list,
    fr: list,
    en: list,
  });

  return {
    id: primaryVariant?.id || product.id,
    productId: product.id,
    slug: product.slug,
    name: product.name || product.slug,
    provider: product.provider,
    category: product.categorySlug,
    categoryName: product.categoryName || product.categorySlug,
    tagline: fillLocaleStrings(taglineText),
    description: fillLocaleStrings(descText),
    duration,
    durationLabel,
    priceTND: primaryVariant?.priceTND ?? 0,
    deliveryMethodCode: product.deliveryMethod,
    deliveryMethod: deliveryLabels,
    features: fillLocaleLists(primaryFeatures),
    restrictions: fillLocaleLists(primaryRestrictions),
    isFeatured: true,
    isDemo: product.isDemo,
    isPublished: product.isPublished,
    isAvailable: mappedVariants.some((v) => v.isAvailable),
    iconUrl: product.iconUrl ?? null,
    resolvedIconUrl: resolveProductIconPath(product.iconUrl, product.slug),
    variants: mappedVariants,
  };
}

export function mapDemoPlanToStorefrontPlan(
  plan: DemoPlan,
  locale: Locale,
): StorefrontPlan {
  const variant: StorefrontVariant = {
    id: plan.id,
    slug: `${plan.slug}-${plan.duration}`,
    duration: plan.duration,
    durationLabel: plan.durationLabel,
    priceTND: plan.priceTND,
    currency: 'TND',
    isAvailable: true,
    isDemo: true,
    features: plan.features[locale],
    restrictions: plan.restrictions[locale],
  };

  return {
    ...plan,
    isDemo: true,
    isPublished: true,
    isAvailable: true,
    iconUrl: null,
    resolvedIconUrl: resolveProductIconPath(null, plan.slug),
    variants: [variant],
  };
}

export function getFallbackStorefrontPlans(locale: Locale = 'ar'): StorefrontPlan[] {
  return DEMO_PLANS.map((p) => mapDemoPlanToStorefrontPlan(p, locale));
}

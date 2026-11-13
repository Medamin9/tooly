import React from 'react';
import { notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { DEMO_PLANS } from '@/lib/catalog/data';
import { fetchCatalogProducts, fetchProductBySlug } from '@/lib/api/catalog';
import { mapApiProductToStorefrontPlan } from '@/lib/catalog/mappers';
import { ProductDetailView } from '@/components/product/ProductDetailView';

export const dynamicParams = true;

export async function generateStaticParams() {
  const { items } = await fetchCatalogProducts({ locale: 'ar', limit: 50 });
  const slugs = new Set<string>([
    ...DEMO_PLANS.map((p) => p.slug),
    ...items.map((p) => p.slug),
  ]);

  const params: Array<{ locale: string; slug: string }> = [];
  SUPPORTED_LOCALES.forEach((locale) => {
    slugs.forEach((slug) => {
      params.push({ locale, slug });
    });
  });
  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];
  const apiProduct = await fetchProductBySlug(slug, typedLocale);

  if (!apiProduct) {
    notFound();
  }

  const plan = mapApiProductToStorefrontPlan(apiProduct, typedLocale);

  return <ProductDetailView plan={plan} locale={typedLocale} dict={dict} />;
}

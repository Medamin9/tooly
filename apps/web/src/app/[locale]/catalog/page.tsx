import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import {
  fetchCatalogOptions,
  fetchCatalogProducts,
  fetchCategories,
} from '@/lib/api/catalog';
import { mapApiProductToStorefrontPlan } from '@/lib/catalog/mappers';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import { PageLoader } from '@/components/ui/PageLoader';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const [catalogData, categories, catalogOptions] = await Promise.all([
    fetchCatalogProducts({ locale: typedLocale, limit: 50 }),
    fetchCategories(typedLocale),
    fetchCatalogOptions(typedLocale),
  ]);

  const plans = catalogData.items.map((item) =>
    mapApiProductToStorefrontPlan(item, typedLocale),
  );

  return (
    <Suspense fallback={<PageLoader fullscreen={true} />}>
      <CatalogClient
        locale={typedLocale}
        plans={plans}
        categories={categories}
        durations={catalogOptions.durations}
      />
    </Suspense>
  );
}

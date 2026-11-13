import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { LegalDocumentView } from '@/components/legal/LegalDocumentView';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const isFr = locale === 'fr';

  return {
    title: isAr
      ? 'شروط الاستخدام والخدمة | Tooly.tn'
      : isFr
        ? 'Conditions Générales d’Utilisation | Tooly.tn'
        : 'Terms of Service | Tooly.tn',
    description: isAr
      ? 'الشروط والأحكام المنظمة لشراء واستخدام الاشتراكات الرقمية على Tooly.tn في تونس.'
      : isFr
        ? 'Conditions d’utilisation et modalités d’accès aux abonnements digitaux sur Tooly.tn en Tunisie.'
        : 'Terms and conditions governing digital subscriptions and licenses on Tooly.tn.',
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return <LegalDocumentView locale={locale as Locale} slug="terms" />;
}


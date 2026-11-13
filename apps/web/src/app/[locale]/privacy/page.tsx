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
      ? 'سياسة الخصوصية وحماية البيانات | Tooly.tn'
      : isFr
        ? 'Politique de Confidentialité | Tooly.tn'
        : 'Privacy Policy | Tooly.tn',
    description: isAr
      ? 'التزامنا الكامل بحماية بياناتك وخصوصيتك عند التسوق على Tooly.tn.'
      : isFr
        ? 'Politique de confidentialité et protection des données personnelles sur Tooly.tn.'
        : 'Privacy policy and data protection commitments on Tooly.tn.',
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return <LegalDocumentView locale={locale as Locale} slug="privacy" />;
}


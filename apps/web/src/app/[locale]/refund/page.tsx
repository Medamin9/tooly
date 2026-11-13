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
      ? 'سياسة الاسترجاع وضمان الاستمرارية | Tooly.tn'
      : isFr
        ? 'Politique de Remboursement & Garantie | Tooly.tn'
        : 'Refund & Continuity Policy | Tooly.tn',
    description: isAr
      ? 'ضمان الاستمرارية 100% وإجراءات الاسترجاع والاستبدال المالي على Tooly.tn.'
      : isFr
        ? 'Garantie de continuité 100% et conditions de remboursement transparentes sur Tooly.tn.'
        : '100% continuity guarantee and transparent refund policies on Tooly.tn.',
  };
}

export default async function RefundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  return <LegalDocumentView locale={locale as Locale} slug="refund" />;
}


import { redirect, notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import type { LegalDocSlug } from '@/components/legal/LegalDocumentView';

const VALID_SLUGS: Record<string, LegalDocSlug> = {
  terms: 'terms',
  privacy: 'privacy',
  refund: 'refund',
  cgu: 'terms',
  tos: 'terms',
};

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  for (const locale of SUPPORTED_LOCALES) {
    for (const slug of ['terms', 'privacy', 'refund']) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function LegalSlugRedirectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const target = VALID_SLUGS[slug.toLowerCase()];
  if (!target) {
    notFound();
  }

  redirect(`/${locale}/${target}`);
}


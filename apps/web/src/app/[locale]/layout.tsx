import React from 'react';
import { notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES, LOCALE_DIRECTIONS } from '@tooly/contracts';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LocaleDocumentSync } from '@/components/layout/LocaleDocumentSync';
import { ToolyAssistant } from '@/components/assistant/ToolyAssistant';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const direction = LOCALE_DIRECTIONS[typedLocale];

  return (
    <div lang={typedLocale} dir={direction} className="min-h-screen flex flex-col bg-paper text-ink">
      <LocaleDocumentSync locale={typedLocale} direction={direction} />
      <Header locale={typedLocale} />
      <div className="flex-1">{children}</div>
      <Footer locale={typedLocale} />
      <ToolyAssistant locale={typedLocale} />
    </div>
  );
}

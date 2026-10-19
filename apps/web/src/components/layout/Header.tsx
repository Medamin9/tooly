'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';

export function Header({ locale }: { locale: Locale }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dict = dictionaries[locale];

  return (
    <>
      {/* Top Value Banner */}
      <div className="bg-ink text-surface py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
        <span>
          {locale === 'ar'
            ? 'منصة تونسية معتمدة — تسليم اشتراكات رقمية مباشرة بالدينار التونسي (TND)'
            : locale === 'fr'
            ? 'Plateforme tunisienne d’abonnements digitaux en Dinars Tunisiens (TND)'
            : 'Tunisian Digital Subscription Marketplace priced in Tunisian Dinars (TND)'}
        </span>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-line">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="relative h-11 w-32 sm:w-36 block shrink-0">
              <Image
                src="/brand/tooly-logo.png"
                alt="Tooly.tn"
                fill
                priority
                className="object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-ink">
              <Link
                href={`/${locale}/catalog`}
                className="hover:text-tooly-red transition-colors py-1"
              >
                {dict.nav.catalog}
              </Link>
              <a
                href={`/${locale}#categories`}
                className="text-muted hover:text-ink transition-colors py-1"
              >
                {dict.nav.categories}
              </a>
              <a
                href={`/${locale}#how-it-works`}
                className="text-muted hover:text-ink transition-colors py-1"
              >
                {dict.nav.howItWorks}
              </a>
              <a
                href={`/${locale}#trust`}
                className="text-muted hover:text-ink transition-colors py-1"
              >
                {dict.nav.trust}
              </a>
              <a
                href={`/${locale}#faq`}
                className="text-muted hover:text-ink transition-colors py-1"
              >
                {dict.nav.faq}
              </a>
            </nav>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LocaleSwitcher currentLocale={locale} />
            </div>

            <Link href={`/${locale}/catalog`}>
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                <span>{dict.common.viewCatalog}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-control text-ink hover:bg-paper border border-line md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title={dict.common.brandName}
      >
        <div className="flex flex-col gap-6 text-start">
          <div className="border-b border-line pb-4">
            <LocaleSwitcher currentLocale={locale} />
          </div>

          <nav className="flex flex-col gap-3 font-semibold text-base text-ink">
            <Link
              href={`/${locale}/catalog`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-control hover:bg-paper hover:text-tooly-red transition-colors"
            >
              {dict.nav.catalog}
            </Link>
            <a
              href={`/${locale}#categories`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-control hover:bg-paper text-muted hover:text-ink transition-colors"
            >
              {dict.nav.categories}
            </a>
            <a
              href={`/${locale}#how-it-works`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-control hover:bg-paper text-muted hover:text-ink transition-colors"
            >
              {dict.nav.howItWorks}
            </a>
            <a
              href={`/${locale}#trust`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-control hover:bg-paper text-muted hover:text-ink transition-colors"
            >
              {dict.nav.trust}
            </a>
            <a
              href={`/${locale}#faq`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-control hover:bg-paper text-muted hover:text-ink transition-colors"
            >
              {dict.nav.faq}
            </a>
          </nav>

          <div className="pt-4 border-t border-line flex flex-col gap-3">
            <Link href={`/${locale}/catalog`} onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full">
                <span>{dict.common.viewCatalog}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dict.common.offlinePaymentNotice}</span>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

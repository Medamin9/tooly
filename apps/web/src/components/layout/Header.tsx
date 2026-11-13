'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, ShieldCheck, PackageCheck } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Button } from '../ui/Button';
import { CtaArrow } from '../ui/CtaArrow';
import { NavigationProgressBar } from './NavigationProgressBar';

// Lazily load mobile drawer to keep initial desktop bundle minimal
const Drawer = dynamic(() => import('../ui/Drawer').then((m) => m.Drawer), {
  ssr: false,
});

export function Header({ locale }: { locale: Locale }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dict = dictionaries[locale];

  return (
    <>
      {/* Top Value Banner */}
      <div className="bg-ink text-paper py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2 border-b border-line/30 transition-colors">
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
      <header className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line transition-colors relative">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-6">
            <Link href={`/${locale}`} className="relative h-11 w-32 sm:w-36 block shrink-0">
              <Image
                src="/images/toolyLogo.svg"
                alt="Tooly.tn"
                fill
                priority
                className="object-contain dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
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
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href={`/${locale}/order/lookup`}
              className="text-xs font-semibold text-muted hover:text-ink transition-colors hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-control border border-line bg-surface hover:bg-paper shadow-2xs"
            >
              <PackageCheck className="w-3.5 h-3.5 text-tooly-red" />
              <span>
                {locale === 'ar' ? 'تتبع طلبك' : locale === 'fr' ? 'Suivi commande' : 'Track order'}
              </span>
            </Link>

            {/* Theme Switcher Toggle (Light / Dark) */}
            <ThemeSwitcher locale={locale} />

            {/* Locale Switcher (Globe Icon with Dropdown) */}
            <LocaleSwitcher currentLocale={locale} variant="header" />

            <Link href={`/${locale}/catalog`}>
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">

                <span>{dict.common.viewCatalog}</span>
                <CtaArrow className="w-3.5 h-3.5" />
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-control text-ink hover:bg-paper border border-line md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Navigation Loader Bar */}
        <NavigationProgressBar />
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <Drawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          title={dict.common.brandName}
        >
          <div className="flex flex-col gap-6 text-start">
            {/* Controls: Language and Theme Switcher */}
            <div className="border-b border-line pb-4 flex flex-col gap-3">
              <LocaleSwitcher currentLocale={locale} variant="mobile" />
              <ThemeSwitcher locale={locale} variant="mobile" />
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
              <Link
                href={`/${locale}/order/lookup`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-control hover:bg-paper text-tooly-red font-bold flex items-center gap-2 transition-colors"
              >
                <PackageCheck className="w-4 h-4 shrink-0" />
                <span>
                  {locale === 'ar' ? 'تتبع طلبك' : locale === 'fr' ? 'Suivi commande' : 'Track order'}
                </span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-line flex flex-col gap-3">
              <Link href={`/${locale}/catalog`} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  <CtaArrow className="w-4 h-4" />
                  <span>{dict.common.viewCatalog}</span>
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{dict.common.offlinePaymentNotice}</span>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}

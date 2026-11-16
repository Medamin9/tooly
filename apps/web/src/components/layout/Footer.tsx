'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  HeartHandshake,
  ArrowUp,
  PackageCheck,
  Mail,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { cn } from '@/lib/utils';

export interface FooterProps {
  locale: Locale;
  className?: string;
}

export function Footer({ locale, className }: FooterProps) {
  const dict = dictionaries[locale];
  const isAr = locale === 'ar';
  const [openMobileTab, setOpenMobileTab] = useState<'quick' | 'popular' | 'payments' | null>(null);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const footerSections = [
    {
      id: 'quick' as const,
      colClass: 'lg:col-span-2',
      title: dict.footer.quickLinks,
      mobileLabel: dict.footer.quickLinks,
      content: (
        <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
          <li>
            <Link
              href={`/${locale}/catalog`}
              className="hover:text-tooly-red transition-colors inline-block py-0.5"
            >
              {dict.nav.catalog}
            </Link>
          </li>
          <li>
            <a
              href={`/${locale}#categories`}
              className="hover:text-white transition-colors inline-block py-0.5"
            >
              {dict.nav.categories}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}#how-it-works`}
              className="hover:text-white transition-colors inline-block py-0.5"
            >
              {dict.nav.howItWorks}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}#trust`}
              className="hover:text-white transition-colors inline-block py-0.5"
            >
              {dict.nav.trust}
            </a>
          </li>
          <li>
            <a
              href={`/${locale}#faq`}
              className="hover:text-white transition-colors inline-block py-0.5"
            >
              {dict.nav.faq}
            </a>
          </li>
          <li>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-white transition-colors inline-block py-0.5"
            >
              {dict.nav.contact}
            </Link>
          </li>
          <li className="pt-1">
            <Link
              href={`/${locale}/order/lookup`}
              className="text-xs font-bold text-tooly-red hover:underline inline-flex items-center gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>{dict.footer.trackOrder}</span>
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: 'popular' as const,
      colClass: 'lg:col-span-3',
      title: dict.footer.popularToolsTitle,
      mobileLabel: isAr ? 'اشتراكات شائعة' : locale === 'fr' ? 'Populaires' : 'Popular Plans',
      content: (
        <ul className="space-y-2 text-xs sm:text-sm text-neutral-400">
          <li>
            <Link
              href={`/${locale}/product/claude-pro`}
              className="hover:text-white transition-colors flex items-center justify-between py-0.5"
            >
              <span>Claude 3.7 Pro</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {dict.footer.popularBadge}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/product/chatgpt-plus`}
              className="hover:text-white transition-colors block py-0.5"
            >
              ChatGPT Plus
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/product/canva-pro`}
              className="hover:text-white transition-colors block py-0.5"
            >
              Canva Pro (1 an)
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/catalog`}
              className="hover:text-white transition-colors block py-0.5"
            >
              CapCut Pro
            </Link>
          </li>
          <li className="pt-1">
            <Link
              href={`/${locale}/catalog`}
              className="text-xs font-semibold text-neutral-300 hover:text-tooly-red transition-colors inline-flex items-center gap-1"
            >
              <CtaArrow className="w-3.5 h-3.5" />
              <span>{dict.common.viewCatalog}</span>
            </Link>
          </li>
        </ul>
      ),
    },
    {
      id: 'payments' as const,
      colClass: 'lg:col-span-3',
      title: dict.footer.paymentMethodsTitle,
      mobileLabel: isAr ? 'الدفع والضمان' : locale === 'fr' ? 'Paiements' : 'Payments',
      content: (
        <>
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
              {dict.footer.paymentCib}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
              {dict.footer.paymentD17}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
              {dict.footer.paymentFlouci}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-neutral-300">
              {dict.footer.paymentTransfer}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-300 bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-tooly-red shrink-0" />
            <span className="text-[11px] leading-tight text-neutral-300">
              {dict.footer.supportGuarantee}
            </span>
          </div>
        </>
      ),
    },
  ];

  const activeMobileSection =
    footerSections.find((sec) => sec.id === openMobileTab) ?? null;

  return (
    <footer
      className={cn(
        'relative bg-[#08090C] text-white border-t border-white/10 select-none overflow-hidden isolate',
        className
      )}
    >
      {/* Ambient background lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-tooly-red/15 via-tooly-red/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-tooly-red/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-0">
        {/* DESKTOP: ONE LINE WITH COLUMNS VIEW (lg:grid-cols-12) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 text-start pb-10 border-b border-white/10">
          {/* Column 1: Brand & Socials (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href={`/${locale}`} className="inline-block group">
              <div className="inline-flex items-center px-4 py-2 transition-all duration-300">
                <div className="relative h-20 w-32">
                  <Image
                    src="/images/toolyLogo.svg"
                    alt="Tooly.tn Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm">
              {dict.footer.about}
            </p>

            {/* Live Support Indicator */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 backdrop-blur-md">

              <span>
                {isAr
                  ? 'دعم تونسي مباشر 7/7 - الرد في أقل من 15 دقيقة'
                  : locale === 'fr'
                    ? 'Support tunisien 7j/7 - Réponse en < 15 min'
                    : 'Live Support 7/7 - Response in < 15 mins'}
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="pt-2">
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61595229789550"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-tooly-red hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 text-neutral-300 hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-tooly-red hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 text-neutral-300 hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* LinkedIn */}


                {/* WhatsApp Support */}
                <a
                  href="https://wa.me/21696707406"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Support"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 text-neutral-300 hover:scale-110 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Email Support */}
                <a
                  href="mailto:contact@tooly.tn"
                  aria-label="Email Support"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-tooly-red hover:text-white border border-white/10 flex items-center justify-center transition-all duration-300 text-neutral-300 hover:scale-110 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile: single-row closed-by-default collapsible tabs for Quick Links / Popular / Payments */}
          <div className="md:hidden space-y-3">
            <div
              className="grid grid-cols-3 gap-1.5"
              role="tablist"
              aria-label={dict.footer.quickLinks}
            >
              {footerSections.map((sec) => {
                const isOpen = openMobileTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    role="tab"
                    aria-selected={isOpen}
                    aria-expanded={isOpen}
                    aria-controls={`footer-mobile-panel-${sec.id}`}
                    onClick={() =>
                      setOpenMobileTab((prev) => (prev === sec.id ? null : sec.id))
                    }
                    className={cn(
                      'min-w-0 flex items-center justify-center gap-1 px-1.5 py-2.5 rounded-xl border text-[10px] sm:text-xs font-bold leading-tight text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red',
                      isOpen
                        ? 'bg-tooly-red/15 border-tooly-red/50 text-white'
                        : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:bg-white/[0.08] hover:text-white'
                    )}
                  >
                    <span className="truncate">{sec.mobileLabel}</span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 shrink-0 transition-transform duration-200',
                        isOpen && 'rotate-180 text-tooly-red'
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {activeMobileSection && (
              <div
                id={`footer-mobile-panel-${activeMobileSection.id}`}
                role="tabpanel"
                className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-3"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-tooly-red" />
                  <span>{activeMobileSection.title}</span>
                </h4>
                {activeMobileSection.content}
              </div>
            )}
          </div>

          {/* Desktop / Tablet: expanded footer columns */}
          {footerSections.map((sec) => (
            <div key={sec.id} className={cn('hidden md:block space-y-3', sec.colClass)}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-tooly-red" />
                <span>{sec.title}</span>
              </h4>
              {sec.content}
            </div>
          ))}
        </div>

        {/* BOTTOM METADATA & LEGAL BAR */}
        <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>{dict.footer.rightsReserved}</p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-neutral-400 text-xs">
            <Link
              href={`/${locale}/terms`}
              className="hover:text-white transition-colors"
            >
              {dict.footer.legalTerms}
            </Link>
            <Link
              href={`/${locale}/privacy`}
              className="hover:text-white transition-colors"
            >
              {dict.footer.privacyPolicy}
            </Link>
            <Link
              href={`/${locale}/refund`}
              className="hover:text-white transition-colors"
            >
              {dict.footer.refundPolicy}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <span className="text-neutral-500">{dict.footer.officialCurrency}</span>
              <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/15">
                {dict.common.currencyFull}
              </span>
            </div>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MASSIVE DISPLAY WORDMARK AT THE VERY BOTTOM ("Tooly") */}
        <div className="w-full flex justify-center items-end overflow-hidden pt-4 pb-0 select-none pointer-events-none -mb-4 sm:-mb-6 lg:-mb-8">
          <span className="text-[17vw] sm:text-[19vw] lg:text-[21vw] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.18] via-white/[0.05] to-transparent uppercase drop-shadow-[0_0_35px_rgba(255,255,255,0.03)]">
            Tooly
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

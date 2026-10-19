import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

export function Footer({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];

  return (
    <footer className="bg-surface border-t border-line mt-20">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-start">
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="relative h-10 w-36">
              <Image
                src="/brand/tooly-logo.png"
                alt="Tooly.tn Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-muted max-w-md leading-relaxed">{dict.footer.about}</p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-control border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{dict.common.offlinePaymentNotice}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              {dict.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link
                  href={`/${locale}/catalog`}
                  className="hover:text-tooly-red transition-colors"
                >
                  {dict.nav.catalog}
                </Link>
              </li>
              <li>
                <a href={`/${locale}#categories`} className="hover:text-ink transition-colors">
                  {dict.nav.categories}
                </a>
              </li>
              <li>
                <a href={`/${locale}#how-it-works`} className="hover:text-ink transition-colors">
                  {dict.nav.howItWorks}
                </a>
              </li>
              <li>
                <a href={`/${locale}#trust`} className="hover:text-ink transition-colors">
                  {dict.nav.trust}
                </a>
              </li>
              <li>
                <a href={`/${locale}#faq`} className="hover:text-ink transition-colors">
                  {dict.nav.faq}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal and Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
              {dict.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <span className="hover:text-ink cursor-pointer">{dict.footer.legalTerms}</span>
              </li>
              <li>
                <span className="hover:text-ink cursor-pointer">{dict.footer.privacyPolicy}</span>
              </li>
              <li>
                <span className="hover:text-ink cursor-pointer">{dict.footer.refundPolicy}</span>
              </li>
              <li>
                <span className="text-xs text-ink/70 flex items-center gap-1.5 pt-2">
                  <HeartHandshake className="w-4 h-4 text-tooly-red shrink-0" />
                  <span>دعم تونسي 100%</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resale and Affiliation Transparency Disclaimer */}
        <div className="p-4 rounded-control bg-paper border border-line text-xs text-muted leading-relaxed mb-8 text-start">
          <p className="font-semibold text-ink mb-1">
            {locale === 'ar' ? 'إشعار الشفافية والمسؤولية:' : 'Transparency & Legal Notice:'}
          </p>
          <p>{dict.footer.resaleDisclaimer}</p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>{dict.footer.rightsReserved}</p>
          <div className="flex items-center gap-2">
            <span>العملة الرسمية:</span>
            <span className="font-bold text-ink bg-paper px-2 py-0.5 rounded border border-line">
              {dict.common.currencyFull}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

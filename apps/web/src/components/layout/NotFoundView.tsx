'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Compass, MessageCircle, HelpCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Locale } from '@tooly/contracts';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CtaArrow } from '@/components/ui/CtaArrow';

interface NotFoundViewProps {
  locale?: Locale;
}

const NOT_FOUND_COPY: Record<
  Locale,
  {
    badge: string;
    title: string;
    description: string;
    homeCta: string;
    catalogCta: string;
    supportCta: string;
    needHelp: string;
  }
> = {
  ar: {
    badge: 'خطأ 404 • الصفحة غير موجودة',
    title: 'أوبس! لم نتمكن من العثور على هذه الصفحة',
    description:
      'يبدو أن الرابط الذي اتبعته غير صحيح أو أن الصفحة تم نقلها إلى عنوان جديد. سنجاب تولي حزين لفقدانك، لكن لا تقلق، يمكنك العودة بسرعة إلى متجرنا الرقمي!',
    homeCta: 'العودة إلى الرئيسية',
    catalogCta: 'تصفح الكتالوج',
    supportCta: 'مساعدة عبر واتساب',
    needHelp: 'هل تبحث عن اشتراك محدد أو تحتاج مساعدة فورية؟',
  },
  fr: {
    badge: 'Erreur 404 • Page introuvable',
    title: 'Oups ! Cette page s’est égarée',
    description:
      'Le lien que vous avez suivi est peut-être incorrect ou la page a été déplacée. Ne soyez pas triste comme notre mascotte Tooly, retrouvez tous vos abonnements digitaux en un clic !',
    homeCta: 'Retour à l’accueil',
    catalogCta: 'Explorer le catalogue',
    supportCta: 'Aide via WhatsApp',
    needHelp: 'Vous cherchez un outil précis ou avez besoin d’aide ?',
  },
  en: {
    badge: 'Error 404 • Page Not Found',
    title: 'Oops! We couldn’t find this page',
    description:
      'The link you followed may be broken or the page may have been moved. Don’t be sad like our Tooly squirrel mascot—you can easily get right back on track!',
    homeCta: 'Back to Home',
    catalogCta: 'Browse Catalog',
    supportCta: 'WhatsApp Support',
    needHelp: 'Looking for a specific tool or need instant assistance?',
  },
};

export function NotFoundView({ locale: initialLocale }: NotFoundViewProps) {
  const [currentLocale, setCurrentLocale] = useState<Locale>(initialLocale || 'ar');

  // Detect locale from path if not explicitly provided
  useEffect(() => {
    if (!initialLocale && typeof window !== 'undefined') {
      const seg = window.location.pathname.split('/')[1];
      if (seg === 'fr' || seg === 'en' || seg === 'ar') {
        setCurrentLocale(seg as Locale);
      }
    }
  }, [initialLocale]);

  const t = NOT_FOUND_COPY[currentLocale] || NOT_FOUND_COPY.ar;
  const isAr = currentLocale === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      lang={currentLocale}
      className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20 select-none overflow-hidden"
    >
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-tooly-red/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <Badge variant="accent" size="sm" className="mb-6 font-bold">
          <span>{t.badge}</span>
        </Badge>

        {/* Mascot Character Image */}
        <div className="relative mb-6 group">
          {/* Subtle back illumination behind the mascot */}
          <div className="absolute inset-0 bg-radial from-amber-500/20 via-tooly-red/10 to-transparent rounded-full blur-2xl scale-110 pointer-events-none" />

          <div className="relative w-64 sm:w-80 h-72 sm:h-96 mx-auto">
            <Image
              src="/images/notfound.png"
              alt="Tooly.tn 404 Mascot Character"
              fill
              sizes="(max-width: 640px) 256px, 320px"
              priority
              className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_45px_rgba(245,47,61,0.25)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Big Friendly 404 Title */}
        <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight mb-3">
          {t.title}
        </h1>

        {/* Explanatory Text */}
        <p className="text-xs sm:text-base text-muted max-w-lg mb-8 leading-relaxed">
          {t.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10">
          <Link href={`/${currentLocale}`} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-md shadow-tooly-red/20 font-bold gap-2"
            >
              <Home className="w-4 h-4" />
              <span>{t.homeCta}</span>
            </Button>
          </Link>

          <Link href={`/${currentLocale}/catalog`} className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="md"
              className="w-full sm:w-auto border-line text-ink hover:bg-surface font-semibold gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>{t.catalogCta}</span>
              <CtaArrow className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <a
            href="https://wa.me/21696707406"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button
              variant="ghost"
              size="md"
              className="w-full sm:w-auto text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 gap-2 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.supportCta}</span>
            </Button>
          </a>
        </div>

        {/* Quick Locale Switcher for 404 visitors */}
        <div className="pt-6 border-t border-line/60 flex items-center justify-center gap-4 text-xs text-muted">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted/80">
            Language / اللغة :
          </span>
          <div className="flex items-center gap-3 font-semibold">
            <button
              type="button"
              onClick={() => setCurrentLocale('ar')}
              className={`hover:text-tooly-red transition-colors ${
                currentLocale === 'ar' ? 'text-tooly-red font-bold underline' : ''
              }`}
            >
              العربية
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentLocale('fr')}
              className={`hover:text-tooly-red transition-colors ${
                currentLocale === 'fr' ? 'text-tooly-red font-bold underline' : ''
              }`}
            >
              Français
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setCurrentLocale('en')}
              className={`hover:text-tooly-red transition-colors ${
                currentLocale === 'en' ? 'text-tooly-red font-bold underline' : ''
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundView;

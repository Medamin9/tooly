import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  Palette,
  Video,
  Cpu,
  Workflow,
  HelpCircle,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { DEMO_PLANS } from '@/lib/catalog/data';
import { HeroInteractiveScene } from '@/components/motion/HeroInteractiveScene';
import { ScrollRevealSequence } from '@/components/motion/ScrollRevealSequence';
import { PlanCard } from '@/components/catalog/PlanCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }
  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];
  const featuredPlans = DEMO_PLANS.filter((p) => p.isFeatured);

  const categoryIcons = {
    ai: <Cpu className="w-5 h-5" />,
    design: <Palette className="w-5 h-5" />,
    video: <Video className="w-5 h-5" />,
    productivity: <Workflow className="w-5 h-5" />,
    developer: <Layers className="w-5 h-5" />,
  };

  return (
    <main className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 overflow-hidden">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 text-start">
              <div className="inline-flex items-center gap-2 bg-tooly-soft-red text-tooly-red text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-tooly-red/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-tooly-red animate-pulse" />
                <span>{dict.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.15] mb-6">
                {dict.hero.titlePart1}{' '}
                <span className="text-tooly-red underline decoration-tooly-red/30 underline-offset-8">
                  {dict.hero.titleHighlight}
                </span>{' '}
                {dict.hero.titlePart2}
              </h1>

              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mb-8">
                {dict.hero.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10">
                <Link href={`/${typedLocale}/catalog`}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    <span>{dict.hero.primaryCta}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <span>{dict.hero.secondaryCta}</span>
                  </Button>
                </a>
              </div>

              {/* Value propositions */}
              <div className="pt-6 border-t border-line grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-semibold text-ink">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dict.hero.feature1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dict.hero.feature2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dict.hero.feature3}</span>
                </div>
              </div>
            </div>

            {/* Hero Interactive 3D / Tactile Scene */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroInteractiveScene locale={typedLocale} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY DISCOVERY SECTION */}
      <section id="categories" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-start mb-10">
          <Badge variant="accent" size="sm" className="mb-2">
            التصنيفات المعتمدة
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2">
            {dict.categories.title}
          </h2>
          <p className="text-sm text-muted max-w-xl">{dict.categories.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(['ai', 'design', 'video', 'productivity', 'developer'] as const).map((catKey) => {
            const cat = dict.categories[catKey];
            return (
              <Link
                key={catKey}
                href={`/${typedLocale}/catalog?category=${catKey}`}
                className="group block"
              >
                <Card hoverable className="h-full p-5 text-start">
                  <div className="w-10 h-10 rounded-control bg-paper text-ink group-hover:bg-tooly-soft-red group-hover:text-tooly-red flex items-center justify-center mb-3 transition-colors">
                    {categoryIcons[catKey]}
                  </div>
                  <h3 className="text-base font-bold text-ink group-hover:text-tooly-red transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed line-clamp-2">{cat.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. CURATED FEATURED PLANS */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent" size="sm">
                عروض مختارة
              </Badge>
              <Badge variant="demo" size="sm">
                {dict.common.demoBadge}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2">
              {dict.curated.title}
            </h2>
            <p className="text-sm text-muted max-w-xl">{dict.curated.subtitle}</p>
          </div>
          <Link href={`/${typedLocale}/catalog`}>
            <Button variant="outline" size="sm">
              <span>{dict.common.viewCatalog}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        {/* Demo Notice Alert */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-control p-3.5 mb-8 text-xs text-amber-900 flex items-center gap-2.5 text-start">
          <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{dict.common.demoNotice}</span>
        </div>

        <ScrollRevealSequence className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locale={typedLocale} />
          ))}
        </ScrollRevealSequence>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="bg-surface border-y border-line py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="accent" size="sm" className="mb-2">
              سهولة وأمان
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3">
              {dict.howItWorksSection.title}
            </h2>
            <p className="text-sm text-muted leading-relaxed">{dict.howItWorksSection.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-paper p-6 sm:p-8 rounded-card border border-line text-start relative">
              <span className="text-3xl font-black text-tooly-red/30 mb-2 block">01</span>
              <h3 className="text-lg font-bold text-ink mb-2">
                {dict.howItWorksSection.step1Title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {dict.howItWorksSection.step1Desc}
              </p>
            </div>

            <div className="bg-paper p-6 sm:p-8 rounded-card border border-line text-start relative">
              <span className="text-3xl font-black text-tooly-red/30 mb-2 block">02</span>
              <h3 className="text-lg font-bold text-ink mb-2">
                {dict.howItWorksSection.step2Title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {dict.howItWorksSection.step2Desc}
              </p>
            </div>

            <div className="bg-paper p-6 sm:p-8 rounded-card border border-line text-start relative">
              <span className="text-3xl font-black text-tooly-red/30 mb-2 block">03</span>
              <h3 className="text-lg font-bold text-ink mb-2">
                {dict.howItWorksSection.step3Title}
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                {dict.howItWorksSection.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & TRANSPARENCY SECTION */}
      <section id="trust" className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-start mb-12">
          <Badge variant="accent" size="sm" className="mb-2">
            مبادئنا الأساسية
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2">
            {dict.trustSection.title}
          </h2>
          <p className="text-sm text-muted max-w-xl">{dict.trustSection.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-start p-6 sm:p-8 bg-surface">
            <div className="w-12 h-12 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">{dict.trustSection.pillar1Title}</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {dict.trustSection.pillar1Desc}
            </p>
          </Card>

          <Card className="text-start p-6 sm:p-8 bg-surface">
            <div className="w-12 h-12 rounded-control bg-tooly-soft-red text-tooly-red flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">{dict.trustSection.pillar2Title}</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {dict.trustSection.pillar2Desc}
            </p>
          </Card>

          <Card className="text-start p-6 sm:p-8 bg-surface">
            <div className="w-12 h-12 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-ink mb-2">{dict.trustSection.pillar3Title}</h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {dict.trustSection.pillar3Desc}
            </p>
          </Card>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center mb-12">
          <Badge variant="accent" size="sm" className="mb-2">
            إجابات واضحة
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2">
            {dict.faqSection.title}
          </h2>
          <p className="text-sm text-muted">{dict.faqSection.subtitle}</p>
        </div>

        <div className="space-y-4 text-start">
          {dict.faqSection.items.map((item, idx) => (
            <details
              key={idx}
              className="group bg-surface rounded-card border border-line p-5 transition-all duration-200 open:shadow-sm"
            >
              <summary className="font-bold text-sm sm:text-base text-ink cursor-pointer flex items-center justify-between list-none select-none">
                <span>{item.q}</span>
                <span className="text-muted group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-muted leading-relaxed pt-3 border-t border-line">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-ink text-surface rounded-feature p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute w-96 h-96 bg-tooly-red/10 rounded-full blur-3xl -top-20 -left-20 pointer-events-none" />
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 max-w-xl mx-auto leading-tight">
            جاهز لرفع إنتاجيتك بالحلول الرقمية الحديثة؟
          </h2>
          <p className="text-surface/80 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            تصفح كتالوج الأدوات المتاح حالياً وتواصل معنا لاختيار الخطة الأنسب لعملك أو دراستك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={`/${typedLocale}/catalog`}>
              <Button variant="primary" size="lg">
                <span>{dict.common.viewCatalog}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </Link>
            <a
              href="mailto:support@tooly.tn"
              className="inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 border border-surface/20 hover:bg-surface/10 text-surface text-base px-6 py-3.5"
            >
              {dict.common.contactSupport}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

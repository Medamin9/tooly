'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { trackMetaEvent } from '@/components/analytics/MetaPixel';
import {
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  HelpCircle,
  BadgeCheck,
  Cpu,
  Palette,
  Video,
  Terminal,
  Workflow,
  Layers,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { StorefrontPlan } from '@/lib/catalog/mappers';
import { Badge } from '@/components/ui/Badge';
import {
  CopyRefButton,
  ProductStickyPricingCard,
  ProductFaqAccordion,
} from './ProductInteractiveElements';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  ai: Cpu,
  design: Palette,
  video: Video,
  developer: Terminal,
  productivity: Workflow,
};

type DictCategoryKey = 'ai' | 'design' | 'video' | 'productivity' | 'developer';

export function ProductDetailView({
  plan,
  locale,
  dict,
}: {
  plan: StorefrontPlan;
  locale: Locale;
  dict: Dictionary;
}) {
  const defaultVariant = useMemo(
    () => plan.variants.find((v) => v.isAvailable) || plan.variants[0],
    [plan.variants],
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant?.id || plan.id,
  );

  const activeVariant = useMemo(
    () => plan.variants.find((v) => v.id === selectedVariantId) || defaultVariant,
    [plan.variants, selectedVariantId, defaultVariant],
  );

  const CategoryIcon = CATEGORY_ICONS[plan.category] ?? Layers;
  const dictCategory =
    dict.categories[plan.category as DictCategoryKey]?.name || plan.category;
  const categoryLabel = plan.categoryName || dictCategory;
  const productLogo = plan.resolvedIconUrl;

  const isDemo = activeVariant?.isDemo ?? plan.isDemo;
  const displayDuration = activeVariant?.durationLabel[locale] ?? plan.durationLabel[locale];
  const displayFeatures = activeVariant?.features ?? plan.features[locale];
  const displayRestrictions = activeVariant?.restrictions ?? plan.restrictions[locale];

  useEffect(() => {
    trackMetaEvent('ViewContent', {
      content_name: plan.name,
      content_category: categoryLabel,
      value: activeVariant?.priceTND ?? plan.priceTND,
      currency: 'TND',
    });
  }, [plan.slug, selectedVariantId]);

  return (
    <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-2 text-xs text-muted flex-wrap">
          <li>
            <Link href={`/${locale}`} className="hover:text-ink transition-colors">
              {locale === 'ar' ? 'الرئيسية' : locale === 'fr' ? 'Accueil' : 'Home'}
            </Link>
          </li>
          <li className="text-line">/</li>
          <li>
            <Link href={`/${locale}/catalog`} className="hover:text-ink transition-colors">
              {dict.nav.catalog}
            </Link>
          </li>
          <li className="text-line">/</li>
          <li>
            <Link
              href={`/${locale}/catalog?category=${encodeURIComponent(plan.category)}`}
              className="text-muted hover:text-ink transition-colors"
            >
              {categoryLabel}
            </Link>
          </li>
          <li className="text-line">/</li>
          <li className="font-bold text-tooly-red" aria-current="page">
            {plan.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Hero, Specs & Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. PRODUCT HERO CARD */}
          <section className="bg-surface rounded-card border border-line p-6 sm:p-8 relative overflow-hidden shadow-sm">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge
                variant="accent"
                size="sm"
                className="uppercase tracking-wider flex items-center gap-1.5"
              >
                <CategoryIcon className="w-3.5 h-3.5" />
                <span>{categoryLabel}</span>
              </Badge>

              {isDemo && (
                <Badge variant="demo" size="sm">
                  {dict.common.demoBadge}
                </Badge>
              )}

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {locale === 'ar'
                    ? 'تفعيل فوري'
                    : locale === 'fr'
                    ? 'Livraison express'
                    : 'Instant Activation'}
                </span>
              </span>
            </div>

            {/* Title & Brand Logo */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-2">
                  {plan.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <span className="font-medium">
                    {locale === 'ar'
                      ? 'المزود المعتمد:'
                      : locale === 'fr'
                      ? 'Fournisseur :'
                      : 'Authorized Provider:'}
                  </span>
                  <span className="font-bold text-ink inline-flex items-center gap-1">
                    {plan.provider}
                    <BadgeCheck className="w-4 h-4 text-tooly-red inline" />
                  </span>
                </div>
              </div>

              {productLogo && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-control bg-paper border border-line p-2 flex items-center justify-center shrink-0 shadow-sm">
                  <img
                    src={productLogo}
                    alt={plan.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Tagline */}
            {plan.tagline[locale] && (
              <p className="text-base sm:text-lg font-semibold text-tooly-red mb-4">
                {plan.tagline[locale]}
              </p>
            )}

            {/* Detailed Description */}
            {plan.description[locale] && (
              <div className="p-4 sm:p-5 rounded-control bg-paper/70 border border-line text-sm sm:text-base text-ink/85 leading-relaxed">
                {plan.description[locale]}
              </div>
            )}

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-line">
              <div className="bg-surface p-3 rounded-control border border-line">
                <span className="text-[11px] text-muted block mb-0.5">
                  {locale === 'ar'
                    ? 'مدة الاشتراك'
                    : locale === 'fr'
                    ? 'Durée'
                    : 'Duration'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-ink">
                  {displayDuration}
                </span>
              </div>
              <div className="bg-surface p-3 rounded-control border border-line">
                <span className="text-[11px] text-muted block mb-0.5">
                  {locale === 'ar'
                    ? 'سرعة التفعيل'
                    : locale === 'fr'
                    ? 'Délai'
                    : 'Delivery Time'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-700">
                  {locale === 'ar'
                    ? 'فوري (15 دقيقة)'
                    : locale === 'fr'
                    ? 'Express (15 min)'
                    : 'Instant (15 min)'}
                </span>
              </div>
              <div className="bg-surface p-3 rounded-control border border-line">
                <span className="text-[11px] text-muted block mb-0.5">
                  {locale === 'ar'
                    ? 'الضمان'
                    : locale === 'fr'
                    ? 'Garantie'
                    : 'Guarantee'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-ink">
                  {locale === 'ar'
                    ? 'تغطية 100%'
                    : locale === 'fr'
                    ? '100% active'
                    : '100% Active'}
                </span>
              </div>
              <div className="bg-surface p-3 rounded-control border border-line">
                <span className="text-[11px] text-muted block mb-0.5">
                  {locale === 'ar'
                    ? 'الدفع المحلي'
                    : locale === 'fr'
                    ? 'Paiement'
                    : 'Local Payment'}
                </span>
                <span className="text-xs sm:text-sm font-bold text-tooly-red">
                  {locale === 'ar'
                    ? 'بالدينار TND'
                    : locale === 'fr'
                    ? 'En dinars TND'
                    : 'In TND Dinars'}
                </span>
              </div>
            </div>
          </section>

          {/* 2. INCLUDED FEATURES SECTION */}
          <section className="bg-surface p-6 sm:p-8 rounded-card border border-line shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-control bg-tooly-soft-red flex items-center justify-center text-tooly-red">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink">
                    {dict.productDetail.features}
                  </h2>
                  <p className="text-xs text-muted">
                    {locale === 'ar'
                      ? 'جميع الميزات والخصائص المتضمنة في هذا الاشتراك'
                      : locale === 'fr'
                      ? 'Toutes les fonctionnalités incluses avec ce forfait'
                      : 'All features and perks included in this subscription'}
                  </p>
                </div>
              </div>
            </div>

            {displayFeatures.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {displayFeatures.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-control bg-paper/50 border border-line hover:border-emerald-300 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">
                {locale === 'ar'
                  ? 'لا توجد ميزات إضافية مسجلة لهذه الباقة.'
                  : locale === 'fr'
                  ? 'Aucune caractéristique enregistrée pour cette formule.'
                  : 'No additional features listed for this plan.'}
              </p>
            )}
          </section>

          {/* 3. STEP-BY-STEP FULFILLMENT & ACTIVATION */}
          <section className="bg-surface p-6 sm:p-8 rounded-card border border-line shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-control bg-emerald-50 flex items-center justify-center text-emerald-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {dict.productDetail.deliveryMethod}
                </h2>
                <p className="text-xs text-muted">
                  {locale === 'ar'
                    ? 'خطوات استكمال الطلب والتسليم في تونس'
                    : locale === 'fr'
                    ? 'Processus de commande et d’activation en Tunisie'
                    : 'Order fulfillment and delivery steps in Tunisia'}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink/80 mb-5 leading-relaxed bg-paper p-3.5 rounded-control border border-line">
              {plan.deliveryMethod[locale]}
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-control bg-paper/60 border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-tooly-red text-surface flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-ink">
                      {locale === 'ar'
                        ? 'رمز الخطة للاستخدام عند الطلب:'
                        : locale === 'fr'
                        ? 'Référence unique de la commande :'
                        : 'Order reference code:'}
                    </p>
                    <p className="text-[11px] text-muted">
                      {locale === 'ar'
                        ? 'احفظ هذا الرمز لتأكيد تفعيل خطتك فوراً'
                        : locale === 'fr'
                        ? 'Conservez ce code pour accélérer votre activation'
                        : 'Save this reference code to expedite your activation'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <code className="font-mono bg-surface px-2.5 py-1 rounded border border-line font-bold text-tooly-red text-xs">
                    REF-{plan.slug.toUpperCase()}
                  </code>
                  <CopyRefButton
                    code={`REF-${plan.slug.toUpperCase()}`}
                    locale={locale}
                  />
                </div>
              </div>

              <div className="p-4 rounded-control bg-paper/60 border border-line flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-tooly-red text-surface flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-ink">
                    {locale === 'ar'
                      ? 'تأكيد الدفع بالدينار التونسي'
                      : locale === 'fr'
                      ? 'Confirmation du paiement en dinars'
                      : 'Confirm local TND payment'}
                  </p>
                  <p className="text-[11px] text-muted">
                    {locale === 'ar'
                      ? 'عبر تطبيق D17 أو التحويل البنكي المحلي (RIB) دون الحاجة لأي بطاقة دولية'
                      : locale === 'fr'
                      ? 'Paiement direct via D17 ou virement bancaire local (RIB)'
                      : 'Via D17 app or local bank transfer (RIB) without international credit cards'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-control bg-paper/60 border border-line flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-tooly-red text-surface flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-ink">
                    {locale === 'ar'
                      ? 'استلام الدعوة أو بيانات الدخول'
                      : locale === 'fr'
                      ? 'Réception de l’invitation ou des identifiants'
                      : 'Receive workspace invitation or access details'}
                  </p>
                  <p className="text-[11px] text-muted">
                    {locale === 'ar'
                      ? 'يصلك رابط الانضمام الرسمي أو بيانات الحساب في غضون دقائق مع الدعم الكامل'
                      : locale === 'fr'
                      ? 'Activation sur votre email personnel avec garantie continue'
                      : 'Official workspace invite or account details delivered within minutes'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. TERMS & USAGE RESTRICTIONS */}
          <section className="bg-surface p-6 sm:p-8 rounded-card border border-line shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-control bg-amber-50 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {dict.productDetail.restrictions}
                </h2>
                <p className="text-xs text-muted">
                  {locale === 'ar'
                    ? 'سياسات الاستخدام العادل المقررة لضمان أفضل استقرار'
                    : locale === 'fr'
                    ? 'Règles de conformité et d’utilisation équitable'
                    : 'Fair use policies and compliance rules for optimal stability'}
                </p>
              </div>
            </div>

            {displayRestrictions.length > 0 ? (
              <ul className="space-y-2.5">
                {displayRestrictions.map((rest, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-control bg-amber-50/40 border border-amber-200/60 text-xs text-amber-900"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span className="leading-relaxed font-medium">{rest}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted">
                {locale === 'ar'
                  ? 'لا توجد قيود خاصة إضافية على هذه الباقة.'
                  : locale === 'fr'
                  ? 'Aucune restriction particulière signalée pour cette formule.'
                  : 'No additional special restrictions listed for this plan.'}
              </p>
            )}
          </section>

          {/* 5. FREQUENTLY ASKED QUESTIONS */}
          <section className="bg-surface p-6 sm:p-8 rounded-card border border-line shadow-sm">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-control bg-paper flex items-center justify-center text-ink">
                <HelpCircle className="w-4 h-4 text-tooly-red" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-ink">
                  {locale === 'ar'
                    ? 'الأسئلة الشائعة حول هذا الاشتراك'
                    : locale === 'fr'
                    ? 'Questions fréquentes sur ce forfait'
                    : 'Frequently Asked Questions about this plan'}
                </h2>
                <p className="text-xs text-muted">
                  {locale === 'ar'
                    ? 'إجابات واضحة ومباشرة حول التفعيل والدفع في تونس'
                    : locale === 'fr'
                    ? 'Réponses claires sur l’activation et le paiement en Tunisie'
                    : 'Clear answers about activation, guarantees, and local payment'}
                </p>
              </div>
            </div>

            <ProductFaqAccordion locale={locale} />
          </section>
        </div>

        {/* Right Column: Sticky Pricing & HoloCard 3D Interaction */}
        <div className="lg:col-span-4">
          <ProductStickyPricingCard
            plan={plan}
            locale={locale}
            dict={dict}
            activeVariant={activeVariant}
            onSelectVariant={setSelectedVariantId}
          />
        </div>
      </div>
    </main>
  );
}


'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Clock, Layers } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import type { DemoPlan } from '@/lib/catalog/data';
import type { StorefrontPlan } from '@/lib/catalog/mappers';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { HoloCard, HoloPreset } from '../motion/HoloCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CtaArrow } from '../ui/CtaArrow';
import { Modal } from '../ui/Modal';

const CATEGORY_HOLO_CONFIG: Record<
  string,
  { preset: HoloPreset; foilColor: string }
> = {
  ai: { preset: 'cosmos', foilColor: '#f52f3d' },
  design: { preset: 'rainbow', foilColor: '#ec4899' },
  video: { preset: 'shards', foilColor: '#f97316' },
  developer: { preset: 'bursts', foilColor: '#3b82f6' },
  productivity: { preset: 'gold', foilColor: '#eab308' },
};

type DictCategoryKey = 'ai' | 'design' | 'video' | 'productivity' | 'developer';

export function PlanCard({
  plan,
  locale,
  preset,
  foilColor,
}: {
  plan: DemoPlan | StorefrontPlan;
  locale: Locale;
  preset?: HoloPreset;
  foilColor?: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dict = dictionaries[locale];
  const storefrontPlan = plan as StorefrontPlan;

  const holoConfig = CATEGORY_HOLO_CONFIG[plan.category] ?? {
    preset: 'bursts' as HoloPreset,
    foilColor: '#f52f3d',
  };
  const activePreset = preset ?? holoConfig.preset;
  const activeFoilColor = foilColor ?? holoConfig.foilColor;

  const dictCategory =
    dict.categories[plan.category as DictCategoryKey]?.name || plan.category;
  const categoryLabel = storefrontPlan.categoryName || dictCategory;
  const isDemo = storefrontPlan.isDemo ?? true;
  const isAvailable = storefrontPlan.isAvailable ?? true;
  const variantCount = storefrontPlan.variants?.length ?? 1;
  const resolvedIconUrl = storefrontPlan.resolvedIconUrl;
  const variantFeatures =
    storefrontPlan.variants?.[0]?.features ?? plan.features[locale] ?? [];

  return (
    <>
      <HoloCard
        preset={activePreset}
        foilColor={activeFoilColor}
        intensity={0.3}
        scale={1.0}
        edgeSparkle={0.3}
        glare={0.1}
        opacity={0.5}
        radius={20}
        tiltMax={10}
        hoverScale={1.02}
        idle={false}
        className="h-full"
      >
        <div className="bg-surface rounded-card border border-line p-3 sm:p-5 md:p-6 flex flex-col justify-between h-full relative group">
          <div>
            {/* Header row: Category & Demo/Availability Tag */}
            <div className="flex items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-3">
              <Badge
                variant="accent"
                size="sm"
                className="uppercase tracking-wider text-[9px] sm:text-[11px] px-1.5 py-0.5 truncate max-w-[65%]"
              >
                {categoryLabel}
              </Badge>
              {isDemo ? (
                <Badge variant="demo" size="sm" className="text-[9px] sm:text-[11px] px-1.5 py-0.5 shrink-0">
                  {dict.common.demoBadge}
                </Badge>
              ) : !isAvailable ? (
                <Badge variant="warning" size="sm" className="text-[9px] sm:text-[11px] px-1.5 py-0.5 shrink-0">
                  {locale === 'ar'
                    ? 'غير متوفر'
                    : locale === 'fr'
                      ? 'Indisponible'
                      : 'Unavailable'}
                </Badge>
              ) : null}
            </div>

            {/* Plan Name, Provider & Small Icon (Left in AR / Right in FR & EN) */}
            <div
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              className="flex items-center justify-between gap-1.5 sm:gap-2.5 mb-2 sm:mb-3 text-start"
            >
              <div className="min-w-0 flex-1">
                <h3 className="text-sm sm:text-lg md:text-xl font-bold text-ink group-hover:text-tooly-red transition-colors truncate">
                  {plan.name}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted font-medium truncate">{plan.provider}</p>
              </div>
              {resolvedIconUrl && (
                <div className="w-8 h-8 sm:w-11 sm:h-11 md:w-14 md:h-14 flex items-center justify-center shrink-0">
                  <img
                    src={resolvedIconUrl}
                    alt={plan.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Tagline */}
            <p className="text-[10px] sm:text-xs text-muted leading-tight sm:leading-relaxed mb-3 sm:mb-5 text-start line-clamp-2 min-h-[26px] sm:min-h-0">
              {plan.tagline[locale]}
            </p>

            {/* Price & Duration */}
            <div className="bg-paper p-2 sm:p-3.5 rounded-control border border-line mb-3 sm:mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 text-start">
              <div>
                <span className="text-base sm:text-xl md:text-2xl font-extrabold text-ink">{plan.priceTND}</span>
                <span className="text-[10px] sm:text-xs font-bold text-ink ms-1">{dict.common.currency}</span>
              </div>
              <div className="flex items-center gap-1">
                {variantCount > 1 && (
                  <span
                    className="text-[9px] sm:text-[10px] font-semibold text-tooly-red bg-tooly-soft-red px-1 sm:px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"
                    title={`${variantCount} plans`}
                  >
                    <Layers className="w-2.5 h-2.5" />
                    +{variantCount - 1}
                  </span>
                )}
                <span className="text-[9px] sm:text-xs text-muted font-medium bg-surface px-1.5 sm:px-2 py-0.5 rounded border border-line truncate">
                  {plan.durationLabel[locale]}
                </span>
              </div>
            </div>

            {/* Delivery Method Preview */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-2.5 sm:mb-4 text-start truncate">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{plan.deliveryMethod[locale]}</span>
            </div>

            {/* Key Features */}
            <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-6 text-[10px] sm:text-xs text-ink/90 text-start">
              {variantFeatures.slice(0, 3).map((feat, idx) => (
                <li key={idx} className={`items-start gap-1.5 sm:gap-2 ${idx >= 2 ? 'hidden sm:flex' : 'flex'}`}>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-tight truncate sm:whitespace-normal">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button Row */}
          <div className="pt-2.5 sm:pt-4 border-t border-line flex flex-col sm:flex-row gap-1.5 sm:gap-2 relative z-10">
            <Link href={`/${locale}/product/${plan.slug}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-[10px] sm:text-xs py-1 px-1.5 sm:py-2 sm:px-3">
                <span className="truncate">{dict.common.viewDetails}</span>
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              disabled={!isAvailable}
              onClick={() => setIsModalOpen(true)}
              className="flex-1 text-[10px] sm:text-xs py-1 px-1.5 sm:py-2 sm:px-3 gap-1"
            >
              <CtaArrow className="w-3 h-3 shrink-0" />
              <span className="truncate">{dict.common.requestPlan}</span>
            </Button>
          </div>
        </div>
      </HoloCard>

      {/* Offline Order Instruction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${dict.common.requestPlan} — ${plan.name}`}
        description={`${dict.productDetail.termsTitle} (${plan.durationLabel[locale]})`}
      >
        <div className="space-y-4 text-start text-sm">
          <div className="bg-paper p-4 rounded-control border border-line flex items-baseline justify-between">
            <span className="font-semibold text-ink">{dict.common.totalPrice}</span>
            <span className="text-xl font-extrabold text-tooly-red">
              {plan.priceTND} {dict.common.currency}
            </span>
          </div>

          <div className="p-3.5 rounded-control bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{dict.common.offlinePaymentNotice}</p>
          </div>

          <div className="space-y-2 text-xs text-muted">
            <p className="font-bold text-ink">{dict.common.orderStepsTitle}</p>
            <ol className="list-decimal list-inside space-y-1 text-ink/80">
              <li>
                {dict.common.orderCodeLabel}{' '}
                <code className="bg-paper px-1.5 py-0.5 rounded font-mono font-bold text-ink">
                  REF-{plan.slug.toUpperCase()}
                </code>
              </li>
              <li>
                {dict.common.deliveryMethodLabel} {plan.deliveryMethod[locale]}
              </li>
              <li>{dict.common.supportPaymentStep}</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              {dict.common.close}
            </Button>
            <Link
              href={`/${locale}/checkout?plan=${plan.slug}&variant=${plan.id}`}
              className="inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-xs px-4 py-2"
            >
              {dict.common.requestPlan}
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}

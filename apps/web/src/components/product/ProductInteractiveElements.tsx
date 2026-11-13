'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Copy,
  Check,
  Send,
  ArrowLeft,
  ShieldCheck,
  PhoneCall,
  ChevronDown,
} from 'lucide-react';
import { Locale } from '@tooly/contracts';
import type { DemoPlan } from '@/lib/catalog/data';
import type { StorefrontPlan, StorefrontVariant } from '@/lib/catalog/mappers';
import { Dictionary } from '@/lib/i18n/dictionaries';
import { HoloCard, HoloPreset } from '../motion/HoloCard';
import { Button } from '../ui/Button';

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

export function CopyRefButton({
  code,
  locale,
}: {
  code: string;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-semibold bg-surface border border-line hover:border-tooly-red text-ink transition-all duration-200 active:scale-95 shadow-sm"
      title={
        locale === 'ar'
          ? 'نسخ رمز الخطة'
          : locale === 'fr'
            ? 'Copier la référence'
            : 'Copy reference code'
      }
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-700">
            {locale === 'ar' ? 'تم النسخ!' : locale === 'fr' ? 'Copié !' : 'Copied!'}
          </span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-muted" />
          <span>
            {locale === 'ar' ? 'نسخ الرمز' : locale === 'fr' ? 'Copier' : 'Copy'}
          </span>
        </>
      )}
    </button>
  );
}

export function ProductStickyPricingCard({
  plan,
  locale,
  dict,
  activeVariant,
  onSelectVariant,
}: {
  plan: DemoPlan | StorefrontPlan;
  locale: Locale;
  dict: Dictionary;
  activeVariant?: StorefrontVariant;
  onSelectVariant?: (variantId: string) => void;
}) {
  const storefrontPlan = plan as StorefrontPlan;
  const variants = storefrontPlan.variants ?? [];
  const holoConfig = CATEGORY_HOLO_CONFIG[plan.category] ?? {
    preset: 'bursts' as HoloPreset,
    foilColor: '#f52f3d',
  };

  const displayPrice = activeVariant?.priceTND ?? plan.priceTND;
  const displayDuration = activeVariant?.durationLabel[locale] ?? plan.durationLabel[locale];
  const isAvailable = activeVariant?.isAvailable ?? storefrontPlan.isAvailable ?? true;
  const checkoutVariantId = activeVariant?.id ?? plan.id;

  return (
    <div className="sticky top-28">
      <HoloCard
        preset={holoConfig.preset}
        foilColor={holoConfig.foilColor}
        intensity={0.3}
        scale={1.0}
        edgeSparkle={0.3}
        glare={0.1}
        opacity={0.5}
        radius={20}
        tiltMax={10}
        hoverScale={1.02}
        className="w-full"
      >
        <div className="bg-surface rounded-card border border-line p-6 sm:p-7 shadow-lg space-y-6 relative group">
          {/* Header & Guaranteed Price */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">
                {locale === 'ar'
                  ? 'سعر الاشتراك المضمون'
                  : locale === 'fr'
                    ? 'Prix garanti'
                    : 'Guaranteed Price'}
              </span>
              {isAvailable ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {locale === 'ar' ? 'متاح فوري' : locale === 'fr' ? 'En stock' : 'In Stock'}
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>
                    {locale === 'ar'
                      ? 'غير متوفر'
                      : locale === 'fr'
                        ? 'Indisponible'
                        : 'Unavailable'}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl sm:text-5xl font-extrabold text-ink tracking-tight">
                {displayPrice}
              </span>
              <span className="text-base font-bold text-tooly-red">
                {dict.common.currency}
              </span>
              <span className="text-xs font-medium text-muted ms-1 bg-paper px-2.5 py-1 rounded border border-line">
                / {displayDuration}
              </span>
            </div>
          </div>

          {/* Multi-variant Duration Selector */}
          {variants.length > 1 && onSelectVariant && (
            <div className="space-y-2">
              <span className="block text-[11px] font-bold text-muted uppercase tracking-wider">
                {locale === 'ar'
                  ? 'اختر المدة المناسبة'
                  : locale === 'fr'
                    ? 'Choisir la durée'
                    : 'Choose duration'}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {variants.map((variant) => {
                  const selected = variant.id === checkoutVariantId;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => onSelectVariant(variant.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-control border text-xs transition-all ${selected
                          ? 'border-tooly-red bg-tooly-soft-red/40 text-ink font-bold shadow-sm'
                          : 'border-line bg-paper text-muted hover:text-ink hover:border-ink/40'
                        }`}
                    >
                      <span>{variant.durationLabel[locale]}</span>
                      <span className="font-mono font-bold text-ink">
                        {variant.priceTND} {dict.common.currency}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Guaranteed Delivery Notice */}
          <div className="p-3.5 rounded-control bg-emerald-50/80 border border-emerald-200/90 text-xs text-emerald-900 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="leading-tight">
              <p className="font-bold">
                {locale === 'ar'
                  ? 'تسليم سريع وضمان مستمر'
                  : locale === 'fr'
                    ? 'Livraison express & Garantie'
                    : 'Express Delivery & Active Guarantee'}
              </p>
              <p className="text-[11px] text-emerald-800">
                {dict.curated.deliveryTime}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 border-t border-line">
            {isAvailable ? (
              <Link
                href={`/${locale}/checkout?plan=${plan.slug}&variant=${checkoutVariantId}`}
                className="w-full inline-flex items-center justify-center font-bold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-sm px-5 py-3.5 gap-2 shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
                <span>{dict.common.requestPlan}</span>
              </Link>
            ) : (
              <Button variant="primary" size="md" disabled className="w-full">
                <span>
                  {locale === 'ar'
                    ? 'غير متوفر حالياً'
                    : locale === 'fr'
                      ? 'Temporairement indisponible'
                      : 'Currently Unavailable'}
                </span>
              </Button>
            )}

            <a
              href={`https://wa.me/21696707406?text=${encodeURIComponent(
                locale === 'ar'
                  ? `مرحباً، أود الاستفسار حول اشتراك ${plan.name} (رمز REF-${plan.slug.toUpperCase()})`
                  : locale === 'fr'
                    ? `Bonjour, je souhaite commander ${plan.name} (REF-${plan.slug.toUpperCase()})`
                    : `Hello, I would like to inquire about ${plan.name} (REF-${plan.slug.toUpperCase()})`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-paper text-ink hover:bg-paper-dark border border-line text-xs px-4 py-2.5 gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-tooly-red" />
              <span>
                {locale === 'ar'
                  ? 'طلب مباشر عبر واتساب / الدعم'
                  : locale === 'fr'
                    ? 'Commander via WhatsApp'
                    : 'Order via WhatsApp / Support'}
              </span>
            </a>

            <Link href={`/${locale}/catalog`} className="block">
              <Button variant="outline" size="sm" className="w-full">
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>
                  {locale === 'ar'
                    ? 'العودة للكتالوج ومقارنة الأدوات'
                    : locale === 'fr'
                      ? 'Retour au catalogue'
                      : 'Back to Catalog'}
                </span>
              </Button>
            </Link>
          </div>

          {/* Value Guarantees List */}
          <div className="pt-4 border-t border-line text-[11px] text-muted space-y-2">
            <div className="flex items-start gap-2 text-start">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {locale === 'ar'
                  ? `ضمان تشغيل كامل طيلة المدة (${displayDuration})`
                  : locale === 'fr'
                    ? `Garantie intégrale active pendant ${displayDuration}`
                    : `Full active guarantee during ${displayDuration}`}
              </span>
            </div>
            <div className="flex items-start gap-2 text-start">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {locale === 'ar'
                  ? 'دعم فني تونسي محلي بالهاتف والبريد'
                  : locale === 'fr'
                    ? 'Support technique local en Tunisie par email et téléphone'
                    : 'Local Tunisian support team via email & phone'}
              </span>
            </div>
            <div className="flex items-start gap-2 text-start">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-snug">
                {locale === 'ar'
                  ? 'دفع آمن بالدينار التونسي (D17 أو تحويل بنكي)'
                  : locale === 'fr'
                    ? 'Paiement sécurisé en dinars (D17 ou virement bancaire)'
                    : 'Secure local payment in TND (D17 or bank transfer)'}
              </span>
            </div>
          </div>
        </div>
      </HoloCard>
    </div>
  );
}

export function ProductFaqAccordion({
  locale,
}: {
  locale: Locale;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs =
    locale === 'ar'
      ? [
        {
          q: 'كيف يتم تفعيل الحساب بعد الدفع؟',
          a: 'بعد إتمام التحويل عبر D17 أو التحويل البنكي، يتلقى بريدك الشخصي دعوة رسمية للانضمام إلى مساحة العمل أو بيانات الحساب الجاهز في غضون 15 دقيقة خلال أوقات العمل.',
        },
        {
          q: 'ماذا يحدث إذا واجهت مشكلة في الحساب أثناء فترة الاشتراك؟',
          a: 'نوفر ضمان استبدال فوري ودعم فني متواصل طيلة مدة الاشتراك المحددة. في حال حدوث أي انقطاع، يقوم فريقنا بحل المشكلة فوراً.',
        },
        {
          q: 'هل يمكنني الدفع بالدينار التونسي دون بطاقة دولية؟',
          a: 'نعم تماماً، منصة Tooly مخصصة لتونس وتتيح لك الدفع بسهولة بالدينار التونسي عبر التحويلات المحلية وD17 دون الحاجة لبطاقات دولية.',
        },
      ]
      : locale === 'fr'
        ? [
          {
            q: 'Comment s’effectue l’activation après paiement ?',
            a: 'Dès validation de votre paiement par virement ou D17, vous recevez une invitation directe ou vos identifiants sur votre email en moins de 15 minutes pendant les heures ouvrées.',
          },
          {
            q: 'Que faire en cas de problème durant la période ?',
            a: 'Tous nos forfaits incluent une garantie de continuité. Notre équipe d’assistance locale en Tunisie intervient immédiatement en cas de blocage.',
          },
          {
            q: 'Puis-je payer en dinars tunisiens sans carte internationale ?',
            a: 'Oui, Tooly.tn vous permet de régler facilement en dinars tunisiens via D17 ou virement bancaire local sans aucune carte internationale.',
          },
        ]
        : [
          {
            q: 'How is the account activated after payment?',
            a: 'Upon confirmation of your payment via D17 or bank transfer, you will receive an official invitation or access details to your personal email within 15 minutes during operating hours.',
          },
          {
            q: 'What happens if I encounter an issue during the subscription period?',
            a: 'All plans include continuous coverage and immediate replacement guarantee. Our local support team resolves any interruptions promptly.',
          },
          {
            q: 'Can I pay in Tunisian Dinars without an international card?',
            a: 'Yes, Tooly.tn allows you to pay conveniently in Tunisian Dinars (TND) via local bank transfer or D17 without requiring any international credit cards.',
          },
        ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="border border-line rounded-control bg-surface overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              className="w-full p-4 text-start flex items-center justify-between gap-4 font-bold text-sm text-ink hover:text-tooly-red transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                  }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-xs text-muted leading-relaxed border-t border-line/60 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

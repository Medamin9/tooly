import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { DEMO_PLANS } from '@/lib/catalog/data';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function generateStaticParams() {
  const params: Array<{ locale: string; slug: string }> = [];
  SUPPORTED_LOCALES.forEach((locale) => {
    DEMO_PLANS.forEach((plan) => {
      params.push({ locale, slug: plan.slug });
    });
  });
  return params;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];
  const plan = DEMO_PLANS.find((p) => p.slug === slug);

  if (!plan) {
    notFound();
  }

  return (
    <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-8 text-xs text-muted">
        <Link href={`/${typedLocale}`} className="hover:text-ink">
          الرئيسية
        </Link>
        <span>/</span>
        <Link href={`/${typedLocale}/catalog`} className="hover:text-ink">
          {dict.nav.catalog}
        </Link>
        <span>/</span>
        <span className="font-semibold text-tooly-red">{plan.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Product Info & In-depth Specs */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="accent" size="sm">
                {dict.categories[plan.category].name}
              </Badge>
              <Badge variant="demo" size="sm">
                {dict.common.demoBadge}
              </Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-2">
              {plan.name}
            </h1>
            <p className="text-sm font-semibold text-muted mb-4">{plan.provider}</p>
            <p className="text-base text-ink/85 leading-relaxed bg-surface p-5 rounded-card border border-line">
              {plan.description[typedLocale]}
            </p>
          </div>

          {/* Included Features */}
          <div className="bg-surface p-6 sm:p-8 rounded-card border border-line">
            <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-tooly-red" />
              <span>{dict.productDetail.features}</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-ink/90">
              {plan.features[typedLocale].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Restrictions */}
          <div className="bg-surface p-6 sm:p-8 rounded-card border border-line">
            <h3 className="text-lg font-bold text-ink mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>{dict.productDetail.restrictions}</span>
            </h3>
            <ul className="space-y-2 text-xs text-muted leading-relaxed">
              {plan.restrictions[typedLocale].map((rest, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{rest}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Offline Fulfillment Instructions */}
          <div className="bg-paper p-6 sm:p-8 rounded-card border border-line">
            <h3 className="text-lg font-bold text-ink mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-700" />
              <span>{dict.productDetail.deliveryMethod}</span>
            </h3>
            <p className="text-sm text-muted mb-4 leading-relaxed">
              {plan.deliveryMethod[typedLocale]}
            </p>

            <div className="p-4 rounded-control bg-surface border border-line text-xs space-y-2">
              <p className="font-bold text-ink">{dict.productDetail.offlineInstructionTitle}</p>
              <p className="text-muted leading-relaxed">
                {dict.productDetail.offlineInstructionBody}
              </p>
              <div className="pt-2 flex items-center gap-2 text-ink font-semibold">
                <span>رمز المرجع:</span>
                <code className="font-mono bg-paper px-2 py-0.5 rounded border border-line text-tooly-red">
                  REF-{plan.slug.toUpperCase()}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-surface rounded-card border border-line p-6 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold text-muted block mb-1">
                سعر الاشتراك المضمون
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-ink">{plan.priceTND}</span>
                <span className="text-sm font-bold text-ink">{dict.common.currency}</span>
                <span className="text-xs text-muted ms-2">
                  / {plan.durationLabel[typedLocale]}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-control bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{dict.curated.inStock} ({dict.curated.deliveryTime})</span>
            </div>

            <div className="space-y-3 pt-2 border-t border-line">
              <Link
                href={`/${typedLocale}/checkout?plan=${plan.slug}`}
                className="w-full inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-sm px-4 py-3 gap-2 shadow"
              >
                <Send className="w-4 h-4 rtl:rotate-180" />
                <span>{dict.common.requestPlan}</span>
              </Link>

              <Link href={`/${typedLocale}/catalog`} className="block">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{dict.common.back} للكتالوج</span>
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-line text-[11px] text-muted space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>ضمان كامل طيلة مدة الاشتراك ({plan.durationLabel[typedLocale]})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>دعم فني مباشر بالهاتف والبريد في تونس</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

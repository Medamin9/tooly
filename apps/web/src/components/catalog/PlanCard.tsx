'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { DemoPlan } from '@/lib/catalog/data';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function PlanCard({ plan, locale }: { plan: DemoPlan; locale: Locale }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dict = dictionaries[locale];

  return (
    <>
      <Card hoverable className="flex flex-col justify-between h-full relative group">
        <div>
          {/* Header row: Category & Demo Tag */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="accent" size="sm" className="uppercase tracking-wider">
              {dict.categories[plan.category].name}
            </Badge>
            <Badge variant="demo" size="sm">
              {dict.common.demoBadge}
            </Badge>
          </div>

          {/* Plan Name & Provider */}
          <div className="mb-3 text-start">
            <h3 className="text-xl font-bold text-ink group-hover:text-tooly-red transition-colors">
              {plan.name}
            </h3>
            <p className="text-xs text-muted font-medium">{plan.provider}</p>
          </div>

          {/* Tagline */}
          <p className="text-xs text-muted leading-relaxed mb-5 text-start">
            {plan.tagline[locale]}
          </p>

          {/* Price & Duration */}
          <div className="bg-paper p-3.5 rounded-control border border-line mb-5 flex items-baseline justify-between text-start">
            <div>
              <span className="text-2xl font-extrabold text-ink">{plan.priceTND}</span>
              <span className="text-xs font-bold text-ink ms-1">{dict.common.currency}</span>
            </div>
            <span className="text-xs text-muted font-medium bg-surface px-2 py-0.5 rounded border border-line">
              {plan.durationLabel[locale]}
            </span>
          </div>

          {/* Delivery Method Preview */}
          <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium mb-4 text-start">
            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{plan.deliveryMethod[locale]}</span>
          </div>

          {/* Key Features */}
          <ul className="space-y-2 mb-6 text-xs text-ink/90 text-start">
            {plan.features[locale].slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-tight">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button Row */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-2">
          <Link href={`/${locale}/product/${plan.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <span>{dict.common.viewDetails}</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex-1"
          >
            <span>{dict.common.requestPlan}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Button>
        </div>
      </Card>

      {/* Offline Order Instruction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${dict.common.requestPlan} — ${plan.name}`}
        description={`${dict.productDetail.termsTitle} (${plan.durationLabel[locale]})`}
      >
        <div className="space-y-4 text-start text-sm">
          <div className="bg-paper p-4 rounded-control border border-line flex items-baseline justify-between">
            <span className="font-semibold text-ink">السعر الإجمالي:</span>
            <span className="text-xl font-extrabold text-tooly-red">
              {plan.priceTND} {dict.common.currency}
            </span>
          </div>

          <div className="p-3.5 rounded-control bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{dict.common.offlinePaymentNotice}</p>
          </div>

          <div className="space-y-2 text-xs text-muted">
            <p className="font-bold text-ink">خطوات استكمال الطلب:</p>
            <ol className="list-decimal list-inside space-y-1 text-ink/80">
              <li>رمز الطلب: <code className="bg-paper px-1.5 py-0.5 rounded font-mono font-bold text-ink">REF-{plan.slug.toUpperCase()}</code></li>
              <li>طريقة التسليم: {plan.deliveryMethod[locale]}</li>
              <li>قم بالتواصل مع فريق الدعم لتأكيد وسيلة الدفع بالدينار التونسي (تحويل بنكي أو D17).</li>
            </ol>
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              {dict.common.close}
            </Button>
            <a
              href="mailto:support@tooly.tn?subject=Order%20Request%20-%20"
              className="inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-xs px-4 py-2"
            >
              {dict.common.contactSupport}
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}

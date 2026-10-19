'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { DEMO_PLANS } from '@/lib/catalog/data';
import { createOrderApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-tooly-red border-t-transparent animate-spin" />
        </div>
      }
    >
      <CheckoutInner params={params} />
    </Suspense>
  );
}

function CheckoutInner({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get('plan') || 'claude-pro';

  const [selectedPlan, setSelectedPlan] = useState(
    DEMO_PLANS.find((p) => p.slug === selectedSlug) || DEMO_PLANS[0],
  );

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // In dev/demo, planVariantId is derived or matches DB
      const result = await createOrderApi({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        customerNotes: form.notes.trim() || undefined,
        items: [
          {
            planVariantId: selectedPlan.id,
            quantity: 1,
          },
        ],
      });

      setConfirmedOrder(result);
    } catch (err) {
      setError((err as Error).message || 'فشل إرسال الطلب. يرجى المحاولة لاحقاً.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      {!confirmedOrder ? (
        <div className="space-y-8">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              طلب اشتراك آمن
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-2">
              إتمام طلب الاشتراك بالدينار التونسي
            </h1>
            <p className="text-sm text-muted">
              قم بتأكيد بيانات التواصل الخاصة بك لإتمام الطلب واستلام تعليمات التفعيل.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
                  بيانات العميل المستلم
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    الاسم الكامل <span className="text-tooly-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="مثال: محمد بن علي"
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    البريد الإلكتروني لتسليم الاشتراك <span className="text-tooly-red">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmed@example.tn"
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                  <span className="text-[11px] text-muted block mt-1">
                    سيتم إرسال دعوة مساحة العمل أو تعليمات الترخيص لهذا البريد.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    رقم الهاتف التونسي (اختياري للتنسيق السريع عبر WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+216 98 000 000"
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    ملاحظات أو استفسار إضافي
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="أي توجيهات خاصة بالحساب أو التفعيل..."
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                </div>
              </Card>

              {/* Payment Notice */}
              <div className="p-4 rounded-control bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink mb-0.5">الدفع خارج المنصة (تحويل بنكي / D17):</p>
                  <p className="leading-relaxed">
                    بعد إرسال الطلب، ستحصل فوراً على رقم مرجع طلبك وبيانات الحساب البنكي لإجراء التحويل بالدينار التونسي دون أي عمولات إضافية.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={submitting}
                className="w-full"
              >
                <span>تأكيد الطلب واستلام بيانات التحويل</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </Button>
            </form>

            {/* Plan Summary Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
                  ملخص الاشتراك المطلوب
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-ink">{selectedPlan.name}</h4>
                    <span className="text-xs text-muted">{selectedPlan.provider}</span>
                  </div>
                  <Badge variant="demo" size="sm">
                    {dict.common.demoBadge}
                  </Badge>
                </div>

                <div className="bg-paper p-3 rounded-control border border-line text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">المدة:</span>
                    <span className="font-bold text-ink">{selectedPlan.durationLabel[typedLocale]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">طريقة التسليم:</span>
                    <span className="font-bold text-emerald-800">{selectedPlan.deliveryMethod[typedLocale]}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex items-baseline justify-between">
                  <span className="font-bold text-ink">المجموع الصافي:</span>
                  <div className="text-end">
                    <span className="text-3xl font-extrabold text-tooly-red">{selectedPlan.priceTND}</span>
                    <span className="text-xs font-bold text-ink ms-1">د.ت</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>سعر مضمون طيلة فترة الاشتراك</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>دعم فني تونسي مباشر</span>
                  </div>
                </div>
              </Card>

              {/* Selector for other demo plans */}
              <div className="bg-paper p-4 rounded-control border border-line text-xs">
                <span className="font-bold text-ink block mb-2">أو اختر خطة أخرى:</span>
                <select
                  value={selectedPlan.slug}
                  onChange={(e) => {
                    const p = DEMO_PLANS.find((x) => x.slug === e.target.value);
                    if (p) setSelectedPlan(p);
                  }}
                  className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line"
                >
                  {DEMO_PLANS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {p.priceTND} د.ت ({p.durationLabel[typedLocale]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Order Confirmed Screen */
        <div className="max-w-2xl mx-auto space-y-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <Badge variant="success" size="md" className="mb-2">
              تم تسجيل الطلب بنجاح
            </Badge>
            <h1 className="text-3xl font-extrabold text-ink mb-2">شكراً لطلبك من Tooly.tn</h1>
            <p className="text-sm text-muted">
              طلبك الآن في حالة <strong className="text-amber-800">قيد انتظار التحويل (PENDING_PAYMENT)</strong>.
            </p>
          </div>

          {/* Reference Card */}
          <Card className="p-6 sm:p-8 space-y-6 text-start">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <span className="text-xs text-muted block">رقم مرجع الطلب:</span>
                <span className="text-xl font-mono font-black text-ink">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(confirmedOrder.orderNumber)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-tooly-red hover:bg-tooly-soft-red px-3 py-1.5 rounded-control border border-tooly-red/20 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ المرجع'}</span>
              </button>
            </div>

            {/* Offline Bank Transfer Details */}
            <div className="bg-paper p-5 rounded-control border border-line space-y-3 text-xs">
              <div className="flex items-center gap-2 text-ink font-bold pb-2 border-b border-line">
                <Building className="w-4 h-4 text-tooly-red" />
                <span>بيانات التحويل البنكي والبريدي (تونس):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-ink">البنك:</span>
                  <span className="font-medium">BIAT / La Poste Tunisienne</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-ink">المبلغ المستحق:</span>
                  <span className="font-extrabold text-tooly-red font-mono text-sm">
                    {confirmedOrder.totalAmount} د.ت
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-ink">رقم الحساب (RIB):</span>
                  <code className="font-mono text-ink font-bold bg-surface px-2 py-0.5 rounded border border-line">
                    08 000 0000000000000 00
                  </code>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-ink">تحويل D17 السريع:</span>
                  <code className="font-mono text-ink font-bold bg-surface px-2 py-0.5 rounded border border-line">
                    +216 98 000 000
                  </code>
                </div>
              </div>
            </div>

            {/* Step-by-step confirmation guidance */}
            <div className="space-y-2 text-xs text-muted">
              <p className="font-bold text-ink">كيفية استكمال وتفعيل الخدمة:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-ink/85">
                <li>قم بإجراء التحويل بالمبلغ المحدد ({confirmedOrder.totalAmount} د.ت) مع ذكر رقم الطلب <code className="font-mono font-bold text-tooly-red">{confirmedOrder.orderNumber}</code> في خانة الملاحظات.</li>
                <li>أرسل وصل التحويل لفريق الدعم عبر الواتساب أو البريد الإلكتروني.</li>
                <li>بمجرد مطابقة التحويل من قبل الإدارة، سيتم تفعيل حسابك وتسليم بيانات الدخول أو الدعوة الرسمية على بريدك: <strong className="text-ink">{confirmedOrder.customer.email}</strong>.</li>
              </ol>
            </div>

            <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:support@tooly.tn?subject=Order%20Payment%20Receipt%20-%20${confirmedOrder.orderNumber}&body=Hello%20Tooly,%20attached%20is%20the%20payment%20receipt%20for%20order%20${confirmedOrder.orderNumber}.`}
                className="flex-1 inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-xs px-4 py-2.5 gap-2"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>إرسال إشعار الدفع للدعم</span>
              </a>
              <Link
                href={`/${typedLocale}/order/lookup?orderNumber=${confirmedOrder.orderNumber}&email=${encodeURIComponent(confirmedOrder.customer.email)}`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <span>متابعة حالة الطلب مباشرة</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

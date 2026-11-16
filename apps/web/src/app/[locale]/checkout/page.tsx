'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Copy,
  Check,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { CtaArrow } from '@/components/ui/CtaArrow';
import { fetchCatalogProducts } from '@/lib/api/catalog';
import {
  getFallbackStorefrontPlans,
  mapApiProductToStorefrontPlan,
  StorefrontPlan,
} from '@/lib/catalog/mappers';
import { createOrderApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { OrderTicketCard } from '@/components/order/OrderTicketCard';
import { PageLoader } from '@/components/ui/PageLoader';
import { trackMetaEvent } from '@/components/analytics/MetaPixel';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<PageLoader fullscreen={true} />}>
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
  const isAr = typedLocale === 'ar';
  const isFr = typedLocale === 'fr';
  const dict = dictionaries[typedLocale];
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get('plan') || 'claude-pro';
  const requestedVariantId = searchParams.get('variant');

  const initialPlans = getFallbackStorefrontPlans(typedLocale);
  const [plans, setPlans] = useState<StorefrontPlan[]>(initialPlans);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>(
    initialPlans.find((p) => p.slug === selectedSlug)?.slug || initialPlans[0].slug,
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    requestedVariantId || '',
  );

  useEffect(() => {
    let active = true;
    fetchCatalogProducts({ locale: typedLocale, limit: 50, cacheMode: 'no-store' })
      .then((res) => {
        if (!active || res.items.length === 0) return;
        const mapped = res.items.map((item) =>
          mapApiProductToStorefrontPlan(item, typedLocale),
        );
        setPlans(mapped);
        const targetPlan =
          mapped.find((p) => p.slug === selectedSlug) || mapped[0];
        if (targetPlan) {
          setSelectedPlanSlug(targetPlan.slug);
          const matchedVar =
            (requestedVariantId
              ? targetPlan.variants.find((v) => v.id === requestedVariantId)
              : undefined) ||
            targetPlan.variants.find((v) => v.isAvailable) ||
            targetPlan.variants[0];
          if (matchedVar) {
            setSelectedVariantId(matchedVar.id);
          }
        }
      })
      .catch(() => {
        // Fallback plans already loaded
      });
    return () => {
      active = false;
    };
  }, [typedLocale, selectedSlug, requestedVariantId]);

  const selectedPlan =
    plans.find((p) => p.slug === selectedPlanSlug) || plans[0];
  const activeVariant =
    selectedPlan.variants.find((v) => v.id === selectedVariantId) ||
    selectedPlan.variants.find((v) => v.isAvailable) ||
    selectedPlan.variants[0];

  useEffect(() => {
    if (selectedPlan) {
      trackMetaEvent('InitiateCheckout', {
        content_name: selectedPlan.name,
        value: activeVariant?.priceTND ?? selectedPlan.priceTND,
        currency: 'TND',
      });
    }
  }, [selectedPlanSlug, selectedVariantId]);

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
      const result = await createOrderApi({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        customerNotes: form.notes.trim() || undefined,
        items: [
          {
            planVariantId: activeVariant?.id || selectedPlan.id,
            quantity: 1,
          },
        ],
      });

      setConfirmedOrder(result);
      trackMetaEvent('Purchase', {
        content_name: selectedPlan.name,
        value: result.totalAmount,
        currency: 'TND',
        order_id: result.orderNumber,
      });
      // Redirect to the page containing order data and tear ticket
      const lookupIdentifier = result.customer.email || result.customer.phone || form.phone.trim();
      router.push(
        `/${typedLocale}/order/lookup?orderNumber=${encodeURIComponent(result.orderNumber)}&email=${encodeURIComponent(lookupIdentifier)}`
      );
    } catch (err) {
      setError(
        (err as Error).message ||
        (isAr
          ? 'فشل إرسال الطلب. يرجى المحاولة لاحقاً.'
          : isFr
            ? 'Échec de l’envoi de la commande. Veuillez réessayer plus tard.'
            : 'Failed to submit order. Please try again later.')
      );
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
              {isAr ? 'طلب اشتراك آمن' : isFr ? 'Commande sécurisée' : 'Secure Order'}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-2">
              {isAr
                ? 'إتمام طلب الاشتراك بالدينار التونسي'
                : isFr
                  ? 'Finaliser votre commande en Dinars Tunisiens'
                  : 'Complete Your Order in Tunisian Dinars'}
            </h1>
            <p className="text-sm text-muted">
              {isAr
                ? 'قم بتأكيد بيانات التواصل الخاصة بك لإتمام الطلب واستلام تعليمات التفعيل.'
                : isFr
                  ? 'Confirmez vos coordonnées pour finaliser la commande et recevoir les instructions d’activation.'
                  : 'Confirm your contact details to complete the order and receive activation instructions.'}
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
                  {isAr ? 'بيانات العميل المستلم' : isFr ? 'Coordonnées de livraison' : 'Customer Contact Details'}
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    {isAr ? 'الاسم الكامل' : isFr ? 'Nom complet' : 'Full Name'} <span className="text-tooly-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={isAr ? 'مثال: محمد بن علي' : isFr ? 'ex. Mohamed Ben Ali' : 'e.g. Mohamed Ben Ali'}
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    {isAr ? 'رقم الهاتف التونسي' : isFr ? 'Numéro de téléphone (Tunisie)' : 'Tunisian Phone Number'} <span className="text-tooly-red">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+216 98 000 000"
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                  <span className="text-[11px] text-muted block mt-1">
                    {isAr
                      ? 'للتنسيق السريع وتأكيد التفعيل عبر WhatsApp أو الاتصال.'
                      : isFr
                        ? 'Pour la coordination rapide et l’activation par WhatsApp ou appel.'
                        : 'For quick coordination and activation via WhatsApp or call.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    {isAr
                      ? 'البريد الإلكتروني (اختياري)'
                      : isFr
                        ? 'Adresse e-mail (optionnel)'
                        : 'Email Address (optional)'}
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ahmed@example.tn"
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                  <span className="text-[11px] text-muted block mt-1">
                    {isAr
                      ? 'اختياري: لتلقي تفاصيل الاشتراك وإشعار الدفع بالبريد.'
                      : isFr
                        ? 'Optionnel : pour recevoir la confirmation et le reçu par e-mail.'
                        : 'Optional: to receive activation confirmation and receipt by email.'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    {isAr
                      ? 'ملاحظات أو استفسار إضافي (اختياري)'
                      : isFr
                        ? 'Remarques ou instructions (optionnel)'
                        : 'Notes or instructions (optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={
                      isAr
                        ? 'أي توجيهات خاصة بالحساب أو التفعيل...'
                        : isFr
                          ? 'Instructions spécifiques ou question pour l’activation...'
                          : 'Any specific account instructions...'
                    }
                    className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
                  />
                </div>
              </Card>

              {/* Payment Notice */}
              <div className="p-4 rounded-control bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-700 mb-0.5">
                    {isAr
                      ? 'الدفع خارج المنصة (تحويل بنكي / D17):'
                      : isFr
                        ? 'Paiement sécurisé hors plateforme (Virement / D17) :'
                        : 'Direct Offline Payment (Bank Transfer / D17):'}
                  </p>
                  <p className="leading-relaxed">
                    {isAr
                      ? 'بعد إرسال الطلب، ستحصل فوراً على رقم مرجع طلبك وبيانات الحساب البنكي لإجراء التحويل بالدينار التونسي دون أي عمولات إضافية.'
                      : isFr
                        ? 'Après validation, vous recevrez immédiatement votre numéro de référence et les coordonnées bancaires pour régler en Dinars Tunisiens sans frais supplémentaires.'
                        : 'After placing your order, you will instantly receive your order reference and bank details to complete payment in Tunisian Dinars without additional fees.'}
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={submitting}
                className="w-full"
              >

                <span>
                  {isAr
                    ? 'تأكيد الطلب واستلام بيانات التحويل'
                    : isFr
                      ? 'Confirmer la commande et obtenir le RIB'
                      : 'Confirm Order & Get Payment Details'}
                </span>
                <CtaArrow className="w-4 h-4" />
              </Button>
            </form>

            {/* Plan Summary Sidebar */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
                  {isAr ? 'ملخص الاشتراك المطلوب' : isFr ? 'Récapitulatif de la formule' : 'Order Summary'}
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-ink">{selectedPlan.name}</h4>
                    <span className="text-xs text-muted">{selectedPlan.provider}</span>
                  </div>
                  {(activeVariant?.isDemo ?? selectedPlan.isDemo) && (
                    <Badge variant="demo" size="sm">
                      {dict.common.demoBadge}
                    </Badge>
                  )}
                </div>

                <div className="bg-paper p-3 rounded-control border border-line text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">
                      {isAr ? 'المدة:' : isFr ? 'Durée :' : 'Duration:'}
                    </span>
                    <span className="font-bold text-ink">
                      {activeVariant?.durationLabel[typedLocale] || selectedPlan.durationLabel[typedLocale]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">
                      {isAr ? 'طريقة التسليم:' : isFr ? 'Mode de livraison :' : 'Delivery Method:'}
                    </span>
                    <span className="font-bold text-emerald-800">{selectedPlan.deliveryMethod[typedLocale]}</span>
                  </div>
                </div>

                {selectedPlan.variants.length > 1 && (
                  <div className="text-xs space-y-1.5">
                    <label className="block font-semibold text-ink">
                      {isAr ? 'اختيار مدة الباقة:' : isFr ? 'Sélectionner la durée :' : 'Select Plan Duration:'}
                    </label>
                    <select
                      value={activeVariant?.id || ''}
                      onChange={(e) => setSelectedVariantId(e.target.value)}
                      className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
                    >
                      {selectedPlan.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.durationLabel[typedLocale]} — {variant.priceTND} {dict.common.currency}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-3 border-t border-line flex items-baseline justify-between">
                  <span className="font-bold text-ink">
                    {isAr ? 'المجموع الصافي:' : isFr ? 'Total net :' : 'Net Total:'}
                  </span>
                  <div className="text-end">
                    <span className="text-3xl font-extrabold text-tooly-red">
                      {activeVariant?.priceTND ?? selectedPlan.priceTND}
                    </span>
                    <span className="text-xs font-bold text-ink ms-1">{dict.common.currency}</span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-muted space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {isAr
                        ? 'سعر مضمون طيلة فترة الاشتراك'
                        : isFr
                          ? 'Prix garanti pendant toute la durée'
                          : 'Guaranteed price for entire duration'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {isAr
                        ? 'دعم فني تونسي مباشر'
                        : isFr
                          ? 'Support technique local dédié'
                          : 'Dedicated local technical support'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Selector for other plans */}
              <div className="bg-paper p-4 rounded-control border border-line text-xs">
                <span className="font-bold text-ink block mb-2">
                  {isAr ? 'أو اختر خطة أخرى:' : isFr ? 'Ou choisir un autre abonnement :' : 'Or select another subscription:'}
                </span>
                <select
                  value={selectedPlan.slug}
                  onChange={(e) => {
                    const p = plans.find((x) => x.slug === e.target.value);
                    if (p) {
                      setSelectedPlanSlug(p.slug);
                      const firstVar = p.variants.find((v) => v.isAvailable) || p.variants[0];
                      setSelectedVariantId(firstVar?.id || p.id);
                    }
                  }}
                  className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line"
                >
                  {plans.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} — {p.priceTND} {dict.common.currency} ({p.durationLabel[typedLocale]})
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
              {isAr ? 'تم تسجيل الطلب بنجاح' : isFr ? 'Commande enregistrée avec succès' : 'Order Placed Successfully'}
            </Badge>
            <h1 className="text-3xl font-extrabold text-ink mb-2">
              {isAr ? 'شكراً لطلبك من Tooly.tn' : isFr ? 'Merci pour votre commande sur Tooly.tn' : 'Thank you for ordering on Tooly.tn'}
            </h1>
            <p className="text-sm text-muted">
              {isAr ? (
                <>طلبك الآن في حالة <strong className="text-amber-800">قيد انتظار التحويل (PENDING_PAYMENT)</strong>.</>
              ) : isFr ? (
                <>Votre commande est actuellement <strong className="text-amber-800">en attente de règlement (PENDING_PAYMENT)</strong>.</>
              ) : (
                <>Your order is currently <strong className="text-amber-800">awaiting payment (PENDING_PAYMENT)</strong>.</>
              )}
            </p>
          </div>

          {/* Interactive Tear Ticket */}
          <OrderTicketCard order={confirmedOrder} locale={typedLocale} className="my-6" />

          {/* Reference Card */}
          <Card className="p-6 sm:p-8 space-y-6 text-start">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div>
                <span className="text-xs text-muted block">
                  {isAr ? 'رقم مرجع الطلب:' : isFr ? 'Référence de commande :' : 'Order Reference Number:'}
                </span>
                <span className="text-xl font-mono font-black text-ink">
                  {confirmedOrder.orderNumber}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(confirmedOrder.orderNumber)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-tooly-red hover:bg-tooly-soft-red px-3 py-1.5 rounded-control border border-tooly-red/20 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>
                  {copied
                    ? (isAr ? 'تم النسخ!' : isFr ? 'Copié !' : 'Copied!')
                    : (isAr ? 'نسخ المرجع' : isFr ? 'Copier la référence' : 'Copy Reference')}
                </span>
              </button>
            </div>

            {/* Offline Bank Transfer Details */}
            <div className="bg-paper p-5 rounded-control border border-line space-y-3 text-xs">
              <div className="flex items-center gap-2 text-ink font-bold pb-2 border-b border-line">
                <Building className="w-4 h-4 text-tooly-red" />
                <span>
                  {isAr
                    ? 'بيانات التحويل البنكي والبريدي (تونس):'
                    : isFr
                      ? 'Coordonnées de virement bancaire et postal (Tunisie) :'
                      : 'Bank & Postal Transfer Details (Tunisia):'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-ink">
                    {isAr ? 'البنك:' : isFr ? 'Banque :' : 'Bank:'}
                  </span>
                  <span className="font-medium">BIAT / La Poste Tunisienne</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-ink">
                    {isAr ? 'المبلغ المستحق:' : isFr ? 'Montant à régler :' : 'Amount Due:'}
                  </span>
                  <span className="font-extrabold text-tooly-red font-mono text-sm">
                    {confirmedOrder.totalAmount} {dict.common.currency}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-ink">
                    {isAr ? 'رقم الحساب (RIB):' : isFr ? 'RIB bancaire :' : 'Bank Account (RIB):'}
                  </span>
                  <code className="font-mono text-ink font-bold bg-surface px-2 py-0.5 rounded border border-line">
                    25059000001162993692
                  </code>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-[10px] uppercase font-bold text-ink">
                    {isAr ? 'تحويل D17 السريع:' : isFr ? 'Virement D17 instantané :' : 'Instant D17 Mobile:'}
                  </span>
                  <code className="font-mono text-ink font-bold bg-surface px-2 py-0.5 rounded border border-line">
                    +216 99278016 , +216 26936125
                  </code>
                </div>
              </div>
            </div>

            {/* Step-by-step confirmation guidance */}
            <div className="space-y-2 text-xs text-muted">
              <p className="font-bold text-ink">
                {isAr
                  ? 'كيفية استكمال وتفعيل الخدمة:'
                  : isFr
                    ? 'Comment finaliser et activer votre abonnement :'
                    : 'How to complete and activate your service:'}
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-ink/85">
                {isAr ? (
                  <>
                    <li>قم بإجراء التحويل بالمبلغ المحدد ({confirmedOrder.totalAmount} {dict.common.currency}) مع ذكر رقم الطلب <code className="font-mono font-bold text-tooly-red">{confirmedOrder.orderNumber}</code> في خانة الملاحظات.</li>
                    <li>أرسل وصل التحويل لفريق الدعم عبر الواتساب أو البريد الإلكتروني.</li>
                    <li>بمجرد مطابقة التحويل من قبل الإدارة، سيتم تفعيل حسابك وتسليم بيانات الدخول أو الدعوة الرسمية على بياناتك: <strong className="text-ink">{confirmedOrder.customer.phone || confirmedOrder.customer.email}</strong>.</li>
                  </>
                ) : isFr ? (
                  <>
                    <li>Effectuez le virement du montant exact ({confirmedOrder.totalAmount} {dict.common.currency}) en indiquant la référence <code className="font-mono font-bold text-tooly-red">{confirmedOrder.orderNumber}</code> en motif.</li>
                    <li>Envoyez la preuve ou le reçu de virement à notre équipe sur WhatsApp ou par e-mail.</li>
                    <li>Dès confirmation de la transaction, votre compte sera activé et vous recevrez vos accès ou l’invitation officielle sur : <strong className="text-ink">{confirmedOrder.customer.phone || confirmedOrder.customer.email}</strong>.</li>
                  </>
                ) : (
                  <>
                    <li>Complete the transfer of the exact amount ({confirmedOrder.totalAmount} {dict.common.currency}) including the reference code <code className="font-mono font-bold text-tooly-red">{confirmedOrder.orderNumber}</code> in the transfer notes.</li>
                    <li>Send the payment receipt to our support team via WhatsApp or email.</li>
                    <li>Once confirmed by our team, your subscription will be activated and login details or official invite delivered to: <strong className="text-ink">{confirmedOrder.customer.phone || confirmedOrder.customer.email}</strong>.</li>
                  </>
                )}
              </ol>
            </div>

            <div className="pt-4 border-t border-line flex flex-col sm:flex-row gap-3">
              <a
                href={`mailto:support@tooly.tn?subject=Order%20Payment%20Receipt%20-%20${confirmedOrder.orderNumber}&body=Hello%20Tooly,%20attached%20is%20the%20payment%20receipt%20for%20order%20${confirmedOrder.orderNumber}.`}
                className="flex-1 inline-flex items-center justify-center font-semibold rounded-control transition-all duration-200 bg-tooly-red text-surface hover:bg-tooly-red-dark text-xs px-4 py-2.5 gap-2"
              >
                <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                <span>
                  {isAr
                    ? 'إرسال إشعار الدفع للدعم'
                    : isFr
                      ? 'Envoyer le reçu au support'
                      : 'Send Receipt to Support'}
                </span>
              </a>
              <Link
                href={`/${typedLocale}/order/lookup?orderNumber=${confirmedOrder.orderNumber}&email=${encodeURIComponent(confirmedOrder.customer.email || confirmedOrder.customer.phone || '')}`}
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full">
                  <span>
                    {isAr
                      ? 'متابعة حالة الطلب مباشرة'
                      : isFr
                        ? 'Suivre l’état de ma commande'
                        : 'Track Order Status Directly'}
                  </span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

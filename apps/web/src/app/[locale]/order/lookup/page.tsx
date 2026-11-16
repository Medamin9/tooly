'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { notFound, useSearchParams } from 'next/navigation';
import {
  Search,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  ShieldCheck,
  Send,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { lookupOrderApi } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { OrderTicketCard } from '@/components/order/OrderTicketCard';
import { PageLoader } from '@/components/ui/PageLoader';

export default function OrderLookupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <Suspense fallback={<PageLoader fullscreen={true} />}>
      <OrderLookupInner params={params} />
    </Suspense>
  );
}

function OrderLookupInner({
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
  const queryOrderNumber = searchParams.get('orderNumber') || '';
  const queryEmail = searchParams.get('email') || '';

  const [orderNumber, setOrderNumber] = useState(queryOrderNumber);
  const [email, setEmail] = useState(queryEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);

  const fetchOrder = async (num: string, em: string) => {
    if (!num || !em) return;
    setLoading(true);
    setError(null);
    try {
      const data = await lookupOrderApi(num.trim(), em.trim());
      setOrder(data);
    } catch (err) {
      setError(
        (err as Error).message ||
          (typedLocale === 'ar'
            ? 'تعذر العثور على الطلب. تأكد من صحة رقم المرجع والبريد الإلكتروني.'
            : typedLocale === 'fr'
              ? 'Commande introuvable. Vérifiez le numéro de référence et l’e-mail ou téléphone.'
              : 'Order not found. Please check your order reference and email or phone.')
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await fetchOrder(orderNumber, email);
  };

  useEffect(() => {
    const num = searchParams.get('orderNumber');
    const em = searchParams.get('email');
    if (num) setOrderNumber(num);
    if (em) setEmail(em);
    if (num && em) {
      fetchOrder(num, em);
    }
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return (
          <Badge variant="warning" size="md">
            {typedLocale === 'ar'
              ? 'في انتظار إشعار التحويل'
              : typedLocale === 'fr'
                ? 'En attente de paiement'
                : 'Pending Payment'}
          </Badge>
        );
      case 'PAID':
        return (
          <Badge variant="success" size="md">
            {typedLocale === 'ar'
              ? 'تم استلام الدفعة'
              : typedLocale === 'fr'
                ? 'Paiement reçu'
                : 'Payment Received'}
          </Badge>
        );
      case 'FULFILLMENT_PENDING':
        return (
          <Badge variant="accent" size="md">
            {typedLocale === 'ar'
              ? 'قيد تجهيز الاشتراك'
              : typedLocale === 'fr'
                ? 'En cours de préparation'
                : 'Fulfillment Pending'}
          </Badge>
        );
      case 'FULFILLED':
        return (
          <Badge variant="success" size="md">
            {typedLocale === 'ar'
              ? 'تم التسليم بنجاح'
              : typedLocale === 'fr'
                ? 'Livré avec succès'
                : 'Delivered'}
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="default" size="md">
            {typedLocale === 'ar'
              ? 'طلب ملغي'
              : typedLocale === 'fr'
                ? 'Commande annulée'
                : 'Cancelled'}
          </Badge>
        );
      default:
        return <Badge variant="default" size="md">{status}</Badge>;
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      <div className="mb-8">
        <Link
          href={`/${typedLocale}`}
          className="text-xs text-muted hover:text-ink flex items-center gap-1.5 mb-3 group transition-colors inline-flex"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
          <span>
            {typedLocale === 'ar'
              ? 'العودة للرئيسية'
              : typedLocale === 'fr'
                ? 'Retour à l’accueil'
                : 'Back to home'}
          </span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {typedLocale === 'ar'
            ? 'متابعة حالة الطلب والاشتراك'
            : typedLocale === 'fr'
              ? 'Suivi de commande et abonnement'
              : 'Track Order & Subscription'}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1.5 leading-relaxed">
          {typedLocale === 'ar'
            ? 'أدخل رقم مرجع الطلب (مثل TLY-2026-1001) وبريدك الإلكتروني أو رقم هاتفك للاطلاع على مستجدات التفعيل.'
            : typedLocale === 'fr'
              ? 'Saisissez votre numéro de commande (ex: TLY-2026-1001) et votre e-mail ou téléphone pour vérifier l’état d’activation.'
              : 'Enter your order reference (e.g. TLY-2026-1001) and your email or phone number to check activation status.'}
        </p>
      </div>

      {/* Search Box - Touch-optimized and elevated for mobile */}
      <Card className="p-5 sm:p-6 mb-8 relative z-10 shadow-sm border border-line bg-surface">
        <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label
              htmlFor="order-lookup-number"
              className="block text-xs sm:text-sm font-semibold text-ink mb-1.5 cursor-pointer select-none"
            >
              {typedLocale === 'ar'
                ? 'رقم الطلب (Order Number)'
                : typedLocale === 'fr'
                  ? 'Numéro de commande'
                  : 'Order Number'}
            </label>
            <div className="relative">
              <input
                id="order-lookup-number"
                name="orderNumber"
                type="text"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. TLY-2026-1001"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck="false"
                className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line font-mono focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text pointer-events-auto touch-manipulation placeholder:text-muted/60"
              />
            </div>
          </div>

          <div className="sm:col-span-5">
            <label
              htmlFor="order-lookup-identifier"
              className="block text-xs sm:text-sm font-semibold text-ink mb-1.5 cursor-pointer select-none"
            >
              {typedLocale === 'ar'
                ? 'البريد الإلكتروني أو رقم الهاتف للطلب'
                : typedLocale === 'fr'
                  ? 'E-mail ou numéro de téléphone'
                  : 'Email or phone number'}
            </label>
            <div className="relative">
              <input
                id="order-lookup-identifier"
                name="email"
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@example.tn / +216 98 000 000"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck="false"
                className="w-full h-11 px-3.5 py-2.5 bg-paper text-ink text-base sm:text-xs rounded-control border border-line focus:outline-none focus:ring-2 focus:ring-tooly-red focus:border-tooly-red transition-all cursor-text pointer-events-auto touch-manipulation placeholder:text-muted/60"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full h-11 gap-2 text-sm font-bold shadow-sm active:scale-[0.98]"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span>
                {typedLocale === 'ar' ? 'بحث' : typedLocale === 'fr' ? 'Rechercher' : 'Search'}
              </span>
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger text-xs sm:text-sm rounded-control flex items-center gap-2.5 mb-6 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <OrderTicketCard order={order} locale={typedLocale} className="mb-6" />

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <span className="text-xs text-muted block">
                  {typedLocale === 'ar' ? 'طلب رقم:' : typedLocale === 'fr' ? 'Commande N° :' : 'Order #:'}
                </span>
                <h2 className="text-xl font-mono font-black text-ink">{order.orderNumber}</h2>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                {typedLocale === 'ar'
                  ? 'العناصر المضمنة:'
                  : typedLocale === 'fr'
                    ? 'Articles commandés :'
                    : 'Included Items:'}
              </h3>
              <div className="divide-y divide-line border-y border-line text-xs sm:text-sm">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-ink">{item.productTitle}</span>
                      <span className="text-muted ms-2">({item.planDuration}) × {item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-ink">{item.unitPrice * item.quantity} د.ت</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 flex justify-between text-sm sm:text-base font-extrabold text-ink">
                <span>
                  {typedLocale === 'ar'
                    ? 'المجموع الكلي:'
                    : typedLocale === 'fr'
                      ? 'Total général :'
                      : 'Total Amount:'}
                </span>
                <span className="text-tooly-red font-mono">{order.totalAmount} د.ت</span>
              </div>
            </div>

            {/* Fulfillment Status & Instructions */}
            {order.fulfillment && (
              <div className="bg-paper p-4 rounded-control border border-line text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <Clock className="w-4 h-4 text-tooly-red shrink-0" />
                  <span>
                    {typedLocale === 'ar'
                      ? 'حالة التسليم الفعلي:'
                      : typedLocale === 'fr'
                        ? 'État de livraison :'
                        : 'Fulfillment Status:'}
                  </span>
                  <span className="font-medium text-muted">{order.fulfillment.status}</span>
                </div>
                {order.fulfillment.instructions && (
                  <p className="text-muted leading-relaxed pt-1.5 border-t border-line">
                    <strong className="text-ink">
                      {typedLocale === 'ar'
                        ? 'توجيهات الدعم: '
                        : typedLocale === 'fr'
                          ? 'Instructions de livraison : '
                          : 'Support Instructions: '}
                    </strong>
                    {order.fulfillment.instructions}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted">
              <span>
                {typedLocale === 'ar' ? 'تاريخ إنشاء الطلب: ' : typedLocale === 'fr' ? 'Date de création : ' : 'Order Date: '}
                {new Date(order.createdAt).toLocaleString('fr-TN')}
              </span>
              <a
                href={`mailto:support@tooly.tn?subject=Order%20Inquiry%20-%20${order.orderNumber}`}
                className="text-tooly-red hover:underline font-semibold"
              >
                {typedLocale === 'ar'
                  ? 'استفسار حول هذا الطلب'
                  : typedLocale === 'fr'
                    ? 'Poser une question sur cette commande'
                    : 'Inquire about this order'}
              </a>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

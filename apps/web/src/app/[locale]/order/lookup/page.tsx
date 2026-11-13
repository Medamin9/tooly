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
      setError((err as Error).message || 'تعذر العثور على الطلب. تأكد من صحة رقم المرجع والبريد الإلكتروني.');
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
    const num = searchParams.get('orderNumber') || queryOrderNumber;
    const em = searchParams.get('email') || queryEmail;
    if (num && em) {
      setOrderNumber(num);
      setEmail(em);
      fetchOrder(num, em);
    }
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Badge variant="warning" size="md">في انتظار إشعار التحويل</Badge>;
      case 'PAID':
        return <Badge variant="success" size="md">تم استلام الدفعة</Badge>;
      case 'FULFILLMENT_PENDING':
        return <Badge variant="accent" size="md">قيد تجهيز الاشتراك</Badge>;
      case 'FULFILLED':
        return <Badge variant="success" size="md">تم التسليم بنجاح</Badge>;
      case 'CANCELLED':
        return <Badge variant="default" size="md">طلب ملغي</Badge>;
      default:
        return <Badge variant="default" size="md">{status}</Badge>;
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-start">
      <div className="mb-8">
        <Link
          href={`/${typedLocale}`}
          className="text-xs text-muted hover:text-ink flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>العودة للرئيسية</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">متابعة حالة الطلب والاشتراك</h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          أدخل رقم مرجع الطلب (مثل TLY-2026-1001) وبريدك الإلكتروني للاطلاع على مستجدات التفعيل.
        </p>
      </div>

      {/* Search Box */}
      <Card className="p-6 mb-8">
        <form onSubmit={handleLookup} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-ink mb-1">رقم الطلب (Order Number)</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. TLY-2026-1001"
              className="w-full px-3.5 py-2 bg-paper text-ink text-xs rounded-control border border-line font-mono"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-ink mb-1">
              {typedLocale === 'ar'
                ? 'البريد الإلكتروني أو رقم الهاتف للطلب'
                : typedLocale === 'fr'
                  ? 'E-mail ou numéro de téléphone'
                  : 'Email or phone number'}
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmed@example.tn / +216 98 000 000"
              className="w-full px-3.5 py-2 bg-paper text-ink text-xs rounded-control border border-line"
            />
          </div>

          <div className="sm:col-span-2">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
              className="w-full"
            >
              <Search className="w-4 h-4" />
              <span>بحث</span>
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div className="space-y-6">
          <OrderTicketCard order={order} locale={typedLocale} className="mb-6" />

          <Card className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <span className="text-xs text-muted block">طلب رقم:</span>
                <h2 className="text-xl font-mono font-black text-ink">{order.orderNumber}</h2>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">العناصر المضمنة:</h3>
              <div className="divide-y divide-line border-y border-line text-xs">
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
              <div className="pt-3 flex justify-between text-sm font-extrabold text-ink">
                <span>المجموع الكلي:</span>
                <span className="text-tooly-red font-mono">{order.totalAmount} د.ت</span>
              </div>
            </div>

            {/* Fulfillment Status & Instructions */}
            {order.fulfillment && (
              <div className="bg-paper p-4 rounded-control border border-line text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-ink">
                  <Clock className="w-4 h-4 text-tooly-red" />
                  <span>حالة التسليم الفعلي:</span>
                  <span className="font-medium text-muted">{order.fulfillment.status}</span>
                </div>
                {order.fulfillment.instructions && (
                  <p className="text-muted leading-relaxed pt-1 border-t border-line">
                    <strong>توجيهات الدعم: </strong>
                    {order.fulfillment.instructions}
                  </p>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
              <span>تاريخ إنشاء الطلب: {new Date(order.createdAt).toLocaleString('fr-TN')}</span>
              <a
                href={`mailto:support@tooly.tn?subject=Order%20Inquiry%20-%20${order.orderNumber}`}
                className="text-tooly-red hover:underline font-semibold"
              >
                استفسار حول هذا الطلب
              </a>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

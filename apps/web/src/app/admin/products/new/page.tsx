'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import {
  createAdminProduct,
  fetchAdminCatalogOptions,
  fetchAdminCategories,
} from '@/lib/api/admin';
import { fetchCatalogOptions } from '@/lib/api/catalog';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type PackLocale = 'ar' | 'fr' | 'en';

interface SelectChoice {
  code: string;
  label: string;
}

const LOCALE_TABS: Array<{ key: PackLocale; label: string }> = [
  { key: 'ar', label: 'العربية (AR)' },
  { key: 'fr', label: 'Français (FR)' },
  { key: 'en', label: 'English (EN)' },
];

const DEFAULT_DELIVERIES: SelectChoice[] = [
  { code: 'OFFLINE_TRANSFER', label: 'طلب عبر التحويل أو الدفع المحلي (تونس)' },
  { code: 'MANUAL_SUPPORT', label: 'تفعيل يدوي سريع عبر دعم Tooly.tn' },
  { code: 'TEAM_INVITE', label: 'دعوة مساحة عمل رسمية على بريدك الشخصي' },
  { code: 'CREDENTIALS_PROVISION', label: 'إعداد وتسليم بيانات حساب مخصص وآمن' },
  { code: 'VOUCHER_CODE', label: 'تسليم كود تفعيل فوري عبر البريد' },
];

const DEFAULT_DURATIONS: SelectChoice[] = [
  { code: '1_month', label: 'شهر واحد (1_month)' },
  { code: '3_months', label: '3 أشهر (3_months)' },
  { code: '6_months', label: '6 أشهر (6_months)' },
  { code: '1_year', label: 'سنة كاملة (1_year)' },
  { code: 'lifetime', label: 'مدى الحياة (lifetime)' },
];

const DEFAULT_CATEGORIES: SelectChoice[] = [
  { code: 'ai', label: 'الذكاء الاصطناعي (ai)' },
  { code: 'design', label: 'التصميم والجرافيك (design)' },
  { code: 'video', label: 'المونتاج وصناعة الفيديو (video)' },
  { code: 'productivity', label: 'الإنتاجية (productivity)' },
  { code: 'developer', label: 'أدوات المطورين (developer)' },
];

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packLocale, setPackLocale] = useState<PackLocale>('ar');
  const [categoryChoices, setCategoryChoices] =
    useState<SelectChoice[]>(DEFAULT_CATEGORIES);
  const [deliveryChoices, setDeliveryChoices] =
    useState<SelectChoice[]>(DEFAULT_DELIVERIES);
  const [durationChoices, setDurationChoices] =
    useState<SelectChoice[]>(DEFAULT_DURATIONS);

  const [form, setForm] = useState({
    slug: '',
    categorySlug: 'ai',
    provider: '',
    deliveryMethod: 'OFFLINE_TRANSFER',
    isPublished: true,
    sortOrder: 0,
    name: { ar: '', fr: '', en: '' },
    tagline: { ar: '', fr: '', en: '' },
    description: { ar: '', fr: '', en: '' },
    variantSlug: '',
    duration: '1_month',
    price: 79.0,
    featuresText: {
      ar: 'وصول متميز للخدمة\nدعم فني محلي من Tooly.tn',
      fr: 'Accès complet au service\nSupport local Tooly.tn',
      en: 'Full plan access\nLocal Tooly.tn support',
    },
    restrictionsText: {
      ar: 'استخدام مطابق لشروط المزود القياسية',
      fr: 'Usage conforme aux conditions officielles',
      en: 'Subject to official provider terms',
    },
  });

  useEffect(() => {
    let mounted = true;
    const loadChoices = async () => {
      try {
        const cats = await fetchAdminCategories().catch(() => []);
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          setCategoryChoices(
            cats.map((c: any) => ({
              code: c.slug,
              label: `${c.name?.ar || c.slug} (${c.slug})`,
            })),
          );
        }
      } catch {
        // Keep fallback
      }

      try {
        const adminOpts = await fetchAdminCatalogOptions();
        if (!mounted) return;
        if (adminOpts.deliveryMethods?.length) {
          setDeliveryChoices(
            adminOpts.deliveryMethods.map((o) => ({
              code: o.code,
              label: `${o.label.ar} (${o.code})`,
            })),
          );
        }
        if (adminOpts.durations?.length) {
          setDurationChoices(
            adminOpts.durations.map((o) => ({
              code: o.code,
              label: `${o.label.ar} (${o.code})`,
            })),
          );
        }
      } catch {
        try {
          const publicOpts = await fetchCatalogOptions('ar', 'no-store');
          if (!mounted) return;
          if (publicOpts.deliveryMethods?.length) {
            setDeliveryChoices(
              publicOpts.deliveryMethods.map((o) => ({
                code: o.code,
                label: `${o.label} (${o.code})`,
              })),
            );
          }
          if (publicOpts.durations?.length) {
            setDurationChoices(
              publicOpts.durations.map((o) => ({
                code: o.code,
                label: `${o.label} (${o.code})`,
              })),
            );
          }
        } catch {
          // Keep defaults
        }
      }
    };
    loadChoices();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      slug: form.slug.toLowerCase().trim(),
      categorySlug: form.categorySlug,
      provider: form.provider.trim(),
      deliveryMethod: form.deliveryMethod,
      isPublished: form.isPublished,
      sortOrder: Number(form.sortOrder),
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      variants: [
        {
          slug: form.variantSlug || `${form.slug}-${form.duration}`,
          duration: form.duration,
          price: Number(form.price),
          isAvailable: true,
          features: {
            ar: linesToArray(form.featuresText.ar),
            fr: linesToArray(form.featuresText.fr),
            en: linesToArray(form.featuresText.en),
          },
          restrictions: {
            ar: linesToArray(form.restrictionsText.ar),
            fr: linesToArray(form.restrictionsText.fr),
            en: linesToArray(form.restrictionsText.en),
          },
        },
      ],
    };

    try {
      await createAdminProduct(payload);
      router.push('/admin/products');
    } catch (err) {
      setError((err as Error).message || 'حدث خطأ أثناء حفظ المنتج.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-start">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs text-muted">
            <Link href="/admin/products" className="hover:text-ink flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>العودة للمنتجات</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">إضافة منتج واشتراك جديد</h1>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Attributes */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
            البيانات الأساسية للمنتج
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الرمز التعريفي (Slug)</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. cursor-pro"
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">التصنيف</label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              >
                {categoryChoices.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">المزود (Provider)</label>
              <input
                type="text"
                required
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                placeholder="e.g. Anthropic, Canva, OpenAI"
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                طريقة التفعيل والتسليم
              </label>
              <select
                value={form.deliveryMethod}
                onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              >
                {deliveryChoices.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Localized Content */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
            المحتوى متعدد اللغات (عربية • فرنسية • إنجليزية)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الاسم بالعربية</label>
              <input
                type="text"
                required
                value={form.name.ar}
                onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
                placeholder="مثال: كانفا برو"
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الاسم بالفرنسية</label>
              <input
                type="text"
                required
                value={form.name.fr}
                onChange={(e) => setForm({ ...form, name: { ...form.name, fr: e.target.value } })}
                placeholder="Canva Pro"
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الاسم بالإنجليزية</label>
              <input
                type="text"
                required
                value={form.name.en}
                onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
                placeholder="Canva Pro"
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف المختصر (عربي)</label>
              <input
                type="text"
                required
                value={form.tagline.ar}
                onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, ar: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف المختصر (فرنسي)</label>
              <input
                type="text"
                required
                value={form.tagline.fr}
                onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, fr: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف المختصر (إنجليزي)</label>
              <input
                type="text"
                required
                value={form.tagline.en}
                onChange={(e) => setForm({ ...form, tagline: { ...form.tagline, en: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف الكامل (عربي)</label>
              <textarea
                rows={3}
                required
                value={form.description.ar}
                onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف الكامل (فرنسي)</label>
              <textarea
                rows={3}
                required
                value={form.description.fr}
                onChange={(e) => setForm({ ...form, description: { ...form.description, fr: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">الوصف الكامل (إنجليزي)</label>
              <textarea
                rows={3}
                required
                value={form.description.en}
                onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              />
            </div>
          </div>
        </Card>

        {/* Plan Variant & Price in TND */}
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider pb-2 border-b border-line">
            الخطة الأولية والتسعير بالدينار التونسي (TND)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">المدة</label>
              <select
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
              >
                {durationChoices.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">السعر الصافي بالدينار التونسي</label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">حالة النشر الفوري</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-medium text-ink">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded text-tooly-red focus:ring-tooly-red"
                />
                <span>نشر فوري في المتجر</span>
              </label>
            </div>
          </div>

          <div className="pt-2 space-y-3 border-t border-line">
            <div className="flex items-center justify-between flex-wrap gap-2 bg-paper px-3 py-2 rounded-control border border-line">
              <span className="text-xs font-bold text-ink">
                ميزات وقيود الباقة باللغات الثلاث:
              </span>
              <div role="tablist" className="flex items-center gap-1.5">
                {LOCALE_TABS.map((tab) => {
                  const active = packLocale === tab.key;
                  const count =
                    linesToArray(form.featuresText[tab.key]).length +
                    linesToArray(form.restrictionsText[tab.key]).length;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setPackLocale(tab.key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control text-xs font-bold transition-colors ${
                        active
                          ? 'bg-tooly-red text-surface shadow-sm'
                          : 'bg-surface text-muted hover:text-ink border border-line'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 rounded-full text-[10px] font-mono ${
                          active
                            ? 'bg-surface/20 text-surface'
                            : 'bg-paper text-muted'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              dir={packLocale === 'ar' ? 'rtl' : 'ltr'}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  الميزات ({packLocale.toUpperCase()}) — سطر لكل ميزة
                </label>
                <textarea
                  rows={3}
                  value={form.featuresText[packLocale]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featuresText: {
                        ...form.featuresText,
                        [packLocale]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">
                  القيود والشروط ({packLocale.toUpperCase()}) — سطر لكل قيد
                </label>
                <textarea
                  rows={3}
                  value={form.restrictionsText[packLocale]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      restrictionsText: {
                        ...form.restrictionsText,
                        [packLocale]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button variant="secondary" size="md">
              إلغاء
            </Button>
          </Link>
          <Button variant="primary" size="md" isLoading={loading} type="submit">
            <span>حفظ ونشر المنتج</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

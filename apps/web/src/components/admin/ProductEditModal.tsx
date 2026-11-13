'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  AdminCatalogOptionKind,
  AdminProductItem,
  fetchAdminCatalogOptions,
  updateAdminProduct,
  uploadAdminProductImage,
} from '@/lib/api/admin';
import { fetchCatalogOptions } from '@/lib/api/catalog';
import { CatalogOptionsManager } from '@/components/admin/CatalogOptionsManager';
import {
  ALLOWED_CATEGORY_IMAGE_TYPES,
} from '@/lib/media/category-image';
import {
  MAX_PRODUCT_IMAGE_BYTES,
  resolveProductIconPath,
} from '@/lib/media/product-image';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

type EditLocale = 'ar' | 'fr' | 'en';

interface CategoryOption {
  id: string;
  slug: string;
  name: { ar: string; fr: string; en: string };
}

interface VariantDraft {
  id?: string;
  slug: string;
  duration: string;
  price: number;
  isAvailable: boolean;
  isDemo: boolean;
  featuresText: Record<EditLocale, string>;
  restrictionsText: Record<EditLocale, string>;
}

interface ProductFormState {
  slug: string;
  categorySlug: string;
  provider: string;
  deliveryMethod: string;
  sortOrder: number;
  isPublished: boolean;
  isDemo: boolean;
  iconUrl: string;
  name: Record<EditLocale, string>;
  tagline: Record<EditLocale, string>;
  description: Record<EditLocale, string>;
  variants: VariantDraft[];
}

interface OptionSelectChoice {
  code: string;
  label: string;
}

const DEFAULT_DELIVERY_CHOICES: OptionSelectChoice[] = [
  {
    code: 'OFFLINE_TRANSFER',
    label: 'طلب عبر التحويل أو الدفع المحلي (تونس) (OFFLINE_TRANSFER)',
  },
  {
    code: 'MANUAL_SUPPORT',
    label: 'تفعيل يدوي سريع عبر دعم Tooly.tn (MANUAL_SUPPORT)',
  },
  {
    code: 'TEAM_INVITE',
    label: 'دعوة مساحة عمل رسمية على بريدك الشخصي (TEAM_INVITE)',
  },
  {
    code: 'CREDENTIALS_PROVISION',
    label: 'إعداد وتسليم بيانات حساب مخصص وآمن (CREDENTIALS_PROVISION)',
  },
  {
    code: 'VOUCHER_CODE',
    label: 'تسليم كود تفعيل فوري عبر البريد (VOUCHER_CODE)',
  },
];

const DEFAULT_DURATION_CHOICES: OptionSelectChoice[] = [
  { code: '1_month', label: 'شهر واحد (1_month)' },
  { code: '3_months', label: '3 أشهر (3_months)' },
  { code: '6_months', label: '6 أشهر (6_months)' },
  { code: '1_year', label: 'سنة كاملة (1_year)' },
  { code: 'lifetime', label: 'مدى الحياة (lifetime)' },
];

const LOCALE_TABS: Array<{ key: EditLocale; label: string }> = [
  { key: 'ar', label: 'العربية (AR)' },
  { key: 'fr', label: 'Français (FR)' },
  { key: 'en', label: 'English (EN)' },
];

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function buildInitialForm(product: AdminProductItem): ProductFormState {
  return {
    slug: product.slug || '',
    categorySlug: product.categorySlug || product.category?.slug || 'ai',
    provider: product.provider || '',
    deliveryMethod: product.deliveryMethod || 'OFFLINE_TRANSFER',
    sortOrder: Number(product.sortOrder ?? 0),
    isPublished: Boolean(product.isPublished),
    isDemo: Boolean(product.isDemo),
    iconUrl: product.iconUrl || '',
    name: {
      ar: product.name?.ar || '',
      fr: product.name?.fr || '',
      en: product.name?.en || '',
    },
    tagline: {
      ar: product.tagline?.ar || '',
      fr: product.tagline?.fr || '',
      en: product.tagline?.en || '',
    },
    description: {
      ar: product.description?.ar || '',
      fr: product.description?.fr || '',
      en: product.description?.en || '',
    },
    variants:
      product.variants && product.variants.length > 0
        ? product.variants.map((v) => ({
            id: v.id,
            slug: v.slug,
            duration: v.duration,
            price: Number(v.price),
            isAvailable: v.isAvailable,
            isDemo: v.isDemo,
            featuresText: {
              ar: (v.features?.ar || []).join('\n'),
              fr: (v.features?.fr || []).join('\n'),
              en: (v.features?.en || []).join('\n'),
            },
            restrictionsText: {
              ar: (v.restrictions?.ar || []).join('\n'),
              fr: (v.restrictions?.fr || []).join('\n'),
              en: (v.restrictions?.en || []).join('\n'),
            },
          }))
        : [
            {
              slug: `${product.slug}-1m`,
              duration: '1_month',
              price: 49,
              isAvailable: true,
              isDemo: Boolean(product.isDemo),
              featuresText: { ar: '', fr: '', en: '' },
              restrictionsText: { ar: '', fr: '', en: '' },
            },
          ],
  };
}

export function ProductEditModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: AdminProductItem | null;
  categories: CategoryOption[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProductFormState | null>(null);
  const [activeLocale, setActiveLocale] = useState<EditLocale>('ar');
  const [variantLocaleByKey, setVariantLocaleByKey] = useState<
    Record<string, EditLocale>
  >({});
  const [deliveryChoices, setDeliveryChoices] = useState<OptionSelectChoice[]>(
    DEFAULT_DELIVERY_CHOICES,
  );
  const [durationChoices, setDurationChoices] = useState<OptionSelectChoice[]>(
    DEFAULT_DURATION_CHOICES,
  );
  const [managingOptionsKind, setManagingOptionsKind] =
    useState<AdminCatalogOptionKind | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadDynamicOptions = async () => {
    try {
      const adminOpts = await fetchAdminCatalogOptions();
      setDeliveryChoices(
        (adminOpts.deliveryMethods || []).map((o) => ({
          code: o.code,
          label: `${o.label.ar} (${o.code})`,
        })),
      );
      setDurationChoices(
        (adminOpts.durations || []).map((o) => ({
          code: o.code,
          label: `${o.label.ar} (${o.code})`,
        })),
      );
      return;
    } catch {
      try {
        const publicOpts = await fetchCatalogOptions('ar', 'no-store');
        setDeliveryChoices(
          (publicOpts.deliveryMethods || []).map((o) => ({
            code: o.code,
            label: `${o.label} (${o.code})`,
          })),
        );
        setDurationChoices(
          (publicOpts.durations || []).map((o) => ({
            code: o.code,
            label: `${o.label} (${o.code})`,
          })),
        );
      } catch {
        // Keep fallback options
      }
    }
  };

  useEffect(() => {
    if (product) {
      setForm(buildInitialForm(product));
      setActiveLocale('ar');
      setVariantLocaleByKey({});
      setManagingOptionsKind(null);
      setError(null);
      setUploadError(null);
      loadDynamicOptions();
    } else {
      setForm(null);
    }
  }, [product]);

  if (!product || !form) {
    return null;
  }

  const resolvedPreview = resolveProductIconPath(form.iconUrl, form.slug);

  const handleLogoUpload = async (file: File) => {
    setUploadError(null);
    if (
      !ALLOWED_CATEGORY_IMAGE_TYPES.includes(
        file.type.toLowerCase() as (typeof ALLOWED_CATEGORY_IMAGE_TYPES)[number],
      )
    ) {
      setUploadError('صيغة الملف غير مدعومة. يرجى اختيار JPG أو PNG أو WebP.');
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_BYTES) {
      setUploadError('حجم الشعار يتجاوز 5 ميغابايت.');
      return;
    }

    setUploadingLogo(true);
    try {
      const uploaded = await uploadAdminProductImage(file);
      setForm((prev) => (prev ? { ...prev, iconUrl: uploaded.path } : prev));
    } catch (err) {
      setUploadError((err as Error).message || 'فشل رفع شعار المنتج');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddVariant = () => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextIdx = prev.variants.length + 1;
      const defaultDuration =
        durationChoices[1]?.code || durationChoices[0]?.code || '1_month';
      return {
        ...prev,
        variants: [
          ...prev.variants,
          {
            slug: `${prev.slug || 'plan'}-opt-${nextIdx}`,
            duration: defaultDuration,
            price: prev.variants[0]?.price ?? 79,
            isAvailable: true,
            isDemo: prev.isDemo,
            featuresText: { ar: '', fr: '', en: '' },
            restrictionsText: { ar: '', fr: '', en: '' },
          },
        ],
      };
    });
  };

  const handleRemoveVariant = (idx: number) => {
    setForm((prev) => {
      if (!prev || prev.variants.length <= 1) return prev;
      return {
        ...prev,
        variants: prev.variants.filter((_, i) => i !== idx),
      };
    });
  };

  const updateVariantField = (
    idx: number,
    updater: (current: VariantDraft) => VariantDraft,
  ) => {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        variants: prev.variants.map((v, i) => (i === idx ? updater(v) : v)),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || uploadingLogo) return;

    setSubmitting(true);
    setError(null);

    try {
      await updateAdminProduct(product.id, {
        slug: form.slug.toLowerCase().trim(),
        categorySlug: form.categorySlug,
        provider: form.provider.trim(),
        deliveryMethod: form.deliveryMethod,
        sortOrder: Number(form.sortOrder),
        isPublished: form.isPublished,
        isDemo: form.isDemo,
        iconUrl: form.iconUrl.trim() || null,
        name: {
          ar: form.name.ar.trim(),
          fr: form.name.fr.trim(),
          en: form.name.en.trim(),
        },
        tagline: {
          ar: form.tagline.ar.trim(),
          fr: form.tagline.fr.trim(),
          en: form.tagline.en.trim(),
        },
        description: {
          ar: form.description.ar.trim(),
          fr: form.description.fr.trim(),
          en: form.description.en.trim(),
        },
        variants: form.variants.map((v) => ({
          ...(v.id ? { id: v.id } : {}),
          slug: v.slug.toLowerCase().trim(),
          duration: v.duration,
          price: Number(v.price),
          isAvailable: v.isAvailable,
          isDemo: v.isDemo,
          features: {
            ar: linesToArray(v.featuresText.ar),
            fr: linesToArray(v.featuresText.fr),
            en: linesToArray(v.featuresText.en),
          },
          restrictions: {
            ar: linesToArray(v.restrictionsText.ar),
            fr: linesToArray(v.restrictionsText.fr),
            en: linesToArray(v.restrictionsText.en),
          },
        })),
      });

      onSaved();
      onClose();
    } catch (err) {
      setError((err as Error).message || 'فشل حفظ تعديلات المنتج');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={Boolean(product)}
      onClose={onClose}
      size="xl"
      title={`تعديل المنتج بالكامل — ${form.name.ar || form.slug}`}
      description="يمكنك تعديل كافة التفاصيل الظاهرة في بطاقة الخطة (PlanCard) وصفحة تفاصيل المنتج والباقات والأسعار باللغات الثلاث."
    >
      <form onSubmit={handleSubmit} className="space-y-6 text-start">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Core Info & Icon */}
        <section className="p-4 rounded-card bg-paper/60 border border-line space-y-4">
          <h3 className="text-sm font-bold text-ink border-b border-line pb-2">
            1. الإعدادات الأساسية والهوية البصرية
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                الرمز (Slug) <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                  })
                }
                dir="ltr"
                className="w-full px-3 py-2 bg-surface text-ink text-xs font-mono rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                التصنيف <span className="text-tooly-red">*</span>
              </label>
              <select
                value={form.categorySlug}
                onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name?.ar || cat.slug} ({cat.slug})
                    </option>
                  ))
                ) : (
                  <option value={form.categorySlug}>{form.categorySlug}</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                المزود الرسمي (Provider) <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <label className="block text-xs font-semibold text-ink">
                  طريقة التفعيل والتسليم (تظهر في البطاقة وصفحة المنتج)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setManagingOptionsKind((prev) =>
                      prev === 'DELIVERY_METHOD' ? null : 'DELIVERY_METHOD',
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-tooly-red hover:underline"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>
                    {managingOptionsKind === 'DELIVERY_METHOD'
                      ? 'إخفاء إدارة الخيارات'
                      : 'إدارة طرق التسليم'}
                  </span>
                </button>
              </div>
              <select
                value={form.deliveryMethod}
                onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              >
                {deliveryChoices.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
                {!deliveryChoices.some((o) => o.code === form.deliveryMethod) && (
                  <option value={form.deliveryMethod}>
                    {form.deliveryMethod}
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                الترتيب (Sort Order)
              </label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm({ ...form, sortOrder: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full px-3 py-2 bg-surface text-ink text-xs font-mono rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>
          </div>

          {/* Toggles + Logo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
            <div className="md:col-span-5 flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded border-line text-tooly-red focus:ring-tooly-red"
                />
                <span>منشور في المتجر (Published)</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isDemo}
                  onChange={(e) => setForm({ ...form, isDemo: e.target.checked })}
                  className="rounded border-line text-tooly-red focus:ring-tooly-red"
                />
                <span>وسم عرض تجريبي (Demo Badge)</span>
              </label>
            </div>

            <div className="md:col-span-7 flex items-center gap-3 bg-surface p-2.5 rounded-control border border-line">
              <div className="w-12 h-12 rounded-control bg-paper border border-line p-1.5 flex items-center justify-center shrink-0">
                {resolvedPreview ? (
                  <img
                    src={resolvedPreview}
                    alt={form.name.ar || form.slug}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-ink">شعار المنتج (اختياري)</div>
                <div className="text-[10px] text-muted truncate" dir="ltr">
                  {form.iconUrl || 'يستخدم الشعار الافتراضي إن وجد'}
                </div>
                {uploadError && (
                  <div className="text-[10px] text-danger font-semibold mt-0.5">
                    {uploadError}
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleLogoUpload(file);
                }}
                className="hidden"
              />

              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadingLogo ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>رفع شعار</span>
                </Button>
                {form.iconUrl && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setForm({ ...form, iconUrl: '' })}
                    title="إزالة الشعار المخصص"
                  >
                    مسح
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {managingOptionsKind === 'DELIVERY_METHOD' && (
          <CatalogOptionsManager
            compact
            initialKind="DELIVERY_METHOD"
            onChanged={loadDynamicOptions}
            onClose={() => setManagingOptionsKind(null)}
          />
        )}

        {/* Locale Switcher Tabs (Controls Section 2 Name/Tagline/Description) */}
        <div className="flex items-center justify-between flex-wrap gap-2 bg-paper px-3 py-2 rounded-control border border-line">
          <span className="text-xs font-bold text-ink">
            لغة اسم المنتج والأوصاف (القسم 2):
          </span>
          <div className="flex items-center gap-1.5">
            {LOCALE_TABS.map((tab) => {
              const active = activeLocale === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveLocale(tab.key)}
                  className={`px-3 py-1 rounded-control text-xs font-bold transition-colors ${
                    active
                      ? 'bg-tooly-red text-surface shadow-sm'
                      : 'bg-surface text-muted hover:text-ink border border-line'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Localized Copy */}
        <section className="p-4 rounded-card bg-paper/60 border border-line space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h3 className="text-sm font-bold text-ink">
              2. الاسم والوصف ({activeLocale.toUpperCase()})
            </h3>
            <span className="text-[11px] text-muted flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              يظهر في البطاقة ورأس صفحة المنتج
            </span>
          </div>

          <div
            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                اسم المنتج ({activeLocale.toUpperCase()})
              </label>
              <input
                type="text"
                value={form.name[activeLocale]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: { ...form.name, [activeLocale]: e.target.value },
                  })
                }
                placeholder="مثال: Claude Pro"
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                العنوان المختصر / Tagline ({activeLocale.toUpperCase()})
              </label>
              <input
                type="text"
                value={form.tagline[activeLocale]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tagline: { ...form.tagline, [activeLocale]: e.target.value },
                  })
                }
                placeholder="سطر تعريفي يظهر في PlanCard..."
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-ink mb-1">
                الوصف التفصيلي ({activeLocale.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={form.description[activeLocale]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: { ...form.description, [activeLocale]: e.target.value },
                  })
                }
                placeholder="الوصف التفصيلي الكامل في صفحة تفاصيل المنتج..."
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>
          </div>
        </section>

        {/* Section 3: Variants (Prices, Durations, Features & Restrictions) */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-ink">
                3. الباقات والأسعار والميزات ({form.variants.length})
              </h3>
              <p className="text-[11px] text-muted">
                كل باقة تدعم محوّل لغات مستقل (AR / FR / EN)؛ كل سطر في الميزات أو القيود سيظهر كنقطة مستقلة في{' '}
                <code>PlanCard</code> وصفحة التفاصيل.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setManagingOptionsKind((prev) =>
                    prev === 'DURATION' ? null : 'DURATION',
                  )
                }
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  {managingOptionsKind === 'DURATION'
                    ? 'إخفاء إدارة المدد'
                    : 'إدارة المدد'}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddVariant}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة باقة</span>
              </Button>
            </div>
          </div>

          {managingOptionsKind === 'DURATION' && (
            <CatalogOptionsManager
              compact
              initialKind="DURATION"
              onChanged={loadDynamicOptions}
              onClose={() => setManagingOptionsKind(null)}
            />
          )}

          <div className="space-y-4">
            {form.variants.map((variant, idx) => {
              const packKey = variant.id || `new-${idx}`;
              const packLocale: EditLocale =
                variantLocaleByKey[packKey] ?? activeLocale ?? 'ar';

              return (
                <div
                  key={packKey}
                  className="p-4 rounded-card bg-surface border border-line space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-line">
                    <span className="text-xs font-bold text-ink">
                      الباقة #{idx + 1}{' '}
                      {variant.id ? (
                        <span className="text-[10px] font-mono text-muted">
                          ({variant.slug})
                        </span>
                      ) : (
                        <span className="text-[10px] text-tooly-red">(جديدة)</span>
                      )}
                    </span>

                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variant.isAvailable}
                          onChange={(e) =>
                            updateVariantField(idx, (cur) => ({
                              ...cur,
                              isAvailable: e.target.checked,
                            }))
                          }
                          className="rounded border-line text-tooly-red"
                        />
                        <span>متاح للطلب</span>
                      </label>

                      <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink cursor-pointer">
                        <input
                          type="checkbox"
                          checked={variant.isDemo}
                          onChange={(e) =>
                            updateVariantField(idx, (cur) => ({
                              ...cur,
                              isDemo: e.target.checked,
                            }))
                          }
                          className="rounded border-line text-tooly-red"
                        />
                        <span>Demo</span>
                      </label>

                      <button
                        type="button"
                        disabled={form.variants.length <= 1}
                        onClick={() => handleRemoveVariant(idx)}
                        title="حذف هذه الباقة"
                        className="p-1 text-muted hover:text-danger disabled:opacity-30 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-ink mb-1">
                        رمز الباقة (Variant Slug)
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={variant.slug}
                        onChange={(e) =>
                          updateVariantField(idx, (cur) => ({
                            ...cur,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-paper text-ink text-xs font-mono rounded-control border border-line"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-ink mb-1">
                        المدة
                      </label>
                      <select
                        value={variant.duration}
                        onChange={(e) =>
                          updateVariantField(idx, (cur) => ({
                            ...cur,
                            duration: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-paper text-ink text-xs rounded-control border border-line"
                      >
                        {durationChoices.map((opt) => (
                          <option key={opt.code} value={opt.code}>
                            {opt.label}
                          </option>
                        ))}
                        {!durationChoices.some((o) => o.code === variant.duration) && (
                          <option value={variant.duration}>{variant.duration}</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-ink mb-1">
                        السعر بالدينار التونسي (TND)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        required
                        value={variant.price}
                        onChange={(e) =>
                          updateVariantField(idx, (cur) => ({
                            ...cur,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-1.5 bg-paper text-ink text-xs font-mono font-bold rounded-control border border-line"
                      />
                    </div>
                  </div>

                  {/* Per-Pack 3-Language Locale Switcher Tabs */}
                  <div className="flex items-center justify-between flex-wrap gap-2 bg-paper px-3 py-2 rounded-control border border-line">
                    <span className="text-[11px] font-bold text-ink">
                      لغة ميزات وقيود هذه الباقة:
                    </span>
                    <div
                      role="tablist"
                      aria-label={`لغة الباقة ${idx + 1}`}
                      className="flex items-center gap-1.5"
                    >
                      {LOCALE_TABS.map((tab) => {
                        const active = packLocale === tab.key;
                        const count =
                          linesToArray(variant.featuresText[tab.key]).length +
                          linesToArray(variant.restrictionsText[tab.key]).length;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() =>
                              setVariantLocaleByKey((prev) => ({
                                ...prev,
                                [packKey]: tab.key,
                              }))
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-control text-[11px] font-bold transition-colors ${
                              active
                                ? 'bg-tooly-red text-surface shadow-sm'
                                : 'bg-surface text-muted hover:text-ink border border-line'
                            }`}
                          >
                            <span>{tab.label}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
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

                  {/* Localized Features & Restrictions for packLocale */}
                  <div
                    dir={packLocale === 'ar' ? 'rtl' : 'ltr'}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <div>
                      <label className="block text-[11px] font-semibold text-ink mb-1">
                        الميزات ({packLocale.toUpperCase()}) — سطر لكل ميزة
                      </label>
                      <textarea
                        rows={4}
                        value={variant.featuresText[packLocale]}
                        onChange={(e) =>
                          updateVariantField(idx, (cur) => ({
                            ...cur,
                            featuresText: {
                              ...cur.featuresText,
                              [packLocale]: e.target.value,
                            },
                          }))
                        }
                        placeholder={
                          packLocale === 'ar'
                            ? 'أدخل ميزة واحدة في كل سطر...'
                            : packLocale === 'fr'
                              ? 'Une fonctionnalité par ligne...'
                              : 'One feature per line...'
                        }
                        className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-ink mb-1">
                        القيود والشروط ({packLocale.toUpperCase()}) — سطر لكل قيد
                      </label>
                      <textarea
                        rows={4}
                        value={variant.restrictionsText[packLocale]}
                        onChange={(e) =>
                          updateVariantField(idx, (cur) => ({
                            ...cur,
                            restrictionsText: {
                              ...cur.restrictionsText,
                              [packLocale]: e.target.value,
                            },
                          }))
                        }
                        placeholder={
                          packLocale === 'ar'
                            ? 'أدخل قيداً أو شرطاً في كل سطر...'
                            : packLocale === 'fr'
                              ? 'Une condition ou restriction par ligne...'
                              : 'One restriction or term per line...'
                        }
                        className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 border-t border-line flex items-center justify-end gap-2 sticky bottom-0 bg-surface py-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={uploadingLogo}
            isLoading={submitting}
          >
            حفظ كافة التعديلات
          </Button>
        </div>
      </form>
    </Modal>
  );
}


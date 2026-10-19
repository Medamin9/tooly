'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { createAdminProduct } from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  });

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
          features: ['وصول متميز للخدمة', 'دعم فني محلي من Tooly.tn'],
          restrictions: ['استخدام مطابق لشروط المزود القياسية'],
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <option value="ai">الذكاء الاصطناعي (AI)</option>
                <option value="design">التصميم والجرافيك</option>
                <option value="video">المونتاج وصناعة الفيديو</option>
                <option value="productivity">الإنتاجية</option>
                <option value="developer">أدوات المطورين</option>
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
                <option value="1_month">شهر واحد (1 month)</option>
                <option value="3_months">3 أشهر (3 months)</option>
                <option value="1_year">سنة كاملة (1 year)</option>
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

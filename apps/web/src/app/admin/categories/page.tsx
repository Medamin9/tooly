'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  Package,
  AlertCircle,
  RefreshCw,
  Globe,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import {
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  uploadAdminCategoryImage,
} from '@/lib/api/admin';
import {
  ALLOWED_CATEGORY_IMAGE_TYPES,
  MAX_CATEGORY_IMAGE_BYTES,
  resolveCategoryImagePath,
} from '@/lib/media/category-image';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

interface CategoryItem {
  id: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  imageUrl?: string | null;
  productsCount: number;
  name: {
    ar: string;
    fr: string;
    en: string;
  };
  description?: {
    ar: string;
    fr: string;
    en: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Automatic Image Upload State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Form State
  const [form, setForm] = useState({
    slug: '',
    sortOrder: 0,
    isActive: true,
    imageUrl: '',
    nameAr: '',
    nameFr: '',
    nameEn: '',
    descAr: '',
    descFr: '',
    descEn: '',
  });

  const loadCategories = () => {
    setLoading(true);
    fetchAdminCategories()
      .then((data: CategoryItem[]) => {
        setCategories(data);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'فشل تحميل التصنيفات');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({
      slug: '',
      sortOrder: (categories.length + 1) * 10,
      isActive: true,
      imageUrl: '',
      nameAr: '',
      nameFr: '',
      nameEn: '',
      descAr: '',
      descFr: '',
      descEn: '',
    });
    setModalError(null);
    setUploadError(null);
    setUploadingImage(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setForm({
      slug: cat.slug,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
      imageUrl: cat.imageUrl || '',
      nameAr: cat.name.ar || '',
      nameFr: cat.name.fr || '',
      nameEn: cat.name.en || '',
      descAr: cat.description?.ar || '',
      descFr: cat.description?.fr || '',
      descEn: cat.description?.en || '',
    });
    setModalError(null);
    setUploadError(null);
    setUploadingImage(false);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploadError(null);

    if (
      !ALLOWED_CATEGORY_IMAGE_TYPES.includes(
        file.type.toLowerCase() as (typeof ALLOWED_CATEGORY_IMAGE_TYPES)[number]
      )
    ) {
      setUploadError('صيغة الملف غير مدعومة. يرجى اختيار صورة JPG أو PNG أو WebP.');
      return;
    }

    if (file.size > MAX_CATEGORY_IMAGE_BYTES) {
      setUploadError('حجم الصورة يتجاوز الحد الأقصى (5 ميغابايت).');
      return;
    }

    setUploadingImage(true);
    try {
      const uploaded = await uploadAdminCategoryImage(file);
      setForm((prev) => ({ ...prev, imageUrl: uploaded.path }));
    } catch (err) {
      setUploadError((err as Error).message || 'فشل رفع الصورة، يرجى المحاولة مجدداً.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleImageUpload(file);
    }
  };

  const handleToggleActive = async (cat: CategoryItem) => {
    try {
      await updateAdminCategory(cat.id, { isActive: !cat.isActive });
      loadCategories();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat.productsCount > 0) {
      alert(
        `لا يمكن حذف التصنيف "${cat.name.ar || cat.slug}" لأنه يحتوي على ${cat.productsCount} منتجات مرتبطة. يرجى نقل أو حذف المنتجات أولاً.`
      );
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف التصنيف "${cat.name.ar || cat.slug}" بشكل نهائي؟`)) {
      return;
    }

    try {
      await deleteAdminCategory(cat.id);
      loadCategories();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadingImage) return;

    setSubmitting(true);
    setModalError(null);

    const payload = {
      slug: form.slug.toLowerCase().trim(),
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
      imageUrl: form.imageUrl.trim() || null,
      name: {
        ar: form.nameAr.trim(),
        fr: form.nameFr.trim(),
        en: form.nameEn.trim(),
      },
      description: {
        ar: form.descAr.trim(),
        fr: form.descFr.trim(),
        en: form.descEn.trim(),
      },
    };

    if (!payload.slug) {
      setModalError('الرجاء إدخال المعرف اللاتيني الفريد (Slug)');
      setSubmitting(false);
      return;
    }

    if (!payload.name.ar || !payload.name.fr || !payload.name.en) {
      setModalError('الرجاء كتابة اسم التصنيف باللغات الثلاث (العربية، الفرنسية، والإنجليزية)');
      setSubmitting(false);
      return;
    }

    try {
      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, payload);
      } else {
        await createAdminCategory(payload);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      setModalError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        search.trim() === '' ||
        cat.slug.toLowerCase().includes(search.toLowerCase()) ||
        cat.name.ar.toLowerCase().includes(search.toLowerCase()) ||
        cat.name.fr.toLowerCase().includes(search.toLowerCase()) ||
        cat.name.en.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && cat.isActive) ||
        (statusFilter === 'INACTIVE' && !cat.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalProducts = categories.reduce((sum, c) => sum + c.productsCount, 0);
  const activeCount = categories.filter((c) => c.isActive).length;
  const resolvedPreviewSrc = form.imageUrl
    ? resolveCategoryImagePath(form.imageUrl, form.slug)
    : '';

  return (
    <div className="space-y-6 text-start">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-control bg-sky-50 text-sky-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">إدارة التصنيفات</h1>
          </div>
          <p className="text-xs sm:text-sm text-muted">
            إدارة وتخصيص تصنيفات اشتراكات Tooly.tn، رفع صور الأقسام، التحكم في الترتيب، والترجمات متعددة اللغات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCategories} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </Button>
          <Button variant="primary" size="sm" onClick={openCreateModal}>
            <PlusCircle className="w-4 h-4" />
            <span>إضافة تصنيف جديد</span>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-bold text-muted uppercase">إجمالي التصنيفات</span>
          <div className="text-2xl font-black text-ink mt-1">{categories.length}</div>
          <span className="text-[10px] text-muted">مسجلة في قاعدة البيانات</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold text-muted uppercase">التصنيفات النشطة</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{activeCount}</div>
          <span className="text-[10px] text-muted">معروضة في واجهة المتجر</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold text-muted uppercase">المعطلة أو المسودة</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {categories.length - activeCount}
          </div>
          <span className="text-[10px] text-muted">مخفية مؤقتاً عن الزوار</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-bold text-muted uppercase">المنتجات المرتبطة</span>
          <div className="text-2xl font-black text-tooly-red mt-1">{totalProducts}</div>
          <span className="text-[10px] text-muted">موزعة عبر الأقسام</span>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="البحث بالاسم (العربية، الفرنسية، الإنجليزية) أو الـ slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-9 pe-4 py-2 bg-paper text-ink text-xs sm:text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-control border border-line bg-paper p-1 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-ink text-surface shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                الكل ({categories.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('ACTIVE')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'ACTIVE'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                نشط ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('INACTIVE')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'INACTIVE'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                معطل ({categories.length - activeCount})
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-card text-danger text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Table / List */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-tooly-red border-t-transparent animate-spin mb-3" />
            <span className="text-xs text-muted">جاري تحميل قائمة التصنيفات...</span>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Layers className="w-10 h-10 text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-ink mb-1">لا توجد تصنيفات مطابقة</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mb-4">
              لم نعثر على أي تصنيف يطابق شروط البحث الحالية. يمكنك إضافة تصنيف جديد أو تعديل معايير
              البحث.
            </p>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              <PlusCircle className="w-4 h-4" />
              <span>إضافة تصنيف الآن</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-surface/50 border-b border-line text-muted font-bold text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-start">الترتيب</th>
                  <th className="px-4 py-3.5 text-start">التصنيف والصورة (عربي / English / Français)</th>
                  <th className="px-4 py-3.5 text-start">المعرف (Slug)</th>
                  <th className="px-4 py-3.5 text-center">المنتجات</th>
                  <th className="px-4 py-3.5 text-center">الحالة</th>
                  <th className="px-4 py-3.5 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-surface/30 transition-colors">
                    {/* Sort Order */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-paper border border-line text-xs font-bold text-ink">
                        {cat.sortOrder}
                      </span>
                    </td>

                    {/* Image & Localized Names */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {/* Thumbnail resolved through image path handler */}
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface border border-line shrink-0 flex items-center justify-center">
                          <img
                            src={resolveCategoryImagePath(cat.imageUrl, cat.slug)}
                            alt={cat.name.ar || cat.slug}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Text info */}
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-extrabold text-ink text-sm sm:text-base">
                            {cat.name.ar || cat.slug}
                          </div>
                          <div className="text-[11px] text-muted flex items-center gap-2">
                            <span className="font-medium text-ink/80">{cat.name.en}</span>
                            <span>•</span>
                            <span className="font-medium text-muted">{cat.name.fr}</span>
                          </div>
                          {cat.description?.ar && (
                            <p className="text-[11px] text-muted/80 line-clamp-1 max-w-md mt-0.5">
                              {cat.description.ar}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <code className="text-xs font-mono bg-paper px-2.5 py-1 rounded border border-line text-ink">
                        {cat.slug}
                      </code>
                    </td>

                    {/* Product count */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <Link
                        href={`/admin/products?search=${cat.slug}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface border border-line hover:border-tooly-red/40 hover:text-tooly-red transition-colors"
                        title="عرض منتجات هذا التصنيف"
                      >
                        <Package className="w-3.5 h-3.5 text-muted" />
                        <span>{cat.productsCount}</span>
                      </Link>
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className="cursor-pointer transition-transform active:scale-95"
                        title={cat.isActive ? 'انقر للتعطيل' : 'انقر للتفعيل'}
                      >
                        {cat.isActive ? (
                          <Badge variant="success" size="sm" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>نشط ومعروض</span>
                          </Badge>
                        ) : (
                          <Badge variant="outline" size="sm" className="gap-1 text-muted">
                            <XCircle className="w-3 h-3" />
                            <span>معطل ومخفي</span>
                          </Badge>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(cat)}
                          title="تعديل التصنيف والترجمات"
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-ink" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cat)}
                          title={
                            cat.productsCount > 0
                              ? 'لا يمكن حذف تصنيف يحتوي على منتجات'
                              : 'حذف التصنيف'
                          }
                          disabled={cat.productsCount > 0}
                          className="h-8 w-8 p-0 text-danger hover:bg-red-50 hover:text-danger disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Create / Edit Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'تعديل التصنيف والترجمات' : 'إضافة تصنيف جديد لمتجر Tooly'}
        description="قم برفع صورة التصنيف تلقائياً وكتابة الاسم باللغات الثلاث لدعم تجربة التصفح المتميزة في المتجر."
      >
        <form onSubmit={handleFormSubmit} className="space-y-5 text-start">
          {modalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-card text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          {/* Identifiers Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="المعرف اللاتيني الفريد (Slug)"
              placeholder="e.g. streaming, productivity, ai"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                })
              }
              hint="يُستخدم في روابط URL وفلترة المنتجات (أحرف صغيرة وشرطات فقط)"
              required
            />

            <Input
              type="number"
              label="ترتيب الظهور (Sort Order)"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              hint="الأرقام الأصغر تظهر أولاً في شريط التصفح"
            />
          </div>

          {/* Active status checkbox */}
          <div className="flex items-center gap-2 pt-1 pb-2 border-b border-line">
            <input
              type="checkbox"
              id="category-active"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-tooly-red border-line focus:ring-tooly-red cursor-pointer"
            />
            <label htmlFor="category-active" className="text-xs font-bold text-ink cursor-pointer">
              تفعيل التصنيف وعرضه للزوار في واجهة المتجر
            </label>
          </div>

          {/* Automatic Image Upload Dropzone Section */}
          <div className="space-y-3 bg-surface/50 p-4 rounded-control border border-line">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-ink">
                <ImageIcon className="w-4 h-4 text-tooly-red" />
                <span>صورة التصنيف (رفع تلقائي)</span>
              </div>
              {form.imageUrl && !uploadingImage && (
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  تم إرفاق الصورة بنجاح
                </span>
              )}
            </div>

            {uploadError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-control text-danger text-[11px] flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
              id="category-image-upload"
            />

            {resolvedPreviewSrc ? (
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-paper rounded-control border border-line">
                <div className="relative w-full sm:w-32 h-24 rounded-control overflow-hidden bg-surface border border-line shrink-0 flex items-center justify-center">
                  <img
                    src={resolvedPreviewSrc}
                    alt="معاينة صورة التصنيف"
                    className="w-full h-full object-cover"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-paper/80 backdrop-blur-[1px] flex flex-col items-center justify-center gap-1">
                      <div className="w-5 h-5 rounded-full border-2 border-tooly-red border-t-transparent animate-spin" />
                      <span className="text-[10px] font-bold text-ink">جاري الرفع...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-start w-full">
                  <p className="text-xs font-semibold text-ink">
                    الصورة جاهزة وسيتم عرضها في الصفحة الرئيسية للمتجر.
                  </p>
                  <p className="text-[11px] text-muted font-mono truncate max-w-[260px]">
                    {form.imageUrl}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع صورة أخرى</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={uploadingImage}
                      onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
                      className="text-danger hover:bg-red-50 hover:text-danger"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>إزالة الصورة</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onClick={() => !uploadingImage && fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !uploadingImage) {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-control border-2 border-dashed transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-tooly-red ${
                  dragActive
                    ? 'border-tooly-red bg-tooly-soft-red/40'
                    : 'border-line bg-paper hover:border-tooly-red/50 hover:bg-surface/60'
                }`}
              >
                {uploadingImage ? (
                  <>
                    <div className="w-7 h-7 rounded-full border-2 border-tooly-red border-t-transparent animate-spin" />
                    <span className="text-xs font-bold text-ink">
                      جاري رفع الصورة وحفظها تلقائياً...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-tooly-soft-red text-tooly-red flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-center space-y-0.5">
                      <p className="text-xs font-bold text-ink">
                        انقر لاختيار صورة أو اسحبها وأفلتها هنا
                      </p>
                      <p className="text-[11px] text-muted">
                        JPG أو PNG أو WebP — بحد أقصى 5 ميغابايت (تُرفع تلقائياً عند الاختيار)
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Multilingual Names Section */}
          <div className="space-y-3 bg-surface/50 p-4 rounded-control border border-line">
            <div className="flex items-center gap-2 text-xs font-extrabold text-ink">
              <Globe className="w-4 h-4 text-tooly-red" />
              <span>أسماء التصنيف متعددة اللغات (مطلوبة)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="الاسم بالعربية *"
                placeholder="مثال: ذكاء اصطناعي"
                value={form.nameAr}
                onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                required
              />

              <Input
                label="Nom en Français *"
                placeholder="ex: Intelligence Artificielle"
                value={form.nameFr}
                onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                required
              />

              <Input
                label="Name in English *"
                placeholder="e.g. Artificial Intelligence"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Multilingual Descriptions Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-ink block">
              الوصف والنبذة التعريفية (اختياري)
            </label>

            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="وصف التصنيف بالعربية..."
                value={form.descAr}
                onChange={(e) => setForm({ ...form, descAr: e.target.value })}
                className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <textarea
                  rows={2}
                  placeholder="Description en Français..."
                  value={form.descFr}
                  onChange={(e) => setForm({ ...form, descFr: e.target.value })}
                  className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors"
                />
                <textarea
                  rows={2}
                  placeholder="Description in English..."
                  value={form.descEn}
                  onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                  className="w-full px-3 py-2 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting || uploadingImage}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || uploadingImage}
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : editingCategory ? (
                'حفظ التعديلات'
              ) : (
                'إنشاء التصنيف'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

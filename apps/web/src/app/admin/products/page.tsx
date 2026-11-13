'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AdminProductItem,
  fetchAdminCategories,
  fetchAdminProducts,
  updateAdminProduct,
  updateAdminVariantPrice,
  deleteAdminProduct,
} from '@/lib/api/admin';
import { resolveProductIconPath } from '@/lib/media/product-image';
import { ProductEditModal } from '@/components/admin/ProductEditModal';
import { CatalogOptionsManager } from '@/components/admin/CatalogOptionsManager';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Edit variant price modal state
  const [editingVariant, setEditingVariant] = useState<any | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [savingPrice, setSavingPrice] = useState(false);

  // Full Edit Product modal state
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);
  const [optionsModalOpen, setOptionsModalOpen] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchAdminProducts(1, 50, search),
      fetchAdminCategories().catch(() => []),
    ])
      .then(([res, cats]) => {
        setProducts(res.items || []);
        setTotal(res.total || 0);
        setCategories(Array.isArray(cats) ? cats : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleTogglePublish = async (product: AdminProductItem) => {
    try {
      await updateAdminProduct(product.id, { isPublished: !product.isPublished });
      loadProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (product: AdminProductItem) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج "${product.name?.ar || product.slug}"؟`)) {
      return;
    }
    try {
      await deleteAdminProduct(product.id);
      loadProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleSavePrice = async () => {
    if (!editingVariant) return;
    setSavingPrice(true);
    try {
      await updateAdminVariantPrice(editingVariant.id, Number(newPrice));
      setEditingVariant(null);
      loadProducts();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSavingPrice(false);
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            إدارة المنتجات والأسعار
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            تعديل كافة تفاصيل البطاقات وصفحات المنتجات، إدارة الباقات، الأسعار بالدينار، والشعارات.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOptionsModalOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>إدارة المدد وطرق التسليم</span>
          </Button>

          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface p-4 rounded-card border border-line flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرمز أو المزود (Claude, Canva)..."
            className="w-full ps-10 pe-4 py-2 bg-paper text-ink text-xs sm:text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red"
          />
        </div>
        <div className="text-xs text-muted font-semibold">
          إجمالي المنتجات: <strong className="text-ink">{total}</strong>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-surface rounded-card border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-paper border-b border-line text-muted">
              <tr>
                <th className="py-3 px-4 font-semibold">المنتج / الرمز</th>
                <th className="py-3 px-4 font-semibold">التصنيف</th>
                <th className="py-3 px-4 font-semibold">المزود</th>
                <th className="py-3 px-4 font-semibold">الخطط والأسعار (TND)</th>
                <th className="py-3 px-4 font-semibold">حالة النشر</th>
                <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-tooly-red" />
                    <span>جاري تحميل المنتجات...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted">
                    لم يتم العثور على أي منتج.
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const iconSrc = resolveProductIconPath(product.iconUrl, product.slug);
                  return (
                    <tr key={product.id} className="hover:bg-paper/40 transition-colors">
                      {/* Name, Logo, Slug & Demo Tag */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          {iconSrc && (
                            <div className="w-8 h-8 rounded-control bg-paper border border-line p-1 flex items-center justify-center shrink-0">
                              <img
                                src={iconSrc}
                                alt={product.name?.ar || product.slug}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-ink">
                              {product.name?.ar || product.slug}
                            </div>
                            <div className="text-[11px] font-mono text-muted">
                              {product.slug}
                            </div>
                            {product.isDemo && (
                              <Badge variant="demo" size="sm" className="mt-1">
                                Demo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-muted font-medium">
                        {product.category?.slug || product.categorySlug || product.categoryId}
                      </td>

                      {/* Provider */}
                      <td className="py-3 px-4 font-medium text-ink">
                        {product.provider}
                      </td>

                      {/* Plan Variants & Quick Price Editor */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-2">
                          {product.variants.map((v) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setEditingVariant(v);
                                setNewPrice(v.price);
                              }}
                              className="inline-flex items-center gap-1.5 bg-paper hover:bg-tooly-soft-red border border-line hover:border-tooly-red/40 px-2 py-1 rounded-control transition-colors"
                            >
                              <span className="font-mono font-bold text-ink">
                                {v.price} د.ت
                              </span>
                              <span className="text-[10px] text-muted">({v.duration})</span>
                              <Edit2 className="w-3 h-3 text-muted" />
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Publish Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(product)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                            product.isPublished
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {product.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>معروض</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>مسودة مخفية</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span>تعديل</span>
                          </Button>
                          <Link
                            href={`/ar/product/${product.slug}`}
                            target="_blank"
                            title="معاينة صفحة المنتج"
                            className="p-1.5 text-muted hover:text-ink hover:bg-paper rounded-control border border-transparent hover:border-line transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            title="حذف المنتج"
                            className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-control transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Product Edit Modal */}
      <ProductEditModal
        product={editingProduct}
        categories={categories}
        onClose={() => setEditingProduct(null)}
        onSaved={loadProducts}
      />

      {/* Delivery Methods & Durations Management Modal */}
      <Modal
        isOpen={optionsModalOpen}
        onClose={() => setOptionsModalOpen(false)}
        size="xl"
        title="إدارة طرق التسليم ومدد الاشتراك"
        description="يمكنك إضافة طرق تسليم ومدد جديدة أو تعديل وحذف الخيارات الحالية باللغات الثلاث."
      >
        <CatalogOptionsManager
          onChanged={() => {
            loadProducts();
          }}
        />
      </Modal>

      {/* Quick Edit Variant Price Modal */}
      <Modal
        isOpen={!!editingVariant}
        onClose={() => setEditingVariant(null)}
        title="تعديل سعر الخطة بالدينار التونسي"
        description={`الخطة: ${editingVariant?.slug} (${editingVariant?.duration})`}
      >
        <div className="space-y-4 text-start">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              السعر الجديد بالدينار التونسي (TND)
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={newPrice}
              onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red font-mono"
            />
          </div>

          <p className="text-xs text-muted">
            ملاحظة: سيتم تسجيل عملية تعديل السعر تلقائياً في سجل التدقيق للأمان.
          </p>

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setEditingVariant(null)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={savingPrice}
              onClick={handleSavePrice}
            >
              حفظ السعر الجديد
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

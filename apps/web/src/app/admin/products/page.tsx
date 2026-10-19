'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit2,
  DollarSign,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import {
  fetchAdminProducts,
  updateAdminProduct,
  updateAdminVariantPrice,
  deleteAdminProduct,
} from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit price modal state
  const [editingVariant, setEditingVariant] = useState<any | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [savingPrice, setSavingPrice] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    fetchAdminProducts(1, 50, search)
      .then((res) => {
        setProducts(res.items);
        setTotal(res.total);
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

  const handleTogglePublish = async (product: any) => {
    try {
      await updateAdminProduct(product.id, { isPublished: !product.isPublished });
      loadProducts();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج "${product.slug}"؟`)) return;
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">إدارة المنتجات والأسعار</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            إدارة النشر، تعديل الأسعار بالدينار التونسي، وتحديث حالة التوفر في المتجر.
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <PlusCircle className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="bg-surface p-4 rounded-card border border-line flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالرمز أو المزود (Claude, Canva)..."
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
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-paper/40 transition-colors">
                    {/* Slug & Demo Tag */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-ink">{product.slug}</div>
                      {product.isDemo && (
                        <Badge variant="demo" size="sm" className="mt-1">
                          Demo
                        </Badge>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-muted font-medium">
                      {product.category?.slug || product.categoryId}
                    </td>

                    {/* Provider */}
                    <td className="py-3 px-4 font-medium text-ink">
                      {product.provider}
                    </td>

                    {/* Plan Variants & Price Editor */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v: any) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              setEditingVariant(v);
                              setNewPrice(v.price);
                            }}
                            className="inline-flex items-center gap-1.5 bg-paper hover:bg-tooly-soft-red border border-line hover:border-tooly-red/40 px-2 py-1 rounded-control transition-colors"
                          >
                            <span className="font-mono font-bold text-ink">{v.price} د.ت</span>
                            <span className="text-[10px] text-muted">({v.duration})</span>
                            <Edit2 className="w-3 h-3 text-muted" />
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3 px-4">
                      <button
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
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDelete(product)}
                        title="حذف المنتج"
                        className="p-1.5 text-muted hover:text-danger hover:bg-red-50 rounded-control transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Variant Price Modal */}
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

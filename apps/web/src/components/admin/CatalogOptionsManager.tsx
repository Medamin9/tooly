'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Edit2,
  Plus,
  RefreshCw,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  AdminCatalogOptionItem,
  AdminCatalogOptionKind,
  createAdminCatalogOption,
  deleteAdminCatalogOption,
  fetchAdminCatalogOptions,
  updateAdminCatalogOption,
} from '@/lib/api/admin';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface OptionDraft {
  id?: string;
  kind: AdminCatalogOptionKind;
  code: string;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  sortOrder: number;
}

const EMPTY_DRAFT = (
  kind: AdminCatalogOptionKind,
  nextSortOrder: number,
): OptionDraft => ({
  kind,
  code: '',
  labelAr: '',
  labelFr: '',
  labelEn: '',
  sortOrder: nextSortOrder,
});

export function CatalogOptionsManager({
  compact = false,
  initialKind = 'DELIVERY_METHOD',
  onChanged,
  onClose,
}: {
  compact?: boolean;
  initialKind?: AdminCatalogOptionKind;
  onChanged?: () => void;
  onClose?: () => void;
}) {
  const [activeKind, setActiveKind] =
    useState<AdminCatalogOptionKind>(initialKind);
  const [deliveryMethods, setDeliveryMethods] = useState<
    AdminCatalogOptionItem[]
  >([]);
  const [durations, setDurations] = useState<AdminCatalogOptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [draft, setDraft] = useState<OptionDraft | null>(null);

  useEffect(() => {
    setActiveKind(initialKind);
    setDraft(null);
  }, [initialKind]);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminCatalogOptions();
      setDeliveryMethods(data.deliveryMethods || []);
      setDurations(data.durations || []);
    } catch (err) {
      setError((err as Error).message || 'فشل تحميل الخيارات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const currentItems =
    activeKind === 'DELIVERY_METHOD' ? deliveryMethods : durations;

  const openCreate = () => {
    setError(null);
    setSuccessMsg(null);
    const maxSort = currentItems.reduce(
      (max, item) => Math.max(max, item.sortOrder),
      0,
    );
    setDraft(EMPTY_DRAFT(activeKind, maxSort + 1));
  };

  const openEdit = (item: AdminCatalogOptionItem) => {
    setError(null);
    setSuccessMsg(null);
    setDraft({
      id: item.id,
      kind: item.kind,
      code: item.code,
      labelAr: item.label.ar,
      labelFr: item.label.fr,
      labelEn: item.label.en,
      sortOrder: item.sortOrder,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;

    const cleanCode = draft.code.trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanCode)) {
      setError(
        'الرمز (Code) يجب أن يحتوي فقط على أحرف إنجليزية، أرقام، شرطة (-) أو شرطة سفلية (_).',
      );
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (draft.id) {
        await updateAdminCatalogOption(draft.id, {
          code: cleanCode,
          label: {
            ar: draft.labelAr.trim(),
            fr: draft.labelFr.trim(),
            en: draft.labelEn.trim(),
          },
          sortOrder: Number(draft.sortOrder),
        });
        setSuccessMsg(`تم تحديث الخيار "${cleanCode}" بنجاح.`);
      } else {
        await createAdminCatalogOption({
          kind: draft.kind,
          code: cleanCode,
          label: {
            ar: draft.labelAr.trim(),
            fr: draft.labelFr.trim(),
            en: draft.labelEn.trim(),
          },
          sortOrder: Number(draft.sortOrder),
        });
        setSuccessMsg(`تمت إضافة الخيار "${cleanCode}" بنجاح.`);
      }

      setDraft(null);
      await loadOptions();
      onChanged?.();
    } catch (err) {
      setError((err as Error).message || 'فشل حفظ الخيار');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AdminCatalogOptionItem) => {
    setError(null);
    setSuccessMsg(null);

    if (item.usageCount > 0) {
      setError(
        item.kind === 'DELIVERY_METHOD'
          ? `لا يمكن حذف طريقة التسليم "${item.code}" لأنها مرتبطة حالياً بـ ${item.usageCount} منتج(ات). غيّر طريقة التسليم في المنتجات المرتبطة أولاً.`
          : `لا يمكن حذف المدة "${item.code}" لأنها مرتبطة حالياً بـ ${item.usageCount} باقة(ات). عدّل المدة في الباقات المرتبطة أولاً.`,
      );
      return;
    }

    if (
      !confirm(
        `هل أنت متأكد من حذف "${item.label.ar}" (${item.code})؟ لن تتمكن من استرجاعه إلا بإضافته من جديد.`,
      )
    ) {
      return;
    }

    try {
      await deleteAdminCatalogOption(item.id);
      setSuccessMsg(`تم حذف الخيار "${item.code}" بنجاح.`);
      if (draft?.id === item.id) {
        setDraft(null);
      }
      await loadOptions();
      onChanged?.();
    } catch (err) {
      setError((err as Error).message || 'فشل حذف الخيار');
    }
  };

  return (
    <div
      className={`text-start space-y-4 ${
        compact
          ? 'bg-surface border border-tooly-red/30 rounded-card p-4 shadow-sm'
          : ''
      }`}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveKind('DELIVERY_METHOD');
              setDraft(null);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-bold transition-colors ${
              activeKind === 'DELIVERY_METHOD'
                ? 'bg-tooly-red text-surface shadow-sm'
                : 'bg-paper text-muted hover:text-ink border border-line'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>طرق التفعيل والتسليم ({deliveryMethods.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveKind('DURATION');
              setDraft(null);
              setError(null);
              setSuccessMsg(null);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-control text-xs font-bold transition-colors ${
              activeKind === 'DURATION'
                ? 'bg-tooly-red text-surface shadow-sm'
                : 'bg-paper text-muted hover:text-ink border border-line'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>مدد الاشتراك ({durations.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={openCreate}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {activeKind === 'DELIVERY_METHOD'
                ? 'إضافة طريقة تسليم'
                : 'إضافة مدة جديدة'}
            </span>
          </Button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="إغلاق محرر الخيارات"
              className="p-1.5 rounded-control text-muted hover:text-ink hover:bg-paper border border-line transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-control flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Inline Add / Edit Form */}
      {draft && (
        <form
          onSubmit={handleSave}
          className="p-4 rounded-card bg-paper border border-line space-y-3"
        >
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h4 className="text-xs font-bold text-ink">
              {draft.id
                ? `تعديل الخيار (${draft.code})`
                : draft.kind === 'DELIVERY_METHOD'
                  ? 'إضافة طريقة تفعيل/تسليم جديدة'
                  : 'إضافة مدة اشتراك جديدة'}
            </h4>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="text-xs text-muted hover:text-ink"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-ink mb-1">
                الرمز البرمجي الفريد (Code){' '}
                <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={draft.code}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    code: e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''),
                  })
                }
                placeholder={
                  draft.kind === 'DELIVERY_METHOD'
                    ? 'مثال: D17_INSTANT أو WHATSAPP_ACTIVATION'
                    : 'مثال: 2_weeks أو 2_years'
                }
                className="w-full px-3 py-1.5 bg-surface text-ink text-xs font-mono rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
              {draft.id && (
                <p className="text-[10px] text-muted mt-1">
                  ملاحظة: تغيير الرمز سيُحدّث تلقائياً كافة المنتجات أو الباقات
                  المرتبطة به.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                الترتيب (Sort Order)
              </label>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full px-3 py-1.5 bg-surface text-ink text-xs font-mono rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                التسمية بالعربية (AR) <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                dir="rtl"
                value={draft.labelAr}
                onChange={(e) =>
                  setDraft({ ...draft, labelAr: e.target.value })
                }
                placeholder={
                  draft.kind === 'DELIVERY_METHOD'
                    ? 'مثال: تفعيل فوري عبر D17'
                    : 'مثال: أسبوعان'
                }
                className="w-full px-3 py-1.5 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                التسمية بالفرنسية (FR) <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={draft.labelFr}
                onChange={(e) =>
                  setDraft({ ...draft, labelFr: e.target.value })
                }
                placeholder={
                  draft.kind === 'DELIVERY_METHOD'
                    ? 'Ex: Activation instantanée D17'
                    : 'Ex: 2 semaines'
                }
                className="w-full px-3 py-1.5 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-ink mb-1">
                التسمية بالإنجليزية (EN) <span className="text-tooly-red">*</span>
              </label>
              <input
                type="text"
                required
                dir="ltr"
                value={draft.labelEn}
                onChange={(e) =>
                  setDraft({ ...draft, labelEn: e.target.value })
                }
                placeholder={
                  draft.kind === 'DELIVERY_METHOD'
                    ? 'Ex: Instant D17 activation'
                    : 'Ex: 2 weeks'
                }
                className="w-full px-3 py-1.5 bg-surface text-ink text-xs rounded-control border border-line focus:outline-none focus:border-tooly-red"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setDraft(null)}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={saving}
            >
              {draft.id ? 'حفظ التعديلات' : 'إضافة الخيار'}
            </Button>
          </div>
        </form>
      )}

      {/* Options Table */}
      <div className="bg-surface rounded-card border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-paper border-b border-line text-muted">
              <tr>
                <th className="py-2.5 px-3 font-semibold">الرمز (Code)</th>
                <th className="py-2.5 px-3 font-semibold">العربية (AR)</th>
                <th className="py-2.5 px-3 font-semibold">الفرنسية (FR)</th>
                <th className="py-2.5 px-3 font-semibold">الإنجليزية (EN)</th>
                <th className="py-2.5 px-3 font-semibold">الاستخدام</th>
                <th className="py-2.5 px-3 font-semibold">الترتيب</th>
                <th className="py-2.5 px-3 font-semibold text-center">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-1 text-tooly-red" />
                    <span>جاري تحميل الخيارات...</span>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-muted">
                    لا توجد خيارات حالياً. اضغط على زر الإضافة لإنشاء خيار جديد.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-paper/60 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-ink" dir="ltr">
                      {item.code}
                    </td>
                    <td className="py-2.5 px-3 text-ink">{item.label.ar}</td>
                    <td className="py-2.5 px-3 text-muted" dir="ltr">
                      {item.label.fr}
                    </td>
                    <td className="py-2.5 px-3 text-muted" dir="ltr">
                      {item.label.en}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={item.usageCount > 0 ? 'accent' : 'default'}
                      >
                        {item.usageCount}{' '}
                        {item.kind === 'DELIVERY_METHOD' ? 'منتج' : 'باقة'}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-muted">
                      {item.sortOrder}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          title="تعديل الخيار"
                          className="p-1.5 text-muted hover:text-tooly-red hover:bg-paper rounded-control transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          title={
                            item.usageCount > 0
                              ? 'لا يمكن الحذف لوجود منتجات/باقات مرتبطة'
                              : 'حذف الخيار'
                          }
                          className={`p-1.5 rounded-control transition-colors ${
                            item.usageCount > 0
                              ? 'text-muted/45 hover:text-danger hover:bg-red-50/50'
                              : 'text-muted hover:text-danger hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit,
  RefreshCw,
  Filter,
  Check,
  XCircle,
} from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '@/lib/api/orders';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status transition modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>('PAID');
  const [instructions, setInstructions] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = () => {
    setLoading(true);
    fetchAdminOrders(statusFilter, 1, 50)
      .then((data) => {
        setOrders(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await updateAdminOrderStatus(selectedOrder.id, newStatus, instructions);
      setSelectedOrder(null);
      setInstructions('');
      loadOrders();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Badge variant="warning" size="sm">في انتظار التحويل</Badge>;
      case 'PAID':
        return <Badge variant="success" size="sm">تم استلام المبلغ</Badge>;
      case 'FULFILLMENT_PENDING':
        return <Badge variant="accent" size="sm">قيد التجهيز</Badge>;
      case 'FULFILLED':
        return <Badge variant="success" size="sm">تم التسليم</Badge>;
      case 'CANCELLED':
        return <Badge variant="default" size="sm">ملغي</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">إدارة الطلبات والتسليم</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            متابعة إشعارات الدفع خارج المنصة، تأكيد استلام المبالغ، وتحديث حالات التسليم الفعلي.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders} isLoading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-surface p-3 rounded-card border border-line flex items-center gap-2 overflow-x-auto text-xs">
        <Filter className="w-3.5 h-3.5 text-muted shrink-0 ms-2" />
        {[
          { key: 'ALL', label: 'كافة الطلبات' },
          { key: 'PENDING_PAYMENT', label: 'في انتظار التحويل' },
          { key: 'PAID', label: 'تم الدفع' },
          { key: 'FULFILLMENT_PENDING', label: 'قيد التجهيز' },
          { key: 'FULFILLED', label: 'تم التسليم' },
          { key: 'CANCELLED', label: 'ملغاة' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 rounded-control font-semibold transition-colors shrink-0 ${
              statusFilter === tab.key
                ? 'bg-ink text-surface'
                : 'text-muted hover:text-ink hover:bg-paper'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-surface rounded-card border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-paper border-b border-line text-muted">
              <tr>
                <th className="py-3 px-4 font-semibold">رقم الطلب</th>
                <th className="py-3 px-4 font-semibold">العميل / التواصل</th>
                <th className="py-3 px-4 font-semibold">الخطة المطلوبة</th>
                <th className="py-3 px-4 font-semibold">المبلغ (TND)</th>
                <th className="py-3 px-4 font-semibold">الحالة الحالية</th>
                <th className="py-3 px-4 font-semibold">التاريخ</th>
                <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    جاري تحميل الطلبات...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted">
                    لا توجد طلبات تطابق المرشح المحدد.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-paper/40">
                    <td className="py-3 px-4 font-mono font-bold text-ink">
                      {o.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink">{o.customer?.name || '—'}</div>
                      <div className="text-muted text-[11px]">{o.customer?.email}</div>
                      {o.customer?.phone && (
                        <div className="text-muted text-[10px] font-mono">{o.customer?.phone}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {o.items?.map((it: any) => (
                        <div key={it.id} className="text-ink font-medium">
                          {it.productTitle} ({it.planDuration}) × {it.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-mono font-extrabold text-tooly-red">
                      {o.totalAmount} د.ت
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(o.status)}</td>
                    <td className="py-3 px-4 text-muted whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('fr-TN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setNewStatus(o.status);
                          setInstructions(o.fulfillment?.instructions || '');
                        }}
                        className="p-1.5 rounded-control text-muted hover:text-tooly-red hover:bg-tooly-soft-red transition-colors"
                        title="تحديث حالة الطلب والتسليم"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Transition Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`تحديث حالة الطلب: ${selectedOrder?.orderNumber}`}
        description={`العميل: ${selectedOrder?.customer?.name} (${selectedOrder?.customer?.email})`}
      >
        <div className="space-y-4 text-start">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              الحالة الجديدة للطلب:
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
            >
              <option value="PENDING_PAYMENT">في انتظار إشعار التحويل (PENDING_PAYMENT)</option>
              <option value="PAID">تم استلام الدفعة ومطابقتها (PAID)</option>
              <option value="FULFILLMENT_PENDING">قيد تجهيز الاشتراك (FULFILLMENT_PENDING)</option>
              <option value="FULFILLED">تم تسليم الاشتراك للعميل (FULFILLED)</option>
              <option value="CANCELLED">إلغاء الطلب (CANCELLED)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">
              ملاحظات التسليم أو توجيهات العميل:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="مثال: تم إرسال دعوة مساحة العمل لبريد العميل بنجاح..."
              className="w-full px-3 py-2 bg-paper text-ink text-xs rounded-control border border-line"
            />
          </div>

          <div className="pt-4 border-t border-line flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSelectedOrder(null)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={updating}
              onClick={handleUpdateStatus}
            >
              حفظ الحالة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail,
  Phone,
  User,
  Clock,
  Search,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  Filter,
  MessageSquare,
  ExternalLink,
  X,
  Archive,
  CheckCheck,
  Inbox,
  Send,
} from 'lucide-react';
import { ContactStatus, ContactMessageItem } from '@tooly/contracts';
import {
  getAdminContactsApi,
  updateAdminContactStatusApi,
  deleteAdminContactApi,
} from '@/lib/api/contacts';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Selected message for details modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminContactsApi({
        page,
        limit,
        status: statusFilter,
        search: searchTerm,
      });
      setMessages(data.items);
      setTotal(data.total);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      setError((err as Error).message || 'فشل تحميل رسائل الاتصال');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchTerm]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    setActionLoading(true);
    try {
      const updated = await updateAdminContactStatusApi(id, newStatus);
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated);
      }
      // Re-fetch to update accurate badge counts
      fetchMessages();
    } catch (err) {
      alert((err as Error).message || 'فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذه الرسالة نهائياً؟')) return;
    setActionLoading(true);
    try {
      await deleteAdminContactApi(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (err) {
      alert((err as Error).message || 'فشل حذف الرسالة');
    } finally {
      setActionLoading(false);
    }
  };

  const openMessageModal = (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    // If opening an unread message, mark as read
    if (msg.status === 'UNREAD') {
      handleStatusChange(msg.id, 'READ');
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'UNREAD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>غير مقروءة</span>
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Eye className="w-3 h-3" />
            <span>تم الاطلاع</span>
          </span>
        );
      case 'REPLIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCheck className="w-3 h-3" />
            <span>تم الرد</span>
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <Archive className="w-3 h-3" />
            <span>مؤرشفة</span>
          </span>
        );
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 text-start">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div>
          <h1 className="text-2xl font-black text-ink flex items-center gap-2">
            <Mail className="w-6 h-6 text-tooly-red" />
            <span>رسائل واستفسارات التواصل (Contact Messages)</span>
          </h1>
          <p className="text-xs text-muted mt-1">
            إدارة الرسائل الواردة من صفحة اتصل بنا ومتابعة الردود مع الزبائن والشركات.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMessages()}
          isLoading={loading}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث القائمة</span>
        </Button>
      </div>

      {/* Real Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-surface border border-line flex items-center justify-between">
          <div>
            <span className="text-xs text-muted block">إجمالي الرسائل</span>
            <span className="text-2xl font-black font-mono text-ink mt-1 block">{total}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-muted border border-line">
            <Inbox className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-amber-50/50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-900 font-bold block">رسائل جديدة بانتظار الرد</span>
            <span className="text-2xl font-black font-mono text-amber-700 mt-1 block">
              {unreadCount}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 border border-amber-300">
            <Mail className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-900 font-bold block">معدل التجاوب</span>
            <span className="text-2xl font-black font-mono text-emerald-700 mt-1 block">
              {total > 0 ? Math.round(((total - unreadCount) / total) * 100) : 100}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-300">
            <CheckCheck className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <Card className="p-4 bg-surface border border-line space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {[
              { id: 'ALL', label: 'كافة الرسائل' },
              { id: 'UNREAD', label: `غير مقروءة (${unreadCount})` },
              { id: 'READ', label: 'تم الاطلاع' },
              { id: 'REPLIED', label: 'تم الرد' },
              { id: 'ARCHIVED', label: 'مؤرشفة' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-control font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-tooly-red text-white'
                    : 'bg-paper text-muted hover:text-ink hover:bg-surface border border-line'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-muted absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث بالاسم، الإيميل، الهاتف، أو الموضوع..."
              className="w-full ps-9 pe-3 py-1.5 text-xs bg-paper text-ink rounded-control border border-line focus:outline-none focus:ring-1 focus:ring-tooly-red"
            />
          </div>
        </div>
      </Card>

      {/* Messages Table */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="border border-line overflow-hidden bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-paper border-b border-line text-muted font-bold">
              <tr>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">المرسل (الاسم والتواصل)</th>
                <th className="py-3 px-4">الموضوع وملخص الرسالة</th>
                <th className="py-3 px-4">تاريخ الاستلام</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading && messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <div className="w-6 h-6 border-2 border-tooly-red border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <span>جاري جلب الرسائل...</span>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    <Mail className="w-8 h-8 mx-auto text-muted/40 mb-2" />
                    <span>لا توجد رسائل مطابقة للفلتر المحدد.</span>
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-paper/70 transition-colors ${
                      msg.status === 'UNREAD' ? 'bg-amber-50/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(msg.status)}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-ink">{msg.name}</div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-muted hover:text-tooly-red block text-[11px]"
                      >
                        {msg.email}
                      </a>
                      {msg.phone && (
                        <a
                          href={`tel:${msg.phone}`}
                          className="text-muted hover:text-ink block font-mono text-[10px]"
                        >
                          {msg.phone}
                        </a>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-ink truncate">
                        {msg.subject || 'بدون موضوع'}
                      </div>
                      <p className="text-muted text-[11px] truncate mt-0.5">{msg.message}</p>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-muted text-[11px]">
                      {new Date(msg.createdAt).toLocaleString('fr-TN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openMessageModal(msg)}
                          title="عرض تفاصيل الرسالة"
                          className="p-1.5 rounded-control bg-paper hover:bg-surface border border-line text-ink hover:text-tooly-red transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              msg.id,
                              msg.status === 'REPLIED' ? 'READ' : 'REPLIED',
                            )
                          }
                          title={msg.status === 'REPLIED' ? 'إلغاء وسم الرد' : 'تحديد كـ تم الرد'}
                          className={`p-1.5 rounded-control border transition-colors ${
                            msg.status === 'REPLIED'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-paper border-line text-muted hover:text-emerald-700'
                          }`}
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(msg.id)}
                          title="حذف الرسالة"
                          className="p-1.5 rounded-control bg-paper hover:bg-red-50 border border-line text-muted hover:text-danger transition-colors"
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

        {/* Pagination bar */}
        {total > limit && (
          <div className="p-3 bg-paper border-t border-line flex items-center justify-between text-xs text-muted">
            <span>
              عرض {messages.length} من أصل {total} رسالة
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                السابق
              </Button>
              <span className="font-bold text-ink">صفحة {page}</span>
              <Button
                variant="outline"
                size="sm"
                disabled={page * limit >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-2xl bg-surface border border-line shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-tooly-red" />
                <h3 className="text-base font-bold text-ink">تفاصيل رسالة العميل</h3>
                {getStatusBadge(selectedMessage.status)}
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-control text-muted hover:text-ink hover:bg-paper"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-paper rounded-control border border-line text-xs">
              <div>
                <span className="text-muted block">اسم المرسل:</span>
                <span className="font-bold text-ink">{selectedMessage.name}</span>
              </div>
              <div>
                <span className="text-muted block">البريد الإلكتروني:</span>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-bold text-tooly-red hover:underline"
                >
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <span className="text-muted block">رقم الهاتف / واتساب:</span>
                <span className="font-mono text-ink">
                  {selectedMessage.phone || 'غير مدرج'}
                </span>
              </div>
              <div>
                <span className="text-muted block">تاريخ الإرسال:</span>
                <span className="text-ink">
                  {new Date(selectedMessage.createdAt).toLocaleString('fr-TN')}
                </span>
              </div>
            </div>

            {/* Message Subject and Body */}
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-muted block">الموضوع:</span>
                <h4 className="font-bold text-ink text-sm">
                  {selectedMessage.subject || 'بدون موضوع'}
                </h4>
              </div>
              <div className="text-xs">
                <span className="text-muted block mb-1">نص الرسالة:</span>
                <div className="p-4 bg-paper rounded-control border border-line text-ink whitespace-pre-wrap leading-relaxed select-text text-sm sm:text-xs">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Email Reply */}
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.subject || 'استفسار Tooly.tn'}`,
                  )}`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-tooly-red hover:bg-tooly-red-dark text-white rounded-control text-xs font-bold transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>رد عبر البريد</span>
                </a>

                {/* WhatsApp Reply if phone available */}
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-control text-xs font-bold transition-all shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>واتساب</span>
                  </a>
                )}
              </div>

              {/* Status Switchers */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange(selectedMessage.id, 'REPLIED')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-control border border-line bg-paper hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                >
                  وسم كـ تم الرد
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleStatusChange(selectedMessage.id, 'ARCHIVED')}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-control border border-line bg-paper hover:bg-gray-100 text-muted transition-colors"
                >
                  أرشفة
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="p-1.5 text-xs font-semibold rounded-control border border-line bg-paper hover:bg-red-50 text-danger transition-colors"
                  title="حذف الرسالة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

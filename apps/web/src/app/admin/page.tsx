'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  CheckCircle2,
  Layers,
  Users,
  TrendingUp,
  History,
  PlusCircle,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { fetchAdminOverview } from '@/lib/api/admin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-tooly-red border-t-transparent animate-spin mb-3" />
        <span className="text-xs text-muted">جاري تحميل المؤشرات الحقيقية...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-card text-danger text-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  const { metrics, recentAuditLogs } = data;

  return (
    <div className="space-y-8 text-start">
      {/* Page Title & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">لوحة التحكم المركزية</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            مؤشرات قاعدة البيانات الحقيقية وسجل الأنشطة الحساسة لمتجر Tooly.tn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </Button>
          </Link>
          <Link href="/ar" target="_blank">
            <Button variant="outline" size="sm">
              <span>عرض المتجر</span>
              <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Real Database Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">إجمالي المنتجات</span>
            <div className="w-8 h-8 rounded-control bg-tooly-soft-red text-tooly-red flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink mb-1">{metrics.totalProducts}</div>
          <div className="text-[11px] text-muted flex items-center gap-1">
            <span className="text-emerald-700 font-semibold">{metrics.publishedProducts} معروض</span>
            <span>•</span>
            <span>{metrics.draftProducts} مسودة</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">خطط الاشتراكات النشطة</span>
            <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink mb-1">{metrics.totalVariants}</div>
          <div className="text-[11px] text-muted">
            مسعرة بالدينار التونسي (TND)
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">التصنيفات المعتمدة</span>
            <div className="w-8 h-8 rounded-control bg-sky-50 text-sky-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink mb-1">{metrics.totalCategories}</div>
          <div className="text-[11px] text-muted">
            ذكاء اصطناعي، تصميم، فيديو، برمجة
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">المستخدمين المسجلين</span>
            <div className="w-8 h-8 rounded-control bg-amber-50 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink mb-1">{metrics.totalUsers}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">
            حسابات مصادق عليها
          </div>
        </Card>
      </div>

      {/* Recent Audit Trail Table */}
      <div className="bg-surface rounded-card border border-line p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-tooly-red" />
            <h3 className="text-lg font-bold text-ink">سجل التدقيق والعمليات الأخيرة</h3>
          </div>
          <Link href="/admin/audit" className="text-xs font-semibold text-tooly-red hover:underline">
            عرض كافة السجلات
          </Link>
        </div>

        {recentAuditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="pb-3 font-semibold">العملية</th>
                  <th className="pb-3 font-semibold">الهدف / المورد</th>
                  <th className="pb-3 font-semibold">المستخدم المسؤول</th>
                  <th className="pb-3 font-semibold">التاريخ والتوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentAuditLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-paper/50">
                    <td className="py-3">
                      <span className="font-mono font-bold text-ink bg-paper px-2 py-0.5 rounded border border-line">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-muted font-mono">{log.resource}</td>
                    <td className="py-3 font-medium text-ink">
                      {log.user?.email || 'النظام'}
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(log.createdAt).toLocaleString('fr-TN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-muted py-6 text-center">لا توجد عمليات مسجلة حديثاً في سجل التدقيق.</p>
        )}
      </div>
    </div>
  );
}

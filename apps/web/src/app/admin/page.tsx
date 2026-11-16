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
  Eye,
  Activity,
  BarChart3,
  Globe,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { fetchAdminOverview } from '@/lib/api/admin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    fetchAdminOverview()
      .then((res) => {
        setData(res);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadData();
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
  const maxDailyCount = Math.max(
    1,
    ...(metrics.dailyTrend?.map((d: any) => d.count) || [1]),
  );

  return (
    <div className="space-y-8 text-start">
      {/* Page Title & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">لوحة التحكم المركزية</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            مؤشرات الزيارات، المبيعات وقاعدة البيانات الحقيقية لمتجر Tooly.tn.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(true)}
            isLoading={refreshing}
            className="gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث</span>
          </Button>
          <Link href="/admin/products">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Package className="w-4 h-4" />
              <span>إدارة المنتجات والباقات</span>
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="gap-1.5">
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

      {/* 1-Click Translation & Catalog Helper Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gradient-to-r from-tooly-red/5 via-tooly-soft-red/25 to-amber-50/70 rounded-card border border-tooly-red/20 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-control bg-tooly-red text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-ink flex items-center gap-2">
              <span>ميزة الترجمة الآلية الفورية للباقات والمنتجات (3 لغات)</span>
              <span className="text-[10px] bg-white text-tooly-red font-bold px-2 py-0.2 rounded-full border border-tooly-red/20">
                مفعّلة الآن
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              يمكنك كتابة ميزات وقيود الباقة بالعربية وتوليد ترجمتها الفرنسية والإنجليزية بنقرة واحدة داخل نافذة تعديل أي منتج.
            </p>
          </div>
        </div>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 border-tooly-red/30 text-tooly-red hover:bg-tooly-soft-red/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>فتح قائمة المنتجات لتعديل الباقات</span>
          </Button>
        </Link>
      </div>

      {/* Real Database Metric Cards (with Website Visits as Spotlight) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Website Visits (Spotlight Card) */}
        <Card className="p-5 border-tooly-red/30 bg-gradient-to-br from-surface via-surface to-tooly-soft-red/20 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">زيارات الموقع</span>
            <div className="w-8 h-8 rounded-control bg-tooly-red text-white flex items-center justify-center shadow-sm">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink mb-1 font-mono">
            {metrics.totalVisits?.toLocaleString('fr-TN') ?? 0}
          </div>
          <div className="text-[11px] text-muted flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>+{metrics.todayVisits ?? 0} اليوم</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-ink">{metrics.uniqueVisitors ?? 0} زائر فريد</span>
          </div>
        </Card>

        {/* 2. Total Products */}
        <Link href="/admin/products" className="block transition-transform hover:-translate-y-0.5">
          <Card className="p-5 h-full hover:border-tooly-red/40 transition-colors">
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
        </Link>

        {/* 3. Active Plan Variants */}
        <Link href="/admin/products" className="block transition-transform hover:-translate-y-0.5">
          <Card className="p-5 h-full hover:border-tooly-red/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted uppercase">خطط الاشتراكات</span>
              <div className="w-8 h-8 rounded-control bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-ink mb-1">{metrics.totalVariants}</div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center justify-between">
              <span>إدارة وتعديل الباقات</span>
              <span className="text-xs">←</span>
            </div>
          </Card>
        </Link>

        {/* 4. Categories */}
        <Link href="/admin/categories" className="block transition-transform hover:-translate-y-0.5">
          <Card className="p-5 h-full hover:border-tooly-red/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted uppercase">التصنيفات المعتمدة</span>
              <div className="w-8 h-8 rounded-control bg-sky-50 text-sky-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-ink mb-1">{metrics.totalCategories}</div>
            <div className="text-[11px] text-sky-700 font-semibold flex items-center justify-between">
              <span>إدارة التصنيفات واللغات</span>
              <span className="text-xs">←</span>
            </div>
          </Card>
        </Link>

        {/* 5. Registered Users */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-muted uppercase">المستخدمين</span>
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

      {/* Website Traffic & Visits Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Visits Chart (Past 7 Days) */}
        <div className="lg:col-span-7 bg-surface rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-tooly-red" />
              <h3 className="text-base font-bold text-ink">حركة الزيارات اليومية (آخر 7 أيام)</h3>
            </div>
            <span className="text-xs font-bold text-muted bg-paper px-2.5 py-1 rounded border border-line">
              {metrics.weeklyVisits ?? 0} زيارة هذا الأسبوع
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-line/60">
              {metrics.dailyTrend && metrics.dailyTrend.length > 0 ? (
                metrics.dailyTrend.map((day: any, idx: number) => {
                  const heightPercent = Math.max(
                    8,
                    Math.round((day.count / maxDailyCount) * 100),
                  );
                  const isToday = idx === metrics.dailyTrend.length - 1;

                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                    >
                      {/* Hover Tooltip / Value */}
                      <span className="text-[10px] font-mono font-bold text-ink opacity-80 group-hover:opacity-100 transition-opacity">
                        {day.count}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full max-w-[42px] bg-paper rounded-t-md overflow-hidden flex items-end h-full">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 group-hover:brightness-110 ${
                            isToday
                              ? 'bg-tooly-red shadow-[0_0_12px_rgba(245,47,61,0.35)]'
                              : 'bg-ink/75 hover:bg-ink'
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <span
                        className={`text-[10px] sm:text-xs truncate max-w-full text-center ${
                          isToday ? 'font-bold text-tooly-red' : 'text-muted'
                        }`}
                      >
                        {day.label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted">
                  لا توجد بيانات زيارات مسجلة للأيام السابقة.
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px] text-muted">
              <span>تحديث دوري ومباشر عند تصفح الزوار</span>
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-tooly-red" />
                  <span>اليوم</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-ink/75" />
                  <span>الأيام السابقة</span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Top Visited Pages */}
        <div className="lg:col-span-5 bg-surface rounded-card border border-line p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-line">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-tooly-red" />
              <h3 className="text-base font-bold text-ink">الصفحات الأكثر زيارة</h3>
            </div>
            <span className="text-xs text-muted font-medium">أعلى 5 مسارات</span>
          </div>

          {metrics.topPages && metrics.topPages.length > 0 ? (
            <div className="space-y-3 pt-1">
              {metrics.topPages.map((page: any, idx: number) => {
                const percent =
                  metrics.totalVisits > 0
                    ? Math.round((page.count / metrics.totalVisits) * 100)
                    : 0;

                return (
                  <div key={page.path} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate max-w-[75%]">
                        <span className="w-4 h-4 rounded-full bg-paper border border-line text-[10px] font-bold text-muted flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-ink truncate font-medium dir-ltr text-start">
                          {page.path}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-ink shrink-0">
                        {page.count} <span className="text-muted font-sans font-normal text-[10px]">({percent}%)</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-paper rounded-full overflow-hidden border border-line/40">
                      <div
                        style={{ width: `${Math.max(4, percent)}%` }}
                        className="h-full bg-tooly-red rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-muted">
              لا توجد بيانات صفحات بعد. الزيارات المستقبلية ستظهر هنا فور تسجيلها.
            </div>
          )}
        </div>
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

        {recentAuditLogs && recentAuditLogs.length > 0 ? (
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

'use client';

import React, { useEffect, useState } from 'react';
import { History, ShieldAlert, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchAdminAuditLogs } from '@/lib/api/admin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = () => {
    setLoading(true);
    fetchAdminAuditLogs(100)
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">سجل التدقيق والأمان</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            سجل غير قابل للتعديل يوثق جميع العمليات الإدارية الحساسة وتعديلات الأسعار والوصول.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs} isLoading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث السجل</span>
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-danger text-xs rounded-control flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-surface rounded-card border border-line overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-paper border-b border-line text-muted">
              <tr>
                <th className="py-3 px-4 font-semibold">التاريخ والتوقيت</th>
                <th className="py-3 px-4 font-semibold">العملية الإدارية</th>
                <th className="py-3 px-4 font-semibold">المورد / الهدف</th>
                <th className="py-3 px-4 font-semibold">المسؤول</th>
                <th className="py-3 px-4 font-semibold">تفاصيل البيانات الحساسة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    جاري تحميل سجل التدقيق...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    لا توجد سجلات تدقيق حتى الآن.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-paper/40">
                    <td className="py-3 px-4 text-muted whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('fr-TN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-ink bg-paper px-2 py-0.5 rounded border border-line">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted">{log.resource}</td>
                    <td className="py-3 px-4 font-medium text-ink">
                      {log.user?.email || 'النظام'}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted max-w-xs truncate">
                      {log.payload ? JSON.stringify(log.payload) : '—'}
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

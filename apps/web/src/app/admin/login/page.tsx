'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { loginApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      if (data.user.role !== 'ADMIN') {
        throw new Error('غير مصرح لك بالوصول. يتطلب حساب مدير (ADMIN).');
      }
      router.push('/admin');
    } catch (err) {
      setError((err as Error).message || 'حدث خطأ أثناء تسجيل الدخول.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-paper">
      <div className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-card border border-line shadow-xl text-start">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative h-12 w-40 mb-3">
            <Image
              src="/brand/tooly-logo.png"
              alt="Tooly Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xs font-bold text-ink bg-paper px-3 py-1 rounded-full border border-line">
            بوابة الإدارة المركزية
          </span>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-control bg-red-50 border border-red-200 text-xs text-danger flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">البريد الإلكتروني للمدير</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tooly.tn"
                className="w-full ps-10 pe-4 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red focus:ring-1 focus:ring-tooly-red transition-colors text-start"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1.5">كلمة المرور السرية</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full ps-10 pe-4 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red focus:ring-1 focus:ring-tooly-red transition-colors text-start"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            className="w-full mt-4"
          >
            <span>تسجيل الدخول للإدارة</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-line flex items-center justify-center gap-2 text-xs text-muted text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>محمي بواسطة JWT وسجل تدقيق للعمليات الحساسة</span>
        </div>
      </div>
    </div>
  );
}

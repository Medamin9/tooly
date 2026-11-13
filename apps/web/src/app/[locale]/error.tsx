'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error securely on client side for diagnostic purposes
    console.error('App Router segment error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md mx-auto text-center bg-paper p-8 rounded-card border border-line shadow-card space-y-6">
        <div className="w-14 h-14 rounded-full bg-tooly-soft-red/80 border border-tooly-red/20 flex items-center justify-center mx-auto text-tooly-red">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-tooly-red uppercase tracking-wider">
            حدث خطأ غير متوقع / Une erreur est survenue
          </span>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            نعتذر، حدث خلل أثناء تحميل الصفحة
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            حدث خطأ مؤقت في النظام. يمكنك المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.
          </p>
        </div>

        {error.digest && (
          <p className="text-[11px] font-mono text-muted/70 bg-surface py-1.5 px-3 rounded-control border border-line select-all">
            Digest: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => reset()}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 rtl:rotate-180" />
            <span>إعادة المحاولة / Réessayer</span>
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              <Home className="w-4 h-4" />
              <span>الرئيسية / Accueil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}


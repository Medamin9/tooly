'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error caught:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAF8] text-[#121217] font-sans antialiased">
        <div className="w-full max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-black/10 shadow-lg space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-[#F52F3D]">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#121217]">
              حدث خطأ غير متوقع في النظام
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              نعتذر عن هذا الخلل. يمكنك إعادة تحميل الصفحة للعودة إلى منصة Tooly.tn.
            </p>
          </div>

          {error.digest && (
            <p className="text-[11px] font-mono text-gray-500 bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-200 select-all">
              Digest: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F52F3D] text-white font-medium hover:bg-[#D92230] transition-colors shadow-sm"
            >
              إعادة المحاولة
            </button>
            <a
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-300 text-[#121217] font-medium hover:bg-gray-50 transition-colors"
            >
              الرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}


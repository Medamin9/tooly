import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { NotFoundView } from '@/components/layout/NotFoundView';

export const metadata: Metadata = {
  title: '404 — الصفحة غير موجودة | Page introuvable | Tooly.tn',
  description: 'الصفحة التي تبحث عنها غير موجودة على منصة Tooly.tn.',
};

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Minimal Top Brand Bar */}
      <header className="w-full border-b border-line bg-surface/70 backdrop-blur-md py-3 px-4 sm:px-8 flex items-center justify-between">
        <Link href="/ar" className="inline-flex items-center gap-2">
          <div className="relative h-10 w-24">
            <Image
              src="/images/toolyLogo.svg"
              alt="Tooly.tn"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <Link
            href="/ar/catalog"
            className="text-muted hover:text-ink transition-colors"
          >
            الكتالوج
          </Link>
          <span>•</span>
          <Link
            href="/fr/catalog"
            className="text-muted hover:text-ink transition-colors"
          >
            Catalogue
          </Link>
        </div>
      </header>

      {/* Main 404 Mascot View */}
      <main className="flex-1 flex items-center justify-center">
        <NotFoundView />
      </main>

      {/* Minimal Bottom Bar */}
      <footer className="w-full border-t border-line py-4 px-4 text-center text-xs text-muted">
        <span>© {new Date().getFullYear()} Tooly.tn — سوق الاشتراكات الرقمية في تونس</span>
      </footer>
    </div>
  );
}

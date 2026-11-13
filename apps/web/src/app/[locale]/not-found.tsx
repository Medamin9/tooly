import React from 'react';
import type { Metadata } from 'next';
import { NotFoundView } from '@/components/layout/NotFoundView';

export const metadata: Metadata = {
  title: '404 — الصفحة غير موجودة | Page introuvable | Tooly.tn',
  description: 'الصفحة التي تبحث عنها غير موجودة على منصة Tooly.tn.',
};

export default function LocaleNotFound() {
  return <NotFoundView />;
}


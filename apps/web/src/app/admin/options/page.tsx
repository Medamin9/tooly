'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CatalogOptionsManager } from '@/components/admin/CatalogOptionsManager';
import { Button } from '@/components/ui/Button';

export default function AdminOptionsPage() {
  return (
    <div className="space-y-6 text-start">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">
            المدد وطرق التفعيل والتسليم
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            تحكم كامل في خيارات التسليم ومدد الاشتراكات الافتراضية والمخصصة باللغات الثلاث (العربية والفرنسية والإنجليزية).
          </p>
        </div>

        <Link href="/admin/products">
          <Button variant="secondary" size="sm">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            <span>العودة إلى المنتجات</span>
          </Button>
        </Link>
      </div>

      <div className="bg-surface rounded-card border border-line p-4 sm:p-6 shadow-sm">
        <CatalogOptionsManager />
      </div>
    </div>
  );
}


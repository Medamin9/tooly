'use client';

import React, { useState, useMemo, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Search, Filter, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import { DEMO_PLANS, DemoPlan } from '@/lib/catalog/data';
import { PlanCard } from '@/components/catalog/PlanCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';

export default function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;

  if (!SUPPORTED_LOCALES.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const dict = dictionaries[typedLocale];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const filteredPlans = useMemo(() => {
    return DEMO_PLANS.filter((plan) => {
      // Search filter
      const matchesSearch =
        searchQuery.trim() === '' ||
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.tagline[typedLocale].toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || plan.category === selectedCategory;

      // Duration filter
      const matchesDuration =
        selectedDuration === 'all' || plan.duration === selectedDuration;

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [searchQuery, selectedCategory, selectedDuration, typedLocale]);

  const categories = [
    { key: 'all', label: dict.common.allCategories },
    { key: 'ai', label: dict.categories.ai.name },
    { key: 'design', label: dict.categories.design.name },
    { key: 'video', label: dict.categories.video.name },
    { key: 'productivity', label: dict.categories.productivity.name },
    { key: 'developer', label: dict.categories.developer.name },
  ];

  const durations = [
    { key: 'all', label: dict.catalogPage.allDurations },
    { key: '1_month', label: '1 شهر' },
    { key: '3_months', label: '3 أشهر' },
    { key: '1_year', label: '1 سنة' },
  ];

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDuration('all');
  };

  return (
    <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="mb-10 text-start">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/${typedLocale}`}
            className="text-xs text-muted hover:text-ink flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{dict.common.back}</span>
          </Link>
          <span className="text-line">/</span>
          <span className="text-xs font-semibold text-tooly-red">{dict.nav.catalog}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-2">
              {dict.catalogPage.title}
            </h1>
            <p className="text-sm text-muted">{dict.catalogPage.subtitle}</p>
          </div>
          <Badge variant="demo" size="md">
            {dict.common.demoBadge}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface p-4 sm:p-6 rounded-card border border-line mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-muted absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={dict.common.searchPlaceholder}
              className="w-full ps-10 pe-4 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red focus:ring-1 focus:ring-tooly-red transition-colors text-start"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors text-start"
            >
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-paper text-ink text-sm rounded-control border border-line focus:outline-none focus:border-tooly-red transition-colors text-start"
            >
              {durations.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills for quick access */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-muted font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>تصفية سريعة:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1 rounded-full border transition-colors shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-ink text-surface border-ink font-semibold'
                  : 'bg-paper text-muted border-line hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-muted font-medium">
        <span>
          عرض <strong className="text-ink">{filteredPlans.length}</strong> {dict.catalogPage.foundCount}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedDuration !== 'all') && (
          <button
            onClick={resetFilters}
            className="text-tooly-red hover:underline font-semibold"
          >
            إعادة تعيين المرشحات
          </button>
        )}
      </div>

      {/* Product Plans Grid or Empty State */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} locale={typedLocale} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={dict.common.noResults}
          description="جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً لعرض الأدوات المتاحة."
          actionText="إعادة تعيين المرشحات"
          onAction={resetFilters}
        />
      )}
    </main>
  );
}

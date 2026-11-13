'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, ArrowLeft, X } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { dictionaries } from '@/lib/i18n/dictionaries';
import type { ApiCatalogOption, ApiCategory } from '@/lib/api/catalog';
import type { StorefrontPlan } from '@/lib/catalog/mappers';
import { PlanCard } from '@/components/catalog/PlanCard';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';

export function CatalogClient({
  locale,
  plans,
  categories: apiCategories,
  durations: apiDurations = [],
}: {
  locale: Locale;
  plans: StorefrontPlan[];
  categories: ApiCategory[];
  durations?: ApiCatalogOption[];
}) {
  const dict = dictionaries[locale];
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

  const filteredPlans = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return plans.filter((plan) => {
      const matchesSearch =
        query === '' ||
        plan.name.toLowerCase().includes(query) ||
        plan.provider.toLowerCase().includes(query) ||
        plan.tagline[locale].toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'all' || plan.category === selectedCategory;

      const matchesDuration =
        selectedDuration === 'all' ||
        plan.duration === selectedDuration ||
        plan.variants.some((v) => v.duration === selectedDuration && v.isAvailable);

      return matchesSearch && matchesCategory && matchesDuration;
    });
  }, [plans, searchQuery, selectedCategory, selectedDuration, locale]);

  const categoryOptions = useMemo(() => {
    const mapped = apiCategories.map((cat) => ({
      key: cat.slug,
      label: cat.name || cat.slug,
    }));
    return [{ key: 'all', label: dict.common.allCategories }, ...mapped];
  }, [apiCategories, dict.common.allCategories]);

  const durations = useMemo(() => {
    const mapped =
      apiDurations.length > 0
        ? apiDurations.map((opt) => ({
            key: opt.code,
            label: opt.labels?.[locale] || opt.label || opt.code,
          }))
        : [
            { key: '1_month', label: dict.catalogPage.oneMonth },
            { key: '3_months', label: dict.catalogPage.threeMonths },
            {
              key: '6_months',
              label: locale === 'ar' ? '6 أشهر' : locale === 'fr' ? '6 mois' : '6 months',
            },
            { key: '1_year', label: dict.catalogPage.oneYear },
          ];
    return [{ key: 'all', label: dict.catalogPage.allDurations }, ...mapped];
  }, [apiDurations, dict.catalogPage, locale]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDuration('all');
  };

  const hasDemoPlans = plans.some((p) => p.isDemo);

  return (
    <main className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Page Header */}
      <div className="mb-10 text-start">
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/${locale}`}
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
          {hasDemoPlans && (
            <Badge variant="demo" size="md">
              {dict.common.demoBadge}
            </Badge>
          )}
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
                type="button"
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
              {categoryOptions.map((c) => (
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
            <span>{dict.catalogPage.quickFilter}</span>
          </span>
          {categoryOptions.map((cat) => (
            <button
              key={cat.key}
              type="button"
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
          {dict.catalogPage.showing}{' '}
          <strong className="text-ink">{filteredPlans.length}</strong>{' '}
          {dict.catalogPage.foundCount}
        </span>
        {(searchQuery || selectedCategory !== 'all' || selectedDuration !== 'all') && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-tooly-red hover:underline font-semibold"
          >
            {dict.catalogPage.resetFilters}
          </button>
        )}
      </div>

      {/* Product Plans Grid or Empty State: 2 columns on mobile, scaling up to 4 on xl desktop */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 items-stretch">
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.productId || plan.id} plan={plan} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={dict.common.noResults}
          description={dict.catalogPage.emptySearchDesc}
          actionText={dict.catalogPage.resetFilters}
          onAction={resetFilters}
        />
      )}
    </main>
  );
}


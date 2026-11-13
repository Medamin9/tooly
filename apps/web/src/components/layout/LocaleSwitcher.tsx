'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';

export interface LocaleSwitcherProps {
  currentLocale: Locale;
  variant?: 'header' | 'mobile';
  className?: string;
}

const LOCALES_DATA: Record<
  Locale,
  { label: string; subLabel: string; code: string; dir: 'rtl' | 'ltr' }
> = {
  ar: { label: 'العربية', subLabel: 'تونسي / عربي', code: 'AR', dir: 'rtl' },
  fr: { label: 'Français', subLabel: 'Tunisie / FR', code: 'FR', dir: 'ltr' },
  en: { label: 'English', subLabel: 'International', code: 'EN', dir: 'ltr' },
};

const UI_STRINGS = {
  ar: {
    title: 'اللغة',
    select: 'اختر اللغة',
    ariaLabel: 'تغيير لغة الموقع',
  },
  fr: {
    title: 'Langue',
    select: 'Choisir la langue',
    ariaLabel: 'Changer la langue du site',
  },
  en: {
    title: 'Language',
    select: 'Select language',
    ariaLabel: 'Change site language',
  },
};

export function LocaleSwitcher({
  currentLocale,
  variant = 'header',
  className = '',
}: LocaleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const strings = UI_STRINGS[currentLocale] || UI_STRINGS.ar;

  // Handle switching to a new locale while preserving pathname
  const handleSwitch = (newLocale: Locale) => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;

    const segments = pathname.split('/');
    if (segments[1] && SUPPORTED_LOCALES.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Mobile Drawer presentation
  if (variant === 'mobile') {
    return (
      <div
        ref={containerRef}
        className={`relative flex flex-col p-3 rounded-control border border-line bg-paper text-ink transition-colors ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-tooly-red shrink-0 shadow-2xs">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-start">
              <span className="leading-tight text-ink">{strings.title}</span>
              <span className="text-[11px] text-muted font-normal">
                {LOCALES_DATA[currentLocale]?.label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={strings.ariaLabel}
            className={`px-3 py-1.5 rounded-control border border-line bg-surface hover:bg-paper text-xs font-semibold text-ink flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
              isOpen ? 'border-tooly-red/40 bg-tooly-soft-red/40 text-tooly-red' : ''
            }`}
          >
            <span className="text-[11px] font-mono font-bold text-tooly-red">
              {LOCALES_DATA[currentLocale]?.code}
            </span>
            <span className="text-muted text-[10px]">▼</span>
          </button>
        </div>

        {isOpen && (
          <div
            role="listbox"
            aria-label={strings.title}
            className="mt-3 pt-3 border-t border-line space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {SUPPORTED_LOCALES.map((loc) => {
              const isSelected = loc === currentLocale;
              const data = LOCALES_DATA[loc];
              return (
                <button
                  key={loc}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSwitch(loc)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'bg-tooly-soft-red text-tooly-red font-bold'
                      : 'text-ink hover:bg-surface'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-line text-muted">
                      {data.code}
                    </span>
                    <span>{data.label}</span>
                    <span className="text-[10px] text-muted font-normal">
                      ({data.subLabel})
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-tooly-red shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Header Dropdown: only show the global icon, and when clicked show dropdown list
  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={strings.ariaLabel}
        title={strings.ariaLabel}
        className={`px-2.5 py-1.5 rounded-control border border-line bg-paper hover:bg-surface text-muted hover:text-ink transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red active:scale-95 group shadow-2xs select-none ${
          isOpen
            ? 'border-tooly-red/40 bg-surface text-ink ring-2 ring-tooly-red/20'
            : ''
        }`}
      >
        <Globe
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'text-tooly-red scale-110' : 'group-hover:text-ink'
          }`}
        />
      </button>

      {/* Languages Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={strings.title}
          className="absolute top-full mt-2 end-0 w-44 rounded-xl border border-line bg-paper/95 backdrop-blur-md p-1.5 shadow-card z-50 animate-in fade-in zoom-in-95 duration-150 text-start"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted border-b border-line/60 mb-1">
            {strings.select}
          </div>
          {SUPPORTED_LOCALES.map((loc) => {
            const isSelected = loc === currentLocale;
            const data = LOCALES_DATA[loc];
            return (
              <button
                key={loc}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSwitch(loc)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-tooly-soft-red text-tooly-red font-bold'
                    : 'text-ink hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-surface border border-line/50 text-muted">
                    {data.code}
                  </span>
                  <span>{data.label}</span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-tooly-red shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LocaleSwitcher;

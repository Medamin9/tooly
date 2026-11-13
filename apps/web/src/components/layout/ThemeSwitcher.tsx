'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Locale } from '@tooly/contracts';
import { useTheme } from '../theme/ThemeProvider';

export interface ThemeSwitcherProps {
  locale: Locale;
  variant?: 'header' | 'mobile';
  className?: string;
}

const THEME_LABELS = {
  ar: {
    toggleToDark: 'التحويل إلى الوضع الليلي',
    toggleToLight: 'التحويل إلى الوضع النهاري',
    dark: 'الوضع الليلي',
    light: 'الوضع النهاري',
    themeTitle: 'المظهر',
  },
  fr: {
    toggleToDark: 'Passer au mode sombre',
    toggleToLight: 'Passer au mode clair',
    dark: 'Mode sombre',
    light: 'Mode clair',
    themeTitle: 'Thème',
  },
  en: {
    toggleToDark: 'Switch to dark mode',
    toggleToLight: 'Switch to light mode',
    dark: 'Dark mode',
    light: 'Light mode',
    themeTitle: 'Theme',
  },
};

export function ThemeSwitcher({
  locale,
  variant = 'header',
  className = '',
}: ThemeSwitcherProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const labels = THEME_LABELS[locale] || THEME_LABELS.ar;
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  if (variant === 'mobile') {
    return (
      <div
        className={`flex items-center justify-between p-3 rounded-control border border-line bg-paper text-ink transition-colors ${className}`}
      >
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="w-8 h-8 rounded-lg bg-surface border border-line flex items-center justify-center text-tooly-red shrink-0 shadow-2xs">
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div className="flex flex-col text-start">
            <span className="leading-tight text-ink">{labels.themeTitle}</span>
            <span className="text-[11px] text-muted font-normal">
              {isDark ? labels.dark : labels.light}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? labels.toggleToLight : labels.toggleToDark}
          className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-line bg-surface p-0.5 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red"
        >
          <span
            className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-tooly-red text-white shadow-sm transition-transform duration-200 ease-in-out ${
              isDark ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
            }`}
          >
            {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? labels.toggleToLight : labels.toggleToDark}
      title={isDark ? labels.toggleToLight : labels.toggleToDark}
      className={`px-2.5 py-1.5 rounded-control border border-line bg-paper hover:bg-surface text-muted hover:text-ink transition-all flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red active:scale-95 group shadow-2xs select-none ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        <Sun
          className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 transform ${
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`w-4 h-4 text-ink absolute transition-all duration-300 transform ${
            isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
      <span className="hidden xl:inline-block text-xs font-semibold text-ink">
        {isDark ? labels.dark : labels.light}
      </span>
    </button>
  );
}


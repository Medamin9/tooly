'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Locale, SUPPORTED_LOCALES } from '@tooly/contracts';

const LOCALE_LABELS: Record<Locale, string> = {
  ar: 'العربية',
  fr: 'Français',
  en: 'English',
};

export function LocaleSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    // Replace current locale segment in pathname: e.g. /ar/catalog -> /fr/catalog
    const segments = pathname.split('/');
    if (segments[1] && SUPPORTED_LOCALES.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-paper px-2.5 py-1 rounded-control border border-line text-xs font-medium">
      <Globe className="w-3.5 h-3.5 text-muted shrink-0" />
      {SUPPORTED_LOCALES.map((loc, idx) => (
        <React.Fragment key={loc}>
          {idx > 0 && <span className="text-line select-none">|</span>}
          <button
            onClick={() => handleSwitch(loc)}
            className={`px-1.5 py-0.5 rounded transition-colors ${
              loc === currentLocale
                ? 'font-bold text-tooly-red bg-tooly-soft-red'
                : 'text-muted hover:text-ink'
            }`}
          >
            {LOCALE_LABELS[loc]}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

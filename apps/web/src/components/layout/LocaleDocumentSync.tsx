'use client';

import { useEffect } from 'react';
import { Locale } from '@tooly/contracts';

/**
 * Keeps root <html lang dir> synchronized across client-side locale transitions
 * so Tailwind rtl:/ltr: variants and CSS [dir] selectors always match the active locale.
 */
export function LocaleDocumentSync({
  locale,
  direction,
}: {
  locale: Locale;
  direction: 'rtl' | 'ltr';
}) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return null;
}

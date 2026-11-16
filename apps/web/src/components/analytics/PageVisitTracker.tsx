'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Get or create an anonymous, persistent visitor ID for unique visitor metrics
 */
function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const STORAGE_KEY = 'tooly_vid';
  let vid = localStorage.getItem(STORAGE_KEY);
  if (!vid) {
    vid = 'vid_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    try {
      localStorage.setItem(STORAGE_KEY, vid);
    } catch {
      // Ignore if localStorage is blocked
    }
  }
  return vid;
}

export function PageVisitTracker({ locale }: { locale?: string }) {
  const pathname = usePathname();
  const lastRecordedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Do not record internal administration pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    // Avoid recording same path twice consecutively on rerenders
    if (lastRecordedPath.current === pathname) {
      return;
    }

    lastRecordedPath.current = pathname;

    const visitorId = getVisitorId();
    const referrer = typeof document !== 'undefined' ? document.referrer : '';

    const payload = JSON.stringify({
      path: pathname,
      locale: locale || 'ar',
      visitorId,
      referrer: referrer ? referrer.substring(0, 1000) : undefined,
    });

    const endpoint = `${API_BASE}/analytics/visit`;

    // Prefer navigator.sendBeacon for fast, non-blocking delivery
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      const sent = navigator.sendBeacon(endpoint, blob);
      if (!sent) {
        // Fallback to fetch if sendBeacon fails or queue is full
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, locale]);

  return null;
}


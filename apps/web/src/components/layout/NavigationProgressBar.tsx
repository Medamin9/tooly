'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function startNavigationProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tooly:nav:start'));
  }
}

export function completeNavigationProgress() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('tooly:nav:complete'));
  }
}

function NavigationProgressBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUrlRef = useRef<string>('');

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  };

  const startProgress = () => {
    clearAllTimers();
    setVisible(true);
    setActive(true);
    setProgress(18);

    // Smooth staggered crawl forward
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + Math.random() * 15 + 8;
        if (prev < 75) return prev + Math.random() * 8 + 3;
        if (prev < 90) return prev + Math.random() * 3 + 0.8;
        return prev;
      });
    }, 200);

    // Safety timeout in case navigation is cancelled
    safetyTimeoutRef.current = setTimeout(() => {
      finishProgress();
    }, 10000);
  };

  const finishProgress = () => {
    clearAllTimers();
    setProgress(100);

    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 250);
    }, 200);
  };

  // Listen for route changes
  useEffect(() => {
    const currentUrl = pathname + (searchParams ? searchParams.toString() : '');
    if (lastUrlRef.current && lastUrlRef.current !== currentUrl) {
      finishProgress();
    }
    lastUrlRef.current = currentUrl;
  }, [pathname, searchParams]);

  // Intercept internal link clicks and custom events
  useEffect(() => {
    const handleStart = () => startProgress();
    const handleComplete = () => finishProgress();

    window.addEventListener('tooly:nav:start', handleStart);
    window.addEventListener('tooly:nav:complete', handleComplete);

    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, non-navigation or modified clicks
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        (href.startsWith('http://') && !href.startsWith(window.location.origin)) ||
        (href.startsWith('https://') && !href.startsWith(window.location.origin))
      ) {
        return;
      }

      // Check if target is a different route
      try {
        const targetUrl = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);
        const isSame =
          targetUrl.pathname === currentUrl.pathname &&
          targetUrl.search === currentUrl.search;

        if (!isSame) {
          startProgress();
        }
      } catch {
        // Fallback simple check
        if (href !== window.location.pathname) {
          startProgress();
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });

    return () => {
      clearAllTimers();
      window.removeEventListener('tooly:nav:start', handleStart);
      window.removeEventListener('tooly:nav:complete', handleComplete);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  if (!active && !visible) return null;

  return (
    <div
      aria-hidden="true"
      className="absolute bottom-0 left-0 right-0 h-[2.5px] overflow-hidden pointer-events-none z-50"
    >
      <div
        className="h-full bg-gradient-to-r from-tooly-red via-tooly-red-dark to-tooly-red relative"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transition: 'width 260ms cubic-bezier(0.1, 0.85, 0.25, 1), opacity 220ms ease',
          boxShadow: '0 0 10px rgba(245, 47, 61, 0.75), 0 0 4px rgba(245, 47, 61, 1)',
        }}
      >
        {/* Subtle forward light flare on the moving head of the bar */}
        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-r from-transparent to-white/60 blur-[1px]" />
      </div>
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressBarContent />
    </Suspense>
  );
}

export default NavigationProgressBar;


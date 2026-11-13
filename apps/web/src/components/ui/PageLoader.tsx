'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface PageLoaderProps {
  label?: string;
  fullscreen?: boolean;
  className?: string;
  locale?: string;
}

export function PageLoader({
  label,
  fullscreen = true,
  className = '',
  locale,
}: PageLoaderProps) {
  const pathname = usePathname();
  const activeLocale =
    locale ||
    (pathname?.startsWith('/ar')
      ? 'ar'
      : pathname?.startsWith('/en')
        ? 'en'
        : 'fr');

  const defaultLabel =
    label ||
    (activeLocale === 'ar'
      ? 'جارٍ التحميل والتجهيز...'
      : activeLocale === 'en'
        ? 'Loading...'
        : 'Chargement en cours...');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={defaultLabel}
      className={`w-full flex flex-col items-center justify-center select-none ${
        fullscreen ? 'min-h-[55vh] py-16' : 'py-8'
      } ${className}`}
    >
      {/* Sanjoub Animated Walking Stage (Replacing old brand emblem) */}
      <div
        dir="ltr"
        className="relative w-64 max-w-[85vw] mx-auto select-none mb-4"
      >
        {/* Walking corridor */}
        <div className="relative h-24 w-full overflow-visible">
          {/* Sanjoub horizontal travel wrapper (translates across the track) */}
          <div className="absolute bottom-1.5 left-0 w-[68px] h-[80px] pointer-events-none animate-sanjoub-walk">
            {/* Sanjoub walking bob & stride bounce */}
            <div className="relative w-full h-full animate-sanjoub-bob">
              <Image
                src="/images/loading.png"
                alt="Tooly Sanjoub"
                width={68}
                height={80}
                priority
                className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(245,47,61,0.22)]"
              />
              {/* Dynamic ground contact glow tracking Sanjoub */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-tooly-red/40 blur-[3px] rounded-full" />
            </div>
          </div>
        </div>

        {/* Shimmer line bar track */}
        <div className="w-full h-1.5 bg-line/80 rounded-full overflow-hidden relative shadow-inner">
          {/* Synchronized glowing shimmer light beam translating with Sanjoub */}
          <div
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-tooly-red to-transparent rounded-full animate-sanjoub-shimmer"
            style={{
              boxShadow: '0 0 10px rgba(245, 47, 61, 0.75), 0 0 3px rgba(245, 47, 61, 1)',
            }}
          />
        </div>
      </div>

      {/* Brand title */}
      <div className="flex items-center gap-1.5 font-extrabold text-sm sm:text-base tracking-tight text-ink mb-1.5">
        <span>TOOLY</span>
        <span className="text-tooly-red">.TN</span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
      </div>

      {/* Loading caption */}
      <p className="text-xs text-muted font-medium tracking-wide text-center">
        {defaultLabel}
      </p>
    </div>
  );
}

export default PageLoader;

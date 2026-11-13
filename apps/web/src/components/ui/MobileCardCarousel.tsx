'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@tooly/contracts';

const BREAKPOINT_CLASSES = {
  md: {
    track: 'md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0',
    slide: 'md:w-auto md:shrink md:snap-none',
    controls: 'md:hidden',
  },
  lg: {
    track: 'lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0',
    slide: 'lg:w-auto lg:shrink lg:snap-none',
    controls: 'lg:hidden',
  },
} as const;

const ARIA_LABELS: Record<Locale, { prev: string; next: string; goToSlide: string }> = {
  ar: {
    prev: 'البطاقة السابقة',
    next: 'البطاقة التالية',
    goToSlide: 'انتقل إلى البطاقة',
  },
  fr: {
    prev: 'Carte précédente',
    next: 'Carte suivante',
    goToSlide: 'Aller à la carte',
  },
  en: {
    prev: 'Previous card',
    next: 'Next card',
    goToSlide: 'Go to card',
  },
};

export interface MobileCardCarouselProps {
  children: React.ReactNode;
  desktopBreakpoint?: 'md' | 'lg';
  locale?: Locale;
  ariaLabel?: string;
  className?: string;
}

/**
 * Renders cards as a swipeable horizontal scroll-snap carousel with dot/button controls
 * on mobile, collapsing back to a standard 3-column grid above `desktopBreakpoint`.
 */
export function MobileCardCarousel({
  children,
  desktopBreakpoint = 'md',
  locale = 'fr',
  ariaLabel,
  className = '',
}: MobileCardCarouselProps) {
  const slides = React.Children.toArray(children);
  const slideCount = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const bp = BREAKPOINT_CLASSES[desktopBreakpoint];
  const labels = ARIA_LABELS[locale] ?? ARIA_LABELS.en;

  const syncActiveFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.scrollWidth <= track.clientWidth + 4) return;

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    let closestIdx = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < slideRefs.current.length; i++) {
      const slide = slideRefs.current[i];
      if (!slide) continue;
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const dist = Math.abs(slideCenter - trackCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    }

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId = 0;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(syncActiveFromScroll);
    };

    syncActiveFromScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncActiveFromScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncActiveFromScroll);
    };
  }, [syncActiveFromScroll]);

  const scrollToSlide = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;

    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const delta = slideRect.left + slideRect.width / 2 - (trackRect.left + trackRect.width / 2);
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({
      left: delta,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    setActiveIndex(index);
  }, []);

  const handlePrev = () => {
    if (slideCount === 0) return;
    scrollToSlide((activeIndex - 1 + slideCount) % slideCount);
  };

  const handleNext = () => {
    if (slideCount === 0) return;
    scrollToSlide((activeIndex + 1) % slideCount);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const isRtl =
      trackRef.current && getComputedStyle(trackRef.current).direction === 'rtl';
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isRtl) handleNext();
      else handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (isRtl) handlePrev();
      else handleNext();
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`relative w-full ${className}`}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        className={`flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red/40 rounded-2xl ${bp.track}`}
      >
        {slides.map((child, idx) => (
          <div
            key={idx}
            ref={(el) => {
              slideRefs.current[idx] = el;
            }}
            className={`w-[86%] sm:w-[74%] shrink-0 snap-center flex flex-col ${bp.slide}`}
          >
            {child}
          </div>
        ))}
      </div>

      {slideCount > 1 && (
        <div
          className={`mt-5 flex items-center justify-center gap-3 ${bp.controls}`}
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label={labels.prev}
            className="w-8 h-8 rounded-full border border-line bg-surface text-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red"
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>

          <div className="flex items-center gap-1.5" role="tablist" aria-label={ariaLabel}>
            {slides.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${labels.goToSlide} ${idx + 1}`}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red ${
                    isActive
                      ? 'w-6 bg-tooly-red'
                      : 'w-2 bg-ink/20 hover:bg-ink/40'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label={labels.next}
            className="w-8 h-8 rounded-full border border-line bg-surface text-ink hover:bg-ink hover:text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tooly-red"
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileCardCarousel;


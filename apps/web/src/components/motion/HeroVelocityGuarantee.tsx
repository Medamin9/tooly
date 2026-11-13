'use client';

import React from 'react';
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from '@/registry/magicui/scroll-based-velocity';
import { Locale } from '@tooly/contracts';

export interface HeroVelocityGuaranteeProps {
  dict: {
    line1: string;
    line2: string;
  };
  locale: Locale;
}

export function HeroVelocityGuarantee({
  dict,
  locale,
}: HeroVelocityGuaranteeProps) {
  const isAr = locale === 'ar';

  return (
    <section
      aria-label="Tooly.tn Replacement & Money-Back Guarantee"
      className="relative w-full py-4 sm:py-24 my-6 sm:my-10 overflow-hidden select-none isolate pointer-events-none"
    >
      {/* 30-Degree Angled Ribbon Wrapper */}
      <div className="w-[220vw] -ms-[60vw] flex flex-col items-center justify-center [transform:rotate(-5deg)] origin-center">
        <ScrollVelocityContainer className="w-full flex flex-col gap-2 sm:gap-3 py-2">
          {/* Row 1: Replacement Promise (Direction 1) */}
          <ScrollVelocityRow
            baseVelocity={5}
            direction={1}
            className="py-3 sm:py-4 bg-ink text-paper border-y border-line/40 shadow-xl"
          >
            <div className="flex items-center gap-6 sm:gap-10 px-4 sm:px-6">
              <span className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {dict.line1}
              </span>
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-tooly-red shrink-0 shadow-[0_0_12px_rgba(245,47,61,0.8)]" />
            </div>
          </ScrollVelocityRow>

          {/* Row 2: Money-Back Guarantee (Direction -1) */}
          <ScrollVelocityRow
            baseVelocity={5}
            direction={-1}
            className="py-3 sm:py-4 bg-tooly-soft-red text-ink dark:bg-surface border-y border-tooly-red/30 shadow-lg"
          >
            <div className="flex items-center gap-6 sm:gap-10 px-4 sm:px-6">
              <span className="text-xl sm:text-3xl md:text-4xl font-black text-tooly-red tracking-tight">
                {dict.line2}
              </span>
              <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            </div>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </div>

      {/* Left & Right ambient fade gradients for smooth viewport blending */}
      <div className="from-paper via-paper/70 to-transparent pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-48 bg-gradient-to-r z-20" />
      <div className="from-paper via-paper/70 to-transparent pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-48 bg-gradient-to-l z-20" />
    </section>
  );
}

export default HeroVelocityGuarantee;


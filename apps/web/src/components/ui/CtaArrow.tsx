import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Storefront CTA arrow:
 * Place as the first flex child before the label so it sits on the right side
 * pointing right (→) in Arabic (RTL), and on the left side pointing left (←) in French/English (LTR).
 */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <ArrowLeft
      aria-hidden="true"
      className={cn('ltr:rotate-180 shrink-0', className)}
    />
  );
}


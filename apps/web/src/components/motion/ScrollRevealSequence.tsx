'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function ScrollRevealSequence({
  children,
  className = '',
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.children;
      if (!elements || elements.length === 0) return;

      gsap.from(elements, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

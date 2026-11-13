'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollVelocityContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function ScrollVelocityContainer({
  children,
  className = '',
  ...props
}: ScrollVelocityContainerProps) {
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ScrollVelocityRowProps {
  children: React.ReactNode;
  baseVelocity?: number;
  direction?: 1 | -1;
  className?: string;
  numCopies?: number;
  scrollReactivity?: boolean;
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 15,
  direction = 1,
  className = '',
  numCopies = 6,
  scrollReactivity = true,
}: ScrollVelocityRowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const xPos = useRef(0);
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (!scrollReactivity) return;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      // Add velocity impulse proportional to scroll speed
      scrollVelocity.current += delta * 0.15;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let animationFrameId: number | null = null;
    let lastTime = performance.now();
    let inView = true;
    let isHidden = false;

    const tick = (now: number) => {
      if (!inView || isHidden) {
        animationFrameId = null;
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      // Dampen the scroll velocity impulse back to zero
      scrollVelocity.current *= 0.92;

      // Total speed = baseline velocity + scroll impulse
      const totalSpeed = baseVelocity * direction + (scrollVelocity.current * direction);
      xPos.current += totalSpeed * dt * 25;

      const track = trackRef.current;
      if (track) {
        // Track width of one duplicated segment
        const segmentWidth = track.scrollWidth / numCopies;
        if (segmentWidth > 0) {
          if (direction === 1 && xPos.current >= segmentWidth) {
            xPos.current -= segmentWidth;
          } else if (direction === -1 && xPos.current <= -segmentWidth) {
            xPos.current += segmentWidth;
          }
        }
        track.style.transform = `translate3d(${-xPos.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (animationFrameId === null && inView && !isHidden) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const onVisibility = () => {
      isHidden = document.hidden;
      if (isHidden) stop();
      else start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) start();
        else stop();
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    document.addEventListener('visibilitychange', onVisibility);

    start();

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('scroll', onScroll);
    };
  }, [baseVelocity, direction, numCopies, scrollReactivity]);

  const copiesArray = Array.from({ length: numCopies });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex whitespace-nowrap ${className}`}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform select-none"
      >
        {copiesArray.map((_, i) => (
          <div key={i} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollVelocityContainer;


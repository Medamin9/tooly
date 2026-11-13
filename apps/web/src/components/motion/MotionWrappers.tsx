'use client';

import React from 'react';
import {
  motion,
  useReducedMotion,
  HTMLMotionProps,
  Variants,
} from 'motion/react';
import {
  MOTION_EASE,
  MOTION_DURATION,
  MOTION_DISTANCE,
  MOTION_STAGGER,
  MOTION_VIEWPORT,
} from '@/lib/motion/config';

type MotionDirection = 'up' | 'down' | 'left' | 'right' | 'none';
type DistanceToken = keyof typeof MOTION_DISTANCE | number;
type DurationToken = keyof typeof MOTION_DURATION | number;
type StaggerToken = keyof typeof MOTION_STAGGER | number;

function resolveDistance(d: DistanceToken, reduced: boolean): number {
  if (reduced) return 0;
  if (typeof d === 'number') return d;
  return MOTION_DISTANCE[d] ?? MOTION_DISTANCE.base;
}

function resolveDuration(d: DurationToken, reduced: boolean): number {
  if (reduced) return 0.05;
  if (typeof d === 'number') return d;
  return MOTION_DURATION[d] ?? MOTION_DURATION.base;
}

function resolveStagger(s: StaggerToken, reduced: boolean): number {
  if (reduced) return 0;
  if (typeof s === 'number') return s;
  return MOTION_STAGGER[s] ?? MOTION_STAGGER.base;
}

/* -------------------------------------------------------------------------- */
/*                                1. FadeIn                                  */
/* -------------------------------------------------------------------------- */

export interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  direction?: MotionDirection;
  distance?: DistanceToken;
  duration?: DurationToken;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'span' | 'header' | 'footer' | 'li';
  className?: string;
  viewport?: { once?: boolean; amount?: number; margin?: string };
}

export function FadeIn({
  children,
  direction = 'up',
  distance = 'base',
  duration = 'base',
  delay = 0,
  as = 'div',
  className = '',
  viewport = MOTION_VIEWPORT,
  style,
  ...props
}: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();
  const dist = resolveDistance(distance, !!shouldReduceMotion);
  const dur = resolveDuration(duration, !!shouldReduceMotion);

  let initialX = 0;
  let initialY = 0;

  if (direction === 'up') initialY = dist;
  else if (direction === 'down') initialY = -dist;
  else if (direction === 'left') initialX = dist;
  else if (direction === 'right') initialX = -dist;

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, x: initialX, y: initialY }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{
        duration: dur,
        delay: shouldReduceMotion ? 0 : delay,
        ease: MOTION_EASE,
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/* -------------------------------------------------------------------------- */
/*                                2. SlideUp                                 */
/* -------------------------------------------------------------------------- */

export interface SlideUpProps extends FadeInProps {
  scaleFrom?: number;
}

export function SlideUp({
  children,
  distance = 'base',
  duration = 'base',
  scaleFrom,
  delay = 0,
  as = 'div',
  className = '',
  viewport = MOTION_VIEWPORT,
  style,
  ...props
}: SlideUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const dist = resolveDistance(distance, !!shouldReduceMotion);
  const dur = resolveDuration(duration, !!shouldReduceMotion);
  const initialScale = shouldReduceMotion ? 1 : scaleFrom ?? 0.98;

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, y: dist, scale: initialScale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={viewport}
      transition={{
        duration: dur,
        delay: shouldReduceMotion ? 0 : delay,
        ease: MOTION_EASE,
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/* -------------------------------------------------------------------------- */
/*                           3. StaggerContainer                             */
/* -------------------------------------------------------------------------- */

export interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  stagger?: StaggerToken;
  delayChildren?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  className?: string;
  viewport?: { once?: boolean; amount?: number; margin?: string };
}

export function StaggerContainer({
  children,
  stagger = 'base',
  delayChildren = 0,
  as = 'div',
  className = '',
  viewport = MOTION_VIEWPORT,
  style,
  ...props
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const staggerDuration = resolveStagger(stagger, !!shouldReduceMotion);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: shouldReduceMotion ? 0 : delayChildren,
      },
    },
  };

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={containerVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/* -------------------------------------------------------------------------- */
/*                              4. StaggerItem                               */
/* -------------------------------------------------------------------------- */

export interface StaggerItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  direction?: MotionDirection;
  distance?: DistanceToken;
  duration?: DurationToken;
  as?: 'div' | 'li' | 'article';
  className?: string;
}

export function StaggerItem({
  children,
  direction = 'up',
  distance = 'base',
  duration = 'base',
  as = 'div',
  className = '',
  style,
  ...props
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const dist = resolveDistance(distance, !!shouldReduceMotion);
  const dur = resolveDuration(duration, !!shouldReduceMotion);

  let initialX = 0;
  let initialY = 0;

  if (direction === 'up') initialY = dist;
  else if (direction === 'down') initialY = -dist;
  else if (direction === 'left') initialX = dist;
  else if (direction === 'right') initialX = -dist;

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: initialX, y: initialY },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: dur,
        ease: MOTION_EASE,
      },
    },
  };

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      variants={itemVariants}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}

/* -------------------------------------------------------------------------- */
/*                                5. ScaleIn                                 */
/* -------------------------------------------------------------------------- */

export interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  from?: number;
  duration?: DurationToken;
  delay?: number;
  as?: 'div' | 'span' | 'section';
  className?: string;
  viewport?: { once?: boolean; amount?: number; margin?: string };
}

export function ScaleIn({
  children,
  from = 0.94,
  duration = 'base',
  delay = 0,
  as = 'div',
  className = '',
  viewport = MOTION_VIEWPORT,
  style,
  ...props
}: ScaleInProps) {
  const shouldReduceMotion = useReducedMotion();
  const dur = resolveDuration(duration, !!shouldReduceMotion);
  const initialScale = shouldReduceMotion ? 1 : from;

  const MotionComponent = (motion as any)[as] || motion.div;

  return (
    <MotionComponent
      initial={{ opacity: 0, scale: initialScale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={viewport}
      transition={{
        duration: dur,
        delay: shouldReduceMotion ? 0 : delay,
        ease: MOTION_EASE,
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}


/**
 * Global Motion Configuration & Animation Tokens
 * Tooly.tn Design System
 * 
 * Provides unified, subtle, and accessible animation values across all sections and components.
 */

// Custom cubic-bezier easing curve for organic, tactile deceleration
export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;
export const MOTION_EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const MOTION_EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// Normalized standard durations (in seconds)
export const MOTION_DURATION = {
  fast: 0.3,
  base: 0.5,
  slow: 0.7,
  hero: 0.85,
} as const;

// Subtle travel distances (in pixels) - keeps animations clean and non-disruptive
export const MOTION_DISTANCE = {
  sm: 14,
  base: 22,
  lg: 36,
} as const;

// Stagger timing orchestration for grids, cards, and multi-element sections
export const MOTION_STAGGER = {
  fast: 0.06,
  base: 0.09,
  slow: 0.14,
} as const;

// Standard viewport trigger settings (triggers once to avoid repetitive flashing on scroll)
export const MOTION_VIEWPORT = {
  once: true,
  amount: 0.12,
  margin: '0px 0px -40px 0px',
} as const;


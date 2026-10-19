---
trigger: model_decision
description: Use when implementing or reviewing performance, rendering, caching, animations, media, or large lists.
---
# Performance rules
- Measure before applying memoization. Use `React.memo`, `useMemo`, and `useCallback` only when they prevent real work or stabilize required dependencies.
- Prefer Server Components for static/read-mostly Next.js content; use Client Components only for interactivity, browser APIs, and animation.
- Lazy-load noncritical images, 3D scenes, and heavy animation modules. Keep the initial route bundle small.
- Reserve image dimensions to prevent layout shift; use responsive modern formats where supported.
- Cache public catalog/category content only with explicit TTL and invalidation. Never put private account/order/admin responses in shared public caches.
- Define invalidation on catalog, price, stock/availability, promotion, and locale changes.
- Respect reduced-motion preferences. Pause or disable scroll animation on small screens if it harms usability.
- Avoid expensive blur/backdrop filters and excessive particles on mobile.
- Record Lighthouse/Core Web Vitals baselines and fix the largest real bottlenecks first.

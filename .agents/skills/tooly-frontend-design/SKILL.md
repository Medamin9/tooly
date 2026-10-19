---
name: tooly-frontend-design
description: Builds distinctive, responsive, premium Tooly storefront and account interfaces with Next.js, React, Tailwind, accessible components, and deliberate motion.
---
# Tooly Frontend Design Skill

Use for storefront, product detail, cart, account, and responsive UI tasks.

1. Read `design/DESIGN_SYSTEM.md` and `docs/LOCALIZATION.md`.
2. Define page hierarchy and the primary action before styling.
3. Reuse design tokens and shared components; avoid one-off magic values.
4. Use Next.js Server Components by default; add `"use client"` only when interaction requires it.
5. Use Lucide React icons consistently. Do not use emoji as a replacement for interface icons.
6. Use GSAP/ScrollTrigger only for choreographed storytelling. Clean up contexts/triggers and avoid hydration mismatch.
7. Provide reduced-motion behavior and mobile fallback. Do not require WebGL to understand or use the page.
8. Use real content and credible product metadata. No fake testimonials, fake metrics, or invented plan features.
9. Verify 320px, 375px, tablet, laptop, wide desktop; test Arabic RTL and LTR locales.
10. Include accessible labels, focus styles, keyboard interaction, and clear feedback.

Do not:
- Build a generic purple/blue AI gradient hero.
- Add animation to every component.
- put critical text inside a canvas/3D scene.
- use unverified provider logos in a way that suggests official affiliation.

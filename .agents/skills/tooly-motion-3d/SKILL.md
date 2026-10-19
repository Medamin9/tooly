---
name: tooly-motion-3d
description: Adds purposeful GSAP scroll storytelling and selective 3D interactions while protecting accessibility, responsiveness, and Core Web Vitals.
---
# Tooly Motion and 3D Skill

Use for the homepage hero, editorial product storytelling, or a small number of brand moments.

1. Define the story and user benefit first; animation must clarify rather than distract.
2. Prefer transform and opacity; avoid layout thrashing and scroll-linked heavy calculations.
3. Use GSAP context/scoped selectors and clean up timelines, ScrollTriggers, observers, and event listeners on unmount.
4. Avoid pinning long sections on mobile; provide a simpler small-screen composition.
5. Respect `prefers-reduced-motion` and offer a no-motion path.
6. Lazy-load Three.js/WebGL or React Bits components only when needed. Include a static image/CSS fallback.
7. Do not put product price, checkout actions, navigation, or essential copy inside a 3D canvas.
8. Avoid excessive particles, bloom, blur, and continuous rendering when idle.
9. Check for hydration issues, reduced-motion, keyboard access, battery/thermal cost, and touch interaction.
10. Test on low-powered mobile devices and record whether the added effect is worth its cost.

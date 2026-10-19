---
trigger: always_on
description: Applies Tooly visual identity, responsive behavior, accessibility, and motion principles.
---
# Design and accessibility rules
- Follow `design/DESIGN_SYSTEM.md` and `design/brand/README.md`.
- Default to light theme. Do not use the default purple/blue AI gradient aesthetic.
- Use the Tooly logo asset as supplied; preserve its aspect ratio and clear space.
- Design for 320px mobile width through large desktop; avoid horizontal overflow.
- Support Arabic RTL, French LTR, and English LTR. Set document `lang` and `dir` correctly per locale.
- Use semantic landmarks, accessible names, keyboard-operable controls, clear focus indicators, sufficient contrast, and meaningful validation messages.
- Respect `prefers-reduced-motion`; provide a static/low-motion path for all nonessential animation.
- Avoid animating layout-heavy properties when transform/opacity will work. Do not animate every element.
- Use GSAP/ScrollTrigger for a few authored storytelling moments, not for routine UI transitions.
- Use 3D sparingly, lazy-load it, and provide a non-WebGL fallback.
- Never rely on color alone to convey status. Every interactive control needs hover, focus, disabled, loading, and error states as appropriate.

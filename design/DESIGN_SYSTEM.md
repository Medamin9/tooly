# Tooly Visual Design System

## Brand direction
Tooly should feel like a confident, design-led digital marketplace built for real people in Tunisia. The interface should feel editorial and tactile, with warm whitespace, confident typography, product discovery, and a few memorable motion moments. Avoid the generic "AI startup" look.

## Theme
Light theme by default. Dark media may be used inside campaign artwork, but the product UI remains light unless a later explicit theme decision changes this.

## Palette tokens
Treat these as starting tokens and refine after checking the supplied logo:
- `--color-ink: #17191F` — primary text and structural contrast
- `--color-paper: #FAF9F6` — warm page background
- `--color-surface: #FFFFFF` — cards and dialogs
- `--color-muted: #6B6B70` — secondary text
- `--color-line: #E8E5E0` — borders/dividers
- `--color-tooly-red: #F52F3D` — primary brand accent
- `--color-tooly-red-dark: #C91F2D` — pressed/strong accent
- `--color-soft-red: #FFF0F1` — subtle accent surfaces
- `--color-success: #237A57`
- `--color-warning: #9A5A12`
- `--color-danger: #B42318`

Do not use blue/purple as the dominant brand palette. Provider-specific colors may appear only inside product marks or carefully bounded catalog elements.

## Typography
Use a distinctive, highly readable sans-serif family with Arabic support. Suggested pairing:
- Latin: `Manrope` or `Plus Jakarta Sans`
- Arabic: `IBM Plex Sans Arabic` or `Noto Sans Arabic`
Verify licensing, variable font availability, glyph coverage, and loading performance before committing. Use local/self-hosted font files where licensing permits; otherwise use an approved font provider. Avoid loading many weights.

Typography should use a clear scale, generous line height, and restrained weight contrast. Avoid oversized headlines that break on mobile or Arabic.

## Layout
- Use an 8px spacing rhythm with a compact 4px sub-grid where needed.
- Content max width around 1200–1280px, with generous desktop gutters and responsive mobile gutters.
- Use consistent radii: 10–14px for controls, 16–24px for cards, larger only for feature sections.
- Prefer clear borders and subtle shadows over floating glassmorphism.
- Product cards should foreground tool/plan, duration, price, availability, and CTA.
- Do not hide prices or key terms behind hover-only interactions.

## Motion
- Use one signature homepage scroll sequence, a few product-card interactions, and subtle navigation/CTA feedback.
- Keep durations intentional; avoid long blocking intro animations.
- Use GSAP/ScrollTrigger for authored sections; use CSS transitions for routine hover/focus.
- Respect `prefers-reduced-motion`, keyboard and touch use, and mobile performance.
- Any 3D scene needs a static fallback and must not contain critical text or checkout controls.

## Components
Build consistent components for:
- Button (primary, secondary, ghost, destructive)
- Text field, select, checkbox, form error
- Badge/status
- Product/plan card
- Category tile
- Price and plan comparison
- Empty/loading/error states
- Dialog/drawer
- Breadcrumb/pagination
- Toast/alert
- Data table and admin filters
- Language switcher and RTL-aware navigation

## Interaction states
All controls need visible focus and disabled states. Forms need inline errors and success feedback. Async actions need loading and failure states. Avoid fake urgency or misleading success indicators.

## Brand asset
Use the original Tooly logo file provided by the owner. Keep aspect ratio and adequate clear space. Use a simplified icon-only variant for favicon only if supplied/approved.

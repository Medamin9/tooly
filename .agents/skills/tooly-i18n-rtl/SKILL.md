---
name: tooly-i18n-rtl
description: Implements and reviews Arabic, French, and English localization, RTL layout, localized navigation, and language-aware content.
---
# Tooly Internationalization and RTL Skill

1. Read `docs/LOCALIZATION.md`.
2. Use locale-prefixed routes or the established project convention consistently.
3. Keep translations in message dictionaries/resources; do not scatter hardcoded user-facing strings through components.
4. Set `<html lang>` and `dir` from the active locale. Arabic must use `dir="rtl"` and RTL-aware layout rules.
5. Prefer CSS logical properties (`margin-inline-start`, `padding-inline`, `text-align: start`) over left/right-specific rules.
6. Do not reverse every icon automatically; only direction-dependent icons should flip.
7. Localize dates, numbers, currency, validation, email templates, metadata, and accessibility labels.
8. Use TND for Tunisian-market prices and make locale/currency behavior explicit.
9. Test long labels, mixed Arabic/French text, digits, forms, menus, drawers, tables, and mobile navigation in RTL.
10. Never machine-translate legal or payment-critical copy without review.

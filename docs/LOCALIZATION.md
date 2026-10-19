# Localization and RTL

## Locales
- `ar`: Arabic; default direction RTL.
- `fr`: French; LTR.
- `en`: English; LTR.

## Requirements
- Choose one route convention such as `/ar/...`, `/fr/...`, `/en/...`.
- Keep user-visible strings in locale resources.
- Set `lang` and `dir` on the document from the active locale.
- Use CSS logical properties rather than hardcoded left/right.
- Ensure dropdown alignment, breadcrumbs, forms, tables, pagination, modals, cart drawer, and icons behave in RTL.
- Only direction-dependent icons (e.g., back/forward arrows) should flip.
- Format TND currency, dates, and numbers with `Intl` and an explicit locale.
- Decide whether Arabic content uses Tunisian dialect or Modern Standard Arabic by content area; keep legal/transactional copy clear and professionally reviewed.
- Include translated metadata, Open Graph fields, validation, emails, errors, and accessibility labels.
- Test mixed-direction content, product names, prices, phone numbers, and Latin brand names inside Arabic sentences.

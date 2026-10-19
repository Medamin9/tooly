---
name: tooly-quality-review
description: Performs a release-minded review of Tooly code for correctness, security, accessibility, localization, performance, and test coverage.
---
# Tooly Quality Review Skill

1. Inspect the diff and requirements; do not review only the happy path.
2. Check secrets, authorization, input validation, payment fulfillment, upload safety, error disclosure, and data ownership.
3. Check responsive behavior, keyboard use, contrast, labels, reduced motion, and Arabic RTL.
4. Check loading/error/empty states and stale-cache risks.
5. Run available lint, typecheck, unit/integration/e2e tests, and production build.
6. Report findings ordered by severity with file/line references where possible.
7. Separate confirmed defects from risks and suggestions.
8. Do not state that the app is production-ready if critical integrations, security controls, or tests are incomplete.

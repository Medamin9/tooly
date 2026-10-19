---
trigger: model_decision
description: Use when adding features, fixing bugs, changing database/API behavior, or preparing releases.
---
# Testing rules
- Add tests at the level that protects the behavior: unit, API integration, and end-to-end for critical flows.
- Critical flows include login/logout, role access, locale switching/RTL, catalog pricing, checkout, verified payment fulfillment, order history, and admin CRUD.
- Run formatting/lint, TypeScript checks, tests, and production build relevant to changed packages.
- Do not delete or weaken a test just to make a build pass. Explain and fix the underlying issue.
- Use deterministic test data and isolated test databases. Never run destructive tests against production.
- Report exact commands and outcomes. Distinguish tests run from tests merely recommended.

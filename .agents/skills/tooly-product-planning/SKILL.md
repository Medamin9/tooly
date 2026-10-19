---
name: tooly-product-planning
description: Turns Tooly.tn business goals into scoped requirements, user journeys, acceptance criteria, and phased delivery plans before implementation.
---
# Tooly Product Planning Skill

Use when starting a feature, planning a milestone, or clarifying product behavior.

1. Read `docs/PRODUCT_REQUIREMENTS.md` and relevant architecture/design docs.
2. Identify user role, problem, primary journey, edge cases, empty/loading/error states, analytics needs, and acceptance criteria.
3. Mark assumptions explicitly. Do not invent prices, payment providers, resale rights, delivery guarantees, or provider integrations.
4. Split work into a small vertical slice that can be tested end-to-end.
5. Identify dependencies and security/privacy implications.
6. Produce a plan with files likely to change, acceptance checklist, and verification commands.
7. Wait for user approval before broad destructive changes or large architectural shifts.

Definition of done:
- Acceptance criteria are testable.
- Mobile, desktop, Arabic RTL, French, and English behavior are considered.
- Loading, error, empty, and permission-denied states are defined.
- Security and performance concerns are called out.

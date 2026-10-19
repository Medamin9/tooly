---
name: tooly-prisma-data-model
description: Designs and migrates Tooly PostgreSQL schemas with Prisma, relational integrity, indexes, safe migrations, and seed data.
---
# Tooly Prisma Data Model Skill

1. Read `docs/DATA_MODEL.md` and inspect the existing schema/migrations first.
2. Model money safely: use integer minor units or Prisma Decimal with an explicit currency strategy; never use floating-point for authoritative totals.
3. Include timestamps and explicit status enums where useful. Add unique constraints, foreign keys, and indexes based on query patterns.
4. Model product, plan, provider, order, order item, payment event, customer, role/permission, promotion, locale content, and audit event only as needed by approved requirements.
5. Store provider-specific delivery/entitlement data securely; do not expose secrets in public API responses.
6. Create a forward migration and update generated client types. Never reset production data.
7. Use transactions for order/payment/fulfillment state transitions.
8. Make webhook/event processing idempotent.
9. Use seed data that is clearly fictional/demo and never contains production secrets.
10. Explain migration risks and provide verification commands.

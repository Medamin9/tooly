---
trigger: always_on
description: Enforces Tooly monorepo boundaries, API ownership, typed code, and maintainable architecture.
---
# Architecture rules
- Keep `apps/web` (Next.js) and `apps/api` (NestJS) separate in a TypeScript monorepo.
- NestJS is the canonical owner of business rules, catalog, orders, entitlements, payment verification, and admin authorization.
- Do not duplicate business rules in client components. The frontend may perform presentation validation, but the API must validate independently.
- Use Prisma only through the API's data-access/service layer. Never access the database from browser code.
- Use DTOs and server-side validation for API inputs; validate environment configuration at startup.
- Prefer explicit modules, services, repositories where useful, and dependency injection over giant files.
- Avoid circular dependencies, hidden global state, premature abstractions, and unnecessary packages.
- Document any deviation from `docs/ARCHITECTURE.md` before implementing it.

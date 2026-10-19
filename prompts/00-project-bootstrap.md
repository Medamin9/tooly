# Prompt 00 — Bootstrap Tooly.tn workspace

You are working on Tooly.tn. First inspect the repository and this instruction pack.

Read:
- `AGENTS.md`
- all relevant `.agents/rules/*.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATA_MODEL.md`
- `docs/SECURITY.md`
- `docs/LOCALIZATION.md`
- `design/DESIGN_SYSTEM.md`

Do not start by generating the whole platform. First:
1. Summarize current repository state and detected tools.
2. Identify missing business decisions (payment provider, auth strategy, authorized fulfillment/resale model, exact subscription delivery, hosting/deployment).
3. Propose the monorepo layout and package manager.
4. Propose a phased implementation plan with acceptance criteria and test commands.
5. Identify risks and dependencies.
6. Wait for approval before making broad changes.

If repository is empty, recommend a stable, currently supported setup for Next.js + NestJS + TypeScript + Tailwind + PostgreSQL + Prisma. Check official documentation for current commands and compatibility rather than inventing versions.

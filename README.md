# Tooly.tn — Digital Subscription Marketplace

Multilingual digital-tools and subscription marketplace initially serving Tunisia in Tunisian Dinar (TND).

## Monorepo Architecture

- **`apps/web`**: Next.js 15 App Router storefront & customer interface with Tailwind CSS, accessible RTL/LTR layout, and Tooly design system tokens.
- **`apps/api`**: NestJS 11 REST API with DTO validation, Swagger/OpenAPI documentation, and health monitoring.
- **`packages/contracts`**: Shared TypeScript contracts, enums (order states, user roles), and health response types.
- **`packages/config`**: Shared TypeScript and tooling configuration.
- **`design/`**: Visual design tokens, wireframes, and official Tooly brand assets.
- **`docs/`**: Comprehensive product requirements, architecture, security, and localization guides.

## Prerequisites

- **Node.js**: `>= 20.0.0` (Detected: `v24.21.0`)
- **npm**: `>= 10.0.0`
- **PostgreSQL**: Local database or cloud provider (e.g., Supabase / Neon)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate --workspace=@tooly/api
   ```

3. **Build shared packages**:
   ```bash
   npm run build --workspace=@tooly/contracts
   ```

4. **Start Development Servers**:
   ```bash
   # Start both web and api simultaneously
   npm run dev

   # Or start individually:
   npm run dev:web   # http://localhost:3000
   npm run dev:api   # http://localhost:4000/api/v1 (Docs at /api/v1/docs)
   ```

## Quality Commands

```bash
# Run lint across all workspaces
npm run lint

# Run typecheck across all workspaces
npm run typecheck

# Run unit tests
npm run test

# Run production build
npm run build
```

## Payment Strategy

Per initial business decision, payment processing is configured outside the platform (`PAYMENT_FULFILLMENT_MODE=offline_transfer`) for manual verification and offline transfer in Tunisia.

# Tooly Architecture

## Monorepo layout
```text
tooly/
├── apps/
│   ├── web/                 # Next.js App Router storefront + customer account
│   └── api/                 # NestJS REST API
├── packages/
│   ├── ui/                  # Optional shared design primitives
│   ├── config/              # Shared TS/ESLint config
│   └── contracts/           # Optional shared schemas/types (no server secrets)
├── prisma/                  # Optional only if schema is intentionally centralized
├── docs/
├── design/
├── prompts/
├── .agents/
└── AGENTS.md
```

Choose a single Prisma schema location and document it. Recommended default: `apps/api/prisma/schema.prisma`, because the API owns persistence.

## Frontend
- Next.js App Router + TypeScript + Tailwind.
- Server Components for mostly static catalog/SEO content.
- Client Components for menus, cart interactions, animation, and forms requiring browser state.
- Use a single locale routing strategy and consistent locale dictionaries.
- Use Lucide React for interface icons.
- Use GSAP and React Bits selectively; do not import large animation packages into every route.
- Treat all data from the API as runtime data and handle loading, empty, and error states.

## Backend
Suggested NestJS modules:
- AuthModule
- UsersModule
- Roles/PermissionsModule
- CatalogModule
- CategoriesModule
- PricingModule
- Cart/CheckoutModule
- OrdersModule
- PaymentsModule
- FulfillmentModule
- PromotionsModule (optional)
- UploadsModule
- SupportModule
- AdminModule
- AuditLogModule
- HealthModule

Keep modules aligned to real MVP requirements; do not generate empty modules just to match a list.

## Data and API
- PostgreSQL is the source of truth.
- Prisma migrations are committed and reviewed.
- Use DTO validation, pagination, structured errors, request IDs, and OpenAPI documentation.
- Define API versioning strategy early (for example `/api/v1`).
- Use transactions and idempotency for checkout, payment events, and fulfillment.
- Do not trust client-submitted prices, role flags, payment status, or provider fulfillment status.

## Caching
- Cache only public, non-personalized catalog data with a documented TTL/invalidation policy.
- Invalidate relevant cache keys after product, plan, price, availability, promotion, or translation changes.
- Never share-cache account, order, payment, admin, or personalized responses.
- Do not add Redis until there is a clear need; if introduced, document deployment and invalidation behavior.

## Authentication
Choose and document the strategy before implementation. Use a vetted provider/library or a well-maintained implementation. Protect cookies/sessions, rate-limit login, support secure recovery, and enforce server-side roles. Admin access must not depend on a secret URL alone.

## Uploads
Multer belongs in NestJS endpoints. Limit size, allowlist formats, generate filenames, validate actual file content where possible, and store files in private/object storage unless public display is intentional. Never execute uploaded files.

## Payments and fulfillment
- Integrate only an actual provider selected by the owner.
- Use provider-hosted checkout or tokenized methods.
- Verify signed webhooks and match order ID, amount, currency, and state.
- Make webhook processing idempotent.
- Fulfill only after server-side confirmation.
- Keep provider-specific subscription delivery behind an adapter; do not invent unsupported integrations.

# Security and Launch Checklist

## Identity and authorization
- [ ] Auth strategy documented; password hashing/session handling delegated to vetted libraries.
- [ ] Admin access requires authentication and server-side role checks on every protected route.
- [ ] Customer resources enforce ownership.
- [ ] Login, recovery, checkout, and upload endpoints are rate-limited.
- [ ] First admin is created using a secure bootstrap procedure; no default production password.

## Payments
- [ ] Payment provider and local availability verified.
- [ ] Hosted checkout/tokenized flow used; no raw card data stored.
- [ ] Signed webhooks verified.
- [ ] Amount, currency, order, and status cross-checked server-side.
- [ ] Duplicate webhook delivery is safe/idempotent.
- [ ] Fulfillment never relies only on browser redirect.

## Data and API
- [ ] DTO validation enabled and unknown fields handled intentionally.
- [ ] Secrets are environment variables/managed secrets.
- [ ] `.env` is ignored; `.env.example` contains placeholders only.
- [ ] Sensitive fields excluded from API responses and logs.
- [ ] CORS, security headers, CSRF protections, and cookie flags configured for deployment.
- [ ] Database backups and restore process tested.
- [ ] Dependency audit and production environment review completed.

## Uploads
- [ ] Auth and permission checks applied.
- [ ] File size and type allowlists enforced.
- [ ] Generated filenames; no user-controlled filesystem paths.
- [ ] Safe storage and public/private access policy defined.
- [ ] File content validation/scanning plan defined where appropriate.

## Business/legal
- [ ] Resale/fulfillment authorization checked for every listed provider and plan.
- [ ] Terms, privacy, refund/cancellation, and support policies reviewed.
- [ ] Price, duration, renewal, account ownership, and restrictions clearly disclosed.
- [ ] No unsupported provider affiliation or guarantee claims.
- [ ] Tax, invoicing, consumer-protection, and payment obligations reviewed for target markets.

---
name: tooly-api-security
description: Implements and reviews NestJS endpoints, DTO validation, authorization, payments, uploads, and sensitive marketplace business logic securely.
---
# Tooly API Security Skill

Use for NestJS modules, customer/admin endpoints, checkout, file uploads, and authorization.

1. Identify actor, resource ownership, permission, input schema, and abuse cases.
2. Implement controller → DTO validation → service/business logic → Prisma data access.
3. Use global validation with whitelist and forbid unknown fields; validate again where needed at boundaries.
4. Guard admin routes server-side with authentication and role/permission checks.
5. Ensure users can only access their own orders/account unless a permission explicitly allows otherwise.
6. For uploads, enforce authentication, authorization, file size/type allowlists, safe generated names, storage policy, and malware/content scanning strategy if relevant.
7. For payments, verify provider signatures and amount/currency/order match on the server; make webhook handling idempotent.
8. Add rate limits and audit events for sensitive operations without logging secrets.
9. Add unit/integration tests for allowed and denied paths.
10. Document any integration requiring credentials or provider approval; never fake a successful payment.

Never trust frontend price totals, payment redirects, MIME headers, or client-supplied role claims.

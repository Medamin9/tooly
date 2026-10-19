# Data Model — Initial Guidance

The final schema must follow approved requirements, not this checklist blindly.

## Candidate entities
- User: id, email/phone (as required), password hash or external auth reference, status, timestamps.
- Role/Permission: only as complex as actual authorization needs.
- Category: slug, status, localized content relation.
- Product: provider/tool identity, category, publication status, delivery policy reference.
- PlanVariant: product, plan label, duration, features/restrictions, currency, price, availability.
- LocalizedContent: entity type/id, locale, translated name/description/SEO fields.
- ProductMedia: safe media reference, alt text, ordering.
- Order: customer, unique public order number, currency, subtotal/discount/total, state, timestamps.
- OrderItem: immutable product/plan/price snapshot at purchase time.
- Payment: provider, external reference, status, amount/currency, timestamps; never raw card data.
- PaymentEvent: idempotency key/provider event ID, verified payload metadata, processing state.
- Fulfillment: order item, status, delivery method, safe instructions/reference, timestamps.
- Promotion/Coupon: optional; eligibility, dates, limits, redemption policy.
- SupportTicket: customer, order reference if relevant, status, messages.
- AuditLog: actor, action, target, timestamp, safe metadata.

## Modeling rules
- Use UUIDs or another documented non-guessable ID strategy for sensitive records.
- Use unique constraints for emails/phones where appropriate and external provider event IDs.
- Add indexes for catalog filtering, order lookup by customer/status/date, and admin search.
- Store price snapshots on order items so later price changes do not alter historical orders.
- Use integer minor units or Prisma Decimal for money and document currency precision.
- Use explicit enums/state transitions for order/payment/fulfillment.
- Keep secrets and sensitive fulfillment data out of public DTOs and logs.
- Use migrations; never run `prisma migrate reset` against production.

# Tooly.tn — Product Requirements

## Product summary
Tooly.tn is a multilingual digital-tools/subscription marketplace initially targeting Tunisia. It helps customers discover eligible digital plans, compare transparent terms, purchase through supported payment methods, and manage orders.

## Target audiences
- Developers
- Designers
- Content creators
- Freelancers
- Students
- Small businesses and agencies

## Product principles
- Trust and transparency before conversion tricks
- Clear plan duration, eligibility, delivery method, renewal behavior, and support terms
- Mobile-first experience
- Arabic RTL, French, and English
- Honest availability and pricing
- Fast, accessible, privacy-conscious interface

## Customer-facing pages
1. Home: distinctive brand story, category discovery, selected offers, how it works, FAQs, clear CTA.
2. Catalog: search, filters, sort, categories, pagination/infinite loading only if appropriate.
3. Product detail: provider/tool, plan, duration, features, restrictions, delivery method, price/currency, refund/cancellation terms, support.
4. Cart/checkout: order summary, verified totals, selected payment method, clear terms, safe handoff to payment provider.
5. Order confirmation: server-verified state only; show pending when payment is not yet confirmed.
6. Customer account: profile, orders, subscription/access instructions, support requests.
7. Help/FAQ/contact.
8. Legal: terms, privacy, refunds/cancellations, acceptable use, cookie notice if needed.
9. Localized 404 and error states.

## Admin dashboard
- Protected login and server-side authorization
- Overview of real order/revenue metrics (never fabricated)
- CRUD for products, categories, plan variants, duration, price, availability, translations, media, and publication state
- Order management and status history
- Customer lookup with least-privilege access
- Promotions/coupons only if required
- Payment event visibility and reconciliation
- Support tickets/FAQ content
- Audit log for sensitive changes
- Admin settings and supported locale/content settings

## Product examples
Potential catalog categories may include AI assistants, design, video editing, professional networking, e-commerce, productivity, and developer tools. Examples supplied by the owner include Gemini Pro, Claude, ChatGPT, CapCut, Canva, LinkedIn Business, Grok, and Shopify.

These names are examples of possible products, not a statement that Tooly is affiliated with the providers or automatically authorized to resell their plans. The owner must verify terms and permitted fulfillment for each item before listing it.

## Order states
Use an explicit state machine, for example:
- draft
- pending_payment
- paid
- fulfillment_pending
- fulfilled
- failed
- cancelled
- refund_pending
- refunded
Exact transitions must be documented and enforced server-side.

## Acceptance criteria for MVP
- Customer can browse/search/filter published catalog items.
- Prices and plan terms come from the API/database, not hardcoded frontend constants.
- Customer can submit checkout and see pending/confirmed status accurately.
- Fulfillment occurs only after verified payment and eligibility checks.
- Customers can see only their own orders.
- Admin routes and API endpoints reject unauthenticated/unauthorized users.
- Admin can manage catalog, plan variants, prices, availability, and translations.
- Arabic/French/English UI works with correct RTL/LTR behavior.
- Core pages work on mobile, tablet, and desktop.
- Critical flows have automated tests.
- Legal, payment, and resale authorization dependencies are resolved before launch.

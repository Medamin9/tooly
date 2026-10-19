# Prompt 06 — Release readiness review

Use the `tooly-quality-review` skill. Review the whole changed scope against requirements and run all available checks.

Verify:
- Security and authorization
- Payment/webhook/fulfillment correctness
- Arabic RTL, French and English
- Responsive behavior and accessibility
- Reduced-motion and 3D fallback
- Performance and cache invalidation
- Database migration safety and backup assumptions
- Legal pages and provider authorization dependencies
- Error/loading/empty states
- Production build and automated tests

Produce a severity-ranked issue list. Do not claim production readiness if critical business, legal, payment, security, or operational dependencies remain unresolved.

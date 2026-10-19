# Prompt 05 — Checkout and payment integration

Do not implement a fake payment success flow. First ask for the selected payment provider and confirm availability for the target market.

Then implement:
- Server-calculated order totals and immutable order item price snapshots
- Pending payment state
- Hosted checkout/tokenized flow as supported by provider
- Signed webhook verification and idempotent event processing
- Amount/currency/order matching
- Fulfillment only after verified server-side payment
- Customer order history and accurate pending/success/failure states
- Refund/cancellation states where supported
- Unit and integration tests for forged, duplicate, delayed, failed and successful payment events

Never store raw card data.

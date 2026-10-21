# ADR 0001: Checkout via Ticketmelon outbound links

**Status:** Accepted · 2026-10-20 (proposed 2026-10-19)

## Context
Ticketmelon publishes no API, webhooks or embeddable checkout; event pages block iframes (`X-Frame-Options: SAMEORIGIN`). White-label exists only via sales.

## Decision
Ticket selection + cart on our site; payment on ticketmelon.com. Checkout redirects with Ticketmelon's `fast_checkout` URL param (pre-filled order), as wonderfruit.co does. Plain event links are the fallback mode. Ticket prices/status are maintained in our CMS. Attribution uses our `ticket_click` event, Ticketmelon-installed pixels, per-channel promo codes and CSV reconciliation.

## Consequences
+ Zero PCI scope, launch fast, no dependency on unpublished APIs.
- Manual price/status updates (risk R1, R6). Purchase attribution only as good as Ticketmelon's pixel setup (R2).
Undocumented param → confirm with Ticketmelon + weekly automated link health check.
Revisit if Ticketmelon offers a partner API or white-label.

# Ticketmelon Integration Spec

**Status:** DRAFT v0.1 · Source: [research/ticketmelon-integration-and-billing.md](research/ticketmelon-integration-and-billing.md) (researched 2026-10-19, every claim cited there)

## 1. What Ticketmelon offers (as of 2026-10-19)

| Capability | Available? | Implication |
|------------|-----------|-------------|
| Public / organizer API | **No** (none published); partner feed likely exists (see Wonderfruit) | Prices, tiers, sold-out status kept in our CMS manually |
| Webhooks | **No** | No automatic sales sync |
| Embedded checkout (iframe) | **No** — event pages send `X-Frame-Options: SAMEORIGIN` | Checkout opens on ticketmelon.com |
| Link to event page | **Yes** — `ticketmelon.com/{organizer}/{event}` | Fallback handoff |
| Pre-filled cart via URL (`fast_checkout`, `ticket_type_id`+`quantity`, `promo`, `aff1/2`) | **Yes, undocumented** — observed in Ticketmelon code + used by Wonderfruit | **Primary handoff**: cart on our site |
| White-label / "integrate into your website" | Sold via sales, no public docs/pricing | Future upgrade path, ask sales |
| Branded microsite | Sales only | Not needed — our site does this job |
| Meta Pixel + GA4 on event page | **Yes, installed by Ticketmelon staff** on request | Send them client's IDs |
| TikTok Pixel / our GTM container | UNVERIFIED | Ask |
| Promo codes | Yes | Use one code per channel for attribution |
| Sales export | CSV from organizer dashboard | Weekly reconciliation |

### Finding: on-site cart → pre-filled Ticketmelon checkout (2026-10-19)
Owner asked for ticket selection on our site with checkout on Ticketmelon. **This is possible.**

- **Live reference:** wonderfruit.co (Astro site, same stack we picked) has an on-site "Bag". Checkout builds
  `https://ticketmelon.com/wonderfruit/{eventId}?fast_checkout={"order":{"promo":{},"nopromo":{"<ticket_type_id>":qty,…}},"promocode":""}`
  and shows "You'll be redirected to ticketmelon.com" before handoff.
- **Platform-wide, not a Wonderfruit special:** Ticketmelon's own buyer-app JS (event page chunk) reads these query params on **every** event page:

| Param | Effect |
|-------|--------|
| `fast_checkout` | URL-encoded JSON order (ticket_type_id → qty, optional promo) → creates order straight away |
| `ticket_type_id` + `quantity` | Simpler form; comma-separated lists, e.g. `?ticket_type_id=a,b&quantity=2,1` |
| `promo` | Auto-applies a promo code (answers T3) |
| `aff1`, `aff2` | Affiliate/source tags (Ticketmelon's own homepage uses `?aff1=banner1`) |
| `calendar_template_id` | Date pick for calendar-type events |

  If buyer isn't logged in, Ticketmelon's login flow keeps `fast_checkout` and resumes to `/order/{order_id}` after sign-in.
- **Caveat:** undocumented. Must confirm with Ticketmelon that it's supported and won't change, and get each tier's `ticket_type_id` (32-char hex) from the organizer dashboard or account manager.
- **Verified 2026-10-20 (read-only):** a live public event's ticket list loads from `api-frontend.ticketmelon.com/v1/buyer/event-page/{event_id}/ticket-types/default`; each item has `ticket_type_id` (32-char hex), `price`, `min`/`max` per order, `remain`, `is_available`. Confirms the ID format our Bag uses. The redirect itself was **not** run on a third-party event (it creates a real order); run it on Eckho's own test event ([site/README.md](../site/README.md)).
- **Live stock:** Wonderfruit also calls its own `/api/tickets.json`, which returns `Items[{ticket_type_id, remain}]` — Ticketmelon-shaped availability data proxied by their server. Indicates a partner/organizer data feed exists. Ask Ticketmelon for the same; until then stock status is manual in CMS.

## 2. Handoff design

Two modes, same site; CMS toggle per edition.

**Mode A — On-site cart (recommended, Wonderfruit pattern)**
```
our site: tier cards → [ – 2 + ] qty steppers → Bag drawer (subtotal, "fees at checkout",
          promo field, "You'll be redirected to ticketmelon.com")
   │ Checkout click → GA4 begin_checkout / Meta InitiateCheckout (value, items)
   ▼
ticketmelon.com/{org}/{event}?fast_checkout=<json>&promo=<code>&aff1=<utm_source>&aff2=<utm_campaign>&utm_…
   │ login (if needed) → payment (GCash/Maya/card) → e-ticket
   ▼
Purchase event fires on Ticketmelon (their installed Meta Pixel + GA4)
```

**Mode B — Deep link (fallback)** if fast_checkout breaks or isn't approved: each tier CTA → event page (`?ticket_type_id=…&quantity=1` if supported, else plain event URL).

Rules:
1. Same-tab redirect (benchmark: keeps back button + analytics intact); tell buyer before redirect.
2. Cart lives in `localStorage` (survives refresh). Max qty per tier from CMS (match Ticketmelon limit).
3. UTMs from landing URL stored in `sessionStorage`; passed as `utm_*` and mapped to `aff1`/`aff2`.
4. Promo: per-channel codes via `promo` param (attribution in Ticketmelon CSV).
5. Bag shows face-value subtotal; VAT/fee wording follows the event's Ticketmelon config (Q8), e.g. "Service fee calculated at checkout on Ticketmelon."
6. Fire `add_to_cart`, `view_cart`, `begin_checkout` (GA4 ecommerce) + Meta `AddToCart`/`InitiateCheckout` with value — far richer funnel data than plain link clicks.
7. If a tier is sold out (CMS flag, or live feed later) disable its stepper and drop it from the cart.
8. Health check: scheduled job opens each tier's fast_checkout URL weekly in a headless browser and alerts if it fails (protects against Ticketmelon changes).

## 3. Attribution stack (best available without API)

| Layer | Measures | Confidence |
|-------|----------|------------|
| Our GA4 `ticket_click` | Intent to buy by channel | High |
| Ticketmelon-installed GA4 / Meta Pixel | Purchases on checkout | Medium (depends on their setup — confirm which events fire) |
| Cross-domain GA4 (our property ID on their page) | Session continuity site → checkout | Medium — needs their cooperation |
| Promo code per channel | Sales per channel in Ticketmelon CSV | High |
| Weekly CSV reconciliation | Truth for revenue | High |

## 4. Fees + billing (Philippines; reconfirm with sales — public pricing page now redirects)

| Item | Last published / observed |
|------|---------------------------|
| Ticketmelon service fee (PH) | 3.99% + ₱20 per ticket over ₱300 (event page config suggests 4% — confirm) |
| Payment processing | ~3% cards/e-wallets, on top |
| VAT | Fees exclude VAT |
| Setup / monthly fee | None. Free events: no fee |
| Who pays | Buyer by default; organizer can absorb in 0.5% steps |
| Refunds | Organizer pays 4% of face value; Ticketmelon fees not refunded |
| Payouts | Bank transfer. Conflicting sources: ≤14 business days after event (contract) vs on request in 5–10 business days (help centre) vs "weekly" (marketing) |
| Buyer payment methods (PH) | Cards, GCash, Maya, GrabPay, ShopeePay |

**Worked example** (₱3,000 GA ticket, buyer pays fees, figures illustrative): service fee ≈ ₱120 + ₱20 = ₱140; processing ≈ 3% ≈ ₱94; buyer pays ≈ ₱3,234 + VAT on fees. Client receives ₱3,000 face value.

The agency's fee is **separate** from Ticketmelon — it does not touch ticket money unless the performance option (doc 15 §5) is chosen.

## 5. Buyer data — legal flag

Ticketmelon organizer terms treat buyer personal data as Ticketmelon confidential info and restrict soliciting their customers. **Do not** import Ticketmelon buyer emails into marketing lists until legal/Ticketmelon confirms. Our own waitlist (opt-in, DPA-compliant) is the client's owned audience.

## 6. Questions for Ticketmelon sales (send before build)

1. Is there a partner API, webhook, or white-label checkout? Cost + docs?
2. Current PH fee schedule in writing (3.99% vs 4%, per-ticket fixed fee, VAT).
3. Payout schedule + any reserve/holdback for this event size.
4. Which pixel events fire (ViewContent, InitiateCheckout, Purchase with value)? TikTok Pixel? GTM container? GA4 cross-domain?
5. Do UTMs appear in organizer reports? Tracking links per channel?
6. Confirm `fast_checkout` / `ticket_type_id`+`quantity` / `promo` / `aff1-2` URL params are supported for organizers long-term; give us ticket_type_ids.
9. Can we get the availability feed Wonderfruit uses (`ticket_type_id`, `remain`)? Terms + cost?
7. Buyer data: what can the organizer use for marketing, with what consent?
8. On-sale capacity: queue system for high-demand drops?

## 7. Upgrade path

If sales offers an API/white-label: add a server sync job (CMS ← Ticketmelon) for prices + sold-out status, keep links as fallback. Architecture leaves room for this (see [10](10-architecture.md)).

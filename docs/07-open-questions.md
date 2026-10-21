# Open Questions and Decision Log

**Status:** LIVING DOCUMENT

## Decided

| # | Date | Decision | By |
|---|------|----------|----|
| D1 | 2026-10-19 | Market is Philippines; price in PHP, 12% VAT | Owner |
| D2 | 2026-10-19 | Event type: music festival | Owner |
| D3 | 2026-10-19 | Reusable multi-event site with CMS | Owner |
| D4 | 2026-10-19 | Placeholders `[Client]`/`[Event]` until names confirmed | Owner |
| D5 | 2026-10-19 | Checkout via Ticketmelon outbound links (no API/iframe exists) — ADR 0001, accepted 2026-10-20 | Owner |
| D6 | 2026-10-19 | Stack Astro + Sanity + Vercel — ADR 0002, accepted 2026-10-20 | Owner |
| D7 | 2026-10-19 | Stay with Ticketmelon; alternatives research dropped | Owner |
| D8 | 2026-10-19 | Ticket selection/cart on our site, checkout redirect to Ticketmelon (Wonderfruit pattern) | Owner |
| D9 | 2026-10-20 | Art direction: chrome theme (metallic / electronic / world music). G1 options = Liquid Chrome, Ancestral Circuit, Signal Steel ([04 §4](04-design-benchmark.md)) | Owner |
| D10 | 2026-10-21 | Working placeholders: event **Chrome: Dinagyang**, Sat 23 – Sun 24 Jan 2027 (moved from 16–17 on 2026-10-21, aligns with Dinagyang weekend), venue **ICON** (city assumed Iloilo City). Partly answers Q1 | Owner |
| D11 | 2026-10-21 | Design build uses **A · Liquid Chrome** colours for now; rework after showing client. B/C kept switchable in the review toolbar | Owner |
| D12 | 2026-10-21 | Client writes all copy (Q5) and supplies brand assets later (Q4). Agency uses placeholder copy/assets until then | Owner |
| D13 | 2026-10-21 | Design + UX first; Ticketmelon stays a placeholder slot (`ticketmelon.status = 'pending'`) until client + Ticketmelon answer | Owner |
| D14 | 2026-10-21 | **One stage, no live percussion.** Schedule is a single running order per night; Drum Yard / After Dark stages and drum copy removed | Owner |

## Open: client

| # | Question | Blocks |
|---|----------|--------|
| Q1 | ~~Name, dates, venue~~ placeholders set (D10). Still open: ICON full name/address, capacity, lineup | Copy, PDFs |
| Q2 | Does [Client] already have a Ticketmelon organizer account + account manager? | Integration |
| Q3 | Ticket tiers and phases planned (GA, VIP, group, early bird)? | Ticket page |
| Q4 | Brand assets exist (logo, fonts, colours) or do we create them? | Design scope + price |
| Q5 | ~~Who writes copy?~~ Client (D12) | — |
| Q6 | Languages: English only, or EN + Filipino/Taglish? | Scope |
| Q7 | Budget range and launch date (ticket on-sale date)? | Package fit, timeline |
| Q8 | Who pays fees: absorbed by client or passed to buyer? | Ticket page copy |
| Q9 | Newsletter tool already used (Mailchimp, Klaviyo, none)? | Waitlist build |
| Q10 | Ads running (Meta/TikTok)? Who manages them? | Tracking scope |

## Open: Ticketmelon

| # | Question | Blocks |
|---|----------|--------|
| T1 | ~~API or widget?~~ Researched: no public API/webhooks; iframe blocked. White-label via sales only — ask cost | Upgrade path |
| T2 | ~~Pixels?~~ Meta + GA4 installed by Ticketmelon staff. TikTok / GTM unverified — ask | Attribution |
| T3 | ~~URL pre-select/promo?~~ Yes: `fast_checkout`, `ticket_type_id`+`quantity`, `promo`, `aff1/2` (undocumented). Confirm support + get ticket_type_ids | Cart build |
| T9 | Availability feed (`remain` per ticket type) like Wonderfruit's? | Live sold-out status |
| T4 | ~~Sales data?~~ CSV export yes, webhooks no. Do UTMs show in reports? | Reporting |
| T5 | Current PH fee in writing (3.99% vs 4% + ₱20) | Client comms |
| T6 | Payout schedule + reserves | Client cash flow |
| T7 | Buyer data usage rights for marketing | Legal |
| T8 | Owner recalls a Ticketmelon "widget/button that redirects". Not found publicly (2026-10-19). Check organizer dashboard → event share/promote, or ask account manager | Ticket UX (no architecture change either way) |

Full question list: [09 §6](09-ticketmelon-integration.md).

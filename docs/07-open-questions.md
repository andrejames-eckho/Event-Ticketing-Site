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
| D15 | 2026-10-26 | Client accepted **Pro** package: ₱120,000 ex-VAT, 4–6 weeks, payment 50 / 30 / 20 ([15](15-business-model-and-pricing.md)). Build starts at G0 (signed proposal + 50% downpayment + Ticketmelon access) | Client |
| D16 | 2026-10-26 | **G0 passed (partial):** contract signed, 50% downpayment sent by client. Ticketmelon access still pending | Client |
| D17 | 2026-10-27 | New features added: **past-event videos** (YouTube) and **remix pack downloads** (zip) per festival, client-editable. Scope change and artist rights for remix packs settled with client | Owner |
| D18 | 2026-10-27 | Videos come from the client's **official YouTube channel** only; embedded via click-to-load facade ([ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md)) | Client |
| D19 | 2026-10-27 | Remix packs are **zip** files, stored on **Cloudflare R2**, uploaded from Sanity Studio direct to R2 ([ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md)) | Owner |
| D20 | 2026-10-27 | Domain DNS on **Cloudflare** (free plan). Needed for the R2 file subdomain. Registrar still open | Owner |
| D21 | 2026-10-27 | Video section: client chooses **3 to 10** videos per edition (Sanity rule). Owner supplying past-event links now | Owner |

## Open: client

| # | Question | Blocks |
|---|----------|--------|
| Q1 | ~~Name, dates, venue~~ placeholders set (D10). Still open: ICON full name/address, capacity, lineup | Copy, PDFs |
| Q2 | Does [Client] already have a Ticketmelon organizer account + account manager? | Integration |
| Q3 | Ticket tiers and phases planned (GA, VIP, group, early bird)? | Ticket page |
| Q4 | Brand assets exist (logo, fonts, colours) or do we create them? | Design scope + price |
| Q5 | ~~Who writes copy?~~ Client (D12) | — |
| Q6 | Languages: English only, or EN + Filipino/Taglish? | Scope |
| Q7 | ~~Budget~~ Pro agreed (D15). Still open: launch date (ticket on-sale date) | Timeline |
| Q8 | Who pays fees: absorbed by client or passed to buyer? | Ticket page copy |
| Q9 | Newsletter tool already used (Mailchimp, Klaviyo, none)? | Waitlist build |
| Q10 | Ads running (Meta/TikTok)? Who manages them? | Tracking scope |
| Q11 | Email gate on remix downloads: none, soft (link after waitlist signup) or strict (expiring link)? Built as a per-pack toggle, off by default | Remix page UX |
| Q12 | Largest expected remix pack size? Upload path handles up to 5 GB; confirm for storage estimate | R2 cost estimate |
| Q13 | ~~Which videos at launch?~~ Owner sending links (D21) | — |
| Q14 | Client creates the Cloudflare account (owner of R2 bucket + DNS); agency invited as member | R2 setup, DNS |

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

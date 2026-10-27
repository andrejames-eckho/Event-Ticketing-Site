# [Event]: Project Brief

**Status:** DRAFT v0.1 for review
**Owner:** Agency lead (you) · **Client:** [Client] · **Updated:** 2026-10-27 (videos + remix packs added)

## 1. One-liner

A fast, mobile-first festival website that turns hype into ticket sales, with every "Buy tickets" path ending in Ticketmelon checkout.

## 2. Problem

Today fans hear about [Event] on Instagram/TikTok and land on a bare Ticketmelon event page or a link-in-bio. That page sells, but it does not:

- tell the story of the festival (lineup, vibe, past editions, venue)
- answer the questions that block a purchase (how to get there, what's allowed, refunds, age limits)
- belong to the client (no owned audience, no SEO, no brand)
- give the client clean data on which ads and posts drove ticket sales

## 3. Goal

Make the website the single front door for [Client]'s festivals. Every social post, ad, press mention and QR code points here. The site does the convincing; Ticketmelon does the transaction.

## 4. Audience

| Segment | Need | What wins them |
|---------|------|----------------|
| Core fans (18–34, PH, mobile) | Lineup, price, date, "is it worth it" | Hero video, lineup grid, clear tiers, one tap to buy, past-event videos |
| DJs / producers | Material from the featured artists | Remix packs (zip) to download, clear licence |
| Groups / barkada | Coordinate a group buy | Group/bundle tiers, shareable links |
| Travellers (provincial + foreign) | Getting there, where to stay | Venue + travel guide, EN copy, map |
| Parents / first-timers | Safety, rules, refunds | FAQ, policies, age info |
| Sponsors / press | Credibility, reach | Past-edition stats, partners, press kit |

## 5. Success metrics (per edition)

| Metric | Target (proposed) | Source |
|--------|-------------------|--------|
| Site → Ticketmelon click-through on ticket page | ≥ 25% | GA4 outbound event |
| Share of ticket sales attributed to site/campaign links | ≥ 60% | Ticketmelon reports + UTMs |
| Mobile LCP | < 2.5 s | Lighthouse / CrUX |
| Newsletter/waitlist signups pre-sale | client sets | ESP |
| Client can update lineup/FAQ without dev | Yes | CMS |
| Client can swap videos (3–10) and upload remix packs without dev | Yes | CMS |
| Remix pack downloads per edition | client sets | GA4 `remix_download` |

## 6. Scope summary

In: multi-event site with CMS, festival pages, ticket tiers that deep-link to Ticketmelon, lineup, schedule, venue/travel, FAQ, waitlist/newsletter, analytics + ad pixels, SEO, past editions archive, past-event videos (YouTube), remix pack downloads.

Out: our own checkout, payments, seat maps, e-tickets, check-in (all Ticketmelon). See [03-non-goals](03-non-goals.md).

## 7. Constraints

- Ticketmelon owns checkout. Integration depth depends on what they expose (see [09](09-ticketmelon-integration.md)).
- Philippine market: mobile-heavy traffic, variable connection speed, GCash/Maya payment culture.
- Reusable across editions and future events: no hard-coded event content.

## 8. Decisions so far

| Date | Decision |
|------|----------|
| 2026-10-19 | Market: Philippines (PHP, 12% VAT) |
| 2026-10-19 | Event type: music festival |
| 2026-10-19 | Site is a reusable multi-event platform, not a one-off microsite |
| 2026-10-19 | Client/event names are placeholders until confirmed |
| 2026-10-27 | Add past-event videos (client's YouTube channel, 3–10 per edition) and remix pack downloads (zip, Cloudflare R2). [ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md) |

# Information Architecture

**Status:** DRAFT v0.1 · Based on [04](04-design-benchmark.md), content model [11](11-content-model.md)

## 1. Sitemap (multi-event)

```
/                                   Brand hub → featured current edition (or redirect if one event)
/[event]/                           Event home = current edition (long-scroll funnel)
/[event]/tickets                    Tiers, phase ladders, Bag, ticket FAQ
/[event]/lineup                     Typographic lineup + filters
/[event]/lineup/[artist]            Artist page (SEO, shareable OG image)
/[event]/schedule                   Set times ("coming soon" state until published)
/[event]/info                       Plan your trip: venue, map, getting there, stay, rules, accessibility
/[event]/faq                        Full FAQ, searchable
/[event]/remix                      Remix packs from featured artists (current edition), licence + download
/[event]/[year]                     Past edition archive: recap, aftermovie, gallery
/news, /news/[slug]                 Announcements, lineup drops
/about                              [Client] story, partners, press kit
/legal/terms | privacy | refunds | code-of-conduct
(/fil/... mirrored routes — Premium only)
```

## 2. Event home — scroll order (mobile first)

1. Sticky header: logo · date · **Tickets** pill (label from `saleState`) · menu
2. Hero: muted video/poster + scrim · name · date · venue · city · "Get tickets" + "See lineup" · status line ("Phase 2 on sale · ends 30 Nov")
3. Sale strip / countdown (only with real date)
4. Lineup teaser: headliners big → typographic list → "Full lineup →"
5. Tickets preview: 2–4 tier cards with phase ladder, "From ₱x", add-to-bag
6. Experience tiles (stages, food, beach/camping)
7. Packages / barkada bundles
8. Venue + getting there (static map, transport chips)
9. Social proof: past stats, press, past-event videos (3–10, click-to-load): first one big, rest in a 3-col grid (2-col tablet, swipe row on phones)
9b. Remix packs strip: 2–4 pack cards → "All remix packs" (hidden when no packs released)
10. FAQ top 6 → "All FAQs"
11. Waitlist / newsletter
12. Footer: partners, socials, legal, "Official ticketing partner: Ticketmelon", contact

## 3. Tickets page

Status banner → buyer tabs (1-Day / Weekend / VIP / Barkada) → tier cards with qty stepper + phase ladder → "What's included" comparison (accordion on mobile) → add-ons → plain-language fees, VAT, age, refund policy → ticket FAQ → payment methods row (GCash, Maya, cards, GrabPay, ShopeePay) + "Checkout powered by Ticketmelon".

## 4. Bag (cart drawer)

- Line items: tier, phase, qty stepper, remove
- Promo code field (passed as `promo` param)
- Subtotal (face value) + "Service fee calculated at checkout"
- **Checkout** button + "You'll be redirected to ticketmelon.com"
- Mobile: full-height sheet; desktop: right drawer
- Persisted in `localStorage`

## 4b. Videos + remix packs

- **Video card:** thumbnail (click-to-load facade), title, event label · type. Play loads player inline; no YouTube request before click. Max 10 → all fit on the homepage, no separate videos page.
- **Artist page:** that artist's videos + their remix pack card (if released).
- **Remix pack card:** cover, artist, title, contents (BPM, key, stems), file size, **Download** (`.zip`). Licence shown above the button.
- **Email gate (per pack):** `none` = direct link · `soft` = waitlist form, link revealed after submit · `strict` = form, then expiring link from function.
- **Past edition archive** (`/[event]/[year]`) shows that edition's aftermovie + gallery; its remix packs only if client keeps them live.

## 5. Global elements

| Element | Rule |
|---------|------|
| Sticky ticket bar (mobile) | Appears after hero; shows "From ₱x · Phase 2 · Get tickets", or bag count + total when bag has items. Hidden when tier grid in view. Never stacked with cookie banner. |
| Cookie banner | Compact bottom; "Reject" equal weight to "Accept" |
| Waitlist | Replaces CTA on sold-out tiers ("Join waitlist") |

## 6. `saleState` matrix

| State | Hero CTA | Tier cards | Sticky bar |
|-------|----------|-----------|------------|
| announce | Get notified | Hidden or "Coming soon" | Get notified |
| presale | Unlock presale | Code-gated note | Presale live |
| onsale | Get tickets | Stepper active | From ₱x |
| final | Last chance | "Few left" chips | Last tickets |
| soldout | Join waitlist | Sold out chips | Join waitlist |
| past | Watch recap | Hidden | Next edition: notify me |

## 7. Navigation

Header: Lineup · Tickets · Schedule · Info · FAQ · (Remix) · (News). Remix appears only when a pack is released. Mobile: hamburger + Tickets pill always visible.

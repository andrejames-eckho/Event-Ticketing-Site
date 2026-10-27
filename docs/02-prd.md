# [Event]: Product Requirements (PRD)

**Status:** DRAFT v0.1 for review
**Priority key:** P0 = launch blocker · P1 = launch if possible · P2 = later phase

## 1. User stories

| ID | As a… | I want… | So that… | P |
|----|-------|---------|----------|---|
| US1 | fan on mobile | to see date, venue, price and a Buy button within one screen | I can decide fast | P0 |
| US2 | fan | to compare ticket tiers side by side | I pick the right one | P0 |
| US3 | fan | pick tiers + quantities on the site, then land on Ticketmelon with my cart already filled | I just pay | P0 |
| US4 | fan | to see what's sold out and what phase pricing is in | I buy before price goes up | P0 |
| US5 | fan | to browse the lineup and listen to artists | I get hyped | P0 |
| US6 | first-timer | a clear FAQ (age, bag policy, refunds, re-entry) | I feel safe buying | P0 |
| US7 | traveller | venue map + how to get there + where to stay | I can plan the trip | P1 |
| US8 | fan before sale | to join a waitlist | I get notified at on-sale | P0 |
| US9 | group organizer | a shareable link for a group tier | my barkada can buy | P1 |
| US10 | fan | set times / schedule closer to the date | I plan my day | P1 |
| US11 | sponsor | partner logos and past stats | I see the reach | P2 |
| US12 | client marketer | edit lineup, tiers, FAQ, banners without a developer | I move fast | P0 |
| US13 | client marketer | see which channel sold tickets | I spend ads wisely | P0 |
| US14 | client | spin up the next edition/event from a template | I reuse the site | P0 |
| US15 | fan | past editions recap (aftermovie, photos) | I trust the festival is good | P1 |
| US16 | fan | watch videos from past Chrome events on the homepage | I get a feel for the vibe before buying | P0 |
| US17 | DJ / producer | download remix packs from this festival's featured artists | I can remix and play their tracks | P0 |
| US18 | client marketer | choose 3–10 videos and upload remix packs myself each festival | the site stays current without a developer | P0 |

## 2. Functional requirements

### Tickets (P0)
- FR1 Ticket section on home + dedicated `/tickets` page per edition.
- FR2 Tier cards: name, price (PHP), what's included, phase, status (on sale / sold out / coming soon), CTA.
- FR3 On-site cart: qty steppers on tier cards, Bag drawer with subtotal + promo field; Checkout redirects to Ticketmelon with order pre-filled (`fast_checkout`), UTMs/promo preserved (see [09](09-ticketmelon-integration.md)). Fallback: per-tier deep link.
- FR4 Tier status and price are editable in CMS (manual), or synced via API if Ticketmelon provides one.
- FR5 Sticky "Get tickets" bar on mobile on all edition pages.
- FR6 Optional countdown to on-sale / phase change.
- FR7 Fee disclosure line (e.g. "Prices exclude Ticketmelon service fee") editable in CMS.

### Content (P0/P1)
- FR8 Lineup grid with artist detail (photo, bio, Spotify/YouTube embed, day). P0
- FR9 Schedule / set times, filter by day + stage. P1
- FR10 Venue page: map, transport, parking, accommodation partners. P1
- FR11 FAQ accordion, grouped by topic, searchable. P0
- FR12 Policies: terms, refunds, privacy, code of conduct. P0
- FR13 Past editions archive with gallery + aftermovie. P1
- FR14 Partners / sponsors section. P2
- FR15 News / announcements (lineup drops). P1

### Videos + remix packs (P0, added 2026-10-27, [ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md))
- FR25 Homepage video section: **3 to 10** YouTube videos per edition from the client's official channel. First = featured. CMS blocks publish outside 3–10 or with duplicates. **Built.**
- FR26 Videos load click-to-play (thumbnail only, `youtube-nocookie.com`); dead, private or non-embeddable links hidden at build. **Built.**
- FR27 Remix packs: `/remix` page, card on artist page, homepage strip. Each pack: cover, artist, BPM/key/stems, size, licence, Download (.zip). Planned.
- FR28 Client uploads zip inside Sanity Studio; file stored on Cloudflare R2 (any size up to 5 GB), served from `files.<domain>`. Scheduled release (`releaseAt`) and optional expiry. Planned.
- FR29 Optional email gate per pack: none / soft / strict (Q11). Default none. Planned.
- FR30 Tracking: `video_play` (built) and `remix_download` events to GA4 via GTM.

### Growth + tracking (P0)
- FR16 Waitlist / newsletter form → client ESP; consent checkbox (PH Data Privacy Act). P0
- FR17 GA4 + GTM; Meta Pixel + CAPI; TikTok Pixel. Consent banner. P0
- FR18 UTM pass-through from landing to Ticketmelon link. P0
- FR19 Outbound click event `ticket_click` with tier + edition params. P0
- FR20 Open Graph images per edition/artist for sharing. P0
- FR21 SEO: event JSON-LD (`MusicEvent`, `Offer`), sitemap, meta. P0

### Platform (P0)
- FR22 Multi-event: Event → Edition → content. Home shows "current" edition; archive for past.
- FR23 CMS with roles (admin, editor), draft/preview, scheduled publish (for lineup drops).
- FR24 Custom domain, HTTPS, CDN.

## 3. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Mobile LCP < 2.5 s on 4G; Lighthouse perf ≥ 90 |
| NFR2 | Handles on-sale spike (10k+ concurrent) — static/CDN pages, no server bottleneck |
| NFR3 | WCAG 2.2 AA: contrast, keyboard, alt text, reduced motion |
| NFR4 | Philippine Data Privacy Act 2012 compliant forms + privacy notice |
| NFR5 | 99.9% uptime during sale windows |
| NFR6 | Works on low-end Android + Chrome / Safari last 2 versions |
| NFR7 | Video embeds add no JS or third-party requests before click |
| NFR8 | Remix downloads never served from Sanity or Vercel (bandwidth caps); upload signing requires a logged-in Sanity editor |

## 4. Out of scope
See [03-non-goals](03-non-goals.md).

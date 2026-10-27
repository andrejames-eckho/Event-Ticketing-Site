# Chrome: Dinagyang — design build

Full multi-page design build of the festival site (look and feel, UI/UX) with every Ticketmelon touchpoint as a placeholder slot. Also proves the Bag → Ticketmelon `fast_checkout` handoff ([ADR 0001](../docs/adr/0001-checkout-via-ticketmelon-links.md), [docs/09 §2](../docs/09-ticketmelon-integration.md)) once we have a test event.

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # URL builder unit tests
npm run build
```

## Pages

| Route | What |
|-------|------|
| `/` | Event home funnel (docs/08 §2): hero, lineup teaser, ticket preview, experience, venue, recap, FAQ, waitlist |
| `/tickets` | Tier cards with phase ladders + qty steppers, filters, GA vs VIP comparison, how-it-works, fees, ticket FAQ |
| `/lineup`, `/lineup/[slug]` | Typographic poster + artist grid, day filter; artist pages |
| `/schedule` | Set times by day and stage (`scheduleReleased: false` shows the "coming soon" state) |
| `/info` | Venue, getting there, stays, what to bring, accessibility |
| `/faq` | Searchable, grouped by topic |
| `/legal/*`, `404` | Placeholder legal pages, not-found page |

## Content and placeholders

- **All content lives in [src/data/event.js](src/data/event.js)**, with field names from [docs/11](../docs/11-content-model.md) so it moves to Sanity 1:1. Comments mark each value `CONFIRMED-PH` (owner's working placeholder), `PLACEHOLDER` (client, Q*) or `PENDING-TM` (Ticketmelon, T*).
- Placeholder copy and assets are flagged on the page with dashed tags (yellow = client, teal = Ticketmelon) and striped photo/video/map blocks that describe the shot needed. The client writes the final copy and supplies the brand assets.
- **Past-event videos** (homepage recap): paste YouTube links into `pastVideos` in [src/data/event.js](src/data/event.js) (3 to 10, first = featured). Empty `youtubeUrl` shows a placeholder slot; dead or private links are dropped at build. Sanity version of the same rule: [../studio/schemaTypes/pastVideo.js](../studio/schemaTypes/pastVideo.js).
- Logo, favicon, hero art and ring motif are agency placeholders built in CSS/SVG (no image files).

## Review toolbar

The **Review** button (bottom left) switches:
- **Art direction**: A Liquid Chrome (current default, D11), B Ancestral Circuit, C Signal Steel. Tokens live in [src/styles/global.css](src/styles/global.css).
- **Sale state**: announce / presale / onsale / final / soldout / past (docs/08 §6). Changes CTAs, banners, ticket cards and the sticky bar.
- **Placeholder tags** on/off, for a clean client walkthrough.

You can also use URL params: `?theme=b&state=soldout`. Build with `PUBLIC_REVIEW=false` to remove the toolbar.

## Ticketmelon slots (pending)

`ticketmelon.status` in `event.js`:
- `pending` (default): Checkout opens a **Checkout preview** dialog showing the URL we would send. No redirect.
- `test` / `live`: real redirect. Switches to `test` automatically when `PUBLIC_TM_EVENT_URL` is set.

Still waiting on: event URL + ticket_type_ids (Q2, T3), availability feed (T9), fee wording (T5, Q8), payment methods for the client's account, ESP for the waitlist (Q9).

## Wire it to a real Ticketmelon event

1. **Create an Eckho test event on Ticketmelon** (organizer.ticketmelon.com, self-serve signup). Use 3 ticket types matching the placeholders: 2-Day GA, 2-Day VIP, Airport Shuttle. Keep it unlisted/private if the dashboard allows. Price can be ₱0 (free events have no fees) or a low test price.
2. **Get each `ticket_type_id`** (32-char hex) from the organizer dashboard, or from the event page's ticket list request in browser devtools (Network → `ticket-types`).
3. **Run with env vars** (or put them in `.env`, git-ignored):

   ```bash
   PUBLIC_TM_EVENT_URL="https://www.ticketmelon.com/<organizer>/<event>" \
   PUBLIC_TM_TICKET_IDS="weekend=<id>,vip=<id>,shuttle=<id>" \
   npm run dev
   ```

   `PUBLIC_TM_MODE=deep_link` switches to Mode B (fallback: one button per tier, no Bag).

## Test script (do this before the client demo)

| # | Step | Pass if |
|---|------|---------|
| 1 | Open `/?utm_source=tiktok&utm_campaign=launch`, add 2 × 2-Day GA + 1 VIP, open Bag, Checkout | Handoff dialog shows URL with `fast_checkout`, `aff1=tiktok`, `aff2=launch` |
| 2 | Continue to Ticketmelon, **logged out** | Lands on login; after login, resumes to `/order/{id}` with 2 GA + 1 VIP |
| 3 | Same, **logged in** | Goes straight to order with the right tiers + quantities |
| 4 | Enter a promo code created on the test event | Discount applied on Ticketmelon |
| 5 | Complete one purchase (₱0 tier or lowest price) | E-ticket issued; order shows in organizer dashboard + CSV export |
| 6 | Check CSV / sales report | `aff1`/`aff2` (or UTMs) visible per order — answers T4 |
| 7 | Mobile (iOS Safari + Android Chrome), GCash flow | Same as 2–5 |
| 8 | `PUBLIC_TM_MODE=deep_link` | Tier pre-selected on Ticketmelon, or at least event page opens |

Record results in [docs/09](../docs/09-ticketmelon-integration.md) §1 (date + pass/fail per row). Bad result on 2/3 → fall back to Mode B for launch (roadmap critical path).

Note: `fast_checkout` creates a real order on Ticketmelon. Only point this at events we own.

## Analytics

Events go to `window.dataLayer` in GA4 ecommerce format: `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout` (currency PHP, value, items with `item_id` = ticket_type_id). GTM container added in build week 4.

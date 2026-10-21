# Design Benchmark Summary

**Status:** DRAFT v0.1 · Full teardown + screenshots: [research/event-website-design-benchmark.md](research/event-website-design-benchmark.md), [research/screens/](research/screens/)

## 1. The 10 sites

| # | Site | Type | Why it's here |
|---|------|------|---------------|
| 1 | Coachella | Mega festival (US) | Mature funnel: passes, payment plans, waitlists |
| 2 | Tomorrowland | Multi-event festival brand | Brand hub + per-event sites (matches our multi-event model) |
| 3 | Glastonbury | Heritage festival (UK) | Best accessibility; weakest funnel (what not to do) |
| 4 | Primavera Sound | Festival + tours | Ticket list rows, status chips, "From €x + fees" |
| 5 | **Wonderfruit** (TH) | Boutique festival | **Uses Ticketmelon.** On-site bag → pre-filled checkout. Our reference build |
| 6 | **DWP** (ID) | EDM festival | **Uses Ticketmelon** (international buyers). SEA market, group packs, instalments |
| 7 | Web Summit | Conference | Best tier comparison table, "Most popular" seals |
| 8 | Stripe Sessions | Brand conference | Minimal, sticky Register pill, on-page FAQ |
| 9 | The Weeknd tour | Concert tour | Tour-date list pattern |
| 10 | OFFF Barcelona | Design festival (award style) | Qty stepper + sticky "Total / Continue" bar |

PH festival sites (Wanderland, Malasimbo, Rakrakan) were checked: parked or offline. **Gap in the PH market** — a polished festival site is a differentiator for [Client].

## 2. Patterns we adopt

1. "Tickets" pill always in header + one bottom sticky bar on mobile.
2. One `saleState` setting drives hero copy, CTA labels, card states (announce → presale → on sale → final → sold out → past).
3. Tier cards with **phase ladder**: past phases struck "Sold out", current highlighted, next + at-door price faint.
4. "From ₱x" on every card; fees/VAT stated before checkout.
5. Honest urgency only: status chips (On sale, Few left, Sold out, Most popular), countdown only for real dates with time zone (PHT).
6. **On-site Bag → Ticketmelon** (Wonderfruit pattern), same tab, "You'll be redirected to ticketmelon.com" notice.
7. Lineup set as typography; day tabs.
8. Group/barkada packs, instalments if Ticketmelon supports, FAQ accordion, waitlist on every page.

## 3. Avoid

- No prices on site (The Weeknd) — every click is blind.
- Tiny mono labels (Primavera) — fails mobile readability.
- Heavy map iframes / autoplay video at load — kills PH 4G speed.
- New-tab checkout — breaks in Instagram/TikTok/FB in-app browsers.
- Fake urgency timers / "X people viewing".

## 4. Art direction: Chrome (owner direction)

**Brief (owner, 2026-10-20):** lean into chrome. Metallic, electronic, world music. All three G1 options are variations on that theme. Earlier options (Golden Hour Fields, Signal Red Night, Editorial Grid) are dropped; see [research §9](research/event-website-design-benchmark.md) for history.

| | A — Liquid Chrome | B — Ancestral Circuit | C — Signal Steel |
|---|---|---|---|
| Mood | Y2K, airbrushed liquid metal, iridescent, euphoric. Rave flyer meets future-pop | Metal as craft: hammered brass and bronze, gong rings, woven patterns. Electronic music with roots | Cold, minimal, techno. Brushed steel, scan lines, HUD labels |
| Metal | Polished silver + holographic sheen | Brass, bronze, patina | Brushed steel, gunmetal |
| Palette | Black `#07080A` · Chrome `#F4F6F8 → #9DA3AD → #3B3F46` · Aqua `#7FF3E1` (CTA) · Lilac `#B9A6FF` · Paper `#EEF0F3` | Night `#0E0C0A` · Brass `#D9B35C` · Bronze `#B0793E` · Patina `#3F8F82` · Ember `#E4572E` (CTA) · Bone `#EFE7DA` | Void `#0B0B0E` · Steel `#C9CCD3` · Gunmetal `#2A2D33` · Signal Red `#FF3B30` (CTA) · Ice Cyan `#5CE1E6` (VIP) |
| Type | Unbounded (display) + Inter | Syne (display) + Space Grotesk | Big Shoulders Display + JetBrains Mono (labels ≥ 14px) |
| Motifs | Liquid-metal blobs, chrome logo lockup, holo foil tier cards | Concentric gong/soundwave rings (kulintang reference), woven grid patterns, embossed tier cards | Notched ticket-stub cards, waveform dividers, mono data labels, split marquee |
| Best for | Pop-electronic, younger crowd, high-energy launch | World / folk-electronic, cross-genre, cultural positioning | Techno, house, EDM, night events |

### Rules for all three
1. **Chrome is for display only:** logo, headlines, headliner names, badges. Body text, prices and CTAs use solid colour. Gradient text has uneven contrast and fails WCAG.
2. **Dark base by default** (chrome reads best on black). Ticket list, FAQ and Bag keep AA contrast (4.5:1 min).
3. **Light on bytes:** metal comes from CSS gradients, SVG filters and pre-rendered AVIF/WebP. No WebGL or 3D at load. An optional hero shader loads after LCP, desktop only, and is skipped under `prefers-reduced-motion`.
4. **Option B, cultural care:** commission a Filipino artist for patterns and credit them. Don't use sacred or community-owned indigenous designs (e.g. T'nalak, okir) without the community's consent.

**Update 2026-10-21:** event has one stage and no live percussion ([07 D14](07-open-questions.md)); B's gong/kulintang motifs read as percussion, so weigh that at G1. Current build uses A ([07 D11](07-open-questions.md)).

**Recommendation:** lead with **B** if the lineup has world / folk-electronic acts (best fit for the brief, and nothing else in the PH market looks like it). Use **A** for a pop / Y2K crowd and **C** for a techno / EDM lineup. Confirm with Q1 (lineup, genre) and Q4 (existing brand).

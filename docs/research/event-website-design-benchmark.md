# Event Website Design Benchmark

**Purpose:** inform the design of a new event website whose ticket funnel hands buyers off to **Ticketmelon** checkout.
**Research date:** 2026-10-19. All sites were loaded live in headless Chromium at 1440×900 (desktop) and 390×844 (iPhone UA). Cookie banners were declined, or hidden when there was no decline option. No forms were filled and nothing was bought.
**Screenshots:** `docs/research/screens/` (see the index at the bottom).

---

## 0. TL;DR

- **Two of the ten benchmark sites already send buyers to Ticketmelon.** Wonderfruit (TH) uses an on-site bag that says "You'll be redirected to ticketmelon.com" at checkout. DWP (Jakarta) sends international buyers to `ticketmelon.com/dwp/dwp26` and Indonesian buyers to Loket. These are the most directly copyable reference flows.
- The sites that convert best follow the same sequence: **event facts → "Tickets" CTA you can always see → on-site tier cards with price and status → one clear handoff.** The ticket page is a real page on the event site. It is never just a link to the vendor.
- Urgency comes from **phase pricing shown in the open** (Wonderfruit, Web Summit, Stripe), **status badges** (Sold out, Limited stock, On sale), and **countdowns tied to a real sale moment** (Wonderfruit, DWP). Fake timers don't appear on any of these sites.
- Mobile: the best sites keep a **"Tickets" CTA visible on every screen**. Some use a sticky header pill (Web Summit, Stripe, OFFF, Coachella). Wonderfruit uses a bottom sale bar with a countdown. Several big festivals don't do this at all.

---

## 1. Site selection and justification

| # | Site | Type | Why it was picked |
|---|------|------|-------------------|
| 01 | [coachella.com](https://www.coachella.com) | Mega music festival (US) | Category leader with a mature funnel: pass types, payment plan, waitlists, AXS handoff, accessibility phone line. |
| 02 | [tomorrowland.com](https://www.tomorrowland.com) + [winter.tomorrowland.com](https://winter.tomorrowland.com/en/tickets/) | Festival brand, multi-event | Shows a brand hub with an events calendar and per-event sites, plus packages, Queue-it and account-based checkout. |
| 03 | [glastonburyfestivals.co.uk](https://www.glastonburyfestivals.co.uk) | Heritage festival (UK) | The opposite approach: news-led, sells out on demand and has no funnel on site. It is the strongest accessibility example in the set (skip link, colour and contrast modes). |
| 04 | [primaverasound.com](https://www.primaverasound.com/en/barcelona) | Festival plus tours (ES) | Design-led and editorial. Good **ticket list rows** with status chips and "FROM €x + fees". |
| 05 | [wonderfruit.co](https://wonderfruit.co) | Boutique festival (Thailand) | **Uses Ticketmelon.** On-site bag, then redirect. Shows phase pricing in public and has a sale countdown bar. Closest match to our market and stack. |
| 06 | [dwpfest.com](https://dwpfest.com) | EDM festival (Indonesia) | **Uses Ticketmelon for international buyers.** Countdown, tier cards, group packs, "Reserve & Hold" instalments, travel packages. SEA market. Replaces Wanderland/Malasimbo/Rakrakan: the Wanderland domain is parked and the other two PH sites didn't resolve to a festival site. |
| 07 | [websummit.com](https://websummit.com/tickets/attendees/) | Large tech conference | Best-practice **tier comparison table**, strikethrough pricing, "Most popular" and "Limited stock" seals, audience tabs. |
| 08 | [stripesessions.com](https://stripesessions.com) | Brand conference | Apple/Stripe-style minimalism: one pass, early-bird price with an expiry date, sticky Register pill, agenda at a glance, FAQ on the page. Replaces Figma Config, which is between editions (screenshot kept as `12-config-*`). |
| 09 | [theweeknd.com/tour](https://www.theweeknd.com/tour/) | Stadium concert tour | The standard **tour-date list**: date, venue and city rows with TICKETS and VIP TICKETS buttons, a "New Show" badge, and a Live Nation handoff. (Coldplay's tour page currently lists no dates.) |
| 10 | [offf.barcelona](https://www.offf.barcelona) | Design festival (award-winning, Awwwards/FWA-style) | Expressive art direction (video collage, Swiss/brutalist type). **Quantity stepper on the page with a sticky "Total / Continue" bar.** |

Also reviewed, not scored: **Dekmantel** (`11-dekmantel-*`, an award-winning, very type-led site with a "Tickets" sticker in the corner), **Figma Config** (`12-config-*`, post-event state), **Sónar**, **Linkin Park tour**.

---

## 2. Site-by-site teardown

### 01 — Coachella
- **URL:** https://www.coachella.com · /passes
- **Hero:** full-bleed desert sunset photo with a large serif headline that changes with the sale state ("2027 Advance Sale — Passes No Longer Available"). A rainbow rule sits below it. The Ferris wheel line drawing is the brand mark.
- **Ticket CTA:** sticky nav pill **"Join Waitlist"** (it says "Buy" when passes are on sale). The hero repeats it as "Join Waitlist W1 / W2". Secondary text links: View Passes →, View Camping →, Bundle Hotel & Passes →.
- **Tier presentation:** a /passes page with jump links (Festival Passes, Camping, Parking & Shuttles, Add-Ons, Travel). Each pass is a stacked card with a description, price and per-weekend buttons. A plain-language note reads: *"No difference in 'tiers' other than price. Buy early to save."* Shows "service fees included in price".
- **Urgency:** "No Longer Available" and "Sold Out" states on cards, waitlist per weekend, "Prices subject to change while supplies last".
- **Lineup:** a famous poster-style lineup (out of season during the visit).
- **Schedule:** set times are released close to the event, in the app.
- **Venue/travel:** a full "Plan" mega-menu covering camping, shuttles, hotel packages and parking.
- **FAQ:** a deep FAQ/Info hub.
- **Mobile:** the sticky header keeps date and "Join Waitlist" visible. Hero CTAs stack full width.
- **Checkout handoff:** third party (**AXS**) opened in a **new tab** (`target=_blank` to axs.com waitlist). Hotel bundles go to `hospitality.coachella.com` in a new tab.
- **Trust:** Amex partnership passes, official resale, payment plan ("$49 down"), fees included.
- **Type/colour:** "Perfectly Nineties" display serif with "Funnel Sans" body. Cream, forest green and sunset gradients.
- **Motion:** light; mostly static.
- **Accessibility:** the very first line is a phone number for screen-reader users. That's thoughtful, but there's no skip link and `<html lang>` is empty.
- **Steal:** fees-included pricing, payment-plan messaging, jump-link nav on the passes page, a hero headline that reflects the sale state.
- **Avoid:** CTA overload in the hero (6 links). The W1/W2 split is confusing for anyone who hasn't been before.

### 02 — Tomorrowland
- **URL:** https://www.tomorrowland.com · https://winter.tomorrowland.com/en/tickets/
- **Hero:** cinematic photo of the stage with a centred title, a status sub-line ("4- & 7-Day Packages are Sold Out. Festival Tickets still available.") and a ghost "MORE INFO" button.
- **Ticket CTA:** on the hub it is per event in a horizontal **events calendar** (TICKETS & INFO / SOLD OUT / PRE-REGISTER). Each event site has "Tickets" in its sub-nav.
- **Tier presentation:** "Discover the Tickets" image cards (Festival Ticket, Ticket + Accommodation, + Transport, Discover Paris) with **SOLD OUT ribbons**. Hospitality and Business packages are kept separate.
- **Urgency:** sold-out ribbons, "Worldwide Ticket Sale is now open", pre-registration as a gate.
- **Lineup/schedule:** a Line-Up item in the sub-nav. Strong storytelling and a documentary.
- **Venue/travel:** "Practical" section, Global Journey travel packages.
- **FAQ:** dedicated sub-nav item.
- **Mobile:** fixed header; no sticky buy bar.
- **Checkout handoff:** `my.tomorrowland.com` account checkout behind a **Queue-it** waiting room (`queue.tomorrowland.com`), same tab.
- **Trust:** official account, queue fairness, official store.
- **Type/colour:** Europa (geometric sans). Deep aubergine/black with fairy-tale imagery.
- **Motion:** carousels, a floating radio player widget.
- **Accessibility:** no skip link, empty `lang`, small low-contrast ghost buttons.
- **Steal:** sale status line under the hero title; pre-registration for the next edition; package tiers kept apart from the basic ticket.
- **Avoid:** making the visitor go hub → event site → tickets page → account → queue. That's too many steps for a single-event site.

### 03 — Glastonbury
- **URL:** https://www.glastonburyfestivals.co.uk
- **Hero:** illustrated logo banner with a colourful tab nav. The page is a **news grid**, not a hero.
- **Ticket CTA:** no buy button. Tickets are a news story ("2027 Ticket Information Confirmed") plus registration, sold via **See Tickets** (`glastonbury.seetickets.com`, new tab).
- **Tier presentation:** none on the site. It's a single ticket type plus coach packages, explained in prose.
- **Urgency:** comes from outside the site (it sells out in minutes). The site says nothing about scarcity.
- **Lineup:** Line-Up and Areas pages, very rich.
- **Venue/travel:** a deep Info section.
- **FAQ:** Info section.
- **Mobile:** hamburger; nothing sticky other than the accessibility menu.
- **Checkout:** third party, new tab, registration required beforehand.
- **Trust:** charity giving ("£4.2M"), heritage.
- **Type/colour:** Bebas Neue Pro semi-expanded. Navy with carnival multicolour.
- **Accessibility (best in set):** **skip link**, an **Accessibility Options** menu with Normal, Greyscale and High-contrast colour modes, `lang="en-GB"`, every image has alt text.
- **Steal:** the accessibility toolkit, especially a high-contrast mode, which a festival audience at night and outdoors will use.
- **Avoid:** using it as a funnel model. It only works because demand far outstrips supply.

### 04 — Primavera Sound
- **URL:** https://www.primaverasound.com/en/barcelona · /barcelona/tickets-barcelona
- **Hero:** brand dot-grid graphic next to the **full typographic lineup poster** (headliners large, then smaller tiers). This is the hero for the edition.
- **Ticket CTA:** a persistent **"TICKETS"** pill at the top right, plus "MY ACCOUNT". The tickets section sits directly under the poster.
- **Tier presentation:** **accordion list rows**: name · status chip (`On Sale`, `VIP`) · "FROM €330.00 + fees" · green **BUY** pill. Tabs switch between General Sale and Primavera Pro. Footer filters cover Residents and Minors. A partner-discounted row (Revolut) sits above the standard price.
- **Urgency:** status chips on each row; "All sales are final".
- **Lineup:** the typographic poster, plus artist pages.
- **Mobile:** rows collapse well. The BUY pill stays reachable with your thumb, but there is no sticky bar.
- **Checkout:** on-site account plus embedded Stripe (Stripe.js loaded) in the same tab.
- **Trust:** sponsor pricing, account history.
- **Type/colour:** GT America Mono for UI with Roboto body. Warm off-white (#EFEAE7) and black, with multicolour dots.
- **Accessibility:** no skip link, empty `lang`, some images missing alt text, very small mono UI text.
- **Steal:** the **ticket row pattern** (name + status chip + "from" price + fees disclosed + BUY), tabs for buyer types, and the lineup poster as the hero.
- **Avoid:** tiny monospace labels at 10–11px.

### 05 — Wonderfruit (Ticketmelon reference)
- **URL:** https://wonderfruit.co · /tickets
- **Hero:** full-bleed **video** (5 `<video>` on the home page) with a huge thin all-caps sans headline: "GO FURTHER INTO THE FIELDS". Secondary copy and a small "EXPLORE" pill sit bottom right.
- **Ticket CTA:** "Tickets ↗" in the header plus a **fixed bottom sale bar**: "THE NOVEMBER SALE · 15:01:33:56 · Join the waitlist" with a gradient fill, dismissible, on every page and both breakpoints.
- **Tier presentation:** pass cards that show **every phase**. "1–7 September SOLD OUT · 1–7 October SOLD OUT · 3–9 November THB 12,900 · At-Door THB 20,000". Then Sunday, Teen, **Dog Pass** and Program passes (Intro, Youth, Family, applications required) with "ADD TO BAG".
- **Urgency (best in set):** a giant countdown to the sale window with its date, time and time zone ("4PM BKK (GMT+7)") and "Limited Capacity". Copy: "Future ticket prices will increase", "Tickets are capped… Strictly first-come, first-served", "Only 4 tickets can be purchased per person".
- **Lineup/program:** editorial "Explore" content, live sets, a "LISTEN TO:" player bar.
- **Venue/stay:** a "Stay" section (Boutique Camping, Slow Wonder Cabins), Journeys (pre-bookable experiences).
- **Mobile:** the countdown bar is pinned to the bottom (top ≈ 752px on an 844px screen). The header is minimal.
- **Checkout handoff:** **on-site cart drawer** ("Bag (0) … Subtotal THB 0, Inclusive of 7% VAT. Fees calculated at checkout. CHECKOUT — *You'll be redirected to ticketmelon.com*"). Sign-in with Google, email, phone or Apple happens before the redirect. The site tells you about the redirect before it happens.
- **Trust:** VAT disclosed, purchase cap, at-door price anchor, bilingual EN/TH.
- **Type/colour:** Acumin. Black and warm white with photo and video; the sale bar uses a sunset gradient.
- **Motion:** video hero, smooth transitions.
- **Accessibility:** `lang="en"`, 10 of 92 images missing alt text, no skip link, autoplay video with no visible pause control.
- **Steal:** **the whole flow.** Phase ladder with sold-out phases crossed off, an at-door price anchor, a countdown tied to a real sale window with its time zone, a cart that discloses the redirect, and a Thai/English toggle.
- **Avoid:** autoplay video with no pause; a large bottom bar *plus* an audio bar stacked on top of each other on mobile.

### 06 — DWP (Djakarta Warehouse Project) (Ticketmelon reference)
- **URL:** https://dwpfest.com · /lineup
- **Hero:** dark, grainy background with video. A chrome-red **3D logo**, "11 • 12 • 13 DEC 2026 · JAKARTA, INDONESIA", two CTAs ("LINE UP" outline and **"BUY TICKETS OR RESERVE & HOLD"** solid red), and a **countdown** ("ROAD TO DWP 52 DAYS 08 HOURS…") at the bottom right.
- **Ticket CTA:** the hero CTA scrolls to the "BUY TICKETS ONLINE NOW" section. A floating "READY TO RAVE? GET YOUR TICKETS →" sticker follows you on the lineup page.
- **Tier presentation:** **ticket-stub cards** with notched edges and a colour-coded header (red = GA, cyan = VIP). Each card shows name, phase (Presale, Early Entry before 18.00 WIB) and "STARTS FROM IDR 1.700K". Tabs switch 3-Day / 2-Day / Daily. Group packages appear as their own cards. A pill below says "INSTALLMENT PROGRAM ALSO AVAILABLE".
- **Urgency:** countdown, phase labels, "Early Entry" incentive.
- **Lineup:** an alphabetical, full-width list of artist names in condensed caps with "LEARN MORE" and an image preview on hover.
- **Venue/travel:** a **Travel Packages** carousel (hotel + 3-day pass for 2, from IDR 8.8M) and an AirAsia flight discount.
- **VVIP:** concierge email and WhatsApp for sofas, with a booking form.
- **Mobile:** the hero stacks cleanly and the countdown stays in view. No sticky bar on the home page.
- **Checkout handoff:** buyers choose a ticketing partner by region. **Loket widget** (`widget.loket.com`, new tab) for Indonesia, **Ticketmelon** (`ticketmelon.com/dwp/dwp26`) for purchase "from all countries outside Indonesia".
- **Trust:** promoter credit (Ismaya Live), sponsor lockups, instalments.
- **Type/colour:** Bebas Neue display with Tomorrow (techno sans) body. Near-black, signal red (#E53935-ish) and ice cyan.
- **Motion:** grain, glow, video, hover image reveals.
- **Accessibility:** CTA text duplicated three times in the DOM (marquee effect), which screen readers will read out three times. Low-contrast thin labels.
- **Steal:** stub-shaped tier cards, the tab switcher for pass length, "starts from" pricing, the instalment callout, travel bundles, and **routing buyers to a ticketing partner by region**.
- **Avoid:** two-line CTAs ("BUY TICKETS OR RESERVE & HOLD"). Split them into a primary "Buy tickets" and a secondary "Pay in instalments".

### 07 — Web Summit
- **URL:** https://websummit.com · /tickets/attendees/
- **Hero:** split card. A muted **video** sits on the left. On the right are a press-quote headline ("'The best tech conference on the planet' – Forbes"), the value proposition, *"Don't miss out. Book now before prices increase."*, a gradient **Book tickets** button and an outline Exhibit button.
- **Ticket CTA:** a sticky header pill "Book tickets", repeated in the hero, mid-page and footer (4 times on the home page).
- **Tier presentation (best in set):** three **pricing cards** (General attendee / VIP / Chairperson) with the old price struck through, the current price, ex-tax price, and **"MOST POPULAR" and "LIMITED STOCK" seal badges**. A **feature comparison matrix** with ticks sits below. Audience tabs: General attendees / Group offers / Investors / Startups. Mobile cards have a "Show benefits" expander.
- **Urgency:** "before prices increase", strikethrough savings, "Limited stock".
- **Speakers:** a horizontal portrait carousel ("Meet our 2026 speakers") with name, role and company, plus "See all speakers".
- **Lead capture:** "Join the Web Summit network" email form for people not ready to buy.
- **Checkout handoff:** on-site store (`/store/lis26/checkout/?items=1x<id>`), **same tab**. Each "Book now" button pre-loads that ticket into the cart.
- **Trust:** Forbes quote, "70,000+ people", exhibitor logos, anti-harassment and accessibility policies in the footer.
- **Type/colour:** Inter. White with a magenta→teal gradient; teal tier cards.
- **Accessibility:** 6 images missing alt text; reCAPTCHA; good contrast on the cards.
- **Steal:** comparison matrix, seal badges, **deep-linking each tier straight into checkout with the item pre-selected**, an email capture for people not ready to buy.
- **Avoid:** a corporate tone. Tick-matrix fatigue (16 rows).

### 08 — Stripe Sessions
- **URL:** https://stripesessions.com
- **Hero:** a giant two-line sans headline ("The internet economy conference") with date and venue as small meta at the top right. Below it is a full-width **3D gradient ribbon video**.
- **Ticket CTA:** a **sticky "Register" pill** at the top right plus an FAQs link. It's the only nav, so nothing competes with it.
- **Tier presentation:** one **"Conference passes"** block. Early-bird admission, an included-items list, **$599 next to struck-through $999**, *"Early-bird rates expire on January 27, 2027."*
- **Urgency:** a real deadline written as a date, not a timer.
- **Schedule:** "Agenda at a glance", three day columns (Day 1 / 2 / 3) with session types.
- **Speakers:** "2027 announcements coming soon" plus past highlights (Jony Ive, Zuckerberg, Jensen Huang) as video cards. Past star power stands in for an unannounced lineup.
- **FAQ:** on the page, with accessibility accommodation and minimum age as the first questions.
- **Checkout handoff:** a separate registration subdomain (`register.stripesessions.com/form`), same tab.
- **Type/colour:** Söhne. Off-white (#F9F7F7) with deep purple text (#20033C) and a vivid gradient as the only colour.
- **Motion:** a single, well-made hero video.
- **Steal:** **an extremely short page**, one sticky CTA, an early-bird deadline as a date, "agenda at a glance", past highlights while the lineup is TBA, and an FAQ that opens with accessibility.
- **Avoid:** this restraint doesn't suit a rave. Use it for the information layer, not the vibe.

### 09 — The Weeknd (tour)
- **URL:** https://www.theweeknd.com/tour/
- **Hero:** a tour key-art poster (red/black, large condensed type, sponsor and promoter lockups: Visa, Live Nation).
- **Ticket CTA / tiers:** a **tour-date list**. Each row reads `SAT, OCT 24 | KAI TAK STADIUM | HONG KONG | [New Show] | TICKETS | VIP TICKETS`.
- **Urgency:** "New Show" badges (added dates signal demand).
- **Checkout handoff:** a regional **Live Nation** event page opened in a **new tab**. VIP goes to `vip.livenation.asia`.
- **Mobile:** the poster stacks and the rows become cards. There's a sticky artist-name header.
- **Type/colour:** Druk (extra-condensed) with Helvetica Neue Light. Black, red and teal.
- **Accessibility:** 4 of 5 images missing alt text; ad trackers in iframes.
- **Steal:** a one-row-per-show pattern for multi-date or multi-city events, the "New Show" badge, VIP as a peer CTA.
- **Avoid:** no prices on the site, so every click is blind.

### 10 — OFFF Barcelona
- **URL:** https://www.offf.barcelona · /tickets
- **Hero:** a full-bleed **video collage** with stripe-coloured nav tabs (pink/green/cyan/brown). A huge **"Get Tickets ↘"** block at the top right. Venue and date ("Disseny Hub Barcelona / May 6–8, 2027") set huge at the bottom left.
- **Ticket CTA:** "Get Tickets" in the persistent nav block, plus "↗ BUY TICKETS".
- **Tier presentation:** a single **red Full Pass card** (€330, inclusions, VAT note) with a **quantity dropdown on the page**. A **sticky "Total: €0.00 / Continue ↘"** bar sits at the bottom. Student and group discounts are explained above it.
- **Lineup:** a numbered speaker index ([01] Koto, [02] Porto Rocha…) with "Start Now" hovers. Featured and All artists.
- **Schedule:** a dedicated Schedule page. Masterclasses and workshops are separate products.
- **Checkout handoff:** on-site quantity selection, then Continue to the vendor (`offf-tickets.com`). Side events go to **DICE** in a new tab.
- **Type/colour:** custom Baikal-style grotesk with Arial. Black and white with RGB accent stripes.
- **Motion:** video collage, fast cuts, a big marquee.
- **Accessibility:** skip link present. The type is huge and sometimes overlaps the video, which hurts legibility.
- **Steal:** **quantity selection on the page with a sticky running total before handoff.** This is the cleanest way to pre-fill a Ticketmelon deep link. Also the numbered lineup index and making the CTA itself a typographic element.
- **Avoid:** text over busy video with no scrim.

---

## 3. Cross-site patterns

| Pattern | Seen on | Notes |
|---|---|---|
| Persistent "Tickets" CTA in the header (pill, right-aligned, contrasting fill) | Coachella, Primavera, Wonderfruit, Web Summit, Stripe, OFFF, Dekmantel | The universal pattern. Label it with the verb that fits the current sale state. |
| Bottom-fixed sale bar on mobile | Wonderfruit (countdown), OFFF (cart total) | Rare and effective. It must be dismissible and must not stack with other bars. |
| Sale state reflected in the hero | Coachella, Tomorrowland, Wonderfruit, DWP | Hero copy changes: Pre-register → On sale → Final phase → Sold out / Waitlist. |
| Phase pricing ladder visible | Wonderfruit, Web Summit, Stripe | Showing sold-out earlier phases and the at-door price makes the current price feel fair. |
| Status chips on tiers | Primavera (On Sale, VIP), Tomorrowland (Sold Out), Web Summit (Most popular, Limited stock), Weeknd (New Show) | Use a small set: On sale · Few left · Sold out · New. |
| "From" price + fee disclosure | Primavera ("+ fees"), Coachella ("fees included"), Wonderfruit ("Incl. 7% VAT, fees at checkout") | Disclosing fees up front avoids drop-off at checkout. |
| Real countdowns, never fake | Wonderfruit, DWP | Always tied to a stated date, time and time zone. |
| Tabs to segment buyers | Web Summit (audience), Primavera (General/Pro), DWP (3/2/1-day) | Keeps the tier grid small. |
| Packages / travel bundles | Coachella, Tomorrowland, DWP, Wonderfruit | Hotel + pass bundles raise order value. |
| Instalments / payment plans | Coachella ($49 down), DWP (Reserve & Hold) | Strong lever in SEA markets. |
| Handoff disclosed up front | Wonderfruit ("You'll be redirected to ticketmelon.com"), DWP (choose your region's partner) | Reduces the shock of landing on another domain. |
| Lineup as typography | Primavera poster, DWP list, OFFF numbered index | A typographic lineup beats photo grids on speed and reads as more confident. |
| Past highlights while the lineup is TBA | Stripe, Tomorrowland | Fills the gap before the lineup announcement. |
| Email/waitlist capture for people not buying yet | Web Summit, Coachella, Wonderfruit, Glastonbury | Every page ends with a capture form. |
| Accessibility toolkit | Glastonbury (modes), Coachella (phone line), Stripe (FAQ) | Mostly weak across the category. This is our opportunity to stand out. |

**Checkout handoff summary**

| Site | Vendor | Mode |
|---|---|---|
| Coachella | AXS | new tab |
| Tomorrowland | own account + Queue-it | same tab |
| Glastonbury | See Tickets | new tab |
| Primavera | own account + Stripe | on-site |
| **Wonderfruit** | **Ticketmelon** | on-site bag → redirect, disclosed |
| **DWP** | **Ticketmelon** (intl) / Loket (ID) | region picker → partner |
| Web Summit | own store | same tab, item pre-selected |
| Stripe Sessions | own reg subdomain | same tab |
| The Weeknd | Live Nation | new tab |
| OFFF | own vendor + DICE | on-site qty → continue |

**Recommendation for Ticketmelon:** open checkout **in the same tab**. A new tab breaks the back button and analytics, and on mobile it scatters tabs. Before the redirect, show a short "You're heading to Ticketmelon to pay securely" note with the Ticketmelon logo. Deep-link to the event, or to the specific ticket type if Ticketmelon supports it. Append UTM and source parameters so conversions can be attributed. If Ticketmelon offers an embeddable widget, test it against the redirect. Default to the redirect: a full page performs better on mobile and adds no third-party iframe.

---

## 4. Recommended sitemap and page structure

Single event, one-page-first, with deep pages for SEO and sharing:

```
/                 Home (long scroll — the funnel)
/tickets          Tickets (tiers, phases, packages, FAQ about tickets) ← every CTA lands here or deep-links tier
/lineup           Lineup (+ /lineup/[artist] detail pages for SEO/sharing)
/schedule         Schedule / set times (published closer to date; "coming soon" state)
/info             Plan your trip: venue, map, getting there, stay, accessibility, rules, what to bring
/faq              FAQ (full; top 6 also on Home + Tickets)
/about            Story / past editions / gallery / partners
/legal/*          Terms, privacy, refund policy, code of conduct
(EN / TH toggle — mirrored routes /th/...)
```

**Home page order (mobile-first scroll)**
1. **Sticky header**: logo · date · "Tickets" pill (label tracks sale state) · menu.
2. **Hero**: muted looping video or poster image with a scrim. Event name, **date · city · venue** on one line, primary CTA "Get tickets", secondary "See lineup". A status line under the CTA ("Phase 2 on sale · ends 30 Nov").
3. **Countdown / sale strip**: only when there's a real sale moment or event date.
4. **Lineup teaser**: headliners large, then a typographic list, then "Full lineup →".
5. **Tickets preview**: 2–4 tier cards with a phase ladder and "From ฿x". The CTA deep-links to Ticketmelon or /tickets#tier.
6. **Experience**: 3 image/video tiles (stages, food, camping) that explain why to come.
7. **Packages**: travel/hotel/group bundles, if any.
8. **Venue & getting there**: map snippet, transport chips, "Plan your trip →".
9. **Social proof**: past edition stats, press quotes, recap video.
10. **FAQ (top 6)**: accordion, then "All FAQs →".
11. **Newsletter / waitlist capture**.
12. **Footer**: partners, socials, legal, Ticketmelon "Official ticketing partner" badge, contact.

**/tickets page order**
Status banner → buyer-type tabs (e.g. Single day / Weekend / VIP / Group) → tier cards with phase ladder → "What's included" comparison (collapsible on mobile) → add-ons/packages → fee/VAT/age/refund policy in plain language → ticket FAQ → secure-checkout note with the Ticketmelon handoff explainer.

---

## 5. Component inventory

| Component | Spec notes |
|---|---|
| **Site header** | Sticky; height 56 mobile / 72 desktop; shrinks on scroll. Right-aligned "Tickets" pill (min 44×44 touch target, highest-contrast fill). Language toggle EN/TH. |
| **Sticky ticket bar (mobile)** | Bottom-fixed and safe-area aware (`env(safe-area-inset-bottom)`). Shows "From ฿x · Phase 2" with a **Get tickets** button. Appears after the hero leaves the viewport and hides on /tickets once the tier grid is visible (no doubled CTAs). Dismiss collapses it to a small pill. Never stacks with another fixed bar. |
| **Hero** | Variants: video (muted, `playsinline`, poster frame, visible **pause** button, `prefers-reduced-motion` → poster only), image, type-only. Gradient scrim for 4.5:1 contrast. Meta line: date · venue · city. Primary and secondary CTA. Status line. |
| **Sale status line / banner** | Driven by a single `saleState` value: `announce` / `presale` / `onsale` / `final` / `soldout` / `past`. Controls the CTA label everywhere. |
| **Countdown** | Only with a real target. Shows date, time and **time zone** in text next to it (the screen-reader label is the text, not the ticking digits; `aria-live="off"`). Units D:H:M:S, tabular numerals. Switches to "On sale now" at zero. |
| **Tier card** | Name · short description · inclusions (3–5 bullets) · **phase ladder** (past phases struck through and marked "Sold out", current one highlighted, next phase and at-door price shown faintly) · price "from ฿x" with fees/VAT note · status chip · CTA (deep link). Badge slot for "Most popular" / "Few left". Optional stub/notch shape to match the art direction. |
| **Tier tabs** | Segmented control for buyer type or pass length. Keyboard arrows, `role=tablist`. |
| **Comparison table** | Desktop matrix; on mobile, accordion per tier ("Show what's included"). |
| **Status chip** | On sale · Few left · Sold out · New · Coming soon. Colour plus icon/text (never colour alone). |
| **Lineup grid / list** | Two modes: typographic poster (tiered sizes) and filterable list (day/stage, A–Z). Artist detail drawer with photo, bio, listen links. Image hover reveal on desktop only. |
| **Schedule** | Day tabs, then a stage-by-time grid on desktop and a chronological list per stage on mobile. "Add to calendar" per set. A "Coming soon" state until set times are published. |
| **Venue map** | Static, optimised illustrated site map (zoomable image or SVG) plus a "Open in Google Maps" link. Do not autoload a heavy maps iframe; load it on click. Legend with icons (stages, food, toilets, medical, water, accessible viewing). |
| **Getting there** | Transport chips (Car / Shuttle / Taxi-Grab / Flight), each expanding to details. Parking and shuttle add-ons link to tickets. |
| **FAQ accordion** | `<details>/<summary>` or ARIA button pattern. Categories (Tickets, Entry, Accessibility, Rules, Refunds). Deep-linkable anchors. Search on the full /faq page. |
| **Packages carousel** | Cards: image, inclusions, "from" price, CTA. Scroll-snap, visible arrows on desktop. |
| **Social proof strip** | Stats (attendees, editions), press quotes, recap video. |
| **Newsletter / waitlist** | Single email field plus consent text. Shown on sold-out tiers as "Join waitlist". |
| **Handoff interstitial (optional)** | Short note or inline text: "Checkout is powered by Ticketmelon. You'll complete payment securely on ticketmelon.com." Can be a 600ms transition, not a modal. |
| **Footer** | Partners, socials, legal, refund policy, contact, "Official ticketing: Ticketmelon" badge, accessibility statement link. |
| **Accessibility menu (stretch)** | High-contrast and reduced-motion toggles, as Glastonbury does. |

---

## 6. Conversion best practices for ticket funnels

1. **One primary action, everywhere.** Every page has the same "Get tickets" CTA in the same colour. Secondary CTAs (lineup, info) use outline or ghost styles.
2. **No more than 2 clicks from landing to Ticketmelon.** Home → (tier CTA) → Ticketmelon, or Home → /tickets → Ticketmelon. Deep-link to the specific ticket type where Ticketmelon allows it, as Web Summit does with `?items=`.
3. **Show prices on the site.** "From ฿x" on every card. Sites without prices (The Weeknd) make every click a blind one.
4. **Disclose fees and VAT before handoff**, as Wonderfruit, Primavera and Coachella do. Surprise fees are the biggest cause of checkout drop-off.
5. **Make urgency real and specific.** Show the phase ladder with sold-out phases, the next price, the at-door price, phase end dates, and per-person caps. No fake timers or invented "X people viewing".
6. **Sale state controls everything.** One `saleState` value changes hero copy, CTA labels, card states and the sticky bar. Pre-sale → "Get notified", sold out → "Join waitlist".
7. **Reduce risk.** Add an "Official ticketing partner" badge, the refund/transfer policy in one sentence near the CTA, secure-payment and payment-method icons (cards, PromptPay, TrueMoney and so on, if Ticketmelon supports them), and a support contact.
8. **Offer instalment and group options** where Ticketmelon supports them. DWP and Coachella use both.
9. **Anchor with the top tier.** Show VIP or packages next to GA so GA feels like good value. Put a "Most popular" seal on the tier you want to push.
10. **Capture people who aren't ready to buy.** A newsletter or waitlist on every page, with retargeting pixels consented through the CMP.
11. **Track the handoff.** Fire `begin_checkout` (with tier and price) on CTA click, pass UTMs and `gclid`/`fbclid` through to Ticketmelon, and set up Ticketmelon's conversion pixel or postback if one exists.
12. **Speed is conversion.** LCP < 2.5s on 4G. Use a poster image first and lazy-load video; no heavy map iframe at load.

---

## 7. Mobile-first rules

1. Design at **360–390px first**. Most ticket traffic comes from social links on phones.
2. **A ticket CTA is always on screen**: the header pill, plus a bottom sticky bar after the hero. Never more than one fixed bar at the bottom.
3. Touch targets ≥ **44×44px** and CTA buttons at full width on cards. Primary actions sit in the bottom half of the screen where the thumb reaches.
4. Respect `safe-area-inset-*`. The sticky bar must not cover the iOS home indicator or the cookie banner, so sequence them.
5. Video heroes: muted, `playsinline`, poster frame first, ≤ 2–3 MB 720p mobile cut, pause button, and no autoplay under `prefers-reduced-motion` or Save-Data.
6. Turn tables into **accordions or cards**. No horizontal scroll except intentional carousels with scroll-snap.
7. Body text ≥ **16px**, labels ≥ 12px. Avoid Primavera's tiny mono labels.
8. Keep the event date, city and price within the first two screens.
9. Lineup on mobile: stacked typographic list with day filter chips. No hover-dependent reveals.
10. Test the Ticketmelon handoff on iOS Safari and Android Chrome, inside in-app browsers (Instagram, TikTok, LINE, Facebook). A same-tab redirect is the most reliable there; new tabs often fail.
11. Don't put the hero CTA behind the cookie banner. Use a compact bottom CMP with an equal-weight "Reject".

---

## 8. Accessibility baseline (category is weak, so we can stand out)

- Skip link, `lang` attribute (EN/TH), landmarks, logical heading order.
- 4.5:1 text contrast **including over video** (scrim). 3:1 for UI components.
- Status is never shown by colour alone (Sold out chip = text + icon).
- Countdown is not announced every second. Provide the static date and time as text.
- Pause control for any motion over 5s. Respect `prefers-reduced-motion`.
- Marquee or duplicated text marked up once, with copies `aria-hidden` (DWP repeats each CTA three times for screen readers).
- Alt text on all lineup photos (artist name).
- An accessibility info page (viewing platforms, companion tickets, quiet zones) linked from the FAQ and footer, as Stripe and Coachella do.

---

## 9. Art-direction options for the client

> **Superseded 2026-10-20.** Owner chose a chrome direction. Current options: [04 §4](../04-design-benchmark.md). Kept for history.

### Option A — "Golden Hour Fields"
- **Mood:** warm, outdoor, organic, soulful. Wonderfruit meets Coachella. Sunset light, dust, linen, film grain. Premium but humane.
- **Palette:** Dusk Ink `#1E1A17` · Linen `#F4EDE2` · Sunset Coral `#F26B3A` (CTA) · Marigold `#F5B841` · Lagoon `#2F7F7A` · Clay `#B5654A`. The CTA is coral on ink or ink on linen (both > 4.5:1).
- **Type pairing:** *Fraunces* (soft display serif, variable "SOFT"/"WONK") for headlines with *Inter* or *Manrope* for UI and body. Thai: *IBM Plex Sans Thai Looped* or *Anuphan*.
- **Signature components:** sunset-gradient sale bar, hand-drawn site map, rounded tier cards with a phase ladder, film-grain overlay on photos.
- **Best for:** lifestyle, boutique or multi-day camping festivals with a family or wellness angle.

### Option B — "Signal Red Night"
- **Mood:** dark, kinetic, high-energy club and EDM. DWP meets The Weeknd. Chrome, glow, scan lines, ticket-stub geometry.
- **Palette:** Void `#0B0B0E` · Graphite `#1C1C22` · Signal Red `#FF3B30` (CTA) · Ice Cyan `#5CE1E6` (VIP) · Chrome `#C9CCD3` · Paper `#F2F2F2`.
- **Type pairing:** *Druk Wide / Druk Condensed* (or free alternatives *Anton* / *Big Shoulders Display*) for display with *Space Grotesk* for UI and countdown numerals (tabular). Thai: *Prompt*.
- **Signature components:** notched ticket-stub tier cards (red GA / cyan VIP), a full-width typographic lineup with hover image reveal, a big countdown, light grain and glow, and a split marquee.
- **Best for:** EDM, hip-hop, arena and night events, younger audiences, high urgency.

### Option C — "Editorial Grid"
- **Mood:** clean, design-literate, confident. Primavera, OFFF and Stripe. A Swiss grid with a poster lineup, lots of white space, one bold accent, motion only on hover. Reads like an arts or culture institution.
- **Palette:** Off-white `#F3F0EA` · Ink `#111111` · Electric Blue `#2B4BFF` (CTA) · Acid `#D7FF3A` (highlight/chips) · Warm Grey `#8A857C` · Rose `#FF7AA8` (accent dots).
- **Type pairing:** *Neue Haas Grotesk Display* (or free *Inter Tight* / *Geist*) for display with *JetBrains Mono* or *Geist Mono* for labels, times and prices (≥ 12px). Thai: *Noto Sans Thai* / *IBM Plex Sans Thai*.
- **Signature components:** a lineup poster as the hero, ticket list rows with status chips ("On sale" in acid) and "From ฿x + fees", a numbered artist index, a CTA block set in large type ("Get tickets ↘"), and a sticky running-total bar.
- **Best for:** curated, cross-genre, design or arts festivals and conferences that want to look cultural and premium.

---

## 10. Screenshot index

All files are in `docs/research/screens/`. `-hero` = desktop 1440×900 first view, `-mobile` = iPhone 390×844 first view, `-tickets-*` = tickets page.

| Site | Files |
|---|---|
| 01 Coachella | `01-coachella-hero.png`, `01-coachella-mobile.png`, `01-coachella-tickets-hero.png`, `01-coachella-tickets-mobile.png` |
| 02 Tomorrowland | `02-tomorrowland-hero.png`, `02-tomorrowland-mobile.png`, `02-tomorrowland-tickets-hero.png`, `02-tomorrowland-tickets-mobile.png` |
| 03 Glastonbury | `03-glastonbury-hero.png`, `03-glastonbury-mobile.png` |
| 04 Primavera | `04-primavera-hero.png`, `04-primavera-mobile.png`, `04-primavera-tickets-hero.png`, `04-primavera-tickets-mobile.png` |
| 05 Wonderfruit | `05-wonderfruit-hero.png`, `05-wonderfruit-mobile.png`, `05-wonderfruit-tickets-hero.png`, `05-wonderfruit-tickets-mobile.png` |
| 06 DWP | `06-dwp-hero.png`, `06-dwp-mobile.png`, `06-dwp-tickets-hero.png` (tier cards), `06-dwp-lineup-hero.png`, `06-dwp-lineup-mobile.png` |
| 07 Web Summit | `07-websummit-hero.png`, `07-websummit-mobile.png`, `07-websummit-tickets-hero.png`, `07-websummit-tickets-mobile.png` |
| 08 Stripe Sessions | `08-stripesessions-hero.png`, `08-stripesessions-mobile.png` |
| 09 The Weeknd | `09-weeknd-hero.png`, `09-weeknd-mobile.png` |
| 10 OFFF | `10-offf-hero.png`, `10-offf-mobile.png`, `10-offf-tickets-hero.png`, `10-offf-tickets-mobile.png` |
| Also reviewed | `11-dekmantel-hero.png`, `11-dekmantel-mobile.png`, `12-config-hero.png`, `12-config-mobile.png` |

**Method notes / caveats:** Screenshots show the state on 2026-10-19, so most festivals were between sales, in a waitlist phase, or before the lineup announcement. Some first-view captures show a cookie banner where no reject option existed (The Weeknd). Checkout destinations were read from link attributes and page source; no checkout was started. Remaining DOM duplicate checks and colour values are approximate (sampled from computed styles and screenshots).

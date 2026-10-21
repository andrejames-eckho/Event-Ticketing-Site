# Pricing Benchmark: Event Marketing Website with Ticketmelon Integration

**Prepared:** 2026-10-19
**Scope:** Small agency or freelancer building a custom event marketing website. Checkout happens on Ticketmelon through buy links or an embedded widget.
**Markets:** Philippines (primary, PHP) and Thailand (secondary, THB), with USD equivalents.

**Labels used in this document**
- **[SRC]**: the figure comes directly from a cited source.
- **[EST]**: my estimate, derived from the sources, labour-rate math, or industry norms. Validate it before quoting.
- **[VERIFY]**: a vendor price or tax rule taken from general knowledge or a third-party aggregator. Confirm it on the official page or with an accountant.

**Planning exchange rates [EST]:** USD 1 = PHP 60 = THB 33. USD/PHP traded between about 57.4 and 62.6 during 2026, and was about 61.7 in late July ([PoundSterlingLive](https://www.poundsterlinglive.com/history/USD-PHP-2026)). USD/THB was about 32.7 to 33.8 in July and August 2026 ([currencyconvert.online](https://currencyconvert.online/usd/thb), [Pluang](https://pluang.com/en/tools/currency-converter/usd-thb)). Round numbers are used here, so re-check rates before sending a USD quote.

---

## 1. Executive Summary

| Tier | What it is | Timeline | PHP (ex-VAT) | USD | THB |
|---|---|---|---|---|---|
| **Essential** | Single-page event site, semi-custom design, Ticketmelon buy links, GA4 and Meta Pixel | 2-3 wks | **PHP 45,000** | ~$750 | ~THB 25,000 |
| **Pro** (anchor tier) | 7-page custom site, headless CMS, full tracking stack, technical SEO | 4-6 wks | **PHP 120,000** | ~$2,000 | ~THB 66,000 |
| **Premium** | Art-directed design with motion, bilingual, CMS, ads landing page, recap page template | 7-10 wks | **PHP 280,000** | ~$4,650 | ~THB 155,000 |

- **Market fit.** These prices sit inside the published PH ranges. Freelancer or template sites cost PHP 50-100k, team-built small business sites PHP 100-250k, and custom boutique work PHP 250-800k+ ([Designblue Manila](https://designbluemanila.com/blogs/how-much-does-a-website-cost-in-the-philippines-an-honest-breakdown)). They also line up with festival-site vendor estimates of US$2,400-4,200 for medium complexity ([ColorWhistle](https://colorwhistle.com/website-cost-features/concert-website-cost-usa/)).
- **Where the profit is.** The real profit pool is recurring revenue: maintenance retainers plus a per-edition refresh fee, because events repeat. Pitch every build as "Edition 1 of N".
- **Commission.** Do not take a percentage of gross ticket sales as your main fee. Promoter commissions of 10-20% exist, but they pay for selling tickets, not for building a site. If a client asks for performance pricing, offer a capped bonus on tracked tickets on top of a reduced fixed fee (see section 6).
- **Main risk.** Purchase attribution. Checkout happens on Ticketmelon's domain, so your site can't see purchase events unless Ticketmelon supports organizer pixels or postback. I found no Ticketmelon documentation on this [VERIFY]. Scope "conversion tracking" as tracking clicks to the ticket page plus UTM attribution, and add purchase tracking only if Ticketmelon confirms support.

---

## 2. Market Price Ranges by Site Type

### 2.1 Published benchmarks

| Source | Market | Site type | Price |
|---|---|---|---|
| [Designblue Manila](https://designbluemanila.com/blogs/how-much-does-a-website-cost-in-the-philippines-an-honest-breakdown) [SRC] | PH | Freelancer or template site | PHP 50,000-100,000 |
| same | PH | Small business site, 5-10 pages, built by a team | PHP 100,000-250,000 |
| same | PH | Custom site (boutique or enterprise) | PHP 250,000-800,000+ (their own work starts at PHP 350k) |
| [9100 Web Studio](https://webstudio9100.lovable.app/) [SRC] | PH | Entry-level studio | from PHP 10,000 (scope not stated) |
| [Hashmeta PH](https://hashmeta.com/ph/posts/how-much-seo-costs-philippines-2026-pricing-guide) [SRC] | PH | Web developer hourly rate | PHP 800-2,500/hr |
| [Digital Agency Bangkok](https://digitalagencybangkok.com/?p=31621) [SRC] | TH | Static or brochure site | THB 14,900-50,000, 2-6 wks |
| same | TH | CMS site (WordPress) | from THB 29,900 (an older page says THB 50-150k) |
| same | TH | Custom web app | THB 150,000-500,000 |
| [ParallelHQ](https://www.parallelhq.com/blog/web-design-thailand) [SRC] | TH | Freelancer, marketing site / local studio, brochure site / mid-tier agency | $800-3,000 / $3,000-8,000 / $8,000-25,000 |
| [ColorWhistle](https://colorwhistle.com/website-cost-features/concert-website-cost-usa/) [SRC] | Global (Indian vendor) | Concert or festival site, medium complexity | $2,400-4,200; fixed package $1,699, 4-7 wks |
| [Dribbble services](https://dribbble.com/services/244049-Entertainment-Music-Web-Design) [SRC] | Global | Entertainment or music web design | from $2,000, ~3 wks |
| [Agiled](https://agiled.app/hub/agencies/how-to-price-web-design-services) [SRC] | Global | Single landing page from an independent or small studio | $1,500-5,000 |
| [Clutch PH](https://clutch.co/ph/web-designers) [SRC] | PH | Agency listings | Mostly under $25/hr or $25-49/hr; minimum projects $1,000+ to $5,000+ |

### 2.2 Synthesised ranges for event sites [EST]

| Site type | PH freelancer | PH small agency | TH small agency | USD (PH agency) |
|---|---|---|---|---|
| One-page event landing site | PHP 15-40k | PHP 35-70k | THB 15-40k | $600-1,200 |
| Multi-page event site (home, tickets, lineup, schedule, venue, FAQ, contact) | PHP 50-100k | PHP 100-180k | THB 50-120k | $1,700-3,000 |
| Premium custom design with motion (GSAP or Lottie, art direction) | PHP 120-200k | PHP 220-450k | THB 120-300k | $3,700-7,500 |
| CMS add-on so the client can edit lineup and FAQ (if not already included) | +PHP 15-35k | +PHP 25-60k | +THB 15-40k | +$400-1,000 |

Notes:
- Thai pricing runs lower at the template end (from THB 14,900), but tops out higher for custom app work.
- Note the THB/PHP parity: PHP 1 is about THB 0.55.
- Clients mainly pay more for an event site because of the tight, immovable deadline (the on-sale date). That justifies a rush premium.

---

## 3. Labour Rates (PH and TH)

### 3.1 Philippines

| Role | Junior | Mid | Senior | Basis |
|---|---|---|---|---|
| Frontend dev (freelance, international clients) | $12-25/hr | $25-40/hr | $40-65/hr | [Second Talent, web dev PH](https://www.secondtalent.com/developer-rate-card/web-developer-philippines/) [SRC] |
| Frontend dev (contract, other cut) | $16-28/hr | $22-58/hr | $32-80/hr | [Second Talent, cost to hire PH](https://www.secondtalent.com/cost-to-hire/philippines/) [SRC] |
| Developer (local clients) | PHP 800-2,500/hr overall | | | [Hashmeta](https://hashmeta.com/ph/posts/how-much-seo-costs-philippines-2026-pricing-guide) [SRC] |
| **Frontend dev, local small-agency rate** | **PHP 600-900/hr** (PHP 5-7k/day) | **PHP 1,000-1,600/hr** (PHP 8-13k/day) | **PHP 1,800-3,000/hr** (PHP 14-24k/day) | [EST] |
| Designer (full-time monthly) | $450-800/mo | $900-1,800/mo | $1,200-4,000+/mo | [HireTalent.ph](https://hiretalent.ph/what-to-pay-filipino-graphic-designers) [SRC] |
| Web designer salary | ~PHP 318k/yr average | | PHP 480-734k/yr | [Payscale PH](https://www.payscale.com/research/PH/Job=Web_Designer/Salary/9c4a64f4/Makati-City-Graphic-Design) [SRC] |
| **Designer (UI/web), freelance billing** | **PHP 500-900/hr** | **PHP 900-1,600/hr** | **PHP 1,800-3,000/hr** | [EST] |
| **PM or producer, freelance billing** | **PHP 400-700/hr** | **PHP 800-1,300/hr** | **PHP 1,500-2,500/hr** | [EST] (no PH-specific source found) |

How the [EST] rows were derived: full-time salaries were converted to hourly (about 160 hr/mo) and multiplied by 2-3x for freelance billing to cover utilisation, overhead and margin. The results were then cross-checked against the Hashmeta and Second Talent bands. Day rate = 8 hours.

### 3.2 Thailand

| Role | Junior | Mid | Senior | Basis |
|---|---|---|---|---|
| Web dev (freelance, international clients) | $25-40/hr | $40-65/hr | $65-100/hr | [Second Talent, web dev TH](https://www.secondtalent.com/developer-rate-card/web-developer-thailand/) [SRC] |
| WordPress dev (local clients) | THB 150-750/hr overall | | | [Second Talent, WordPress TH](https://www.secondtalent.com/developer-rate-card/wordpress-developer-thailand/) [SRC] |
| UI/UX designer (freelance) | — | $23-53/hr | — | [Second Talent TH](https://www.secondtalent.com/cost-to-hire/thailand/) [SRC] |
| Worked example of a freelancer's base rate | THB 1,200/hr | | | [Everhour](https://everhour.com/calculators/hourly-rate-calculator-in-thailand) [SRC] |
| **Frontend dev, local small-agency rate** | **THB 350-600/hr** | **THB 700-1,200/hr** | **THB 1,300-2,500/hr** | [EST] |
| **Designer, local** | **THB 300-550/hr** | **THB 600-1,100/hr** | **THB 1,200-2,200/hr** | [EST] |
| **PM, local** | **THB 300-500/hr** | **THB 600-1,000/hr** | **THB 1,100-2,000/hr** | [EST] |

Caveat: Second Talent is a recruiter and its pages contradict each other. Treat its figures as ceilings for international-client work. Local-client rates are commonly 40-60% lower, a gap Second Talent itself acknowledges.

### 3.3 Blended rate used for the tier pricing [EST]

- **Sell rate:** about PHP 1,100/hr blended (mid-level design, development and PM).
- **Internal cost:** about PHP 600/hr (what you pay mid-level freelancers, plus about 10% overhead).
- **Result:** roughly 45% gross margin at list price.

---

## 4. Recurring Costs (pass-through or bundled)

### 4.1 Infrastructure and tools

| Item | Free option | Paid option | Notes |
|---|---|---|---|
| Vercel | Hobby: free, but **non-commercial use only** under Vercel's terms [VERIFY] | Pro: $20/seat/mo, includes $20 usage credit and 1 TB bandwidth, $0.15/GB over ([MakerKit](https://makerkit.dev/blog/tutorials/vercel-cost), [Vercel docs](https://examples.vercel.com/docs/accounts/plans/pro)) [SRC] | Hobby is not appropriate for a paid client site. |
| Netlify | Free plan allows commercial use, with credit-based limits [VERIFY] | Pro ~$19-20/member/mo [VERIFY] | |
| Cloudflare Pages / Workers | Free: unlimited static bandwidth [VERIFY] | Workers Paid ~$5/mo [VERIFY] | **Recommended default.** On-sale traffic spikes cost nothing on a static site. |
| Domain .com | — | ~$11-15/yr (~PHP 650-900) [VERIFY] | |
| Domain .ph / .com.ph | — | .ph ~$41-46/yr; .com.ph ~$45-49/yr at budget registrars ([DomainOffer .ph](https://domainoffer.net/tld/ph), [DomainOffer .com.ph](https://domainoffer.net/price-compare-com.ph)) [SRC] | Prices go up to $110-315 at some registrars. |
| Domain .co.th / .in.th | — | THB 300-1,000/yr for common domains ([Digital Agency Bangkok](https://digitalagencybangkok.com/?p=31621)) [SRC]; .co.th needs company documents [VERIFY] | |
| Sanity (headless CMS) | Free tier [VERIFY limits] | Growth $15/seat/mo, viewers free ([Flow Ninja](https://www.flowninja.com/blog/sanity-cms-pricing), [CostBench](https://costbench.com/software/cms/sanity-cms/)) [SRC] | The free tier usually covers a single event site. |
| Storyblok | Starter free (1 seat) [VERIFY] | Growth ~$99/€99/mo; Growth Plus ~$349/mo ([Capterra](https://www.capterra.com/p/213991/Storyblok/pricing/), [PricingSaaS](https://pricingsaas.com/companies/storyblok)) [SRC] | Too expensive for one-off event sites. |
| Payload CMS | Open source, self-hosted, $0 licence | Database and hosting ~$0-25/mo [EST] | Good fit if you're on Next.js and want no per-seat fees. |
| WordPress | Software free | PH shared hosting ~PHP 150-600/mo; managed hosting $15-35/mo [EST] | Familiar to clients, but more maintenance and security work. |
| Business email | Zoho Mail free tier (limited) [VERIFY] | Google Workspace ~$7-8.40/user/mo [VERIFY]; Zoho ~$1-1.25/user/mo [VERIFY] | Usually one or two inboxes (info@, tickets@). |
| Analytics | GA4 free; Cloudflare Web Analytics free | Plausible ~$9/mo [VERIFY] | |
| Newsletter | Brevo free (300 emails/day), Mailchimp free (limited) [VERIFY] | $15-50/mo depending on list size [EST] | |

**Typical pass-through total for one event site [EST]:**
- Lean stack (Cloudflare, Sanity free, .com, Zoho): about **PHP 1,000-2,500/yr**.
- Pro stack (Vercel Pro, .ph, Workspace x2, Plausible): about **PHP 25,000-35,000/yr**.

Bill pass-throughs at cost plus 10-20% admin, or bundle them into the retainer.

### 4.2 Maintenance retainers

| Source | Figure |
|---|---|
| [Designblue Manila, maintenance](https://designbluemanila.com/blogs/what-website-maintenance-actually-costs-in-the-philippines) [SRC] | Brochure site ~PHP 20,000/mo; e-commerce ~PHP 35,000/mo; large sites PHP 50k+/mo |
| Low-end PH guide, cited in search results [SRC] | PHP 1,000-2,000/mo, which is basically hosting-level upkeep |
| WordPress maintenance in the US, UK and Australia, for comparison ([Digital Marketing Philippines](https://digitalmarketingphilippines.com/wordpress-maintenance-services/)) [SRC] | $150-400+/mo |

A static or headless event site needs less security patching than WordPress. That lets you price below Designblue and still keep good margins.

### 4.3 Per-event refresh fees (re-skinning for the next edition) [EST]

No published benchmark exists for this. The norm I recommend is **35-50% of the original build fee**, depending on how much of the design is reused.

| Built on | Light refresh (new key art, dates, lineup, colours) | Full re-skin (new layout sections, new motion) |
|---|---|---|
| Essential | PHP 15,000 | PHP 25,000 |
| Pro | PHP 40,000 | PHP 60,000 |
| Premium | PHP 90,000 | PHP 140,000 |

Lower this by about 20% if the client is on an active retainer. Rewarding retained clients with cheaper refreshes builds lock-in.

---

## 5. Add-On Menu (common market offerings, priced for a PH small agency) [EST unless marked]

| Add-on | PHP | USD | Notes |
|---|---|---|---|
| Tracking pack: GA4, GTM, Meta Pixel, TikTok Pixel, click-to-Ticketmelon events, UTM link kit | 15,000 | $250 | Purchase events only if Ticketmelon supports organizer pixels or postback [VERIFY]. |
| Purchase tracking via Ticketmelon pixel or postback (if supported) | +8,000 | +$135 | Depends on Ticketmelon. |
| SEO setup: Event schema (JSON-LD), meta and Open Graph, sitemap, Search Console, speed pass | 12,000 | $200 | Ongoing SEO is a separate retainer: THB 12-90k/mo in TH ([DAB](https://digitalagencybangkok.com/?p=31621)) [SRC]. |
| Copywriting | 2,500/page or 20,000/site | $40 / $335 | Thai agencies bill content separately ([DAB](https://digitalagencybangkok.com/?p=31621)) [SRC]. |
| Additional language (EN/TL or EN/TH): i18n setup plus layout QA | 30,000 + translation | $500 | Translation PHP 2-5/word [EST]. In TH, extra languages are budgeted separately ([DAB](https://digitalagencybangkok.com/?p=31621)) [SRC]. |
| Newsletter integration (Brevo/Mailchimp form, double opt-in, tagging) | 8,000 | $135 | |
| Ads landing page (one page, variant of the main design) | 15,000 | $250 | +PHP 6,000 per A/B variant. |
| Post-event recap page (gallery, aftermovie embed, "save the date" capture) | 20,000 | $335 | Strong upsell. It keeps the domain warm for the next edition. |
| Extra standard page | 8,000 | $135 | |
| Artist or speaker detail pages (template plus CMS) | 15,000 | $250 | |
| Photography (subcontracted) | 15,000-40,000/day + 15% coordination | $250-670 | [EST] |
| Videography or aftermovie (subcontracted) | 30,000-100,000 + 15% | $500-1,670 | [EST] |
| Social asset kit (key-visual adaptations) | 10,000-25,000 | $170-420 | |
| Rush delivery (under 50% of standard timeline) | +30-50% | | Event deadlines can't move, so this is legitimately charged. |

---

## 6. Pricing Models

| Model | Prevalence for event sites | Verdict |
|---|---|---|
| **Fixed project** with 50/50 or milestone payments | Dominant. Bangkok agencies standardise on 50% at contract and 50% at launch ([DAB](https://digitalagencybangkok.com/?p=31621)) [SRC]. | **Use it.** |
| **Tiered packages** | Common (DAB, ColorWhistle fixed package) | **Use it.** Make Pro the anchor. |
| **Retainer** | Common for maintenance and SEO | **Use it** for recurring margin. |
| **Hourly / T&M** | For change requests only | Use it for out-of-scope work. |
| **Revenue share / per-ticket commission** | Rare for web agencies. Common for promoters and affiliates. | Optional hybrid only (see below). |

### Commission norms (promoter and affiliate context) [SRC]
- 10-20% of gross for flat-percentage deals, or $2-15 per ticket. A tiered structure is a base percentage plus a bonus above a volume threshold ([Ticket Fairy commission calculator](https://www.ticketfairy.com/tools/promoter-commission-calculator)).
- Agency-driven deals: about 15% plus a per-ticket bonus. The total commission pool is 18-25% ([Ticket Fairy](https://www.ticketfairy.com/tools/promoter-commission-calculator)).
- 10-15% for small or indie shows, 15-25% for hard-to-sell events ([Posh](https://posh.vip/university/post/how-to-become-paid-event-promoter)).
- Skiddle's affiliate programme pays a share of the booking fee, not of face value. That works out to 10p-£4 per ticket ([Skiddle](https://help.promotioncentre.co.uk/en/articles/9362956-what-commission-do-you-earn)).
- These rates pay for **selling** (audience, ads, street teams). A website alone does not earn them.

### Recommendation [EST]
- **Don't use pure revenue share.** You carry the event risk (cancellation, weak lineup, refunds). Payout also arrives 7-30 days after the event, and attribution through Ticketmelon is weak.
- **If a client wants skin in the game, offer a hybrid:**
  - Build at about 70-80% of list.
  - Plus **3-5% of ticket revenue attributable to your tracked links or promo codes**.
  - Cap the bonus at about 1x the build fee.
  - Attribute sales through a unique Ticketmelon promo code or tracking link per channel [VERIFY that Ticketmelon supports this].
- **Reserve 10-15% commissions** for engagements where you also run paid ads or the campaign. Even then, charge the media budget separately.

---

## 7. Recommended Packages

### 7.1 Tier definitions

**ESSENTIAL: PHP 45,000 (~$750 / ~THB 25,000), 2-3 weeks**
- One-page scrolling site: hero with countdown, about, lineup grid, schedule, venue and map, FAQ accordion, sticky "Buy Tickets" bar.
- Semi-custom design on your in-house starter kit, using the client's key visual. One round of design revisions.
- Ticketmelon integration: deep links to the event page, or the widget embed if available, plus a sold-out/coming-soon toggle.
- GA4 and Meta Pixel base install, Open Graph share image, basic SEO metadata.
- Hosting on Cloudflare Pages (free). Content changes go through you (no CMS).
- Estimated effort: about 45 hours.

**PRO: PHP 120,000 (~$2,000 / ~THB 66,000), 4-6 weeks (recommended anchor)**
- Seven pages: Home, Tickets, Lineup, Schedule, Venue/Getting There, FAQ, Contact.
- Fully custom UI design (desktop and mobile). Two revision rounds.
- **Headless CMS (Sanity free tier or Payload)** so the client can edit lineup, schedule, FAQ and ticket-tier display. Includes a 1-hour CMS training session and a Loom guide.
- Ticketmelon integration: per-tier buy buttons with UTM tagging, embed where supported, on-sale/sold-out states.
- **Tracking pack included:** GTM, GA4, Meta and TikTok pixels, outbound ticket-click events, UTM kit.
- **SEO setup included:** Event schema, sitemap, Search Console.
- Newsletter or waitlist form (Brevo/Mailchimp).
- 30-day post-launch bug warranty.
- Estimated effort: about 110 hours.

**PREMIUM: PHP 280,000 (~$4,650 / ~THB 155,000), 7-10 weeks**
- Everything in Pro, plus art direction and a custom visual system extended from the event key art.
- Motion design: scroll-driven animation (GSAP or Lottie), a lineup reveal sequence, micro-interactions, all tuned for Core Web Vitals.
- **Bilingual (EN/TL or EN/TH)** with a language switcher. Client supplies the translation or buys the copywriting add-on.
- Artist or speaker detail pages from the CMS.
- One ads landing page. A **post-event recap page template**, delivered ready to publish.
- Load test and on-sale readiness check before the ticket drop.
- 60-day warranty, plus a launch-day on-call window.
- Estimated effort: about 240 hours.

### 7.2 Cost and margin build [EST]

| Tier | Hours | Internal cost (@PHP 600/hr) | Price | Gross margin | Effective sell rate |
|---|---|---|---|---|---|
| Essential | 45 | PHP 27,000 | PHP 45,000 | 40% | PHP 1,000/hr |
| Pro | 110 | PHP 66,000 | PHP 120,000 | 45% | PHP 1,090/hr |
| Premium | 240 | PHP 144,000 | PHP 280,000 | 49% | PHP 1,170/hr |

**Floor prices** (25% minimum margin): Essential PHP 36,000; Pro PHP 88,000; Premium PHP 192,000. Never discount below these.

### 7.3 Sensitivity analysis (plus or minus 20%) [EST]

All win rates are **assumptions** for qualified leads in the PH market. Calibrate them against your actual close data after 10-15 proposals.

**Essential** (cost PHP 27,000)

| Price | Margin/deal | Assumed win rate | Gross profit per 10 leads |
|---|---|---|---|
| PHP 36,000 (-20%) | 9,000 (25%) | 55% | 49,500 |
| PHP 40,500 (-10%) | 13,500 (33%) | 50% | 67,500 |
| **PHP 45,000** | **18,000 (40%)** | **45%** | **81,000** |
| PHP 49,500 (+10%) | 22,500 (45%) | 38% | 85,500 |
| PHP 54,000 (+20%) | 27,000 (50%) | 30% | 81,000 |

**Pro** (cost PHP 66,000)

| Price | Margin/deal | Assumed win rate | Gross profit per 10 leads |
|---|---|---|---|
| PHP 96,000 (-20%) | 30,000 (31%) | 45% | 135,000 |
| PHP 108,000 (-10%) | 42,000 (39%) | 40% | 168,000 |
| **PHP 120,000** | **54,000 (45%)** | **35%** | **189,000** |
| PHP 132,000 (+10%) | 66,000 (50%) | 30% | 198,000 |
| PHP 144,000 (+20%) | 78,000 (54%) | 25% | 195,000 |

**Premium** (cost PHP 144,000)

| Price | Margin/deal | Assumed win rate | Gross profit per 10 leads |
|---|---|---|---|
| PHP 224,000 (-20%) | 80,000 (36%) | 35% | 280,000 |
| PHP 252,000 (-10%) | 108,000 (43%) | 30% | 324,000 |
| **PHP 280,000** | **136,000 (49%)** | **27%** | **367,000** |
| PHP 308,000 (+10%) | 164,000 (53%) | 23% | 377,000 |
| PHP 336,000 (+20%) | 192,000 (57%) | 20% | 384,000 |

**What the analysis shows**
- Discounting below list destroys profit quickly in every tier.
- Above list, profit is flat to slightly higher. Premium buyers are the least price-sensitive.
- So launch at the recommended prices, then **test +10%** once you have three portfolio pieces.
- **Never respond to an objection with a price cut.** Move the client down a tier or remove scope instead.

### 7.4 Maintenance retainers (monthly, billed in advance, 3-month minimum) [EST]

| Plan | PHP/mo | USD/mo | THB/mo | Includes |
|---|---|---|---|---|
| **Care** | 5,000 | ~$85 | ~2,800 | Hosting and domain management, uptime monitoring, dependency updates, backups, 1 hr of content edits |
| **Growth** | 12,000 | ~$200 | ~6,600 | Care, plus 4 hrs of edits or new sections, monthly GA4 snapshot report, 48-hr response |
| **On-Sale** (seasonal, 2-3 months around ticket drops) | 25,000 | ~$420 | ~14,000 | Growth, plus 10 hrs, same-day turnaround, on-sale day standby, ads landing-page tweaks |

- Unused hours do not roll over.
- Overage is billed at PHP 1,200/hr.
- An annual prepay gets 10% off, or one free light refresh.

### 7.5 Payment terms

| Tier | Recommended schedule | Market norm |
|---|---|---|
| Essential | **50% deposit / 50% before go-live** | 50/50 is the TH agency standard ([DAB](https://digitalagencybangkok.com/?p=31621)) [SRC] |
| Pro | **50% / 30% at design approval / 20% before go-live** | 40/40/20 and 50/30/20 are common milestone splits [EST] |
| Premium | **40% / 30% at design approval / 30% before go-live** | Same [EST] |

Additional terms to include [EST unless marked]:
- **Launch gate.** The final payment is due **before** DNS cutover, not after the event. Event clients' cash flow collapses after the show.
- **Stalled-project clause.** Final payment becomes due if the client is unresponsive for more than 30 days. DAB uses a six-week trigger [SRC].
- **Change requests.** Billed at PHP 1,200/hr, or quoted as fixed mini-scopes.
- **Kill fee.** The deposit is non-refundable. Work completed beyond the deposit is billed if the event is cancelled.
- **Late fee.** 1.5-2% per month on invoices over 15 days late.
- **Discounts.** Every discount must be written with a reason and an expiry. Examples: repeat-edition client (-10%) or multi-event contract (-10-15%). Prefer value-adds such as a free recap page over cutting price.

### 7.6 Tax and VAT notes

**Philippines**
- **VAT.** 12% VAT applies if you are VAT-registered. Registration is mandatory once gross receipts exceed **PHP 3,000,000** a year ([Beancount PH guide](https://beancount.io/es/blog/2026/08/12/philippines-8-percent-flat-tax-freelancers-2026-guide), [Thera](https://www.getthera.com/blog/freelancer-tax-philippines-guide)) [SRC; VERIFY with BIR].
- **Below the threshold** you are non-VAT. You can elect either the **8% flat income tax on gross** (which replaces the 3% percentage tax) or graduated rates plus **3% percentage tax** [SRC; VERIFY].
- **How to quote.** State prices "exclusive of VAT". If you are VAT-registered, add 12% (PHP 120,000 becomes PHP 134,400). If you are not, write "Non-VAT registered" on the invoice and in the quote.
- **Withholding by corporate clients.** They usually deduct expanded withholding tax and give you BIR Form 2307. Common rates are 2% (contractor or services) or 5-10% (professional fees) [VERIFY with an accountant]. Price so you net your target, or state that quotes are gross of EWT.
- **Thai clients.** Selling services from PH to a client abroad, paid in foreign currency, may qualify for zero-rated VAT [VERIFY].

**Thailand**
- **VAT.** 7%, with mandatory registration above **THB 1.8M** annual turnover ([FlowAccount](https://flowaccount.com/blog/vat-in-thailand-a-complete-guide-for-businesses/), [Forvis Mazars](https://www.forvismazars.com/th/en/insights/doing-business-in-thailand/things-you-should-know/does-my-company-need-to-be-vat-registered)) [SRC]. A cut to the threshold has been proposed ([VATCalc](https://www.vatcalc.com/thailand/thailand-vat-registration-threshold-drop-proposal/)), so check its status.
- **Withholding by Thai companies.** They commonly withhold **3% on domestic service fees** [VERIFY].
- **Paying a foreign (PH) provider.** The Thai client may have to self-assess 7% VAT (reverse charge, PP.36) and withhold tax on the remittance [VERIFY with a Thai accountant].
- **Contracts.** Put a "taxes and withholdings" clause in every TH contract and decide upfront whether quotes are net or gross.

---

## 8. Ticketmelon-Specific Scoping Notes

- **What the research found.** Ticketmelon is Thailand's second-largest ticketing platform, with 2,000+ events a year. It entered the PH market in 2019 and expanded in 2023 ([Interaksyon/Philstar](https://interaksyon.philstar.com/trends-spotlights/2023/05/01/249849/thailand-based-ticketing-platform-to-expand-market-in-philippines/), [Malaya](https://malaya.com.ph/entertainment/ticketmelon-to-transform-the-way-filipinos-attend-events)).
- **What I could not find:**
  - organizer fee schedules
  - embed widget documentation
  - pixel or postback support
  - an API

  [VERIFY directly with Ticketmelon or in the organizer dashboard before you scope "embedded checkout" or "purchase conversion tracking".]
- **Safe default scope** (no Ticketmelon dependency):
  - deep links per ticket tier, with UTM parameters
  - outbound-click conversion events in GA4 and the pixels
  - ticket tiers and prices maintained in the CMS
  - a manual or toggle-based "sold out" state
- **Comparable platforms.** Others such as KonfHub use postMessage to bridge iframe purchase events to the host page ([KonfHub](https://blog.konfhub.com/a-complete-guide-to-seo-and-tracking-integrations-in-konfhub)). If Ticketmelon's widget does the same, purchase tracking becomes a sellable add-on.

---

## 9. Review Cadence

- **After every 5 proposals:** log win/loss, the price quoted, and the stated objection. Re-fit the win-rate assumptions in section 7.3.
- **Quarterly:** re-check FX rates, vendor prices ([VERIFY] items), and competitor pages (Designblue, DAB, ColorWhistle).
- **Annually:** raise list prices 5-10% in line with inflation and portfolio strength. Grandfather active retainer clients for one edition.

---

## Sources

- Designblue Manila, website cost PH: https://designbluemanila.com/blogs/how-much-does-a-website-cost-in-the-philippines-an-honest-breakdown
- Designblue Manila, maintenance cost PH: https://designbluemanila.com/blogs/what-website-maintenance-actually-costs-in-the-philippines
- 9100 Web Studio: https://webstudio9100.lovable.app/
- Hashmeta PH SEO pricing 2026: https://hashmeta.com/ph/posts/how-much-seo-costs-philippines-2026-pricing-guide
- Digital Agency Bangkok, website cost TH 2026: https://digitalagencybangkok.com/?p=31621
- Digital Agency Bangkok, packages: https://digitalagencybangkok.com/web-design-packages-in-thailand/
- ParallelHQ, web design Thailand: https://www.parallelhq.com/blog/web-design-thailand
- ColorWhistle, concert website cost: https://colorwhistle.com/website-cost-features/concert-website-cost-usa/
- Dribbble, entertainment web design: https://dribbble.com/services/244049-Entertainment-Music-Web-Design
- Agiled, web design pricing: https://agiled.app/hub/agencies/how-to-price-web-design-services
- Clutch PH web designers / developers: https://clutch.co/ph/web-designers , https://clutch.co/ph/web-developers
- Second Talent, PH web dev: https://www.secondtalent.com/developer-rate-card/web-developer-philippines/
- Second Talent, PH cost to hire: https://www.secondtalent.com/cost-to-hire/philippines/
- Second Talent, TH web dev: https://www.secondtalent.com/developer-rate-card/web-developer-thailand/
- Second Talent, TH WordPress: https://www.secondtalent.com/developer-rate-card/wordpress-developer-thailand/
- Second Talent, TH cost to hire: https://www.secondtalent.com/cost-to-hire/thailand/
- Everhour, TH rate calculator: https://everhour.com/calculators/hourly-rate-calculator-in-thailand
- HireTalent.ph, Filipino designer pay: https://hiretalent.ph/what-to-pay-filipino-graphic-designers
- Payscale PH web designer: https://www.payscale.com/research/PH/Job=Web_Designer/Salary/9c4a64f4/Makati-City-Graphic-Design
- Digital Marketing Philippines, WP maintenance: https://digitalmarketingphilippines.com/wordpress-maintenance-services/
- Vercel Pro docs / MakerKit: https://examples.vercel.com/docs/accounts/plans/pro , https://makerkit.dev/blog/tutorials/vercel-cost
- Sanity pricing (Flow Ninja, CostBench): https://www.flowninja.com/blog/sanity-cms-pricing , https://costbench.com/software/cms/sanity-cms/
- Storyblok pricing (Capterra, PricingSaaS): https://www.capterra.com/p/213991/Storyblok/pricing/ , https://pricingsaas.com/companies/storyblok
- DomainOffer .ph / .com.ph: https://domainoffer.net/tld/ph , https://domainoffer.net/price-compare-com.ph
- Ticket Fairy promoter commission calculator: https://www.ticketfairy.com/tools/promoter-commission-calculator
- Posh, paid event promoter guide: https://posh.vip/university/post/how-to-become-paid-event-promoter
- Skiddle affiliate commission: https://help.promotioncentre.co.uk/en/articles/9362956-what-commission-do-you-earn
- KonfHub tracking integrations: https://blog.konfhub.com/a-complete-guide-to-seo-and-tracking-integrations-in-konfhub
- Interaksyon, Ticketmelon PH expansion: https://interaksyon.philstar.com/trends-spotlights/2023/05/01/249849/thailand-based-ticketing-platform-to-expand-market-in-philippines/
- Malaya, Ticketmelon PH: https://malaya.com.ph/entertainment/ticketmelon-to-transform-the-way-filipinos-attend-events
- PH freelancer tax (Beancount, Thera): https://beancount.io/es/blog/2026/08/12/philippines-8-percent-flat-tax-freelancers-2026-guide , https://www.getthera.com/blog/freelancer-tax-philippines-guide
- TH VAT (FlowAccount, Forvis Mazars, VATCalc): https://flowaccount.com/blog/vat-in-thailand-a-complete-guide-for-businesses/ , https://www.forvismazars.com/th/en/insights/doing-business-in-thailand/things-you-should-know/does-my-company-need-to-be-vat-registered , https://www.vatcalc.com/thailand/thailand-vat-registration-threshold-drop-proposal/
- FX: https://www.poundsterlinglive.com/history/USD-PHP-2026 , https://currencyconvert.online/usd/thb , https://pluang.com/en/tools/currency-converter/usd-thb

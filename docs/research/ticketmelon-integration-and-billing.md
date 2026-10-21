# Ticketmelon: Integration Options, Fees and Billing

Research date: 2026-10-19. Every claim has a source URL. **UNVERIFIED** means we could not confirm it from a primary source. "Observed" means we checked it directly against a live Ticketmelon page or file on 2026-10-19.

Ticketmelon has two organizer-facing sites. The organizer marketing site and help center is `organizer.ticketmelon.com`, which is a Webflow site. The consumer and checkout site is `www.ticketmelon.com`, a Next.js app that sits behind a Queue-it waiting room. `help.ticketmelon.com` redirects to a login-gated Atlassian service desk (observed, `https://help.ticketmelon.com` → `ticketmelon-dev.atlassian.net/servicedesk/...`).

---

## 1. Summary (TL;DR)

- **There is no public API, developer docs, SDK, webhook system or WordPress plugin.** We searched the organizer site, the help center (about 84 articles) and the web, and found nothing. `api.ticketmelon.com` returns 403, and `developers.ticketmelon.com` does not resolve (observed). Integration is effectively **link-out to the Ticketmelon event page**.
- **We cannot iframe the event pages.** `www.ticketmelon.com` event pages send `X-Frame-Options: SAMEORIGIN` (observed on https://www.ticketmelon.com/meltlivehouse/stvincent). Checkout always happens on the Ticketmelon domain.
- **Ticketmelon sells "White Labeling" and a custom microsite as a sales-led product.** Their pitch is to "Integrate our ticketing right into your own website and mobile application" ([Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration), [Box Office](https://organizer.ticketmelon.com/box-office), [White Label](https://organizer.ticketmelon.com/white-label)). They publish no technical details or pricing, so we need to **contact sales**.
- **Tracking pixels are installed by Ticketmelon staff.** Their wording is "Send us your tracking code and we'll install it on your event page… Facebook Pixel or Google Analytics" ([source](https://organizer.ticketmelon.com/Ticketing-registration)). There is no self-serve pixel field. TikTok pixel and GTM container support are UNVERIFIED.
- **Fees (last published pricing, July 2026):**
  - TH: 3.5% for tickets under ฿200. For tickets of ฿200 or more, 3% plus ฿9 (฿200–999) or ฿15 (฿1,000 and up).
  - PH: 3.99% per paid ticket, plus ₱20 per ticket over ₱300.
  - Payment gateway: about 3% on top, which rose about 0.25% for THB cards from 2026-06-22.
  - Fees exclude VAT. Free events cost nothing. There is no setup or minimum fee.
  - By default the buyer pays the fees. The organizer can absorb all or part of them in 0.5% steps.
  - Sources: [pricing archive](https://web.archive.org/web/20260712102812/https://organizer.ticketmelon.com/pricing) and a [live fee config file](https://tm-fee-rate.s3.ap-southeast-1.amazonaws.com/tm_fee_rate/default_tm_fee_rate_v2.json).
- **The pricing page was removed** and `/pricing` now 301-redirects to the homepage (observed). Treat all numbers as indicative until sales confirms them.
- **Payout sources conflict:**
  - The Terms of Service say payout is "within fourteen (14) business days after the end date" of the event ([Terms §2.2A](https://organizer.ticketmelon.com/terms)).
  - The help center says the organizer can request a payout "anytime", with transfer in 5–10 business days ([source](https://organizer.ticketmelon.com/help-center/event-payout)).
  - The pricing graphic says "Fast weekly payouts".
  - The only payout method shown is bank transfer.
- **PH buyer payment methods are good:** card, GCash, Maya, GrabPay and ShopeePay were all enabled on PH events (observed). TH events show card, PromptPay, TrueMoney, Rabbit LINE Pay, Alipay, WeChat Pay, ShopeePay and cash or counter (observed, plus the [help center](https://organizer.ticketmelon.com/help-center/accepted-payment-channels)).
- **There is a legal risk on buyer data.** The Organizer Agreement treats customer PII as Ticketmelon "Confidential Information" and includes a **non-solicitation clause covering Patrons** ([Terms §9–10](https://organizer.ticketmelon.com/terms)), even though the dashboard lets organizers export buyer emails. We must clarify this before planning any email or CRM remarketing.
- **Our data feed is manual.** We cannot pull live availability, prices or sold-out status through a supported interface. The site must keep event, tier and status data in our own CMS and link out.

---

## 2. Integration Options

| Option | Available? | Evidence | Effort for us |
|---|---|---|---|
| Public REST/GraphQL API | **No (none found)** | No developer docs on [organizer site](https://organizer.ticketmelon.com/) or [help center](https://organizer.ticketmelon.com/help-center). `api.ticketmelon.com` returns 403 (observed). No third-party listing either: [youreventkit review](https://youreventkit.com/tools/ticketmelon/) notes no API or embed info. | n/a |
| Partner / organizer API (private) | **UNVERIFIED** | The frontend calls an internal `https://api-frontend.ticketmelon.com` (observed in event-page config). It is undocumented, and using it would be unsupported scraping. We would have to ask sales whether a partner API exists. | Unknown, depends on sales |
| Embeddable widget / iframe checkout | **No (self-serve)** | `X-Frame-Options: SAMEORIGIN` on event pages (observed). No embed code is documented. | n/a |
| "White Labeling" (ticketing inside our site/app) | **Yes, sales-led** | "Integrate our ticketing right into your own website and mobile application" ([Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration), [Box Office](https://organizer.ticketmelon.com/box-office)). The mechanism (iframe allowlist? redirect? SDK?) is UNVERIFIED. | Medium to high. Needs a sales contract and scoping. |
| White-label microsite (Ticketmelon builds a branded site) | **Yes, sales-led** | "Bespoke microsites are designed by our web experts… Fast Microsite Implementation… Countdown & Interactive Widgets… Seamlessly Embedded on Your Microsite" ([White Label](https://organizer.ticketmelon.com/white-label)). Custom domain support is UNVERIFIED. | Low for us, but it competes with our own site. Cost unknown. |
| "Buy tickets" button / deep link to event page | **Yes** | Event URLs follow `https://www.ticketmelon.com/{organizerSlug}/{eventSlug}` (observed, e.g. `/meltlivehouse/stvincent`). The organizer sets the slug at event creation ([How to create an event](https://organizer.ticketmelon.com/help-center/how-to-create-an-event)). | **Low**, which makes this the default path |
| Deep link to a specific tier / pre-applied promo code via URL | **UNVERIFIED** | No URL parameter for promo or tier appears in the docs. Promo codes are typed in on the event page ([Promo codes](https://organizer.ticketmelon.com/help-center/creating-a-promo-code-for-your-event)). | n/a |
| Custom domain on Ticketmelon checkout | **UNVERIFIED** | Not mentioned anywhere. | Ask sales |
| Affiliate / referral tracking links | **No (none found)** | No affiliate program for organizers is documented. Promo codes with usage limits are the only per-channel attribution tool ([Promo codes](https://organizer.ticketmelon.com/help-center/creating-a-promo-code-for-your-event)). | Low: one promo code per channel |
| Webhooks (order created, sold out) | **No (none found)** | Not documented. | n/a |
| WordPress plugin / JS SDK | **No (none found)** | Not documented. Searches returned nothing. | n/a |
| Data export (CSV/Sheets) | **Yes (manual)** | Orders → "Export" downloads all order data, including buyer email ([Export](https://organizer.ticketmelon.com/help-center/how-to-export-data), [Event overview](https://organizer.ticketmelon.com/help-center/event-overview)). | Low, but manual |
| Developer docs URL | **None** | Not found. `developers.ticketmelon.com` does not resolve (observed). | — |
| Need to contact sales for API? | **Yes** | Their own instruction: "special requirements… Any other function not found on Ticketmelon platform… email organizers@ticketmelon.com" ([source](https://organizer.ticketmelon.com/help-center/having-special-requirements-for-your-event)). Partnerships: partnerships@ticketmelon.com ([PH page](https://organizer.ticketmelon.com/ph)). | — |

---

## 3. Data Available to Our Website

| Data | Can we pull it automatically? | Notes |
|---|---|---|
| Event name, dates, venue, description, images | **No supported way.** The data is server-rendered in the event page HTML (`__NEXT_DATA__`, observed). | Reading it would be scraping, which risks breaking without notice and breaching the Terms. **Enter it manually in our CMS.** |
| Ticket tiers and prices | **No.** The ticket list loads client-side from the internal API (observed: `ticket_type_group` is empty in the server render). | Manual. Tier "phases" with time-based prices are an organizer setting ([Phase](https://organizer.ticketmelon.com/help-center/what-does-phase-mean)). |
| Live availability / sold-out | **No.** | Manual flag in our CMS, updated by the organizer from the dashboard ([Event overview](https://organizer.ticketmelon.com/help-center/event-overview) shows sold vs total per type). |
| Sales numbers for our dashboard | **No.** Only the Ticketmelon dashboard, the Ticketmelon Manager app and CSV export are available. | [Export](https://organizer.ticketmelon.com/help-center/how-to-export-data) |
| Fee rates | A public JSON file is referenced by event pages: [default_tm_fee_rate_v2.json](https://tm-fee-rate.s3.ap-southeast-1.amazonaws.com/tm_fee_rate/default_tm_fee_rate_v2.json) (observed). | It is internal config and could change. It is useful as a cross-check only. |

**Conclusion:** without a sales-negotiated API, all event, tier and status data is **manual**. Our CMS is the source of truth for marketing content, and Ticketmelon is the source of truth for inventory and price at checkout.

---

## 4. Tracking and Analytics

| Question | Answer | Evidence |
|---|---|---|
| Facebook / Meta Pixel on event page | **Yes, Ticketmelon installs it on request.** | "Send us your tracking code and we'll install it on your event page… Facebook Pixel or Google Analytics" ([Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration)). The Box Office page says "Integrate… with your preferred analytics tools using our provided tracking codes" ([Box Office](https://organizer.ticketmelon.com/box-office)). |
| GA4 | **Yes, via the same request process.** | Same source. Whether events fire on checkout or purchase completion is UNVERIFIED. |
| GTM container (ours) | **UNVERIFIED** | Event pages load Ticketmelon's own GTM container `GTM-MJ98S8HP` (observed). Whether they will add an organizer container is unknown. |
| TikTok Pixel | **UNVERIFIED** | Not mentioned. The "tools like…" wording suggests it is possible. |
| Meta CAPI / server-side purchase events | **No evidence** | No webhooks or API exist. |
| UTM support | **UTM parameters will reach the page URL, but whether Ticketmelon stores or reports them is UNVERIFIED.** | No UTM handling was found in the docs or in the main JS bundle (observed). The dashboard has "Analytics" and "Sales and traffic comparison" ([Analytics](https://organizer.ticketmelon.com/help-center/how-to-view-analytics)), but it is unclear whether those include source attribution. |
| Conversion attribution back to our site | **Only via pixels installed on Ticketmelon pages, plus promo codes per channel.** | Our own GA4 only sees the outbound click. Purchase conversion must come from pixels Ticketmelon installs, or from manual reconciliation of CSV exports and promo-code usage. |
| Cross-domain GA4 linking | **UNVERIFIED** | Needs our GA4 tag (with the linker) on Ticketmelon pages. Ask sales. |

---

## 5. Fees and Billing

### 5.1 Fees by country (organizer service fee, "TM fee")

Primary source: per-currency pricing graphics on the organizer pricing page. The last archive capture is 2026-07-12 ([archive](https://web.archive.org/web/20260712102812/https://organizer.ticketmelon.com/pricing)). The graphics are still hosted on Ticketmelon's CDN: [THB](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e635306e67020ae91_THB.avif), [PHP](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715ee4c53f7450249bd7_PHP.avif), [SGD](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e352c93f1afd81bce_SGD.avif), [VND](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e9a266505614ffab1_VND.avif), [MYR](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e393b6f97a3ff9152_MYR.avif), [IDR](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e530b9b6b09301d06_IDR.avif), [USD](https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e0ddc25cdbfd6256c_USD.png).

Cross-check: the live fee config JSON, [default_tm_fee_rate_v2.json](https://tm-fee-rate.s3.ap-southeast-1.amazonaws.com/tm_fee_rate/default_tm_fee_rate_v2.json), keyed by ISO-4217 numeric currency code (observed 2026-10-19).

**Warning:** `organizer.ticketmelon.com/pricing` now 301-redirects to the homepage (observed). The rates are no longer publicly stated and may have changed. Get a written quote.

| Country / currency | TM service fee (per paid ticket) | Fixed add-on | Payment gateway fee | Tax on fees | Notes |
|---|---|---|---|---|---|
| **Thailand (THB)** | <฿200: **3.5%**. ≥฿200: **3%** | ฿9/ticket (฿200–999). ฿15/ticket (≥฿1,000) | **~3%** ([TH help](https://organizer.ticketmelon.com/th/help-center/payment-gateway-fee)). Card fee up about **0.25%** from 2026-06-22 ([THB update](https://organizer.ticketmelon.com/help-center/latest-update-on-payment-gateway-fees-thai-baht)) | "VAT Excluded" (graphic). Event VAT field = 7% (observed) | The JSON matches the graphic: 3.5% / 3%+9 / 3%+15 |
| **Philippines (PHP)** | **3.99%** (graphic). The JSON says **4%** | ₱20/ticket for tickets over ₱300 | **~3%** (graphic footnote) | "VAT Excluded". Event VAT field = 12% (observed) | 3.99% vs 4%: small mismatch, confirm |
| Singapore (SGD) | <S$20: 3.5%. ≥S$20: 3% | S$1/ticket over S$20 | ~3%. Card fee up to **+0.5%** from 2026-09-30 ([SGD update](https://organizer.ticketmelon.com/help-center/latest-update-on-payment-gateway-fees-singapore-dollar)) | "GST Excluded" | |
| Vietnam (VND) | <200k: 3.99%. 200k–999,999: 3.5%. ≥999,999: 3% | 8,000–11,000 VND/ticket over 200k | ~3% | "VAT Excluded" | JSON: 4% / 3.5%+8,000 / 3%+11,000 |
| Malaysia (MYR) | **5%** (graphic). JSON tm_fee = 2% (+RM2 over RM50) | RM2/ticket over RM50 | Not separately stated on the graphic | "SST Excluded" | The graphic's 5% is likely all-in (TM + gateway). **UNVERIFIED** |
| Indonesia (IDR) | 3% | — | ~3% | "VAT Excluded" | |
| USD events | 3% | US$0.50/ticket | ~3% | "TAX Excluded" | |
| **Free events** | **Free** ("Free to Use for Free Entry Events") | — | — | — | All graphics |
| Setup / monthly / minimum fee | **None** "for standard event setups" | — | — | — | All graphics. Large or complex events get a custom plan ("Talk to Us"). |
| Refund processing fee | **4.00% of the discounted face value** for refunds processed through Ticketmelon's gateway | — | — | — | [Terms §2.2(B)](https://organizer.ticketmelon.com/terms) |

**Who pays:**
- The organizer chooses to absorb all fees, pass all fees to the buyer, or partially absorb the TM fee in **0.5% increments**. The payment gateway fee is either absorbed or passed on in full ([Who pays](https://organizer.ticketmelon.com/help-center/who-pays-the-fees-of-your-event), [Create event](https://organizer.ticketmelon.com/help-center/how-to-create-an-event)).
- **The default is pass-on to the buyer** ([Create event](https://organizer.ticketmelon.com/help-center/how-to-create-an-event)). Every pricing graphic says "Fees can be passed on to ticket buyers… paid by attendee by default."
- Fees are deducted automatically from each transaction. The dashboard shows "TM Fee (VAT incl.)", "Payment Fee (VAT incl.)" and "Net Payout" ([Fees summary](https://organizer.ticketmelon.com/help-center/how-to-view-fees-summary), [Event overview](https://organizer.ticketmelon.com/help-center/event-overview)).
- The organizer is responsible for taxes on its own ticket sales ([Terms §3](https://organizer.ticketmelon.com/terms)).
- Tax invoices for Ticketmelon fees are issued only in the name of the company requesting payout, which must match the bank account holder. They are sent after the transfer ([Tax invoice](https://organizer.ticketmelon.com/help-center/how-to-request-a-tax-invoice-for-ticketmelon-fees)).

**Illustrative buyer-side math (ESTIMATE ONLY, not confirmed by Ticketmelon; it assumes full pass-on and that VAT applies to the fees):**
- TH ฿1,000 ticket: TM fee 3% + ฿15 = ฿45, plus 7% VAT ≈ ฿48. Gateway ≈3% ≈ ฿30+. The buyer pays about ฿1,080.
- PH ₱2,000 ticket: TM fee 3.99% + ₱20 ≈ ₱100, plus 12% VAT ≈ ₱112. Gateway ≈3% ≈ ₱60+. The buyer pays about ₱2,175.

### 5.2 Buyer payment methods

| Market | Methods | Evidence |
|---|---|---|
| Thailand | Visa/Mastercard/Amex/JCB/UnionPay/Discover/Diners; ATM/bank counter/mobile banking (KBank, SCB, BBL, KTB, Krungsri); Counter Service (7-Eleven-type counters, FamilyMart, Big C, etc.); Alipay; Rabbit LINE Pay; PromptPay; TrueMoney Wallet; WeChat Pay | [Accepted channels](https://organizer.ticketmelon.com/help-center/accepted-payment-channels), [TrueMoney](https://organizer.ticketmelon.com/help-center/how-to-pay-with-truemoney-wallet). Observed enabled flags on a TH event: credit, promptpay, truewallet, linepay, alipay, wechat, shopeepay, cash ([event](https://www.ticketmelon.com/meltlivehouse/stvincent)) |
| Philippines | Card, **GCash, Maya (PayMaya), GrabPay, ShopeePay** | Observed `payment_channel` flags on 3 PH events, e.g. [John Williams concert](https://www.ticketmelon.com/FilmConcertsPH/filmmusiclegends-john-williams-main) |
| Other | Also supported in the platform's channel list: Touch 'n Go, GoPay, OVO, DANA, QRIS, MoMo, VNPay, ZaloPay, PayNow, Apple Pay, Google Pay, Atome, Grab PayLater, KBZ | Observed channel keys in event JSON. Each one is enabled per event or market. |
| Instalments | Card instalments (e.g. 4–10 months above minimum amounts) on some TH events | [Instalments T&C](https://organizer.ticketmelon.com/help-center/installments-terms-and-conditions), observed `installment_options`. [2C2P blog](https://organizer.ticketmelon.com/th/blog/ticketmelon-2c2p-event-payments-southeast-asia) |
| Gateway | 2C2P (PCI DSS, ISO 27001) | [2C2P blog](https://organizer.ticketmelon.com/th/blog/ticketmelon-2c2p-event-payments-southeast-asia), pricing graphics, `t.2c2p.com` script on event pages (observed) |
| Unpaid hold | Card orders must be paid within 10 minutes. Cash orders within 2 hours. | [Event overview](https://organizer.ticketmelon.com/help-center/event-overview) |

---

## 6. Payouts

| Topic | Finding | Evidence |
|---|---|---|
| Who collects money | Ticketmelon collects all ticket revenue as merchant of record via its own gateway. The organizer **must** use the Ticketmelon Gateway. | [Terms §2.1–2.2](https://organizer.ticketmelon.com/terms) |
| Timing (contract) | "Commercially reasonable efforts to submit payment… within fourteen (14) business days after the end date for the Event". Funds can be withheld for chargebacks, complaints or fraud. | [Terms §2.2(A)](https://organizer.ticketmelon.com/terms) |
| Timing (help center) | Request a payout "anytime" from the dashboard. Transfer within **5–10 business days**. | [Event payout](https://organizer.ticketmelon.com/help-center/event-payout), [Sales breakdown & payout](https://organizer.ticketmelon.com/help-center/how-to-view-sales-breakdown-and-request-payout) |
| Timing (marketing) | "Fast weekly payouts". PH page: "lightning-fast event payouts in local currency". | Pricing graphics ([archive](https://web.archive.org/web/20260712102812/https://organizer.ticketmelon.com/pricing)), [PH page](https://organizer.ticketmelon.com/ph) |
| **Interpretation** | Pre-event partial payouts appear possible on request, but the contract only commits to 14 business days post-event. **Get the payout schedule and any reserve or holdback in writing.** | — |
| Method | Bank transfer to an account in the organizer's (company) name, in local currency | [Event payout](https://organizer.ticketmelon.com/help-center/event-payout), [Tax invoice](https://organizer.ticketmelon.com/help-center/how-to-request-a-tax-invoice-for-ticketmelon-fees), [Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration) |
| Refunds | Refunds are the organizer's responsibility and must be authorized by the organizer. Ticketmelon refunds a buyer only after the organizer funds it. Ticketmelon fees are **not refunded**. A 4% refund fee applies. For cancelled events, the organizer is invoiced for fees and buyers get a refund of face value. Buyers wait about 30–45+ days. | [Terms §2.2(B)](https://organizer.ticketmelon.com/terms), [Refund timing](https://organizer.ticketmelon.com/help-center/how-long-does-it-take-to-get-a-refund), [Can I get a refund](https://organizer.ticketmelon.com/help-center/can-i-get-a-refund-for-my-ticket) |
| Chargebacks | Charged back to the organizer, either deducted from the balance or invoiced (due in 30 days) | [Terms §2.2(C)](https://organizer.ticketmelon.com/terms) |
| Forced refunds | Ticketmelon may force refunds "at any time for any reason", for example after many complaints | [Terms §2.2(B)(iii)](https://organizer.ticketmelon.com/terms) |
| Refund Protect (buyer insurance add-on) | Optional buyer-paid fee that enables refunds in unforeseen circumstances. Enabled per event. | [What is Refund Protect](https://organizer.ticketmelon.com/help-center/what-is-refund-protect), observed `is_refund_protect` |
| Buyer-reported refund delays | Two to three Trustpilot reviews describe slow or disputed refunds. The sample is small. | [Trustpilot](https://pl.trustpilot.com/review/www.ticketmelon.com), [youreventkit](https://youreventkit.com/tools/ticketmelon/) |

---

## 7. Organizer Features

| Feature | Available | Evidence |
|---|---|---|
| Multiple ticket types / tiers | Yes | [Create ticket types](https://organizer.ticketmelon.com/help-center/how-to-create-ticket-type) |
| Early bird / phased pricing | Yes, via phases with selling periods | [Phase](https://organizer.ticketmelon.com/help-center/what-does-phase-mean), [Early bird](https://organizer.ticketmelon.com/help-center/what-is-the-difference-between-early-bird-and-regular-tickets) |
| Presale / hidden tickets | Yes, unlocked by promo code | [Presale](https://organizer.ticketmelon.com/help-center/what-are-presale-tickets), [Promo codes](https://organizer.ticketmelon.com/help-center/creating-a-promo-code-for-your-event) |
| Promo codes | Fixed or % discount, per ticket type, usage caps, date windows, unlock special tickets | [Promo codes](https://organizer.ticketmelon.com/help-center/creating-a-promo-code-for-your-event) |
| Reserved seating / seat map | Yes ("Custom Seatmap"). The older help article says seated and multi-date events need setup via organizers@ticketmelon.com. A PH event had `is_seatmap: true` (observed). | [Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration), [Special requirements](https://organizer.ticketmelon.com/help-center/having-special-requirements-for-your-event), [Seated booking](https://organizer.ticketmelon.com/help-center/how-to-book-seated-and-calendar-event-tickets) |
| Multi-date / calendar booking | Yes | [Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration) |
| Group / team tickets, bundles, add-ons (merch, parking) | Bundling and add-ons yes. "Team/group tickets" as a named feature is UNVERIFIED. A bundle ticket type is likely the workaround. | [Ticketing & Registration](https://organizer.ticketmelon.com/Ticketing-registration) |
| Registration form / custom questions | Yes (`is_regisform`, `form` fields, registration events) | Observed event JSON. [Special requirements](https://organizer.ticketmelon.com/help-center/having-special-requirements-for-your-event) |
| Virtual queue for hot on-sales | Yes, Queue-it based | [Queue system](https://organizer.ticketmelon.com/help-center/how-does-the-queueing-system-work). Queue-it cookies seen on event pages (observed). |
| E-ticket with QR | Yes. PDF ticket plus "My Ticket" in web or app. Tickets transferable by forwarding the email unless ID-matched. | [Ticket transfer](https://organizer.ticketmelon.com/help-center/can-i-transfer-tickets-to-friends), [Enter with e-ticket](https://organizer.ticketmelon.com/help-center/how-to-enter-the-event-using-e-ticket) |
| Check-in app | **TM Gate Agent** (iOS/Android, free), up to 50 gate users per event, needs an internet connection, scan log in the dashboard | [Gate Agent](https://organizer.ticketmelon.com/help-center/how-to-validate-tickets-by-tm-gate-agent-application), [App Store](https://apps.apple.com/app/id1198923153), [Scan log](https://organizer.ticketmelon.com/help-center/how-to-check-number-of-attendees) |
| Buyer data export | Yes. Orders export includes buyer name and email (see the PII risk in §8). | [Export](https://organizer.ticketmelon.com/help-center/how-to-export-data), [Event overview](https://organizer.ticketmelon.com/help-center/event-overview) |
| Reports / analytics / buyer insights | Sales summary, analytics, sales and traffic comparison, buyer insights | [Analytics](https://organizer.ticketmelon.com/help-center/how-to-view-analytics), [Insights](https://organizer.ticketmelon.com/help-center/how-to-view-ticket-buyer-insights), [Sales & traffic](https://organizer.ticketmelon.com/help-center/how-to-view-sales-and-traffic-comparison) |
| Event page branding | Colors, button text, banner and poster images, rich description (observed `style` object). Pages live at ticketmelon.com. | [Event](https://www.ticketmelon.com/meltlivehouse/stvincent) |
| On-site box office, badge printing, cashless/RFID, mPOS | Yes, as paid services | [Box Office](https://organizer.ticketmelon.com/box-office), [PH page](https://organizer.ticketmelon.com/ph) |
| Event approval | Submitted events are reviewed within about 24 hours | [Create event](https://organizer.ticketmelon.com/help-center/how-to-create-an-event) |

---

## 8. Constraints and Risks

1. **Checkout must happen on the Ticketmelon domain.** Iframing is blocked (`X-Frame-Options: SAMEORIGIN`, observed), so users leave our site and conversion tracking depends on Ticketmelon installing our pixels.
2. **There is no API, so data sync is manual.** Prices, tiers, dates and sold-out flags on our site can go stale. Scraping the internal `api-frontend.ticketmelon.com` or `__NEXT_DATA__` is unsupported and could break or breach the Terms. We do not recommend it.
3. **Buyer data ownership is a legal risk.** Terms §9 list "customer names, mailing addresses, and other personally-identifiable information" as Ticketmelon Confidential Information. §10 forbids soliciting "any of Our customers (including any Patron…)" ([Terms](https://organizer.ticketmelon.com/terms)). This may restrict emailing or remarketing to exported buyers. **Get written clarification, and collect our own opt-in leads on our site.**
4. **Pricing is opaque and has shifted.** The public pricing page was removed after July 2026. Gateway card fees rose in TH (June 2026) and SG (September 2026) ([THB](https://organizer.ticketmelon.com/help-center/latest-update-on-payment-gateway-fees-thai-baht), [SGD](https://organizer.ticketmelon.com/help-center/latest-update-on-payment-gateway-fees-singapore-dollar)). The Terms say fees "may change periodically".
5. **Cash flow is uncertain.** The contract allows payout up to 14 business days after the event, plus discretionary withholding. Chargebacks and refunds are funded by the organizer, and fees are non-refundable plus a 4% refund fee ([Terms](https://organizer.ticketmelon.com/terms)).
6. **Branding is limited.** Event pages carry Ticketmelon branding. Full white-label requires a sales engagement ([White Label](https://organizer.ticketmelon.com/white-label)).
7. **Pixel installs are a manual, staff-dependent process.** Turnaround, the event set (ViewContent / InitiateCheckout / Purchase) and TikTok support are all UNVERIFIED.
8. **Terms require organizers to promote Ticketmelon.** §11 says the organizer will state in marketing that tickets are "available for sale at the Ticketmelon website" ([Terms](https://organizer.ticketmelon.com/terms)). That fits a link-out model.
9. **The help portal is gated.** `help.ticketmelon.com` sends users to an Atlassian login (observed), and the support response time is not guaranteed ([Terms §8](https://organizer.ticketmelon.com/terms)).
10. **Ticketmelon's marketing pages contain template filler** (e.g. "Jupter" template FAQ text on [White Label](https://organizer.ticketmelon.com/white-label)). Treat feature claims on marketing pages as softer evidence than the help center or Terms.

---

## 9. Recommended Architecture

### Primary: marketing site + Ticketmelon link-out (works with no API)

```
[Astro or Next.js static site (SSG/ISR)]
   ├─ CMS (Sanity/Contentful/MDX): Event, TicketTier(display only), status(on-sale|low|sold-out|ended),
   │     ticketmelonUrl, onSaleAt, promoCodes per channel
   ├─ Event pages: SEO, JSON-LD Event schema (offers.url = Ticketmelon URL, availability from CMS)
   ├─ "Buy tickets" CTA → https://www.ticketmelon.com/{eo}/{event}?utm_source=site&utm_medium=cta&utm_campaign={event}
   │     (rel="noopener", opens same tab or new tab, A/B test)
   ├─ Our GA4 + Meta Pixel + TikTok Pixel via our GTM (consent-gated: PDPA TH / DPA PH)
   │     fire "outbound_ticket_click" / Meta "InitiateCheckout"-like custom event on CTA click
   ├─ Lead capture form (our own opt-in list → email tool) — owned audience, avoids Terms §9–10 issue
   └─ Countdown / "on sale at" logic driven by CMS timestamps

[Ticketmelon event page + checkout]
   ├─ Our Meta Pixel ID + GA4 measurement ID installed by Ticketmelon staff (request via CSM)
   ├─ Channel-specific promo codes (e.g. IG10, TIKTOK10) for attribution
   └─ Organizer exports orders CSV → weekly reconciliation sheet (sales by promo code / pixel data)
```

**Ops loop (manual sync):**
1. The organizer creates the event in Ticketmelon and copies the URL into the CMS.
2. When a tier sells out or a phase changes, the organizer flips the status in the CMS. Target: same day. Use ISR or webhook rebuild from the CMS.
3. Each week, export orders and reconcile promo-code and UTM results.

**Why this approach:**
- It needs zero dependency on undocumented endpoints.
- It ships fastest.
- Our site stays fast and SEO-friendly.
- The fragile parts (stale status, attribution) are contained and visible.

### Upgrade path (if sales offers it)
- **White-label or partner API:** replace the manual status flag with a server-side fetch of availability at build time or on a short ISR interval. Add an embedded or branded checkout if they allow iframing for our domain. Add webhooks for sold-out events and orders, which would enable Meta CAPI and GA4 Measurement Protocol purchase events from our server.
- **Microsite option:** if Ticketmelon's own microsite is cheap, compare it against building ours. Ours keeps the brand, SEO and data. Theirs keeps checkout on-page.

### Fallback if pixels cannot be installed
- Rely on promo codes per channel plus UTM-tagged links plus CSV export reconciliation.
- Optimize paid social to our site's CTA-click event, a proxy conversion, instead of purchase.

---

## 10. Questions to Ask Ticketmelon Sales

**Integration**
1. Is there a partner or organizer API (REST or GraphQL) for events, ticket types, prices, availability and orders? What are the docs, auth method and rate limits, and is there a cost?
2. Do you offer webhooks (order paid, refund, sold out, ticket type status)?
3. What exactly is "White Labeling ... into your own website and mobile application"? Is it an iframe with a domain allowlist, a JS SDK, redirect checkout, or a custom domain (e.g. tickets.ourbrand.com)? What does it cost and what is the lead time?
4. Can we deep-link to a specific ticket type, or pre-apply a promo code via a URL parameter?
5. What does the White-Label Microsite cost? Can it use our domain?

**Tracking**

6. Which tags can you install on our event page and checkout: Meta Pixel, GA4, GTM container, TikTok Pixel, Google Ads? Which events fire (ViewContent, AddToCart, InitiateCheckout, Purchase with value and currency)? What is the turnaround?
7. Do you support GA4 cross-domain linking with our site? Are UTM parameters captured and shown in your Analytics?
8. Is there any server-side conversion option (Meta CAPI) or order-level export with source or UTM?

**Fees and billing (get a written quote for TH and PH)**

9. Confirm current TM fee, fixed per-ticket fee and payment gateway fee per payment method for THB and PHP. The PH pricing graphic says 3.99% but the config file says 4%. Is VAT added on top of fees?
10. Can the fee split be configured per ticket type? Do gateway fees differ for GCash, Maya, PromptPay or cards?
11. Are there volume discounts or custom plans for our expected volume?

**Payouts and risk**

12. What is the actual payout schedule: weekly pre-event, on request, or 14 business days post-event? Is there a reserve or holdback percentage? Are payouts made to PH and TH bank accounts in local currency? Do you charge FX or transfer fees?
13. How do refunds, the 4% refund fee, chargebacks and Refund Protect work in practice? Who is the merchant of record per country?

**Data**

14. Given Terms §9–10, may we email or remarket to buyers from the order export with their consent? Can we add an opt-in checkbox for the organizer's marketing at checkout?
15. What fields are in the order export? Can we get custom registration questions?

**Ops**

16. Do we get a dedicated CSM? What is the support SLA on on-sale days? How do we request Queue-it for high-demand drops?

---

## 11. Competitor Context (API availability only)

| Platform | Region | API / embed | Evidence |
|---|---|---|---|
| Eventbrite | Global | **Public API + embeddable checkout widget** (modal or inline, `onOrderComplete` callback). An unofficial WP plugin exists. | [Ticket widget](https://www.eventbrite.com/features/ticket-widget/), [Embedded checkout docs](https://amp.eventbrite.es/platform/docs/embedded-checkout), [WP plugin](https://id.wordpress.org/plugins/wp-eventbrite-embedded-checkout/) |
| Eventpop | Thailand | **Public developer docs** (OAuth 2.0: events, tickets, orders) | [docs.eventpop.me](https://docs.eventpop.me/guides/getting-started/) |
| Megatix | AU / ID / TH | Claims on-site embedding ("utilise the entire suite… on your own website") and modular integrations. Public API is UNVERIFIED. | [megatix.in.th/sell-tickets](https://megatix.in.th/sell-tickets) |
| ThaiTicketMajor | Thailand | No public organizer API found. Being acquired by Ticketmaster. | [Ticketmaster press release](https://business.ticketmaster.com.au/press-release/ticketmaster-to-acquire-thai-ticket-major-strengthening-presence-in-asia) |
| Ticket2Me | Philippines | No API found. Convenience-fee model. | [e27](https://e27.co/blockchain-ticketing-startup-ticket2me-secures-us350k-seed-funding-from-citystate-group-20190226/) |
| SM Tickets | Philippines | No organizer API found (UNVERIFIED, searches returned nothing). | — |
| KKday | Asia | Not researched. It is an activities and OTA marketplace, not an organizer ticketing tool. | — |

**Takeaway:** if a live API or embedded checkout is a hard requirement, **Eventbrite** (global) and **Eventpop** (TH) document one publicly. Ticketmelon's advantages are the local PH and TH payment rails (GCash, Maya, PromptPay, TrueMoney), Queue-it, and on-site services.

---

## 12. Sources

**Ticketmelon, organizer site and legal**
- https://organizer.ticketmelon.com/
- https://organizer.ticketmelon.com/terms (Organizer Service Agreement §1–12, Buyer ToS §3.4)
- https://organizer.ticketmelon.com/policy
- https://organizer.ticketmelon.com/Ticketing-registration
- https://organizer.ticketmelon.com/white-label
- https://organizer.ticketmelon.com/box-office
- https://organizer.ticketmelon.com/ph
- https://organizer.ticketmelon.com/th/blog/ticketmelon-2c2p-event-payments-southeast-asia
- https://web.archive.org/web/20260712102812/https://organizer.ticketmelon.com/pricing (last pricing capture). Live `/pricing` 301-redirects to the homepage (observed 2026-10-19).
- Pricing graphics: https://cdn.prod.website-files.com/67d9257ba938f0bb2ba6ad44/6913715e635306e67020ae91_THB.avif , …6913715ee4c53f7450249bd7_PHP.avif , …6913715e352c93f1afd81bce_SGD.avif , …6913715e9a266505614ffab1_VND.avif , …6913715e393b6f97a3ff9152_MYR.avif , …6913715e530b9b6b09301d06_IDR.avif , …6913715e0ddc25cdbfd6256c_USD.png
- https://tm-fee-rate.s3.ap-southeast-1.amazonaws.com/tm_fee_rate/default_tm_fee_rate_v2.json

**Ticketmelon, help center**
- https://organizer.ticketmelon.com/help-center
- …/help-center/who-pays-the-fees-of-your-event
- …/help-center/how-to-view-fees-summary
- …/help-center/payment-gateway-fee
- https://organizer.ticketmelon.com/th/help-center/payment-gateway-fee
- …/help-center/latest-update-on-payment-gateway-fees-thai-baht
- …/help-center/latest-update-on-payment-gateway-fees-singapore-dollar
- …/help-center/accepted-payment-channels
- …/help-center/how-to-pay-with-truemoney-wallet
- …/help-center/installments-terms-and-conditions
- …/help-center/event-payout
- …/help-center/how-to-view-sales-breakdown-and-request-payout
- …/help-center/how-to-request-a-tax-invoice-for-ticketmelon-fees
- …/help-center/how-to-export-data
- …/help-center/event-overview
- …/help-center/how-to-create-an-event
- …/help-center/how-to-create-ticket-type
- …/help-center/what-does-phase-mean
- …/help-center/what-is-the-difference-between-early-bird-and-regular-tickets
- …/help-center/what-are-presale-tickets
- …/help-center/creating-a-promo-code-for-your-event
- …/help-center/having-special-requirements-for-your-event
- …/help-center/how-to-book-seated-and-calendar-event-tickets
- …/help-center/how-does-the-queueing-system-work
- …/help-center/can-i-transfer-tickets-to-friends
- …/help-center/how-to-enter-the-event-using-e-ticket
- …/help-center/how-to-validate-tickets-by-tm-gate-agent-application
- …/help-center/how-to-check-number-of-attendees
- …/help-center/how-to-view-analytics
- …/help-center/how-to-view-ticket-buyer-insights
- …/help-center/how-to-view-sales-and-traffic-comparison
- …/help-center/how-long-does-it-take-to-get-a-refund
- …/help-center/can-i-get-a-refund-for-my-ticket
- …/help-center/what-is-refund-protect

**Ticketmelon, live event pages (observed headers, JSON and payment flags)**
- https://www.ticketmelon.com/meltlivehouse/stvincent (TH)
- https://www.ticketmelon.com/FilmConcertsPH/filmmusiclegends-john-williams-main (PH)
- https://www.ticketmelon.com/ekg/WilbertRossCEBU (PH)
- https://www.ticketmelon.com/004asiaent/omegax2026manila (PH)

**Apps**
- https://apps.apple.com/app/id1198923153 (TM Gate Agent)
- https://apps.apple.com/app/id1191756056 (Ticketmelon)

**Third-party**
- https://youreventkit.com/tools/ticketmelon/
- https://pl.trustpilot.com/review/www.ticketmelon.com
- https://www.eventbrite.com/features/ticket-widget/
- https://amp.eventbrite.es/platform/docs/embedded-checkout
- https://id.wordpress.org/plugins/wp-eventbrite-embedded-checkout/
- https://docs.eventpop.me/guides/getting-started/
- https://megatix.in.th/sell-tickets
- https://business.ticketmaster.com.au/press-release/ticketmaster-to-acquire-thai-ticket-major-strengthening-presence-in-asia
- https://e27.co/blockchain-ticketing-startup-ticket2me-secures-us350k-seed-funding-from-citystate-group-20190226/

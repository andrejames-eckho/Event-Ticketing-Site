# Architecture

**Status:** DRAFT v0.1 · Decisions recorded in [adr/](adr/)

## 1. Shape

Static-first marketing site + headless CMS + third-party checkout. No database, no server on the purchase path.

```
            ┌───────────── Sanity CMS (client edits) ─────────────┐
            │  Event · Edition · TicketTier · Artist · FAQ …       │
            └───────┬───────────────────────────────┬──────────────┘
                    │ webhook on publish            │ preview
                    ▼                               ▼
   GitHub ──▶ Vercel build (Astro, static + on-demand revalidate) ──▶ Vercel CDN (PH edge)
                                                                         │
   Fans ─────────────────────────────────────────────────────────────────┘
     │ ticket CTA (UTMs appended)
     ▼
   ticketmelon.com checkout  (Ticketmelon-installed GA4 + Meta Pixel)

   Side services: GTM (GA4, Meta Pixel, TikTok Pixel) · Meta CAPI via Vercel function
                  · ESP (Mailchimp/Klaviyo/Brevo) for waitlist · uptime monitor
```

## 2. Stack (recommended)

| Layer | Choice | Why | Alternative |
|-------|--------|-----|-------------|
| Framework | **Astro** | Ships near-zero JS → fastest mobile LCP; islands for countdown/lineup filters | Next.js (if client wants app-like features later) |
| CMS | **Sanity** (free tier) | Great editor UX, scheduled publishing, image CDN, structured content for multi-event | Payload (self-host), Storyblok |
| Hosting | **Vercel** (Pro for commercial use) | Edge CDN (Singapore/HK near PH), preview deploys, functions for CAPI | Cloudflare Pages, Netlify |
| Styling | Tailwind CSS + design tokens | Fast theming per event | — |
| Analytics | GA4 via GTM, consent mode v2 | Standard; works with Ticketmelon GA4 | Plausible (privacy-first, but no ads link) |
| Ads tracking | Meta Pixel + CAPI (serverless fn), TikTok Pixel | Better match rates on iOS | — |
| Forms | Serverless function → ESP API | No PII stored on our side | ESP embed form |
| Media | Sanity image CDN (AVIF/WebP); Mux or YouTube for hero video | Speed on PH mobile | Cloudinary |
| Monitoring | Vercel Analytics (Web Vitals) + Better Stack uptime | — | — |

## 3. Key flows

- **Content publish:** editor publishes in Sanity → webhook → revalidate affected pages (< 60 s live).
- **Scheduled lineup drop:** Sanity scheduled publish at exact time.
- **Ticket handoff:** see [09 §2](09-ticketmelon-integration.md).
- **Waitlist:** form → `/api/subscribe` → ESP with consent flag + source UTM. No PII kept on Vercel.

## 4. Performance budget

| Asset | Budget |
|-------|--------|
| JS per page | < 70 KB gz |
| Hero poster image | < 150 KB AVIF |
| Hero video | lazy, muted, < 3 MB mobile cut, poster first |
| Fonts | ≤ 2 families, subset, `font-display: swap` |

## 5. Security + privacy

- No payments, no logins → small attack surface.
- CSP, HSTS, security headers via Vercel config.
- Secrets (ESP key, CAPI token) in Vercel env vars only.
- Consent banner; pixels gated on consent; privacy notice per PH Data Privacy Act 2012.

## 6. Scale

All pages static on CDN → on-sale spikes are served from cache. Only `/api/subscribe` and CAPI hit functions (rate-limited).

## 7. Future hooks

- `sync-ticketmelon` scheduled function slot, if API/white-label becomes available.
- Multi-language via Astro i18n routing (`/fil/…`) for Premium.

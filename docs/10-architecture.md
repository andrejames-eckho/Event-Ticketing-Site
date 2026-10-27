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

   Fans ── remix download ──▶ files.<domain> (Cloudflare R2, no egress fee)
   Fans ── click play ──────▶ youtube-nocookie.com (client's channel)
   Sanity Studio ── /api/r2-upload-url (Vercel fn) ──▶ presigned PUT ──▶ R2

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
| Video section | YouTube (client's channel) + own facade [VideoCard.astro](../site/src/components/VideoCard.astro), 3–10 per edition | 0 JS / cookies until click, no extra deps | `astro-embed-youtube` |
| Downloads | Cloudflare R2 + custom subdomain, direct upload from Studio ([ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md)) | $0 egress; keeps Sanity bandwidth for images | Sanity files (bandwidth cap), plugin-remote-files (100 MB cap) |
| DNS | Cloudflare (free) (D20) | Required for R2 custom domain | — |
| Monitoring | Vercel Analytics (Web Vitals) + Better Stack uptime | — | — |

## 3. Key flows

- **Content publish:** editor publishes in Sanity → webhook → revalidate affected pages (< 60 s live).
- **Scheduled lineup drop:** Sanity scheduled publish at exact time.
- **Ticket handoff:** see [09 §2](09-ticketmelon-integration.md).
- **Video play:** click thumbnail → nocookie iframe replaces it → `video_play` (video_id, video_title) to dataLayer.
- **Video publish:** editor pastes YouTube URL → publish → build checks oEmbed → card live (hidden if video dead).
- **Remix pack upload:** editor picks zip in Studio → `/api/r2-upload-url` verifies Sanity token → presigned PUT → browser uploads to R2 → URL saved on doc → publish (or schedule `releaseAt`).
- **Remix download:** link to `files.<domain>/…zip` (`Content-Disposition: attachment`) → GTM `remix_download` event (artist, pack, edition).
- **Waitlist:** form → `/api/subscribe` → ESP with consent flag + source UTM. No PII kept on Vercel.

## 4. Performance budget

| Asset | Budget |
|-------|--------|
| JS per page | < 70 KB gz |
| Hero poster image | < 150 KB AVIF |
| Hero video | lazy, muted, < 3 MB mobile cut, poster first |
| Video embeds | thumbnail only at load (< 30 KB each, lazy); player JS on click |
| Fonts | ≤ 2 families, subset, `font-display: swap` |

## 5. Security + privacy

- No payments, no logins → small attack surface.
- CSP, HSTS, security headers via Vercel config.
- Secrets (ESP key, CAPI token, R2 access keys) in Vercel env vars only. Never in the Studio bundle (it is public JS).
- `/api/r2-upload-url`: requires editor's Sanity token (checked via `/users/me` + project membership), zip content type only, 15 min URL expiry, key prefixed `remix/{edition}/`. R2 bucket CORS allows PUT from the Studio origin only.
- Consent banner; pixels gated on consent; privacy notice per PH Data Privacy Act 2012.

## 6. Scale

All pages static on CDN → on-sale spikes are served from cache. Only `/api/subscribe` and CAPI hit functions (rate-limited). Remix downloads served by R2/Cloudflare CDN, outside Vercel.

## 7. Future hooks

- `sync-ticketmelon` scheduled function slot, if API/white-label becomes available.
- Multi-language via Astro i18n routing (`/fil/…`) for Premium.

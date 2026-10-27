# Test + Launch Plan

**Status:** DRAFT v0.1

## 1. Test matrix

| Area | Test | Tool | Pass bar |
|------|------|------|----------|
| Ticket links | Every tier CTA opens correct Ticketmelon page, UTMs kept | Manual + Playwright link check | 100% |
| Tracking | `page_view`, `ticket_click`, `waitlist_signup`, `video_play`, `remix_download` fire in GA4 DebugView, Meta Events Manager, TikTok helper | GTM preview | All fire, correct params |
| Consent | No marketing pixels before consent | DevTools network | 0 pre-consent hits |
| Performance | Home, tickets, lineup on mobile 4G | Lighthouse, WebPageTest | LCP < 2.5 s, perf ≥ 90 |
| Load | 10k virtual users on home + tickets | k6 against CDN | p95 < 1 s, 0 errors |
| Accessibility | Keyboard, screen reader, contrast | axe, VoiceOver, TalkBack | WCAG 2.2 AA, 0 critical |
| Devices | Low-end Android Chrome, iPhone Safari, desktop | BrowserStack / real devices | No layout breaks |
| CMS | Editor changes tier to sold out → live in < 60 s | Manual | Pass |
| SEO | JSON-LD valid, sitemap, OG previews | Rich Results Test, FB debugger | Valid |
| Forms | Waitlist → ESP list, consent stored | Manual | Pass |
| Videos | No YouTube requests before click; dead/private URL hidden at build; plays on iOS Safari + Android Chrome; Studio blocks publish with 2 or 11 videos | DevTools network, manual | Pass |
| Remix upload | Editor uploads 1 GB zip from Studio on normal connection; URL saved; non-editor call to `/api/r2-upload-url` → 401 | Manual + curl | Pass |
| Remix download | File downloads with clean filename, `remix_download` fires, served from `files.` subdomain | Manual + GTM preview | Pass |
| Remix schedule | Pack with future `releaseAt` hidden; appears at release time | Manual | Pass |

## 2. Launch checklist

- [ ] Domain + DNS + HTTPS live
- [ ] All Ticketmelon URLs final (not test events)
- [ ] Pixels IDs are client's production IDs
- [ ] Consent banner on
- [ ] Privacy policy + terms published
- [ ] Sitemap submitted to Google Search Console
- [ ] OG images checked in FB/X/Messenger/Viber previews
- [ ] Uptime monitor + alerts on
- [ ] `files.` subdomain live on R2, CORS limited to Studio origin
- [ ] Client trained on CMS (recorded walkthrough, incl. videos + remix upload)
- [ ] On-sale day runbook shared (who changes what, when)

## 3. On-sale day runbook (summary)

1. T-24h: freeze design changes; verify all links.
2. T-1h: agency + client on call; Ticketmelon contact on standby.
3. T-0: flip edition status to `on_sale` (scheduled publish).
4. Watch: GA4 realtime, uptime, Ticketmelon dashboard.
5. Tier sells out → editor sets `sold_out` → verify live.

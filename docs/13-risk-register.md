# Risk Register

**Status:** LIVING DOCUMENT · Scale: L(ow)/M(ed)/H(igh)

| # | Risk | Likelihood | Impact | Mitigation | Owner |
|---|------|-----------|--------|------------|-------|
| R1 | Ticketmelon has no public API (confirmed 2026-10-19) → tier status/price must be updated manually | H | M | CMS fields for status/price; on-sale-day checklist; ask Ticketmelon for partner API | Agency |
| R2 | We cannot place our own tags on Ticketmelon checkout (staff install Meta + GA4 only) → partial ad attribution | M | H | Send pixel IDs to Ticketmelon; confirm events fired; per-channel promo codes; `ticket_click` as proxy conversion; CSV reconciliation | Agency |
| R3 | On-sale traffic spike crashes site | L | H | Static/CDN hosting, no server calls on critical path, load test | Agency |
| R4 | Ticketmelon checkout queues/slow at on-sale (outside our control) | M | H | Status banner in CMS; queue messaging; coordinate with Ticketmelon | Client |
| R5 | Client content (lineup, photos) late | H | M | Content calendar with due dates in contract; placeholders | Client |
| R6 | Wrong price/status shown vs Ticketmelon | M | H | Single-editor rule on sale days; checklist; "final price at checkout" line | Client |
| R7 | Data Privacy Act non-compliance on forms | L | H | Consent checkbox, privacy notice, NPC-aligned policy | Agency |
| R8 | Scope creep (merch, app, accounts) | M | M | Non-goals doc; change requests priced separately | Agency |
| R9 | Fake/scalper sites copy branding | M | M | "Official tickets only via this site" messaging; client socials link only here | Client |
| R10 | Ticketmelon fee/terms change (public pricing page already removed) | M | M | Fees shown as "excl. service fee" not hard numbers; get fees in writing | Client |
| R11 | Using Ticketmelon buyer emails for marketing breaches their terms / DPA | M | H | Don't import buyer data until legal + Ticketmelon confirm; grow own opt-in waitlist | Client |
| R12 | Payout timing unclear (≤14 business days post-event vs on request) cash-flow surprise | M | M | Confirm schedule + reserves with Ticketmelon before on-sale | Client |
| R13 | Remix downloads exhaust CMS bandwidth and take site images down (Sanity free plan blocks assets on overage) | H if files in Sanity | H | Zips on Cloudflare R2, never Sanity ([ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md)) | Agency |
| R14 | Embedded YouTube video removed, made private or embedding turned off | M | L | Client's own channel only (D18); build-time oEmbed check hides dead videos | Agency |
| R15 | Remix pack copyright complaint or takedown request | L | M | Rights settled (D17); licence text shown per pack; editor can unpublish instantly | Client |
| R16 | Upload signing function abused to fill bucket | L | M | Function checks editor's Sanity token + project membership; short URL expiry; zip-only content type | Agency |

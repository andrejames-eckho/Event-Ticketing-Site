# Content Model (CMS schemas)

**Status:** DRAFT v0.1

Everything the client edits lives here. Nothing event-specific is hard-coded.

```
Event 1──* Edition 1──* TicketTier
                    1──* Performance *──1 Artist
                    1──* Stage
                    1──* FAQItem
                    1──* Announcement
                    1──[3..10] pastVideo (embedded list)
                    1──* RemixPack *──1 Artist
                    *──* Partner
SiteSettings (singleton)
```

## Event
| Field | Type | Notes |
|-------|------|-------|
| name | string | "[Event]" |
| slug | slug | `/[event]` |
| logo, brandColors | image, colors | per-event theming |
| tagline | string | |
| currentEdition | ref Edition | drives homepage |

## Edition
| Field | Type | Notes |
|-------|------|-------|
| title | string | "[Event] 2027" |
| slug | slug | `/[event]/2027` |
| status | enum | announced · on_sale · sold_out · past |
| startDate, endDate | datetime (Asia/Manila) | |
| venue | object | name, address, lat/lng, mapEmbed, transportNotes |
| heroMedia | video/image | poster image fallback required |
| ticketmelonEventUrl | url | main event page |
| onSaleAt | datetime | for countdown |
| feeDisclosure | text | |
| pastVideos | array<pastVideo>, **min 3, max 10** | homepage video section; order = display order, first = featured |
| gallery | images | for past editions |
| seo | object | title, description, ogImage |

## TicketTier
| Field | Type | Notes |
|-------|------|-------|
| name | string | GA, VIP, Barkada 4-pack |
| pricePhp | number | display price |
| phase | string | Early Bird / Phase 1… |
| includes | list<string> | perks |
| status | enum | coming_soon · on_sale · low_stock · sold_out |
| ticketmelonUrl | url | tier deep link (fallback to edition URL) |
| promoCode | string? | if URL-applied codes supported |
| order, highlight | number, bool | "Most popular" badge |

## Artist / Performance / Stage
- **Artist:** name, slug, photo, bio, country, spotifyId, youtubeUrl, socials.
- **Performance:** artist ref, edition ref, stage ref, day, start/end time, billingTier (headliner/sub/support).
- **Stage:** name, color, order. Chrome: Dinagyang has one stage (D14); keep the type so future events can have more.

## pastVideo (object, inside Edition.pastVideos)
**Built** (2026-10-27): site reads `pastVideos` from [event.js](../site/src/data/event.js) until Sanity is wired. Client's official YouTube channel only (D18). Schema: [studio/schemaTypes/pastVideo.js](../studio/schemaTypes/pastVideo.js). See [ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md).

| Field | Type | Notes |
|-------|------|-------|
| youtubeUrl | url, required | validated: `youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/live/`. Duplicates in the list rejected |
| title | string? | max 80; empty = YouTube title (oEmbed at build) |
| eventLabel | string, required | "Chrome: Dinagyang 2026" |
| kind | enum | aftermovie · set · recap · teaser · interview |

List rules (publish blocked otherwise): at least 3, at most 10, no duplicate video. Thumbnail shown in Studio preview. Artist videos stay on `Artist.youtubeUrl`.

## RemixPack
**Planned** (not built). Zip stored on Cloudflare R2, not Sanity (D19, [ADR 0003](adr/0003-videos-youtube-remix-packs-r2.md)).

| Field | Type | Notes |
|-------|------|-------|
| title | string | "Kumbia Machine: Remix Pack" |
| slug | slug | |
| artist | ref Artist | featured artist of the edition |
| edition | ref Edition | packs show only for the current edition (or archive) |
| coverImage | image | Sanity image CDN (small) |
| description | text | client copy |
| contents | object | bpm, key, stems (list<string>), format (WAV/AIFF/MP3) |
| file | r2File | custom input: uploads to R2. Stores `url`, `key`, `filename`, `sizeBytes`, `contentType`, `uploadedAt` |
| licence | rich text | usage terms shown before download (e.g. non-commercial remix only) |
| releaseAt | datetime (Asia/Manila) | scheduled drop; hidden before |
| expiresAt | datetime? | hidden after; file stays on R2 until cleanup |
| emailGate | enum | none · soft · strict. Default `none` (Q11) |
| order | number | |

## FAQItem
question, answer (rich text), category (tickets, entry, venue, accessibility, refunds), order.

## Announcement
title, body, publishAt, coverImage, link.

## Partner
name, logo, url, tier (presenting/major/supporting).

## SiteSettings
navigation, footer, socials, GA4 ID, GTM ID, Meta Pixel ID, TikTok Pixel ID, ESP list ID, privacy policy, default OG image.

# Content Model (CMS schemas)

**Status:** DRAFT v0.1

Everything the client edits lives here. Nothing event-specific is hard-coded.

```
Event 1──* Edition 1──* TicketTier
                    1──* Performance *──1 Artist
                    1──* Stage
                    1──* FAQItem
                    1──* Announcement
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
| aftermovie, gallery | url, images | for past editions |
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

## FAQItem
question, answer (rich text), category (tickets, entry, venue, accessibility, refunds), order.

## Announcement
title, body, publishAt, coverImage, link.

## Partner
name, logo, url, tier (presenting/major/supporting).

## SiteSettings
navigation, footer, socials, GA4 ID, GTM ID, Meta Pixel ID, TikTok Pixel ID, ESP list ID, privacy policy, default OG image.

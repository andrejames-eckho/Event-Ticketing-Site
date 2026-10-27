# ADR 0003: Videos via YouTube facade, remix packs on Cloudflare R2

**Status:** Accepted · 2026-10-27 · Videos implemented (design build), remix packs planned

## Context
Client wants (a) videos from past events and festivals and (b) downloadable remix packs (zip) from the featured artists of the current festival. Both change every festival, so the client must manage them in the CMS after handover. Videos come from the client's official YouTube channel. Remix packs are zip files, likely zipped WAV stems (often > 100 MB).

Sanity free plan: 100 GB assets, 100 GB bandwidth/month, and on overage it **blocks asset delivery until the quota resets** (images included). One 200 MB pack × 500 downloads = 100 GB. Growth plan overage is $0.30/GB.

## Decision

**Videos.** Client adds **3 to 10** YouTube links to `Edition.pastVideos` in Sanity (array, enforced at publish; order = display order, first = featured). Site renders its own click-to-load facade ([VideoCard.astro](../../site/src/components/VideoCard.astro), no npm dependency, `youtube-nocookie.com`): thumbnail only, player and YouTube JS load on click. Schema: [studio/schemaTypes/pastVideo.js](../../studio/schemaTypes/pastVideo.js). At build time each URL is checked through YouTube oEmbed (`youtube.com/oembed?url=…`); any 4xx except 429 (bad id, private, deleted, embedding off) hides the video. No YouTube API key.

**Remix packs.** Zip files live in **Cloudflare R2**, served from a custom subdomain (`files.<domain>`, needs DNS on Cloudflare; `r2.dev` is rate-limited, dev only). Pack metadata (artist, cover, licence, release time) lives in a `remixPack` document in Sanity. Upload happens inside Sanity Studio through a custom file input:

1. Editor picks the zip in Studio.
2. Studio calls Vercel function `/api/r2-upload-url` with the editor's Sanity token.
3. Function verifies the token against Sanity (`/users/me`, project member), then returns a short-lived presigned `PUT` URL (key prefixed by edition, `Content-Disposition: attachment`).
4. Browser uploads directly to R2 (single PUT, up to 5 GB). Studio stores url, key, filename, size on the document.

Email gate stays optional per pack (`emailGate`), off by default (Q11).

## Alternatives
- **Sanity file assets:** simplest, but shared 100 GB bandwidth cap can take site images down in festival week.
- **`sanity-plugin-remote-files` (R2 Worker):** off-the-shelf, but uploads pass through a Cloudflare Worker, capped at 100 MB request body (Free/Pro). Too small for WAV stem zips. Its auth is a static bearer secret in the Studio bundle.
- **Cloudflare dashboard upload + paste URL:** no code, 300 MB cap, two tools, error-prone for the client.
- **Google Drive / Dropbox links:** download quotas block popular files, off-brand, weak tracking.
- **Self-hosted video (Mux / Sanity video):** costs money; client already publishes on YouTube.

## Consequences
+ Download bandwidth costs $0 (R2 has no egress fee); storage free to 10 GB, then $0.015/GB-month. Files bypass Vercel and Sanity quotas.
+ Video embeds cost no JS or cookies until click; dead videos never render. Earlier plan was `@astro-community/astro-embed-youtube`; replaced by a ~60-line component to keep site deps at Astro only and match the chrome styling.
+ Client manages both from Sanity; next festival = new documents on the new edition.
- One more vendor (Cloudflare account, owned by client) and one serverless function to maintain.
- Custom Studio input is ~1–1.5 days of build.
- Deleting a pack in Sanity does not delete the R2 object; cleanup is a manual step in the handover runbook (or a later script).

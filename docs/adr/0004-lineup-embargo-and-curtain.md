# ADR 0004: Lineup embargo by CMS date, curtain on the homepage

**Status:** Accepted · 2026-11-07 · Implemented (design build), scheduled rebuild planned

## Context
The client does not want the lineup public until a date they choose. Until then the lineup content (artist pages, bios, set times) must stay editable and ready, so the reveal is a switch, not a content push. The homepage still needs something in the lineup slot that builds hype instead of an empty gap.

The site is static (ADR 0002). Anything rendered into HTML is public to anyone who views source, so hiding the lineup with CSS or client-side JS is not enough.

## Decision

**One field drives it.** `Edition.lineupRevealAt` (datetime, Asia/Manila, optional) in Sanity: [studio/schemaTypes/lineupReveal.js](../../studio/schemaTypes/lineupReveal.js). Empty = lineup public. A date that cannot be parsed keeps the lineup hidden (fail safe). Logic and tests: [site/src/lib/lineup.js](../../site/src/lib/lineup.js), [site/test/lineup.test.js](../../site/test/lineup.test.js).

**Decided at build time.** Before the reveal:

| Where | Hidden state |
|-------|--------------|
| Header, mobile menu, footer | "Lineup" link removed (`nav` filter in `event.js`) |
| Homepage hero | "See lineup" button removed |
| Homepage lineup slot | Curtain ([LineupCurtain.astro](../../site/src/components/LineupCurtain.astro)), no "Full lineup" link. Behind it: redacted bars built from act counts only, no names |
| `/schedule` | "Set times drop soon" state with the reveal date (set times would list every act) |
| `/lineup`, `/lineup/[slug]` | Still built with full content and layout, plus a "Hidden until …" note ([EmbargoNote.astro](../../site/src/components/EmbargoNote.astro)). Not linked from anywhere, `noindex` |
| Review toolbar | Shows "Lineup: hidden until …" |

**Reveal = rebuild.** A Vercel cron (every 15 min) compares `lineupRevealAt` to now and fires the deploy hook once when it passes (docs/10 §3). Editing the field rebuilds through the normal publish webhook.

**Curtain.** A chrome stage curtain hangs over the lineup slot with a sign showing the reveal date, a countdown and a "Tell me first" button to the waitlist. Visitors can brush it with the mouse, click to tug it and drag to pull it. The top is pinned to the rod and every pull is rubber-banded, so it always falls shut. Short taunts ("Nice try.") answer each attempt (placeholder copy, Q5).
- Physics: two Verlet cloth panels, 14 × 16 points each, in [site/src/lib/curtain.js](../../site/src/lib/curtain.js). Drag pulls a soft patch of fabric, columns cannot cross (no inside-out folds).
- Rendering: WebGL in [site/src/lib/curtain-gl.js](../../site/src/lib/curtain-gl.js). The physics grid is smoothed with Catmull-Rom splines into a fine mesh and each pleat is lit per pixel (cosine fold, diffuse + specular), so no cells or facets show. Pleats stay at least ~40 px wide on phones. Colours come from the active theme tokens (`--metal-lo/mid/hi`).
- Fallbacks: no WebGL → 2D canvas quads. WebGL context lost or no JS → static CSS pleats. `prefers-reduced-motion` → still curtain, clicks still answer.
- Cost: animates only while on screen and moving; sleeps otherwise. `touch-action: pan-y` keeps vertical swipes scrolling the page on phones.

## Alternatives
- **Draft-only lineup in Sanity until reveal:** no leak risk, but the client cannot see pages in context, and the reveal becomes a mass publish of many documents at once.
- **Client-side hide (render, then hide with JS/CSS):** names would ship in the HTML. Rejected.
- **Server-rendered gate (SSR on every request):** exact to the second, but takes the lineup pages off the CDN and adds a server to the on-sale path. Rejected for ADR 0002 reasons.
- **2D canvas curtain only:** first version. Per-cell gradients showed visible blocks; kept only as the fallback.

## Consequences
+ One date field for the client; no developer needed for the drop.
+ Nothing in the homepage or schedule HTML reveals an act before the rebuild.
- Reveal lands up to ~15 min after the set time plus build time, not to the second.
- `/lineup` URLs work if guessed. If that is a risk for a big announcement, switch those pages to Sanity preview only until the reveal.
- Curtain is ~700 lines of JS (loaded only on the homepage while hidden). It is removed from the page automatically after the reveal.

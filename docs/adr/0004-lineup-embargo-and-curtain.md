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
| Homepage lineup slot | Curtain ([LineupCurtain.astro](../../site/src/components/LineupCurtain.astro)), no "Full lineup" link. Behind it: a heavily blurred lineup with the real layout and act counts per tier, but scrambled letters, never names (looks the same filled in or not) |
| `/schedule` | "Set times drop soon" state with the reveal date (set times would list every act) |
| `/lineup`, `/lineup/[slug]` | Still built with full content and layout, plus a "Hidden until …" note ([EmbargoNote.astro](../../site/src/components/EmbargoNote.astro)). Not linked from anywhere, `noindex` |
| Review toolbar | Shows "Lineup: hidden until …" |

**Reveal = rebuild.** A Vercel cron (every 15 min) compares `lineupRevealAt` to now and fires the deploy hook once when it passes (docs/10 §3). Editing the field rebuilds through the normal publish webhook.

**Curtain.** A heavy chrome stage curtain hangs from a rod over the lineup slot. In front of it, a sign with the reveal date, a countdown and a "Tell me first" button (to the waitlist) hangs from an S-hook on the rod by a real chain: one chain to an O-ring, two short chains to the sign's top corners. Visitors can brush the curtain with the mouse, tap to push it, grab and pull it, and grab and swing the sign. Pulled fabric follows the hand until it is taut, then slips out of the fingers and swings back; it never opens. Short taunts ("Nice try.") answer each attempt (placeholder copy, Q5).
- Physics ([site/src/lib/curtain.js](../../site/src/lib/curtain.js)): position-based dynamics in px and seconds, gravity scaled to a ~3 m drop so it swings with a real curtain's weight and timing. No springs back to a rest shape (that read as jelly in v1). Instead:
  - Cloth is a 3D mesh with real pinch pleats (6 points per pleat, 1.55× fullness, folds fanning toward the hem), so pulls open some folds and bunch others.
  - It does not stretch: stretch/shear/bend constraints plus long-range tethers from every point to its own ring and both end rings, at the flattened fabric distance.
  - Weighted hem, air drag that resists broadside motion more than edge-on motion, rings that slide a little on the rod and rattle when yanked.
  - A light "heat-set" memory on fold depth only, and a soft column-ordering pass in place of self-collision, so nothing stays tangled after a hard pull.
  - Sign: three heavy points held rigid (two top corners, bottom middle) on light chain links, with max-length ties so chains go slack but never stretch. It swings and twists; the rod rattle shakes the hook.
- Rendering: WebGL in [site/src/lib/curtain-gl.js](../../site/src/lib/curtain-gl.js). Physics mesh smoothed with cubic B-splines (no overshoot on sharp creases), normals from the folded surface, satin lighting (key + fill, crest highlights, sheen, fold occlusion, stage-light falloff, faint weave), depth-tested so overhanging folds sort correctly. Rod, rings, chain links (alternating face-on/edge-on with drop shadows) are drawn on a 2D canvas; the sign is DOM, transformed from the physics each frame, so the button stays a real link. Colours come from the theme tokens (`--metal-lo/mid/hi`).
- Fallbacks: no WebGL → flat-shaded 2D quads with the same light rig. WebGL context lost or no JS → static CSS pleats and dotted chains. `prefers-reduced-motion` → still curtain, clicks still answer.
- Cost: ~6 ms/frame on a 1280 px laptop screen while moving, ~5 ms on a phone; sleeps after 45 still frames and while off screen. `touch-action: pan-y` keeps vertical swipes scrolling the page on phones.

## Alternatives
- **Draft-only lineup in Sanity until reveal:** no leak risk, but the client cannot see pages in context, and the reveal becomes a mass publish of many documents at once.
- **Client-side hide (render, then hide with JS/CSS):** names would ship in the HTML. Rejected.
- **Server-rendered gate (SSR on every request):** exact to the second, but takes the lineup pages off the CDN and adds a server to the on-sale path. Rejected for ADR 0002 reasons.
- **2D canvas curtain only:** first version. Per-cell gradients showed visible blocks; kept only as the fallback.
- **v1 physics (2D Verlet sheet sprung to its rest shape, rubber-banded drag):** cheap, but every touch wobbled like jelly. Replaced by the 3D cloth above.

## Consequences
+ One date field for the client; no developer needed for the drop.
+ Nothing in the homepage or schedule HTML reveals an act before the rebuild.
- Reveal lands up to ~15 min after the set time plus build time, not to the second.
- `/lineup` URLs work if guessed. If that is a risk for a big announcement, switch those pages to Sanity preview only until the reveal.
- Curtain is ~900 lines of JS (loaded only on the homepage while hidden). It is removed from the page automatically after the reveal.

# [Event] Ticketing Website

Official website for **Chrome**'s music festival(s), built by **Eckho Systems**. It is the main place fans go to learn about the event and buy tickets. Checkout runs on **Ticketmelon**; this site handles discovery, hype, information and the handoff to purchase.

**Status:** ADRs 0001 + 0002 accepted 2026-10-20, ADR 0003 accepted 2026-10-27. Design build in `site/` (2026-10-21): full multi-page site in Liquid Chrome colours, placeholder copy/assets, Ticketmelon checkout as a pending slot. See [site/README.md](site/README.md).

**Added 2026-10-27 (D17–D21):** past-event **videos** (3–10 YouTube links per edition, client-editable; built, first 3 live in the design build) and **remix pack downloads** (zip on Cloudflare R2, uploaded from Sanity; planned, not built). See [ADR 0003](docs/adr/0003-videos-youtube-remix-packs-r2.md).

**Placeholders:** working event = **Chrome: Dinagyang**, Sat 23 – Sun 24 Jan 2027, **ICON** (Iloilo City), see [07 D10](docs/07-open-questions.md). Older docs and the client PDFs still say `[Event]`, `[Venue]`, `[Date]`. Agency = Eckho Systems, client = Chrome (client PDFs use these; older docs may still say `[Agency]` / `[Client]`).

## Layout

```
Event Ticketing Site/
├── README.md                ← you are here
├── docs/                    ← all alignment docs (numbered, read in order)
│   ├── research/            ← raw research: Ticketmelon, design benchmark, pricing
│   └── adr/                 ← architecture decision records
├── site/                    ← Astro demo: on-site Bag → Ticketmelon fast_checkout
├── studio/                  ← Sanity schemas written ahead of the Studio project (Week 2)
└── client/                  ← client-facing PDFs (pricing proposal, presentation); edit src/*.html, re-render with Chrome headless
```

## Docs index

| # | Doc | Purpose |
|---|-----|---------|
| 01 | [Project brief](docs/01-project-brief.md) | What, why, for whom, success metrics |
| 02 | [PRD](docs/02-prd.md) | Requirements by priority |
| 03 | [Non-goals](docs/03-non-goals.md) | What we are not building |
| 04 | [Design benchmark summary](docs/04-design-benchmark.md) | 10 best event sites, patterns to adopt |
| 05 | [Glossary](docs/05-glossary.md) | Shared terms |
| 06 | [Working agreement](docs/06-working-agreement.md) | How we work, approvals, comms |
| 07 | [Open questions](docs/07-open-questions.md) | Decision log, unknowns |
| 08 | [Information architecture](docs/08-information-architecture.md) | Sitemap, page specs |
| 09 | [Ticketmelon integration spec](docs/09-ticketmelon-integration.md) | How the handoff works, tracking, fees |
| 10 | [Architecture](docs/10-architecture.md) | Stack, hosting, CMS |
| 11 | [Content model](docs/11-content-model.md) | CMS schemas |
| 12 | [Roadmap](docs/12-roadmap.md) | Phases, milestones |
| 13 | [Risk register](docs/13-risk-register.md) | Risks + mitigations |
| 14 | [Test + launch plan](docs/14-test-and-launch-plan.md) | QA, analytics checks, launch checklist |
| 15 | [Business model + pricing](docs/15-business-model-and-pricing.md) | Packages, retainer, terms |

## Client deliverables

- `client/[Event] Website - Pricing Proposal.pdf` (6 pages, A4)
- `client/[Event] Website - Client Presentation.pdf` (15 slides, 16:9)

Client PDFs use the chrome art direction (see [04 §4](docs/04-design-benchmark.md)). `client/src/chrome.js` turns headings into SVG gradient text and `client/src/assets/blob.png` is the pre-rendered liquid-metal shape; both exist because macOS Preview can't display CSS `background-clip:text`, rgba radial overlays or blurred shadows from Chrome's PDF output. Avoid those in the HTML.

Re-render after editing `client/src/*.html`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="client/[Event] Website - Pricing Proposal.pdf" "file://$PWD/client/src/pricing.html"
```

## Key findings

### Remix packs must not live in Sanity

Sanity's free plan blocks all asset delivery (site images included) once 100 GB/month bandwidth is used; a few hundred downloads of one stems zip can do that in festival week. Packs go on Cloudflare R2 (no download fees) instead. See [ADR 0003](docs/adr/0003-videos-youtube-remix-packs-r2.md).

### Ticketmelon

Ticketmelon has no public API, but its checkout accepts a pre-filled order via URL (`fast_checkout`), as used by wonderfruit.co. Fans pick tickets on our site and land on Ticketmelon ready to pay. See [docs/09](docs/09-ticketmelon-integration.md).

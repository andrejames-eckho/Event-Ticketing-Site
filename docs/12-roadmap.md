# Roadmap

**Status:** DRAFT v0.1 · Timeline for **Pro** package (4–6 weeks). Week 0 = signed proposal + downpayment + Ticketmelon access.

## Phase 0 — Discovery (now)
- [x] Research: Ticketmelon integration + fees, design benchmark, pricing
- [x] Draft docs 01–15
- [ ] Owner review of docs
- [ ] Client answers Q1–Q10; Ticketmelon answers T1–T9
- [x] Proposal + pricing PDF + presentation PDF sent
- [x] Client accepted Pro package, 2026-10-26 (D15)
- [x] **G0:** contract signed + 50% downpayment sent, 2026-10-26 (D16)
- [ ] Ticketmelon organizer access + account manager contact (needed in Week 1)

## Phase 1 — Build (Pro)

| Week | Work | Gate |
|------|------|------|
| 1 | Kickoff, content checklist to client, 3 art-direction moodboards, Ticketmelon spike: test `fast_checkout` on client's event with real ticket_type_ids | **G1** art direction |
| 2 | Homepage + tickets page + Bag design (mobile first); Sanity schemas incl. `Video` + `RemixPack`; client creates Cloudflare account (Q14) | **G2** key designs |
| 3 | Remaining page designs incl. Remix + Videos; Astro build starts; CMS set up; R2 bucket + `files.` subdomain + CORS | **G3** all designs |
| 4 | Build: pages, Bag + Ticketmelon handoff, CMS wiring, tracking (GTM, GA4, Meta, TikTok); video facade + oEmbed check; R2 upload input + `/api/r2-upload-url` | — |
| 5 | Content load (videos Q13, first packs), QA (test plan [14](14-test-and-launch-plan.md)), load test, pixels with Ticketmelon | **G4** staging |
| 6 | Fixes, CMS training (incl. adding videos + uploading packs), launch, on-sale runbook | **G5** live |

## Phase 2 — Operate (retainer)
- On-sale days support, lineup drops, phase changes
- Monthly analytics report (site → Ticketmelon funnel, promo-code sales)
- Weekly automated `fast_checkout` health check

## Phase 3 — Next edition / new events
- Edition refresh (35–50% of build), archive previous edition
- If Ticketmelon grants availability feed: live sold-out sync
- Optional: Filipino language, merch (Shopify Buy Button), Looker Studio dashboard

## Critical path
Ticketmelon ticket_type_ids + confirmation of URL params (week 1) → Bag build (week 4). If blocked: ship Mode B deep links, add Bag post-launch.

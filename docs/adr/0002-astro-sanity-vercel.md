# ADR 0002: Astro + Sanity + Vercel

**Status:** Accepted · 2026-10-20 (proposed 2026-10-19)

## Context
Mobile-heavy PH audience, on-sale traffic spikes, client must edit multi-event content without a developer.

## Decision
Astro (static-first) for the site, Sanity as headless CMS, Vercel for hosting + serverless functions.

## Alternatives
- Next.js: heavier JS, more than needed for a content site.
- WordPress: familiar to clients but slower, plugin security upkeep, weaker on spikes without caching work.
- Webflow: fast to build, but CMS limits for nested Event→Edition→Tier model and recurring per-site cost.

## Consequences
+ Best performance + spike resilience; good editor UX.
- Client needs Sanity training; Vercel Pro (~$20/mo) for commercial use.

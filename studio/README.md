# Sanity Studio (schemas)

Studio project not initialised yet (roadmap Week 2: `npm create sanity@latest` with the client's project). Schemas written ahead live in `schemaTypes/` and drop in as-is.

| File | What |
|------|------|
| [schemaTypes/pastVideo.js](schemaTypes/pastVideo.js) | `pastVideo` object + `pastVideosField` for the Edition document. 3 to 10 YouTube links, no duplicates, thumbnail preview. Limits must match `site/src/lib/youtube.js` |
| [schemaTypes/lineupReveal.js](schemaTypes/lineupReveal.js) | `lineupRevealAtField` for the Edition document. Lineup embargo date and time. Empty = lineup public. Rules match `site/src/lib/lineup.js` |

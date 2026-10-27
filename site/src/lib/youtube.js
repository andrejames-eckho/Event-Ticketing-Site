// YouTube helpers for the past-events video section (docs/adr/0003). No API key: thumbnails from i.ytimg.com,
// titles + "still embeddable?" from the public oEmbed endpoint at build time.

// Same limits as the Sanity schema (studio/schemaTypes/pastVideo.js). Client picks 3 to 10.
export const VIDEO_LIMITS = { min: 3, max: 10 };

const ID = /^[A-Za-z0-9_-]{11}$/;

// Accepts watch?v=, youtu.be/, /shorts/, /live/, /embed/ and bare 11-char ids. Returns null if not YouTube.
export function youtubeId(input) {
  if (!input) return null;
  const raw = String(input).trim();
  if (ID.test(raw)) return raw;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, first, second] = url.pathname.split('/');
    id = first === 'watch' ? url.searchParams.get('v') : ['shorts', 'live', 'embed'].includes(first) ? second : null;
  }
  return id && ID.test(id) ? id : null;
}

export const thumbnailUrl = (id, size = 'hqdefault') => `https://i.ytimg.com/vi/${id}/${size}.jpg`;

// Click-to-play URL. youtube-nocookie: no YouTube cookies until the fan presses play.
export const embedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;

// oEmbed answers 4xx for dead videos: 400 (no such id), 401/403 (private / embedding off), 404 (deleted).
// Those are dropped. 429, 5xx and network errors keep the video so a flaky or offline build doesn't empty the section.
const isDead = (status) => status >= 400 && status < 500 && status !== 429;
const cache = new Map();
async function oembed(id) {
  if (cache.has(id)) return cache.get(id);
  const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`;
  let result;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    result = res.ok ? { ok: true, title: (await res.json()).title } : { ok: !isDead(res.status) };
  } catch {
    result = { ok: true };
  }
  cache.set(id, result);
  return result;
}

// Input: CMS list ({ title, youtubeUrl, eventLabel, kind }). Output: playable videos (max 10) + empty slots
// (no URL yet) so the design build can show placeholders.
export async function resolveVideos(list = []) {
  const items = await Promise.all(
    list.slice(0, VIDEO_LIMITS.max).map(async (v) => {
      const id = youtubeId(v.youtubeUrl);
      if (!v.youtubeUrl) return { ...v, id: null, placeholder: true };
      if (!id) return null;
      const meta = await oembed(id);
      return meta.ok ? { ...v, id, title: v.title || meta.title || 'Watch video' } : null;
    }),
  );
  return items.filter(Boolean);
}

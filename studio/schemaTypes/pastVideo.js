// Past-event videos (docs/11, docs/adr/0003). Used as Edition.pastVideos: the client picks 3 to 10
// videos from the official YouTube channel; list order = order on the site, first = featured.
// Limits must match site/src/lib/youtube.js (VIDEO_LIMITS).
import { defineArrayMember, defineField, defineType } from 'sanity';

export const VIDEO_LIMITS = { min: 3, max: 10 };

const ID = /^[A-Za-z0-9_-]{11}$/;

// Same rules as youtubeId() in site/src/lib/youtube.js.
function youtubeId(input) {
  if (!input) return null;
  let url;
  try {
    url = new URL(String(input).trim());
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id = null;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (host === 'youtube.com') {
    const [, first, second] = url.pathname.split('/');
    id = first === 'watch' ? url.searchParams.get('v') : ['shorts', 'live'].includes(first) ? second : null;
  }
  return id && ID.test(id) ? id : null;
}

export const pastVideo = defineType({
  name: 'pastVideo',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube link',
      type: 'url',
      description: 'Copy the link from the official channel (Share → Copy link). Video must be Public or Unlisted with embedding allowed.',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https'] })
          .custom((value) => !value || youtubeId(value) ? true : 'Not a YouTube video link. Use the Share → Copy link button on YouTube.'),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Optional. Leave empty to use the YouTube title.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'eventLabel',
      title: 'Event',
      type: 'string',
      description: 'Shown under the video, e.g. "Chrome: Dinagyang 2026".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Aftermovie', value: 'aftermovie' },
          { title: 'Live set', value: 'set' },
          { title: 'Recap', value: 'recap' },
          { title: 'Teaser', value: 'teaser' },
          { title: 'Interview', value: 'interview' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'aftermovie',
    }),
  ],
  preview: {
    select: { title: 'title', url: 'youtubeUrl', eventLabel: 'eventLabel', kind: 'kind' },
    prepare({ title, url, eventLabel, kind }) {
      const id = youtubeId(url);
      return {
        title: title || url || 'New video',
        subtitle: [eventLabel, kind].filter(Boolean).join(' · '),
        imageUrl: id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : undefined,
      };
    },
  },
});

// Add to the Edition document's fields.
export const pastVideosField = defineField({
  name: 'pastVideos',
  title: 'Past event videos',
  type: 'array',
  of: [defineArrayMember({ type: 'pastVideo' })],
  description: `Homepage video section. Add ${VIDEO_LIMITS.min} to ${VIDEO_LIMITS.max} videos. Drag to reorder; the first one is shown big.`,
  validation: (rule) =>
    rule
      .required()
      .min(VIDEO_LIMITS.min)
      .error(`Add at least ${VIDEO_LIMITS.min} videos.`)
      .max(VIDEO_LIMITS.max)
      .error(`Maximum ${VIDEO_LIMITS.max} videos. Remove one before adding another.`)
      .custom((items = []) => {
        const ids = items.map((v) => youtubeId(v?.youtubeUrl)).filter(Boolean);
        return new Set(ids).size === ids.length ? true : 'The same video is in the list twice.';
      }),
});

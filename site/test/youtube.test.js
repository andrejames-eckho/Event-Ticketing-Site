import { test } from 'node:test';
import assert from 'node:assert/strict';
import { youtubeId, resolveVideos, VIDEO_LIMITS } from '../src/lib/youtube.js';

const ID = 'dQw4w9WgXcQ';

test('youtubeId reads every common URL shape', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42s&list=PL123`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}?si=abc`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    ` ${ID} `,
  ]) {
    assert.equal(youtubeId(url), ID, url);
  }
});

test('youtubeId rejects non-YouTube and malformed input', () => {
  for (const bad of ['', null, 'https://vimeo.com/123', 'https://www.youtube.com/@chrome', 'https://youtu.be/short', 'not a url']) {
    assert.equal(youtubeId(bad), null, String(bad));
  }
});

test('limits match the Sanity rule (3 to 10)', () => {
  assert.deepEqual(VIDEO_LIMITS, { min: 3, max: 10 });
});

test('resolveVideos keeps empty slots as placeholders, drops bad URLs, caps at 10', async () => {
  const list = [
    { youtubeUrl: '' },
    { youtubeUrl: 'https://vimeo.com/1' },
    ...Array.from({ length: 12 }, () => ({ youtubeUrl: '' })),
  ];
  const out = await resolveVideos(list);
  assert.equal(out.length, 9); // 10 kept, 1 invalid dropped
  assert.ok(out.every((v) => v.placeholder));
});

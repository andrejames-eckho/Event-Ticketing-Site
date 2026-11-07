import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isLineupRevealed, formatReveal } from '../src/lib/lineup.js';

const at = '2026-12-12T18:00:00+08:00';
const t = Date.parse(at);

test('no reveal date means the lineup is public', () => {
  assert.equal(isLineupRevealed(undefined, t), true);
  assert.equal(isLineupRevealed(null, t), true);
  assert.equal(isLineupRevealed('', t), true);
  assert.equal(isLineupRevealed('  ', t), true);
});

test('hidden before the reveal time, public from it', () => {
  assert.equal(isLineupRevealed(at, t - 1), false);
  assert.equal(isLineupRevealed(at, t), true);
  assert.equal(isLineupRevealed(at, t + 60_000), true);
});

test('a bad date keeps the lineup hidden', () => {
  assert.equal(isLineupRevealed('next friday', t), false);
});

test('reveal label is in Manila time', () => {
  assert.equal(formatReveal(at), 'Sat 12 Dec · 6:00 PM');
  assert.equal(formatReveal('2026-12-12T10:00:00Z'), 'Sat 12 Dec · 6:00 PM');
  assert.equal(formatReveal('nope'), 'soon');
});

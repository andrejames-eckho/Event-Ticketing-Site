import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildCheckoutUrl, buildDeepLinkUrl, buildFastCheckoutOrder } from '../src/lib/ticketmelon.js';

const EVENT = 'https://www.ticketmelon.com/org/event';
const GA = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const VIP = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

test('fast_checkout order matches Wonderfruit shape', () => {
  assert.deepEqual(buildFastCheckoutOrder({ [GA]: 2, [VIP]: 1 }), {
    order: { promo: {}, nopromo: { [GA]: 2, [VIP]: 1 } },
    promocode: '',
  });
});

test('zero quantities dropped; empty order rejected', () => {
  assert.deepEqual(buildFastCheckoutOrder({ [GA]: 1, [VIP]: 0 }).order.nopromo, { [GA]: 1 });
  assert.throws(() => buildFastCheckoutOrder({ [GA]: 0 }), /empty/);
});

test('placeholder ids rejected', () => {
  assert.throws(() => buildFastCheckoutOrder({ TODO_GA: 1 }), /Invalid ticket_type_id/);
});

test('checkout URL round-trips JSON, promo and tracking', () => {
  const url = new URL(
    buildCheckoutUrl({
      eventUrl: EVENT,
      items: { [GA]: 2 },
      promoCode: ' TIKTOK10 ',
      utm: { utm_source: 'tiktok', utm_campaign: 'launch', utm_medium: 'paid' },
    }),
  );
  assert.equal(url.origin + url.pathname, EVENT);
  assert.deepEqual(JSON.parse(url.searchParams.get('fast_checkout')), {
    order: { promo: {}, nopromo: { [GA]: 2 } },
    promocode: 'TIKTOK10',
  });
  assert.equal(url.searchParams.get('promo'), 'TIKTOK10');
  assert.equal(url.searchParams.get('aff1'), 'tiktok');
  assert.equal(url.searchParams.get('aff2'), 'launch');
  assert.equal(url.searchParams.get('utm_medium'), 'paid');
});

test('deep link pre-selects tier, falls back to plain event URL', () => {
  const withId = new URL(buildDeepLinkUrl({ eventUrl: EVENT, ticketTypeId: VIP, quantity: 3 }));
  assert.equal(withId.searchParams.get('ticket_type_id'), VIP);
  assert.equal(withId.searchParams.get('quantity'), '3');
  assert.equal(buildDeepLinkUrl({ eventUrl: EVENT, ticketTypeId: 'TODO' }), EVENT);
});

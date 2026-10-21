// Builds Ticketmelon handoff URLs. See docs/09-ticketmelon-integration.md §2.
//
// Mode A (fast_checkout): pre-filled order, buyer lands on Ticketmelon ready to pay.
// Mode B (deep link): event page, optionally with ticket_type_id + quantity pre-selected.
// Both params are undocumented by Ticketmelon; keep this file the only place that knows their shape.

const TICKET_TYPE_ID = /^[0-9a-f]{32}$/;

export function isValidTicketTypeId(id) {
  return typeof id === 'string' && TICKET_TYPE_ID.test(id);
}

/**
 * @param {Record<string, number>} items  ticket_type_id -> quantity
 * @param {string} [promoCode]
 */
export function buildFastCheckoutOrder(items, promoCode = '') {
  const nopromo = {};
  for (const [id, qty] of Object.entries(items)) {
    if (!isValidTicketTypeId(id)) throw new Error(`Invalid ticket_type_id: ${id}`);
    const n = Math.floor(Number(qty));
    if (n > 0) nopromo[id] = n;
  }
  if (Object.keys(nopromo).length === 0) throw new Error('Order is empty');
  return { order: { promo: {}, nopromo }, promocode: promoCode.trim() };
}

/** Tracking params: aff1/aff2 for Ticketmelon reports, utm_* passed through for their GA4. */
export function trackingParams(utm = {}) {
  const params = {};
  if (utm.utm_source) params.aff1 = utm.utm_source;
  if (utm.utm_campaign) params.aff2 = utm.utm_campaign;
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    if (utm[key]) params[key] = utm[key];
  }
  return params;
}

function withParams(eventUrl, params) {
  const url = new URL(eventUrl);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return url.toString();
}

/**
 * Mode A URL.
 * @param {{eventUrl: string, items: Record<string, number>, promoCode?: string, utm?: object}} opts
 */
export function buildCheckoutUrl({ eventUrl, items, promoCode = '', utm = {} }) {
  const order = buildFastCheckoutOrder(items, promoCode);
  const params = { fast_checkout: JSON.stringify(order), ...trackingParams(utm) };
  if (order.promocode) params.promo = order.promocode;
  return withParams(eventUrl, params);
}

/**
 * Mode B URL. Falls back to the plain event page when no valid ticket_type_id is known.
 * @param {{eventUrl: string, ticketTypeId?: string, quantity?: number, promoCode?: string, utm?: object}} opts
 */
export function buildDeepLinkUrl({ eventUrl, ticketTypeId, quantity = 1, promoCode = '', utm = {} }) {
  const params = { ...trackingParams(utm) };
  if (isValidTicketTypeId(ticketTypeId)) {
    params.ticket_type_id = ticketTypeId;
    params.quantity = String(Math.max(1, Math.floor(quantity)));
  }
  if (promoCode.trim()) params.promo = promoCode.trim();
  return withParams(eventUrl, params);
}

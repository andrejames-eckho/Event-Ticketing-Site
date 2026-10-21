// On-site Bag → Ticketmelon handoff (docs/09 §2, rules 1–7).
// status 'pending' (no Ticketmelon event yet): checkout opens a preview dialog instead of redirecting.
import { buildCheckoutUrl, buildDeepLinkUrl, isValidTicketTypeId, trackingParams } from './ticketmelon.js';

const CART_KEY = 'tm-bag-v1';
const UTM_KEY = 'tm-utm-v1';
const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

const php = (n) => `₱${n.toLocaleString('en-PH')}`;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function read(storage, key) {
  try {
    return JSON.parse(storage.getItem(key)) || {};
  } catch {
    return {};
  }
}
function write(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode: bag still works for this page view */
  }
}

// Rule 3: keep landing-page UTMs for the whole session.
function captureUtm() {
  const params = new URLSearchParams(location.search);
  const fresh = Object.fromEntries(UTM_FIELDS.filter((k) => params.get(k)).map((k) => [k, params.get(k)]));
  if (Object.keys(fresh).length) write(sessionStorage, UTM_KEY, fresh);
  return Object.keys(fresh).length ? fresh : read(sessionStorage, UTM_KEY);
}

function track(event, ecommerce) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce });
}

// Shape of the URL we *would* send, for the pending-state preview (placeholder ids fail validation on purpose).
function previewUrl(eventUrl, order, promo, utm) {
  const url = new URL(eventUrl);
  url.searchParams.set('fast_checkout', JSON.stringify({ order: { promo: {}, nopromo: order }, promocode: promo.trim() }));
  for (const [k, v] of Object.entries(trackingParams(utm))) url.searchParams.set(k, v);
  return url.toString();
}

export function initBag({ eventUrl, status, mode, tiers }) {
  const byKey = Object.fromEntries(tiers.map((t) => [t.key, t]));
  const utm = captureUtm();
  const buyable = (t) => t && (t.status === 'on_sale' || t.status === 'low_stock');
  const saleOpen = () => !['announce', 'soldout', 'past'].includes(document.documentElement.dataset.sale);

  // Rule 2 + 7: restore cart, drop unbuyable or unknown tiers.
  let cart = Object.fromEntries(
    Object.entries(read(localStorage, CART_KEY)).filter(([k, q]) => buyable(byKey[k]) && q > 0),
  );

  const el = {
    bag: $('[data-bag]'),
    scrim: $('[data-bag-scrim]'),
    lines: $('[data-bag-lines]'),
    empty: $('[data-bag-empty]'),
    foot: $('[data-bag-foot]'),
    subtotal: $('[data-bag-subtotal]'),
    checkout: $('[data-bag-checkout]'),
    promo: $('[data-bag-promo]'),
    handoff: $('[data-handoff]'),
    handoffScrim: $('[data-handoff-scrim]'),
    handoffUrl: $('[data-handoff-url]'),
    handoffGo: $('[data-handoff-go]'),
    handoffPending: $('[data-handoff-pending]'),
    handoffDesc: $('[data-handoff-desc]'),
    handoffTitle: $('#handoff-title'),
  };

  const count = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const value = () => Object.entries(cart).reduce((sum, [k, q]) => sum + byKey[k].pricePhp * q, 0);
  const items = () =>
    Object.entries(cart).map(([key, qty]) => ({
      item_id: byKey[key].ticketTypeId,
      item_name: byKey[key].name,
      price: byKey[key].pricePhp,
      quantity: qty,
    }));
  const ecommerce = (list = items()) => ({
    currency: 'PHP',
    value: list.reduce((s, i) => s + i.price * i.quantity, 0),
    items: list,
  });

  function lineEl(key, qty) {
    const t = byKey[key];
    const li = document.createElement('li');
    li.className = 'bag-line';
    li.innerHTML = `<div><p class="line-name"></p><p class="line-meta"></p></div><p class="line-total"></p>
      <div class="line-qty" role="group"><button type="button" data-qty-minus aria-label="">−</button><output></output><button type="button" data-qty-plus aria-label="">+</button></div>
      <button type="button" class="line-remove">Remove</button>`;
    $('.line-name', li).textContent = t.name;
    $('.line-meta', li).textContent = `${php(t.pricePhp)} each`;
    $('.line-total', li).textContent = php(t.pricePhp * qty);
    $('.line-qty', li).setAttribute('aria-label', `${t.name} quantity`);
    $('output', li).textContent = String(qty);
    const [minus, plus] = $$('.line-qty button', li);
    minus.dataset.qtyMinus = plus.dataset.qtyPlus = key;
    minus.setAttribute('aria-label', `Remove one ${t.name}`);
    plus.setAttribute('aria-label', `Add one ${t.name}`);
    minus.disabled = qty <= 1;
    plus.disabled = qty >= t.maxQty;
    $('.line-remove', li).addEventListener('click', () => setQty(key, 0));
    return li;
  }

  function render() {
    write(localStorage, CART_KEY, cart);
    const n = count();
    const total = value();
    $$('[data-bag-count]').forEach((c) => {
      c.textContent = String(n);
      c.hidden = n === 0;
    });
    $$('[data-bag-count-text]').forEach((c) => (c.textContent = String(n)));

    for (const t of tiers) {
      const qty = cart[t.key] || 0;
      $$(`[data-qty="${t.key}"]`).forEach((out) => (out.textContent = String(qty)));
      $$(`[data-tier="${t.key}"]`).forEach((card) => card.classList.toggle('has-qty', qty > 0));
      $$(`.tier [data-qty-minus="${t.key}"]`).forEach((b) => (b.disabled = qty === 0));
      $$(`.tier [data-qty-plus="${t.key}"]`).forEach((b) => (b.disabled = !buyable(t) || qty >= t.maxQty));
    }

    el.lines.replaceChildren(...Object.entries(cart).map(([key, qty]) => lineEl(key, qty)));
    el.empty.hidden = n > 0;
    el.foot.hidden = n === 0;
    el.subtotal.textContent = php(total);
    el.checkout.disabled = n === 0 || !saleOpen();
    document.dispatchEvent(new CustomEvent('bag:change', { detail: { count: n, total } }));
  }

  function setQty(key, qty) {
    const t = byKey[key];
    if (!buyable(t)) return;
    const before = cart[key] || 0;
    const next = Math.max(0, Math.min(qty, t.maxQty));
    if (next === before) return;
    if (next === 0) delete cart[key];
    else cart[key] = next;
    const line = { item_id: t.ticketTypeId, item_name: t.name, price: t.pricePhp, quantity: Math.abs(next - before) };
    track(next > before ? 'add_to_cart' : 'remove_from_cart', ecommerce([line]));
    render();
  }

  // Drawer
  let lastFocus = null;
  function openBag() {
    lastFocus = document.activeElement;
    el.bag.hidden = el.scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    $('[data-bag-close]').focus();
    track('view_cart', ecommerce());
  }
  function closeBag() {
    el.bag.hidden = el.scrim.hidden = true;
    document.body.style.overflow = '';
    lastFocus?.focus();
  }
  function closeHandoff() {
    el.handoff.hidden = el.handoffScrim.hidden = true;
  }

  // Rule 1: tell the buyer before leaving; same-tab redirect.
  function showHandoff(url, pending) {
    el.handoffTitle.textContent = pending ? 'Checkout preview' : 'Heading to Ticketmelon';
    el.handoffDesc.textContent = pending
      ? `${count() || 1} ticket(s) ready. In the live site you continue to Ticketmelon to pay.`
      : 'Your tickets are already in the cart there. Log in or sign up on Ticketmelon to pay.';
    el.handoffPending.hidden = !pending;
    el.handoffUrl.textContent = url;
    el.handoffGo.hidden = pending;
    el.handoffGo.href = pending ? '#' : url;
    el.handoff.hidden = el.handoffScrim.hidden = false;
    (pending ? $('[data-handoff-cancel]') : el.handoffGo).focus();
  }

  function checkout() {
    const order = Object.fromEntries(Object.entries(cart).map(([k, q]) => [byKey[k].ticketTypeId, q]));
    const ready = status !== 'pending' && Object.keys(order).every(isValidTicketTypeId);
    track('begin_checkout', ecommerce());
    if (!ready) return showHandoff(previewUrl(eventUrl, order, el.promo.value, utm), true);
    showHandoff(buildCheckoutUrl({ eventUrl, items: order, promoCode: el.promo.value, utm }), false);
  }

  function deepLink(key) {
    const tier = byKey[key];
    track('begin_checkout', ecommerce([{ item_id: tier.ticketTypeId, item_name: tier.name, price: tier.pricePhp, quantity: 1 }]));
    const ready = status !== 'pending' && isValidTicketTypeId(tier.ticketTypeId);
    showHandoff(buildDeepLinkUrl({ eventUrl, ticketTypeId: tier.ticketTypeId, utm }), !ready);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.qtyPlus) setQty(t.dataset.qtyPlus, (cart[t.dataset.qtyPlus] || 0) + 1);
    else if (t.dataset.qtyMinus) setQty(t.dataset.qtyMinus, (cart[t.dataset.qtyMinus] || 0) - 1);
    else if (t.dataset.deepLink !== undefined) deepLink(t.dataset.deepLink);
    else if (t.hasAttribute('data-bag-open')) openBag();
    else if (t.hasAttribute('data-bag-close')) closeBag();
    else if (t.hasAttribute('data-bag-checkout')) checkout();
    else if (t.hasAttribute('data-handoff-cancel')) closeHandoff();
    else if (t.hasAttribute('data-review-reset')) {
      cart = {};
      render();
    }
  });
  el.scrim.addEventListener('click', closeBag);
  el.handoffScrim.addEventListener('click', closeHandoff);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!el.handoff.hidden) closeHandoff();
    else if (!el.bag.hidden) closeBag();
  });
  document.addEventListener('sale:change', render);

  if (mode === 'deep_link') $$('[data-bag-open]').forEach((b) => (b.hidden = true));
  render();
}

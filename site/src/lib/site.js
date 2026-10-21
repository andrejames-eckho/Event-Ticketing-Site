// Page chrome: sale state, review toolbar, mobile menu, sticky bar, filters, FAQ search, waitlist.
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const REVIEW_KEY = 'review-v1';
const root = document.documentElement;

function readReview() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_KEY)) || {};
  } catch {
    return {};
  }
}
function saveReview(patch) {
  try {
    localStorage.setItem(REVIEW_KEY, JSON.stringify({ ...readReview(), ...patch }));
  } catch {
    /* ignore */
  }
}

// docs/08 §6: one saleState drives CTA labels everywhere.
function applySale(state, saleStates) {
  const s = saleStates[state];
  if (!s) return;
  root.dataset.sale = state;
  $$('[data-sale-text]').forEach((n) => (n.textContent = s[n.dataset.saleText]));
  $$('[data-sale-href]').forEach((n) => n.setAttribute('href', s.ctaHref));
  document.dispatchEvent(new CustomEvent('sale:change', { detail: state }));
}

function initReview(config) {
  const box = $('[data-review]');
  if (!box) return;
  const panel = $('[data-review-panel]');
  const toggle = $('[data-review-toggle]');
  toggle.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    toggle.setAttribute('aria-expanded', String(!panel.hidden));
  });
  $$('[data-review-theme]').forEach((r) => {
    r.checked = r.value === root.dataset.theme;
    r.addEventListener('change', () => {
      root.dataset.theme = r.value;
      saveReview({ theme: r.value });
    });
  });
  const sale = $('[data-review-sale]');
  sale.value = root.dataset.sale;
  sale.addEventListener('change', () => {
    applySale(sale.value, config.saleStates);
    saveReview({ sale: sale.value });
  });
  const ph = $('[data-review-ph]');
  ph.checked = root.dataset.placeholders !== 'off';
  ph.addEventListener('change', () => {
    if (ph.checked) delete root.dataset.placeholders;
    else root.dataset.placeholders = 'off';
    saveReview({ ph: ph.checked });
  });
  $('[data-review-reset]').addEventListener('click', () => {
    try {
      localStorage.removeItem(REVIEW_KEY);
    } catch {}
    root.dataset.theme = 'a';
    delete root.dataset.placeholders;
    applySale(config.saleState, config.saleStates);
    sale.value = config.saleState;
    ph.checked = true;
    $$('[data-review-theme]').forEach((r) => (r.checked = r.value === 'a'));
  });
}

function initMenu() {
  const menu = $('[data-menu]');
  const open = $('[data-menu-open]');
  if (!menu || !open) return;
  const close = () => {
    menu.hidden = true;
    document.body.style.overflow = '';
    open.setAttribute('aria-expanded', 'false');
    open.focus();
  };
  open.addEventListener('click', () => {
    menu.hidden = false;
    document.body.style.overflow = 'hidden';
    open.setAttribute('aria-expanded', 'true');
    $('[data-menu-close]').focus();
  });
  $('[data-menu-close]').addEventListener('click', close);
  menu.addEventListener('click', (e) => e.target.closest('a') && close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !menu.hidden && close());
}

// docs/08 §5: sticky bar appears after the hero, hides while the tier grid is visible.
function initSticky() {
  const bar = $('[data-sticky]');
  if (!bar) return;
  const hero = $('[data-hero]');
  const grid = $('[data-tier-grid]');
  let pastHero = !hero;
  let gridVisible = false;
  const update = () => {
    const show = pastHero && !gridVisible;
    bar.classList.toggle('show', show);
    bar.setAttribute('aria-hidden', String(!show));
    $$('a, button', bar).forEach((b) => (b.tabIndex = show ? 0 : -1));
  };
  if (hero) new IntersectionObserver(([e]) => ((pastHero = !e.isIntersecting), update())).observe(hero);
  else addEventListener('scroll', () => ((pastHero = scrollY > 240), update()), { passive: true });
  if (grid) new IntersectionObserver(([e]) => ((gridVisible = e.isIntersecting), update()), { rootMargin: '0px 0px -30% 0px' }).observe(grid);

  document.addEventListener('bag:change', ({ detail }) => {
    const has = detail.count > 0;
    $('[data-sticky-default]', bar).hidden = has;
    $('[data-sticky-bag]', bar).hidden = !has;
    $('[data-sticky-cta]', bar).hidden = has;
    $('[data-sticky-checkout]', bar).hidden = !has;
    $('[data-sticky-total]', bar).textContent = `₱${detail.total.toLocaleString('en-PH')}`;
  });
  update();
}

// Filter chips: <div data-filter="lineup"><button data-value="all" aria-pressed> … items [data-filter-item="lineup"][data-keys="sat main"]
function initFilters() {
  $$('[data-filter]').forEach((group) => {
    const name = group.dataset.filter;
    const buttons = $$('button[data-value]', group);
    buttons.forEach((b) =>
      b.addEventListener('click', () => {
        buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        const v = b.dataset.value;
        $$(`[data-filter-item="${name}"]`).forEach((item) => {
          item.hidden = v !== 'all' && !item.dataset.keys.split(' ').includes(v);
        });
        $$(`[data-filter-empty="${name}"]`).forEach((e) => {
          e.hidden = $$(`[data-filter-item="${name}"]:not([hidden])`).length > 0;
        });
      }),
    );
  });
}

function initFaqSearch() {
  const input = $('[data-faq-search]');
  if (!input) return;
  const items = $$('[data-faq-item]');
  const empty = $('[data-faq-empty]');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((d) => {
      const hit = !q || d.textContent.toLowerCase().includes(q);
      d.hidden = !hit;
      if (hit) shown++;
      if (q && hit) d.open = true;
    });
    $$('[data-faq-group]').forEach((g) => (g.hidden = !$$('[data-faq-item]:not([hidden])', g).length));
    empty.hidden = shown > 0;
  });
}

// ESP not chosen yet (Q9): validate + show success locally, push a dataLayer event.
function initWaitlist() {
  $$('[data-waitlist]').forEach((form) => {
    const msg = $('[data-waitlist-msg]', form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.email.value.trim();
      msg.classList.remove('err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msg.classList.add('err');
        msg.textContent = 'Enter a valid email address.';
        form.email.focus();
        return;
      }
      if (!form.consent.checked) {
        msg.classList.add('err');
        msg.textContent = 'Please tick the consent box so we can email you.';
        return;
      }
      window.dataLayer.push({ event: 'waitlist_signup' });
      msg.textContent = 'You’re on the list. Check your inbox to confirm. (Demo: not sent anywhere yet.)';
      form.reset();
    });
  });
}

// Days-to-go counter (only meaningful once the date is real).
function initCountdown() {
  $$('[data-countdown]').forEach((n) => {
    const days = Math.ceil((new Date(n.dataset.countdown) - Date.now()) / 86400000);
    n.textContent = days > 0 ? `${days} days to go` : '';
  });
}

export function initSite(config) {
  applySale(root.dataset.sale || config.saleState, config.saleStates);
  initReview(config);
  initMenu();
  initSticky();
  initFilters();
  initFaqSearch();
  initWaitlist();
  initCountdown();
}

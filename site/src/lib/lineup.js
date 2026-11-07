// Lineup reveal gate (docs/11 Edition.lineupRevealAt). Evaluated at build time: the site is static, so a
// rebuild has to run at the reveal time for the lineup to go public (docs/10 "Scheduled lineup reveal").
// While hidden, no page may link to /lineup and no artist names may ship in the homepage or schedule HTML.

// Empty = no embargo, lineup is public. Unparseable = stay hidden (fail safe: never leak by accident).
export function isLineupRevealed(revealAt, now = Date.now()) {
  if (revealAt == null || String(revealAt).trim() === '') return true;
  const t = Date.parse(revealAt);
  if (Number.isNaN(t)) return false;
  return now >= t;
}

// "Sat 12 Dec · 6:00 PM" in festival time (Asia/Manila), whatever the build machine's timezone.
export function formatReveal(revealAt) {
  const d = new Date(revealAt);
  if (Number.isNaN(d.getTime())) return 'soon';
  const opts = { timeZone: 'Asia/Manila' };
  const day = d.toLocaleDateString('en-GB', { ...opts, weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
  const time = d.toLocaleTimeString('en-US', { ...opts, hour: 'numeric', minute: '2-digit' });
  return `${day} · ${time}`;
}

// Lineup curtain: two Verlet cloth panels pinned to a rod. Hover brushes the fabric, click tugs it, drag pulls it,
// but every pull is rubber-banded and the top row is nailed down, so it always falls shut. It can move. It never opens.
// Runs only while on screen and while moving; prefers-reduced-motion gets a still curtain (clicks still answer).
// Fabric renders in WebGL (curtain-gl.js, smooth per-pixel pleats); without WebGL it falls back to 2D quads here.
import { createClothRenderer } from './curtain-gl.js';

const COLS = 14; // points across one panel
const ROWS = 16; // points down
const ROD = 24; // rod height, px
const ITER = 4; // constraint passes per step
const DAMP = 0.975;
const GRAVITY = 0.22;
const HOME = 0.012; // pull back to the hanging shape
const BRUSH_R = 90; // hover radius
const GRAB_R = 90; // how close a press has to be to grab cloth

// Placeholder copy (client writes final copy, Q5). {date} = reveal label.
const LINES = [
  'Nice try.',
  'It’s stuck. Properly stuck.',
  'Not until {date}.',
  'The lineup stays backstage for now.',
  'You’re really committed to this curtain.',
  'Still no. Get on the list instead ↑',
];

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export function initCurtain(root) {
  const canvas = root.querySelector('canvas.cloth');
  const rodCanvas = root.querySelector('canvas.rod');
  const rctx = rodCanvas.getContext('2d'); // rod, clips, rod shadow; also used to parse colours
  const glr = createClothRenderer(canvas);
  const ctx = glr ? null : canvas.getContext('2d'); // 2D fallback
  const plate = root.querySelector('[data-curtain-plate]');
  const say = root.querySelector('[data-curtain-say]');
  const countdown = root.querySelector('[data-curtain-countdown]');
  const revealAt = Date.parse(root.dataset.revealAt);
  const dateLabel = root.querySelector('.when')?.getAttribute('aria-label') || 'the reveal';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let W = 0, H = 0, dpr = 1;
  let panels = [];
  let colors;
  let visible = false, running = false, last = 0;
  let grab = null; // { p, panel, x0, y0 }: grabbed point and where the press started
  let pointer = null; // { x, y, vx, vy, downX, downY, downT, moved }
  let shake = 0, shakeT = 0; // rod rattle
  let tries = 0, sayTimer = 0, strainSaid = false;

  // ── Colours from the active theme (review toolbar can switch it) ──────────────
  function rgb(value, fallback) {
    rctx.fillStyle = '#000';
    rctx.fillStyle = value || fallback;
    const s = rctx.fillStyle; // normalised to #rrggbb or rgba()
    if (s[0] === '#') return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
    return s.match(/[\d.]+/g).slice(0, 3).map(Number);
  }
  function readColors() {
    const cs = getComputedStyle(root);
    const v = (n) => cs.getPropertyValue(n).trim();
    colors = { lo: rgb(v('--metal-lo'), '#3b3f46'), mid: rgb(v('--metal-mid'), '#9da3ad'), hi: rgb(v('--metal-hi'), '#ffffff') };
  }
  const shade = (c, k, a = 1) => `rgba(${c.map((x) => Math.round(clamp(x * k, 0, 255))).join(',')},${a})`;

  // ── Cloth ─────────────────────────────────────────────────────────────────────
  function makePanel(x0, width, side) {
    const sx = width / (COLS - 1);
    const sy = (H - ROD + 6) / (ROWS - 1); // +6: hem sits just below the frame edge
    const pts = [];
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x = x0 + i * sx;
        const y = ROD - 2 + j * sy;
        pts.push({ x, y, px: x, py: y, rx: x, ry: y, pin: j === 0, i, j });
      }
    }
    const at = (i, j) => pts[j * COLS + i];
    const links = [];
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        if (i < COLS - 1) links.push([at(i, j), at(i + 1, j), sx]);
        if (j < ROWS - 1) links.push([at(i, j), at(i, j + 1), sy]);
        if (i < COLS - 2) links.push([at(i, j), at(i + 2, j), sx * 2]); // bend: keeps pleats from folding flat
      }
    }
    // The further a point hangs from the rod, the further it may be pulled (top barely moves, hem swings).
    const reach = Math.min(130, W * 0.11);
    pts.forEach((p) => (p.max = reach * (0.25 + 0.75 * (p.j / (ROWS - 1)))));
    return { pts, links, sx, side, at };
  }

  function build() {
    const r = root.getBoundingClientRect();
    W = r.width;
    H = r.height;
    if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    rodCanvas.width = Math.round(W * dpr);
    rodCanvas.height = Math.round(H * dpr);
    rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (glr) {
      glr.resize(W, H, dpr, COLS, ROWS);
    } else {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    readColors();
    const overlap = Math.min(26, W * 0.035);
    const half = W / 2 + overlap;
    // Right first: the left panel is drawn on top and overlaps the seam, like a real stage curtain.
    panels = [makePanel(W - half, half, 'right'), makePanel(0, half, 'left')];
  }

  // Soft limit: pull distance d from rest maps to max·tanh(d/max). Feels like fabric resisting, never a hard stop.
  function leash(p) {
    const dx = p.x - p.rx, dy = p.y - p.ry;
    const d = Math.hypot(dx, dy);
    if (d < 1e-3) return 0;
    const k = (p.max * Math.tanh(d / p.max)) / d;
    p.x = p.rx + dx * k;
    p.y = p.ry + dy * k;
    return d / p.max;
  }

  // Dragging pulls a soft patch of fabric around the grabbed point towards the pointer, rubber-banded.
  function pull(P) {
    const g = grab.p;
    let dx = pointer.x - grab.x0, dy = pointer.y - grab.y0;
    const d = Math.hypot(dx, dy);
    const reach = g.max;
    const strain = d / reach;
    if (d > 1e-3) {
      const k = (reach * Math.tanh(d / reach)) / d;
      dx *= k;
      dy *= k;
    }
    const sx = W * 0.14, sy = H * 0.45; // patch size
    for (const p of P.pts) {
      if (p.pin) continue;
      const w = Math.exp(-(((p.rx - g.rx) / sx) ** 2 + ((p.ry - g.ry) / sy) ** 2)) * (p.j / (ROWS - 1)) ** 0.6;
      p.x += (p.rx + dx * w - p.x) * 0.35 * w;
      p.y += (p.ry + dy * w - p.y) * 0.35 * w;
    }
    if (strain > 1.8 && !strainSaid) {
      strainSaid = true;
      rattle(4);
      talk();
    }
  }

  // Columns never cross each other, so the fabric bunches instead of folding inside out.
  function untangle(P) {
    const gap = P.sx * 0.3;
    for (let j = 1; j < ROWS; j++) {
      for (let i = 1; i < COLS; i++) {
        const a = P.at(i - 1, j), b = P.at(i, j);
        const over = a.x + gap - b.x;
        if (over > 0) { a.x -= over / 2; b.x += over / 2; }
      }
    }
  }

  function step() {
    for (const P of panels) {
      for (const p of P.pts) {
        if (p.pin) continue;
        const vx = (p.x - p.px) * DAMP;
        const vy = (p.y - p.py) * DAMP;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + (p.rx - p.x) * HOME;
        p.y += vy + GRAVITY + (p.ry - p.y) * HOME;
      }
      for (let k = 0; k < ITER; k++) {
        for (const [a, b, len] of P.links) {
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          // Fabric resists stretching hard, bunching up only a little.
          const s = ((d - len) / d) * (d > len ? 0.5 : 0.3);
          const ox = dx * s, oy = dy * s;
          const fa = a.pin, fb = b.pin;
          if (!fa) { a.x += fb ? ox * 2 : ox; a.y += fb ? oy * 2 : oy; }
          if (!fb) { b.x -= fa ? ox * 2 : ox; b.y -= fa ? oy * 2 : oy; }
        }
        if (grab && grab.panel === P) pull(P);
        for (const p of P.pts) if (!p.pin) leash(p);
        untangle(P);
      }
    }
    shake *= 0.9;
    shakeT += 1;
  }

  function energy() {
    let e = 0, n = 0;
    for (const P of panels) for (const p of P.pts) { e += Math.abs(p.x - p.px) + Math.abs(p.y - p.py) + Math.abs(p.x - p.rx) * 0.02; n++; }
    return n ? e / n : 0;
  }

  // ── Drawing (2D fallback for the fabric; the rod is always 2D) ─────────────────
  function drawPanel(P) {
    const { lo, mid, hi } = colors;
    const { at, sx } = P;
    for (let i = 0; i < COLS - 1; i++) {
      for (let j = 0; j < ROWS - 1; j++) {
        const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
        // Bunched fabric reads darker and deeper, stretched reads flatter and brighter.
        const wide = ((b.x - a.x) + (c.x - d.x)) / 2 / sx;
        const tilt = ((a.x - a.rx) + (d.x - d.rx) - (b.x - b.rx) - (c.x - c.rx)) * 0.004;
        const depth = 1 - ((j + 0.5) / (ROWS - 1)) * 0.22; // a touch darker towards the floor
        const k = clamp(0.62 + (wide - 1) * 1.1 + tilt, 0.3, 1.15) * depth;
        const g = ctx.createLinearGradient((a.x + d.x) / 2, (a.y + d.y) / 2, (b.x + c.x) / 2, (b.y + c.y) / 2);
        g.addColorStop(0, shade(lo, k * 0.7));
        g.addColorStop(0.22, shade(mid, k));
        g.addColorStop(0.42, shade(hi, k * 0.95));
        g.addColorStop(0.62, shade(mid, k * 0.85));
        g.addColorStop(1, shade(lo, k * 0.55));
        ctx.fillStyle = g;
        ctx.beginPath();
        // Overdraw by a pixel so neighbouring quads never show hairline gaps.
        ctx.moveTo(a.x - 0.5, a.y - 0.5);
        ctx.lineTo(b.x + 0.5, b.y - 0.5);
        ctx.lineTo(c.x + 0.5, c.y + 1);
        ctx.lineTo(d.x - 0.5, d.y + 1);
        ctx.closePath();
        ctx.fill();
      }
    }
    // Hem
    ctx.beginPath();
    for (let i = 0; i < COLS; i++) {
      const p = at(i, ROWS - 1);
      i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = shade(lo, 0.8);
    ctx.stroke();
  }

  function seamShadow(P) {
    // Soft shadow the left panel casts on the right one along the seam.
    const edge = COLS - 1;
    ctx.beginPath();
    for (let j = 0; j < ROWS; j++) {
      const p = P.at(edge, j);
      j ? ctx.lineTo(p.x + 4, p.y) : ctx.moveTo(p.x + 4, p.y);
    }
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.stroke();
  }

  function drawRod() {
    const { lo, mid, hi } = colors;
    const off = Math.sin(shakeT * 1.7) * shake;
    // Shadow the rod casts on the fabric
    const sh = rctx.createLinearGradient(0, ROD, 0, ROD + 48);
    sh.addColorStop(0, 'rgba(0,0,0,0.5)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    rctx.fillStyle = sh;
    rctx.fillRect(0, ROD, W, 48);
    const g = rctx.createLinearGradient(0, 0, 0, ROD);
    g.addColorStop(0, shade(hi, 0.9));
    g.addColorStop(0.45, shade(mid, 1));
    g.addColorStop(1, shade(lo, 0.8));
    rctx.fillStyle = g;
    rctx.fillRect(0, off * 0.3, W, ROD);
    // Clips holding the fabric; they rattle when someone yanks
    rctx.fillStyle = shade(mid, 0.75);
    for (const P of panels) {
      const every = P.sx < 30 ? 2 : 1; // fewer clips on narrow screens
      for (let i = 0; i < COLS; i += every) {
        const p = P.at(i, 0);
        rctx.fillRect(p.x - 3 + off * ((i % 2) - 0.5), ROD - 3, 6, 9);
      }
    }
  }

  function draw() {
    if (!W) return;
    const [right, left] = panels;
    if (glr) {
      if (!glr.lost) glr.draw(panels, colors);
    } else {
      ctx.clearRect(0, 0, W, H);
      drawPanel(right);
      seamShadow(left);
      drawPanel(left);
    }
    rctx.clearRect(0, 0, W, H);
    drawRod();
    // The sign hangs off the rod and swings with the seam.
    const seam = left.at(COLS - 1, Math.floor(ROWS / 2));
    const tilt = clamp((seam.x - seam.rx) * 0.06 + Math.sin(shakeT * 1.3) * shake * 0.4, -7, 7);
    plate.style.transform = `rotate(${tilt.toFixed(2)}deg)`;
  }

  // ── Loop ──────────────────────────────────────────────────────────────────────
  function frame(t) {
    const steps = last ? clamp(Math.round((t - last) / 16.7), 1, 3) : 1; // same speed on 60 and 120 Hz screens
    last = t;
    for (let s = 0; s < steps; s++) step();
    draw();
    if (visible && (grab || energy() > 0.015 || shake > 0.05)) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (reduce.matches) return draw();
    if (running || !visible) return;
    running = true;
    last = 0;
    requestAnimationFrame(frame);
  }

  // ── Talking back ──────────────────────────────────────────────────────────────
  function talk() {
    const line = LINES[Math.min(tries, LINES.length - 1)].replace('{date}', dateLabel);
    tries++;
    say.textContent = line;
    say.classList.add('show');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(() => say.classList.remove('show'), 2600);
  }
  function rattle(n) {
    shake = Math.max(shake, n);
  }

  // ── Input ─────────────────────────────────────────────────────────────────────
  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function nearest(x, y) {
    let best = null, bd = GRAB_R;
    // Left panel is on top, so it wins ties at the seam.
    for (const P of [panels[1], panels[0]]) {
      for (const p of P.pts) {
        if (p.pin) continue;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d < bd) { bd = d; best = { p, panel: P }; }
      }
    }
    return best;
  }
  function brush(x, y, vx, vy, strength) {
    for (const P of panels) {
      for (const p of P.pts) {
        if (p.pin) continue;
        const d = Math.hypot(p.x - x, p.y - y);
        if (d > BRUSH_R) continue;
        const f = (1 - d / BRUSH_R) ** 2 * strength;
        p.x += clamp(vx, -40, 40) * f;
        p.y += clamp(vy, -40, 40) * f * 0.35;
      }
    }
  }

  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('a')) return;
    const { x, y } = local(e);
    pointer = { x, y, vx: 0, vy: 0, downX: x, downY: y, downT: performance.now(), moved: 0 };
    grab = reduce.matches ? null : nearest(x, y);
    if (grab) Object.assign(grab, { x0: x, y0: y });
    strainSaid = false;
    if (grab) {
      root.setPointerCapture(e.pointerId);
      root.classList.add('grabbing');
    }
    wake();
  });

  root.addEventListener('pointermove', (e) => {
    const { x, y } = local(e);
    const prev = pointer || { x, y };
    const vx = x - prev.x, vy = y - prev.y;
    if (pointer && (pointer.downT || grab)) {
      pointer.moved += Math.abs(vx) + Math.abs(vy);
      Object.assign(pointer, { x, y, vx, vy });
    } else {
      pointer = { x, y, vx, vy };
    }
    if (!grab && !reduce.matches && e.pointerType === 'mouse') {
      brush(x, y, vx, vy, 0.22);
      wake();
    }
  });

  function release(e) {
    const p = pointer;
    const wasGrab = grab;
    grab = null;
    root.classList.remove('grabbing');
    if (!p || !p.downT) return;
    const quick = performance.now() - p.downT < 350 && p.moved < 10;
    if (quick && e.type === 'pointerup') {
      // A click is a tug: yank down, try to part at the seam, rattle the rings. Nothing gives.
      const towardSeam = p.x < W / 2 ? -1 : 1;
      for (const P of reduce.matches ? [] : panels) {
        for (const q of P.pts) {
          if (q.pin) continue;
          const d = Math.hypot(q.x - p.x, q.y - p.y);
          if (d > 150) continue;
          const f = (1 - d / 150) ** 2;
          q.y += 16 * f;
          q.x += towardSeam * 12 * f;
        }
      }
      rattle(5);
      talk();
    } else if (wasGrab && p.moved > 40) {
      rattle(3);
      if (!strainSaid) talk();
    }
    pointer = { x: p.x, y: p.y, vx: 0, vy: 0 };
    wake();
  }
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release); // page started scrolling on touch
  root.addEventListener('pointerleave', (e) => {
    if (!grab) pointer = null;
    if (e.pointerType === 'mouse' && !grab) wake();
  });

  // ── Countdown to the reveal ───────────────────────────────────────────────────
  function tick() {
    if (!countdown || Number.isNaN(revealAt)) return;
    const ms = revealAt - Date.now();
    if (ms <= 0) {
      countdown.textContent = 'Any minute now.';
      return;
    }
    const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60;
    countdown.textContent = `Opens in ${d ? `${d}d ` : ''}${h}h ${String(m).padStart(2, '0')}m`;
  }
  tick();
  setInterval(tick, 30000);

  // ── Lifecycle ─────────────────────────────────────────────────────────────────
  build();
  canvas.classList.add('live');
  // WebGL context lost (GPU reset, too many tabs): show the static CSS pleats instead of an empty frame.
  canvas.addEventListener('webglcontextlost', () => canvas.classList.remove('live'));
  draw();

  new ResizeObserver(() => {
    const r = root.getBoundingClientRect();
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) {
      build();
      draw();
    }
  }).observe(root);

  let swayed = false;
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !swayed && !reduce.matches) {
      // One lazy sway the first time it scrolls into view, so people notice it is fabric.
      swayed = true;
      brush(W * 0.3, H * 0.75, 18, 0, 0.6);
      brush(W * 0.7, H * 0.8, -14, 0, 0.5);
    }
    if (visible) wake();
  }).observe(root);

  // Theme switch in the review toolbar: re-read colours.
  new MutationObserver(() => {
    readColors();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

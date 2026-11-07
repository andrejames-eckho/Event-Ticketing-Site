// Lineup curtain: a heavy stage curtain on a rod, with the call to action hung in front of it on a chain.
//
// Physics is position-based dynamics in real units (px and seconds, gravity scaled so the drop behaves like a
// ~3 m stage curtain). The fabric is a 3D mesh with real pinch pleats (not painted on), so pulling it opens some
// folds and bunches others. It does not stretch: stiff stretch/shear/bend constraints plus long-range tethers to
// the rings (each point can never be further from a ring than the fabric between them allows). That, a weighted
// hem and air drag that resists broadside motion are what make it hang and swing like cloth instead of jelly.
// Rings slide a little on the rod and rattle when someone yanks.
//
// Grab the fabric and it follows your hand until it is taut, then slips out of your fingers. It can move.
// It never opens. The sign hangs from an S-hook on the rod: one chain to an O-ring, two short chains to its top
// corners. It is a rigid body (three heavy points), swings and twists on the chains, and can be grabbed too.
//
// Runs only while on screen and while moving; prefers-reduced-motion gets a still curtain (clicks still answer).
// Fabric renders in WebGL (curtain-gl.js); without WebGL it falls back to flat-shaded 2D quads here.
import { createClothRenderer } from './curtain-gl.js';

const ROD = 24; // rod band height, px
const ROD_Y = ROD / 2; // rod centre line
const HEAD = ROD + 3; // top of the fabric, hung just under the rings
const PLEAT_PX = 68; // pleat width at the rod on a wide screen
const PER_PLEAT = 6; // physics columns per pleat (crest at 0, valley at 3)
const FULLNESS = 1.55; // fabric width / rod width: how deeply the pleats gather
const DROP_M = 3.2; // pretend drop in metres; sets gravity so it swings like a real stage curtain
const DT = 1 / 120; // fixed physics step, s
const MAX_STEPS = 5; // per frame; slow devices run slow-motion instead of exploding
const ITER = 6; // cloth constraint passes per step (tethers do the heavy lifting against stretch)
const RIG_ITER = 24; // chain + sign passes per step (heavy sign on light links needs more)
const DRAG = 0.9; // /s, the fabric's own friction
const DRAG_N = 5; // /s, air resisting motion broadside to the cloth
const HEM_MASS = 3; // weighted hem
const RING_FRICTION = 0.55; // velocity kept per step by a ring sliding on the rod
const MEMORY = 0.01; // per step: heat-set pleats ease back to their fold direction (depth only, never position)
const GRAB_R = 70; // how close a press has to be to catch fabric
const SLIP_PX = 56; // pull this far past where the fabric can go and it slips out of your fingers
const FLING_MAX = 520; // px/s cap on letting go mid-pull
const LINK = 12; // chain link pitch, px
const LINK_M = 0.04, RING_M = 0.12, PLATE_M = 1; // masses (relative)
const RIG_DRAG = 1.1; // /s: settles in a few swings so the button is easy to hit again

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
const rng = (seed) => {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};

export function initCurtain(root) {
  const canvas = root.querySelector('canvas.cloth');
  const rodCanvas = root.querySelector('canvas.rod');
  const rctx = rodCanvas.getContext('2d'); // rod, rings, chain, shadows; also used to parse colours
  const glr = createClothRenderer(canvas);
  const ctx = glr ? null : canvas.getContext('2d'); // 2D fallback
  const plate = root.querySelector('[data-curtain-plate]');
  const say = root.querySelector('[data-curtain-say]');
  const countdown = root.querySelector('[data-curtain-countdown]');
  const revealAt = Date.parse(root.dataset.revealAt);
  const dateLabel = root.querySelector('.when')?.getAttribute('aria-label') || 'the reveal';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  let W = 0, H = 0, dpr = 1, G = 0;
  let panels = []; // [right, left]: left hangs in front at the seam
  let rig = null; // chain + sign
  let colors;
  let visible = false, running = false, last = 0, acc = 0, calm = 0;
  let grip = null; // what the pointer is holding: cloth patch or the sign
  let pointer = null; // { x, y, vx, vy, t, downX, downY, downT, moved }
  let shake = 0, shakeT = 0, rodX = 0, rodY = 0; // rod rattle
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
  function makePanel(x0, width, side, seed) {
    const rand = rng(seed);
    const pleats = clamp(Math.round(width / PLEAT_PX), 3, 10);
    const cols = pleats * PER_PLEAT + 1;
    const rows = clamp(Math.round(H / 22), 20, 30); // folds run vertically; the renderer smooths down the drop
    const n = cols * rows;
    const gap = width / (cols - 1);
    const sy = (H + 10 - HEAD) / (rows - 1); // hem sits just below the frame edge
    // Fold depth so the fabric across one pleat is FULLNESS times the rod distance it covers.
    const wave = (i) => Math.cos((2 * Math.PI * i) / PER_PLEAT);
    const across = (A) => {
      let L = 0;
      for (let i = 0; i < PER_PLEAT; i++) L += Math.hypot(gap, A * (wave(i + 1) - wave(i)));
      return L / (gap * PER_PLEAT);
    };
    let lo = 0, hi = gap * 4;
    for (let it = 0; it < 30; it++) { const m = (lo + hi) / 2; across(m) < FULLNESS ? (lo = m) : (hi = m); }
    const amp = lo;
    const crest = Array.from({ length: pleats + 1 }, () => 0.75 + 0.5 * rand()); // hand-made, not perfect
    // Folds fan out a little toward the hem, each its own way. Both edges hang straight.
    const fanAt = Array.from({ length: pleats + 1 }, (_, q) => (q && q < pleats ? (rand() * 2 - 1) * gap * 2.2 : 0));
    const fan = (i) => {
      const q = (i / PER_PLEAT) | 0, t = (i % PER_PLEAT) / PER_PLEAT;
      return q >= pleats ? fanAt[pleats] : fanAt[q] * (1 - t) + fanAt[q + 1] * t;
    };
    const f32 = () => new Float32Array(n);
    const P = {
      side, cols, rows, n, gap, amp, width,
      x: f32(), y: f32(), z: f32(), px: f32(), py: f32(), pz: f32(), zr: f32(),
      w: f32(), nx: f32(), ny: f32(), nz: f32(),
      rx: new Float32Array(cols), rz: new Float32Array(cols), slack: new Float32Array(cols),
    };
    for (let j = 0; j < rows; j++) {
      const flare = 1 + 0.3 * (j / (rows - 1)); // folds relax and deepen toward the hem
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i, ph = i % PER_PLEAT, pi = (i / PER_PLEAT) | 0;
        const c = ph ? crest[pi] + (crest[pi + 1] - crest[pi]) * (ph / PER_PLEAT) : crest[pi];
        const a = c * wave(i);
        P.x[k] = P.px[k] = x0 + i * gap + fan(i) * (j / (rows - 1));
        P.y[k] = P.py[k] = HEAD + j * sy;
        P.z[k] = P.pz[k] = P.zr[k] = a * amp * flare;
        P.w[k] = j === 0 ? 0.5 : j === rows - 1 ? 1 / HEM_MASS : 1;
      }
    }
    // Rings: slide a little on the rod. The outermost one is screwed to the wall.
    const outer = side === 'left' ? 0 : cols - 1;
    for (let i = 0; i < cols; i++) {
      P.rx[i] = P.x[i];
      P.rz[i] = P.z[i];
      P.slack[i] = i === outer ? 0 : gap * 0.45;
    }

    const d3 = (a, b) => Math.hypot(P.x[b] - P.x[a], P.y[b] - P.y[a], P.z[b] - P.z[a]);
    const C = [];
    const link = (a, b, k) => C.push(a, b, d3(a, b), 1 - (1 - k) ** (1 / ITER));
    const at = (i, j) => j * cols + i;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        if (i < cols - 1) link(at(i, j), at(i + 1, j), 1); // stretch
        if (j < rows - 1) link(at(i, j), at(i, j + 1), 1);
        if (i < cols - 1 && j < rows - 1) { // shear, one diagonal per cell, alternating so it has no bias
          if ((i + j) % 2) link(at(i, j), at(i + 1, j + 1), 0.6);
          else link(at(i + 1, j), at(i, j + 1), 0.6);
        }
        if (i < cols - 2) link(at(i, j), at(i + 2, j), 0.3); // bend: keeps the pleats' shape
        if (j < rows - 2) link(at(i, j), at(i, j + 2), 0.6); // heavy fabric resists folding sideways-up
      }
    }
    const nc = C.length / 4;
    P.ca = new Int32Array(nc); P.cb = new Int32Array(nc); P.cr = new Float32Array(nc); P.ck = new Float32Array(nc);
    for (let c = 0; c < nc; c++) {
      P.ca[c] = C[c * 4]; P.cb[c] = C[c * 4 + 1]; P.cr[c] = C[c * 4 + 2]; P.ck[c] = C[c * 4 + 3];
    }
    P.nc = nc;

    // Long-range tethers: each point to its own column's ring and to both end rings, at the distance through the
    // flattened fabric (+2%). This is what keeps cloth from stretching under a pull, whatever the solver does.
    const fu = new Float32Array(n); // distance along the row from column 0, flattened
    const fv = new Float32Array(n); // distance down the column from the rod, flattened
    for (let j = 0; j < rows; j++) {
      for (let i = 1; i < cols; i++) fu[at(i, j)] = fu[at(i - 1, j)] + d3(at(i - 1, j), at(i, j));
      for (let i = 0; i < cols; i++) if (j) fv[at(i, j)] = fv[at(i, j - 1)] + d3(at(i, j - 1), at(i, j));
    }
    P.ta = new Int32Array(n * 3);
    P.tl = new Float32Array(n * 3);
    for (let k = 0; k < n; k++) {
      const i = k % cols, j = (k / cols) | 0;
      [i, 0, cols - 1].forEach((ai, q) => {
        P.ta[k * 3 + q] = ai;
        P.tl[k * 3 + q] = Math.hypot(fu[k] - fu[at(ai, j)], fv[k]) * 1.02 + 0.5;
      });
    }
    return P;
  }

  function build() {
    const r = root.getBoundingClientRect();
    W = r.width;
    H = r.height;
    if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    G = 9.81 * (H / DROP_M);
    rodCanvas.width = Math.round(W * dpr);
    rodCanvas.height = Math.round(H * dpr);
    rctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (glr) {
      glr.resize(W, H, dpr);
    } else {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    readColors();
    grip = null;
    const overlap = Math.min(30, W * 0.04);
    const half = W / 2 + overlap;
    panels = [makePanel(W - half, half, 'right', 7), makePanel(0, half, 'left', 3)];
    buildRig();
  }

  // Per-point surface normal (for air drag and the 2D renderer).
  function normals(P) {
    const { x, y, z, nx, ny, nz, cols, rows } = P;
    for (let j = 0; j < rows; j++) {
      const ju = j ? j - 1 : j, jd = j < rows - 1 ? j + 1 : j;
      for (let i = 0; i < cols; i++) {
        const il = j * cols + (i ? i - 1 : i), ir = j * cols + (i < cols - 1 ? i + 1 : i);
        const iu = ju * cols + i, id = jd * cols + i;
        const ux = x[ir] - x[il], uy = y[ir] - y[il], uz = z[ir] - z[il];
        const vx = x[id] - x[iu], vy = y[id] - y[iu], vz = z[id] - z[iu];
        let a = uy * vz - uz * vy, b = uz * vx - ux * vz, c = ux * vy - uy * vx;
        const l = Math.hypot(a, b, c) || 1;
        const k = j * cols + i;
        nx[k] = a / l; ny[k] = b / l; nz[k] = c / l;
      }
    }
  }

  function integrate(P, dt) {
    normals(P);
    const { x, y, z, px, py, pz, zr, w, nx, ny, nz, cols, n } = P;
    const g = G * dt * dt, kt = Math.exp(-DRAG * dt), kn = 1 - Math.exp(-DRAG_N * dt);
    for (let k = 0; k < n; k++) {
      if (k < cols) {
        // Ring on the rod: slides sideways with friction; height and depth are fixed by the rod (see rings()).
        const vx = (x[k] - px[k]) * RING_FRICTION;
        px[k] = x[k];
        x[k] += vx;
        continue;
      }
      if (w[k] === 0) { // held: moved by the hand in hold()
        px[k] = x[k]; py[k] = y[k]; pz[k] = z[k];
        continue;
      }
      let vx = x[k] - px[k], vy = y[k] - py[k], vz = z[k] - pz[k];
      const vn = (vx * nx[k] + vy * ny[k] + vz * nz[k]) * kn;
      vx = (vx - nx[k] * vn) * kt;
      vy = (vy - ny[k] * vn) * kt;
      vz = (vz - nz[k] * vn) * kt;
      px[k] = x[k]; py[k] = y[k]; pz[k] = z[k];
      x[k] += vx; y[k] += vy + g; z[k] += vz + (zr[k] - z[k]) * MEMORY;
    }
  }

  function constraints(P) {
    const { x, y, z, w, ca, cb, cr, ck, nc } = P;
    for (let c = 0; c < nc; c++) {
      const a = ca[c], b = cb[c], wa = w[a], wb = w[b], ws = wa + wb;
      if (!ws) continue;
      const dx = x[b] - x[a], dy = y[b] - y[a], dz = z[b] - z[a];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
      const s = ((d - cr[c]) / (d * ws)) * ck[c];
      x[a] += dx * s * wa; y[a] += dy * s * wa; z[a] += dz * s * wa;
      x[b] -= dx * s * wb; y[b] -= dy * s * wb; z[b] -= dz * s * wb;
    }
  }

  // Pull a point back inside every tether ball. Returns nothing; only moves free points (anchors are rings).
  function tetherPoint(P, k, pos) {
    const { x, y, z, ta, tl } = P;
    for (let q = 0; q < 3; q++) {
      const a = ta[k * 3 + q], L = tl[k * 3 + q];
      const dx = pos[0] - x[a], dy = pos[1] - y[a], dz = pos[2] - z[a];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > L) {
        const s = L / d;
        pos[0] = x[a] + dx * s; pos[1] = y[a] + dy * s; pos[2] = z[a] + dz * s;
      }
    }
  }
  const tmp = [0, 0, 0];
  function tethers(P) {
    const { x, y, z, w, cols, n } = P;
    for (let k = cols; k < n; k++) {
      if (w[k] === 0) continue;
      tmp[0] = x[k]; tmp[1] = y[k]; tmp[2] = z[k];
      tetherPoint(P, k, tmp);
      x[k] = tmp[0]; y[k] = tmp[1]; z[k] = tmp[2];
    }
  }

  // Stand-in for self-collision: cloth here can't pass through itself, so neighbouring columns are eased apart
  // when they cross. Soft, so a pulled fold can still overhang for a moment, but nothing stays tangled.
  function untangle(P) {
    const { x, cols, rows } = P, min = P.gap * 0.15;
    for (let j = 1; j < rows; j++) {
      for (let i = 1; i < cols; i++) {
        const a = j * cols + i - 1, b = a + 1, over = x[a] + min - x[b];
        if (over > 0) {
          const wa = P.w[a], wb = P.w[b], ws = wa + wb;
          if (!ws) continue;
          x[a] -= (over * 0.15 * wa) / ws;
          x[b] += (over * 0.15 * wb) / ws;
        }
      }
    }
  }

  // Rings ride on the rod: fixed height and depth, limited slide.
  function rings(P) {
    const { x, y, z, rx, rz, slack, cols } = P;
    for (let i = 0; i < cols; i++) {
      const off = slack[i] ? rodX * 0.3 : 0; // a rattling rod shoves the loose rings
      x[i] = clamp(x[i], rx[i] - slack[i] + off, rx[i] + slack[i] + off);
      y[i] = HEAD + rodY;
      z[i] = rz[i];
    }
  }

  // ── Holding the fabric ────────────────────────────────────────────────────────
  function gripCloth(x, y) {
    let best = null, bd = GRAB_R;
    for (const P of [panels[1], panels[0]]) { // left panel is in front at the seam
      for (let k = P.cols * 2; k < P.n; k++) {
        const d = Math.hypot(P.x[k] - x, P.y[k] - y);
        if (d < bd) { bd = d; best = { P, k }; }
      }
    }
    if (!best) return null;
    const { P, k } = best;
    // A handful of fabric: a firm core in the fingers, and the cloth around it dragged along less and less.
    const r = Math.max(14, P.gap * 1.15), r2 = r * 2.4;
    const ids = [], soft = [], sw = [];
    for (let q = P.cols * 2; q < P.n; q++) {
      const d = Math.hypot(P.x[q] - P.x[k], P.y[q] - P.y[k]);
      if (d < r) ids.push(q);
      else if (d < r2) { soft.push(q); sw.push(0.35 * (1 - (d - r) / (r2 - r)) ** 2); }
    }
    const pos = (list) => [list.map((q) => P.x[q]), list.map((q) => P.y[q]), list.map((q) => P.z[q])];
    const [bx, by, bz] = pos(ids), [sbx, sby, sbz] = pos(soft);
    const g = {
      kind: 'cloth', P, k, ids, bx, by, bz, w: ids.map((q) => P.w[q]), soft, sw, sbx, sby, sbz,
      k0: [P.x[k], P.y[k], P.z[k]], sx: x, sy: y, reach: Math.min(W * 0.17, 160),
    };
    ids.forEach((q) => (P.w[q] = 0));
    return g;
  }

  // The hand moves the held patch as one piece, only as far as the fabric allows (tethers), never further.
  function holdCloth(g) {
    const { P } = g;
    let ox = pointer.x - g.sx, oy = pointer.y - g.sy;
    const m = Math.hypot(ox, oy);
    if (m > g.reach) { ox *= g.reach / m; oy *= g.reach / m; }
    const pinch = Math.min(1, m / 60) * 10; // pinched fabric comes toward you a little
    tmp[0] = g.k0[0] + ox; tmp[1] = g.k0[1] + oy; tmp[2] = g.k0[2] + pinch;
    tetherPoint(P, g.k, tmp);
    const dx = tmp[0] - g.k0[0], dy = tmp[1] - g.k0[1], dz = tmp[2] - g.k0[2];
    for (let q = 0; q < g.ids.length; q++) {
      const id = g.ids[q];
      P.x[id] = g.bx[q] + dx; P.y[id] = g.by[q] + dy; P.z[id] = g.bz[q] + dz;
    }
    for (let q = 0; q < g.soft.length; q++) {
      const id = g.soft[q], f = g.sw[q];
      P.x[id] += (g.sbx[q] + dx - P.x[id]) * f;
      P.y[id] += (g.sby[q] + dy - P.y[id]) * f;
      P.z[id] += (g.sbz[q] + dz - P.z[id]) * f;
    }
  }

  // How far the hand is from where the held fabric actually is. Too far: it slips.
  function clothSlip(g) {
    return Math.hypot(g.k0[0] + pointer.x - g.sx - g.P.x[g.k], g.k0[1] + pointer.y - g.sy - g.P.y[g.k]);
  }

  function letGo() {
    const g = grip;
    grip = null;
    root.classList.remove('grabbing');
    if (!g || g.kind !== 'cloth') return;
    const { P } = g;
    const cap = FLING_MAX * DT;
    g.ids.forEach((q, i) => {
      P.w[q] = g.w[i];
      const vx = P.x[q] - P.px[q], vy = P.y[q] - P.py[q], vz = P.z[q] - P.pz[q];
      const v = Math.hypot(vx, vy, vz);
      if (v > cap) {
        const s = cap / v;
        P.px[q] = P.x[q] - vx * s; P.py[q] = P.y[q] - vy * s; P.pz[q] = P.z[q] - vz * s;
      }
    });
  }

  // Give points a velocity (px/s) without moving them.
  const kick = (P, k, vx, vy, vz) => {
    P.px[k] -= vx * DT; P.py[k] -= vy * DT; P.pz[k] -= vz * DT;
  };

  // A tap pushes the fabric back, away from the finger.
  function poke(x, y) {
    const R = 130;
    for (const P of panels) {
      for (let k = P.cols; k < P.n; k++) {
        const dx = P.x[k] - x, dy = P.y[k] - y, d = Math.hypot(dx, dy);
        if (d > R) continue;
        const f = (1 - d / R) ** 2;
        kick(P, k, (dx / (d || 1)) * 170 * f, (dy / (d || 1)) * 90 * f, -520 * f);
      }
    }
  }

  // A moving mouse brushes the fabric like a passing hand, in proportion to its speed.
  function brush(x, y, vx, vy) {
    const sp = Math.hypot(vx, vy);
    if (sp < 40) return;
    const s = Math.min(1, 1400 / sp), R = 80;
    for (const P of panels) {
      for (let k = P.cols * 2; k < P.n; k++) {
        if (P.w[k] === 0) continue;
        const d = Math.hypot(P.x[k] - x, P.y[k] - y);
        if (d > R) continue;
        const f = (1 - d / R) ** 2 * 0.07 * s;
        kick(P, k, vx * f, vy * f * 0.4, -sp * s * f * 0.25);
      }
    }
  }

  // ── Chain and sign ──────────────────────────────────────────────────────────────
  // S-hook on the rod → chain → O-ring → two chains → the sign's top corners. The sign is three heavy points
  // (two top corners, bottom middle) held rigid, so it swings and twists like a real board.
  function buildRig() {
    plate.style.transform = '';
    const pw = plate.offsetWidth, ph = plate.offsetHeight;
    const cx = W / 2, hookY = ROD + 4;
    const mainLen = clamp(H * 0.08, 34, 56), drop = clamp(H * 0.085, 36, 56), spread = pw * 0.24;
    const ringY = hookY + mainLen, top = ringY + drop;
    root.style.setProperty('--plate-top', `${top}px`);

    const X = [], Y = [], Wt = [];
    const add = (x, y, m) => (X.push(x), Y.push(y), Wt.push(m ? 1 / m : 0), X.length - 1);
    const segs = []; // a, b, rest
    const chain = (a, b, len) => {
      const ids = [a], k = Math.max(3, Math.round(len / LINK));
      for (let s = 1; s < k; s++) ids.push(add(X[a] + ((X[b] - X[a]) * s) / k, Y[a] + ((Y[b] - Y[a]) * s) / k, LINK_M));
      ids.push(b);
      for (let s = 0; s < k; s++) segs.push(ids[s], ids[s + 1], len / k);
      return ids;
    };
    const hook = add(cx, hookY, 0);
    const ring = add(cx, ringY, RING_M);
    const A = add(cx - spread, top, PLATE_M);
    const B = add(cx + spread, top, PLATE_M);
    const C = add(cx, top + ph, PLATE_M * 2); // centre of mass lands mid-sign
    const leg = Math.hypot(spread, drop);
    const chains = [chain(hook, ring, mainLen), chain(ring, A, leg), chain(ring, B, leg)];
    for (const [a, b] of [[A, B], [A, C], [B, C]]) segs.push(a, b, Math.hypot(X[b] - X[a], Y[b] - Y[a]));
    // Chains can go slack but never longer than they are.
    const ties = [hook, ring, mainLen, ring, A, leg, ring, B, leg, hook, A, mainLen + leg, hook, B, mainLen + leg];
    const n = X.length;
    rig = {
      n, hook, ring, A, B, C, chains, cx, hookY, top, pw, ph,
      x: Float32Array.from(X), y: Float32Array.from(Y), px: Float32Array.from(X), py: Float32Array.from(Y),
      w: Float32Array.from(Wt), segs, ties,
    };
  }

  function rigStep(dt) {
    const { x, y, px, py, w, n, hook, segs, ties } = rig;
    const g = G * dt * dt, kd = Math.exp(-RIG_DRAG * dt);
    x[hook] = rig.cx + rodX;
    y[hook] = rig.hookY + rodY;
    for (let i = 0; i < n; i++) {
      if (!w[i]) continue;
      const vx = (x[i] - px[i]) * kd, vy = (y[i] - py[i]) * kd;
      px[i] = x[i]; py[i] = y[i];
      x[i] += vx; y[i] += vy + g;
    }
    const dist = (a, b, L, max) => {
      const ws = w[a] + w[b];
      if (!ws) return;
      const dx = x[b] - x[a], dy = y[b] - y[a], d = Math.hypot(dx, dy) || 1e-6;
      if (max && d <= L) return;
      const s = (d - L) / (d * ws);
      x[a] += dx * s * w[a]; y[a] += dy * s * w[a];
      x[b] -= dx * s * w[b]; y[b] -= dy * s * w[b];
    };
    for (let it = 0; it < RIG_ITER; it++) {
      if (grip?.kind === 'plate') holdPlate(grip);
      for (let s = 0; s < segs.length; s += 3) dist(segs[s], segs[s + 1], segs[s + 2], false);
      for (let s = 0; s < ties.length; s += 3) dist(ties[s], ties[s + 1], ties[s + 2], true);
    }
  }

  // A point on the sign, as a mix of its three points: p = A + s(B−A) + t(C−A).
  function signPoint(s, t) {
    const { x, y, A, B, C } = rig;
    return [x[A] + s * (x[B] - x[A]) + t * (x[C] - x[A]), y[A] + s * (y[B] - y[A]) + t * (y[C] - y[A])];
  }
  function gripPlate(px0, py0) {
    const { x, y, A, B, C } = rig;
    // Solve for s, t (barycentric) of the press point.
    const e1x = x[B] - x[A], e1y = y[B] - y[A], e2x = x[C] - x[A], e2y = y[C] - y[A];
    const det = e1x * e2y - e2x * e1y || 1;
    const qx = px0 - x[A], qy = py0 - y[A];
    const s = (qx * e2y - e2x * qy) / det, t = (e1x * qy - qx * e1y) / det;
    const [hx, hy] = signPoint(s, t);
    return { kind: 'plate', s, t, sx: px0, sy: py0, hx, hy, reach: Math.min(W * 0.14, 110) };
  }
  function holdPlate(g) {
    const { x, y, w, A, B, C } = rig;
    let ox = pointer.x - g.sx, oy = pointer.y - g.sy;
    const m = Math.hypot(ox, oy);
    if (m > g.reach) { ox *= g.reach / m; oy *= g.reach / m; }
    const [cx, cy] = signPoint(g.s, g.t);
    const dx = g.hx + ox - cx, dy = g.hy + oy - cy;
    const wa = 1 - g.s - g.t, wb = g.s, wc = g.t;
    const den = wa * wa * w[A] + wb * wb * w[B] + wc * wc * w[C] || 1;
    const k = 0.35 / den;
    x[A] += dx * k * wa * w[A]; y[A] += dy * k * wa * w[A];
    x[B] += dx * k * wb * w[B]; y[B] += dy * k * wb * w[B];
    x[C] += dx * k * wc * w[C]; y[C] += dy * k * wc * w[C];
  }
  function plateSlip(g) {
    const [cx, cy] = signPoint(g.s, g.t);
    return Math.hypot(g.hx + pointer.x - g.sx - cx, g.hy + pointer.y - g.sy - cy);
  }
  function tapPlate(x) {
    const { px, A, B, C } = rig;
    const dir = x < rig.cx ? 1 : -1; // pushed away from the finger
    for (const i of [A, B, C]) px[i] -= dir * 70 * DT;
    px[dir > 0 ? A : B] -= dir * 60 * DT; // off-centre push twists it
  }

  // ── Step ────────────────────────────────────────────────────────────────────────
  function step(dt) {
    shakeT += dt;
    shake *= Math.exp(-7 * dt);
    rodX = Math.sin(shakeT * 55) * shake * 0.6;
    rodY = Math.cos(shakeT * 71) * shake * 0.25;
    for (const P of panels) {
      integrate(P, dt);
      untangle(P);
      for (let it = 0; it < ITER; it++) {
        if (grip?.kind === 'cloth' && grip.P === P) holdCloth(grip);
        constraints(P);
        if (it % 3 === 2) tethers(P);
        rings(P);
      }
    }
    rigStep(dt);
  }

  function energy() {
    let e = 0, n = 0;
    for (const P of panels) {
      for (let k = 0; k < P.n; k += 3) { e += Math.abs(P.x[k] - P.px[k]) + Math.abs(P.y[k] - P.py[k]) + Math.abs(P.z[k] - P.pz[k]); n++; }
    }
    let r = 0;
    for (let i = 0; i < rig.n; i++) r = Math.max(r, Math.abs(rig.x[i] - rig.px[i]) + Math.abs(rig.y[i] - rig.py[i]));
    return Math.max(n ? e / n : 0, r) / DT; // px/s
  }

  // ── Drawing ─────────────────────────────────────────────────────────────────────
  // 2D fallback for the fabric: flat-shaded quads lit from the upper left.
  function drawPanel(P) {
    const { lo, mid, hi } = colors;
    const { x, y, nx, ny, nz, cols, rows } = P;
    normals(P);
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = j * cols + i, b = a + 1, c = a + cols + 1, d = a + cols;
        let mx = nx[a] + nx[b] + nx[c] + nx[d], my = ny[a] + ny[b] + ny[c] + ny[d], mz = nz[a] + nz[b] + nz[c] + nz[d];
        const l = Math.hypot(mx, my, mz) || 1;
        mx /= l; my /= l; mz = Math.abs(mz / l);
        // Same light rig as the WebGL shader (curtain-gl.js), per quad.
        const d1 = Math.max(0, -0.64 * mx - 0.568 * my + 0.516 * mz);
        const d2 = Math.max(0, 0.853 * mx - 0.15 * my + 0.5 * mz);
        const s1 = Math.max(0, -0.368 * mx - 0.326 * my + 0.871 * mz) ** 28;
        const k = d1 * 0.85 + d2 * 0.22 + (1 - mz) ** 2.2 * 0.25;
        const fall = (1 - 0.35 * (j / rows)) * 0.65; // fold occlusion + stage light falling off toward the floor
        ctx.fillStyle = `rgb(${[0, 1, 2].map((q) => Math.round(clamp((lo[q] * 0.28 + mid[q] * k + hi[q] * s1 * 0.55) * fall, 0, 255))).join(',')})`;
        ctx.beginPath();
        ctx.moveTo(x[a] - 0.5, y[a] - 0.5);
        ctx.lineTo(x[b] + 0.5, y[b] - 0.5);
        ctx.lineTo(x[c] + 0.5, y[c] + 1);
        ctx.lineTo(x[d] - 0.5, y[d] + 1);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  // Rounded-end rectangle centred on the origin, along x.
  function stadium(c, len, wid) {
    const r = wid / 2, h = len / 2 - r;
    c.beginPath();
    c.moveTo(-h, -r);
    c.lineTo(h, -r);
    c.arc(h, 0, r, -Math.PI / 2, Math.PI / 2);
    c.lineTo(-h, r);
    c.arc(-h, 0, r, Math.PI / 2, (Math.PI * 3) / 2);
    c.closePath();
  }

  // One chain link between two points. Links alternate: one seen face-on (an oval loop), the next edge-on (a bar).
  function drawLink(ax, ay, bx, by, face, pass) {
    const { lo, mid, hi } = colors;
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    const T = 2.6; // wire thickness
    const len = L + T * 2.2, wid = face ? Math.max(5, L * 0.62) : T + 0.6;
    rctx.save();
    rctx.translate((ax + bx) / 2 + (pass === 'shadow' ? 4 : 0), (ay + by) / 2 + (pass === 'shadow' ? 7 : 0));
    rctx.rotate(Math.atan2(dy, dx));
    stadium(rctx, len, face ? wid - T : wid);
    if (pass === 'shadow') {
      rctx.lineWidth = T + 1;
      rctx.strokeStyle = 'rgba(0,0,0,0.28)';
      face ? rctx.stroke() : (rctx.fillStyle = 'rgba(0,0,0,0.28)', rctx.fill());
    } else if (face) {
      rctx.lineWidth = T + 1.2;
      rctx.strokeStyle = shade(lo, 0.45);
      rctx.stroke();
      rctx.lineWidth = T;
      rctx.strokeStyle = shade(mid, 0.95);
      rctx.stroke();
      rctx.lineWidth = T * 0.4;
      rctx.strokeStyle = shade(hi, 1, 0.85);
      rctx.translate(-0.4, -0.5);
      rctx.stroke();
    } else {
      rctx.fillStyle = shade(lo, 0.5);
      rctx.fill();
      stadium(rctx, len - 1, T * 0.5);
      rctx.fillStyle = shade(hi, 0.9, 0.9);
      rctx.fill();
    }
    rctx.restore();
  }

  function drawRig() {
    const { x, y, chains, ring, A, B } = rig;
    const { lo, mid, hi } = colors;
    for (const pass of ['shadow', 'metal']) {
      for (const ids of chains) {
        for (let s = 0; s < ids.length - 1; s++) drawLink(x[ids[s]], y[ids[s]], x[ids[s + 1]], y[ids[s + 1]], s % 2 === 0, pass);
      }
      // O-ring where the chains meet, and shackles into the sign's corners
      for (const [i, r] of [[ring, 5.5], [A, 4], [B, 4]]) {
        rctx.beginPath();
        rctx.arc(x[i] + (pass === 'shadow' ? 4 : 0), y[i] + (pass === 'shadow' ? 7 : 0), r, 0, Math.PI * 2);
        rctx.lineWidth = pass === 'shadow' ? 3.6 : 3.2;
        rctx.strokeStyle = pass === 'shadow' ? 'rgba(0,0,0,0.28)' : shade(lo, 0.5);
        rctx.stroke();
        if (pass === 'shadow') continue;
        rctx.lineWidth = 2.2;
        rctx.strokeStyle = shade(mid, 1);
        rctx.stroke();
        rctx.beginPath();
        rctx.arc(x[i], y[i], r, Math.PI * 1.05, Math.PI * 1.6);
        rctx.lineWidth = 1;
        rctx.strokeStyle = shade(hi, 1, 0.9);
        rctx.stroke();
      }
    }
    // S-hook over the rod
    const hx = x[rig.hook], hy = y[rig.hook];
    rctx.beginPath();
    rctx.moveTo(hx, hy + 2);
    rctx.lineTo(hx, ROD_Y + rodY + 4);
    rctx.arc(hx + 5, ROD_Y + rodY - 2, 7.2, Math.PI * 0.8, Math.PI * 1.9, false);
    rctx.lineCap = 'round';
    rctx.lineWidth = 4;
    rctx.strokeStyle = shade(lo, 0.5);
    rctx.stroke();
    rctx.lineWidth = 2.6;
    rctx.strokeStyle = shade(mid, 1.05);
    rctx.stroke();
    rctx.lineCap = 'butt';
  }

  function drawRod() {
    const { lo, mid, hi } = colors;
    // Shadow the rod and rings cast on the fabric
    const sh = rctx.createLinearGradient(0, ROD, 0, ROD + 44);
    sh.addColorStop(0, 'rgba(0,0,0,0.55)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    rctx.fillStyle = sh;
    rctx.fillRect(0, ROD, W, 44);
    // Tube: lit from above, a hard specular line, dark underside
    const ry = rodY * 0.5;
    const g = rctx.createLinearGradient(0, 4 + ry, 0, ROD - 4 + ry);
    g.addColorStop(0, shade(mid, 0.8));
    g.addColorStop(0.22, shade(hi, 1));
    g.addColorStop(0.32, shade(mid, 1.05));
    g.addColorStop(0.75, shade(lo, 0.9));
    g.addColorStop(1, shade(lo, 0.45));
    rctx.fillStyle = shade(lo, 0.35);
    rctx.fillRect(0, 0, W, ROD);
    rctx.fillStyle = g;
    rctx.fillRect(0, 4 + ry, W, ROD - 8);
    // Rings: one per pleat crest, wrapped round the rod, hanging the heading by a short pin
    for (const P of panels) {
      for (let i = 0; i < P.cols; i += PER_PLEAT) {
        const rx = P.x[i], wob = (i % 3) - 1;
        rctx.beginPath();
        rctx.ellipse(rx, ROD_Y + rodY * (1 + wob * 0.4), 3.2, ROD / 2 + 1.5, 0, 0, Math.PI * 2);
        rctx.lineWidth = 3;
        rctx.strokeStyle = shade(lo, 0.5);
        rctx.stroke();
        rctx.lineWidth = 1.8;
        rctx.strokeStyle = shade(mid, 1.1);
        rctx.stroke();
        rctx.fillStyle = shade(lo, 0.6);
        rctx.fillRect(rx - 1, ROD, 2, HEAD - ROD + 2);
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
      drawPanel(left);
    }
    rctx.clearRect(0, 0, W, H);
    drawRod();
    drawRig();
    // The DOM sign follows its two top corners.
    const { x, y, A, B, cx, top } = rig;
    const ang = Math.atan2(y[B] - y[A], x[B] - x[A]);
    const mx = (x[A] + x[B]) / 2 - cx, my = (y[A] + y[B]) / 2 - top;
    plate.style.transform = `translate(${mx.toFixed(2)}px, ${my.toFixed(2)}px) rotate(${ang.toFixed(4)}rad)`;
  }

  // ── Loop ──────────────────────────────────────────────────────────────────────
  function frame(t) {
    acc += last ? Math.min((t - last) / 1000, 0.1) : DT;
    last = t;
    let n = 0;
    while (acc >= DT && n < MAX_STEPS) { step(DT); acc -= DT; n++; }
    if (n === MAX_STEPS) acc = 0;
    if (grip && pointer) {
      const off = grip.kind === 'cloth' ? clothSlip(grip) : plateSlip(grip);
      if (off > (grip.kind === 'cloth' ? SLIP_PX : SLIP_PX * 1.6)) {
        // Taut: it slips out of your fingers and swings back.
        letGo();
        rattle(4);
        if (!strainSaid) { strainSaid = true; talk(); }
      }
    }
    draw();
    // Sleep only after it has been still for a while (a swing is briefly still at each end).
    calm = grip || energy() > 1.5 || shake > 0.05 ? 0 : calm + 1;
    if (visible && calm < 45) requestAnimationFrame(frame);
    else running = false;
  }
  function wake() {
    if (reduce.matches) return draw();
    if (running || !visible) return;
    running = true;
    last = 0;
    acc = 0;
    calm = 0;
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
  const onPlate = (e) => !!e.target.closest('[data-curtain-plate]');

  root.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('a, .ph-tag')) return;
    const { x, y } = local(e);
    pointer = { x, y, vx: 0, vy: 0, t: e.timeStamp, downX: x, downY: y, downT: performance.now(), moved: 0, plate: onPlate(e) };
    strainSaid = false;
    if (grip) letGo();
    if (!reduce.matches) grip = pointer.plate ? gripPlate(x, y) : gripCloth(x, y);
    if (grip) {
      root.setPointerCapture(e.pointerId);
      root.classList.add('grabbing');
    }
    wake();
  });

  root.addEventListener('pointermove', (e) => {
    const { x, y } = local(e);
    const prev = pointer || { x, y, t: e.timeStamp };
    const dt = Math.max(4, e.timeStamp - prev.t) / 1000;
    const vx = (x - prev.x) / dt, vy = (y - prev.y) / dt;
    if (pointer && pointer.downT) {
      pointer.moved += Math.abs(x - prev.x) + Math.abs(y - prev.y);
      Object.assign(pointer, { x, y, vx, vy, t: e.timeStamp });
    } else {
      pointer = { x, y, vx, vy, t: e.timeStamp };
    }
    if (!grip && !reduce.matches && e.pointerType === 'mouse' && !onPlate(e) && panels.length) {
      brush(x, y, vx, vy);
      wake();
    }
  });

  function release(e) {
    const p = pointer;
    const held = grip;
    letGo();
    if (!p || !p.downT) return;
    const quick = performance.now() - p.downT < 350 && p.moved < 10;
    if (quick && e.type === 'pointerup') {
      if (!reduce.matches) p.plate ? tapPlate(p.x) : poke(p.x, p.y);
      rattle(3);
      talk();
    } else if (held && p.moved > 40) {
      rattle(2);
      if (!strainSaid) talk();
    }
    pointer = { x: p.x, y: p.y, vx: 0, vy: 0, t: e.timeStamp };
    wake();
  }
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release); // page started scrolling on touch
  root.addEventListener('pointerleave', () => {
    if (!grip) pointer = null;
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
  if (!W) return;
  root.classList.add('live');
  canvas.classList.add('live');
  // WebGL context lost (GPU reset, too many tabs): show the static CSS pleats instead of an empty frame.
  canvas.addEventListener('webglcontextlost', () => canvas.classList.remove('live'));
  draw();

  let size = [W, H, plate.offsetWidth, plate.offsetHeight];
  const ro = new ResizeObserver(() => {
    const r = root.getBoundingClientRect();
    if (Math.abs(r.width - size[0]) > 1 || Math.abs(r.height - size[1]) > 1) build();
    else if (Math.abs(plate.offsetWidth - size[2]) > 1 || Math.abs(plate.offsetHeight - size[3]) > 1) buildRig(); // web fonts landed
    else return;
    size = [W, H, plate.offsetWidth, plate.offsetHeight];
    draw();
  });
  ro.observe(root);
  ro.observe(plate);

  let swayed = false;
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    if (visible && !swayed && !reduce.matches) {
      // One slow sway the first time it scrolls into view, so people notice it is fabric.
      swayed = true;
      for (const [P, dir] of [[panels[0], -1], [panels[1], 1]]) {
        for (let k = P.cols; k < P.n; k++) {
          const f = ((k / P.cols) | 0) / P.rows;
          kick(P, k, dir * 55 * f * f, 0, 30 * f);
        }
      }
      for (const i of [rig.A, rig.B, rig.C]) rig.px[i] -= 25 * DT;
    }
    if (visible) wake();
  }).observe(root);

  // Theme switch in the review toolbar: re-read colours.
  new MutationObserver(() => {
    readColors();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

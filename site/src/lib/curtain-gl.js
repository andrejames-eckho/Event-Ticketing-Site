// WebGL renderer for the lineup curtain (src/lib/curtain.js does the physics).
// The physics grid is a 3D pleated mesh. Here it is smoothed with cubic B-splines into a fine mesh, normals
// come from the real folded surface, and each pixel is lit like heavy satin under stage light: key light from the
// upper left, a cool fill from the right, a soft sheen on slopes, ambient occlusion deep in the folds and a faint
// weave. Returns null without WebGL; the caller then falls back to the 2D renderer.

const SUB = 2; // render vertices per physics cell, each way
const FLOATS = 9; // pos3, normal3, uv2, ao1

const CLOTH_VS = `
attribute vec3 aPos; attribute vec3 aNrm; attribute vec2 aUV; attribute float aAO;
uniform vec2 uSize; uniform float uZ;
varying vec3 vN; varying vec2 vUV; varying float vAO; varying vec2 vS;
void main() {
  vN = aNrm; vUV = aUV; vAO = aAO; vS = aPos.xy / uSize;
  // Orthographic; z toward the viewer is nearer.
  gl_Position = vec4(aPos.x / uSize.x * 2.0 - 1.0, 1.0 - aPos.y / uSize.y * 2.0, -(aPos.z + uZ) / 2000.0, 1.0);
}`;

const CLOTH_FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vN; varying vec2 vUV; varying float vAO; varying vec2 vS;
uniform vec3 uLo; uniform vec3 uMid; uniform vec3 uHi; uniform vec2 uWeave;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 n = normalize(vN);
  float back = 0.0;
  if (n.z < 0.0) { n = -n; back = 1.0; } // a fold turned over shows the darker lining side
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 L1 = normalize(vec3(-0.62, -0.55, 0.5)); // key: stage light, up and left, raking across the folds
  vec3 L2 = normalize(vec3(0.85, -0.15, 0.5)); // fill from the right
  float d1 = max(dot(n, L1), 0.0);
  float d2 = max(dot(n, L2), 0.0);
  // Satin: tight highlight on the crests, broad sheen where the cloth turns away.
  float s1 = pow(max(dot(n, normalize(L1 + V)), 0.0), 28.0);
  float s2 = pow(max(dot(n, normalize(L2 + V)), 0.0), 14.0);
  float sheen = pow(1.0 - n.z, 2.2);
  vec3 col = uLo * 0.28 + uMid * (d1 * 0.85 + d2 * 0.22 + sheen * 0.25);
  col *= vAO;
  col += uHi * (s1 * 0.55 + s2 * 0.18) * vAO * (1.0 - back * 0.4);
  // Stage light pools at the top middle and falls off toward the floor and wings.
  float spot = 1.0 - 0.5 * smoothstep(0.15, 1.15, length((vS - vec2(0.5, -0.1)) * vec2(1.1, 0.95)));
  col *= spot;
  // Weave, fixed to the fabric so it moves with it.
  col *= 0.975 + 0.05 * hash(floor(vUV * uWeave));
  col *= 1.0 - back * 0.15;
  // Hem: a stitched, slightly heavier edge.
  col *= mix(1.0, 0.6, smoothstep(0.988, 1.0, vUV.y));
  gl_FragColor = vec4(col, 1.0);
}`;

const SHADOW_VS = `
attribute vec2 aPos; attribute float aA;
uniform vec2 uSize;
varying float vA;
void main() {
  vA = aA;
  gl_Position = vec4(aPos.x / uSize.x * 2.0 - 1.0, 1.0 - aPos.y / uSize.y * 2.0, 0.0, 1.0);
}`;
const SHADOW_FS = `
precision mediump float;
varying float vA;
void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, vA); }`;

function program(gl, vs, fs) {
  const p = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

// Uniform cubic B-spline between p1 and p2. Unlike Catmull-Rom it never overshoots, so a sharp crease in the
// cloth renders as a soft fold instead of a spiky shard.
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t, u = 1 - t;
  return (u * u * u * p0 + (3 * t3 - 6 * t2 + 4) * p1 + (-3 * t3 + 3 * t2 + 3 * t + 1) * p2 + t3 * p3) / 6;
};

export function createClothRenderer(canvas) {
  let gl;
  try {
    gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, depth: true });
  } catch {
    gl = null;
  }
  if (!gl) return null;

  let cloth, shadow;
  try {
    cloth = program(gl, CLOTH_VS, CLOTH_FS);
    shadow = program(gl, SHADOW_VS, SHADOW_FS);
  } catch {
    return null;
  }
  const loc = (p, names) => Object.fromEntries(names.map((n) => [n, n[0] === 'a' ? gl.getAttribLocation(p, n) : gl.getUniformLocation(p, n)]));
  const C = loc(cloth, ['aPos', 'aNrm', 'aUV', 'aAO', 'uSize', 'uZ', 'uLo', 'uMid', 'uHi', 'uWeave']);
  const S = loc(shadow, ['aPos', 'aA', 'uSize']);
  const vbo = gl.createBuffer();
  const ibo = gl.createBuffer();
  const sbo = gl.createBuffer();

  let cols = 0, rows = 0, RU = 0, RV = 0, indexCount = 0;
  let verts = new Float32Array(0);
  let hx, hy, hz, sx, sy, sz;
  let W = 1, H = 1;

  function layout(c, r) {
    cols = c;
    rows = r;
    RU = (cols - 1) * SUB + 1;
    RV = (rows - 1) * SUB + 1;
    verts = new Float32Array(RU * RV * FLOATS);
    hx = new Float32Array(rows * RU); hy = new Float32Array(rows * RU); hz = new Float32Array(rows * RU);
    sx = new Float32Array(RU * RV); sy = new Float32Array(RU * RV); sz = new Float32Array(RU * RV);
    const idx = new Uint16Array((RU - 1) * (RV - 1) * 6);
    let k = 0;
    for (let v = 0; v < RV - 1; v++) {
      for (let u = 0; u < RU - 1; u++) {
        const a = v * RU + u, b = a + 1, c2 = a + RU, d = c2 + 1;
        idx.set([a, b, c2, b, d, c2], k);
        k += 6;
      }
    }
    indexCount = k;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  }

  function fill(P) {
    if (P.cols !== cols || P.rows !== rows) layout(P.cols, P.rows);
    // Sample k of n values (at base + k·stride); past either end, mirror so the spline still ends exactly on the
    // edge points (the heading stays tucked under the rings, the seam stays where the physics put it).
    const val = (arr, base, stride, n, k) =>
      k < 0 ? 2 * arr[base] - arr[base + stride] : k >= n ? 2 * arr[base + (n - 1) * stride] - arr[base + (n - 2) * stride] : arr[base + k * stride];
    const spline = (arr, base, stride, n, k, t) =>
      cr(val(arr, base, stride, n, k - 1), arr[base + k * stride], arr[base + (k + 1) * stride], val(arr, base, stride, n, k + 2), t);
    // Pass 1: smooth each physics row horizontally.
    for (let j = 0; j < rows; j++) {
      const base = j * cols;
      for (let u = 0; u < RU; u++) {
        const i = Math.min((u / SUB) | 0, cols - 2), t = u / SUB - i, o = j * RU + u;
        hx[o] = spline(P.x, base, 1, cols, i, t);
        hy[o] = spline(P.y, base, 1, cols, i, t);
        hz[o] = spline(P.z, base, 1, cols, i, t);
      }
    }
    // Pass 2: smooth down each column.
    for (let v = 0; v < RV; v++) {
      const j = Math.min((v / SUB) | 0, rows - 2), t = v / SUB - j;
      for (let u = 0; u < RU; u++) {
        const o = v * RU + u;
        sx[o] = spline(hx, u, RU, rows, j, t);
        sy[o] = spline(hy, u, RU, rows, j, t);
        sz[o] = spline(hz, u, RU, rows, j, t);
      }
    }
    // Normals from the smoothed surface; occlusion from how far a point sits behind its neighbours (fold depth).
    const reach = SUB * 2, amp = Math.max(P.amp, 1);
    let k = 0;
    for (let v = 0; v < RV; v++) {
      const vu = (v ? v - 1 : v) * RU, vd = (v < RV - 1 ? v + 1 : v) * RU, row = v * RU;
      for (let u = 0; u < RU; u++) {
        const l = row + (u ? u - 1 : u), r = row + (u < RU - 1 ? u + 1 : u);
        const ux = sx[r] - sx[l], uy = sy[r] - sy[l], uz = sz[r] - sz[l];
        const tx = sx[vd + u] - sx[vu + u], ty = sy[vd + u] - sy[vu + u], tz = sz[vd + u] - sz[vu + u];
        let nx = uy * tz - uz * ty, ny = uz * tx - ux * tz, nz = ux * ty - uy * tx;
        const nl = Math.hypot(nx, ny, nz) || 1;
        const o = row + u;
        const lap = sz[o] - (sz[row + Math.max(u - reach, 0)] + sz[row + Math.min(u + reach, RU - 1)]) / 2;
        verts[k++] = sx[o];
        verts[k++] = sy[o];
        verts[k++] = sz[o];
        verts[k++] = nx / nl;
        verts[k++] = ny / nl;
        verts[k++] = nz / nl;
        verts[k++] = u / (RU - 1);
        verts[k++] = v / (RV - 1);
        verts[k++] = Math.min(1.05, Math.max(0.3, 0.72 + (0.34 * lap) / (2 * amp)));
      }
    }
  }

  function drawCloth(P, colors, zBias, filled = false) {
    if (!filled) fill(P);
    gl.useProgram(cloth);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
    const stride = FLOATS * 4;
    const bind = (l, size, off) => {
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, off * 4);
    };
    bind(C.aPos, 3, 0);
    bind(C.aNrm, 3, 3);
    bind(C.aUV, 2, 6);
    bind(C.aAO, 1, 8);
    gl.uniform2f(C.uSize, W, H);
    gl.uniform1f(C.uZ, zBias);
    gl.uniform2f(C.uWeave, (P.width * 1.5) / 2, H / 2);
    gl.uniform3fv(C.uLo, colors.lo.map((c) => c / 255));
    gl.uniform3fv(C.uMid, colors.mid.map((c) => c / 255));
    gl.uniform3fv(C.uHi, colors.hi.map((c) => c / 255));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    for (const l of [C.aPos, C.aNrm, C.aUV, C.aAO]) gl.disableVertexAttribArray(l);
  }

  // Soft shadow the left panel throws on the right one, following its smoothed inner edge.
  function drawSeamShadow() {
    const u = RU - 1, width = 18;
    const data = new Float32Array(RV * 2 * 3);
    for (let v = 0; v < RV; v++) {
      const o = (v * RU + u) * FLOATS;
      const x = verts[o], y = verts[o + 1];
      data.set([x - 2, y, 0.5, x + width, y, 0], v * 6);
    }
    gl.disable(gl.DEPTH_TEST);
    gl.useProgram(shadow);
    gl.bindBuffer(gl.ARRAY_BUFFER, sbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(S.aPos);
    gl.vertexAttribPointer(S.aPos, 2, gl.FLOAT, false, 12, 0);
    gl.enableVertexAttribArray(S.aA);
    gl.vertexAttribPointer(S.aA, 1, gl.FLOAT, false, 12, 8);
    gl.uniform2f(S.uSize, W, H);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied black
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, RV * 2);
    gl.disable(gl.BLEND);
    gl.disableVertexAttribArray(S.aPos);
    gl.disableVertexAttribArray(S.aA);
    gl.enable(gl.DEPTH_TEST);
  }

  return {
    resize(w, h, dpr) {
      W = w;
      H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    // panels = [right, left]: left hangs in front at the seam.
    draw([right, left], colors) {
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      drawCloth(right, colors, 0);
      fill(left); // shadow needs the left panel's smoothed edge
      drawSeamShadow();
      drawCloth(left, colors, 40, true);
    },
    get lost() {
      return gl.isContextLost();
    },
  };
}

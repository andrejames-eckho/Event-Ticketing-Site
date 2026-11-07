// WebGL renderer for the lineup curtain (src/lib/curtain.js does the physics).
// The coarse physics grid is smoothed with Catmull-Rom splines into a fine mesh, and each pleat is lit per pixel
// (a cosine fold with diffuse + specular light), so there are no visible cells. Returns null without WebGL;
// the caller then falls back to the 2D renderer.

const SUBX = 5; // render vertices per physics cell, across
const SUBY = 4; // and down

const CLOTH_VS = `
attribute vec2 aPos; attribute float aU; attribute float aV; attribute float aWide; attribute float aTilt;
uniform vec2 uSize;
varying float vU; varying float vV; varying float vWide; varying float vTilt;
void main() {
  vU = aU; vV = aV; vWide = aWide; vTilt = aTilt;
  gl_Position = vec4(aPos.x / uSize.x * 2.0 - 1.0, 1.0 - aPos.y / uSize.y * 2.0, 0.0, 1.0);
}`;

// One pleat per physics column. Surface z = cos(2πu): crest on the column line, valley in between.
// Bunched fabric (wide < 1) folds deeper; stretched fabric flattens out. Tilt leans the folds toward the light.
const CLOTH_FS = `
precision mediump float;
varying float vU; varying float vV; varying float vWide; varying float vTilt;
uniform vec3 uLo; uniform vec3 uMid; uniform vec3 uHi;
const float TAU = 6.2831853;
void main() {
  float t = fract(vU);
  float depth = clamp(0.8 / max(vWide, 0.3), 0.4, 2.2);
  vec3 n = normalize(vec3(depth * sin(TAU * t) + vTilt, 0.0, 1.0));
  vec3 L = normalize(vec3(-0.4, -0.2, 1.0));
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 7.0);
  float ao = 0.55 + 0.45 * (0.5 + 0.5 * cos(TAU * t));
  vec3 col = mix(uLo * 0.7, uMid, diff) * ao + uHi * spec * 0.4;
  col *= 1.0 - vV * 0.25;
  col *= mix(1.0, 0.55, smoothstep(0.97, 1.0, vV));
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

// Catmull-Rom through p1..p2, with p0/p3 as neighbours.
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3);
};

export function createClothRenderer(canvas) {
  let gl;
  try {
    gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true });
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
  const C = loc(cloth, ['aPos', 'aU', 'aV', 'aWide', 'aTilt', 'uSize', 'uLo', 'uMid', 'uHi']);
  const S = loc(shadow, ['aPos', 'aA', 'uSize']);
  const vbo = gl.createBuffer();
  const ibo = gl.createBuffer();
  const sbo = gl.createBuffer();

  let cols = 0, rows = 0, RU = 0, RV = 0, indexCount = 0;
  let verts = new Float32Array(0);
  let W = 1, H = 1;

  function buildIndices() {
    RU = (cols - 1) * SUBX + 1;
    RV = (rows - 1) * SUBY + 1;
    verts = new Float32Array(RU * RV * 6);
    const idx = new Uint16Array((RU - 1) * (RV - 1) * 6);
    let k = 0;
    for (let v = 0; v < RV - 1; v++) {
      for (let u = 0; u < RU - 1; u++) {
        const a = v * RU + u, b = a + 1, c = a + RU, d = c + 1;
        idx.set([a, b, c, b, d, c], k);
        k += 6;
      }
    }
    indexCount = k;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
  }

  // Per physics point: how bunched the fabric is (1 = hanging) and how far it leans.
  function attrs(P) {
    const n = cols * rows;
    const wide = new Float32Array(n), tilt = new Float32Array(n);
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const l = P.at(Math.max(i - 1, 0), j), r = P.at(Math.min(i + 1, cols - 1), j);
        const span = Math.min(i + 1, cols - 1) - Math.max(i - 1, 0);
        wide[j * cols + i] = (r.x - l.x) / (span * P.sx);
        tilt[j * cols + i] = ((l.x - l.rx) - (r.x - r.rx)) * 0.006 + ((l.y - l.ry) - (r.y - r.ry)) * 0.004;
      }
    }
    return { wide, tilt };
  }

  function fill(P) {
    const { wide, tilt } = attrs(P);
    const at = (i, j) => P.at(Math.min(Math.max(i, 0), cols - 1), Math.min(Math.max(j, 0), rows - 1));
    const attr = (arr, i, j) => arr[Math.min(Math.max(j, 0), rows - 1) * cols + Math.min(Math.max(i, 0), cols - 1)];
    // Pass 1: smooth each physics row horizontally.
    const hx = new Float32Array(rows * RU), hy = new Float32Array(rows * RU);
    const hw = new Float32Array(rows * RU), ht = new Float32Array(rows * RU);
    for (let j = 0; j < rows; j++) {
      for (let u = 0; u < RU; u++) {
        const i = Math.min(Math.floor(u / SUBX), cols - 2), t = u / SUBX - i;
        const a = at(i - 1, j), b = at(i, j), c = at(i + 1, j), d = at(i + 2, j);
        const o = j * RU + u;
        hx[o] = cr(a.x, b.x, c.x, d.x, t);
        hy[o] = cr(a.y, b.y, c.y, d.y, t);
        hw[o] = attr(wide, i, j) * (1 - t) + attr(wide, i + 1, j) * t;
        ht[o] = attr(tilt, i, j) * (1 - t) + attr(tilt, i + 1, j) * t;
      }
    }
    // Pleats stay at least ~40px wide on phones instead of one per physics column.
    const pleats = Math.min(1, P.sx / 40);
    // Pass 2: smooth down each column.
    const rowAt = (j) => Math.min(Math.max(j, 0), rows - 1) * RU;
    let k = 0;
    for (let v = 0; v < RV; v++) {
      const j = Math.min(Math.floor(v / SUBY), rows - 2), t = v / SUBY - j;
      const r0 = rowAt(j - 1), r1 = rowAt(j), r2 = rowAt(j + 1), r3 = rowAt(j + 2);
      for (let u = 0; u < RU; u++) {
        verts[k++] = cr(hx[r0 + u], hx[r1 + u], hx[r2 + u], hx[r3 + u], t);
        verts[k++] = cr(hy[r0 + u], hy[r1 + u], hy[r2 + u], hy[r3 + u], t);
        verts[k++] = (u / SUBX) * pleats; // pleat coordinate
        verts[k++] = v / (RV - 1);
        verts[k++] = hw[r1 + u] * (1 - t) + hw[r2 + u] * t;
        verts[k++] = ht[r1 + u] * (1 - t) + ht[r2 + u] * t;
      }
    }
  }

  function drawCloth(P, colors, filled = false) {
    if (!filled) fill(P);
    gl.useProgram(cloth);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
    const stride = 24;
    const bind = (l, size, off) => {
      gl.enableVertexAttribArray(l);
      gl.vertexAttribPointer(l, size, gl.FLOAT, false, stride, off);
    };
    bind(C.aPos, 2, 0);
    bind(C.aU, 1, 8);
    bind(C.aV, 1, 12);
    bind(C.aWide, 1, 16);
    bind(C.aTilt, 1, 20);
    gl.uniform2f(C.uSize, W, H);
    gl.uniform3fv(C.uLo, colors.lo.map((c) => c / 255));
    gl.uniform3fv(C.uMid, colors.mid.map((c) => c / 255));
    gl.uniform3fv(C.uHi, colors.hi.map((c) => c / 255));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    for (const l of [C.aPos, C.aU, C.aV, C.aWide, C.aTilt]) gl.disableVertexAttribArray(l);
  }

  // Soft shadow the left panel throws on the right one, following the smoothed inner edge.
  function drawSeamShadow() {
    const u = RU - 1, width = 16;
    const data = new Float32Array(RV * 2 * 3);
    for (let v = 0; v < RV; v++) {
      const o = (v * RU + u) * 6;
      const x = verts[o], y = verts[o + 1];
      data.set([x - 2, y, 0.45, x + width, y, 0], v * 6);
    }
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
  }

  return {
    resize(w, h, dpr, c, r) {
      W = w;
      H = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (c !== cols || r !== rows) {
        cols = c;
        rows = r;
        buildIndices();
      }
    },
    // panels = [right, left]: right first, left overlaps the seam.
    draw([right, left], colors) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawCloth(right, colors);
      fill(left); // shadow needs the left panel's smoothed edge
      drawSeamShadow();
      drawCloth(left, colors, true);
    },
    get lost() {
      return gl.isContextLost();
    },
  };
}

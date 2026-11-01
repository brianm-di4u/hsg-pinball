// The 3D table (three.js r186, window.THREE from vendor/three-r186.min.js). Renderer setup follows
// hsg-property-game board3d.js (Neutral tone mapping, soft shadows, PMREM environment, software-GL probe, frame
// watchdog) and the post chain follows hsg-football post3d.js (HDR target, bloom with a high threshold so only lamps
// glow). Geometry for walls, ramp and wire is generated from the physics table so the picture always matches play.
import { K, BALL_R, LAYER } from '../sim/physics.js';
import { paintPlayfield } from './playfield.js';
import { CX, BATHHOUSES, VAP } from '../sim/table-spa-city.js';

const TIERS = {
  high: { ratio: 2, msaa: 4, shadow: 2048, bloom: 1, pf: 3.7, steam: 220, gi: 4, flashers: 2, cube: 20 },
  medium: { ratio: 1.5, msaa: 0, shadow: 1024, bloom: 0.5, pf: 2.2, steam: 120, gi: 2, flashers: 0, cube: 0 },
  low: { ratio: 0.75, msaa: 0, shadow: 0, bloom: 0, pf: 1.6, steam: 24, gi: 0, flashers: 0, cube: 0 },
};

export function probeGL() {
  if (!window.THREE) return false;
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
function softwareGL(renderer) {
  try {
    const gl = renderer.getContext(), ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : '';
    return /swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch { return false; }
}

// ---------------------------------------------------------------------------------------------------------------
// asset packs: classic scripts (file:// safe) that set window.__PB_MODELS / window.__PB_ART
function loadScript(src) {
  return new Promise((res) => { const s = document.createElement('script'); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); });
}
async function loadPacks() {
  // the packs themselves are loaded by main.js at boot
  const art = {};
  const src = window.__PB_ART || {};
  await Promise.all(Object.entries(src).map(([k, uri]) => new Promise((res) => {
    const img = new Image(); img.onload = () => { art[k] = img; res(); }; img.onerror = () => res(); img.src = uri;
  })));
  return { art, models: window.__PB_MODELS || {} };
}
function parseGLB(THREE, b64) {
  return new Promise((res) => {
    try {
      const bin = atob(b64), buf = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
      new THREE.GLTFLoader().parse(buf.buffer, '', (g) => res(g.scene), () => res(null));
    } catch { res(null); }
  });
}

// ---------------------------------------------------------------------------------------------------------------
export async function createView3D(canvas, T, lamps, { tier = 'auto', reducedMotion = () => false } = {}) {
  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!window.__TEST__ });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // auto: software GL → low; touch devices (phones, tablets) → medium; everything else → high. The governor steps down.
  const autoTier = () => (softwareGL(renderer) ? 'low' : matchMedia('(pointer: coarse)').matches ? 'medium' : 'high');
  let tierName = tier === 'auto' ? autoTier() : tier;
  let Q = TIERS[tierName] || TIERS.high;

  const packs = await loadPacks();
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#07060c');
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.32;

  // sim (x, y, h) → three (x - W/2, h, H/2 - y)
  const W = T.width, H = T.height, ox = W / 2, oz = H / 2;
  const P = (x, y, h = 0) => new THREE.Vector3(x - ox, h, oz - y);

  // ------------------------------------------------------------------------------------------- materials
  const M = {
    wood: new THREE.MeshStandardMaterial({ color: '#3a2214', roughness: 0.55, metalness: 0 }),
    woodTop: new THREE.MeshStandardMaterial({ color: '#c9a050', roughness: 0.3, metalness: 0.85 }),
    chrome: new THREE.MeshStandardMaterial({ color: '#e8ecf2', roughness: 0.18, metalness: 1, envMapIntensity: 0.42 }),
    steel: new THREE.MeshPhysicalMaterial({ color: '#3a1d10', roughness: 0.45, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.2 }),   // inner guides: lacquered walnut
    railCap: new THREE.MeshStandardMaterial({ color: '#a8843a', roughness: 0.55, metalness: 0.75, envMapIntensity: 0.5 }),   // brushed brass: no mirror glare
    lacquerTop: new THREE.MeshStandardMaterial({ color: '#b8923e', roughness: 0.4, metalness: 1, envMapIntensity: 0.5 }),   // brushed: rounded caps must not bloom
    rubber: new THREE.MeshStandardMaterial({ color: '#cfc8ba', roughness: 0.7, metalness: 0 }),
    blackRubber: new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.7, metalness: 0 }),
    target: new THREE.MeshStandardMaterial({ color: '#d9c9a3', roughness: 0.35, metalness: 0.1, emissive: '#ffd877', emissiveIntensity: 0 }),
    plasticRed: new THREE.MeshPhysicalMaterial({ color: '#ff4a3d', roughness: 0.15, metalness: 0, transparent: true, opacity: 0.55, clearcoat: 1, emissive: '#ff2a1a', emissiveIntensity: 0.15 }),
    rampPlastic: new THREE.MeshPhysicalMaterial({ color: '#bcd6f0', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.2, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }),
    rampEdge: new THREE.MeshPhysicalMaterial({ color: '#dff0ff', roughness: 0.1, metalness: 0, transparent: true, opacity: 0.6, clearcoat: 1 }),
    hole: new THREE.MeshBasicMaterial({ color: '#020205' }),
    apron: new THREE.MeshStandardMaterial({ color: '#2a2740', roughness: 0.4, metalness: 0.6 }),
    ball: new THREE.MeshStandardMaterial({ color: '#f4f6f9', roughness: 0.08, metalness: 1, envMapIntensity: 1.35 }),
    gate: new THREE.MeshStandardMaterial({ color: '#d8dde4', roughness: 0.2, metalness: 1 }),
    wireChrome: new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.28, metalness: 1, envMapIntensity: 0.35 }),
    blade: new THREE.MeshStandardMaterial({ color: '#9aa1ab', roughness: 0.38, metalness: 0.9, envMapIntensity: 0.4 }),
    bladeTop: new THREE.MeshStandardMaterial({ color: '#b9bec5', roughness: 0.45, metalness: 1, envMapIntensity: 0.3 }),
    rampWall: new THREE.MeshPhysicalMaterial({ color: '#cfe4f8', roughness: 0.06, metalness: 0, transparent: true, opacity: 0.2, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }),
    rampLip: new THREE.MeshPhysicalMaterial({ color: '#eef8ff', roughness: 0.1, metalness: 0, transparent: true, opacity: 0.75, clearcoat: 1 }),
    steelFlap: new THREE.MeshStandardMaterial({ color: '#9aa2ad', roughness: 0.35, metalness: 1, envMapIntensity: 0.6 }),
  };

  const decals = makeDecals(THREE);

  // ------------------------------------------------------------------------------------------- playfield
  let pf = paintPlayfield(T, lamps, packs.art, Q.pf);
  const pfTex = new THREE.CanvasTexture(pf.canvas);
  pfTex.colorSpace = THREE.SRGBColorSpace; pfTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const pfMat = new THREE.MeshPhysicalMaterial({ map: pfTex, roughness: 0.5, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.55 });
  const pfLow = new THREE.MeshStandardMaterial({ map: pfTex, roughness: 0.55, metalness: 0 });
  const pfMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), pfMat);
  function applyMaterials() { pfMesh.material = tierName === 'low' ? pfLow : pfMat; }
  applyMaterials();
  pfMesh.rotation.x = -Math.PI / 2; pfMesh.receiveShadow = true;
  scene.add(pfMesh);
  // cabinet body around the playfield
  const cab = new THREE.Mesh(new THREE.BoxGeometry(W + 60, 40, H + 40), M.wood);
  cab.position.set(0, -20.5, 0); scene.add(cab);

  // ------------------------------------------------------------------------------------------- walls
  const geo = { blackRubber: [], blade: [], bladeTop: [], rampRibbon: [], rampLip: [], wire: [], railCap: [], wood: [], chrome: [], rubber: [], black: [], target: [], gate: [], ramp: [], rampEdge: [], steel: [], brass: [] };
  const box = (a, b, w, h, y0, bucket, extra = 0) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) + extra;
    const g = new THREE.BoxGeometry(L, h, w);
    g.rotateY(Math.atan2(dy, dx));
    const m = P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, y0 + h / 2);
    g.translate(m.x, m.y, m.z);
    geo[bucket].push(g);
  };
  const cyl = (x, y, r, h, y0, bucket, seg = 20) => { const g = new THREE.CylinderGeometry(r, r, h, seg); const m = P(x, y, y0 + h / 2); g.translate(m.x, m.y, m.z); geo[bucket].push(g); };
  const targets = [], slingBands = [];
  const roundCap = (a, b, r, y0, bucket) => {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) + r * 2;
    const g = new THREE.CylinderGeometry(r, r, L, 10, 1); g.rotateZ(Math.PI / 2); g.rotateY(Math.atan2(dy, dx));
    const m = P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, y0); g.translate(m.x, m.y, m.z); geo[bucket].push(g);
  };
  T.segs.forEach((s, i) => {
    if (s.vis === 'none') return;
    const a = [s.ax, s.ay], b = [s.bx, s.by];
    if (s.mask === LAYER.FIELD) {
      if (s.kind === K.WALL) {
        const outer = s.group === 'rail';
        if (outer) { box(a, b, s.r * 2, 34, 0, 'wood', s.r * 2); roundCap(a, b, s.r * 0.8, 34, 'railCap'); }
        else { box(a, b, 2.2, 12, 0, 'blade', 0); roundCap(a, b, 1.5, 12, 'bladeTop'); }   // a thin stainless guide with a rolled top
      } else if (s.kind === K.RUBBER || s.kind === K.SLING) {
        if (s.kind === K.SLING) {
          const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
          const band = new THREE.Mesh(new THREE.CapsuleGeometry(s.r, L, 4, 10), M.blackRubber);
          band.rotation.order = 'YXZ'; band.rotation.y = Math.atan2(b[1] - a[1], b[0] - a[0]); band.rotation.z = Math.PI / 2;
          band.position.copy(P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 7)); band.castShadow = true; scene.add(band);
          slingBands.push({ mesh: band, base: band.position.clone(), n: [s.nx, s.ny], side: s.sw >= 0 ? T.swName[s.sw].slice(-1) : 'L' });
        } else {
          box(a, b, s.r * 2, 11, 2, 'rubber', s.r * 2);
          box(a, b, s.r * 2 - 2, 9, 13, 'steel', 0);
        }
      } else if (s.kind === K.TARGET) {
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const g = new THREE.BoxGeometry(L * 0.86, 8, 3); const mesh = new THREE.Mesh(g, M.target.clone());
        const m = P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 4); mesh.position.copy(m); mesh.rotation.y = Math.atan2(b[1] - a[1], b[0] - a[0]);
        mesh.castShadow = true; scene.add(mesh); targets.push({ seg: i, mesh, name: s.name });
      } else if (s.kind === K.GATE) box(a, b, 1.6, 1.6, 12, 'gate', 0);
    } else if (s.mask === (LAYER.FIELD | LAYER.RAMP)) {
      box(a, b, 2.2, 20, 0, 'blade', 0); roundCap(a, b, 1.5, 20, 'bladeTop');
    }
  });
  // ramp: floor strip and side walls from the ramp centre line; wire rails as tubes
  const rampZ = (r, x, y) => {
    let best = 0, bd = Infinity;
    for (let i = 0; i < r.pts.length - 1; i++) {
      const p = r.pts[i], q = r.pts[i + 1], ux = q[0] - p[0], uy = q[1] - p[1], L2 = ux * ux + uy * uy;
      const t = Math.max(0, Math.min(1, ((x - p[0]) * ux + (y - p[1]) * uy) / L2));
      const d = (x - p[0] - ux * t) ** 2 + (y - p[1] - uy * t) ** 2;
      if (d < bd) { bd = d; best = p[2] + (q[2] - p[2]) * t; }
    }
    return best;
  };
  const ramp = T.ramps.find((r) => r.layer === LAYER.RAMP), wire = T.ramps.find((r) => r.layer === LAYER.WIRE);
  if (ramp) {
    { const [x0, y0] = ramp.pts[0], [x1, y1] = ramp.pts[1], ang = Math.atan2(y1 - y0, x1 - x0);
      const flap = new THREE.Mesh(new THREE.BoxGeometry(50, 1.2, 22), M.steelFlap); flap.position.copy(P(x0 - Math.cos(ang) * 6, y0 - Math.sin(ang) * 6, 0.8)); flap.rotation.y = ang + Math.PI / 2; flap.receiveShadow = true; scene.add(flap); }
    // floor: offset the centre line by ±half width, densified
    const pts = densify(ramp.pts, 10);
    const pos = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0, z0] = pts[i], [x1, y1, z1] = pts[i + 1];
      const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
      const hw = i < pts.length * 0.12 ? 26 : 20;
      const q = [P(x0 + nx * hw, y0 + ny * hw, z0 + 1), P(x0 - nx * hw, y0 - ny * hw, z0 + 1), P(x1 + nx * hw, y1 + ny * hw, z1 + 1), P(x1 - nx * hw, y1 - ny * hw, z1 + 1)];
      pos.push(...q[0].toArray(), ...q[1].toArray(), ...q[2].toArray(), ...q[1].toArray(), ...q[3].toArray(), ...q[2].toArray());
    }
    const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); fg.computeVertexNormals();
    geo.ramp.push(fg);
  }
  if (ramp) for (const wl of T.spec.walls.filter((q) => (q.mask || 1) & LAYER.RAMP)) {
    // one continuous wall per rail: a vertical ribbon 16 mm tall following the ramp's height, plus a rounded lip
    const pts = [];
    for (let i = 0; i < wl.pts.length - 1; i++) {
      const [x0, y0] = wl.pts[i], [x1, y1] = wl.pts[i + 1], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 6));
      for (let k = 0; k < n; k++) { const t = k / n; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]); }
    }
    pts.push(wl.pts[wl.pts.length - 1]);
    const pos = [], lip = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], z0 = rampZ(ramp, x0, y0), z1 = rampZ(ramp, x1, y1);
      const a0 = P(x0, y0, z0), a1 = P(x1, y1, z1), b0 = P(x0, y0, z0 + 16), b1 = P(x1, y1, z1 + 16);
      pos.push(...a0.toArray(), ...a1.toArray(), ...b0.toArray(), ...b0.toArray(), ...a1.toArray(), ...b1.toArray());
    }
    for (const [x, y] of pts) lip.push(P(x, y, rampZ(ramp, x, y) + 16));
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
    geo.rampRibbon.push(g);
    if (lip.length > 1) geo.rampLip.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lip, false, 'centripetal'), lip.length * 2, 1.4, 6, false));
  }
  if (wire) {
    for (const s of T.segs.filter((q) => q.mask === LAYER.WIRE)) {
      const za = rampZ(wire, s.ax, s.ay), zb = rampZ(wire, s.bx, s.by);
      for (const dz of [3, 15]) {
        const curve = new THREE.LineCurve3(P(s.ax, s.ay, za + dz), P(s.bx, s.by, zb + dz));
        geo.wire.push(new THREE.TubeGeometry(curve, 2, 1.6, 8, false));
      }
    }
    // wire supports every ~80 mm
    for (const p of densify(wire.pts, 80)) { cyl(p[0], p[1], 1.4, p[2] + 3, 0, 'chrome', 8); }
    // cross-ties between the two rails every ~45 mm
    const wp = densify(wire.pts, 45);
    for (let i = 1; i < wp.length - 1; i++) {
      const [x0, y0] = wp[i - 1], [x1, y1] = wp[i + 1], L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L, [x, y, z] = wp[i];
      geo.wire.push(new THREE.TubeGeometry(new THREE.LineCurve3(P(x - nx * 20, y - ny * 20, z + 2), P(x + nx * 20, y + ny * 20, z + 2)), 1, 1.1, 6, false));
    }
  }
  // posts and bumpers
  const bumpers = [];
  for (const c of T.circles) {
    if (c.kind === K.BUMPER) { bumpers.push(c); continue; }
    if (!(c.mask & LAYER.FIELD)) continue;
    cyl(c.x, c.y, c.r * 0.42, 15, 0, 'chrome', 14);
    { const bolt = new THREE.SphereGeometry(c.r * 0.5, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2); const m = P(c.x, c.y, 15); bolt.translate(m.x, m.y, m.z); geo.chrome.push(bolt); }
    const ring = new THREE.TorusGeometry(c.r * 0.86, c.r * 0.4, 10, 24); ring.rotateX(Math.PI / 2);
    const m = P(c.x, c.y, 7); ring.translate(m.x, m.y, m.z); geo.rubber.push(ring);
  }
  // holes
  for (const h of T.holes) {
    const disc = new THREE.Mesh(new THREE.CircleGeometry(h.r + 1, 24), M.hole); disc.rotation.x = -Math.PI / 2; disc.position.copy(P(h.x, h.y, 0.3)); scene.add(disc);
    const rim = new THREE.TorusGeometry(h.r + 2, 1.6, 8, 28); rim.rotateX(Math.PI / 2); const m = P(h.x, h.y, 0.8); rim.translate(m.x, m.y, m.z); geo.chrome.push(rim);
  }
  // slingshot plastics
  for (const side of ['L', 'R']) {
    const sl = T.segs.find((q) => q.name === 'slingBody' + side);
    const pts = T.spec.walls.find((wl) => wl.name === 'slingBody' + side).pts;
    const shp = new THREE.Shape(); pts.forEach((p, i) => { const v = P(p[0], p[1]); i ? shp.lineTo(v.x, -v.z) : shp.moveTo(v.x, -v.z); }); shp.closePath();
    const g = new THREE.ExtrudeGeometry(shp, { depth: 3.5, bevelEnabled: true, bevelSize: 0.8, bevelThickness: 0.8, bevelSegments: 2 }); g.rotateX(-Math.PI / 2); g.translate(0, 24, 0);
    // planar UVs over the plastic's footprint so the printed art lands on it
    { const pa = g.attributes.position, uv = new Float32Array(pa.count * 2); const xs = pts.map((p) => P(p[0], p[1])); const minX = Math.min(...xs.map((v) => v.x)), maxX = Math.max(...xs.map((v) => v.x)), minZ = Math.min(...xs.map((v) => v.z)), maxZ = Math.max(...xs.map((v) => v.z));
      for (let k = 0; k < pa.count; k++) { uv[k * 2] = (pa.getX(k) - minX) / (maxX - minX); uv[k * 2 + 1] = 1 - (pa.getZ(k) - minZ) / (maxZ - minZ); } g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); }
    const plastic = new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ map: decals.sling[side], roughness: 0.18, transparent: true, opacity: 0.9, clearcoat: 1, emissive: side === 'L' ? '#ff5a3c' : '#2fbfae', emissiveIntensity: 0.12 }));
    // a chrome post with a black rubber ring at each corner
    for (const p of pts) { cyl(p[0], p[1], 2.4, 23, 0, 'chrome', 12); const ring = new THREE.TorusGeometry(5.2, 2.2, 8, 20); ring.rotateX(Math.PI / 2); const m = P(p[0], p[1], 8); ring.translate(m.x, m.y, m.z); geo.blackRubber.push(ring); }
    plastic.castShadow = true; scene.add(plastic);
    (window.__pbSlings ||= {})[side] = plastic;
  }
  // shooter lane floor and apron
  // apron: enamelled steel with gold deco trim, two instruction cards and a dark drain notch between the flippers
  const apronTex = (() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 144;
    const g = c.getContext('2d'), k = 1024 / 462;
    const gr = g.createLinearGradient(0, 0, 0, 144); gr.addColorStop(0, '#2c2846'); gr.addColorStop(1, '#14121f');
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 144);
    g.strokeStyle = '#d4af37'; g.lineWidth = 5; g.strokeRect(6, 6, 1012, 132);
    g.lineWidth = 2; g.strokeRect(16, 16, 992, 112);
    // drain notch (x 196..290 in table mm, relative to the apron's left edge at x 13.5)
    const nx0 = (196 - 13.5) * k, nx1 = (290 - 13.5) * k;
    g.fillStyle = '#050409'; g.beginPath(); g.moveTo(nx0, 0); g.lineTo(nx1, 0); g.lineTo(nx1 - 30, 90); g.lineTo(nx0 + 30, 90); g.closePath(); g.fill();
    g.strokeStyle = '#d4af37'; g.lineWidth = 3; g.stroke();
    // instruction cards
    const card = (x, w, lines) => {
      g.fillStyle = '#efe4c8'; g.fillRect(x, 30, w, 84); g.strokeStyle = '#7a5a20'; g.lineWidth = 2; g.strokeRect(x + 4, 34, w - 8, 76);
      g.fillStyle = '#2a1a10'; g.textAlign = 'center';
      lines.forEach(([t, f], i) => { g.font = f; g.fillText(t, x + w / 2, 66 + i * 30); });
    };
    if (!matchMedia('(pointer: coarse)').matches) card(40, 300, [['SPA CITY', 'bold 30px Georgia, serif'], ['PINBALL', 'bold 22px Georgia, serif']]);
    if (!matchMedia('(pointer: coarse)').matches) card(684, 300, [['THE VAPORS', 'bold 26px Georgia, serif'], ['STARTS MODES', 'bold 20px Georgia, serif']]);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
  })();
  M.apron.map = apronTex; M.apron.color.set('#ffffff'); M.apron.metalness = 0.35; M.apron.roughness = 0.42;
  const apron = new THREE.Mesh(new THREE.BoxGeometry(462, 4, 64), [M.apron, M.apron, M.apron, M.apron, M.apron, M.apron]);
  apron.geometry.groups.forEach((gr, i) => { if (i !== 2) gr.materialIndex = 0; });
  apron.position.copy(P(244.5, 31, 2)); apron.receiveShadow = true; scene.add(apron);
  const merge = THREE.mergeGeometries;
  const addMerged = (list, mat, cast = true) => { if (!list.length) return null; const m = new THREE.Mesh(merge(list.map((g) => g.index ? g.toNonIndexed() : g)), mat); m.castShadow = cast; m.receiveShadow = true; scene.add(m); return m; };
  addMerged(geo.wood, M.wood); addMerged(geo.chrome, M.chrome); addMerged(geo.steel, M.steel); addMerged(geo.rubber, M.rubber);
  addMerged(geo.gate, M.gate); addMerged(geo.rampEdge, M.rampEdge, false); addMerged(geo.brass, M.lacquerTop); addMerged(geo.railCap, M.railCap); addMerged(geo.wire, M.wireChrome); addMerged(geo.blade, M.blade); addMerged(geo.bladeTop, M.bladeTop); addMerged(geo.blackRubber, M.blackRubber);
  const ribbon = addMerged(geo.rampRibbon, M.rampWall, false); if (ribbon) ribbon.renderOrder = 2; addMerged(geo.rampLip, M.rampLip, false);
  const rampMesh = addMerged(geo.ramp, M.rampPlastic, false); if (rampMesh) rampMesh.renderOrder = 2;

  // ------------------------------------------------------------------------------------------- models
  const models = {};
  for (const [k, b64] of Object.entries(packs.models)) models[k] = await parseGLB(THREE, b64);
  const glowMats = [];
  const place = (name, x, y, h, rotY, scale = 1000) => {
    const src = models[name];
    if (!src) return null;
    const o = src.clone(true);
    o.scale.setScalar(scale);
    o.position.copy(P(x, y, h)); o.rotation.y = rotY;
    o.traverse((n) => {
      if (!n.isMesh) return;
      n.castShadow = true; n.receiveShadow = true;
      const mats = Array.isArray(n.material) ? n.material : [n.material];
      for (let i = 0; i < mats.length; i++) {
        const m = mats[i] = mats[i].clone();
        if (/glass_lit/.test(m.name)) { m.emissive = new THREE.Color('#ffc46a'); m.emissiveIntensity = 0.9; glowMats.push(m); }
        if (/neon/.test(m.name)) { m.emissive = m.color.clone(); m.emissiveIntensity = 2.2; glowMats.push(m); }
        if (m.name === 'bumper_body') { m.emissive = new THREE.Color('#3fe0c5'); m.emissiveIntensity = 0.35; m.color.set('#1f7f78'); m.opacity = 0.72; m.roughness = 0.15; }   // translucent spring-water teal, lit from inside
        if (m.name === 'bumper_cap') { m.map = decals.cap; m.color.set('#ffffff'); m.roughness = 0.6; m.envMapIntensity = 0.3; }
        if (m.name === 'sign_panel') { m.map = decals.sign; m.emissiveMap = decals.sign; m.emissive = new THREE.Color('#ffffff'); m.emissiveIntensity = 0.85; m.color.set('#ffffff'); glowMats.push(m); }
        if (m.name === 'spinner_plate') { m.map = decals.spinner; m.color.set('#8a8a8a'); m.metalness = 0; m.roughness = 0.75; m.envMapIntensity = 0.2; }
        if (m.name === 'flipper_body') { m.color.set('#ffffff'); m.map = decals.flipper; m.roughness = 0.36; }
        if (m.name === 'bumper_base' || m.name === 'chrome') m.envMapIntensity = 0.45;
        if (m.name === 'chrome') { m.metalness = 1; m.roughness = 0.12; }
      }
      n.material = Array.isArray(n.material) ? mats : mats[0];
    });
    scene.add(o);
    return o;
  };
  // bathhouses behind their targets, facing the field
  // a model's front faces local +Z; facing sim direction (fx, fy) means rotation.y = atan2(fx, -fy)
  const face = (fx, fy) => Math.atan2(fx, -fy);
  for (const t of targets) {
    const nm = t.name && t.name.startsWith('bh') ? t.name.slice(2).toLowerCase() : null;
    if (!nm) continue;
    const s = T.segs[t.seg];
    let nx = s.nx, ny = s.ny; if (ny < 0) { nx = -nx; ny = -ny; }  // back = up the table
    const bh = place('bh_' + nm, (s.ax + s.bx) / 2 + nx * 2.5, (s.ay + s.by) / 2 + ny * 2.5, 0, face(-nx, -ny), 900);
    if (bh) { bh.scale.set(900, 1550, 900); bh.position.y = -2.2; }   // standups: taller so each façade reads from the player's camera
  }
  // landmarks sized to read from the player's camera: the tower stands in the dead area right of the ramp mouth,
  // the Arlington's twin towers rise twice as tall behind the lock, the Vapors sign is enlarged over its scoop
  const tw = place('tower', 458, 487, 0, 0, 1000); if (tw) tw.scale.set(1350, 2700, 1350);
  const ar = place('arlington', CX, 766, 0, 0, 820); if (ar) ar.scale.set(820, 1640, 900);
  { const fx = 2 * CX - 177.5 - VAP.x, fy = 110 - VAP.y, L = Math.hypot(fx, fy);
    place('vapors', VAP.x - (fx / L) * 8, VAP.y - (fy / L) * 8, 0, face(fx / L, fy / L), 1250); }
  const bumperObjs = bumpers.map((c) => {
    const o = place('bumper', c.x, c.y, 0, 0, 1000 * (c.r / 25));
    if (o) return { c, o };
    const g = new THREE.Group(); const body = new THREE.Mesh(new THREE.CylinderGeometry(c.r * 0.72, c.r * 0.72, 22, 24), new THREE.MeshStandardMaterial({ color: '#ff5aa0', emissive: '#ff2a80', emissiveIntensity: 0.6, roughness: 0.3 }));
    body.position.y = 13; const cap = new THREE.Mesh(new THREE.CylinderGeometry(c.r, c.r, 6, 28), new THREE.MeshStandardMaterial({ color: '#fff4dc', roughness: 0.3 })); cap.position.y = 27;
    g.add(body, cap); g.position.copy(P(c.x, c.y, 0)); scene.add(g); glowMats.push(body.material); return { c, o: g };
  });
  for (const b of bumperObjs) b.o.traverse((n) => { if (n.isMesh) for (const m of (Array.isArray(n.material) ? n.material : [n.material])) if (m.name === 'chrome' || m.name === 'bumper_base') { m.roughness = 0.45; m.envMapIntensity = 0.2; } });
  for (const b of bumperObjs) {
    b.mats = [];
    const ring = new THREE.Mesh(new THREE.PlaneGeometry(b.c.r * 3.4, b.c.r * 3.4), new THREE.MeshBasicMaterial({ map: softTexture(THREE), color: new THREE.Color('#ffd090').multiplyScalar(1.4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.copy(P(b.c.x, b.c.y, 0.6)); scene.add(ring); b.ring = ring;
  } bumperObjs.forEach((b) => b.o.traverse((n) => { if (n.isMesh) (Array.isArray(n.material) ? n.material : [n.material]).forEach((m) => { if (m.emissive && m.emissiveIntensity > 0) b.mats.push(m); }); }));
  // flippers
  const flipperObjs = T.flippers.map((f) => {
    let o = place('flipper', f.x, f.y, 0, f.rest, 1000);
    if (o) o.scale.set(1000 * (f.len + f.r1) / 82, 1000, 1000);  // the model's tip edge is at 82 mm; the bat's tip centre is f.len
    if (!o) {
      o = new THREE.Group();
      const shp = new THREE.Shape(); const n = 16;
      for (let i = 0; i <= n; i++) { const a = Math.PI / 2 + (i / n) * Math.PI; shp.lineTo(Math.cos(a) * f.r0, Math.sin(a) * f.r0); }
      for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (i / n) * Math.PI; shp.lineTo(f.len + Math.cos(a) * f.r1, Math.sin(a) * f.r1); }
      const g = new THREE.ExtrudeGeometry(shp, { depth: 11, bevelEnabled: true, bevelSize: 1, bevelThickness: 1, bevelSegments: 2 }); g.rotateX(Math.PI / 2); g.translate(0, 12, 0);
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color: '#f4f1ea', roughness: 0.35 })); m.castShadow = true; o.add(m);
      o.position.copy(P(f.x, f.y, 0)); scene.add(o);
    }
    return o;
  });
  // spinner
  const spinner = place('spinner', 36, 700, 0, 0, 1000);
  const spinPlate = spinner ? spinner.getObjectByName('spinner_plate') : null;
  if (spinner) spinner.traverse((n) => { if (n.isMesh && n.material.name === 'chrome') { n.material.roughness = 0.5; n.material.envMapIntensity = 0.2; } });
  let spinAngle = 0, spinVel = 0;
  // plunger
  const plungerRod = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 40, 16), M.chrome); plungerRod.rotation.x = Math.PI / 2; scene.add(plungerRod);
  const plungerTip = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 8, 20), M.blackRubber); plungerTip.rotation.x = Math.PI / 2; scene.add(plungerTip);

  // ------------------------------------------------------------------------------------------- contact shadows
  {
    const spots = [];   // [x, y, w, h, rot, darkness]
    for (const c of T.circles) if (c.mask & LAYER.FIELD) spots.push([c.x + 3, c.y - 3, c.r * (c.kind === K.BUMPER ? 3.0 : 3.2), c.r * (c.kind === K.BUMPER ? 3.0 : 3.2), 0, c.kind === K.BUMPER ? 0.75 : 0.5]);
    for (const t of targets) { const s = T.segs[t.seg]; let nx = s.nx, ny = s.ny; if (ny < 0) { nx = -nx; ny = -ny; } spots.push([(s.ax + s.bx) / 2 + nx * 9, (s.ay + s.by) / 2 + ny * 9, 36, 30, Math.atan2(s.by - s.ay, s.bx - s.ax), 0.7]); }
    for (const f of T.flippers) spots.push([f.x + Math.cos(f.rest) * f.len * 0.45 + 3, f.y + Math.sin(f.rest) * f.len * 0.45 - 4, f.len * 1.4, 34, f.rest, 0.5]);
    for (const n of ['slingBodyL', 'slingBodyR']) { const pts = T.spec.walls.find((w) => w.name === n).pts; const cx = pts.reduce((a, q) => a + q[0], 0) / pts.length, cy = pts.reduce((a, q) => a + q[1], 0) / pts.length; spots.push([cx + 3, cy - 4, 70, 140, 0.3 * (n.endsWith('L') ? -1 : 1), 0.45]); }
    spots.push([CX, 772, 64, 34, 0, 0.6], [458, 487, 44, 44, 0, 0.6], [VAP.x, VAP.y + 6, 60, 46, 0.25, 0.5]);
    const sg = new THREE.PlaneGeometry(1, 1); sg.rotateX(-Math.PI / 2);
    const sm = new THREE.InstancedMesh(sg, new THREE.MeshBasicMaterial({ map: softTexture(THREE), color: '#000000', transparent: true, opacity: 0.85, depthWrite: false }), spots.length);
    spots.forEach(([x, y, w, h, r, d], i) => { sm.setMatrixAt(i, new THREE.Matrix4().compose(P(x, y, 0.25), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, r, 0)), new THREE.Vector3(w, 1, h))); });
    sm.renderOrder = 0; sm.frustumCulled = false; scene.add(sm);
  }

  // ------------------------------------------------------------------------------------------- lamps (glowing inserts)
  // one instanced mesh per insert shape (unit size, scaled per lamp) and one for every halo: a handful of draw calls
  // instead of two per lamp. Brightness rides in the instance colour (HDR above 1 blooms).
  const soft = softTexture(THREE);
  const lampInst = [];   // {mesh, index} per lamp
  const lampBase = lamps.map((l) => new THREE.Color(l.color));
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpE = new THREE.Euler(), tmpS = new THREE.Vector3(), tmpC = new THREE.Color();
  const byShape = {};
  lamps.forEach((l, i) => (byShape[l.shape] ||= []).push(i));
  for (const [shp, idx] of Object.entries(byShape)) {
    const g = new THREE.ShapeGeometry(shapeOf(THREE, shp, 1)); g.rotateX(-Math.PI / 2);
    const mesh = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), idx.length);
    idx.forEach((li, k) => {
      const l = lamps[li];
      tmpQ.setFromEuler(tmpE.set(0, l.angle, 0)); tmpS.set(l.size, 1, l.size);
      mesh.setMatrixAt(k, tmpM.compose(P(l.x, l.y, 0.35), tmpQ, tmpS));
      mesh.setColorAt(k, tmpC.copy(lampBase[li]).multiplyScalar(0.1));
      lampInst[li] = { mesh, k };
    });
    mesh.renderOrder = 1; mesh.frustumCulled = false; scene.add(mesh);
  }
  const haloGeo = new THREE.PlaneGeometry(1, 1); haloGeo.rotateX(-Math.PI / 2);
  const halos = new THREE.InstancedMesh(haloGeo, new THREE.MeshBasicMaterial({ map: soft, color: '#ffffff', transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), lamps.length);
  lamps.forEach((l, i) => { tmpS.set(l.size * 2.05, 1, l.size * 2.05); halos.setMatrixAt(i, tmpM.compose(P(l.x, l.y, 0.5), tmpQ.identity(), tmpS)); halos.setColorAt(i, tmpC.setRGB(0, 0, 0)); });
  halos.renderOrder = 1; halos.frustumCulled = false; scene.add(halos);

  // ball reflections: the real table seen from mid-playfield (cube camera), not the studio environment
  const cubeRT = new THREE.WebGLCubeRenderTarget(Q.msaa ? 256 : 128, { type: THREE.HalfFloatType });
  const cubeCam = new THREE.CubeCamera(5, 3000, cubeRT); cubeCam.position.copy(P(W / 2, 520, 45)); scene.add(cubeCam);
  M.ball.envMap = cubeRT.texture;
  for (const c of cubeCam.children) c.layers.enable(1);
  // a dark band round the horizon (reflection only): the classic chrome-ball look, so the ball never reads as glass
  { const band = new THREE.Mesh(new THREE.CylinderGeometry(1400, 1400, 260, 48, 1, true), new THREE.MeshBasicMaterial({ color: '#07060c', side: THREE.BackSide }));
    band.position.copy(P(W / 2, 520, 150)); band.layers.set(1); scene.add(band); }
  // reflection-only light panels (layer 1): the cabinet's lamps and backbox the ball would mirror
  const panelMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#f2f4f8').multiplyScalar(2.0), side: THREE.DoubleSide, toneMapped: false });
  for (const [x, y, w, h, z] of [[W / 2, 1250, 520, 160, 420], [-120, 520, 60, 900, 420], [W + 120, 520, 60, 900, 420], [W / 2, -250, 400, 90, 420], [W / 2, 560, 360, 520, 900]]) {
    const pnl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), panelMat); pnl.position.copy(P(x, y, z)); pnl.lookAt(P(W / 2, 520, 0)); pnl.layers.set(1); scene.add(pnl);
  }
  let cubeAge = 1e9, cubeDone = false;
  const moodState = { key: 'none', t0: 0, fromC: new THREE.Color('#9fb4ff'), fromK: 1.35, fromH: 0.42 };

  // ------------------------------------------------------------------------------------------- balls
  const ballGeo = new THREE.SphereGeometry(BALL_R, 40, 28);
  const shadowMat = new THREE.MeshBasicMaterial({ map: soft, color: '#000000', transparent: true, opacity: 0.55, depthWrite: false });
  const ballPool = [];
  const getBall = (i) => {
    while (ballPool.length <= i) {
      const m = new THREE.Mesh(ballGeo, M.ball); m.castShadow = true;
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(BALL_R * 3, BALL_R * 3), shadowMat); sh.rotation.x = -Math.PI / 2; sh.renderOrder = 1;
      scene.add(m, sh); ballPool.push({ m, sh, last: null });
    }
    return ballPool[i];
  };

  // ------------------------------------------------------------------------------------------- steam
  const steamN = Q.steam;
  const sGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(steamN * 3), sLife = new Float32Array(steamN), sSrc = new Uint8Array(steamN);
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const steam = new THREE.Points(sGeo, new THREE.PointsMaterial({ map: soft, size: 95, transparent: true, opacity: 0.06, depthWrite: false, blending: THREE.AdditiveBlending, color: '#dff6ff', sizeAttenuation: true }));
  steam.renderOrder = 3; scene.add(steam);
  const steamSources = bumpers.map((c) => [c.x, c.y]).concat([[300, 930], [250, 960]]);
  for (let i = 0; i < steamN; i++) { sLife[i] = Math.random(); sSrc[i] = i % steamSources.length; }

  // ------------------------------------------------------------------------------------------- lights
  const hemi = new THREE.HemisphereLight('#9fb4ff', '#3a2418', 0.42); scene.add(hemi);
  // key light from the player's side, high: its mirror reflection points away from the near-overhead camera
  const key = new THREE.DirectionalLight('#ffe6c4', 1.35);
  key.position.copy(P(CX - 140, -700, 1500)); key.target.position.copy(P(CX, 520, 0));
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight('#8fb0ff', 0.25); rim.position.set(-400, 600, -800); scene.add(rim);
  // point lights cost every lit pixel, so the tier decides how many exist (GI pairs top to bottom, flashers for events)
  const flasherPool = [0, 1].map(() => new THREE.PointLight('#ffb070', 0, 260, 2));
  const giPool = [[60, 300], [420, 300], [150, 900], [330, 900]].map(([x, y]) => { const l = new THREE.PointLight('#ffcf88', 2200, 560, 2); l.position.copy(P(x, y, 110)); return l; });
  let flashers = [], giLights = [];
  function applyLights() {
    for (const l of [...flasherPool, ...giPool]) scene.remove(l);
    flashers = flasherPool.slice(0, Q.flashers); flashers.forEach((l) => scene.add(l));
    const g = giPool.slice(0, Q.gi); g.forEach((l) => { l.intensity = l.userData.base = 2200 * (4 / Math.max(2, Q.gi)) * 0.6; scene.add(l); }); giLights = g;
    // Low drops the environment map (its per-pixel sampling dominates software GL) and lifts the fill instead
    scene.environment = tierName === 'low' ? null : envRT.texture;
    scene.environmentIntensity = 0.32;
    hemi.intensity = tierName === 'low' ? 0.85 : 0.42;
    pfTex.anisotropy = tierName === 'low' ? 2 : renderer.capabilities.getMaxAnisotropy(); pfTex.needsUpdate = true;
  }
  applyLights();

  // ------------------------------------------------------------------------------------------- camera
  const camera = new THREE.PerspectiveCamera(28, 1, 10, 6000);
  // pitch off vertical: near-overhead on tall canvases; a wide (phone landscape) canvas tilts back toward a player's
  // eye view so the table fills the width
  let PITCH = 0.32;
  let camMode = 'full', shake = 0, shakeDir = 0;
  // wide canvases (phone landscape) fit the table's WIDTH and follow the ball up and down the table
  let follow = null;   // {d, yMin, yMax, y} when following
  function fitCamera(aspect) {
    camera.aspect = aspect; camera.updateProjectionMatrix();
    PITCH = aspect < 0.75 ? 0.32 : Math.min(0.75, 0.32 + (aspect - 0.75) * 0.6);
    follow = null;
    if (aspect > 1.2 && false) {   // (follow camera kept for reference; full fit reads better)
      PITCH = 0.62;
      const tgt = P(W / 2, 300, 0);
      let lo = 300, hi = 8000;
      for (let it = 0; it < 30; it++) {
        const d = (lo + hi) / 2;
        camera.position.set(tgt.x, tgt.y + Math.cos(PITCH) * d, tgt.z + Math.sin(PITCH) * d); camera.lookAt(tgt); camera.updateMatrixWorld();
        const ok = [P(0, 300, 0), P(W, 300, 0), P(0, 120, 0), P(W, 120, 0)].every((c) => Math.abs(c.clone().project(camera).x) < 0.86);
        if (ok) hi = d; else lo = d;
      }
      follow = { d: hi, yMin: 205, yMax: 760, y: 205 };
      placeFollow(follow.y);
      return;
    }
    const target = P(W / 2, H * 0.47, 0);
    const corners = [P(0, 0, 0), P(W, 0, 0), P(0, H, 0), P(W, H, 0), P(W * 0.85, 870, 80)];
    let lo = 500, hi = 12000;
    for (let it = 0; it < 30; it++) {
      const d = (lo + hi) / 2;
      camera.position.set(target.x, target.y + Math.cos(PITCH) * d, target.z + Math.sin(PITCH) * d);
      camera.lookAt(target); camera.updateMatrixWorld();
      const ok = corners.every((c) => { const v = c.clone().project(camera); return Math.abs(v.x) < 0.98 && Math.abs(v.y) < 0.97; });
      if (ok) hi = d; else lo = d;
    }
    const d = hi;
    camera.position.set(target.x, target.y + Math.cos(PITCH) * d, target.z + Math.sin(PITCH) * d);
    camera.lookAt(target);
    camera.userData.base = camera.position.clone();
  }

  function placeFollow(y) {
    const tgt = P(W / 2, y, 0);
    camera.position.set(tgt.x, tgt.y + Math.cos(PITCH) * follow.d, tgt.z + Math.sin(PITCH) * follow.d);
    camera.lookAt(tgt); camera.userData.base = camera.position.clone();
  }

  // ------------------------------------------------------------------------------------------- post
  let composer = null, bloom = null, rtW = 1, rtH = 1;
  function buildPost() {
    if (composer) { composer.dispose?.(); composer = null; }
    renderer.shadowMap.enabled = Q.shadow > 0;
    key.castShadow = Q.shadow > 0;
    if (Q.shadow) {
      key.shadow.mapSize.set(Q.shadow, Q.shadow); key.shadow.bias = -0.0005; key.shadow.normalBias = 0.8; key.shadow.radius = 3;
      const sc = key.shadow.camera; sc.left = -420; sc.right = 420; sc.top = 720; sc.bottom = -720; sc.near = 600; sc.far = 3400; sc.updateProjectionMatrix();
    }
    if (!Q.bloom) return;
    const rt = new THREE.WebGLRenderTarget(rtW, rtH, { type: THREE.HalfFloatType, samples: Q.msaa });
    composer = new THREE.EffectComposer(renderer, rt);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bloom = new THREE.UnrealBloomPass(new THREE.Vector2(rtW * Q.bloom, rtH * Q.bloom), 0.62, 0.42, 1.18);
    composer.addPass(bloom);
    composer.addPass(new THREE.OutputPass());
    composer.setSize(rtW, rtH);
  }

  // ------------------------------------------------------------------------------------------- runtime
  let lastT = 0, slowFrames = 0, frames = [];
  const view = {
    kind: '3d',
    get tier() { return tierName; },
    maxRatio: () => Q.ratio,
    busy: () => false,
    resize(w, h, ratio) {
      renderer.setPixelRatio(Math.min(ratio, Q.ratio));
      renderer.setSize(w, h, false);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      rtW = Math.round(w * Math.min(ratio, Q.ratio)); rtH = Math.round(h * Math.min(ratio, Q.ratio));
      fitCamera(w / Math.max(1, h));
      if (camMode !== 'full') this.setCamera(camMode);
      buildPost();
    },
    setTier(name) {
      if (name === 'auto') name = autoTier();
      if (!TIERS[name] || name === tierName) return;
      tierName = name; Q = TIERS[name];
      applyLights(); applyMaterials();
      buildPost();
      window.dispatchEvent(new Event('resize'));
    },
    hide() { canvas.style.visibility = 'hidden'; },
    /** 'full' (default framing) or a close view {x, y, z, dist, pitch, yaw} in table mm and radians (review captures, attract). */
    /** The rendered (uploaded) brightness of a lamp's insert, for tests. */
    lampLevel(name) { const i = lamps.findIndex((l) => l.name === name); if (i < 0) return null; const li = lampInst[i], c = new THREE.Color(); li.mesh.getColorAt(li.k, c); return li.mesh.instanceColor.version > 0 ? Math.max(c.r, c.g, c.b) : 0; },
    setCamera(m) {
      camMode = m || 'full';
      if (camMode === 'full') { fitCamera(camera.aspect); return; }
      const look = P(m.x, m.y, m.z || 0), d = m.dist || 260, pitch = m.pitch ?? 0.85, yaw = m.yaw || 0;
      camera.position.set(look.x + Math.sin(yaw) * Math.sin(pitch) * d, look.y + Math.cos(pitch) * d, look.z + Math.cos(yaw) * Math.sin(pitch) * d);
      camera.lookAt(look); camera.userData.base = camera.position.clone();
    },
    draw(G, alpha, lampOn, interp, o) {
      canvas.style.visibility = 'visible';
      const t = o.t, dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t;
      // governor (ignore long frames from test stepping)
      if (!window.__TEST__ && dt > 0 && dt < 0.2) {
        frames.push(dt); if (frames.length > 60) frames.shift();
        if (frames.length === 60) {
          const med = [...frames].sort((a, b) => a - b)[30];
          if (med > 0.024 && tierName !== 'low') { slowFrames++; if (slowFrames > 1) { view.setTier(tierName === 'high' ? 'medium' : 'low'); slowFrames = 0; frames = []; } }
          else if (med > 0.05 && tierName === 'low') { slowFrames++; if (slowFrames > 2 && view.onTooSlow) { view.onTooSlow(); slowFrames = 0; frames = []; } }
          else slowFrames = 0;
        }
      }
      // flippers
      interp.flippers.forEach((f, i) => { flipperObjs[i].rotation.y = f.angle; });
      // balls
      interp.balls.forEach((b, i) => {
        const B = getBall(i);
        B.m.visible = B.sh.visible = true;
        const p = P(b.x, b.y, BALL_R + b.z);
        if (B.last && B.last.id === b.id) {
          const dx = p.x - B.m.position.x, dz = p.z - B.m.position.z, d = Math.hypot(dx, dz);
          if (d > 0.01 && d < 60) { const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(dz / d, 0, -dx / d), d / BALL_R); B.m.quaternion.premultiply(q); }
        }
        B.m.position.copy(p); B.last = { id: b.id };
        B.sh.position.set(p.x + 4 + b.z * 0.3, (b.z > 2 ? b.z : 0) + 0.6, p.z + 3 + b.z * 0.2);
        B.sh.material.opacity = 0.55;
      });
      for (let i = interp.balls.length; i < ballPool.length; i++) { ballPool[i].m.visible = ballPool[i].sh.visible = false; ballPool[i].last = null; }
      // lamps
      const touched = new Set();
      lamps.forEach((l, i) => {
        const v = lampOn[l.name] || 0, li = lampInst[i];
        li.mesh.setColorAt(li.k, tmpC.copy(lampBase[i]).multiplyScalar(0.1 + v * (l.group === 'row' || l.name === 'wizard' ? 1.5 : 2.9))); touched.add(li.mesh);   // target inserts sit under their name plates: kept below bloom clip
        halos.setColorAt(i, tmpC.copy(lampBase[i]).multiplyScalar(v * (l.group === 'spa' ? 0.75 : 0.2)));
      });
      for (const m of touched) m.instanceColor.needsUpdate = true;
      halos.instanceColor.needsUpdate = true;
      // targets flash, drops
      const fx = o.effects;
      for (const tg of targets) {
        tg.mesh.visible = !G.w.drops[tg.seg];
        const hit = fx.find((e) => e.k === 'flash' && e.name === tg.name && t - e.t < 0.25);
        tg.mesh.material.emissiveIntensity = hit ? 1.4 * (1 - (t - hit.t) / 0.25) : 0;
      }
      // bumpers
      bumperObjs.forEach((b, i) => {
        const hit = fx.find((e) => e.k === 'flash' && e.name === 'bumper' + (i + 1) && t - e.t < 0.18);
        const k = hit ? Math.min(1, 2 * (1 - (t - hit.t) / 0.18)) : 0;   // hold, then recover
        for (const m of b.mats) m.emissiveIntensity = 0.3 + k * 3.2;
        b.o.position.y = -k * 6;
        if (b.ring) { b.ring.material.opacity = k * 0.75; b.ring.scale.setScalar(1 + (1 - k) * 0.6); }
      });
      // flashers follow recent big events
      const big = fx.filter((e) => e.k === 'flash' && t - e.t < 0.2).slice(-3);
      flashers.forEach((l, i) => {
        const e = big[i];
        if (!e || o.reduced) { l.intensity = 0; return; }
        const k = 1 - (t - e.t) / 0.2;
        const pos = e.name && e.name.startsWith('bumper') ? bumpers[+e.name[6] - 1] : e.name && e.name.startsWith('sling') ? { x: e.name === 'slingL' ? 118 : 367, y: 260 } : { x: CX, y: 600 };
        l.position.copy(P(pos.x, pos.y, 70)); l.intensity = 9000 * k;
      });
      for (const m of glowMats) if (m.name && /glass_lit|neon|sign/.test(m.name)) m.emissiveIntensity = (/neon/.test(m.name) ? 1.5 : /sign/.test(m.name) ? 0.85 : 0.9) * (0.88 + 0.12 * Math.sin(t * 3 + m.id));
      // spinner
      for (const e of fx) if (e.k === 'spin' && !e.used) { e.used = true; spinVel += e.n * 3.5 * (e.dir || 1); }
      spinVel *= Math.pow(0.25, dt); spinAngle += spinVel * dt;
      if (spinPlate) spinPlate.rotation.x = spinAngle;
      // plunger
      const pl = G.w.plunger;
      plungerTip.position.copy(P((pl.x0 + pl.x1) / 2, pl.y - pl.pull - 4, 14));
      plungerRod.position.copy(P((pl.x0 + pl.x1) / 2, pl.y - pl.pull - 28, 14));
      // steam: rises from the springs, puffs on bumper hits
      const puffs = fx.filter((e) => e.k === 'steam' && t - e.t < 0.05).map((e) => e.i);
      for (let i = 0; i < steamN; i++) {
        sLife[i] += dt * (0.35 + (i % 7) * 0.04);
        let src = steamSources[sSrc[i]];
        if (sLife[i] > 1) { sLife[i] = 0; sSrc[i] = (puffs.length && Math.random() < 0.6) ? puffs[0] : (i * 7 + Math.floor(t * 3)) % steamSources.length; src = steamSources[sSrc[i]]; }
        const a = sLife[i], seed = i * 12.9898;
        const x = src[0] + Math.sin(seed + t * 0.7) * 10 * a + (Math.sin(seed) * 8), y = src[1] + a * 30 + Math.cos(seed) * 8;
        sPos[i * 3] = x - ox; sPos[i * 3 + 1] = 25 + a * 55; sPos[i * 3 + 2] = oz - y;
      }
      sGeo.attributes.position.needsUpdate = true;
      steam.material.opacity = G.f && G.f.boilUntil > G.t ? 0.11 : 0.06;
      // slingshot plastics flash when they kick
      for (const side of ['L', 'R']) {
        const pl = window.__pbSlings && window.__pbSlings[side];
        if (!pl) continue;
        const hit = fx.find((e) => e.k === 'flash' && e.name === 'sling' + side && t - e.t < 0.2);
        pl.material.emissiveIntensity = 0.25 + (hit ? 2.2 * (1 - (t - hit.t) / 0.2) : 0);
        pl.position.y = hit ? -1.5 * (1 - (t - hit.t) / 0.2) : 0;
        for (const sb of slingBands) if (sb.side === side) { const k = hit ? Math.sin(Math.min(1, (t - hit.t) / 0.12) * Math.PI) : 0; sb.mesh.position.set(sb.base.x + sb.n[0] * 4 * k, sb.base.y, sb.base.z - sb.n[1] * 4 * k); }
      }
      // mood lighting per mode and multiball (lerped, never strobing)
      const mood = G.mb ? { valley: ['#b48cff', 0.35], soak: ['#5fe8d0', 0.55], arlington: ['#ffc860', 0.55] }[G.mb.kind]
        : G.mode ? { soak: ['#8fe6d6', 0.75], derby: ['#ffc070', 0.75], raid: ['#ff8a8a', 0.65], tower: ['#9cc8ff', 0.75], tub: ['#7fe0e8', 0.75], coaster: ['#ff9ad6', 0.75] }[G.mode.id] : null;
      const moodKey = mood ? mood.join() : 'none';
      if (moodKey !== moodState.key) { moodState.key = moodKey; moodState.t0 = G.mb ? G.mb.t0 : G.mode ? G.mode.t0 - 2.2 : G.t; moodState.fromC = hemi.color.clone(); moodState.fromK = key.intensity; moodState.fromH = hemi.intensity; }
      const mk = Math.min(1, Math.max(0, (G.t - moodState.t0) / 0.6));
      hemi.color.copy(moodState.fromC).lerp(tmpC.set(mood ? mood[0] : '#9fb4ff'), mk);
      key.intensity = moodState.fromK + (1.35 * (mood ? mood[1] : 1) - moodState.fromK) * mk;
      hemi.intensity = moodState.fromH + ((tierName === 'low' ? 0.85 : 0.42) * (mood ? mood[1] : 1) - moodState.fromH) * mk;
      const moodScale = moodState.fromK / 1.35 + ((mood ? mood[1] : 1) - moodState.fromK / 1.35) * mk;
      const pulse = !o.reduced && o.effects.some((e) => e.k === 'flash' && /^bumper/.test(e.name || '') && t - e.t < 0.06) ? 1.25 : 1;
      for (const l of giLights) l.intensity = l.userData.base * moodScale * pulse;
      scene.environmentIntensity = 0.32 * moodScale;   // the room reflections dim with the lights
      // camera shake (nudge, tilt, a small kick on bumper hits); none with reduced motion
      // follow camera: track the lowest ball (the one the player must deal with), eased
      if (follow && camMode === 'full' && interp.balls.length) {
        const low = interp.balls.reduce((a, b) => (b.y < a.y ? b : a));
        const want = Math.max(follow.yMin, Math.min(follow.yMax, low.y - 90));   // keep the flippers in view while the ball is low
        follow.y += (want - follow.y) * Math.min(1, dt * 4);
        placeFollow(follow.y);
      }
      const base = camera.userData.base;
      if (base) {
        camera.position.copy(base);
        const kick = fx.filter((e) => e.k === 'flash' && /^bumper/.test(e.name || '') && t - e.t < 0.08).pop();
        if (kick && !o.reduced) { const k = 1 - (t - kick.t) / 0.08; camera.position.y -= 1.2 * k; }
        const sh = fx.filter((e) => (e.k === 'shake' || e.k === 'tilt') && t - e.t < 0.25).pop();
        if (sh && !o.reduced) { const k = 1 - (t - sh.t) / 0.25; camera.position.x += Math.sin(t * 90) * 4 * k * (sh.dir === 'nudgeL' ? -1 : 1); camera.position.z -= 3 * k; }
      }
      // refresh the ball's reflection map (hide balls first so they don't reflect themselves)
      cubeAge++;
      if (cubeAge > (Q.cube || (cubeDone ? 1e9 : 0))) {
        cubeDone = true;
        cubeAge = 0;
        for (const B of ballPool) B.m.visible = false;
        steam.visible = false;
        cubeCam.update(renderer, scene);
        steam.visible = true;
        interp.balls.forEach((b, i) => { ballPool[i].m.visible = true; });
      }
      if (composer) composer.render(); else renderer.render(scene, camera);
    },
  };
  return view;
}

function densify(pts, step) {
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / step));
    for (let k = 0; k < n; k++) { const t = k / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function shapeOf(THREE, kind, r) {
  const s = new THREE.Shape();
  if (kind === 'arrow') { s.moveTo(r, 0); s.lineTo(-r * 0.6, r * 0.65); s.lineTo(-r * 0.25, 0); s.lineTo(-r * 0.6, -r * 0.65); s.closePath(); }
  else if (kind === 'rect') { s.moveTo(-r, -r * 0.45); s.lineTo(r, -r * 0.45); s.lineTo(r, r * 0.45); s.lineTo(-r, r * 0.45); s.closePath(); }
  else if (kind === 'triangle') { s.moveTo(0, r); s.lineTo(r * 0.9, -r * 0.7); s.lineTo(-r * 0.9, -r * 0.7); s.closePath(); }
  else if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; i ? s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } s.closePath(); }
  else s.absarc(0, 0, r, 0, Math.PI * 2, false);
  return s;
}

function softTexture(THREE) {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c); return t;
}

// code-drawn decals: bumper caps (spring motif), the Vapors sign panel, the spinner plate
function makeDecals(THREE) {
  const tex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const cap = tex(256, 256, (g, w) => {
    const r = w / 2;
    const gr = g.createRadialGradient(r, r, 10, r, r, r); gr.addColorStop(0, '#2fbfae'); gr.addColorStop(0.7, '#1f7f78'); gr.addColorStop(1, '#0f3f44');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
    g.strokeStyle = '#ffd877'; g.lineWidth = 8; g.beginPath(); g.arc(r, r, r - 10, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 3; g.beginPath(); g.arc(r, r, r - 26, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 7; g.lineCap = 'round';
    for (const dx of [-30, 0, 30]) { g.beginPath(); for (let y = 0; y <= 80; y += 4) g.lineTo(r + dx + Math.sin(y / 11 + dx) * 9, r + 40 - y); g.stroke(); }
    g.save(); g.translate(0, w); g.scale(1, -1);   // the cap top's UVs run upside down in V
    g.fillStyle = '#ffd877'; g.font = '900 34px "Arial Black", "Segoe UI", sans-serif'; g.textAlign = 'center'; g.fillText('143°F', r, r + 80);
    g.restore();
  });
  // the Vapors marquee: a wide horizontal panel facing the player
  const sign = tex(512, 150, (g, w, h) => {
    g.fillStyle = '#1a0f22'; g.fillRect(0, 0, w, h);
    g.translate(0, h); g.scale(1, -1);   // the marquee's UVs run bottom-up
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = '#ff5f7a'; g.shadowBlur = 14; g.fillStyle = '#ffd0d8'; g.font = 'italic bold 46px "Brush Script MT", "Segoe Script", cursive';
    g.fillText('The', w * 0.17, h * 0.5);
    g.shadowColor = '#3fffe8'; g.fillStyle = '#d8fffa'; g.font = 'bold 96px Futura, "Century Gothic", "Trebuchet MS", sans-serif';
    g.fillText('VAPORS', w * 0.6, h * 0.54);
  });
  const spinner = tex(256, 96, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#1d3550'); gr.addColorStop(0.5, '#2f5878'); gr.addColorStop(1, '#1d3550');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // a spinning flag shows both faces, so it carries a symmetric motif rather than words: racing-silk diamonds
    g.fillStyle = '#c9a050'; for (let i = 0; i < 7; i++) { const x = 18 + i * 37; g.beginPath(); g.moveTo(x, h / 2); g.lineTo(x + 16, 10); g.lineTo(x + 32, h / 2); g.lineTo(x + 16, h - 10); g.closePath(); g.fill(); }
    g.fillStyle = '#d4af37'; g.fillRect(0, 0, w, 6); g.fillRect(0, h - 6, w, 6);
  });
  const flipper = tex(256, 64, (g, w, h) => {
    g.fillStyle = '#ece6da'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#c9a050'; g.lineWidth = 4; g.strokeRect(10, 8, w - 20, h - 16);
    g.fillStyle = '#a9432c'; g.font = '900 26px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('SPA CITY', w / 2, h / 2 + 1);
  });
  const slingArt = (base, accent) => tex(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, base); gr.addColorStop(1, accent); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,236,190,0.85)'; g.lineWidth = 3;
    for (let r = 30; r < 360; r += 26) { g.beginPath(); g.arc(w * 0.5, h * 1.05, r, Math.PI, 2 * Math.PI); g.stroke(); }   // deco sunrise
    g.lineWidth = 6; g.strokeStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 3; i++) { g.beginPath(); for (let y = 0; y <= 70; y += 4) g.lineTo(w * (0.38 + i * 0.12) + Math.sin(y / 9 + i) * 6, h * 0.62 - y); g.stroke(); }   // steam wisps
    g.strokeStyle = '#d4af37'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
  });
  const sling = { L: slingArt('#ff7a5c', '#a02a1a'), R: slingArt('#3fbfb5', '#1a5f66') };
  return { cap, sign, spinner, flipper, sling };
}

// Sweeps flip timing for a ball fed down each inlane (and dropped from a cradle) and plots where every shot goes,
// so features can be placed where shots really land and every major shot is proven makeable.
//   node tools/shot-map.mjs [--feed inlane|cradle|drop] [--side L|R] [--out tools/out/shots.png] [--json]
//   node tools/shot-map.mjs --aim     prints the bat positions that make each shot (the table the autoplay bot aims with, sim/bot.js)
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createWorld, addBall, step, setFlipper, queueInput, TICK } from '../src/js/sim/physics.js';
import { tableSvg, svgToPng } from './lib/draw.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const T = compileTable(spec);
const feed = arg('feed', 'inlane'), sides = arg('side', 'L,R').split(',');
const CX = 242.5, mx = (x) => 2 * CX - x;

export function shoot(side, feedKind, flipAt, { secs = 1.6, hold = 0.25 } = {}) {
  const w = createWorld(T);
  const L = side === 'L';
  let b;
  if (feedKind === 'inlane') b = addBall(w, L ? 74 : mx(74), 300, 0, -250);
  else if (feedKind === 'drop') b = addBall(w, L ? 205 : mx(205), 330, 0, 0);      // a ball falling onto the flipper
  else { // cradle: settle the ball on the raised flipper first
    setFlipper(w, side, true);
    b = addBall(w, L ? 74 : mx(74), 300, 0, -250);
    for (let i = 0; i < 180; i++) step(w);
    setFlipper(w, side, false);
  }
  const pts = [];
  const t0 = w.time;
  queueInput(w, t0 + flipAt, (q) => setFlipper(q, side, true));
  queueInput(w, t0 + flipAt + hold, (q) => setFlipper(q, side, false));
  let result = 'none', apex = 0; const hits = [];
  for (let i = 0; i < secs / TICK; i++) {
    step(w);
    pts.push([b.x, b.y]);
    apex = Math.max(apex, b.y);
    for (const e of w.events) { if (e.t === 'drain') result = 'drain'; if (e.sw >= 0 && e.sw !== undefined && !/^(sling|in|out)/.test(T.swName[e.sw]) && hits.length < 4 && hits[hits.length - 1] !== T.swName[e.sw]) hits.push(T.swName[e.sw]); }
    w.events.length = 0;
    if (b.held) break;
  }
  // first crossing of y = 450 tells the shot's line
  let cross = null;
  for (let i = 1; i < pts.length; i++) if (pts[i - 1][1] < 450 && pts[i][1] >= 450) { cross = pts[i][0]; break; }
  return { pts, cross, apex, result, hits };
}

// Where along the bat a slow ball must be when the flipper is pressed to send it at each shot. The ball starts at rest
// at the pivot end of the resting bat, rolls down it, and the flipper goes up the moment it passes `trig` (0 pivot, 1 tip).
// Returns what it hit first, ranked: the Vapors, the lock, the ramp, an orbit, then a bathhouse.
const SHOTS = [['vapors', /^vapors$/], ['lock', /^lock$/], ['ramp', /^rampMade$/], ['orbit', /^orbitTop$/], ['reserve', /^reserve$/], ['bh', /^bh/]];
export function rollShot(side, trig, mode = 'roll') {
  // drop: the ball falls onto the bat from 80 mm above, at position `trig` along it, and the flipper goes up as it arrives
  // cradle: the ball is held on the raised bat, let go, rolls down it and the flipper goes up at `trig`
  const drop = mode === 'drop';
  const w = createWorld(T);
  const f = w.flippers.find((q) => q.side === side);
  const ca = Math.cos(f.rest), sa = Math.sin(f.rest);
  const a0 = (drop ? trig : 0.02) * f.len, h0 = drop ? 80 : 16;
  let b;
  if (mode === 'cradle') {
    setFlipper(w, side, true);
    b = addBall(w, side === 'L' ? 74 : mx(74), 300, 0, -250);
    for (let i = 0; i < 180; i++) step(w);
    setFlipper(w, side, false);
  } else b = addBall(w, f.x + ca * a0 - sa * h0 * f.dir, f.y + sa * a0 + ca * h0 * f.dir, 0, 0);
  let flipped = false, release = 0; const hits = [];
  for (let i = 0; i < 2.2 / TICK && !b.held; i++) {
    const dx = b.x - f.x, dy = b.y - f.y;
    const along = (dx * ca + dy * sa) / f.len, across = (-dx * sa + dy * ca) * f.dir, vAcross = (-b.vx * sa + b.vy * ca) * f.dir;
    const go = drop ? (vAcross < -1 ? (across - 15) / -vAcross : 9) <= 0.035 : along >= trig;
    if (!flipped && go) { setFlipper(w, side, true); flipped = true; release = w.time + 0.25; }
    if (flipped && w.time >= release) setFlipper(w, side, false);
    step(w);
    for (const e of w.events) if (e.sw !== undefined && e.sw >= 0) hits.push(T.swName[e.sw]);
    w.events.length = 0;
  }
  for (const [key, re] of SHOTS) { const h = hits.find((n) => re.test(n)); if (h) return key === 'bh' ? h : key; }
  return null;
}
if (process.argv.includes('--aim')) {
  const out = {};
  for (const mode of ['roll', 'cradle', 'drop']) for (const side of sides) {
    const by = {}; let prev = null, run = [];
    const flush = () => { if (prev && run.length >= 2) (by[prev] ||= []).push([run[0], run[run.length - 1]]); };
    for (let t = 0.02; t <= 1.001; t += 0.01) { const k = rollShot(side, t, mode); if (k !== prev) { flush(); run = []; prev = k; } run.push(+t.toFixed(2)); }
    flush();
    (out[mode] ||= {})[side] = Object.fromEntries(Object.entries(by).map(([k, runs]) => [k, runs.sort((a, b) => (b[1] - b[0]) - (a[1] - a[0]))[0]]));
  }
  console.log(JSON.stringify(out));
  process.exit(0);
}

const paths = [], rows = [];
for (const side of sides) {
  for (let ft = +arg("t0", 0.4); ft <= +arg("t1", 0.9); ft += +arg("dt", 0.02)) {
    const r = shoot(side, feed, ft);
    rows.push({ side, flipAt: +ft.toFixed(3), cross: r.cross && +r.cross.toFixed(0), apex: +r.apex.toFixed(0), result: r.result, hits: r.hits.join('>') });
    if (r.cross != null) paths.push({ pts: r.pts.filter((_, i) => i % 2 === 0), label: ft.toFixed(2), color: side === 'L' ? undefined : undefined });
  }
}
if (process.argv.includes('--json')) console.log(JSON.stringify(rows));
else for (const r of rows) if (r.cross != null) console.log(r.side, r.flipAt, 'x450=' + r.cross, r.hits || '-');
const first = {}; for (const r of rows) { const h = (r.hits || '').split('>')[0]; if (h) first[r.side + ':' + h] = (first[r.side + ':' + h] || 0) + 1; }
console.log('first-hit counts', JSON.stringify(first));
const out = arg('out', `tools/out/shots-${feed}.png`);
await svgToPng([tableSvg(T, { paths })], [out]);
console.log(out);

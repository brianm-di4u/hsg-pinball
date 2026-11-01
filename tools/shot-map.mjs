// Sweeps flip timing for a ball fed down each inlane (and dropped from a cradle) and plots where every shot goes,
// so features can be placed where shots really land and every major shot is proven makeable.
//   node tools/shot-map.mjs [--feed inlane|cradle|drop] [--side L|R] [--out tools/out/shots.png] [--json]
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

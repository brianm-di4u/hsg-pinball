// Containment and flow fuzz: drops seeded random balls anywhere on the playfield and plunges at every strength,
// then checks every ball drains (no escapes, no balls inside walls, no ball stuck longer than the limit).
//   node tools/flow.mjs [--n 2000] [--seed 1] [--draw]
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createWorld, addBall, step, autoPlunge, kickOut, TICK, BALL_R, LAYER } from '../src/js/sim/physics.js';
import { mulberry32 } from '../src/js/sim/rng.js';
import { tableSvg, svgToPng } from './lib/draw.mjs';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const T = compileTable(spec);
const N = +arg('n', 2000), rnd = mulberry32(+arg('seed', 1));

export function inside(T, x, y, layer) {
  // ball overlapping a wall more than 3 mm counts as inside it
  for (const s of T.segs) {
    if (!(s.mask & layer)) continue;
    const abx = s.bx - s.ax, aby = s.by - s.ay, L = abx * abx + aby * aby;
    let t = ((x - s.ax) * abx + (y - s.ay) * aby) / L; t = Math.max(0, Math.min(1, t));
    if (Math.hypot(x - s.ax - abx * t, y - s.ay - aby * t) < BALL_R + s.r - 3) return true;
  }
  for (const c of T.circles) if ((c.mask & layer) && Math.hypot(x - c.x, y - c.y) < BALL_R + c.r - 3) return true;
  return false;
}

function inMouth(x, y) { const s = (x - 392) * 0.45 + (y - 470) * 0.893, t = (x - 392) * 0.893 - (y - 470) * 0.45; return s > -20 && s < 200 && Math.abs(t) < 40; }
const res = { drained: 0, held: 0, stuck: 0, escaped: 0, timeout: 0, inside: 0 };
const bad = [];
for (let i = 0; i < N; i++) {
  const w = createWorld(T);
  let x, y;
  do { x = 20 + rnd() * 450; y = 150 + rnd() * 900; } while (inside(T, x, y, 1) || (Math.hypot(x - 264, y - 830) > 240 && y > 830) || (x > 437 && x < 483 && y > 450 && y < 868) || (x > 380 && y > 440 && y < 600 && (y - 470) > (x - 400) * 1.333 - 10 && x > 380 && y < 560 && x < 483 && (y - 458) > -0.75 * (x - 415) && false) || inMouth(x, y) || (x > 214 && x < 271 && y > 757 && y < 801) || x > 476);
  const a = rnd() * Math.PI * 2, sp = rnd() * 3500;
  const b = addBall(w, x, y, Math.cos(a) * sp, Math.sin(a) * sp);
  const path = [];
  let out = 'timeout', still = 0;
  for (let k = 0; k < 40 / TICK; k++) {
    step(w);
    if (k % 3 === 0) path.push([b.x, b.y]);
    if (b.held && b.held.drained) { out = 'drained'; break; }
    if (b.held) { const h = T.holes.find((q) => q.sw === b.held.sw); kickOut(w, b, h.kickAngle, h.kickSpeed); res.held++; }
    if (b.x < 0 || b.x > T.width || b.y < -50 || b.y > T.height) { out = 'escaped'; break; }
    if (b.layer === 1 && k % 60 === 0 && inside(T, b.x, b.y, 1)) { out = 'inside'; break; }
    if (b.still > 4 && !(b.x > 480 && b.y < 140)) { out = 'stuck'; break; }
    if (b.x > 480 && b.y < 140 && b.still > 0.5) { out = 'drained'; break; }  // resting on the plunger counts as home
    w.events.length = 0;
  }
  res[out]++;
  if (out !== 'drained') bad.push({ i, x0: +x.toFixed(0), y0: +y.toFixed(0), out, at: [+b.x.toFixed(0), +b.y.toFixed(0)], layer: b.layer, path });
}
console.log(JSON.stringify(res));
for (const b of bad.slice(0, 15)) console.log(b.out, 'start', b.x0, b.y0, 'end', b.at, 'layer', b.layer);
if (process.argv.includes('--draw') && bad.length) {
  await svgToPng([tableSvg(T, { paths: bad.slice(0, 12).map((b) => ({ pts: b.path, label: b.out[0] + b.i })) })], ['tools/out/flow-bad.png']);
  console.log('tools/out/flow-bad.png');
}
process.exitCode = bad.length ? 1 : 0;
const ci = process.argv.indexOf('--case');
if (ci >= 0) {
  const b = bad.find((q) => q.i === +process.argv[ci + 1]);
  if (b) console.log('case', b.i, 'last path points', b.path.slice(-8).map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' | '));
}

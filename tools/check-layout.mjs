// Layout check: every playfield label's box must stay clear of inserts (lamps), playfield walls, posts and holes.
//   node tools/check-layout.mjs        (exit 1 on any overlap)
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { buildLamps } from '../src/js/sim/lamps.js';
import { FEATURE_LABELS, labelBox } from '../src/js/sim/labels.js';
const T = compileTable(spec), L = buildLamps();
const local = (b, x, y) => { const dx = x - b.x, dy = y - b.y, c = Math.cos(b.angle), s = Math.sin(b.angle); return [dx * c + dy * s, -dx * s + dy * c]; };
const hitCircle = (b, x, y, r) => { const [u, v] = local(b, x, y); const cu = Math.max(-b.hw, Math.min(b.hw, u)), cv = Math.max(-b.hh, Math.min(b.hh, v)); return Math.hypot(u - cu, v - cv) < r; };
const problems = [];
for (const lab of FEATURE_LABELS) {
  const b = labelBox(lab);
  for (const l of L) if (hitCircle(b, l.x, l.y, l.size * 0.85)) problems.push(`${lab[0]} ↔ insert ${l.name}`);
  for (const s of T.segs) {
    if (!(s.mask & 1) || s.vis === 'none') continue;
    const n = Math.max(2, Math.ceil(Math.hypot(s.bx - s.ax, s.by - s.ay) / 3));
    for (let i = 0; i <= n; i++) { const t = i / n; if (hitCircle(b, s.ax + (s.bx - s.ax) * t, s.ay + (s.by - s.ay) * t, s.r + 1)) { problems.push(`${lab[0]} ↔ wall ${s.name || s.kind}`); break; } }
  }
  for (const c of T.circles) if ((c.mask & 1) && hitCircle(b, c.x, c.y, c.r + 1)) problems.push(`${lab[0]} ↔ post ${c.name || ''}`);
  for (const h of T.holes) if (hitCircle(b, h.x, h.y, h.r + 3)) problems.push(`${lab[0]} ↔ hole ${h.name}`);
}
const uniq = [...new Set(problems)];
if (uniq.length) { console.log(uniq.join('\n')); process.exitCode = 1; } else console.log(`check-layout: ${FEATURE_LABELS.length} labels clear of inserts, walls, posts and holes`);

// Layout check: every playfield label's box must stay clear of inserts (lamps), playfield walls, posts and holes.
//   node tools/check-layout.mjs        (exit 1 on any overlap)
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { buildLamps } from '../src/js/sim/lamps.js';
import { allLabels, labelBox, labelScale } from '../src/js/sim/labels.js';
const T = compileTable(spec), L = buildLamps();
const local = (b, x, y) => { const dx = x - b.x, dy = y - b.y, c = Math.cos(b.angle), s = Math.sin(b.angle); return [dx * c + dy * s, -dx * s + dy * c]; };
const hitCircle = (b, x, y, r) => { const [u, v] = local(b, x, y); const cu = Math.max(-b.hw, Math.min(b.hw, u)), cv = Math.max(-b.hh, Math.min(b.hh, v)); return Math.hypot(u - cu, v - cv) < r; };
const corners = (b) => { const c = Math.cos(b.angle), s = Math.sin(b.angle); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, d]) => [b.x + a * b.hw * c - d * b.hh * s, b.y + a * b.hw * s + d * b.hh * c]); };
const overlap = (A, B) => { for (const P of [A, B]) { const pc = corners(P); for (let i = 0; i < 4; i++) { const n = [-(pc[(i + 1) % 4][1] - pc[i][1]), pc[(i + 1) % 4][0] - pc[i][0]]; const proj = (q) => corners(q).map((p) => p[0] * n[0] + p[1] * n[1]); const a = proj(A), b = proj(B); if (Math.max(...a) < Math.min(...b) || Math.max(...b) < Math.min(...a)) return false; } } return true; };
const problems = [];
// every label at its printed size and at the most it grows on a small screen (S4-11): its own cap
// on the smallest screen the game supports (320 px wide: about 0.55 CSS px per mm) each label grows by labelScale, up to its cap
const LABELS = allLabels(L);
const grownBoxes = LABELS.map((lab) => labelBox(lab, labelScale(0.55, lab.size, lab.cap)));
LABELS.forEach((lab, i) => grownBoxes.forEach((o, j) => { if (j > i && overlap(grownBoxes[i], o)) problems.push(`${lab.text} (grown) overlaps label ${LABELS[j].text}`); }));
for (const lab of LABELS) for (const grown of [false, true]) {
  const b = labelBox(lab, grown ? labelScale(0.55, lab.size, lab.cap) : 1);
  for (const l of L) if (hitCircle(b, l.x, l.y, l.size * 0.85)) problems.push(`${lab.text}${grown ? " (grown)" : ""} ↔ insert ${l.name}`);
  for (const s of T.segs) {
    if (!(s.mask & 1) || s.vis === 'none') continue;
    const n = Math.max(2, Math.ceil(Math.hypot(s.bx - s.ax, s.by - s.ay) / 3));
    for (let i = 0; i <= n; i++) { const t = i / n; if (hitCircle(b, s.ax + (s.bx - s.ax) * t, s.ay + (s.by - s.ay) * t, s.r + 1)) { problems.push(`${lab.text}${grown ? " (grown)" : ""} ↔ wall ${s.name || s.kind}`); break; } }
  }
  for (const c of T.circles) if ((c.mask & 1) && hitCircle(b, c.x, c.y, c.r + 1)) problems.push(`${lab.text}${grown ? " (grown)" : ""} ↔ post ${c.name || ''}`);
  for (const h of T.holes) if (hitCircle(b, h.x, h.y, h.r + 3)) problems.push(`${lab.text}${grown ? " (grown)" : ""} ↔ hole ${h.name}`);
}
const uniq = [...new Set(problems)];
if (uniq.length) { console.log(uniq.join('\n')); process.exitCode = 1; } else console.log(`check-layout: ${LABELS.length} labels, at printed size and fully grown, clear of inserts, walls, posts and holes`);

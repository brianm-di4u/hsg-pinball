// The playfield's fixed lettering: text, position (table mm), size, angle and style. Shared by the playfield painter
// (gfx/playfield.js) and tools/check-layout.mjs, which fails when a label's box hits an insert, a wall or a toy.
import { CX, VAP, BATHHOUSES } from './table-spa-city.js';
import { MODES } from './rules.js';

// Lettering size for the screen (S4-11). The printed sizes below are in table mm; on a phone the whole table is about 0.7 CSS
// pixels per mm, so a 6.5 mm label is 5 px tall. A label is enlarged so its type is at least LABEL_MIN_PX CSS pixels tall,
// but never past a cap, because the room round it is fixed. Reverse the change by setting LABEL_MIN_PX to 0.
export const LABEL_MIN_PX = 9;         // the smallest type height on screen, in CSS pixels
export const LABEL_MAX_SCALE = 1.7;    // the most any label may grow, whatever its room
export const BATH_MAX_SCALE = 1.2;     // the bathhouse names: eight plates in a bank that is already full of inserts and walls
export const MODE_MAX_SCALE = 1.05;    // the six mode names under their inserts
export const BATH_ROW_GAP = 10;        // mm between the two rows of bathhouse names
// How far each feature label may grow before its box meets an insert, a wall, a toy or another label: measured with
// tools/check-layout.mjs, which fails if any of these is too big. A label with no entry may grow to LABEL_MAX_SCALE.
export const LABEL_CAPS = { 'SPA CITY': 1, 'MOUNTAIN TOWER': 1.3, 'THE VAPORS': 1, 'THE ARLINGTON': 1.25, 'EXTRA BALL': 1.15, 'VALLEY OF THE VAPORS': 1.05, 'SHOOT AGAIN': 1.7, '2X': 1.3, '3X': 1.3, '4X': 1.3, '5X': 1.3 };
/** The factor for a label printed at `size` mm where the table shows cssPerMm CSS pixels per mm. */
export const labelScale = (cssPerMm, size, cap = LABEL_MAX_SCALE) => (cssPerMm > 0 ? Math.min(cap, Math.max(1, LABEL_MIN_PX / (size * cssPerMm))) : 1);

export const FEATURE_LABELS = [
  // [text, x, y, size, colour, angle, weight, plate, font]
  ['SPA CITY', CX + 14, 528, 27, '#ffd877', 0, 900, false, 'serif'],
  ['CENTRAL AVENUE', 40, 772, 7.5, '#9fdcff', Math.PI / 2, 700, true],
  ['RESERVE ST', 424, 735, 7, '#8ff0dc', Math.PI / 2, 700, false],
  ['MOUNTAIN TOWER', 318, 318, 8.5, '#ffd877', Math.atan2(0.893, 0.45), 800, true],
  ['THE VAPORS', 190, 606, 7, '#ff9a7e', -1.33, 800, true],
  ['LOCK', CX, 610, 8, '#ff7e70', 0, 700, false],
  ['THE ARLINGTON', CX, 678, 6.5, '#ffb0a8', 0, 700, false],
  ['SHOOT AGAIN', CX, 157, 8, '#ffb0a6', 0, 800, true],
  ['EXTRA BALL', VAP.x + 30, VAP.y - 140, 6.5, '#c8ffc0', 0, 800, true],
  ['THERMAL SPRINGS', 76, 735, 6.5, '#ffb08a', Math.PI / 2, 700, false],
  ['VALLEY OF THE VAPORS', CX, 448, 6.5, '#ffffff', 0, 700, false],
];

/**
 * Every label on the playfield as one list of {text, x, y, size, color, angle, weight, spacing, plate, maxW, cap, serif, grow}:
 * the feature labels above, the S P A lane letters, the bathhouse names (south of their targets, on two rows so the larger
 * lettering of neighbours does not run together) and the mode and bonus-multiplier names beside their inserts.
 * `grow` (a unit vector, or none) is the way a label moves its centre as it is enlarged, so that the edge nearest its insert stays put.
 * `lamps` is the insert list (sim/lamps.js).
 */
export function allLabels(lamps) {
  const out = FEATURE_LABELS.map(([text, x, y, size, color, angle, weight, plate, font]) => ({ text, x, y, size, color, angle, weight, plate: !!plate, spacing: text === 'SPA CITY' ? 0.08 : 0.12, maxW: 0, cap: LABEL_CAPS[text] || LABEL_MAX_SCALE, serif: font === 'serif' }));
  ['S', 'P', 'A'].forEach((text, i) => out.push({ text, x: 356 + i * 40, y: 908, size: 11, color: '#ffd877', angle: 0, weight: 700, plate: false, spacing: 0.12, maxW: 0, cap: 1.3 }));
  const banks = [[[117, 650], [203, 694], 0], [[2 * CX - 203, 694], [2 * CX - 117, 650], 4]];
  for (const [a, b, off] of banks) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
    const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (let i = 0; i < 4; i++) {
      const t = (i + 0.5) / 4;
      const shift = off + i === 0 ? 0.1 : 0, o = (off + i === 0 ? 32 : 30) + (i % 2 ? BATH_ROW_GAP : 0);   // Superior sits clear of the Vapors marquee
      out.push({ text: BATHHOUSES[off + i].toUpperCase(), x: a[0] + (b[0] - a[0]) * (t + shift) + nx * o, y: a[1] + (b[1] - a[1]) * (t + shift) + ny * o, size: 4.6, color: '#f4ecd8', angle, weight: 800, plate: true, spacing: 0, maxW: 22.5, cap: BATH_MAX_SCALE, grow: [nx, ny] });
    }
  }
  MODES.forEach((m, k) => { const l = lamps.find((q) => q.name === 'mode' + k); if (l) out.push({ text: m.short, x: l.x, y: l.y - 18, size: 8.6, color: '#ecd8ff', angle: 0, weight: 800, plate: true, spacing: 0.02, maxW: 34, cap: MODE_MAX_SCALE, grow: [0, -1] }); });
  for (const l of lamps) if (l.label && l.group === 'bonusx') out.push({ text: l.label, x: l.x, y: l.y - 15, size: 8, color: '#ffd877', angle: 0, weight: 800, plate: true, spacing: 0.04, maxW: 0, cap: LABEL_CAPS[l.label] || LABEL_MAX_SCALE, grow: [0, -1] });
  return out;
}

/** Where a label's centre is once it is enlarged by `scale`: it grows away from `grow`'s opposite side (see allLabels). */
export function grownCentre(l, scale) {
  if (!l.grow || scale <= 1) return [l.x, l.y];
  const dh = ((l.plate ? 1.5 : 1.1) * l.size * (scale - 1)) / 2;
  return [l.x + l.grow[0] * dh, l.y + l.grow[1] * dh];
}

/** Approximate rotated box of a label (for layout checks), at `scale` times its printed size: centre, half extents along and across, angle. */
export function labelBox(lab, scale = 1) {
  const l = Array.isArray(lab) ? { text: lab[0], x: lab[1], y: lab[2], size: lab[3], angle: lab[5], plate: !!lab[7], maxW: 0 } : lab;
  let size = l.size * scale, w = l.text.length * size * 0.66 + (l.plate ? size * 0.9 : 0);
  if (l.maxW && w > l.maxW * scale) { size *= (l.maxW * scale) / w; w = l.maxW * scale; }   // the painter shrinks the type to fit the slot
  const [x, y] = grownCentre(l, scale);
  return { x, y, hw: w / 2, hh: size * (l.plate ? 1.5 : 1.1) / 2, angle: l.angle };
}

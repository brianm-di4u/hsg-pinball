// The playfield's fixed lettering: text, position (table mm), size, angle and style. Shared by the playfield painter
// (gfx/playfield.js) and tools/check-layout.mjs, which fails when a label's box hits an insert, a wall or a toy.
import { CX, VAP } from './table-spa-city.js';

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

/** Approximate rotated box of a label (for layout checks): centre, half extents along and across, angle. */
export function labelBox([text, x, y, size, , angle, , plate]) {
  const w = text.length * size * 0.66 + (plate ? size * 0.9 : 0), h = size * (plate ? 1.5 : 1.1);
  return { x, y, hw: w / 2, hh: h / 2, angle };
}

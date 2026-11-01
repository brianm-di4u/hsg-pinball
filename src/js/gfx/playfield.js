// The playfield artwork, composed in code on a canvas aligned 1:1 with the physics table (mm → px): a deco-neon
// base, the painted Codex vignettes masked into their zones, gold pinstripes along the walls, unlit insert plastics,
// and all lettering. Returns the canvas (colour) plus a matching insert mask used for the lit glow.
import { shape } from './view2d.js';
import { CX, BATHHOUSES, VAP } from '../sim/table-spa-city.js';
import { MODES } from '../sim/rules.js';

const FONT = '"Futura", "Century Gothic", "Avenir Next", "Trebuchet MS", system-ui, sans-serif';
const SERIF = '"Rockwell", "Bookman Old Style", Georgia, "Times New Roman", serif';

export function paintPlayfield(T, lamps, art, pxPerMm = 2) {
  const W = Math.round(T.width * pxPerMm), H = Math.round(T.height * pxPerMm);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const k = pxPerMm;
  const X = (x) => x * k, Y = (y) => (T.height - y) * k;
  // outline of the playable area (left wall, arch, shooter lane)
  const outline = () => { g.beginPath(); g.moveTo(X(10), Y(0)); g.lineTo(X(10), Y(830)); g.arc(X(264), Y(830), 254 * k, Math.PI, 0); g.lineTo(X(518), Y(0)); g.closePath(); };

  // 1. base: midnight to violet to warm brick, like the backglass sky over the Row
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#16213a'); bg.addColorStop(0.32, '#1d1838'); bg.addColorStop(0.62, '#2a1c33'); bg.addColorStop(1, '#3b2324');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  // 2. painted vignettes in their zones, feathered
  const zone = (img, x0, y0, x1, y1, alpha = 1, feather = 0.18) => {
    if (!img) return;
    const zx = X(x0), zy = Y(y1), zw = X(x1) - X(x0), zh = Y(y0) - Y(y1);
    const tmp = document.createElement('canvas'); tmp.width = Math.max(1, Math.round(zw)); tmp.height = Math.max(1, Math.round(zh));
    const t = tmp.getContext('2d');
    // cover-fit the image into the zone
    const s = Math.max(zw / img.width, zh / img.height);
    t.drawImage(img, (zw - img.width * s) / 2, (zh - img.height * s) / 2, img.width * s, img.height * s);
    t.globalCompositeOperation = 'destination-in';
    const m = t.createRadialGradient(zw / 2, zh / 2, Math.min(zw, zh) * (0.5 - feather), zw / 2, zh / 2, Math.max(zw, zh) * 0.62);
    m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
    t.fillStyle = m; t.fillRect(0, 0, zw, zh);
    g.save(); g.globalAlpha = alpha; g.drawImage(tmp, zx, zy); g.restore();
  };
  g.save(); outline(); g.clip();
  zone(art['pf-mountain'], 10, 740, 518, 1100, 0.9, 0.05);
  zone(art['pf-row'], 60, 560, 430, 770, 0.55, 0.1);
  zone(art['pf-promenade'], 10, 250, 480, 620, 0.75, 0.12);
  // readability: darken under the ball's busiest paths, keep the edges rich
  const dk = g.createLinearGradient(0, 0, 0, H);
  dk.addColorStop(0, 'rgba(10,8,20,0.30)'); dk.addColorStop(0.5, 'rgba(10,8,20,0.42)'); dk.addColorStop(1, 'rgba(10,8,20,0.55)');
  g.fillStyle = dk; g.fillRect(0, 0, W, H);
  // deco sunburst behind the mode arc
  g.save(); g.translate(X(CX), Y(330));
  for (let i = 0; i < 36; i++) { g.rotate(Math.PI / 36); g.fillStyle = i % 2 ? 'rgba(212,175,55,0.07)' : 'rgba(79,195,255,0.04)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-12 * k, -200 * k); g.lineTo(12 * k, -200 * k); g.fill(); }
  g.restore();
  g.restore();

  // 3. shooter lane and apron area: dark wood
  g.fillStyle = '#1a120c'; g.fillRect(X(479), Y(840), X(518) - X(479), Y(0) - Y(840));
  for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(90,60,30,${0.05 + (i % 3) * 0.03})`; g.fillRect(X(480 + i * 2.7), Y(840), 1.2 * k, Y(0) - Y(840)); }

  // 4. pinstripes along every playfield wall (gold), and a glow line round the outline
  g.strokeStyle = 'rgba(212,175,55,0.55)'; g.lineWidth = 1.2 * k; g.lineCap = 'round';
  for (const s of T.segs) {
    if (s.mask !== 1 || s.kind === 4 || s.kind === 3) continue;
    const L = Math.hypot(s.bx - s.ax, s.by - s.ay); if (L < 6) continue;
    const off = s.r + 5;
    for (const sgn of [1, -1]) {
      g.beginPath(); g.moveTo(X(s.ax + s.nx * off * sgn), Y(s.ay + s.ny * off * sgn)); g.lineTo(X(s.bx + s.nx * off * sgn), Y(s.by + s.ny * off * sgn)); g.stroke();
    }
  }
  g.save(); outline(); g.strokeStyle = 'rgba(79,195,255,0.35)'; g.lineWidth = 3 * k; g.stroke(); g.restore();

  // 5. lettering
  const label = (txt, x, y, size, color = '#f2e6c8', angle = 0, font = FONT, weight = 700, spacing = 0.12) => {
    g.save(); g.translate(X(x), Y(y)); g.rotate(-angle);
    g.font = `${weight} ${size * k}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    if ('letterSpacing' in g) g.letterSpacing = `${size * k * spacing}px`;
    g.lineWidth = size * k * 0.22; g.strokeStyle = 'rgba(8,6,14,0.85)'; g.strokeText(txt, 0, 0);
    g.fillStyle = color; g.fillText(txt, 0, 0);
    g.restore();
  };
  // centre logo
  label('SPA CITY', CX + 14, 522, 27, '#ffd877', 0, SERIF, 900, 0.08);
  label('BATHHOUSE ROW · HOT SPRINGS', CX + 14, 499, 7.5, '#e8d9b0', 0, FONT, 700, 0.18);
  // feature names
  label('CENTRAL AVENUE', 36, 690, 8, '#9fdcff', Math.PI / 2);
  label('RESERVE ST', 404, 735, 7, '#8ff0dc', Math.PI / 2);
  label('MOUNTAIN TOWER', 362, 395, 9, '#ffd877', Math.atan2(0.893, 0.45));
  label('THE VAPORS', 181, 554, 8, '#ff9a7e', -1.33);
  label('LOCK', CX, 610, 8, '#ff7e70');
  label('THE ARLINGTON', CX, 678, 6.5, '#ffb0a8');
  label('SHOOT AGAIN', CX, 160, 6.5, '#ff9a8e');
  label('EXTRA BALL', VAP.x + 30, VAP.y - 140, 5.5, '#a8f0a0', 0);
  label('THERMAL SPRINGS', 84, 760, 6.5, '#ffb08a', Math.PI / 2);
  ['S', 'P', 'A'].forEach((l, i) => label(l, 356 + i * 40, 908, 11, '#ffd877'));
  // bathhouse names on the bank, small, north to south
  const banks = [[[117, 650], [203, 694], 0], [[2 * CX - 203, 694], [2 * CX - 117, 650], 4]];
  for (const [a, b, off] of banks) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L; if (ny > 0) { nx = -nx; ny = -ny; }
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (let i = 0; i < 4; i++) {
      const t = (i + 0.5) / 4;
      label(BATHHOUSES[off + i].toUpperCase(), a[0] + (b[0] - a[0]) * t + nx * 32, a[1] + (b[1] - a[1]) * t + ny * 32, 4.2, '#f4ecd8', ang, FONT, 700, 0.05);
    }
  }
  MODES.forEach((m, i) => { const l = lamps.find((q) => q.name === 'mode' + i); if (l) label(m.short, l.x, l.y - 15, 5, '#e2c8ff'); });
  for (const l of lamps) if (l.label && l.group === 'bonusx') label(l.label, l.x, l.y - 13, 5.5, '#ffd877');
  label('VALLEY OF THE VAPORS', CX, 448, 6.5, '#ffffff');

  // 6. inserts: unlit plastic look (dark tinted with a light rim). The lit glow is a separate emissive layer.
  const mask = document.createElement('canvas'); mask.width = W; mask.height = H;
  const mg = mask.getContext('2d');
  for (const l of lamps) {
    for (const [ctx, fill, rim] of [[g, shade(l.color, 0.28), 'rgba(255,240,210,0.55)'], [mg, l.color, null]]) {
      ctx.save(); ctx.translate(X(l.x), Y(l.y)); ctx.rotate(-l.angle);
      ctx.fillStyle = fill; shape(ctx, l.shape, l.size * k);
      if (rim) { ctx.lineWidth = 0.9 * k; ctx.strokeStyle = rim; ctx.stroke(); }
      ctx.restore();
    }
  }
  return { canvas: cv, mask, W, H, k };
}

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255;
  return `rgb(${Math.round(r * f)},${Math.round(gg * f)},${Math.round(b * f)})`;
}

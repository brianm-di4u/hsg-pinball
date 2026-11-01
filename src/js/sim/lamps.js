// Playfield inserts (lamps): where each one sits, its shape and colour, and its brightness from the rules state.
// Shape carries meaning as well as colour (colourblind-safe): arrows = shots, circles = progress, stars = awards,
// rectangles = targets, triangles = multiplier. Pure function of the game state, so tests can read lamp states.
import { VAP, RAMP, CX, BATHHOUSES } from './table-spa-city.js';
import { MODES } from './rules.js';

const C = { gold: '#ffc94a', red: '#ff4a3d', blue: '#4fc3ff', teal: '#3fe0c5', coral: '#ff7a5c', white: '#fff4dc', green: '#7dde7a', violet: '#c48cff' };

function vapAxis() {
  const fx = 2 * CX - 147.5 - 30, fy = 110;
  let ux = fx - VAP.x, uy = fy - VAP.y; const L = Math.hypot(ux, uy); return [ux / L, uy / L];
}

export function buildLamps() {
  const L = [];
  const add = (name, x, y, shape, color, o = {}) => L.push({ name, x, y, shape, color: C[color] || color, size: o.size || 9, angle: o.angle || 0, group: o.group || name, label: o.label || '' });
  // shot arrows
  const [dx, dy] = RAMP.d;
  add('arrowRamp', RAMP.E0[0] - dx * 52, RAMP.E0[1] - dy * 52, 'arrow', 'gold', { angle: Math.atan2(dy, dx), size: 16 });
  add('arrowOrbit', 88, 512, 'arrow', 'blue', { angle: Math.atan2(0.85, -0.53), size: 16 });
  add('arrowReserve', 400, 700, 'arrow', 'teal', { angle: Math.atan2(1, 0.1), size: 13 });
  const [ux, uy] = vapAxis();
  add('arrowVapors', VAP.x + ux * 92, VAP.y + uy * 92, 'arrow', 'coral', { angle: Math.atan2(-uy, -ux), size: 16 });
  add('arrowLock', CX, 650, 'arrow', 'red', { angle: Math.PI / 2, size: 14 });
  // progress lamps beside the arrows
  for (let i = 0; i < 3; i++) add('tower' + i, RAMP.E0[0] - dx * (78 + i * 15) + 14, RAMP.E0[1] - dy * (78 + i * 15) - 6, 'circle', 'gold', { size: 5, group: 'tower' });
  for (let i = 0; i < 3; i++) add('lockLamp' + i, CX - 14 + i * 14, 628, 'circle', 'red', { size: 4.5, group: 'locks' });
  for (let i = 0; i < 3; i++) add('fifth' + i, 36, 612 + i * 18, 'circle', 'blue', { size: 4.5, group: 'fifth' });
  // bathhouse target inserts: just in front of each target face
  // (the bank geometry: left bank (117,650)→(203,694), right (282,694)→(368,650))
  const banks = [[[117, 650], [203, 694], 0], [[2 * CX - 203, 694], [2 * CX - 117, 650], 4]];
  for (const [a, b, off] of banks) {
    const Lb = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let nx = -(b[1] - a[1]) / Lb, ny = (b[0] - a[0]) / Lb; if (ny > 0) { nx = -nx; ny = -ny; }
    for (let i = 0; i < 4; i++) {
      const t = (i + 0.5) / 4;
      add('bh' + BATHHOUSES[off + i], a[0] + (b[0] - a[0]) * t + nx * 20, a[1] + (b[1] - a[1]) * t + ny * 20, 'rect', '#ffcf8a', { size: 7, angle: Math.atan2(b[1] - a[1], b[0] - a[0]), group: 'row' });
    }
  }
  // S·P·A lane lamps
  [['laneS', 356], ['laneP', 396], ['laneA', 436]].forEach(([n, x]) => add(n, x, 935, 'circle', 'gold', { size: 7, group: 'spa' }));
  // bonus multiplier (triangles) and shoot again
  ['2', '3', '4', '5'].forEach((k, i) => add('bonus' + k + 'x', CX - 45 + i * 30, 262, 'triangle', 'gold', { size: 8, group: 'bonusx', label: k + 'X' }));
  add('shootAgain', CX, 178, 'star', 'red', { size: 11 });
  // mode lamps: an arc in the middle of the field
  MODES.forEach((m, i) => { const a = Math.PI * (0.16 + 0.68 * (i / 5)); add('mode' + i, CX - Math.cos(a) * 92, 380 + Math.sin(a) * 52, 'circle', 'violet', { size: 9, group: 'modes', label: m.short }); });
  add('wizard', CX, 470, 'star', 'white', { size: 17 });
  add('extraBall', VAP.x + ux * 126 + 10, VAP.y + uy * 126, 'star', 'green', { size: 8 });
  add('grandSoak', VAP.x + ux * 122 - 16, VAP.y + uy * 122 + 4, 'circle', 'teal', { size: 6 });
  // spring temperature: 5 segments rising beside the bumpers
  for (let i = 0; i < 5; i++) add('temp' + i, 92, 790 + i * 22, 'rect', i < 3 ? 'coral' : 'red', { size: 6, group: 'temp' });
  return L;
}

/** 0..1 brightness for every lamp, plus `blink` flags. t is the render time (s) for blinking. */
export function lampStates(G, lamps, t) {
  const f = G.f, m = G.mode, mb = G.mb, out = {};
  const fast = (Math.floor(t * 6) % 2) ? 1 : 0.15, slow = (Math.floor(t * 2.5) % 2) ? 1 : 0.2;  // ≤ 3 Hz
  const set = (n, v) => { out[n] = v; };
  for (const l of lamps) out[l.name] = 0;
  if (G.lampShow) return showStates(G, lamps, t);
  if (G.scene === 'attract' || G.scene === 'over') return showStates({ lampShow: { name: 'attract' } }, lamps, t);
  // arrows
  const modeShots = m ? { derby: ['arrowRamp', 'arrowOrbit', 'arrowReserve'], tower: ['arrowRamp'], tub: m.data.want === 'L' ? ['arrowOrbit'] : m.data.want === 'R' ? ['arrowRamp', 'arrowReserve'] : ['arrowRamp', 'arrowOrbit', 'arrowReserve'], coaster: ['arrowOrbit'], raid: m.phase === 2 ? ['arrowVapors'] : [], soak: [] }[m.id] : [];
  for (const n of modeShots) set(n, fast);
  if (mb && mb.kind === 'arlington') { set('arrowRamp', mb.jackpotLit ? fast : 0.2); if (!mb.jackpotLit) { set('arrowOrbit', slow); set('arrowReserve', slow); } }
  if (mb && mb.kind === 'valley') for (const n of ['arrowRamp', 'arrowOrbit', 'arrowReserve', 'arrowVapors', 'arrowLock']) set(n, fast);
  if (mb && mb.kind === 'soak' && mb.superLit) set('arrowVapors', fast);
  if (f.lockLit && !mb) set('arrowLock', slow);
  const vaporsReady = !m && !mb;
  if (vaporsReady && (f.wizardLit || f.grandSoakLit || f.ebLit)) set('arrowVapors', fast);
  else if (vaporsReady) set('arrowVapors', slow);
  if (!m && !mb && !out.arrowRamp) set('arrowRamp', 0.25);
  // progress
  for (let i = 0; i < 3; i++) set('tower' + i, i < f.towerLevel ? 1 : i === f.towerLevel ? ((f.ramps % 3) ? slow * 0.6 : 0) : 0);
  for (let i = 0; i < 3; i++) set('lockLamp' + i, i < f.locks ? 1 : (f.lockLit && i === f.locks) ? slow : 0);
  for (let i = 0; i < 3; i++) set('fifth' + i, f.ebLit ? fast : (f.fifth >= (i + 1) * 100 ? 1 : 0));
  BATHHOUSES.forEach((b, i) => {
    let v = f.row[i] ? 1 : 0;
    if (m && (m.id === 'soak' || (m.id === 'raid' && m.phase === 1)) && m.lit.includes(i)) v = fast;
    if (mb && mb.kind === 'soak') v = mb.hit[i] ? 0.25 : fast;
    set('bh' + b, v);
  });
  ['S', 'P', 'A'].forEach((k, i) => set('lane' + k, f.spa[i] ? 1 : (G.ball.inLane || G.ball.skillUntil > G.t) && G.ball.skillLane === i ? fast : 0));
  for (let k = 2; k <= 5; k++) set('bonus' + k + 'x', G.player.bonusX >= k ? 1 : 0);
  set('shootAgain', G.player.extraBalls > 0 ? 1 : (G.t < G.ball.saveUntil ? slow : 0));
  MODES.forEach((_, i) => set('mode' + i, mb && mb.kind === 'valley' ? (Math.floor(t * 2.5 + i * 0.5) % 2 ? 1 : 0.3) : m && m.i === i ? fast : f.modesWon[i] ? 1 : f.modesPlayed[i] ? 0.45 : (!m && !mb && i === nextModeIndex(f)) ? slow * 0.5 : 0));
  set('wizard', f.wizardLit ? fast : (mb && mb.kind === 'valley') ? 1 : 0);
  set('extraBall', f.ebLit ? fast : 0);
  set('grandSoak', f.grandSoakLit ? fast : (mb && mb.kind === 'soak') ? 1 : 0);
  const temp = Math.round(((f.springTemp - 100) / 43) * 5);
  for (let i = 0; i < 5; i++) set('temp' + i, f.boilUntil > G.t ? fast : i < temp ? 1 : 0);
  return out;
}

function nextModeIndex(f) { let i = f.nextMode; for (let k = 0; k < 6 && f.modesPlayed[i]; k++) i = (i + 1) % 6; return i; }

/** Light shows: patterns over all lamps by position (sweeps, chases), none faster than 3 Hz per lamp. */
export function showStates(G, lamps, t) {
  const out = {}, name = G.lampShow.name;
  for (const l of lamps) {
    let v = 0;
    if (name === 'attract') v = 0.5 + 0.5 * Math.sin(t * 2.2 - l.y / 120);
    else if (name === 'multiball' || name === 'wizard') v = (Math.sin(t * 9 - l.y / 60) > 0.2) ? 1 : 0.1;
    else if (name === 'jackpot' || name === 'skill' || name === 'eb') v = (Math.floor(t * 5) % 2) ? 1 : 0.2;
    else if (name === 'mode' || name === 'row' || name === 'spa') v = Math.max(0, Math.sin(t * 7 - Math.abs(l.x - 242) / 40));
    else if (name === 'boil') v = Math.max(0.1, Math.sin(t * 6 - (1100 - l.y) / 90));
    else v = 0.5;
    out[l.name] = Math.max(0, Math.min(1, v));
  }
  return out;
}

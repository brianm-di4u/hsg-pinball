// A simple autoplay bot (attract-mode demo play, balance runs and soak tests): watches each ball's distance to a
// flipper's face, flips just before contact while the ball is over the sweet part of the bat, sometimes cradles and
// aims, and plunges at a seeded strength. `skill` (0..1) is the chance it reacts at all, and the chance it aims.
//
// Shot intent: the bot reads the game (the lit bathhouses, the mode goal, the lock, the Vapors) and, for a slow ball
// rolling down the bat, waits until the ball is at the bat position that sends it at the wanted shot, then flips.
// AIM is where along the bat (0 pivot, 1 tip) each shot is made from; `node tools/shot-map.mjs --aim` measures it
// from the physics ("roll" is a ball rolling down a resting bat, "cradle" one let go from a held bat), so regenerate
// the numbers if the table changes. A shot a flipper cannot make is left to the plain flip.
import { flipper, nudge } from './rules.js';
import { autoPlunge } from './physics.js';
import { BATHHOUSES } from './table-spa-city.js';

const AIM = {
  roll: {
    L: { ramp: 0.675, reserve: 0.335, bh: { Buckstaff: 0.41, Quapaw: 0.255, Fordyce: 0.305, Lamar: 0.56, Maurice: 0.96 } },
    R: { vapors: 0.57, orbit: 0.87, bh: { Quapaw: 0.96, Maurice: 0.255, Superior: 0.285, Fordyce: 0.325 } },
  },
  cradle: {
    L: { reserve: 0.645, lock: 0.43, bh: { Buckstaff: 0.485, Fordyce: 0.145, Lamar: 0.55, Quapaw: 0.395, Ozark: 0.235 } },
    R: { vapors: 0.55, orbit: 0.84, lock: 0.43, bh: { Hale: 0.115, Quapaw: 0.14, Maurice: 0.245, Fordyce: 0.395 } },
  },
};

/** The shots worth making now, best first: 'vapors', 'ramp', 'orbit', 'reserve', 'lock' or a bathhouse name. */
export function wantedShots(G) {
  const f = G.f, m = G.mode, mb = G.mb;
  const bh = (idx) => idx.map((i) => BATHHOUSES[i]);
  if (mb) {
    if (mb.kind === 'valley') return mb.shots >= 6 ? ['vapors'] : ['ramp', 'orbit', 'reserve', 'vapors'];
    if (mb.kind === 'arlington') return mb.jackpotLit ? ['ramp'] : ['orbit', 'reserve'];
    if (mb.kind === 'soak') return mb.superLit ? ['vapors'] : bh(mb.hit.map((h, i) => (h ? -1 : i)).filter((i) => i >= 0));
  }
  if (m && G.t >= m.t0) {
    switch (m.id) {
      case 'soak': return bh(m.lit);
      case 'derby': return ['ramp', 'orbit', 'reserve'];
      case 'raid': return m.phase === 1 ? bh(m.lit) : ['vapors'];
      case 'tower': return ['ramp'];
      case 'tub': return m.data.want === 'L' ? ['orbit'] : m.data.want === 'R' ? ['ramp', 'reserve'] : ['ramp', 'orbit'];
      case 'coaster': return ['orbit'];
    }
  }
  if (m) return ['ramp', 'orbit'];
  if (f.lockLit) return ['lock', 'vapors'];
  if (f.wizardLit || f.grandSoakLit || f.ebLit) return ['vapors'];
  // between modes: the Vapors starts the next one, the ramp builds toward the lock
  return f.ramps % 3 === 2 ? ['ramp', 'vapors'] : ['vapors', 'ramp'];
}

/** onFlip({ side, shot, from, speed }) is called when the bot presses a flipper with a shot in mind (tools/balance.mjs counts how often it lands). */
export function createBot(G, { skill = 0.8, seed = 7, onFlip } = {}) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const st = { L: { until: 0, cool: 0, cradle: 0 }, R: { until: 0, cool: 0, cradle: 0 }, plungeAt: 0, nudgeAt: 0 };
  const aimFor = (S, side, wants, kind) => {
    if (rnd() > skill) return null;                           // a miss-hit: no plan this time
    const a = AIM[kind][side];
    for (const w of wants) {
      const v = a[w] ?? (a.bh && a.bh[w]);
      if (v != null) { S.shot = w; return v + (rnd() - 0.5) * (1 - skill) * 0.2; }
    }
    return null;
  };
  return function botTick() {
    if (G.scene !== 'game') return;
    const t = G.t;
    const inLane = G.w.balls.find((b) => !b.held && b.x > 480 && b.y < 140 && Math.abs(b.vy) < 30);
    if (inLane && G.w.plunger.vel === 0 && !G.w.plunger.holding) {
      if (!st.plungeAt) st.plungeAt = t + 0.4 + rnd() * 0.6;
      else if (t >= st.plungeAt) { autoPlunge(G.w, 0.72 + rnd() * 0.26); st.plungeAt = 0; }
    }
    // a ball sliding down a side channel toward an outlane: a nudge across the table, spaced so the tilt bob can fall
    if (t >= st.nudgeAt && G.scene === 'game') {
      for (const b of G.w.balls) {
        if (b.held || b.layer !== 1 || b.y > 450 || b.y < 330) continue;
        const left = b.x < 75 && b.vx < -150, right = b.x > G.T.width - 75 && b.vx > 150;
        if ((left || right) && b.vy < 0 && rnd() < skill) { nudge(G, left ? 'right' : 'left'); st.nudgeAt = t + 1.4; break; }
      }
    }
    let wants = null;
    for (const side of ['L', 'R']) {
      const f = G.w.flippers.find((q) => q.side === side);
      const S = st[side];
      if (S.until && t >= S.until) { flipper(G, side, false); S.until = 0; S.cool = t + 0.1; S.aim = 0; S.target = undefined; S.released = false; S.catch = undefined; }
      if (S.cradle && t >= S.hold && t < S.cradle) {
        // let go once the ball has settled in the cradle, so the shot starts from rest like the aiming table's
        const bc = Math.cos(f.rest), bs = Math.sin(f.rest);
        const onBat = G.w.balls.find((q) => !q.held && Math.hypot(q.x - f.x, q.y - f.y) < f.len + 25 && Math.hypot(q.vx, q.vy) < 90 && (-(q.x - f.x) * bs + (q.y - f.y) * bc) * f.dir < 40);
        if (onBat) S.cradle = t;
      }
      if (S.cradle && t >= S.cradle) { S.cradle = 0; flipper(G, side, false); S.cool = t + 0.05; S.aim = 0.35 + rnd() * 0.55; S.target = undefined; S.released = true; S.relUntil = t + 1.6; continue; }
      if (S.cradle) continue;
      if (S.released && t > S.relUntil) { S.released = false; S.catch = undefined; S.target = undefined; }   // the ball went elsewhere
      if (S.until || t < S.cool) continue;
      const ca = Math.cos(f.rest), sa = Math.sin(f.rest);
      for (const b of G.w.balls) {
        if (b.held || b.layer !== 1 || b.y > 300) continue;
        const dx = b.x - f.x, dy = b.y - f.y;
        const along = (dx * ca + dy * sa) / f.len;
        const across = (-dx * sa + dy * ca) * f.dir;            // height above the bat's resting face
        if (along < 0.05 || along > 1.05 || across < 0 || across > 90) continue;
        const vAcross = (-b.vx * sa + b.vy * ca) * f.dir;        // negative: falling toward the face
        const speed = Math.hypot(b.vx, b.vy);
        const tHit = vAcross < -1 ? (across - 15) / -vAcross : across < 24 ? 0 : 9;
        // a shot this bat can make with the ball in hand: catch the ball (the bat goes up early and holds), then let it roll
        // down the bat and flip at the aiming point. Otherwise a slow ball is sometimes cradled for no reason but the pause.
        if (!S.released && !S.cradle && speed < 1800 && (tHit < 0.22 || (speed < 650 && across < 30))) {
          if (S.catch === undefined) {
            wants ||= wantedShots(G);
            const makeable = wants.some((w) => AIM.cradle[side][w] != null || (AIM.cradle[side].bh && AIM.cradle[side].bh[w] != null));
            S.catch = (makeable && rnd() < skill) || (speed < 650 && across < 30 && rnd() < 0.3 * skill);
          }
          if (S.catch) { S.hold = t + 0.35; S.cradle = t + 2; }
        }
        if (S.cradle) { flipper(G, side, true); break; }
        if (tHit > 0.035) continue;
        // the shot to make from here, chosen once per approach
        if (S.target === undefined) { wants ||= wantedShots(G); S.target = aimFor(S, side, wants, S.released ? 'cradle' : 'roll'); }
        if (S.target != null) {
          if (speed < 900 && across < 24 && along < S.target) continue;   // let it roll to the aiming point
        } else {
          if (!S.aim) S.aim = 0.3 + rnd() * 0.6;
          if (along < S.aim * 0.6 && speed < 900 && across < 24) continue;  // let it roll toward the aim point
        }
        if (rnd() > skill) { S.cool = t + 0.25; S.target = undefined; S.catch = undefined; break; }
        if (onFlip && S.target != null) onFlip({ side, shot: S.shot, from: S.released ? 'cradle' : 'roll', speed: Math.round(speed) });
        flipper(G, side, true);
        S.until = t + 0.12 + rnd() * 0.12;
        break;
      }
    }
  };
}

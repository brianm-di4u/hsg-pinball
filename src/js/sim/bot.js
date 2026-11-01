// A simple autoplay bot (attract-mode demo play, balance runs and soak tests): watches each ball's distance to a
// flipper's face, flips just before contact while the ball is over the sweet part of the bat, sometimes cradles and
// aims, and plunges at a seeded strength. `skill` (0..1) is the chance it reacts at all.
import { flipper } from './rules.js';
import { autoPlunge } from './physics.js';

export function createBot(G, { skill = 0.8, seed = 7 } = {}) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const st = { L: { until: 0, cool: 0, cradle: 0 }, R: { until: 0, cool: 0, cradle: 0 }, plungeAt: 0 };
  return function botTick() {
    if (G.scene !== 'game') return;
    const t = G.t;
    const inLane = G.w.balls.find((b) => !b.held && b.x > 480 && b.y < 140 && Math.abs(b.vy) < 30);
    if (inLane && G.w.plunger.vel === 0 && !G.w.plunger.holding) {
      if (!st.plungeAt) st.plungeAt = t + 0.4 + rnd() * 0.6;
      else if (t >= st.plungeAt) { autoPlunge(G.w, 0.72 + rnd() * 0.26); st.plungeAt = 0; }
    }
    for (const side of ['L', 'R']) {
      const f = G.w.flippers.find((q) => q.side === side);
      const S = st[side];
      if (S.until && t >= S.until) { flipper(G, side, false); S.until = 0; S.cool = t + 0.1; S.aim = 0; }
      if (S.cradle && t >= S.cradle) { S.cradle = 0; flipper(G, side, false); S.cool = t + 0.05; S.aim = 0.35 + rnd() * 0.55; continue; }
      if (S.cradle) continue;
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
        // slow ball rolling down the bat: sometimes cradle, then aim with a fresh flip
        if (speed < 650 && across < 30 && rnd() < 0.02 * skill && !S.cradle) { S.cradle = t + 0.5 + rnd(); }
        if (S.cradle) { flipper(G, side, true); break; }
        const tHit = vAcross < -1 ? (across - 15) / -vAcross : across < 24 ? 0 : 9;
        if (tHit > 0.035) continue;
        if (!S.aim) S.aim = 0.3 + rnd() * 0.6;
        if (along < S.aim * 0.6 && speed < 900 && across < 24) continue;  // let it roll toward the aim point
        if (rnd() > skill) { S.cool = t + 0.25; break; }
        flipper(G, side, true);
        S.until = t + 0.12 + rnd() * 0.12;
        break;
      }
    }
  };
}

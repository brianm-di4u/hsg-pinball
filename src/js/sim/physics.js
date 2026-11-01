// Spa City Pinball: deterministic 2D pinball physics in the table plane (no DOM, no three.js; Node tools import it).
//
// Ball, capsule-wall and flipper collision are adapted from Ten Minute Physics #04 "How to write a pinball
// simulation", Copyright 2021 Matthias Müller (MIT License, see SAMPLES.md):
//   closest point on a segment, push the ball out along the normal, then replace the normal velocity, using the
//   flipper's surface velocity perp(r) * omega at the contact.
// Added here: a fixed 120 Hz tick with SUB substeps (about 1 kHz) so speed never depends on frame rate and a ball
// moves under a third of its radius per substep (no tunnelling); restitution with VPX-style elasticity falloff and
// Coulomb friction on every contact; tapered flippers with coil acceleration, end-of-stroke stop and a return spring;
// kicking bumpers and slingshots; one-way gates; switches, spinners, saucers; ramp layers with height profiles;
// a kinematic plunger; ball-ball contact for multiball; and a uniform grid broadphase.
//
// Units: millimetres, seconds. +x is right, +y is up the table (away from the player). Gravity pulls toward -y.

export const TICK = 1 / 120;
export const SUB = 8;
export const DT = TICK / SUB;
export const BALL_R = 13.5;           // a 27 mm (1 1/16") pinball
export const MAX_SPEED = 6500;        // mm/s; 6.8 mm per substep, half the ball radius
export const G_TABLE = 1350;          // gravity along the playfield (about 7.9 degrees of pitch)
export const G_RAMP = 9810;           // full gravity, applied along a ramp's own slope
export const LAYER = { FIELD: 1, RAMP: 2, WIRE: 4 };

// segment kinds
export const K = { WALL: 0, RUBBER: 1, SLING: 2, TARGET: 3, GATE: 4, DROP: 5, POST: 6, BUMPER: 7 };

const CELL = 48;

// ---------------------------------------------------------------------------------------------------------------
// World construction
// ---------------------------------------------------------------------------------------------------------------

/** Build a runtime world from a compiled table (see table.js). */
export function createWorld(table) {
  const w = {
    table,
    time: 0,
    tick: 0,
    balls: [],
    nextBallId: 1,
    flippers: table.flippers.map((f) => ({ ...f, theta: 0, omega: 0, held: false })),
    plunger: { ...table.plunger, pull: 0, vel: 0, pos: 0, holding: false, auto: 0 },
    drops: new Uint8Array(table.segs.length),      // 1 = drop target is down (segment inactive)
    events: [],
    nudgeX: 0, nudgeY: 0,
    magnets: [],                                     // {x, y, r, strength, on}
    pending: [],                                     // timed inputs, see queueInput
    dead: false,                                     // tilted: no kicks, flippers off
  };
  return w;
}

export function addBall(w, x, y, vx = 0, vy = 0, layer = LAYER.FIELD) {
  const b = { id: w.nextBallId++, x, y, vx, vy, px: x, py: y, z: 0, layer, held: null, still: 0, roll: 0 };
  w.balls.push(b);
  return b;
}

export function removeBall(w, b) {
  const i = w.balls.indexOf(b);
  if (i >= 0) w.balls.splice(i, 1);
}

// ---------------------------------------------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------------------------------------------

export function setFlipper(w, side, held) {
  if (w.dead) held = false;
  for (const f of w.flippers) if (f.side === side) f.held = held;
}

export const TAP_PULL = 6;          // mm: a release before the plunger has drawn this far (~150 ms) is a tap
export const TAP_STRENGTH = 0.85;   // a tap fires like a launch button, round the arch

/** Hold (true) to draw the plunger back, release (false) to fire. */
export function setPlunger(w, holding) {
  const p = w.plunger;
  if (holding && !p.holding) p.holding = true;
  else if (!holding && p.holding) {
    if (p.pull < TAP_PULL) { autoPlunge(w, TAP_STRENGTH); return; }
    p.holding = false; p.vel = p.maxVel * (p.pull / p.maxPull);
  }
}

/** Fire the plunger at a set strength (0..1) without a pull: ball saves, multiball launches, tests. */
export function autoPlunge(w, strength) {
  const p = w.plunger;
  const top = p.y - p.pull;
  p.pull = p.maxPull * strength; p.holding = false; p.vel = p.maxVel * strength;
  // a ball resting on the tip rides it back, as it would during a real pull
  for (const b of w.balls) {
    if (!b.held && b.x > p.x0 - 2 && b.x < p.x1 + 2 && Math.abs(b.y - BALL_R - top) < 3) { b.y = p.y - p.pull + BALL_R; b.vy = 0; }
  }
}

/** Shove the table: every free ball takes the opposite velocity change. */
export function nudge(w, dx, dy) {
  for (const b of w.balls) if (!b.held) { b.vx -= dx; b.vy -= dy; }
}

/** Kick a held ball out of a saucer at an angle (radians, 0 = +x) and speed. */
export function kickOut(w, ballOrId, angle, speed) {
  const b = typeof ballOrId === 'object' ? ballOrId : w.balls.find((q) => q.id === ballOrId);
  if (!b || !b.held) return;
  b.vx = Math.cos(angle) * speed; b.vy = Math.sin(angle) * speed;
  b.cooldown = 0.35;  // ignore this saucer's capture until the ball has left
  b.coolSw = b.held.sw;
  b.held = null;
}

export function setDrop(w, segIndex, down) { w.drops[segIndex] = down ? 1 : 0; }

// ---------------------------------------------------------------------------------------------------------------
// Stepping
// ---------------------------------------------------------------------------------------------------------------

/**
 * Queue an input to apply at sim time t (seconds), so a flip lands on the right ~1 ms substep instead of the next
 * 8 ms tick. fn(w) runs at the first substep at or after t. Inputs sharing a key (a flipper side) apply in the order
 * they were queued, whatever their times, so a release can never overtake its press.
 */
export function queueInput(w, t, fn, key) {
  if (key != null) for (const q of w.pending) if (q.key === key && q.t > t) t = q.t;
  w.pending.push({ t, fn, key });
  w.pending.sort((a, b) => a.t - b.t);   // stable: equal times keep queue order
}

/** Advance one fixed tick (TICK seconds). Events land in w.events; the caller drains them. */
export function step(w) {
  for (let s = 0; s < SUB; s++) {
    if (w.pending.length) {
      const now = w.tick * TICK + s * DT + 1e-9;
      while (w.pending.length && w.pending[0].t <= now) w.pending.shift().fn(w);
    }
    substep(w, DT);
  }
  w.tick++;
  w.time = w.tick * TICK;
  // stillness counter for ball search
  for (const b of w.balls) {
    if (b.held) { b.still = 0; continue; }
    const sp = Math.hypot(b.vx, b.vy);
    b.still = sp < 25 ? b.still + TICK : 0;
  }
}

function substep(w, dt) {
  stepFlippers(w, dt);
  stepPlunger(w, dt);
  const T = w.table;
  for (const b of w.balls) {
    if (b.held) continue;
    if (b.cooldown) { b.cooldown -= dt; if (b.cooldown <= 0) { b.cooldown = 0; b.coolSw = -1; } }
    // gravity along the table, plus a ramp's own slope
    let ax = 0, ay = -G_TABLE;
    if (b.layer !== LAYER.FIELD) {
      const r = rampAt(T, b);
      if (r && r.d2 < 45 * 45) { ax -= G_RAMP * r.slope * r.tx; ay -= G_RAMP * r.slope * r.ty; b.z = r.z; }
      else { b.layer = LAYER.FIELD; b.z = 0; w.events.push({ t: 'offRamp', ball: b.id, x: b.x, y: b.y }); }  // fell off a ramp end
    } else b.z = 0;
    for (const m of w.magnets) {
      if (!m.on) continue;
      const dx = m.x - b.x, dy = m.y - b.y, d = Math.hypot(dx, dy);
      if (d < m.r && d > 1) { const k = m.strength * (1 - d / m.r) / d; ax += dx * k; ay += dy * k; }
    }
    b.vx += ax * dt; b.vy += ay * dt;
    // rolling resistance
    const damp = 1 - T.rollDamp * dt;
    b.vx *= damp; b.vy *= damp;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > MAX_SPEED) { b.vx *= MAX_SPEED / sp; b.vy *= MAX_SPEED / sp; }
    b.px = b.x; b.py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    b.roll += sp * dt;
  }
  for (const b of w.balls) {
    if (b.held) continue;
    collideStatic(w, b);
    for (const f of w.flippers) if (b.layer & LAYER.FIELD) collideFlipper(w, b, f);
    collidePlunger(w, b);
    triggers(w, b);
  }
  // ball-ball (multiball)
  const n = w.balls.length;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) collideBalls(w, w.balls[i], w.balls[j]);
}

function stepFlippers(w, dt) {
  for (const f of w.flippers) {
    const prev = f.theta;
    if (f.held) {
      f.omega = Math.min(f.omega + f.acc * dt, f.maxOmega);
      if (f.omega < 0) f.omega = Math.min(f.omega + f.acc * 4 * dt, f.maxOmega); // reversing: coil fights the fall
    } else {
      f.omega = Math.max(f.omega - f.retAcc * dt, -f.maxRet);
    }
    f.theta += f.omega * dt;
    if (f.theta >= f.stroke) {
      f.theta = f.stroke;
      if (f.omega > 0) { f.omega = 0; if (prev < f.stroke) w.events.push({ t: 'flipEnd', side: f.side }); }
    }
    if (f.theta <= 0) { f.theta = 0; if (f.omega < 0) f.omega = 0; }
    f.angle = f.rest + f.dir * f.theta;
    f.tipX = f.x + Math.cos(f.angle) * f.len;
    f.tipY = f.y + Math.sin(f.angle) * f.len;
  }
}

function stepPlunger(w, dt) {
  const p = w.plunger;
  if (p.holding) {
    p.pull = Math.min(p.pull + p.pullRate * dt, p.maxPull);
    p.vel = 0;
  } else if (p.vel > 0) {
    p.pull -= p.vel * dt;
    if (p.pull <= 0) { p.pull = 0; p.vel = 0; w.events.push({ t: 'plungerHit' }); }
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Collisions
// ---------------------------------------------------------------------------------------------------------------

function cellKey(cx, cy) { return cy * 4096 + cx; }

function collideStatic(w, b) {
  const T = w.table;
  const cx = Math.floor(b.x / CELL), cy = Math.floor(b.y / CELL);
  const list = T.grid.get(cellKey(cx, cy));
  if (!list) return;
  const segs = T.segs, circs = T.circles;
  for (let k = 0; k < list.length; k++) {
    const id = list[k];
    if (id >= 0) {
      const s = segs[id];
      if (!(s.mask & b.layer) || w.drops[id]) continue;
      collideSeg(w, b, s, id);
    } else {
      const c = circs[-id - 1];
      if (!(c.mask & b.layer)) continue;
      collideCircle(w, b, c);
    }
  }
}

function closest(px, py, ax, ay, bx, by) {
  const abx = bx - ax, aby = by - ay;
  const L = abx * abx + aby * aby;
  let t = L > 0 ? ((px - ax) * abx + (py - ay) * aby) / L : 0;
  if (t < 0) t = 0; else if (t > 1) t = 1;
  return t;
}

function collideSeg(w, b, s, id) {
  const t = closest(b.x, b.y, s.ax, s.ay, s.bx, s.by);
  const qx = s.ax + (s.bx - s.ax) * t, qy = s.ay + (s.by - s.ay) * t;
  let dx = b.x - qx, dy = b.y - qy;
  const d = Math.hypot(dx, dy);
  const rr = BALL_R + s.r;
  if (d >= rr || d === 0) return;
  dx /= d; dy /= d;
  if (s.kind === K.GATE) {
    // one-way: blocks only a ball on the +n side moving toward -n
    if (dx * s.nx + dy * s.ny < 0) return;
    if (b.x * s.nx + b.y * s.ny - (s.ax * s.nx + s.ay * s.ny) < 0) return;
  }
  b.x += dx * (rr - d); b.y += dy * (rr - d);
  const vn = b.vx * dx + b.vy * dy;
  if (vn >= 0) return;
  respond(b, dx, dy, vn, 0, 0, s.e, s.f);
  const speed = -vn;
  if (s.kind === K.SLING && !w.dead && speed > s.kickMin && (dx * s.nx + dy * s.ny) > 0.5) {
    b.vx += s.nx * s.kick; b.vy += s.ny * s.kick;
    w.events.push({ t: 'sling', sw: s.sw, id, speed, x: qx, y: qy, ball: b.id });
  } else if (s.sw >= 0 && speed > 60) {
    w.events.push({ t: s.kind === K.DROP ? 'drop' : s.kind === K.TARGET ? 'target' : 'hit', sw: s.sw, id, speed, x: qx, y: qy, ball: b.id });
  } else if (speed > 250) {
    w.events.push({ t: 'wall', kind: s.kind, speed, x: qx, y: qy, ball: b.id });
  }
}

function collideCircle(w, b, c) {
  let dx = b.x - c.x, dy = b.y - c.y;
  const d = Math.hypot(dx, dy);
  const rr = BALL_R + c.r;
  if (d >= rr || d === 0) return;
  dx /= d; dy /= d;
  b.x = c.x + dx * rr; b.y = c.y + dy * rr;
  const vn = b.vx * dx + b.vy * dy;
  if (c.kind === K.BUMPER && !w.dead) {
    // a pop bumper fires on any real contact and throws the ball out at a set speed
    if (vn < 0 || (c.cool || 0) <= w.time) {
      const out = Math.max(c.kick, -vn * c.e);
      b.vx += dx * (out - vn); b.vy += dy * (out - vn);
      if ((c.cool || 0) <= w.time) {
        c.cool = w.time + 0.06;
        w.events.push({ t: 'bumper', sw: c.sw, speed: Math.abs(vn), x: c.x, y: c.y, ball: b.id });
      }
    }
    return;
  }
  if (vn >= 0) return;
  respond(b, dx, dy, vn, 0, 0, c.e, c.f);
  if (c.sw >= 0 && -vn > 60) w.events.push({ t: 'hit', sw: c.sw, speed: -vn, x: c.x, y: c.y, ball: b.id });
  else if (-vn > 250) w.events.push({ t: 'wall', kind: c.kind, speed: -vn, x: c.x, y: c.y, ball: b.id });
}

/**
 * Contact response against a surface moving at (sx, sy): restitution on the relative normal velocity with falloff
 * (harder hits bounce proportionally less, as rubber does), and Coulomb friction on the tangential part.
 */
function respond(b, nx, ny, vn, sx, sy, e0, mu) {
  const rvx = b.vx - sx, rvy = b.vy - sy;
  const rvn = rvx * nx + rvy * ny;
  if (rvn >= 0) return;
  // resting and rolling contacts (slow normal speed) neither bounce nor drag: a rolling ball keeps rolling
  const e = -rvn < 40 ? 0 : e0 / (1 + Math.max(0, -rvn - 600) / 2600);
  const jn = -(1 + e) * rvn;
  b.vx += nx * jn; b.vy += ny * jn;
  if (-rvn < 150) return;
  // on impacts, friction opposes tangential slip, at most mu * normal impulse
  const tx = -ny, ty = nx;
  const vt = (b.vx - sx) * tx + (b.vy - sy) * ty;
  const jt = Math.max(-mu * jn, Math.min(mu * jn, -vt * 0.35));
  b.vx += tx * jt; b.vy += ty * jt;
}

function collideFlipper(w, b, f) {
  const t = closest(b.x, b.y, f.x, f.y, f.tipX, f.tipY);
  const qx = f.x + (f.tipX - f.x) * t, qy = f.y + (f.tipY - f.y) * t;
  let dx = b.x - qx, dy = b.y - qy;
  const d = Math.hypot(dx, dy);
  const fr = f.r0 + (f.r1 - f.r0) * t;
  const rr = BALL_R + fr;
  if (d >= rr || d === 0) return;
  dx /= d; dy /= d;
  b.x += dx * (rr - d); b.y += dy * (rr - d);
  // surface velocity at the contact point: omega x r
  const om = f.dir * f.omega;
  const cx = qx + dx * fr - f.x, cy = qy + dy * fr - f.y;
  const sx = -cy * om, sy = cx * om;
  const vn = (b.vx - sx) * dx + (b.vy - sy) * dy;
  if (vn >= 0) return;
  respond(b, dx, dy, vn, sx, sy, f.e, f.f);
  if (-vn > 150) w.events.push({ t: 'flipHit', side: f.side, speed: -vn, pos: t, ball: b.id });
}

function collidePlunger(w, b) {
  const p = w.plunger;
  if (!(b.layer & LAYER.FIELD)) return;
  if (b.x < p.x0 - 2 || b.x > p.x1 + 2) return;
  const top = p.y - p.pull;
  const dy = b.y - top;
  if (dy >= BALL_R || dy < -BALL_R) return;
  b.y = top + BALL_R;
  const sv = p.vel; // the plunger tip moves up at p.vel
  if (b.vy < sv) {
    const rel = b.vy - sv;
    b.vy = sv - rel * p.e;
  }
}

function collideBalls(w, a, c) {
  if (a.held || c.held || !(a.layer & c.layer)) return;
  let dx = c.x - a.x, dy = c.y - a.y;
  const d = Math.hypot(dx, dy);
  const rr = BALL_R * 2;
  if (d >= rr || d === 0) return;
  dx /= d; dy /= d;
  const corr = (rr - d) / 2;
  a.x -= dx * corr; a.y -= dy * corr; c.x += dx * corr; c.y += dy * corr;
  const va = a.vx * dx + a.vy * dy, vc = c.vx * dx + c.vy * dy;
  if (va - vc <= 0) return;
  const e = 0.9;
  const j = (1 + e) * (va - vc) / 2;
  a.vx -= dx * j; a.vy -= dy * j; c.vx += dx * j; c.vy += dy * j;
  if (va - vc > 200) w.events.push({ t: 'clack', speed: va - vc, x: (a.x + c.x) / 2, y: (a.y + c.y) / 2 });
}

// ---------------------------------------------------------------------------------------------------------------
// Triggers: rollovers, spinners, layer changes, saucers and the drain
// ---------------------------------------------------------------------------------------------------------------

function crosses(b, tr) {
  // did the ball centre cross segment tr this substep? returns +1 / -1 by direction along tr's normal, or 0
  const d0 = (b.px - tr.ax) * tr.nx + (b.py - tr.ay) * tr.ny;
  const d1 = (b.x - tr.ax) * tr.nx + (b.y - tr.ay) * tr.ny;
  if ((d0 < 0) === (d1 < 0)) return 0;
  const f = d0 / (d0 - d1);
  const ix = b.px + (b.x - b.px) * f, iy = b.py + (b.y - b.py) * f;
  const ux = tr.bx - tr.ax, uy = tr.by - tr.ay;
  const u = ((ix - tr.ax) * ux + (iy - tr.ay) * uy) / (ux * ux + uy * uy);
  if (u < 0 || u > 1) return 0;
  return d1 > d0 ? 1 : -1;
}

function triggers(w, b) {
  const T = w.table;
  for (let i = 0; i < T.triggers.length; i++) {
    const tr = T.triggers[i];
    if (!(tr.mask & b.layer)) continue;
    const dir = crosses(b, tr);
    if (!dir) continue;
    if (tr.layer) {
      // [lower, upper]: crossing along +n climbs, along -n descends
      if (dir > 0 && b.layer === tr.layer[0]) b.layer = tr.layer[1];
      else if (dir < 0 && b.layer === tr.layer[1]) b.layer = tr.layer[0];
    }
    if (tr.sw >= 0 && (!tr.oneWay || dir > 0)) {
      const speed = Math.abs(b.vx * tr.nx + b.vy * tr.ny);
      w.events.push({ t: tr.spinner ? 'spinner' : 'roll', sw: tr.sw, dir, speed, ball: b.id, x: b.x, y: b.y });
    }
  }
  for (const h of T.holes) {
    if (!(h.mask & b.layer)) continue;
    if (b.cooldown && b.coolSw === h.sw) continue;
    const dx = b.x - h.x, dy = b.y - h.y;
    if (dx * dx + dy * dy > h.r * h.r) continue;
    const sp = Math.hypot(b.vx, b.vy);
    if (sp > h.maxSpeed) continue;
    b.held = { sw: h.sw, since: w.time };
    b.x = h.x; b.y = h.y; b.vx = 0; b.vy = 0;
    w.events.push({ t: 'hole', sw: h.sw, ball: b.id, speed: sp });
  }
  if (b.y < T.drainY && b.layer === LAYER.FIELD) {
    w.events.push({ t: 'drain', ball: b.id, x: b.x });
    b.held = { sw: -1, drained: true, since: w.time };
    b.vx = b.vy = 0;
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Ramps: centre lines with a height per point. Off the field layer the ball takes the slope's pull and height.
// ---------------------------------------------------------------------------------------------------------------

function rampAt(T, b) {
  let best = null, bd = Infinity;
  for (const r of T.ramps) {
    if (r.layer !== b.layer) continue;
    const p = r.pts;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i], c = p[i + 1];
      const t = closest(b.x, b.y, a[0], a[1], c[0], c[1]);
      const qx = a[0] + (c[0] - a[0]) * t, qy = a[1] + (c[1] - a[1]) * t;
      const d = (b.x - qx) ** 2 + (b.y - qy) ** 2;
      if (d < bd) {
        bd = d;
        const L = Math.hypot(c[0] - a[0], c[1] - a[1]) || 1;
        best = { z: a[2] + (c[2] - a[2]) * t, slope: (c[2] - a[2]) / L, tx: (c[0] - a[0]) / L, ty: (c[1] - a[1]) / L, d2: d };
      }
    }
  }
  return best;
}

export function rampHeight(T, b) { const r = rampAt(T, b); return r ? r.z : 0; }

// ---------------------------------------------------------------------------------------------------------------
// Serialization (tests and save states)
// ---------------------------------------------------------------------------------------------------------------

export function snapshot(w) {
  return {
    tick: w.tick,
    balls: w.balls.map((b) => ({ id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy, layer: b.layer, held: b.held ? { ...b.held } : null })),
    flippers: w.flippers.map((f) => ({ side: f.side, theta: f.theta, omega: f.omega, held: f.held })),
    plunger: { pull: w.plunger.pull, vel: w.plunger.vel, holding: w.plunger.holding },
    drops: Array.from(w.drops.keys()).filter((i) => w.drops[i]),
    nextBallId: w.nextBallId,
  };
}

export function restore(w, s) {
  w.tick = s.tick; w.time = s.tick * TICK;
  w.balls = s.balls.map((b) => ({ ...b, px: b.x, py: b.y, z: 0, still: 0, roll: 0, held: b.held ? { ...b.held } : null }));
  for (const fs of s.flippers) { const f = w.flippers.find((q) => q.side === fs.side); if (f) Object.assign(f, fs); }
  Object.assign(w.plunger, s.plunger);
  w.drops.fill(0);
  for (const i of s.drops) w.drops[i] = 1;
  w.nextBallId = s.nextBallId;
  stepFlippers(w, 0);
}

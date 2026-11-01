// Compiles a table spec (see table-spa-city.js) into the flat runtime structures physics.js reads: capsule segments,
// circles, flippers, triggers, holes, ramps, named switches, and a uniform grid broadphase. No DOM; Node imports it.
import { BALL_R, K, LAYER } from './physics.js';

const CELL = 48;

export function compileTable(spec) {
  const sw = {}, swName = [];
  const swId = (name) => {
    if (name == null) return -1;
    if (!(name in sw)) { sw[name] = swName.length; swName.push(name); }
    return sw[name];
  };
  const segs = [], segGroups = {};
  for (const wl of spec.walls) {
    const pts = wl.pts;
    const n = wl.closed ? pts.length : pts.length - 1;
    const ids = [];
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 1e-6) continue;
      ids.push(segs.length);
      segs.push({
        ax: a[0], ay: a[1], bx: b[0], by: b[1],
        nx: -(b[1] - a[1]) / L, ny: (b[0] - a[0]) / L,
        r: wl.r ?? 4, e: wl.e ?? 0.35, f: wl.f ?? 0.08,
        kind: K[wl.kind ?? 'WALL'], mask: wl.mask ?? LAYER.FIELD,
        sw: swId(wl.sw), kick: wl.kick ?? 0, kickMin: wl.kickMin ?? 150,
        name: wl.name || null, vis: wl.vis ?? 'rail', group: wl.name || null,
        z0: wl.z0, z1: wl.z1,
      });
    }
    if (wl.name) segGroups[wl.name] = (segGroups[wl.name] || []).concat(ids);
  }
  const circles = spec.circles.map((c) => ({
    x: c.x, y: c.y, r: c.r, kind: K[c.kind ?? 'POST'], e: c.e ?? 0.6, f: c.f ?? 0.05,
    kick: c.kick ?? 0, sw: swId(c.sw), mask: c.mask ?? LAYER.FIELD, name: c.name || null, vis: c.vis ?? null,
  }));
  const triggers = spec.triggers.map((t) => {
    const L = Math.hypot(t.b[0] - t.a[0], t.b[1] - t.a[1]);
    return {
      ax: t.a[0], ay: t.a[1], bx: t.b[0], by: t.b[1],
      nx: -(t.b[1] - t.a[1]) / L, ny: (t.b[0] - t.a[0]) / L,
      sw: swId(t.sw), mask: t.mask ?? LAYER.FIELD, layer: t.layer || null,
      spinner: !!t.spinner, oneWay: !!t.oneWay, name: t.name || t.sw || null, vis: t.vis ?? null,
    };
  });
  const holes = spec.holes.map((h) => ({
    x: h.x, y: h.y, r: h.r ?? 10, maxSpeed: h.maxSpeed ?? 900, sw: swId(h.sw), mask: h.mask ?? LAYER.FIELD,
    name: h.name || h.sw, kickAngle: h.kickAngle ?? Math.PI / 2, kickSpeed: h.kickSpeed ?? 1500, vis: h.vis ?? null,
  }));
  const flippers = spec.flippers.map((f) => ({
    side: f.side, x: f.x, y: f.y, len: f.len, r0: f.r0, r1: f.r1,
    rest: f.rest, stroke: f.stroke, dir: f.dir,
    acc: f.acc ?? 2600, maxOmega: f.maxOmega ?? 30, retAcc: f.retAcc ?? 1500, maxRet: f.maxRet ?? 22,
    e: f.e ?? 0.6, f: f.f ?? 0.12,
  }));
  for (const f of flippers) { f.angle = f.rest; f.tipX = f.x + Math.cos(f.rest) * f.len; f.tipY = f.y + Math.sin(f.rest) * f.len; }
  // every name used anywhere gets an id, even switches only the rules reference
  for (const n of spec.extraSwitches || []) swId(n);

  // broadphase grid: each cell lists the segments (>= 0) and circles (-1 - index) whose inflated bounds touch it
  const grid = new Map();
  const add = (x0, y0, x1, y1, id) => {
    for (let cy = Math.floor(y0 / CELL); cy <= Math.floor(y1 / CELL); cy++) {
      for (let cx = Math.floor(x0 / CELL); cx <= Math.floor(x1 / CELL); cx++) {
        const k = cy * 4096 + cx;
        let l = grid.get(k);
        if (!l) grid.set(k, (l = []));
        l.push(id);
      }
    }
  };
  segs.forEach((s, i) => {
    const m = s.r + BALL_R + 2;
    add(Math.min(s.ax, s.bx) - m, Math.min(s.ay, s.by) - m, Math.max(s.ax, s.bx) + m, Math.max(s.ay, s.by) + m, i);
  });
  circles.forEach((c, i) => {
    const m = c.r + BALL_R + 2;
    add(c.x - m, c.y - m, c.x + m, c.y + m, -1 - i);
  });

  return {
    name: spec.name, width: spec.width, height: spec.height, drainY: spec.drainY, rollDamp: spec.rollDamp ?? 0.03,
    segs, segGroups, circles, triggers, holes, flippers, ramps: spec.ramps || [], grid,
    plunger: { ...spec.plunger }, sw, swName, spec,
    shooterLane: spec.shooterLane, lamps: spec.lamps || [], deco: spec.deco || {},
  };
}

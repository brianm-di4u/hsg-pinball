// M1: physics foundation (Node, no browser) and a browser boot check. PRD AC1–AC7.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createWorld, addBall, step, setFlipper, queueInput, autoPlunge, snapshot, kickOut, TICK, BALL_R, LAYER, MAX_SPEED } from '../src/js/sim/physics.js';
import { mulberry32 } from '../src/js/sim/rng.js';

const T = compileTable(spec);

function insideWall(x, y, layer) {
  for (const s of T.segs) {
    if (!(s.mask & layer)) continue;
    const abx = s.bx - s.ax, aby = s.by - s.ay, L = abx * abx + aby * aby;
    let t = ((x - s.ax) * abx + (y - s.ay) * aby) / L; t = Math.max(0, Math.min(1, t));
    if (Math.hypot(x - s.ax - abx * t, y - s.ay - aby * t) < BALL_R + s.r - 3) return true;
  }
  for (const c of T.circles) if ((c.mask & layer) && Math.hypot(x - c.x, y - c.y) < BALL_R + c.r - 3) return true;
  return false;
}
const inBlock = (x, y) => (x > 437 && x < 483 && y > 450 && y < 868);
const inMouth = (x, y) => { const s = (x - 392) * 0.45 + (y - 470) * 0.893, t = (x - 392) * 0.893 - (y - 470) * 0.45; return s > -20 && s < 200 && Math.abs(t) < 40; };
const outOfCabinet = (b) => b.x < 0 || b.x > T.width || b.y > T.height || b.y < -60;

function run(w, b, secs, stop) {
  for (let i = 0; i < secs / TICK; i++) { step(w); w.events.length = 0; if (stop && stop()) return i; }
  return -1;
}

export const tests = [
  {
    name: 'AC1 containment fuzz: 4000 seeded drops all drain', node: true,
    async run(t) {
      const rnd = mulberry32(2026);
      const res = { drained: 0, stuck: 0, escaped: 0, inside: 0 };
      for (let i = 0; i < 4000; i++) {
        const w = createWorld(T);
        let x, y;
        do { x = 20 + rnd() * 450; y = 150 + rnd() * 900; } while (insideWall(x, y, 1) || (Math.hypot(x - 264, y - 830) > 240 && y > 830) || inBlock(x, y) || inMouth(x, y) || x > 476);
        const a = rnd() * Math.PI * 2, sp = rnd() * 3500;
        const b = addBall(w, x, y, Math.cos(a) * sp, Math.sin(a) * sp);
        let out = 'timeout';
        for (let k = 0; k < 40 / TICK; k++) {
          step(w); w.events.length = 0;
          if (b.held && b.held.drained) { out = 'drained'; break; }
          if (b.held) { const h = T.holes.find((q) => q.sw === b.held.sw); kickOut(w, b, h.kickAngle, h.kickSpeed); }
          if (outOfCabinet(b)) { out = 'escaped'; break; }
          if (b.layer === 1 && k % 60 === 0 && insideWall(b.x, b.y, 1)) { out = 'inside'; break; }
          if (b.still > 4 && !(b.x > 480 && b.y < 140)) { out = 'stuck'; break; }
          if (b.x > 480 && b.y < 140 && b.still > 0.5) { out = 'drained'; break; }
        }
        res[out] = (res[out] || 0) + 1;
      }
      t.log(JSON.stringify(res));
      t.equal(res.drained, 4000, 'every drop drains');
    },
  },
  {
    name: 'AC2 no tunnelling at the speed cap', node: true,
    async run(t) {
      const rnd = mulberry32(7);
      let bad = 0, n = 0;
      for (let i = 0; i < 1500; i++) {
        const w = createWorld(T);
        let x, y;
        do { x = 25 + rnd() * 440; y = 140 + rnd() * 900; } while (insideWall(x, y, 1) || (Math.hypot(x - 264, y - 830) > 236 && y > 830) || inBlock(x, y) || inMouth(x, y) || x > 474);
        const a = rnd() * Math.PI * 2;
        const b = addBall(w, x, y, Math.cos(a) * MAX_SPEED, Math.sin(a) * MAX_SPEED);
        if (i % 3 === 0) { setFlipper(w, 'L', true); setFlipper(w, 'R', true); }
        for (let k = 0; k < 0.6 / TICK; k++) {
          step(w); w.events.length = 0;
          if (b.held) break;
          if (outOfCabinet(b) || (b.layer === 1 && x < 476 && b.x > 476 && b.y > 140 && b.y < 840)) { bad++; break; }
        }
        n++;
      }
      t.log(`${n} shots at ${MAX_SPEED} mm/s, ${bad} escaped`);
      t.equal(bad, 0, 'no ball leaves the table or crosses into the shooter lane');
    },
  },
  {
    name: 'AC3 every feature reachable from both flippers', node: true, slow: true,
    async run(t) {
      const mx = (x) => 485 - x;
      const want = ['rampMade', 'spinner', 'reserve', 'vaporsEnter', 'lockEnter', ...spec.walls.filter((wl) => wl.kind === 'TARGET').map((wl) => wl.sw)];
      const seen = { L: new Set(), R: new Set() };
      for (const side of ['L', 'R']) for (const feed of ['inlane', 'drop', 'cradle']) {
        for (let ft = feed === 'drop' ? 0.1 : 0.4; ft <= (feed === 'drop' ? 0.6 : 0.9); ft += 0.003) {
          const w = createWorld(T), L = side === 'L';
          let b;
          if (feed === 'inlane') b = addBall(w, L ? 74 : mx(74), 300, 0, -250);
          else if (feed === 'drop') b = addBall(w, L ? 205 : mx(205), 330, 0, 0);
          else { setFlipper(w, side, true); b = addBall(w, L ? 74 : mx(74), 300, 0, -250); for (let i = 0; i < 180; i++) step(w); setFlipper(w, side, false); w.events.length = 0; }
          const t0 = w.time;
          queueInput(w, t0 + ft, (q) => setFlipper(q, side, true));
          queueInput(w, t0 + ft + 0.25, (q) => setFlipper(q, side, false));
          for (let i = 0; i < 1.6 / TICK; i++) {
            step(w);
            for (const e of w.events) if (e.sw >= 0) seen[side].add(T.swName[e.sw]);
            w.events.length = 0;
            if (b.held) break;
          }
        }
      }
      for (const side of ['L', 'R']) {
        const missing = want.filter((n) => !seen[side].has(n));
        t.log(side, 'reaches', want.length - missing.length, 'of', want.length, missing.length ? 'missing ' + missing.join(',') : '');
      }
      const either = want.filter((n) => !seen.L.has(n) && !seen.R.has(n));
      t.equal(either.length, 0, 'every feature reached by at least one flipper: ' + either.join(','));
      for (const n of ['rampMade', 'spinner', 'vaporsEnter', 'lockEnter']) t.expect(seen.L.has(n) && seen.R.has(n), n + ' reached from both flippers');
    },
  },
  {
    name: 'AC4 a held flipper cradles a ball from the inlane', node: true,
    async run(t) {
      for (const side of ['L', 'R']) {
        const w = createWorld(T);
        setFlipper(w, side, true);
        const b = addBall(w, side === 'L' ? 74 : 411, 300, 0, -250);
        run(w, b, 1.5);
        t.expect(b.still > 0.2 && b.y > 100 && b.y < 200, `${side}: ball at rest on the flipper (${b.x.toFixed(0)}, ${b.y.toFixed(0)})`);
        setFlipper(w, side, false);
        run(w, b, 1.2);
        t.expect(b.still === 0 || b.y < 120, `${side}: releasing lets the ball roll`);
      }
    },
  },
  {
    name: 'AC5 the simulation is deterministic', node: true,
    async run(t) {
      const once = () => {
        const w = createWorld(T);
        addBall(w, 498.5, 104);
        for (let i = 0; i < 60; i++) step(w);
        autoPlunge(w, 0.83);
        const rnd = mulberry32(5);
        for (let i = 0; i < 60 / TICK; i++) {
          if (i % 37 === 0) setFlipper(w, rnd() < 0.5 ? 'L' : 'R', rnd() < 0.5);
          step(w); w.events.length = 0;
          if (w.balls[0].held && w.balls[0].held.drained) { w.balls[0].held = null; w.balls[0].x = 300; w.balls[0].y = 700; }
        }
        return JSON.stringify(snapshot(w));
      };
      t.equal(once(), once(), 'same inputs, same state after 60 s');
    },
  },
  {
    name: 'AC6 flips apply at the substep, not the tick', node: true,
    async run(t) {
      const angleAt = (ms) => { const w = createWorld(T); queueInput(w, ms / 1000, (q) => setFlipper(q, 'L', true)); for (let i = 0; i < 3; i++) step(w); return w.flippers[0].theta; };
      const a = angleAt(1.0), b = angleAt(3.1), c = angleAt(5.2);
      t.log('theta after 25 ms for flips at 1.0 / 3.1 / 5.2 ms:', a.toFixed(4), b.toFixed(4), c.toFixed(4));
      t.expect(a > b && b > c, 'later flips (within one 8.3 ms tick) give smaller angles');
    },
  },
  {
    name: 'AC7 plunge strength: soft falls back, full reaches the arch', node: true,
    async run(t) {
      const apex = (s) => { const w = createWorld(T); const b = addBall(w, 498.5, 104); for (let i = 0; i < 60; i++) step(w); autoPlunge(w, s); let a = 0; for (let i = 0; i < 3 / TICK; i++) { step(w); w.events.length = 0; a = Math.max(a, b.y); } return a; };
      t.expect(apex(0.3) < 600, 'soft plunge stays in the lane');
      t.expect(apex(1.0) > 1050, 'full plunge rounds the arch');
      const lanes = new Set();
      for (let s = 0.7; s <= 0.8; s += 0.005) {
        const w = createWorld(T); const b = addBall(w, 498.5, 104); for (let i = 0; i < 60; i++) step(w); autoPlunge(w, s);
        for (let i = 0; i < 3 / TICK; i++) { step(w); for (const e of w.events) if (e.sw >= 0 && /^lane/.test(T.swName[e.sw])) lanes.add(T.swName[e.sw]); w.events.length = 0; }
      }
      t.equal([...lanes].sort().join(','), 'laneA,laneP,laneS', 'every top lane is a skill-shot target');
    },
  },
  {
    name: 'boot: title and demo play without errors',
    async run(t) {
      const s = await t.state();
      t.equal(s.screen, 'title', 'title screen up');
      t.expect(s.demo, 'attract demo running');
      t.log('view', s.view, s.tier);
      await t.shot('m1-boot');
    },
  },
];

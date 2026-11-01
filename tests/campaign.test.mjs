// Mechanics test campaign (TEST-CAMPAIGN.md): rules state-fuzz against a shadow model, full-game soak, multiball
// physics fuzz, and edge cases. Every defect found gets a regression test here.
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, flipper, plunger, nudge, MODES, api, gameState } from '../src/js/sim/rules.js';
import { createBot } from '../src/js/sim/bot.js';
import { createWorld, addBall, step, kickOut, TICK, BALL_R } from '../src/js/sim/physics.js';
import { mulberry32 } from '../src/js/sim/rng.js';

const T = compileTable(spec);
const SWITCHES = Object.keys(T.sw);
const KIND = (n) => (n.startsWith('bumper') ? 'bumper' : n.startsWith('sling') ? 'sling' : n === 'spinner' ? 'spinner' : n.startsWith('bh') ? 'target' : 'hit');

// the shadow model: what simple switches must add to the score (outside modes, combos and multiballs)
function shadowDelta(G, name) {
  if (G.player.tilted || G.scene !== 'game') return 0;
  if (name.startsWith('sling')) return 110;
  if (name === 'inL' || name === 'inR') return 1000;
  if (name === 'outL' || name === 'outR') return 5000;
  return null;   // complex: checked by invariants only
}

function invariants(G, t, label) {
  const p = G.player, f = G.f;
  const bad = [];
  if (!Number.isFinite(p.score) || p.score < 0) bad.push('score ' + p.score);
  if (p.bonusX < 1 || p.bonusX > 5) bad.push('bonusX ' + p.bonusX);
  if (f.springTemp < 100 || f.springTemp > 143) bad.push('springTemp ' + f.springTemp);
  if (f.locks < 0 || f.locks > 2) bad.push('locks ' + f.locks);
  if (f.towerLevel < 0 || f.towerLevel > 3) bad.push('towerLevel ' + f.towerLevel);
  if (p.ball < 1 || p.ball > p.ballsPerGame) bad.push('ball ' + p.ball);
  if (G.mode && G.mode.end - G.t > 60) bad.push('mode timer ' + (G.mode.end - G.t));
  if (G.mode && G.mb && G.mb.kind === 'valley') bad.push('mode during wizard');
  for (const b of G.w.balls) if (!Number.isFinite(b.x) || !Number.isFinite(b.y) || !Number.isFinite(b.vx)) bad.push('NaN ball');
  if (bad.length) t.fail(label + ': ' + bad.join(', '));
  return !bad.length;
}

export const tests = [
  {
    name: 'campaign: rules state-fuzz against the shadow model (20,000 events)', node: true,
    async run(t) {
      const rnd = mulberry32(42);
      let events = 0, checked = 0, mismatches = 0, ok = true;
      for (let g = 0; g < 40 && ok; g++) {
        const G = createGame(T, { seed: g + 1 }); newGame(G, { seed: g + 1 });
        G.ball.inLane = false;
        for (let i = 0; i < 500; i++) {
          const r = rnd();
          if (r < 0.75) {
            const name = SWITCHES[Math.floor(rnd() * SWITCHES.length)];
            const want = shadowDelta(G, name);
            const s0 = G.player.score, mode0 = G.mode, mb0 = G.mb;
            G.w.events.push({ t: KIND(name), sw: T.sw[name], speed: 400 + rnd() * 2000, dir: rnd() < 0.8 ? 1 : -1, ball: G.w.balls[0] && G.w.balls[0].id, x: 240, y: 400 });
            tick(G); events++;
            if (want != null && !mode0 && !mb0 && G.player.score - s0 !== want && G.scene === 'game') { mismatches++; if (mismatches < 5) t.log('mismatch', name, G.player.score - s0, 'want', want); }
            else if (want != null) checked++;
          } else if (r < 0.8) { const bb = G.w.balls.find((q) => q.held && !q.held.drained); if (bb) kickOut(G.w, bb, -1.2, 900); for (let k = 0; k < 30; k++) tick(G); }
          else if (r < 0.83) { nudge(G, ['left', 'right', 'up'][Math.floor(rnd() * 3)]); tick(G); }
          else if (r < 0.86) { const b = G.w.balls.find((q) => !q.held); if (b) G.w.events.push({ t: 'drain', ball: b.id, x: 240 }); tick(G); }
          else if (r < 0.9) { flipper(G, rnd() < 0.5 ? 'L' : 'R', rnd() < 0.5); tick(G); }
          else { for (let k = 0; k < 60; k++) tick(G); }
          if (G.scene === 'over') { newGame(G, { seed: g + 100 + i }); G.ball.inLane = false; }
          if (!invariants(G, t, `game ${g} step ${i}`)) { ok = false; break; }
        }
      }
      t.log(`${events} switch events, ${checked} checked against the shadow model, ${mismatches} mismatches`);
      t.equal(mismatches, 0, 'scores match the shadow model');
    },
  },
  {
    name: 'campaign: 150 bot games finish cleanly', node: true, slow: true,
    async run(t) {
      let total = 0, maxSecs = 0, exceptions = 0;
      for (let g = 0; g < 150; g++) {
        const G = createGame(T, { seed: 1000 + g }); newGame(G, { balls: 3, seed: 1000 + g });
        const bot = createBot(G, { skill: 0.9, seed: g });
        let n = 0;
        try {
          while (G.scene !== 'over' && n < 30 * 60 * 120) { bot(); tick(G); G.cues.length = 0; n++; if (n % 600 === 0) invariants(G, t, 'soak game ' + g); }
        } catch (e) { exceptions++; t.fail('game ' + g + ' threw ' + e.message); }
        if (G.scene !== 'over') t.fail('game ' + g + ' did not end in 30 minutes');
        total += n; maxSecs = Math.max(maxSecs, n / 120);
      }
      t.log(`150 games, ${(total / 120 / 60).toFixed(0)} sim minutes, longest ${maxSecs.toFixed(0)} s, ${exceptions} exceptions`);
    },
  },
  {
    name: 'campaign: three-ball physics fuzz (no escapes, no overlaps)', node: true,
    async run(t) {
      const rnd = mulberry32(9);
      let bad = 0;
      for (let i = 0; i < 600; i++) {
        const w = createWorld(T);
        const bs = [0, 1, 2].map((k) => addBall(w, 150 + k * 80 + rnd() * 20, 600 + rnd() * 200, (rnd() - 0.5) * 3000, (rnd() - 0.5) * 3000));
        for (let s = 0; s < 6 / TICK; s++) {
          step(w); w.events.length = 0;
          for (const b of bs) if (b.held && !b.held.drained) { const h = T.holes.find((q) => q.sw === b.held.sw); kickOut(w, b, h.kickAngle, h.kickSpeed); }
          const live = bs.filter((b) => !b.held);
          if (live.some((b) => b.x < 0 || b.x > T.width || b.y > T.height)) { bad++; break; }
          if (s % 30 === 0) for (let a = 0; a < live.length; a++) for (let c = a + 1; c < live.length; c++) if (live[a].layer === live[c].layer && Math.hypot(live[a].x - live[c].x, live[a].y - live[c].y) < BALL_R * 2 - 4) { bad++; s = 1e9; }
        }
      }
      t.equal(bad, 0, 'no escapes or deep overlaps in 600 three-ball runs');
    },
  },
  {
    name: 'campaign edge: drain during a mode intro, tilt in multiball, game over with a mode running', node: true,
    async run(t) {
      // drain while the Vapors holds the ball for a mode intro (mode not started yet)
      let G = createGame(T, { seed: 3 }); newGame(G, { seed: 3 }); G.ball.inLane = false;
      api.startMode(G, 0);
      const b0 = G.w.balls[0]; G.ball.saveUntil = 0;
      G.w.events.push({ t: 'drain', ball: b0.id, x: 240 }); tick(G);
      t.equal(G.mode, null, 'draining the last ball ends the mode'); t.equal(G.f.modesPlayed[0], 1, 'mode counted as played');
      // tilt during multiball
      G = createGame(T, { seed: 4 }); newGame(G, { seed: 4 }); G.ball.inLane = false;
      api.startArlington(G); for (let i = 0; i < 600; i++) tick(G);
      for (let i = 0; i < 12; i++) nudge(G, 'up');
      t.expect(G.player.tilted, 'tilted in multiball');
      flipper(G, 'L', true);
      t.expect(!G.w.flippers[0].held, 'flippers dead when tilted');
      let safety = 0;
      while (G.scene === 'game' && safety++ < 60 * 120) { tick(G); }
      t.expect(G.scene !== 'game' || G.w.balls.length === 0, 'tilted balls drain and the ball ends');
      // game over while a mode runs
      G = createGame(T, { seed: 5 }); newGame(G, { seed: 5 }); G.ball.inLane = false;
      G.player.ball = 3; api.startMode(G, 2); for (let i = 0; i < 300; i++) tick(G);
      G.ball.saveUntil = 0; G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 }); tick(G);
      for (let i = 0; i < 400; i++) tick(G);
      t.equal(G.scene, 'over', 'game over'); t.equal(G.mode, null, 'no mode left running');
    },
  },
  {
    name: 'campaign edge: extra ball after a tilt, plunger with no ball, lock while multiball', node: true,
    async run(t) {
      let G = createGame(T, { seed: 6 }); newGame(G, { seed: 6 }); G.ball.inLane = false;
      G.player.extraBalls = 1;
      for (let i = 0; i < 12; i++) nudge(G, 'up');
      G.ball.saveUntil = 0; G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 }); tick(G);
      for (let i = 0; i < 400; i++) tick(G);
      t.expect(G.player.ball === 1 && !G.player.tilted && G.player.extraBalls === 0, 'shoot again after a tilted ball, untilted');
      // plunger pull with no ball in the lane
      G.w.balls.length = 0; plunger(G, true); for (let i = 0; i < 60; i++) tick(G); plunger(G, false); for (let i = 0; i < 60; i++) tick(G);
      t.equal(G.w.balls.length, 0, 'an empty plunge does nothing');
      // a lock shot during multiball must not lock
      G = createGame(T, { seed: 7 }); newGame(G, { seed: 7 }); G.ball.inLane = false;
      api.startGrandSoak(G); for (let i = 0; i < 400; i++) tick(G);
      G.f.lockLit = true;
      const h = T.holes.find((q) => q.name === 'lock'), b = G.w.balls.find((q) => !q.held);
      b.held = { sw: h.sw }; b.x = h.x; b.y = h.y; G.w.events.push({ t: 'hole', sw: h.sw, ball: b.id }); tick(G);
      t.equal(G.f.locks, 0, 'no lock during a multiball');
    },
  },
  {
    name: 'campaign edge: pause during a held flip releases the flippers',
    viewports: ['desktop'],
    async run(t) {
      await t.game('scene', 'game');
      await t.page.keyboard.down('KeyZ'); await t.page.waitForTimeout(60);
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(60);
      await t.page.keyboard.up('KeyZ');
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(100);
      const s = await t.state();
      t.expect(!s.physics.flippers.find((f) => f.side === 'L').held, 'left flipper released after pause and resume');
    },
  },
  {
    name: 'campaign edge: keys ignored while menus are open; Esc backs out of settings',
    viewports: ['desktop'],
    async run(t) {
      await t.game('scene', 'game');
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(80);
      await t.page.locator('#b-settings').click();
      await t.page.keyboard.down('KeyZ'); await t.page.waitForTimeout(60); await t.page.keyboard.up('KeyZ');
      let s = await t.state(); t.expect(!s.physics.flippers[0].held, 'flipper not driven from the settings menu');
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(80);
      s = await t.state(); t.equal(s.screen, 'pause', 'Esc returns from settings to the pause menu');
    },
  },
];

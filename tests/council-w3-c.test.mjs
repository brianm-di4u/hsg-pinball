// Council wave 3, batch C: controls, rules and play; difficulty, progression and records
// (S3-09, S6-14, S1-18, S1-27, CL-02, S1-08, S3-02, S4-22, S6-08).
// Sim rules run in Node on the sim itself, with fixed seeds, so they give the same answer every run; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGovernor, GOV } from '../src/js/gfx/view3d.js';
import { createGame, newGame, tick, api, nextModeIndex, LADDER, MODES, WIZARD } from '../src/js/sim/rules.js';
import { simulate, verdict, TARGETS } from '../tools/balance.mjs';
import { dailySeed } from '../src/js/progress.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadUntilSlow } from './governor-load.mjs';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, 'screenshots', 'council', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

const T = compileTable(spec);
const fresh = (seed = 1, o = {}) => { const G = createGame(T, { seed }); newGame(G, { seed, ...o }); G.cues.length = 0; return G; };
const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };
const play = (G, i, won) => { api.startMode(G, i); api.endMode(G, won); };
const drainLast = (G) => {
  G.player.ball = G.player.ballsPerGame - 1; G.ball.saveUntil = 0; G.ball.inLane = false; G.ball.launched = true;
  G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 });
  tick(G);
};

const held = (st, side) => st.physics.flippers.find((f) => f.side === side).held;
const inLane = (st) => st.physics.balls.some((b) => !b.held && b.x > 480 && b.y < 160);
const launchBox = (t) => t.page.evaluate(() => { const r = document.querySelector('#b-launch').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; });
const touchSession = (t) => t.page.context().newCDPSession(t.page);
const finger = (id, x, y) => ({ x, y, id, radiusX: 8, radiusY: 8, force: 1 });

export const tests = [
  // ---------------------------------------------------------------------------------------------- S3-09
  {
    name: 'S3-09 six lost modes light neither the extra ball nor the wizard; two wins light the extra ball and four the wizard',
    node: true,
    async run(t) {
      const G = fresh(2);
      for (let i = 0; i < 6; i++) play(G, i, false);
      run(G, 3);
      t.equal(G.f.modesPlayed.join(''), '111111', 'all six were played');
      t.expect(!G.f.ebLit && !G.f.wizardLit, 'and lost: no extra ball (' + G.f.ebLit + ') and no wizard (' + G.f.wizardLit + ')');
      const H = fresh(3);
      play(H, 0, true); play(H, 1, false); run(H, 3);
      t.expect(!H.f.ebLit, 'one win is not enough for the extra ball');
      play(H, 2, true); run(H, 3);
      t.expect(H.f.ebLit && !H.f.wizardLit, 'two wins light the extra ball, not the wizard');
      play(H, 3, true); run(H, 3);
      t.expect(!H.f.wizardLit, 'three wins do not light the wizard');
      play(H, 4, true); run(H, 3);
      t.expect(H.f.wizardLit, 'four wins do, with two modes never played (' + H.f.modesPlayed.join('') + ')');
      t.equal(LADDER.wizardWins, 4, 'the constant says four');
    },
  },
  {
    name: 'S3-09 the bonus pays 15,000 for a won mode and 5,000 for one only played, and a tilt does not count the mode',
    node: true,
    async run(t) {
      const G = fresh(4);
      play(G, 0, true); play(G, 1, false); play(G, 2, false);
      drainLast(G);
      t.equal(G.bonus.parts.find((p) => p[0] === 'MODES')[1], 15000 + 5000 + 5000, 'one win and two losses: ' + JSON.stringify(G.bonus.parts));
      const H = fresh(5);
      api.startMode(H, 3); run(H, 3);
      api.tilt(H);
      t.equal(H.mode, null, 'the tilt ends the mode');
      t.equal(H.f.modesPlayed[3], 0, 'and it is not counted as played');
      t.equal(H.f.modesWon[3], 0, 'or won');
      const K = fresh(6);
      api.startMode(K, 2); run(K, 60);
      t.equal(K.mode, null, 'a mode that runs out of time ends');
      t.equal(K.f.modesPlayed[2] + '' + K.f.modesWon[2], '10', 'and counts as played, not won');
    },
  },
  {
    name: 'S3-09 with all six played and fewer than four won, the Vapors serves a lost mode again; after the wizard the wins start over',
    node: true,
    async run(t) {
      const G = fresh(7);
      for (const i of [0, 1, 2, 3, 4, 5]) play(G, i, i === 1);   // only Derby won
      G.f.nextMode = 0;
      t.equal(nextModeIndex(G.f), 0, 'Soak, which was lost, is offered again');
      G.f.modesWon[0] = 1; G.f.nextMode = 0;
      t.equal(nextModeIndex(G.f), 2, 'and the next lost one when that was won');
      const H = fresh(8);
      H.f.modesWon = [1, 1, 1, 1, 0, 0]; H.f.modesPlayed = [1, 1, 1, 1, 0, 0]; H.f.wizardLit = true;
      api.startValley(H); api.endMultiball(H);
      t.equal(H.f.modesWon.join('') + H.f.modesPlayed.join(''), '000000000000', 'the wizard ends and the ladder is empty again');
      t.expect(!H.f.wizardLit, 'the wizard is not lit again at once');
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-14
  {
    name: 'S6-14 a thumb that slides off Launch lets the pull go without firing the ball; lifting it on the button still fires',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.waitFrames(8);
      const [x, y] = await launchBox(t);
      t.expect(inLane(await t.state()), 'the ball waits in the shooter lane');
      await t.touchDrag([x, y], [x - 160, y - 260], { steps: 8, holdMs: 500, holdEndMs: 150 });
      await t.waitFrames(30);
      let s = await t.state();
      t.expect(inLane(s), 'sliding off and lifting did not fire the ball: it is still in the lane');
      t.equal(s.physics.plunger.holding, false, 'the plunger is not held');
      t.expect(s.physics.plunger.pull < 0.5, 'and the pull has gone back to rest: ' + s.physics.plunger.pull);
      await t.touchDrag([x, y], [x, y], { steps: 1, holdMs: 700 });
      for (let i = 0; i < 60 && inLane(await t.state()); i++) await t.page.waitForTimeout(50);
      t.expect(!inLane(await t.state()), 'a hold and lift on the button fires the ball out of the lane');
    },
  },
  {
    name: 'S6-14 a nudge with a second finger on the same side nudges and does not flip the other flipper, and everything lets go when the fingers lift',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(300);
      const cdp = await touchSession(t);
      const w = t.page.viewportSize().width, h = t.page.viewportSize().height;
      const y = Math.round(h * 0.55);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [finger(1, Math.round(w * 0.2), y), finger(2, Math.round(w * 0.3), y)] });   // two fingers land together on the left half
      await t.waitFrames(6);
      const s = await t.state();
      t.expect(s.player.bob > 0, 'the second finger nudged: ' + s.player.bob);
      t.expect(held(s, 'L') && !held(s, 'R'), 'one thumb holds the left flipper and the right one is not pressed');
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await t.waitFrames(8);
      const e = await t.state();
      t.expect(!held(e, 'L') && !held(e, 'R'), 'both flippers let go when the fingers lift');
    },
  },
  // ---------------------------------------------------------------------------------------------- S4-22
  {
    name: 'S4-22 the medium tier flares a glow at a sling or bumper hit with no extra light, high keeps its flashers, and low has neither',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(200);
      const flash = (sw) => t.page.evaluate((n) => { const g = window.__game; g.act('switch', n); g.step(1); return g.getState().gfx; }, sw);
      const read = async (tier) => {
        await t.game('act', 'tier', tier);
        await t.waitFrames(6);
        const before = (await t.state()).gfx;
        const hit = await flash('slingL');
        return { before, hit };
      };
      const med = await read('medium');
      t.equal(med.before.tier, 'medium', 'the medium tier is on');
      t.expect(med.hit.glow > 0.3, 'a sling hit lights the glow on the medium tier: ' + med.hit.glow);
      t.equal(med.hit.pointLights, 2, 'with the two fill lights it always had and no flasher light: ' + med.hit.pointLights);
      t.expect(med.before.glow === 0, 'and the glow is off when nothing hit');
      await t.game('act', 'tier', 'medium'); await t.waitFrames(6);
      await t.game('act', 'clock', 5000);   // the picture holds still on the flash, for the screenshot
      await flash('bumper1');
      await shot(t, 'S4-22-medium-glow');
      await t.game('act', 'clock', null);
      const high = await read('high');
      t.expect(high.hit.pointLights >= 6 && high.hit.glow === 0, 'high keeps its two flasher lights and no sprite: ' + JSON.stringify(high.hit));
      const low = await read('low');
      t.expect(low.hit.pointLights === 0 && low.hit.glow === 0, 'low has neither: ' + JSON.stringify(low.hit));
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-08, S1-27
  {
    name: 'S6-08 the governor steps down on slow frames, and back up after ten steady seconds, once, to the tier it fell from',
    node: true,
    async run(t) {
      // feed frames of ms each; the result is the action and how many frames it took, or null
      const feed = (g, tier, ms, secs, canUp) => { const n = Math.round(secs * 1000 / ms); for (let i = 0; i < n; i++) { const a = g.push(ms / 1000, tier, canUp); if (a) return { a, frames: i + 1 }; } return null; };
      const g = createGovernor();
      const down = feed(g, 'medium', 40, 5);
      t.expect(down && down.a === 'down' && down.frames === 61, 'a full window of slow frames, seen twice, steps medium down: ' + JSON.stringify(down));
      t.equal(feed(g, 'low', 16.7, 9), null, 'nine steady seconds at low is not enough to step up');
      const up = feed(g, 'low', 16.7, 6);
      t.expect(up && up.a === 'up', 'ten steady seconds steps back up to the tier it fell from: ' + JSON.stringify(up));
      const again = feed(g, 'medium', 40, 5);
      t.expect(again && again.a === 'down', 'falling again right after the step up steps down');
      t.equal(feed(g, 'low', 16.7, 40), null, 'and that tier is given up for the session: no second step up');
      // a tier that held for twenty seconds is not given up for one stall
      const h = createGovernor();
      feed(h, 'medium', 40, 5);
      t.equal(feed(h, 'low', 16.7, 20).a, 'up', 'again: back up after the steady seconds');
      t.equal(feed(h, 'medium', 16.7, 25), null, 'it holds for 25 s');
      t.equal(feed(h, 'medium', 40, 5).a, 'down', 'a stall steps it down');
      t.equal(feed(h, 'low', 16.7, 20).a, 'up', 'and it may step up again, because the tier had proved itself');
      // it never climbs above where it has not fallen from, a slow-ish 20 ms frame is not steady, a player's own tier is left alone
      const k = createGovernor();
      t.equal(feed(k, 'medium', 16.7, 40), null, 'steady frames at a tier it never fell from do nothing');
      const w = createGovernor(); w.allowUpTo('medium');
      t.equal(feed(w, 'low', 20, 40), null, '20 ms frames are not steady enough');
      t.equal(feed(w, 'low', 16.7, 40, false), null, 'a player-chosen tier (canUp false) is not raised');
      t.equal(feed(createGovernor(), 'low', 60, 10).a, 'toolow', 'frames of 60 ms at low still say it is too slow');
      t.equal(GOV.fastSecs, 10, 'the constants are there to be read');
    },
  },
  {
    name: 'S6-08 the tier the governor settled on is saved and Automatic starts there; a damaged value is ignored and choosing Automatic again clears it',
    viewports: ['mobile', 'desktop'],
    async run(t) {
      const put = (v) => t.page.evaluate((x) => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, tipsSeen: true, ...x })), v);
      const tier = async () => { await t.page.reload(); await t.waitIdle(30000); return (await t.state()).tier; };
      const mobile = t.viewport === 'mobile';
      await put({ tier: 'auto' });
      t.equal(await tier(), mobile ? 'medium' : 'high', 'with nothing learned Automatic starts where it always did');
      await put({ tier: 'auto', tierLearned: 'low' });
      t.equal(await tier(), 'low', 'a learned low is where it starts');
      await put({ tier: 'auto', tierLearned: 'high' });
      t.equal(await tier(), mobile ? 'medium' : 'high', 'a learned tier above the device\'s own top is not used');
      await put({ tier: 'auto', tierLearned: 'ultra' });
      t.equal(await tier(), mobile ? 'medium' : 'high', 'a damaged value is ignored');
      await put({ tier: 'medium', tierLearned: 'low' });
      t.equal(await tier(), 'medium', 'a tier the player picked beats what was learned');
      await t.game('act', 'tier', 'auto');
      t.equal(await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings')).tierLearned), '', 'choosing Automatic again clears it');
    },
  },
  {
    name: 'S6-08 under load the governor steps down in play and the tier it lands on is saved for the next visit',
    viewports: ['mobile'],
    initScript: () => { window.__GOVERNOR__ = true; },
    async run(t) {
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, tipsSeen: true, tier: 'auto' })));
      await t.page.reload(); await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('act', 'plunge', 0.9);
      // A six-times throttle does not make a fast desktop GPU's frames slow, and the governor then rightly keeps its tier: load the CPU
      // until the frames really are slow (tests/governor-load.mjs), then expect the step down and the saved landing tier.
      const load = await loadUntilSlow(t);
      let s = await t.state();
      for (let i = 0; load && i < 120 && s.tier !== 'low'; i++) { await t.page.waitForTimeout(500); s = await t.state(); }
      await t.cpuThrottle(1);
      if (!load) { t.log('skipped: this machine stays fast even at 32x, so there is nothing for the governor to do'); return; }
      t.log(`frames slow at ${load.rate}x (${load.fps} fps); tier ${s.tier}`);
      t.equal(s.tier, 'low', 'the governor fell to low once the frames were slow');
      t.equal(await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings')).tierLearned), 'low', 'and the landing tier is saved');
    },
  },
  {
    name: 'S1-27 a phone with four cores or fewer starts Automatic on the low tier, one with more starts on medium, and what was learned beats the core count',
    viewports: ['mobile'],
    initScript: () => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => { try { return +localStorage.getItem('cores') || 8; } catch { return 8; } } }); },
    async run(t) {
      const start = async (cores, extra = {}) => {
        await t.page.evaluate(([c, x]) => { localStorage.setItem('cores', String(c)); localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, tipsSeen: true, tier: 'auto', ...x })); }, [cores, extra]);
        await t.page.reload(); await t.waitIdle(30000);
        return (await t.state()).tier;
      };
      t.equal(await start(4), 'low', 'four cores: low');
      t.equal(await start(2), 'low', 'two cores: low');
      t.equal(await start(8), 'medium', 'eight cores: medium, as before');
      t.equal(await start(4, { tierLearned: 'medium' }), 'medium', 'four cores that proved they can do medium last time start there');
      await t.page.evaluate(() => localStorage.removeItem('cores'));
    },
  },
  // ---------------------------------------------------------------------------------------------- S1-08
  {
    name: 'S1-08 on a phone in portrait Menu and the speaker sit beside the display, and the bottom fifth of the screen is left to the flippers and Launch',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.waitFrames(8);
      for (const [w, h] of [[390, 844], [360, 640], [375, 667]]) {
        await t.page.setViewportSize({ width: w, height: h });
        await t.waitFrames(6);
        const m = await t.page.evaluate(() => {
          const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; };
          return { menu: r('#b-menu'), mute: r('#b-mute'), dmd: r('.dmd-frame'), launch: r('#b-launch'), table: r('#table'), vw: innerWidth, vh: innerHeight };
        });
        const at = w + 'x' + h;
        for (const k of ['menu', 'mute']) {
          const b = m[k];
          t.expect(b.r - b.l >= 44 && b.b - b.t >= 44, at + ' ' + k + ' is at least 44 px: ' + Math.round(b.r - b.l) + 'x' + Math.round(b.b - b.t));
          t.expect(b.b <= m.vh * 0.5, at + ' ' + k + ' is in the top half, not under a thumb: bottom ' + Math.round(b.b));
          t.expect(b.l >= m.dmd.r - 0.5 && b.r <= m.vw + 0.5, at + ' ' + k + ' sits beside the display, not over it');
          t.expect(b.b <= m.table.t + 0.5, at + ' ' + k + ' is above the table, in the display row');
        }
        t.expect(m.table.t <= 150, at + ': the table starts no lower than it did (150 px): ' + Math.round(m.table.t));
        t.expect(m.dmd.r - m.dmd.l >= 200, at + ': the display keeps at least 200 px: ' + Math.round(m.dmd.r - m.dmd.l));
        t.expect(m.launch.l > m.vw * 0.5 && m.launch.t > m.vh * 0.8, at + ' Launch stays at the bottom right');
        if (w === 390) await shot(t, 'S1-08-menu-top');
      }
      await t.page.setViewportSize({ width: 390, height: 844 });
      await t.waitFrames(4);
      const c = await t.page.evaluate(() => { const b = document.querySelector('#b-menu').getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; });
      await t.tap(c);
      await t.waitFrames(6);
      t.equal((await t.state()).screen, 'pause', 'a tap on Menu still pauses');
    },
  },
  // ---------------------------------------------------------------------------------------------- CL-02
  {
    name: 'CL-02 a game starts its ladder at the mode it is given and the order after it is unchanged; the display names the first mode',
    node: true,
    async run(t) {
      for (let k = 0; k < 6; k++) {
        const F = fresh(30 + k, { firstMode: k });
        t.equal(F.f.nextMode, k, 'the ladder starts at place ' + k);
      }
      const G = createGame(T, { seed: 40 }); newGame(G, { seed: 40, firstMode: 4 });
      const shown = G.cues.filter((c) => c.k === 'dmd').map((c) => c.text + '|' + c.sub);
      t.expect(shown.includes('FIRST MODE|TUB RACE'), 'the display says FIRST MODE, TUB RACE: ' + shown.join(' / '));
      const order = [];
      for (let n = 0; n < 6; n++) { api.startMode(G); order.push(G.mode.i); api.endMode(G, true); }
      t.equal(order.join(), '4,5,0,1,2,3', 'the six modes follow in the old order, round from the first');
      const D = createGame(T, { seed: 41 }); newGame(D, { seed: 41 });
      t.equal(D.f.nextMode, 0, 'with no start given the ladder begins at Soak, as it did');
      t.expect(!D.cues.some((c) => c.k === 'dmd' && c.text === 'FIRST MODE'), 'and says nothing about it');
    },
  },
  {
    name: 'CL-02 over 60 consecutive bot games on Standard every mode is reached in at least 10% of them, with the side drains unchanged',
    node: true,
    async run(t) {
      const rot = simulate({ games: 60, skill: 0.8, seed: 1, rotate: true });
      const fix = simulate({ games: 60, skill: 0.8, seed: 1, rotate: false });
      const lows = Object.entries(rot.reachShare).filter(([k, v]) => MODES.some((m) => m.id === k) && v < TARGETS.rotatedReachMin).map(([k]) => k);
      t.expect(lows.length === 0, 'every mode is reached in at least 10% of games: ' + MODES.map((m) => m.id + ' ' + Math.round(rot.reachShare[m.id] * 100) + '%').join(', '));
      t.expect(MODES.some((m) => fix.reachShare[m.id] < TARGETS.rotatedReachMin), 'while with every game starting at Soak some mode is not (the thing this fixes): coaster ' + Math.round(fix.reachShare.coaster * 100) + '%');
      t.expect(Math.abs(rot.sideShare - fix.sideShare) < 0.03 && rot.sideShare < TARGETS.sideMax, 'side drains are unchanged: ' + (rot.sideShare * 100).toFixed(1) + '% against ' + (fix.sideShare * 100).toFixed(1) + '%');
      t.expect(rot.ballAvg >= TARGETS.ballMin && rot.ballAvg <= TARGETS.ballMax, 'the ball time stays inside its target: ' + rot.ballAvg.toFixed(1) + ' s');
      t.expect(!verdict(rot).some((m) => !/arlington/.test(m)), 'the balance verdict misses nothing but the Arlington, as before: ' + verdict(rot).join('; '));
    },
  },
  {
    name: 'CL-02 each game a player starts begins at the next mode; the count is saved; a daily table takes its first mode from the date; a resumed game keeps its own',
    async run(t) {
      const ladderOn = () => t.page.evaluate(() => { window.__game.ladder = true; });
      const startedCount = () => t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:stats')).started);
      await t.page.evaluate(() => localStorage.clear());
      await t.page.reload(); await t.waitIdle(30000);
      await ladderOn();
      const first = async () => { await t.game('scene', 'game'); return (await t.state()).features.nextMode; };
      const seq = [];
      for (let i = 0; i < 7; i++) seq.push(await first());
      t.equal(seq.join(), '0,1,2,3,4,5,0', 'seven games start at consecutive modes and come round');
      t.equal(await startedCount(), 7, 'the count of games started is saved with the records');
      await t.page.reload(); await t.waitIdle(30000);
      await ladderOn();
      t.equal(await first(), 1, 'and after a reload the eighth game starts at place 1');
      // the daily table: from the date, the same for everyone that day, and it does not use up the count
      const dayMode = async (d) => { await t.game('setToday', d); await t.game('startDaily'); return (await t.state()).features.nextMode; };
      const want = (d) => dailySeed(d) % 6;
      const dates = ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18'];
      for (const d of dates) t.equal(await dayMode(d), want(d), 'the daily table of ' + d + ' starts at place ' + want(d));
      t.equal(await dayMode(dates[0]), want(dates[0]), 'and starting that day again gives the same one');
      t.expect(new Set(dates.map(want)).size > 1, 'the dates give more than one first mode');
      await t.game('setToday', null);
      t.equal(await startedCount(), 8, 'the daily games did not change the count');
      // a resumed game keeps the ladder it started with
      await first();
      await t.game('setState', { features: { nextMode: 4 }, player: { ball: 2, score: 5000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      t.equal(await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:resume')).features.nextMode), 4, 'the saved game holds its ladder place');
      const started = await startedCount();
      await t.page.reload(); await t.waitIdle(30000);
      await ladderOn();
      await t.page.click('#b-continue'); await t.waitFrames(5);
      t.equal((await t.state()).features.nextMode, 4, 'Continue picks the ladder up where it was');
      t.equal(await startedCount(), started, 'and does not count as a new game');
      await t.page.evaluate(() => localStorage.clear());
    },
  },
  {
    name: 'CL-02 the first mode is shown on the display before the first ball and marked in the mode list',
    async run(t) {
      await t.page.evaluate(() => localStorage.clear());
      await t.page.reload(); await t.waitIdle(30000);
      await t.page.evaluate(() => { localStorage.setItem('hsg-pinball:stats', JSON.stringify({ v: 1, started: 3 })); });
      await t.page.reload(); await t.waitIdle(30000);
      await t.page.evaluate(() => { window.__game.ladder = true; });
      await t.game('scene', 'game');
      const s = await t.state();
      t.equal(s.features.nextMode, 3, 'the fourth game starts at Tower Climb');
      t.expect(s.callouts.includes('FIRST MODE'), 'the display carries FIRST MODE: ' + s.callouts.join(' / '));
      t.expect(s.ballsInPlay === 1 && !s.player.score, 'before the first ball is plunged');
      if (t.viewport === 'desktop') {
        const cls = await t.page.evaluate(() => [...document.querySelectorAll('#modegrid li')].map((li) => li.className));
        t.equal(cls.join(), ',,,next,,', 'the mode list marks Tower as next: ' + cls.join('|'));
      }
      await t.page.waitForTimeout(2400);
      await shot(t, 'CL-02-first-mode');
      await t.page.evaluate(() => localStorage.clear());
    },
  },
  // ---------------------------------------------------------------------------------------------- S3-02
  {
    name: 'S3-02 the Valley of the Vapors ends when its time is up, with the balls still in play, and the round goes up',
    node: true,
    async run(t) {
      const G = fresh(50);
      G.ball.inLane = false;
      api.startValley(G);
      run(G, 4);
      t.expect(G.mb && G.mb.kind === 'valley', 'the wizard is running');
      t.equal(WIZARD.secs, 62, 'it lasts 62 seconds');
      t.equal(Math.round(G.mb.end - G.mb.t0), 62, 'and its clock says so');
      G.cues.length = 0;
      G.mb.end = G.t + 0.5;
      const balls = G.w.balls.length;
      run(G, 1);
      t.equal(G.mb, null, 'the wizard is over when the clock runs out, not when the balls drain');
      const texts = G.cues.filter((c) => c.k === 'dmd').map((c) => c.text);
      t.expect(texts.includes('THE VAPORS CLEAR') && texts.includes('WIZARD MODE OVER'), 'the display says it: ' + texts.join(' / '));
      t.expect(G.w.balls.length === balls && balls >= 1, 'the balls are still on the table, playing on');
      t.equal(G.f.wizards, 1, 'it counts as a finished wizard');
      t.equal(G.f.round, 1, 'and the round went up');
      t.expect(!G.f.wizardLit && G.f.modesWon.every((v) => !v), 'with the ladder empty again');
    },
  },
  {
    name: 'S3-02 the Valley multiplier doubles every 10 seconds up to 8x, so a shot pays 400,000 at the top (it was 32x, 1.6 million)',
    node: true,
    async run(t) {
      const G = fresh(51);
      G.ball.inLane = false;
      api.startValley(G);
      G.mb.t0 = G.t - 100;   // long enough for every doubling
      tick(G);
      t.equal(G.mb.mult, 8, 'the multiplier stops at 8: ' + G.mb.mult);
      G.w.events.push({ t: 'hit', sw: G.T.sw.rampMade, speed: 2800, dir: 1, ball: (G.w.balls[0] || {}).id }); tick(G);
      t.equal(G.mb.total, WIZARD.shot * 8, 'a shot pays the base value times 8: ' + G.mb.total);
      const H = fresh(52);
      H.ball.inLane = false;
      api.startValley(H);
      const steps = [];
      for (const s of [0, 10, 20, 30, 40, 50, 60]) { H.mb.t0 = H.t - s - 0.1; tick(H); steps.push(H.mb.mult); }
      t.equal(steps.join(), '1,2,4,8,8,8,8', 'one, two, four, eight, then it holds: ' + steps.join());
    },
  },
];

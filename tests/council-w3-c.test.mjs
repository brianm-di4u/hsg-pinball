// Council wave 3, batch C: controls, rules and play; difficulty, progression and records
// (S3-09, S6-14, S1-18, S1-27, CL-02, S1-08, S3-02, S4-22, S6-08).
// Sim rules run in Node on the sim itself, with fixed seeds, so they give the same answer every run; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, nextModeIndex, LADDER } from '../src/js/sim/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
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
];

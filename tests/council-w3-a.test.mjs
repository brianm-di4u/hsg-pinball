// Council wave 3, batch A: saves, lifecycle and robustness (S1-07, S2-19, S2-29, S3-08, S4-03, S5-08, S5-09, S6-05).
// Sim rules run in Node on the sim itself; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick } from '../src/js/sim/rules.js';
import { addBall } from '../src/js/sim/physics.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

const T = compileTable(spec);
const fresh = (seed = 1) => { const G = createGame(T, { seed }); newGame(G, { seed }); G.cues.length = 0; return G; };
const names = (G) => G.cues.filter((c) => c.k === 'sound').map((c) => c.name);
// a ball is lost down the drain with the given ball save and number of other balls loose
const drainWith = (G, { saved, others }) => {
  G.ball.inLane = false; G.ball.launched = true; G.ball.saveUntil = saved ? G.t + 30 : 0;
  for (let i = 0; i < others; i++) addBall(G.w, 200 + 40 * i, 500);
  const b = G.w.balls[0];
  G.cues.length = 0;
  G.w.events.push({ t: 'drain', ball: b.id, x: 240 });
  tick(G);
};

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-07
  {
    name: 'S1-07 the ball-save slow motion is asked for only when the saved ball is the only one in play',
    node: true,
    async run(t) {
      const one = fresh(); drainWith(one, { saved: true, others: 0 });
      const c1 = one.cues.find((c) => c.k === 'slowmo');
      t.expect(c1 && c1.others === 0, 'a lone saved ball: slow motion, nothing else in play');
      const many = fresh(); drainWith(many, { saved: true, others: 1 });
      const c2 = many.cues.find((c) => c.k === 'slowmo');
      t.expect(c2 && c2.others === 1, 'a save in multiball says another ball is live');
    },
  },
  {
    name: 'S1-07 with another ball live the flippers keep full speed; a lone save still slows the table',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const r = await t.page.evaluate(() => {
        const g = window.__game; g.slowmo = true;
        g.newGame({ seed: 5 }); g.pause();
        g.act('clearBalls');
        const out = {};
        for (const [key, others] of [['multi', 1], ['lone', 0]]) {
          g.act('clearBalls');
          g.act('addBall', 300, 300);
          for (let i = 0; i < others; i++) g.act('addBall', 200, 500);
          g.setState({ ball: { saveUntil: 1e6, inLane: false, launched: true } });
          g.act('switch', 'shooterLane', 'drain');
          g.step(2);
          out[key] = g.getState().timeScale;
        }
        g.slowmo = false;
        return out;
      });
      t.equal(r.multi, 1, 'multiball save: time keeps its normal speed');
      t.expect(r.lone < 1, 'a lone save slows time: ' + r.lone);
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-19
  {
    name: 'S2-19 the mode line (and the phone score plate) count the ball save down, and drop it when it ends',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.game('newGame', { seed: 7 });
      await t.game('pause');
      const s0 = await t.state();
      await t.game('setState', { ball: { saveUntil: s0.t + 300, inLane: false, launched: true } });
      await t.game('step', 2);
      const sel = t.viewport === 'mobile' ? '#score' : '#modeline';
      const text = () => t.page.locator(sel).textContent();
      // the phone plate shows the score while a callout is up: step until the callouts have gone
      for (let i = 0; i < 60 && !/SAVE/.test(await text()); i++) await t.game('step', 30);
      t.expect(/SAVE [0-9]+s$/.test(await text()), 'the line says how long the save has left: ' + (await text()));
      await shot(t, 'S2-19-save-countdown');
      await t.game('setState', { ball: { saveUntil: 0 } });
      await t.game('step', 2);
      t.expect(!/SAVE/.test(await text()), 'and nothing once it has ended: ' + (await text()));
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-29
  {
    name: 'S2-29 building the 3D table logs no three.js warning',
    viewports: ['desktop'],
    async run(t) {
      const warns = [];
      t.page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') warns.push(m.text()); });
      await t.page.reload();
      await t.waitIdle(30000);
      t.equal((await t.state()).view, '3d', 'the 3D table is up');
      t.expect(!warns.some((w) => /PCFSoftShadowMap/.test(w)), 'no shadow-map warning: ' + warns.join(' | '));
    },
  },
  {
    name: 'S2-29 with storage blocked the title and Settings say progress cannot be saved',
    viewports: ['desktop', 'mobile'],
    initScript: () => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); },
    async run(t) {
      const note = t.page.locator('#t-nosave');
      t.expect(await note.isVisible(), 'the title says so');
      t.expect(/cannot be saved/.test(await note.textContent()), 'in plain words: ' + (await note.textContent()));
      await shot(t, 'S2-29-storage-blocked-title');
      await t.game('scene', 'settings');
      t.expect(await t.page.locator('#s-nosave').isVisible(), 'and so does Settings');
      await shot(t, 'S2-29-storage-blocked-settings');
      await t.checkLayout();
    },
  },
  {
    name: 'S2-29 with storage working there is no such note',
    viewports: ['desktop'],
    async run(t) {
      t.equal(await t.page.locator('#t-nosave').count(), 0, 'no note on the title');
      await t.game('scene', 'settings');
      t.equal(await t.page.locator('#s-nosave').count(), 0, 'and none in Settings');
    },
  },

  // ---------------------------------------------------------------------------------------------- S3-08
  {
    name: 'S3-08 a 5-ball score goes on its own table; the 3-ball table (and every score saved before) is untouched',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const old = { v: 1, table: [{ initials: 'OLD', score: 3100000, date: '2026-10-01', difficulty: 'standard' }] };
      await t.page.evaluate((o) => { localStorage.clear(); localStorage.setItem('hsg-pinball:scores', JSON.stringify(o)); }, old);
      await t.page.reload(); await t.waitIdle(30000);
      await t.game('newGame', { balls: 5, seed: 5 });
      await t.game('setState', { player: { ball: 5, score: 7777777 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('[data-balls]');
      const cell = () => t.page.locator('.scores tr').first().textContent().then((x) => x.replace(/s+/g, ' ').trim());
      t.expect(/7,777,777/.test(await cell()), 'the new score tops the 5-ball table, which is the one showing: ' + (await cell()));
      t.equal(await t.page.locator('[data-balls="5"]').getAttribute('aria-pressed'), 'true', 'the 5-ball toggle is the one pressed');
      await shot(t, 'S3-08-high-scores-5-ball');
      const saved = await t.page.evaluate(() => ({ five: JSON.parse(localStorage.getItem('hsg-pinball:scores5')), three: JSON.parse(localStorage.getItem('hsg-pinball:scores')) }));
      t.equal(saved.five.table[0].score, 7777777, 'saved under its own key');
      t.equal(saved.three.table.map((r) => r.initials), ['OLD'], 'the 3-ball key is exactly as it was');
      await t.page.click('[data-balls="3"]');
      t.expect(/OLD/.test(await cell()) && !/7,777,777/.test(await cell()), 'the 3-ball table shows the old score and not the 5-ball one: ' + (await cell()));
      t.equal(await t.page.locator('[data-balls="3"]').getAttribute('aria-pressed'), 'true', 'and its toggle is pressed');
      t.equal(await t.page.locator('.scores tr').count(), 1, 'the 3-ball table is the one old row, as saved');
      await t.checkLayout();
    },
  },

  // ---------------------------------------------------------------------------------------------- S6-05
  {
    name: 'S6-05 leaving a finished game for the title cancels its pending initials or game-over card',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.page.evaluate(() => { window.__game.overDelay = 600000; });   // the card is on a long timer, so the test sees it pending
      await t.game('setState', { player: { ball: 3, score: 9000000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      t.equal((await t.state()).scene, 'over', 'the game is over');
      t.equal(await t.game('overPending'), true, 'the card is waiting on its timer');
      t.expect((await t.state()).screen == null, 'nothing is on screen yet');
      await t.game('scene', 'title');
      t.equal(await t.game('overPending'), false, 'going to the title cancels it');
      const s = await t.state();
      t.expect(s.screen === 'title' && s.demo === true, 'the title over the attract demo: ' + s.screen);
      // a new game cancels it too
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 0 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      t.equal(await t.game('overPending'), true, 'a second finished game has its card pending');
      await t.game('newGame', { balls: 3, seed: 5 });
      t.equal(await t.game('overPending'), false, 'starting another game cancels it');
      await t.page.evaluate(() => { window.__game.overDelay = null; });
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-08
  {
    name: 'S5-08 a saved ball plays only the save cue; a lost ball plays only the drain cue',
    node: true,
    async run(t) {
      const a = fresh(); drainWith(a, { saved: true, others: 0 });
      const sa = names(a);
      t.expect(sa.includes('save') && !sa.includes('drain'), 'saved: ' + sa.join(','));
      const b = fresh(); drainWith(b, { saved: true, others: 1 });
      const sb = names(b);
      t.expect(sb.includes('save') && !sb.includes('drain'), 'saved in multiball: ' + sb.join(','));
      const c = fresh(); drainWith(c, { saved: false, others: 0 });
      const sc = names(c);
      t.expect(sc.includes('drain') && !sc.includes('save'), 'lost: ' + sc.join(','));
    },
  },
];

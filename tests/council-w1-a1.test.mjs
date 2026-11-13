// Council wave 1, batch A1: stability, saves and lifecycle (part 1). One block per finding.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, plunger, nudge, api } from '../src/js/sim/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadSettings, loadScores, qualifies, DEFAULT_SETTINGS } from '../src/js/save.js';
import { autoPlunge, TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const fresh = (o = {}) => { const G = createGame(T, { seed: 5 }); newGame(G, { balls: 3, seed: 5, ...o }); run(G, 0.6); return G; };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-01
  {
    name: 'S1-01 every real plunger hold leaves the lane and starts the ball save',
    node: true,
    async run(t) {
      for (const ms of [160, 200, 300, 500, 700, 800, 900, 1250]) {
        const G = fresh();
        plunger(G, true); run(G, ms / 1000); plunger(G, false); run(G, 4);
        t.expect(G.ball.launched && !G.ball.inLane, `${ms} ms hold: ball left the lane`);
        t.expect(G.ball.saveUntil > 0, `${ms} ms hold: ball save running`);
      }
    },
  },
  {
    name: 'S1-01 a ball that rises part way and falls back does not start the ball save or skill shot',
    node: true,
    async run(t) {
      const G = fresh();
      autoPlunge(G.w, 0.55); run(G, 4);
      t.expect(G.ball.inLane && !G.ball.launched, 'still counted as in the lane');
      t.equal(G.ball.saveUntil, 0, 'no ball save started');
      t.equal(G.ball.skillUntil, 0, 'no skill-shot window started');
    },
  },
  // ---------------------------------------------------------------------------------------------- S2-03
  {
    name: 'S2-03 Restart and Quit in the pause menu need a second tap',
    async run(t) {
      for (const [id, expectScreen] of [['#b-quit', 'pause'], ['#b-restart', 'pause']]) {
        await t.game('newGame', { balls: 3, seed: 5 });
        await t.game('setState', { player: { score: 123456 } });
        await t.game('scene', 'pause');
        await t.waitFrames(2);
        await t.page.click(id);
        let s = await t.state();
        t.equal(s.screen, expectScreen, id + ': one tap leaves the pause menu open');
        t.equal(s.player.score, 123456, id + ': one tap keeps the game');
        t.equal(s.demo, false, id + ': still the live game');
        t.expect((await t.page.textContent(id)).includes('again'), id + ': the button asks for a second tap');
        await t.page.click(id);
        await t.waitFrames(2);
        s = await t.state();
        if (id === '#b-quit') t.expect(s.demo && s.screen === 'title', 'second tap quits to the title');
        else t.expect(!s.demo && s.screen === null && s.player.score === 0, 'second tap restarts the game');
      }
    },
  },
  // ---------------------------------------------------------------------------------------------- S3-12
  {
    name: 'S3-12 a tilted ball in practice drains, ends the ball and serves a live one',
    node: true,
    async run(t) {
      const G = fresh({ practice: true });
      autoPlunge(G.w, 0.9); run(G, 3);
      for (let i = 0; i < 12; i++) nudge(G, 'up');
      t.expect(G.player.tilted, 'the table is tilted');
      run(G, 60);
      const nBalls = G.w.balls.length;
      t.expect(!G.player.tilted, 'a fresh ball is not tilted any more');
      t.equal(G.player.ball, 2, 'the ball counter moved on to ball 2');
      t.equal(nBalls, 1, 'one ball is waiting');
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-01
  {
    name: 'S6-01 after a high-score entry Continue returns to a live attract demo, and Esc cannot pause a finished game',
    async run(t) {
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:scores'));
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 9000000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('#b-back');
      let s = await t.state();
      t.equal(s.screen, 'scores', 'high scores shown after the entry');
      await t.page.click('#b-back');
      await t.waitFrames(3);
      s = await t.state();
      t.equal(s.screen, 'title', 'on the title');
      t.equal(s.demo, true, 'the attract demo is running behind the title');
      t.expect(s.scene !== 'over', 'the finished game is gone: scene ' + s.scene);
      await t.page.keyboard.press('Escape');
      await t.waitFrames(2);
      s = await t.state();
      t.expect(s.screen !== 'pause', 'Esc on the title does not open the pause menu');
      // a finished game cannot be paused either
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 0 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      await t.page.waitForSelector('#b-again');
      await t.page.keyboard.press('Escape');
      await t.waitFrames(2);
      s = await t.state();
      t.equal(s.screen, 'over', 'Esc on the game-over screen leaves it alone');
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-06
  {
    name: 'S6-06 malformed saved settings and scores are sanitised on load',
    node: true,
    async run(t) {
      const mem = {};
      globalThis.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } };
      const put = (k, v) => { mem['hsg-pinball:' + k] = JSON.stringify(v); };
      try {
        put('settings', { v: 1, sound: 'yes', music: 0, volume: 'abc', motion: 'wild', balls: 99, tier: 'bogus', practice: 'x', textScale: 'x' });
        t.equal(JSON.stringify(loadSettings()), JSON.stringify(DEFAULT_SETTINGS), 'every wrong-typed setting falls back to its default');
        put('settings', { v: 1, volume: 7, balls: 0, textScale: 5 });
        let s = loadSettings();
        t.equal(s.volume, 1, 'volume clamps to 1'); t.equal(s.balls, 3, 'balls 0 -> 3'); t.equal(s.textScale, 1, 'odd text scale -> 1');
        put('settings', { v: 1, volume: -2 });
        t.equal(loadSettings().volume, 0, 'volume clamps to 0');
        put('settings', { v: 1, sound: false, music: false, volume: 0.35, motion: 'reduced', balls: 5, tier: '2d', practice: true, textScale: 1.3 });
        t.equal(JSON.stringify(loadSettings()), JSON.stringify({ v: 1, sound: false, music: false, volume: 0.35, motion: 'reduced', balls: 5, tier: '2d', practice: true, textScale: 1.3 }), 'valid settings load untouched');
        put('settings', [1, 2]); t.equal(loadSettings().balls, 3, 'an array is not settings');

        const ok = (r) => r && typeof r.initials === 'string' && Number.isFinite(r.score);
        for (const bad of [[null], [], [{ initials: 'AAA', score: '900' }], [{ score: 5 }], [1, 'x', { initials: 3, score: 4 }]]) {
          put('scores', { v: 1, table: bad });
          const rows = loadScores();
          t.expect(rows.length === 10 && rows.every(ok), 'bad table ' + JSON.stringify(bad) + ' falls back to the defaults');
        }
        put('scores', { v: 1, table: [null, { initials: 'ZZZ', score: 10 }, { initials: 'BBB', score: 50 }, { initials: 'CCC', score: 'NaN' }] });
        const rows = loadScores();
        t.equal(rows.map((r) => r.initials).join(), 'BBB,ZZZ', 'good rows are kept, sorted, bad ones dropped');
        t.expect(qualifies(60, rows), 'qualifies still works on the cleaned table');
      } finally { delete globalThis.localStorage; }
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-11
  {
    name: 'S6-11 five failed renders in a row show the error banner with Reload; stray errors are logged once',
    allowConsoleErrors: true,
    async run(t) {
      const logs = [];
      t.page.on('console', (m) => { if (m.type() === 'error' && m.text().includes('Spa City Pinball:')) logs.push(m.text()); });
      await t.page.evaluate(() => {
        const orig = performance.now.bind(performance);
        performance.now = () => { if (window.__breakRender && new Error().stack.includes('render')) throw new Error('boom'); return orig(); };
      });
      await t.waitFrames(5);
      t.expect(await t.page.locator('#boot-error').isHidden(), 'no banner while rendering works');
      await t.page.evaluate(() => { window.__breakRender = true; });
      await t.page.waitForTimeout(600);
      t.expect(await t.page.locator('#boot-error').isVisible(), 'banner shown after repeated render failures');
      t.expect(await t.page.locator('#boot-error button').count() === 1, 'the banner has a Reload button');
      t.equal(logs.filter((l) => l.includes('render failed')).length, 1, 'the render failure is logged once, not every frame');
      await t.page.evaluate(() => { window.__breakRender = false; });
      await t.page.evaluate(() => { setTimeout(() => { throw new Error('stray 1'); }); setTimeout(() => { throw new Error('stray 2'); }); });
      await t.page.waitForTimeout(200);
      t.equal(logs.filter((l) => l.includes('uncaught')).length, 1, 'later errors are not logged again');
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-03
  {
    name: 'S6-03 losing focus or hiding the tab pauses a live game and lets go of the plunger without firing it',
    viewports: ['desktop'],
    async run(t) {
      const blur = () => t.page.evaluate(() => window.dispatchEvent(new Event('blur')));
      // a charged plunger, then the window loses focus
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.waitFrames(3);
      await t.page.keyboard.down('Space');
      await t.page.waitForTimeout(400);
      let s = await t.state();
      t.expect(s.physics.plunger.holding && s.physics.plunger.pull > 3, 'the plunger is charging: ' + s.physics.plunger.pull);
      await blur(); await t.waitFrames(3);
      s = await t.state();
      t.equal(s.screen, 'pause', 'the game paused on blur');
      t.expect(!s.physics.plunger.holding && s.physics.plunger.pull === 0, 'the plunger was let go');
      t.expect(s.ball.inLane && !s.ball.launched && s.physics.balls.every((b) => b.y < 150), 'and did not fire: the ball is still in the lane');
      const tick0 = s.physics.tick;
      await t.page.waitForTimeout(400);
      t.equal((await t.state()).physics.tick, tick0, 'the sim is not running while paused');
      await t.page.keyboard.up('Space');
      // a hidden tab
      await t.page.click('#b-resume');
      await t.game('act', 'plunge', 0.9); await t.page.waitForTimeout(300);
      await t.page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
      await t.waitFrames(3);
      t.equal((await t.state()).screen, 'pause', 'a hidden tab pauses too');
      await t.page.evaluate(() => { delete document.hidden; });
      // the attract demo and the title are not paused
      await t.game('scene', 'title'); await t.waitFrames(3);
      await blur(); await t.waitFrames(3);
      s = await t.state();
      t.expect(s.demo && s.screen === 'title', 'blur on the title leaves the demo and title alone');
    },
  },
  // ---------------------------------------------------------------------------------------------- S6-07
  {
    name: 'S6-07 throttled phone with the quality governor on: the tier falls to low and the frame rate is playable',
    viewports: ['mobile'],
    initScript: () => { window.__GOVERNOR__ = true; },
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('act', 'plunge', 0.9);
      const first = (await t.state()).tier;
      await t.cpuThrottle(4);
      let s = await t.state();
      for (let i = 0; i < 60 && s.tier !== 'low' && s.tier !== null; i++) { await t.page.waitForTimeout(500); s = await t.state(); }
      const fc = await t.frameCost(3000);
      await t.cpuThrottle(1);
      s = await t.state();
      t.log('tier', first, '->', s.tier, 'fps', fc.fps, 'taskMs', fc.taskMs);
      t.expect(first !== 'low', 'starts above the low tier: ' + first);
      t.expect(s.tier === 'low' || s.view === '2d', 'the governor dropped the quality: ' + s.tier);
      t.expect(fc.fps > 20 || !t.gpu, 'playable frame rate at 4x throttle once the governor has acted: ' + fc.fps);
    },
  },
  {
    name: 'S6-07 npm run sim points at files that exist',
    node: true,
    async run(t) {
      const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
      const sim = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts.sim;
      t.expect(!!sim, 'a sim script exists');
      const targets = (sim || '').split(' ').filter((w) => w.includes('/'));
      t.expect(targets.length > 0, 'it runs something: ' + sim);
      for (const f of targets) t.expect(fs.existsSync(path.join(root, f)), f + ' exists');
    },
  },
];

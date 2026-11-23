// Council wave 3, batch B: saves, lifecycle and robustness, controls, rules and play
// (S1-03, S5-11, S6-09, S1-06, S2-06, S2-18, S3-06, S3-07; S5-26 needs the owner and has no test).
// Sim rules run in Node on the sim itself, with fixed seeds, so they give the same answer every run; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, flipper, api, mystery } from '../src/js/sim/rules.js';
import { removeBall } from '../src/js/sim/physics.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
async function gesture(t) {
  if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);
  for (let i = 0; i < 40; i++) { if ((await t.state()).audio.ctx) break; await t.page.waitForTimeout(50); }
}
const held = (s, side) => s.physics.flippers.find((f) => f.side === side).held;

const T = compileTable(spec);
const fresh = (seed = 1) => { const G = createGame(T, { seed }); newGame(G, { seed }); G.cues.length = 0; return G; };
const hit = (G, name, extra = {}) => { G.w.events.push({ t: 'hit', sw: G.T.sw[name], speed: 2800, dir: 1, ball: (G.w.balls[0] || {}).id, ...extra }); tick(G); };
const texts = (G) => G.cues.filter((c) => c.k === 'dmd').map((c) => c.text);
// the last ball is lost down the drain: the end-of-ball bonus starts
const drainLast = (G, { tilted = false } = {}) => {
  G.player.ball = G.player.ballsPerGame - 1; G.player.tilted = tilted; G.ball.saveUntil = 0; G.ball.inLane = false; G.ball.launched = true;
  G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 });
  tick(G);
};
const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-03
  {
    name: 'S1-03 Settings rebinds the flippers: the new key works, the old one does not, it is saved, and a taken or reserved key is refused',
    viewports: ['desktop'],
    async run(t) {
      await t.page.evaluate(() => localStorage.clear());
      await t.page.reload(); await t.waitIdle(30000);
      await t.game('scene', 'settings');
      const label = (a) => t.page.locator('.keybtn[data-act="' + a + '"]').textContent();
      t.equal(await label('flipL'), 'Left Shift · Z · ←', 'the left flipper shows its usual keys');
      await t.page.click('.keybtn[data-act="flipL"]');
      await t.page.keyboard.press('Slash');
      t.expect(/already works the right flipper/.test(await t.page.locator('#s-keys-hint').textContent()), 'a key that works another action is refused: ' + (await t.page.locator('#s-keys-hint').textContent()));
      t.equal(await label('flipL'), 'Press a key', 'and the button keeps waiting');
      await t.page.keyboard.press('Escape');
      t.equal((await t.state()).screen, 'settings', 'Escape cancels the binding and leaves Settings open');
      t.equal(await label('flipL'), 'Left Shift · Z · ←', 'with the keys as they were');
      await t.page.click('.keybtn[data-act="flipL"]');
      await t.page.keyboard.press('KeyA');
      t.equal(await label('flipL'), 'A', 'a free key is taken');
      t.expect(/Left flipper is now A/.test(await t.page.locator('#s-keys-hint').textContent()), 'and the line says so');
      await shot(t, 'S1-03-settings-keys');
      t.equal((await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings')).keys)).flipL, 'KeyA', 'it is saved with the other settings');
      await t.page.reload(); await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(300);
      await t.page.keyboard.down('KeyA'); await t.waitFrames(4);
      t.expect(held(await t.state(), 'L'), 'after a reload A lifts the left flipper');
      await t.page.keyboard.up('KeyA'); await t.waitFrames(4);
      await t.page.keyboard.down('KeyZ'); await t.waitFrames(4);
      t.expect(!held(await t.state(), 'L'), 'and Z no longer does');
      await t.page.keyboard.up('KeyZ');
      t.expect(/\bA\b/.test(await t.page.locator('.controls-hint').textContent()), 'the hint beside the table shows the new key: ' + (await t.page.locator('.controls-hint').textContent()));
      await t.game('scene', 'help');
      t.expect(/Left flipper\s*A/.test(await t.page.locator('.keys').textContent()), 'so does Help');
      await t.game('scene', 'settings');
      await t.page.click('#s-keys-reset');
      t.equal(await label('flipL'), 'Left Shift · Z · ←', 'Reset keys brings the usual ones back');
      t.equal(await t.page.evaluate(() => 'keys' in JSON.parse(localStorage.getItem('hsg-pinball:settings'))), false, 'and the saved record has no keys again');
    },
  },
  {
    name: 'S1-03 hand-edited key settings are cleaned on load; a save with none loads as it always did',
    viewports: ['desktop'],
    async run(t) {
      const put = (v) => t.page.evaluate((x) => localStorage.setItem('hsg-pinball:settings', JSON.stringify(x)), v);
      await put({ v: 1, keys: { flipL: 'KeyA', flipR: 'KeyA', plunge: 'Escape', nudgeL: 5, nudgeU: 'KeyM', nudgeR: 'bad key!', junk: 'KeyQ' } });
      await t.page.reload(); await t.waitIdle(30000);
      t.equal((await t.state()).settings.keys, { flipL: 'KeyA' }, 'only the one valid, unshared, unreserved key is kept');
      await put({ v: 1, keys: 'nonsense' });
      await t.page.reload(); await t.waitIdle(30000);
      t.equal('keys' in (await t.state()).settings, false, 'a damaged record leaves no keys, and the usual ones work');
      await put({ v: 1, sound: true });
      await t.page.reload(); await t.waitIdle(30000);
      t.equal('keys' in (await t.state()).settings, false, 'an old save has no keys field added');
    },
  },
  {
    name: 'S1-03 the mouse flips: the left half of the table lifts the left flipper, the right half the right one',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(300);
      const r = await t.page.locator('#table').boundingBox();
      await t.page.mouse.move(r.x + r.width * 0.25, r.y + r.height * 0.8); await t.page.mouse.down(); await t.waitFrames(4);
      let s = await t.state();
      t.expect(held(s, 'L') && !held(s, 'R'), 'a press on the left half lifts only the left flipper');
      await t.page.mouse.up(); await t.waitFrames(4);
      t.expect(!held(await t.state(), 'L'), 'letting go drops it');
      await t.page.mouse.move(r.x + r.width * 0.75, r.y + r.height * 0.8); await t.page.mouse.down(); await t.waitFrames(4);
      s = await t.state();
      t.expect(held(s, 'R') && !held(s, 'L'), 'the right half lifts the right flipper');
      await t.page.mouse.up(); await t.waitFrames(4);
      t.expect(!held(await t.state(), 'R'), 'and it drops again');
    },
  },
  {
    name: 'S1-03 a gamepad can steer the menus and start a game, and in play a flick of the stick nudges',
    viewports: ['desktop'],
    initScript: () => { window.__pad = { id: 'test pad', connected: true, buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })), axes: [0, 0, 0, 0] }; navigator.getGamepads = () => [window.__pad]; },
    async run(t) {
      await t.waitIdle(30000);
      const press = async (i) => { await t.page.evaluate((k) => { window.__pad.buttons[k].pressed = true; }, i); await t.waitFrames(3); await t.page.evaluate((k) => { window.__pad.buttons[k].pressed = false; }, i); await t.waitFrames(3); };
      const active = () => t.page.evaluate(() => document.activeElement && document.activeElement.id);
      t.equal(await active(), 'b-play', 'the title starts with Play focused');
      await press(13);
      t.equal(await active(), 'b-daily', 'down on the D-pad moves to the next button');
      await press(12);
      t.equal(await active(), 'b-play', 'up moves back');
      for (let i = 0; i < 5; i++) await press(13);
      t.equal(await active(), 'b-settings', 'five downs reach Settings');
      await press(0);
      t.equal((await t.state()).screen, 'settings', 'A presses the focused button');
      await press(12);
      t.equal(await active(), 's-text', 'inside Settings up moves back to the last control, Text size');
      await press(15);
      t.equal((await t.state()).settings.textScale, 1.15, 'right changes a list (Large text)');
      await press(14);
      t.equal((await t.state()).settings.textScale, 1, 'left changes it back');
      await press(1);
      t.equal((await t.state()).screen, 'title', 'B goes back to the title');
      await press(0);
      const s = await t.state();
      t.expect(!s.demo && s.scene === 'game', 'A on Play starts a game');
      await t.game('pause');
      await t.game('step', 2);
      const bob0 = (await t.state()).player.bob;
      await t.page.evaluate(() => { window.__pad.axes[0] = -1; });
      await t.page.waitForFunction((b0) => window.__game.getState().player.bob > b0, bob0, { timeout: 5000 });
      await t.page.evaluate(() => { window.__pad.axes[0] = 0; });
      t.expect(true, 'a flick of the stick to the left nudged the table');
    },
  },
  // ---------------------------------------------------------------------------------------------- S5-11
  {
    name: 'S5-11 a change of music waits for the end of the bar being played, and a piece comes back where it was left',
    viewports: ['desktop'],
    async run(t) {
      await t.page.reload(); await t.waitIdle(30000);
      await gesture(t);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.page.waitForFunction(() => { const a = window.__game.getState().audio; return a.state === 'running' && a.music === 'main' && a.bars >= 2; }, null, { timeout: 20000 });
      const sw = await t.page.evaluate(() => {
        const g = window.__game, out = {};
        const a0 = g.getState().audio; out.main = { bars: a0.bars, next: a0.musicNext, clock: a0.clock };
        g.act('mode', 1); g.step(1);
        const a1 = g.getState().audio; out.mode = { music: a1.music, at: a1.musicAt, clock: a1.clock, bars: a1.bars };
        return out;
      });
      t.equal(sw.mode.music, 'mode', 'the mode piece is chosen');
      t.equal(sw.mode.at, sw.main.next, 'and it starts exactly where the next bar of the old piece would have');
      t.expect(sw.mode.at > sw.main.clock, 'which is after the moment of the change, so the old bar finishes: ' + sw.main.clock.toFixed(3) + ' then ' + sw.mode.at.toFixed(3));
      const back = await t.page.evaluate(() => {
        const g = window.__game; g.act('endMode', false); g.step(1);
        const a = g.getState().audio; return { music: a.music, bars: a.bars };
      });
      t.equal(back.music, 'main', 'when the mode ends the play piece returns');
      t.equal(back.bars, sw.main.bars, 'at the bar it had reached (' + sw.main.bars + '), not from the top');
    },
  },

  // ---------------------------------------------------------------------------------------------- S6-09
  {
    name: 'S6-09 the attract demo rests after the title has sat untouched, and any touch of the page wakes it',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);
      const s0 = await t.state();
      t.expect(s0.demo && !s0.resting, 'the demo is running at first');
      await t.game('step', 1);   // make sure a frame has been drawn under the test's own clock
      await t.page.evaluate(() => { window.__game.demoRestMs = 300; });
      await t.page.waitForFunction(() => window.__game.getState().resting, null, { timeout: 10000 });
      // a frame already queued when the demo rested is drawn once more: take the baseline once the drawn count has stopped changing across two page frames (K-01)
      await t.page.waitForFunction(() => { const w = window; const d = w.__game.getState().drawn; const same = w.__restDrawn === d; w.__restDrawn = d; w.__restSame = same ? (w.__restSame || 0) + 1 : 0; return w.__restSame >= 2; }, null, { timeout: 10000, polling: 'raf' });
      const a = await t.state();
      await t.waitFrames(30);
      const b = await t.state();
      t.equal([b.t, b.drawn], [a.t, a.drawn], 'while it rests the sim does not advance and the view is not drawn');
      t.expect(b.frame > a.frame, 'the page itself keeps running frames');
      // the short rest delay is put back before the touch, or on a slow machine the demo rests again before the sim has had a frame to advance
      await t.page.evaluate(() => { window.__game.demoRestMs = null; });
      await t.page.mouse.move(300, 300); await t.page.mouse.move(340, 320);
      await t.page.waitForFunction(() => !window.__game.getState().resting, null, { timeout: 5000 });
      const c = await t.state();
      await t.page.waitForFunction((t0) => window.__game.getState().t > t0, c.t, { timeout: 5000 });
      t.expect(true, 'a touch of the page wakes the demo and the sim runs again');
      await t.page.evaluate(() => { window.__game.demoRestMs = null; });
    },
  },
  {
    name: 'S6-09 the demo rests while Settings is open, and runs again when it closes',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'settings');
      await t.page.waitForFunction(() => window.__game.getState().resting, null, { timeout: 5000 });
      // state().resting is true as soon as Settings opens, but the frame loop draws the demo once more when it starts to rest
      // (main.js: "the view is drawn once when it starts to rest"); let that frame go by before taking the snapshot.
      await t.waitFrames(2);
      const a = await t.state();
      await t.waitFrames(30);
      const b = await t.state();
      t.equal([b.t, b.drawn], [a.t, a.drawn], 'with Settings open the demo neither plays nor draws');
      await t.game('scene', 'title');
      await t.page.waitForFunction((t0) => window.__game.getState().t > t0, a.t, { timeout: 5000 });
      t.expect(!(await t.state()).resting, 'back on the title it plays again');
    },
  },
  {
    name: 'S6-09 under reduced motion the demo is a still from the start',
    viewports: ['desktop'],
    reducedMotion: true,
    async run(t) {
      await t.waitIdle(30000);
      const s = await t.state();
      t.expect(s.reduced && s.demo && s.resting, 'reduced motion: the demo is resting');
      await t.waitFrames(30);
      const b = await t.state();
      t.equal([b.t, b.drawn], [s.t, s.drawn], 'nothing moves and nothing is redrawn');
      t.equal(b.view, '3d', 'the table is the 3D one, drawn once before it rested');
    },
  },

  // ---------------------------------------------------------------------------------------------- S1-06
  {
    name: 'S1-06 a flip ends the bonus count once it has run 0.8 s, and not before; the old timer does not fire a second time',
    node: true,
    async run(t) {
      const G = fresh(); drainLast(G);
      t.equal(G.scene, 'bonus', 'the bonus is counting');
      t.expect(Math.abs(G.bonus.until - G.bonus.t0 - 2.6) < 1e-9, 'a full count is still 2.6 s');
      run(G, 0.3); flipper(G, 'L', true); flipper(G, 'L', false);
      t.equal(G.scene, 'bonus', 'a flip at 0.3 s does nothing (a flipper held through the drain must not skip it)');
      run(G, 0.6);
      flipper(G, 'R', true);
      t.equal(G.scene, 'game', 'a flip after 0.8 s goes straight to the next ball');
      t.equal(G.player.ball, G.player.ballsPerGame, 'the next ball is up');
      t.expect(G.w.balls.length === 1, 'and its ball is in the shooter lane');
      run(G, 3);
      t.equal(G.player.ball, G.player.ballsPerGame, 'the skipped timer does not advance the game again');
      t.equal(G.scene, 'game', 'still in play');
    },
  },
  {
    name: 'S1-06 a tilted ball says NO BONUS for 1.2 s, and a flip skips that too; with the last ball the game ends',
    node: true,
    async run(t) {
      const G = fresh(); drainLast(G, { tilted: true });
      t.equal(G.scene, 'bonus', 'the tilted ball gets its bonus screen');
      t.expect(Math.abs(G.bonus.until - G.bonus.t0 - 1.2) < 1e-9, 'which lasts 1.2 s, not 2.6');
      t.equal(G.bonus.total, 0, 'with no bonus');
      run(G, 0.9);
      flipper(G, 'L', true);
      t.equal(G.scene, 'game', 'a flip while tilted still skips the count');
      const H = fresh(2); H.player.ball = H.player.ballsPerGame; drainLast(H, { tilted: true }); H.player.ball = H.player.ballsPerGame;
      run(H, 1.3);
      t.equal(H.scene, 'over', 'unskipped, a tilted last ball is over after 1.2 s');
    },
  },
  {
    name: 'S1-06 a flip on a real keyboard or a tap on the table skips the bonus count',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.game('act', 'clearBalls');
      await t.game('setState', { player: { ball: 1 }, ball: { saveUntil: 0, inLane: false, launched: true } });
      await t.game('act', 'addBall', 300, 300);
      await t.game('act', 'switch', 'shooterLane', 'drain');
      await t.stepUntil((s) => s.scene === 'bonus', { max: 60, chunk: 1, label: 'the bonus starts' });
      const press = async () => {
        if (t.viewport === 'mobile') { const r = await t.page.locator('#table').boundingBox(); await t.tap([r.x + r.width * 0.25, r.y + r.height * 0.5]); }
        else await t.page.keyboard.press('KeyZ');
      };
      await t.game('step', 20);
      await press(); await t.waitFrames(3);
      let s = await t.state();
      t.equal(s.scene, 'bonus', 'an early press (0.17 s in) is ignored');
      await t.game('step', 120);
      s = await t.state();
      t.equal(s.scene, 'bonus', 'and the count is still going at 1.2 s');
      await press(); await t.waitFrames(3);
      s = await t.state();
      t.equal([s.scene, s.player.ball], ['game', 2], 'a press after 0.8 s starts ball 2 at once');
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-06
  {
    name: 'S2-06 pinch zoom is allowed on the menus and dialogs, and the table and Launch button keep their touches for the game',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const meta = await t.page.evaluate(() => document.querySelector('meta[name=viewport]').content);
      t.expect(!/user-scalable\s*=\s*(no|0)/.test(meta) && !/maximum-scale/.test(meta), 'the viewport does not forbid scaling: ' + meta);
      const ta = await t.page.evaluate(() => ({ body: getComputedStyle(document.body).touchAction, table: getComputedStyle(document.querySelector('#table')).touchAction, launch: getComputedStyle(document.querySelector('#b-launch')).touchAction, screens: getComputedStyle(document.querySelector('#screens')).touchAction }));
      t.expect(/pinch-zoom/.test(ta.body) || ta.body === 'manipulation', 'the page lets a pinch through: ' + ta.body);
      t.equal(ta.table, 'none', 'the table takes every touch');
      t.equal(ta.launch, 'none', 'and so does Launch');
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-18
  {
    name: 'S2-18 a practice game that ends does not go on the high-score table and says it was not ranked; a real one still does',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const ending = async (practice) => {
        await t.page.evaluate(() => { localStorage.clear(); });
        await t.page.reload(); await t.waitIdle(30000);
        await t.game('newGame', { balls: 3, seed: 5, practice });
        await t.game('setState', { player: { ball: 3, score: 7777777, tilted: true }, ball: { saveUntil: 0 } });
        await t.game('act', 'placeBall', 242, 60, 0, -1500);
        await t.game('step', 600);
      };
      await ending(true);
      await t.page.waitForSelector('#b-again');
      t.expect(/Practice game: not ranked/.test(await t.page.locator('.screen').textContent()), 'the game-over card says it was not ranked');
      t.equal(await t.page.locator('#b-ok').count(), 0, 'no initials entry');
      t.equal((await t.state()).scores.some((r) => r.score === 7777777), false, 'and the table does not hold the score');
      await shot(t, 'S2-18-practice-game-over');
      await t.checkLayout();
      await ending(false);
      await t.page.waitForSelector('#b-ok');
      t.expect(true, 'a real game with the same score still asks for initials');
    },
  },

  // ---------------------------------------------------------------------------------------------- S3-06
  {
    name: 'S3-06 the Fifth Season meter rests while an extra ball is lit, and a collected one starts it from nothing',
    node: true,
    async run(t) {
      const G = fresh(3);
      for (let i = 0; i < 8; i++) hit(G, 'spinner');
      t.expect(G.f.ebLit && G.f.fifth === 0, 'the meter lights the extra ball at 300 spins and resets: lit ' + G.f.ebLit + ', meter ' + G.f.fifth);
      for (let i = 0; i < 10; i++) hit(G, 'spinner');
      t.equal(G.f.fifth, 0, 'while it is lit more spins do not fill the meter');
      G.f.ebLit = false; G.player.eb = 1;
      hit(G, 'spinner');
      t.expect(!G.f.ebLit && G.f.fifth === 40, 'after it is collected one more spin does not light another: meter ' + G.f.fifth);
      const H = fresh(3); H.f.ebLit = true; H.f.fifth = 250;
      api.startMode(H, 1); H.f.ebLit = true; H.f.fifth = 250;
      // collect at the Vapors
      H.mode = null; H.mb = null; H.f.grandSoakLit = false; H.f.wizardLit = false;
      H.w.events.push({ t: 'hit', sw: H.T.sw.vapors, speed: 1000, dir: 1, ball: (H.w.balls[0] || {}).id });
      tick(H);
      t.expect(H.player.extraBalls === 1 && !H.f.ebLit && H.f.fifth === 0, 'collecting resets the meter: extra balls ' + H.player.extraBalls + ', meter ' + H.f.fifth);
    },
  },
  {
    name: 'S3-06 a game pays at most two extra balls: the meter, the mode count and the Vapors reel stop lighting one',
    node: true,
    async run(t) {
      const G = fresh(4); G.player.eb = 2;
      for (let i = 0; i < 20; i++) hit(G, 'spinner');
      t.expect(!G.f.ebLit && G.f.fifth === 0, 'at the limit the meter neither fills nor lights: lit ' + G.f.ebLit + ', meter ' + G.f.fifth);
      const picks = new Set();
      for (let i = 0; i < 400; i++) picks.add(mystery(G));
      t.expect(!picks.has('eb') && picks.size >= 5, 'the Vapors reel never draws the extra ball: ' + [...picks].join(','));
      const H = fresh(5); H.player.eb = 2;
      for (const i of [0, 1]) { api.startMode(H, i); api.endMode(H, true); }   // S3-09: two modes won light it (it was three played)
      t.expect(!H.f.ebLit, 'two modes won light no extra ball at the limit');
      const K = fresh(6);
      for (const i of [0, 1]) { api.startMode(K, i); api.endMode(K, true); }
      t.expect(K.f.ebLit, 'and below the limit they still do');
    },
  },

  // ---------------------------------------------------------------------------------------------- S3-07
  {
    name: 'S3-07 a player who makes no shots is beaten at the wire or placed, and a quick six shots still wins the Derby',
    node: true,
    async run(t) {
      // fixed seeds: the same twenty races every run
      let lost = 0, won = 0;
      for (let s = 1; s <= 20; s++) {
        const G = fresh(s); for (const b of [...G.w.balls]) removeBall(G.w, b);
        api.startMode(G, 1);
        for (let i = 0; i < 60 * 120 && G.mode; i++) { tick(G); for (const c of G.cues) if (c.k === 'dmd' && /BEATEN|PLACED/.test(c.text)) lost++; G.cues.length = 0; }
        const F = fresh(s); for (const b of [...F.w.balls]) removeBall(F.w, b);
        api.startMode(F, 1);
        const m = F.mode; let shots = 0, res = null;
        for (let i = 0; i < 60 * 120 && F.mode && !res; i++) {
          if (shots < 6 && F.t >= m.t0 + (shots + 1) * 4) { m.data.horses[0] = Math.min(100, m.data.horses[0] + 18); shots++; }
          tick(F);
          for (const c of F.cues) if (c.k === 'dmd' && /YOU WIN/.test(c.text)) res = 'win';
          F.cues.length = 0;
        }
        if (res === 'win') won++;
      }
      t.expect(lost >= 16, 'with no shots a rival wins the race (BEATEN or PLACED) in most of the 20 seeded races (the other few run out the clock): ' + lost);
      t.equal(won, 20, 'six shots in 24 s win the race on every one of the 20 seeds');
    },
  },
  {
    name: 'S3-07 the placings: first pays 150,000, second 50,000, and third or worse nothing',
    node: true,
    async run(t) {
      const race = (setup) => {
        const G = fresh(9); for (const b of [...G.w.balls]) removeBall(G.w, b);
        api.startMode(G, 1); run(G, 2.3); G.cues.length = 0;
        const before = G.player.score, h = G.mode.data.horses; setup(h);
        tick(G);
        return { dmd: texts(G), pts: G.player.score - before };
      };
      let r = race((h) => { h[0] = 100; });
      t.expect(r.dmd.includes('YOU WIN THE DERBY') && r.pts === 150000, 'first: ' + r.dmd.join(',') + ' ' + r.pts);
      r = race((h) => { h[0] = 90; h[1] = 100; h[2] = 50; h[3] = 50; });
      t.expect(r.dmd.includes('YOU PLACED 2ND') && r.pts === 50000, 'one rival across first, the player second: ' + r.dmd.join(',') + ' ' + r.pts);
      r = race((h) => { h[0] = 40; h[1] = 100; h[2] = 60; h[3] = 50; });
      t.expect(r.dmd.includes('BEATEN AT THE WIRE') && r.pts === 0, 'two rivals ahead: beaten, no points: ' + r.dmd.join(',') + ' ' + r.pts);
    },
  },

];

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
      const a = await t.state();
      await t.waitFrames(30);
      const b = await t.state();
      t.equal([b.t, b.drawn], [a.t, a.drawn], 'while it rests the sim does not advance and the view is not drawn');
      t.expect(b.frame > a.frame, 'the page itself keeps running frames');
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

];

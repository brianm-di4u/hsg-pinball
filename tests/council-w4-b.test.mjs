// Council wave 4, batch B: polish across the game (S1-10, P-N03, C4-03, S3-11, S1-26, S5-15, S5-16, S5-29, S2-10, C4-02, C4-04).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flipperDrawAngle } from '../src/js/sim/physics.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-4', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

// a paused game finished with this score: the last ball drains and the initials card opens
async function toEntry(t, score = 9999990) {
  await t.page.evaluate(() => { for (const k of ['settings', 'scores', 'scores5', 'stats', 'daily', 'resume']) localStorage.removeItem('hsg-pinball:' + k); });
  await t.reload(); await t.waitIdle(30000);
  await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
  await t.game('setState', { player: { ball: 3, score }, ball: { saveUntil: 0 } });
  await t.game('act', 'placeBall', 242, 60, 0, -1500);
  await t.game('step', 400);
  await t.page.waitForFunction(() => window.__game.getState().screen === 'entry', null, { timeout: 8000 });
}
const initials = (t) => t.page.evaluate(() => [...document.querySelectorAll('.initials .ini span')].map((s) => s.textContent).join(''));
const cursor = (t) => t.page.evaluate(() => [...document.querySelectorAll('.initials .ini')].findIndex((d) => d.classList.contains('on')));

export const tests = [
  // ------------------------------------------------------------------------------------------------------ S1-10
  {
    name: 'S1-10 a flipper is drawn where the sim has it (a tick ahead of the ball), never past either end of its stroke', node: true,
    async run(t) {
      const f = { angle: 0.5, rest: 0.4, dir: 1, stroke: 0.8 };   // swinging up: 0.1 rad in the last tick; the stroke ends at 1.2
      t.equal(flipperDrawAngle(f, 0.4, 0), 0.5, 'at the start of a frame it is where the sim has it');
      t.expect(Math.abs(flipperDrawAngle(f, 0.4, 0.5) - 0.55) < 1e-12, 'half a tick on, half the last tick of travel further');
      t.expect(Math.abs(flipperDrawAngle(f, 0.4, 1) - 0.6) < 1e-12, 'a whole tick on, the whole last tick further');
      t.expect(Math.abs(flipperDrawAngle({ ...f, angle: 1.15 }, 1.05, 1) - 1.2) < 1e-12, 'it stops at the end of the stroke');
      const g = { angle: -0.5, rest: -0.4, dir: -1, stroke: 0.8 };   // the right flipper turns the other way
      t.expect(Math.abs(flipperDrawAngle(g, -0.4, 0.5) - -0.55) < 1e-12, 'a flipper that turns the other way is drawn on ahead the same way');
      t.expect(Math.abs(flipperDrawAngle({ ...g, angle: -1.15 }, -1.05, 1) - -1.2) < 1e-12, 'and stops at its own end');
      t.equal(flipperDrawAngle({ ...f, angle: 0.41 }, 0.5, 1), 0.4, 'falling back it stops at rest');
      t.equal(flipperDrawAngle(f, null, 0.7), 0.5, 'with no earlier angle it is drawn where it is');
    },
  },
  {
    name: 'S1-10 in the page the first tick of a flip is already drawn moving, and the drawn angle stays inside the stroke while it swings',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.page.evaluate(() => { window.__game.pause(); });
      const rd = () => t.page.evaluate(() => { const s = window.__game.getState(); return { theta: s.physics.flippers.find((f) => f.side === 'L').theta, d0: window.__game.drawnFlippers(0)[0], d1: window.__game.drawnFlippers(1)[0] }; });
      const rest = (await rd()).d0;
      await t.game('act', 'flip', 'L', true);
      await t.game('step', 1);
      const a = await rd();
      t.expect(a.theta > 0, 'the flipper turned in the first tick: ' + a.theta);
      t.expect(Math.abs(Math.abs(a.d0 - rest) - a.theta) < 1e-9, 'and at the start of the next frame it is drawn there, not still at rest: drawn ' + Math.abs(a.d0 - rest).toFixed(4) + ', sim ' + a.theta.toFixed(4));
      t.expect(Math.abs(a.d1 - rest) > Math.abs(a.d0 - rest), 'later in the frame it is drawn on, ahead of the sim');
      let worst = 0, end = 0;
      for (let i = 0; i < 40; i++) { await t.game('step', 1); const r = await rd(); end = Math.abs(r.d0 - rest); worst = Math.max(worst, Math.abs(r.d1 - rest)); }
      t.expect(worst <= end + 1e-9, 'it is never drawn past the end of the stroke: most ' + worst.toFixed(4) + ', stroke ' + end.toFixed(4));
      t.expect(end > 0.3, 'the stroke was reached: ' + end.toFixed(3));
    },
  },
  // ------------------------------------------------------------------------------------------------------ P-N03
  {
    name: 'P-N03 initials can be typed: letters fill the places and move on (Z too), Backspace takes one back, the flippers still change the letter, Enter confirms',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await toEntry(t);
      const k = (key) => t.page.keyboard.press(key);
      t.equal(await initials(t), 'AAA', 'the card starts at AAA');
      await k('z'); await k('a'); await k('p');
      t.equal(await initials(t), 'ZAP', 'typing z, a, p gives ZAP (Z is a letter here, not the left flipper)');
      t.equal(await cursor(t), 2, 'the cursor stays on the last place');
      await shot(t, 'P-N03-entry-typed');
      await t.checkLayout();
      await k('x');
      t.equal(await initials(t), 'ZAX', 'a fourth letter replaces the last one');
      await k('Backspace');
      t.equal(await initials(t), 'ZAA', 'Backspace takes the last letter back');
      await k('Backspace');
      t.equal([await initials(t), await cursor(t)], ['ZAA', 1], 'and again moves back a place');
      await k('Backspace');
      await k('Backspace'); await k('Backspace');
      t.equal([await initials(t), await cursor(t)], ['AAA', 0], 'Backspace at the first place does nothing more');
      await k('M'); await k('Q');
      t.equal(await initials(t), 'MQA', 'a capital letter types too');
      await k('ArrowRight');
      t.equal([await initials(t), await cursor(t)], ['MQB', 2], 'the right flipper still changes the letter');
      await k('ArrowLeft');
      t.equal(await initials(t), 'MQA', 'the left flipper too');
      await k('1'); await k('.');
      t.equal(await initials(t), 'MQA', 'digits and punctuation are left alone');
      const hint = await t.page.locator('#e-hint').textContent();
      t.expect(t.viewport === 'mobile' ? !/Type/.test(hint) : /^Type your initials/.test(hint), 'the hint says so on a keyboard screen: ' + hint);
      await k('Backspace'); await k('Backspace'); await k('Backspace');
      await k('z'); await k('a'); await k('p');
      await k('Enter');
      await t.page.waitForFunction(() => window.__game.getState().screen === 'scores');
      const row = await t.page.evaluate(() => window.__game.getState().scores[0]);
      t.equal(row.initials, 'ZAP', 'Enter keeps ZAP on the table: ' + row.initials);
      const gone = await t.page.evaluate(() => window.__game.getState().screen);
      t.equal(gone, 'scores', 'and the scores are shown');
      await t.page.keyboard.press('z');
      t.expect(await t.page.evaluate(() => window.__game.getState().screen) === 'scores', 'after the card closes a letter key does nothing to it');
    },
  },
  // ------------------------------------------------------------------------------------------------------ S5-29
  {
    name: 'S5-29 a tap on a title button makes a real sound (a context and a started source), and the audible list is empty when the effects are off though the cue is still asked for',
    viewports: ['desktop', 'mobile'],
    initScript: () => {
      window.__started = 0;
      for (const C of [OscillatorNode, AudioBufferSourceNode]) { const s = C.prototype.start; C.prototype.start = function (...a) { window.__started++; return s.apply(this, a); }; }
    },
    async run(t) {
      await t.waitIdle(30000);
      await t.page.evaluate(() => { window.__game.applySettings({ sound: true, music: false, ambience: false }); });
      await t.page.locator('#b-help').click();
      await t.page.waitForFunction(() => window.__game.getState().audio.audible.includes('ui'), null, { timeout: 8000 });
      let a = (await t.state()).audio;
      t.expect(a.ctx && a.state === 'running', 'the tap started the audio context: ' + a.state);
      t.expect(await t.page.evaluate(() => window.__started) > 0, 'and a source was started');
      await t.page.locator('#b-back').click();
      await t.page.evaluate(() => { window.__game.applySettings({ sound: false }); window.__started = 0; });
      const before = (await t.state()).audio;
      await t.page.locator('#b-help').click();
      await t.page.waitForFunction((n) => window.__game.getState().audio.played.length > n || window.__game.getState().audio.played.filter((x) => x === 'ui').length > 0, before.played.length);
      a = (await t.state()).audio;
      t.expect(a.played.filter((x) => x === 'ui').length > before.played.filter((x) => x === 'ui').length || a.played.length >= 40, 'with Sound effects off the cue is still asked for: ' + a.played.slice(-3));
      t.equal(a.audible.length, before.audible.length, 'but nothing is heard: the audible list did not grow');
      t.equal(await t.page.evaluate(() => window.__started), 0, 'and no source started');
    },
  },
];

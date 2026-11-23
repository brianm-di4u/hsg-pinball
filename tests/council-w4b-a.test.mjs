// Council wave 4b, batch A: clean-up after wave 4 (K-03 the bonus multiplier hit, K-04 the Tilt line in MECHANICS.md, K-07 the initials hint).
// The sim and the document run in Node on fixed seeds, so they give the same answer every run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGame, newGame, tick, flipper, BONUS_STEP, DIFFICULTY } from '../src/js/sim/rules.js';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, 'screenshots', 'council', 'wave-4b', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
const T = compileTable(spec);
// a paused game finished with a high score: the last ball drains and the initials card opens; `settings` is what the page has saved before it loads
async function toEntry(t, settings = null) {
  await t.page.evaluate((st) => { for (const k of ['settings', 'scores', 'scores5', 'stats', 'daily', 'resume']) localStorage.removeItem('hsg-pinball:' + k); if (st) localStorage.setItem('hsg-pinball:settings', JSON.stringify(st)); }, settings);
  await t.reload(); await t.waitIdle(30000);
  await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
  await t.game('setState', { player: { ball: 3, score: 9999990 }, ball: { saveUntil: 0 } });
  await t.game('act', 'placeBall', 242, 60, 0, -1500);
  await t.game('step', 400);
  await t.page.waitForFunction(() => window.__game.getState().screen === 'entry', null, { timeout: 8000 });
}
const typed = (t) => t.page.evaluate(() => [...document.querySelectorAll('.initials .ini span')].map((x) => x.textContent).join(''));

export const tests = [
  // ------------------------------------------------------------------------------------------------------ K-03
  {
    name: 'K-03 the multiplier hit sounds at the end of the bonus count only at 2x or more; ticks, a tilted ball and a skipped count are as before',
    node: true,
    async run(t) {
      const fresh = (x) => { const G = createGame(T, { seed: 3 }); newGame(G, { balls: 3, seed: 3 }); G.cues.length = 0; G.player.bonusX = x; return G; };
      const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };
      const drain = (G) => { G.player.ball = G.player.ballsPerGame - 1; G.ball.saveUntil = 0; G.ball.inLane = false; G.ball.launched = true; G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 }); tick(G); };
      const heard = (G) => G.cues.filter((c) => c.k === 'sound' && /^bonus/.test(c.name)).map((c) => [c.name, c.n]);
      let parts = 0;
      const ticks = (n) => Array.from({ length: n }, (_, k) => ['bonusTick', k]);
      for (const x of [1, 2, 3, 5]) {
        const G = fresh(x); drain(G); parts = G.bonus.parts.length;
        run(G, BONUS_STEP * (parts + 1) + 0.1);
        t.equal(heard(G), x === 1 ? ticks(parts) : [...ticks(parts), ['bonusX', x]], 'at ' + x + 'x the count has its ' + parts + ' ticks' + (x === 1 ? ' and no multiplier hit' : ' and the hit with its value'));
      }
      const K = fresh(3); K.player.tilted = true; drain(K);
      t.expect(K.cues.some((c) => c.k === 'sound' && c.name === 'bonus') && !K.cues.some((c) => c.name === 'bonusTick'), 'a tilted ball keeps its one old sound');
      const S = fresh(3); drain(S); run(S, 0.9); S.cues.length = 0; flipper(S, 'L', true); flipper(S, 'L', false); run(S, 3);
      t.equal(heard(S).length, 0, 'a skipped count at 3x leaves no tick or hit to sound later');
    },
  },
  // ------------------------------------------------------------------------------------------------------ K-04
  {
    name: 'K-04 the Tilt line of MECHANICS.md gives the decay and the warnings Standard, Easy and Expert have in rules.js',
    node: true,
    async run(t) {
      const doc = fs.readFileSync(path.join(GAME, 'MECHANICS.md'), 'utf8').replace(/\s+/g, ' ');
      const line = doc.slice(doc.indexOf('- Tilt:'), doc.indexOf('- Ball search:'));
      t.expect(line.length > 40, 'the Tilt line is there');
      const d = DIFFICULTY;
      t.expect(line.includes('decays ' + d.standard.bobDecay + '/s on Standard'), 'it gives the Standard decay, ' + d.standard.bobDecay + '/s');
      t.expect(line.includes(d.easy.bobDecay + '/s on Easy') && line.includes(d.expert.bobDecay + '/s on Expert'), 'and the Easy and Expert decay: ' + [d.easy.bobDecay, d.expert.bobDecay]);
      t.expect(line.includes(d.standard.tiltAfter + ' warnings on Standard') && line.includes(d.easy.tiltAfter + ' on Easy') && line.includes(d.expert.tiltAfter + ' on Expert'), 'and the warnings before the tilt: ' + [d.standard.tiltAfter, d.easy.tiltAfter, d.expert.tiltAfter]);
      t.expect(!/1\.2\/s|\(3 allowed\)/.test(line), 'and none of the wave-2 numbers');
    },
  },
  // ------------------------------------------------------------------------------------------------------ K-07
  {
    name: 'K-07 the initials hint on a keyboard names the keys that still change the letter, not the flippers; a touch screen keeps its words',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await toEntry(t);
      const hint = await t.page.locator('#e-hint').textContent();
      if (t.viewport === 'mobile') t.equal(hint, 'Flippers change the letter · plunger confirms', 'a touch screen has no keys to name: ' + hint);
      else {
        t.equal(hint, 'Type your initials, or change the letter with Shift, / or ← → · plunger confirms', 'the hint names Shift, / and the arrows: ' + hint);
        t.expect(!/flippers/i.test(hint), 'and does not call them flippers, since Z types a letter here');
        await t.page.keyboard.press('z');
        t.equal(await typed(t), 'ZAA', 'Z types a Z');
        await t.page.keyboard.press('ArrowRight');
        t.equal(await typed(t), 'ZBA', 'and a named key, the right arrow, changes the letter under the cursor');
      }
      await shot(t, 'K-07-initials-hint');
      await t.checkLayout();
    },
  },
  {
    name: "K-07 with the flippers on keys of the player's own, the hint names the ones that are not letters, and none when all are letters",
    viewports: ['desktop'],
    async run(t) {
      await toEntry(t, { v: 1, keys: { flipL: 'KeyQ', flipR: 'Comma' } });
      t.equal(await t.page.locator('#e-hint').textContent(), 'Type your initials, or change the letter with , · plunger confirms', 'only the comma still changes the letter');
      await toEntry(t, { v: 1, keys: { flipL: 'KeyQ', flipR: 'KeyJ' } });
      t.equal(await t.page.locator('#e-hint').textContent(), 'Type your initials · plunger confirms', 'two letter keys leave nothing to name');
    },
  },
];

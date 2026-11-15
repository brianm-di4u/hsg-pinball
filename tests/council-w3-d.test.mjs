// Council wave 3, batch D: difficulty, progression and records; feedback, teaching and help
// (S2-02, S1-19, S2-04, S3-10, S3-13, S4-05, P-N02, S1-04, S4-04).
// Sim rules run in Node on the sim itself with fixed seeds, so they give the same answer every run; page checks use the window.__game hooks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, nudge, COMBO_MAX, STANDARD, DIFFICULTY } from '../src/js/sim/rules.js';
import { textWidth, DW } from '../src/js/ui/dmd.js';
import { autoPlunge } from '../src/js/sim/physics.js';
import { simulate, TARGETS } from '../tools/balance.mjs';

const T = compileTable(spec);
const fresh = (seed = 1, o = {}) => { const G = createGame(T, { seed }); G.settings.difficulty = o.difficulty || 'standard'; newGame(G, { seed, ...o }); G.cues.length = 0; return G; };
const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };
const launched = (G) => { autoPlunge(G.w, 0.9); run(G, 3); };
// how many nudges, `gap` seconds apart, before the table tilts (null if it never does within 80)
const nudgesToTilt = (diff, gap) => { const G = fresh(4, { difficulty: diff }); launched(G); let n = 0; while (!G.player.tilted && n < 80) { nudge(G, 'left'); n++; run(G, gap); } return G.player.tilted ? n : null; };

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S2-02
  {
    name: 'S2-02 on a phone in portrait the ball number and six mode pips stay beside the score, and the pips show won, played and lit modes',
    viewports: ['mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.waitFrames(10);
      const read = () => t.page.evaluate(() => {
        const r = (s) => { const e = document.querySelector(s), b = e.getBoundingClientRect(), c = getComputedStyle(e); return { w: b.width, h: b.height, l: b.left, r: b.right, t: b.top, b: b.bottom, display: c.display, text: e.textContent }; };
        const pips = [...document.querySelectorAll('#modegrid li')].map((li) => { const b = li.getBoundingClientRect(), c = getComputedStyle(li); return { cls: li.className, w: b.width, h: b.height, bg: c.backgroundImage, border: c.borderStyle, shadow: c.boxShadow }; });
        const side = document.querySelector('#side');
        return { ball: r('#ballno'), grid: r('#modegrid'), score: r('#score'), dmd: r('.dmd-frame'), pips, overflow: side.scrollWidth - side.clientWidth, docOverflow: document.documentElement.scrollWidth - innerWidth };
      });
      let v = await read();
      t.equal(v.ball.text, 'Ball 1 of 3', 'the ball number is on screen: ' + v.ball.text);
      t.expect(v.ball.w > 20 && v.ball.display !== 'none', 'and visible');
      t.equal(v.pips.length, 6, 'six mode pips');
      t.expect(v.grid.w > 60 && v.grid.display !== 'none', 'the pips are shown, not hidden: ' + v.grid.w);
      t.expect(v.pips.every((p) => p.w >= 12 && p.h >= 12), 'each pip is a visible dot: ' + JSON.stringify(v.pips.map((p) => [p.w, p.h])));
      t.expect(v.grid.t >= v.dmd.b - 2, 'they sit under the display with the score: ' + JSON.stringify([v.grid, v.dmd]));
      t.expect(v.overflow <= 0 && v.docOverflow <= 0, 'nothing runs off the side: ' + v.overflow + ' ' + v.docOverflow);
      t.expect(v.ball.r <= v.score.l + 1 || v.ball.b <= v.score.t + 1, 'the ball number does not overlap the score plate');
      t.expect(v.pips.every((p) => p.cls === '' || p.cls === 'next'), 'a fresh game has no pip played or won: ' + v.pips.map((p) => p.cls).join('|'));
      // a game with Soak won, Derby played and the Raid lit
      await t.game('setState', { features: { modesWon: [1, 0, 0, 0, 0, 0], modesPlayed: [1, 1, 0, 0, 0, 0] } });
      await t.game('act', 'mode', 2);
      await t.waitFrames(8);
      v = await read();
      t.equal(v.pips.map((p) => p.cls).join('|'), 'won|played|on|||', 'won, played, lit, then not yet: ' + v.pips.map((p) => p.cls).join('|'));
      t.expect(v.pips[0].bg !== 'none' && v.pips[1].bg === 'none', 'a won pip is gold and a played one is only outlined');
      t.expect(v.pips[2].shadow !== 'none', 'the lit mode glows');
      await t.page.waitForFunction(() => !window.__game.getState().dmd.text, null, { timeout: 20000 });   // the mode's callout has gone: the chip names the mode and its time
      await t.waitFrames(4);
      v = await read();
      t.expect(/RAID/.test(v.score.text) && /[0-9]s/.test(v.score.text), 'with no callout up the plate names the mode and its clock: ' + v.score.text);
      t.expect(v.overflow <= 0, 'and still fits: ' + v.overflow);
      await t.checkLayout();
      await shot(t, 'S2-02-status-strip');
    },
  },
  // ---------------------------------------------------------------------------------------------- S1-19
  {
    name: 'S1-19 on Standard a nudge every 0.9 s now tilts the table in time, one every 1.5 s is still safe, and Easy and Expert keep their order',
    node: true,
    async run(t) {
      const row = (d) => ({ fast: nudgesToTilt(d, 0.05), steady: nudgesToTilt(d, 0.9), slow: nudgesToTilt(d, 1.5) });
      const e = row('easy'), s = row('standard'), x = row('expert');
      t.log('nudges to tilt: ' + JSON.stringify({ easy: e, standard: s, expert: x }));
      t.expect(s.steady !== null && s.steady <= 40, 'a nudge every 0.9 s tilts Standard within 40 nudges: ' + s.steady);
      t.equal(s.slow, null, 'a nudge every 1.5 s is still safe on Standard');
      t.expect(e.steady === null, 'Easy is still forgiving at 0.9 s');
      t.expect(x.steady !== null && x.steady < s.steady, 'Expert tilts sooner than Standard at 0.9 s: ' + x.steady + ' against ' + s.steady);
      t.expect(e.fast > s.fast && s.fast > x.fast, 'in a burst Easy takes the most nudges and Expert the fewest: ' + [e.fast, s.fast, x.fast].join(', '));
      t.equal(STANDARD.bobDecay, 0.9, 'the constant says 0.9 (it was 1.2)');
    },
  },
  {
    name: 'S1-19 the bot, which spaces its nudges 1.4 s apart, still never tilts a game on Standard',
    node: true,
    async run(t) {
      // 20 games, skill 0.8, seed 1: the bot nudges at most once in 1.4 s, so its meter falls faster than it climbs
      const r = simulate({ games: 20, skill: 0.8, seed: 1, rotate: true });
      t.equal(r.tilts, 0, 'no tilt in 20 bot games: ' + r.tilts);
      t.expect(r.ballAvg >= TARGETS.ballMin && r.ballAvg <= TARGETS.ballMax, 'the ball average stays in its target: ' + r.ballAvg.toFixed(1));
    },
  },
  // ---------------------------------------------------------------------------------------------- S2-04
  {
    name: 'S2-04 a nudge warning says STOP NUDGING, the last one says so, and the tilt says the flippers are off and there is no bonus',
    node: true,
    async run(t) {
      const callouts = (diff) => { const G = fresh(4, { difficulty: diff }); launched(G); G.cues.length = 0; const seen = []; let n = 0; while (!G.player.tilted && n < 40) { nudge(G, 'left'); n++; run(G, 0.05); for (const c of G.cues) if (c.k === 'dmd') seen.push([c.text, c.sub]); G.cues.length = 0; } return seen; };
      const std = callouts('standard');
      t.equal(JSON.stringify(std), JSON.stringify([['DANGER', 'STOP NUDGING'], ['LAST WARNING', 'STOP NUDGING'], ['TILT', 'NO FLIPPERS, NO BONUS']]), 'Standard: DANGER, then LAST WARNING, then TILT: ' + JSON.stringify(std));
      const exp = callouts('expert');
      t.equal(JSON.stringify(exp.map((c) => c[0])), JSON.stringify(['LAST WARNING', 'TILT']), 'Expert has one warning and it is the last: ' + JSON.stringify(exp));
      for (const [text, sub] of std) t.expect(textWidth(sub) <= DW - 2, 'the line "' + sub + '" fits the display without scrolling: ' + textWidth(sub));
    },
  },
  {
    name: 'S2-04 the game-over card says what the match number is',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'over');
      await t.page.waitForSelector('#o-match');
      const text = await t.page.textContent('#o-match');
      t.expect(/^Match: a score that ends in [0-9][0-9] wins a free game[.]$/.test(text), "one plain line explains it: " + text);
      const box = await t.page.evaluate(() => { const r = document.querySelector('#o-match').getBoundingClientRect(), c = document.querySelector('.screen').getBoundingClientRect(); return [r.left >= c.left, r.right <= c.right, r.height > 0]; });
      t.expect(box.every(Boolean), 'inside the card');
      await t.checkLayout();
      await shot(t, 'S2-04-match-line');
    },
  },
  // ---------------------------------------------------------------------------------------------- S3-10
  {
    name: 'S3-10 a combo pays at most 100,000 however long the chain, and a new ball starts without one',
    node: true,
    async run(t) {
      const G = fresh(6); launched(G); G.cues.length = 0;
      const shot = (g, name) => { g.w.events.push({ t: 'hit', sw: T.sw[name], speed: 1000, dir: 1, ball: g.w.balls[0].id }); tick(g); };
      const combos = (g = G) => { const out = []; for (const c of g.cues) if (c.k === 'dmd' && /WAY COMBO/.test(c.text)) out.push([c.text, +c.sub.replace(/,/g, '')]); g.cues.length = 0; return out; };
      const chain = [];
      for (let i = 0; i < 12; i++) { shot(G, i % 2 ? 'reserve' : 'orbitTop'); chain.push(...combos()); run(G, 0.5); }
      t.equal(chain.length, 11, 'eleven of the twelve shots were inside the window of the one before: ' + chain.length);
      t.equal(JSON.stringify(chain.slice(0, 5)), JSON.stringify([['2-WAY COMBO', 20000], ['3-WAY COMBO', 40000], ['4-WAY COMBO', 60000], ['5-WAY COMBO', 80000], ['6-WAY COMBO', 100000]]), 'the ladder climbs by 20,000 to 100,000: ' + JSON.stringify(chain.slice(0, 5)));
      t.expect(chain.every(([, v]) => v <= 100000), 'no combo in the chain pays more than 100,000: ' + Math.max(...chain.map((c) => c[1])));
      t.equal(COMBO_MAX, 5, 'the constant says 5');
      // a combo window left open when the ball drains does not carry to the next ball
      const H = fresh(7); launched(H); H.cues.length = 0;
      shot(H, 'reserve'); shot(H, 'orbitTop'); combos(H);
      t.expect(H.ball.combo >= 1 && H.t - H.ball.lastMajor.t < 3, 'a window is open on the first ball: combo ' + H.ball.combo);
      H.ball.saveUntil = 0; H.ball.inLane = false; H.ball.launched = true;
      H.w.events.push({ t: 'drain', ball: H.w.balls[0].id, x: 240 });
      run(H, 5);
      t.equal(H.player.ball, 2, 'the next ball is up');
      t.expect(H.ball.combo === 0 && H.t - H.ball.lastMajor.t > 3, 'and it starts with no combo and no window: ' + H.ball.combo);
      H.cues.length = 0;
      shot(H, 'orbitTop');
      t.equal(combos(H).length, 0, 'the first shot of the new ball is not a combo');
    },
  },
];

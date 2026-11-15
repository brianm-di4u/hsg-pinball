// Council wave 3, batch D: difficulty, progression and records; feedback, teaching and help
// (S2-02, S1-19, S2-04, S3-10, S3-13, S4-05, P-N02, S1-04, S4-04).
// Sim rules run in Node on the sim itself with fixed seeds, so they give the same answer every run; page checks use the window.__game hooks.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { execFileSync } from 'node:child_process';
import { FACTS, ATTRACT_FACTS } from '../src/js/sim/facts.js';
import { DMD } from '../src/js/ui/dmd.js';
import { api, createGame, newGame, tick, nudge, COMBO_MAX, STANDARD, DIFFICULTY } from '../src/js/sim/rules.js';
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
  // ---------------------------------------------------------------------------------------------- S3-13
  {
    name: 'S3-13 the help screen has a Scoring block with the thresholds, and the display gives way to the next score to pass',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'help');
      await t.page.waitForSelector('#help-scoring');
      const text = await t.page.textContent('#help-scoring');
      for (const [re, what] of [[/3 seconds/, 'the combo window'], [/100,000/, 'what a combo tops out at'], [/300 spins/, 'the Fifth Season meter'], [/two extra balls a game/, 'the extra-ball limit'], [/15,000 a mode won/, 'what the bonus pays a mode'], [/free game/, 'what match does'], [/next high score/, 'the score to beat']]) t.expect(re.test(text), 'Scoring says ' + what + ': ' + text.slice(0, 60));
      await t.page.evaluate(() => document.querySelector('#help-scoring').scrollIntoView({ block: 'center' }));
      await t.waitFrames(3);
      await t.checkLayout();
      await shot(t, 'S3-13-help-scoring');
    },
  },
  {
    name: 'S3-13 the bottom line of the display shows the next score to pass every other 3 seconds, NEW BEST past the top, and nothing in a practice game',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('applySettings', { practice: false });
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForFunction(() => !/SKILL SHOT/.test(window.__game.getState().dmd.line || 'SKILL SHOT'), null, { timeout: 15000 });
      const rows = (await t.state()).scores.map((r) => r.score);
      const above = (x) => rows.filter((v) => v > x).pop();
      const line = async (ms) => { await t.game('act', 'clock', ms); return (await t.state()).dmd.line; };
      await t.game('setState', { player: { score: 1000 } });
      t.equal(await line(1000), 'BALL 1', 'in the first 3 s of a 6 s cycle it is the ball');
      t.equal(await line(4000), 'TO BEAT ' + above(1000).toLocaleString('en-US'), 'in the second it is the lowest table score above yours');
      await t.game('setState', { player: { score: above(1000) + 1 } });
      const next = rows.filter((v) => v > above(1000) + 1).pop();
      t.equal(await line(4000), next ? 'TO BEAT ' + next.toLocaleString('en-US') : 'NEW BEST', 'passing a score moves the target up: ' + await line(4000));
      await t.game('setState', { player: { score: rows[0] + 1 } });
      t.equal(await line(4000), 'NEW BEST', 'past the top of the table it says so');
      t.equal(await line(1000), 'BALL 1', 'and the ball line still shows in between');
      await t.game('act', 'clock', null);
      await t.game('applySettings', { practice: true });
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForFunction(() => !/SKILL SHOT/.test(window.__game.getState().dmd.line || 'SKILL SHOT'), null, { timeout: 15000 });
      t.equal(await line(4000), 'BALL 1', 'a practice game is not ranked, so there is nothing to beat');
      await t.game('act', 'clock', null);
      await t.game('applySettings', { practice: false });
    },
  },
  // ---------------------------------------------------------------------------------------------- S4-05
  {
    name: 'S4-05 fourteen new sourced lines come from the research, the attract screen speaks in a barker voice, and the source check passes',
    node: true,
    async run(t) {
      const NEW = ['deep', 'jug', 'leased', 'valleySt', 'creek', 'greatSt', 'holiday', 'festival', 'vapors1959', 'madden', 'casinos', 'ohio', 'slots111', 'three'];
      t.expect(NEW.every((k) => FACTS[k] && FACTS[k].text.length <= 40 && /^tc§[0-9]/.test(FACTS[k].src)), 'each new line is 40 characters or fewer and names its section of research/town-content.md');
      const tc = fs.readFileSync(path.join(GAME, 'research', 'town-content.md'), 'utf8');
      t.expect(/jug fountains/.test(tc) && /Valley Street/.test(tc) && /111 slot machines/.test(tc) && /Ohio, Bridge Street/.test(tc) && /co-built the Vapors|with Owney Madden/.test(tc) && /1875/.test(tc) && /1974/.test(tc), 'and the research notes do hold what they say');
      t.expect(ATTRACT_FACTS.every((k) => FACTS[k]), 'every attract key is a fact');
      const voiced = ['reserved', 'park', 'spa', 'springs', 'rowCount'].filter((k) => /^(HEAR YE|STEP IN|ROLL UP|MIND THE STEAM|PICK A TUB)/.test(FACTS[k].text));
      t.equal(voiced.length, 5, 'five of the thirteen older attract lines are in the barker voice: ' + voiced.join(', '));
      t.expect(ATTRACT_FACTS.length >= 17 && ['jug', 'madden', 'casinos', 'vapors1959', 'leased'].every((k) => ATTRACT_FACTS.includes(k)), 'and the attract screen shows the new town lines');
      t.expect(ATTRACT_FACTS.every((k) => DMD.wrap(FACTS[k].text, 21).length <= 3), 'every attract line wraps to three lines of the display or fewer');
      let out = '', ok = true;
      try { out = execFileSync(process.execPath, [path.join(GAME, 'tools', 'check-facts.mjs')], { encoding: 'utf8' }); } catch (e) { ok = false; out = e.stdout; }
      t.expect(ok, 'check-facts passes: ' + out.trim());
    },
  },
  {
    name: 'S4-05 the new lines are shown in play: Central Avenue and Reserve Street callouts, the Raid clubs line, and the boil takes turns',
    node: true,
    async run(t) {
      const subs = (G, title) => { const out = []; for (const c of G.cues) if (c.k === 'dmd' && c.text === title) out.push(c.sub); G.cues.length = 0; return out; };
      const hit = (G, name) => { G.w.events.push({ t: 'hit', sw: T.sw[name], speed: 1000, dir: 1, ball: G.w.balls[0].id }); tick(G); };
      // Central Avenue: the orbit's line is drawn from eight; across 12 fixed seeds it shows at least five different ones, four of them new
      const seen = new Set();
      for (let seed = 1; seed <= 12; seed++) { const G = fresh(seed); launched(G); G.cues.length = 0; hit(G, 'orbitTop'); for (const x of subs(G, 'CENTRAL AVENUE')) seen.add(x); }
      const fresh4 = [FACTS.holiday.text, FACTS.festival.text, FACTS.valleySt.text, FACTS.creek.text, FACTS.greatSt.text];
      t.expect(seen.size >= 5 && fresh4.filter((x) => seen.has(x)).length >= 3, 'the orbit shows ' + seen.size + ' different lines, ' + fresh4.filter((x) => seen.has(x)).length + ' of them new: ' + [...seen].join(' | '));
      // Reserve Street: every third trip says something, the jug fountains first, then the leased land
      const R = fresh(2); launched(R); R.cues.length = 0;
      const said = [];
      for (let i = 0; i < 7; i++) { hit(R, 'reserve'); said.push(...subs(R, 'RESERVE STREET')); run(R, 1.3); }
      t.equal(JSON.stringify(said), JSON.stringify([FACTS.jug.text, FACTS.leased.text, FACTS.jug.text]), 'Reserve Street: trips 1, 4 and 7 speak, the jug and the leased land in turn: ' + JSON.stringify(said));
      // the Raid says whose clubs, once it is under way
      const D = fresh(3); launched(D); D.cues.length = 0;
      api.startMode(D, 2); run(D, 5);
      t.equal(JSON.stringify(subs(D, 'THE CLUBS')), JSON.stringify([FACTS.ohio.text]), 'the Raid names the Ohio club among those raided');
      // the boil and the Arlington take turns between two lines
      const B = fresh(4); launched(B); B.cues.length = 0;
      const boil = []; for (const k of [0, 1]) { B.f.springTemp = 142; B.f.boilUntil = 0; hit(B, 'bumper1'); boil.push(...subs(B, 'THE SPRINGS BOIL')); run(B, 1); }
      t.equal(JSON.stringify(boil), JSON.stringify([FACTS.temp.text, FACTS.deep.text]), 'the springs boil twice, with a different line each time: ' + JSON.stringify(boil));
    },
  },
  {
    name: 'S4-05 the attract display shows a barker line and a new town line on the title screen',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'title');
      const frame = async (key) => { const k = ATTRACT_FACTS.indexOf(key) + 2; await t.game('act', 'clock', (k * 4 + 1) * 1000); await t.waitFrames(6); return t.page.locator('#dmd').screenshot({ path: path.join(SHOTS, 'S4-05-attract-' + key + '-' + t.viewport + '.png') }); };
      fs.mkdirSync(SHOTS, { recursive: true });
      const a = await frame('park'), b = await frame('madden');
      t.expect(a.length > 1500 && b.length > 1500 && !a.equals(b), 'the display draws two different attract screens');
      await t.game('act', 'clock', null);
    },
  },
];

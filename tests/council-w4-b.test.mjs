// Council wave 4, batch B: polish across the game (S1-10, P-N03, C4-03, S3-11, S1-26, S5-15, S5-16, S5-29, S2-10, C4-02, C4-04).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flipperDrawAngle } from '../src/js/sim/physics.js';
import { DIFFICULTY, STANDARD } from '../src/js/sim/rules.js';

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
// a close-up of the multiplier triangles (and the arrows above them), for the before and after pictures
const closeUp = async (t, name) => { const p = await t.page.evaluate(() => { const q = window.__game.viewScreen(242, 262), c = [...document.querySelectorAll('canvas')].filter((x) => x.getBoundingClientRect().width > 0).sort((u, v) => v.width * v.height - u.width * u.height)[0].getBoundingClientRect(); return [c.left + q[0], c.top + q[1]]; }); const w = 150, h = 90; fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + t.viewport + '.png'), clip: { x: Math.max(0, p[0] - w / 2), y: Math.max(0, p[1] - h / 2), width: w, height: h } }); };
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
  // ------------------------------------------------------------------------------------------------------ C4-03
  {
    name: 'C4-03 Standard has one kickback a side, Easy more and Expert none, and the settings and the help say so', 
    viewports: ['desktop', 'mobile'],
    async run(t) {
      t.equal(STANDARD.kickbacks, 1, 'Standard: one kickback a side');
      t.expect(DIFFICULTY.easy.kickbacks > DIFFICULTY.standard.kickbacks && DIFFICULTY.standard.kickbacks > DIFFICULTY.expert.kickbacks, 'the order of generosity is kept: Easy ' + DIFFICULTY.easy.kickbacks + ', Standard ' + DIFFICULTY.standard.kickbacks + ', Expert ' + DIFFICULTY.expert.kickbacks);
      await t.waitIdle(30000);
      await t.game('scene', 'settings');
      let text = await t.page.locator('#screens').textContent();
      t.expect(/Standard: a 10 second ball save, one kickback a side./.test(text), 'Settings describes Standard with one kickback a side');
      t.expect(!/three kickbacks/i.test(text), 'and nowhere says three');
      await shot(t, 'C4-03-settings');
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'help');
      await t.page.waitForSelector('#help-scoring', { state: 'attached' });
      text = await t.page.locator('#screens').textContent();
      t.expect(/once a side each ball on Standard/.test(text), 'the help says once a side each ball on Standard');
    },
  },
  // ------------------------------------------------------------------------------------------------------ S3-11
  {
    name: 'S3-11 a new profile starts with a table whose lowest score is 250,000, a profile that already had records keeps the old one, and a match is counted in the stats', node: true,
    async run(t) {
      const mem = new Map();
      globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k), key: (i) => [...mem.keys()][i], get length() { return mem.size; } };
      try {
        const { loadScores, loadStats, store } = await import('../src/js/save.js');
        const { gameTally, addTally, emptyTally } = await import('../src/js/progress.js');
        const low = () => loadScores(3)[9].score, top = () => loadScores(3)[0].score;
        t.equal([low(), top(), loadScores(3).length], [250000, 2500000, 10], 'a new profile: ten rows, the lowest 250,000, the top unchanged');
        t.equal(loadStats().seed, 2, 'and its stats record says which table it has');
        store.set('stats', { v: 1, games: 4, score: 900000, best: { standard: 400000 } });
        t.equal(low(), 100000, 'a profile with stats from before keeps the old table (lowest 100,000)');
        t.equal(loadStats().seed, 1, 'its stats say so too');
        t.equal(loadStats().games, 4, 'and its games are as they were');
        store.set('stats', { v: 1, seed: 2, games: 4 });
        t.equal(low(), 250000, 'a stats record marked 2 has the new table');
        store.set('stats', 'damaged');
        t.equal(low(), 250000, 'a damaged stats record is repaired as a new profile');
        store.set('scores', { v: 1, table: [{ initials: 'OLD', score: 3100000, date: '2026-10-01', difficulty: 'standard' }] });
        t.equal(loadScores(3).map((r) => r.initials), ['OLD'], 'a saved table is never replaced by a seeded one');
        // the match is counted
        t.equal(emptyTally().matches, 0, 'the tally starts at no matches');
        const p = { score: 123440, match: 40 }, f = { rowsDone: 0, mbs: [0, 0, 0], modeWins: [0, 0, 0, 0, 0, 0] };
        t.equal(gameTally({ player: p, f }).matches, 1, 'a game whose score ends in its match number counts one');
        t.equal(gameTally({ player: { ...p, score: 123450 }, f }).matches, 0, 'one that does not counts none');
        t.equal(gameTally({ player: { ...p, match: null }, f }).matches, 0, 'a game in play (no match drawn yet) counts none');
        t.equal(addTally({ ...emptyTally(), matches: 2 }, { ...emptyTally(), matches: 1 }).matches, 3, 'and the totals add up');
        store.set('stats', { v: 1, seed: 2, matches: 7.9 });
        t.equal(loadStats().matches, 7, 'a saved count is read as a whole number');
      } finally { delete globalThis.localStorage; }
    },
  },
  {
    name: 'S3-11 a match is stamped on the game-over card and counted in Records; a score that is not a match is not stamped',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const { createGame } = await import('../src/js/sim/rules.js');
      const { compileTable } = await import('../src/js/sim/table.js');
      const { spec } = await import('../src/js/sim/table-spa-city.js');
      const SEED = 4242, M = createGame(compileTable(spec), { seed: SEED }).rng.int(10) * 10;   // the first draw of the seed is the match number if nothing else draws first
      const gameOver = async (score) => {
        await t.page.evaluate(() => { for (const k of ['settings', 'scores', 'scores5', 'stats', 'daily', 'resume']) localStorage.removeItem('hsg-pinball:' + k); });
        await t.reload(); await t.waitIdle(30000);
        await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
        await t.game('setState', { player: { ball: 3 }, ball: { saveUntil: 0 } });
        await t.game('act', 'placeBall', 242, 60, 0, -1500);
        await t.page.waitForFunction(() => window.__game.getState().scene === 'bonus' || window.__game.getState().scene === 'over', null, { timeout: 15000 }).catch(() => {});
        for (let i = 0; i < 40 && (await t.state()).scene !== 'bonus'; i++) await t.game('step', 20);
        await t.game('setState', { player: { score } });   // the bonus is already in the score: set the final one
        await t.game('seed', SEED);
        for (let i = 0; i < 80 && (await t.state()).scene !== 'over'; i++) await t.game('step', 20);
        await t.page.waitForSelector('#o-match');
        return t.state();
      };
      let s = await gameOver(150000 + M);
      t.equal(s.player.match, M, 'the match number is the one the seed gives: ' + M);
      t.expect(await t.page.locator('#o-stamp').isVisible(), 'the card shows the stamp');
      t.expect(/MATCH/.test(await t.page.locator('#o-stamp').textContent()), 'it says MATCH');
      t.expect(!/free game/i.test(await t.page.locator('#screens').textContent()), 'and nowhere promises a free game');
      await t.checkLayout();
      await shot(t, 'S3-11-match-stamp');
      t.equal((await t.game('progress')).stats.matches, 1, 'the stats count one match');
      await t.page.click('#b-title'); await t.page.click('#b-records');
      t.expect(/Matches won\s*1/.test(await t.page.locator('#screens').textContent()), 'Records show Matches won 1');
      await shot(t, 'S3-11-records');
      s = await gameOver(150000 + ((M + 10) % 100));
      t.equal(s.player.match, M, 'the same match number again');
      t.equal(await t.page.locator('#o-stamp').count(), 0, 'a score that does not end in it has no stamp');
      t.equal((await t.game('progress')).stats.matches, 0, 'and no match is counted');
    },
  },
  // ------------------------------------------------------------------------------------------------------ S5-15
  {
    name: 'S5-15 a standup target and a combo climb a pitch ladder while they come quickly, start again after a pause, and no two repeats are the same pitch', node: true,
    async run(t) {
      const { sfx, unlock, stopMusic, audio } = await import('../src/js/ui/audio.js');
      const freqs = [];
      const stub = () => new Proxy(function () {}, { get: (_, k) => (k === 'connect' ? (x) => x : k === Symbol.toPrimitive ? () => 0 : stub()), set: () => true, apply: () => stub() });
      class Ctx {
        constructor() { this.currentTime = 0; this.sampleRate = 8000; this.state = 'running'; this.destination = {}; fakeCtx = this; }
        suspend() { return Promise.resolve(); } resume() { return Promise.resolve(); }
        createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
        createOscillator() { const o = stub(); return new Proxy({}, { get: (_, k) => (k === 'frequency' ? { setValueAtTime: (v) => freqs.push(v), exponentialRampToValueAtTime() {} } : k === 'connect' ? (x) => x : o[k]), set: () => true }); }
        createGain() { return stub(); } createBiquadFilter() { return stub(); } createBufferSource() { return stub(); } createDynamicsCompressor() { return stub(); }
        createWaveShaper() { return stub(); } createConvolver() { return stub(); } createDelay() { return stub(); }
      }
      let fakeCtx = null;
      globalThis.window = { AudioContext: Ctx };
      try {
        unlock();
        const play = (name, n) => { fakeCtx.currentTime += 1; freqs.length = 0; sfx(name, 1, 0, { n }); return freqs.slice(); };
        const bright = (name, n, lo, hi) => play(name, n).filter((f) => f > lo && f < hi);
        // the target's pitch tone is the one above 600 Hz (its thump is about 160 Hz); the combo has two tones, take the first
        const ladder = [0, 1, 2, 3, 4, 5].map((n) => bright('target', n, 600, 5000)[0]);
        for (let i = 1; i < ladder.length; i++) t.expect(ladder[i] > ladder[i - 1], `target step ${i} is higher than step ${i - 1}: ${ladder[i - 1].toFixed(0)} then ${ladder[i].toFixed(0)}`);
        const combos = [1, 2, 3, 4].map((n) => play('combo', n)[0]);
        for (let i = 1; i < combos.length; i++) t.expect(combos[i] > combos[i - 1], `combo step ${i + 1} is higher than step ${i}: ${combos[i - 1].toFixed(0)} then ${combos[i].toFixed(0)}`);
        // the same step twice is not the same pitch: 12 repeats of one step, each within 3 percent of 880 Hz and not all equal
        // (the chance that 12 draws from a continuous spread are all equal is nil)
        const same = Array.from({ length: 12 }, () => bright('target', 0, 600, 5000)[0]);
        t.expect(same.every((f) => f >= 880 * 0.97 - 1e-9 && f <= 880 * 1.03 + 1e-9), 'every repeat is within 3 percent of 880 Hz: ' + Math.min(...same).toFixed(1) + ' to ' + Math.max(...same).toFixed(1));
        t.expect(new Set(same.map((f) => f.toFixed(3))).size > 6, 'and the repeats differ: ' + new Set(same.map((f) => f.toFixed(3))).size + ' distinct of 12');
      } finally { stopMusic(); audio.ctx = null; delete globalThis.window; }
    },
  },
  {
    name: 'S5-15 the rules number the standup hits that come within 2 s of each other, and the combo cue carries its count',
    node: true,
    async run(t) {
      const { createGame, newGame, tick } = await import('../src/js/sim/rules.js');
      const { compileTable } = await import('../src/js/sim/table.js');
      const { spec } = await import('../src/js/sim/table-spa-city.js');
      const G = createGame(compileTable(spec), { seed: 5 }); newGame(G, { balls: 3, seed: 5 });
      const ns = () => G.cues.filter((c) => c.k === 'sound' && c.name === 'target').map((c) => c.n);
      const hit = (sw) => { G.w.events.push({ t: 'hit', sw: G.T.sw[sw], speed: 1000, dir: 1, ball: (G.w.balls[0] || {}).id }); tick(G); };
      const idle = (secs) => { for (let i = 0; i < secs * 120; i++) tick(G); };
      hit('bhHale'); hit('bhLamar'); hit('bhFordyce');
      t.equal(ns(), [0, 1, 2], 'three quick standup hits are steps 0, 1, 2');
      G.cues.length = 0; idle(2.5); G.cues.length = 0; hit('bhHale');
      t.equal(ns(), [0], 'after more than 2 s the ladder starts again');
    },
  },
  // ------------------------------------------------------------------------------------------------------ S5-16
  {
    name: 'S5-16 the end-of-ball bonus is sounded part by part on the beat the display reveals it, then the multiplier hits; a tilted ball and a skipped count do not', node: true,
    async run(t) {
      const { createGame, newGame, tick, flipper, BONUS_STEP } = await import('../src/js/sim/rules.js');
      const { compileTable } = await import('../src/js/sim/table.js');
      const { spec } = await import('../src/js/sim/table-spa-city.js');
      const T = compileTable(spec);
      const fresh = () => { const G = createGame(T, { seed: 3 }); newGame(G, { balls: 3, seed: 3 }); G.cues.length = 0; return G; };
      const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };
      const drain = (G) => { G.player.ball = G.player.ballsPerGame - 1; G.ball.saveUntil = 0; G.ball.inLane = false; G.ball.launched = true; G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 }); tick(G); };
      const G = fresh(); G.player.bonusX = 3;
      drain(G);
      t.equal(G.scene, 'bonus', 'the bonus is counting');
      const parts = G.bonus.parts.length;
      run(G, BONUS_STEP * (parts + 1) + 0.1);
      const heard = G.cues.filter((c) => c.k === 'sound' && /^bonus/.test(c.name)).map((c) => [c.name, c.n]);
      t.equal(heard, [...Array.from({ length: parts }, (_, k) => ['bonusTick', k]), ['bonusX', 3]], 'one tick for each part, rising, then the multiplier hit with its value (' + parts + ' parts, x3)');
      t.expect(!G.cues.some((c) => c.k === 'sound' && c.name === 'bonus'), 'and no single long run on top');
      // each tick lands when the display moves to its part: the display shows part k from k x BONUS_STEP
      const H = fresh(); drain(H);
      const at = []; for (let i = 0; i < Math.round(BONUS_STEP * (parts + 1) * 120) + 20; i++) { tick(H); for (const c of H.cues) if (c.k === 'sound' && /^bonus/.test(c.name)) at.push([c.name, +(H.t - H.bonus.t0).toFixed(3)]); H.cues.length = 0; }
      t.expect(at.every(([, s], k) => Math.abs(s - k * BONUS_STEP) < 0.03), 'each lands within 30 ms of its part on the display: ' + JSON.stringify(at));
      // a tilted ball says NO BONUS with the old single sound; skipping the count silences what is left
      const K = fresh(); K.player.tilted = true; drain(K);
      t.expect(K.cues.some((c) => c.k === 'sound' && c.name === 'bonus') && !K.cues.some((c) => c.name === 'bonusTick'), 'a tilted ball keeps the one old sound and has no ticks');
      const S = fresh(); drain(S); run(S, 0.9); S.cues.length = 0;
      flipper(S, 'L', true); flipper(S, 'L', false); run(S, 3);
      t.equal(S.cues.filter((c) => c.k === 'sound' && /^bonus/.test(c.name)).length, 0, 'skipping the count after 0.9 s leaves no tick or hit to sound later');
    },
  },
  {
    name: 'S5-16 the bonus tick and the multiplier hit are audible and no louder than the table cues (rendered offline at the shipped volume)',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);
      const peak = async (name, n) => { const r = []; for (let i = 0; i < 5; i++) r.push((await t.page.evaluate(([a, b]) => window.__game.cueRender(a, { n: b, seconds: 1.5 }), [name, n])).peak); return r.sort((a, b) => a - b)[2]; };
      const levels = { tick0: await peak('bonusTick', 0), tick3: await peak('bonusTick', 3), x1: await peak('bonusX', 1), x5: await peak('bonusX', 5), multUp: await peak('multUp', 3) };
      t.log('median peaks at the speakers (default volume): ' + JSON.stringify(Object.fromEntries(Object.entries(levels).map(([k, v]) => [k, +v.toFixed(3)]))));
      for (const [k, v] of Object.entries(levels)) t.expect(v > 0.03 && v < 0.6, k + ' is audible and does not clip: ' + v.toFixed(3));
      t.expect(levels.tick3 <= levels.multUp * 1.2 && levels.x5 <= levels.multUp * 1.5, 'and not louder than the multiplier-up cue it sits beside');
    },
  },
  // ------------------------------------------------------------------------------------------------------ C4-02
  {
    name: 'C4-02 the Credits say how the art was made, in one plain line, and it fits the card',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'credits');
      await t.page.waitForSelector('#c-art');
      t.equal(await t.page.locator('#c-font').textContent(), 'Headings are set in Rokkitt Bold, under the SIL Open Font License.', 'and the Credits name the face and its licence');
      t.equal(await t.page.locator('#c-art').textContent(), 'Art: 3D block-outs painted with AI image tools for this game.', 'the line is the one the owner approved');
      const text = await t.page.locator('.credits').textContent();
      t.expect(!/openai|codex|blender/i.test(text), 'and names no company or product');
      const box = await t.page.evaluate(() => { const r = document.querySelector('#c-art').getBoundingClientRect(), c = document.querySelector('.screen').getBoundingClientRect(); return [r.left >= c.left, r.right <= c.right, r.height > 0, r.bottom <= innerHeight]; });
      t.expect(box.every(Boolean), 'it is inside the card and on the screen');
      await shot(t, 'C4-02-credits');
      await t.checkLayout();
    },
  },
  // ------------------------------------------------------------------------------------------------------ S2-10
  {
    name: 'S2-10 Lit inserts has a High contrast option that is off by default and saved, an old save without it has it off', node: true,
    async run(t) {
      const mem = new Map();
      globalThis.localStorage = { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k), key: (i) => [...mem.keys()][i], get length() { return mem.size; } };
      try {
        const { loadSettings, saveSettings, DEFAULT_SETTINGS } = await import('../src/js/save.js');
        t.equal(DEFAULT_SETTINGS.litRim, false, 'the default is off');
        t.equal(loadSettings().litRim, false, 'a profile with no save has it off');
        mem.set('hsg-pinball:settings', JSON.stringify({ v: 1, sound: false, difficulty: 'expert' }));
        const old = loadSettings();
        t.equal([old.litRim, old.sound, old.difficulty], [false, false, 'expert'], 'a save from before has it off and keeps what it had');
        saveSettings({ ...old, litRim: true });
        t.equal(loadSettings().litRim, true, 'it is saved');
        mem.set('hsg-pinball:settings', JSON.stringify({ v: 1, litRim: 'yes' }));
        t.equal(loadSettings().litRim, false, 'and a wrong-shaped value falls back to off');
      } finally { delete globalThis.localStorage; }
    },
  },
  {
    name: 'S2-10 with High contrast on, every lit insert gets a white rim and no unlit one does; the inserts themselves are drawn as before and the option is off until chosen',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      t.equal((await t.state()).view, '3d', 'the 3D table is up');
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.game('setState', { player: { bonusX: 3 }, ball: { inLane: false } });
      await t.waitFrames(4);
      const read = () => t.page.evaluate(() => ({ lit: window.__game.rimLevel('bonus3x'), unlit: window.__game.rimLevel('bonus5x'), body: window.__game.act('lampLevel', 'bonus3x'), bodyUnlit: window.__game.act('lampLevel', 'bonus5x') }));
      const off = await read();
      t.equal([off.lit, off.unlit], [0, 0], 'option off: no rim anywhere');
      await shot(t, 'S2-10-lit-normal'); await closeUp(t, 'S2-10-closeup-normal');
      await t.game('applySettings', { litRim: true });
      await t.waitFrames(4);
      const on = await read();
      t.expect(on.lit > 0.9, 'option on: the lit insert has a white rim: ' + on.lit);
      t.equal(on.unlit, 0, 'the unlit one has none');
      t.expect(Math.abs(on.body - off.body) < 0.05 && Math.abs(on.bodyUnlit - off.bodyUnlit) < 0.05, 'and the inserts are drawn at the same brightness as before: ' + off.body.toFixed(2) + ' then ' + on.body.toFixed(2));
      await shot(t, 'S2-10-lit-high-contrast'); await closeUp(t, 'S2-10-closeup-high-contrast');
      await t.game('applySettings', { litRim: false });
      await t.waitFrames(4);
      t.equal((await read()).lit, 0, 'switched off again, the rims are gone');
    },
  },
  {
    name: 'S2-10 the Settings screen offers Lit inserts: Normal or High contrast, and choosing it is saved and applied',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'settings');
      const sel = t.page.locator('#s-rim');
      t.equal(await sel.inputValue(), '0', 'it starts on Normal');
      await sel.selectOption('1');
      t.equal((await t.state()).settings.litRim, true, 'High contrast is applied');
      t.equal(await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings')).litRim), true, 'and saved');
      await shot(t, 'S2-10-settings');
      await t.checkLayout({ allowScrollY: true });
    },
  },
  {
    name: 'S2-10 the flat 2D table draws the white rim too: more near-white pixels round a lit insert with the option on, and none round an unlit one',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.game('applySettings', { tier: '2d' });
      await t.game('setState', { player: { bonusX: 3 }, ball: { inLane: false } });
      await t.waitFrames(4);
      t.equal((await t.state()).view, '2d', 'the flat table is up');
      const whites = (name) => t.page.evaluate((n) => {
        const L = window.__game.act('lampLevel', n);   // (3D only: unused here)
        const cv = [...document.querySelectorAll('canvas')].filter((x) => x.getBoundingClientRect().width > 0).sort((u, v) => v.width * v.height - u.width * u.height)[0];
        const pos = { bonus3x: [242 + 15, 262], bonus5x: [242 + 75, 262] }[n], q = window.__game.viewScreen(pos[0], pos[1]);
        const r = cv.getBoundingClientRect(), k = cv.width / r.width, g = cv.getContext('2d');
        if (!g) return -1;
        const d = g.getImageData(Math.round(q[0] * k) - 24, Math.round(q[1] * k) - 24, 48, 48).data; let c = 0;
        for (let i = 0; i < d.length; i += 4) if (d[i] > 235 && d[i + 1] > 235 && d[i + 2] > 235) c++;
        return c;
      }, name);
      const off = [await whites('bonus3x'), await whites('bonus5x')];
      await t.game('applySettings', { litRim: true });
      await t.waitFrames(4);
      const on = [await whites('bonus3x'), await whites('bonus5x')];
      t.expect(on[0] > off[0] + 15, 'a lit insert has a white outline with the option on: ' + off[0] + ' near-white pixels, then ' + on[0]);
      t.equal(on[1], off[1], 'an unlit one is drawn as before: ' + on[1]);
      await t.game('applySettings', { litRim: false, tier: 'auto' });
    },
  },
  // ------------------------------------------------------------------------------------------------------ C4-04
  {
    name: 'C4-04 the table name, the headings, the mode names and the score are set in Rokkitt Bold from file://, and nothing overflows or wraps where it did not',
    viewports: ['desktop', 'mobile'],
    fileUrl: true,
    async run(t) {
      await t.waitIdle(30000);
      const tag = process.env.W4_FONT_SHOT || 'after';
      const family = (sel) => t.page.evaluate((s) => { const e = document.querySelector(s); return e ? getComputedStyle(e).fontFamily : null; }, sel);
      const loaded = () => t.page.evaluate(async () => { await document.fonts.ready; return document.fonts.check('700 20px Rokkitt'); });
      await shot(t, 'C4-04-title-' + tag);
      const heights = {};
      const lines = async (sel) => t.page.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { h: Math.round(r.height), w: Math.round(r.width), sw: e.scrollWidth, cw: e.clientWidth }; }, sel);
      heights.title = await lines('#t-h .t-big');
      t.log(tag + ' title box ' + JSON.stringify(heights.title));
      t.expect(heights.title.sw <= heights.title.cw + 1, 'the title does not spill its box: ' + JSON.stringify(heights.title));
      if (tag === 'after') {
        t.expect(/^"?Rokkitt"?,/.test(await family('#t-h .t-big')), 'the title starts with Rokkitt: ' + await family('#t-h .t-big'));
        t.expect(/Rockwell/.test(await family('#t-h .t-big')), 'and keeps the old stack behind it');
        t.equal(await loaded(), true, 'the face is loaded (no network, from the stylesheet)');
      }
      await t.checkLayout();
      await t.game('scene', 'settings');
      if (tag === 'after') t.expect(/^"?Rokkitt"?,/.test(await family('.screen h2')), 'headings start with Rokkitt');
      t.expect(/Avenir|Segoe|system-ui/.test(await family('#s-sound')) || !/Rokkitt/.test(await family('#s-sound')), 'while the controls keep their own font: ' + await family('#s-sound'));
      await shot(t, 'C4-04-settings-' + tag);
      await t.checkLayout({ allowScrollY: true });
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.waitFrames(3);
      await t.game('resume');
      await t.page.waitForSelector('.mode-grid li');
      if (tag === 'after') {
        t.expect(/^"?Rokkitt"?,/.test(await family('.score')), 'the score starts with Rokkitt');
        t.expect(/^"?Rokkitt"?,/.test(await family('.mode-grid li')), 'and so do the mode names');
      }
      const chips = await t.page.evaluate(() => [...document.querySelectorAll('.mode-grid li')].map((e) => ({ t: e.textContent, over: e.scrollWidth > e.clientWidth + 1, lines: Math.round(e.getBoundingClientRect().height) })));
      t.log(tag + ' mode chips (height px): ' + chips.map((c) => c.lines).join(','));
      t.expect(chips.every((c) => !c.over), 'no mode name spills its box: ' + JSON.stringify(chips));
      await shot(t, 'C4-04-play-' + tag);
      await t.checkLayout();
    },
  },
];

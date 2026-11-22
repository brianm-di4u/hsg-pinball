// Council wave 4, batch A: saves, lifecycle and robustness (C4-01, S3-16, S5-17, S5-18, S5-19).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIFFICULTY } from '../src/js/sim/rules.js';
import { audio, unlock, stopMusic, suspendAudio, resumeAudio, slowmoDip } from '../src/js/ui/audio.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, 'screenshots', 'council', 'wave-4', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
// a context whose state the test sets (iOS says 'interrupted' after a call), and a window that keeps the listeners it is given
function fakeContext() {
  const stub = () => new Proxy(function () {}, { get: (_, k) => (k === 'connect' ? (x) => x : k === Symbol.toPrimitive ? () => 0 : stub()), set: () => true, apply: () => stub() });
  // a node that keeps what is set on it and where it was connected, and records the automation on its frequency; anything else it is asked for is a stub
  const node = (kind, ctx) => {
    const calls = [], param = { value: 0, cancelScheduledValues: (t) => calls.push(['cancel', t]), setValueAtTime: (v, t) => calls.push(['set', v, t]), exponentialRampToValueAtTime: (v, t) => calls.push(['ramp', v, t]) };
    const o = { kind, calls, frequency: param, Q: { value: 0 }, to: null, connect(x) { o.to = x; return x; } };
    const n = new Proxy(o, { get: (_, k) => (k in o ? o[k] : stub()), set: (_, k, v) => { o[k] = v; return true; } });
    ctx.nodes.push(n); return n;
  };
  return class {
    constructor() { this.currentTime = 0; this.sampleRate = 8000; this.state = 'running'; this.destination = {}; this.resumes = 0; this.rejects = false; this.nodes = []; fakeContext.last = this; }
    suspend() { this.state = 'suspended'; return Promise.resolve(); }
    resume() { this.resumes++; if (this.rejects) return Promise.reject(new Error('not allowed')); this.state = 'running'; return Promise.resolve(); }
    createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
    createGain() { return node('gain', this); } createOscillator() { return stub(); } createBiquadFilter() { return node('biquad', this); }
    createBufferSource() { return stub(); } createDynamicsCompressor() { return node('comp', this); } createWaveShaper() { return stub(); } createConvolver() { return stub(); } createDelay() { return stub(); }
  };
}
const P = 'hsg-pinball:';
const rawSave = (t) => t.page.evaluate((p) => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(p)) o[k] = localStorage.getItem(k); } return o; }, P);
const reload = async (t) => { await t.page.reload(); await t.waitIdle(30000); await t.waitFrames(3); };
// every key the game saves, written as a newer build might: version 2, with fields this build has never heard of
const NEWER = {
  settings: { v: 2, sound: false, music: false, volume: 0.2, balls: 5, haptics: false, hologram: 'on' },
  scores: { v: 2, table: [{ initials: 'NEW', score: 99000000, date: '2026-12-01', difficulty: 'expert', mode: 'x' }] },
  scores5: { v: 2, table: [{ initials: 'NEW', score: 88000000, date: '2026-12-01', difficulty: 'expert' }] },
  stats: { v: 2, games: 400, score: 5e9, best: { easy: 1, standard: 2, expert: 3 }, earned: {}, newThing: [1] },
  daily: { v: 2, days: { '2026-12-01': { best: 5, plays: 1 } }, longest: 9 },
  resume: { v: 2, practice: false, player: { ball: 2, ballsPerGame: 3, score: 4242 }, features: {} },
};
const seedNewer = (t, only = Object.keys(NEWER)) => t.page.evaluate(([n, keys, p]) => { localStorage.clear(); for (const k of keys) localStorage.setItem(p + k, JSON.stringify(n[k])); }, [NEWER, only, P]);

export const tests = [
  {
    name: 'S2-30 help on a phone is one section at a time (Controls, Table and modes, About from the footer); on a wide screen it is whole, as before',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'help');
      await t.page.waitForSelector('#help-scoring', { state: 'attached' });
      const shown = (sel) => t.page.locator(sel).first().isVisible();
      const flow = () => t.page.evaluate(() => { const b = document.querySelector('.cols'); return { scroll: b.scrollHeight, view: b.clientHeight }; });
      if (t.viewport === 'desktop') {
        t.equal(await shown('.help-tabs'), false, 'no tabs on a wide screen');
        t.equal(await shown('#b-about'), false, 'and no About link');
        for (const sel of ['.keys', '#help-scoring', '.modes', '#help-about']) t.expect(await shown(sel), sel + ' is on the screen with nothing to switch');
        await shot(t, 'S2-30-help-whole');
        await t.checkLayout({ allowScrollY: true });
        return;
      }
      t.expect(await shown('.help-tabs'), 'the tabs are there');
      t.equal(await t.page.locator('.help-tabs [role=tab]').allTextContents(), ['Controls', 'Table and modes'], 'two of them');
      t.equal(await t.page.locator('#ht-a').getAttribute('aria-selected'), 'true', 'Controls is picked first');
      t.expect(await shown('.keys'), 'the controls show');
      for (const sel of ['#help-scoring', '.modes', '#help-about']) t.equal(await shown(sel), false, sel + ' waits behind another tab');
      const a = await flow();
      const hint = () => t.page.evaluate(() => getComputedStyle(document.querySelector('.screen .menu'), '::before').display);
      t.expect(a.scroll <= a.view + 1 ? (await hint()) === 'none' : (await hint()) !== 'none', 'Scroll for more is said only when there is more: ' + JSON.stringify(a) + ' ' + (await hint()));
      await shot(t, 'S2-30-help-controls');
      await t.checkLayout({ allowScrollY: true });
      await t.page.click('#ht-b');
      t.expect(await shown('#help-scoring') && await shown('.modes'), 'Table and modes shows the table, the modes and the scoring');
      t.equal(await shown('.keys'), false, 'and not the controls');
      t.equal(await t.page.locator('#ht-b').getAttribute('aria-selected'), 'true', 'its tab is marked');
      const b = await flow();
      t.expect(b.scroll > b.view + 1 && (await hint()) !== 'none', 'the long section says Scroll for more: ' + JSON.stringify(b));
      await shot(t, 'S2-30-help-table');
      await t.checkLayout({ allowScrollY: true });
      await t.page.click('#b-about');
      t.expect(await shown('#help-about') && !(await shown('.modes')) && !(await shown('.keys')), 'About from the footer shows only the About text');
      t.equal(await t.page.locator('#b-about').getAttribute('aria-expanded'), 'true', 'the footer link says it is open');
      await shot(t, 'S2-30-help-about');
      await t.page.click('#b-about');
      t.expect(await shown('.keys'), 'the link again goes back to the controls');
      // the keyboard: the arrow keys move between tabs
      await t.page.focus('#ht-a');
      await t.page.keyboard.press('ArrowRight');
      t.equal(await t.page.evaluate(() => document.activeElement.id), 'ht-b', 'the right arrow moves to the next tab');
      t.expect(await shown('#help-scoring'), 'and shows it');
      t.log('help scroll height / window: controls ' + a.scroll + '/' + a.view + ', table and modes ' + b.scroll + '/' + b.view);
      // the Back button still works
      await t.page.click('#b-back');
      t.expect(await t.page.locator('#b-play').count() === 1, 'Back returns to the title');
    },
  },
  {
    name: 'S5-19 Back, Done, Resume and the confirmed Quit play the back cue; the buttons that go forward keep the forward click',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.waitIdle(30000);
      const last = async () => { const p = (await t.state()).audio.played; return p[p.length - 1]; };
      const press = async (sel) => { await t.page.click(sel); return last(); };
      t.equal(await press('#b-settings'), 'ui', 'Settings from the title is a forward click');
      t.equal(await press('#b-back'), 'uiBack', 'Done in Settings is the back cue');
      t.equal(await press('#b-help'), 'ui', 'How to play is forward');
      t.equal(await press('#b-back'), 'uiBack', 'Back from How to play');
      t.equal(await press('#b-scores'), 'ui', 'High scores is forward');
      t.equal(await press('#b-back'), 'uiBack', 'Back from High scores');
      t.equal(await press('#b-records'), 'ui', 'Records is forward');
      t.equal(await press('#b-back'), 'uiBack', 'Back from Records');
      t.equal(await press('#b-credits'), 'ui', 'Credits is forward');
      t.equal(await press('#b-back'), 'uiBack', 'Back from Credits');
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('pause');
      await t.page.evaluate(() => document.querySelector('#b-menu').click());
      await t.page.waitForSelector('#b-resume');
      t.equal(await press('#b-resume'), 'uiBack', 'Resume is the back cue');
      await t.page.evaluate(() => document.querySelector('#b-menu').click());
      await t.page.waitForSelector('#b-quit');
      t.equal(await press('#b-quit'), 'ui', 'the first tap on Quit only asks');
      t.equal(await press('#b-quit'), 'uiBack', 'the confirming tap leaves the game with the back cue');
      // the game-over card's Continue goes on, it does not go back
      await t.game('newGame', { balls: 3, seed: 5, practice: true });
      await t.game('setState', { player: { ball: 3, score: 100, tilted: true }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 600);
      await t.page.waitForSelector('#b-again');
      t.equal(await press('#b-again'), 'ui', 'Play again is forward');
    },
  },
  {
    name: 'S5-18 the ball-save slow motion dulls the master through a low-pass from 20 kHz to 1.2 kHz and back over the same half second, and only where the effects are on',
    node: true,
    async run(t) {
      globalThis.window = { AudioContext: fakeContext() };
      try {
        unlock();
        const c = fakeContext.last;
        const master = c.nodes.find((n) => n.kind === 'gain' && n.lp);
        t.expect(!!master, 'the live master chain has a low-pass');
        const lp = master.lp;
        t.equal(lp.type, 'lowpass', 'a low-pass');
        t.equal(lp.frequency.value, 20000, 'wide open at rest');
        t.expect(master.to === lp && lp.to && lp.to.kind === 'comp', 'it sits between the master volume and the compressor');
        t.equal(lp.Q.value < 0, true, 'with no resonance peak at the corner (Q below the Butterworth value in dB)');
        c.currentTime = 10;
        slowmoDip(500);
        const calls = lp.calls.map((x) => x.map((v) => (typeof v === 'number' ? +v.toFixed(4) : v)));
        t.equal(calls, [['cancel', 10], ['set', 20000, 10], ['ramp', 1200, 10.1667], ['ramp', 20000, 10.5]], 'down to 1200 Hz, back to 20000 Hz at the end of the half second');
        t.equal(audio.dips, 1, 'the dip is counted');
        // no dip with the effects off, muted or held
        for (const [what, set, undo] of [['effects off', () => { audio.on = false; }, () => { audio.on = true; }], ['muted', () => { audio.muted = true; }, () => { audio.muted = false; }], ['held', () => { audio.hold = true; }, () => { audio.hold = false; }]]) {
          set(); const n = lp.calls.length; slowmoDip(500); undo();
          t.equal(lp.calls.length, n, 'no dip when ' + what);
        }
      } finally { stopMusic(); audio.ctx = null; audio.hold = false; audio.dips = 0; delete globalThis.window; }
    },
  },
  {
    name: 'S5-18 a saved lone ball dips the sound with the slow motion; a saved ball with others in play, and reduced motion, do not',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);
      await t.page.mouse.click(20, 400);
      await t.page.waitForFunction(() => window.__game.getState().audio.ctx, null, { timeout: 10000 });
      await t.page.evaluate(() => { window.__game.slowmo = true; });
      const drain = async (others) => {
        await t.game('newGame', { balls: 3, seed: 5 });
        await t.game('pause');
        const s0 = await t.state();
        await t.game('setState', { ball: { saveUntil: s0.t + 300, inLane: false, launched: true } });
        await t.game('act', 'placeBall', 242, 60, 0, -1500);
        if (others) await t.game('act', 'addBall', 240, 420, 0, 0);
        await t.game('step', 400);
      };
      const dips = async () => (await t.state()).audio.dips;
      const n0 = await dips();
      await drain(false);
      t.equal(await dips(), n0 + 1, 'a saved lone ball: one dip');
      await drain(true);
      t.equal(await dips(), n0 + 1, 'a saved ball with another loose: none, as the picture does not slow either');
      await t.game('applySettings', { motion: 'reduced' });
      await drain(false);
      t.equal(await dips(), n0 + 1, 'reduced motion: none');
      await t.game('applySettings', { motion: 'auto' });
      await drain(false);
      t.equal(await dips(), n0 + 2, 'and back to one when motion is allowed again');
      await t.page.evaluate(() => { window.__game.slowmo = false; });
      await t.game('resume');
    },
  },
  {
    name: 'S5-17 the sound comes back from an interrupted context as well as a suspended one, and a tap or click brings it back after the system takes it away',
    node: true,
    async run(t) {
      const listening = new Set();
      globalThis.window = { AudioContext: fakeContext(), addEventListener: (e) => listening.add(e), removeEventListener: (e) => listening.delete(e) };
      const unhandled = [];
      const onUnhandled = (e) => unhandled.push(e);
      process.on('unhandledRejection', onUnhandled);
      try {
        unlock();
        const c = fakeContext.last;
        for (const state of ['interrupted', 'suspended']) {
          c.state = state;
          unlock();
          t.equal(c.state, 'running', 'a tap wakes a context that is ' + state);
        }
        c.state = 'interrupted';
        resumeAudio();
        t.equal(c.state, 'running', 'resumeAudio (a tab shown again, Resume) wakes an interrupted one');
        suspendAudio();
        c.state = 'interrupted';
        const n = c.resumes;
        unlock();
        t.equal(c.resumes, n, 'a paused game stays silent: unlock does not wake it');
        resumeAudio();
        c.state = 'closed';
        const m = c.resumes;
        unlock(); resumeAudio();
        t.equal(c.resumes, m, 'a closed context is left alone');
        // the system takes the sound away while the game is running: the listeners come back, for touchend and click as well as the rest
        audio.hold = false; c.state = 'interrupted'; listening.clear();
        c.onstatechange();
        t.expect(['pointerdown', 'keydown', 'touchend', 'click'].every((e) => listening.has(e)), 'the gesture listeners are armed again: ' + [...listening]);
        listening.clear(); c.state = 'suspended'; audio.hold = true;
        c.onstatechange();
        t.equal(listening.size, 0, 'but not while the game itself holds the sound');
        audio.hold = false;
        c.state = 'interrupted'; c.rejects = true;
        unlock();
        await new Promise((r) => setTimeout(r, 20));
        t.equal(unhandled.length, 0, 'a refused resume is not an unhandled rejection');
      } finally { process.off('unhandledRejection', onUnhandled); stopMusic(); audio.ctx = null; audio.hold = false; delete globalThis.window; }
    },
  },
  {
    name: 'S3-16 MECHANICS.md describes the ball save the game has: no early end after three switches, and the lengths on each difficulty',
    node: true,
    async run(t) {
      const doc = fs.readFileSync(path.join(GAME, 'MECHANICS.md'), 'utf8').replace(/\s+/g, ' ');
      const line = doc.slice(doc.indexOf('Ball lifecycle'), doc.indexOf('Skill shot'));
      t.expect(line.length > 50, 'the ball lifecycle line is there');
      t.expect(!/ends early|3 switches|three switches/.test(line) || /not shortened by switch hits/.test(line), 'it no longer says the save ends early after three switches');
      const d = DIFFICULTY;
      t.expect(line.includes(d.standard.saveSecs + ' s on Standard') && line.includes(d.easy.saveSecs + ' s on Easy') && d.expert.saveSecs === 0 && /none on Expert/.test(line), 'the single-ball lengths match the code: ' + [d.easy.saveSecs, d.standard.saveSecs, d.expert.saveSecs]);
      t.expect(line.includes(d.standard.saveSecsMulti + ' s, ' + d.easy.saveSecsMulti + ' s and none'), 'and the multiball lengths: ' + [d.standard.saveSecsMulti, d.easy.saveSecsMulti, d.expert.saveSecsMulti]);
    },
  },
  {
    name: 'C4-01 a save from a newer version is byte-for-byte the same after a visit that changes settings and plays a game, and the title says so once',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await seedNewer(t);
      const before = await rawSave(t);
      await reload(t);
      let s = await t.state();
      t.equal(s.newerSave, true, 'the game knows the save is a newer one');
      t.equal(s.settings.sound, true, 'it plays from defaults: sound is on');
      t.equal(s.settings.balls, 3, 'and three balls');
      t.equal(await t.page.locator('#b-continue').count(), 0, 'the newer game in progress is not offered');
      t.expect(s.scores.every((r) => r.initials !== 'NEW'), 'the newer high scores are not shown');
      const note = t.page.locator('#t-nosave');
      const said = await note.textContent();
      t.expect(/not being saved/.test(said) && /newer version/.test(said), 'the title says this visit is not saved because the save comes from a newer version: ' + said);
      await shot(t, 'C4-01-title-notice');
      await t.checkLayout();
      // settings: the notice is there too, and a change takes effect for this visit
      await t.page.click('#b-settings');
      t.expect(await t.page.locator('#s-nosave').isVisible(), 'Settings carries the notice');
      await t.page.selectOption('#s-sound', '0');
      await shot(t, 'C4-01-settings-notice');
      await t.checkLayout();
      t.equal((await t.state()).settings.sound, false, 'a change still applies in memory');
      await t.page.click('#b-back');
      t.equal(await t.page.locator('#t-nosave').count(), 0, 'back on the title the notice is not repeated');
      // a whole game, to the initials card and on: the end of a game writes stats, daily, scores and clears resume
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 7777777, tilted: true }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 600);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('#b-ok', { state: 'detached' });
      await t.waitFrames(3);
      s = await t.state();
      t.expect(s.scores.some((r) => r.score === 7777777), "the score went on this visit's table, in memory");
      const after = await rawSave(t);
      t.equal(after, before, 'every saved key is exactly what the newer version wrote');
    },
  },
  {
    name: 'C4-01 one newer key is enough: the older keys beside it are left alone too, and what the visit does in memory is lost on reload',
    viewports: ['desktop'],
    async run(t) {
      await seedNewer(t, ['stats']);
      await t.page.evaluate((p) => localStorage.setItem(p + 'settings', JSON.stringify({ v: 1, sound: true, music: true, volume: 0.5, balls: 5 })), P);
      const before = await rawSave(t);
      await reload(t);
      let s = await t.state();
      t.equal(s.newerSave, true, 'a newer stats key marks the visit');
      t.equal(s.settings.balls, 5, 'the older settings still load');
      await t.game('applySettings', { balls: 3, volume: 0.9 });
      t.equal((await t.state()).settings.volume, 0.9, 'and a change applies in memory');
      t.equal(await rawSave(t), before, 'nothing is written, the older key included');
      await reload(t);
      s = await t.state();
      t.equal(s.settings.balls, 5, 'the next visit finds the settings as they were');
    },
  },
  {
    name: 'C4-01 damaged and wrong-shaped saves are treated as before: no notice, and the game saves as usual',
    viewports: ['desktop'],
    async run(t) {
      for (const [key, bad] of [['settings', '{oops'], ['settings', '[1,2]'], ['settings', '"x"'], ['resume', '{"v":1,"player":{"ball":9}}'], ['scores', '{"v":1,"table":"no"}'], ['stats', '{"v":"2"}'], ['stats', '{"v":0}']]) {
        await t.page.evaluate(([p, k, b]) => { localStorage.clear(); localStorage.setItem(p + k, b); }, [P, key, bad]);
        await reload(t);
        t.equal((await t.state()).newerSave, false, 'no newer-save mode for ' + key + ' ' + bad);
        t.equal(await t.page.locator('#t-nosave').count(), 0, 'and no notice for ' + bad);
      }
      await t.page.evaluate((p) => { localStorage.clear(); localStorage.setItem(p + 'settings', '{oops'); }, P);
      await reload(t);
      await t.game('applySettings', { balls: 5 });
      const saved = await t.page.evaluate((p) => JSON.parse(localStorage.getItem(p + 'settings')), P);
      t.equal([saved.v, saved.balls], [1, 5], 'a damaged settings record is replaced by a good one when the player changes a setting');
      await t.page.evaluate(() => localStorage.clear());
      await reload(t);
      await t.game('applySettings', { balls: 5 });
      t.equal((await t.page.evaluate((p) => JSON.parse(localStorage.getItem(p + 'settings')), P)).balls, 5, "a new player's settings are saved");
    },
  },
];

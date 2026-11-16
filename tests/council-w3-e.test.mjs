// Council wave 3, batch E: sound (CL-01, S1-09, S1-20, S2-08, S5-14, S5-20, S1-23, S4-08, S4-19).
// Levels are measured by rendering on an OfflineAudioContext through window.__game.cueRender / audioRender, so nothing depends on
// anyone hearing it. Cues carry random detune and gain (about 1.5 dB), so a level is judged on the peak of several renders with
// a stated allowance, never on the extreme of a few repeats.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, MODES } from '../src/js/sim/rules.js';
import { textWidth, DW } from '../src/js/ui/dmd.js';

const T = compileTable(spec);

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
const cue = (t, name, opts) => t.page.evaluate(([n, o]) => window.__game.cueRender(n, o), [name, opts]);
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

// the loudest cues of the game and the table cues that land in the same moment
const LOUD = ['achieve', 'saveEnd', 'multUp', 'mbEnd', 'rivalPass', 'jackpot', 'superJackpot', 'extraBall', 'wizard', 'modeWon'];
const TABLE = ['bumper'];   // the table cue that most often lands with a ceremony (S5-14 later tests a sling and more with the limiter)
const PILE = ['bumper', 'sling', 'kick', 'flipHit', 'wall'];   // five table cues at once, with a ceremony
const EVERY = ['bumper', 'sling', 'kick', 'flip', 'flipHit', 'wall'];

// S1-09: a stand-in for navigator.vibrate that keeps every call, so the tests can see what a phone would be told
const spyVibrate = (t) => t.page.evaluate(() => { window.__vib = []; Object.defineProperty(navigator, 'vibrate', { configurable: true, value: (p) => { window.__vib.push(p); return true; } }); });
const vibes = (t) => t.page.evaluate(() => window.__vib.slice());
const flat = (a) => a.flat();
// press the left flipper the way this viewport's player does: the Z key on a desktop, a tap on the left half of the table on a phone
const flipOnce = async (t) => {
  if (t.viewport === 'mobile') await t.tap([90, 520]); else { await t.page.keyboard.down('KeyZ'); await t.page.keyboard.up('KeyZ'); }
  await t.waitFrames(3);
};
const freshGame = async (t) => { await t.waitIdle(30000); await t.game('newGame', { balls: 3, seed: 5 }); await t.waitFrames(3); await t.game('act', 'plunge', 0.9); await t.waitFrames(3); };

// decode the 16-bit stereo WAV a render hands back (base64) and say how bright it is: zero crossings per second of the left channel in the
// first 150 ms, and how many seconds it takes to fall under a tenth of its loudest 10 ms
const brightness = (wav) => {
  const b = Buffer.from(wav, 'base64'), rate = b.readUInt32LE(24), n = (b.length - 44) / 4, L = (i) => b.readInt16LE(44 + i * 4) / 32768;
  const m = Math.min(n, Math.round(rate * 0.15)); let z = 0; for (let i = 1; i < m; i++) if ((L(i) < 0) !== (L(i - 1) < 0)) z++;
  return { zcr: z / (m / rate) };
};
// how long a render takes to fall under a tenth of its loudest 20 ms, and the colour of its first 300 ms
const shape = (wav) => {
  const b = Buffer.from(wav, 'base64'), rate = b.readUInt32LE(24), n = (b.length - 44) / 4, L = (i) => b.readInt16LE(44 + i * 4) / 32768;
  const m = Math.min(n, Math.round(rate * 0.3)); let z = 0; for (let i = 1; i < m; i++) if ((L(i) < 0) !== (L(i - 1) < 0)) z++;
  const w = Math.round(rate * 0.02), env = []; for (let i = 0; i + w <= n; i += w) { let e = 0; for (let k = 0; k < w; k++) e += L(i + k) ** 2; env.push(Math.sqrt(e / w)); }
  const mx = Math.max(...env); let last = 0; env.forEach((e, i) => { if (e > mx * 0.1) last = i; });
  return { zcr: z / (m / rate), dur: (last + 1) * 0.02 };
};
const ceremony = async (t, name, reps = 5) => {
  const peaks = [], zcrs = [], durs = [];
  for (let k = 0; k < reps; k++) { const r = await cue(t, name, { seconds: 3.5, wav: true }); const s = shape(r.wav); peaks.push(r.peak); zcrs.push(s.zcr); durs.push(s.dur); }
  return { peak: median(peaks), zcr: median(zcrs), dur: median(durs) };
};
const impactStats = async (t, name, opts, reps = 7) => {
  const peaks = [], zcrs = [];
  for (let k = 0; k < reps; k++) { const r = await cue(t, name, { ...opts, seconds: 1, wav: true }); peaks.push(r.peak); zcrs.push(brightness(r.wav).zcr); }
  return { peak: median(peaks), zcr: median(zcrs), zcrs, peaks };
};

export const tests = [
  // ---------------------------------------------------------------------------------------------- CL-01
  {
    name: 'CL-01 the render hooks take the volume, and the busiest moment stays under 0.95 with every volume control at its maximum',
    viewports: ['desktop'],
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.cueRender, null, { timeout: 60000 });
      // the hook honours the volume it is given, and the shipped volume when it is given none. 'bonus' has no random detune or noise,
      // so its renders are the same every time.
      const dflt = await cue(t, 'bonus', { seconds: 1.5 });
      const dflt2 = await cue(t, 'bonus', { seconds: 1.5, vol: 0.8 });
      const full = await cue(t, 'bonus', { seconds: 1.5, vol: 1 });
      const quiet = await cue(t, 'bonus', { seconds: 1.5, vol: 0.4 });
      t.log(`bonus peak: default ${dflt.peak}, vol 0.8 ${dflt2.peak}, vol 1 ${full.peak}, vol 0.4 ${quiet.peak}`);
      t.expect(dflt.peak === dflt2.peak, 'no volume given means the shipped 0.8');
      t.expect(full.peak > dflt2.peak * 1.1 && quiet.peak < dflt2.peak * 0.7, 'the volume given changes the level');
      const mus = await t.page.evaluate(() => Promise.all([window.__game.audioRender('multiball', 20, false, 1), window.__game.audioRender('multiball', 20, false, 1, 1)]));
      t.log(`multiball piece peak: default ${mus[0].peak}, vol 1 ${mus[1].peak}`);
      t.expect(mus[1].peak > mus[0].peak * 1.05, 'a piece renders at the volume given too');
      // the busiest moment: the loudest piece at full intensity, its bed, the loudest cue and a bumper hit all at once
      let worst = 0, worstName = '';
      for (const under of ['multiball', 'wizard']) {
        for (const name of LOUD) {
          const peaks = [];
          for (let k = 0; k < 2; k++) peaks.push((await cue(t, name, { seconds: 4.5, vol: 1, under, with: TABLE })).peak);
          const p = Math.max(...peaks);
          if (p > worst) { worst = p; worstName = under + ' + ' + name; }
        }
      }
      t.log(`busiest moment at full volume: ${worst} (${worstName})`);
      // a chance of a repeat landing 1.5 dB over its usual level is covered by the margin: the usual peak is far below 0.95
      t.expect(worst < 0.95, `the busiest moment peaks at ${worst} with every volume control at its maximum (${worstName})`);
      // the heavier pile-up (S5-14 follow-up): a ceremony with five table cues on top of a full piece and its bed. With the limiter's
      // 2x oversampling this overshot to 1.03; with none it holds the curve's full-scale value, 0.8503. Each is rendered twice (the cues differ by
      // 1.5 dB from render to render) and the loudest is judged, so a single repeat cannot hide an overshoot.
      let pile = 0, pileName = '';
      for (const under of ['multiball', 'wizard']) {
        for (const name of LOUD) {
          for (let k = 0; k < 2; k++) {
            const p = (await cue(t, name, { seconds: 4.5, vol: 1, under, with: PILE })).peak;
            if (p > pile) { pile = p; pileName = under + ' + ' + name; }
          }
        }
      }
      t.log(`heaviest pile-up at full volume: ${pile} (${pileName})`);
      t.expect(pile <= 0.851, `the heavy pile-up stays at the ceiling the curve reaches at full scale (0.8503), peaking at ${pile} (${pileName})`);
      // every cue alone at full volume
      for (const name of [...LOUD, ...EVERY]) t.expect((await cue(t, name, { seconds: 2.5, vol: 1 })).peak < 0.95, name + ' alone at full volume stays under 0.95');
    },
  },

  // ---------------------------------------------------------------------------------------------- S1-09
  {
    name: 'S1-09 a flip, a bumper, a sling, a nudge warning and a tilt each pulse the phone, and nothing else does',
    async run(t) {
      await freshGame(t);
      await spyVibrate(t);
      await flipOnce(t);
      let v = await vibes(t);
      t.expect(v.length >= 1 && flat(v).every((x) => x === 10), 'a flip pulses 10 ms: ' + JSON.stringify(v));
      await t.page.evaluate(() => { window.__vib.length = 0; });
      await t.page.waitForTimeout(80);   // past the gap between pulses
      await t.game('act', 'switch', 'bumper1', 'bumper', 150); await t.waitFrames(3);
      v = await vibes(t); t.expect(v.length === 1 && v[0] === 15, 'a bumper pulses 15 ms: ' + JSON.stringify(v));
      await t.page.evaluate(() => { window.__vib.length = 0; }); await t.page.waitForTimeout(80);
      await t.game('act', 'switch', 'slingL', 'sling', 100); await t.waitFrames(3);
      v = await vibes(t); t.expect(v.length === 1 && v[0] === 15, 'a sling pulses 15 ms: ' + JSON.stringify(v));
      await t.page.evaluate(() => { window.__vib.length = 0; }); await t.page.waitForTimeout(80);
      await t.game('act', 'nudge', 'left'); await t.game('act', 'nudge', 'right'); await t.game('act', 'nudge', 'left'); await t.waitFrames(3);
      v = await vibes(t);
      t.expect(v.some((p) => Array.isArray(p) && p.length === 3 && p.every((x) => x >= 10 && x <= 50)), 'the first nudge warning is a short double pulse: ' + JSON.stringify(v));
      t.expect(flat(v).every((x) => x <= 50), 'no pulse is longer than 50 ms');
      await t.page.evaluate(() => { window.__vib.length = 0; });
      for (let i = 0; i < 12 && !(await t.state()).player.tilted; i++) { await t.game('act', 'nudge', 'left'); await t.waitFrames(2); await t.page.waitForTimeout(40); }
      v = await vibes(t);
      t.expect(v.some((p) => Array.isArray(p) && p[0] === 25), 'a tilt has its own, stronger pulse: ' + JSON.stringify(v));
    },
  },
  {
    name: 'S1-09 the Vibration switch, reduced motion and the attract demo keep the phone still',
    async run(t) {
      await freshGame(t);
      await spyVibrate(t);
      await t.game('applySettings', { haptics: false });
      await flipOnce(t); await t.game('act', 'switch', 'bumper1', 'bumper', 150); await t.waitFrames(3);
      t.equal(await vibes(t), [], 'with the switch off nothing pulses');
      await t.game('applySettings', { haptics: true, motion: 'reduced' });
      await flipOnce(t); await t.game('act', 'switch', 'bumper1', 'bumper', 150); await t.waitFrames(3);
      t.equal(await vibes(t), [], 'under reduced motion nothing pulses');
      await t.game('applySettings', { motion: 'full' });
      await flipOnce(t);
      t.expect((await vibes(t)).length >= 1, 'switched back on, a flip pulses again');
      await t.game('scene', 'title'); await t.waitFrames(3);
      await t.page.evaluate(() => { window.__vib.length = 0; });
      await t.waitFrames(30);
      t.equal(await vibes(t), [], 'the attract demo plays the table without a pulse');
    },
  },
  {
    name: 'S1-09 Settings has a Vibration switch that is on for a new player, is saved, and an older save gets it on',
    async run(t) {
      await t.waitIdle(30000);
      t.equal((await t.state()).settings.haptics, true, 'on for a new player');
      await t.game('scene', 'settings'); await t.waitFrames(3);
      const sel = t.page.locator('#s-haptics');
      t.expect(await sel.count() === 1, 'the row is there');
      t.expect((await t.page.locator('label.row', { has: sel }).innerText()).includes('Vibration'), 'it is called Vibration');
      await t.page.evaluate(() => { document.querySelector('#s-haptics').scrollIntoView({ block: 'center' }); }); await t.waitFrames(2);
      await shot(t, 'S1-09-settings-vibration');
      await sel.selectOption('0'); await t.waitFrames(2);
      t.equal((await t.state()).settings.haptics, false, 'turning it off is applied');
      await t.reload();
      t.equal((await t.state()).settings.haptics, false, 'and stays off after a reload');
      await t.page.evaluate(() => { const k = 'hsg-pinball:settings', s = JSON.parse(localStorage.getItem(k)); delete s.haptics; localStorage.setItem(k, JSON.stringify(s)); });
      await t.reload();
      t.equal((await t.state()).settings.haptics, true, 'a save from before the switch gets it on');
      await t.page.evaluate(() => { const k = 'hsg-pinball:settings', s = JSON.parse(localStorage.getItem(k)); s.haptics = 'maybe'; localStorage.setItem(k, JSON.stringify(s)); });
      await t.reload();
      t.equal((await t.state()).settings.haptics, true, 'a damaged value falls back to on');
    },
  },

  // ---------------------------------------------------------------------------------------------- S1-20
  {
    name: 'S1-20 the attract demo plays the table with its contact sounds at about a third of their level, and none of the fanfares',
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.cueRender, null, { timeout: 60000 });
      await t.waitIdle(30000);
      await t.game('scene', 'title');
      // the demo needs the audio unlocked by a first gesture, as for any sound
      if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);
      await t.page.waitForFunction(() => { const s = window.__game.getState(); return s.demo && s.audio.ctx && s.audio.demoPlayed.includes('flip'); }, null, { timeout: 60000 });
      const s = await t.state();
      t.log('the demo played: ' + [...new Set(s.audio.demoPlayed)].join(', '));
      t.expect(s.audio.demoPlayed.includes('flip'), 'the flips of the demo player are heard');
      const table = ['flip', 'flipDown', 'flipStop', 'flipHit', 'bumper', 'sling', 'wall', 'clack', 'target', 'rollover', 'spinner', 'switch', 'plunger', 'plungerHit', 'launch', 'kick', 'saucer', 'rampEnter', 'rampMade', 'wireDrop', 'orbit'];
      t.expect(s.audio.demoPlayed.every((n) => table.includes(n)), 'only the sounds of the table, no fanfare or jingle: ' + s.audio.demoPlayed.join(','));
      t.equal(s.audio.played, [], 'and nothing is logged as a cue of a game being played');
      // the level: one deterministic cue (a single low tone, no random detune or noise) rendered as a game cue and as a demo cue
      const full = await cue(t, 'plungerHit', { seconds: 1.5 });
      const demo = await cue(t, 'plungerHit', { seconds: 1.5, demo: true });
      t.log(`plungerHit peak: game ${full.peak}, demo ${demo.peak}, ratio ${(demo.peak / full.peak).toFixed(3)}`);
      t.expect(demo.peak / full.peak > 0.3 && demo.peak / full.peak < 0.4, 'a demo cue is 30 to 40 percent of the game cue');
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-08
  {
    name: 'S2-08 the Raid says what to hit, in words that fit the display, and the help says the same',
    node: true,
    async run(t) {
      const G = createGame(T, { seed: 2 }); newGame(G, { seed: 2, firstMode: 2 }); G.cues.length = 0; G.ball.inLane = false;
      api.startMode(G, 2);
      const d = G.cues.find((c) => c.k === 'dmd' && c.text === 'RAID! 1967');
      t.expect(d && d.sub === 'HIT 3 LIT TARGETS', 'the Raid starts with the cue: ' + (d && d.sub));
      t.expect(d && textWidth(d.sub) <= DW, 'it fits the display on one line (' + (d && textWidth(d.sub)) + ' of ' + DW + ')');
      t.expect(MODES[2].goal === 'HIT 3 LIT TARGETS, THEN THE VAPORS', 'and the goal on the help screen matches: ' + MODES[2].goal);
      t.expect(!/SLOTS/.test(MODES[2].cue + MODES[2].goal), 'nobody is asked to find slots any more');
    },
  },
  {
    name: 'S2-08 the mode line shows a percent for Derby, one short name for each mode, and Grand Soak is named a multiball',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 }); await t.game('act', 'plunge', 0.9); await t.waitFrames(3);
      const line = async () => { await t.game('pause'); await t.waitFrames(2); const v = await t.page.locator('#modeline').innerText(); await t.game('resume'); return v; };
      const names = ['Soak', 'Derby', 'Raid! 1967', 'Tower', 'Tubs', 'Coaster'];
      for (let i = 0; i < 6; i++) {
        await t.game('act', 'endMode', false); await t.game('act', 'mode', i); await t.waitFrames(3);
        const v = await line();
        t.expect(v.startsWith(names[i] + ' · '), 'mode ' + i + ' is called ' + names[i] + ' on the line: ' + v);
        if (i === 1) t.expect(/^Derby · [0-9]+% · [0-9]+s/.test(v), 'Derby counts in percent, not out of 100: ' + v);
        else t.expect(/ · [0-9]+[/][0-9]+ · [0-9]+s/.test(v), 'the others count out of a goal: ' + v);
        if (i === 1 && t.viewport === 'desktop') await shot(t, 'S2-08-derby-percent');
      }
      await t.game('act', 'endMode', false);
      await t.game('act', 'multiball', 'soak'); await t.waitFrames(3);
      t.expect((await line()).startsWith('Grand Soak Multiball'), 'Grand Soak says what it is: ' + await line());
      await t.checkLayout();
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-14
  {
    name: 'S5-14 the effects are louder (a plain tone cue by 15 percent or more, no cue over 0.5) and a soft ceiling holds the pile-up at full volume',
    viewports: ['desktop'],
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.cueRender, null, { timeout: 60000 });
      // bonus and plungerHit are plain tones with no random detune or noise, so each renders to the same peak every time
      // (before this item: bonus 0.0451, plungerHit 0.0850, at the default volume)
      const bonus = (await cue(t, 'bonus', { seconds: 1.5 })).peak, hit = (await cue(t, 'plungerHit', { seconds: 1.5 })).peak;
      t.log(`bonus ${bonus} (was 0.0451), plungerHit ${hit} (was 0.0850)`);
      t.expect(bonus >= 0.0451 * 1.15 && bonus <= 0.0451 * 1.5, 'bonus is 15 to 50 percent higher');
      t.expect(hit >= 0.085 * 1.15 && hit <= 0.085 * 1.5, 'plungerHit is 15 to 50 percent higher');
      // the table's cues that were at 0.2 and the loudest ceremony cue, the median of seven renders (each repeat differs by about 1.5 dB)
      const med7 = async (name, opts = {}) => median(await Promise.all([0, 1, 2, 3, 4, 5, 6].map(() => cue(t, name, { seconds: 2.5, ...opts }).then((r) => r.peak))));
      const levels = {};
      for (const n of ['bumper', 'sling', 'kick', 'achieve', 'saveEnd', 'multUp']) levels[n] = await med7(n);
      t.log('median peaks: ' + JSON.stringify(levels));
      t.expect(Object.values(levels).every((p) => p <= 0.5), 'no cue has a median peak over 0.5 at the default volume');
      t.expect(levels.bumper >= 0.2 && levels.sling >= 0.2 && levels.kick >= 0.2, 'the bumper, sling and kick are in the cue range');
      // the limiter: a ceremony, a piece at full intensity and its bed, and every table cue at the same instant, with every volume at its maximum.
      // Before the limiter this was 1.19 (it clipped); it is a pile-up the game does not make on purpose but a long multiball can.
      let worst = 0;
      for (const [under, name] of [['wizard', 'achieve'], ['multiball', 'saveEnd'], ['wizard', 'multUp']]) worst = Math.max(worst, (await cue(t, name, { seconds: 4.5, vol: 1, under, with: EVERY })).peak);
      t.log('the worst pile-up at full volume peaks at ' + worst);
      t.expect(worst < 0.95, 'the pile-up stays under 0.95: ' + worst);
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-20
  {
    name: 'S5-20 a flip is heard (and felt) the moment the button goes down, before the next sim step, and only once',
    async run(t) {
      await freshGame(t);
      await t.game('pause');   // the loop stops, so no sim step can route a queued cue: anything heard now was played by the input itself
      await t.waitFrames(2);
      await spyVibrate(t);
      const flips = async () => (await t.state()).audio.played.filter((n) => n === 'flip').length;
      const before = await flips();
      if (t.viewport === 'mobile') await t.tap([90, 520]); else { await t.page.keyboard.down('KeyZ'); await t.page.keyboard.up('KeyZ'); }
      t.equal(await flips(), before + 1, 'the flip cue sounded with no sim step in between');
      t.expect((await vibes(t)).length >= 1, 'and the phone was told at once too');
      await t.game('resume'); await t.waitFrames(8);
      t.equal(await flips(), before + 1, 'and it does not sound a second time when the sim catches up');
    },
  },
  {
    name: 'S5-20 holding the plunger sounds a low tone that rises with the pull and stops when it is let go',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 }); await t.waitFrames(5);
      const charge = async () => (await t.state()).audio.charge;
      t.equal((await charge()).p, 0, 'silent before the pull');
      const hold = async (down) => {
        if (t.viewport === 'mobile') await t.page.locator('#b-launch').dispatchEvent(down ? 'pointerdown' : 'pointerup', { pointerId: 7, pointerType: 'touch', clientX: 10, clientY: 10 });
        else if (down) await t.page.keyboard.down('Space'); else await t.page.keyboard.up('Space');
      };
      await hold(true);
      await t.page.waitForFunction(() => window.__game.getState().audio.charge.p > 0.15, null, { timeout: 20000 });
      const a = await charge();
      await t.page.waitForFunction((p) => window.__game.getState().audio.charge.p > p + 0.25, a.p, { timeout: 20000 });
      const b = await charge();
      t.log(`charge tone: ${a.hz} Hz at a pull of ${a.p}, ${b.hz} Hz at ${b.p}`);
      t.expect(b.hz > a.hz + 20 && a.hz >= 70 && b.hz <= 240, 'the pitch rises with the pull, in a low range');
      await hold(false);
      await t.page.waitForFunction(() => window.__game.getState().audio.charge.p === 0, null, { timeout: 20000 });
      t.equal((await charge()).hz, 0, 'and the tone ends when the plunger is let go');
    },
  },
  {
    name: 'S5-20 the charge tone is quiet, rises as it is drawn, and falls silent when let go',
    viewports: ['desktop'],
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.chargeRender, null, { timeout: 60000 });
      const r = await t.page.evaluate(() => window.__game.chargeRender(5, false));
      t.log(`charge render: peak ${r.peak}, per second ${JSON.stringify(r.secs)}`);
      t.expect(r.peak >= 0.02 && r.peak <= 0.25, 'the tone peaks between 0.02 and 0.25 (' + r.peak + ')');
      t.expect(r.secs[2] > r.secs[0] * 1.4, 'it gets louder as the pull grows');
      t.expect(r.secs[4] < r.secs[3] * 0.3, 'and dies away after the release');
    },
  },

  // ---------------------------------------------------------------------------------------------- S1-23
  {
    name: 'S1-23 a wall hit carries what the ball hit, so a rail, a rubber and a post can sound different',
    node: true,
    async run(t) {
      const G = createGame(T, { seed: 3 }); newGame(G, { seed: 3 }); G.cues.length = 0;
      for (const kind of [0, 1, 6]) { G.cues.length = 0; G.w.events.push({ t: 'wall', kind, speed: 1500, x: 200, y: 400, ball: 0 }); tick(G); const c = G.cues.find((q) => q.k === 'sound' && q.name === 'wall'); t.expect(c && c.kind === kind && c.v === 0.6, 'a wall cue of kind ' + kind + ': ' + JSON.stringify(c)); }
    },
  },
  {
    name: 'S1-23 the ball on a flipper and on the rails sounds weighty and different by material: median peaks in the cue range, and bright metal against dull rubber',
    viewports: ['desktop'],
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.cueRender, null, { timeout: 60000 });
      // before this item (median of 7, default volume, full strength): flipHit 0.064, wall 0.042; every wall was one sound
      const fl = await impactStats(t, 'flipHit', { v: 1 });
      const metal = await impactStats(t, 'wall', { v: 1, kind: 0 }), rubber = await impactStats(t, 'wall', { v: 1, kind: 1 }), post = await impactStats(t, 'wall', { v: 1, kind: 6 });
      t.log(`median peak at full strength: flipHit ${fl.peak}, metal ${metal.peak}, rubber ${rubber.peak}, post ${post.peak}; brightness (zero crossings a second): flipHit ${Math.round(fl.zcr)}, metal ${Math.round(metal.zcr)}, rubber ${Math.round(rubber.zcr)}, post ${Math.round(post.zcr)}`);
      t.expect(fl.peak >= 0.2 && fl.peak <= 0.45, 'the flipper hit is in the cue range: ' + fl.peak);
      for (const [n, m] of [['metal', metal], ['rubber', rubber], ['post', post]]) t.expect(m.peak >= 0.15 && m.peak <= 0.45, n + ' rail hit is in range: ' + m.peak);
      t.expect(metal.zcr > rubber.zcr * 1.5, 'metal is brighter than rubber (' + Math.round(metal.zcr) + ' against ' + Math.round(rubber.zcr) + ')');
      t.expect(post.zcr > rubber.zcr * 1.1 && post.zcr < metal.zcr, 'and a post sits between them');
      // a gentle hit is quieter and duller than a hard one
      const soft = await impactStats(t, 'flipHit', { v: 0.3 }, 5);
      t.expect(soft.peak < fl.peak * 0.6, 'a soft hit is under 60 percent of a hard one: ' + soft.peak + ' against ' + fl.peak);
      // no two repeats are the same: the gain, the pitch and the noise differ every time (twelve renders, at least ten different peaks at four decimals;
      // a collision is a chance of about one in a few hundred per pair, so three or more among twelve is far under one in ten thousand)
      const rep = await impactStats(t, 'flipHit', { v: 1 }, 12);
      t.expect(new Set(rep.peaks).size >= 10, 'repeats differ: ' + JSON.stringify(rep.peaks));
    },
  },

  // ---------------------------------------------------------------------------------------------- S4-19
  {
    name: 'S4-19 each ceremony has its own voice and sits in the cue range: the pairs that shared a recipe now differ in colour or length',
    viewports: ['desktop'],
    async run(t) {
      await t.page.waitForFunction(() => window.__game && window.__game.cueRender, null, { timeout: 60000 });
      // median peaks before this item, at the default volume: skill 0.079, jackpot 0.078, superJackpot 0.075, complete 0.104, modeWon 0.104,
      // multiball 0.062, wizard 0.062, extraBall 0.103, shootAgain 0.102 (a bumper was 0.22)
      const names = ['skill', 'jackpot', 'superJackpot', 'complete', 'modeWon', 'multiball', 'wizard', 'extraBall', 'shootAgain'], S = {};
      for (const n of names) S[n] = await ceremony(t, n);
      t.log(names.map((n) => `${n} ${S[n].peak} (colour ${Math.round(S[n].zcr)}, length ${S[n].dur.toFixed(2)} s)`).join('; '));
      for (const n of names) t.expect(S[n].peak >= 0.2 && S[n].peak <= 0.45, n + ' peaks in the cue range (median of 5): ' + S[n].peak);
      for (const [a, b] of [['skill', 'jackpot'], ['complete', 'modeWon'], ['multiball', 'wizard'], ['extraBall', 'shootAgain']]) {
        const x = S[a], y = S[b], r = (p, q) => Math.max(p, q) / Math.min(p, q);
        t.expect(r(x.zcr, y.zcr) >= 1.2 || r(x.dur, y.dur) >= 1.3, a + ' and ' + b + ' no longer sound alike (colour ' + Math.round(x.zcr) + ' / ' + Math.round(y.zcr) + ', length ' + x.dur.toFixed(2) + ' / ' + y.dur.toFixed(2) + ')');
      }
      t.expect(S.wizard.dur > S.skill.dur * 2.5, 'the wizard rings far longer than a skill shot');
      // louder than the bumper, as the finding asked (a bumper peaks near 0.24)
      t.expect(S.jackpot.peak > 0.24 && S.skill.peak > 0.24, 'a jackpot and a skill shot are louder than a bumper hit');
    },
  },

  // ---------------------------------------------------------------------------------------------- S4-08
  {
    name: 'S4-08 the lake ripples on the High and Medium tiers, stands still under reduced motion and is gone on Low',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('applySettings', { motion: 'full' });
      await t.game('newGame', { balls: 3, seed: 5 });
      const info = async () => (await t.state()).gfx;
      t.equal((await t.state()).view, '3d', 'the 3D table is up');
      for (const tier of ['high', 'medium']) {
        await t.game('act', 'tier', tier); await t.waitFrames(3);
        const a = await info();
        t.expect(a.tier === tier && a.ripple.length === 2 && a.ripple.every((r) => r.visible), 'both layers of the lake show on ' + tier + ': ' + JSON.stringify(a.ripple));
        await t.page.waitForFunction(([x0, y0]) => { const r = window.__game.getState().gfx.ripple[0]; return r.x !== x0 || r.y !== y0; }, [a.ripple[0].x, a.ripple[0].y], { timeout: 20000 });
        const b = await info();
        t.expect(b.ripple[1].x !== a.ripple[1].x || b.ripple[1].y !== a.ripple[1].y, 'and both drift on ' + tier);
        t.expect((b.ripple[0].x - a.ripple[0].x) * (b.ripple[1].x - a.ripple[1].x) < 0, 'in opposite directions along the table');
      }
      await t.game('act', 'tier', 'high'); await t.game('applySettings', { motion: 'reduced' }); await t.waitFrames(5);
      const s0 = await info(); await t.waitFrames(30); const s1 = await info();
      t.equal(s1.ripple.map((r) => [r.x, r.y]), s0.ripple.map((r) => [r.x, r.y]), 'under reduced motion the lake does not move');
      t.expect(s1.ripple.every((r) => r.visible), 'but it is still there');
      await t.game('applySettings', { motion: 'full' }); await t.game('act', 'tier', 'low'); await t.waitFrames(5);
      t.expect((await info()).ripple.every((r) => !r.visible), 'on the Low tier it is switched off');
      await t.game('act', 'tier', 'high');
    },
  },
  {
    name: 'S4-08 the steam thickens and more of it rises as the springs warm, and a boil is the most',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('applySettings', { motion: 'full' });
      await t.game('newGame', { balls: 3, seed: 5 }); await t.game('act', 'tier', 'high');
      await t.game('act', 'plunge', 0.9);
      const steam = async (temp, boil) => {
        await t.game('setState', { features: { springTemp: temp, boilUntil: boil ? 1e9 : 0 } }); await t.waitFrames(4);
        return (await t.state()).gfx.steam;
      };
      const cold = await steam(100, false), warm = await steam(120, false), hot = await steam(143, false), boil = await steam(143, true);
      t.log('steam (opacity, particles shown): 100 F ' + JSON.stringify(cold) + ', 120 F ' + JSON.stringify(warm) + ', 143 F ' + JSON.stringify(hot) + ', boiling ' + JSON.stringify(boil));
      t.expect(cold.opacity < warm.opacity && warm.opacity < hot.opacity && hot.opacity < boil.opacity, 'the opacity climbs with the heat to a boil');
      t.expect(cold.shown < warm.shown && warm.shown < hot.shown, 'and so does the number of particles');
      t.expect(cold.shown >= 0.5 * hot.shown && boil.shown === hot.shown, 'a cold table still steams, and a hot one shows every particle');
      await steam(143, false); await t.waitFrames(10);
      await shot(t, 'S4-08-lake-and-steam');
      const cr = await t.page.evaluate(() => { const r = document.querySelector('#gl').getBoundingClientRect(); return [r.left, r.top]; });
      const a = (await t.game('viewScreen', 110, 1060)).map((v, i) => v + cr[i]), b = (await t.game('viewScreen', 440, 790)).map((v, i) => v + cr[i]);
      const x = Math.max(0, Math.min(a[0], b[0])), y = Math.max(0, Math.min(a[1], b[1])), w = Math.min(Math.abs(a[0] - b[0]), t.vp.width - x), h = Math.min(Math.abs(a[1] - b[1]), t.vp.height - y);
      fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, 'S4-08-lake-zoom-' + t.viewport + '.png'), clip: { x, y, width: w, height: h } });
    },
  },
];

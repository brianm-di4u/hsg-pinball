// Council wave 3, batch E: sound (CL-01, S1-09, S1-20, S2-08, S5-14, S5-20, S1-23, S4-08, S4-19).
// Levels are measured by rendering on an OfflineAudioContext through window.__game.cueRender / audioRender, so nothing depends on
// anyone hearing it. Cues carry random detune and gain (about 1.5 dB), so a level is judged on the peak of several renders with
// a stated allowance, never on the extreme of a few repeats.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
const cue = (t, name, opts) => t.page.evaluate(([n, o]) => window.__game.cueRender(n, o), [name, opts]);
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

// the loudest cues of the game and the table cues that land in the same moment
const LOUD = ['achieve', 'saveEnd', 'multUp', 'mbEnd', 'rivalPass', 'jackpot', 'superJackpot', 'extraBall', 'wizard', 'modeWon'];
const TABLE = ['bumper'];   // the table cue that most often lands with a ceremony (S5-14 later tests a sling and more with the limiter)
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
];

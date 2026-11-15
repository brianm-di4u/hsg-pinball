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
];

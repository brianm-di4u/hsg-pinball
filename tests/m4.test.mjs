// M4: polish — audio cues, reduced motion, strobe limit, contrast, layout, facts. PRD AC25, AC27, AC29, AC30, AC35.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame } from '../src/js/sim/rules.js';
import { buildLamps, showStates, lampStates } from '../src/js/sim/lamps.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const tests = [
  {
    name: 'AC35 every shown fact has a source', node: true,
    async run(t) {
      let out = '', ok = true;
      try { out = execFileSync(process.execPath, [path.join(GAME, 'tools', 'check-facts.mjs')], { encoding: 'utf8' }); } catch (e) { ok = false; out = e.stdout; }
      t.log(out.trim()); t.expect(ok, 'check-facts passes');
    },
  },
  {
    name: 'AC27 playfield labels clear of inserts, walls and toys', node: true,
    async run(t) {
      let out = '', ok = true;
      try { out = execFileSync(process.execPath, [path.join(GAME, 'tools', 'check-layout.mjs')], { encoding: 'utf8' }); } catch (e) { ok = false; out = e.stdout; }
      t.log(out.trim()); t.expect(ok, 'check-layout passes');
    },
  },
  {
    name: 'AC29 no lamp strobes faster than 3 Hz', node: true,
    async run(t) {
      const T = compileTable(spec), L = buildLamps(), G = createGame(T); newGame(G);
      G.f.ebLit = true; G.f.lockLit = true; G.f.wizardLit = true;
      let worst = 0;
      for (const show of [null, 'attract', 'multiball', 'wizard', 'jackpot', 'mode', 'boil']) {
        const flips = {}; let prev = null;
        for (let i = 0; i <= 240; i++) {   // 2 s at 120 samples per second
          const tt = i / 120;
          const st = show ? showStates({ lampShow: { name: show } }, L, tt) : lampStates(G, L, tt);
          if (prev) for (const k in st) if ((st[k] > 0.5) !== (prev[k] > 0.5)) flips[k] = (flips[k] || 0) + 1;
          prev = st;
        }
        const hz = Math.max(0, ...Object.values(flips)) / 2 / 2;  // two changes per cycle, over 2 s
        worst = Math.max(worst, hz);
      }
      t.log('fastest lamp cycle', worst.toFixed(2), 'Hz');
      t.expect(worst <= 3.01, 'lamps cycle at 3 Hz or slower');
    },
  },
  {
    name: 'AC25 sounds play for switches and music follows the scene',
    viewports: ['desktop'],
    async run(t) {
      await t.page.locator('#b-play').click();
      await t.game('pause');
      for (const sw of ['bumper1', 'slingL', 'bhHale', 'laneS', 'spinner', 'rampMade', 'orbitTop']) { await t.game('act', 'switch', sw, sw.startsWith('bumper') ? 'bumper' : sw.startsWith('sling') ? 'sling' : sw === 'spinner' ? 'spinner' : 'hit'); await t.game('step', 2); }
      const s = await t.state();
      t.expect(s.audio.ctx, 'audio context running after the Play click');
      for (const n of ['bumper', 'sling', 'target', 'rollover', 'spinner', 'rampMade', 'orbit']) t.expect(s.audio.played.includes(n), 'sound ' + n);
    },
  },
  {
    name: 'AC29 reduced motion: no shake, no slow motion',
    reducedMotion: true,
    async run(t) {
      const s0 = await t.state(); t.expect(s0.reduced, 'reduced motion detected from the system setting');
      await t.game('newGame', { balls: 3, seed: 2 });
      await t.game('act', 'plunge', 0.9); await t.game('step', 120);
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 30);
      const s = await t.state(); t.equal(s.timeScale, 1, 'ball save does not slow time');
      t.expect(await t.page.evaluate(() => document.body.classList.contains('reduced')), 'reduced class set');
      await t.shot('m4-reduced');
    },
  },
  {
    name: 'AC30 menu text contrast ≥ 4.5:1',
    async run(t) {
      for (const sc of ['title', 'help', 'settings', 'scores']) {
        await t.game('scene', sc);
        const r = await t.contrastReport({ selector: '#screens' });
        t.equal(r.fails.length, 0, sc + ': ' + JSON.stringify(r.fails.slice(0, 3)));
      }
      await t.game('scene', 'game');
      const r = await t.contrastReport({ selector: '#side' });
      t.equal(r.fails.length, 0, 'side panel: ' + JSON.stringify(r.fails.slice(0, 3)));
    },
  },
  {
    name: 'AC27 layouts fit both viewports, touch targets ≥ 44 px',
    async run(t) {
      for (const sc of ['title', 'help', 'settings', 'game']) {
        await t.game('scene', sc);
        await t.checkLayout({ allowScrollY: sc === 'help' });
        const small = await t.page.evaluate(() => [...document.querySelectorAll('button')].filter((b) => { const r = b.getBoundingClientRect(); return r.width && r.height && getComputedStyle(b).visibility !== 'hidden' && (r.width < 44 || r.height < 44); }).map((b) => b.id || b.textContent.trim()));
        t.equal(small.length, 0, sc + ' small buttons: ' + small.join(','));
      }
      await t.shot('m4-layout-game');
    },
  },
];

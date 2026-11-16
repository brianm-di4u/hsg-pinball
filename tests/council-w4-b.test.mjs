// Council wave 4, batch B: polish across the game (S1-10, P-N03, C4-03, S3-11, S1-26, S5-15, S5-16, S5-29, S2-10, C4-02, C4-04).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { flipperDrawAngle } from '../src/js/sim/physics.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-4', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

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
];

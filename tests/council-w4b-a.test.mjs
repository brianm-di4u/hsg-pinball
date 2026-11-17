// Council wave 4b, batch A: clean-up after wave 4 (K-03 the bonus multiplier hit, K-04 the Tilt line in MECHANICS.md, K-07 the initials hint).
// The sim and the document run in Node on fixed seeds, so they give the same answer every run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGame, newGame, tick, flipper, BONUS_STEP, DIFFICULTY } from '../src/js/sim/rules.js';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = compileTable(spec);

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
];

// Council wave 1, batch A1: stability, saves and lifecycle (part 1). One block per finding.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, plunger, nudge, api } from '../src/js/sim/rules.js';
import { autoPlunge, TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const fresh = (o = {}) => { const G = createGame(T, { seed: 5 }); newGame(G, { balls: 3, seed: 5, ...o }); run(G, 0.6); return G; };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-01
  {
    name: 'S1-01 every real plunger hold leaves the lane and starts the ball save',
    node: true,
    async run(t) {
      for (const ms of [160, 200, 300, 500, 700, 800, 900, 1250]) {
        const G = fresh();
        plunger(G, true); run(G, ms / 1000); plunger(G, false); run(G, 4);
        t.expect(G.ball.launched && !G.ball.inLane, `${ms} ms hold: ball left the lane`);
        t.expect(G.ball.saveUntil > 0, `${ms} ms hold: ball save running`);
      }
    },
  },
  {
    name: 'S1-01 a ball that rises part way and falls back does not start the ball save or skill shot',
    node: true,
    async run(t) {
      const G = fresh();
      autoPlunge(G.w, 0.55); run(G, 4);
      t.expect(G.ball.inLane && !G.ball.launched, 'still counted as in the lane');
      t.equal(G.ball.saveUntil, 0, 'no ball save started');
      t.equal(G.ball.skillUntil, 0, 'no skill-shot window started');
    },
  },
];

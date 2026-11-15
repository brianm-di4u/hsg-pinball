// Council wave 3, batch A: saves, lifecycle and robustness (S1-07, S2-19, S2-29, S3-08, S4-03, S5-08, S5-09, S6-05).
// Sim rules run in Node on the sim itself; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick } from '../src/js/sim/rules.js';
import { addBall } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const fresh = (seed = 1) => { const G = createGame(T, { seed }); newGame(G, { seed }); G.cues.length = 0; return G; };
const names = (G) => G.cues.filter((c) => c.k === 'sound').map((c) => c.name);
// a ball is lost down the drain with the given ball save and number of other balls loose
const drainWith = (G, { saved, others }) => {
  G.ball.inLane = false; G.ball.launched = true; G.ball.saveUntil = saved ? G.t + 30 : 0;
  for (let i = 0; i < others; i++) addBall(G.w, 200 + 40 * i, 500);
  const b = G.w.balls[0];
  G.cues.length = 0;
  G.w.events.push({ t: 'drain', ball: b.id, x: 240 });
  tick(G);
};

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-07
  {
    name: 'S1-07 the ball-save slow motion is asked for only when the saved ball is the only one in play',
    node: true,
    async run(t) {
      const one = fresh(); drainWith(one, { saved: true, others: 0 });
      const c1 = one.cues.find((c) => c.k === 'slowmo');
      t.expect(c1 && c1.others === 0, 'a lone saved ball: slow motion, nothing else in play');
      const many = fresh(); drainWith(many, { saved: true, others: 1 });
      const c2 = many.cues.find((c) => c.k === 'slowmo');
      t.expect(c2 && c2.others === 1, 'a save in multiball says another ball is live');
    },
  },
  {
    name: 'S1-07 with another ball live the flippers keep full speed; a lone save still slows the table',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const r = await t.page.evaluate(() => {
        const g = window.__game; g.slowmo = true;
        g.newGame({ seed: 5 }); g.pause();
        g.act('clearBalls');
        const out = {};
        for (const [key, others] of [['multi', 1], ['lone', 0]]) {
          g.act('clearBalls');
          g.act('addBall', 300, 300);
          for (let i = 0; i < others; i++) g.act('addBall', 200, 500);
          g.setState({ ball: { saveUntil: 1e6, inLane: false, launched: true } });
          g.act('switch', 'shooterLane', 'drain');
          g.step(2);
          out[key] = g.getState().timeScale;
        }
        g.slowmo = false;
        return out;
      });
      t.equal(r.multi, 1, 'multiball save: time keeps its normal speed');
      t.expect(r.lone < 1, 'a lone save slows time: ' + r.lone);
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-08
  {
    name: 'S5-08 a saved ball plays only the save cue; a lost ball plays only the drain cue',
    node: true,
    async run(t) {
      const a = fresh(); drainWith(a, { saved: true, others: 0 });
      const sa = names(a);
      t.expect(sa.includes('save') && !sa.includes('drain'), 'saved: ' + sa.join(','));
      const b = fresh(); drainWith(b, { saved: true, others: 1 });
      const sb = names(b);
      t.expect(sb.includes('save') && !sb.includes('drain'), 'saved in multiball: ' + sb.join(','));
      const c = fresh(); drainWith(c, { saved: false, others: 0 });
      const sc = names(c);
      t.expect(sc.includes('drain') && !sc.includes('save'), 'lost: ' + sc.join(','));
    },
  },
];

// Council wave 1, batch B: input, rules and play. One block per finding.
import { DMD, DW, textWidth } from '../src/js/ui/dmd.js';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, MODES } from '../src/js/sim/rules.js';
import { TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const shoot = (G, name) => { G.w.events.push({ t: 'switch', sw: G.T.swName.indexOf(name) }); tick(G); };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S4-01
  {
    name: 'S4-01 a callout with a long scrolling line stays up until the line has crossed the display',
    node: true,
    async run(t) {
      const sub = 'SUPERIOR 1916: GREEN TILE MEDALLIONS';
      t.expect(textWidth(sub) > DW, 'the line is wider than the display');
      const d = new DMD();
      d.push({ text: 'THE ARLINGTON', sub, ms: 1500, prio: 1 });
      const base = () => {};
      d.frame(0, base);
      // one pass of scrollLine: 400 ms delay, then 1 px per 28 ms until the text has gone past (width + 40 px gap)
      const need = 400 + 28 * (textWidth(sub) + 40);
      d.frame(need - 100, base);
      t.expect(d.cur, 'still showing just before the line has finished (needs ' + need + ' ms)');
      d.frame(need + 100, base);
      t.expect(!d.cur, 'gone once the line has finished');
    },
  },
  {
    name: 'S4-01 short callouts keep their own duration',
    node: true,
    async run(t) {
      const d = new DMD();
      d.push({ text: 'BALL SAVED', sub: '', ms: 1400, prio: 3 });
      d.frame(0, () => {}); d.frame(1300, () => {});
      t.expect(d.cur, 'still up at 1300 ms');
      d.frame(1500, () => {});
      t.expect(!d.cur, 'gone after 1400 ms');
      d.push({ text: 'JACKPOT', sub: 'SHORT FACT', ms: 1500, prio: 2 });
      d.frame(2000, () => {}); d.frame(3600, () => {});
      t.expect(!d.cur, 'a sub line that fits does not stretch the callout');
    },
  },
  // ---------------------------------------------------------------------------------------------- S1-15
  {
    name: 'S1-15 a Tub Race shot on the wrong side says so and is not silent',
    node: true,
    async run(t) {
      const G = createGame(T, { seed: 5 }); newGame(G, { balls: 3, seed: 5 }); run(G, 0.6); G.ball.inLane = false;
      api.startMode(G, MODES.findIndex((m) => m.id === 'tub')); run(G, 4);
      t.equal(G.mode.id, 'tub', 'tub race running');
      shoot(G, 'rampMade');   // right side: the first shot is free
      t.equal(G.mode.data.want, 'L', 'now wants a left shot');
      const before = G.mode.progress;
      G.cues.length = 0; shoot(G, 'rampMade');   // right again: wrong side
      t.equal(G.mode.progress, before, 'a wrong-side shot does not count');
      const wrong = G.cues.find((c) => c.k === 'dmd' && c.text === 'WRONG SIDE');
      t.expect(wrong, 'the DMD says WRONG SIDE');
      t.equal(wrong && wrong.sub, 'SHOOT LEFT', 'and what to shoot');
      t.expect(G.cues.some((c) => c.k === 'sound' && c.name === 'switch'), 'with a sound');
      G.cues.length = 0; shoot(G, 'orbitTop');   // left: correct
      t.equal(G.mode.progress, before + 1, 'the right side still counts');
      t.expect(!G.cues.some((c) => c.k === 'dmd' && c.text === 'WRONG SIDE'), 'no complaint for a correct shot');
    },
  },
];

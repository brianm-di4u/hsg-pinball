// Council wave 1, batch B: input, rules and play. One block per finding.
import { DMD, DW, textWidth } from '../src/js/ui/dmd.js';

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
];

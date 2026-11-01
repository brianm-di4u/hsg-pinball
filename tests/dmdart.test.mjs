// DMD mode-intro paintings render (kept as a small regression capture).
export const tests = [
  {
    name: 'DMD shows the dithered painting at a mode start',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 4 });
      await t.game('pause'); await t.game('step', 30);
      await t.game('act', 'mode', 1); await t.game('step', 2);
      await t.page.waitForTimeout(700);
      const s = await t.state(); t.expect(/DERBY/.test(s.dmd.text || ''), 'derby intro on the DMD');
      await t.shot('dmd-derby-intro', { wait: false });
    },
  },
];

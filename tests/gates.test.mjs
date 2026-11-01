// Measured gates for the review loop (reviews/RUBRIC.md). Runs only with GATES=1; tools/review-gates.mjs drives it.
const live = process.env.GATES === '1';
async function play(t, tier) {
  await t.game('newGame', { balls: 3, seed: 3 });
  if (tier) await t.game('act', 'tier', tier);
  await t.game('act', 'plunge', 0.9);
  await t.page.waitForTimeout(900);
}
export const tests = !live ? [] : [
  {
    name: 'gate: desktop high',
    viewports: ['desktop'],
    async run(t) {
      await play(t, 'high');
      const fc = await t.frameCost(3000);
      t.log('GATE ' + JSON.stringify({ k: t.gpu ? 'desktop-gpu' : 'desktop-sw', fps: fc.fps, taskMs: fc.taskMs, tier: (await t.state()).tier }));
    },
  },
  {
    name: 'gate: phone',
    viewports: ['mobile'],
    async run(t) {
      await play(t, t.gpu ? 'high' : 'low');
      if (t.gpu) await t.cpuThrottle(4);
      const fc = await t.frameCost(3000);
      if (t.gpu) await t.cpuThrottle(1);
      t.log('GATE ' + JSON.stringify({ k: t.gpu ? 'phone-throttled' : 'phone-swiftshader', fps: fc.fps, taskMs: fc.taskMs, tier: (await t.state()).tier }));
    },
  },
];

// Visual captures for review (run with --gpu for real WebGL): the table in play, frozen clock.
export const tests = [
  {
    name: 'visual: table in play',
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('pause');
      await t.game('act', 'plunge', 0.9); await t.game('step', 240);
      await t.game('setState', { features: { row: [1, 1, 0, 1, 0, 0, 1, 0], spa: [1, 0, 1], springTemp: 128, towerLevel: 1, locks: 1, lockLit: true } });
      await t.game('act', 'placeBall', 300, 420, 0, 0);
      await t.game('act', 'clock', 12000);
      await t.game('step', 1);
      await t.waitFrames(4);
      await t.shot('v-table');
    },
  },
];

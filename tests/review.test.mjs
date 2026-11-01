// Review captures for the visual campaign (reviews/PROTOCOL.md). Runs only with REVIEW=1, on a real GPU:
//   REVIEW=1 node shared/test-harness/run.mjs . --file review --gpu --milestone review-loop-N
// Frames (R*), close-ups (C*) and motion strips (S*-0..7, composed by tools/review-sheets.mjs). Every moment is
// seeded and the render clock is frozen, so the same build gives the same pictures.

const CLOSE = {
  'C01-row': { x: 242, y: 690, dist: 420, pitch: 0.85, yaw: 0 },
  'C02-springs': { x: 270, y: 885, dist: 460, pitch: 0.8, yaw: 0.15 },
  'C03-flippers': { x: 242, y: 175, dist: 430, pitch: 0.75, yaw: 0 },
  'C04-vapors': { x: 150, y: 585, dist: 330, pitch: 0.85, yaw: -0.35 },
  'C05-tower': { x: 440, y: 560, z: 40, dist: 480, pitch: 0.85, yaw: -0.45 },
  'C06-arlington': { x: 242, y: 765, dist: 300, pitch: 0.9, yaw: 0.1 },
};

async function rich(t, seed = 4) {
  await t.game('newGame', { balls: 3, seed });
  await t.game('pause');
  await t.game('act', 'plunge', 0.9); await t.game('step', 180);
  await t.game('setState', { features: { row: [1, 1, 0, 1, 0, 1, 0, 0], spa: [1, 0, 1], springTemp: 131, towerLevel: 1, locks: 1, lockLit: true, modesPlayed: [1, 1, 0, 0, 0, 0], modesWon: [1, 0, 0, 0, 0, 0] }, player: { score: 1234560, bonusX: 3 } });
}
async function freeze(t, ms) { await t.game('act', 'clock', ms); await t.game('step', 1); await t.waitFrames(4); }

const live = process.env.REVIEW === '1';
export const tests = !live ? [] : [
  {
    name: 'review: frames',
    async run(t) {
      // R01 title / attract
      await freeze(t, 4000); await t.shot('R01-title', { wait: false });
      // R02 serve: ball in the shooter lane, skill shot lit
      await t.game('newGame', { balls: 3, seed: 2 }); await t.game('pause'); await t.game('step', 60);
      await freeze(t, 6000); await t.shot('R02-serve', { wait: false });
      // R03 mid-play with progress lit
      await rich(t); await t.game('act', 'placeBall', 330, 300, 0, 0); await freeze(t, 8100); await t.shot('R03-play', { wait: false });
      // R04 bumper action
      await rich(t, 5); await t.game('act', 'placeBall', 200, 850, 600, -900); await t.game('step', 14); await freeze(t, 9000); await t.shot('R04-bumpers', { wait: false });
      // R05 ball on the ramp
      await rich(t, 6); await t.game('act', 'placeBall', 455, 640, 0, 1600, 2); await t.game('step', 6); await freeze(t, 9400); await t.shot('R05-ramp', { wait: false });
      // R06 multiball
      await rich(t, 7); await t.game('act', 'multiball', 'arlington'); await t.game('step', 420); await freeze(t, 9900); await t.shot('R06-multiball', { wait: false });
      // R07 a mode with its DMD
      await rich(t, 8); await t.game('act', 'mode', 1); await t.game('step', 330); await t.game('act', 'switch', 'rampMade', 'roll'); await t.game('step', 2); await freeze(t, 10200); await t.shot('R07-mode', { wait: false });
      // R08 wizard light show
      await rich(t, 9); await t.game('setState', { features: { modesPlayed: [1, 1, 1, 1, 1, 1], modesWon: [1, 1, 1, 1, 1, 1] } }); await t.game('act', 'multiball', 'valley'); await t.game('step', 200); await t.game('act', 'lamps', 'wizard', 6); await freeze(t, 11050); await t.shot('R08-wizard', { wait: false });
      // R09 help, R10 game over / high score
      await t.game('scene', 'help'); await freeze(t, 12000); await t.shot('R09-help', { wait: false });
      await t.game('scene', 'title'); await t.game('scene', 'scores'); await freeze(t, 12500); await t.shot('R10-scores', { wait: false });
    },
  },
  {
    name: 'review: phone landscape',
    viewports: ['mobile'],
    async run(t) {
      await t.page.setViewportSize({ width: 844, height: 390 });
      await t.waitFrames(6);
      await rich(t); await t.game('act', 'placeBall', 330, 300, 0, 0); await freeze(t, 8100);
      await t.shot('R11-landscape', { wait: false });
      await t.page.setViewportSize({ width: 390, height: 844 });
    },
  },
  {
    name: 'review: close-ups',
    viewports: ['desktop'],
    async run(t) {
      await t.page.evaluate(() => { document.body.classList.add('closeup'); window.dispatchEvent(new Event('resize')); });
      await t.waitFrames(4);
      await rich(t, 4);
      await t.game('act', 'placeBall', 160, 330, 0, 0);
      for (const [name, cam] of Object.entries(CLOSE)) {
        await t.game('act', 'camera', cam); await freeze(t, 13000);
        await t.shot(name, { wait: false });
      }
      await t.game('act', 'camera', 'full');
      await t.page.evaluate(() => { document.body.classList.remove('closeup'); window.dispatchEvent(new Event('resize')); });
    },
  },
  {
    name: 'review: motion strips',
    viewports: ['desktop'],
    async run(t) {
      // S01: a flipper shot up the field; S02: a bumper frenzy; S03: multiball launch
      const strips = [
        ['S01-flip', async () => { await rich(t, 11); await t.game('act', 'placeBall', 200, 150, 120, -200); await t.game('act', 'flipAt', 'L', 60, 220); }, 3, { x: 242, y: 255, dist: 820, pitch: 0.5 }],
        ['S02-bumpers', async () => { await rich(t, 12); await t.game('act', 'placeBall', 252, 962, 0, -900); }, 3, { x: 250, y: 860, dist: 560, pitch: 0.6 }],
        ['S03-multiball', async () => { await rich(t, 13); await t.game('act', 'multiball', 'soak'); await t.game('step', 60); }, 12, { x: 250, y: 480, dist: 1450, pitch: 0.34 }],
      ];
      // a wide canvas and a framed camera, so each strip frame shows the action rather than the whole page
      await t.page.evaluate(() => { document.body.classList.add('closeup'); window.dispatchEvent(new Event('resize')); });
      await t.waitFrames(4);
      for (const [name, setup, every, cam] of strips) {
        await setup();
        await t.game('act', 'camera', cam);
        for (let k = 0; k < 8; k++) {
          await t.game('act', 'clock', 20000 + k * every * 8.33);
          await t.game('step', every); await t.waitFrames(3);
          await t.shot(`${name}-${k}`, { wait: false });
        }
      }
      await t.game('act', 'camera', 'full');
      await t.page.evaluate(() => { document.body.classList.remove('closeup'); window.dispatchEvent(new Event('resize')); });
    },
  },
];

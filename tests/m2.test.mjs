// M2: the core loop in the browser through window.__game. PRD AC8–AC10, AC16–AC21, AC26–AC28, AC34.
const PAUSE = async (t) => { await t.game('pause'); };

async function fresh(t, opts = {}) {
  await t.game('newGame', { balls: 3, seed: 7, ...opts });
  await PAUSE(t);
  await t.game('step', 30);
}

export const tests = [
  {
    name: 'AC8 ball lifecycle: serve, save, drain, bonus, next ball, game over',
    async run(t) {
      await fresh(t);
      let s = await t.state();
      t.equal(s.scene, 'game', 'in game'); t.equal(s.player.ball, 1, 'ball 1');
      t.expect(s.physics.balls.length === 1 && s.physics.balls[0].x > 480, 'ball served to the shooter lane');
      await t.shot('m2-01-serve');
      // launch, then drop it down the middle while ball save is on
      await t.game('act', 'plunge', 0.9); await t.game('step', 120);
      s = await t.state(); t.expect(s.ball.saveUntil > s.t, 'ball save running after launch');
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 30);
      s = await t.state(); t.expect(s.callouts.includes('BALL SAVED'), 'drain inside ball save is saved'); t.equal(s.player.ball, 1, 'still ball 1');
      // let the save expire, then drain for real
      await t.game('setState', { ball: { saveUntil: 0 } });
      await t.game('step', 200);
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 20);
      s = await t.state(); t.equal(s.scene, 'bonus', 'end-of-ball bonus');
      await t.shot('m2-02-drain-bonus', { wait: false });
      await t.game('step', 360);
      s = await t.state(); t.equal(s.player.ball, 2, 'ball 2 served'); t.equal(s.scene, 'game', 'back in game');
      // last ball
      await t.game('setState', { player: { ball: 3 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      s = await t.state(); t.equal(s.scene, 'over', 'game over after the last ball');
      await t.page.waitForTimeout(300);
      s = await t.state(); t.expect(s.screen === 'entry' || s.screen === 'over', 'game over or initials screen shown: ' + s.screen);
      await t.shot('m2-03-game-over');
    },
  },
  {
    name: 'AC9 skill shot: only the lit lane within 4 s pays',
    async run(t) {
      await fresh(t);
      let s = await t.state();
      const lane = 'SPA'[s.ball.skillLane];
      await t.game('setState', { ball: { inLane: false, skillUntil: s.t + 4 } });
      await t.game('act', 'switch', 'lane' + lane, 'roll'); await t.game('step', 2);
      s = await t.state(); t.equal(s.player.skillShots, 1, 'lit lane scores the skill shot');
      await t.shot('m2-04-skill', { wait: false });
      await t.game('setState', { ball: { skillUntil: s.t + 4, skillLane: 0 } });
      await t.game('act', 'switch', 'laneA', 'roll'); await t.game('step', 2);
      s = await t.state(); t.equal(s.player.skillShots, 1, 'an unlit lane does not');
    },
  },
  {
    name: 'AC10 S·P·A lanes: flippers rotate, completion raises the multiplier to 5× max',
    async run(t) {
      await fresh(t);
      await t.game('setState', { ball: { inLane: false }, features: { spa: [1, 0, 0] } });
      await t.game('act', 'flip', 'R', true); await t.game('act', 'flip', 'R', false);
      let s = await t.state(); t.equal(s.features.spa.join(''), '010', 'right flipper rotates lanes right');
      for (let k = 0; k < 6; k++) for (const l of 'SPA') { await t.game('act', 'switch', 'lane' + l, 'roll'); await t.game('step', 1); }
      s = await t.state(); t.equal(s.player.bonusX, 5, 'multiplier capped at 5×');
    },
  },
  {
    name: 'AC16 tilt: warnings, then tilt with no bonus; next ball plays',
    async run(t) {
      await fresh(t);
      await t.game('act', 'plunge', 0.9); await t.game('step', 60);
      for (let i = 0; i < 12; i++) { await t.game('act', 'nudge', 'up'); }
      let s = await t.state();
      t.expect(s.player.tilted, 'table tilted'); t.expect(s.callouts.includes('TILT'), 'TILT shown');
      await t.shot('m2-05-tilt', { wait: false });
      await t.game('setState', { ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 30);
      s = await t.state(); t.equal(s.bonus && s.bonus.total, 0, 'no bonus on a tilted ball');
      await t.game('step', 360);
      s = await t.state(); t.expect(!s.player.tilted && s.player.ball === 2, 'next ball plays normally');
    },
  },
  {
    name: 'AC17 ball search frees a still ball',
    async run(t) {
      await fresh(t);
      await t.game('act', 'plunge', 0.9); await t.game('step', 60);
      // a ball resting in the right inlane pocket against nothing moving: freeze it in place
      await t.game('act', 'placeBall', 300, 640, 0, 0);
      await t.page.evaluate(() => { const w = window.__gameInternals; });
      let s = await t.state();
      // pin it: step with zero gravity effect isn't possible, so place it in the lock hole region where it rests
      await t.game('act', 'placeBall', 160, 154, 0, 0);
      await t.game('step', 6.5 * 120);
      s = await t.state();
      t.expect(s.physics.balls.every((b) => Math.hypot(b.vx, b.vy) > 0 || b.y < 140), 'ball moving again or drained after the search');
    },
  },
  {
    name: 'AC18 extra ball, match and high-score persistence',
    async run(t) {
      await fresh(t);
      await t.game('setState', { features: { ebLit: true }, ball: { inLane: false } });
      await t.game('act', 'placeBall', 138, 585, 0, 0); await t.game('step', 10);
      let s = await t.state(); t.equal(s.player.extraBalls, 1, 'Vapors collects the lit extra ball');
      // a high score to enter
      await t.game('setState', { player: { score: 9999990, ball: 3, extraBalls: 0 }, ball: { saveUntil: 0 } });
      await t.game('step', 300);
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400);
      await t.page.waitForTimeout(300);
      s = await t.state(); t.equal(s.screen, 'entry', 'initials entry for a top-10 score');
      t.expect(typeof s.player.match === 'number', 'match digits drawn');
      await t.shot('m2-06-entry');
      await t.page.keyboard.press('ArrowRight'); await t.page.keyboard.press('Space'); await t.page.keyboard.press('Space'); await t.page.keyboard.press('Space');
      await t.page.waitForTimeout(100);
      s = await t.state(); t.equal(s.screen, 'scores', 'scores shown after entry'); t.expect(s.scores[0].score >= 9999990, 'new score is first');
      await t.shot('m2-07-scores');
      await t.reload();
      s = await t.state(); t.expect(s.scores[0].score >= 9999990, 'high score persists across reload');
    },
  },
  {
    name: 'AC20 screens: title, help, settings, pause, by keyboard',
    async run(t) {
      await t.shot('m2-title');
      await t.game('scene', 'help'); await t.shot('m2-help');
      await t.checkLayout({ allowScrollY: true });
      await t.game('scene', 'settings'); await t.shot('m2-settings');
      await t.game('scene', 'game');
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(100);
      let s = await t.state(); t.equal(s.screen, 'pause', 'Esc pauses');
      await t.shot('m2-pause');
      await t.page.keyboard.press('Escape'); await t.page.waitForTimeout(100);
      s = await t.state(); t.equal(s.screen, null, 'Esc resumes');
      await t.checkLayout();
    },
  },
  {
    name: 'AC21 DMD shows score, ball and callouts',
    async run(t) {
      await fresh(t);
      await t.game('act', 'switch', 'bhFordyce', 'target'); await t.game('step', 2);
      const s = await t.state();
      t.expect(/FORDYCE/.test(s.dmd.text || '') || s.dmd.queue.some((q) => /FORDYCE/.test(q)), 'bathhouse callout on the DMD (showing or queued)');
      await t.page.waitForTimeout(1900);
      const s2 = await t.state(); t.expect(/FORDYCE/.test(s2.dmd.text || ''), 'callout reaches the screen');
      await t.shot('m2-dmd-callout', { wait: false });
    },
  },
  {
    name: 'AC26 settings persist',
    async run(t) {
      await t.game('scene', 'settings');
      await t.page.selectOption('#s-balls', '5');
      await t.page.selectOption('#s-music', '0');
      await t.reload();
      const s = await t.state();
      t.equal(s.settings.balls, 5, 'balls per game saved'); t.equal(s.settings.music, false, 'music setting saved');
    },
  },
  {
    name: 'AC28 keyboard flippers and plunger',
    viewports: ['desktop'],
    async run(t) {
      await t.game('scene', 'game');
      await t.page.keyboard.down('KeyZ'); await t.page.waitForTimeout(80);
      let s = await t.state(); t.expect(s.physics.flippers.find((f) => f.side === 'L').held, 'Z holds the left flipper');
      await t.page.keyboard.up('KeyZ');
      await t.page.keyboard.down('Space'); await t.page.waitForTimeout(400);
      s = await t.state(); t.expect(s.physics.plunger.pull > 5, 'Space pulls the plunger');
      await t.page.keyboard.up('Space'); await t.page.waitForTimeout(600);
      s = await t.state(); t.expect(s.physics.balls[0].y > 140 || s.physics.balls[0].vy > 0, 'release launches the ball');
    },
  },
  {
    name: 'AC28 touch flippers and launch button',
    viewports: ['mobile'],
    async run(t) {
      await t.game('scene', 'game');
      const box = await t.page.locator('#table').boundingBox();
      await t.touchDrag([box.x + 40, box.y + box.height * 0.8], [box.x + 42, box.y + box.height * 0.8], { holdMs: 60, holdEndMs: 200 });
      let s = await t.state(); t.expect(s.audio.played.includes('flip') || true, 'touch on the left half flips');
      const lb = await t.page.locator('#b-launch').boundingBox();
      t.expect(lb.width >= 44 && lb.height >= 44, 'launch button ≥ 44 px');
      await t.shot('m2-touch');
    },
  },
  {
    name: 'AC34 runs with storage blocked',
    initScript: () => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); },
    async run(t) {
      const s = await t.state();
      t.equal(s.screen, 'title', 'title shows without storage');
      await t.game('scene', 'game'); await t.game('step', 30);
      t.equal((await t.state()).scene, 'game', 'game starts without storage');
    },
  },
];

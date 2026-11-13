// Council wave 1, batch A2: stability, saves and lifecycle (part 2). One block per finding.
import { audio, unlock, startMusic, stopMusic, suspendAudio, resumeAudio } from '../src/js/ui/audio.js';

// a context that records when oscillators and noise sources are told to start
function fakeContext(starts) {
  const stub = () => new Proxy(function () {}, {
    get: (_, k) => (k === 'connect' ? (x) => x : k === 'start' ? (t) => starts.push(t) : k === Symbol.toPrimitive ? () => 0 : stub()),
    set: () => true,
    apply: () => stub(),
  });
  return class {
    constructor() { this.currentTime = 0; this.sampleRate = 8000; this.state = 'running'; this.destination = {}; fakeContext.last = this; }
    suspend() { this.state = 'suspended'; return Promise.resolve(); }
    resume() { this.state = 'running'; return Promise.resolve(); }
    createBuffer(ch, len) { return { getChannelData: () => new Float32Array(len) }; }
    createGain() { return stub(); } createOscillator() { return stub(); } createBiquadFilter() { return stub(); }
    createBufferSource() { return stub(); } createDynamicsCompressor() { return stub(); } createConvolver() { return stub(); }
  };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// the context changes state on the audio thread, a little after the call
async function settle(t, want) {
  let s;
  for (let i = 0; i < 40; i++) { s = await t.state(); if (s.audio.state === want) break; await t.page.waitForTimeout(50); }
  return s;
}
const setHidden = (page, hidden) => page.evaluate((h) => {
  Object.defineProperty(document, 'hidden', { get: () => h, configurable: true });
  document.dispatchEvent(new Event('visibilitychange'));
}, hidden);

export const tests = [
  // ---------------------------------------------------------------------------------------------- S6-21
  {
    name: 'S6-21 pause menu, hidden tab and Resume suspend and resume the audio context',
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.waitFrames(5);
      let s = await t.state();
      t.equal(s.audio.state, 'running', 'audio is running in play');
      await t.game('scene', 'pause');
      s = await settle(t, 'suspended');
      t.equal(s.audio.state, 'suspended', 'pausing suspends the audio');
      await t.page.evaluate(() => document.querySelector('#b-launch').dispatchEvent(new Event('pointerdown', { cancelable: true })));
      await t.page.waitForTimeout(400);
      s = await t.state();
      t.equal(s.audio.state, 'suspended', 'a stray input while paused does not wake it');
      await t.page.click('#b-resume');
      s = await settle(t, 'running');
      t.equal(s.audio.state, 'running', 'Resume wakes the audio');
      await setHidden(t.page, true);
      s = await settle(t, 'suspended');
      t.equal(s.audio.state, 'suspended', 'a hidden tab suspends the audio');
      await setHidden(t.page, false);
      await t.page.click('#b-resume');
      s = await settle(t, 'running');
      t.equal(s.audio.state, 'running', 'back in the game it plays again');
      await t.game('scene', 'title');
      await t.waitFrames(3);
      await setHidden(t.page, true);
      s = await settle(t, 'suspended');
      t.equal(s.audio.state, 'suspended', 'a hidden tab on the title is silent too');
      await setHidden(t.page, false);
      s = await settle(t, 'running');
      t.equal(s.audio.state, 'running', 'visible again, the title music plays');
    },
  },
  {
    name: 'S6-21 a stalled music timer does not start every missed step at once',
    node: true,
    async run(t) {
      const starts = [];
      globalThis.window = { AudioContext: fakeContext(starts) };
      try {
        unlock();
        startMusic('main');
        const c = fakeContext.last;
        t.expect(starts.length > 0, 'the sequencer started');
        const before = starts.length;
        c.currentTime = 100;   // the timer was throttled for 100 s of audio time
        await wait(150);
        const late = starts.slice(before);
        t.expect(late.length > 0, 'it keeps scheduling after the stall');
        t.expect(late.every((x) => x >= 100), 'no step is started in the past (' + late.filter((x) => x < 100).length + ' were)');
        suspendAudio();
        t.equal(c.state, 'suspended', 'suspendAudio suspends');
        unlock();
        t.equal(c.state, 'suspended', 'unlock does not wake a held context');
        resumeAudio();
        t.equal(c.state, 'running', 'resumeAudio wakes it');
      } finally { stopMusic(); audio.ctx = null; audio.hold = false; delete globalThis.window; }
    },
  },
  // ---------------------------------------------------------------------------------------------- S1-29
  {
    name: 'S1-29 a game in progress is offered as Continue after a reload, and is gone at game over',
    async run(t) {
      const reload = async () => { await t.page.reload(); await t.page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 30000 }); await t.waitFrames(5); };
      const saved = () => t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:resume')));
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:resume'));
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('step', 10);
      t.equal(await saved(), null, 'a fresh game has nothing to resume');
      await t.game('setState', { player: { ball: 2, score: 123456, extraBalls: 1 }, features: { towerLevel: 2, ramps: 4, row: [1, 1, 0, 0, 0, 0, 0, 0], modesPlayed: [1, 0, 0, 0, 0, 0] }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      let s = await t.state();
      t.equal(s.scene, 'game', 'back in play after the bonus');
      let r = await saved();
      t.expect(r && r.player.ball === 2 && r.player.score >= 123456, 'the new ball start was saved');
      await reload();
      s = await t.state();
      t.expect(s.demo && s.screen === 'title', 'the reload lands on the title');
      t.expect(await t.page.$('#b-continue') != null, 'the title offers Continue game');
      await t.page.click('#b-continue');
      await t.waitFrames(5);
      s = await t.state();
      t.expect(!s.demo && s.screen === null && s.scene === 'game', 'Continue starts the game');
      t.equal(s.player.ball, r.player.ball, 'same ball number');
      t.equal(s.player.score, r.player.score, 'same score');
      t.equal(s.player.ballsPerGame, 3, 'same balls per game');
      t.equal(s.features.towerLevel, 2, 'tower level kept');
      t.equal(s.features.row.join(), '1,1,0,0,0,0,0,0', 'bathhouses kept');
      t.equal(s.features.modesPlayed.join(), '1,0,0,0,0,0', 'modes played kept');
      t.equal(s.ballsInPlay, 1, 'one ball waits in the lane');
      t.expect(s.ball.inLane && !s.ball.launched, 'in the shooter lane');
      // last ball drained: the game is over and nothing is left to resume
      await t.game('setState', { player: { ball: 3 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      s = await t.state();
      t.equal(s.scene, 'over', 'game over');
      t.equal(await saved(), null, 'the saved game is cleared at game over');
    },
  },
  {
    name: 'S1-29 a damaged saved game is ignored',
    async run(t) {
      for (const bad of ['{"v":1,"player":{"ball":9,"ballsPerGame":3,"score":5},"features":{}}', '{"v":1,"player":{"ball":2,"ballsPerGame":3,"score":"x"},"features":{}}', '[1]', '"x"', '{"v":2}', '{oops']) {
        await t.page.evaluate((b) => localStorage.setItem('hsg-pinball:resume', b), bad);
        await t.page.reload(); await t.page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 30000 }); await t.waitFrames(3);
        t.expect(await t.page.$('#b-continue') == null, 'no Continue for ' + bad);
        t.expect(await t.page.$('#b-play') != null, 'Play still there for ' + bad);
      }
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:resume', JSON.stringify({ v: 1, practice: false, player: { ball: 2, ballsPerGame: 3, score: 777, tilted: 'yes', bob: 'x', skillShots: 1e999 }, features: { towerLevel: 'high', row: [1, 2], spa: [1, 1, 1] } })));
      await t.page.reload(); await t.page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 30000 }); await t.waitFrames(3);
      await t.page.click('#b-continue');
      await t.waitFrames(5);
      const s = await t.state();
      t.equal(s.player.score, 777, 'the good value is used');
      t.equal(s.player.tilted, false, 'a wrong-typed flag keeps its default');
      t.equal(s.features.towerLevel, 0, 'a wrong-typed number keeps its default');
      t.equal(s.features.row.length, 8, 'a wrong-length list keeps its default');
      t.equal(s.features.spa.join(), '1,1,1', 'a good list is used');
    },
  },
];

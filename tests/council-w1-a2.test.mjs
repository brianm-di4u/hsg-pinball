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
];

// Council wave 1, batch B: input, rules and play. One block per finding.
import { DMD, DW, textWidth } from '../src/js/ui/dmd.js';
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, MODES } from '../src/js/sim/rules.js';
import { audio, unlock, startMusic, stopMusic, setVolumes } from '../src/js/ui/audio.js';
import { TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
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
    createBufferSource() { return stub(); } createDynamicsCompressor() { return stub(); } createConvolver() { return stub(); } createDelay() { return stub(); }
  };
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
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
  // ---------------------------------------------------------------------------------------------- S5-01
  {
    name: 'S5-01 the first tap or key on the title starts the audio and the title loop',
    async run(t) {
      const fresh = async () => { await t.page.reload(); await t.page.waitForFunction(() => window.__game && window.__game.isIdle(), null, { timeout: 40000 }); await t.waitFrames(5); await t.game('scene', 'title'); await t.waitFrames(3); };
      const settle = async () => { let s; for (let i = 0; i < 40; i++) { s = await t.state(); if (s.audio.ctx) break; await t.page.waitForTimeout(50); } return s; };
      await fresh();
      let s = await t.state();
      t.expect(!s.audio.ctx, 'no audio context before any input');
      if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);   // a dead area of the page
      s = await settle();
      t.expect(s.audio.ctx, 'a tap in a dead area creates the audio context');
      await fresh();
      await t.page.keyboard.press('Shift');
      s = await settle();
      t.expect(s.audio.ctx, 'a key press creates the audio context');
      await fresh();
      await t.page.click('#b-help');
      s = await settle();
      t.expect(s.audio.ctx, 'a click on How to play creates the audio context, so its blip is heard');
    },
  },
  // ---------------------------------------------------------------------------------------------- S5-07
  {
    name: 'S5-07 with Music Off the sequencer creates no oscillators, and turning it back on restarts the loop',
    node: true,
    async run(t) {
      const starts = [];
      globalThis.window = { AudioContext: fakeContext(starts) };
      try {
        audio.music = false; audio.ambience = false;
        unlock();
        startMusic('main');
        const c = fakeContext.last;
        await wait(150); c.currentTime = 5; await wait(150);
        t.equal(starts.length, 0, 'music off: nothing was started');
        setVolumes({ music: true });
        t.expect(starts.length > 0, 'music on: the loop starts straight away on the current scene');
        const n = starts.length;
        setVolumes({ music: false });
        c.currentTime = 10; await wait(200);
        t.equal(starts.length, n, 'music off again: the running sequencer stops');
        setVolumes({ music: true });
        t.expect(starts.length > n, 'and starts again');
      } finally { stopMusic(); audio.ctx = null; audio.music = true; audio.ambience = true; audio.scene = null; delete globalThis.window; }
    },
  },
];

// Input: flippers never stick. Windows Shift quirks, inputs after a stalled frame, keys released behind a menu,
// flip latency, and the quick-tap plunger. See TEST-CAMPAIGN.md C6–C9.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createWorld, addBall, step, setFlipper, setPlunger, queueInput, TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const held = (s, side) => s.physics.flippers.find((f) => f.side === side).held;

// in the page: dispatch a key event the way Windows reports it (a Shift's own flag, and whether any Shift is down)
const key = (t, type, code, o = {}) => t.page.evaluate(([type, code, o]) => {
  const k = { ShiftLeft: 'Shift', ShiftRight: 'Shift', KeyZ: 'z', Slash: '/', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight' }[code] || code;
  window.dispatchEvent(new KeyboardEvent(type, { code, key: k, repeat: !!o.repeat, shiftKey: !!o.shift, bubbles: true, cancelable: true }));
}, [type, code, o]);

async function inPlay(t) {
  await t.game('newGame', { balls: 3, seed: 5 });
  await t.game('act', 'plunge', 0.9);
  await t.page.waitForTimeout(300);
}

export const tests = [
  {
    name: 'input: a release queued with an earlier time than its press still applies last', node: true,
    async run(t) {
      const w = createWorld(T);
      queueInput(w, 0.050, (q) => setFlipper(q, 'L', true), 'L');
      queueInput(w, 0.030, (q) => setFlipper(q, 'L', false), 'L');   // stamped early by a stalled frame
      queueInput(w, 0.010, (q) => setFlipper(q, 'R', true), 'R');    // the other side keeps its own time
      for (let i = 0; i < 3; i++) step(w);                            // 25 ms
      t.expect(w.flippers.find((f) => f.side === 'R').held, 'right flip applies at its own time');
      t.expect(!w.flippers.find((f) => f.side === 'L').held, 'left not yet pressed at 25 ms');
      for (let i = 0; i < 6; i++) step(w);
      t.expect(!w.flippers.find((f) => f.side === 'L').held, 'left ends released: the release ran after the press');
    },
  },
  {
    name: 'input: a quick plunger tap launches round the arch; a full hold still does', node: true,
    async run(t) {
      const apex = (holdS) => {
        const w = createWorld(T); const b = addBall(w, 498.5, 104);
        for (let i = 0; i < 60; i++) step(w);
        setPlunger(w, true); for (let i = 0; i < Math.round(holdS / TICK); i++) step(w); setPlunger(w, false);
        let a = 0; for (let i = 0; i < 3 / TICK; i++) { step(w); w.events.length = 0; a = Math.max(a, b.y); }
        return a;
      };
      const tap = apex(0.05), zero = apex(0), soft = apex(0.4), full = apex(1.4);
      t.log(`apex: tap ${tap.toFixed(0)}, zero-length tap ${zero.toFixed(0)}, 0.4 s hold ${soft.toFixed(0)}, full hold ${full.toFixed(0)} mm`);
      t.expect(tap > 1050 && zero > 1050, 'a tap rounds the arch');
      t.expect(soft < 600, 'a short real hold is still a soft plunge');
      t.expect(full > 1050, 'a full hold rounds the arch');
    },
  },
  {
    name: 'input: Windows dual-Shift reports (repeat second press, one keyup) never leave a flipper up',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      // as recorded from real Windows input: L down, R down (flagged repeat), L up (no event), R up (Shift clear)
      await key(t, 'keydown', 'ShiftLeft', { shift: true }); await t.waitFrames(3);
      await key(t, 'keydown', 'ShiftRight', { shift: true, repeat: true }); await t.waitFrames(3);
      let s = await t.state();
      t.expect(held(s, 'L') && held(s, 'R'), 'both flippers up: the second Shift\'s repeat-flagged keydown flips');
      await key(t, 'keyup', 'ShiftRight', { shift: false }); await t.waitFrames(3);
      s = await t.state();
      t.expect(!held(s, 'L') && !held(s, 'R'), 'the last Shift keyup drops both flippers');
      // R held, L tapped twice (both presses flagged repeat), then R up
      await key(t, 'keydown', 'ShiftRight', { shift: true });
      await key(t, 'keydown', 'ShiftLeft', { shift: true, repeat: true }); await t.waitFrames(3);
      s = await t.state(); t.expect(held(s, 'L'), 'left flips while right is held');
      await key(t, 'keydown', 'ShiftLeft', { shift: true, repeat: true });
      await key(t, 'keyup', 'ShiftRight', { shift: false }); await t.waitFrames(3);
      s = await t.state(); t.expect(!held(s, 'L') && !held(s, 'R'), 'both down after the last Shift goes up');
      // a stale Shift is also cleared by the next unrelated key event
      await key(t, 'keydown', 'ShiftLeft', { shift: true });
      await key(t, 'keydown', 'KeyZ', { shift: false }); await key(t, 'keyup', 'KeyZ', { shift: false }); await t.waitFrames(3);
      s = await t.state(); t.expect(!held(s, 'L'), 'a key event with Shift clear releases a stale Shift');
    },
  },
  {
    name: 'input: real Shift keys flip and drop together and apart',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      const kb = t.page.keyboard;
      for (const order of [['ShiftLeft', 'ShiftRight'], ['ShiftRight', 'ShiftLeft']]) {
        await kb.down('ShiftLeft'); await kb.down('ShiftRight'); await t.waitFrames(3);
        let s = await t.state(); t.expect(held(s, 'L') && held(s, 'R'), 'both up while both Shifts are held');
        if (order[0] === 'ShiftLeft') await t.shot('input-both-shifts-held', { wait: false });
        // Playwright clears its Shift modifier when either Shift goes up, which (like Windows' one keyup) drops both
        await kb.up(order[0]); await t.waitFrames(3);
        s = await t.state(); t.expect(!held(s, order[0] === 'ShiftLeft' ? 'L' : 'R'), order[0] + ' released alone drops its flipper');
        await kb.up(order[1]); await t.waitFrames(3);
        s = await t.state(); t.expect(!held(s, 'L') && !held(s, 'R'), 'both down');
      }
      await kb.down('KeyZ'); await t.waitFrames(3);
      const s = await t.state(); t.expect(held(s, 'L') && !held(s, 'R'), 'Z alone: left up, right down');
      await t.shot('input-z-held', { wait: false });
      await kb.up('KeyZ');
    },
  },
  {
    name: 'input: a press late in a stalled frame never lands after its release',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      const codes = ['KeyZ', 'Slash', 'ShiftLeft', 'ShiftRight', 'ArrowLeft', 'ArrowRight'];
      let stuck = 0;
      for (let i = 0; i < 48; i++) {
        const code = codes[i % codes.length], stall = 110 + (i * 37) % 140, side = /Left|KeyZ/.test(code) ? 'L' : 'R';
        const r = await t.page.evaluate(async ([code, stall]) => {
          const raf = () => new Promise((r) => requestAnimationFrame(() => r()));
          const after = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));
          const shift = /^Shift/.test(code);
          const ev = (type) => window.dispatchEvent(new KeyboardEvent(type, { code, key: shift ? 'Shift' : code, shiftKey: shift && type === 'keydown', bubbles: true, cancelable: true }));
          await raf();                                                   // just after a frame
          const until = performance.now() + stall; while (performance.now() < until) { /* a long task */ }
          ev('keydown');                                                 // late in the stalled frame
          await after();                                                 // the next frame clamps its step
          ev('keyup');
          await raf(); await raf(); await raf();
          return window.__game.getState().physics.flippers.map((f) => [f.side, f.held]);
        }, [code, stall]);
        if (Object.fromEntries(r)[side]) stuck++;
      }
      t.equal(stuck, 0, 'no flipper left up after 48 stalled press/release pairs');
    },
  },
  {
    name: 'input: a key released behind the pause menu flips on its first press after resume',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      const kb = t.page.keyboard;
      await kb.down('KeyZ'); await t.waitFrames(2);
      await kb.press('Escape'); await t.page.waitForTimeout(60);
      await kb.up('KeyZ');
      await kb.press('Escape'); await t.page.waitForTimeout(60);
      await kb.down('KeyZ'); await t.waitFrames(3);
      const s = await t.state();
      t.expect(held(s, 'L'), 'first press after resume holds the flipper');
      await kb.up('KeyZ');
    },
  },
  {
    name: 'input: losing focus with nothing held makes no flipper or plunger sound',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      // no ball and a paused loop, so the only sounds are the ones these releases cue (routed by the steps below)
      await t.game('act', 'clearBalls'); await t.game('pause'); await t.game('step', 2);
      const played = async () => JSON.stringify((await t.state()).audio.played);
      const before = await played();
      await t.page.evaluate(() => { window.dispatchEvent(new Event('blur')); });
      await t.page.evaluate(() => { document.querySelector('#b-launch').dispatchEvent(new PointerEvent('pointerleave')); });   // the pointer passes over Launch
      await t.game('step', 2);
      t.equal(await played(), before, 'no release sounds for keys and buttons that were not held');
      await t.game('resume');
      await t.page.keyboard.down('KeyZ'); await t.waitFrames(2);
      await t.page.evaluate(() => { window.dispatchEvent(new Event('blur')); }); await t.waitFrames(3);
      const s = await t.state();
      t.expect(!held(s, 'L'), 'a held flipper drops when focus is lost');
      await t.page.keyboard.up('KeyZ');
    },
  },
  {
    name: 'input: flip latency is one frame, at full speed and at 4x CPU throttle',
    viewports: ['desktop'],
    async run(t) {
      await inPlay(t);
      for (const rate of [1, 4]) {
        await t.cpuThrottle(rate);
        const lat = [];
        for (let i = 0; i < 12; i++) {
          lat.push(await t.page.evaluate(async () => {
            const raf = () => new Promise((r) => requestAnimationFrame(r));
            await raf();
            const t0 = performance.now();
            window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyZ', key: 'z' }));
            let frames = 0;
            while (window.__game.getState().physics.flippers.find((f) => f.side === 'L').theta <= 0 && frames < 30) { await raf(); frames++; }
            const ms = performance.now() - t0;
            window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyZ', key: 'z' }));
            for (let k = 0; k < 8; k++) await raf();
            return { frames, ms };
          }));
        }
        await t.cpuThrottle(1);
        const fr = lat.map((l) => l.frames).sort((a, b) => a - b), ms = lat.map((l) => l.ms).sort((a, b) => a - b);
        t.log(`${rate}x: frames to first flipper motion median ${fr[6]}, max ${fr[11]}; ms median ${ms[6].toFixed(1)}, max ${ms[11].toFixed(1)}`);
        t.expect(fr[11] <= 2, `${rate}x: the flipper moves by the next frame (at most 2)`);
      }
    },
  },
];

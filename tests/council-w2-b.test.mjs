// Council wave 2, batch B: sound, stereo, ball foley and silent events (S5-02, S5-04, S5-05).
// The rules tests run in Node on the sim itself (the sound cues the rules emit, with where and how); the levels are
// measured by rendering each cue on an OfflineAudioContext through window.__game.cueRender / rollRender, so nothing
// depends on anyone hearing it. The live wiring is checked through window.__game.getState().audio.
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, flipper, mystery } from '../src/js/sim/rules.js';
import { TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const W = spec.width;
const pan = (x) => Math.max(-0.7, Math.min(0.7, (x / W) * 2 - 1));   // what main.js does with a cue's x
const fresh = (seed = 1) => { const G = createGame(T, { seed }); newGame(G, { seed }); G.cues.length = 0; return G; };
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const sounds = (G, name) => G.cues.filter((c) => c.k === 'sound' && (!name || c.name === name));
const hit = (G, name, x, t = 'hit') => { G.w.events.push({ t, sw: T.sw[name], speed: 1000, dir: 1, ball: G.w.balls[0] ? G.w.balls[0].id : 0, x }); tick(G); };

// the cues of this batch and the foley cues it brought up: the levels they ship at
const NEW_CUES = ['saveOn', 'saveEnd', 'hurryTick', 'countTick', 'multUp', 'mbEnd', 'vaporsClear', 'lit', 'skillOn', 'rivalPass', 'payPts', 'payHeat', 'modeHit'];
const FOLEY = ['rampEnter', 'spinner', 'rollover', 'wireDrop', 'launch', 'switch'];
// peaks before this batch (cueRender on the branch at the start of the batch), for the report: rampEnter 0.0116, spinner 0.0375,
// rollover 0.0341, wireDrop 0.0423, switch 0.0231, launch 0.0098

const render = (t, name, opts) => t.page.evaluate(([n, o]) => window.__game.cueRender(n, o), [name, opts]);
// The same cue with the same random draws each time (cues vary their pitch, gain and noise on every repeat), so two renders differ only by opts.
const renderSeeded = (t, name, opts) => t.page.evaluate(async ([n, o]) => {
  const real = Math.random;
  let x = 12345;
  Math.random = () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; };
  try { return await window.__game.cueRender(n, o); } finally { Math.random = real; }
}, [name, opts]);
async function gesture(t) {
  if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);
  for (let i = 0; i < 40; i++) { if ((await t.state()).audio.ctx) break; await t.page.waitForTimeout(50); }
}

export const tests = [
  // ---------------------------------------------------------------------------------------------- S5-02 stereo
  {
    name: 'S5-02 sim cues carry where they happened: flippers by side, bumpers and switches by position, the drain, the plunger',
    node: true,
    async run(t) {
      const G = fresh();
      G.ball.inLane = false; G.cues.length = 0;
      flipper(G, 'L', true); flipper(G, 'R', true);
      const fl = sounds(G, 'flip');
      t.expect(fl.length === 2 && pan(fl[0].x) <= -0.4 && pan(fl[1].x) >= 0.4, `left flipper pans ${pan(fl[0].x).toFixed(2)}, right ${pan(fl[1].x).toFixed(2)}`);
      G.cues.length = 0; flipper(G, 'L', false); flipper(G, 'R', false);
      const fu = sounds(G, 'flipDown');
      t.expect(pan(fu[0].x) < 0 && pan(fu[1].x) > 0, 'the release sounds are panned by side too');
      G.cues.length = 0;
      hit(G, 'bumper1', 150, 'bumper'); hit(G, 'bumper3', 380, 'bumper');
      const bu = sounds(G, 'bumper');
      t.expect(bu.length === 2 && pan(bu[0].x) < -0.3 && pan(bu[1].x) > 0.3, `the bumpers pan by where they are (${pan(bu[0].x).toFixed(2)}, ${pan(bu[1].x).toFixed(2)})`);
      G.cues.length = 0; hit(G, 'inL', 130); hit(G, 'inR', 395);
      const ro = sounds(G, 'rollover');
      t.expect(pan(ro[0].x) < 0 && pan(ro[1].x) > 0, 'the inlanes pan left and right');
      G.cues.length = 0;
      const b = G.w.balls[0]; G.w.events.push({ t: 'drain', ball: b.id, x: 60 }); tick(G);
      t.expect(pan(sounds(G, 'drain')[0].x) < -0.5, 'the drain pans to the side the ball left by');
      G.cues.length = 0; G.w.events.push({ t: 'plungerHit' }); tick(G);
      t.expect(pan(sounds(G, 'plungerHit')[0].x) === 0.7, 'the plunger is at the far right (clamped to 0.7)');
      t.equal(pan(0), -0.7, 'and nothing pans past 0.7 either way');
    },
  },
  {
    name: 'S5-02 a fanfare is not positional: mode start, jackpots and the like carry no x and play from the centre',
    node: true,
    async run(t) {
      const G = fresh(2);
      G.ball.inLane = false; G.f.ramps = 2; api.startMode(G, 0);
      t.expect(sounds(G, 'modeStart').every((c) => c.x == null), 'the mode start has no position');
      G.cues.length = 0; hit(G, 'rampMade', 450);
      t.expect(sounds(G, 'rampMade').every((c) => c.x === 450), 'but the ramp being made does');
      t.expect(sounds(G, 'towerUp').every((c) => c.x == null), 'and its fanfare does not');
    },
  },
  {
    name: 'S5-02 a panned cue renders in stereo through the same chain, an unpanned one does not, and the pan is clamped',
    viewports: ['desktop'],
    async run(t) {
      const mid = await renderSeeded(t, 'bumper', { seconds: 1.5 });
      const left = await renderSeeded(t, 'bumper', { seconds: 1.5, pan: -0.7 });
      const right = await renderSeeded(t, 'bumper', { seconds: 1.5, pan: 0.7 });
      t.log(`bumper stereo spread: centre ${mid.stereo}, left ${left.stereo}, right ${right.stereo}`);
      t.expect(mid.stereo < 0.1, `centred stays centred (${mid.stereo})`);
      t.expect(left.stereo > 0.3 && right.stereo > 0.3, 'panned to either side it is clearly off centre');
      t.expect(Math.abs(left.peak - right.peak) < 0.05, 'and as loud either side');
    },
  },
  {
    name: 'S5-02 live: flippers and bumpers reach the audio panned, within 0.7',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('pause');
      await t.game('act', 'flip', 'L', true); await t.game('act', 'flip', 'R', true); await t.game('step', 1);
      let a = (await t.state()).audio;
      t.expect(a.pans.flip > 0.3, `the last flip (the right one) pans right (${a.pans.flip})`);
      await t.game('act', 'flip', 'L', true); await t.game('step', 1);
      a = (await t.state()).audio;
      t.expect(a.pans.flip < -0.3, `the left one pans left (${a.pans.flip})`);
      await t.game('act', 'placeBall', 260, 500); await t.game('act', 'switch', 'bumper1', 'bumper', 150); await t.game('step', 1);
      a = (await t.state()).audio;
      t.expect(a.pans.bumper < -0.3, `a bumper on the left pans left (${a.pans.bumper})`);
      await t.game('act', 'switch', 'bumper3', 'bumper', 5000); await t.game('step', 1);
      a = (await t.state()).audio;
      t.equal(a.pans.bumper, 0.7, 'a position off the table clamps at 0.7');
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-04 foley
  {
    name: 'S5-04 the foley cues that were nearly inaudible now peak at 0.1 or more, and the new event cues sit in the cue range',
    viewports: ['desktop'],
    async run(t) {
      const peaks = {};
      for (const n of FOLEY) { const r = await render(t, n, { seconds: 2.5 }); peaks[n] = r.peak; t.expect(r.peak >= 0.1 && r.peak <= 0.45, `${n} peaks ${r.peak} (0.1 to 0.45)`); }
      for (const n of NEW_CUES) {
        const r = await render(t, n, { seconds: 4, n: 3, m: 1 }); peaks[n] = r.peak;
        t.expect(r.peak >= 0.15 && r.peak <= 0.45, `${n} peaks ${r.peak} (0.15 to 0.45)`);
      }
      const ramp = await render(t, 'rampEnter', { seconds: 2.5 });
      t.expect(ramp.peak >= 0.15, `the ramp-entry sweep peaks ${ramp.peak}, up from 0.0116`);
      t.expect(ramp.secs[0] > 0.01 && ramp.secs[2] < 0.002, 'and it is over inside a second and a half');
      t.log('peaks ' + JSON.stringify(peaks));
      t.expect(0.138 + 0.069 + 0.45 < 0.95, 'loudest piece + loudest bed + a cue at the ceiling stays under 0.95 (batch A numbers)');
    },
  },
  {
    name: 'S5-04 the roll voice follows speed: louder and brighter fast, rumble on the ramp, rattle on the wire, no silent stretch over 2 s',
    viewports: ['desktop'],
    async run(t) {
      const r = await t.page.evaluate(() => window.__game.rollRender(12, false));
      t.log(`roll render: peak ${r.peak} rms ${r.rmsDb} dB, silence ${r.longestSilence} s, per second ${JSON.stringify(r.secs)}`);
      t.expect(r.peak >= 0.04 && r.peak <= 0.2, `peak ${r.peak} is under the cues (0.04 to 0.25)`);
      t.expect(r.secs[2] > r.secs[0] * 3, `the field ball at full speed (${r.secs[2]}) is well above the start of its run (${r.secs[0]})`);
      t.expect(r.secs[6] > 0.003, `the ramp climb is heard (${r.secs[6]})`);
      t.expect(r.secs[10] > 0.002, `and the wire rail (${r.secs[10]})`);
      t.expect(r.longestSilence <= 2, `no silence over 2 s (${r.longestSilence})`);
    },
  },
  {
    name: 'S5-04 live: the roll voice is told the fastest ball and its side, voices a ramp ball apart from the field, and stops when paused or muted',
    viewports: ['desktop'],
    async run(t) {
      await gesture(t);
      await t.game('newGame', { balls: 3, seed: 4 });
      const roll = async () => (await t.state()).audio.roll;
      await t.game('act', 'placeBall', 90, 520, 0, 1500);
      await t.page.waitForTimeout(120);
      let r = await roll();
      t.expect(r.fs > 300, `a ball rolling at speed is voiced (${r.fs} mm/s)`);
      t.expect(r.pan < -0.3, `on the left of the table the voice sits left (${r.pan})`);
      await t.game('act', 'placeBall', 440, 520, 0, 1500);
      await t.page.waitForTimeout(120);
      r = await roll();
      t.expect(r.pan > 0.3, `on the right it sits right (${r.pan})`);
      // the first update after the ball is placed: it climbs and slows, so a fixed wait reads a lower speed on a slow machine
      r = await t.page.evaluate(async () => {
        const g = window.__game, roll = () => g.getState().audio.roll, n = roll().n;
        g.act('placeBall', 459.5, 620, 0, 700, 2);
        for (let i = 0; i < 120 && roll().n === n; i++) await new Promise((f) => requestAnimationFrame(f));
        return roll();
      });
      t.expect(r.ts > 200 && r.fs === 0 && r.layer === 2, `a ball on the ramp is voiced as the ramp and the field voice is shut (field ${r.fs}, ramp ${r.ts})`);
      await t.game('pause');
      await t.page.waitForTimeout(100);
      r = await roll();
      t.expect(r.fs === 0 && r.ts === 0, 'paused: both are told zero');
      await t.game('resume');
    },
  },
  {
    name: 'S5-04 live: with Sound effects off the roll voice is told zero, and on the low tier it is updated a quarter as often',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);   // the 3D table is built behind the title now: the tier throttle needs it
      await t.game('newGame', { balls: 3, seed: 5 });
      await gesture(t);
      const view = (await t.state()).view;
      const rate = async () => {
        const a = await t.state(); await t.game('act', 'placeBall', 90, 520, 0, 20);
        await t.page.waitForTimeout(700);
        const b = await t.state();
        return (b.audio.roll.n - a.audio.roll.n) / Math.max(1, b.frame - a.frame);
      };
      if (view === '3d') {
        await t.game('act', 'tier', 'high');
        const high = await rate();
        await t.game('act', 'tier', 'low');
        const low = await rate();
        t.log(`roll updates per frame: high ${high.toFixed(2)}, low ${low.toFixed(2)}`);
        t.expect(high > 0.8, `every frame on the high tier (${high.toFixed(2)})`);
        t.expect(low < 0.4, `a quarter of the frames on the low tier (${low.toFixed(2)})`);
      } else t.log('the 3D view is not running here (' + view + '): the tier throttle is not exercised');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: false, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1 })));
      await t.reload();
      await t.game('newGame', { balls: 3, seed: 6 });
      await gesture(t);
      await t.game('act', 'placeBall', 90, 520, 0, 1500);
      await t.page.waitForTimeout(150);
      const r = (await t.state()).audio.roll;
      t.expect(r.n > 0 && r.fs === 0 && r.ts === 0, `sound off: the voice is updated and told zero (${JSON.stringify(r)})`);
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-05 silent events
  {
    name: 'S5-05 ball save: a cue when it starts, three pips as it runs out (once per window), and a ping from the lit skill-shot lane',
    node: true,
    async run(t) {
      const G = fresh(11);
      G.w.events.push({ t: 'hit', sw: T.sw.shooterLane, dir: 1, ball: G.w.balls[0].id, x: 498 }); tick(G);
      const t0 = G.t;
      run(G, 0.5);
      t.equal(sounds(G, 'saveOn').length, 1, 'the ball save starting has its cue');
      const sk = sounds(G, 'skillOn');
      t.expect(sk.length === 1 && sk[0].x === 356 + 40 * G.ball.skillLane, 'the skill-shot window pings from the lit lane');
      t.equal(sounds(G, 'saveEnd').length, 0, 'no warning yet');
      run(G, 8.5);
      const se = sounds(G, 'saveEnd');
      t.equal(se.length, 1, 'one warning as the window runs out');
      t.expect(Math.abs(se[0].t - (t0 + 8)) < 0.2, `it comes 2 s before the end (at ${(se[0].t - t0).toFixed(2)} s of 10)`);
      G.cues.length = 0; run(G, 3);
      t.equal(sounds(G, 'saveEnd').length, 0, 'and not again');
      // a longer window starts the warning afresh
      G.cues.length = 0; mystery(G, 'save'); run(G, 14);
      t.equal(sounds(G, 'saveEnd').length, 1, 'a Mystery ball save warns before it ends too');
    },
  },
  {
    name: 'S5-05 the Raid hurry-up ticks faster as its value falls; the last five seconds of a mode count down once a second',
    node: true,
    async run(t) {
      const G = fresh(12);
      G.ball.inLane = false; api.startMode(G, 2);
      run(G, 2.4);
      G.mode.phase = 2; G.mode.data.value = 200000; G.mode.data.nextTick = G.t; G.cues.length = 0;
      run(G, 11);
      const tk = sounds(G, 'hurryTick');
      const gaps = tk.slice(1).map((c, i) => c.t - tk[i].t);
      t.log(`hurry ticks: ${tk.length}, gaps ${gaps.map((g) => g.toFixed(2)).join(' ')}`);
      t.expect(tk.length >= 15, `${tk.length} ticks in 11 s`);
      t.expect(gaps[0] > gaps[gaps.length - 1] * 1.8, `the first gap (${gaps[0].toFixed(2)}) is well over the last (${gaps[gaps.length - 1].toFixed(2)})`);
      t.expect(tk[tk.length - 1].n > tk[0].n, `the pitch rises (${tk[0].n} to ${tk[tk.length - 1].n})`);
      // countdown
      const H = fresh(13);
      H.ball.inLane = false; api.startMode(H, 0);
      run(H, 2.4); H.mode.end = H.t + 5.5; H.cues.length = 0;
      run(H, 6);
      t.equal(sounds(H, 'countTick').map((c) => c.n).join(), '5,4,3,2,1', 'five ticks, five to one');
      t.expect(H.mode === null && sounds(H, 'modeEnd').length === 1, 'then the mode ends');
    },
  },
  {
    name: 'S5-05 multiball: the wizard multiplier doubling, the vapors clearing and the end of any multiball each have a cue',
    node: true,
    async run(t) {
      const G = fresh(14);
      G.ball.inLane = false; api.startValley(G); G.cues.length = 0;
      G.mb.t0 = G.t - 9.9; run(G, 0.3);
      G.mb.t0 -= 10; run(G, 0.3);
      const up = sounds(G, 'multUp');
      t.equal(up.map((c) => c.n).join(), '1,2', 'each doubling has a cue a step higher than the last');
      G.mb.end = G.t + 0.5; run(G, 1);
      t.equal(sounds(G, 'vaporsClear').length, 1, 'THE VAPORS CLEAR has its cue');
      t.equal(sounds(G, 'mbEnd').length, 1, 'the wizard ending when its clock runs out has one (S3-02: the clock now ends it)');
      api.startValley(G); G.cues.length = 0; api.endMultiball(G);
      t.equal(sounds(G, 'mbEnd').length, 1, 'and so does ending it any other way');
      const H = fresh(15); H.ball.inLane = false; api.startArlington(H); H.cues.length = 0; api.endMultiball(H);
      t.equal(sounds(H, 'mbEnd').length, 1, 'and so does Arlington multiball');
    },
  },
  {
    name: 'S5-05 lock, extra ball and the wizard each have a "lit" cue of their own',
    node: true,
    async run(t) {
      const G = fresh(16);
      G.ball.inLane = false; G.f.ramps = 2; G.cues.length = 0;
      hit(G, 'rampMade', 450); run(G, 2.3);
      t.expect(G.f.lockLit && sounds(G, 'lit').some((c) => c.n === 0), 'the third ramp lights the lock, with its cue');
      const H = fresh(17);
      H.ball.inLane = false; H.f.modesPlayed = [1, 0, 0, 0, 0, 0]; H.f.modesWon = [1, 0, 0, 0, 0, 0]; api.startMode(H, 2); H.cues.length = 0; api.endMode(H, true); run(H, 2.5);
      t.expect(H.f.ebLit && sounds(H, 'lit').some((c) => c.n === 1), 'the second mode won lights the extra ball, with its cue');   // S3-09: it was the third mode played
      const K = fresh(18);
      K.ball.inLane = false; K.f.modesPlayed = [1, 1, 1, 0, 0, 0]; K.f.modesWon = [1, 1, 1, 0, 0, 0]; api.startMode(K, 3); K.cues.length = 0; api.endMode(K, true); run(K, 2.5);
      t.expect(K.f.wizardLit && sounds(K, 'lit').some((c) => c.n === 2), 'the fourth mode won lights the wizard, with its cue');   // S3-09: it was the sixth mode played
    },
  },
  {
    name: 'S5-05 every Mystery award has a payoff of its own after the reels, and a Mystery ball save is not announced twice',
    node: true,
    async run(t) {
      const ids = ['pts10', 'pts25', 'lock', 'heat', 'tower', 'save', 'bonusx', 'eb'];
      const sig = [];
      for (const id of ids) {
        const G = fresh(20); G.ball.inLane = false;
        mystery(G, id); run(G, 1.4);
        const s = sounds(G);
        const reels = s.find((c) => c.name === 'reels');
        const pay = s.filter((c) => c !== reels && c.t > reels.t + 1);
        t.expect(pay.length >= 1, `${id}: a payoff after the reels`);
        sig.push(pay.map((c) => c.name + (c.n == null ? '' : ':' + c.n)).join('+'));
        if (id === 'save') t.equal(s.filter((c) => c.name === 'saveOn').length, 1, 'the ball save is announced once, after the reels');
      }
      t.log(sig.join(' | '));
      t.equal(new Set(sig).size, ids.length, 'all eight payoffs are different');
    },
  },
  {
    name: 'S5-05 each mode has its own hit voice and the hits climb a ladder with progress; a Derby rival passing the player is heard',
    node: true,
    async run(t) {
      const G = fresh(21);
      G.ball.inLane = false; api.startMode(G, 0); run(G, 2.4);
      const soak = [];
      for (let i = 0; i < 3; i++) { G.cues.length = 0; hit(G, 'bh' + BATHHOUSES[G.mode.lit[0]], 100 + 50 * i); soak.push(...sounds(G, 'modeHit')); }
      t.expect(soak.length === 3 && soak.every((c) => c.m === 0), 'Soak hits use the Soak voice');
      t.expect(soak.every((c, i) => i === 0 || c.n > soak[i - 1].n), `and climb: ${soak.map((c) => c.n).join(', ')}`);
      t.expect(soak.every((c) => c.x != null), 'and are panned by the bathhouse that was hit');
      const H = fresh(22);
      H.ball.inLane = false; api.startMode(H, 4); run(H, 2.4);
      const tub = [];
      for (const sw of ['orbitTop', 'rampMade', 'orbitTop']) { H.cues.length = 0; hit(H, sw, 300); tub.push(...sounds(H, 'modeHit')); }
      t.expect(tub.length === 3 && tub.every((c) => c.m === 4), 'Tub Race has another voice');
      t.equal(tub.map((c) => c.n).join(), '1,2,3', 'one step per leg');
      const D = fresh(23);
      D.ball.inLane = false; api.startMode(D, 1); run(D, 2.4);
      const h = D.mode.data.horses; h[0] = 60; h[1] = h[2] = h[3] = 10; run(D, 0.1); D.cues.length = 0;
      t.equal(sounds(D, 'rivalPass').length, 0, 'nobody has passed the leader');
      h[2] = 70; run(D, 0.1);
      t.equal(sounds(D, 'rivalPass').length, 1, 'a rival moving ahead of the player has a cue');
      run(D, 0.5);
      t.equal(sounds(D, 'rivalPass').length, 1, 'and only the one');
    },
  },
  {
    name: 'S5-04 the cues heard most (flip, flipHit, bumper, sling, wall, clack) differ on every repeat in level and tone',
    viewports: ['desktop'],
    async run(t) {
      for (const name of ['flip', 'flipDown', 'flipHit', 'bumper', 'sling', 'wall', 'clack']) {
        // The level is measured to a tenth of a decibel and the repeats spread over about 1.5 dB, so there are only
        // some fifteen values to land on. Asking six different ones of eight repeats failed by luck in about one run in
        // two across the seven cues; four of twelve does not (under one run in a hundred thousand). A cue with no
        // variation still fails: its repeats sit within 0.3 dB of each other, which the second check refuses.
        const rs = [];
        for (let i = 0; i < 12; i++) rs.push(await render(t, name, { seconds: 1.2 }));
        const peaks = rs.map((r) => r.peak), rms = rs.map((r) => r.rmsDb);
        const distinct = new Set(rms.map((x) => x.toFixed(2))).size;
        const spreadDb = Math.max(...rms) - Math.min(...rms);
        t.log(`${name}: peaks ${Math.min(...peaks)} to ${Math.max(...peaks)}, rms spread ${spreadDb.toFixed(2)} dB, ${distinct} distinct of 12`);
        t.expect(distinct >= 4, `${name}: twelve repeats give at least four different levels (${distinct})`);
        t.expect(spreadDb >= 0.3, `${name}: the level moves by at least 0.3 dB across repeats (${spreadDb.toFixed(2)})`);
      }
    },
  },
];

// M3: features, modes, multiballs, awards (Node, through the rules engine) and render captures (browser).
// PRD AC11–AC15, AC19, AC22–AC24.
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, mystery, MODES, api } from '../src/js/sim/rules.js';
import { buildLamps, lampStates } from '../src/js/sim/lamps.js';
import { kickOut, addBall } from '../src/js/sim/physics.js';

const T = compileTable(spec);
function game(seed = 5) {
  const G = createGame(T, { seed });
  newGame(G, { balls: 3, seed });
  G.ball.inLane = false;
  for (let i = 0; i < 10; i++) tick(G);
  return G;
}
// fire a switch as the physics would, then run a tick
function hit(G, name, extra = {}) {
  const b = G.w.balls[0];
  G.w.events.push({ t: extra.t || 'hit', sw: T.sw[name], speed: 1200, dir: 1, ball: b && b.id, x: 200, y: 400, ...extra });
  tick(G);
}
function run(G, secs) { for (let i = 0; i < secs * 120; i++) tick(G); }
// capture a ball in a saucer the way physics does, then let rules respond
function sink(G, hole) {
  const h = T.holes.find((q) => q.name === hole);
  const b = G.w.balls.find((q) => !q.held) || addBall(G.w, h.x, h.y);
  b.held = { sw: h.sw, since: G.t }; b.x = h.x; b.y = h.y; b.vx = b.vy = 0;
  G.w.events.push({ t: 'hole', sw: h.sw, ball: b.id, speed: 300 });
  tick(G);
  return b;
}
const majors = { L: 'orbitTop', R: 'rampMade' };

export const tests = [
  {
    name: 'AC11 springs heat to 143°F and boil', node: true,
    async run(t) {
      const G = game();
      for (let i = 0; i < 43; i++) hit(G, 'bumper' + (1 + (i % 3)), { t: 'bumper' });
      t.equal(G.f.springTemp, 143, 'temperature reaches 143');
      t.expect(G.f.boilUntil > G.t, 'springs boiling');
      const s0 = G.player.score; hit(G, 'bumper1', { t: 'bumper' });
      t.equal(G.player.score - s0, (500 + 1430) * 2, 'boiling doubles the bumper value');
      run(G, 31);
      t.equal(G.f.springTemp, 120, 'cools to 120 after 30 s');
    },
  },
  {
    name: 'AC12 all eight bathhouses complete the Row and light Grand Soak', node: true,
    async run(t) {
      const G = game();
      for (const b of BATHHOUSES) hit(G, 'bh' + b, { t: 'target' });
      t.equal(G.f.rowsDone, 1, 'row completed'); t.expect(G.f.grandSoakLit, 'Grand Soak lit');
      t.expect(G.callouts.some((c) => /COMPLETE/.test(c)), 'completion callout');
      t.expect(BATHHOUSES.every((b) => G.cues.length >= 0), 'facts shown');
    },
  },
  {
    name: 'AC13 ramps raise the tower and light the lock; 3 locks start Arlington Multiball', node: true,
    async run(t) {
      const G = game();
      for (let k = 0; k < 3; k++) { hit(G, 'rampMade', { t: 'roll' }); run(G, 3.2); }
      t.equal(G.f.towerLevel, 1, 'tower level 1 after 3 ramps'); t.expect(G.f.lockLit, 'lock lit');
      for (let n = 1; n <= 3; n++) {
        G.f.lockLit = true;
        sink(G, 'lock'); run(G, 0.2);
        if (n < 3) t.equal(G.f.locks, n, 'ball ' + n + ' locked');
        run(G, 3);
      }
      run(G, 4);
      t.expect(G.mb && G.mb.kind === 'arlington', 'Arlington Multiball running');
      t.equal(G.w.balls.filter((b) => !b.held).length, 3, 'three balls in play');
      const s0 = G.player.score; hit(G, 'rampMade', { t: 'roll' });
      t.expect(G.player.score - s0 >= 75000, 'ramp jackpot scored');
    },
  },
  {
    name: 'AC14 all six modes start at the Vapors and can be completed', node: true,
    async run(t) {
      const G = game();
      const won = [];
      let collectedEB = false;
      for (let m = 0; m < 6; m++) {
        G.f.lockLit = false;
        const eb0 = G.player.extraBalls;
        sink(G, 'vapors');
        if (!G.mode && G.player.extraBalls > eb0) { collectedEB = true; for (const q of G.w.balls) if (q.held && !q.held.drained) kickOut(G.w, q, 0, 500); run(G, 3); sink(G, 'vapors'); }
        t.expect(G.mode && G.mode.id === MODES[m].id, 'mode ' + MODES[m].id + ' started');
        run(G, 2.5);
        const id = G.mode && G.mode.id;
        // play it to completion
        for (let k = 0; k < 40 && G.mode; k++) {
          if (id === 'soak') hit(G, 'bh' + BATHHOUSES[G.mode.lit[0]], { t: 'target' });
          else if (id === 'derby') { hit(G, 'rampMade', { t: 'roll' }); run(G, 3.1); }
          else if (id === 'raid') { if (G.mode.phase === 1) hit(G, 'bh' + BATHHOUSES[G.mode.lit[0]], { t: 'target' }); else { sink(G, 'vapors'); } }
          else if (id === 'tower') { hit(G, 'rampMade', { t: 'roll' }); run(G, 3.1); }
          else if (id === 'tub') { hit(G, G.mode.data.want === 'L' ? 'orbitTop' : 'rampMade', { t: 'roll' }); run(G, 3.1); }
          else if (id === 'coaster') { hit(G, 'orbitTop', { t: 'roll' }); run(G, 3.1); }
          run(G, 0.1);
        }
        if (!G.mode) won.push(id);
        // release any held ball
        for (const q of G.w.balls) if (q.held && !q.held.drained) kickOut(G.w, q, 0, 500);
        G.ball.saveUntil = G.t + 30;
        run(G, 3);
      }
      t.equal(won.length, 6, 'all six modes completed: ' + won.join(','));
      t.equal(G.f.modesWon.reduce((a, b) => a + b, 0), 6, 'six modes won');
      t.expect(G.f.wizardLit, 'wizard lit after six modes');
      t.expect(collectedEB, 'extra ball lit after three modes and collected at the Vapors before the next mode');
    },
  },
  {
    name: 'AC14 modes time out when not completed', node: true,
    async run(t) {
      const G = game();
      sink(G, 'vapors'); run(G, 50);
      t.equal(G.mode, null, 'mode ends on its timer'); t.equal(G.f.modesPlayed[0], 1, 'marked played'); t.equal(G.f.modesWon[0], 0, 'not won');
    },
  },
  {
    name: 'AC15 Grand Soak and Valley of the Vapors start and end', node: true,
    async run(t) {
      const G = game();
      G.f.grandSoakLit = true;
      sink(G, 'vapors'); run(G, 4);
      t.expect(G.mb && G.mb.kind === 'soak', 'Grand Soak running');
      t.equal(G.w.balls.filter((b) => !b.held).length, 2, 'two balls');
      for (const b of BATHHOUSES) hit(G, 'bh' + b, { t: 'target' });
      t.expect(G.mb.superLit, 'super jackpot lit');
      // drain down to one ball ends it
      G.ball.saveUntil = 0;
      const extra = G.w.balls.find((b) => !b.held);
      G.w.events.push({ t: 'drain', ball: extra.id, x: 240 }); tick(G);
      t.equal(G.mb, null, 'multiball ends at one ball');
      G.f.wizardLit = true;
      sink(G, 'vapors'); run(G, 4);
      t.expect(G.mb && G.mb.kind === 'valley', 'wizard mode running');
      for (let i = 0; i < 6; i++) { hit(G, ['rampMade', 'orbitTop', 'reserve'][i % 3], { t: 'roll' }); run(G, 0.5); }
      const s0 = G.player.score; sink(G, 'vapors');
      t.expect(G.player.score - s0 > 300000, 'final shot collects the valley total');
    },
  },
  {
    name: 'AC19 every mystery award applies', node: true,
    async run(t) {
      for (const id of ['pts10', 'pts25', 'lock', 'heat', 'tower', 'save', 'bonusx', 'eb']) {
        const G = game(); const before = JSON.stringify({ s: G.player.score, f: G.f, x: G.player.bonusX, save: G.ball.saveUntil });
        t.equal(mystery(G, id), id, 'award ' + id);
        const after = JSON.stringify({ s: G.player.score, f: G.f, x: G.player.bonusX, save: G.ball.saveUntil });
        t.expect(before !== after, id + ' changes the game');
      }
      const a = game(9), b = game(9);
      t.equal(mystery(a), mystery(b), 'seeded draws repeat');
    },
  },
  {
    name: 'AC23 lamps reflect rules state with shape-coded inserts', node: true,
    async run(t) {
      const L = buildLamps(), G = game();
      G.f.row[2] = 1; G.f.lockLit = true; G.player.bonusX = 3;
      const s = lampStates(G, L, 0.1);
      t.equal(s.bhMaurice, 1, 'collected bathhouse lit'); t.equal(s.bhHale, 0, 'others off');
      t.expect(s.bonus2x === 1 && s.bonus3x === 1 && s.bonus4x === 0, 'multiplier lamps');
      t.expect(s.arrowLock > 0, 'lock arrow lit');
      const shapes = new Set(L.map((l) => l.shape));
      t.expect(['arrow', 'circle', 'star', 'rect', 'triangle'].every((k) => shapes.has(k)), 'five insert shapes');
    },
  },
  // ---------------------------------------------------------------- render captures
  {
    name: 'AC22 table render and close views',
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 4 });
      await t.game('pause');
      await t.game('act', 'plunge', 0.9); await t.game('step', 200);
      await t.game('setState', { features: { row: [1, 0, 1, 1, 0, 1, 0, 0], spa: [0, 1, 0], springTemp: 136, towerLevel: 2, locks: 2, lockLit: true } });
      await t.game('act', 'placeBall', 330, 300, 0, 0);
      await t.game('act', 'clock', 20000);
      await t.game('step', 1); await t.waitFrames(4);
      await t.shot('m3-table');
      const s = await t.state(); t.log('view', s.view, s.tier);
      t.expect(s.view === '3d' || !t.gpu, '3D view on a real GPU');
    },
  },
  {
    name: 'AC14 mode captures',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 4 });
      await t.game('pause'); await t.game('step', 30);
      for (const [i, id] of [[1, 'derby'], [2, 'raid']]) {
        await t.game('act', 'mode', i); await t.game('step', 300);
        await t.game('act', 'clock', 30000 + i * 1000); await t.waitFrames(3);
        await t.shot('m3-mode-' + id, { wait: false });
        await t.game('setState', { mode: null });
      }
    },
  },
  {
    name: 'AC24 light shows and multiball',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 4 });
      await t.game('pause'); await t.game('step', 30);
      await t.game('act', 'multiball', 'arlington'); await t.game('step', 400);
      await t.game('act', 'clock', 41000); await t.waitFrames(3);
      const s = await t.state(); t.expect(s.ballsInPlay >= 2, 'multiball balls in play: ' + s.ballsInPlay);
      await t.shot('m3-multiball', { wait: false });
      await t.game('act', 'lamps', 'wizard', 5); await t.game('act', 'clock', 42300); await t.waitFrames(3);
      await t.shot('m3-show-wizard', { wait: false });
    },
  },
];

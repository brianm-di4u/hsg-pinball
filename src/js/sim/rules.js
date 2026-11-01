// Spa City Pinball rules: turns physics events into scores, modes, multiballs and presentation cues. Deterministic
// (seeded rng, sim time only), no DOM, so Node tools and tests drive full games headless. PRD.md §4 is the spec.
import { createWorld, addBall, removeBall, step, setFlipper, setPlunger, autoPlunge, nudge as physNudge, kickOut,
  queueInput, snapshot, restore, TICK, LAYER } from './physics.js';
import { BATHHOUSES } from './table-spa-city.js';
import { makeRng } from './rng.js';
import { FACTS, fact } from './facts.js';

export const MODES = [
  { id: 'soak', name: 'BATHHOUSE SOAK', short: 'SOAK', goal: 'HIT 6 LIT BATHHOUSES', dur: 40 },
  { id: 'derby', name: 'DERBY DAY', short: 'DERBY', goal: 'RAMPS AND ORBITS: WIN THE RACE', dur: 45 },
  { id: 'raid', name: 'RAID! 1967', short: 'RAID', goal: 'FIND 3 SLOTS, THEN THE VAPORS', dur: 45 }, // fact: raid, slots
  { id: 'tower', name: 'TOWER CLIMB', short: 'TOWER', goal: 'SHOOT THE RAMP 3 TIMES', dur: 40 },
  { id: 'tub', name: 'TUB RACE', short: 'TUBS', goal: 'ALTERNATE LEFT AND RIGHT', dur: 40 },
  { id: 'coaster', name: 'COASTER HILL', short: 'COASTER', goal: 'RIDE THE ORBIT 4 LAPS', dur: 40 },
];
export const SPRINGS = ['DISPLAY SPRING', 'SPRING NO. 46', 'HOT WATER CASCADE'];
const SHOOTER = { x: 498.5, y: 104 };
const MAJOR = { rampMade: 'R', orbitTop: 'L', reserve: 'R' };
const MYSTERY = [
  { id: 'pts10', w: 24, label: '10,000 POINTS' },
  { id: 'pts25', w: 16, label: '25,000 POINTS' },
  { id: 'lock', w: 12, label: 'LOCK IS LIT' },
  { id: 'heat', w: 14, label: 'SPRINGS +10°F' },
  { id: 'tower', w: 10, label: 'TOWER +1 RAMP' },
  { id: 'save', w: 10, label: 'BALL SAVE 15 SEC' },
  { id: 'bonusx', w: 10, label: 'BONUS +1X' },
  { id: 'eb', w: 4, label: 'EXTRA BALL LIT' },
];
export const REEL = ['CHERRY', 'BELL', 'SHOE', 'STEAM', 'STAR'];

const fmt = (n) => n.toLocaleString('en-US');

export function createGame(table, { seed = 1 } = {}) {
  const G = { T: table, w: createWorld(table), rng: makeRng(seed), seedValue: seed, t: 0, scene: 'attract',
    cues: [], callouts: [], lampShow: null, timers: [], settings: { balls: 3, practice: false } };
  resetPlayer(G);
  return G;
}

function resetPlayer(G) {
  G.player = { score: 0, ball: 1, ballsPerGame: G.settings.balls, extraBalls: 0, bonusX: 1, tilted: false, warnings: 0,
    bob: 0, match: null, skillShots: 0, eb: 0 };
  G.f = { spa: [0, 0, 0], springTemp: 100, boilUntil: 0, row: new Array(8).fill(0), rowsDone: 0, grandSoakLit: false,
    ramps: 0, towerLevel: 0, lockLit: false, locks: 0, fifth: 0, spins: 0, ebLit: false, modesPlayed: [0, 0, 0, 0, 0, 0],
    modesWon: [0, 0, 0, 0, 0, 0], nextMode: 0, wizardLit: false, ebLitByModes: false, bathsTotal: 0, orbits: 0 };
  G.ball = { saveUntil: 0, saving: false, launched: false, skillLane: -1, skillUntil: 0, inLane: false, kicks: [],
    lastMajor: { t: -10, side: '' }, combo: 0, switches: 0, searchAt: 0 };
  G.mode = null;
  G.mb = null;
  G.bonus = null;
}

// ------------------------------------------------------------------------------------------------- cues
function cue(G, c) { G.cues.push({ t: G.t, ...c }); }
function dmd(G, text, sub = '', ms = 1600, prio = 1, anim = null) { cue(G, { k: 'dmd', text, sub, ms, prio, anim }); G.callouts.push(text); if (G.callouts.length > 8) G.callouts.shift(); }
function sound(G, name, v = 1) { cue(G, { k: 'sound', name, v }); }
function show(G, name, ms = 1500) { G.lampShow = { name, until: G.t + ms / 1000 }; cue(G, { k: 'show', name, ms }); }
function score(G, n, where) {
  if (G.player.tilted || G.scene !== 'game') return 0;
  G.player.score += n;
  cue(G, { k: 'score', n, where });
  return n;
}
function after(G, secs, fn) { G.timers.push({ at: G.t + secs, fn }); }

// ------------------------------------------------------------------------------------------------- game flow
export function newGame(G, { balls = G.settings.balls, practice = G.settings.practice, seed } = {}) {
  if (seed != null) { G.rng = makeRng(seed); G.seedValue = seed; }
  G.settings.balls = balls; G.settings.practice = practice;
  G.w = createWorld(G.T);
  G.timers = []; G.cues.length = 0;
  resetPlayer(G);
  G.scene = 'game';
  dmd(G, 'SPA CITY', 'BALL 1', 1800, 2);
  sound(G, 'start');
  serve(G);
}

function serve(G) {
  G.w.dead = false;
  G.player.tilted = false; G.player.warnings = 0; G.player.bob = 0;
  const b = addBall(G.w, SHOOTER.x, SHOOTER.y);
  G.ball.inLane = true; G.ball.launched = false; G.ball.switches = 0;
  G.ball.skillLane = G.rng.int(3);
  G.ball.saveUntil = 0; G.ball.saving = false;
  cue(G, { k: 'serve', ball: b.id });
  return b;
}

function ballsInPlay(G) { return G.w.balls.filter((b) => !(b.held && b.held.drained)).length; }

function startBallSave(G, secs) { G.ball.saveUntil = Math.max(G.ball.saveUntil, G.t + secs); }

const inShooter = (b) => !b.held && b.x > 480 && b.y < 160;
function autoLaunch(G, delay = 0.7, strength = 0.82) {
  // a new ball into the shooter lane, plunged for the player (saves, locks, multiball); waits while the lane is busy
  if (G.w.balls.some(inShooter)) {
    // the lane is busy: plunge whatever is resting there, then feed this ball
    if (G.w.plunger.vel === 0 && !G.w.plunger.holding && G.w.balls.some((b) => inShooter(b) && b.still > 0.3)) autoPlunge(G.w, strength);
    after(G, 0.8, () => autoLaunch(G, delay, strength));
    return null;
  }
  const b = addBall(G.w, SHOOTER.x, SHOOTER.y);
  after(G, delay, () => { autoPlunge(G.w, strength); sound(G, 'plunger'); });
  return b;
}

function onDrain(G, ballId) {
  const b = G.w.balls.find((q) => q.id === ballId);
  if (b) removeBall(G.w, b);
  sound(G, 'drain');
  const left = ballsInPlay(G);
  if (G.t < G.ball.saveUntil && !G.player.tilted || (G.settings.practice && left === 0)) {
    dmd(G, 'BALL SAVED', '', 1400, 3); sound(G, 'save'); cue(G, { k: 'slowmo', ms: 500 });
    autoLaunch(G, 0.9);
    return;
  }
  if (left >= 2) return;
  if (left === 1) { if (G.mb) endMultiball(G); return; }
  // last ball gone
  if (G.mb) endMultiball(G);
  endBall(G);
}

function endBall(G) {
  if (G.mode) endMode(G, false);
  const f = G.f, p = G.player;
  const parts = [
    ['BATHHOUSES', f.row.reduce((a, b) => a + b, 0) * 2000 + f.rowsDone * 16000],
    ['TOWER', f.towerLevel * 10000],
    ['MODES', f.modesPlayed.reduce((a, b) => a + b, 0) * 15000],
    ['SPINS', f.spins * 10],
  ];
  const sub = parts.reduce((a, [, v]) => a + v, 0);
  const total = p.tilted ? 0 : sub * p.bonusX;
  G.bonus = { parts, x: p.bonusX, total, until: G.t + 2.6, tilted: p.tilted };
  G.scene = 'bonus';
  if (!p.tilted) p.score += total;
  cue(G, { k: 'bonus', ...G.bonus });
  sound(G, 'bonus');
  f.spins = 0;
  after(G, 2.6, () => nextBall(G));
}

function nextBall(G) {
  G.bonus = null;
  const p = G.player;
  p.bonusX = 1;
  if (p.extraBalls > 0) {
    p.extraBalls--;
    G.scene = 'game';
    dmd(G, 'SHOOT AGAIN', 'SAME PLAYER', 1800, 3); sound(G, 'shootAgain');
    serve(G);
    return;
  }
  if (p.ball >= p.ballsPerGame) { gameOver(G); return; }
  p.ball++;
  G.scene = 'game';
  dmd(G, 'BALL ' + p.ball, fmt(p.score), 1600, 2);
  serve(G);
}

function gameOver(G) {
  G.scene = 'over';
  const p = G.player;
  p.match = G.rng.int(10) * 10;
  const won = (p.score % 100) === p.match;
  cue(G, { k: 'over', score: p.score, match: p.match, won });
  dmd(G, 'GAME OVER', fmt(p.score), 2500, 3);
  sound(G, 'gameOver');
  show(G, 'attract', 3000);
}

// ------------------------------------------------------------------------------------------------- per tick
/** Advance the whole game one fixed tick: physics, then rules on its events. */
export function tick(G) {
  step(G.w);
  G.t = G.w.time;
  const evs = G.w.events.splice(0);
  for (const e of evs) handle(G, e);
  // timers
  if (G.timers.length) {
    const due = G.timers.filter((q) => q.at <= G.t);
    if (due.length) { G.timers = G.timers.filter((q) => q.at > G.t); for (const q of due) q.fn(); }
  }
  if (G.scene === 'game') perTick(G);
}

function perTick(G) {
  const p = G.player, f = G.f;
  p.bob = Math.max(0, p.bob - 1.2 * TICK);
  if (f.boilUntil && G.t > f.boilUntil) { f.boilUntil = 0; f.springTemp = 120; dmd(G, 'SPRINGS COOL TO 120°F', '', 1200); }
  if (G.mode) tickMode(G);
  if (G.mb) tickMultiball(G);
  if (G.lampShow && G.t > G.lampShow.until) G.lampShow = null;
  // a tilted table plunges any ball left resting in the shooter lane, so every ball can drain
  if (p.tilted && G.w.plunger.vel === 0 && !G.w.plunger.holding && G.w.balls.some((b) => inShooter(b) && b.still > 0.5)) autoPlunge(G.w, 0.85);
  // ball search: everything still for 5 s outside a saucer or the shooter lane
  const free = G.w.balls.filter((b) => !b.held);
  // (a held flipper means the player is cradling: never search then)
  if (free.length && !G.w.flippers.some((q) => q.held) && free.every((b) => b.still > 5 && !(b.x > 480 && b.y < 140))) {
    if (G.t > G.ball.searchAt) {
      G.ball.searchAt = G.t + 2;
      cue(G, { k: 'search', at: free.map((b) => [Math.round(b.x), Math.round(b.y), b.layer]) });
      for (const b of free) { b.vx += (G.rng.next() - 0.5) * 900; b.vy += 500 + G.rng.next() * 400; b.still = 0; }
    }
  }
}

// ------------------------------------------------------------------------------------------------- events
function handle(G, e) {
  if (e.t === 'drain') { G.lastDrainX = e.x; if (G.scene === 'game' || G.scene === 'bonus') onDrain(G, e.ball); return; }
  if (e.t === 'flipEnd' || e.t === 'plungerHit') { sound(G, e.t === 'flipEnd' ? 'flipStop' : 'plungerHit'); return; }
  if (e.t === 'wall') { sound(G, 'wall', Math.min(1, e.speed / 2500)); return; }
  if (e.t === 'clack') { sound(G, 'clack', Math.min(1, e.speed / 2000)); return; }
  if (e.t === 'flipHit') { sound(G, 'flipHit', Math.min(1, e.speed / 3000)); return; }
  if (e.t === 'offRamp') return;
  const name = G.T.swName[e.sw];
  if (!name) return;
  if (G.scene !== 'game') { sound(G, e.t === 'bumper' ? 'bumper' : e.t === 'sling' ? 'sling' : 'switch'); return; }
  if (name !== 'shooterLane') G.ball.switches++;
  sw(G, name, e);
}

function sw(G, name, e) {
  const f = G.f, p = G.player;
  if (p.tilted) {
    // a tilted table scores nothing, but saucers still throw the ball back so it can drain
    if (e.t === 'hole') { const h = G.T.holes.find((q) => q.sw === e.sw); holdThen(G, e.ball, 0.5, h.kickAngle, h.kickSpeed); }
    return;
  }
  // shooter lane exit starts ball save and the skill-shot window
  if (name === 'shooterLane') {
    if (e.dir > 0 && G.ball.inLane) {
      G.ball.inLane = false; G.ball.launched = true;
      if (!G.ball.saveUntil || G.ball.saveUntil < G.t) startBallSave(G, G.mb ? 15 : 10);
      G.ball.skillUntil = G.t + 4;
      sound(G, 'launch');
    }
    return;
  }
  if (name.startsWith('lane')) return lane(G, 'SPA'.indexOf(name[4]));
  if (name.startsWith('bumper')) return bumper(G, +name[6] - 1, e);
  if (name.startsWith('sling')) { score(G, 110); sound(G, 'sling'); cue(G, { k: 'flash', name: name }); return; }
  if (name === 'inL' || name === 'inR') { score(G, 1000); sound(G, 'rollover'); return; }
  if (name === 'outL' || name === 'outR') { score(G, 5000); sound(G, 'outlane'); dmd(G, 'OUTLANE', '5,000', 900); return; }
  if (name.startsWith('bh')) return bathhouse(G, BATHHOUSES.indexOf(name.slice(2)), e);
  if (name === 'spinner') return spinner(G, e);
  if (name === 'orbitTop') return major(G, 'orbitTop');
  if (name === 'reserve') return major(G, 'reserve');
  if (name === 'rampEnter') { sound(G, 'rampEnter'); return; }
  if (name === 'rampMade') return major(G, 'rampMade');
  if (name === 'wireDrop') { sound(G, 'wireDrop'); return; }
  if (name === 'vapors') return vapors(G, e);
  if (name === 'lock') return lockHole(G, e);
  if (name === 'vaporsEnter' || name === 'lockEnter' || name === 'orbitDown') { sound(G, 'switch'); return; }
}

function lane(G, i) {
  const f = G.f;
  sound(G, 'rollover');
  score(G, 1000);
  if (G.ball.skillUntil > G.t && i === G.ball.skillLane) {
    G.ball.skillUntil = 0;
    G.player.skillShots++;
    const v = Math.min(100000, 25000 * G.player.skillShots);
    score(G, v);
    dmd(G, 'SKILL SHOT', fmt(v), 2000, 3, 'skill'); sound(G, 'skill'); show(G, 'skill', 1200);
  }
  G.ball.skillUntil = 0;
  f.spa[i] = 1;
  if (f.spa.every(Boolean)) {
    f.spa = [0, 0, 0];
    if (G.player.bonusX < 5) G.player.bonusX++;
    dmd(G, 'S·P·A COMPLETE', 'BONUS ' + G.player.bonusX + 'X', 1600, 2); sound(G, 'spa'); show(G, 'spa', 900);
  }
}

/** Flipper buttons rotate the lit top lanes (and the skill-shot lane while the ball is in the shooter lane). */
export function laneChange(G, dir) {
  const a = G.f.spa;
  G.f.spa = dir > 0 ? [a[2], a[0], a[1]] : [a[1], a[2], a[0]];
  if (G.ball.inLane) G.ball.skillLane = (G.ball.skillLane + (dir > 0 ? 1 : 2)) % 3;
}

function bumper(G, i, e) {
  const f = G.f;
  if (f.springTemp < 143) f.springTemp++;
  const boil = f.boilUntil > G.t;
  score(G, (500 + 10 * f.springTemp) * (boil ? 2 : 1));
  sound(G, 'bumper', 1); cue(G, { k: 'flash', name: 'bumper' + (i + 1) }); cue(G, { k: 'steam', i });
  if (f.springTemp >= 143 && !boil) {
    f.boilUntil = G.t + 30;
    dmd(G, 'THE SPRINGS BOIL', fact('temp'), 2200, 2, 'boil'); sound(G, 'boil'); show(G, 'boil', 1500);
  } else if (f.springTemp % 10 === 0 && f.springTemp < 143) {
    dmd(G, SPRINGS[i], f.springTemp + '°F', 700, 0);
  }
}

function bathhouse(G, i, e) {
  const f = G.f, name = BATHHOUSES[i];
  sound(G, 'target'); cue(G, { k: 'flash', name: 'bh' + name });
  if (G.mb && G.mb.kind === 'soak') {
    const v = score(G, 20000 * Math.max(1, ballsInPlay(G)));
    G.mb.hit[i] = 1;
    dmd(G, 'JACKPOT: ' + name.toUpperCase(), fmt(v), 1200, 2); sound(G, 'jackpot');
    if (G.mb.hit.every(Boolean) && !G.mb.superLit) { G.mb.superLit = true; dmd(G, 'SUPER JACKPOT LIT', 'SHOOT THE VAPORS', 1800, 3); }
    return;
  }
  if (G.mode) modeEvent(G, 'bh', i);
  if (!f.row[i]) {
    f.row[i] = 1;
    score(G, 3000);
    dmd(G, name.toUpperCase(), fact('bh' + name), 1500, 1);
    if (f.row.every(Boolean)) {
      f.rowsDone++;
      f.row = new Array(8).fill(0);
      f.grandSoakLit = true;
      dmd(G, 'BATHHOUSE ROW COMPLETE', 'GRAND SOAK AT THE VAPORS', 2400, 3, 'row'); sound(G, 'complete'); show(G, 'row', 1600);
    }
  } else score(G, 500);
}

function spinner(G, e) {
  const f = G.f;
  const spins = Math.max(1, Math.min(40, Math.round(e.speed / 70)));
  f.spins += spins; f.fifth += spins;
  score(G, 100 * spins);
  cue(G, { k: 'spin', n: spins, dir: e.dir });
  sound(G, 'spinner', Math.min(1, spins / 20));
  if (G.mode && G.mode.id === 'coaster') modeEvent(G, 'spin', spins);
  if (f.fifth >= 300 && !f.ebLit) { f.fifth = 0; f.ebLit = true; dmd(G, 'FIFTH SEASON', 'EXTRA BALL IS LIT', 2000, 3); sound(G, 'ebLit'); }
}

function major(G, name) {
  const f = G.f, side = MAJOR[name];
  // combos: another major shot within 3 s
  const last = G.ball.lastMajor;
  if (G.t - last.t < 3) {
    G.ball.combo++;
    const v = score(G, 20000 * G.ball.combo);
    dmd(G, (G.ball.combo + 1) + '-WAY COMBO', fmt(v), 1100, 2); sound(G, 'combo');
  } else G.ball.combo = 0;
  G.ball.lastMajor = { t: G.t, side };
  if (name === 'rampMade') {
    f.ramps++;
    score(G, 10000 + 5000 * f.towerLevel);
    sound(G, 'rampMade');
    if (G.mb && G.mb.kind === 'arlington' && G.mb.jackpotLit) {
      const v = score(G, G.mb.jackpot); G.mb.jackpot += 25000; G.mb.jackpotLit = false;
      dmd(G, 'JACKPOT', fmt(v), 1800, 3, 'jackpot'); sound(G, 'jackpot'); show(G, 'jackpot', 1000);
    } else if (f.ramps % 3 === 0) {
      f.towerLevel = Math.min(3, f.towerLevel + 1);
      if (!G.mb) f.lockLit = true;
      const t = ['woolman', 'rix', 'tower'][Math.min(2, f.towerLevel - 1)];
      dmd(G, 'TOWER LEVEL ' + f.towerLevel, fact(t), 2000, 2, 'tower');
      if (!G.mb) after(G, 2.1, () => dmd(G, 'LOCK IS LIT', 'SHOOT THE ARLINGTON', 1500, 2));
      sound(G, 'towerUp');
    } else if (!G.mode) dmd(G, 'MOUNTAIN TOWER', (3 - (f.ramps % 3)) + ' MORE FOR NEXT LEVEL', 1100, 1);
  } else if (name === 'orbitTop') {
    f.orbits++;
    score(G, 7500); sound(G, 'orbit');
    if (G.mb && G.mb.kind === 'arlington' && !G.mb.jackpotLit) { G.mb.jackpotLit = true; dmd(G, 'JACKPOT IS LIT', 'SHOOT THE RAMP', 1200, 2); }
    else if (!G.mode && f.orbits % 4 === 1) dmd(G, 'CENTRAL AVENUE', fact(G.rng.pick(['scotch', 'fifth', 'oaklawn'])), 1600, 1);
  } else if (name === 'reserve') {
    score(G, 5000); sound(G, 'orbit');
    if (G.mb && G.mb.kind === 'arlington' && !G.mb.jackpotLit) { G.mb.jackpotLit = true; dmd(G, 'JACKPOT IS LIT', 'SHOOT THE RAMP', 1200, 2); }
  }
  if (G.mode) modeEvent(G, name);
  if (G.mb && G.mb.kind === 'valley') valleyShot(G, name);
}

// ------------------------------------------------------------------------------------------------- saucers
function holdThen(G, ballId, secs, angle, speed, after2) {
  after(G, secs, () => {
    const b = G.w.balls.find((q) => q.id === ballId);
    if (b && b.held) { kickOut(G.w, b, angle, speed); sound(G, 'kick'); cue(G, { k: 'flash', name: 'kick' }); }
    if (after2) after2();
  });
}

function vapors(G, e) {
  const f = G.f, h = G.T.holes.find((q) => q.name === 'vapors');
  sound(G, 'saucer');
  score(G, 5000);
  const kick = (secs) => holdThen(G, e.ball, secs, h.kickAngle, h.kickSpeed);
  // priorities: super jackpot, raid hurry-up, wizard, grand soak, extra ball, mode start, mystery
  if (G.mb && G.mb.kind === 'soak' && G.mb.superLit) {
    const v = score(G, 250000); G.mb.superLit = false; G.mb.hit = new Array(8).fill(0);
    dmd(G, 'SUPER JACKPOT', fmt(v), 2500, 3, 'jackpot'); sound(G, 'superJackpot'); show(G, 'jackpot', 2000); return kick(1.6);
  }
  if (G.mb && G.mb.kind === 'valley') { valleyShot(G, 'vapors'); return kick(1.0); }
  if (G.mode && G.mode.id === 'raid' && G.mode.phase === 2) { modeEvent(G, 'vapors'); return kick(1.6); }
  if (f.wizardLit && !G.mb) { startValley(G); return kick(2.4); }
  if (f.grandSoakLit && !G.mb) { startGrandSoak(G); return kick(2.0); }
  if (f.ebLit) {
    f.ebLit = false; G.player.extraBalls++; G.player.eb++;
    dmd(G, 'EXTRA BALL', '', 2200, 3, 'eb'); sound(G, 'extraBall'); show(G, 'eb', 1500); return kick(2.0);
  }
  if (!G.mode && !G.mb) { startMode(G); return kick(2.2); }
  mystery(G);
  kick(1.8);
}

export function mystery(G, forced) {
  const total = MYSTERY.reduce((a, m) => a + m.w, 0);
  let m = forced ? MYSTERY.find((q) => q.id === forced) : null;
  if (!m) { let r = G.rng.next() * total; m = MYSTERY.find((q) => (r -= q.w) < 0) || MYSTERY[0]; }
  const reels = [G.rng.pick(REEL), G.rng.pick(REEL), G.rng.pick(REEL)];
  const f = G.f;
  switch (m.id) {
    case 'pts10': score(G, 10000); break;
    case 'pts25': score(G, 25000); break;
    case 'lock': if (!G.mb) f.lockLit = true; break;
    case 'heat': f.springTemp = Math.min(143, f.springTemp + 10); break;
    case 'tower': f.ramps++; if (f.ramps % 3 === 0) { f.towerLevel = Math.min(3, f.towerLevel + 1); if (!G.mb) f.lockLit = true; } break;
    case 'save': startBallSave(G, 15); break;
    case 'bonusx': if (G.player.bonusX < 5) G.player.bonusX++; break;
    case 'eb': f.ebLit = true; break;
  }
  dmd(G, 'THE VAPORS', m.label, 1700, 2, { kind: 'reels', reels });
  sound(G, 'reels');
  return m.id;
}

function lockHole(G, e) {
  const f = G.f, h = G.T.holes.find((q) => q.name === 'lock');
  sound(G, 'saucer');
  if (G.mode) modeEvent(G, 'lock');
  if (f.lockLit && !G.mb) {
    f.locks++; f.lockLit = false;
    const b = G.w.balls.find((q) => q.id === e.ball);
    if (f.locks >= 3) { f.locks = 0; startArlington(G, e.ball); return; }
    score(G, 15000);
    dmd(G, 'BALL ' + f.locks + ' LOCKED', f.locks === 1 ? fact('arlington') : fact('capone'), 2000, 2, 'lock'); sound(G, 'lock');
    if (b) removeBall(G.w, b);
    if (ballsInPlay(G) === 0) autoLaunch(G, 1.2);
    return;
  }
  score(G, 2500);
  holdThen(G, e.ball, 0.6, h.kickAngle, h.kickSpeed);
}

// ------------------------------------------------------------------------------------------------- modes
function startMode(G, forceIdx) {
  const f = G.f;
  let i = forceIdx ?? f.nextMode;
  if (forceIdx == null) { for (let k = 0; k < 6 && f.modesPlayed[i]; k++) i = (i + 1) % 6; }
  const M = MODES[i];
  G.mode = { i, id: M.id, t0: G.t + 2.2, end: G.t + 2.2 + M.dur, progress: 0, need: 0, phase: 1, lit: [], data: {} };
  const m = G.mode;
  if (M.id === 'soak') { m.need = 6; m.lit = [G.rng.int(8)]; m.data.nextMove = m.t0 + 3; }
  if (M.id === 'derby') { m.need = 100; m.data.horses = [0, 0, 0, 0]; m.data.names = ['YOU', 'SODA POP', 'MISS VAPOR', 'RED TILE']; }
  if (M.id === 'raid') { m.need = 3; m.lit = pickN(G, 8, 3); m.data.value = 200000; }
  if (M.id === 'tower') m.need = 3;
  if (M.id === 'tub') { m.need = 5; m.data.want = ''; }
  if (M.id === 'coaster') { m.need = 4; m.data.spins = 0; }
  f.nextMode = (i + 1) % 6;
  dmd(G, M.name, M.goal, 2200, 3, { kind: 'mode', id: M.id }); sound(G, 'modeStart'); show(G, 'mode', 1800);
  cue(G, { k: 'mode', id: M.id, on: true });
}

function pickN(G, n, k) { const a = [...Array(n).keys()]; const out = []; while (out.length < k) out.push(a.splice(G.rng.int(a.length), 1)[0]); return out; }

function modeEvent(G, kind, arg) {
  const m = G.mode;
  if (!m || G.t < m.t0) return;
  const M = MODES[m.i];
  if (M.id === 'soak' && kind === 'bh' && m.lit.includes(arg)) {
    m.progress++; G.f.bathsTotal++;
    score(G, 15000);
    dmd(G, 'BATH ' + m.progress + ' OF ' + m.need, BATHHOUSES[arg].toUpperCase(), 1000, 2); sound(G, 'modeHit');
    m.lit = [nextLit(G, arg)]; m.data.nextMove = G.t + 3;
  } else if (M.id === 'derby' && (kind === 'rampMade' || kind === 'orbitTop' || kind === 'reserve')) {
    m.data.horses[0] = Math.min(100, m.data.horses[0] + 18); m.progress = m.data.horses[0];
    score(G, 25000); sound(G, 'modeHit');
    dmd(G, 'DERBY DAY', 'YOU ' + placeOf(m) + ' · ' + Math.round(m.progress) + '%', 900, 2, { kind: 'derby', horses: [...m.data.horses] });
  } else if (M.id === 'raid') {
    if (m.phase === 1 && kind === 'bh' && m.lit.includes(arg)) {
      m.lit = m.lit.filter((q) => q !== arg); m.progress++;
      score(G, 20000); sound(G, 'modeHit');
      dmd(G, 'SLOT MACHINE FOUND', m.progress + ' OF 3', 1000, 2);
      if (m.progress >= 3) { m.phase = 2; m.data.value = 200000; dmd(G, 'HURRY UP', 'SHOOT THE VAPORS', 1600, 3); sound(G, 'hurry'); }
    } else if (m.phase === 2 && kind === 'vapors') {
      const v = score(G, Math.round(m.data.value / 1000) * 1000);
      dmd(G, 'RAID COMPLETE', fmt(v), 2200, 3, 'jackpot');
      cue(G, { k: 'fact', text: fact('slots') });
      endMode(G, true);
    }
  } else if (M.id === 'tower' && kind === 'rampMade') {
    m.progress++;
    const v = score(G, 40000 * m.progress);
    dmd(G, ['WOOLMAN TOWER', 'RIX TOWER', 'MOUNTAIN TOWER'][m.progress - 1], fmt(v), 1500, 2, 'tower'); sound(G, 'towerUp');
    if (m.progress >= 3) { score(G, 100000); dmd(G, 'TOP OF THE TOWER', fact('tower'), 2200, 3); endMode(G, true); }
  } else if (M.id === 'tub' && (kind === 'rampMade' || kind === 'orbitTop' || kind === 'reserve')) {
    const side = MAJOR[kind];
    if (!m.data.want || side === m.data.want) {
      m.progress++; m.data.want = side === 'L' ? 'R' : 'L';
      score(G, 30000); sound(G, 'modeHit');
      dmd(G, 'TUB RACE LEG ' + m.progress, 'NOW SHOOT ' + (m.data.want === 'L' ? 'LEFT' : 'RIGHT'), 1000, 2);
      if (m.progress >= m.need) { dmd(G, 'TUB RACE WON', fact('tubs'), 2200, 3); endMode(G, true); }
    }
  } else if (M.id === 'coaster' && (kind === 'orbitTop' || kind === 'spin')) {
    if (kind === 'spin') { m.data.spins += arg; if (m.data.spins < 25) return; m.data.spins = 0; }
    m.progress++;
    score(G, 35000); sound(G, 'modeHit');
    dmd(G, 'COASTER LAP ' + m.progress, 'OF 4', 900, 2);
    if (m.progress >= 4) { dmd(G, 'COASTER HILL DONE', fact('coaster'), 2200, 3); endMode(G, true); }
  }
  if (M.id === 'soak' && m.progress >= m.need) { score(G, 50000); dmd(G, 'A FULL COURSE', fact('baths21'), 2200, 3); endMode(G, true); }
}

function nextLit(G, prev) { let n; do n = G.rng.int(8); while (n === prev); return n; }
function placeOf(m) { const h = m.data.horses; const ahead = h.slice(1).filter((x) => x > h[0]).length; return ['1ST', '2ND', '3RD', '4TH'][ahead]; }

function tickMode(G) {
  const m = G.mode;
  if (G.t < m.t0) return;
  const M = MODES[m.i];
  if (M.id === 'soak' && G.t > m.data.nextMove) { m.lit = [nextLit(G, m.lit[0])]; m.data.nextMove = G.t + 3; }
  if (M.id === 'derby') {
    const h = m.data.horses;
    for (let k = 1; k < 4; k++) h[k] = Math.min(100, h[k] + (1.25 + G.rng.next() * 1.2) * TICK);
    if (h[0] >= 100) { const first = h.slice(1).every((x) => x < 100); score(G, first ? 150000 : 50000); dmd(G, first ? 'YOU WIN THE DERBY' : 'YOU PLACED', fact('derby1936'), 2200, 3); return endMode(G, first); }
    if (h.slice(1).some((x) => x >= 100) && h[0] < 100) { dmd(G, 'BEATEN AT THE WIRE', '', 1600, 2); return endMode(G, false); }
  }
  if (M.id === 'raid' && m.phase === 2) m.data.value = Math.max(50000, m.data.value - 16000 * TICK);
  if (G.t > m.end) { dmd(G, M.name + ' OVER', '', 1500, 2); endMode(G, false); }
}

function endMode(G, won) {
  const m = G.mode, f = G.f;
  if (!m) return;
  f.modesPlayed[m.i] = 1;
  if (won) f.modesWon[m.i] = 1;
  G.mode = null;
  cue(G, { k: 'mode', id: m.id, on: false, won });
  sound(G, won ? 'modeWon' : 'modeEnd');
  const played = f.modesPlayed.reduce((a, b) => a + b, 0);
  if (played === 3 && !f.ebLitByModes) { f.ebLitByModes = true; f.ebLit = true; after(G, 2.3, () => dmd(G, 'EXTRA BALL IS LIT', 'AT THE VAPORS', 1600, 2)); }
  if (played === 6 && !f.wizardLit) { f.wizardLit = true; after(G, 2.3, () => dmd(G, 'VALLEY OF THE VAPORS', 'IS LIT AT THE VAPORS', 2200, 3)); }
}

// ------------------------------------------------------------------------------------------------- multiballs
function addMultiballs(G, n) {
  for (let k = 0; k < n; k++) after(G, 0.5 + k * 1.1, () => autoLaunch(G, 0.4));
}

function startArlington(G, heldBallId) {
  const h = G.T.holes.find((q) => q.name === 'lock');
  G.mb = { kind: 'arlington', jackpot: 75000, jackpotLit: true, t0: G.t };
  dmd(G, 'ARLINGTON MULTIBALL', 'RAMP FOR JACKPOTS', 2600, 3, 'multiball');
  after(G, 2.8, () => dmd(G, 'THE ARLINGTON', fact('arlington'), 1800, 1)); sound(G, 'multiball'); show(G, 'multiball', 2600);
  startBallSave(G, 15);
  holdThen(G, heldBallId, 1.6, h.kickAngle, h.kickSpeed);
  addMultiballs(G, 2);
  cue(G, { k: 'mb', kind: 'arlington', on: true });
}

function startGrandSoak(G) {
  G.f.grandSoakLit = false;
  G.mb = { kind: 'soak', hit: new Array(8).fill(0), superLit: false, t0: G.t };
  dmd(G, 'GRAND SOAK', 'EVERY BATHHOUSE IS A JACKPOT', 2400, 3, 'multiball'); sound(G, 'multiball'); show(G, 'multiball', 2400);
  startBallSave(G, 15);
  addMultiballs(G, 1);
  cue(G, { k: 'mb', kind: 'soak', on: true });
}

function startValley(G) {
  const f = G.f;
  f.wizardLit = false;
  if (G.mode) endMode(G, false);
  G.mb = { kind: 'valley', t0: G.t, end: G.t + 62, mult: 1, total: 0, shots: 0 };
  dmd(G, 'VALLEY OF THE VAPORS', 'ALL SHOTS LIT · 60 SECONDS', 3000, 3, 'wizard'); sound(G, 'wizard'); show(G, 'wizard', 3000);
  startBallSave(G, 20);
  addMultiballs(G, 2);
  cue(G, { k: 'mb', kind: 'valley', on: true });
}

function valleyShot(G, name) {
  const mb = G.mb;
  if (name === 'vapors' && mb.shots >= 6) {
    const v = score(G, mb.total);
    dmd(G, 'VALLEY COLLECTED', fmt(v), 3000, 3, 'jackpot'); sound(G, 'superJackpot'); show(G, 'wizard', 2500);
    mb.total = 0; mb.shots = 0;
    return;
  }
  const v = 50000 * mb.mult;
  mb.total += v; mb.shots++;
  score(G, v);
  dmd(G, 'VALLEY OF THE VAPORS', fmt(mb.total) + (mb.shots >= 6 ? ' · VAPORS' : ''), 900, 2);
}

function tickMultiball(G) {
  const mb = G.mb;
  if (mb.kind === 'valley') {
    mb.mult = 1 << Math.min(5, Math.floor((G.t - mb.t0) / 10));
    if (G.t > mb.end) { dmd(G, 'THE VAPORS CLEAR', '', 1800, 2); mb.end = Infinity; }
  }
}

function endMultiball(G) {
  const mb = G.mb;
  if (!mb) return;
  G.mb = null;
  cue(G, { k: 'mb', kind: mb.kind, on: false });
  dmd(G, mb.kind === 'valley' ? 'WIZARD MODE OVER' : 'MULTIBALL OVER', '', 1400, 2);
  if (mb.kind === 'valley') { G.f.modesPlayed = [0, 0, 0, 0, 0, 0]; G.f.nextMode = 0; }
}

// ------------------------------------------------------------------------------------------------- player input
export function flipper(G, side, down, at) {
  if (G.player.tilted && down) return;
  if (at != null) queueInput(G.w, at, (w) => setFlipper(w, side, down));
  else setFlipper(G.w, side, down);
  if (down && G.scene === 'game') { laneChange(G, side === 'R' ? 1 : -1); sound(G, 'flip'); }
  if (!down && G.scene === 'game') sound(G, 'flipDown');
}

export function plunger(G, holding) {
  if (G.scene !== 'game') return;
  setPlunger(G.w, holding);
  if (!holding) sound(G, 'plunger');
}

export function nudge(G, dir) {
  if (G.scene !== 'game' || G.player.tilted) return;
  const v = { left: [-260, 60], right: [260, 60], up: [0, 300] }[dir] || [0, 300];
  physNudge(G.w, v[0], v[1]);
  cue(G, { k: 'nudge', dir });
  sound(G, 'nudge');
  const p = G.player;
  p.bob += 1;
  if (p.bob > 2.0) {
    p.bob = 1;
    p.warnings++;
    if (p.warnings > 2) tilt(G);
    else { dmd(G, 'DANGER', 'WARNING ' + p.warnings, 1200, 3); sound(G, 'warning'); }
  }
}

function tilt(G) {
  G.player.tilted = true;
  G.w.dead = true;
  for (const f of G.w.flippers) f.held = false;
  // release anything sitting in a saucer
  for (const b of G.w.balls) if (b.held && !b.held.drained) { const h = G.T.holes.find((q) => q.sw === b.held.sw); if (h) holdThen(G, b.id, 0.6, h.kickAngle, h.kickSpeed); }
  if (G.mode) endMode(G, false);
  dmd(G, 'TILT', '', 3000, 4); sound(G, 'tilt');
  cue(G, { k: 'tilt' });
}

// ------------------------------------------------------------------------------------------------- state
export function gameState(G) {
  return {
    scene: G.scene, t: +G.t.toFixed(3), seed: G.seedValue,
    player: { ...G.player },
    features: { ...G.f, spa: [...G.f.spa], row: [...G.f.row], modesPlayed: [...G.f.modesPlayed], modesWon: [...G.f.modesWon] },
    ball: { ...G.ball, lastMajor: { ...G.ball.lastMajor } },
    mode: G.mode ? { id: G.mode.id, progress: G.mode.progress, need: G.mode.need, phase: G.mode.phase, lit: [...G.mode.lit], left: Math.max(0, +(G.mode.end - G.t).toFixed(1)), data: JSON.parse(JSON.stringify(G.mode.data)) } : null,
    mb: G.mb ? { ...G.mb, hit: G.mb.hit ? [...G.mb.hit] : undefined } : null,
    bonus: G.bonus,
    ballsInPlay: ballsInPlay(G),
    physics: snapshot(G.w),
    callouts: [...G.callouts],
  };
}

/** Merge a crafted state (tests): player, features, scene, and optionally physics. */
export function setGameState(G, s) {
  if (s.scene) G.scene = s.scene;
  if (s.player) Object.assign(G.player, s.player);
  if (s.features) Object.assign(G.f, s.features);
  if (s.ball) Object.assign(G.ball, s.ball);
  if (s.physics) restore(G.w, s.physics);
  if (s.mode === null) G.mode = null;
}

export const api = { startMode, startArlington: (G) => startArlington(G, -1), startGrandSoak, startValley, endMultiball, tilt, serve, autoLaunch, endMode };

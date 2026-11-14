// Headless balance runs: the autoplay bot plays full games on the real rules and physics, and the tool reports ball times,
// scores, drains and how often each mode and multiball is reached. Targets (S3-03, Standard, skill-0.8 bot, 30+ games):
// an average ball of 40 to 90 s, side drains under 35 percent of drains, and every mode and the Arlington reached in at
// least 20 percent of games.
//   node tools/balance.mjs [--games 30] [--skill 0.8] [--seed 1] [--difficulty standard] [--ladder] [--check] [--json]
//   --tune kickbacks=0,saveSecs=10   override a number of the Standard tuning (rules.js STANDARD) for this run
//   --ladder   the skill ladder 0.4, 0.6, 0.8, 0.95 in one table      --check   exit 1 if the targets are missed
//   npm run balance  is  node tools/balance.mjs --check
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, MODES, STANDARD } from '../src/js/sim/rules.js';
import { createBot } from '../src/js/sim/bot.js';
import { BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { TICK } from '../src/js/sim/physics.js';

export const TARGETS = { ballMin: 40, ballMax: 90, sideMax: 0.35, reachMin: 0.2 };
const SHOT_SOUND = { vapors: 'saucer', lock: 'saucer', ramp: 'rampMade', orbit: 'orbit', reserve: 'orbit', bh: 'target' };
const BH = new Set(BATHHOUSES);
export const LADDER = [0.4, 0.6, 0.8, 0.95];
const T = compileTable(spec);
const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(p * (s.length - 1))] : 0; };

/** Play `games` full games with a bot of this skill and return the numbers. */
export function simulate({ games = 30, skill = 0.8, seed = 1, difficulty, balls = 3 } = {}) {
  const agg = { skill, games, drains: { outL: 0, outR: 0, center: 0, other: 0 }, scores: [], ballTimes: [], gameTimes: [], cues: {}, modes: {}, mbs: {}, aim: {}, saves: 0, kickbacks: 0, outlaneHits: 0, tilts: 0, searches: 0, capped: 0,
    reach: Object.fromEntries([...MODES.map((m) => m.id), 'arlington', 'soak multiball', 'valley'].map((k) => [k, 0])) };
  for (let g = 0; g < games; g++) {
    const G = createGame(T, { seed: seed + g });
    if (difficulty) G.settings.difficulty = difficulty;
    newGame(G, { balls, seed: seed + g });
    const aimed = [];
    const bot = createBot(G, { skill, seed: 99 + g, onFlip: (f) => aimed.push({ ...f, t: G.t, hit: false }) });
    const seen = new Set();
    let ballStart = 0, ticks = 0;
    while (G.scene !== 'over' && ticks < 60 * 60 / TICK) {
      bot(); tick(G); ticks++;
      for (const c of G.cues) {
        if (c.k === 'dmd') { agg.cues[c.text] = (agg.cues[c.text] || 0) + 1; if (c.text === 'BALL SAVED') agg.saves++; if (c.text === 'TILT') agg.tilts++; }
        if (c.k === 'mode' && c.on) { agg.modes[c.id] = (agg.modes[c.id] || 0) + 1; seen.add(c.id); }
        if (c.k === 'mb' && c.on) { agg.mbs[c.kind] = (agg.mbs[c.kind] || 0) + 1; seen.add(c.kind === 'soak' ? 'soak multiball' : c.kind); }
        if (c.k === 'sound') for (const a of aimed) if (!a.hit && G.t - a.t < 1.6 && G.t >= a.t && c.name === SHOT_SOUND[a.shot.startsWith('bh') || BH.has(a.shot) ? 'bh' : a.shot]) { a.hit = true; }
        if (c.k === 'search') agg.searches++;
        if (c.k === 'kickback') { agg.kickbacks++; agg.outlaneHits++; }
        if (c.k === 'sound' && c.name === 'outlane') agg.outlaneHits++;
        if (c.k === 'sound' && c.name === 'drain') { const x = G.lastDrainX; agg.drains[x == null ? 'other' : x < 60 ? 'outL' : x > 425 ? 'outR' : x > 180 && x < 305 ? 'center' : 'other']++; }
        if (c.k === 'bonus') { agg.ballTimes.push(G.t - ballStart); ballStart = G.t + 2.6; }
      }
      G.cues.length = 0;
    }
    if (ticks >= 60 * 60 / TICK) agg.capped++;
    for (const a of aimed) { const k = (BH.has(a.shot) ? 'bathhouse' : a.shot) + '/' + a.from + (a.speed < 400 ? '' : '+fast'); const e = (agg.aim[k] ||= { tried: 0, made: 0 }); e.tried++; if (a.hit) e.made++; }
    agg.scores.push(G.player.score); agg.gameTimes.push(G.t);
    for (const k of seen) agg.reach[k]++;
  }
  const d = agg.drains, total = d.outL + d.outR + d.center + d.other;
  return { ...agg, drainTotal: total, sideShare: total ? (d.outL + d.outR) / total : 0, ballAvg: avg(agg.ballTimes), ballMedian: pct(agg.ballTimes, 0.5), ballP10: pct(agg.ballTimes, 0.1), ballP90: pct(agg.ballTimes, 0.9),
    scoreAvg: avg(agg.scores), scoreMedian: pct(agg.scores, 0.5), scoreP90: pct(agg.scores, 0.9), gameAvg: avg(agg.gameTimes), reachShare: Object.fromEntries(Object.entries(agg.reach).map(([k, v]) => [k, v / games])) };
}

/** What a run says against the targets: a list of the misses, empty when it meets them all. */
export function verdict(r) {
  const misses = [];
  if (r.ballAvg < TARGETS.ballMin || r.ballAvg > TARGETS.ballMax) misses.push(`ball time ${r.ballAvg.toFixed(1)} s is outside ${TARGETS.ballMin}-${TARGETS.ballMax} s`);
  if (r.sideShare >= TARGETS.sideMax) misses.push(`side drains ${(r.sideShare * 100).toFixed(0)}% are not under ${TARGETS.sideMax * 100}%`);
  for (const k of [...MODES.map((m) => m.id), 'arlington']) if (r.reachShare[k] < TARGETS.reachMin) misses.push(`${k} reached in ${(r.reachShare[k] * 100).toFixed(0)}% of games, under ${TARGETS.reachMin * 100}%`);
  return misses;
}

export function report(r) {
  const out = [];
  out.push(`games ${r.games}, skill ${r.skill}, ${r.capped} hit the 60-minute cap`);
  out.push(`ball time avg ${r.ballAvg.toFixed(1)} s, median ${r.ballMedian.toFixed(1)}, p10 ${r.ballP10.toFixed(1)}, p90 ${r.ballP90.toFixed(1)}; game length avg ${(r.gameAvg / 60).toFixed(1)} min`);
  out.push(`score avg ${Math.round(r.scoreAvg).toLocaleString()}, median ${Math.round(r.scoreMedian).toLocaleString()}, p90 ${Math.round(r.scoreP90).toLocaleString()}`);
  out.push(`drains ${JSON.stringify(r.drains)}: side ${(r.sideShare * 100).toFixed(0)}% of ${r.drainTotal}; outlane entries ${r.outlaneHits} (${r.kickbacks} returned by a kickback); ball saves ${r.saves}; tilts ${r.tilts}`);
  out.push('aimed shots made: ' + Object.entries(r.aim).map(([k, v]) => `${k} ${v.made}/${v.tried}`).join(', '));
  // a mode ends when its ball drains (rules.js endMode at the end of a ball), so a game of `balls` balls starts about this many modes:
  // the later modes in the fixed order cannot be reached by a game that starts fewer than their place in the order
  const starts = Object.values(r.modes).reduce((x, y) => x + y, 0);
  out.push(`modes started per game ${(starts / r.games).toFixed(2)} (a mode ends with its ball; the sixth in the order needs five before it)`);
  out.push('games that reached: ' + Object.entries(r.reachShare).map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`).join(', '));
  return out.join('\n');
}

const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tools/balance.mjs');
if (isMain) {
  const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
  const has = (k) => process.argv.includes('--' + k);
  const games = +arg('games', 30), seed = +arg('seed', 1), difficulty = arg('difficulty', undefined);
  for (const kv of arg('tune', '').split(',').filter(Boolean)) { const [k, v] = kv.split('='); if (!(k in STANDARD)) throw new Error('no such tuning number: ' + k); STANDARD[k] = +v; }
  const t0 = Date.now();
  if (has('ladder')) {
    const rows = LADDER.map((skill) => simulate({ games, skill, seed, difficulty }));
    if (has('json')) console.log(JSON.stringify(rows.map((r) => ({ skill: r.skill, ballAvg: r.ballAvg, sideShare: r.sideShare, scoreMedian: r.scoreMedian, reachShare: r.reachShare }))));
    else {
      console.log('skill  ball avg  median   side drains  score median   modes reached (' + MODES.map((m) => m.short.toLowerCase()).join(' ') + ')  arlington');
      for (const r of rows) console.log(`${r.skill.toFixed(2)}   ${r.ballAvg.toFixed(1).padStart(6)} s ${r.ballMedian.toFixed(1).padStart(6)}   ${(r.sideShare * 100).toFixed(0).padStart(5)}%     ${Math.round(r.scoreMedian).toLocaleString().padStart(10)}   ${MODES.map((m) => (r.reachShare[m.id] * 100).toFixed(0).padStart(3) + '%').join(' ')}   ${(r.reachShare.arlington * 100).toFixed(0)}%`);
    }
  } else {
    const r = simulate({ games, skill: +arg('skill', 0.8), seed, difficulty });
    if (has('json')) console.log(JSON.stringify(r));
    else { console.log(report(r)); const top = Object.entries(r.cues).sort((a, b) => b[1] - a[1]); console.log('callouts: ' + top.slice(0, 30).map(([k, v]) => `${k}x${v}`).join(' | ')); }
    const misses = verdict(r);
    if (has('check')) { console.log(misses.length ? 'MISSES the targets:\n  ' + misses.join('\n  ') : 'meets the targets'); process.exitCode = misses.length ? 1 : 0; }
  }
  console.log(`(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}

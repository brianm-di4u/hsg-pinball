// Headless balance runs: the autoplay bot plays full games; reports ball times, scores, and how often every rule
// feature fires. Targets in DEV-PLAN: average ball 45–90 s, every mode reachable, sensible score spread.
//   node tools/balance.mjs [--games 40] [--skill 0.6] [--seed 1]
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick } from '../src/js/sim/rules.js';
import { createBot } from '../src/js/sim/bot.js';
import { TICK } from '../src/js/sim/physics.js';

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i >= 0 ? process.argv[i + 1] : d; };
const T = compileTable(spec);
const N = +arg('games', 40), skill = +arg('skill', 0.8), seed0 = +arg('seed', 1);
const agg = { drains: { outL: 0, outR: 0, center: 0, other: 0 }, scores: [], ballTimes: [], cues: {}, modes: {}, mbs: {}, games: 0, maxT: 0, saves: 0, tilts: 0, searches: 0 };
const t0 = Date.now();
for (let g = 0; g < N; g++) {
  const G = createGame(T, { seed: seed0 + g });
  newGame(G, { balls: 3, seed: seed0 + g });
  const bot = createBot(G, { skill, seed: 99 + g });
  let ballStart = 0, lastBall = 1, ticks = 0;
  while (G.scene !== 'over' && ticks < 60 * 60 / TICK) {
    bot(); tick(G); ticks++;
    for (const e of G.w.events) void e;
    for (const c of G.cues) {
      if (c.k === 'dmd') agg.cues[c.text] = (agg.cues[c.text] || 0) + 1;
      if (c.k === 'mode' && c.on) agg.modes[c.id] = (agg.modes[c.id] || 0) + 1;
      if (c.k === 'mb' && c.on) agg.mbs[c.kind] = (agg.mbs[c.kind] || 0) + 1;
      if (c.k === 'search') { agg.searches++; (agg.searchAt ||= []).push(JSON.stringify(c.at)); }
      if (c.k === 'sound' && c.name === 'drain') { const x = G.lastDrainX; agg.drains[x == null ? 'other' : x < 60 ? 'outL' : x > 425 ? 'outR' : x > 180 && x < 305 ? 'center' : 'other']++; }
      if (c.k === 'bonus') { agg.ballTimes.push(G.t - ballStart); ballStart = G.t + 2.6; }
    }
    G.cues.length = 0;
  }
  if (ticks >= 60 * 60 / TICK) console.log('game', g, 'hit the 60-minute cap');
  agg.scores.push(G.player.score); agg.games++;
}
const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;
const pct = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(p * (s.length - 1))]; };
console.log(`games ${agg.games} in ${((Date.now() - t0) / 1000).toFixed(1)} s, skill ${skill}`);
console.log(`ball time avg ${avg(agg.ballTimes).toFixed(1)} s, median ${pct(agg.ballTimes, 0.5).toFixed(1)}, p10 ${pct(agg.ballTimes, 0.1).toFixed(1)}, p90 ${pct(agg.ballTimes, 0.9).toFixed(1)}`);
console.log(`score avg ${Math.round(avg(agg.scores)).toLocaleString()}, median ${pct(agg.scores, 0.5).toLocaleString()}, p90 ${pct(agg.scores, 0.9).toLocaleString()}`);
console.log('drains', JSON.stringify(agg.drains));
if (agg.searchAt) console.log('search at', agg.searchAt.join(' '));
console.log('modes started', JSON.stringify(agg.modes), 'multiballs', JSON.stringify(agg.mbs), 'ball searches', agg.searches);
const top = Object.entries(agg.cues).sort((a, b) => b[1] - a[1]);
console.log('callouts:', top.slice(0, 40).map(([k, v]) => `${k}×${v}`).join(' | '));

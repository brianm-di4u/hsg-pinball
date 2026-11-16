// Records, goals, ranks and the daily table (S3-01). Pure data and functions: no DOM, no storage (save.js keeps the
// `stats` and `daily` keys). A "tally" is what a game or the lifetime record counts; the goals read one lifetime tally
// that already includes the game in progress, so a goal is earned the moment the play that earns it happens.
import { MODES } from './sim/rules.js';

export const DAYS_KEPT = 35;   // the daily history keeps this many days; older ones are dropped so the save never grows

// ------------------------------------------------------------------------------------------------- ranks
// Lifetime score buys the next rank. A Standard game is worth about 360,000 to the autoplay bot, so the last rank is
// well over a hundred games away. The names are fictional jobs of the bathhouse trade.
export const RANKS = [
  { name: 'Bellhop', at: 0 },
  { name: 'Towel Runner', at: 250000 },
  { name: 'Bath Attendant', at: 1000000 },
  { name: 'Masseuse', at: 3000000 },
  { name: 'Concierge', at: 8000000 },
  { name: 'Head Clerk', at: 20000000 },
  { name: 'Bathhouse Manager', at: 50000000 },
];
export function rankOf(total) {
  let i = 0;
  for (let k = 0; k < RANKS.length; k++) if (total >= RANKS[k].at) i = k;
  const next = RANKS[i + 1] || null;
  return { i, name: RANKS[i].name, next: next ? next.name : null, toNext: next ? next.at - total : 0, frac: next ? (total - RANKS[i].at) / (next.at - RANKS[i].at) : 1 };
}

// ------------------------------------------------------------------------------------------------- tallies
export const emptyTally = () => ({ games: 0, matches: 0, score: 0, skillShots: 0, baths: 0, rows: 0, boils: 0, jackpots: 0, wizards: 0, extraBalls: 0, mbs: [0, 0, 0], modeWins: [0, 0, 0, 0, 0, 0] });
// what one game has counted so far, read off the game's own tallies
export function gameTally(G) {
  const f = G.f, p = G.player;
  return { games: 0, matches: p.match != null && p.score % 100 === p.match ? 1 : 0, score: p.score, skillShots: p.skillShots, baths: f.bathHits || 0, rows: f.rowsDone, boils: f.boils || 0, jackpots: f.jackpots || 0, wizards: f.wizards || 0,
    extraBalls: p.eb || 0, mbs: [...(f.mbs || [0, 0, 0])], modeWins: [...(f.modeWins || [0, 0, 0, 0, 0, 0])] };
}
export function addTally(a, b) {
  return { games: a.games + b.games, matches: (a.matches || 0) + (b.matches || 0), score: a.score + b.score, skillShots: a.skillShots + b.skillShots, baths: a.baths + b.baths, rows: a.rows + b.rows, boils: a.boils + b.boils,
    jackpots: a.jackpots + b.jackpots, wizards: a.wizards + b.wizards, extraBalls: a.extraBalls + b.extraBalls, mbs: a.mbs.map((v, i) => v + b.mbs[i]), modeWins: a.modeWins.map((v, i) => v + b.modeWins[i]) };
}

// ------------------------------------------------------------------------------------------------- goals
// test(A, L, X): A is the lifetime tally including this game, L this game alone, X { difficulty, streak, daily, finished }.
const n = (v) => v.toLocaleString('en-US');
export const GOALS = [
  { id: 'checkin', name: 'Checked In', text: 'Finish a game.', test: (A) => A.games >= 1 },
  { id: 'skill', name: 'Straight Shooter', text: 'Hit a skill shot: plunge into the lit lane.', test: (A) => A.skillShots >= 1 },
  { id: 'eb', name: 'One More Soak', text: 'Win an extra ball.', test: (A) => A.extraBalls >= 1 },
  { id: 'boil', name: 'Boiling Point', text: 'Heat the springs to 143 degrees and make them boil.', test: (A) => A.boils >= 1 },
  { id: 'row', name: 'The Whole Row', text: 'Hit all eight bathhouses.', test: (A) => A.rows >= 1 },
  { id: 'win', name: 'Mode Winner', text: 'Win any of the six modes.', test: (A) => A.modeWins.some((v) => v > 0) },
  { id: 'jackpot', name: 'Jackpot!', text: 'Collect a multiball jackpot.', test: (A) => A.jackpots >= 1 },
  { id: 'arlington', name: 'Locked In at the Arlington', text: 'Start Arlington Multiball.', test: (A) => A.mbs[0] >= 1 },
  { id: 'soak', name: 'Grand Soak', text: 'Start Grand Soak multiball.', test: (A) => A.mbs[1] >= 1 },
  { id: 'quarter', name: 'Quarter Million', text: `Score ${n(250000)} in one game.`, test: (A, L) => L.score >= 250000 },
  { id: 'million', name: 'Seven Figures', text: `Score ${n(1000000)} in one game.`, test: (A, L) => L.score >= 1000000 },
  { id: 'valley', name: 'Valley of the Vapors', text: 'Reach the wizard mode.', test: (A) => A.mbs[2] >= 1 },
  { id: 'round2', name: 'Round Two', text: 'Finish the wizard mode and start a harder round.', test: (A) => A.wizards >= 1 },
  { id: 'top', name: 'Top of the Row', text: `Score ${n(2500000)} in one game.`, test: (A, L) => L.score >= 2500000 },
  { id: 'expert', name: 'Hard Water', text: `Score ${n(500000)} on the Expert table.`, test: (A, L, X) => X.difficulty === 'expert' && L.score >= 500000 },
  { id: 'tour', name: 'The Grand Tour', text: 'Win each of the six modes, in any number of games.', test: (A) => A.modeWins.every((v) => v > 0) },
  { id: 'sharp', name: 'Sharpshooter', text: 'Hit 25 skill shots.', test: (A) => A.skillShots >= 25 },
  { id: 'regular', name: 'Regular', text: 'Finish 10 games.', test: (A) => A.games >= 10 },
  { id: 'season', name: 'Season Ticket', text: 'Finish 50 games.', test: (A) => A.games >= 50 },
  { id: 'daily', name: 'Daily Soak', text: 'Finish the daily table.', test: (A, L, X) => !!X.daily && !!X.finished },
  { id: 'streak3', name: 'Three Days Running', text: 'Play the daily table three days in a row.', test: (A, L, X) => X.streak >= 3 },
  { id: 'streak7', name: 'A Week on the Row', text: 'Play the daily table seven days in a row.', test: (A, L, X) => X.streak >= 7 },
];
export const goalById = (id) => GOALS.find((g) => g.id === id) || null;
// the ids of the goals this tally earns that the player does not have yet
export function newlyEarned(have, A, L, X) { return GOALS.filter((g) => !have[g.id] && g.test(A, L, X)).map((g) => g.id); }

// ------------------------------------------------------------------------------------------------- the daily table
// The table is dealt from the local date: every player gets the same seed that day (the skill-shot lanes, the mystery
// awards, the match digit), on Standard with three balls and no practice, so the scores can be compared.
export const DAILY_OPTS = { balls: 3, practice: false, difficulty: 'standard' };
let todayOverride = null;
export const setToday = (s) => { todayOverride = typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null; };
export function todayKey(d = new Date()) {
  if (todayOverride) return todayOverride;
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export function dailySeed(key) {
  let h = 2166136261;   // FNV-1a over the date text
  for (const c of 'spa-city-daily:' + key) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 1000000 + 1;
}
const dayNum = (key) => Math.round(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) / 86400000);
export const shiftDay = (key, by) => { const d = new Date((dayNum(key) + by) * 86400000); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); };
// consecutive days played, counted back from today, or from yesterday when today has not been played yet
export function streakOf(days, today) {
  let k = days[today] ? today : shiftDay(today, -1), run = 0;
  while (days[k] && days[k].plays > 0) { run++; k = shiftDay(k, -1); }
  return run;
}
export function pruneDays(days, today) {
  const keep = {}, oldest = dayNum(today) - DAYS_KEPT;
  for (const k of Object.keys(days)) if (dayNum(k) > oldest) keep[k] = days[k];
  return keep;
}
export const MODE_NAMES = MODES.map((m) => m.short[0] + m.short.slice(1).toLowerCase());

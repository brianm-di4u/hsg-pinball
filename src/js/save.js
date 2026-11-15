// localStorage wrapper (pattern from hsg-property-game main.js `store`): every access in try/catch so the game runs
// with storage blocked, in private windows and in previews.
import { DIFFICULTIES } from './sim/rules.js';
import { REBIND, RESERVED, KEYS } from './ui/input.js';
import { emptyTally, GOALS, pruneDays, streakOf, todayKey } from './progress.js';

const PREFIX = 'hsg-pinball:';

export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(PREFIX + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
  },
};

// can this browser keep anything? (private windows and blocked site data cannot): the settings and title say so
export function storageWritable() {
  try { const k = PREFIX + 'probe'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch { return false; }
}

export const DEFAULT_SETTINGS = { v: 1, sound: true, music: true, volume: 0.8, sfxVol: 1, musicVol: 1, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1, ambience: true, difficulty: 'standard', tipsSeen: false, ballGlow: true, tierLearned: '' };

// saved values come from storage anyone can edit: keep only what the settings screen could have written
const pick = (v, allowed, dflt) => (allowed.includes(v) ? v : dflt);
const bool = (v, dflt) => (typeof v === 'boolean' ? v : dflt);
const unit = (v, dflt) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : dflt);
// the keys the player chose (settings.keys: action -> KeyboardEvent.code): a code for an action Settings can rebind, a plain key name, not Escape or Tab,
// not used twice and not one of the fixed keys (pause, mute, tips). Anything else is dropped; none left means the record has no `keys` at all.
const FIXED = ['pause', 'mute', 'tips'].flatMap((a) => KEYS[a]);
function cleanKeys(k) {
  const out = {}, used = new Set([...RESERVED, ...FIXED]);
  if (k && typeof k === 'object' && !Array.isArray(k)) for (const a of REBIND) { const c = k[a]; if (typeof c === 'string' && /^[A-Za-z0-9]{1,16}$/.test(c) && !used.has(c)) { out[a] = c; used.add(c); } }
  return out;
}
function cleanSettings(s) {
  const d = DEFAULT_SETTINGS;
  const keys = cleanKeys(s.keys), out = {
    ...s, v: 1,
    sound: bool(s.sound, d.sound), music: bool(s.music, d.music),
    ambience: bool(s.ambience, bool(s.sound, d.ambience)),   // a save from before the Ambience switch gets it where its Sound effects switch is, so effects off means no new sound
    practice: bool(s.practice, d.practice), ballGlow: bool(s.ballGlow, d.ballGlow),
    volume: unit(s.volume, d.volume),
    sfxVol: unit(s.sfxVol, d.sfxVol), musicVol: unit(s.musicVol, d.musicVol),   // a save from before the two sliders has neither: both at full, so nothing sounds different
    motion: pick(s.motion, ['auto', 'full', 'reduced'], d.motion),
    balls: pick(s.balls, [3, 5], d.balls),
    tier: pick(s.tier, ['auto', 'high', 'medium', 'low', '2d'], d.tier),
    textScale: pick(s.textScale, [1, 1.15, 1.3], d.textScale),
    tierLearned: pick(s.tierLearned, ['high', 'medium', 'low'], ''),   // the tier the quality governor last settled on (S6-08); none until it has stepped
    difficulty: pick(s.difficulty, DIFFICULTIES, d.difficulty),   // a save from before the setting has none: Standard
    tipsSeen: bool(s.tipsSeen, true),   // a settings record from before the tips is a returning player's: no first-game tips unless asked
  };
  delete out.keys;
  if (!out.tierLearned) delete out.tierLearned;   // absent until the governor has stepped, like keys
  if (Object.keys(keys).length) out.keys = keys;
  return out;
}
export function loadSettings() {
  const s = store.get('settings', null);
  if (s && typeof s === 'object' && s.v === 1) return cleanSettings(s);
  // no settings yet: a newcomer, unless the browser already holds this game's scores, stats or a saved game (a returning player who never opened Settings)
  const returning = ['scores', 'stats', 'daily', 'resume'].some((k) => store.get(k, null) != null);
  return { ...DEFAULT_SETTINGS, tipsSeen: returning };
}
export function saveSettings(s) { store.set('settings', s); }

// fictional default high scores (initials only)
const DEFAULT_SCORES = [
  ['SPA', 2500000], ['ROW', 2000000], ['TUB', 1500000], ['HOT', 1200000], ['FDY', 1000000],
  ['QPW', 800000], ['OZK', 600000], ['LMR', 400000], ['HLE', 250000], ['SUP', 100000],
].map(([initials, score]) => ({ initials, score, date: '2026-11-01', difficulty: 'standard' }));

// one table for each length of game, so a 5-ball score is never set against a 3-ball one: 'scores' stays the 3-ball table (every score saved before this
// was kept there), 'scores5' is the 5-ball table
const scoreKey = (balls) => (balls === 5 ? 'scores5' : 'scores');
export function loadScores(balls = 3) {
  const s = store.get(scoreKey(balls), null);
  if (s && s.v === 1 && Array.isArray(s.table)) {
    const rows = s.table
      .filter((r) => r && typeof r.initials === 'string' && typeof r.score === 'number' && Number.isFinite(r.score))
      .map((r) => ({ ...r, initials: r.initials.slice(0, 3), difficulty: pick(r.difficulty, DIFFICULTIES, 'standard') }))   // scores from before the setting count as Standard
      .sort((a, b) => b.score - a.score).slice(0, 10);
    if (rows.length) return rows;
  }
  return DEFAULT_SCORES.map((r) => ({ ...r }));
}
export function qualifies(score, table = loadScores(3)) { return score > 0 && (table.length < 10 || score > table[table.length - 1].score); }
export function addScore(initials, score, difficulty = 'standard', balls = 3) {
  const table = loadScores(balls);
  table.push({ initials, score, date: new Date().toISOString().slice(0, 10), difficulty: pick(difficulty, DIFFICULTIES, 'standard') });
  table.sort((a, b) => b.score - a.score);
  const out = table.slice(0, 10);
  store.set(scoreKey(balls), { v: 1, table: out });
  return out.findIndex((r) => r.initials === initials && r.score === score);
}

// the game in progress, written at each ball start so a reload or crash can offer Continue
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
export function loadResume() {
  const r = store.get('resume', null);
  if (!isObj(r) || r.v !== 1 || !isObj(r.player) || !isObj(r.features)) return null;
  const p = r.player;
  if (![3, 5].includes(p.ballsPerGame) || !Number.isInteger(p.ball) || p.ball < 1 || p.ball > p.ballsPerGame) return null;
  if (typeof p.score !== 'number' || !Number.isFinite(p.score) || p.score < 0) return null;
  return { v: 1, practice: r.practice === true, difficulty: pick(r.difficulty, DIFFICULTIES, 'standard'), daily: typeof r.daily === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.daily) ? r.daily : null, player: p, features: r.features };
}
export function saveResume(player, features, practice, difficulty = 'standard', daily = null) { return store.set('resume', { v: 1, practice: !!practice, difficulty, daily, player, features }); }
export function clearResume() { return store.set('resume', null); }

// ------------------------------------------------------------------------------------------------- records (S3-01)
// `stats`: lifetime tallies, the best score on each table difficulty and the goals earned (id -> the date). `daily`: the
// daily table's scores by date, the last DAYS_KEPT days only. Both read what anyone could have edited: every number is
// forced to a whole, finite, non-negative value and a damaged key falls back to nothing earned, never to an error. A save
// from before this version has neither key and starts at zero; nothing else in it is touched.
const MAXN = 1e12;
const cnt = (v) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(MAXN, Math.max(0, Math.floor(v))) : 0);
const cntArr = (v, len) => Array.from({ length: len }, (_, i) => (Array.isArray(v) ? cnt(v[i]) : 0));
const dateKey = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null);
export function loadStats() {
  const s = store.get('stats', null), d = emptyTally();
  if (!isObj(s) || s.v !== 1) return { v: 1, ...d, best: { easy: 0, standard: 0, expert: 0 }, earned: {} };
  const earned = {};
  if (isObj(s.earned)) for (const g of GOALS) { const when = dateKey(s.earned[g.id]); if (when) earned[g.id] = when; }
  const b = isObj(s.best) ? s.best : {};
  return { v: 1, games: cnt(s.games), score: cnt(s.score), skillShots: cnt(s.skillShots), baths: cnt(s.baths), rows: cnt(s.rows), boils: cnt(s.boils), jackpots: cnt(s.jackpots), wizards: cnt(s.wizards),
    extraBalls: cnt(s.extraBalls), mbs: cntArr(s.mbs, 3), modeWins: cntArr(s.modeWins, 6), best: { easy: cnt(b.easy), standard: cnt(b.standard), expert: cnt(b.expert) }, earned };
}
export function saveStats(s) { return store.set('stats', s); }

export function loadDaily(today = todayKey()) {
  const s = store.get('daily', null), days = {};
  let longest = 0;
  if (isObj(s) && s.v === 1) {
    if (isObj(s.days)) for (const k of Object.keys(s.days)) { const r = s.days[k]; if (dateKey(k) && isObj(r) && cnt(r.plays) > 0) days[k] = { best: cnt(r.best), plays: cnt(r.plays) }; }
    longest = cnt(s.longest);
  }
  const kept = pruneDays(days, today);
  return { v: 1, days: kept, longest: Math.max(longest, streakOf(kept, today)) };
}
export function saveDaily(d) { return store.set('daily', { v: 1, days: d.days, longest: d.longest }); }

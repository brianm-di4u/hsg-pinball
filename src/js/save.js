// localStorage wrapper (pattern from hsg-property-game main.js `store`): every access in try/catch so the game runs
// with storage blocked, in private windows and in previews.
const PREFIX = 'hsg-pinball:';

export const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(PREFIX + key); return v == null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
  },
};

export const DEFAULT_SETTINGS = { v: 1, sound: true, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1, ambience: true };

// saved values come from storage anyone can edit: keep only what the settings screen could have written
const pick = (v, allowed, dflt) => (allowed.includes(v) ? v : dflt);
const bool = (v, dflt) => (typeof v === 'boolean' ? v : dflt);
function cleanSettings(s) {
  const d = DEFAULT_SETTINGS;
  return {
    ...s, v: 1,
    sound: bool(s.sound, d.sound), music: bool(s.music, d.music), ambience: bool(s.ambience, d.ambience), practice: bool(s.practice, d.practice),
    volume: typeof s.volume === 'number' && Number.isFinite(s.volume) ? Math.min(1, Math.max(0, s.volume)) : d.volume,
    motion: pick(s.motion, ['auto', 'full', 'reduced'], d.motion),
    balls: pick(s.balls, [3, 5], d.balls),
    tier: pick(s.tier, ['auto', 'high', 'medium', 'low', '2d'], d.tier),
    textScale: pick(s.textScale, [1, 1.15, 1.3], d.textScale),
  };
}
export function loadSettings() {
  const s = store.get('settings', null);
  return s && typeof s === 'object' && s.v === 1 ? cleanSettings(s) : { ...DEFAULT_SETTINGS };
}
export function saveSettings(s) { store.set('settings', s); }

// fictional default high scores (initials only)
const DEFAULT_SCORES = [
  ['SPA', 2500000], ['ROW', 2000000], ['TUB', 1500000], ['HOT', 1200000], ['FDY', 1000000],
  ['QPW', 800000], ['OZK', 600000], ['LMR', 400000], ['HLE', 250000], ['SUP', 100000],
].map(([initials, score]) => ({ initials, score, date: '2026-11-01' }));

export function loadScores() {
  const s = store.get('scores', null);
  if (s && s.v === 1 && Array.isArray(s.table)) {
    const rows = s.table
      .filter((r) => r && typeof r.initials === 'string' && typeof r.score === 'number' && Number.isFinite(r.score))
      .map((r) => ({ ...r, initials: r.initials.slice(0, 3) }))
      .sort((a, b) => b.score - a.score).slice(0, 10);
    if (rows.length) return rows;
  }
  return DEFAULT_SCORES.map((r) => ({ ...r }));
}
export function qualifies(score, table = loadScores()) { return score > 0 && (table.length < 10 || score > table[table.length - 1].score); }
export function addScore(initials, score) {
  const table = loadScores();
  table.push({ initials, score, date: new Date().toISOString().slice(0, 10) });
  table.sort((a, b) => b.score - a.score);
  const out = table.slice(0, 10);
  store.set('scores', { v: 1, table: out });
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
  return { v: 1, practice: r.practice === true, player: p, features: r.features };
}
export function saveResume(player, features, practice) { return store.set('resume', { v: 1, practice: !!practice, player, features }); }
export function clearResume() { return store.set('resume', null); }

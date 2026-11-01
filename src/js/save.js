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

export const DEFAULT_SETTINGS = { v: 1, sound: true, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1 };

export function loadSettings() {
  const s = store.get('settings', null);
  return s && s.v === 1 ? { ...DEFAULT_SETTINGS, ...s } : { ...DEFAULT_SETTINGS };
}
export function saveSettings(s) { store.set('settings', s); }

// fictional default high scores (initials only)
const DEFAULT_SCORES = [
  ['SPA', 2500000], ['ROW', 2000000], ['TUB', 1500000], ['HOT', 1200000], ['FDY', 1000000],
  ['QPW', 800000], ['OZK', 600000], ['LMR', 400000], ['HLE', 250000], ['SUP', 100000],
].map(([initials, score]) => ({ initials, score, date: '2026-11-01' }));

export function loadScores() {
  const s = store.get('scores', null);
  return s && s.v === 1 && Array.isArray(s.table) ? s.table : DEFAULT_SCORES.map((r) => ({ ...r }));
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

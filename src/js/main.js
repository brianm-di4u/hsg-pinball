// Spa City Pinball: app controller. Fixed-step loop with interpolation, input timing, cue routing (DMD, audio,
// lamps, effects), screens, saves and the window.__game test hooks.
import { compileTable } from './sim/table.js';
import { spec } from './sim/table-spa-city.js';
import { TICK, autoPlunge, addBall, LAYER, removeBall } from './sim/physics.js';
import { createGame, newGame, tick, flipper, plunger, plungerCancel, nudge, gameState, setGameState, mystery, api } from './sim/rules.js';
import { createBot } from './sim/bot.js';
import { buildLamps, lampStates } from './sim/lamps.js';
import { FACTS, ATTRACT_FACTS } from './sim/facts.js';
import { DMD, paintDMD, makeSilhouettes } from './ui/dmd.js';
import { createInput } from './ui/input.js';
import { createScreens } from './ui/screens.js';
import { createCoach } from './ui/coach.js';
import { audio, unlock, sfx, setVolumes, startMusic, musicIntensity, ambienceParam, audioList, audioNow, audioRender, cueRender, rollRender, setRoll, suspendAudio, resumeAudio } from './ui/audio.js';
import { store, loadSettings, saveSettings, loadScores, qualifies, addScore, loadResume, saveResume, clearResume, loadStats, saveStats, loadDaily, saveDaily } from './save.js';
import { gameTally, addTally, newlyEarned, goalById, rankOf, todayKey, dailySeed, DAILY_OPTS, streakOf, pruneDays, setToday } from './progress.js';
import { createView2D } from './gfx/view2d.js';
import { createView3D, probeGL } from './gfx/view3d.js';

const $ = (s) => document.querySelector(s);
const qs = new URLSearchParams(location.search);
const TEST = !!window.__TEST__;
const T = compileTable(spec);
const LAMPS = buildLamps();
const fmt = (n) => Number(n).toLocaleString('en-US');
const MAX_DT = 0.1;   // longest real time one frame may simulate (a stall beyond it slows the game instead)

const app = {
  settings: loadSettings(),
  touch: matchMedia('(pointer: coarse)').matches,
  sfx: (n) => sfx(n),
  scores: () => loadScores(),
  stats: loadStats(),
};

let G = createGame(T, { seed: TEST ? 1 : (Date.now() & 0xffff) });
let demo = true, bot = null, paused = false, acc = 0, lastNow = performance.now(), timeScale = 1, slowUntil = 0;
let renderClock = null, clockBase = 0, view = null, view2d = null, loading = true, frameNo = 0, lastFact = 0, overTimer = 0;
const prev = new Map();
let lastDots = null, lastDmdW = 0;
const uiCache = {};
const touchChip = () => matchMedia('(max-aspect-ratio: 4 / 5)').matches;   // the phone-portrait score plate
const setText = (sel, v) => { if (uiCache[sel] !== v) { uiCache[sel] = v; $(sel).textContent = v; } };
const dmd = new DMD();
const effects = [];   // flashes, steam, shake → the view

// ------------------------------------------------------------------------------------------------- views
const canvasGL = $('#gl'), canvas2D = $('#c2d'), tableEl = $('#table');
function reducedMotion() { return app.settings.motion === 'reduced' || (app.settings.motion === 'auto' && matchMedia('(prefers-reduced-motion: reduce)').matches); }

function loadScript(src) { return new Promise((res) => { const s = document.createElement('script'); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); }); }

// The first view is the flat 2D table: it needs no asset pack, so the title is up at once. The 3D table is built behind it
// (packs and three.js download in parallel, the build yields to the page between steps) and swapped in when it is ready.
const BOOT_PACKS = 3;   // asset pack scripts plus three.js, counted for the progress line
let bootLoaded = 0, boot3d = 0;
function bootProgress() { $('#boot-strip').style.setProperty('--p', Math.round((0.5 * bootLoaded / BOOT_PACKS + 0.5 * boot3d) * 100) + '%'); }
let packsP = null, threeP = null, upgrading = false;
function startLoads() {
  const want = qs.get('tier') || app.settings.tier;
  const one = (p) => p.then((ok) => { bootLoaded++; bootProgress(); return ok; });
  if (!packsP) {
    const packs = typeof PB_ASSETS !== 'undefined' ? PB_ASSETS : [];
    packsP = Promise.all(packs.map((f) => one(loadScript('assets/' + f).then((ok) => { if (ok && f === 'art.js' && window.__PB_ART && window.__PB_ART.backglass) $('.glass-art').style.backgroundImage = `url(${window.__PB_ART.backglass})`; return ok; }))));
  }
  if (!threeP && want !== '2d') threeP = window.THREE ? Promise.resolve(true) : one(loadScript('vendor/three-r186.min.js'));
  return Promise.all([packsP, threeP]);
}

function initView2D() {
  view2d = createView2D(canvas2D, T, LAMPS);
  view = view2d;
  document.body.dataset.view = '2d';
  resize();
}

// no ball loose on the table (the demo counts: nobody is flipping): the swap waits for this, so it never lands mid-rally
const quietTable = () => demo || paused || G.scene !== 'game' || G.w.balls.every((b) => b.held || (b.x > 480 && b.y < 150));
// the build holds still while a ball is in play, so playing never stutters for it (a few seconds at most: it waits for the ball to drain or be plunged back)
async function whenQuiet(maxMs = 30000) { const t0 = performance.now(); while (!quietTable() && performance.now() - t0 < maxMs) await new Promise((res) => setTimeout(res, 200)); }
async function upgradeTo3D() {
  const want = qs.get('tier') || app.settings.tier;
  if (want === '2d') return;
  upgrading = true; bootLoaded = 0; boot3d = 0; $('#boot-strip').hidden = false;
  try { await buildAndSwap(want, startLoads()); } finally { upgrading = false; $('#boot-strip').hidden = true; }
}
async function buildAndSwap(want, loads) {
  await loads;
  if (!probeGL()) return;
  let v3 = null;
  try { v3 = await createView3D(canvasGL, T, LAMPS, { tier: want, reducedMotion, gate: whenQuiet, progress: (p) => { boot3d = p; bootProgress(); } }); } catch (e) { console.error('3D view failed, using 2D', e); return; }   // an error, so tests catch it
  const r = tableEl.getBoundingClientRect(); v3.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, v3.maxRatio())); await v3.warm();
  await whenQuiet();
  // a player who chose the flat table while this was building keeps it
  if (!qs.get('tier') && app.settings.tier === '2d') { v3.hide(); return; }
  if (app.settings.tier !== 'auto' && v3.tier !== app.settings.tier && !qs.get('tier')) v3.setTier(app.settings.tier);
  view = v3;
  // the governor's last step: software GL still too slow at Low → the flat 2D table
  v3.onTooSlow = () => { if (app.settings.tier === 'auto') { v3.hide(); view = view2d; document.body.dataset.view = '2d'; } };
  resize();
  render(Math.min(1, acc / TICK));   // draw the 3D table once before it is shown: no empty frame
  document.body.dataset.view = '3d';
}

function resize() {
  if (!view2d) return;
  const r = tableEl.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, view && view.kind === '3d' ? view.maxRatio() : 2);
  if (view && view.kind === '3d') view.resize(r.width, r.height, ratio);
  view2d.resize(r.width, r.height, Math.min(window.devicePixelRatio || 1, 2));
  sizeDMD();
}
window.addEventListener('resize', resize);

const dmdCanvas = $('#dmd'), dmdCtx = dmdCanvas.getContext('2d');
function sizeDMD() {
  const r = dmdCanvas.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
  dmdCanvas.width = Math.max(128, Math.round(r.width * d)); dmdCanvas.height = Math.max(32, Math.round(r.height * d));
}

// ------------------------------------------------------------------------------------------------- game control
function startDemo() {
  demo = true;
  G = createGame(T, { seed: TEST ? 3 : (Date.now() & 0xffff) });
  newGame(G, { balls: 3, practice: true });
  bot = createBot(G, { skill: 0.9, seed: 11 });
  G.cues.length = 0;
  document.body.dataset.scene = 'title';
  startMusic('title'); musicIntensity(0);
}

// copy back only the saved values that have the same shape as a fresh game's (storage anyone can edit)
function mergeKnown(dst, src) {
  for (const k of Object.keys(dst)) {
    const a = dst[k], b = src[k];
    if (Array.isArray(a)) { if (Array.isArray(b) && b.length === a.length && b.every((x) => typeof x === typeof a[0] && (typeof x !== 'number' || Number.isFinite(x)))) dst[k] = b.slice(); }
    else if (a !== null && typeof b === typeof a && (typeof b !== 'number' || Number.isFinite(b))) dst[k] = b;
  }
}

app.canContinue = () => !!loadResume();
app.start = (resume = null, o = {}) => {
  unlock(); resumeAudio();
  demo = false; bot = null; paused = false;
  const daily = resume ? resume.daily : o.daily ? todayKey() : null;   // the daily table: dealt from the date, fixed rules
  G = createGame(T, { seed: daily ? dailySeed(daily) : TEST ? 1 : (Date.now() & 0xffffff) });
  G.daily = daily; G.earnedNow = [];
  const fixed = daily && !resume ? DAILY_OPTS : null;
  newGame(G, { balls: fixed ? fixed.balls : resume ? resume.player.ballsPerGame : app.settings.balls, practice: fixed ? fixed.practice : resume ? resume.practice : app.settings.practice, difficulty: fixed ? fixed.difficulty : resume ? resume.difficulty : app.settings.difficulty });
  if (resume) {
    mergeKnown(G.player, resume.player); mergeKnown(G.f, resume.features);
    G.f.boilUntil = 0;   // a sim-clock time from the saved game: the clock starts again at 0
    G.cues = G.cues.filter((c) => c.k !== 'dmd');
    G.cues.push({ t: G.t, k: 'dmd', text: 'BALL ' + G.player.ball, sub: fmt(G.player.score), ms: 1600, prio: 2, anim: null });
  }
  coach.stop();
  dmd.queue.length = 0; dmd.cur = null;   // a new game starts with a clean display
  screens.close();
  document.body.dataset.scene = 'game';
  startMusic('main'); mixState();
  clearTimeout(overTimer);
  tableEl.focus({ preventScroll: true });
};
app.continueGame = () => { const r = loadResume(); if (r) app.start(r); };
app.restart = () => app.start(null, { daily: !!G.daily });
app.startDaily = () => app.start(null, { daily: true });
// what the Records screen and the title show, read fresh from the saves
app.progress = () => { const today = todayKey(), daily = loadDaily(today); return { stats: app.stats, rank: rankOf(app.stats.score), daily, today, streak: streakOf(daily.days, today) }; };
app.resume = () => { resumeAudio(); paused = false; screens.close(); document.body.dataset.scene = demo ? 'title' : 'game'; lastNow = performance.now(); };
app.quit = () => { resumeAudio(); paused = false; coach.stop(); screens.title(); startDemo(); };
app.applySettings = (s) => {
  const tierChanged = s.tier && s.tier !== app.settings.tier;
  Object.assign(app.settings, s);
  saveSettings(app.settings);
  setVolumes({ sound: app.settings.sound, music: app.settings.music, ambience: app.settings.ambience, volume: app.settings.volume });
  document.documentElement.style.setProperty('--text-scale', app.settings.textScale);
  document.body.classList.toggle('reduced', reducedMotion());
  if (tierChanged && view && view.kind === '3d') { if (s.tier === '2d') { view.hide(); view = view2d; } else view.setTier(s.tier); }
  else if (tierChanged && view === view2d && s.tier !== '2d' && !upgrading) upgradeTo3D();
  document.body.dataset.view = view ? view.kind : '2d';
};
function pause() {
  if (demo || paused || G.scene === 'over') return;
  paused = true; suspendAudio();
  // keys released while paused never reach the game, so let go of everything now
  G.w.pending.length = 0;   // a flip queued for a later substep must not fire after the release
  for (const f of G.w.flippers) if (f.held) flipper(G, f.side, false);
  plungerCancel(G);   // a plunger held through the pause is let go without firing
  screens.pause(); document.body.dataset.scene = 'pause';
}

// the window lost focus or the tab was hidden with a ball in play: the sim must not keep running unattended
const autoPause = () => { if (!demo && !paused && G.scene === 'game' && G.w.balls.length) pause(); };
window.addEventListener('blur', autoPause);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { autoPause(); suspendAudio(); }
  else if (!paused) resumeAudio();
});

// ------------------------------------------------------------------------------------------------- input
// The sim time an input event belongs to. The offset is capped like a frame's step (MAX_DT), so an event never lands
// past the end of the frame that will run it.
function simTimeFor(ts) {
  const now = G.w.tick * TICK;
  const t = now + acc + Math.min(MAX_DT, Math.max(0, (ts - lastNow) / 1000)) * timeScale;
  return Math.max(now, t);
}
const input = createInput(tableEl, {
  wantsKeys(a) { return !screens.current || screens.current === 'entry' || a === 'pause'; },
  touchActive() { return !screens.current && !paused; },
  action(a, down, ts, src) {
    unlock();
    if (src === 'key' || src === 'touch' || src === 'pad') coach.setKind(src);
    if (a === 'tips') { if (down) coach.skip(); return; }
    if (screens.current === 'entry') { if (down && screens.entryKey) screens.entryKey(a); return; }
    if (a === 'pause') {
      if (!down) return;
      if (screens.current === 'pause') app.resume();
      else if (paused) screens.pause();              // Esc backs out of settings or help to the pause menu
      else if (screens.current && demo) screens.title();
      else if (!demo) pause();
      return;
    }
    if (paused || demo || screens.current) return;
    if (a === 'flipL' || a === 'flipR') { flipper(G, a === 'flipL' ? 'L' : 'R', down, simTimeFor(ts)); if (down) coach.note('flip'); }
    else if (a === 'plunge') { if (!down && src === 'blur') plungerCancel(G); else plunger(G, down); }
    else if (down && a.startsWith('nudge')) { nudge(G, { nudgeL: 'left', nudgeR: 'right', nudgeU: 'up' }[a]); if (!reducedMotion()) effects.push({ k: 'shake', dir: a, t: now() }); }
  },
});
// on-screen buttons
$('#b-launch').addEventListener('pointerdown', (e) => { unlock(); coach.setKind(e.pointerType === 'touch' || app.touch ? 'touch' : 'key'); if (!demo && !paused) plunger(G, true); e.preventDefault(); });
const releaseLaunch = (e) => { if (!demo && !paused) plunger(G, false); };
$('#b-launch').addEventListener('pointerup', releaseLaunch);
$('#b-launch').addEventListener('pointerleave', releaseLaunch);
$('#b-menu').addEventListener('click', () => { unlock(); if (demo) screens.title(); else pause(); });

const screens = createScreens($('#screens'), app);

// ------------------------------------------------------------------------------------------------- first-game tips (S2-01)
// Shown on the first serve of a newcomer's first game (settings.tipsSeen is false); a settings record from before the tips
// counts as seen. The line sits over the top of the table, never over the lane, the flippers or the HUD numbers.
const coachEl = $('#coach'), coachSkip = $('#coach-skip');
const coach = createCoach({
  show(text, id) { $('#coach-text').textContent = text; coachEl.dataset.step = id; coachSkip.textContent = coach.kind === 'key' ? 'Skip tips (T)' : 'Skip tips'; $('#b-launch').classList.toggle('coached', id === 'plunge'); },
  hide() { coachEl.hidden = true; uiCache.coach = false; $('#b-launch').classList.remove('coached'); },
  say(text) { announce(text); },
  done() { app.applySettings({ tipsSeen: true }); },
});
coach.kind = app.touch ? 'touch' : 'key';
coachSkip.addEventListener('click', () => { coach.skip(); tableEl.focus({ preventScroll: true }); });
app.showTipsAgain = () => { app.applySettings({ tipsSeen: false }); };
function coachFrame() {
  if (!coach.active && !app.settings.tipsSeen && !demo && !paused && G.scene === 'game' && !screens.current && G.w.balls.some((b) => !b.held && b.x > 480 && b.y < 150)) coach.start(G.t);
  if (!coach.active) return;
  if (demo) { coach.stop(); return; }
  coach.poll({ t: G.t, lane: G.w.balls.some((b) => !b.held && b.x > 480 && b.y < 150), balls: G.w.balls.length });
  const show = coach.active && !paused && !screens.current;
  if (show !== uiCache.coach) { uiCache.coach = show; coachEl.hidden = !show; }
}

// ------------------------------------------------------------------------------------------------- cues
function now() { return renderClock != null ? renderClock : (performance.now() - clockBase) / 1000; }

function routeCues() {
  for (const c of G.cues) {
    switch (c.k) {
      case 'dmd': if (!demo || c.prio >= 3) dmd.push(c); if (!demo) announce(c.text + (c.sub ? '. ' + c.sub : '')); break;
      case 'sound': if (!demo) sfx(c.name, c.v, c.x == null ? 0 : (c.x / G.T.width) * 2 - 1, c); break;   // pan by where it happened (the cue carries n and m for ladders and countdowns)
      case 'flash': case 'steam': case 'spin': case 'kick': effects.push({ ...c, t: now() }); break;
      case 'slowmo': if (!c.others && !reducedMotion() && (!TEST || window.__game.slowmo)) { timeScale = 0.35; slowUntil = performance.now() + 500; } break;
      case 'mode': if (!demo) { startMusic(G.mb ? mbScene(G.mb.kind) : c.on ? 'mode' : 'main', c.on ? c.id : null); mixState(); } break;
      case 'mb': if (!demo) { startMusic(c.on ? mbScene(c.kind) : (G.mode ? 'mode' : 'main'), !c.on && G.mode ? G.mode.id : null); mixState(); } break;
      case 'serve': if (!demo) { announce('Ball ' + G.player.ball + ' of ' + G.player.ballsPerGame + '. Launch is ready.'); if (G.player.ball === 1 && !G.player.score) clearResume(); else saveResume(G.player, G.f, G.settings.practice, G.difficulty, G.daily); } break;
      case 'bonus': if (!demo) announce('Ball ' + G.player.ball + ' over. Bonus ' + fmt(c.total) + '. Score ' + fmt(G.player.score)); break;
      case 'over': if (!demo) { announce('Game over. Final score ' + fmt(c.score)); gameOverFlow(c); } else setTimeout(() => demo && startDemo(), 1500); break;
      case 'tilt': effects.push({ k: 'tilt', t: now() }); break;
    }
  }
  G.cues.length = 0;
}

// the piece for a multiball: the wizard mode has its own
const mbScene = (kind) => (kind === 'valley' ? 'wizard' : 'multiball');
// what the music and ambience follow in play: modes played, the Raid hurry-up, the last seconds of a mode, multiball,
// the spring temperature and the Derby race. Called on mode and multiball changes and a few times a second.
function mixState() {
  if (demo || !G) return;
  const f = G.f, m = G.mode;
  let x;
  if (G.mb) x = G.mb.kind === 'valley' ? 1 : 0.7;
  else if (m) x = (m.id === 'raid' && m.phase === 2) || m.end - G.t < 10 ? 1 : 0.6;
  else x = Math.min(0.9, 0.2 + 0.12 * f.modesPlayed.reduce((a, b) => a + b, 0));
  musicIntensity(x);
  checkGoals();
  ambienceParam('steam', f.boilUntil > G.t ? 1 : (f.springTemp - 100) / 43);
  ambienceParam('crowd', m && m.id === 'derby' ? m.progress / 100 : 0);
}

// ------------------------------------------------------------------------------------------------- records and goals
const toastQ = []; let toastTimer = 0;
function pumpToast() {
  const el = $('#toast'), id = toastQ.shift();
  if (!id) { el.hidden = true; toastTimer = 0; return; }
  const g = goalById(id);
  el.innerHTML = '<b>Goal reached</b><span></span>'; el.lastChild.textContent = g.name; el.hidden = false;
  sfx('achieve'); announce('Goal reached: ' + g.name + '. ' + g.text);
  toastTimer = setTimeout(pumpToast, 3400);
}
function earn(ids) {
  const st = app.stats, when = todayKey();
  for (const id of ids) { st.earned[id] = when; (G.earnedNow ||= []).push(id); toastQ.push(id); }
  saveStats(st);
  if (!toastTimer) pumpToast();
}
// goals the game in progress has just earned (the totals so far are the saved ones plus this game's tally); not in practice
function checkGoals() {
  if (demo || G.scene === 'over' || G.settings.practice) return;
  const L = gameTally(G), ids = newlyEarned(app.stats.earned, addTally(app.stats, L), L, { difficulty: G.difficulty, streak: 0, daily: !!G.daily, finished: false });
  if (ids.length) earn(ids);
}
// a finished game goes on the books: totals, the best score on its difficulty, the daily table, the rank and the goals that need a finished game
function recordGame(c) {
  if (G.settings.practice) return null;   // practice (an endless ball save) is not recorded
  const st = app.stats, L = gameTally(G), diff = c.difficulty || 'standard', prevBest = st.best[diff] || 0, before = rankOf(st.score);
  Object.assign(st, addTally(st, { ...L, games: 1 }));
  st.best[diff] = Math.max(prevBest, c.score);
  let daily = null;
  if (G.daily) {
    const d = loadDaily(G.daily), r = d.days[G.daily] || { best: 0, plays: 0 }, prev = r.best;
    r.plays++; r.best = Math.max(prev, c.score); d.days[G.daily] = r; d.days = pruneDays(d.days, G.daily);
    const streak = streakOf(d.days, G.daily); d.longest = Math.max(d.longest, streak); saveDaily(d);
    daily = { key: G.daily, best: r.best, newBest: prev > 0 && c.score > prev, plays: r.plays, streak };
  }
  const ids = newlyEarned(st.earned, st, L, { difficulty: diff, streak: daily ? daily.streak : 0, daily: !!G.daily, finished: true });
  for (const id of ids) { st.earned[id] = todayKey(); toastQ.push(id); }
  saveStats(st);
  const rank = rankOf(st.score);
  const res = { score: c.score, diff, newBest: prevBest > 0 && c.score > prevBest, best: st.best[diff], rank, rankUp: rank.i > before.i, daily, earned: [...(G.earnedNow || []), ...ids] };
  if (ids.length && !toastTimer) pumpToast();
  return res;
}

function gameOverFlow(c) {
  clearResume();
  startMusic('results'); musicIntensity(0);
  const res = recordGame(c);
  overTimer = setTimeout(() => {
    if (qualifies(c.score)) screens.entry(c.score, (ini) => { const i = addScore(ini, c.score, c.difficulty); screens.scores('over', i); }, res);
    else screens.over(c.score, c.match, c.won, res);
  }, TEST ? 50 : 2600);
}

let renderFails = 0, errorsLogged = 0;
function fatal(msg) {
  const b = $('#boot-error'); b.hidden = false; b.textContent = msg + ' ';
  const r = document.createElement('button'); r.type = 'button'; r.className = 'btn'; r.textContent = 'Reload';
  r.addEventListener('click', () => location.reload());
  b.appendChild(r);
}
const logOnce = (what, e) => { if (errorsLogged++ === 0) console.error('Spa City Pinball: ' + what, e); };
window.addEventListener('error', (e) => logOnce('uncaught error', e.error || e.message));
window.addEventListener('unhandledrejection', (e) => logOnce('unhandled rejection', e.reason));

const live = $('#live');
// announcements are spoken one at a time, 900 ms apart, and queued (not dropped) when they arrive together
const liveQ = []; let liveTimer = 0;
function announce(text) { liveQ.push(text); if (liveQ.length > 8) liveQ.shift(); if (!liveTimer) pumpLive(); }
function pumpLive() { if (!liveQ.length) { liveTimer = 0; return; } live.textContent = liveQ.shift(); liveTimer = setTimeout(pumpLive, 900); }

// ------------------------------------------------------------------------------------------------- DMD base screen
function dmdBase(d) {
  if (demo) {
    const k = Math.floor(now() / 4) % (ATTRACT_FACTS.length + 2);
    if (k === 0) { d.center('SPA CITY', 2, 2, 3); d.center('PRESS START', 22, 1, Math.floor(now() * 2) % 2 ? 3 : 1); return; }
    if (k === 1) { const s = loadScores()[0]; d.center('HIGH SCORE', 3, 1, 2); d.center(s.initials + ' ' + fmt(s.score), 14, 1, 3); return; }
    const lines = DMD.wrap(FACTS[ATTRACT_FACTS[k - 2]].text, 21);
    lines.forEach((l, i) => d.center(l, 16 - lines.length * 4 + i * 9, 1, 3));
    return;
  }
  if (G.scene === 'bonus' && G.bonus) {
    const b = G.bonus, age = G.t - (b.until - 2.6);
    const idx = Math.min(b.parts.length, Math.floor(age / 0.45));
    if (b.tilted) { d.center('TILT', 4, 2, 3); d.center('NO BONUS', 22, 1, 2); return; }
    if (idx < b.parts.length) { d.center(b.parts[idx][0], 4, 1, 2); d.center(fmt(b.parts[idx][1]), 15, 2, 3); }
    else { d.center('BONUS ' + b.x + 'X', 3, 1, 2); d.center(fmt(b.total), 15, 2, 3); }
    return;
  }
  const p = G.player, s = fmt(p.score);
  d.center(s, 3, s.length <= 10 ? 2 : 1, 3);
  let line = 'BALL ' + p.ball + (p.extraBalls ? ' · EB' : '');
  if (G.mode) line = G.mode.id.toUpperCase() + ' ' + Math.max(0, Math.ceil(G.mode.end - G.t)) + 's · ' + (G.mode.progress | 0) + '/' + G.mode.need;
  else if (G.mb) line = { arlington: 'ARLINGTON MULTIBALL', soak: 'GRAND SOAK', valley: 'VALLEY OF THE VAPORS' }[G.mb.kind];
  else if (G.ball.inLane) line = 'SKILL SHOT: LANE ' + 'SPA'[G.ball.skillLane];
  d.center(line, 23, 1, 2);
}

// ------------------------------------------------------------------------------------------------- loop
function capturePrev() {
  for (const b of G.w.balls) prev.set(b.id, [b.x, b.y, b.z]);
  prev.set('fl', G.w.flippers.map((f) => f.angle));
}
function interpolated(alpha) {
  const pf = prev.get('fl');
  return {
    balls: G.w.balls.filter((b) => !(b.held && b.held.drained)).map((b) => {
      const q = prev.get(b.id) || [b.x, b.y, b.z];
      return { id: b.id, x: q[0] + (b.x - q[0]) * alpha, y: q[1] + (b.y - q[1]) * alpha, z: q[2] + (b.z - q[2]) * alpha, layer: b.layer, roll: b.roll, vx: b.vx, vy: b.vy };
    }),
    flippers: G.w.flippers.map((f, i) => ({ ...f, angle: pf ? pf[i] + (f.angle - pf[i]) * alpha : f.angle })),
  };
}

function frame(ts) {
  requestAnimationFrame(frame);
  frameNo++;
  input.pollPad(ts);
  let dt = Math.min(MAX_DT, (ts - lastNow) / 1000);
  lastNow = ts;
  if (slowUntil && ts > slowUntil) { timeScale = 1; slowUntil = 0; }
  const running = !paused && !(TEST && window.__game.paused);
  if (running) {
    acc += dt * timeScale;
    let n = 0;
    while (acc >= TICK && n < 24) { capturePrev(); if (bot) bot(); tick(G); routeCues(); acc -= TICK; n++; }
    if (n >= 24) acc = 0;
  }
  // the ball's rolling, ramp and rail sound follows the fastest ball; on the low tier it is updated every fourth frame
  if (frameNo % (view && view.tier === 'low' ? 4 : 1) === 0) setRoll(G.w.balls, G.T.width, running && !demo && G.scene === 'game');
  if (frameNo % 20 === 0) mixState();
  coachFrame();
  try { render(Math.min(1, acc / TICK)); renderFails = 0; }
  catch (e) {
    // a throw mid-render leaves the HUD half updated: after 5 in a row say so instead of failing silently
    if (++renderFails === 1) console.error('Spa City Pinball: render failed', e);
    if (renderFails === 5) fatal('Spa City Pinball hit an error and the display stopped updating.');
  }
}

function render(alpha) {
  const t = now();
  const lampOn = lampStates(G, LAMPS, t);
  const interp = interpolated(alpha);
  if (view) view.draw(G, alpha, lampOn, interp, { t, effects, demo, reduced: reducedMotion(), highlight: app.settings.ballGlow, debug: qs.get('debug') === 'physics' });
  while (effects.length && t - effects[0].t > 2) effects.shift();
  dmd.frame(t * 1000, dmdBase);
  // repaint the dot canvas only when a dot changed (4,096 dots is real work on a phone)
  if (!lastDots || lastDots.length !== dmd.buf.length || dmd.buf.some((v, i) => v !== lastDots[i]) || dmdCanvas.width !== lastDmdW) {
    paintDMD(dmdCtx, dmd, dmdCanvas.width, dmdCanvas.height);
    lastDots = dmd.buf.slice(); lastDmdW = dmdCanvas.width;
  }
  // side panel: touch the DOM only when a value changes
  const p = G.player;
  const chip = dmd.cur ? fmt(p.score) : !touchChip() ? '' : G.mode ? `${G.mode.id.toUpperCase()} ${G.mode.progress | 0}/${G.mode.need} · ${Math.max(0, Math.ceil(G.mode.end - G.t))}s` : `Modes ${G.f.modesPlayed.reduce((a, b) => a + b, 0)}/6 · Tower ${G.f.towerLevel}/3`;
  setText('#score', demo ? '' : chip);
  setText('#ballno', demo ? 'Demo' : G.scene === 'over' ? 'Game over' : 'Ball ' + p.ball + ' of ' + p.ballsPerGame);
  setText('#modeline', demo ? '' : G.mode ? `${G.mode.id === 'raid' ? 'Raid! 1967' : G.mode.id[0].toUpperCase() + G.mode.id.slice(1)} · ${G.mode.progress | 0}/${G.mode.need} · ${Math.max(0, Math.ceil(G.mode.end - G.t))}s` : G.mb ? { arlington: 'Arlington Multiball', soak: 'Grand Soak', valley: 'Valley of the Vapors' }[G.mb.kind] : `Modes ${G.f.modesPlayed.reduce((a, b) => a + b, 0)}/6 · Tower ${G.f.towerLevel}/3`);   // fact: raid
  const showLaunch = !demo && !paused && G.w.balls.some((b) => !b.held && b.x > 480 && b.y < 150);
  const mg = demo ? '' : G.f.modesPlayed.map((p, i) => ((G.mode && G.mode.i === i) || (G.mb && G.mb.kind === 'valley') ? 'on' : G.f.modesWon[i] ? 'won' : p ? 'played' : '')).join(',');
  if (mg !== uiCache.mg) { uiCache.mg = mg; const cls = mg.split(','); document.querySelectorAll('#modegrid li').forEach((li, i) => { li.className = cls[i] || ''; }); }
  if (showLaunch !== uiCache.launch) { $('#b-launch').classList.toggle('ready', showLaunch); uiCache.launch = showLaunch; }
  const pw = (G.w.plunger.pull / G.w.plunger.maxPull).toFixed(2);
  if (pw !== uiCache.power) { $('#power').style.setProperty('--p', pw); uiCache.power = pw; }
}

// ------------------------------------------------------------------------------------------------- hooks
window.__game = {
  paused: false,
  slowmo: false,   // tests: let the ball-save slow motion run (it is off under test so timing stays exact)
  seed(n) { G.rng = createGame(T, { seed: n }).rng; G.seedValue = n; return n; },
  getState() {
    const s = gameState(G);
    s.paused = paused || this.paused; s.demo = demo; s.view = view ? view.kind : null; s.tier = view && view.tier ? view.tier : null;
    s.lamps = lampStates(G, LAMPS, now()); s.dmd = { text: dmd.cur ? dmd.cur.text : null, sub: dmd.cur ? dmd.cur.sub : null, queue: dmd.queue.map((q) => q.text) };
    s.screen = screens.current; s.settings = { ...app.settings }; s.reduced = reducedMotion(); s.timeScale = timeScale; s.scores = loadScores(); s.frame = frameNo;
    s.audio = { ctx: !!audio.ctx, state: audio.ctx ? audio.ctx.state : null, hold: audio.hold, played: [...audio.played], pans: { ...audio.pans }, roll: { ...audio.roll }, ...audioNow() };
    return s;
  },
  setState(s) { setGameState(G, s); return true; },
  progress() { return app.progress(); },
  applySettings(o) { app.applySettings(o); return { ...app.settings }; },
  modeInfo() { return view && view.modeInfo ? view.modeInfo() : null; },
  nameInfo() { return view && view.nameInfo ? view.nameInfo() : null; },
  labelInfo() { return view && view.labelInfo ? view.labelInfo() : null; },
  labelLayer() { return !!(view && view.labelInfo && view.labelInfo().length); },
  highlight() { return view && view.highlightInfo ? view.highlightInfo() : null; },
  viewScreen(x, y, h = 0) { return view.toScreen(x, y, h); },
  viewScale(x, y) { const a = view.toScreen(x, y), b = view.toScreen(x + 100, y); return Math.hypot(b[0] - a[0], b[1] - a[1]) / 100; },
  coach() { return { active: coach.active, step: coach.step, text: coach.text, kind: coach.kind, shown: !coachEl.hidden, seen: app.settings.tipsSeen }; },
  setToday(d) { setToday(d); return todayKey(); },
  startDaily() { app.startDaily(); return G.daily; },
  audioList() { return audioList(); },
  audioRender(name, seconds, wantWav, intensity) { return audioRender(name, seconds, wantWav, intensity); },
  cueRender(name, opts) { return cueRender(name, opts); },
  rollRender(seconds, wantWav) { return rollRender(seconds, wantWav); },
  isIdle() { return !loading && (!view || !view.busy || !view.busy()); },
  step(n = 1) { for (let i = 0; i < n; i++) { capturePrev(); if (bot) bot(); tick(G); routeCues(); } mixState(); render(1); return G.w.tick; },
  pause() { this.paused = true; return true; },
  resume() { this.paused = false; lastNow = performance.now(); return true; },
  scene(name) {
    if (name === 'title') { resumeAudio(); screens.title(); startDemo(); }
    else if (name === 'game') { app.start(); }
    else if (name === 'settings') screens.settings('title');
    else if (name === 'help') screens.help('title');
    else if (name === 'scores') screens.scores('title');
    else if (name === 'records') screens.records('title');
    else if (name === 'pause') { if (demo) app.start(); pause(); }
    else if (name === 'over') { if (demo) app.start(); api.endMode(G, false); G.scene = 'over'; screens.over(G.player.score, 0, false); }
    return screens.current || G.scene;
  },
  newGame(o = {}) { if (o.balls) app.settings.balls = o.balls; if (o.difficulty) app.settings.difficulty = o.difficulty; app.start(); if (o.seed != null) { G = createGame(T, { seed: o.seed }); newGame(G, { balls: o.balls || 3, practice: !!o.practice, difficulty: app.settings.difficulty, seed: o.seed }); dmd.queue.length = 0; dmd.cur = null; } return true; },
  act(name, ...a) {
    const w = G.w;
    switch (name) {
      case 'flip': flipper(G, a[0], a[1] !== false); return true;
      case 'flipAt': { const t0 = w.tick * TICK; flipper(G, a[0], true, t0 + a[1] / 1000); flipper(G, a[0], false, t0 + (a[1] + (a[2] || 250)) / 1000); return true; }
      case 'plunge': autoPlunge(w, a[0] ?? 0.85); return true;
      case 'nudge': nudge(G, a[0] || 'up'); return true;
      case 'placeBall': { const b = w.balls.find((q) => !q.held) || addBall(w, 0, 0); Object.assign(b, { x: a[0], y: a[1], px: a[0], py: a[1], vx: a[2] || 0, vy: a[3] || 0, layer: a[4] || LAYER.FIELD, held: null }); prev.set(b.id, [b.x, b.y, b.z]); G.ball.inLane = false; return b.id; }
      case 'addBall': return addBall(w, a[0], a[1], a[2] || 0, a[3] || 0).id;
      case 'clearBalls': for (const b of [...w.balls]) removeBall(w, b); return true;
      case 'clock': renderClock = a[0] == null ? null : a[0] / 1000; return true;
      case 'tier': app.applySettings({ tier: a[0] }); return view ? view.kind + ':' + (view.tier || '') : null;
      case 'mode': api.startMode(G, a[0]); return G.mode && G.mode.id;
      case 'endMode': api.endMode(G, !!a[0]); return !G.mode;
      case 'award': return mystery(G, a[0]);
      case 'lamps': G.lampShow = { name: a[0], until: G.t + (a[1] || 3) }; return true;
      case 'camera': if (view && view.setCamera) view.setCamera(a[0]); return true;
      case 'lampLevel': return view && view.lampLevel ? view.lampLevel(a[0]) : null;
      case 'switch': { const id = G.T.sw[a[0]]; G.w.events.push({ t: a[1] || 'hit', sw: id, speed: 1000, dir: 1, ball: (w.balls[0] || {}).id, x: a[2] }); return id; }
      case 'multiball': (api[{ arlington: 'startArlington', soak: 'startGrandSoak', valley: 'startValley' }[a[0]]])(G); return true;
      case 'demo': if (a[0]) { screens.close(); startDemo(); } return demo;
    }
    return false;
  },
};

// ------------------------------------------------------------------------------------------------- boot
(async function boot() {
  try {
    clockBase = performance.now();
    document.documentElement.style.setProperty('--text-scale', app.settings.textScale);
    document.body.classList.toggle('reduced', reducedMotion());
    setVolumes({ sound: app.settings.sound, music: app.settings.music, ambience: app.settings.ambience, volume: app.settings.volume });
    startLoads();   // the downloads start now and run while the title is built (upgradeTo3D joins them)
    try { dmd.art = makeSilhouettes(); } catch { /* optional */ }
    initView2D();
    startDemo();
    screens.title();
    lastNow = performance.now();
    requestAnimationFrame((ts) => {
      frame(ts);   // the first frame is drawn under the loading card, then the card goes: the title is usable from here
      window.__bootMs = window.__titleMs = Math.round(performance.now());
      $('#boot').hidden = true;
    });
    await upgradeTo3D();
    loading = false;
    window.__readyMs = Math.round(performance.now());
  } catch (e) {
    $('#boot').hidden = true;
    const b = $('#boot-error'); b.hidden = false; b.textContent = 'Spa City Pinball could not start: ' + e.message;
    throw e;
  }
})();

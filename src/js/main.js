// Spa City Pinball: app controller. Fixed-step loop with interpolation, input timing, cue routing (DMD, audio,
// lamps, effects), screens, saves and the window.__game test hooks.
import { compileTable } from './sim/table.js';
import { spec } from './sim/table-spa-city.js';
import { TICK, autoPlunge, addBall, LAYER, removeBall } from './sim/physics.js';
import { createGame, newGame, tick, flipper, plunger, nudge, gameState, setGameState, mystery, api } from './sim/rules.js';
import { createBot } from './sim/bot.js';
import { buildLamps, lampStates } from './sim/lamps.js';
import { FACTS, ATTRACT_FACTS } from './sim/facts.js';
import { DMD, paintDMD, makeSilhouettes } from './ui/dmd.js';
import { createInput } from './ui/input.js';
import { createScreens } from './ui/screens.js';
import { audio, unlock, sfx, setVolumes, startMusic } from './ui/audio.js';
import { store, loadSettings, saveSettings, loadScores, qualifies, addScore } from './save.js';
import { createView2D } from './gfx/view2d.js';
import { createView3D, probeGL } from './gfx/view3d.js';

const $ = (s) => document.querySelector(s);
const qs = new URLSearchParams(location.search);
const TEST = !!window.__TEST__;
const T = compileTable(spec);
const LAMPS = buildLamps();
const fmt = (n) => Number(n).toLocaleString('en-US');

const app = {
  settings: loadSettings(),
  touch: matchMedia('(pointer: coarse)').matches,
  sfx: (n) => sfx(n),
  scores: () => loadScores(),
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

async function initView() {
  view2d = createView2D(canvas2D, T, LAMPS);
  const want = qs.get('tier') || app.settings.tier;
  if (want !== '2d' && !window.THREE) await loadScript('vendor/three-r186.min.js');
  if (want !== '2d' && probeGL()) {
    try { view = await createView3D(canvasGL, T, LAMPS, { tier: want, reducedMotion }); } catch (e) { console.warn('3D view failed, using 2D', e); view = null; }
  }
  if (!view) view = view2d;
  // the governor's last step: software GL still too slow at Low → the flat 2D table
  if (view.kind === '3d') view.onTooSlow = () => { if (app.settings.tier === 'auto') { view.hide(); view = view2d; document.body.dataset.view = '2d'; } };
  document.body.dataset.view = view.kind;
  resize();
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
  startMusic('title');
}

app.start = () => {
  unlock();
  demo = false; bot = null; paused = false;
  G = createGame(T, { seed: TEST ? 1 : (Date.now() & 0xffffff) });
  newGame(G, { balls: app.settings.balls, practice: app.settings.practice });
  dmd.queue.length = 0; dmd.cur = null;   // a new game starts with a clean display
  screens.close();
  document.body.dataset.scene = 'game';
  startMusic('main');
  clearTimeout(overTimer);
  tableEl.focus({ preventScroll: true });
};
app.resume = () => { paused = false; screens.close(); document.body.dataset.scene = demo ? 'title' : 'game'; lastNow = performance.now(); };
app.quit = () => { paused = false; screens.title(); startDemo(); };
app.applySettings = (s) => {
  const tierChanged = s.tier && s.tier !== app.settings.tier;
  Object.assign(app.settings, s);
  saveSettings(app.settings);
  setVolumes({ sound: app.settings.sound, music: app.settings.music, volume: app.settings.volume });
  document.documentElement.style.setProperty('--text-scale', app.settings.textScale);
  document.body.classList.toggle('reduced', reducedMotion());
  if (tierChanged && view && view.kind === '3d') { if (s.tier === '2d') { view.hide(); view = view2d; } else view.setTier(s.tier); }
  else if (tierChanged && view === view2d && s.tier !== '2d') initView();
  document.body.dataset.view = view ? view.kind : '2d';
};
function pause() {
  if (demo || paused) return;
  paused = true;
  // keys released while paused never reach the game, so let go of everything now
  G.w.pending.length = 0;   // a flip queued for a later substep must not fire after the release
  flipper(G, 'L', false); flipper(G, 'R', false); plunger(G, false);
  screens.pause(); document.body.dataset.scene = 'pause';
}

// ------------------------------------------------------------------------------------------------- input
function simTimeFor(ts) {
  const now = G.w.tick * TICK;
  const t = now + acc + Math.max(0, (ts - lastNow) / 1000) * timeScale;
  return Math.max(now, t);
}
const input = createInput(tableEl, {
  wantsKeys(a) { return !screens.current || screens.current === 'entry' || a === 'pause'; },
  touchActive() { return !screens.current && !paused; },
  action(a, down, ts, src) {
    unlock();
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
    if (a === 'flipL' || a === 'flipR') flipper(G, a === 'flipL' ? 'L' : 'R', down, simTimeFor(ts));
    else if (a === 'plunge') plunger(G, down);
    else if (down && a.startsWith('nudge')) { nudge(G, { nudgeL: 'left', nudgeR: 'right', nudgeU: 'up' }[a]); if (!reducedMotion()) effects.push({ k: 'shake', dir: a, t: now() }); }
  },
});
// on-screen buttons
$('#b-launch').addEventListener('pointerdown', (e) => { unlock(); if (!demo && !paused) plunger(G, true); e.preventDefault(); });
const releaseLaunch = (e) => { if (!demo && !paused) plunger(G, false); };
$('#b-launch').addEventListener('pointerup', releaseLaunch);
$('#b-launch').addEventListener('pointerleave', releaseLaunch);
$('#b-menu').addEventListener('click', () => { unlock(); if (demo) screens.title(); else pause(); });

const screens = createScreens($('#screens'), app);

// ------------------------------------------------------------------------------------------------- cues
function now() { return renderClock != null ? renderClock : (performance.now() - clockBase) / 1000; }

function routeCues() {
  for (const c of G.cues) {
    switch (c.k) {
      case 'dmd': if (!demo || c.prio >= 3) dmd.push(c); if (!demo) announce(c.text + (c.sub ? '. ' + c.sub : '')); break;
      case 'sound': if (!demo) sfx(c.name, c.v); break;
      case 'flash': case 'steam': case 'spin': case 'kick': effects.push({ ...c, t: now() }); break;
      case 'slowmo': if (!reducedMotion() && !TEST) { timeScale = 0.35; slowUntil = performance.now() + 500; } break;
      case 'mode': if (!demo) startMusic(G.mb ? 'multiball' : c.on ? 'mode' : 'main'); break;
      case 'mb': if (!demo) startMusic(c.on ? 'multiball' : (G.mode ? 'mode' : 'main')); break;
      case 'over': if (!demo) gameOverFlow(c); else setTimeout(() => demo && startDemo(), 1500); break;
      case 'tilt': effects.push({ k: 'tilt', t: now() }); break;
    }
  }
  G.cues.length = 0;
}

function gameOverFlow(c) {
  startMusic('title');
  overTimer = setTimeout(() => {
    if (qualifies(c.score)) screens.entry(c.score, (ini) => { const i = addScore(ini, c.score); screens.scores('over', i); });
    else screens.over(c.score, c.match, c.won);
  }, TEST ? 50 : 2600);
}

const live = $('#live');
let lastAnnounce = 0;
function announce(text) { const t = performance.now(); if (t - lastAnnounce < 900) return; lastAnnounce = t; live.textContent = text; }

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
  let dt = Math.min(0.1, (ts - lastNow) / 1000);
  lastNow = ts;
  if (slowUntil && ts > slowUntil) { timeScale = 1; slowUntil = 0; }
  if (!paused && !(TEST && window.__game.paused)) {
    acc += dt * timeScale;
    let n = 0;
    while (acc >= TICK && n < 24) { capturePrev(); if (bot) bot(); tick(G); routeCues(); acc -= TICK; n++; }
    if (n >= 24) acc = 0;
  }
  render(Math.min(1, acc / TICK));
}

function render(alpha) {
  const t = now();
  const lampOn = lampStates(G, LAMPS, t);
  const interp = interpolated(alpha);
  if (view) view.draw(G, alpha, lampOn, interp, { t, effects, demo, reduced: reducedMotion(), debug: qs.get('debug') === 'physics' });
  while (effects.length && t - effects[0].t > 2) effects.shift();
  dmd.frame(t * 1000, dmdBase);
  // repaint the dot canvas only when a dot changed (4,096 dots is real work on a phone)
  if (!lastDots || lastDots.length !== dmd.buf.length || dmd.buf.some((v, i) => v !== lastDots[i]) || dmdCanvas.width !== lastDmdW) {
    paintDMD(dmdCtx, dmd, dmdCanvas.width, dmdCanvas.height);
    lastDots = dmd.buf.slice(); lastDmdW = dmdCanvas.width;
  }
  // side panel: touch the DOM only when a value changes
  const p = G.player;
  const chip = dmd.cur ? fmt(p.score) : touchChip() ? `Modes ${G.f.modesPlayed.reduce((a, b) => a + b, 0)}/6 · Tower ${G.f.towerLevel}/3` : '';
  setText('#score', demo ? '' : chip);
  setText('#ballno', demo ? 'Demo' : G.scene === 'over' ? 'Game over' : 'Ball ' + p.ball + ' of ' + p.ballsPerGame);
  setText('#modeline', demo ? '' : G.mode ? `${G.mode.id === 'raid' ? 'Raid! 1967' : G.mode.id[0].toUpperCase() + G.mode.id.slice(1)} · ${G.mode.progress | 0}/${G.mode.need} · ${Math.max(0, Math.ceil(G.mode.end - G.t))}s` : G.mb ? { arlington: 'Arlington Multiball', soak: 'Grand Soak', valley: 'Valley of the Vapors' }[G.mb.kind] : `Modes ${G.f.modesPlayed.reduce((a, b) => a + b, 0)}/6 · Tower ${G.f.towerLevel}/3`);   // fact: raid
  const showLaunch = !demo && !paused && G.w.balls.some((b) => !b.held && b.x > 480 && b.y < 150);
  if (showLaunch !== uiCache.launch) { $('#b-launch').classList.toggle('ready', showLaunch); uiCache.launch = showLaunch; }
  const pw = (G.w.plunger.pull / G.w.plunger.maxPull).toFixed(2);
  if (pw !== uiCache.power) { $('#power').style.setProperty('--p', pw); uiCache.power = pw; }
}

// ------------------------------------------------------------------------------------------------- hooks
window.__game = {
  paused: false,
  seed(n) { G.rng = createGame(T, { seed: n }).rng; G.seedValue = n; return n; },
  getState() {
    const s = gameState(G);
    s.paused = paused || this.paused; s.demo = demo; s.view = view ? view.kind : null; s.tier = view && view.tier ? view.tier : null;
    s.lamps = lampStates(G, LAMPS, now()); s.dmd = { text: dmd.cur ? dmd.cur.text : null, sub: dmd.cur ? dmd.cur.sub : null, queue: dmd.queue.map((q) => q.text) };
    s.screen = screens.current; s.settings = { ...app.settings }; s.reduced = reducedMotion(); s.timeScale = timeScale; s.scores = loadScores(); s.frame = frameNo;
    s.audio = { ctx: !!audio.ctx, played: [...audio.played] };
    return s;
  },
  setState(s) { setGameState(G, s); return true; },
  isIdle() { return !loading && (!view || !view.busy || !view.busy()); },
  step(n = 1) { for (let i = 0; i < n; i++) { capturePrev(); if (bot) bot(); tick(G); routeCues(); } render(1); return G.w.tick; },
  pause() { this.paused = true; return true; },
  resume() { this.paused = false; lastNow = performance.now(); return true; },
  scene(name) {
    if (name === 'title') { screens.title(); startDemo(); }
    else if (name === 'game') { app.start(); }
    else if (name === 'settings') screens.settings('title');
    else if (name === 'help') screens.help('title');
    else if (name === 'scores') screens.scores('title');
    else if (name === 'pause') { if (demo) app.start(); pause(); }
    else if (name === 'over') { if (demo) app.start(); api.endMode(G, false); G.scene = 'over'; screens.over(G.player.score, 0, false); }
    return screens.current || G.scene;
  },
  newGame(o = {}) { if (o.balls) app.settings.balls = o.balls; app.start(); if (o.seed != null) { G = createGame(T, { seed: o.seed }); newGame(G, { balls: o.balls || 3, practice: !!o.practice, seed: o.seed }); dmd.queue.length = 0; dmd.cur = null; } return true; },
  act(name, ...a) {
    const w = G.w;
    switch (name) {
      case 'flip': flipper(G, a[0], a[1] !== false); return true;
      case 'flipAt': { const t0 = w.tick * TICK; flipper(G, a[0], true, t0 + a[1] / 1000); flipper(G, a[0], false, t0 + (a[1] + (a[2] || 250)) / 1000); return true; }
      case 'plunge': autoPlunge(w, a[0] ?? 0.85); return true;
      case 'nudge': nudge(G, a[0] || 'up'); return true;
      case 'placeBall': { const b = w.balls.find((q) => !q.held) || addBall(w, 0, 0); Object.assign(b, { x: a[0], y: a[1], px: a[0], py: a[1], vx: a[2] || 0, vy: a[3] || 0, layer: a[4] || LAYER.FIELD, held: null }); G.ball.inLane = false; return b.id; }
      case 'addBall': return addBall(w, a[0], a[1], a[2] || 0, a[3] || 0).id;
      case 'clearBalls': for (const b of [...w.balls]) removeBall(w, b); return true;
      case 'clock': renderClock = a[0] == null ? null : a[0] / 1000; return true;
      case 'tier': app.applySettings({ tier: a[0] }); return view ? view.kind + ':' + (view.tier || '') : null;
      case 'mode': api.startMode(G, a[0]); return G.mode && G.mode.id;
      case 'award': return mystery(G, a[0]);
      case 'lamps': G.lampShow = { name: a[0], until: G.t + (a[1] || 3) }; return true;
      case 'camera': if (view && view.setCamera) view.setCamera(a[0]); return true;
      case 'switch': { const id = G.T.sw[a[0]]; G.w.events.push({ t: a[1] || 'hit', sw: id, speed: 1000, dir: 1, ball: (w.balls[0] || {}).id }); return id; }
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
    setVolumes({ sound: app.settings.sound, music: app.settings.music, volume: app.settings.volume });
    const packs = typeof PB_ASSETS !== 'undefined' ? PB_ASSETS : [];
    await Promise.all(packs.map((f) => loadScript('assets/' + f)));
    if (window.__PB_ART && window.__PB_ART.backglass) $('.glass-art').style.backgroundImage = `url(${window.__PB_ART.backglass})`;
    try { dmd.art = makeSilhouettes(); } catch { /* optional */ }
    await initView();
    startDemo();
    screens.title();
    loading = false;
    window.__bootMs = Math.round(performance.now());
    lastNow = performance.now();
    requestAnimationFrame(frame);
  } catch (e) {
    const b = $('#boot-error'); b.hidden = false; b.textContent = 'Spa City Pinball could not start: ' + e.message;
    throw e;
  }
})();

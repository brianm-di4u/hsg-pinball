// WebAudio synthesis for every sound and the music (collection rule: no sample files). Pattern from
// hsg-property-game audio.js (tone, noise, unlock on the first gesture), grown into a small mixer: SFX and music
// buses through a compressor, a generated room reverb, rate limiting so a bumper frenzy never clips. The music
// (six jazz pieces of 24 to 32 bars) and the ambience beds are played by the collection's audio kit (audiokit.js)
// from the scores and scenes in music.js, on their own buses under the same master and compressor.
import { makeAudioKit, measureAudio } from './audiokit.js';
import { SCORES, SCENES, AMBIENCE_FOR, MUSIC_LEVEL, AMBIENCE_LEVEL } from './music.js';

export const audio = { ctx: null, on: true, music: true, ambience: true, vol: 0.8, played: [], last: {}, scene: null, mode: null, hold: false, kit: null, intensity: 0, params: {} };

let master, sfxBus, verb, noiseBuf;
// music and ambience obey the sound switch as well as their own
const musicOn = () => audio.on && audio.music;
const ambOn = () => audio.on && audio.ambience;

export function unlock() {
  if (audio.ctx) { if (audio.ctx.state === 'suspended' && !audio.hold) audio.ctx.resume(); return; }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = (audio.ctx = new AC());
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    master = c.createGain(); master.gain.value = audio.vol;
    master.connect(comp).connect(c.destination);
    sfxBus = c.createGain(); sfxBus.gain.value = audio.on ? 0.9 : 0; sfxBus.connect(master);
    // a short generated room impulse for a little space
    const len = Math.floor(c.sampleRate * 0.9), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb = c.createConvolver(); verb.buffer = ir;
    const wet = c.createGain(); wet.gain.value = 0.18; verb.connect(wet).connect(master);
    const n = c.sampleRate; noiseBuf = c.createBuffer(1, n, n);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    audio.kit = makeAudioKit(c, master, { seed: (Math.random() * 0xffffff) | 0, music: musicOn() ? MUSIC_LEVEL : 0, ambience: ambOn() ? AMBIENCE_LEVEL : 0 });
    if (audio.hold) { audio.kit.hold(); c.suspend(); }
    if (audio.scene) startMusic(audio.scene, audio.mode);
  } catch { audio.ctx = null; }
}

// browsers only allow audio after a gesture: the first tap, click or key anywhere starts it (touchend, not touchstart, for iOS)
if (typeof window !== 'undefined' && window.addEventListener) {
  const first = () => {
    unlock();
    if (audio.ctx && audio.ctx.state === 'running') for (const e of ['pointerdown', 'keydown', 'touchend']) window.removeEventListener(e, first, true);
  };
  for (const e of ['pointerdown', 'keydown', 'touchend']) window.addEventListener(e, first, true);
}

// silence while paused or hidden: the kit fades its buses and a suspended context stops the clock it schedules
// from, so nothing is lost or queued
export function suspendAudio() {
  audio.hold = true;
  if (audio.kit) audio.kit.hold();
  if (audio.ctx && audio.ctx.state === 'running') audio.ctx.suspend();
}
export function resumeAudio() {
  audio.hold = false;
  if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
  if (audio.kit) audio.kit.release();
}

export function setVolumes({ sound = audio.on, music = audio.music, ambience = audio.ambience, volume = audio.vol } = {}) {
  audio.on = sound; audio.music = music; audio.ambience = ambience; audio.vol = volume;
  if (!audio.ctx) return;
  const t = audio.ctx.currentTime;
  master.gain.setTargetAtTime(volume, t, 0.05);
  sfxBus.gain.setTargetAtTime(sound ? 0.9 : 0, t, 0.05);
  audio.kit.music.level(musicOn() ? MUSIC_LEVEL : 0); audio.kit.amb.level(ambOn() ? AMBIENCE_LEVEL : 0);
  startMusic(audio.scene, audio.mode);   // plays or stops the pieces for the new switches: nothing is scheduled for a muted bus
}

function env(g, t0, a, peak, dur) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
}
function tone(f, t0, dur, type = 'sine', g = 0.3, slide = 0, bus = sfxBus, wet = 0) {
  const c = audio.ctx, o = c.createOscillator(), a = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t0 + dur);
  env(a, t0, 0.005, g, dur);
  o.connect(a).connect(bus); if (wet) a.connect(verb);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
function noise(t0, dur, g = 0.2, freq = 800, type = 'highpass', q = 0.7, bus = sfxBus, wet = 0) {
  const c = audio.ctx, src = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
  src.buffer = noiseBuf; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q;
  env(a, t0, 0.003, g, dur);
  src.connect(f).connect(a).connect(bus); if (wet) a.connect(verb);
  src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
}
const thunk = (t, f = 90, g = 0.35) => { tone(f, t, 0.09, 'sine', g, -40); noise(t, 0.04, g * 0.5, 1200, 'bandpass', 1.2); };

const BIG = new Set(['jackpot', 'superJackpot', 'skill', 'complete', 'modeWon', 'extraBall', 'multiball', 'wizard', 'boil', 'gameOver', 'start']);
const LIMIT = { bumper: 0.045, wall: 0.03, spinner: 0.025, switch: 0.03, rollover: 0.04, target: 0.04, clack: 0.04, flipHit: 0.03 };

export function sfx(name, v = 1) {
  audio.played.push(name); if (audio.played.length > 40) audio.played.shift();
  if (!audio.ctx || !audio.on || audio.hold) return;
  const t = audio.ctx.currentTime;
  if (LIMIT[name] && t - (audio.last[name] || 0) < LIMIT[name]) return;
  audio.last[name] = t;
  v = Math.max(0.15, Math.min(1, v));
  if (BIG.has(name) && audio.kit) audio.kit.music.duck(6, 400);
  try {
    switch (name) {
      case 'flip': thunk(t, 110, 0.32); noise(t, 0.03, 0.12, 3000); break;
      case 'flipDown': tone(70, t, 0.06, 'sine', 0.12, -20); break;
      case 'flipStop': noise(t, 0.02, 0.08, 2500); break;
      case 'flipHit': tone(180 + 120 * v, t, 0.05, 'triangle', 0.16 * v); break;
      case 'bumper': thunk(t, 80, 0.4); tone(523 + Math.random() * 30, t + 0.01, 0.25, 'triangle', 0.12, 0, sfxBus, 1); noise(t + 0.02, 0.3, 0.05, 2500, 'highpass', 0.7, sfxBus, 1); break;
      case 'sling': thunk(t, 95, 0.38); tone(330, t, 0.07, 'square', 0.06); break;
      case 'wall': tone(140 + 200 * v, t, 0.04, 'triangle', 0.10 * v); noise(t, 0.02, 0.06 * v, 2000); break;
      case 'clack': tone(1800, t, 0.03, 'square', 0.08 * v); noise(t, 0.02, 0.1 * v, 4000); break;
      case 'rollover': tone(1046, t, 0.05, 'square', 0.07); tone(1568, t + 0.04, 0.06, 'square', 0.05); break;
      case 'target': thunk(t, 160, 0.25); tone(880, t, 0.08, 'triangle', 0.12); break;
      case 'spinner': for (let k = 0; k < Math.round(3 + v * 8); k++) tone(1400 - k * 40, t + k * 0.035, 0.02, 'square', 0.05); break;
      case 'switch': tone(1200, t, 0.025, 'square', 0.05); break;
      case 'outlane': [392, 330, 262].forEach((f, k) => tone(f, t + k * 0.08, 0.12, 'square', 0.08)); break;
      case 'rampEnter': noise(t, 0.35, 0.08, 300, 'lowpass', 1); break;
      case 'rampMade': [523, 659, 784, 1047].forEach((f, k) => tone(f, t + k * 0.06, 0.14, 'triangle', 0.14, 0, sfxBus, 1)); break;
      case 'wireDrop': tone(2200, t, 0.06, 'triangle', 0.06); noise(t, 0.08, 0.06, 3500); break;
      case 'orbit': tone(392, t, 0.12, 'sawtooth', 0.06, 400); tone(587, t + 0.1, 0.14, 'triangle', 0.1, 0, sfxBus, 1); break;
      case 'saucer': thunk(t, 70, 0.4); noise(t, 0.12, 0.08, 500, 'lowpass'); break;
      case 'kick': thunk(t, 85, 0.45); break;
      case 'plunger': noise(t, 0.08, 0.15, 900, 'bandpass', 1); thunk(t, 60, 0.3); break;
      case 'plungerHit': tone(55, t, 0.08, 'sine', 0.2); break;
      case 'launch': noise(t, 0.4, 0.05, 400, 'lowpass', 1); break;
      case 'drain': tone(196, t, 0.5, 'sawtooth', 0.08, -120); tone(98, t, 0.6, 'sine', 0.18, -40); break;
      case 'save': [784, 988, 1175].forEach((f, k) => tone(f, t + k * 0.07, 0.16, 'triangle', 0.13, 0, sfxBus, 1)); break;
      case 'skill': case 'jackpot': [523, 659, 784, 1047, 1319].forEach((f, k) => tone(f, t + k * 0.07, 0.25, 'square', 0.09, 0, sfxBus, 1)); break;
      case 'superJackpot': for (let k = 0; k < 10; k++) tone(523 * Math.pow(2, (k % 5) / 4), t + k * 0.08, 0.22, 'square', 0.09, 0, sfxBus, 1); break;
      case 'spa': [659, 784, 988].forEach((f, k) => tone(f, t + k * 0.09, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
      case 'boil': for (let k = 0; k < 12; k++) tone(300 + Math.random() * 600, t + k * 0.05, 0.08, 'sine', 0.07, 200); noise(t, 1.0, 0.07, 1500, 'highpass', 0.7, sfxBus, 1); break;
      case 'complete': case 'modeWon': [523, 659, 784, 659, 784, 1047].forEach((f, k) => tone(f, t + k * 0.1, 0.22, 'triangle', 0.14, 0, sfxBus, 1)); break;
      case 'modeStart': [392, 523, 659, 784].forEach((f, k) => tone(f, t + k * 0.12, 0.3, 'sawtooth', 0.07, 0, sfxBus, 1)); thunk(t, 60, 0.3); break;
      case 'modeHit': tone(880, t, 0.1, 'square', 0.09); tone(1320, t + 0.06, 0.14, 'square', 0.08); break;
      case 'modeEnd': [523, 440, 349].forEach((f, k) => tone(f, t + k * 0.12, 0.2, 'triangle', 0.1)); break;
      case 'hurry': for (let k = 0; k < 6; k++) tone(k % 2 ? 880 : 660, t + k * 0.1, 0.09, 'square', 0.08); break;
      case 'towerUp': [392, 494, 587, 784].forEach((f, k) => tone(f, t + k * 0.08, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
      case 'lock': thunk(t, 70, 0.4); [262, 392, 523].forEach((f, k) => tone(f, t + 0.1 + k * 0.1, 0.25, 'sawtooth', 0.07, 0, sfxBus, 1)); break;
      case 'multiball': case 'wizard': for (let k = 0; k < 8; k++) tone([262, 330, 392, 523][k % 4] * (k > 3 ? 2 : 1), t + k * 0.09, 0.28, 'sawtooth', 0.08, 0, sfxBus, 1); break;
      case 'reels': for (let k = 0; k < 14; k++) tone(900 + (k % 3) * 120, t + k * 0.05, 0.03, 'square', 0.05); thunk(t + 0.5, 120, 0.2); thunk(t + 0.75, 120, 0.2); thunk(t + 1.0, 120, 0.2); break;
      case 'extraBall': case 'shootAgain': case 'ebLit': [523, 784, 1047, 1568].forEach((f, k) => tone(f, t + k * 0.1, 0.3, 'triangle', 0.13, 0, sfxBus, 1)); break;
      case 'combo': tone(659, t, 0.1, 'square', 0.08); tone(988, t + 0.07, 0.15, 'square', 0.08); break;
      case 'bonus': for (let k = 0; k < 10; k++) tone(440 + k * 44, t + k * 0.12, 0.06, 'square', 0.06); break;
      case 'nudge': noise(t, 0.08, 0.18, 200, 'lowpass', 1); break;
      case 'warning': tone(220, t, 0.25, 'square', 0.1); tone(220, t + 0.3, 0.25, 'square', 0.1); break;
      case 'tilt': tone(110, t, 1.2, 'sawtooth', 0.12, -50); break;
      case 'start': [262, 330, 392, 523, 392, 523].forEach((f, k) => tone(f, t + k * 0.09, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
      case 'gameOver': [392, 349, 330, 262].forEach((f, k) => tone(f, t + k * 0.22, 0.4, 'triangle', 0.12, 0, sfxBus, 1)); break;
      case 'ui': tone(880, t, 0.04, 'triangle', 0.08); break;
      case 'uiBack': tone(520, t, 0.05, 'triangle', 0.08); break;
    }
  } catch { /* audio is optional */ }
}

// ------------------------------------------------------------------------------------------------- music
// startMusic(name, mode): name is a piece in SCORES; the ambience follows it (a mode asks for its own bed).
// A switch that is off plays nothing: no node is made for a muted bus.
export function startMusic(name, mode = null) {
  audio.scene = name; audio.mode = mode;
  const k = audio.kit;
  if (!k || !audio.ctx) return;
  if (musicOn() && SCORES[name]) k.music.play(SCORES[name], { fade: 1.6 }); else k.music.stop(1);
  const amb = AMBIENCE_FOR[mode && AMBIENCE_FOR['mode:' + mode] ? 'mode:' + mode : name];
  if (ambOn() && SCENES[amb]) k.amb.play(SCENES[amb], { fade: 2.5 }); else k.amb.stop(1.5);
  if (k.music.score || k.amb.scene) { k.scheduleUntil(audio.ctx.currentTime + 0.25); k.start(); } else k.stop();   // the first bar is scheduled now, not on the next timer tick
}
export function stopMusic() { audio.scene = null; audio.mode = null; if (audio.kit) { audio.kit.music.stop(1); audio.kit.amb.stop(1.5); audio.kit.stop(); } }
// state the music follows: 0 (a quiet table) to 1 (hurry-up, last seconds, the wizard): the rhythm section and lead lift
export function musicIntensity(x) { audio.intensity = x; if (audio.kit) audio.kit.music.intensity(x); }
// a quantity the ambience follows (steam from the spring temperature, the crowd from the race), 0..1
export function ambienceParam(name, v) { v = Math.max(0, Math.min(1, v)); audio.params[name] = +v.toFixed(3); if (audio.kit) audio.kit.amb.set(name, v); }

// ------------------------------------------------------------------------------------------------- test hooks
// what is playing, for the tests: the piece and bed by name, the levels the buses were told, and the bars scheduled so far
export function audioNow() {
  const k = audio.kit, name = (table, v) => Object.keys(table).find((n) => table[n] === v) || null;
  return {
    scene: audio.scene, mode: audio.mode, intensity: audio.intensity, held: !!(k && k.held),
    music: k ? name(SCORES, k.music.score) : null, ambience: k ? name(SCENES, k.amb.scene) : null,
    musicLevel: musicOn() ? MUSIC_LEVEL : 0, ambienceLevel: ambOn() ? AMBIENCE_LEVEL : 0,
    ambienceParams: { ...audio.params },
    bars: k && k.music.info() ? k.music.info().bars : 0,
  };
}
export function audioList() { return { music: Object.keys(SCORES), ambience: Object.keys(SCENES) }; }
// Renders one piece or scene by itself at the level the game ships (default volume, the same compressor) on an
// OfflineAudioContext and measures it. It never touches the live audio or the settings.
export function audioRender(name, seconds = 60, wav = false, intensity = 0) {
  const music = SCORES[name], scene = SCENES[name];
  if (!music && !scene) return Promise.reject(new Error('unknown piece: ' + name));
  return measureAudio((oc, dest) => {
    const m = oc.createGain(); m.gain.value = 0.8;
    const comp = oc.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    m.connect(comp).connect(dest);
    const kit = makeAudioKit(oc, m, { seed: 7, music: MUSIC_LEVEL, ambience: AMBIENCE_LEVEL });
    if (music) { kit.music.intensity(intensity); kit.music.play(music, { at: 0, fade: 0.02 }); }
    else { kit.amb.set('steam', intensity); kit.amb.set('crowd', intensity); kit.amb.play(scene, { at: 0, fade: 0.02 }); }
    kit.scheduleUntil(seconds);
    return () => (music ? { ...kit.music.info(), formSeconds: +(kit.music.info().formBars * 240 / music.bpm).toFixed(1) } : null);
  }, seconds, { wav });
}

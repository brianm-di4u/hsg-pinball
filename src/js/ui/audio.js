// WebAudio synthesis for every sound and the music (collection rule: no sample files). Pattern from
// hsg-property-game audio.js (tone, noise, unlock on the first gesture), grown into a small mixer: SFX and music
// buses through a compressor, a generated room reverb, rate limiting so a bumper frenzy never clips. The music
// (six jazz pieces of 24 to 32 bars) and the ambience beds are played by the collection's audio kit (audiokit.js)
// from the scores and scenes in music.js, on their own buses under the same master and compressor.
import { makeAudioKit, measureAudio } from './audiokit.js';
import { SCORES, SCENES, AMBIENCE_FOR, MUSIC_LEVEL, AMBIENCE_LEVEL } from './music.js';

export const audio = { ctx: null, on: true, music: true, ambience: true, vol: 0.8, sfxVol: 1, musicVol: 1, muted: false, played: [], demoPlayed: [], last: {}, scene: null, mode: null, hold: false, kit: null, intensity: 0, params: {}, pans: {}, roll: { n: 0, fs: 0, ts: 0, layer: 0, pan: 0 }, charge: { n: 0, p: 0, hz: 0 } };

let master, sfxBus, verb, noiseBuf;
// cx is the context the cue synthesis builds on (the live one, or an offline one while a cue is rendered for a test);
// dst is where the current cue's dry sound goes: the sfx bus, or a stereo panner in front of it
let cx = null, dst = null, roll = null, quiet = false;   // quiet: the cue being built is the attract demo's, so it has no reverb send
// music and ambience obey the sound switch as well as their own
// Sound effects, Music and Ambience are three separate switches. Music never depended on the effects switch: a player
// who turns the effects off keeps the music, as before the ambience was added.
const musicOn = () => audio.music;
// the bus levels the settings give: the Effects and Music sliders scale what the switches allow; a mute (the M key, the speaker button) closes the master for the session
const SFX_LEVEL = 1.1;   // the effects bus with its slider at the maximum (was 0.9, S5-14: the table's cues sat near -14 dBFS, quiet beside other audio)
const DEFAULT_VOLUME = 0.8;   // the master volume a new player starts with
const sfxLevel = () => (audio.on ? SFX_LEVEL * audio.sfxVol : 0);
const musicLevel = () => (musicOn() ? MUSIC_LEVEL * audio.musicVol : 0);
const masterLevel = () => (audio.muted ? 0 : audio.vol);
const ambOn = () => audio.ambience;

// The master volume and the compressor in front of the speakers, on any context: the live one, or an offline one that renders a
// piece or a cue for a test. vol is the master volume (the Volume slider; 0.8 by default, 1 at its maximum).
const SOFT_KNEE = 0.55, SOFT_CEIL = 0.9;   // below the knee the sound is untouched; above it, it tends to the ceiling
let softCurve = null;
function softCeiling() {
  if (softCurve) return softCurve;
  const n = 2049, k = new Float32Array(n), room = SOFT_CEIL - SOFT_KNEE;
  // a waveshaper maps inputs of -1 to 1 across its curve; anything louder is held at the last value
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x); k[i] = Math.sign(x) * (a <= SOFT_KNEE ? a : SOFT_KNEE + room * Math.tanh((a - SOFT_KNEE) / room)); }
  return (softCurve = k);
}
function masterChain(c, dest, vol) {
  const m = c.createGain(); m.gain.value = vol;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
  // a soft ceiling after it: a waveshaper that passes everything under SOFT_KNEE untouched and bends what is above it towards SOFT_CEIL, so
  // a pile-up of cues, a piece and a bed at full volume cannot clip. (A second compressor would add make-up gain of its own to everything.)
  const lim = c.createWaveShaper(); lim.curve = softCeiling(); lim.oversample = 'none';   // no oversampling: 2x let a hard pile-up overshoot the ceiling to 1.03, with none the peak holds at SOFT_CEIL
  m.connect(comp).connect(lim).connect(dest);
  return m;
}

// wake the context from any state but running: Safari on iOS leaves it 'interrupted' after a call or an app switch, not 'suspended'
const wake = (c) => { if (c.state !== 'running' && c.state !== 'closed') { const p = c.resume(); if (p && p.catch) p.catch(() => {}); } };

export function unlock() {
  if (audio.ctx) { if (!audio.hold) wake(audio.ctx); return; }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = (audio.ctx = new AC()); cx = c;
    c.onstatechange = () => { if (c.state !== 'running' && c.state !== 'closed' && !audio.hold) armGesture(); };   // the system took the sound away: the next tap or key brings it back
    master = masterChain(c, c.destination, masterLevel());
    sfxBus = c.createGain(); sfxBus.gain.value = sfxLevel(); sfxBus.connect(master);
    // a short generated room impulse for a little space
    const len = Math.floor(c.sampleRate * 0.9), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb = c.createConvolver(); verb.buffer = ir;
    const wet = c.createGain(); wet.gain.value = 0.18; verb.connect(wet).connect(master);
    const n = c.sampleRate; noiseBuf = c.createBuffer(1, n, n);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    dst = sfxBus;
    audio.kit = makeAudioKit(c, master, { seed: (Math.random() * 0xffffff) | 0, music: musicLevel(), ambience: ambOn() ? AMBIENCE_LEVEL : 0 });
    if (audio.hold) { audio.kit.hold(); c.suspend(); }
    if (audio.scene) startMusic(audio.scene, audio.mode);
  } catch { audio.ctx = null; }
}

// browsers only allow audio after a gesture: the first tap, click or key anywhere starts it (touchend and click, not touchstart, for iOS).
// The listeners come off once the sound is running and go back on if the system takes it away again.
const GESTURES = ['pointerdown', 'keydown', 'touchend', 'click'];
function onGesture() {
  unlock();
  if (audio.ctx && audio.ctx.state === 'running') for (const e of GESTURES) window.removeEventListener(e, onGesture, true);
}
function armGesture() { if (typeof window !== 'undefined' && window.addEventListener) for (const e of GESTURES) window.addEventListener(e, onGesture, true); }
armGesture();

// silence while paused or hidden: the kit fades its buses and a suspended context stops the clock it schedules
// from, so nothing is lost or queued
export function suspendAudio() {
  audio.hold = true;
  if (audio.kit) audio.kit.hold();
  if (audio.ctx && audio.ctx.state === 'running') audio.ctx.suspend();
}
export function resumeAudio() {
  audio.hold = false;
  if (audio.ctx) wake(audio.ctx);
  if (audio.kit) audio.kit.release();
}

export function setVolumes({ sound = audio.on, music = audio.music, ambience = audio.ambience, volume = audio.vol, sfxVol = audio.sfxVol, musicVol = audio.musicVol, muted = audio.muted } = {}) {
  audio.on = sound; audio.music = music; audio.ambience = ambience; audio.vol = volume; audio.sfxVol = sfxVol; audio.musicVol = musicVol; audio.muted = muted;
  if (!audio.ctx) return;
  const t = audio.ctx.currentTime;
  master.gain.setTargetAtTime(masterLevel(), t, 0.05);
  sfxBus.gain.setTargetAtTime(sfxLevel(), t, 0.05);
  audio.kit.music.level(musicLevel()); audio.kit.amb.level(ambOn() ? AMBIENCE_LEVEL : 0);
  startMusic(audio.scene, audio.mode);   // plays or stops the pieces for the new switches: nothing is scheduled for a muted bus
}

function env(g, t0, a, peak, dur) {
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
}
function tone(f, t0, dur, type = 'sine', g = 0.3, slide = 0, bus = sfxBus, wet = 0) {
  const c = cx, o = c.createOscillator(), a = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t0 + dur);
  env(a, t0, 0.005, g, dur);
  o.connect(a).connect(bus === sfxBus ? dst : bus); if (wet && !quiet) a.connect(verb);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
function noise(t0, dur, g = 0.2, freq = 800, type = 'highpass', q = 0.7, bus = sfxBus, wet = 0) {
  const c = cx, src = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
  src.buffer = noiseBuf; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q;
  env(a, t0, 0.003, g, dur);
  src.connect(f).connect(a).connect(bus === sfxBus ? dst : bus); if (wet && !quiet) a.connect(verb);
  src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
}
// a bandpass noise that slides from f0 to f1: the rush of a ball on a ramp, steam
function sweep(t0, dur, f0, f1, g = 0.2, q = 1.5, bus = sfxBus, wet = 0) {
  const c = cx, src = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
  src.buffer = noiseBuf; src.loop = true; f.type = 'bandpass'; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t0); f.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  env(a, t0, Math.min(0.08, dur / 3), g, dur);
  src.connect(f).connect(a).connect(bus === sfxBus ? dst : bus); if (wet && !quiet) a.connect(verb);
  src.start(t0, Math.random() * 0.5); src.stop(t0 + dur + 0.05);
}
const J = (cents = 20) => 2 ** (((Math.random() * 2 - 1) * cents) / 1200);   // a random detune, so no two repeats are the same
const G = (db = 1.5) => 10 ** (((Math.random() * 2 - 1) * db) / 20);   // a random gain spread of +/- db
// the cues heard most (flippers, bumpers, slings, walls, the ball clack) vary on every repeat: the detune is +/- JITTER_CENTS,
// the gain +/- JITTER_DB, and every noise burst starts at a random point of the noise buffer
const JITTER_CENTS = 25, JITTER_DB = 1.5;
const jf = () => J(JITTER_CENTS), jg = () => G(JITTER_DB);
const thunk = (t, f = 90, g = 0.35) => { tone(f, t, 0.09, 'sine', g, -40); noise(t, 0.04, g * 0.5, 1200, 'bandpass', 1.2); };

// Impacts (S1-23): what the ball does to a flipper and to the table's rails, posts and rubbers, each built from three layers: a
// short noise click (the transient, brighter the harder the hit), a body tuned to the material that falls in pitch, and a ring
// (resonant noise) that lasts a little. body: [start Hz, end Hz, seconds, wave, gain]; click and ring: [type, Hz, Q, gain, seconds].
// Gains are at a hit of full strength; a softer one is quieter and duller. Each repeat picks one of three pitches (IMPACT_PITCH) and
// is detuned a little more, so two hits are not the same.
const IMPACT = {
  flip:   { body: [190, 110, 0.09, 'sine', 0.56], click: ['highpass', 3000, 0.7, 0.36, 0.012], ring: ['bandpass', 1100, 6, 0.15, 0.12] },    // the ball on the flipper's rubber: a solid thump with a little ring
  rubber: { body: [150, 95, 0.07, 'sine', 0.48], click: ['bandpass', 1400, 0.8, 0.24, 0.012], ring: null },                                   // a rubber ring or post: a dull thud
  metal:  { body: [320, 240, 0.05, 'triangle', 0.42], click: ['highpass', 4500, 0.7, 0.62, 0.01], ring: ['bandpass', 2300, 10, 0.52, 0.14] },   // a rail or guide: a tick and a bright ring
  post:   { body: [230, 150, 0.06, 'sine', 0.44], click: ['bandpass', 2500, 1, 0.35, 0.01], ring: ['bandpass', 1600, 8, 0.16, 0.09] },         // a chrome post in its rubber: between the two
};
const IMPACT_PITCH = [0.92, 1, 1.09];
const MATERIAL = { 0: 'metal', 1: 'rubber', 4: 'metal', 6: 'post' };   // by the segment kind sim/physics.js K (WALL, RUBBER, GATE, POST); anything else is metal
function impact(t, m, v) {
  const I = IMPACT[m] || IMPACT.metal, k = 0.35 + 0.65 * v, pitch = IMPACT_PITCH[Math.floor(Math.random() * 3)];
  tone(I.body[0] * pitch * jf(), t, I.body[2], I.body[3], I.body[4] * v * jg(), I.body[1] - I.body[0]);
  noise(t, I.click[4], I.click[3] * k * jg(), I.click[1] * jf(), I.click[0], I.click[2]);
  if (I.ring) noise(t, I.ring[4], I.ring[3] * k * jg(), I.ring[1] * pitch * jf(), I.ring[0], I.ring[2]);
}

// Ceremony cues (S4-19): each payoff has its own voice and its own contour, layered (a fundamental, a detuned octave, a noise sweep or
// a sub drop), and they are as loud as the table's own cues. CEREMONY scales them all (each peak was measured with cueRender).
const CEREMONY = 1;
const bell = (t, f, dur, g) => { const c = CEREMONY * g; tone(f, t, dur, 'sine', c, 0, sfxBus, 1); tone(f * 2.76, t, dur * 0.45, 'sine', c * 0.32, 0, sfxBus, 1); tone(f * 5.4, t, dur * 0.2, 'sine', c * 0.12, 0, sfxBus, 1); };   // a struck bell: partials that fade faster than the fundamental
const pair = (f, t, dur, type, g) => { tone(f * 0.997, t, dur, type, CEREMONY * g, 0, sfxBus, 1); tone(f * 1.003, t, dur, type, CEREMONY * g, 0, sfxBus, 1); };   // a voice doubled and detuned by about 5 cents each way

// peak gains of the quiet foley cues (each measured: cueRender in the test hooks) and of the new event cues
const LV = { rollover: 0.25, spinner: 0.2, switch: 0.28, rampEnter: 0.8, wireDrop: 0.3, launch: 0.6, cue: 0.45 };
const RAMP_SWEEP = 0.55;   // seconds: about the time a shot takes from the ramp mouth to the top
const MODE_VOICE = [{ root: 72, wave: 'sine' }, { root: 67, wave: 'square' }, { root: 76, wave: 'triangle' }, { root: 69, wave: 'triangle' }, { root: 64, wave: 'sawtooth' }, { root: 71, wave: 'square' }];   // by mode: soak, derby, raid, tower, tub, coaster
const LADDER = [0, 2, 4, 7, 9, 12, 14, 16];   // major pentatonic, two octaves, by progress
const LIT = [[523, 659, 784], [784, 988, 1319, 1568], [392, 523, 659, 784, 1047]];   // lock, extra ball, wizard
const BIG = new Set(['jackpot', 'superJackpot', 'skill', 'complete', 'modeWon', 'extraBall', 'multiball', 'wizard', 'boil', 'gameOver', 'start', 'achieve']);
// The attract demo plays the table with the sound of the table (S1-20): the contact cues at DEMO_GAIN of their level, through the same
// rate limits, and none of the fanfares, which belong to a game the player is playing.
const DEMO_GAIN = 0.35;
const DEMO_CUES = new Set(['flip', 'flipDown', 'flipStop', 'flipHit', 'bumper', 'sling', 'wall', 'clack', 'target', 'rollover', 'spinner', 'switch', 'plunger', 'plungerHit', 'launch', 'kick', 'saucer', 'rampEnter', 'rampMade', 'wireDrop', 'orbit']);
const LIMIT = { bumper: 0.045, wall: 0.03, spinner: 0.025, switch: 0.03, rollover: 0.04, target: 0.04, clack: 0.04, flipHit: 0.03 };

// pan: -0.7 (left) to 0.7 (right), from where the thing happened on the table; o: { n, m } the step of a ladder or a
// countdown and the mode a cue belongs to. The reverb send stays centred.
export function sfx(name, v = 1, pan = 0, o = {}) {
  const demo = !!o.demo;   // o.demo: a cue of the attract demo
  if (demo && !DEMO_CUES.has(name)) return;
  const log = demo ? audio.demoPlayed : audio.played; log.push(name); if (log.length > 40) log.shift();
  pan = Math.max(-0.7, Math.min(0.7, pan)); audio.pans[name] = +pan.toFixed(2);
  if (!audio.ctx || !audio.on || audio.hold) return;
  const t = audio.ctx.currentTime;
  if (LIMIT[name] && t - (audio.last[name] || 0) < LIMIT[name]) return;
  audio.last[name] = t;
  v = Math.max(0.15, Math.min(1, v));
  if (BIG.has(name) && audio.kit) audio.kit.music.duck(6, 400);
  try {
    dst = route(sfxBus, demo, pan);
    synth(name, v, t, o);
  } catch { /* audio is optional */ }
  dst = sfxBus; quiet = false;
}

// where a cue's dry sound goes: the bus, through the demo's lower gain and a panner when it needs them
function route(bus, demo, pan) {
  quiet = demo;
  let d = bus;
  if (demo) { const g = cx.createGain(); g.gain.value = DEMO_GAIN; g.connect(d); d = g; }
  if (pan && cx.createStereoPanner) { const p = cx.createStereoPanner(); p.pan.value = pan; p.connect(d); d = p; }
  return d;
}

function synth(name, v, t, o) {
  switch (name) {
    case 'flip': thunk(t, 110 * jf(), 0.32 * jg()); noise(t, 0.03, 0.12 * jg(), 3000 * jf()); tone(220 * jf(), t, 0.04, 'triangle', 0.06 * jg()); break;
    case 'flipDown': tone(70 * jf(), t, 0.06, 'sine', 0.12 * jg(), -20); break;
    case 'flipStop': noise(t, 0.02, 0.08 * jg(), 2500 * jf()); break;
    case 'flipHit': impact(t, 'flip', v); break;
    case 'bumper': thunk(t, 80 * jf(), 0.4 * jg()); tone(523 * jf(), t + 0.01, 0.25, 'triangle', 0.12 * jg(), 0, sfxBus, 1); noise(t + 0.02, 0.3, 0.05 * jg(), 2500 * jf(), 'highpass', 0.7, sfxBus, 1); break;
    case 'sling': thunk(t, 95 * jf(), 0.38 * jg()); tone(330 * jf(), t, 0.07, 'square', 0.06 * jg()); break;
    case 'wall': impact(t, MATERIAL[o.kind] || 'metal', v); break;
    case 'clack': tone(1800 * jf(), t, 0.03, 'square', 0.08 * v * jg()); noise(t, 0.02, 0.1 * v * jg(), 4000 * jf()); break;
    case 'rollover': tone(1046 * J(), t, 0.05, 'square', LV.rollover); tone(1568 * J(), t + 0.04, 0.06, 'square', LV.rollover * 0.7); break;
    case 'target': thunk(t, 160, 0.25); tone(880, t, 0.08, 'triangle', 0.12); break;
    case 'spinner': for (let k = 0; k < Math.round(3 + v * 8); k++) tone((1400 - k * 40) * J(10), t + k * 0.035, 0.02, 'square', LV.spinner); break;
    case 'switch': tone(1200 * J(), t, 0.025, 'square', LV.switch); break;
    case 'outlane': [392, 330, 262].forEach((f, k) => tone(f, t + k * 0.08, 0.12, 'square', 0.08)); break;
    case 'rampEnter': sweep(t, RAMP_SWEEP, 300, 1700, LV.rampEnter, 2); tone(110 * J(), t, RAMP_SWEEP, 'sine', LV.rampEnter * 0.5, 120); break;
    case 'rampMade': [523, 659, 784, 1047].forEach((f, k) => tone(f, t + k * 0.06, 0.14, 'triangle', 0.14, 0, sfxBus, 1)); break;
    case 'wireDrop': tone(2200 * J(), t, 0.06, 'triangle', LV.wireDrop); noise(t, 0.08, LV.wireDrop, 3500); break;
    case 'orbit': tone(392, t, 0.12, 'sawtooth', 0.06, 400); tone(587, t + 0.1, 0.14, 'triangle', 0.1, 0, sfxBus, 1); break;
    case 'saucer': thunk(t, 70, 0.4); noise(t, 0.12, 0.08, 500, 'lowpass'); break;
    case 'kick': thunk(t, 85, 0.45); break;
    case 'plunger': noise(t, 0.08, 0.15, 900, 'bandpass', 1); thunk(t, 60, 0.3); break;
    case 'plungerHit': tone(55, t, 0.08, 'sine', 0.2); break;
    case 'launch': noise(t, 0.4, LV.launch, 900, 'bandpass', 0.8); break;
    case 'drain': tone(196, t, 0.5, 'sawtooth', 0.08, -120); tone(98, t, 0.6, 'sine', 0.18, -40); break;
    case 'save': [784, 988, 1175].forEach((f, k) => tone(f, t + k * 0.07, 0.16, 'triangle', 0.13, 0, sfxBus, 1)); break;
    // a skill shot: a quick sparkle run up and a shimmer of noise
    case 'skill': [1319, 1568, 1760, 2093, 2637].forEach((f, k) => { tone(f * J(10), t + k * 0.05, 0.3, 'sine', 0.2 * CEREMONY, 0, sfxBus, 1); tone(f * 2, t + k * 0.05, 0.12, 'sine', 0.05 * CEREMONY); }); sweep(t, 0.4, 2000, 7000, 0.14 * CEREMONY, 1.2, sfxBus, 1); break;
    // a jackpot: two brass hits (G then C held) over a sub drop
    case 'jackpot': thunk(t, 62, 0.4 * CEREMONY); [392, 523].forEach((f, k) => { const at = t + k * 0.16, d = k ? 0.6 : 0.18; pair(f * J(10), at, d, 'sawtooth', 0.11); tone(f / 2, at, d, 'square', 0.07 * CEREMONY); }); sweep(t + 0.16, 0.7, 500, 3200, 0.1 * CEREMONY, 1, sfxBus, 1); break;
    // a super jackpot (and the Valley collected): the run of ten notes over a long sub drop and a cymbal-like swell, ending on a bell
    case 'superJackpot': thunk(t, 52, 0.4 * CEREMONY); tone(55, t, 1.2, 'sine', 0.26 * CEREMONY, -20, sfxBus, 1); sweep(t + 0.1, 1.4, 700, 6000, 0.12 * CEREMONY, 0.9, sfxBus, 1); for (let k = 0; k < 10; k++) tone(523 * Math.pow(2, (k % 5) / 4), t + k * 0.08, 0.22, 'square', 0.09 * CEREMONY, 0, sfxBus, 1); bell(t + 0.8, 1047, 1, 0.18); break;
    case 'spa': [659, 784, 988].forEach((f, k) => tone(f, t + k * 0.09, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
    case 'boil': for (let k = 0; k < 12; k++) tone(300 + Math.random() * 600, t + k * 0.05, 0.08, 'sine', 0.07, 200); noise(t, 1.0, 0.07, 1500, 'highpass', 0.7, sfxBus, 1); break;
    // Bathhouse Row complete: a slow peal of four bells over a low thump
    case 'complete': thunk(t, 100, 0.25 * CEREMONY); [523, 659, 784, 1047].forEach((f, k) => bell(t + k * 0.16, f, 1, 0.2)); break;
    // a mode won: three quick notes and a held chord, da-da-da-DAAH
    case 'modeWon': [523, 659, 784].forEach((f, k) => tone(f, t + k * 0.08, 0.14, 'square', 0.07 * CEREMONY, 0, sfxBus, 1)); [1047, 784, 659].forEach((f) => tone(f, t + 0.28, 0.7, 'triangle', 0.11 * CEREMONY, 0, sfxBus, 1)); tone(2094, t + 0.28, 0.5, 'sine', 0.04 * CEREMONY, 0, sfxBus, 1); thunk(t + 0.28, 100, 0.2 * CEREMONY); break;
    case 'modeStart': [392, 523, 659, 784].forEach((f, k) => tone(f, t + k * 0.12, 0.3, 'sawtooth', 0.07, 0, sfxBus, 1)); thunk(t, 60, 0.3); break;
    case 'modeHit': {
      // each mode has its own voice and a ladder that climbs a pentatonic scale with the progress made, so it is heard
      const mv = MODE_VOICE[o.m] || MODE_VOICE[0], f = 440 * 2 ** ((mv.root + LADDER[Math.max(0, Math.min(LADDER.length - 1, (o.n || 1) - 1))] - 69) / 12);
      tone(f * J(), t, 0.12, mv.wave, 0.4); tone(f * 1.5 * J(), t + 0.05, 0.16, mv.wave, 0.32, 0, sfxBus, 1); break;
    }
    case 'saveOn': tone(520 * J(), t, 0.16, 'triangle', LV.cue, 520); tone(1568 * J(), t + 0.12, 0.14, 'sine', LV.cue * 0.6, 0, sfxBus, 1); break;
    case 'saveEnd': for (let k = 0; k < 3; k++) { tone(1319 * J(10), t + k * 0.9, 0.07, 'square', LV.cue); noise(t + k * 0.9, 0.02, 0.1, 4000); } break;
    case 'hurryTick': tone((1100 + 900 * (o.n || 0)) * J(), t, 0.035, 'square', LV.cue); noise(t, 0.015, 0.12, 4000); break;
    case 'countTick': tone((o.n === 1 ? 1568 : 1175) * J(10), t, 0.06, 'square', LV.cue); if (o.n === 1) tone(2093, t + 0.07, 0.09, 'square', LV.cue * 0.8); break;
    case 'multUp': { const f = 392 * 2 ** (Math.min(5, o.n || 1) / 4); tone(f * J(), t, 0.12, 'square', LV.cue * 0.8); tone(f * 1.5 * J(), t + 0.08, 0.16, 'square', LV.cue * 0.7); tone(f * 2 * J(), t + 0.16, 0.22, 'triangle', LV.cue * 0.9, 0, sfxBus, 1); break; }
    case 'mbEnd': [784, 659, 523, 392].forEach((f, k) => tone(f * J(10), t + k * 0.11, 0.2, 'triangle', LV.cue * 0.8, 0, sfxBus, 1)); thunk(t + 0.4, 70, 0.3); break;
    case 'vaporsClear': tone(220, t, 0.9, 'sawtooth', LV.cue * 0.8, -110); sweep(t, 0.9, 1600, 300, LV.cue * 0.8, 1, sfxBus, 1); break;
    case 'lit': (LIT[o.n] || LIT[0]).forEach((f, k) => tone(f * J(10), t + k * 0.09, 0.26, o.n === 2 ? 'sawtooth' : 'triangle', LV.cue * 0.7, 0, sfxBus, 1)); break;
    case 'skillOn': tone(1760 * J(), t, 0.07, 'sine', LV.cue * 0.9); tone(2349 * J(), t + 0.09, 0.1, 'sine', LV.cue * 0.7, 0, sfxBus, 1); break;
    case 'rivalPass': thunk(t, 125 * J(), 0.4); thunk(t + 0.1, 105 * J(), 0.36); break;
    case 'payPts': for (let k = 0; k < (o.n ? 4 : 2); k++) { tone(1319 * J(), t + k * 0.07, 0.05, 'square', LV.cue * 0.7); tone(1760 * J(), t + k * 0.07 + 0.035, 0.07, 'square', LV.cue * 0.6, 0, sfxBus, 1); } break;
    case 'payHeat': sweep(t, 0.9, 300, 1800, LV.cue * 1.5, 1.5, sfxBus, 1); tone(300, t, 0.9, 'triangle', LV.cue * 0.5, 600, sfxBus, 1); break;
    case 'modeEnd': [523, 440, 349].forEach((f, k) => tone(f, t + k * 0.12, 0.2, 'triangle', 0.1)); break;
    case 'hurry': for (let k = 0; k < 6; k++) tone(k % 2 ? 880 : 660, t + k * 0.1, 0.09, 'square', 0.08); break;
    case 'towerUp': [392, 494, 587, 784].forEach((f, k) => tone(f, t + k * 0.08, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
    case 'lock': thunk(t, 70, 0.4); [262, 392, 523].forEach((f, k) => tone(f, t + 0.1 + k * 0.1, 0.25, 'sawtooth', 0.07, 0, sfxBus, 1)); break;
    // multiball: a rising swoosh into a C minor arpeggio and a thump
    case 'multiball': tone(110, t, 0.6, 'sawtooth', 0.12 * CEREMONY, 330, sfxBus, 1); sweep(t, 0.6, 300, 3000, 0.16 * CEREMONY, 1, sfxBus, 1); [262, 311, 392, 523].forEach((f, k) => tone(f, t + 0.5 + k * 0.07, 0.3, 'sawtooth', 0.12 * CEREMONY, 0, sfxBus, 1)); thunk(t + 0.55, 70, 0.3 * CEREMONY); break;
    // the wizard (the Valley of the Vapors): a deep sub drop and a long swell, a dark detuned chord, two bells above
    case 'wizard': thunk(t, 50, 0.45 * CEREMONY); tone(49, t, 1.6, 'sine', 0.3 * CEREMONY, -10, sfxBus, 1); sweep(t, 1.6, 400, 5000, 0.14 * CEREMONY, 0.8, sfxBus, 1); [147, 175, 220].forEach((f) => pair(f, t + 0.2, 1.3, 'sawtooth', 0.08)); bell(t + 0.9, 587, 1.2, 0.18); bell(t + 1.1, 698, 1.2, 0.16); break;
    case 'reels': for (let k = 0; k < 14; k++) tone(900 + (k % 3) * 120, t + k * 0.05, 0.03, 'square', 0.05); thunk(t + 0.5, 120, 0.2); thunk(t + 0.75, 120, 0.2); thunk(t + 1.0, 120, 0.2); break;
    // an extra ball: four bright bells quickly up, and a rising shimmer
    case 'extraBall': sweep(t, 0.5, 1500, 6500, 0.1 * CEREMONY, 1, sfxBus, 1); [1047, 1319, 1568, 2093].forEach((f, k) => bell(t + k * 0.09, f, 0.9, 0.2)); break;
    // the ball saved (the Shoot Again lamp): a short two-note ready call
    case 'shootAgain': tone(784, t, 0.1, 'triangle', 0.2, 0, sfxBus, 1); tone(1047, t + 0.1, 0.28, 'triangle', 0.22, 0, sfxBus, 1); tone(2093, t + 0.1, 0.2, 'sine', 0.05, 0, sfxBus, 1); break;
    case 'combo': tone(659, t, 0.1, 'square', 0.08); tone(988, t + 0.07, 0.15, 'square', 0.08); break;
    case 'bonus': for (let k = 0; k < 10; k++) tone(440 + k * 44, t + k * 0.12, 0.06, 'square', 0.06); break;
    case 'nudge': noise(t, 0.08, 0.18, 200, 'lowpass', 1); break;
    case 'warning': tone(220, t, 0.25, 'square', 0.1); tone(220, t + 0.3, 0.25, 'square', 0.1); break;
    case 'tilt': tone(110, t, 1.2, 'sawtooth', 0.12, -50); break;
    case 'start': [262, 330, 392, 523, 392, 523].forEach((f, k) => tone(f, t + k * 0.09, 0.2, 'triangle', 0.13, 0, sfxBus, 1)); break;
    case 'gameOver': [392, 349, 330, 262].forEach((f, k) => tone(f, t + k * 0.22, 0.4, 'triangle', 0.12, 0, sfxBus, 1)); break;
    // a goal reached: a bright three-note rise with a bell body underneath, a little different each time
    case 'achieve': [784, 988, 1319].forEach((f, k) => { tone(f * J(10), t + k * 0.1, 0.34, 'triangle', LV.cue * 0.8, 0, sfxBus, 1); tone(f * 2 * J(10), t + k * 0.1, 0.2, 'sine', LV.cue * 0.3, 0, sfxBus, 1); }); tone(392 * J(10), t, 0.5, 'sine', LV.cue * 0.5); break;
    case 'ui': tone(880, t, 0.04, 'triangle', 0.08); break;
    case 'uiBack': tone(520, t, 0.05, 'triangle', 0.08); break;
  }
}

// ------------------------------------------------------------------------------------------------- music
// startMusic(name, mode): name is a piece in SCORES; the ambience follows it (a mode asks for its own bed).
// A switch that is off plays nothing: no node is made for a muted bus.
export function startMusic(name, mode = null, now = false) {
  audio.scene = name; audio.mode = mode;
  const k = audio.kit;
  if (!k || !audio.ctx) return;
  if (musicOn() && SCORES[name]) k.music.play(SCORES[name], { fade: 1.6, now }); else k.music.stop(1);
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
    musicLevel: musicLevel(), sfxLevel: sfxLevel(), masterLevel: masterLevel(), muted: audio.muted, ambienceLevel: ambOn() ? AMBIENCE_LEVEL : 0,
    ambienceParams: { ...audio.params },
    bars: k && k.music.info() ? k.music.info().bars : 0,
    musicAt: k && k.music.info() ? k.music.info().at : null, musicNext: k && k.music.info() ? k.music.info().next : null, clock: audio.ctx ? audio.ctx.currentTime : null,   // when the piece starts, where its next bar starts, and the audio clock
  };
}
export function audioList() { return { music: Object.keys(SCORES), ambience: Object.keys(SCENES) }; }
// Renders one piece or scene by itself at the level the game ships (default volume, the same compressor) on an
// OfflineAudioContext and measures it. It never touches the live audio or the settings.
// vol is the master volume to render at (CL-01); it defaults to the one the game starts with.
export function audioRender(name, seconds = 60, wav = false, intensity = 0, vol = DEFAULT_VOLUME) {
  const music = SCORES[name], scene = SCENES[name];
  if (!music && !scene) return Promise.reject(new Error('unknown piece: ' + name));
  return measureAudio((oc, dest) => {
    const m = masterChain(oc, dest, vol);
    const kit = makeAudioKit(oc, m, { seed: 7, music: MUSIC_LEVEL, ambience: AMBIENCE_LEVEL });
    if (music) { kit.music.intensity(intensity); kit.music.play(music, { at: 0, fade: 0.02 }); }
    else { kit.amb.set('steam', intensity); kit.amb.set('crowd', intensity); kit.amb.play(scene, { at: 0, fade: 0.02 }); }
    kit.scheduleUntil(seconds);
    return () => (music ? { ...kit.music.info(), formSeconds: +(kit.music.info().formBars * 240 / music.bpm).toFixed(1) } : null);
  }, seconds, { wav });
}

// ------------------------------------------------------------------------------------------------- ball foley
// One voice under the whole game that follows the balls: a lowpassed noise that opens with the speed of the fastest ball on
// the playfield, a bandpass rumble while a ball climbs a ramp and a brighter rattle on the wire rail. Gains are the peak at
// full speed; ROLL.speed is the speed (mm/s) that counts as full. makeRoll builds it on any context so a test can render it.
export const ROLL = { gain: 0.06, ramp: 0.14, wire: 0.2, speed: 2400 };
const LAYER_RAMP = 2, LAYER_WIRE = 4;   // sim/physics.js LAYER (the field layer is 1)
function makeRoll(c, out) {
  const n = c.sampleRate * 3, buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
  let last = 0; for (let i = 0; i < n; i++) { last = (last + 0.06 * (Math.random() * 2 - 1)) / 1.06; d[i] = last * 7; }   // brown-ish, so a loop of three seconds is not heard
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
  const pan = c.createStereoPanner ? c.createStereoPanner() : null;
  const end = pan ? pan.connect(out) && pan : out;
  const chain = (type, f, q) => { const fl = c.createBiquadFilter(), g = c.createGain(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; g.gain.value = 0; src.connect(fl).connect(g).connect(end); return { fl, g }; };
  const field = chain('lowpass', 200, 0.7), track = chain('bandpass', 500, 1.5);
  src.start(0, Math.random() * 2);
  const ease = (p, v, at) => { p.setTargetAtTime(v, at, 0.05); };
  return {
    // fs: field speed, ts: track speed (mm/s, 0 for none), layer of the ball on the track, pan -0.7..0.7
    set(fs, ts, layer, p, at = c.currentTime) {
      const f = Math.min(1, fs / ROLL.speed), r = Math.min(1, ts / ROLL.speed);
      ease(field.g.gain, fs > 40 ? ROLL.gain * Math.pow(f, 1.3) : 0, at); ease(field.fl.frequency, 180 + 1700 * f, at);
      const wire = layer === LAYER_WIRE;
      ease(track.g.gain, ts > 40 ? (wire ? ROLL.wire : ROLL.ramp) * (0.4 + 0.6 * r) : 0, at);
      ease(track.fl.frequency, wire ? 1600 + 1400 * r : 350 + 900 * r, at); ease(track.fl.Q, wire ? 4 : 1.5, at);
      if (pan) ease(pan.pan, p, at);
    },
    stop() { try { src.stop(); } catch { /* already stopped */ } },
  };
}

// balls: the sim's balls { x, vx, vy, layer, held }; width: the table's width; on: false silences it (paused, demo, no game).
// Only the fastest ball on the field and the fastest on a ramp or rail are voiced.
export function setRoll(balls, width, on) {
  if (!audio.ctx || !sfxBus) return;
  try {
    if (!roll) roll = makeRoll(audio.ctx, sfxBus);
    let fs = 0, fx = 0, ts = 0, tx = 0, tl = 0;
    if (on && audio.on && !audio.hold) {
      for (const b of balls) {
        if (b.held) continue;
        const sp = Math.hypot(b.vx, b.vy);
        if (b.layer === LAYER_RAMP || b.layer === LAYER_WIRE) { if (sp > ts) { ts = sp; tx = b.x; tl = b.layer; } } else if (sp > fs) { fs = sp; fx = b.x; }
      }
    }
    const x = ts > fs ? tx : fx, pan = Math.max(-0.7, Math.min(0.7, (x / width) * 2 - 1));
    roll.set(fs, ts, tl, pan);
    audio.roll = { n: audio.roll.n + 1, fs: Math.round(fs), ts: Math.round(ts), layer: tl, pan: +pan.toFixed(2) };   // what the voice was last told (the tests read it)
  } catch { /* audio is optional */ }
}

// ------------------------------------------------------------------------------------------------- plunger charge (S5-20)
// A low tone that rises while the plunger is held back, so the strength of the launch can be heard as well as seen: a sine and a
// quieter triangle an octave above it (so a phone speaker has something to play). CHARGE.gain is its peak at a full pull, before the
// effects bus; lo and hi are the pitch (Hz) at no pull and a full one.
export const CHARGE = { gain: 0.1, lo: 70, hi: 230 };
const chargeHz = (p) => CHARGE.lo + (CHARGE.hi - CHARGE.lo) * Math.pow(p, 1.3);
let charge = null;
function makeCharge(c, out) {
  const o1 = c.createOscillator(), o2 = c.createOscillator(), g1 = c.createGain(), g2 = c.createGain();
  o1.type = 'sine'; o2.type = 'triangle'; g1.gain.value = 0; g2.gain.value = 0;
  o1.connect(g1).connect(out); o2.connect(g2).connect(out);
  o1.start(); o2.start();
  return {
    // p: how far the plunger is drawn back, 0 to 1 (0 is silent)
    set(p, at = c.currentTime) {
      const f = chargeHz(p);
      o1.frequency.setTargetAtTime(f, at, 0.03); o2.frequency.setTargetAtTime(f * 2, at, 0.03);
      g1.gain.setTargetAtTime(p > 0.01 ? CHARGE.gain * (0.4 + 0.6 * p) : 0, at, 0.03); g2.gain.setTargetAtTime(p > 0.01 ? CHARGE.gain * 0.35 * p : 0, at, 0.03);
    },
  };
}
// p: the pull (0..1); on: false silences it (not holding, paused, demo, no game). audio.charge is what the voice was last told.
export function setCharge(p, on) {
  if (!audio.ctx || !sfxBus) return;
  try {
    const q = on && audio.on && !audio.hold ? Math.max(0, Math.min(1, p)) : 0;
    if (!charge) { if (!q) return; charge = makeCharge(audio.ctx, sfxBus); }
    charge.set(q);
    audio.charge = { n: audio.charge.n + 1, p: +q.toFixed(3), hz: q ? Math.round(chargeHz(q)) : 0 };
  } catch { /* audio is optional */ }
}
// the charge tone over a scripted pull (0 to full over the first half, held, then let go), for a test
export function chargeRender(seconds = 4, wav = false) {
  return measureAudio((oc, dest) => {
    const { bus } = offlineChain(oc, dest), v = makeCharge(oc, bus), n = 40;
    for (let i = 0; i <= n; i++) v.set(Math.min(1, (i / n) * 1.6), (seconds * 0.6 * i) / n);
    v.set(0, seconds * 0.8);
    return null;
  }, seconds, { wav });
}

// ------------------------------------------------------------------------------------------------- test hooks for cues
// Renders one cue (or the roll voice) by itself through the same chain the game ships (sfx bus 0.9, default volume 0.8,
// the same compressor), on an OfflineAudioContext. It never touches the live audio or the settings.
function offlineChain(oc, dest, vol = DEFAULT_VOLUME) {
  const m = masterChain(oc, dest, vol);
  const bus = oc.createGain(); bus.gain.value = SFX_LEVEL; bus.connect(m);
  return { m, bus };
}
// vol: the master volume to render at (CL-01: 1 is the slider at its maximum). under: the name of a piece of music to play, at full
// intensity with its ambience bed, underneath the cue (the busiest moment of the game); with: more cues struck at the same moment.
export function cueRender(name, { v = 1, pan = 0, n = 0, m = 0, seconds = 2.5, wav = false, vol = DEFAULT_VOLUME, under = null, with: also = [], demo = false, kind } = {}) {
  return measureAudio((oc, dest) => {
    const { m: mg, bus } = offlineChain(oc, dest, vol);
    const keep = [cx, sfxBus, verb, noiseBuf, dst];
    try {
      cx = oc; sfxBus = bus; dst = bus;
      const len = Math.floor(oc.sampleRate * 0.9), ir = oc.createBuffer(2, len, oc.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
      verb = oc.createConvolver(); verb.buffer = ir;
      const wet = oc.createGain(); wet.gain.value = 0.18; verb.connect(wet).connect(mg);
      noiseBuf = oc.createBuffer(1, oc.sampleRate, oc.sampleRate);
      const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      dst = route(bus, demo, pan);
      let at = 0.05;
      if (under && SCORES[under]) {
        const kit = makeAudioKit(oc, mg, { seed: 7, music: MUSIC_LEVEL, ambience: AMBIENCE_LEVEL });
        kit.music.intensity(1); kit.music.play(SCORES[under], { at: 0, fade: 0.02 });
        const bed = SCENES[AMBIENCE_FOR[under]]; if (bed) kit.amb.play(bed, { at: 0, fade: 0.02 });
        kit.scheduleUntil(seconds); at = 2;
      }
      for (const cue of [name, ...also]) synth(cue, Math.max(0.15, Math.min(1, v)), at, { n, m, kind });
    } finally { [cx, sfxBus, verb, noiseBuf, dst] = keep; quiet = false; }
    return null;
  }, seconds, { wav });
}
// the roll voice over a scripted run: a field ball speeding up and slowing down, then a ramp climb, then the wire rail
export function rollRender(seconds = 12, wav = false) {
  return measureAudio((oc, dest) => {
    const { bus } = offlineChain(oc, dest);
    const r = makeRoll(oc, bus);
    const f = seconds / 3;
    for (let i = 0; i < 24; i++) { const k = i / 24, tri = 1 - Math.abs(2 * k - 1); r.set(tri * 2400, 0, 0, -0.5 + k, f * k); }
    for (let i = 0; i < 24; i++) { const k = i / 24, tri = 1 - Math.abs(2 * k - 1); r.set(0, 400 + tri * 1600, LAYER_RAMP, 0.6, f + f * k); }
    for (let i = 0; i < 24; i++) { const k = i / 24, tri = 1 - Math.abs(2 * k - 1); r.set(0, 400 + tri * 1600, LAYER_WIRE, 0.6, 2 * f + f * k); }
    return null;
  }, seconds, { wav });
}

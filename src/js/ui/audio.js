// WebAudio synthesis for every sound and the music (collection rule: no sample files). Pattern from
// hsg-property-game audio.js (tone, noise, unlock on the first gesture), grown into a small mixer: SFX and music
// buses through a compressor, a generated room reverb, rate limiting so a bumper frenzy never clips, and a
// step sequencer for four short jazz loops (title, main, mode, multiball/wizard).
export const audio = { ctx: null, on: true, music: true, vol: 0.8, played: [], last: {}, scene: null };

let master, sfxBus, musBus, verb, noiseBuf;

export function unlock() {
  if (audio.ctx) { if (audio.ctx.state === 'suspended') audio.ctx.resume(); return; }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const c = (audio.ctx = new AC());
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.2;
    master = c.createGain(); master.gain.value = audio.vol;
    master.connect(comp).connect(c.destination);
    sfxBus = c.createGain(); sfxBus.gain.value = audio.on ? 0.9 : 0; sfxBus.connect(master);
    musBus = c.createGain(); musBus.gain.value = audio.music ? 0.32 : 0; musBus.connect(master);
    // a short generated room impulse for a little space
    const len = Math.floor(c.sampleRate * 0.9), ir = c.createBuffer(2, len, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); }
    verb = c.createConvolver(); verb.buffer = ir;
    const wet = c.createGain(); wet.gain.value = 0.18; verb.connect(wet).connect(master);
    const n = c.sampleRate; noiseBuf = c.createBuffer(1, n, n);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    if (audio.scene) startMusic(audio.scene);
  } catch { audio.ctx = null; }
}

export function setVolumes({ sound = audio.on, music = audio.music, volume = audio.vol } = {}) {
  audio.on = sound; audio.music = music; audio.vol = volume;
  if (!audio.ctx) return;
  const t = audio.ctx.currentTime;
  master.gain.setTargetAtTime(volume, t, 0.05);
  sfxBus.gain.setTargetAtTime(sound ? 0.9 : 0, t, 0.05);
  musBus.gain.setTargetAtTime(music ? 0.32 : 0, t, 0.05);
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

const LIMIT = { bumper: 0.045, wall: 0.03, spinner: 0.025, switch: 0.03, rollover: 0.04, target: 0.04, clack: 0.04, flipHit: 0.03 };

export function sfx(name, v = 1) {
  audio.played.push(name); if (audio.played.length > 40) audio.played.shift();
  if (!audio.ctx || !audio.on) return;
  const t = audio.ctx.currentTime;
  if (LIMIT[name] && t - (audio.last[name] || 0) < LIMIT[name]) return;
  audio.last[name] = t;
  v = Math.max(0.15, Math.min(1, v));
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
// Four loops in a swing-jazz idiom: walking bass, comped chords, brushed hi-hat. 16th-step sequencer.
const N = (n) => 440 * Math.pow(2, (n - 69) / 12);
const SONGS = {
  title: { bpm: 96, chords: [[57, 60, 64, 67], [55, 59, 62, 65], [53, 57, 60, 64], [52, 56, 59, 62]], bass: [45, 43, 41, 40] },
  main: { bpm: 126, chords: [[60, 64, 67, 70], [65, 69, 72, 75], [60, 64, 67, 70], [67, 71, 74, 77]], bass: [48, 53, 48, 43] },
  mode: { bpm: 140, chords: [[62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71], [57, 61, 64, 67]], bass: [50, 43, 48, 45] },
  multiball: { bpm: 156, chords: [[64, 68, 71, 74], [69, 73, 76, 79], [64, 68, 71, 74], [71, 75, 78, 81]], bass: [52, 57, 52, 47] },
};
let seq = null;

export function startMusic(name) {
  audio.scene = name;
  if (!audio.ctx) return;
  if (seq && seq.name === name) return;
  stopMusic();
  const song = SONGS[name];
  if (!song) return;
  const c = audio.ctx, stepDur = 60 / song.bpm / 4;
  seq = { name, next: c.currentTime + 0.1, step: 0, timer: 0 };
  const s = seq;
  const sched = () => {
    if (seq !== s) return;
    while (s.next < c.currentTime + 0.25) {
      const bar = Math.floor(s.step / 16) % 4, st = s.step % 16, t = s.next;
      const swing = st % 2 ? stepDur * 0.18 : 0;
      if (st % 4 === 0) { // walking bass on the beat
        const root = song.bass[bar], walk = [0, 4, 7, 9][st / 4];
        tone(N(root + walk), t + swing, stepDur * 3.2, 'triangle', 0.22, 0, musBus);
      }
      if (st === 2 || st === 10 || (st === 7 && bar % 2)) song.chords[bar].forEach((n) => tone(N(n), t + swing, stepDur * 1.6, 'sine', 0.05, 0, musBus, 1));
      if (st % 2 === 0) noise(t + swing, 0.04, st % 4 === 2 ? 0.05 : 0.025, 7000, 'highpass', 0.7, musBus);
      if (st === 4 || st === 12) noise(t, 0.08, 0.04, 1800, 'bandpass', 0.8, musBus);
      s.step++; s.next += stepDur;
    }
    s.timer = setTimeout(sched, 60);
  };
  sched();
}
export function stopMusic() { if (seq) { clearTimeout(seq.timer); seq = null; } }

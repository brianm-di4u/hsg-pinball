// Spa City Pinball: the music and the ambience as data, for the audio kit (audiokit.js).
// Hot Springs was a jazz-age town, so the table plays swing: a walking bass, comped chords, brushes and a lead that
// follows the chords. Every piece is an AABA form of 32 bars (24 for the slow results piece), so it runs 55 to 83
// seconds before it repeats, and the lead varies on every return. Chord roots are scale degrees (0 = I).
// Chords share one rule: sevenths on the degrees listed.

const ALL7 = [0, 1, 2, 3, 4, 5];
const MINOR = [0, 2, 3, 5, 7, 8, 10];
const MIXO = [0, 2, 4, 5, 7, 9, 10];

export const SCORES = {
  // The title and the attract demo: easy swing in G, flute over vibraphone-soft comping, brushes only.
  title: {
    bpm: 92, swing: 0.22, key: 55, sevenths: ALL7, form: 'AABA',
    sections: { A: [1, 4, 0, 5, 1, 4, 0, 0], B: [3, 3, 2, 5, 1, 4, 0, 4] },
    pad: { inst: 'pad', gain: 0.05 }, bass: { inst: 'bass', pattern: 'walk', gain: 0.15 },
    comp: { inst: 'piano', at: [1, 3], gain: 0.042 },
    lead: { inst: 'flute', gain: 0.085, oct: 1, vary: 0.3, rest: 0.18 },
    perc: { h: [0.5, 1.5, 2.5, 3.5], b: [1, 3], gain: 0.5 },
    lp: 3800, delay: 0.2, delayBeats: 0.75,
  },
  // In play: brisk swing in C with a vibraphone lead. A brush kit all the time; kick and snare join as modes are played.
  main: {
    bpm: 120, swing: 0.2, key: 60, sevenths: ALL7, form: 'AABA',
    sections: { A: [0, 5, 1, 4, 0, 5, 1, 4], B: [2, 2, 5, 5, 1, 1, 4, 4] },
    pad: { inst: 'pad', gain: 0.04 }, bass: { inst: 'bass', pattern: 'walk', gain: 0.17 },
    comp: { inst: 'piano', at: [1, 3], gain: 0.046 },
    lead: { inst: 'mallet', gain: 0.1, oct: 1, vary: 0.3, rest: 0.12 },
    perc: { h: [0.5, 1.5, 2.5, 3.5], b: [1, 3], gain: 0.5 },
    perc2: { k: [0, 2], s: [3.5], gain: 0.5 },
    lp: 4400, delay: 0.14, delayBeats: 0.5,
  },
  // During a mode: a faster mixolydian rag in D with brass on top and a full kit.
  mode: {
    bpm: 138, swing: 0.16, key: 62, scale: MIXO, sevenths: ALL7, form: 'AABA',
    sections: { A: [0, 3, 0, 4, 0, 3, 4, 0], B: [5, 5, 3, 3, 1, 4, 0, 4] },
    bass: { inst: 'bass', pattern: 'walk', gain: 0.17 }, comp: { inst: 'piano', at: [1, 3], gain: 0.05 },
    lead: { inst: 'brass', gain: 0.075, oct: 1, vary: 0.28, rest: 0.1, lift: true },
    perc: { k: [0, 2], s: [1, 3], h: [0.5, 1.5, 2.5, 3.5], gain: 0.5 }, perc2: { s: [3.5], h: [0.25, 1.25, 2.25, 3.25], gain: 0.4 },
    lp: 4600, delay: 0.1, delayBeats: 0.5,
  },
  // Multiball: E minor at 150, a plucked lead, a driving kit.
  multiball: {
    bpm: 150, swing: 0.12, key: 64, scale: MINOR, sevenths: [0, 3, 4], form: 'AABA',
    sections: { A: [0, 5, 2, 6, 0, 5, 3, 4], B: [3, 3, 0, 0, 5, 6, 4, 4] },
    pad: { inst: 'pad', gain: 0.04 }, bass: { inst: 'bass', pattern: 'two', gain: 0.18 }, comp: { inst: 'brass', at: [1, 3], gain: 0.026, len: 0.3 },
    lead: { inst: 'pluck', gain: 0.095, oct: 1, vary: 0.25, rest: 0.06, lift: true },
    perc: { k: [0, 2], s: [1, 3], h: [0.5, 1.5, 2.5, 3.5], gain: 0.55 }, perc2: { s: [3.5], h: [0.25, 1.25, 2.25, 3.25], gain: 0.4 },
    lp: 4800, delay: 0.12, delayBeats: 0.5,
  },
  // The Valley of the Vapors (wizard mode): D minor, an organ lead over a heavy two-beat bass, never settling.
  wizard: {
    bpm: 132, swing: 0.1, key: 50, scale: MINOR, sevenths: [0, 3, 5], form: 'AABA',
    sections: { A: [0, 0, 5, 4, 0, 3, 4, 4], B: [5, 5, 3, 3, 6, 6, 4, 4] },
    pad: { inst: 'pad', gain: 0.06 }, bass: { inst: 'tuba', pattern: 'two', gain: 0.1 }, comp: { inst: 'organ', at: [1, 3], gain: 0.035, len: 0.5 },
    lead: { inst: 'organ', gain: 0.08, oct: 1, vary: 0.35, rest: 0.08, lift: true },
    perc: { k: [0, 1, 2, 3], s: [1, 3], h: [0.5, 1.5, 2.5, 3.5], gain: 0.55 }, perc2: { s: [3.25, 3.5, 3.75], h: [0.25, 1.25, 2.25, 3.25], gain: 0.45 },
    lp: 4200, delay: 0.2, delayBeats: 0.75,
  },
  // Game over and the bonus: a slow ballad in F, vibraphone over a pad.
  results: {
    bpm: 72, swing: 0.12, key: 53, sevenths: ALL7, form: 'AABA',
    sections: { A: [0, 5, 1, 4, 0, 2], B: [3, 3, 0, 0, 1, 4] },
    pad: { inst: 'pad', gain: 0.055 }, bass: { inst: 'bass', pattern: 'two', gain: 0.12 },
    lead: { inst: 'mallet', gain: 0.085, oct: 1, vary: 0.35, rest: 0.2 },
    lp: 3600, delay: 0.26, delayBeats: 0.75,
  },
};

// Which ambience goes with which piece, and with which mode (a mode asks for its own).
export const AMBIENCE_FOR = {
  title: 'street', results: 'street', main: 'springs', mode: 'springs', multiball: 'springs', wizard: 'valley',
  'mode:derby': 'derby', 'mode:raid': 'raid', 'mode:tower': 'tower',
};

// Spots written as functions: (ctx, dest, start time, random, level).
// A bugle-like call: three rising notes through a low-passed saw.
function bugle(ctx, dst, t, rnd, v) {
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.connect(dst);
  [[392, 0, 0.22], [523, 0.24, 0.22], [659, 0.48, 0.5]].forEach(([f, at, d]) => {
    const o = ctx.createOscillator(), e = ctx.createGain();
    o.type = 'sawtooth'; o.frequency.value = f; e.gain.setValueAtTime(0.0001, t + at);
    e.gain.linearRampToValueAtTime(v * 0.5, t + at + 0.03); e.gain.setValueAtTime(v * 0.5, t + at + d - 0.04); e.gain.exponentialRampToValueAtTime(0.0001, t + at + d + 0.1);
    o.connect(e); e.connect(lp); o.start(t + at); o.stop(t + at + d + 0.15);
  });
}
// Coins on a counter: a few short bright clinks at random gaps.
function coins(ctx, dst, t, rnd, v) {
  const n = 5 + ((rnd() * 5) | 0);
  for (let i = 0; i < n; i++) {
    const s = t + i * 0.05 + rnd() * 0.07, f = 2400 + rnd() * 2200, o = ctx.createOscillator(), e = ctx.createGain();
    o.frequency.value = f; e.gain.setValueAtTime(v * 0.35, s); e.gain.exponentialRampToValueAtTime(0.0001, s + 0.18);
    o.connect(e); e.connect(dst); o.start(s); o.stop(s + 0.2);
  }
}

// Water on the left of the table, where the springs are; steam air that follows the spring temperature.
const WATER = [
  { type: 'lowpass', freq: 520, gain: 0.05, pan: -0.45, lfo: { rate: 0.07, depth: 0.5 }, flfo: { rate: 0.05, depth: 140 } },
  { type: 'bandpass', freq: 1500, q: 0.6, gain: 0.014, pan: -0.3, lfo: { rate: 0.13, depth: 0.7 } },
  { type: 'highpass', freq: 3600, q: 0.6, gain: 0.0075, pan: 0.25, lfo: { rate: 0.09, depth: 0.8 }, param: 'steam', range: [0.2, 2] },
];
const DRIPS = [{ make: 'drip', every: [1.6, 5], gain: 0.04, pan: [-0.7, 0.1] }, { make: 'hiss', every: [8, 18], gain: 0.03, pan: [-0.3, 0.5] }];

export const SCENES = {
  // The title: the street at night through a wall: traffic hush, a murmur, a far bell, the odd cricket.
  street: {
    beds: [
      { type: 'lowpass', freq: 220, gain: 0.05, lfo: { rate: 0.06, depth: 0.5 } },
      { type: 'bandpass', freq: 640, q: 0.5, gain: 0.014, lfo: { rate: 0.1, depth: 0.7 }, pan: 0.2 },
    ],
    spots: [{ make: 'bell', every: [14, 28], gain: 0.016, pan: [-0.6, 0.6] }, { make: 'cricket', every: [1.5, 4], gain: 0.012, pan: [0.2, 0.8] }, { make: 'swell', every: [9, 18], gain: 0.02 }],
  },
  // In play: the springs, always there, with steam hisses that thicken as the water heats.
  springs: { beds: WATER, spots: DRIPS },
  // Derby Day: a crowd that grows with the race, and a call to the post.
  derby: {
    beds: [...WATER, { type: 'bandpass', freq: 720, q: 0.5, gain: 0.03, lfo: { rate: 0.13, depth: 0.5 }, param: 'crowd', range: [0.3, 1.5] }, { type: 'bandpass', freq: 1700, q: 0.7, gain: 0.011, lfo: { rate: 0.21, depth: 0.6 }, pan: -0.3, param: 'crowd', range: [0.2, 1.6] }],
    spots: [...DRIPS, { make: 'swell', every: [6, 14], gain: 0.04 }, { make: bugle, every: [16, 30], gain: 0.03, pan: [0.3, 0.6] }],
  },
  // Raid! 1967: the water thinned out, a low tense hum, coins on a counter.
  raid: {
    beds: [WATER[0], { type: 'lowpass', freq: 110, gain: 0.04, lfo: { rate: 0.05, depth: 0.4 } }, WATER[2]],
    spots: [{ make: coins, every: [3, 8], gain: 0.045, pan: [-0.5, 0.5] }, { make: 'drip', every: [3, 7], gain: 0.03, pan: [-0.7, 0.1] }],
  },
  // Tower Climb: the springs under a mountain wind, and a bell from above.
  tower: {
    beds: [...WATER, { type: 'lowpass', freq: 320, gain: 0.03, lfo: { rate: 0.08, depth: 0.7 }, flfo: { rate: 0.04, depth: 110 }, pan: 0.3 }],
    spots: [...DRIPS, { make: 'bell', every: [5, 11], gain: 0.03, pan: [0.1, 0.7] }],
  },
  // The Valley of the Vapors: deep air and a lot of steam.
  valley: {
    beds: [
      { type: 'lowpass', freq: 130, gain: 0.05, lfo: { rate: 0.05, depth: 0.5 } },
      { type: 'bandpass', freq: 3000, q: 0.5, gain: 0.011, lfo: { rate: 0.1, depth: 0.7 }, pan: 0.3 },
      WATER[0],
    ],
    spots: [{ make: 'swell', every: [4, 9], gain: 0.04 }, { make: 'hiss', every: [3, 8], gain: 0.03, pan: [-0.6, 0.6] }],
  },
};

// Levels the game ships at (the kit's own buses; the volume slider is the master after them)
export const MUSIC_LEVEL = 0.4;   // the scores are written at the kit's usual weight; this brings the loudest piece to a peak of about 0.13
export const AMBIENCE_LEVEL = 1;

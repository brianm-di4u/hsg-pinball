// Council wave 2, batch A: sound, longer music and ambience (S5-03, S5-25).
// Music and ambience are measured by rendering each piece on an OfflineAudioContext (window.__game.audioRender), so
// nothing here depends on anyone hearing it. The live wiring is checked through window.__game.getState().audio.

const MUSIC = ['title', 'main', 'mode', 'multiball', 'wizard', 'results'];
const AMBIENCE = ['street', 'springs', 'derby', 'raid', 'tower', 'valley'];

// the first tap or key starts the audio; wait until the kit has made its context
async function gesture(t) {
  if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);
  for (let i = 0; i < 40; i++) { if ((await t.state()).audio.ctx) break; await t.page.waitForTimeout(50); }
}
const settle = async (t, pred) => { let s; for (let i = 0; i < 40; i++) { s = await t.state(); if (pred(s.audio)) break; await t.page.waitForTimeout(50); } return s; };
const render = (t, name, seconds, intensity = 0) => t.page.evaluate(([n, s, i]) => window.__game.audioRender(n, s, false, i), [name, seconds, intensity]);

const musicTests = MUSIC.map((name) => ({
  name: `S5-03 the ${name} piece renders 60 s inside the mix limits and has a form worth 45 s`,
  viewports: ['desktop'],
  async run(t) {
    const r = await render(t, name, 60);
    t.log(`${name}: peak ${r.peak} rms ${r.rmsDb} dB, silence ${r.longestSilence} s, stereo ${r.stereo}, form ${r.built.formBars} bars = ${r.built.formSeconds} s, ${r.built.distinctBars} distinct bars, ${r.built.pitches} pitches`);
    t.expect(r.peak >= 0.06 && r.peak <= 0.16, `peak ${r.peak} is between 0.06 and 0.16`);
    t.expect(r.rmsDb >= -40 && r.rmsDb <= -28, `rms ${r.rmsDb} dBFS is between -40 and -28`);
    t.expect(r.longestSilence <= 2, `no silence longer than 2 s (${r.longestSilence})`);
    t.expect(r.built.formSeconds >= 45, `the form runs ${r.built.formSeconds} s before it repeats`);
    t.expect(r.built.distinctBars >= 6, `${r.built.distinctBars} distinct lead bars`);
    t.expect(r.built.pitches >= 6, `${r.built.pitches} distinct pitches`);
    const hard = await render(t, name, 30, 1);
    t.expect(hard.peak <= 0.2, `at full intensity the peak is ${hard.peak}`);
    t.log(`${name} at full intensity: peak ${hard.peak} rms ${hard.rmsDb} dB`);
  },
}));

const ambienceTests = AMBIENCE.map((name) => ({
  name: `S5-25 the ${name} ambience renders 30 s inside the mix limits with no silent stretch`,
  viewports: ['desktop'],
  async run(t) {
    const r = await render(t, name, 30, 0.6);
    t.log(`${name}: peak ${r.peak} rms ${r.rmsDb} dB, silence ${r.longestSilence} s, stereo ${r.stereo}`);
    t.expect(r.peak < 0.07, `peak ${r.peak} is under 0.07`);
    t.expect(r.rmsDb >= -52 && r.rmsDb <= -38, `rms ${r.rmsDb} dBFS is between -52 and -38`);
    t.expect(r.longestSilence <= 2, `no silence longer than 2 s (${r.longestSilence})`);
  },
}));

export const tests = [
  ...musicTests,
  ...ambienceTests,
  {
    name: 'S5-03 S5-25 music at full intensity, ambience and the loudest cue together stay under 0.95',
    viewports: ['desktop'],
    async run(t) {
      const loud = Math.max(...await Promise.all(MUSIC.map(async (n) => (await render(t, n, 20, 1)).peak)));
      const amb = Math.max(...await Promise.all(AMBIENCE.map(async (n) => (await render(t, n, 12, 1)).peak)));
      t.log(`loudest music peak ${loud}, loudest bed peak ${amb}, loudest cue 0.45 (the standard's ceiling)`);
      t.expect(loud + amb + 0.45 < 0.95, 'the three peaks added up (the worst case) are under 0.95');
    },
  },
  {
    name: 'S5-03 S5-25 the hooks list six pieces and six beds and rendering touches neither live audio nor settings',
    viewports: ['desktop'],
    async run(t) {
      const list = await t.game('audioList');
      t.equal(list.music.join(), MUSIC.join(), 'the pieces');
      t.equal(list.ambience.join(), AMBIENCE.join(), 'the beds');
      const before = await t.state();
      t.expect(!before.audio.ctx, 'no audio context before any input');
      await render(t, 'main', 4);
      const after = await t.state();
      t.expect(!after.audio.ctx, 'rendering made no live context');
      t.equal(JSON.stringify(after.settings), JSON.stringify(before.settings), 'settings untouched');
    },
  },
  {
    name: 'S5-03 live: each scene of play has its own piece, the wizard mode has its own, and the music follows the game',
    viewports: ['desktop'],
    async run(t) {
      await t.game('scene', 'title');
      await gesture(t);
      let s = await settle(t, (a) => a.music === 'title');
      t.equal(s.audio.music, 'title', 'the title plays the title piece');
      t.equal(s.audio.ambience, 'street', 'and the street bed');
      await t.game('newGame', { balls: 3, seed: 5 });
      s = await settle(t, (a) => a.music === 'main');
      t.equal(s.audio.music, 'main', 'in play: the main piece'); t.equal(s.audio.ambience, 'springs', 'the springs bed');
      const low = s.audio.intensity;
      await t.game('pause');
      await t.game('act', 'mode', 0); await t.game('step', 2);
      s = await settle(t, (a) => a.music === 'mode');
      t.equal(s.audio.music, 'mode', 'a mode: the mode piece'); t.expect(s.audio.intensity > low, 'and it lifts (' + low + ' to ' + s.audio.intensity + ')');
      await t.game('act', 'mode', 1); await t.game('step', 2);
      s = await settle(t, (a) => a.ambience === 'derby');
      t.equal(s.audio.ambience, 'derby', 'Derby Day brings the crowd bed');
      await t.game('act', 'multiball', 'arlington'); await t.game('step', 2);
      s = await settle(t, (a) => a.music === 'multiball');
      t.equal(s.audio.music, 'multiball', 'multiball: the multiball piece');
      await t.game('act', 'multiball', 'valley'); await t.game('step', 2);
      s = await settle(t, (a) => a.music === 'wizard');
      t.equal(s.audio.music, 'wizard', 'the wizard mode has a piece of its own'); t.equal(s.audio.ambience, 'valley', 'and its own bed');
      t.equal(s.audio.intensity, 1, 'at full intensity');
      await t.game('scene', 'over');
      await t.game('resume');
      await t.game('step', 2);
    },
  },
  {
    name: 'S5-03 live: the rhythm section lifts with modes played and in the last seconds of a mode',
    viewports: ['desktop'],
    async run(t) {
      await gesture(t);
      await t.game('newGame', { balls: 3, seed: 6 });
      await t.game('pause');
      await t.game('step', 25);
      let s = await settle(t, (a) => a.music === 'main');
      const start = s.audio.intensity;
      await t.game('setState', { features: { modesPlayed: [1, 1, 1, 1, 0, 0] } });
      await t.game('step', 25);
      s = await t.state();
      t.expect(s.audio.intensity > 0.5 && s.audio.intensity > start, `three modes played lifts the kit in (${start} to ${s.audio.intensity}), past the 0.5 where kick and snare enter`);
      await t.game('act', 'mode', 2); await t.game('step', 25);
      s = await t.state();
      const raid = s.audio.intensity;
      s = await t.state();
      await t.game('step', Math.round((s.mode.left - 8) * 120)); await t.game('step', 25);
      s = await t.state();
      t.expect(s.mode && s.mode.left < 10, 'eight seconds from the end of the mode (' + (s.mode && s.mode.left) + ')');
      t.expect(s.audio.intensity === 1 && raid < 1, `the last seconds take it to 1 (from ${raid})`);
    },
  },
  {
    name: 'S5-25 live: the spring temperature drives the steam and Derby progress drives the crowd',
    viewports: ['desktop'],
    async run(t) {
      await gesture(t);
      await t.game('newGame', { balls: 3, seed: 7 });
      await t.game('pause');
      const api = () => t.page.evaluate(() => window.__game.getState().audio.ambienceParams);
      await t.game('setState', { features: { springTemp: 100 } }); await t.game('step', 25);
      const cold = await api();
      await t.game('setState', { features: { springTemp: 140 } }); await t.game('step', 25);
      const hot = await api();
      t.expect(cold && hot && hot.steam > cold.steam + 0.5, `steam ${cold && cold.steam} at 100 F, ${hot && hot.steam} at 140 F`);
      await t.game('act', 'mode', 1); await t.game('step', 25);
      const race = await api();
      t.equal(race.crowd, 0, 'the crowd is quiet at the start of the race');
      await t.game('step', 300);
      await t.game('act', 'switch', 'rampMade', 'hit', 300); await t.game('step', 25);
      await t.game('act', 'switch', 'orbitTop', 'hit', 300); await t.game('step', 25);
      const late = await api();
      t.expect(late.crowd >= 0.3 && late.crowd > race.crowd, 'two shots on the track bring the crowd up (' + race.crowd + ' to ' + late.crowd + ')');
    },
  },
  {
    name: 'S5-03 S5-25 Sound effects, Music and Ambience are separate settings: each silences its own bus only, and persists',
    async run(t) {
      await gesture(t);
      await t.game('scene', 'settings');
      await t.waitForStable();
      t.expect(await t.page.locator('#s-music').count() === 1 && await t.page.locator('#s-ambience').count() === 1, 'Settings has Sound effects, Music and Ambience');
      const label = await t.page.locator('#s-ambience').evaluate((n) => n.closest('label').textContent.trim());
      t.expect(/^Ambience/.test(label), 'the control is labelled: ' + label);
      await t.shot('S5-25-settings');
      let s = await t.state();
      t.expect(s.settings.music && s.settings.ambience, 'both are on by default');
      t.equal(s.audio.musicLevel, 0.4, 'music bus on'); t.equal(s.audio.ambienceLevel, 1, 'ambience bus on');
      await t.page.selectOption('#s-music', '0');
      s = await settle(t, (a) => a.music === null);
      t.equal(s.audio.musicLevel, 0, 'Music Off: the bus is shut'); t.equal(s.audio.music, null, 'no piece is playing');
      t.expect(s.audio.ambience !== null && s.audio.ambienceLevel === 1, 'the ambience goes on');
      await t.page.selectOption('#s-ambience', '0');
      s = await settle(t, (a) => a.ambience === null);
      t.equal(s.audio.ambienceLevel, 0, 'Ambience Off: that bus is shut'); t.equal(s.audio.ambience, null, 'no bed is playing');
      await t.reload();
      s = await t.state();
      t.equal(s.settings.music, false, 'Music Off survives a reload'); t.equal(s.settings.ambience, false, 'Ambience Off survives a reload');
      await t.game('scene', 'settings');
      await t.page.selectOption('#s-music', '1'); await t.page.selectOption('#s-ambience', '1');
      await gesture(t);
      await t.game('scene', 'title');
      s = await settle(t, (a) => a.music === 'title' && a.ambience === 'street');
      t.equal(s.audio.music, 'title', 'turned back on, the piece plays'); t.equal(s.audio.ambience, 'street', 'and the bed');
      await t.game('scene', 'settings');
      await t.page.selectOption('#s-sound', '0');
      await t.page.waitForTimeout(400);
      s = await t.state();
      t.equal(s.settings.sound, false, 'Sound effects is off');
      t.equal(s.audio.musicLevel, 0.4, 'Sound effects Off leaves the music on, as it did before the ambience was added'); t.equal(s.audio.ambienceLevel, 1, 'and the ambience');
      t.equal(s.audio.music, 'title', 'the piece keeps playing'); t.equal(s.audio.ambience, 'street', 'and the bed');
    },
  },
  {
    name: 'S5-03 S5-25 a save from before this wave: effects on gains the ambience, effects off gains no new sound and keeps its music, both off stays silent',
    viewports: ['desktop'],
    async run(t) {
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: true, music: true, volume: 0.5, motion: 'auto', balls: 5, tier: 'auto', practice: false, textScale: 1 })));
      await t.reload();
      let s = await t.state();
      t.equal(s.settings.ambience, true, 'Ambience defaults on'); t.equal(s.settings.balls, 5, 'the rest of the save is untouched'); t.equal(s.settings.volume, 0.5, 'volume too');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: false, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1 })));
      await t.reload();
      await gesture(t);
      await t.game('scene', 'title');
      s = await t.state();
      t.equal(s.settings.ambience, false, 'effects were off: the new ambience starts off too'); t.equal(s.audio.ambienceLevel, 0, 'its bus is shut'); t.equal(s.audio.ambience, null, 'and no bed is scheduled');
      s = await settle(t, (a) => a.music === 'title');
      t.equal(s.audio.musicLevel, 0.4, 'the music this save had on still plays'); t.equal(s.audio.music, 'title', 'the title piece');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: false, music: false, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1 })));
      await t.reload();
      await gesture(t);
      await t.game('scene', 'title');
      await t.page.waitForTimeout(400);
      s = await t.state();
      t.equal(s.audio.musicLevel, 0, 'effects and music both off: the music bus stays shut'); t.equal(s.audio.ambienceLevel, 0, 'the ambience bus too');
      t.equal(s.audio.music, null, 'no piece is scheduled'); t.equal(s.audio.ambience, null, 'nor a bed');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: true, music: true, ambience: 'maybe' })));
      await t.reload();
      s = await t.state();
      t.equal(s.settings.ambience, true, 'a damaged Ambience value falls back to on');
    },
  },
  {
    name: 'S5-03 S5-25 the pause card and a hidden tab hold the music and ambience, and nothing is scheduled meanwhile',
    viewports: ['desktop'],
    async run(t) {
      await gesture(t);
      await t.game('newGame', { balls: 3, seed: 8 });
      let s = await settle(t, (a) => a.music === 'main' && a.bars > 0);
      t.equal(s.audio.held, false, 'playing');
      const hidden = (h) => t.page.evaluate((v) => { Object.defineProperty(document, 'hidden', { get: () => v, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); }, h);
      await t.page.keyboard.press('Escape');
      s = await settle(t, (a) => a.held);
      t.equal(s.audio.held, true, 'the pause card holds the kit');
      const bars = s.audio.bars;
      await t.page.waitForTimeout(1500);
      s = await t.state();
      t.equal(s.audio.bars, bars, 'no bar was scheduled while paused');
      await t.page.keyboard.press('Escape');
      s = await settle(t, (a) => !a.held);
      t.equal(s.audio.held, false, 'Resume releases it');
      await hidden(true);
      s = await settle(t, (a) => a.held);
      t.equal(s.audio.held, true, 'a hidden tab holds it');
      await hidden(false);
      await t.page.waitForTimeout(300);
      s = await t.state();
      t.equal(s.audio.held, true, 'the tab is visible again but the game paused itself, so the pause card still holds it');
      await t.page.keyboard.press('Escape');
      s = await settle(t, (a) => !a.held);
      t.equal(s.audio.held, false, 'Resume brings the music back');
      await t.waitForStable();
    },
  },
];

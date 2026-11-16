// Council wave 4, batch A: saves, lifecycle and robustness (C4-01, S3-16, S5-17, S5-18, S5-19).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIFFICULTY } from '../src/js/sim/rules.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-4', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };
const P = 'hsg-pinball:';
const rawSave = (t) => t.page.evaluate((p) => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith(p)) o[k] = localStorage.getItem(k); } return o; }, P);
const reload = async (t) => { await t.page.reload(); await t.waitIdle(30000); await t.waitFrames(3); };
// every key the game saves, written as a newer build might: version 2, with fields this build has never heard of
const NEWER = {
  settings: { v: 2, sound: false, music: false, volume: 0.2, balls: 5, haptics: false, hologram: 'on' },
  scores: { v: 2, table: [{ initials: 'NEW', score: 99000000, date: '2026-12-01', difficulty: 'expert', mode: 'x' }] },
  scores5: { v: 2, table: [{ initials: 'NEW', score: 88000000, date: '2026-12-01', difficulty: 'expert' }] },
  stats: { v: 2, games: 400, score: 5e9, best: { easy: 1, standard: 2, expert: 3 }, earned: {}, newThing: [1] },
  daily: { v: 2, days: { '2026-12-01': { best: 5, plays: 1 } }, longest: 9 },
  resume: { v: 2, practice: false, player: { ball: 2, ballsPerGame: 3, score: 4242 }, features: {} },
};
const seedNewer = (t, only = Object.keys(NEWER)) => t.page.evaluate(([n, keys, p]) => { localStorage.clear(); for (const k of keys) localStorage.setItem(p + k, JSON.stringify(n[k])); }, [NEWER, only, P]);

export const tests = [
  {
    name: 'S3-16 MECHANICS.md describes the ball save the game has: no early end after three switches, and the lengths on each difficulty',
    node: true,
    async run(t) {
      const doc = fs.readFileSync(path.join(GAME, 'MECHANICS.md'), 'utf8').replace(/\s+/g, ' ');
      const line = doc.slice(doc.indexOf('Ball lifecycle'), doc.indexOf('Skill shot'));
      t.expect(line.length > 50, 'the ball lifecycle line is there');
      t.expect(!/ends early|3 switches|three switches/.test(line) || /not shortened by switch hits/.test(line), 'it no longer says the save ends early after three switches');
      const d = DIFFICULTY;
      t.expect(line.includes(d.standard.saveSecs + ' s on Standard') && line.includes(d.easy.saveSecs + ' s on Easy') && d.expert.saveSecs === 0 && /none on Expert/.test(line), 'the single-ball lengths match the code: ' + [d.easy.saveSecs, d.standard.saveSecs, d.expert.saveSecs]);
      t.expect(line.includes(d.standard.saveSecsMulti + ' s, ' + d.easy.saveSecsMulti + ' s and none'), 'and the multiball lengths: ' + [d.standard.saveSecsMulti, d.easy.saveSecsMulti, d.expert.saveSecsMulti]);
    },
  },
  {
    name: 'C4-01 a save from a newer version is byte-for-byte the same after a visit that changes settings and plays a game, and the title says so once',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await seedNewer(t);
      const before = await rawSave(t);
      await reload(t);
      let s = await t.state();
      t.equal(s.newerSave, true, 'the game knows the save is a newer one');
      t.equal(s.settings.sound, true, 'it plays from defaults: sound is on');
      t.equal(s.settings.balls, 3, 'and three balls');
      t.equal(await t.page.locator('#b-continue').count(), 0, 'the newer game in progress is not offered');
      t.expect(s.scores.every((r) => r.initials !== 'NEW'), 'the newer high scores are not shown');
      const note = t.page.locator('#t-nosave');
      const said = await note.textContent();
      t.expect(/not being saved/.test(said) && /newer version/.test(said), 'the title says this visit is not saved because the save comes from a newer version: ' + said);
      await shot(t, 'C4-01-title-notice');
      await t.checkLayout();
      // settings: the notice is there too, and a change takes effect for this visit
      await t.page.click('#b-settings');
      t.expect(await t.page.locator('#s-nosave').isVisible(), 'Settings carries the notice');
      await t.page.selectOption('#s-sound', '0');
      await shot(t, 'C4-01-settings-notice');
      await t.checkLayout();
      t.equal((await t.state()).settings.sound, false, 'a change still applies in memory');
      await t.page.click('#b-back');
      t.equal(await t.page.locator('#t-nosave').count(), 0, 'back on the title the notice is not repeated');
      // a whole game, to the initials card and on: the end of a game writes stats, daily, scores and clears resume
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 7777777, tilted: true }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 600);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('#b-ok', { state: 'detached' });
      await t.waitFrames(3);
      s = await t.state();
      t.expect(s.scores.some((r) => r.score === 7777777), "the score went on this visit's table, in memory");
      const after = await rawSave(t);
      t.equal(after, before, 'every saved key is exactly what the newer version wrote');
    },
  },
  {
    name: 'C4-01 one newer key is enough: the older keys beside it are left alone too, and what the visit does in memory is lost on reload',
    viewports: ['desktop'],
    async run(t) {
      await seedNewer(t, ['stats']);
      await t.page.evaluate((p) => localStorage.setItem(p + 'settings', JSON.stringify({ v: 1, sound: true, music: true, volume: 0.5, balls: 5 })), P);
      const before = await rawSave(t);
      await reload(t);
      let s = await t.state();
      t.equal(s.newerSave, true, 'a newer stats key marks the visit');
      t.equal(s.settings.balls, 5, 'the older settings still load');
      await t.game('applySettings', { balls: 3, volume: 0.9 });
      t.equal((await t.state()).settings.volume, 0.9, 'and a change applies in memory');
      t.equal(await rawSave(t), before, 'nothing is written, the older key included');
      await reload(t);
      s = await t.state();
      t.equal(s.settings.balls, 5, 'the next visit finds the settings as they were');
    },
  },
  {
    name: 'C4-01 damaged and wrong-shaped saves are treated as before: no notice, and the game saves as usual',
    viewports: ['desktop'],
    async run(t) {
      for (const [key, bad] of [['settings', '{oops'], ['settings', '[1,2]'], ['settings', '"x"'], ['resume', '{"v":1,"player":{"ball":9}}'], ['scores', '{"v":1,"table":"no"}'], ['stats', '{"v":"2"}'], ['stats', '{"v":0}']]) {
        await t.page.evaluate(([p, k, b]) => { localStorage.clear(); localStorage.setItem(p + k, b); }, [P, key, bad]);
        await reload(t);
        t.equal((await t.state()).newerSave, false, 'no newer-save mode for ' + key + ' ' + bad);
        t.equal(await t.page.locator('#t-nosave').count(), 0, 'and no notice for ' + bad);
      }
      await t.page.evaluate((p) => { localStorage.clear(); localStorage.setItem(p + 'settings', '{oops'); }, P);
      await reload(t);
      await t.game('applySettings', { balls: 5 });
      const saved = await t.page.evaluate((p) => JSON.parse(localStorage.getItem(p + 'settings')), P);
      t.equal([saved.v, saved.balls], [1, 5], 'a damaged settings record is replaced by a good one when the player changes a setting');
      await t.page.evaluate(() => localStorage.clear());
      await reload(t);
      await t.game('applySettings', { balls: 5 });
      t.equal((await t.page.evaluate((p) => JSON.parse(localStorage.getItem(p + 'settings')), P)).balls, 5, "a new player's settings are saved");
    },
  },
];

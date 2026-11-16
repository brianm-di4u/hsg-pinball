// Council wave 3, batch A: saves, lifecycle and robustness (S1-07, S2-19, S2-29, S3-08, S4-03, S5-08, S5-09, S6-05).
// Sim rules run in Node on the sim itself; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick } from '../src/js/sim/rules.js';
import { addBall } from '../src/js/sim/physics.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
async function gesture(t) {
  if (t.viewport === 'mobile') await t.tap([20, 400]); else await t.page.mouse.click(20, 400);
  for (let i = 0; i < 40; i++) { if ((await t.state()).audio.ctx) break; await t.page.waitForTimeout(50); }
}
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

const T = compileTable(spec);
const fresh = (seed = 1) => { const G = createGame(T, { seed }); newGame(G, { seed }); G.cues.length = 0; return G; };
const names = (G) => G.cues.filter((c) => c.k === 'sound').map((c) => c.name);
// a ball is lost down the drain with the given ball save and number of other balls loose
const drainWith = (G, { saved, others }) => {
  G.ball.inLane = false; G.ball.launched = true; G.ball.saveUntil = saved ? G.t + 30 : 0;
  for (let i = 0; i < others; i++) addBall(G.w, 200 + 40 * i, 500);
  const b = G.w.balls[0];
  G.cues.length = 0;
  G.w.events.push({ t: 'drain', ball: b.id, x: 240 });
  tick(G);
};

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-07
  {
    name: 'S1-07 the ball-save slow motion is asked for only when the saved ball is the only one in play',
    node: true,
    async run(t) {
      const one = fresh(); drainWith(one, { saved: true, others: 0 });
      const c1 = one.cues.find((c) => c.k === 'slowmo');
      t.expect(c1 && c1.others === 0, 'a lone saved ball: slow motion, nothing else in play');
      const many = fresh(); drainWith(many, { saved: true, others: 1 });
      const c2 = many.cues.find((c) => c.k === 'slowmo');
      t.expect(c2 && c2.others === 1, 'a save in multiball says another ball is live');
    },
  },
  {
    name: 'S1-07 with another ball live the flippers keep full speed; a lone save still slows the table',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const r = await t.page.evaluate(() => {
        const g = window.__game; g.slowmo = true;
        g.newGame({ seed: 5 }); g.pause();
        g.act('clearBalls');
        const out = {};
        for (const [key, others] of [['multi', 1], ['lone', 0]]) {
          g.act('clearBalls');
          g.act('addBall', 300, 300);
          for (let i = 0; i < others; i++) g.act('addBall', 200, 500);
          g.setState({ ball: { saveUntil: 1e6, inLane: false, launched: true } });
          g.act('switch', 'shooterLane', 'drain');
          g.step(2);
          out[key] = g.getState().timeScale;
        }
        g.slowmo = false;
        return out;
      });
      t.equal(r.multi, 1, 'multiball save: time keeps its normal speed');
      t.expect(r.lone < 1, 'a lone save slows time: ' + r.lone);
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-19
  {
    name: 'S2-19 the mode line (and the phone score plate) count the ball save down, and drop it when it ends',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.game('newGame', { seed: 7 });
      await t.game('pause');
      const s0 = await t.state();
      await t.game('setState', { ball: { saveUntil: s0.t + 300, inLane: false, launched: true } });
      await t.game('step', 2);
      const sel = t.viewport === 'mobile' ? '#score' : '#modeline';
      const text = () => t.page.locator(sel).textContent();
      // the phone plate shows the score while a callout is up: step until the callouts have gone
      for (let i = 0; i < 60 && !/SAVE/.test(await text()); i++) await t.game('step', 30);
      t.expect(/SAVE [0-9]+s$/.test(await text()), 'the line says how long the save has left: ' + (await text()));
      await shot(t, 'S2-19-save-countdown');
      if (t.viewport === 'mobile') {
        // the phone plate is cut off with an ellipsis when it is too long: the save must lead it and nothing may be cut
        const cut = () => t.page.locator('#score').evaluate((e) => e.scrollWidth > e.clientWidth);
        t.expect(/^SAVE [0-9]+s/.test(await text()), 'the save leads the plate: ' + (await text()));
        t.expect(!(await cut()), 'the plate shows all of its text, not an ellipsis');
        await t.game('act', 'mode', 0);
        await t.game('step', 2);
        for (let i = 0; i < 60 && !/SAVE/.test(await text()); i++) await t.game('step', 30);
        t.expect(/^SAVE [0-9]+s · /.test(await text()), 'with a mode running the save still comes first: ' + (await text()));
        await shot(t, 'S2-19-save-countdown-mode');
      }
      await t.game('setState', { ball: { saveUntil: 0 } });
      await t.game('step', 2);
      t.expect(!/SAVE/.test(await text()), 'and nothing once it has ended: ' + (await text()));
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-29
  {
    name: 'S2-29 building the 3D table logs no three.js warning',
    viewports: ['desktop'],
    async run(t) {
      const warns = [];
      t.page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') warns.push(m.text()); });
      await t.page.reload();
      await t.waitIdle(30000);
      t.equal((await t.state()).view, '3d', 'the 3D table is up');
      t.expect(!warns.some((w) => /PCFSoftShadowMap/.test(w)), 'no shadow-map warning: ' + warns.join(' | '));
    },
  },
  {
    name: 'S2-29 with storage blocked the title and Settings say progress cannot be saved',
    viewports: ['desktop', 'mobile'],
    initScript: () => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }); },
    async run(t) {
      const note = t.page.locator('#t-nosave');
      t.expect(await note.isVisible(), 'the title says so');
      t.expect(/cannot be saved/.test(await note.textContent()), 'in plain words: ' + (await note.textContent()));
      await shot(t, 'S2-29-storage-blocked-title');
      await t.game('scene', 'settings');
      t.expect(await t.page.locator('#s-nosave').isVisible(), 'and so does Settings');
      await shot(t, 'S2-29-storage-blocked-settings');
      await t.checkLayout();
    },
  },
  {
    name: 'S2-29 with storage working there is no such note',
    viewports: ['desktop'],
    async run(t) {
      t.equal(await t.page.locator('#t-nosave').count(), 0, 'no note on the title');
      await t.game('scene', 'settings');
      t.equal(await t.page.locator('#s-nosave').count(), 0, 'and none in Settings');
    },
  },

  // ---------------------------------------------------------------------------------------------- S3-08
  {
    name: 'S3-08 a 5-ball score goes on its own table; the 3-ball table (and every score saved before) is untouched',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const old = { v: 1, table: [{ initials: 'OLD', score: 3100000, date: '2026-10-01', difficulty: 'standard' }] };
      await t.page.evaluate((o) => { localStorage.clear(); localStorage.setItem('hsg-pinball:scores', JSON.stringify(o)); }, old);
      await t.page.reload(); await t.waitIdle(30000);
      await t.game('newGame', { balls: 5, seed: 5 });
      await t.game('setState', { player: { ball: 5, score: 7777777 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('[data-balls]');
      const cell = () => t.page.locator('.scores tr').first().textContent().then((x) => x.replace(/s+/g, ' ').trim());
      t.expect(/7,777,777/.test(await cell()), 'the new score tops the 5-ball table, which is the one showing: ' + (await cell()));
      t.equal(await t.page.locator('[data-balls="5"]').getAttribute('aria-pressed'), 'true', 'the 5-ball toggle is the one pressed');
      await shot(t, 'S3-08-high-scores-5-ball');
      const saved = await t.page.evaluate(() => ({ five: JSON.parse(localStorage.getItem('hsg-pinball:scores5')), three: JSON.parse(localStorage.getItem('hsg-pinball:scores')) }));
      t.equal(saved.five.table[0].score, 7777777, 'saved under its own key');
      t.equal(saved.three.table.map((r) => r.initials), ['OLD'], 'the 3-ball key is exactly as it was');
      await t.page.click('[data-balls="3"]');
      t.expect(/OLD/.test(await cell()) && !/7,777,777/.test(await cell()), 'the 3-ball table shows the old score and not the 5-ball one: ' + (await cell()));
      t.equal(await t.page.locator('[data-balls="3"]').getAttribute('aria-pressed'), 'true', 'and its toggle is pressed');
      t.equal(await t.page.locator('.scores tr').count(), 1, 'the 3-ball table is the one old row, as saved');
      await t.checkLayout();
    },
  },

  {
    name: 'S3-08 a player who has chosen 5 balls but only has older scores still opens High scores on the table that holds them',
    viewports: ['desktop'],
    async run(t) {
      const old = { v: 1, table: [{ initials: 'OLD', score: 3100000, date: '2026-10-01', difficulty: 'standard' }] };
      await t.page.evaluate((o) => { localStorage.clear(); localStorage.setItem('hsg-pinball:scores', JSON.stringify(o)); localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, balls: 5 })); }, old);
      await t.page.reload(); await t.waitIdle(30000);
      t.equal((await t.state()).scores[0].initials, 'OLD', 'the scores in the state are the saved ones');
      await t.game('scene', 'scores');
      t.expect(/OLD/.test(await t.page.locator('.scores tr').first().textContent()), 'High scores shows them, not an empty table');
      t.equal(await t.page.locator('[data-balls="3"]').getAttribute('aria-pressed'), 'true', 'on the 3-ball tab');
      await t.page.click('[data-balls="5"]');
      t.expect(!/OLD/.test(await t.page.locator('.scores tr').first().textContent()), 'the 5-ball tab is its own table');
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-09
  {
    name: 'S5-09 Effects and Music volume sliders feed their own buses, are saved, and an older save sounds as it did',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const old = { v: 1, sound: true, music: true, volume: 0.8, balls: 3 };   // a save from before the two sliders
      await t.page.evaluate((o) => { localStorage.clear(); localStorage.setItem('hsg-pinball:settings', JSON.stringify(o)); }, old);
      await t.page.reload(); await t.waitIdle(30000);
      await gesture(t);
      let s = await t.state();
      t.equal([s.settings.sfxVol, s.settings.musicVol, s.settings.volume], [1, 1, 0.8], 'an old save gets both sliders at full and keeps its master volume');
      t.equal([s.audio.sfxLevel, s.audio.musicLevel], [1.1, 0.4], 'the buses are at the levels the game ships (the effects bus 1.1 since S5-14, it was 0.9; music 0.4 as before)');
      await t.game('scene', 'settings');
      await t.page.evaluate(() => { for (const [id, v] of [['#s-sfxvol', '0.5'], ['#s-musvol', '0.25']]) { const n = document.querySelector(id); n.value = v; n.dispatchEvent(new Event('change', { bubbles: true })); } });
      await shot(t, 'S5-09-settings-sliders');
      s = await t.state();
      t.equal([s.settings.sfxVol, s.settings.musicVol], [0.5, 0.25], 'the sliders set the settings');
      t.equal([s.audio.sfxLevel, s.audio.musicLevel], [0.55, 0.1], 'effects bus at half, music bus at a quarter of its level');
      t.equal(s.settings.volume, 0.8, 'the master volume is not touched');
      await t.game('applySettings', { music: false });
      t.equal((await t.state()).audio.musicLevel, 0, 'Music Off still shuts the music bus, whatever its slider says');
      await t.game('applySettings', { music: true });
      await t.page.reload(); await t.waitIdle(30000);
      s = await t.state();
      t.equal([s.settings.sfxVol, s.settings.musicVol], [0.5, 0.25], 'both survive a reload');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sfxVol: 7, musicVol: 'loud' })));
      await t.page.reload(); await t.waitIdle(30000);
      s = await t.state();
      t.equal([s.settings.sfxVol, s.settings.musicVol], [1, 1], 'out of range clamps, a damaged value falls back to full');
    },
  },
  {
    name: 'S5-09 M and the speaker button mute everything during play and bring it back; the saved settings do not change',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.page.evaluate(() => localStorage.clear());
      await t.page.reload(); await t.waitIdle(30000);
      await gesture(t);
      await t.game('newGame', { seed: 5 });
      let s = await t.state();
      const level = s.audio.masterLevel;
      t.expect(level > 0, 'master is open: ' + level);
      const btn = t.page.locator('#b-mute');
      t.expect(await btn.isVisible(), 'the speaker button is on screen');
      t.equal(await btn.getAttribute('aria-pressed'), 'false', 'not pressed');
      const box = await btn.boundingBox();
      t.expect(box.width >= 44 && box.height >= 44, 'a touch target of at least 44 px: ' + box.width + 'x' + box.height);
      if (t.viewport === 'desktop') {
        await t.page.keyboard.press('KeyM');
      } else {
        await t.tap([box.x + box.width / 2, box.y + box.height / 2]);
      }
      await t.waitForStable(2);
      s = await t.state();
      t.equal([s.audio.muted, s.audio.masterLevel], [true, 0], 'muted: the master is shut');
      t.equal(await btn.getAttribute('aria-pressed'), 'true', 'the button shows it');
      await shot(t, 'S5-09-muted');
      t.equal(s.settings.volume, 0.8, 'the saved volume is untouched');
      const saved = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings') || 'null'));
      t.expect(!saved || saved.volume === 0.8, 'and nothing was saved');
      await btn.click();
      s = await t.state();
      t.equal([s.audio.muted, s.audio.masterLevel], [false, level], 'the button brings the sound back to where it was');
      await t.checkLayout();
    },
  },
  {
    name: 'S5-09 pressing M in a Settings list does not mute',
    viewports: ['desktop'],
    async run(t) {
      await t.game('scene', 'settings');
      await t.page.focus('#s-sound');
      await t.page.keyboard.press('KeyM');
      t.equal((await t.state()).audio.muted, false, 'M is a typed letter there, not the mute key');
    },
  },

  // ---------------------------------------------------------------------------------------------- S6-05
  {
    name: 'S6-05 leaving a finished game for the title cancels its pending initials or game-over card',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.page.evaluate(() => { window.__game.overDelay = 600000; });   // the card is on a long timer, so the test sees it pending
      await t.game('setState', { player: { ball: 3, score: 9000000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      t.equal((await t.state()).scene, 'over', 'the game is over');
      t.equal(await t.game('overPending'), true, 'the card is waiting on its timer');
      t.expect((await t.state()).screen == null, 'nothing is on screen yet');
      await t.game('scene', 'title');
      t.equal(await t.game('overPending'), false, 'going to the title cancels it');
      const s = await t.state();
      t.expect(s.screen === 'title' && s.demo === true, 'the title over the attract demo: ' + s.screen);
      // a new game cancels it too
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('setState', { player: { ball: 3, score: 0 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      t.equal(await t.game('overPending'), true, 'a second finished game has its card pending');
      await t.game('newGame', { balls: 3, seed: 5 });
      t.equal(await t.game('overPending'), false, 'starting another game cancels it');
      await t.page.evaluate(() => { window.__game.overDelay = null; });
    },
  },

  // ---------------------------------------------------------------------------------------------- S4-03
  {
    name: 'S4-03 on a phone in portrait the painted backglass heads the title and game-over cards; on a desktop the cabinet shows it and the cards do not repeat it',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      const art = (sel) => t.page.locator(sel + ' .title-art');
      await t.page.waitForFunction(() => /^url\(/.test(getComputedStyle(document.documentElement).getPropertyValue('--backglass').trim()), null, { timeout: 15000 });
      if (t.viewport === 'mobile') {
        t.expect(await art('.screen.title').isVisible(), 'the title card has the painting');
        const box = await art('.screen.title').boundingBox();
        t.expect(box.height >= 80 && box.width >= 250, 'a real header: ' + Math.round(box.width) + 'x' + Math.round(box.height));
        t.expect(/url\(/.test(await art('.screen.title').evaluate((n) => getComputedStyle(n).backgroundImage)), 'and it is the painting');
        await shot(t, 'S4-03-title-backglass');
        await t.game('scene', 'over');
        t.expect(await art('.screen').isVisible(), 'the game-over card has it too');
        await shot(t, 'S4-03-gameover-backglass');
        await t.checkLayout();
        await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:scores'));
        await t.game('newGame', { balls: 3, seed: 5 });
        await t.game('setState', { player: { ball: 3, score: 9000000 }, ball: { saveUntil: 0 } });
        await t.game('act', 'placeBall', 242, 60, 0, -1500);
        await t.game('step', 400);
        await t.page.waitForSelector('#b-ok');
        t.expect(await art('.screen').isVisible(), 'and so does the initials card');
        await shot(t, 'S4-03-initials-backglass');
        const ok = await t.page.locator('#b-ok').boundingBox();
        t.expect(ok.y + ok.height <= 844, 'OK is on screen');
      } else {
        t.expect(!(await art('.screen.title').isVisible()), 'a desktop title card does not repeat the cabinet art');
        t.expect(await t.page.locator('.glass-art').isVisible(), 'the cabinet panel shows the painting');
      }
    },
  },

  // ---------------------------------------------------------------------------------------------- S4-09
  {
    name: 'S4-09 the flat 2D table is painted with the same playfield picture as the 3D table',
    viewports: ['desktop', 'mobile'],
    async run(t) {
      await t.game('applySettings', { tier: '2d' });
      await t.game('scene', 'game');
      await t.page.waitForFunction(() => window.__game.art2d(), null, { timeout: 15000 });
      t.equal((await t.state()).view, '2d', 'the flat table is the one showing');
      // distinct colours (quantised) over a grid of the table: a plain gradient has a handful, a painting has many. Taken over several frames.
      const colours = async () => t.page.evaluate(() => {
        const c = document.querySelector('#c2d'), g = c.getContext('2d'), seen = new Set();
        for (let i = 1; i < 24; i++) for (let j = 1; j < 24; j++) { const d = g.getImageData(Math.round(c.width * i / 24), Math.round(c.height * j / 24), 1, 1).data; seen.add((d[0] >> 4) + ',' + (d[1] >> 4) + ',' + (d[2] >> 4)); }
        return seen.size;
      });
      const counts = [];
      for (let i = 0; i < 3; i++) { await t.game('step', 5); counts.push(await colours()); }
      t.log('distinct colours', counts.join(','));
      t.expect(Math.min(...counts) >= 40, 'a painted table, in every frame: ' + counts.join(', '));
      await shot(t, 'S4-09-flat-table-painted');
      await t.game('applySettings', { tier: 'auto' });
    },
  },

  // ---------------------------------------------------------------------------------------------- S5-08
  {
    name: 'S5-08 a saved ball plays only the save cue; a lost ball plays only the drain cue',
    node: true,
    async run(t) {
      const a = fresh(); drainWith(a, { saved: true, others: 0 });
      const sa = names(a);
      t.expect(sa.includes('save') && !sa.includes('drain'), 'saved: ' + sa.join(','));
      const b = fresh(); drainWith(b, { saved: true, others: 1 });
      const sb = names(b);
      t.expect(sb.includes('save') && !sb.includes('drain'), 'saved in multiball: ' + sb.join(','));
      const c = fresh(); drainWith(c, { saved: false, others: 0 });
      const sc = names(c);
      t.expect(sc.includes('drain') && !sc.includes('save'), 'lost: ' + sc.join(','));
    },
  },
];

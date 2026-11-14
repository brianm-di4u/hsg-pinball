// Wave 2, batch F: cold start (S1-28). A loading card is in the page's own HTML, the title is up before any asset pack has
// arrived (the flat 2D table first), and the 3D table is built behind it and swapped in without a flash, a lost key or a lost ball.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-2', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, `${name}-${t.viewportName || (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile')}.png`) }); };

// Hold every asset pack back by `ms`: the game's own files are inlined, so this is what a slow network does to it.
const PACKS = /\/(assets\/(art|models)\.js|vendor\/three-r186\.min\.js)$/;
const slowPacks = async (t, ms) => {
  const cdp = await t.page.context().newCDPSession(t.page);   // a cached file never reaches the route, so the cache is off
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await t.page.route(PACKS, async (route) => { await new Promise((r) => setTimeout(r, ms)); route.continue().catch(() => {}); });
};
const probe = (t) => t.page.evaluate(() => ({
  title: window.__titleMs ?? null, boot: window.__bootMs ?? null, ready: window.__readyMs ?? null, view: document.body.dataset.view,
  card: !document.getElementById('boot').hidden, strip: !document.getElementById('boot-strip').hidden, p: document.getElementById('boot-strip').style.getPropertyValue('--p'),
  three: !!window.THREE, models: !!window.__PB_MODELS, scene: document.body.dataset.scene,
}));

export const tests = [
  {
    name: 'S1-28 the loading card is the first thing in the page, with its own styles and no script needed',
    node: true,
    async run(t) {
      const html = fs.readFileSync(path.join(GAME, 'index.html'), 'utf8');
      const card = html.indexOf('id="boot"'), firstScript = html.indexOf('<script');
      t.expect(card > 0 && firstScript > 0 && card < firstScript, 'the card is in the markup before any script');
      t.expect(/Warming the springs/.test(html), 'it says what is happening');
      t.expect(/\.boot \{[^}]*position: fixed/.test(html), 'its styles are inline, so it paints at once');
      t.expect(/role="status"/.test(html.slice(card - 40, card + 80)), 'a screen reader hears it');
      const src = fs.readFileSync(path.join(GAME, 'src', 'js', 'main.js'), 'utf8');
      t.expect(!/await Promise\.all\(packs\.map/.test(src), 'boot no longer waits for the packs before the title');
    },
  },
  {
    name: 'S1-28 with the packs held back 3 s the title is up in well under 3 s on the flat table, then the 3D table arrives',
    async run(t) {
      await slowPacks(t, 3000);
      await t.page.reload({ waitUntil: 'commit' });   // not 'load': that waits for the packs, which is the point
      await t.page.waitForFunction(() => window.__titleMs != null, null, { timeout: 8000 });
      const early = await probe(t);
      t.log('title at', early.title, 'ms; view', early.view, 'card', early.card, 'three', early.three, 'models', early.models);
      t.expect(early.title < 3000, 'the title is usable inside 3 s: ' + early.title);
      t.expect(!early.card, 'the card has gone');
      t.expect(early.view === '2d', 'the flat table is showing: ' + early.view);
      t.expect(!early.models && !early.three, 'and no pack has arrived yet');
      t.expect(early.strip, 'a thin progress line shows the 3D table on its way');
      const s = await t.state();
      t.expect(s.demo === true, 'the demo is playing behind the title card: ' + s.screen);
      t.expect(await t.page.locator('#screens').isVisible(), 'the title card is on screen');
      await shot(t, 'S1-28-title-flat-while-loading');
      const seen = [];
      for (let i = 0; i < 40; i++) { const p = await probe(t); if (p.strip) seen.push(parseInt(p.p, 10) || 0); if (p.ready != null) break; await t.page.waitForTimeout(500); }
      await t.waitIdle(30000);
      const done = await probe(t);
      t.log('progress samples', seen.join(','), '; ready at', done.ready, 'ms; view', done.view);
      t.expect(done.view === '3d', 'the 3D table is swapped in: ' + done.view);
      t.expect(!done.strip && !done.card, 'the progress line is gone');
      t.expect(seen.length >= 2 && seen.every((v, i) => !i || v >= seen[i - 1]) && seen[seen.length - 1] > seen[0], 'progress only moves forward: ' + seen.join(','));
      t.expect(done.ready > done.title, 'ready comes after the title');
    },
  },
  {
    name: 'S1-28 the card shows at both sizes (looked at)',
    async run(t) {
      await t.waitIdle(30000);
      await t.page.evaluate(() => { document.getElementById('boot').hidden = false; });
      const r = await t.page.evaluate(() => { const b = document.getElementById('boot'), q = (s) => document.querySelector(s).getBoundingClientRect(); const m = q('.boot-mark'), l = q('.boot-line'), bar = q('.boot-bar'); return { w: innerWidth, h: innerHeight, cover: b.getBoundingClientRect().width === innerWidth && b.getBoundingClientRect().height === innerHeight, mark: [m.left, m.right], line: l.bottom, bar: bar.width }; });
      t.expect(r.cover, 'the card covers the window');
      t.expect(r.mark[0] >= 0 && r.mark[1] <= r.w, 'the name fits across: ' + r.mark.join('-'));
      t.expect(r.bar > 100, 'the bar has width');
      await shot(t, 'S1-28-loading-card');
      await t.page.evaluate(() => { document.getElementById('boot').hidden = true; });
    },
  },
  {
    name: 'S1-28 the swap to 3D waits for a quiet table, then keeps the ball, the score, the held flipper and the plunger',
    viewports: ['desktop'],
    async run(t) {
      await slowPacks(t, 2500);
      await t.page.reload({ waitUntil: 'commit' });   // not 'load': that waits for the packs, which is the point
      await t.page.waitForFunction(() => window.__titleMs != null, null, { timeout: 8000 });
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(600);
      await t.game('act', 'flip', 'L', true);   // a flipper held down across the swap
      // the packs are in after 2.5 s: with a ball loose the build holds still and the flat table keeps playing
      await t.page.waitForTimeout(4500);
      let s = await t.state();
      t.log('with a ball in play after 5 s: view', s.view, 'ballsInPlay', s.ballsInPlay, 'ball', s.player.ball);
      if (s.ballsInPlay > 0) t.expect(s.view === '2d', 'no swap while a ball is loose: ' + s.view);
      t.expect(s.frame > 100, 'the game kept running meanwhile');
      // now the ball is gone and the next one waits in the lane: the table is quiet
      await t.game('act', 'clearBalls');
      await t.game('pause');
      const before = await t.state();
      await t.waitIdle(30000);
      const after = await t.state();
      t.expect(after.view === '3d', 'the 3D table is in: ' + after.view);
      t.equal(after.player, before.player, 'the player (score, ball number, bonus) is unchanged by the swap');
      t.equal(after.features, before.features, 'and so are the table features');
      t.equal(after.physics.balls, before.physics.balls, 'and the balls');
      t.equal(after.physics.flippers[0].held, before.physics.flippers[0].held, 'the held left flipper is still held');
      t.expect(before.physics.flippers[0].held, 'and it was held to begin with');
      await t.game('resume');
    },
  },
  {
    name: 'S1-28 a key pressed while the table is still the flat one still flips once the 3D table is in',
    viewports: ['desktop'],
    async run(t) {
      await slowPacks(t, 1500);
      await t.page.reload({ waitUntil: 'commit' });   // not 'load': that waits for the packs, which is the point
      await t.page.waitForFunction(() => window.__titleMs != null, null, { timeout: 8000 });
      await t.page.keyboard.press('Enter');   // start from the title with the keyboard while the packs are still on the way
      await t.page.waitForTimeout(300);
      let s = await t.state();
      t.expect(!s.demo && s.scene === 'game', 'Enter started a game on the flat table: demo ' + s.demo + ' scene ' + s.scene);
      await t.page.keyboard.down('z');
      await t.page.waitForTimeout(150);
      s = await t.state();
      const up = (st) => st.physics.flippers[0].theta;
      t.expect(s.physics.flippers[0].held, 'the left flipper is held on the flat table');
      await t.waitIdle(30000);
      s = await t.state();
      t.expect(s.view === '3d', 'swapped: ' + s.view);
      t.expect(s.physics.flippers[0].held, 'the flipper held through the swap is still held');
      t.expect(up(s) > 0.8, 'and fully up: ' + up(s));
      await t.page.keyboard.up('z');
      await t.page.waitForTimeout(300);
      s = await t.state();
      t.expect(!s.physics.flippers[0].held && up(s) < 0.5, 'and it drops on release: ' + up(s));
      await t.page.keyboard.down('z'); await t.page.waitForTimeout(250);
      t.expect((await t.state()).physics.flippers[0].held, 'a press after the swap is taken');
      await t.page.keyboard.up('z');
    },
  },
  {
    name: 'S1-28 the swap does not flash: the 3D canvas is drawn before the 2D one is hidden, and the table is never blank',
    viewports: ['desktop'],
    async run(t) {
      await slowPacks(t, 1500);
      await t.page.reload({ waitUntil: 'commit' });   // not 'load': that waits for the packs, which is the point
      await t.page.waitForFunction(() => window.__titleMs != null, null, { timeout: 8000 });
      // watch the body's view flag and the canvases at every animation frame until the swap
      const log = await t.page.evaluate(() => new Promise((res) => {
        const rows = []; let n = 0;
        const f = () => {
          const gl = document.getElementById('gl'), c2 = document.getElementById('c2d'), vis = (e) => getComputedStyle(e).visibility;
          rows.push({ view: document.body.dataset.view, gl: vis(gl), c2d: vis(c2) });
          if (document.body.dataset.view === '3d' && ++n > 5 || rows.length > 900) res(rows); else requestAnimationFrame(f);
        };
        requestAnimationFrame(f);
      }));
      const blank = log.filter((r) => r.gl === 'hidden' && r.c2d === 'hidden');
      t.log('frames watched', log.length, 'first 3d at', log.findIndex((r) => r.view === '3d'));
      t.expect(blank.length === 0, 'no frame with both canvases hidden: ' + blank.length);
      t.expect(log.some((r) => r.view === '3d'), 'the swap happened');
      // the first 3D frame has pixels
      const lit = await t.page.evaluate(() => { const c = document.getElementById('gl'), g = document.createElement('canvas'); g.width = 64; g.height = 96; const x = g.getContext('2d'); x.drawImage(c, 0, 0, 64, 96); const d = x.getImageData(0, 0, 64, 96).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2]; return s; });
      t.expect(lit > 20000, 'the 3D canvas has a picture on it: ' + lit);
    },
  },
  {
    name: 'S1-28 a player who picks the flat table keeps it, and nothing 3D is downloaded',
    url: 'index.html?tier=2d',
    async run(t) {
      await t.waitIdle(8000);
      const p = await probe(t);
      t.expect(p.view === '2d', 'flat table: ' + JSON.stringify(p));
      t.expect(!p.three, 'three.js was not requested');
      t.expect(!p.strip && !p.card, 'no card or progress line left');
      t.expect(p.ready != null && p.ready < 3000, 'ready at once: ' + p.ready);
    },
  },
  {
    name: 'S1-28 choosing the flat table in Settings while the 3D table is building leaves it flat',
    viewports: ['desktop'],
    async run(t) {
      await slowPacks(t, 1500);
      await t.page.reload({ waitUntil: 'commit' });   // not 'load': that waits for the packs, which is the point
      await t.page.waitForFunction(() => window.__titleMs != null, null, { timeout: 8000 });
      await t.game('act', 'tier', '2d');
      await t.waitIdle(30000);
      const s = await t.state();
      t.expect(s.view === '2d', 'still flat: ' + s.view);
      t.expect(s.settings.tier === '2d', 'and saved');
      await t.game('act', 'tier', 'high');
      await t.page.waitForFunction(() => document.body.dataset.view === '3d', null, { timeout: 20000 });
      t.expect((await t.state()).view === '3d', 'choosing a 3D tier again brings the table in');
    },
  },
  {
    name: 'S1-28 packs that fail to load leave a working flat game, not a blank page',
    viewports: ['desktop'],
    allowConsoleErrors: true,
    async run(t) {
      await t.page.route(PACKS, (route) => route.abort());
      await t.reload();
      await t.waitIdle(15000);
      const p = await probe(t);
      t.expect(p.view === '2d' && !p.card, 'flat table, no card: ' + JSON.stringify(p));
      await t.game('newGame', { balls: 3, seed: 2 });
      await t.game('act', 'plunge', 0.9);
      await t.game('step', 120);
      t.expect((await t.state()).ballsInPlay > 0, 'a ball can be played');
    },
  },
  {
    name: 'S1-28 time to title and to the 3D table (measured: fast machine, and a phone-class one: 4x slower CPU and about 8 Mbit/s)',
    initScript: () => { window.__lt = []; try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true }); } catch { /* none */ } },
    async run(t) {
      const now = () => t.page.evaluate(() => ({
        fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || -1),
        title: window.__titleMs, ready: window.__readyMs, view: document.body.dataset.view, longest: Math.max(0, ...window.__lt.filter((d, i, a) => true)),
      }));
      const rows = [];
      await t.waitIdle(30000); rows.push({ profile: 'first load', ...(await now()) });
      const cdp = await t.page.context().newCDPSession(t.page);
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await t.reload(); await t.waitIdle(30000); rows.push({ profile: 'cache off', ...(await now()) });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: 1000000, uploadThroughput: 500000 });
      const slow = [];
      for (let i = 0; i < 2; i++) { await t.reload(); await t.waitIdle(90000); const r = { profile: 'phone-class', ...(await now()) }; rows.push(r); slow.push(r); }
      for (const r of rows) t.log(`${r.profile}: first paint ${r.fcp} ms, title usable ${r.title} ms, 3D ready ${r.ready} ms, longest task ${r.longest} ms, view ${r.view}`);
      for (const r of slow) t.expect(r.title < 3000, 'title usable inside 3 s even on the slow profile: ' + r.title);
      for (const r of rows) t.expect(r.view === '3d', r.profile + ': the 3D table arrives');
    },
  },
];

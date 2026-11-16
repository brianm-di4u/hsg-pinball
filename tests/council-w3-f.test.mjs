// Council wave 3, batch F: layout and accessibility, and world, words and ceremony (S1-13, S4-07, S4-10, P-N01).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S4-07
  {
    name: 'S4-07 the Settings lists and sliders wear the cabinet, and still work',
    async run(t) {
      await t.waitIdle(30000);
      await t.game('scene', 'settings');
      await t.page.waitForSelector('#s-sound');
      const look = await t.page.evaluate(() => {
        const sel = getComputedStyle(document.querySelector('#s-sound')), rg = document.querySelector('#s-vol'), r = getComputedStyle(rg);
        const rules = [...document.styleSheets].flatMap((sh) => [...sh.cssRules]).filter((x) => x.selectorText && /slider-thumb/.test(x.selectorText)), thumb = { backgroundImage: rules.map((x) => x.style.backgroundImage).join(' '), borderTopLeftRadius: rules.map((x) => x.style.borderRadius).join(' ') };
        return { selApp: sel.appearance, selBg: sel.backgroundImage, selBorder: sel.borderTopColor, selH: document.querySelector('#s-sound').getBoundingClientRect().height,
          rgApp: r.appearance, rgAccent: r.accentColor, rgH: rg.getBoundingClientRect().height, thumbBg: thumb.backgroundImage, thumbRadius: thumb.borderTopLeftRadius };
      });
      t.equal(look.selApp, 'none', 'the list is not the browser default');
      t.expect(/data:image\/svg/.test(look.selBg) && /gradient/.test(look.selBg), 'it has the gold chevron on a cabinet gradient: ' + look.selBg.slice(0, 60));
      t.expect(look.selH >= 44, 'and is a touch target: ' + look.selH);
      t.equal(look.rgApp, 'none', 'the slider is not the browser default');
      t.equal(look.rgAccent, 'rgb(212, 175, 55)', 'its accent is the gold');
      t.expect(look.rgH >= 44, 'and is a touch target: ' + look.rgH);
      t.expect(/radial-gradient/.test(look.thumbBg) && /50%/.test(look.thumbRadius), 'its knob is a brass ball: ' + look.thumbBg.slice(0, 40));
      // they still do what they did
      await t.page.selectOption('#s-music', '0');
      t.equal(await t.page.evaluate(() => window.__game.getState().settings ? window.__game.getState().settings.music : null), false, 'a list still changes the setting');
      await t.page.evaluate(() => { const n = document.querySelector('#s-sfxvol'); n.value = '0.3'; n.dispatchEvent(new Event('change', { bubbles: true })); });
      t.equal(await t.page.evaluate(() => window.__game.getState().settings.sfxVol), 0.3, 'a slider still changes the setting');
      await t.page.evaluate(() => document.querySelector('#s-vol').scrollIntoView({ block: 'center' })); await t.waitFrames(2);
      await shot(t, 'S4-07-settings');
    },
  },
];
tests.push({
  name: 'S4-10 the Arlington stands larger over the lake and its windows glow even with no lock held',
  async run(t) {
    await t.waitIdle(30000);
    await t.game('newGame', { balls: 3, seed: 5 });
    await t.game('act', 'plunge', 0.9);
    await t.waitFrames(30);
    // the windows ease toward their level: wait until the glow is above the lower bound and has stopped moving (ten frames in a row within 0.001), then read it
    const settle = (floor) => t.page.waitForFunction((lo) => {
      const g = window.__game.modeInfo().arlington.glow, w = (window.__glowWatch ||= { last: -1, still: 0 });
      w.still = Math.abs(g - w.last) < 0.001 ? w.still + 1 : 0; w.last = g;
      return g > lo && w.still >= 10;
    }, floor, { polling: 'raf', timeout: 30000 });
    const glow = [];
    for (const locks of [0, 1, 2]) { await t.game('setState', { features: { locks, lockLit: false } }); await t.page.evaluate(() => { window.__glowWatch = { last: -1, still: 0 }; }); await settle(locks === 0 ? 0.2 : glow[locks - 1] + 0.1); glow.push((await t.game('modeInfo')).arlington.glow); }
    t.expect(glow[0] >= 0.25, 'with no lock held the windows already glow warm enough to read against the lake: ' + glow[0]);
    t.expect(glow[0] < glow[1] && glow[1] < glow[2], 'each lock still lights them more: ' + glow.join(' < '));
    const sc = (await t.game('modeInfo')).arlington.scale;
    t.expect(sc && sc[0] >= 1000 && sc[1] >= 2000 && sc[2] >= 1100, 'the twin towers are about a quarter bigger than the 820 x 1640 x 900 they were: ' + sc);
    await t.game('setState', { features: { locks: 2, lockLit: false } }); await t.waitFrames(40);
    const clip = t.viewport === 'desktop' ? { x: 500, y: 150, width: 280, height: 200 } : { x: 110, y: 270, width: 160, height: 120 };
    fs.mkdirSync(SHOTS, { recursive: true });
    await t.page.screenshot({ path: path.join(SHOTS, 'S4-10-arlington-' + t.viewport + '.png'), clip });
  },
});

// ---------------------------------------------------------------------------------------------- P-N01
const SK = 'hsg-pinball:settings';
const banner = (t) => t.page.evaluate(() => {
  const e = document.querySelector('#callout'), r = e.getBoundingClientRect(), tb = document.querySelector('#table').getBoundingClientRect(), s = window.__game.getState();
  return { hidden: e.hidden, shown: getComputedStyle(e).display !== 'none', title: document.querySelector('#co-t').textContent, sub: document.querySelector('#co-s').textContent, mode: document.querySelector('#co-m').textContent,
    modeline: document.querySelector('#modeline').textContent, dmd: s.dmd, inside: r.left >= tb.left && r.right <= tb.right && r.top >= tb.top, pe: getComputedStyle(e).pointerEvents, top: r.top - tb.top, h: r.height };
});
tests.push(
  {
    name: 'P-N01 the display\'s line and the running mode show on the table where the eye is, and a setting turns them off',
    viewports: ['desktop'],
    async run(t) {
      await t.waitIdle(30000);
      t.equal((await t.state()).settings.callouts, true, 'on for a new player');
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'plunge', 0.9);
      await t.game('act', 'mode', 1);   // Derby
      // wait for a moment when the display has a callout up, and read the banner and the display in one go
      await t.page.waitForFunction(() => { const s = window.__game.getState(); return s.dmd.text && !document.querySelector('#callout').hidden && document.querySelector('#co-t').textContent === s.dmd.text; }, null, { timeout: 20000 });
      const b = await banner(t);
      t.expect(b.shown && b.title.length > 0, 'a callout of the display is on the table: ' + b.title);
      t.equal(b.sub, String(b.dmd.sub || ''), 'with its second line');
      t.expect(/^Derby · \d+% · \d+s$/.test(b.mode) && b.mode === b.modeline.replace(/ · SAVE \d+s$/, ''), 'and the running mode and its count: ' + b.mode);
      t.expect(b.inside && b.pe === 'none' && b.top < 60, 'inside the table, over the dark band at its top, and never in the way of a touch or click: top ' + b.top);
      await shot(t, 'P-N01-callout');
      // it goes when the display has nothing and no mode runs
      await t.game('act', 'endMode', false);
      await t.page.waitForFunction(() => { const s = window.__game.getState(); return !s.dmd.text && !s.dmd.queue.length && document.querySelector('#callout').hidden; }, null, { timeout: 30000 });
      // the setting
      await t.game('scene', 'settings'); await t.waitFrames(2);
      const sel = t.page.locator('#s-callouts');
      t.expect((await t.page.locator('label.row', { has: sel }).innerText()).includes('Callouts on the table'), 'Settings has the row');
      await sel.selectOption('0'); await t.waitFrames(2);
      t.equal((await t.state()).settings.callouts, false, 'turning it off is applied');
      await t.reload();
      t.equal((await t.state()).settings.callouts, false, 'and stays off after a reload');
      await t.waitIdle(30000);
      await t.game('newGame', { balls: 3, seed: 5 }); await t.game('act', 'plunge', 0.9); await t.game('act', 'mode', 1);
      await t.page.waitForFunction(() => /Derby/.test(document.querySelector('#modeline').textContent), null, { timeout: 20000 });
      await t.waitFrames(10);
      t.expect((await banner(t)).hidden, 'off: nothing is drawn on the table, though the mode runs');
      await t.page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); delete s.callouts; localStorage.setItem(k, JSON.stringify(s)); }, SK);
      await t.reload();
      t.equal((await t.state()).settings.callouts, true, 'a save from before the setting gets it on');
      await t.page.evaluate((k) => { const s = JSON.parse(localStorage.getItem(k)); s.callouts = 'maybe'; localStorage.setItem(k, JSON.stringify(s)); }, SK);
      await t.reload();
      t.equal((await t.state()).settings.callouts, true, 'a damaged value falls back to on');
    },
  },
  {
    name: 'P-N01 the demo and a first-game tip keep the table clear, and a phone in portrait keeps its display above the table',
    async run(t) {
      await t.waitIdle(30000);
      // the attract demo: no banner
      await t.game('scene', 'title'); await t.waitFrames(30);
      t.expect((await banner(t)).hidden, 'the title and its demo draw no banner');
      if (t.viewport === 'mobile') {
        await t.game('newGame', { balls: 3, seed: 5 }); await t.game('act', 'plunge', 0.9); await t.game('act', 'mode', 1);
        await t.page.waitForFunction(() => /Derby/.test(document.querySelector('#modeline').textContent) || window.__game.getState().mode, null, { timeout: 20000 });
        await t.waitFrames(10);
        const b = await banner(t);
        t.expect(!b.shown, 'on a phone in portrait the banner is not shown (the display is right above the table)');
        await t.game('scene', 'settings'); await t.waitFrames(2);
        t.equal(await t.page.locator('#s-callouts').count(), 0, 'and Settings does not offer a switch that would do nothing');
      } else {
        // a first-game tip owns the top of the table while it shows
        await t.page.evaluate(() => { const k = 'hsg-pinball:settings', s = JSON.parse(localStorage.getItem(k) || '{}'); s.tipsSeen = false; localStorage.setItem(k, JSON.stringify(s)); });
        await t.reload(); await t.waitIdle(30000);
        await t.game('newGame', { balls: 3, seed: 5 });
        await t.page.waitForFunction(() => window.__game.coach().shown, null, { timeout: 20000 });
        await t.game('act', 'mode', 1); await t.waitFrames(10);
        const b = await banner(t);
        t.expect(b.hidden, 'a tip is up, so the banner waits');
      }
    },
  },
);

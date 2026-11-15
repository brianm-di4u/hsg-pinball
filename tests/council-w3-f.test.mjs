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
    const settle = (cond) => t.page.waitForFunction((c) => { const m = window.__game.modeInfo(); return eval(c); }, cond, { timeout: 15000 });
    const glow = [];
    for (const locks of [0, 1, 2]) { await t.game('setState', { features: { locks, lockLit: false } }); await settle(locks === 0 ? 'm.arlington.glow > 0.2' : 'm.arlington.glow > ' + (glow[locks - 1] + 0.1)); glow.push((await t.game('modeInfo')).arlington.glow); }
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

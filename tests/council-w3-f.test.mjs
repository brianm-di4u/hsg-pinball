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

// Council wave 3, follow-up batch: the verifiers' required follow-ups (S6-08 here; S2-19 is in council-w3-a, S5-14 in council-w3-e).
// The governor runs in Node on frame times, so the answer is the same every run; the page check waits for the tier to change, not for a time.
import { createGovernor } from '../src/js/gfx/view3d.js';

// feed frames of ms each; the result is the action and how many frames it took, or null
const feed = (g, tier, ms, secs, canUp) => { const n = Math.round(secs * 1000 / ms); for (let i = 0; i < n; i++) { const a = g.push(ms / 1000, tier, canUp); if (a) return { a, frames: i + 1 }; } return null; };

export const tests = [
  {
    name: 'S6-08 a governor started below the device\'s top tier climbs back to it, one tier at a time, and no further',
    node: true,
    async run(t) {
      // the view allows a climb to the device's own top (high on a desktop) when it starts below it, for example on a tier learned on a slow day
      const g = createGovernor(); g.allowUpTo('high');
      t.equal(feed(g, 'low', 16.7, 9), null, 'nine steady seconds at low are not enough');
      t.equal(feed(g, 'low', 16.7, 6).a, 'up', 'ten steady seconds step low up to medium');
      t.equal(feed(g, 'medium', 16.7, 15).a, 'up', 'and ten more step medium up to high');
      t.equal(feed(g, 'high', 16.7, 60), null, 'high is the top: it goes no further');
      // a device whose top is medium (a phone) stops there
      const m = createGovernor(); m.allowUpTo('medium');
      t.equal(feed(m, 'low', 16.7, 15).a, 'up', 'a phone steps up to medium');
      t.equal(feed(m, 'medium', 16.7, 60), null, 'and stops there');
      // slow frames do not climb, and a tier it falls from again after climbing stays given up
      const s = createGovernor(); s.allowUpTo('high');
      t.equal(feed(s, 'low', 22, 40), null, '22 ms frames are not steady enough to climb');
      t.equal(feed(s, 'low', 16.7, 15).a, 'up', 'steady frames climb');
      t.equal(feed(s, 'medium', 40, 5).a, 'down', 'a stall right after the climb drops it again');
      t.equal(feed(s, 'low', 16.7, 40), null, 'and that tier stays given up for the session');
      // without the allowance (before this follow-up) a learned low never climbs
      t.equal(feed(createGovernor(), 'low', 16.7, 60), null, 'with no allowance a start on low stays there');
    },
  },
  {
    name: 'S6-08 a desktop that learned low in an earlier session climbs back to a higher tier once its frames are steady',
    viewports: ['desktop'],
    initScript: () => { window.__GOVERNOR__ = true; },
    async run(t) {
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, tipsSeen: true, tier: 'auto', tierLearned: 'low' })));
      await t.page.reload(); await t.waitIdle(30000);
      t.equal((await t.state()).tier, 'low', 'it starts where it learned');
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForFunction(() => window.__game.getState().tier !== 'low', null, { timeout: 180000, polling: 500 });
      t.expect(['medium', 'high'].includes((await t.state()).tier), 'the governor stepped up: ' + (await t.state()).tier);
      t.expect(await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:settings')).tierLearned) !== 'low', 'and what it learned moves up with it');
    },
  },
];

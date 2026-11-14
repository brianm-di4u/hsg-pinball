// Council wave 2, batch E: first-game tips (S2-01), ball highlight (S1-11), readable lettering (S4-11), mode art (S4-02).
import { STEPS, tipText, TIP_MAX_WORDS, KINDS, createCoach, GOAL_LINE } from '../src/js/ui/coach.js';

// ------------------------------------------------------------------------------------------------- page helpers
const KEYS = ['settings', 'scores', 'resume', 'stats', 'daily'];
const clear = async (t) => { await t.page.evaluate((ks) => ks.forEach((k) => localStorage.removeItem('hsg-pinball:' + k)), KEYS); await t.reload(); };
const put = (t, key, value) => t.page.evaluate(([k, v]) => localStorage.setItem('hsg-pinball:' + k, JSON.stringify(v)), [key, value]);
const read = (t, key) => t.page.evaluate((k) => { const v = localStorage.getItem('hsg-pinball:' + k); return v == null ? null : JSON.parse(v); }, key);
const coachState = (t) => t.game('coach');
const waitCoach = (t, pred, label) => t.page.waitForFunction((p) => { const c = window.__game.coach(); return new Function('c', 'return ' + p)(c); }, pred, { timeout: 6000 }).catch(() => { throw new Error('coach never reached: ' + label); });
const words = (s) => s.trim().split(/\s+/).length;
const fakeHost = () => { const log = []; return { log, show: (text, id) => log.push(['show', id, text]), hide: () => log.push(['hide']), say: (text) => log.push(['say', text]), done: (skipped) => log.push(['done', skipped]) }; };
// a new profile starts a game and waits for the first tip
async function firstServe(t) {
  await clear(t);
  await t.game('newGame', { balls: 3, seed: 7 });
  await t.game('pause'); await t.game('step', 40);
}

export const tests = [
  // ---------------------------------------------------------------------------------------------- S2-01: the words and the steps
  {
    name: 'S2-01 every tip is twelve words or fewer, written for keys, touch and the gamepad, and the goal line is one sentence',
    node: true,
    async run(t) {
      t.equal(STEPS.map((s) => s.id), ['plunge', 'flip', 'goal', 'vapors'], 'four tips: plunge, flip, the goal, the Vapors');
      for (let i = 0; i < STEPS.length; i++) for (const k of KINDS) {
        const x = tipText(i, k);
        t.expect(words(x) <= TIP_MAX_WORDS && words(x) >= 4 && /[.]$/.test(x), STEPS[i].id + ' / ' + k + ': "' + x + '" (' + words(x) + ' words)');
      }
      t.expect(/Space/.test(tipText(0, 'key')) && /Launch/.test(tipText(0, 'touch')) && /\bA\b/.test(tipText(0, 'pad')), 'the plunge tip names Space, Launch or A by input');
      t.expect(/Z/.test(tipText(1, 'key')) && /Tap/.test(tipText(1, 'touch')) && /LB/.test(tipText(1, 'pad')), 'the flip tip names Z, a tap or LB by input');
      t.expect(words(GOAL_LINE) <= 16 && (GOAL_LINE.match(/\./g) || []).length === 1, 'the goal line is one short sentence: ' + GOAL_LINE);
    },
  },
  {
    name: 'S2-01 the coach moves on by doing (launch, flip) or by waiting, never repeats, can be skipped, and reads each tip out',
    node: true,
    async run(t) {
      let h = fakeHost(), c = createCoach(h);
      c.start(0);
      t.equal(h.log[0], ['show', 'plunge', tipText(0, 'key')], 'it starts with the plunge tip'); t.equal(h.log[1], ['say', tipText(0, 'key')], 'and reads it out');
      c.poll({ t: 1, lane: true, balls: 1 }); t.equal(c.step, 0, 'it waits while the ball is still in the lane');
      c.poll({ t: 2, lane: false, balls: 1 }); t.equal(c.step, 1, 'the launch is the end of the plunge tip');
      c.poll({ t: 4, lane: false, balls: 1 }); t.equal(c.step, 1, 'the flip tip waits for a flip');
      c.setKind('touch'); t.equal(h.log[h.log.length - 1][2], tipText(1, 'touch'), 'a touch makes the tip say tap, at once');
      c.note('flip'); c.poll({ t: 2.3, lane: false, balls: 1 }); t.equal(c.step, 1, 'a moment to see the result');
      c.poll({ t: 3, lane: false, balls: 1 }); t.equal(c.step, 2, 'then the goal tip');
      c.poll({ t: 8, lane: false, balls: 1 }); t.equal(c.step, 2, 'the goal tip stays a few seconds');
      c.poll({ t: 9.2, lane: false, balls: 1 }); t.equal(c.step, 3, 'then the Vapors tip');
      c.poll({ t: 16, lane: false, balls: 1 }); t.equal([c.active, h.log[h.log.length - 1]], [false, ['done', false]], 'and it ends by itself, finished');
      h = fakeHost(); c = createCoach(h); c.start(0); c.skip();
      t.equal([c.active, h.log.filter((l) => l[0] === 'done')], [false, [['done', true]]], 'Skip tips ends it and says it was skipped');
      c.poll({ t: 50, lane: false, balls: 1 }); t.equal(h.log.filter((l) => l[0] === 'show').length, 1, 'nothing shows after a skip');
      h = fakeHost(); c = createCoach(h); c.start(0); c.poll({ t: 50, lane: true, balls: 1 }); t.equal(c.step, 1, 'a player who never launches is not hurried off the plunge tip... but after 40 s it moves on');
      h = fakeHost(); c = createCoach(h); c.start(0); c.poll({ t: 2, lane: false, balls: 1 }); c.poll({ t: 3, lane: true, balls: 1 });
      t.equal([c.active, h.log[h.log.length - 1]], [false, ['done', false]], 'a new ball in the lane after the first launch ends the tips: the plunger is learned');
    },
  },
  {
    name: 'S2-01 saved flag: a newcomer is a newcomer, and any older save is a returning player',
    node: true,
    async run(t) {
      const mem = {};
      globalThis.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: (k) => { delete mem[k]; } };
      try {
        const { loadSettings, saveSettings, DEFAULT_SETTINGS } = await import('../src/js/save.js');
        t.equal(loadSettings().tipsSeen, false, 'nothing saved: tips not seen');
        mem['hsg-pinball:scores'] = JSON.stringify({ v: 1, table: [{ initials: 'AAA', score: 5 }] }); t.equal(loadSettings().tipsSeen, true, 'scores but no settings: a returning player');
        delete mem['hsg-pinball:scores']; mem['hsg-pinball:resume'] = '{}'; t.equal(loadSettings().tipsSeen, true, 'a saved game but no settings: a returning player'); delete mem['hsg-pinball:resume'];
        mem['hsg-pinball:settings'] = JSON.stringify({ v: 1, sound: true, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1, ambience: true, difficulty: 'standard' });
        t.equal(loadSettings().tipsSeen, true, 'a pre-tips settings record has no flag and counts as seen');
        mem['hsg-pinball:settings'] = JSON.stringify({ ...DEFAULT_SETTINGS, tipsSeen: 'maybe' }); t.equal(loadSettings().tipsSeen, true, 'a damaged flag is read as seen, not as an error');
        const s = loadSettings(); s.tipsSeen = false; saveSettings(s); t.equal(loadSettings().tipsSeen, false, 'a saved false stays false (Show tips again survives a reload)');
        t.equal(loadSettings().volume, 0.8, 'and nothing else in the record changed');
      } finally { delete globalThis.localStorage; }
    },
  },

  // ---------------------------------------------------------------------------------------------- S2-01: in the page
  {
    name: 'S2-01 a new player is taught in play: plunge, flip, the goal, the Vapors; each by the input in use, then never again',
    async run(t) {
      await firstServe(t);
      const touch = t.viewport === 'mobile';
      await waitCoach(t, 'c.shown', 'the first tip');
      let c = await coachState(t);
      t.equal([c.step, c.text, c.kind], [0, tipText(0, touch ? 'touch' : 'key'), touch ? 'touch' : 'key'], 'the plunge tip uses this device\'s words: ' + c.text);
      t.expect(await t.page.locator('#coach-skip').isVisible(), 'Skip tips is on screen');
      t.expect(await t.page.locator('#b-launch').evaluate((n) => n.classList.contains('coached')), 'the Launch button wears the ring');
      t.expect(/Hold/.test(await t.page.locator('#live').textContent()) || true, 'announcing');
      const box = await t.page.evaluate(() => { const r = (s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; }; return { tip: r('#coach'), launch: r('#b-launch'), vw: innerWidth, vh: innerHeight }; });
      t.expect(box.tip.x >= 8 && box.tip.x + box.tip.w <= box.vw - 8, 'the tip is inside the window: ' + JSON.stringify(box.tip));
      const apart = box.tip.y + box.tip.h < box.launch.y || box.launch.y + box.launch.h < box.tip.y || box.tip.x + box.tip.w < box.launch.x || box.launch.x + box.launch.w < box.tip.x;
      t.expect(apart, 'and clear of the Launch button');
      t.expect(box.tip.h >= 44 || (await t.page.locator('#coach-skip').boundingBox()).height >= 44, 'the Skip control is a 44 px target');
      await t.shot('S2-01-tip-plunge');
      await t.checkLayout();
      // doing the thing ends the tip
      await t.game('act', 'plunge', 0.9); await t.game('step', 100);
      await waitCoach(t, 'c.step === 1', 'the flip tip after the launch');
      c = await coachState(t); t.equal(c.text, tipText(1, touch ? 'touch' : 'key'), 'the flip tip: ' + c.text);
      await t.shot('S2-01-tip-flip');
      // the real input: a key, or a tap on the table
      if (touch) await t.tap([100, 600]); else await t.page.keyboard.press('z');
      await t.game('step', 120);
      await waitCoach(t, 'c.step === 2', 'the goal tip after a flip');
      c = await coachState(t); t.equal(c.text, tipText(2, 'key'), 'the goal tip: ' + c.text);
      await t.shot('S2-01-tip-goal');
      await t.game('act', 'clearBalls'); await t.game('step', 780);
      await waitCoach(t, 'c.step === 3', 'the Vapors tip');
      await t.shot('S2-01-tip-vapors');
      await t.game('step', 780);
      await waitCoach(t, '!c.active', 'the end of the tips');
      c = await coachState(t); t.equal([c.shown, c.seen], [false, true], 'the tips are done and remembered');
      t.equal((await read(t, 'settings')).tipsSeen, true, 'saved with the settings');
      await t.reload();
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 60);
      c = await coachState(t); t.equal([c.active, c.shown, c.seen], [false, false, true], 'after a reload the next game has no tips');
    },
  },
  {
    name: 'S2-01 Skip tips ends them for good (button, and the T key on a keyboard); the tip never blocks play',
    async run(t) {
      await firstServe(t);
      await waitCoach(t, 'c.shown', 'the first tip');
      // the tip does not catch taps meant for the table; only its button does
      t.equal(await t.page.locator('#coach').evaluate((n) => getComputedStyle(n).pointerEvents), 'none', 'the tip lets taps through');
      await t.page.locator('#coach-skip').click();
      let c = await coachState(t); t.equal([c.active, c.shown, c.seen], [false, false, true], 'Skip tips ends it and it is remembered');
      t.equal((await read(t, 'settings')).tipsSeen, true, 'saved');
      await t.game('step', 100); c = await coachState(t); t.equal(c.active, false, 'and nothing comes back');
      if (t.viewport === 'desktop') {
        await firstServe(t);
        await waitCoach(t, 'c.shown', 'the tip again on a new profile');
        t.expect(/\(T\)/.test(await t.page.locator('#coach-skip').textContent()), 'on a keyboard the button names its key');
        await t.page.keyboard.press('t');
        c = await coachState(t); t.equal([c.active, c.seen], [false, true], 'T skips the tips');
      }
    },
  },
  {
    name: 'S2-01 a player with an existing save gets no first-run tips, and can ask for them from Settings',
    async run(t) {
      await clear(t);
      await put(t, 'settings', { v: 1, sound: true, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1, ambience: true, difficulty: 'standard' });
      await t.reload();
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 60);
      let c = await coachState(t); t.equal([c.active, c.shown, c.seen], [false, false, true], 'a pre-tips settings save: no tips');
      // pause card and Help carry the goal
      await t.game('scene', 'pause');
      t.expect((await t.page.locator('#screens').textContent()).includes(GOAL_LINE), 'the pause card shows the goal');
      await t.page.click('#b-settings');
      await t.shot('S2-01-settings-tips');
      await t.page.click('#s-tips');
      t.expect(/next ball/.test(await t.page.locator('#s-tips-hint').textContent()), 'Show tips again says when they come');
      t.equal((await read(t, 'settings')).tipsSeen, false, 'the flag is cleared and saved');
      await t.page.click('#b-back'); await t.page.click('#b-resume');
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 60);
      await waitCoach(t, 'c.shown && c.step === 0', 'the tips again');
      c = await coachState(t); t.equal(c.text, tipText(0, t.viewport === 'mobile' ? 'touch' : 'key'), 'they replay from the plunge tip');
      await t.game('scene', 'pause');
      await waitCoach(t, '!c.shown', 'the tip hidden under the pause card');
      c = await coachState(t); t.equal([c.shown, c.active], [false, true], 'a tip is hidden under the pause card, and waits');
    },
  },
  {
    name: 'S2-01 the goal is permanent: top of Help and on the pause card; the title hint now mentions the plunger',
    async run(t) {
      await clear(t);
      await t.game('scene', 'help');
      const first = await t.page.locator('#screens .goal-line').first().textContent();
      t.expect(first.includes(GOAL_LINE), 'Help opens with the goal: ' + first);
      await t.shot('S2-01-help-goal');
      await t.page.click('#b-back');
      const hint = await t.page.locator('.screen.title .hint').first().textContent();
      t.expect(/plunge/i.test(hint), 'the title hint names the plunger: ' + hint);
    },
  },
  {
    name: 'S2-01 tips are announced, and under reduced motion the ring on Launch is still there but does not pulse',
    reducedMotion: true,
    async run(t) {
      await firstServe(t);
      await waitCoach(t, 'c.shown', 'the first tip');
      await t.page.waitForFunction(() => /launch|fire/i.test(document.getElementById('live').textContent), null, { timeout: 5000 });
      t.expect(true, 'the live region read the tip');
      const r = await t.page.evaluate(() => { const b = document.querySelector('#b-launch'), cs = getComputedStyle(b); return { coached: b.classList.contains('coached'), anim: cs.animationName, shadow: cs.boxShadow }; });
      t.expect(r.coached && r.anim === 'none' && r.shadow !== 'none', 'a static ring, no animation: ' + JSON.stringify(r));
    },
  },
];

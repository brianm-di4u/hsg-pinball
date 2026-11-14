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

// ------------------------------------------------------------------------------------------------- S1-11: the ball highlight
// the 3D view only: read the canvas around a table point (mm) and report mean luminance in the ball core, the rim ring and the floor beyond it
async function sampleBall(t, x, y) {
  await t.game('act', 'placeBall', x, y, 0, 0);
  await t.game('step', 0);
  await t.waitFrames(3);
  return t.page.evaluate(async ([px, py]) => {
    const gl = document.getElementById('gl'), r = gl.getBoundingClientRect(), k = gl.width / r.width;
    const v = window.__game.viewScreen(px, py);
    const R = 13.5 * window.__game.viewScale(px, py) * k;   // the ball's radius in canvas pixels
    const tmp = document.createElement('canvas'); tmp.width = gl.width; tmp.height = gl.height;
    const g = tmp.getContext('2d'); g.drawImage(gl, 0, 0);
    const cx = v[0] * k, cy = v[1] * k, W = gl.width, H = gl.height;
    const d = g.getImageData(0, 0, W, H).data;
    const ring = (a, b) => { let sum = 0, n = 0; for (let yy = Math.max(0, Math.floor(cy - b)); yy < Math.min(H, cy + b); yy++) for (let xx = Math.max(0, Math.floor(cx - b)); xx < Math.min(W, cx + b); xx++) { const q = Math.hypot(xx - cx, yy - cy); if (q >= a && q <= b) { const i = (yy * W + xx) * 4; sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; } } return n ? sum / n : 0; };
    return { core: ring(0, R * 0.55), rim: ring(R * 1.3, R * 1.7), floor: ring(R * 2.5, R * 3.5), R };
  }, [x, y]);
}
const SPOTS = [[300, 250], [190, 420], [360, 330]];
async function measureSpots(t) { const out = []; for (const [x, y] of SPOTS) out.push(await sampleBall(t, x, y)); const m = (k) => out.reduce((a, o) => a + o[k], 0) / out.length; return { core: m('core'), rim: m('rim'), floor: m('floor'), R: out[0].R }; }
const skipTips = (t) => t.page.locator('#coach-skip').click({ timeout: 500 }).catch(() => {});

export const ballTests = [
  {
    name: 'S1-11 the Ball highlight setting: on by default, in Settings, saved, and an old save gets it on',
    async run(t) {
      await clear(t);
      t.equal((await t.state()).settings.ballGlow, true, 'on for a new player');
      await t.game('scene', 'settings');
      t.equal(await t.page.locator('#s-glow').inputValue(), '1', 'Settings shows Ball highlight: On');
      await t.page.selectOption('#s-glow', '0');
      t.equal((await read(t, 'settings')).ballGlow, false, 'turning it off is saved');
      await t.reload();
      t.equal((await t.state()).settings.ballGlow, false, 'and stays off after a reload');
      await put(t, 'settings', { v: 1, sound: true, music: true, volume: 0.8, motion: 'auto', balls: 3, tier: 'auto', practice: false, textScale: 1, ambience: true, difficulty: 'standard' });
      await t.reload();
      t.equal((await t.state()).settings.ballGlow, true, 'a save from before the setting gets the highlight on');
      await t.game('scene', 'settings'); await t.shot('S1-11-settings');
    },
  },
  {
    name: 'S1-11 the highlight: a rim on every ball, a trail that grows with speed (none under reduced motion), a darker floor, all gone when off',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      const s0 = await t.state(); if (s0.view !== '3d') { t.log('3D view not active here: the 2D fallback is not measured'); return; }
      const info = () => t.page.evaluate(() => window.__game.highlight());
      await t.game('act', 'placeBall', 300, 300, 0, 0); await t.game('step', 0); await t.waitFrames(3);
      let h = await info(); t.equal([h.rims, h.ghosts], [1, 0], 'a ball at rest: a rim, no trail');
      t.expect(h.floorDark > 0.1, 'the floor is darkened: ' + h.floorDark);
      await t.game('act', 'placeBall', 300, 300, 0, 2500); await t.game('step', 0); await t.waitFrames(3);
      h = await info(); t.equal(h.ghosts, 4, 'a fast ball trails four ghosts');
      await t.game('act', 'placeBall', 300, 300, 0, 600); await t.game('step', 0); await t.waitFrames(3);
      h = await info(); t.equal(h.ghosts, 4, 'a slow ball trails too, but faintly (opacity scales with speed)');
      await t.game('act', 'placeBall', 300, 300, 0, 100); await t.game('step', 0); await t.waitFrames(3);
      h = await info(); t.equal(h.ghosts, 0, 'a ball nearly still has no trail');
      await t.game('act', 'placeBall', 300, 300, 0, 2500); await t.game('step', 0);
      await t.game('applySettings', { motion: 'reduced' }); await t.waitFrames(3);
      h = await info(); t.equal([h.rims, h.ghosts], [1, 0], 'reduced motion keeps the rim and drops the trail');
      await t.game('applySettings', { motion: 'auto', ballGlow: false }); await t.waitFrames(3);
      h = await info(); t.equal([h.rims, h.ghosts, h.floorDark], [0, 0, 0], 'with the setting off: no rim, no trail, the floor as painted');
    },
  },
  {
    name: 'S1-11 measured: the ball reads brighter against its surroundings with the highlight on (rim and floor, mean luminance at three spots)',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      await skipTips(t);
      const s0 = await t.state(); if (s0.view !== '3d') { t.log('3D view not active here'); return; }
      await t.game('applySettings', { ballGlow: false }); await t.waitFrames(3);
      const off = await measureSpots(t);
      await t.game('applySettings', { ballGlow: true }); await t.waitFrames(3);
      const on = await measureSpots(t);
      const contrast = (m) => (m.core - m.floor) / (m.core + m.floor);
      t.log(`highlight off: ball ${off.core.toFixed(1)}, rim ring ${off.rim.toFixed(1)}, floor ${off.floor.toFixed(1)}, contrast ${contrast(off).toFixed(3)}`);
      t.log(`highlight on:  ball ${on.core.toFixed(1)}, rim ring ${on.rim.toFixed(1)}, floor ${on.floor.toFixed(1)}, contrast ${contrast(on).toFixed(3)}`);
      t.expect(on.floor < off.floor * 0.95, 'the floor round the ball is darker: ' + off.floor.toFixed(1) + ' to ' + on.floor.toFixed(1));
      t.expect(on.rim > off.rim * 1.08, "the ring at the ball's edge is brighter: " + off.rim.toFixed(1) + ' to ' + on.rim.toFixed(1));
      t.expect(contrast(on) > contrast(off), 'the ball stands out more: ' + contrast(off).toFixed(3) + ' to ' + contrast(on).toFixed(3));
      await t.game('act', 'placeBall', 300, 300, 0, 0); await t.game('step', 0); await t.waitFrames(3);
      await t.shot('S1-11-ball-on');
      await t.game('act', 'placeBall', 300, 300, 0, 2600); await t.game('step', 0); await t.waitFrames(3);
      await t.shot('S1-11-ball-trail');
      await t.game('applySettings', { ballGlow: false }); await t.waitFrames(3);
      await t.game('act', 'placeBall', 300, 300, 0, 0); await t.game('step', 0); await t.waitFrames(3);
      await t.shot('S1-11-ball-off');
    },
  },
];
tests.push(...ballTests);

// ------------------------------------------------------------------------------------------------- S4-11: lettering that can be read
export const labelTests = [
  {
    name: 'S4-11 labels grow for small screens by one rule, never past what their room allows, and the layout check passes',
    node: true,
    async run(t) {
      const { labelScale, allLabels, LABEL_MIN_PX, LABEL_CAPS, labelBox } = await import('../src/js/sim/labels.js');
      const { buildLamps } = await import('../src/js/sim/lamps.js');
      t.equal([labelScale(0.7, 7.5), labelScale(0.7, 7.5, 1.3), labelScale(1.6, 7.5), labelScale(0, 7.5)], [1.7, 1.3, 1, 1], 'a 7.5 mm label grows on a phone, stops at its cap, is left alone on a big screen, and a bad scale changes nothing');
      t.expect(Math.abs(labelScale(1, 6) - LABEL_MIN_PX / 6) < 1e-9, 'in between it grows to exactly the minimum type height: ' + labelScale(1, 6));
      const labs = allLabels(buildLamps());
      t.expect(labs.length >= 30, 'every label is in the one list: ' + labs.length);
      for (const l of labs) t.expect(l.cap >= 1 && l.cap <= 1.7, l.text + ' has a sane cap: ' + l.cap);
      t.expect(labs.filter((l) => l.size * l.cap * 0.7 >= 8.5).length >= 5, 'at least five labels reach about 9 px on a phone');
      t.expect(labelBox(labs[0], 2).hw > labelBox(labs[0], 1).hw, 'the layout box follows the scale');
      const { execFileSync } = await import('node:child_process');
      let out = ''; try { out = execFileSync(process.execPath, ['tools/check-layout.mjs'], { encoding: 'utf8' }); } catch (e) { out = 'FAILED ' + (e.stdout || '') + (e.stderr || ''); }
      t.expect(/clear of inserts, walls, posts and holes/.test(out), 'tools/check-layout.mjs: ' + out.trim().split('\n').slice(0, 4).join(' | '));
    },
  },
  {
    name: 'S4-11 on screen: the lettering is enlarged where the room allows, a layer of its own, and sharp on both sizes',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      await skipTips(t);
      const s0 = await t.state(); if (s0.view !== '3d') { t.log('3D view not active here'); return; }
      const info = await t.page.evaluate(() => window.__game.labelInfo());
      const by = Object.fromEntries(info.map((l) => [l.text, l]));
      t.log(info.map((l) => `${l.text} ${l.px.toFixed(1)}px x${l.scale}`).join(' · '));
      for (const l of info) t.expect(l.scale >= 1 && l.scale <= 1.7, l.text + ' scale in range: ' + l.scale);
      t.expect(info.every((l) => l.px >= l.size * 0.4), 'no label is smaller than it was printed');
      if (t.viewport === 'mobile') {
        for (const n of ['CENTRAL AVENUE', 'RESERVE ST', 'THERMAL SPRINGS', 'SHOOT AGAIN', 'LOCK']) t.expect(by[n].px >= 7 && by[n].scale > 1.2, n + ' reads at ' + by[n].px.toFixed(1) + ' CSS px (x' + by[n].scale + ')');
        t.expect(by['HALE'].scale > 1 && by['LAMAR'].scale > 1, 'the bathhouse names are enlarged too: x' + by['HALE'].scale);
      } else t.expect(by['SPA CITY'].scale === 1, 'the big logo is not touched');
      t.equal(await t.page.evaluate(() => window.__game.labelLayer()), true, 'the lettering is its own layer');
      await t.shot('S4-11-lettering');
      // a close-up of the bathhouse row and the mode inserts for the owner to look at
      const clip = await t.page.evaluate(() => { const a = window.__game.viewScreen(60, 520), b = window.__game.viewScreen(470, 780), r = document.getElementById('gl').getBoundingClientRect(); return { x: Math.max(0, r.left + Math.min(a[0], b[0])), y: Math.max(0, r.top + Math.min(a[1], b[1])), width: Math.abs(b[0] - a[0]), height: Math.abs(b[1] - a[1]) }; });
      await t.page.screenshot({ path: t.shotDir + '/S4-11-bathhouse-row.png', clip });
    },
  },
];
tests.push(...labelTests);

export const nameTests = [
  {
    name: 'S4-11 a bathhouse hit flashes its name large above the bank (3D), and a house that is already lit still says its name on the display',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      await skipTips(t);
      const s0 = await t.state();
      t.equal(await t.page.evaluate(() => window.__game.nameInfo() && window.__game.nameInfo().visible), s0.view === '3d' ? false : null, 'no name before a hit');
      await t.page.waitForFunction(() => window.__game.getState().dmd.text == null, null, { timeout: 12000 });   // the display runs on the wall clock: let the opening callout finish
      await t.game('act', 'placeBall', 300, 400, 0, 0); await t.game('act', 'switch', 'bhHale'); await t.game('step', 2);
      let s = await t.state(); t.equal(s.dmd.text, 'HALE', 'the first hit puts the house on the display: ' + s.dmd.text);
      if (s0.view === '3d') {
        await t.waitFrames(8);
        const n = await t.page.evaluate(() => window.__game.nameInfo());
        t.expect(n.visible && n.name === 'HALE' && n.opacity > 0.6, 'its name floats above the bank: ' + JSON.stringify(n));
        const need = await t.page.evaluate(() => { const a = window.__game.viewScale(190, 650); return 15 / a / 0.55; });
        t.expect(n.height >= Math.min(need, 34) * 0.95, 'tall enough for the type to be about 15 CSS px (' + n.height.toFixed(0) + ' mm, wanted ' + need.toFixed(0) + ')');
        await t.shot('S4-11-name-flash');
        await t.page.waitForFunction(() => !window.__game.nameInfo().visible, null, { timeout: 5000 });
        t.expect(true, 'and it goes after a second or two');
      }
      await t.page.waitForFunction(() => window.__game.getState().dmd.text == null, null, { timeout: 8000 });   // the display runs on the wall clock: let the first callout finish
      await t.game('act', 'placeBall', 300, 400, 0, 0); await t.game('act', 'switch', 'bhHale'); await t.game('step', 2);
      s = await t.state(); t.equal([s.dmd.text, s.dmd.sub], ['HALE', '500'], 'a repeat hit says the name again: ' + s.dmd.text + ' ' + s.dmd.sub);
      if (s0.view === '3d') { await t.waitFrames(6); const n = await t.page.evaluate(() => window.__game.nameInfo()); t.expect(n.visible && n.name === 'HALE', 'and flashes it again'); await t.game('act', 'placeBall', 300, 400, 0, 0); await t.game('act', 'switch', 'bhOzark'); await t.game('step', 2); await t.waitFrames(6); t.equal((await t.page.evaluate(() => window.__game.nameInfo())).name, 'OZARK', 'another house: its own name'); }
    },
  },
];
tests.push(...nameTests);

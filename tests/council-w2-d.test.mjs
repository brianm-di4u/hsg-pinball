// Council wave 2, batch D: records, goals, ranks and the daily table (S3-01).
// The rules and the progress data are tested in Node on the sim itself; the screens, the saves, the toast and the daily
// table are tested in the page through window.__game (progress, setToday, startDaily) and the real screens.
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api } from '../src/js/sim/rules.js';
import { RANKS, rankOf, GOALS, newlyEarned, gameTally, addTally, emptyTally, dailySeed, shiftDay, streakOf, pruneDays, DAYS_KEPT, todayKey, setToday } from '../src/js/progress.js';
import { TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const fresh = (seed = 1, o = {}) => { const G = createGame(T, { seed }); newGame(G, { seed, ...o }); G.cues.length = 0; return G; };
const hit = (G, sw, x = 200) => { G.w.events.push({ t: 'hit', sw: T.sw[sw], speed: 800, dir: 1, ball: (G.w.balls[0] || {}).id, x }); tick(G); };
const L = (o = {}) => ({ ...emptyTally(), ...o });

// ------------------------------------------------------------------------------------------------- page helpers
const KEYS = ['settings', 'scores', 'resume', 'stats', 'daily'];
const clear = async (t) => { await t.page.evaluate((ks) => ks.forEach((k) => localStorage.removeItem('hsg-pinball:' + k)), KEYS); await t.reload(); await t.game('setToday', '2026-11-14'); };
const put = (t, key, value) => t.page.evaluate(([k, v]) => localStorage.setItem('hsg-pinball:' + k, JSON.stringify(v)), [key, value]);
const read = (t, key) => t.page.evaluate((k) => { const v = localStorage.getItem('hsg-pinball:' + k); return v == null ? null : JSON.parse(v); }, key);
const settle = (t) => t.page.waitForFunction(() => { const s = window.__game.getState(); return s.screen === 'over' || s.screen === 'entry'; }, null, { timeout: 8000 });
// a paused game; then finish it with this score: the last ball drains
async function finish(t, score, opts = {}) {
  await t.game('newGame', { balls: 3, seed: 7, ...opts }); await t.game('pause'); await t.game('step', 30);
  await t.game('setState', { player: { ball: 3, score }, ball: { saveUntil: 0 } });
  await t.game('act', 'placeBall', 242, 60, 0, -1500);
  await t.game('step', 400);
  await settle(t);
  return t.state();
}
const fillEntry = async (t) => { if ((await t.state()).screen === 'entry') { await t.page.click('#b-ok'); await t.page.waitForFunction(() => window.__game.getState().screen === 'scores'); await t.page.click('#b-back'); } };

export const tests = [
  // ---------------------------------------------------------------------------------------------- what the sim counts
  {
    name: 'S3-01 the sim counts what the records need: bathhouse hits, boils, jackpots, multiballs, mode wins and wizard rounds',
    node: true,
    async run(t) {
      const G = fresh();
      G.ball.inLane = false; G.ball.launched = true;
      const f = () => G.f;
      t.equal([f().bathHits, f().boils, f().jackpots, f().wizards, f().mbs, f().modeWins], [0, 0, 0, 0, [0, 0, 0], [0, 0, 0, 0, 0, 0]], 'a new game has counted nothing');
      hit(G, 'bh' + BATHHOUSES[2]); hit(G, 'bh' + BATHHOUSES[3]);
      t.equal(f().bathHits, 2, 'every bathhouse hit is counted');
      f().springTemp = 142; hit(G, 'bumper1');
      t.equal(f().boils, 1, 'the springs boiling is counted once'); hit(G, 'bumper2');
      t.equal(f().boils, 1, 'and not again while they boil');
      api.startGrandSoak(G); t.equal(f().mbs, [0, 1, 0], 'Grand Soak started');
      hit(G, 'bh' + BATHHOUSES[0]); t.equal(f().jackpots, 1, 'a Grand Soak jackpot is counted');
      api.endMultiball(G);
      api.startArlington(G); t.equal(f().mbs, [1, 1, 0], 'Arlington started');
      G.mb.jackpotLit = true; hit(G, 'rampMade'); t.equal(f().jackpots, 2, 'an Arlington ramp jackpot is counted');
      api.endMultiball(G);
      api.startMode(G, 1); for (let i = 0; i < 2.4 / TICK; i++) tick(G);
      api.endMode(G, false); t.equal(f().modeWins, [0, 0, 0, 0, 0, 0], 'a mode that is not won is not a win');
      api.startMode(G, 1); for (let i = 0; i < 2.4 / TICK; i++) tick(G);
      api.endMode(G, true); t.equal(f().modeWins, [0, 1, 0, 0, 0, 0], 'a won mode is counted by mode');
      api.startValley(G); t.equal(f().mbs[2], 1, 'the wizard mode started');
      t.equal(f().wizards, 0, 'and not yet finished');
      api.endMultiball(G); t.equal(f().wizards, 1, 'finishing it is a wizard round');
      const tally = gameTally(G);
      t.equal([tally.baths, tally.boils, tally.jackpots, tally.wizards, tally.mbs, tally.modeWins[1]], [3, 1, 2, 1, [1, 1, 1], 1], 'gameTally reads them all');
    },
  },
  {
    name: 'S3-01 round 0 is untouched: the same seeded bot game scores the same with the counters in (they draw nothing from the random stream)',
    node: true,
    async run(t) {
      const { createBot } = await import('../src/js/sim/bot.js');
      const play = () => { const G = fresh(41); const bot = createBot(G, { skill: 0.8, seed: 9 }); let n = 0; while (G.scene !== 'over' && n < 120 * 60 * 20) { bot(); tick(G); G.cues.length = 0; n++; } return [G.player.score, G.f.bathHits]; };
      play();   // the first run in a fresh process differs from every later one (module state in the sim, as before this batch)
      const a = play(), b = play();
      t.equal(a, b, 'two runs of one seed agree: ' + a.join(' / '));
      t.expect(a[1] > 0, 'and the bot made bathhouse hits that were counted (' + a[1] + ')');
    },
  },

  // ---------------------------------------------------------------------------------------------- ranks, goals, the daily data
  {
    name: 'S3-01 ranks run from Bellhop to Bathhouse Manager on lifetime points, and the next one is always named',
    node: true,
    async run(t) {
      t.equal(RANKS[0].name, 'Bellhop', 'the first rank is Bellhop'); t.equal(RANKS[RANKS.length - 1].name, 'Bathhouse Manager', 'the last is Bathhouse Manager');
      t.expect(RANKS.every((r, i) => i === 0 || r.at > RANKS[i - 1].at), 'each rank needs more than the one before');
      t.equal(rankOf(0).name, 'Bellhop', '0 points'); t.equal(rankOf(249999).name, 'Bellhop', 'one short of the second'); t.equal(rankOf(250000).name, 'Towel Runner', 'exactly the second');
      t.equal(rankOf(250000).toNext, RANKS[2].at - 250000, 'points to the next');
      const top = rankOf(1e9); t.equal([top.name, top.next, top.toNext, top.frac], ['Bathhouse Manager', null, 0, 1], 'the top rank has no next');
      t.expect(rankOf(625000).frac > 0.49 && rankOf(625000).frac < 0.51, 'the bar is the share of the way: ' + rankOf(625000).frac);
    },
  },
  {
    name: 'S3-01 the goals are specific, unique and earned by play: none from menus, a first session reaches several, some take weeks',
    node: true,
    async run(t) {
      t.expect(GOALS.length >= 12 && GOALS.length <= 24, GOALS.length + ' goals');
      t.equal(new Set(GOALS.map((g) => g.id)).size, GOALS.length, 'ids are unique'); t.equal(new Set(GOALS.map((g) => g.name)).size, GOALS.length, 'names are unique');
      t.expect(GOALS.every((g) => g.name && /^[A-Z]/.test(g.text) && /[.!]$/.test(g.text)), 'every goal has a name and a sentence');
      t.equal(newlyEarned({}, emptyTally(), L(), { difficulty: 'standard', streak: 0, daily: false, finished: false }), [], 'a tally of nothing (a menu) earns nothing');
      const X = { difficulty: 'standard', streak: 0, daily: false, finished: true };
      const first = newlyEarned({}, L({ games: 1, skillShots: 1, extraBalls: 1, boils: 1 }), L({ score: 260000 }), X);
      t.equal(first, ['checkin', 'skill', 'eb', 'boil', 'quarter'], 'one ordinary game earns these: ' + first.join(', '));
      t.equal(newlyEarned({ checkin: '2026-11-14', skill: '2026-11-14' }, L({ games: 1, skillShots: 1 }), L(), X), [], 'a goal already earned is not earned again');
      const weeks = newlyEarned({}, L({ games: 50, skillShots: 25, boils: 1, extraBalls: 1, modeWins: [1, 1, 1, 1, 1, 1], wizards: 1, mbs: [1, 1, 1], jackpots: 1, rows: 1 }), L({ score: 2600000 }), { ...X, streak: 7, daily: true });
      t.equal(weeks.length, GOALS.length - 1, 'with a long history every goal but the Expert one is earned (' + weeks.length + ' of ' + GOALS.length + ')');
      t.equal(newlyEarned({}, L(), L({ score: 600000 }), { ...X, difficulty: 'expert' }).includes('expert'), true, 'Hard Water needs the Expert table');
      t.equal(newlyEarned({}, L(), L({ score: 600000 }), { ...X, difficulty: 'standard' }).includes('expert'), false, 'and not Standard');
      t.equal(addTally(L({ score: 5, mbs: [1, 0, 0] }), L({ score: 7, mbs: [0, 2, 0] })).mbs, [1, 2, 0], 'tallies add');
    },
  },
  {
    name: 'S3-01 the daily deal: one seed a day, the same for every player, different each day; streaks count back across months; the history is pruned',
    node: true,
    async run(t) {
      t.equal(dailySeed('2026-11-14'), dailySeed('2026-11-14'), 'the same date, the same seed');
      const seeds = new Set(); for (let i = 0; i < 60; i++) seeds.add(dailySeed(shiftDay('2026-10-01', i)));
      t.expect(seeds.size >= 58, 'sixty different days give ' + seeds.size + ' different seeds');
      t.expect([...seeds].every((s) => s >= 1 && s <= 1000000), 'and every seed is in range');
      t.equal([shiftDay('2026-11-01', -1), shiftDay('2026-12-31', 1), shiftDay('2028-03-01', -1)], ['2026-10-31', '2027-01-01', '2028-02-29'], 'dates shift across month, year and leap day');
      const days = { '2026-11-14': { best: 1, plays: 1 }, '2026-11-13': { best: 1, plays: 1 }, '2026-11-12': { best: 1, plays: 2 }, '2026-11-10': { best: 1, plays: 1 } };
      t.equal(streakOf(days, '2026-11-14'), 3, 'three days running, the gap on the 11th ends it');
      t.equal(streakOf(days, '2026-11-15'), 3, 'the streak survives until the end of the next day (today not yet played)');
      t.equal(streakOf(days, '2026-11-16'), 0, 'and is gone after a missed day');
      const many = {}; for (let i = 0; i < 100; i++) many[shiftDay('2026-11-14', -i)] = { best: 1, plays: 1 };
      const kept = pruneDays(many, '2026-11-14');
      t.equal(Object.keys(kept).length, DAYS_KEPT, 'a hundred days are pruned to ' + DAYS_KEPT); t.expect(!!kept['2026-11-14'] && !kept[shiftDay('2026-11-14', -DAYS_KEPT)], 'the newest kept, the oldest gone');
      setToday('2030-01-02'); t.equal(todayKey(), '2030-01-02', 'the test date override works'); setToday(null);
      t.expect(/^\d{4}-\d{2}-\d{2}$/.test(todayKey(new Date(2026, 10, 14))) && todayKey(new Date(2026, 10, 14)) === '2026-11-14', 'and the real one reads the local date');
    },
  },
  {
    name: 'S3-01 the saved records are read defensively: damaged numbers, unknown goals, bad dates and a wrong version all fall back',
    node: true,
    async run(t) {
      const mem = {};
      globalThis.localStorage = { getItem: (k) => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); } };
      try {
        const { loadStats, saveStats, loadDaily, saveDaily } = await import('../src/js/save.js');
        let s = loadStats();
        t.equal([s.games, s.score, s.best.standard, s.earned], [0, 0, 0, {}], 'no key: zeros');
        mem['hsg-pinball:stats'] = JSON.stringify({ v: 1, games: -5, score: 'x', skillShots: 1e30, mbs: [1, 'a', null, 9], modeWins: 'no', best: { easy: 12.7, standard: NaN, expert: -1 }, earned: { skill: '2026-11-14', nope: '2026-11-14', checkin: 'yesterday' } });
        s = loadStats();
        t.equal([s.games, s.score, s.skillShots <= 1e12, s.mbs, s.modeWins, s.best.easy, s.best.standard, s.best.expert], [0, 0, true, [1, 0, 0], [0, 0, 0, 0, 0, 0], 12, 0, 0], 'numbers are whole, finite and not negative, arrays have their length');
        t.equal(s.earned, { skill: '2026-11-14' }, 'only known goals with a real date are kept');
        mem['hsg-pinball:stats'] = JSON.stringify({ v: 2, games: 99 }); t.equal(loadStats().games, 0, 'a version this game does not know is ignored, not misread');
        mem['hsg-pinball:stats'] = '{not json'; t.equal(loadStats().games, 0, 'unreadable JSON is ignored');
        s = loadStats(); s.games = 7; s.best.expert = 9; s.earned.skill = '2026-11-02'; saveStats(s);
        const again = loadStats(); t.equal([again.games, again.best.expert, again.earned.skill], [7, 9, '2026-11-02'], 'a saved record reads back as written');
        mem['hsg-pinball:daily'] = JSON.stringify({ v: 1, longest: 4, days: { '2026-11-14': { best: 10, plays: 2 }, '2026-11-13': { best: 'x', plays: 1 }, 'junk': { best: 1, plays: 1 }, '2026-11-12': { best: 5, plays: 0 }, '2020-01-01': { best: 9, plays: 1 } } });
        const d = loadDaily('2026-11-14');
        t.equal(Object.keys(d.days).sort(), ['2026-11-13', '2026-11-14'], 'bad dates, empty days and days past the history are dropped');
        t.equal([d.days['2026-11-13'].best, d.longest], [0, 4], 'a damaged best is 0, and the longest streak is kept');
        d.days['2026-11-15'] = { best: 3, plays: 1 }; saveDaily(d); t.equal(Object.keys(loadDaily('2026-11-15').days).length, 3, 'a saved daily reads back');
      } finally { delete globalThis.localStorage; }
    },
  },

  // ---------------------------------------------------------------------------------------------- the screens
  {
    name: 'S3-01 a new player: the title offers the daily table and Records, and Records shows Bellhop, no scores yet and every goal with its condition',
    async run(t) {
      await clear(t);
      await t.game('scene', 'title');
      const title = await t.page.locator('#screens').textContent();
      t.expect(/Daily table/.test(title) && /Records/.test(title), 'the title has both buttons');
      t.expect(/Rank: Bellhop/.test(await t.page.locator('#t-rank').textContent()), 'and shows the rank');
      await t.checkLayout();
      await t.shot('S3-01-title');
      await t.page.click('#b-records');
      let s = await t.state(); t.equal(s.screen, 'records', 'Records opens');
      t.equal((await t.page.locator('#r-rank').textContent()).trim(), 'Bellhop', 'a new player is a Bellhop');
      const text = await t.page.locator('#screens').textContent();
      t.expect(/Goals \(0 of \d+\)/.test(text), 'no goals yet');
      for (const g of GOALS) t.expect(text.includes(g.name) && text.includes(g.text), 'goal ' + g.name + ' is listed with its condition');
      t.expect(await t.page.locator('.cal li').count() === 28, 'the daily calendar shows 28 days');
      await t.shot('S3-01-records-new');
      await t.page.locator('.screen .cols').evaluate((n) => { n.scrollTop = n.scrollHeight; });
      await t.shot('S3-01-records-goals');
      await t.checkLayout();
      const small = await t.page.evaluate(() => [...document.querySelectorAll('#screens button')].filter((b) => b.getBoundingClientRect().height < 44).length);
      t.equal(small, 0, 'every button is at least 44 px tall');
      await t.page.keyboard.press('Enter');
      t.equal((await t.state()).screen, 'title', 'Back (by keyboard) returns to the title');
    },
  },
  {
    name: 'S3-01 a goal earned in play shows a toast with a cue, is announced, is saved at once, and survives a reload',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      t.expect(await t.page.locator('#toast').isHidden(), 'no toast to begin with');
      await t.game('setState', { player: { skillShots: 1 } });
      await t.game('step', 1);
      const toast = t.page.locator('#toast');
      t.expect(await toast.isVisible(), 'the toast shows');
      t.expect(/Goal reached/.test(await toast.textContent()) && /Straight Shooter/.test(await toast.textContent()), 'it names the goal: ' + (await toast.textContent()));
      t.equal(await toast.evaluate((n) => getComputedStyle(n).pointerEvents), 'none', 'it does not catch taps or clicks, so play goes on under it');
      t.expect((await t.state()).audio.played.includes('achieve'), 'with its cue');
      await t.page.waitForFunction(() => /Goal reached: Straight Shooter/.test(document.getElementById('live').textContent), null, { timeout: 4000 });
      await t.shot('S3-01-toast');
      t.equal(Object.keys((await read(t, 'stats')).earned), ['skill'], 'saved the moment it was earned');
      await t.game('step', 40);
      t.equal(Object.keys((await read(t, 'stats')).earned), ['skill'], 'and not earned twice');
      await t.game('setState', { features: { boils: 1, rowsDone: 1 } }); await t.game('step', 1);
      await t.page.waitForFunction(() => /Boiling Point|The Whole Row/.test(document.getElementById('toast').textContent), null, { timeout: 6000 });
      t.expect(/Boiling Point|The Whole Row/.test(await toast.textContent()), 'two goals at once queue, one toast after the other');
      await t.reload();
      t.equal(Object.keys((await t.game('progress')).stats.earned).sort(), ['boil', 'row', 'skill'], 'the three goals survive a reload');
    },
  },
  {
    name: 'S3-01 a toast sits clear of the DMD, the score and the Launch button at both sizes',
    async run(t) {
      await clear(t);
      await t.game('newGame', { balls: 3, seed: 7 }); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { skillShots: 1 } }); await t.game('step', 1);
      await t.page.waitForFunction(() => !document.getElementById('toast').hidden);
      await t.waitForAnimations();
      const r = await t.page.evaluate(() => { const b = (s) => { const n = document.querySelector(s).getBoundingClientRect(); return { x: n.x, y: n.y, w: n.width, h: n.height }; }; return { toast: b('#toast'), vw: innerWidth }; });
      t.expect(r.toast.x >= 8 && r.toast.x + r.toast.w <= r.vw - 8, 'the toast is inside the window: ' + JSON.stringify(r.toast));
      await t.shot('S3-01-toast-in-play');
    },
  },
  {
    name: 'S3-01 a finished game goes on the books: totals, the best on its table, goals, rank and a personal best; the first is a Bellhop, a big one ranks up',
    async run(t) {
      await clear(t);
      let s = await finish(t, 50000);
      t.equal(s.screen, 'over', 'a score under the list shows the game-over screen');
      let text = await t.page.locator('#screens').textContent();
      t.expect(/Rank: Bellhop · 200,000 points to Towel Runner/.test(text), 'it shows the rank and the way to the next: ' + text.replace(/\s+/g, ' ').slice(0, 200));
      t.expect(/Goal reached: Checked In/.test(text), 'and the goal it earned');
      t.expect(!/personal best/.test(text), 'the first game is not a personal best (nothing to beat)');
      await t.checkLayout();
      await t.shot('S3-01-game-over-first');
      let p = await t.game('progress');
      t.equal([p.stats.games, p.stats.score, p.stats.best.standard], [1, 50000, 50000], 'one game, its points and its best are saved');
      await t.page.click('#b-title');
      s = await finish(t, 300000);
      t.equal(s.screen, 'entry', '300,000 makes the list: the initials screen');
      text = await t.page.locator('#screens').textContent();
      t.expect(/New personal best/.test(text), 'it says so: a new personal best');
      t.expect(/Rank up!.*Towel Runner/.test(text), 'and the rank up');
      t.expect(/Quarter Million/.test(text), 'and the goal');
      await t.shot('S3-01-initials-new-best');
      await t.checkLayout();
      await fillEntry(t);
      p = await t.game('progress');
      t.equal([p.stats.games, p.stats.score, p.stats.best.standard, p.rank.name], [2, 350000, 300000, 'Towel Runner'], 'two games, 350,000 points, a best of 300,000, a Towel Runner');
      s = await finish(t, 20000, { difficulty: 'expert' });
      p = await t.game('progress');
      t.equal([p.stats.best.expert, p.stats.best.standard], [20000, 300000], 'each table keeps its own best');
      await t.page.click('#b-title').catch(() => {});
      await t.game('scene', 'records');
      await t.shot('S3-01-records-played');
      t.expect(/Games finished\s*3/.test(await t.page.locator('.keys').nth(1).textContent()), 'the Records screen counts the games');
      t.expect(/Towel Runner/.test(await t.page.locator('#r-rank').textContent()), 'and shows the rank');
      t.expect(/earned Nov 14/.test(await t.page.locator('.goals').textContent()), 'goals show the day they were earned');
      await t.checkLayout();
      await t.reload();
      p = await t.game('progress');
      t.equal([p.stats.games, p.stats.best.standard, p.stats.best.expert], [3, 300000, 20000], 'all of it survives a reload');
    },
  },
  {
    name: 'S3-01 practice (an endless ball save) earns no goals and records nothing',
    async run(t) {
      await clear(t);
      await put(t, 'settings', { v: 1, sound: true, music: true, volume: 0.5, motion: 'auto', balls: 3, tier: 'auto', practice: true, textScale: 1, difficulty: 'standard' });
      await t.reload(); await t.game('setToday', '2026-11-14');
      t.equal((await t.state()).settings.practice, true, 'practice is on');
      await t.game('newGame', { balls: 3, seed: 7, practice: true }); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { skillShots: 3, score: 900000 }, features: { boils: 1 } }); await t.game('step', 40);
      t.expect(await t.page.locator('#toast').isHidden(), 'no toast in practice');
      const p = await t.game('progress');
      t.equal([p.stats.games, p.stats.score, Object.keys(p.stats.earned).length], [0, 0, 0], 'nothing recorded, no goals');
    },
  },

  // ---------------------------------------------------------------------------------------------- the daily table
  {
    name: 'S3-01 the daily table: dealt from the date, Standard with three balls whatever Settings say, the same board on a second try, a different one tomorrow',
    async run(t) {
      await clear(t);
      await put(t, 'settings', { v: 1, sound: true, music: true, volume: 0.5, motion: 'auto', balls: 5, tier: 'auto', practice: true, textScale: 1, difficulty: 'expert' });
      await t.reload(); await t.game('setToday', '2026-11-14');
      t.equal(await t.game('startDaily'), '2026-11-14', 'the daily game is tagged with the date');
      await t.game('pause');
      let s = await t.state();
      t.equal([s.difficulty, s.player.ballsPerGame, s.seed], ['standard', 3, dailySeed('2026-11-14')], 'Standard, three balls and the seed of the day (Settings say Expert, five balls, practice)');
      const lane = s.ball.skillLane;
      await t.game('startDaily'); await t.game('pause'); s = await t.state();
      t.equal(s.ball.skillLane, lane, 'the same day deals the same skill-shot lane');
      const lanes = new Set([lane]);
      for (let d = 15; d < 30; d++) { await t.game('setToday', '2026-11-' + d); await t.game('startDaily'); await t.game('pause'); lanes.add((await t.state()).ball.skillLane); }
      t.expect(lanes.size > 1, 'other days deal other lanes: ' + [...lanes].join(','));
      t.expect(((await t.state()).seed) === dailySeed('2026-11-29'), 'and other seeds');
      await t.game('scene', 'title');
      t.expect(/waiting/.test(await t.page.locator('#t-rank').textContent()), 'the title says the day has not been played');
    },
  },
  {
    name: 'S3-01 the daily table keeps its own best, a streak across days, a calendar, and prunes old days; a daily game also earns Daily Soak',
    async run(t) {
      await clear(t);
      await t.game('startDaily'); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 3, score: 120000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400); await settle(t);
      let text = await t.page.locator('#screens').textContent();
      t.expect(/Daily table: best 120,000 · 1 day running/.test(text), 'the game-over screen shows the daily best and the streak: ' + text.replace(/\s+/g, ' ').slice(0, 260));
      let d = await read(t, 'daily');
      t.equal([d.days['2026-11-14'].best, d.days['2026-11-14'].plays, d.longest], [120000, 1, 1], 'saved: the day, its best, its plays and the longest streak');
      t.expect(Object.keys((await t.game('progress')).stats.earned).includes('daily'), 'Daily Soak is earned');
      await fillEntry(t); await t.page.click('#b-title').catch(() => {});
      await t.game('setToday', '2026-11-15'); await t.game('scene', 'title');
      await t.game('startDaily'); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 3, score: 90000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400); await settle(t);
      d = await read(t, 'daily');
      t.equal([Object.keys(d.days).length, d.longest, (await t.game('progress')).streak], [2, 2, 2], 'a second day: two days, a streak of 2');
      await fillEntry(t); await t.page.click('#b-title').catch(() => {});
      // two more games the same day: the best stays, plays count
      await t.game('startDaily'); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 3, score: 40000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400); await settle(t);
      d = await read(t, 'daily');
      t.equal([d.days['2026-11-15'].best, d.days['2026-11-15'].plays], [90000, 2], 'a worse second game leaves the day\'s best and counts the play');
      await t.page.click('#b-title').catch(() => {});
      await t.game('scene', 'records');
      t.equal(await t.page.locator('.cal li.on').count(), 2, 'the calendar marks both days');
      t.equal(await t.page.locator('.cal li.today').count(), 1, 'and today');
      await t.shot('S3-01-records-daily');
      await t.checkLayout();
      // a long history is pruned when the next day is played
      const days = {}; for (let i = 1; i <= 60; i++) { const dt = new Date(Date.UTC(2026, 10, 15) - i * 86400000); days[dt.toISOString().slice(0, 10)] = { best: 1000, plays: 1 }; }
      await put(t, 'daily', { v: 1, days: { ...days, '2026-11-15': { best: 90000, plays: 2 } }, longest: 2 });
      await t.reload(); await t.game('setToday', '2026-11-15');
      t.expect(Object.keys((await t.game('progress')).daily.days).length <= 35, 'sixty-one saved days load as at most 35');
      await t.game('startDaily'); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 3, score: 1000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400); await settle(t);
      d = await read(t, 'daily');
      t.expect(Object.keys(d.days).length <= 35, 'and the saved key holds at most 35: ' + Object.keys(d.days).length);
      t.expect(d.longest >= 60 - 35 || d.longest >= 2, 'the longest streak is kept: ' + d.longest);
    },
  },
  {
    name: 'S3-01 a daily game that is continued after a reload is still the daily game',
    async run(t) {
      await clear(t);
      await t.game('startDaily'); await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 2, score: 5000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400);
      t.equal((await read(t, 'resume')).daily, '2026-11-14', 'the saved game remembers it is the daily');
      await t.reload(); await t.game('setToday', '2026-11-14');
      await t.page.click('#b-continue');
      t.equal((await t.state()).player.ball >= 2, true, 'Continue resumes the game');
      await t.game('pause'); await t.game('step', 30);
      await t.game('setState', { player: { ball: 3, score: 70000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500); await t.game('step', 400); await settle(t);
      t.equal((await read(t, 'daily')).days['2026-11-14'].best, 70000, 'and its score goes on the daily table');
    },
  },

  // ---------------------------------------------------------------------------------------------- old saves
  {
    name: 'S3-01 a save from before this version loads whole: settings, scores and a saved game untouched, records start at zero, nothing earned for free',
    async run(t) {
      await clear(t);
      const settings = { v: 1, sound: false, music: true, volume: 0.35, motion: 'reduced', balls: 5, tier: 'low', practice: false, textScale: 1.15, ambience: true, difficulty: 'expert' };
      const scores = { v: 1, table: [{ initials: 'ABC', score: 3100000, date: '2026-10-01', difficulty: 'standard' }, { initials: 'ZZZ', score: 90000, date: '2026-10-02', difficulty: 'expert' }] };
      const resume = { v: 1, practice: false, difficulty: 'standard', player: { score: 12345, ball: 2, ballsPerGame: 3, extraBalls: 0, bonusX: 1, skillShots: 0, eb: 0 }, features: { springTemp: 120, bathsTotal: 3, round: 0 } };
      await put(t, 'settings', settings); await put(t, 'scores', scores); await put(t, 'resume', resume);
      await t.page.evaluate(() => { localStorage.removeItem('hsg-pinball:stats'); localStorage.removeItem('hsg-pinball:daily'); });
      await t.reload(); await t.game('setToday', '2026-11-14');
      let s = await t.state();
      t.equal([s.settings.sound, s.settings.volume, s.settings.balls, s.settings.difficulty, s.settings.tier], [false, 0.35, 5, 'expert', 'low'], 'settings are as they were (sound stays off)');
      t.equal(s.scores[0].score, 3100000, 'high scores are as they were');
      const p = await t.game('progress');
      t.equal([p.stats.games, p.stats.score, Object.keys(p.stats.earned).length, p.rank.name, Object.keys(p.daily.days).length], [0, 0, 0, 'Bellhop', 0], 'records start at zero');
      await t.page.click('#b-continue');
      s = await t.state();
      t.equal([s.player.score, s.player.ball, s.features.springTemp, s.features.boils, s.features.mbs], [12345, 2, 120, 0, [0, 0, 0]], 'the saved game resumes, with the new counters at zero');
      t.equal(await read(t, 'scores').then((x) => x.table.length), 2, 'the saved scores key is untouched');
    },
  },

  // ---------------------------------------------------------------------------------------------- the cue
  {
    name: 'S3-01 the goal cue is a cue-level sound, a little different each time',
    viewports: ['desktop'],
    async run(t) {
      const r = await t.page.evaluate(() => window.__game.cueRender('achieve', { seconds: 3 }));
      t.log('achieve peak ' + r.peak + ' rms ' + r.rmsDb + ' dB');
      t.expect(r.peak >= 0.15 && r.peak <= 0.45, 'it peaks ' + r.peak + ' (0.15 to 0.45)');
      t.expect(r.secs[0] > 0.01 && (r.secs[2] || 0) < 0.002, 'and is over inside two seconds');
      const r2 = await t.page.evaluate(() => window.__game.cueRender('achieve', { seconds: 3 }));
      t.expect(r2.peak !== r.peak || r2.rmsDb !== r.rmsDb, 'two renders are not identical (detune)');
      t.expect(r.peak + 0.138 + 0.069 < 0.95, 'with the loudest piece and bed it stays under 0.95');
    },
  },
];

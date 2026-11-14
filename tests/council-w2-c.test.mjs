// Council wave 2, batch C: balance tool, tuning, difficulty setting and escalation (S3-03, S1-17, S3-04).
// Everything here runs in Node on the sim itself (the rules are deterministic and have no DOM); the balance runs play
// whole games with the autoplay bot, so the numbers in these tests are the numbers `node tools/balance.mjs` prints.
import fs from 'node:fs';
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, nudge, MODES, STANDARD, DIFFICULTY } from '../src/js/sim/rules.js';
import { wantedShots } from '../src/js/sim/bot.js';
import { TICK } from '../src/js/sim/physics.js';
import { simulate, verdict, TARGETS, LADDER } from '../tools/balance.mjs';

const T = compileTable(spec);
const fresh = (seed = 1, o = {}) => { const G = createGame(T, { seed }); newGame(G, { seed, ...o }); G.cues.length = 0; return G; };
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const dmds = (G, text) => G.cues.filter((c) => c.k === 'dmd' && (!text || c.text === text));
// a ball in the outlane: the switch fires for the ball that is on the table
const outlane = (G, name = 'outL') => { G.w.events.push({ t: 'hit', sw: T.sw[name], speed: 800, dir: 1, ball: G.w.balls[0].id, x: name === 'outL' ? 30 : 450 }); tick(G); };
// launch the first ball and let the ball save run out, so only the kickbacks stand between the ball and the drain
const launched = (G) => { G.ball.inLane = false; G.ball.launched = true; G.ball.saveUntil = 0; G.w.balls[0].x = 200; G.w.balls[0].y = 400; };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S3-03 the balance tool
  {
    name: 'S3-03 package.json: the balance and sim scripts point at files that exist',
    node: true,
    async run(t) {
      const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
      t.expect(!!pkg.scripts.balance && !!pkg.scripts['balance:check'], 'npm run balance and npm run balance:check exist');
      for (const name of ['balance', 'balance:check', 'sim']) {
        const files = (pkg.scripts[name].match(/tools\/[\w-]+\.mjs/g) || []);
        t.expect(files.length > 0 && files.every((f) => fs.existsSync(new URL('../' + f, import.meta.url))), `${name}: ${pkg.scripts[name]} names only files that exist`);
      }
    },
  },
  {
    name: 'S3-03 the bot reads the game: it wants the lit bathhouse in Soak, the ramp in Tower, the Vapors between modes and the lock when lit',
    node: true,
    async run(t) {
      const G = fresh();
      t.equal(wantedShots(G)[0], 'vapors', 'between modes the Vapors (it starts the next mode) comes first');
      G.f.lockLit = true;
      t.equal(wantedShots(G)[0], 'lock', 'with the lock lit it wants the lock');
      G.f.lockLit = false;
      api.startMode(G, 0); run(G, 2.4);
      t.equal(wantedShots(G), [BATHHOUSES[G.mode.lit[0]]], 'in Soak it wants the lit bathhouse, by name');
      api.endMode(G, false); api.startMode(G, 3); run(G, 2.4);
      t.equal(wantedShots(G), ['ramp'], 'in Tower Climb it wants the ramp');
      api.endMode(G, false); api.startMode(G, 5); run(G, 2.4);
      t.equal(wantedShots(G), ['orbit'], 'in Coaster Hill it wants the orbit');
      api.endMode(G, false); api.startMode(G, 2); run(G, 2.4);
      G.mode.phase = 2;
      t.equal(wantedShots(G), ['vapors'], 'in the Raid hurry-up it wants the Vapors');
    },
  },
  {
    name: 'S3-03 Standard on the skill-0.8 bot over 30 games: an average ball of 40 to 90 s, side drains under 35 percent, Soak and Derby reached in 20 percent of games',
    node: true,
    async run(t) {
      const r = simulate({ games: 30, skill: 0.8, seed: 1 });
      t.log(`ball avg ${r.ballAvg.toFixed(1)} s (median ${r.ballMedian.toFixed(1)}, p10 ${r.ballP10.toFixed(1)}, p90 ${r.ballP90.toFixed(1)}), side drains ${(r.sideShare * 100).toFixed(0)}% of ${r.drainTotal}, kickbacks ${r.kickbacks}, ball saves ${r.saves}`);
      t.log('reached: ' + Object.entries(r.reachShare).map(([k, v]) => `${k} ${(v * 100).toFixed(0)}%`).join(', '));
      t.expect(r.ballAvg >= TARGETS.ballMin && r.ballAvg <= TARGETS.ballMax, `average ball ${r.ballAvg.toFixed(1)} s is inside ${TARGETS.ballMin}-${TARGETS.ballMax}`);
      t.expect(r.sideShare < TARGETS.sideMax, `side drains ${(r.sideShare * 100).toFixed(0)}% are under ${TARGETS.sideMax * 100}%`);
      t.expect(r.reachShare.soak >= TARGETS.reachMin && r.reachShare.derby >= TARGETS.reachMin, 'Soak and Derby Day are reached in at least 20% of games');
      t.equal(r.capped, 0, 'no game hit the 60-minute cap');
      // the verdict names what is still missed, so the gap is visible and not hidden
      const misses = verdict(r);
      t.expect(misses.every((m) => /reached in/.test(m)), 'the only misses the tool reports are mode reach: ' + misses.join('; '));
    },
  },
  {
    name: 'S3-03 the skill ladder is ordered: a better bot keeps the ball longer and scores more',
    node: true,
    async run(t) {
      const rows = LADDER.map((skill) => simulate({ games: 20, skill, seed: 5 }));
      t.log(rows.map((r) => `skill ${r.skill}: ball ${r.ballAvg.toFixed(1)} s, score median ${Math.round(r.scoreMedian).toLocaleString()}`).join(' | '));
      for (let i = 1; i < rows.length; i++) {
        t.expect(rows[i].ballAvg > rows[i - 1].ballAvg, `skill ${rows[i].skill} (${rows[i].ballAvg.toFixed(1)} s) keeps the ball longer than ${rows[i - 1].skill} (${rows[i - 1].ballAvg.toFixed(1)} s)`);
      }
      t.expect(rows[3].scoreMedian > rows[0].scoreMedian, 'and scores more');
    },
  },
  {
    name: 'S3-03 the retune is one line: kickbacks 0 puts the old drains back, and the numbers move the way the report says',
    node: true,
    async run(t) {
      const was = STANDARD.kickbacks;
      try {
        STANDARD.kickbacks = 0;
        const off = simulate({ games: 20, skill: 0.8, seed: 1 });
        STANDARD.kickbacks = was;
        const on = simulate({ games: 20, skill: 0.8, seed: 1 });
        t.log(`kickbacks 0: ball ${off.ballAvg.toFixed(1)} s, side ${(off.sideShare * 100).toFixed(0)}%; kickbacks ${was}: ball ${on.ballAvg.toFixed(1)} s, side ${(on.sideShare * 100).toFixed(0)}%`);
        t.equal(off.kickbacks, 0, 'with the number at 0 nothing is returned');
        t.expect(on.kickbacks > 0, 'with it at ' + was + ' balls are returned');
        t.expect(on.ballAvg > off.ballAvg && on.sideShare < off.sideShare, 'the kickbacks lengthen the ball and cut the side drains');
      } finally { STANDARD.kickbacks = was; }
    },
  },
  // ---------------------------------------------------------------------------------------------- S3-03 the kickback
  {
    name: 'S3-03 an outlane kickback returns the ball to the shooter lane instead of draining, three times a side a ball, then the outlane drains',
    node: true,
    async run(t) {
      const G = fresh(); launched(G);
      outlane(G, 'outL');
      t.expect(dmds(G, 'KICKBACK').length === 1, 'the callout says KICKBACK');
      t.expect(G.cues.some((c) => c.k === 'kickback' && c.side === 'L'), 'and a kickback cue carries the side');
      t.expect(G.cues.some((c) => c.k === 'sound' && c.name === 'save'), 'with the save sound');
      t.equal(G.w.balls.length, 1, 'one ball on the table: the old one is gone and a new one is in the shooter lane');
      t.expect(G.w.balls[0].x > 480, 'in the shooter lane');
      t.equal(G.ball.kb.outL, 1, 'one used on the left');
      run(G, 3);
      G.ball.saveUntil = 0; G.w.balls[0].x = 40; G.w.balls[0].y = 300;
      outlane(G, 'outL');
      t.equal(G.ball.kb.outL, 2, 'a second on the left');
      run(G, 3); G.ball.saveUntil = 0; G.w.balls[0].x = 40; G.w.balls[0].y = 300; G.cues.length = 0;
      outlane(G, 'outL');
      t.equal(G.ball.kb.outL, 3, 'a third on the left');
      run(G, 3); G.ball.saveUntil = 0; G.w.balls[0].x = 40; G.w.balls[0].y = 300; G.cues.length = 0;
      outlane(G, 'outL');
      t.expect(dmds(G, 'OUTLANE').length === 1 && dmds(G, 'KICKBACK').length === 0, 'the fourth time it is only an outlane');
      G.ball.saveUntil = 0; G.w.balls[0].x = 450; G.w.balls[0].y = 300; G.cues.length = 0;
      outlane(G, 'outR');
      t.expect(dmds(G, 'KICKBACK').length === 1, 'the right side has its own two');
    },
  },
  {
    name: 'S3-03 the ball save goes first (it does not spend a kickback), every new ball gets its kickbacks back, and a tilted table has none',
    node: true,
    async run(t) {
      const G = fresh(); launched(G);
      G.ball.saveUntil = G.t + 5;
      outlane(G, 'outL');
      t.expect(dmds(G, 'KICKBACK').length === 0 && G.ball.kb.outL === 0, 'inside the ball-save window the outlane does not use a kickback');
      G.ball.saveUntil = 0; G.cues.length = 0;
      outlane(G, 'outL');
      t.equal(G.ball.kb.outL, 1, 'after it, the kickback is used');
      api.serve(G);
      t.equal(G.ball.kb, { outL: 0, outR: 0 }, 'a new ball starts with both sides fresh');
      launched(G); G.player.tilted = true; G.cues.length = 0;
      outlane(G, 'outR');
      t.expect(dmds(G, 'KICKBACK').length === 0, 'a tilted table returns nothing');
    },
  },
  // ---------------------------------------------------------------------------------------------- S1-17 table difficulty
  {
    name: 'S1-17 Standard is the S3-03 tuning, the default, and an unknown name falls back to it',
    node: true,
    async run(t) {
      t.expect(DIFFICULTY.standard === STANDARD, 'the Standard tier is the tuned numbers themselves (so one line reverses a retune)');
      t.equal(fresh().difficulty, 'standard', 'a new game is Standard');
      t.equal(fresh(1, { difficulty: 'impossible' }).difficulty, 'standard', 'a name that is not a tier is Standard');
      t.equal(Object.keys(DIFFICULTY), ['easy', 'standard', 'expert'], 'three tiers');
      t.equal([DIFFICULTY.easy.saveSecs, DIFFICULTY.standard.saveSecs, DIFFICULTY.expert.saveSecs], [20, 10, 0], 'ball save 20 s, 10 s, none');
    },
  },
  {
    name: 'S1-17 the ball-save window is 20 s on Easy, 10 s on Standard and there is none on Expert (no save cue, the drain ends the ball)',
    node: true,
    async run(t) {
      const launch = (G) => { G.w.events.push({ t: 'hit', sw: T.sw.shooterLane, speed: 900, dir: 1, ball: G.w.balls[0].id, x: 498, y: 872 }); tick(G); };
      for (const [name, secs] of [['easy', 20], ['standard', 10], ['expert', 0]]) {
        const G = fresh(2, { difficulty: name });
        launch(G);
        const left = G.ball.saveUntil - G.t;
        t.expect(secs ? Math.abs(left - secs) < 0.05 : G.ball.saveUntil === 0, `${name}: the save window is ${secs ? left.toFixed(2) + ' s' : 'closed'}`);
        run(G, 0.5);
        t.equal(G.cues.some((c) => c.k === 'sound' && c.name === 'saveOn'), secs > 0, `${name}: the ball-save cue plays only when there is a save`);
      }
      const G = fresh(2, { difficulty: 'expert' });
      launch(G); run(G, 0.3);
      G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 }); tick(G);
      t.expect(!dmds(G, 'BALL SAVED').length && G.scene === 'bonus', 'Expert: an early drain ends the ball (no BALL SAVED)');
      const H = fresh(2, { difficulty: 'easy' });
      launch(H); run(H, 15);
      H.w.events.push({ t: 'drain', ball: H.w.balls[0].id, x: 240 }); tick(H);
      t.expect(dmds(H, 'BALL SAVED').length === 1, 'Easy: a drain 15 s into the ball is still saved');
    },
  },
  {
    name: 'S1-17 kickbacks a side per ball are 5 on Easy, 3 on Standard and none on Expert',
    node: true,
    async run(t) {
      for (const [name, n] of [['easy', 5], ['standard', 3], ['expert', 0]]) {
        const G = fresh(3, { difficulty: name }); launched(G);
        let used = 0;
        for (let i = 0; i < 7; i++) {
          G.ball.saveUntil = 0; G.w.balls[0].x = 40; G.w.balls[0].y = 300; G.cues.length = 0;
          outlane(G, 'outL');
          if (dmds(G, 'KICKBACK').length) used++;
          run(G, 0.1);
          if (!G.w.balls.length || G.scene !== 'game') break;
        }
        t.equal(used, n, `${name}: ${n} kickbacks on the left`);
      }
    },
  },
  {
    name: 'S1-17 tilt strictness: Easy takes more nudges to tilt than Standard, Standard more than Expert; Expert nudges harder and its meter falls slower',
    node: true,
    async run(t) {
      const counts = {};
      for (const name of ['easy', 'standard', 'expert']) {
        const G = fresh(4, { difficulty: name }); launched(G);
        let n = 0;
        while (!G.player.tilted && n < 40) { nudge(G, 'left'); n++; run(G, 0.05); }
        counts[name] = n;
      }
      t.log('nudges to tilt (50 ms apart): ' + JSON.stringify(counts));
      t.expect(counts.easy > counts.standard && counts.standard > counts.expert, 'tilt comes sooner the harder the table: ' + JSON.stringify(counts));
      const vx = (name) => { const G = fresh(4, { difficulty: name }); launched(G); const b = G.w.balls[0]; const v0 = b.vx; nudge(G, 'right'); return Math.abs(b.vx - v0); };
      t.expect(vx('standard') === 260 && vx('easy') === 260 && vx('expert') === 380, 'a nudge adds 260 mm/s on Easy and Standard and 380 on Expert: ' + [vx('easy'), vx('standard'), vx('expert')].join(', '));
      const bob = (name) => { const G = fresh(4, { difficulty: name }); launched(G); nudge(G, 'left'); nudge(G, 'left'); run(G, 1); return G.player.bob; };
      t.expect(bob('easy') < bob('standard') && bob('standard') < bob('expert'), 'the nudge meter falls fastest on Easy and slowest on Expert');
    },
  },
  {
    name: 'S1-17 head to head, same bot and seeds: Easy keeps the ball longer than Standard, and Standard longer than Expert',
    node: true,
    async run(t) {
      const names = ['easy', 'standard', 'expert'];
      const r = names.map((difficulty) => simulate({ games: 20, skill: 0.8, seed: 7, difficulty }));
      t.log(r.map((x, i) => `${names[i]}: ball ${x.ballAvg.toFixed(1)} s, side ${(x.sideShare * 100).toFixed(0)}%, score median ${Math.round(x.scoreMedian).toLocaleString()}, saves ${x.saves}, kickbacks ${x.kickbacks}, tilts ${x.tilts}`).join(' | '));
      t.expect(r[0].ballAvg > r[1].ballAvg && r[1].ballAvg > r[2].ballAvg, 'ball time: ' + r.map((x) => x.ballAvg.toFixed(1)).join(' > '));
      t.expect(r[0].scoreMedian > r[2].scoreMedian, 'and Easy scores more than Expert');
      t.equal(r[2].kickbacks + r[2].saves, 0, 'Expert has no kickbacks and no ball saves');
    },
  },
  {
    name: 'S1-17 Settings has Table difficulty, it is saved with the other settings and shown on the title; a save from before has Standard, a bad value falls back',
    async run(t) {
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:settings'));
      await t.reload();
      await t.game('scene', 'settings');
      const sel = t.page.locator('#s-difficulty');
      t.expect(await sel.count() === 1, 'Settings has a Table difficulty control');
      t.equal(await sel.evaluate((n) => [...n.options].map((o) => o.value)), ['easy', 'standard', 'expert'], 'Easy, Standard, Expert');
      t.equal(await sel.inputValue(), 'standard', 'Standard is the default');
      const hint = () => t.page.locator('#s-diff-hint').textContent();
      t.expect(/10 second/.test(await hint()), 'the hint says what Standard does');
      await t.shot('S1-17-settings-standard');
      await t.page.selectOption('#s-difficulty', 'expert');
      t.expect(/no ball save/i.test(await hint()), 'and the hint follows the choice: ' + await hint());
      await t.shot('S1-17-settings-expert');
      await t.page.click('#b-back');
      t.expect(/Expert table/.test(await t.page.locator('#t-diff').textContent()), 'the title shows the choice');
      await t.shot('S1-17-title-expert');
      await t.reload();
      t.equal((await t.state()).settings.difficulty, 'expert', 'Expert survives a reload');
      await t.game('newGame', { balls: 3, seed: 5 });
      t.equal((await t.state()).difficulty, 'expert', 'and the next game is played on it');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: true, music: true, volume: 0.5, motion: 'auto', balls: 5, tier: 'auto', practice: false, textScale: 1 })));
      await t.reload();
      const s = await t.state();
      t.equal(s.settings.difficulty, 'standard', 'a save from before the setting is Standard'); t.equal(s.settings.balls, 5, 'and the rest of it is untouched');
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:settings', JSON.stringify({ v: 1, sound: true, music: true, difficulty: 'insane' })));
      await t.reload();
      t.equal((await t.state()).settings.difficulty, 'standard', 'a value the screen could not have written is Standard');
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:settings'));
    },
  },
  {
    name: 'S1-17 scores are stored with their table: old rows count as Standard, a new Expert score is tagged, in the saved table and on the High scores screen',
    async run(t) {
      await t.page.evaluate(() => localStorage.setItem('hsg-pinball:scores', JSON.stringify({ v: 1, table: [{ initials: 'OLD', score: 3000000, date: '2026-11-02' }, { initials: 'ODD', score: 2000000, date: '2026-11-02', difficulty: 'bogus' }] })));
      await t.reload();
      const s = await t.state();
      t.equal(s.scores.slice(0, 2).map((r) => r.difficulty), ['standard', 'standard'], 'rows without a table (or with a bad one) are Standard');
      await t.game('newGame', { balls: 3, seed: 5, difficulty: 'expert' });
      await t.game('setState', { player: { ball: 3, score: 9000000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      await t.page.waitForSelector('#b-ok');
      await t.page.click('#b-ok');
      await t.page.waitForSelector('#b-back');
      const saved = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:scores')).table);
      t.expect(saved[0].score >= 9000000 && saved[0].difficulty === 'expert', 'the new score is saved with Expert: ' + JSON.stringify(saved[0]));
      t.equal(saved.find((r) => r.initials === 'OLD').difficulty, 'standard', 'and the old row is saved as Standard');
      const cells = await t.page.locator('.scores tr').evaluateAll((rows) => rows.map((r) => r.textContent.replace(/\s+/g, ' ').trim()));
      t.expect(/Expert/.test(cells[0]) && !/Expert|Easy/.test(cells[1]), 'the High scores screen tags the Expert row and leaves Standard rows plain: ' + cells.slice(0, 3).join(' | '));
      await t.shot('S1-17-high-scores-expert');
      await t.checkLayout();
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:scores'));
    },
  },
  {
    name: 'S1-17 a game saved for Continue keeps its table, and a resume from before the setting continues on Standard',
    async run(t) {
      await t.page.evaluate(() => { localStorage.removeItem('hsg-pinball:resume'); localStorage.removeItem('hsg-pinball:settings'); });
      await t.reload();
      await t.game('newGame', { balls: 3, seed: 5, difficulty: 'easy' });
      await t.game('step', 10);
      await t.game('setState', { player: { ball: 2, score: 5000 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      const r = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:resume')));
      t.equal(r && r.difficulty, 'easy', 'the resume record carries the table');
      await t.page.evaluate(() => { const q = JSON.parse(localStorage.getItem('hsg-pinball:resume')); delete q.difficulty; localStorage.setItem('hsg-pinball:resume', JSON.stringify(q)); });
      await t.reload();
      await t.page.click('#b-continue');
      await t.waitFrames(3);
      t.equal((await t.state()).difficulty, 'standard', 'an old resume record plays on Standard');
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:resume'));
    },
  },
];

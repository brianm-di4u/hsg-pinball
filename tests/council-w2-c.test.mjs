// Council wave 2, batch C: balance tool, tuning, difficulty setting and escalation (S3-03, S1-17, S3-04).
// Everything here runs in Node on the sim itself (the rules are deterministic and have no DOM); the balance runs play
// whole games with the autoplay bot, so the numbers in these tests are the numbers `node tools/balance.mjs` prints.
import fs from 'node:fs';
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, nudge, MODES, STANDARD, DIFFICULTY, ROUND } from '../src/js/sim/rules.js';
import { wantedShots, createBot } from '../src/js/sim/bot.js';
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
    name: 'S3-03 Standard on the skill-0.8 bot over 30 games: an average ball of 35 to 90 s (C4-03: it was 40 with three kickbacks; K-02: the floor is 35), side drains under 35 percent, Soak and Derby reached in 20 percent of games',
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
    name: 'S3-03 an outlane kickback returns the ball to the shooter lane instead of draining, once a side a ball (C4-03, was three), then the outlane drains',
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
      G.ball.saveUntil = 0; G.w.balls[0].x = 40; G.w.balls[0].y = 300; G.cues.length = 0;
      outlane(G, 'outL');
      t.expect(dmds(G, 'OUTLANE').length === 1 && dmds(G, 'KICKBACK').length === 0, 'the second time it is only an outlane (C4-03: one a side on Standard)');
      t.equal(G.ball.kb.outL, 1, 'and none more is counted');
      G.ball.saveUntil = 0; G.w.balls[0].x = 450; G.w.balls[0].y = 300; G.cues.length = 0;
      outlane(G, 'outR');
      t.expect(dmds(G, 'KICKBACK').length === 1, 'the right side has its own one');
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
    name: 'S1-17 kickbacks a side per ball are 5 on Easy, 1 on Standard (C4-03, was 3) and none on Expert',
    node: true,
    async run(t) {
      for (const [name, n] of [['easy', 5], ['standard', 1], ['expert', 0]]) {
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
  // ---------------------------------------------------------------------------------------------- S3-04 escalation by round
  {
    name: 'S3-04 round 0 is the game as it was: the goals, values and clocks of all six modes are the old constants',
    node: true,
    async run(t) {
      const G = fresh(11);
      t.equal(G.f.round, 0, 'a new game starts in round 0');
      const need = {}, dur = {};
      for (let i = 0; i < 6; i++) { api.startMode(G, i); need[G.mode.id] = G.mode.need; dur[G.mode.id] = Math.round(G.mode.end - G.mode.t0); api.endMode(G, false); G.cues.length = 0; }
      t.equal(need, { soak: 6, derby: 100, raid: 3, tower: 3, tub: 5, coaster: 4 }, 'goals 6 baths, 100 percent, 3 slots, 3 ramps, 5 legs, 4 laps');
      t.equal(dur, { soak: 40, derby: 45, raid: 45, tower: 40, tub: 40, coaster: 40 }, 'clocks 40 and 45 s');
      api.startMode(G, 0); run(G, 2.4);
      G.cues.length = 0; G.mode.lit = [3]; G.w.events.push({ t: 'target', sw: T.sw.bhFordyce, speed: 900, dir: 1, ball: G.w.balls[0].id, x: 190 }); tick(G);
      t.equal(G.cues.filter((c) => c.k === 'score').reduce((a, c) => a + c.n, 0), 3000 + 15000, 'a Soak bath pays 15,000 on top of the Row target');
      api.endMode(G, false);
      api.startMode(G, 2); t.equal(G.mode.data.value, 200000, 'the Raid hurry-up starts at 200,000');
    },
  },
  {
    name: 'S3-04 finishing the wizard mode raises the round, with a callout, and the round stops at the cap',
    node: true,
    async run(t) {
      const G = fresh(12);
      for (let r = 1; r <= ROUND.max + 2; r++) {
        api.startValley(G); G.cues.length = 0;
        api.endMultiball(G);
        run(G, 2);
        const want = Math.min(ROUND.max, r);
        t.equal(G.f.round, want, `after wizard ${r} the round is ${want}`);
        if (r <= ROUND.max) t.expect(dmds(G, 'ROUND ' + (want + 1)).length === 1, 'the display says ROUND ' + (want + 1));
        else t.expect(!dmds(G).some((c) => /^ROUND/.test(c.text)), 'past the cap there is no new round');
      }
    },
  },
  {
    name: 'S3-04 in round 2 goals, values and clocks have grown by the named constants (and the display counts the new goal)',
    node: true,
    async run(t) {
      const G = fresh(13);
      G.f.round = 2;
      const m = (i) => { api.startMode(G, i); const x = G.mode; return x; };
      let x = m(0); t.equal([x.need, Math.round(x.end - x.t0)], [8, 50], 'Soak: 8 baths in 50 s');
      t.expect(dmds(G, 'BATHHOUSE SOAK').some((c) => c.sub === 'HIT 8 BATHS'), 'the display says HIT 8 BATHS'); api.endMode(G, false);
      x = m(2); t.equal([x.need, x.lit.length, x.data.value], [5, 5, 300000], 'Raid: 5 slots lit, a 300,000 hurry-up'); api.endMode(G, false);
      x = m(3); t.equal(x.need, 5, 'Tower: 5 ramps'); t.expect(dmds(G, 'TOWER CLIMB').some((c) => c.sub === 'RAMP 5 TIMES'), 'RAMP 5 TIMES'); api.endMode(G, false);
      x = m(4); t.equal(x.need, 7, 'Tub Race: 7 legs'); api.endMode(G, false);
      x = m(5); t.equal(x.need, 6, 'Coaster: 6 laps (the cap)'); api.endMode(G, false);
      x = m(1); t.equal(Math.round(x.end - x.t0), 55, 'Derby: a 55 s race'); api.endMode(G, false);
      // a Soak bath pays 1.5 times as much
      G.cues.length = 0; api.startMode(G, 0); run(G, 2.4);
      G.cues.length = 0; G.mode.lit = [3]; G.w.events.push({ t: 'target', sw: T.sw.bhFordyce, speed: 900, dir: 1, ball: G.w.balls[0].id, x: 190 }); tick(G);
      t.equal(G.cues.filter((c) => c.k === 'score').reduce((a, c) => a + c.n, 0), 3000 + 22500, 'a Soak bath pays 22,500 in round 2 (15,000 x 1.5)');
    },
  },
  {
    name: 'S3-04 the escalated modes can still be won: Tower needs 5 ramps in round 2 and pays 1.5 times, and the Derby rivals run faster',
    node: true,
    async run(t) {
      const G = fresh(14); G.f.round = 2; G.ball.inLane = false;
      api.startMode(G, 3); run(G, 2.4); G.cues.length = 0;
      const ramp = () => { G.ball.lastMajor = { t: -10, side: '' }; G.w.events.push({ t: 'hit', sw: T.sw.rampMade, speed: 900, dir: 1, ball: G.w.balls[0].id, x: 498 }); tick(G); };
      for (let i = 0; i < 4; i++) ramp();
      t.expect(G.mode && G.mode.progress === 4, 'four ramps are not enough in round 2');
      ramp();
      t.expect(!G.mode && dmds(G, 'TOP OF THE TOWER').length === 1, 'the fifth wins it');
      const ends = (round) => { const H = fresh(15); H.f.round = round; api.startMode(H, 1); run(H, 2.4); run(H, 20); return H.mode.data.horses.slice(1).reduce((a, b) => a + b, 0); };
      t.expect(ends(2) > ends(0) * 1.2, 'the rivals have covered more ground after the same 20 s in round 2 than in round 0');
    },
  },
  {
    name: 'S3-04 the round is part of the game in progress: it is in the state, in a resume, and an old resume without it starts at round 0',
    async run(t) {
      await t.page.evaluate(() => { localStorage.removeItem('hsg-pinball:resume'); localStorage.removeItem('hsg-pinball:settings'); });
      await t.reload();
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('step', 10);
      await t.game('setState', { player: { ball: 2, score: 5000 }, features: { round: 2 }, ball: { saveUntil: 0 } });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      const r = await t.page.evaluate(() => JSON.parse(localStorage.getItem('hsg-pinball:resume')));
      t.equal(r && r.features.round, 2, 'the resume record carries the round');
      await t.reload();
      await t.page.click('#b-continue');
      await t.waitFrames(3);
      t.equal((await t.state()).features.round, 2, 'Continue brings the round back');
      await t.page.evaluate(() => { const q = JSON.parse(localStorage.getItem('hsg-pinball:resume')); delete q.features.round; localStorage.setItem('hsg-pinball:resume', JSON.stringify(q)); });
      await t.reload();
      await t.page.click('#b-continue');
      await t.waitFrames(3);
      t.equal((await t.state()).features.round, 0, 'an old resume (no round) starts at round 0');
      await t.page.evaluate(() => localStorage.removeItem('hsg-pinball:resume'));
    },
  },
  {
    name: 'S3-04 a full bot game with the round forced up still finishes, and the first round of the balance run is unchanged by the escalation',
    node: true,
    async run(t) {
      for (const round of [1, 4]) {
        const G = fresh(30 + round); G.f.round = round;
        const bot = createBot(G, { skill: 0.9, seed: 3 });
        let n = 0;
        while (G.scene !== 'over' && n < 120 * 60 * 30) { bot(); tick(G); G.cues.length = 0; n++; }
        t.expect(G.scene === 'over', `a round ${round} game reaches game over (${(n / 120 / 60).toFixed(1)} min)`);
      }
      // ROUND at zero changes nothing: the same seed plays the same game
      // (the seed is one whose game does not reach the wizard mode inside the window: only then is it the game before the first wizard; C4-03 moved which seeds those are)
      const play = (seed) => { const G = fresh(seed); const bot = createBot(G, { skill: 0.8, seed: 9 }); let n = 0; while (G.scene !== 'over' && n < 120 * 60 * 20) { bot(); tick(G); G.cues.length = 0; n++; } return { score: G.player.score, round: G.f.round }; };
      // (the sim keeps a little state between games in one process, so the first game of a process differs from the next: one is played and thrown away first)
      let seed = 41; play(seed);
      let a = play(seed);
      while (a.round !== 0 && seed < 60) a = play(++seed);
      t.equal(a.round, 0, 'a seed was found whose game stays in round 0 (seed ' + seed + ')');
      const was = { ...ROUND };
      try { ROUND.value = 0.5; ROUND.goal = 2; ROUND.time = 9; ROUND.rivals = 0.4; t.equal(play(seed).score, a.score, 'with the escalation turned up the game before the first wizard is the same game (round 0)'); } finally { Object.assign(ROUND, was); }
    },
  },
  {
    name: 'S3-04 the display shows the round: the new goal on the mode start line and a ROUND callout after the wizard',
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 6 });
      await t.game('setState', { features: { round: 1 } });
      await t.game('act', 'mode', 0);
      await t.game('step', 30);
      t.equal((await t.state()).mode.need, 7, 'round 1 Soak asks for 7 baths');
      t.expect((await t.state()).callouts.includes('BATHHOUSE SOAK'), 'the mode start callout is on the display');
      await t.shot('S3-04-mode-start-round-2');
      await t.game('newGame', { balls: 3, seed: 6 });
      await t.game('act', 'multiball', 'valley');
      await t.game('step', 700);
      for (let i = 0; i < 12; i++) {
        const s = await t.state();
        if (!s.mb) break;
        await t.game('setState', { ball: { saveUntil: 0 } });
        await t.game('act', 'placeBall', 242, 60, 0, -1500);
        await t.game('step', 60);
      }
      let s = await t.state();
      t.equal(s.mb, null, 'the wizard mode is over');
      await t.game('step', 200);
      s = await t.state();
      t.equal(s.features.round, 1, 'the round is 1');
      t.expect(s.callouts.includes('ROUND 2'), 'ROUND 2 is on the display: ' + s.callouts.join(' | '));
    },
  },
];

// Council wave 2, batch C: balance tool, tuning, difficulty setting and escalation (S3-03, S1-17, S3-04).
// Everything here runs in Node on the sim itself (the rules are deterministic and have no DOM); the balance runs play
// whole games with the autoplay bot, so the numbers in these tests are the numbers `node tools/balance.mjs` prints.
import fs from 'node:fs';
import { compileTable } from '../src/js/sim/table.js';
import { spec, BATHHOUSES } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, MODES, STANDARD } from '../src/js/sim/rules.js';
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
    name: 'S3-03 an outlane kickback returns the ball to the shooter lane instead of draining, twice a side a ball, then the outlane drains',
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
      t.expect(dmds(G, 'OUTLANE').length === 1 && dmds(G, 'KICKBACK').length === 0, 'the third time it is only an outlane');
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
];

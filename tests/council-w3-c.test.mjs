// Council wave 3, batch C: controls, rules and play; difficulty, progression and records
// (S3-09, S6-14, S1-18, S1-27, CL-02, S1-08, S3-02, S4-22, S6-08).
// Sim rules run in Node on the sim itself, with fixed seeds, so they give the same answer every run; the page checks use the window.__game hooks.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, api, nextModeIndex, LADDER } from '../src/js/sim/rules.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = path.resolve(GAME, '..', '_council', 'hsg-pinball', 'wave-3', 'shots');
const shot = async (t, name) => { fs.mkdirSync(SHOTS, { recursive: true }); await t.page.screenshot({ path: path.join(SHOTS, name + '-' + (t.page.viewportSize().width > 600 ? 'desktop' : 'mobile') + '.png') }); };

const T = compileTable(spec);
const fresh = (seed = 1, o = {}) => { const G = createGame(T, { seed }); newGame(G, { seed, ...o }); G.cues.length = 0; return G; };
const run = (G, secs) => { for (let i = 0; i < Math.round(secs * 120); i++) tick(G); };
const play = (G, i, won) => { api.startMode(G, i); api.endMode(G, won); };
const drainLast = (G) => {
  G.player.ball = G.player.ballsPerGame - 1; G.ball.saveUntil = 0; G.ball.inLane = false; G.ball.launched = true;
  G.w.events.push({ t: 'drain', ball: G.w.balls[0].id, x: 240 });
  tick(G);
};

export const tests = [
  // ---------------------------------------------------------------------------------------------- S3-09
  {
    name: 'S3-09 six lost modes light neither the extra ball nor the wizard; two wins light the extra ball and four the wizard',
    node: true,
    async run(t) {
      const G = fresh(2);
      for (let i = 0; i < 6; i++) play(G, i, false);
      run(G, 3);
      t.equal(G.f.modesPlayed.join(''), '111111', 'all six were played');
      t.expect(!G.f.ebLit && !G.f.wizardLit, 'and lost: no extra ball (' + G.f.ebLit + ') and no wizard (' + G.f.wizardLit + ')');
      const H = fresh(3);
      play(H, 0, true); play(H, 1, false); run(H, 3);
      t.expect(!H.f.ebLit, 'one win is not enough for the extra ball');
      play(H, 2, true); run(H, 3);
      t.expect(H.f.ebLit && !H.f.wizardLit, 'two wins light the extra ball, not the wizard');
      play(H, 3, true); run(H, 3);
      t.expect(!H.f.wizardLit, 'three wins do not light the wizard');
      play(H, 4, true); run(H, 3);
      t.expect(H.f.wizardLit, 'four wins do, with two modes never played (' + H.f.modesPlayed.join('') + ')');
      t.equal(LADDER.wizardWins, 4, 'the constant says four');
    },
  },
  {
    name: 'S3-09 the bonus pays 15,000 for a won mode and 5,000 for one only played, and a tilt does not count the mode',
    node: true,
    async run(t) {
      const G = fresh(4);
      play(G, 0, true); play(G, 1, false); play(G, 2, false);
      drainLast(G);
      t.equal(G.bonus.parts.find((p) => p[0] === 'MODES')[1], 15000 + 5000 + 5000, 'one win and two losses: ' + JSON.stringify(G.bonus.parts));
      const H = fresh(5);
      api.startMode(H, 3); run(H, 3);
      api.tilt(H);
      t.equal(H.mode, null, 'the tilt ends the mode');
      t.equal(H.f.modesPlayed[3], 0, 'and it is not counted as played');
      t.equal(H.f.modesWon[3], 0, 'or won');
      const K = fresh(6);
      api.startMode(K, 2); run(K, 60);
      t.equal(K.mode, null, 'a mode that runs out of time ends');
      t.equal(K.f.modesPlayed[2] + '' + K.f.modesWon[2], '10', 'and counts as played, not won');
    },
  },
  {
    name: 'S3-09 with all six played and fewer than four won, the Vapors serves a lost mode again; after the wizard the wins start over',
    node: true,
    async run(t) {
      const G = fresh(7);
      for (const i of [0, 1, 2, 3, 4, 5]) play(G, i, i === 1);   // only Derby won
      G.f.nextMode = 0;
      t.equal(nextModeIndex(G.f), 0, 'Soak, which was lost, is offered again');
      G.f.modesWon[0] = 1; G.f.nextMode = 0;
      t.equal(nextModeIndex(G.f), 2, 'and the next lost one when that was won');
      const H = fresh(8);
      H.f.modesWon = [1, 1, 1, 1, 0, 0]; H.f.modesPlayed = [1, 1, 1, 1, 0, 0]; H.f.wizardLit = true;
      api.startValley(H); api.endMultiball(H);
      t.equal(H.f.modesWon.join('') + H.f.modesPlayed.join(''), '000000000000', 'the wizard ends and the ladder is empty again');
      t.expect(!H.f.wizardLit, 'the wizard is not lit again at once');
    },
  },
];

// Council wave 1, batch A1: stability, saves and lifecycle (part 1). One block per finding.
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { createGame, newGame, tick, plunger, nudge, api } from '../src/js/sim/rules.js';
import { autoPlunge, TICK } from '../src/js/sim/physics.js';

const T = compileTable(spec);
const run = (G, seconds) => { for (let i = 0; i < Math.round(seconds / TICK); i++) tick(G); };
const fresh = (o = {}) => { const G = createGame(T, { seed: 5 }); newGame(G, { balls: 3, seed: 5, ...o }); run(G, 0.6); return G; };

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-01
  {
    name: 'S1-01 every real plunger hold leaves the lane and starts the ball save',
    node: true,
    async run(t) {
      for (const ms of [160, 200, 300, 500, 700, 800, 900, 1250]) {
        const G = fresh();
        plunger(G, true); run(G, ms / 1000); plunger(G, false); run(G, 4);
        t.expect(G.ball.launched && !G.ball.inLane, `${ms} ms hold: ball left the lane`);
        t.expect(G.ball.saveUntil > 0, `${ms} ms hold: ball save running`);
      }
    },
  },
  {
    name: 'S1-01 a ball that rises part way and falls back does not start the ball save or skill shot',
    node: true,
    async run(t) {
      const G = fresh();
      autoPlunge(G.w, 0.55); run(G, 4);
      t.expect(G.ball.inLane && !G.ball.launched, 'still counted as in the lane');
      t.equal(G.ball.saveUntil, 0, 'no ball save started');
      t.equal(G.ball.skillUntil, 0, 'no skill-shot window started');
    },
  },
  // ---------------------------------------------------------------------------------------------- S2-03
  {
    name: 'S2-03 Restart and Quit in the pause menu need a second tap',
    async run(t) {
      for (const [id, expectScreen] of [['#b-quit', 'pause'], ['#b-restart', 'pause']]) {
        await t.game('newGame', { balls: 3, seed: 5 });
        await t.game('setState', { player: { score: 123456 } });
        await t.game('scene', 'pause');
        await t.waitFrames(2);
        await t.page.click(id);
        let s = await t.state();
        t.equal(s.screen, expectScreen, id + ': one tap leaves the pause menu open');
        t.equal(s.player.score, 123456, id + ': one tap keeps the game');
        t.equal(s.demo, false, id + ': still the live game');
        t.expect((await t.page.textContent(id)).includes('again'), id + ': the button asks for a second tap');
        await t.page.click(id);
        await t.waitFrames(2);
        s = await t.state();
        if (id === '#b-quit') t.expect(s.demo && s.screen === 'title', 'second tap quits to the title');
        else t.expect(!s.demo && s.screen === null && s.player.score === 0, 'second tap restarts the game');
      }
    },
  },
  // ---------------------------------------------------------------------------------------------- S3-12
  {
    name: 'S3-12 a tilted ball in practice drains, ends the ball and serves a live one',
    node: true,
    async run(t) {
      const G = fresh({ practice: true });
      autoPlunge(G.w, 0.9); run(G, 3);
      for (let i = 0; i < 12; i++) nudge(G, 'up');
      t.expect(G.player.tilted, 'the table is tilted');
      run(G, 60);
      const nBalls = G.w.balls.length;
      t.expect(!G.player.tilted, 'a fresh ball is not tilted any more');
      t.equal(G.player.ball, 2, 'the ball counter moved on to ball 2');
      t.equal(nBalls, 1, 'one ball is waiting');
    },
  },
];

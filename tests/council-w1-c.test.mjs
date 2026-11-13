// Council wave 1, batch C: screens, layout and words. One block per finding.

// synthetic multi-touch on the table: each call is one touchstart/touchend event for one finger
const finger = (page, type, id, x, y, others) => page.evaluate(([type, id, x, y, others]) => {
  const el = document.querySelector('#table');
  const mk = (i, px, py) => new Touch({ identifier: i, target: el, clientX: px, clientY: py });
  const ch = mk(id, x, y);
  const all = [...others.map((o) => mk(o[0], o[1], o[2])), ...(type === 'touchend' ? [] : [ch])];
  el.dispatchEvent(new TouchEvent(type, { bubbles: true, cancelable: true, touches: all, targetTouches: all, changedTouches: [ch] }));
}, [type, id, x, y, others]);

export const tests = [
  // ---------------------------------------------------------------------------------------------- S1-02
  {
    name: 'S1-02 flipping with two thumbs does not nudge the table',
    viewports: ['mobile'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      const r = await t.page.evaluate(() => { const b = document.querySelector('#table').getBoundingClientRect(); return { l: b.left, w: b.width, y: b.top + b.height * 0.8 }; });
      const L = [1, r.l + r.w * 0.25, r.y], R = [2, r.l + r.w * 0.75, r.y];
      for (let i = 0; i < 6; i++) {
        await finger(t.page, 'touchstart', 1, L[1], L[2], []);
        await t.page.waitForTimeout(120);
        await finger(t.page, 'touchstart', 2, R[1], R[2], [L]);   // right thumb lands while left is held
        await t.page.waitForTimeout(120);
        await finger(t.page, 'touchend', 1, L[1], L[2], [R]);
        await finger(t.page, 'touchend', 2, R[1], R[2], []);
      }
      const s = await t.state();
      t.equal(s.player.warnings, 0, 'no tilt warning from flipping');
      t.expect(s.player.bob < 0.5, 'no nudge was counted (bob ' + s.player.bob + ')');
    },
  },
  {
    name: 'S1-02 two fingers landing together on one side still nudge',
    viewports: ['mobile'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      const r = await t.page.evaluate(() => { const b = document.querySelector('#table').getBoundingClientRect(); return { l: b.left, w: b.width, y: b.top + b.height * 0.8 }; });
      const A = [1, r.l + r.w * 0.2, r.y], B = [2, r.l + r.w * 0.3, r.y];
      await finger(t.page, 'touchstart', 1, A[1], A[2], []);
      await finger(t.page, 'touchstart', 2, B[1], B[2], [A]);
      await finger(t.page, 'touchend', 1, A[1], A[2], [B]);
      await finger(t.page, 'touchend', 2, B[1], B[2], []);
      const s = await t.state();
      t.expect(s.player.bob > 0.5 && s.player.bob <= 1, 'one nudge counted (bob ' + s.player.bob + ')');
    },
  },
];

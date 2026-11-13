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
  // ---------------------------------------------------------------------------------------------- S6-04
  {
    name: 'S6-04 phone landscape keeps Menu, Launch and the title inside the screen',
    viewports: ['mobile'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 5 });
      await t.game('act', 'placeBall', 242, 60, 0, -1500);
      await t.game('step', 400);
      for (const [w, h] of [[667, 375], [568, 320], [844, 390], [932, 430]]) {
        await t.page.setViewportSize({ width: w, height: h });
        await t.waitFrames(5);
        const m = await t.page.evaluate(() => {
          const out = {};
          for (const sel of ['#b-menu', '#b-launch', '#b-launch .lbl', '#table', '.glass-title .t-big']) {
            const n = document.querySelector(sel); if (!n) { out[sel] = null; continue; }
            const r = n.getBoundingClientRect();
            const cs = getComputedStyle(n);
            out[sel] = { l: r.left, t: r.top, r: r.right, b: r.bottom, vis: cs.visibility, d: cs.display, clipped: n.scrollWidth > n.clientWidth + 1 };
          }
          out.launchReady = document.querySelector('#b-launch').classList.contains('ready');
          out.vw = innerWidth; out.vh = innerHeight;
          const tn = document.querySelector('.glass-title .t-big'), rg = document.createRange(); rg.selectNodeContents(tn);
          const tr = rg.getBoundingClientRect(), ga = document.querySelector('.glass-art').getBoundingClientRect();
          out.title = tr.left >= ga.left && tr.right <= ga.right; out.titleBox = [tr.left, tr.right, ga.left, ga.right].map(Math.round).join(',');
          return out;
        });
        const at = w + 'x' + h;
        await t.shot('s6-04-' + at);
        t.expect(m.launchReady, at + ': the ball waits in the lane, Launch is shown');
        for (const sel of ['#b-menu', '#b-launch']) {
          const r = m[sel];
          t.expect(r.l >= 0 && r.t >= 0 && r.r <= w + 0.5 && r.b <= h + 0.5, at + ' ' + sel + ' is inside the viewport (' + [r.l, r.t, r.r, r.b].map(Math.round).join(',') + ')');
          t.expect(r.r - r.l >= 44 && r.b - r.t >= 44, at + ' ' + sel + ' is at least 44 px');
          t.expect(!r.clipped, at + ' ' + sel + ' label is not clipped');
        }
        t.expect(m.title, at + ': the backglass title sits inside the panel (' + m.titleBox + ')');
        t.expect(m['#table'].r - m['#table'].l > 0 && m['#table'].b <= h + 0.5, at + ': the table fits the height');
      }
      await t.page.setViewportSize({ width: 390, height: 844 });
    },
  },
];

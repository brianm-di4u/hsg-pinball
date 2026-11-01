// M5: performance, tiers, size and load. PRD AC31–AC33. Frame budgets only mean something with --gpu.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const kb = (f) => fs.statSync(path.join(GAME, f)).size / 1024;

export const tests = [
  {
    name: 'AC33 size budgets', node: true,
    async run(t) {
      const html = kb('index.html');
      const assets = fs.readdirSync(path.join(GAME, 'assets')).filter((f) => f.endsWith('.js')).reduce((a, f) => a + kb('assets/' + f), 0);
      const vendor = kb('vendor/three-r186.min.js');
      t.log(`index.html ${html.toFixed(0)} KB, asset packs ${assets.toFixed(0)} KB, vendor ${vendor.toFixed(0)} KB`);
      t.expect(html <= 2048, 'index.html ≤ 2 MB');
      t.expect(assets + vendor <= 6144, 'lazy packs ≤ 6 MB');
    },
  },
  {
    name: 'AC33 interactive quickly',
    async run(t) {
      await t.reload();
      await t.waitIdle(8000);
      const boot = await t.page.evaluate(() => window.__bootMs);
      t.log('first load', t.loadMs, 'ms; warm boot to interactive', boot, 'ms');
      t.expect(boot < (t.gpu ? 2000 : 6000), 'interactive within 2 s (warm, real GPU)');
    },
  },
  {
    name: 'AC31 frame cost in play',
    viewports: ['desktop'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('act', 'plunge', 0.9);
      await t.page.waitForTimeout(800);
      const fc = await t.frameCost(3000);
      const s = await t.state();
      t.log('tier', s.tier, 'fps', fc.fps, 'taskMs', fc.taskMs, 'scriptMs', fc.scriptMs);
      if (t.gpu) t.expect(fc.taskMs < 14, 'main-thread work per frame under 14 ms');
    },
  },
  {
    name: 'AC31 frame spikes: ball in the lane vs in play',
    viewports: ['desktop'],
    async run(t) {
      // long frames are what used to reorder flips (a frame steps at most 0.1 s); report gaps and long tasks
      const probe = (ms) => t.page.evaluate((ms) => new Promise((res) => {
        const gaps = [], long = []; let last = performance.now();
        const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) long.push(e.duration); });
        try { po.observe({ type: 'longtask', buffered: false }); } catch { /* not supported */ }
        const end = last + ms;
        const f = (ts) => { gaps.push(ts - last); last = ts; if (ts < end) requestAnimationFrame(f); else { po.disconnect(); gaps.sort((a, b) => a - b); res({ n: gaps.length, p50: gaps[gaps.length >> 1], p95: gaps[Math.floor(gaps.length * 0.95)], max: gaps[gaps.length - 1], over100: gaps.filter((g) => g > 100).length, longTasks: long.length, longMax: Math.max(0, ...long) }); } };
        requestAnimationFrame(f);
      }), ms);
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.page.waitForTimeout(500);
      const lane = await probe(3000);
      await t.game('act', 'plunge', 0.9);
      const play = await probe(6000);
      const s = await t.state();
      const fmt = (r) => `p50 ${r.p50.toFixed(1)} p95 ${r.p95.toFixed(1)} max ${r.max.toFixed(1)} ms, ${r.over100} over 100 ms, ${r.longTasks} long tasks (max ${r.longMax.toFixed(0)} ms)`;
      t.log('tier', s.tier, '| lane:', fmt(lane), '| play:', fmt(play));
      if (t.gpu) t.expect(play.over100 === 0, 'no frame over 100 ms in play on a real GPU');
    },
  },
  {
    name: 'AC31 throttled phone-class CPU',
    viewports: ['mobile'],
    async run(t) {
      await t.game('newGame', { balls: 3, seed: 3 });
      await t.game('act', 'plunge', 0.9);
      await t.cpuThrottle(4);
      await t.page.waitForTimeout(800);
      const fc = await t.frameCost(3000);
      await t.cpuThrottle(1);
      const s = await t.state();
      t.log('tier', s.tier, 'fps', fc.fps, 'taskMs', fc.taskMs);
      t.expect(fc.fps > 20 || !t.gpu, 'playable frame rate at 4× throttle');
    },
  },
  {
    name: 'AC31 quality tiers switch',
    viewports: ['desktop'],
    async run(t) {
      for (const tier of ['low', 'medium', 'high', '2d']) {
        const r = await t.game('act', 'tier', tier);
        await t.waitFrames(6);
        t.log(tier, '→', r);
        await t.shot('m5-tier-' + tier, { wait: false });
      }
      const s = await t.state(); t.equal(s.view, '2d', 'flat 2D fallback active');
    },
  },
];

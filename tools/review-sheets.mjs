#!/usr/bin/env node
// Prepares review loop N's captures (reviews/PROTOCOL.md step 4): composes each 8-frame motion strip
// (desktop/S*-k.png → strips/S*.png), builds contact sheets (shared/test-harness/sheets.mjs), and, from loop 1 on,
// A/B pairs against loop N−1: every frame, close-up and strip side by side with this build on a seeded side, written
// to screenshots/review-loop-N/ab/ and the side to reviews/loop-N/ab-key.json (hidden from critics).
//   node tools/review-sheets.mjs <N>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { mulberry32 } from '../src/js/sim/rng.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(GAME, 'shared', 'test-harness', 'package.json'));
const N = +process.argv[2];
if (!(N >= 0)) { console.error('usage: review-sheets.mjs <N>'); process.exit(2); }
const set = (n) => path.join(GAME, 'screenshots', `review-loop-${n}`);
const cur = set(N), prev = set(N - 1);
const uri = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');

const { chromium } = require('playwright');
const browser = await chromium.launch();
const page = await browser.newPage();
async function compose(html, out, w, h) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:#111;font:600 18px system-ui;color:#eee">${html}</body></html>`);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out });
}

// 1. strips
const desk = path.join(cur, 'desktop');
const frames = fs.readdirSync(desk).filter((f) => /^s\d\d-.*-\d\.png$/i.test(f));   // the harness lowercases names
const strips = [...new Set(frames.map((f) => f.replace(/-\d\.png$/, '')))];
for (const s of strips) {
  const imgs = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => path.join(desk, `${s}-${k}.png`)).filter((f) => fs.existsSync(f));
  const W = 448, H = 280;
  await compose(`<div style="display:grid;grid-template-columns:repeat(4,${W}px);gap:4px;padding:4px">${imgs.map((f, k) => `<div style="position:relative"><img src="${uri(f)}" style="width:${W}px;height:${H}px;object-fit:cover;object-position:50% 50%"><span style="position:absolute;left:6px;top:4px;background:#000a;padding:1px 6px">${k}</span></div>`).join('')}</div>`, path.join(cur, 'strips', s + '.png'), W * 4 + 20, H * 2 + 12);
}
console.log(`strips: ${strips.join(', ') || '(none)'}`);

// 2. contact sheets
try { execFileSync(process.execPath, [path.join(GAME, 'shared', 'test-harness', 'sheets.mjs'), '.', '--milestone', `review-loop-${N}`], { cwd: GAME, stdio: 'inherit' }); } catch { console.log('sheets.mjs failed (continuing)'); }

// 3. A/B pairs
if (N > 0 && fs.existsSync(prev)) {
  const rnd = mulberry32(N * 7919 + 13);
  const newSide = rnd() < 0.5 ? 'A' : 'B';
  const list = [];
  for (const sub of ['desktop', 'mobile', 'strips']) {
    const d = path.join(cur, sub);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d).filter((x) => /^[rcs]\d\d.*\.png$/i.test(x) && !/^s\d\d-.*-\d\.png$/i.test(x))) {
      const a = path.join(d, f), b = path.join(prev, sub, f);
      if (!fs.existsSync(b)) continue;
      const [left, right] = newSide === 'A' ? [a, b] : [b, a];
      const tall = sub === 'mobile';
      const W = tall ? 390 : sub === 'strips' ? 900 : 640, H = tall ? 844 : sub === 'strips' ? 290 : 400;
      await compose(`<div style="display:flex;gap:10px;padding:8px">${[['A', left], ['B', right]].map(([k, f]) => `<div><div style="padding:2px 0 6px">${k}</div><img src="${uri(f)}" style="width:${W}px;height:${H}px;object-fit:contain;background:#000"></div>`).join('')}</div>`, path.join(cur, 'ab', `${sub}-${f}`), W * 2 + 30, H + 44);
      list.push(`${sub}-${f}`);
    }
  }
  const loopDir = path.join(GAME, 'reviews', `loop-${N}`);
  fs.mkdirSync(loopDir, { recursive: true });
  fs.writeFileSync(path.join(loopDir, 'ab-key.json'), JSON.stringify({ loop: N, newSide, pairs: list.length }, null, 2) + '\n');
  console.log(`A/B: ${list.length} pairs (side hidden in reviews/loop-${N}/ab-key.json)`);
}
await browser.close();

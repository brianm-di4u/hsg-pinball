// Debug drawing for the Node tools: the compiled table (and optional ball paths) as SVG, rendered to PNG with the
// test harness's Playwright Chromium so the Read tool can show it.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', '..', 'shared', 'test-harness', 'package.json'));

const KIND_COL = ['#9aa4b2', '#e8c547', '#ff6b4a', '#4ad0ff', '#7dff9a', '#c77dff', '#e8c547', '#ff4ad0'];

export function tableSvg(T, { paths = [], world = null, scale = 0.8, labels = true } = {}) {
  const W = T.width, H = T.height, s = scale;
  const X = (x) => (x * s).toFixed(1), Y = (y) => ((H - y) * s).toFixed(1);
  const o = [`<svg xmlns="http://www.w3.org/2000/svg" width="${W * s}" height="${H * s}" style="background:#14161c">`];
  for (const r of T.ramps) {
    o.push(`<polyline fill="none" stroke="${r.layer === 4 ? '#5a4a8a' : '#3a5a7a'}" stroke-width="${36 * s}" stroke-opacity="0.45" points="${r.pts.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ')}"/>`);
  }
  for (const sg of T.segs) {
    const col = sg.mask === 1 ? KIND_COL[sg.kind] : sg.mask === 2 ? '#6fa8dc' : '#b48ce0';
    o.push(`<line x1="${X(sg.ax)}" y1="${Y(sg.ay)}" x2="${X(sg.bx)}" y2="${Y(sg.by)}" stroke="${col}" stroke-width="${Math.max(1, sg.r * 2 * s)}" stroke-linecap="round" ${sg.mask !== 1 ? 'stroke-dasharray="4 3"' : ''}/>`);
  }
  for (const c of T.circles) o.push(`<circle cx="${X(c.x)}" cy="${Y(c.y)}" r="${c.r * s}" fill="${KIND_COL[c.kind]}" fill-opacity="0.8"/>`);
  for (const t of T.triggers) o.push(`<line x1="${X(t.ax)}" y1="${Y(t.ay)}" x2="${X(t.bx)}" y2="${Y(t.by)}" stroke="${t.layer ? '#ffffff' : t.spinner ? '#ff9f1c' : '#2ec4b6'}" stroke-width="1.5" stroke-dasharray="2 2"/>`);
  for (const h of T.holes) o.push(`<circle cx="${X(h.x)}" cy="${Y(h.y)}" r="${h.r * s}" fill="none" stroke="#ffd166" stroke-width="2"/>`);
  const fl = world ? world.flippers : T.flippers;
  for (const f of fl) {
    const tx = f.tipX ?? f.x + Math.cos(f.rest) * f.len, ty = f.tipY ?? f.y + Math.sin(f.rest) * f.len;
    o.push(`<line x1="${X(f.x)}" y1="${Y(f.y)}" x2="${X(tx)}" y2="${Y(ty)}" stroke="#ffffff" stroke-width="${f.r0 * 1.6 * s}" stroke-linecap="round"/>`);
  }
  const pal = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c', '#52b788', '#f15bb5'];
  paths.forEach((p, i) => {
    const col = p.color || pal[i % pal.length];
    o.push(`<polyline fill="none" stroke="${col}" stroke-width="1.4" stroke-opacity="0.85" points="${p.pts.map((q) => X(q[0]) + ',' + Y(q[1])).join(' ')}"/>`);
    if (p.label && labels) { const q = p.pts[p.pts.length - 1]; o.push(`<text x="${X(q[0]) }" y="${Y(q[1])}" fill="${col}" font-size="10" font-family="monospace">${p.label}</text>`); }
  });
  if (world) for (const b of world.balls) o.push(`<circle cx="${X(b.x)}" cy="${Y(b.y)}" r="${13.5 * s}" fill="#dfe6ee"/>`);
  if (labels) {
    for (let y = 0; y <= H; y += 100) o.push(`<text x="2" y="${Y(y)}" fill="#556" font-size="9" font-family="monospace">${y}</text>`);
    for (let x = 0; x <= W; x += 100) o.push(`<text x="${X(x)}" y="${H * s - 2}" fill="#556" font-size="9" font-family="monospace">${x}</text>`);
  }
  o.push('</svg>');
  return o.join('\n');
}

export async function svgToPng(svgs, outFiles) {
  const { chromium } = require('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (let i = 0; i < svgs.length; i++) {
    await page.setContent(`<html><body style="margin:0;background:#14161c">${svgs[i]}</body></html>`);
    const el = await page.$('svg');
    fs.mkdirSync(path.dirname(outFiles[i]), { recursive: true });
    await el.screenshot({ path: outFiles[i] });
  }
  await browser.close();
}

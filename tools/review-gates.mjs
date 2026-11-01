#!/usr/bin/env node
// Measured gates for review loop N → reviews/loop-N/gates.json (reviews/RUBRIC.md):
//   perf: GPU desktop High ≥ 55 fps and < 14 ms main-thread work; 4× throttled phone ≥ 30 fps; SwiftShader phone Low ≥ 20 fps
//   ip:   no commercial pinball maker or title, and no business logo text, in src/ or the built page
//   node tools/review-gates.mjs <N>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const N = +process.argv[2];
if (!(N >= 0)) { console.error('usage: review-gates.mjs <N>'); process.exit(2); }
const run = (gpu) => {
  const args = [path.join(GAME, 'shared', 'test-harness', 'run.mjs'), '.', '--file', 'gates', '--milestone', 'gates'];
  if (gpu) args.push('--gpu');
  try { execFileSync(process.execPath, args, { cwd: GAME, env: { ...process.env, GATES: '1' }, stdio: 'pipe' }); } catch { /* read the report anyway */ }
  const rep = JSON.parse(fs.readFileSync(path.join(GAME, 'screenshots', 'gates', 'report.json'), 'utf8'));
  return rep.tests.flatMap((x) => x.logs).filter((l) => /GATE /.test(l)).map((l) => JSON.parse(l.slice(l.indexOf('GATE ') + 5)));
};
const rows = [...run(true), ...run(false)];
const get = (k) => rows.find((r) => r.k === k) || {};
const d = get('desktop-gpu'), p = get('phone-throttled'), s = get('phone-swiftshader');
const perf = { pass: d.fps >= 55 && d.taskMs < 14 && p.fps >= 30 && s.fps >= 20, desktop: d, throttled: p, swiftshader: s };
const BANNED = /\b(Bally|Williams Electronics|Stern Pinball|Gottlieb|Zen Studios|Pinball FX|Data East|Jersey Jack|Space Cadet|Addams|Twilight Zone|Medieval Madness|Oaklawn Racing Casino Resort|Magic Springs Theme)\b/i;
const files = [path.join(GAME, 'index.html'), ...fs.readdirSync(path.join(GAME, 'src', 'js'), { recursive: true }).filter((f) => f.endsWith('.js')).map((f) => path.join(GAME, 'src', 'js', f))];
const hits = files.flatMap((f) => (BANNED.test(fs.readFileSync(f, 'utf8')) ? [path.relative(GAME, f)] : []));
const ip = { pass: hits.length === 0, hits, note: 'paintings checked by eye for text (art-src/PROMPTS.md)' };
const out = { loop: N, perf, ip };
fs.mkdirSync(path.join(GAME, 'reviews', `loop-${N}`), { recursive: true });
fs.writeFileSync(path.join(GAME, 'reviews', `loop-${N}`, 'gates.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`gates loop ${N}: perf ${perf.pass ? '✓' : '✗'} (desktop ${d.fps} fps / ${d.taskMs} ms, throttled ${p.fps}, swiftshader ${s.fps}) · ip ${ip.pass ? '✓' : '✗ ' + hits.join(',')}`);

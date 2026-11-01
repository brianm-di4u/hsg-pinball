// Every Hot Springs fact the game shows must carry a source key (src/js/sim/facts.js → research/town-content.md),
// fit the 128×32 DMD (≤ 40 characters), and no other source file may hard-code a year outside facts.js unless the
// line is marked `fact:` with the facts.js key it relies on. Exit 1 on any problem.
//   node tools/check-facts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FACTS } from '../src/js/sim/facts.js';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problems = [];
for (const [k, f] of Object.entries(FACTS)) {
  if (!f.src || f.src.length < 4) problems.push(`facts.${k}: no source`);
  if (f.text.length > 40) problems.push(`facts.${k}: ${f.text.length} chars (max 40)`);
}
const tc = fs.readFileSync(path.join(GAME, 'research', 'town-content.md'), 'utf8');
for (const [k, f] of Object.entries(FACTS)) {
  const sec = (f.src.match(/tc§(\d+)/) || [])[1];
  if (sec && !new RegExp('^## ' + sec + '\.', 'm').test(tc)) problems.push(`facts.${k}: town-content section ${sec} not found`);
}
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
for (const f of walk(path.join(GAME, 'src', 'js')).filter((p) => p.endsWith('.js') && !p.endsWith('facts.js'))) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    const strs = line.match(/(['"`])(?:\.|(?!\1).)*\1/g) || [];
    for (const s of strs) if (/\b(18[3-9]\d|19\d\d|20[0-2]\d)\b/.test(s) && !/fact:/.test(line) && !/^['"`]\d{4}-\d\d-\d\d['"`]$/.test(s)) problems.push(`${path.relative(GAME, f)}:${i + 1}: year in a string without a fact: marker: ${s.slice(0, 60)}`);
  });
}
if (problems.length) { console.log(problems.join('\n')); process.exitCode = 1; }
else console.log(`check-facts: ${Object.keys(FACTS).length} facts, all sourced; no unmarked years in src/js`);

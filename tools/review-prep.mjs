#!/usr/bin/env node
// Writes the briefs for review loop N from reviews/briefs/ (adapted from hsg-tub-rally tools/review-prep.mjs, MIT):
// the capture index (from the files in screenshots/review-loop-N), the A/B pair list, this loop's CHANGES.md (facts
// only) and the measured gates. No scores go into any brief.
//   node tools/review-prep.mjs <N>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REL = 'games/Pinball';
const N = +process.argv[2];
if (!(N >= 0)) { console.error('usage: review-prep.mjs <N>'); process.exit(2); }
const SHOTS = `review-loop-${N}`, shotDir = path.join(GAME, 'screenshots', SHOTS), loopDir = path.join(GAME, 'reviews', `loop-${N}`);
fs.mkdirSync(loopDir, { recursive: true });
const read = (f, d = '') => { try { return fs.readFileSync(f, 'utf8'); } catch { return d; } };
const ls = (sub, re) => (fs.existsSync(path.join(shotDir, sub)) ? fs.readdirSync(path.join(shotDir, sub)).filter((f) => re.test(f)).sort() : []);

const MOMENTS = {
  r01: ['title screen over the attract demo', 'ui, typography, art'], r02: ['ball served, skill shot lit', 'ui, readability'],
  r03: ['mid-game with progress lit', 'art, lighting, readability'], r04: ['ball in the pop bumpers', 'lighting, animation'],
  r05: ['ball on the Mountain Tower ramp', 'toys, readability'], r06: ['Arlington Multiball, three balls', 'readability, animation'],
  r07: ['a mode (Derby Day) with its DMD', 'ui, authenticity'], r08: ['wizard mode light show', 'lighting'],
  r09: ['how-to-play screen', 'typography, ui'], r10: ['high scores', 'typography, ui'], r11: ['phone landscape in play', 'mobile'],
  c01: ['close-up: Bathhouse Row targets and toys, lock lane', 'toys, authenticity'], c02: ['close-up: thermal-spring bumpers and S·P·A lanes', 'toys, lighting'],
  c03: ['close-up: flippers, slingshots, inserts', 'toys, art'], c04: ['close-up: the Vapors scoop and sign', 'toys, authenticity'],
  c05: ['close-up: Mountain Tower ramp, wireform, tower', 'toys'], c06: ['close-up: the Arlington and lock', 'toys, authenticity'],
  's01-flip': ['strip: a left-flipper shot', 'animation'], 's02-bumpers': ['strip: the ball in the bumpers', 'animation, lighting'], 's03-multiball': ['strip: Grand Soak multiball launch', 'animation'],
};
const desk = ls('desktop', /^[rc]\d\d.*\.png$/i), mob = ls('mobile', /^r\d\d.*\.png$/i), strips = ls('strips', /\.png$/);
let index = '| Capture | Moment | Main categories |\n|---|---|---|\n';
for (const f of desk) { const k = f.slice(0, 3); index += `| \`desktop/${f.replace(/\.png$/, '')}\` | ${MOMENTS[k] ? MOMENTS[k][0] : ''} | ${MOMENTS[k] ? MOMENTS[k][1] : ''} |\n`; }
for (const f of mob) { const k = f.slice(0, 3); index += `| \`mobile/${f.replace(/\.png$/, '')}\` | ${MOMENTS[k] ? MOMENTS[k][0] : ''} (phone) | mobile, ${MOMENTS[k] ? MOMENTS[k][1] : ''} |\n`; }
for (const f of strips) { const k = f.replace(/\.png$/, ''); index += `| \`strips/${k}\` | ${MOMENTS[k] ? MOMENTS[k][0] : ''} | ${MOMENTS[k] ? MOMENTS[k][1] : ''} |\n`; }
const sheets = ls('sheets', /\.png$/);
if (sheets.length) index += `\nContact sheets for a first sweep (the full-size files stay the evidence): ${sheets.map((f) => `\`sheets/${f}\``).join(', ')}.\n`;

const abFiles = ls('ab', /\.png$/);
const ab = abFiles.length
  ? `${abFiles.length} pairs in \`screenshots/${SHOTS}/ab/\`. Each image shows the same moment from two builds, **A** on the left and **B** on the right. One is this loop's build and the other the previous loop's; which is which is hidden from you, and A is the same build in every pair. Files: ${abFiles.map((f) => `\`ab/${f.replace(/\.png$/, '')}\``).join(', ')}.`
  : '(no previous loop to compare: this is the baseline. Leave `ab` out of your JSON block.)';
const changes = read(path.join(loopDir, 'CHANGES.md'), '(none recorded)').trim();
const gates = read(path.join(loopDir, 'gates.json'), '').trim();
const fill = (tpl, extra = {}) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => ({ LOOP: N, SHOTS, TIER: 'high', GAME: REL, INDEX: index, AB: ab, CHANGES: changes,
  GATES: gates ? '```json\n' + gates + '\n```' : '(not recorded)', PERF: gates ? '```json\n' + gates + '\n```' : '(not recorded)', ROLE: 'critic-claude (Critic A) or critic-codex (Critic B), as assigned', DRIFT: '', ...extra })[k] ?? m);
const briefs = path.join(GAME, 'reviews', 'briefs');
fs.writeFileSync(path.join(loopDir, 'brief.md'), fill(read(path.join(briefs, 'critic.md'))));
fs.writeFileSync(path.join(loopDir, 'brief-advocate.md'), fill(read(path.join(briefs, 'advocate.md'))));
fs.writeFileSync(path.join(loopDir, 'brief-prosecutor.md'), fill(read(path.join(briefs, 'prosecutor.md'))));
fs.writeFileSync(path.join(loopDir, 'brief-judge.md'), fill(read(path.join(briefs, 'judge.md'))));
console.log(`reviews/loop-${N}/: briefs written (${desk.length} desktop, ${mob.length} phone, ${strips.length} strips, ${abFiles.length} A/B pairs)`);

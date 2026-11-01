// node tools/draw-table.mjs [out.png]  — the compiled Spa City table as a debug diagram
import { compileTable } from '../src/js/sim/table.js';
import { spec } from '../src/js/sim/table-spa-city.js';
import { tableSvg, svgToPng } from './lib/draw.mjs';
const T = compileTable(spec);
const out = process.argv[2] || 'tools/out/table.png';
await svgToPng([tableSvg(T)], [out]);
console.log(out, T.segs.length, 'segments', T.circles.length, 'circles', T.triggers.length, 'triggers');

// Lists the asset packs that exist (assets/*.js) into data/assets.json, inlined into the page as PB_ASSETS, so the
// game requests only files that are really there (a missing file would log a 404 and fail the harness).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const GAME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.existsSync(path.join(GAME, 'assets')) ? fs.readdirSync(path.join(GAME, 'assets')).filter((f) => /\.js$/.test(f)).sort() : [];
fs.mkdirSync(path.join(GAME, 'data'), { recursive: true });
fs.writeFileSync(path.join(GAME, 'data', 'assets.json'), JSON.stringify(files) + '\n');
console.log('data/assets.json:', files.join(', ') || '(none)');

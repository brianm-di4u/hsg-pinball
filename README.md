# Spa City Pinball

An original, top-down 2.5D pinball table set on Bathhouse Row in Hot Springs, Arkansas. Part of the open-source
(MIT) **Hot Springs Games** collection.

Steaming thermal springs at the top (pop bumpers), the eight historic bathhouses across the middle in their real
north-to-south order (Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff, Lamar), the Mountain Tower ramp up
the right, the Central Avenue orbit up the left, the Vapors scoop and the Arlington ball lock. Six modes, three
multiballs and a wizard mode, "Valley of the Vapors". Places appear as setting only; the game is not affiliated with
any business shown, and every fact on screen comes from the collection's research notes (`research/town-content.md`).

## Play
Open `index.html` (works from `file://` too). Left Shift or Z and Right Shift or / flip; hold Space, Enter or ↓
to pull the plunger and release to fire; X, . and ↑ nudge (careful: tilt); Esc pauses. Touch: tap the left or right
half of the table, hold Launch. Gamepads work too.

## Build
```bash
npm run setup                 # once: test-harness dependencies + Chromium
npm run vendor                # vendor/three-r186.min.js (needs tools/dev: npm install there once)
node tools/build-art.mjs      # Codex paintings (art-src, git-ignored PNGs) → assets/art.js
node tools/pack-models.mjs    # Blender toys (art-src/blender/toys.py → art-src/models) → assets/models.js
npm run build                 # src/ → index.html
npm test                      # Playwright tests (add --gpu for real WebGL, --file-url for offline)
node tools/flow.mjs           # containment fuzz: thousands of seeded balls must all drain
node tools/shot-map.mjs       # which features each flip timing reaches
node tools/balance.mjs        # headless bot games: ball times, scores, feature counts
```
Only `index.html`, `assets/` and `vendor/` ship to the website.

## Layout
| Path | What |
|---|---|
| `src/js/sim/` | deterministic physics, table, rules, lamps (no DOM, no three.js; Node tools import it) |
| `src/js/gfx/` | three.js table view, the code-drawn playfield, the 2D fallback |
| `src/js/ui/` | DMD, input, audio (WebAudio synthesis), screens |
| `tools/` | build, packing, fuzz, shot map, balance, review-loop tools |
| `art-src/` | Blender script and models, Codex prompts (`PROMPTS.md`) |
| `research/` | `town-content.md` (every fact and its source), web findings |
| `PRD.md`, `MECHANICS.md`, `DEV-PLAN.md`, `SAMPLES.md`, `REPORT.md` | design, plan and results |

## Credits
- Ball, wall and flipper contact maths adapted from Ten Minute Physics #04, © 2021 Matthias Müller (MIT).
- three.js (MIT). Paintings made for this game with Codex (OpenAI image generation); toys modelled in scripted Blender.
- Facts: NPS Hot Springs National Park, Encyclopedia of Arkansas, HABS AR-28 and others; see `research/town-content.md`.

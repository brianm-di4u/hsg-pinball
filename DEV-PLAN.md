# Spa City Pinball: development plan

Step E of `shared/SESSION-BRIEF.md`.

## 1. Milestones
| M | Goal | Tasks | Exit |
|---|---|---|---|
| **M1** foundation | Physics, table, tools, scaffold | sim (physics, table, rng), table spec, `tools/flow.mjs`, `tools/shot-map.mjs`, `tools/draw-table.mjs`, vendored three.js, build, boot page with a 2D debug view, hooks skeleton, Node sim tests | AC1–AC7 pass; table boots in the browser |
| **M2** core loop | A full playable game | rules engine (ball lifecycle, scoring, skill shot, lanes, springs, Row, ramp/tower, orbit/Fifth Season, Vapors, lock, tilt, ball search, bonus, match, high scores), DMD, HUD, title/pause/settings/help, input (keys, touch, gamepad), saves, `tools/balance.mjs` | AC8–AC10, AC16–AC21, AC26–AC28, AC34 |
| **M3** visuals and content | The 3D table and all modes | Blender toys, Codex art (playfield, backglass, plastics), renderer (lighting, env, materials, shadows), inserts and lamps, post (bloom, grade), steam and sparks, all 6 modes, Grand Soak, Arlington Multiball, wizard, light shows | AC11–AC15, AC19, AC22–AC24 |
| **M4** polish | Sound, accessibility, mobile | audio and music, juice (shake, flashers, slow-mo save), reduced motion, contrast, text scale, colourblind lamp shapes, phone portrait and landscape layouts, help/rulesheet, `check-facts.mjs` | AC25, AC29, AC30, AC35 |
| **M5** optimization and release | Fast, small, offline | quality tiers and governor, perf runs (GPU, throttled, SwiftShader), size trim, file:// pass, REPORT.md | AC31–AC33, all AC re-run |
| Campaigns | Mechanics test campaign, visual review campaign (Tub Rally protocol) | see `TEST-CAMPAIGN.md` and `reviews/PROTOCOL.md` | campaign stop rules |

## 2. Task breakdown
### M1
1. Scaffold from `games/Cart Racing`: `package.json`, `shared/` harness copy, `tools/build-vendor.mjs`, `.gitignore`, LICENSE.
2. `sim/physics.js`, `sim/table.js`, `sim/rng.js`, `sim/table-spa-city.js` (done as a spike during research).
3. Tools: `draw-table`, `flow`, `shot-map`.
4. `src/index.html`, `src/js/main.js` (loop, accumulator, interpolation), `src/js/hooks.js`, 2D debug renderer `gfx/debug2d.js`.
5. Tests: `tests/m1.test.mjs` (Node sim tests: containment, tunnelling, coverage, cradle, determinism, sub-tick timing, plunge; browser boot).

### M2
1. `sim/rules.js` (state, events → scoring, cues), `sim/modes.js` (mode table), `sim/awards.js`.
2. `ui/dmd.js` (128×32 canvas, pixel font, animations, dot shader or CSS fallback), `ui/hud.js`, `ui/screens.js`
   (title, settings, help, pause, game over, initials, scores), `ui/input.js`, `save.js`.
3. `tools/balance.mjs`: headless autoplay bot (flips when a ball is in the flipper zone with a seeded timing
   spread), targets: average ball 45–90 s, every mode reachable, score spread.
4. Tests: `tests/m2.test.mjs`.

### M3
1. Blender scripts `art-src/blender/*.py` → GLB → `tools/pack-models.mjs` → `assets/models.js` (base64).
2. Codex art: pilot playfield and backglass, then batches → `art-src/*.png` → `tools/build-art.mjs` → `assets/art-*.js`.
3. `gfx/renderer.js`, `gfx/scene.js` (playfield, rails, toys), `gfx/ball.js`, `gfx/lamps.js`, `gfx/post.js`, `gfx/fx.js`, `gfx/camera.js`, `gfx/tiers.js`.
4. Modes, multiballs, wizard, light shows in `sim/modes.js` and `gfx/lamps.js`.
5. Tests: `tests/m3.test.mjs`.

### M4
1. `ui/audio.js` (synth SFX and music), juice, reduced motion, accessibility settings, layouts, help.
2. `tools/check-facts.mjs` with `data/facts.json` (every shown string with its source key).
3. Tests: `tests/m4.test.mjs`.

### M5
1. `tools/perf-gpu.mjs`, `tools/perf-budgets.json`, governor, size checks; `tests/m5.test.mjs`; REPORT.md.

## 3. `window.__game` hook spec
| Method | Returns / does |
|---|---|
| `seed(n)` | reseed rules RNG; returns n |
| `getState()` | `{scene, paused, tier, player, features, mode, multiball, balls:[{id,x,y,vx,vy,layer,held}], flippers, lamps:{name:state}, dmd:{text, mode}, callouts:[last 5], settings, scores, frame}` |
| `setState(s)` | merges a partial state (rules fields, balls) and redraws |
| `isIdle()` | false while a screen transition, DMD animation that blocks input, art load or saucer kick is in flight |
| `step(n)` | n sim ticks while paused (rules run too) |
| `pause()` / `resume()` | freeze / unfreeze the loop |
| `scene(name)` | `'title' | 'game' | 'settings' | 'help' | 'scores' | 'pause' | 'over' | 'entry'` |
| `newGame(opts)` | `{balls: 3|5, seed, practice}` starts a game and serves ball 1 to the plunger |
| `act('flip', side, down)` | press or release a flipper now |
| `act('flipAt', side, ms, holdMs)` | press `side` at sim time now+ms for holdMs (sub-tick) |
| `act('plunge', strength)` | auto-plunge at 0..1 |
| `act('nudge', dir)` | `'left' | 'right' | 'up'` |
| `act('placeBall', x, y, vx, vy, layer)` | put the (first) ball there |
| `act('addBall', x, y, vx, vy)` | another ball (multiball tests) |
| `act('clock', ms)` | freeze the render clock at ms (captures) |
| `act('tier', name)` | `'high' | 'medium' | 'low' | '2d'` |
| `act('mode', id)` | start a mode now |
| `act('award', name)` | apply a mystery award |
| `act('lamps', show)` | play a named light show |
| `act('camera', name)` | `'full' | 'follow' | 'top'` |
| `act('switch', name)` | fire a named switch as if hit |

## 4. Test matrix
Screenshots at desktop (D) and mobile (M) under `screenshots/<milestone>/<viewport>/`.
| AC | Test (file › name) | Screenshots |
|---|---|---|
| AC1 | m1 › containment fuzz (node) | — |
| AC2 | m1 › tunnelling sweep (node) | — |
| AC3 | m1 › shot coverage (node) | `tools/out/shots-*.png` (review) |
| AC4 | m1 › cradle (node) | — |
| AC5 | m1 › determinism (node) | — |
| AC6 | m1 › sub-tick flip timing (node) | — |
| AC7 | m1 › plunge strengths (node) | — |
| AC8 | m2 › ball lifecycle | `m2-01-serve`, `m2-02-drain-bonus`, `m2-03-game-over` |
| AC9 | m2 › skill shot | `m2-04-skill` |
| AC10 | m2 › lanes and multiplier | — |
| AC11 | m3 › springs boil | `m3-springs-boil` |
| AC12 | m3 › bathhouse row | `m3-row-complete` |
| AC13 | m3 › tower and lock multiball | `m3-multiball` |
| AC14 | m3 › modes 1–6 | `m3-mode-<id>` |
| AC15 | m3 › grand soak and wizard | `m3-grand-soak`, `m3-wizard` |
| AC16 | m2 › tilt | `m2-05-tilt` |
| AC17 | m2 › ball search | — |
| AC18 | m2 › extra ball, match, initials, persistence | `m2-06-entry`, `m2-07-scores` |
| AC19 | m3 › mystery awards | `m3-mystery` |
| AC20 | m2 › screens and navigation | `m2-title`, `m2-help`, `m2-settings`, `m2-pause` |
| AC21 | m2 › DMD legibility | `m2-dmd-*` |
| AC22 | m3 › table render (gpu) | `m3-table`, `m3-closeup-*` |
| AC23 | m3 › lamp states | `m3-lamps-*` |
| AC24 | m3 › light shows | `m3-show-*` |
| AC25 | m4 › audio cues | — |
| AC26 | m2 › settings persist | — |
| AC27 | m4 › layout both viewports | all |
| AC28 | m2 › touch and keyboard input | `m2-touch` |
| AC29 | m4 › reduced motion | `m4-reduced` |
| AC30 | m4 › contrast | — |
| AC31 | m5 › perf and tiers (gpu) | `m5-tier-*` |
| AC32 | every test (harness) + `--file-url` run | — |
| AC33 | m5 › size and load time | — |
| AC34 | m2 › storage blocked | — |
| AC35 | m4 › facts have sources (node) | — |

## 5. Defect log
| # | Found | Defect | Fix | Regression test |
|---|---|---|---|---|
| D1 | M1 flow fuzz | Mirrored walls kept the left side's points (object spread overrode `pts`) | `wall()` spreads options first | m1 › containment |
| D2 | M1 flow fuzz | A layer trigger promoted playfield balls onto the wire; balls escaped the table on layer 4 | layer triggers oriented per crossing; the wire drop masks to layer 4 only | m1 › containment |
| D3 | M1 flow fuzz | Ball trapped in the V between the right bank and the ramp block | bank ends moved; 36 mm drain gaps | m1 › containment |
| D4 | M1 flow fuzz | Flat ledge on the Vapors lane back; notch between bank ends and the lock lane | peaked lane back; bank joins | m1 › containment |
| D5 | M1 flow fuzz | Contact friction acted like glue on slowly rolling balls (stuck on gentle slopes) | no bounce under 40 mm/s, no friction under 150 mm/s | m1 › containment, cradle |
| D6 | M1 shot map | Flip timing snapped to the 8 ms tick; shot angles jumped up to 60 mm | `queueInput` applies inputs at the substep | m1 › sub-tick timing |
| D7 | M1 shot map | Vertical ramp mouth left ~3 mm of aperture for real shot angles | 52 mm mouth angled along the shot line | m1 › shot coverage |

# Spa City Pinball: report

An original top-down 2.5D pinball table set on Bathhouse Row in Hot Springs, Arkansas, built for the Hot Springs Games
collection (MIT). This report covers what was built, how the PRD's acceptance criteria stand, test results, the
mechanics test campaign, the visual review campaign, performance, known gaps and harness requests.

## What was built
- **Physics** (`src/js/sim/physics.js`): custom 2D pinball physics in the table plane. The contact maths is adapted
  from Ten Minute Physics #04 (MIT). It runs a 120 Hz tick with 8 substeps, and flips land on the exact substep.
  Walls are capsules with restitution falloff, flippers are tapered with coil and return dynamics, bumpers and slings
  kick, and gates are one-way. Saucers, spinners, ramp and wire layers with height profiles, a kinematic plunger,
  ball-ball contact and a grid broadphase are all included.
- **Table** (`src/js/sim/table-spa-city.js`): an original layout. Features were placed using the shot map
  (`tools/shot-map.mjs`), so every major shot is reachable. It includes:
  - S·P·A top lanes with a plunge-strength skill shot
  - three thermal-spring pop bumpers
  - eight bathhouse targets in their real north-to-south Row order
  - the Mountain Tower ramp and wire return
  - the Central Avenue orbit with spinner and the Reserve St channel
  - the Vapors scoop and the Arlington lock
- **Rules** (`src/js/sim/rules.js`):
  - Scoring and progression: spring temperature and boil, Row completion, tower levels, the Fifth Season meter,
    combos, bonus multiplier, extra balls, match and high scores.
  - Ball handling: skill shot, ball save, tilt with warnings, ball search.
  - Modes: six modes (Bathhouse Soak, Derby Day, Raid! 1967, Tower Climb, Tub Race, Coaster Hill).
  - Multiballs: Arlington Multiball, Grand Soak, and the wizard mode Valley of the Vapors.
  - Seeded mystery awards.
- **Presentation**:
  - three.js r186 table (`src/js/gfx/view3d.js`):
    - Toys: Blender toys (`art-src/blender/toys.py`) for the eight detailed bathhouses, the Arlington, the Vapors
      supper club with a neon marquee, the Mountain Tower, bumpers, flippers and spinner.
    - Playfield and backglass: Codex paintings (`art-src/PROMPTS.md`). The playfield is one continuous painting,
      composed over a layout guide rendered from the physics geometry. Lettering and inserts are drawn in code.
    - Hardware: geometry built from the physics walls (stainless guides, a clear ramp with continuous walls, a
      wireform with ties, printed sling plastics with posts and rubbers).
    - Lighting and effects: PBR lighting with mood lighting per mode, lamp bloom, contact shadows, ball reflections
      from a cube camera, steam.
  - A 128×32 DMD with an original font, callouts, silhouettes and animations.
  - Synthesized WebAudio sound and music.
  - Keyboard, touch and gamepad input; settings and high scores saved to localStorage.
  - Quality tiers and a flat 2D fallback.
  - Phone portrait and landscape layouts.
- **Research**:
  - `research/town-content.md`: every fact used, with its source.
  - `research/web-findings.md`: new web research on pinball and slot law, the 1967 raids, nicknames, thermal-water
    data and more.
  - Both merged into the shared corpus, including a new `research/arcades-and-amusements.md` and a Pinball section
    in `research/game-hooks.md`.
  - `tools/check-facts.mjs` fails the build if any shown fact has no source.

## Acceptance criteria (PRD §11)
| AC | Status | Evidence |
|---|---|---|
| AC1 containment | met | 4,000 seeded drops: all drain, 0 stuck, 0 escaped, 0 inside walls (m1) |
| AC2 no tunnelling | met | 1,500 shots at 6.5 m/s: 0 escapes (m1) |
| AC3 shot coverage | met | ramp, orbit, Vapors and lock reachable from both flippers; every target reachable from at least one (m1) |
| AC4 cradle | met | m1 |
| AC5 determinism | met | m1 |
| AC6 sub-tick flips | met | m1 |
| AC7 plunge, skill shot | met | every top lane reachable by plunge strength (m1) |
| AC8–AC10 ball lifecycle, skill shot, lanes | met | m2 |
| AC11–AC15 springs, Row, tower and lock, six modes, multiballs and wizard | met | m3 (Node) |
| AC16–AC19 tilt, ball search, extra ball, match, high scores, mystery awards | met | m2, m3 |
| AC20–AC21 screens, DMD | met | m2 |
| AC22–AC24 3D render, lamps, light shows | met | m3; lamp brightness verified at the GPU upload (m3 › AC23) |
| AC25 audio | met | m4 |
| AC26 settings persist | met | m2 |
| AC27 layout and touch targets | met | m4, plus `tools/check-layout.mjs` |
| AC28 input | met | m2 |
| AC29 reduced motion, strobe ≤ 3 Hz | met | m4 (fastest lamp cycle 3.00 Hz) |
| AC30 contrast | met | m4 |
| AC31 performance and tiers | met | 60 fps on a real GPU; throttled phone 36–53 fps; SwiftShader 33–60 fps (review gates) |
| AC32 no errors, no network, file:// | met | every test; `--file-url` final run |
| AC33 size and load | met | `index.html` 228 KB; asset packs 5.1 MB + vendor 0.7 MB (budget 6 MB); warm boot to interactive about 0.2 s |
| AC34 storage blocked | met | m2 |
| AC35 facts sourced | met | m4 (`check-facts`: 37 facts) |

**Partial:** the PRD's balance target is an average ball of 45–90 s. The headless autoplay bot (`tools/balance.mjs`,
skill 0.85) averages about 28 s per ball, up from 20 s before the flippers were lengthened from 82 to 87 mm. Most
of its drains are outlane drains plus centre drains with no flip. The bot is a crude player, and no human play time
was measured. See Known gaps.

## Tests
- Playwright harness, 79 test runs across m1–m5, the campaign and input suites, visual captures and the DMD art test:
  - v1.0.1: 79/79 pass on a real GPU (`--slow --gpu`), and 77/77 load from `file://` (`--file-url`).
  - The final run on a real GPU (`--milestone final --gpu`) and the offline run (`--file-url`) are recorded in
    `screenshots/final*/report.json`.
- Node tools:
  - `tools/flow.mjs`: containment fuzz.
  - `tools/shot-map.mjs`: shot coverage map.
  - `tools/balance.mjs`: bot games.
  - `tools/check-facts.mjs`: every shown fact has a source.
  - `tools/check-layout.mjs`: labels clear of inserts, walls, posts and holes.

## Mechanics test campaign (`TEST-CAMPAIGN.md`)
- **Rules fuzzing:** a state-fuzz against a shadow model. 15,000 random switch events produced 0 score mismatches
  and no broken invariants.
- **Soak:** 150 bot games (about 250 simulated minutes) all ended normally, with 0 exceptions.
- **Physics:** a three-ball fuzz had no escapes, plus the edge cases listed in `TEST-CAMPAIGN.md`.
- **Defects found:** five (C1–C5). Two were game-hanging tilt bugs; the others were a stuck flipper after pause, a
  race between pause and a queued flip, and Esc not closing the pause menu. Each has a regression test.
- **v1.0.1 input pass (C6–C10):** players on Windows saw flippers stick up once the ball was in play. With both Shift
  keys down, Windows flags the second Shift's keydown as a repeat and never sends a keyup for the first Shift
  released (confirmed with real injected keystrokes). Separately, a press late in a frame over 100 ms could be
  stamped after its own release. Also fixed: a key released behind a menu swallowing the next press, the quick-tap
  plunger, and stray release sounds. `tests/input.test.mjs` fails six of eight checks on v1.0.0 and passes all
  eight on v1.0.1.

## Visual review campaign (`reviews/`)
The Tub Rally protocol was adapted for pinball: blind Claude and Codex critics with seeded A/B pairs, then a
prosecutor and an advocate, then a judge, then a mechanical tally with the A/B rule. Gates are 7 in every category,
6 for authenticity, plus the measured perf and IP gates. The agreed stop rule was: pass, a 3-loop plateau, or a cap
at loop 10.

| Loop | Art | Toys | Lighting | Animation | UI | Type | Readability | Mobile | Authenticity | Total |
|---|---|---|---|---|---|---|---|---|---|---|
| 0 | 5.5 | 5 | 5 | 6 | 5.5 | 5.5 | 5 | 4.5 | 6 | 48.0 |
| 1 | 5.5 | 5.5 | 6 | 6 | 5.5 | 5.5 | 6 | 5.5 | 6.5 | 52.0 |
| 2 | 6.5 | 5.5 | 6 | 6 | 6 | 5.5 | 6 | 6.5 | 6.5 | 54.5 |
| 3 | 6.5 | 6 | 6 | 6.5 | 6.5 | 6 | 6.5 | 6.5 | 7 | 57.5 |
| 4 | 6.5 | 6 | 6 | 6.5 | 7 | 6.5 | 6.5 | 6.5 | 7 | 58.5 |
| 5 | 6.5 | 6.5 | 6.5 | 6.5 | 7 | 6.5 | 6.5 | 6.5 | 7.5 | 60.0 |
| 6 | 6.5 | 6.5 | 6.5 | 6.5 | 7 | 6.5 | 6.5 | 6.5 | 7.5 | 60.0 |
| 7 | 6.5 | 6.5 | 6.5 | 6.5 | 7 | 6.5 | 6.5 | 6.5 | 7.5 | 60.0 |
| 8 | **7** | 6.5 | 6.5 | 6.5 | **7** | 6.5 | 6.5 | 6.5 | **7.5** | **60.5** |

**Result:** the campaign stopped on the plateau rule after loop 8, with a best of 60.5/90, up 12.5 from the baseline.
Art, UI and authenticity meet their gates. Toys, lighting, animation, typography, readability and mobile each sit
half a point under. Perf and IP gates passed every loop. The full record is in `reviews/HISTORY.md` and
`reviews/loop-*/`.

**Big levers taken:**
- landmark toys rebuilt and enlarged
- one continuous playfield painting composed over the physics layout
- the hardware pass (rails, guides, slings, ramp)
- detailed Blender façades and the Vapors club
- a hardware kit (clear continuous ramp walls, printed sling plastics, thin stainless guides)
- the upper-field repaint as the Grand Promenade and Display Spring

**Defects found through the review** (DEV-PLAN D13–D21):
- Mood lighting never showed in still captures.
- A silent fallback from 3D to 2D. It is now a console error, so tests fail.
- Lamp colours not reaching the GPU. There is now a GPU-level lamp test.
- Mirrored decals.

**Remaining gaps the judge ranked highest at loop 8:**
1. Shot cues: arrow baselines, MOUNTAIN TOWER plate placement, skill-lane guidance.
2. Glare hotspots on the wireform and tower.
3. Larger playfield labels.
4. A deco UI typeface for menus.
5. Flipper bevel and decal.
6. Stronger contact shadows.
7. Bevelled scoop and lock walls.
8. Follow-through: sling flex, ball streak, camera kick.
9. Landscape table scale.

**Applied after the campaign, not reviewed:** the shot-arrow baseline and a satin wireform.

## Performance (real GPU, RTX-class desktop; loop-8 gates)
| Proxy | Tier | Result | Budget |
|---|---|---|---|
| Desktop 1280×800 | High | 60 fps, 2.2–3.9 ms main thread per frame | ≥ 55 fps, < 14 ms |
| Phone 390×844, 4× CPU throttle | High / Medium | 36–53 fps | ≥ 30 fps |
| Phone, SwiftShader (software GL) | Low | 33–60 fps | ≥ 20 fps |

The governor steps down from High to Medium to Low, and finally to the flat 2D table when software GL is still too
slow.

v1.0.1 adds frame-spike and flip-latency probes (real GPU, desktop High): frames hold 16.7 ms at p50 and 16.8 ms at
max, with the ball in the lane and in play alike, and no long tasks. A flip moves the flipper on the next frame (17 ms
median) at full speed, and within two frames (19 ms median, 33 ms max) at 4× CPU throttle.

## Known gaps
- **Two Shift keys on Windows:** while one Shift is held, Windows reports nothing when the other is released, so that
  flipper stays up until both are up. No browser can see that release. Z and / (or the arrows) have no such limit,
  and the help screen says so.
- **Balance:** the bot's ball time (about 28 s) is below the 45–90 s target. Human play testing is needed before
  tuning further. The levers are outlane geometry, ball-save length and flipper strength.
- **Visual gates:** six categories at 6.5 against gates of 7 (see above). The next real levers would be a typeface
  pass, glare control on chrome, and a playfield label system built into the painting.
- **Asset size:** the packs total 5.9 MB against the 6 MB budget. The models (3.4 MB of base64 GLB) could be
  quantized like Tub Rally's model packs.
- **Out of scope** (as specified): multiplayer, online leaderboards, a table editor.

## Harness requests
- `run.mjs` lowercases screenshot names. The review tools work around this; preserving case, or documenting it,
  would help.
- A built-in way for a Codex critic to save its own output, which the review protocol now relies on.

## Update: repainted backgrounds (v1.1.0, 2026-11-02)

The backglass painting was repainted. The new source PNGs replace the `art-src/art.json` sources (git-ignored; the
workspace keeps copies of the old and new paintings in `reference/backgrounds/`) and were packed with the usual tools.

`npm test`: 77/77 passed.

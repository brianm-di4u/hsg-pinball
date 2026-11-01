# Spa City Pinball: code-sample survey

Step B of `shared/SESSION-BRIEF.md`. Licences were checked at the source on 2026-11-01. Only MIT, BSD, ISC,
Apache-2.0, Unlicense or CC0 code is adapted; everything else is read for ideas only. Downloads live in the
git-ignored `reference-samples/` and are never run.

| # | Sample | Licence | Version | Does well | Does badly | Verdict |
|---|---|---|---|---|---|---|
| 1 | **Ten Minute Physics #04 "How to write a pinball simulation"**, Matthias Müller. [source](https://github.com/matthias-research/pages/blob/master/tenMinutePhysics/04-pinball.html) | **MIT** (header, © 2021) | `master`, fetched 2026-11-01 (584 lines) | Tiny, correct ball-vs-segment and ball-vs-flipper contact: closest point, push out, replace the normal velocity using the flipper surface velocity `perp(r)·ω`. Semi-implicit Euler | One step per frame at 1/60 s (frame-rate dependent, tunnels at speed); no restitution on flippers; no friction; circular bumpers only; no switches, ramps or layers | **Adapted**: the contact maths in `src/js/sim/physics.js` (`collideSeg`, `collideFlipper`, `closest`), with the copyright line in the file header |
| 2 | **pinball-xr**, patrick-s-young. [github](https://github.com/patrick-s-young/pinball-xr) | MIT | `main`, 2026-11-01 | Solenoid flipper model, a plumb-bob tilt, and headless physics tests for stuck balls and tunnelling | Built on Rapier 3D at 240 Hz; loads VPX tables whose files belong to their authors | **Ideas only** (different engine): the tilt bob and the test ideas (`tools/flow.mjs`, the containment fuzz) |
| 3 | **planck.js `example/Pinball.js`**. [github](https://github.com/shakiba/planck.js/blob/master/example/Pinball.js) | MIT | 1.x | Ball as a Box2D `bullet` (continuous collision), flipper on a revolute-joint motor | A general rigid-body engine for one ball; heavier than needed; no layers | **Fallback idea only**; not used |
| 4 | **Visual Pinball X**. [github](https://github.com/vpinball/vpinball) | GPLv3+ (plus a legacy non-commercial licence) | 10.8 | The reference for flipper feel: elasticity falloff with impact speed, end-of-stroke behaviour, live catches | GPL; C++ | **Reference only, no code**: the falloff idea (`respond()` uses its own formula) and the flipper-feel targets in `MECHANICS.md` |
| 5 | **vpx-js** (vpdb). [github](https://github.com/vpdb/vpx-js) | GPL-2.0 | `master` | A full port of the VPX collision and rigid-body code to TypeScript and three.js | GPL; work in progress | **Reference only** |
| 6 | **h5dmd** (bzhmaddog). [github](https://github.com/bzhmaddog/h5dmd) | LGPL-3.0 | `master` | A layered DMD model (text, animation and video layers composited to a dot grid) | LGPL; WebGPU path | **Ideas only**: our DMD (`src/js/ui/dmd.js`) draws a 128×32 canvas and shows it through a dot-grid shader, written from scratch |
| 7 | **three.js r186** (npm `three@0.186.1`) | MIT | 0.186.1 | Renderer, PBR materials, `EffectComposer` + `UnrealBloomPass`, `GLTFLoader`, `RoomEnvironment` | — | **Vendored** as a classic-script IIFE (`tools/build-vendor.mjs`, adapted from `hsg-tub-rally`, MIT); licence in `vendor/three-LICENSE` |

Also read and rejected: matter.js and cannon-es (no continuous collision; developers report balls tunnelling
through flippers), the Space Cadet decompilation (MIT label on code decompiled from a proprietary binary),
Emilia Pinball (GPL-2), Future Pinball (closed freeware). A 1937 commercial pinball machine was titled
"Hot Springs" (theme unknown, `research/web-findings.md`); this game never uses that bare title.

## Collection code reused (MIT, Hot Springs Games)
| From | What | Where it lands |
|---|---|---|
| `games/Cart Racing` (hsg-tub-rally) | Folder layout with a DOM-free `src/js/sim/`, `tools/build-vendor.mjs`, `tools/sync-repo.mjs`, review-loop tools and protocol, the harness copy in `shared/` | same paths here |
| `games/property-game` | Renderer setup (`board3d.js`: tone mapping, soft shadows, PMREM env, render-on-change, software-GL probe, frame watchdog), settings and save (`main.js` `store`), WebAudio synth (`audio.js`) | `src/js/gfx/renderer.js`, `src/js/save.js`, `src/js/ui/audio.js` |
| `games/football` | The post chain: HDR target, bloom with a high threshold so only lamps glow, code-built colour grade, grain (`post3d.js`) | `src/js/gfx/post.js` |
| `shared/design/tokens.css` | `gilded-spa` and `deco-neon` palettes | `src/styles/main.css` |

## Side-by-side: what becomes the foundation
- **Physics:** sample 1's contact model is the core. Added: a 120 Hz fixed tick with 8 substeps (about 1 kHz),
  inputs timed to the substep, capsule walls with restitution falloff and impact-only friction, tapered flippers
  with coil acceleration and a return spring, kicking bumpers and slings, one-way gates, layers for the ramp and
  wire with height profiles, saucers, a kinematic plunger, ball-ball contact and a grid broadphase.
- **Table data:** none of the open formats are both open and permissive, so the table is a JS spec
  (`src/js/sim/table-spa-city.js`) compiled by `table.js`; Node tools draw it, fuzz it and map shots.
- **Testing:** sample 2's idea of headless physics tests grew into `tools/flow.mjs` (thousands of seeded drops
  must all drain) and `tools/shot-map.mjs` (every feature reachable from both flippers).

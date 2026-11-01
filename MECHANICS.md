# Spa City Pinball: core mechanics

Step C of `shared/SESSION-BRIEF.md`. The foundation every later milestone builds on.

## 1. Layers of the program
```
input (keys, touch, gamepad; event timestamps)
   │  queueInput(t)
   ▼
sim/physics.js ──events──► sim/rules.js ──callouts, lamps, scores──► ui (DMD, HUD) · audio · gfx
   ▲   fixed 120 Hz × 8 substeps          seeded rng                     three.js reads positions, interpolates
   └── sim/table.js (compiled from sim/table-spa-city.js)
```
`src/js/sim/` has no DOM and no three.js. Node tools (`tools/flow.mjs`, `tools/shot-map.mjs`,
`tools/balance.mjs`) and Node tests import it directly.

## 2. Loop and timing
- **Fixed tick** `TICK = 1/120 s`, `SUB = 8` substeps (`DT ≈ 1.04 ms`). At the speed cap (6.5 m/s) the ball
  moves 6.8 mm per substep, half its radius, so it cannot pass through a wall (capsule radius ≥ 2.5 mm plus
  the 13.5 mm ball).
- **Accumulator:** the main loop adds real elapsed time (clamped to 0.1 s after a hitch), runs whole ticks,
  and the renderer interpolates ball and flipper poses between the last two ticks. Speed never depends on
  frame rate.
- **Input timing:** a key or touch event carries `event.timeStamp`. The loop converts it to sim time and calls
  `queueInput(w, t, fn)`; the flip lands on the exact substep. (Without this, flip timing snapped to 8 ms and
  shot angles jumped by up to 60 mm at mid-table.)
- **Slow motion:** rules can request a time scale (ball-save rescue 0.35× for 0.5 s; never in tests unless
  asked). Reduced motion disables it.
- **Pause** stops the accumulator. `__game.step(n)` runs n ticks while paused.

## 3. Physics model (`physics.js`)
Units mm and s; +y up the table; gravity along the playfield `G_TABLE = 1350 mm/s²` (about 7.9°).

| Element | Model |
|---|---|
| Ball | r 13.5 mm, semi-implicit Euler, rolling damping 0.03/s, speed cap 6.5 m/s, `layer` bit (1 field, 2 ramp, 4 wire), `z` from the ramp profile |
| Walls | capsule segments (radius = rail half-width) per kind: WALL e 0.3, RUBBER e 0.5–0.7, SLING (kicks 1.1 m/s along its normal above 160 mm/s), TARGET (switch), GATE (one-way), DROP |
| Contact | push out along the normal; restitution on relative normal speed with falloff `e = e0 / (1 + max(0, v−600)/2600)`; contacts slower than 40 mm/s don't bounce, slower than 150 mm/s get no friction (a rolling ball keeps rolling); impacts get Coulomb friction |
| Flippers | tapered capsule (r 13 → 6.5 mm, 82 mm long), stroke 54°, coil acceleration 2600 rad/s² to 32 rad/s, return 1500 rad/s² to 24 rad/s, end-of-stroke stop. Kinematic: ball response uses the surface velocity `ω × r` at the contact |
| Pop bumpers | circle; any contact throws the ball out at ≥ 1.5 m/s, 60 ms refire guard |
| Plunger | kinematic tip in the shooter lane; hold pulls back at 105 mm/s to 50 mm, release drives it up at up to 2.25 m/s |
| Triggers | segments the ball centre crosses: rollovers, the spinner (reports crossing speed), layer changes (`[from, to]` along the normal and back) |
| Holes | saucers that capture a ball under a speed limit; rules kick it out (`kickOut`) |
| Ramp | centre line with a height per point; off layer 1 the ball takes `G_RAMP·slope` along the line and its `z` |
| Ball-ball | equal-mass impulse, e 0.9 |
| Broadphase | 48 mm grid of segment and circle ids |

Determinism: no `Math.random` in `sim/`; the same inputs at the same sim times give the same outcome.

## 4. Table (`table-spa-city.js` → `table.js`)
A JS spec of walls, circles, flippers, triggers, holes, ramps and named switches, compiled to flat arrays and a
grid. Lower playfield mirror-symmetric about x = 242.5. Feature placement comes from `tools/shot-map.mjs`.
Gates on the table: containment fuzz (`tools/flow.mjs`, 4,000 seeded drops all drain, none stuck or escaped)
and shot coverage (every feature reached from both flippers over inlane, drop and cradle feeds).

## 5. State model
One serializable object, `game` (rules) plus `physics.snapshot(w)`:
```js
{
  scene: 'attract' | 'game' | 'over' | 'entry',
  player: { score, ball, ballsPerGame, extraBalls, bonusX, tilted, warnings },
  ballInPlay: { saveUntil, skillLane, startedAt, kickers: [...] },
  features: { spa: [0,0,0], springTemp, row: [8 x 0|1], rowDone, towerLevel, fifth, locks, lockLit,
              modesDone: [6 x bool], mode: { id, t, progress, … } | null, multiball: null | {...}, wizardLit },
  physics: { tick, balls: [...], flippers: [...], plunger, drops },
  rngSeed
}
```

## 6. Rules engine (`rules.js`, `modes.js`)
- Consumes physics events (`roll`, `target`, `bumper`, `sling`, `spinner`, `hole`, `drain`, `flipHit`) once per
  tick, updates the state, and emits presentation cues: `{callout, dmd, lamp, sound, shake, score}`.
- Ball lifecycle: serve to the plunger → ball save (10 s, ends early once the ball has hit 3 switches and then
  the timer runs out) → drain → end-of-ball bonus → next ball or game over → match → initials entry.
- Skill shot: one top lane lit at plunge; landing in it within 4 s scores it.
- Tilt: each nudge adds to a bob value that decays 1.2/s; above 2.0 a warning (3 allowed), the next tilts the
  ball (flippers dead, no bonus).
- Ball search: if every ball has been still for 5 s outside a saucer or the shooter lane, the rules pulse the
  bumpers and saucers, then nudge the stuck ball.
- Full rules and scoring in `PRD.md` §4.

## 7. Input
| Action | Keyboard | Touch | Gamepad |
|---|---|---|---|
| Left flipper | Left Shift, Z, ← | left half of the table | LB / LT |
| Right flipper | Right Shift, /, → | right half of the table | RB / RT |
| Plunger | hold Space / Enter / ↓, release | drag down on the plunger, release | A (hold) |
| Nudge | X (left), . (right), ↑ (up) | two-finger swipe | sticks |
| Start / menu | Enter / Esc | buttons | Start / Back |
Times come from event timestamps; held keys use `keydown`/`keyup` only (auto-repeat ignored).

## 8. Rendering
- **Layer 1** `<canvas id="gl">`: three.js r186 (classic-script vendor bundle). Near-overhead camera (pitch
  about 18° off vertical), `NeutralToneMapping`, soft shadows from a key spot, `RoomEnvironment` PMREM for
  reflections (chrome ball, rails), MeshPhysical clearcoat playfield, emissive inserts that bloom
  (`UnrealBloomPass`, threshold above the playfield's brightest lit colour), a code-built colour grade.
- **Layer 2** DOM/CSS: DMD panel (a 128×32 canvas through a dot shader), backglass, HUD, menus.
- Quality tiers (high, medium, low) chosen at start from a GPU probe and adjusted by a frame governor that
  ignores frames longer than 0.2 s; a 2D canvas fallback renders the same sim when WebGL is missing.
- Render is interpolated between the last two sim ticks.

## 9. RNG
`sim/rng.js` (mulberry32). Used for mystery awards, mode order offers, the attract show and match digits.
`__game.seed(n)` reseeds.

## 10. Save format (`localStorage`, all wrapped in try/catch)
- `hsg-pinball:settings` `{v:1, sound, music, volume, motion, ballsPerGame, flipperKeys, tier}`
- `hsg-pinball:scores` `{v:1, table:[{initials, score, date}] × 10}` (seeded with fictional defaults)
- `hsg-pinball:stats` `{v:1, games, bestMode, …}`
The game runs with storage blocked.

## 11. `window.__game` hooks
`seed(n)`, `getState()`, `setState(s)`, `isIdle()`, `step(n)`, `pause()`, `resume()`, `scene(name)`,
`newGame(opts)`, and `act(name, …)` with: `flip(side, down)`, `flipAt(side, ms)`, `plunge(strength)`,
`nudge(dir)`, `placeBall(x, y, vx, vy, layer)`, `clock(ms)` (freeze the render clock for captures),
`tier(name)`, `mode(id)` (start a mode), `lamps(name)` (light show), `award(name)`, `camera(name)`.
Full contract in `DEV-PLAN.md` §3.

# Spa City Pinball: mechanics test campaign

Modelled on `games/mahjong/TEST-CAMPAIGN.md`: fuzz the engine against a shadow model, soak it with whole games,
walk the edge cases, and give every defect a regression test. Tests live in `tests/campaign.test.mjs` (plus the
physics fuzz in `tests/m1.test.mjs` and `tools/flow.mjs`).

```bash
node shared/test-harness/run.mjs . --file campaign --slow
node tools/flow.mjs --n 4000 --seed 2026
```

## What runs
| Area | Test | Scale | Result |
|---|---|---|---|
| Physics containment | m1 › AC1, `tools/flow.mjs` | 4,000 seeded drops at random positions and velocities | all drain; 0 stuck, 0 escaped, 0 inside walls |
| Tunnelling | m1 › AC2 | 1,500 shots at the 6.5 m/s speed cap, flippers up and down | 0 escapes |
| Three-ball physics | campaign › three-ball fuzz | 600 runs × 6 s | no escapes, no overlaps deeper than 4 mm |
| Rules vs shadow model | campaign › state-fuzz | 40 games, ~15,000 random switch events plus drains, nudges, flips and saucer kicks | 6,250 simple-switch scores checked, 0 mismatches; invariants held (score finite and non-negative, multiplier 1–5, spring 100–143 °F, locks ≤ 2, tower ≤ 3, ball within the game, mode timers bounded, no NaN balls) |
| Soak | campaign › 150 bot games | about 180 simulated minutes | every game ends; 0 exceptions |
| Shot coverage | m1 › AC3, `tools/shot-map.mjs` | 3 feeds × 2 flippers × ~1 ms flip steps | every feature reached; ramp, orbit, Vapors and lock from both flippers |
| Determinism | m1 › AC5 | 60 s scripted game twice | identical snapshots |
| Edge cases | campaign › edge tests | see below | pass |

## Edge cases walked
- Drain while the Vapors holds the ball for a mode intro (the mode ends and counts as played).
- Tilt during multiball: flippers dead, saucers still eject, balls drain, the ball ends.
- Game over while a mode runs: no mode left behind.
- Extra ball after a tilted ball: shoot again, untilted.
- Plunger pulled with no ball in the lane: nothing happens.
- Lock shot during a multiball: no lock.
- Pause while holding a flipper: released, and stays released after resume.
- Keys while a menu is open: ignored; Esc backs out of settings to the pause menu.

## Defects found by the campaign
| # | Defect | Fix | Regression test |
|---|---|---|---|
| C1 | A tilted ball that entered a saucer was never kicked out: the game hung | saucers eject (without scoring) when tilted; tilting releases held balls | campaign › tilt in multiball |
| C2 | After a tilt, balls resting in the shooter lane were never launched, so the ball could not end | a tilted table auto-plunges the lane; multiball feeds wait for a clear lane instead of stacking balls | campaign › tilt in multiball |
| C3 | Pausing while a flipper key was held left the flipper up (key-up arrived while paused) | pause releases flippers and plunger | campaign › pause during a held flip |
| C4 | Race: a flip queued for a later substep fired after the pause released it | pause clears pending timed inputs | campaign › pause during a held flip (3 repeat runs) |
| C5 | Esc could not close the pause menu (menu-open key filter swallowed it) | Esc always reaches the app; backs out of sub-screens | m2 › AC20, campaign › menus |

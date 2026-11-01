# Visual review rubric: Spa City Pinball

The target is a **polished digital pinball table in a browser**: a top-down 2.5D view of an original table set on
Bathhouse Row in Hot Springs, Arkansas, with painted art, modelled toys, lamps that glow, a chrome ball, a DMD and a
backglass, playable on phones. Score against shipped digital pinball (for example the look of Zen Studios' Pinball FX
tables, Pro Pinball, well-made Visual Pinball X tables, and real machines photographed under their GI), not against
what a browser game "usually" looks like. No benchmark images ship with the loop; reviewers use what they know of
those games.

Each review scores 9 categories from 1 to 10 in 0.5 steps (maximum 90). Score only what is in the captures. Cite at
least 2 captures per category; `animation` must cite a motion strip and `toys` at least one close-up.

| Category | key | Gate |
|---|---|---|
| Playfield and backglass art | `art` | ≥ 7 |
| Toys and materials (3D models, rails, ramp, bumpers, flippers, ball) | `toys` | ≥ 7 |
| Lighting (lamps, bloom, GI, shadows, reflections) | `lighting` | ≥ 7 |
| Animation and game feel (strips first) | `animation` | ≥ 7 |
| UI, DMD and HUD | `ui` | ≥ 7 |
| Typography | `typography` | ≥ 7 |
| Readability (ball, shots, lamp language) | `readability` | ≥ 7 |
| Mobile (390 px portrait and 844 px landscape) | `mobile` | ≥ 7 |
| Authenticity (Hot Springs, Arkansas) | `authenticity` | ≥ 6 |

Measured gates, recorded by the developer in `loop-N/gates.json` and not scored by reviewers:
- **perf**: GPU desktop ≥ 55 fps at High with main-thread work under 14 ms a frame; 4× throttled phone ≥ 30 fps;
  SwiftShader (software GL) phone at Low ≥ 20 fps.
- **ip**: no commercial pinball machine's name, title, logo or art; no real business logo; no text in the paintings.

## Anchors
- **Art.** 3: flat colour fills, clip-art. 5: coherent palette, but art sits in rectangles unrelated to the
  layout; empty patches. 7: painted art composed around the layout, every zone themed, inserts and lettering
  integrated; backglass in the same hand. 9: art directs the eye to the shots; every square inch is designed.
- **Toys.** 3: primitive boxes. 5: recognisable models in flat materials; rails and walls read as grey blocks.
  7: every toy reads at a glance (the bathhouses, tower, Arlington, Vapors sign), plausible materials (lacquered
  wood, chrome, plastic, rubber), a convincing ramp and wireform, a chrome ball. 9: close-ups hold up like a real
  machine photographed: bevels, decals, wear, clear plastics.
- **Lighting.** 3: flat, no glow. 5: lamps light but look pasted on; washed-out or blown areas. 7: lamps glow with
  bloom only where lit, GI warms the field, soft shadows ground every toy, the ball reflects the table, no glare.
  9: mood shifts with modes and light shows; looks like a lit machine in a dark room.
- **Animation.** 3: static. 5: the ball moves, little else reacts. 7: flippers snap, bumpers flash and drop, steam
  rises, light shows run, the camera reacts to nudges; motion reads in the strips. 9: every event has anticipation
  and follow-through; the table feels alive.
- **UI.** 5: functional but plain. 7: a DMD with character and readable animations, a clear HUD, menus in the same
  deco style, nothing overlapping. 9: the DMD tells the story of each mode.
- **Typography.** 5: readable, mixed scales. 7: deliberate display and UI faces; playfield lettering crisp; DMD font
  clean. 9: type with character that still reads at 390 px.
- **Readability.** 5: the ball gets lost in the art. 7: the ball always stands out, every shot's entrance and lamp
  is obvious, lit vs unlit inserts are clear on both viewports. 9: instant reads even in multiball.
- **Mobile.** 5: works but cramped. 7: table framed on purpose in portrait and landscape; touch controls never cover
  the ball's area; DMD readable. 9: feels designed for the phone first.
- **Authenticity.** 5: generic "spa" theme. 7: the Row's eight bathhouses recognisable and in order, the tower, the
  Arlington, the Vapors, the springs' steam; facts hedged properly. 9: a local would name every landmark.

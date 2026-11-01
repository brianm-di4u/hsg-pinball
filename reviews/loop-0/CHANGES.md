Loop 0 is the baseline: the first complete build reviewed.

- Table: custom 2D physics in the table plane; three.js r186 view from a near-overhead camera (pitch about 18° off vertical).
- Playfield art composed in code on a canvas aligned with the physics: deco-neon base, three Codex paintings masked into zones (thermal-spring mountain at the top, hex bathhouse tile around the bank, a promenade in the middle), gold pinstripes along walls, code-drawn inserts and lettering.
- Toys modelled in Blender: eight bathhouse façades (in Row order, north to south), the Mountain Tower, the Arlington, the Vapors sign, pop bumpers with a code-drawn cap decal, flippers, spinner.
- Geometry generated from the physics walls: dark-lacquer guides with brass tops, wooden cabinet rail, rubber posts, clear plastic ramp, chrome wireform, slingshot plastics.
- Lighting: directional key light from the player's side, hemisphere fill, GI point lights, flasher lights on events, PMREM room environment, bloom with a threshold of 1.18 so only lamps glow; the ball reflects a cube-camera map of the table.
- Lamps: instanced emissive inserts with soft halos; shape-coded (arrows for shots, circles for progress, stars for awards, rectangles for targets, triangles for the multiplier).
- Steam particles rise from the bumpers and the top of the table.
- DMD: 128×32 dot display drawn from an original 5×7 font, with callouts and small animations (slot reels, derby race, tower).
- Quality tiers high, medium, low and a flat 2D fallback; review captures use High.

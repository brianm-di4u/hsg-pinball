# Critic A (critic-claude): loop 4

## Verdict
Spa City Pinball now reads as a coherent, warm, competently lit digital table. The lower playfield's deco terrazzo fan is composed around the flippers, the DMD tells you what each mode wants, the portrait phone layout is well framed, and the new teal bumper bodies glowing from inside (`strips/s02-bumpers`, `desktop/c02-springs`) are the best-looking toy on the table. Up close it still doesn't hold up against Pinball FX or a good VPX table. The bathhouses and the Arlington are box extrusions with flat facade textures (`desktop/c01-row`, `desktop/c06-arlington`). The slingshots are translucent coloured sails with no rubber, posts or kicker (`desktop/c03-flippers`). The Vapors is a white box with an unreadable 10 px vertical neon sign (`desktop/c04-vapors`). Steam renders as stacked dots. The headline lighting change, mood darkening, doesn't show in the frame captures: the multiball, mode and wizard frames are measurably *brighter* than normal play (mean table luma: r03 78.5, r06 82.1, r07 82.4, r08 85.4 on desktop; 71.1 / 74.4 / 77.2 / 80.2 on phone). Only the Grand Soak strip (`strips/s03-multiball`) shows a dark table carried by its inserts. The new layout check also missed visible clipping: "MOUNTAIN TOWE" runs off its plate on both viewports, and "SUPERIOR" is cut to "PERIC" behind the Vapors guide. This build is clearly better than the other A/B build, but most categories remain short of the 7 gate.

## Scores

### Playfield and backglass art (`art`): 6.5
- `desktop/r02-serve` and `desktop/r03-play`: the lower third is the strongest art on the table. A deco fan of terracotta and teal on terrazzo frames the multiplier inserts and the SHOOT AGAIN star, so it's composed around the flippers. The upper third is a generic lush garden and waterfall painting. It has a nice nod to a spring grotto, but it isn't composed around the shots: the S·P·A lanes stand over a waterfall, the bumpers float on foliage, and nothing in the art points to the orbit or ramp entrances.
- `desktop/r02-serve`: the middle plaza, between the SPA CITY logo and the mode arc, is a large patch of flat terrazzo with small arrow inserts and nothing designed into it.
- `desktop/r02-serve` (left panel): the backglass is a strong night painting of the Row: domed bathhouse, twin towers, the Mountain Tower on the ridge, steam and magnolias. Its rendering hand differs from the playfield's Kinkade-like garden, so the two don't read as one artist.
- `desktop/c04-vapors` and `desktop/c01-row`: labels are clipped. "PERIC HALE" (SUPERIOR is hidden under the Vapors guide and neon post), and CENTRAL AVENUE is cut by the left lane rail.
- `mobile/r03-play`: the playfield art holds up at phone size, but the bathhouse name plates turn to noise.

### Toys and materials (`toys`): 6.0
- `desktop/c01-row` and `desktop/c06-arlington`: all eight bathhouses and the Arlington read at a glance. The Quapaw's mosaic dome, the Ozark's white twin towers and the Arlington's twin towers are right. They are still low-poly boxes with flat window textures: no cornices, bevels or trim, and almost no contact shadow. The Arlington sits on a lock that is just a black hole with a chrome ring.
- `desktop/c04-vapors` and `desktop/c06-arlington`: the inner guides are lower now, walnut with brass caps, which is better. The brass is still a uniformly saturated, plastic-looking gold with no brushed anisotropy, and the caps read as full cylinders rather than half-rounds.
- `desktop/c03-flippers`: the flippers (white with a red rubber, chrome pivot) are fine. The slingshots are translucent coloured triangles on white and walnut blocks, with no rubber band, posts or kicker plate. They don't read as slingshots.
- `desktop/c05-tower`: the Mountain Tower lattice with its octagonal cab is a good toy. The wire return has cross-ties and supports. The clear ramp shows a hard seam and kink in the floor where it bends. The side-wall tops read as beaded, ladder-like ticks, and the white emissive bars at the wireform's lower right glare. Past the cabinet is a pure black void.
- `desktop/c02-springs`: the teal translucent bumper bodies under 143°F caps look like plausible coloured plastic. The S·P·A lane guides are tall brass pipes.
- `desktop/c03-flippers` and `desktop/r03-play`: the ball is chrome but shows an X-shaped environment-map pattern rather than a reflection of the table.

### Lighting (`lighting`): 6.5
- `strips/s02-bumpers`: the bumpers lit from inside are the lighting highlight. The teal bodies bloom, the caps glow orange through the steam symbol, and the soft pool on the playfield reads as light, not a decal.
- `strips/s03-multiball` (frames 1–6): this is the only capture where the mood change works. The table drops dark and the purple mode arc, blue orbit arrow and bathhouse lamps carry the image, close to a real machine in a dark room.
- `desktop/r06-multiball`, `desktop/r07-mode`, `desktop/r08-wizard`, `mobile/r08-wizard`: there is no visible darkening. Measured mean luma of the table region rises from r03 78.5 to r08 85.4 on desktop, and from 71.1 to 80.2 on phone. The wizard "light show" frame is the brightest gameplay frame, the opposite of the stated 35% GI.
- `desktop/r03-play` and `desktop/c03-flippers`: inserts bloom only where lit (2X and 3X lit, 4X and 5X dark), and the GI is warm. Shadows are weak: the ball and buildings barely ground.
- `desktop/c04-vapors` (the white harlequin block at upper left) and `desktop/c05-tower` (the white bars on the wireform) show hard glare.

### Animation and game feel (`animation`): 6.0
- `strips/s01-flip`: the left flipper snaps between frames 2 and 3 and the ball arcs up to the coaster lane. That's readable, but nothing else reacts: no sling kick, no lamp response to the shot, no camera reaction.
- `strips/s02-bumpers`: the ball ricochets between the springs, the bodies pulse brighter on hits, and a lane lamp lights in frame 7. No bumper skirt or cap drop is visible. The steam is a column of discrete round dots, not a rising, fading plume.
- `strips/s03-multiball`: there is a real light show. A purple chase runs around the mode arc (frames 4–6), the orbit arrows flash, and the table dims. It's the best motion evidence in the set.
- `desktop/r06-multiball`: three balls are in play, but the stills show no motion feedback such as trails or flasher pops.

### UI, DMD and HUD (`ui`): 7.0
- `desktop/r07-mode`, `desktop/r06-multiball`, `desktop/r08-wizard`: the DMD has character. A horse silhouette with "DERBY DAY / RAMPS, ORBITS", the Arlington silhouette with "RAMP JACKPOTS", steam over mountains with "ALL SHOTS LIT". Each is complete and readable.
- `desktop/r03-play` and `desktop/r04-bumpers`: the score appears once. The DMD shows it in normal play, and the side panel shows it only while the DMD runs a callout. That's clean.
- `desktop/r01-title`, `desktop/r10-scores`, `desktop/r09-help`: the menus use a consistent gold-and-navy deco frame. They're undermined by the browser-default bright blue focus ring on the gold buttons.
- `desktop/r02-serve`: at 1280 px the table uses only about 36% of the width, and the lower half of the right panel is empty.
- `desktop/r09-help`: the body now scrolls above Back, but it cuts mid-line ("meter for an extra ball") with no fade or scroll affordance.

### Typography (`typography`): 6.5
- `desktop/r01-title`: the neon slab "PINBALL" with the spaced "SPA CITY" is a deliberate display face with character.
- `desktop/r07-mode` and `mobile/r07-mode`: the dot-matrix DMD font is clean and reads well at 390 px.
- `desktop/r02-serve`, `mobile/r03-play`, `desktop/c04-vapors`: playfield lettering is the weak spot. "MOUNTAIN TOWE" overflows and is clipped by its plate on both viewports. SUPERIOR is clipped to "PERIC". The bathhouse names, "EXTRA BALL" and "LIGHT SPA" are 3–4 px at desktop scale and illegible. The Vapors' vertical neon text can't be read even in the close-up `desktop/c01-row`.
- `desktop/r09-help`: a slab display face over a system sans body is competent but plain.

### Readability (`readability`): 6.5
- `desktop/r03-play` and `mobile/r03-play`: the chrome ball, about 14 px at 1280, stands out on the warm lower field.
- `desktop/r04-bumpers`: in the dark upper garden the pale ball sits among bright steam dots and foliage highlights and is harder to find.
- `desktop/r07-mode` and `mobile/r07-mode`: the lit mode shots are obvious: blue orbit arrow, teal right arrow, yellow ramp arrow. Lit and unlit multipliers are clearly separated (`desktop/c03-flippers`).
- `desktop/r02-serve` and `mobile/r02-serve`: the skill-shot cue is weak. The A lamp is only somewhat brighter than S and P, there is no visible large halo, and S and P are not near 12%.
- `desktop/r06-multiball` and `mobile/r06-multiball`: all three balls (top arch, between the flippers, plunger lane) can be found, but the arch ball merges with the gold rail.

### Mobile (`mobile`): 6.5
- `mobile/r03-play` and `mobile/r07-mode`: portrait is framed on purpose. The full table fills the width, the DMD across the top is big and readable, and the score and progress chip tucks under it. The ☰ and Launch buttons sit on the apron, clear of the ball's area, and the apron cards no longer collide with them (`mobile/r02-serve`).
- `mobile/r11-landscape`: the whole table is back, but it fills only about 38% of the 1688 px width. There's a black void on both sides and above the arch, the upper playfield (bumpers, Row) is heavily foreshortened and tiny, the apron is an empty navy rectangle, and the lower 55% of the side panel is blank.
- `mobile/r09-help` and `mobile/r10-scores`: readable at 390 px, and help scrolls above Back.

### Authenticity (`authenticity`): 7.0
- `desktop/c01-row`: all eight bathhouses are named and in correct order: Superior, Hale, Maurice and Fordyce, then Quapaw, Ozark, Buckstaff and Lamar. The Quapaw dome and the Ozark's twin towers are distinguishable.
- `desktop/c06-arlington` and `desktop/c05-tower`: the twin-towered Arlington and the lattice Mountain Tower are recognisable.
- `desktop/c02-springs`: the 143°F spring caps and the grotto in the art are correct local touches. The steam reads as particles rather than vapour.
- `desktop/r09-help`: the facts are properly hedged ("about", "reportedly", fictional horses), and RAID! 1967 is a good deep cut.
- `desktop/c04-vapors`: the weak point is the Vapors. A local wouldn't name a white box with an illegible vertical neon strip.

## IP check
Clean. I found no commercial pinball title, logo or art anywhere. The backglass painting (`desktop/r02-serve`, left panel) has no lettering; the neon marquee at its right is blank, and the title is HTML set above the painting. The playfield paintings have no embedded text; all playfield words are game-rendered labels. No real business logos are visible: the bathhouses carry only game-rendered name plates. The garden art is Kinkade-like in style but shows no identifiable copied work.

## Ranked gaps
1. **G-mood-darkening-missing** (lighting, sev 4, M, WS1, +0.5). `desktop/r06-multiball`, `desktop/r07-mode`, `desktop/r08-wizard` and `mobile/r08-wizard` are brighter than `desktop/r03-play`. Apply the mood GI scale whenever the mode, multiball or wizard state is active, including the state the capture script sets up, not only on transition. Test: mean table luma in r08 ≤ 0.6× r03 and in r06 ≤ 0.75× r03, while lit inserts keep their peak brightness.
2. **G-label-clip** (typography, sev 3, S, WS4, +0.5). "MOUNTAIN TOWE" (`desktop/r02-serve`, `mobile/r03-play`), "PERIC" for SUPERIOR (`desktop/c01-row`, `desktop/c04-vapors`), and CENTRAL AVENUE cut by the rail (`desktop/c04-vapors`). Extend check-layout to fail when text overflows its plate and when a label is occluded by any 3D mesh from the review camera poses.
3. **G-sling-model** (toys, sev 3, M, WS2, +0.5). `desktop/c03-flippers`: model real slingshots, with three posts and rubber rings, a white rubber band, a painted plastic cover and a visible kicker. Test: the close-up shows a rubber band, and a strip frame shows the band deflect on a hit.
4. **G-building-detail** (toys, sev 3, L, WS2, +0.5). `desktop/c01-row`, `desktop/c06-arlington`: add cornices, window reveals, roof trim and awnings to the bathhouses and the Arlington, give them a baked AO contact shadow, and soften the gold of the brass with brushed roughness.
5. **G-vapors-toy** (authenticity, sev 3, M, WS2, +0.5). `desktop/c04-vapors`, `desktop/c01-row`: build a recognisable Vapors facade with a horizontal, legible neon "VAPORS" marquee of at least 20 px tall in the close-up and readable at 1280 in play.
6. **G-skill-shot-cue** (readability, sev 3, S, WS1, +0.5). `desktop/r02-serve`, `mobile/r02-serve`: the skill lane shows no visible halo, and S and P aren't dimmed. Test: lit-lane luminance ≥ 3× unlit at serve, with a halo at least 2 lane-widths across.
7. **G-landscape-fill** (mobile, sev 3, M, WS6, +0.5). `mobile/r11-landscape`: the table fills about 38% of the width over black void. Tighten the FOV or offset so the playfield fills at least 60% of the canvas width, and fill the empty side-panel area with the ball, mode and lamp status or larger touch targets.
8. **G-upper-art-composition** (art, sev 3, L, WS4, +0.5). `desktop/r02-serve`: repaint the upper third so the orbit, ramp mouth, S·P·A lanes and bumpers have designed art paths, and fill the empty mid-plaza with themed art that leads to the shots.
9. **G-steam-dots** (animation, sev 2, M, WS3, +0.3). `desktop/c02-springs`, `strips/s02-bumpers`: replace the dot particles with soft noise-textured billboards that rise, widen and fade, and add a skirt or cap drop on bumper hits.
10. **G-ramp-seam-glare** (toys, sev 2, S, WS2, +0.3). `desktop/c05-tower`: remove the floor seam and kink at the ramp bend and the beaded wall-top ticks, and drop the emissive white bars on the wireform.
11. **G-ball-reflect-shadow** (lighting, sev 2, M, WS1, +0.3). `desktop/c03-flippers`, `desktop/r03-play`: the ball shows an X-pattern env map and no contact shadow. Use a playfield-capture env map and add a soft contact shadow.
12. **G-focus-ring-help-fade** (ui, sev 1, S, WS5, +0.2). `desktop/r01-title`, `desktop/r10-scores`, `desktop/r09-help`: replace the default blue focus ring with a gold or neon deco focus style, and add a bottom fade to the help scroll area.

## A/B
- art: tie (0.5). Pairs `desktop-c01-row`, `desktop-c04-vapors`, `desktop-r02-serve`. The label moves are a wash: A's Vapors sign is smaller and less legible, while B's labels collide elsewhere.
- toys: A (0.75). Pairs `desktop-c01-row`, `desktop-c02-springs`, `desktop-c04-vapors`, `desktop-c06-arlington`, `desktop-c05-tower`. A's lower walnut guides and teal bumper bodies beat B's tall navy-block guides, which read as holes, and its peach bodies, which clash.
- lighting: A (0.6). Pairs `strips-s02-bumpers`, `desktop-c02-springs`, `desktop-r08-wizard`. A's interior glow and soft pool beat B's hard orange rings. The mood darkening differs by only about 1–2% luma in the r06–r08 pairs.
- animation: A (0.55). Pairs `strips-s02-bumpers`, `strips-s01-flip`, `strips-s03-multiball`. B's rings are a louder hit cue but crude, A's pulse is more polished, and s01 and s03 are near identical.
- ui: A (0.85). Pairs `desktop-r06-multiball`, `desktop-r07-mode`, `desktop-r08-wizard`, `desktop-r03-play`, `desktop-r09-help`. B truncates DMD lines ("RAMP FOR JACKP", "RAMPS AND ORBI", "L SHOTS LIT ·"), duplicates the score, and runs help text under Back.
- typography: A (0.7). Pairs `desktop-r07-mode`, `mobile-r08-wizard`, `mobile-r09-help`: complete DMD lines and no text under Back.
- readability: tie (0.5). Pairs `mobile-r02-serve`, `desktop-r06-multiball`, `strips-s02-bumpers`. B's rings make hits more obvious and its MOUNTAIN TOWER label is whole; A's lit and unlit lamps and its balls read the same.
- mobile: A (0.85). Pairs `mobile-r11-landscape`, `mobile-r02-serve`, `mobile-r03-play`, `mobile-r09-help`. A shows the whole table in landscape where B crops off the upper half, and A keeps the apron cards from colliding with the buttons.
- authenticity: tie (0.5). Pairs `desktop-c01-row`, `desktop-c04-vapors`, `desktop-c06-arlington`. The models and order are the same, and A's smaller Vapors sign is no more recognisable.

```json
{
  "loop": 4,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r02-serve", "note": "deco fan composed around flippers; upper garden painting generic, not composed around shots; empty mid plaza" },
      { "shot": "desktop/r03-play", "note": "lower third strongest art; backglass in a different painterly hand" },
      { "shot": "desktop/c04-vapors", "note": "SUPERIOR label clipped to 'PERIC', CENTRAL AVENUE cut by rail" },
      { "shot": "mobile/r03-play", "note": "art holds at phone size; name plates become noise" } ] },
    "toys": { "score": 6.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "bathhouses recognisable but box extrusions with flat facade textures, no trim or contact shadow" },
      { "shot": "desktop/c03-flippers", "note": "slingshots are translucent sails with no rubber, posts or kicker; ball has X-pattern env map" },
      { "shot": "desktop/c05-tower", "note": "good lattice tower and wireform ties; ramp floor seam and kink, beaded wall tops, emissive glare bars" },
      { "shot": "desktop/c06-arlington", "note": "Arlington reads; brass is uniform plastic gold; lock is a bare hole" },
      { "shot": "desktop/c02-springs", "note": "teal translucent bumper bodies convincing" } ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "strips/s02-bumpers", "note": "bumpers lit from inside bloom nicely, soft playfield pool" },
      { "shot": "strips/s03-multiball", "note": "dark table carried by inserts and light show, the one capture where mood works" },
      { "shot": "desktop/r08-wizard", "note": "no darkening: table luma 85.4 vs 78.5 in r03" },
      { "shot": "mobile/r08-wizard", "note": "luma 80.2 vs 71.1 in r03; wizard is the brightest gameplay frame" },
      { "shot": "desktop/c04-vapors", "note": "hard glare on harlequin block; weak contact shadows" } ] },
    "animation": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps, ball arcs; nothing else reacts" },
      { "shot": "strips/s02-bumpers", "note": "bodies pulse on hits; no skirt or cap drop; steam is stacked dots" },
      { "shot": "strips/s03-multiball", "note": "purple chase around the mode arc and arrow flashes, a real light show" } ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r07-mode", "note": "DMD silhouette plus complete objective, readable" },
      { "shot": "desktop/r04-bumpers", "note": "score shown once; side panel shows it during callout" },
      { "shot": "desktop/r01-title", "note": "consistent deco menus; browser-default blue focus ring" },
      { "shot": "desktop/r09-help", "note": "scrolls above Back but cuts mid-line, no fade" },
      { "shot": "desktop/r02-serve", "note": "table about 36% of width; empty lower right panel" } ] },
    "typography": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r01-title", "note": "neon slab display face with character" },
      { "shot": "mobile/r07-mode", "note": "DMD dot font clean at 390 px" },
      { "shot": "mobile/r03-play", "note": "'MOUNTAIN TOWE' overflows plate; bathhouse names illegible" },
      { "shot": "desktop/c01-row", "note": "Vapors vertical neon unreadable; 'PERIC HALE' collision" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r03-play", "note": "ball stands out on warm lower field; lit and unlit inserts clear" },
      { "shot": "desktop/r04-bumpers", "note": "ball harder to find in dark upper garden among steam dots" },
      { "shot": "desktop/r02-serve", "note": "skill-shot lane barely brighter, no visible halo, S and P not dimmed" },
      { "shot": "mobile/r07-mode", "note": "lit mode arrows obvious" },
      { "shot": "desktop/r06-multiball", "note": "three balls findable; arch ball merges with gold rail" } ] },
    "mobile": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait framed on purpose, big DMD, buttons on apron clear of ball" },
      { "shot": "mobile/r02-serve", "note": "apron cards no longer collide with buttons" },
      { "shot": "mobile/r11-landscape", "note": "whole table but about 38% of width over black void; upper field tiny; side panel half empty" },
      { "shot": "mobile/r09-help", "note": "readable, scrolls above Back" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "all eight bathhouses named in correct order; Quapaw dome, Ozark towers" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington recognisable" },
      { "shot": "desktop/c05-tower", "note": "lattice Mountain Tower recognisable" },
      { "shot": "desktop/r09-help", "note": "hedged facts, RAID! 1967" },
      { "shot": "desktop/c04-vapors", "note": "Vapors unrecognisable: white box, illegible sign" } ] }
  },
  "ab": {
    "art": { "winner": "tie", "confidence": 0.5, "pairs": ["desktop-c01-row", "desktop-c04-vapors", "desktop-r02-serve"], "note": "label moves a wash; A Vapors sign smaller and less legible" },
    "toys": { "winner": "A", "confidence": 0.75, "pairs": ["desktop-c01-row", "desktop-c02-springs", "desktop-c04-vapors", "desktop-c05-tower", "desktop-c06-arlington"], "note": "A lower walnut guides and teal bodies beat B tall navy blocks and clashing peach bodies" },
    "lighting": { "winner": "A", "confidence": 0.6, "pairs": ["strips-s02-bumpers", "desktop-c02-springs", "desktop-r08-wizard"], "note": "A interior glow and soft pool beat B hard orange rings; mood luma difference only 1-2%" },
    "animation": { "winner": "A", "confidence": 0.55, "pairs": ["strips-s02-bumpers", "strips-s01-flip", "strips-s03-multiball"], "note": "B rings louder but crude; s01 and s03 near identical" },
    "ui": { "winner": "A", "confidence": 0.85, "pairs": ["desktop-r06-multiball", "desktop-r07-mode", "desktop-r08-wizard", "desktop-r03-play", "desktop-r09-help"], "note": "B truncates DMD lines, duplicates score, help text under Back" },
    "typography": { "winner": "A", "confidence": 0.7, "pairs": ["desktop-r07-mode", "mobile-r08-wizard", "mobile-r09-help"], "note": "complete DMD lines, no text under Back" },
    "readability": { "winner": "tie", "confidence": 0.5, "pairs": ["mobile-r02-serve", "desktop-r06-multiball", "strips-s02-bumpers"], "note": "B hit rings clearer and MOUNTAIN TOWER whole; A otherwise equal" },
    "mobile": { "winner": "A", "confidence": 0.85, "pairs": ["mobile-r11-landscape", "mobile-r02-serve", "mobile-r03-play", "mobile-r09-help"], "note": "A landscape shows whole table, B crops upper half; A apron clear of buttons" },
    "authenticity": { "winner": "tie", "confidence": 0.5, "pairs": ["desktop-c01-row", "desktop-c04-vapors", "desktop-c06-arlington"], "note": "same models and order" }
  },
  "ip": { "clean": true, "notes": "No commercial pinball name, logo or art. Backglass and playfield paintings contain no text (backglass neon marquee blank; title is HTML). No real business logos; bathhouse names are game-rendered plates." },
  "gaps": [
    { "id": "G-mood-darkening-missing", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard", "mobile/r08-wizard"], "fix": "Apply the mood GI scale whenever the mode, multiball or wizard state is active, including the state the capture sets up. Test: table mean luma r08 <= 0.6x r03 and r06 <= 0.75x r03 with lit insert peaks unchanged." },
    { "id": "G-label-clip", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/r02-serve", "mobile/r03-play", "desktop/c01-row", "desktop/c04-vapors"], "fix": "Extend check-layout to fail on text overflowing its plate and on labels occluded by 3D meshes from the review camera poses; fix MOUNTAIN TOWER, SUPERIOR and CENTRAL AVENUE." },
    { "id": "G-sling-model", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "Model slingshots with three posts, rubber rings, a white band, a painted plastic cover and a kicker; band deflects visibly in a strip frame." },
    { "id": "G-building-detail", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c06-arlington"], "fix": "Add cornices, window reveals, roof trim and awnings plus baked AO contact shadows to the bathhouses and the Arlington; give the brass a brushed roughness and desaturate it." },
    { "id": "G-vapors-toy", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Build a recognisable Vapors facade with a horizontal neon VAPORS marquee >= 20 px tall in the close-up and legible at 1280 in play." },
    { "id": "G-skill-shot-cue", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Make the skill-lane halo show in the serve state: lit lane luminance >= 3x unlit, halo >= 2 lane-widths, S and P dimmed." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Tighten FOV or offset so the playfield fills >= 60% of the canvas width; use the empty side-panel space for status or larger touch targets." },
    { "id": "G-upper-art-composition", "category": "art", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["desktop/r02-serve", "desktop/r03-play"], "fix": "Repaint the upper third with designed paths to the orbit, ramp mouth, S·P·A lanes and bumpers; fill the empty mid-plaza with themed art leading to the shots." },
    { "id": "G-steam-dots", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["desktop/c02-springs", "strips/s02-bumpers"], "fix": "Replace dot particles with soft noise billboards that rise, widen and fade; add a bumper skirt or cap drop on hits." },
    { "id": "G-ramp-seam-glare", "category": "toys", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "Remove the ramp floor seam and kink at the bend and the beaded wall-top ticks; drop the emissive white bars on the wireform." },
    { "id": "G-ball-reflect-shadow", "category": "lighting", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c03-flippers", "desktop/r03-play"], "fix": "Use a playfield-capture env map for the ball instead of the X-pattern map and add a soft contact shadow." },
    { "id": "G-focus-ring-help-fade", "category": "ui", "expectedGain": 0.2, "severity": 1, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title", "desktop/r10-scores", "desktop/r09-help"], "fix": "Replace the default blue focus ring with a gold or neon deco focus style; add a bottom fade to the help scroll area." }
  ]
}
```

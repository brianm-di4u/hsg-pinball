# Advocate: loop 6

## Summary

The two critics broadly agree and are mostly right. The build sits in the 6.5 to 7.5 band, the remaining defects are real (c04 flare, grey scoop walls, brown ramp-entrance boxes, no visible cast shadows, plain flippers, small landscape table), and I concede them. But Critic A (critic-claude) makes several measurable factual errors that drag down readability, UI and mobile and inflate gap gains:

- **The ball is about 18 to 20 px at the desktop play camera, not "about 10 px."** I cropped and enlarged `desktop/r03-play` (ball beside the MOUNTAIN TOWER plate) and `desktop/r04-bumpers` (ball at the arch). In both the sphere, bright rim included, spans about 18 to 20 screen pixels. The test in G-desktop-table-scale ("ball at least 14 px in r03") is already met.
- **"The score is shown twice" is false in both captures cited.** In `desktop/r03-play` the DMD shows 1,234,560 and the side panel shows no score. In `desktop/r04-bumpers` the DMD shows SPA CITY / BALL 1 and only the side panel shows 1,240,050. The same handoff appears in `desktop/r06-multiball`, `desktop/r07-mode` and `desktop/r08-wizard`: the score moves to the side panel whenever the DMD is busy with mode art. That's deliberate, not duplication.
- **"The captures show no ... timer graphics" is wrong.** `desktop/r07-mode` shows "Derby · 18/100 · 45s" (progress and timer) under the DMD.
- **The landscape test is already half met.** `mobile/r11-landscape` (1688×780 at 2×) has the table running from y≈115 to the bottom edge, about 85% of the height. Critic A's own test ("bbox covers at least 85% of 390 px") passes. The "about 40% of width" figure counts the HUD column. Of the free area left of the HUD (about 1282 px), the table covers about 51%.
- **"MOUNTAIN TOW" blames the wrong cause.** In an enlargement of `mobile/r03-play`, the ramp plate continues past "TOW" and the COASTER legend plate sits on top of the end of it. It's an overlap, not a plate too short for its text. `desktop/c03-flippers` isn't evidence either: there the word is cut by the edge of the close-up frame.

Critic B (critic-codex) is better calibrated, but its expected gains of +1.0 on four gaps are inflated for what the fixes describe, and its "shallow facades" claim ignores the relief visible in `desktop/c06-arlington`.

Proposed total: **61.0 / 90**.

## Category by category

### Art: critics 6.5 / 7.0 (mean 6.75). Proposed 7.0
- **Concede:** the upper garden painting competes with the bumpers and lanes rather than pointing at shots (`desktop/c02-springs`). Shot arrows are flat printed shapes, not lensed inserts (`desktop/c04-vapors`, foreground arrows).
- **Concede:** the backglass is strong and shares the playfield's palette (`desktop/r02-serve`). The lower fan is composed around the flippers, and the 2X–5X inserts sit on its spokes (`desktop/c03-flippers`).
- **Rebut (A):** "the middle of the field, between the SPA CITY logo and the slingshots, is a large plain brown terrazzo patch". That overstates it. In `desktop/r03-play` and `mobile/r03-play`, the band directly below SPA CITY carries the blue and red shot arrows, the star and dot inserts, the EXTRA BALL and VALLEY OF THE VAPORS legends, the six-insert purple mode arc (SOAK, DERBY, RAID, TOWER, TUBS, COASTER) and the yellow right-orbit arrow, and then the fan begins. Only a narrow strip either side of the mode arc is plain terrazzo.
- **Concede (A/B):** the printed sling plastics beat the plain fills (`ab/desktop-c03-flippers`). Both critics agree.
- 7.0 matches the anchor ("painted art composed around the layout, every zone themed, inserts and lettering integrated; backglass in the same hand"), with the upper-field composition as the remaining shortfall.

### Toys: critics 6.5 / 6.5. Proposed 6.5
- **Concede:**
  - The Vapors scoop side walls are flat grey slabs (`desktop/c04-vapors`).
  - Two plain dark-brown boxes flank the ramp entrance, and the ramp floor has a visible seam halfway up (`desktop/c05-tower`; the boxes are in both builds in `ab/desktop-c05-tower`).
  - The flippers are plain white extrusions with a red rubber band (`desktop/c03-flippers`).
  - The bathhouses sit on plain beige plinths (`desktop/c01-row`).
- **Rebut (A):** "bumper bodies are plain teal cylinders with a chrome base and no ring or skirt detail". `desktop/c02-springs` shows a dark cap with a gold ring and a printed steam-and-143°F decal, a translucent lit teal body, and a chrome and black base ring. The critic missed real detail, though there's no metal ring on top.
- **Partly rebut (A):** "the Arlington lock frame is a flat grey U". In `desktop/c06-arlington` the frame's sides are chrome tubes ending in posts with white rubbers; only the back wall is a grey slab with a bright top edge.
- **Rebut (B):** "thin-looking architectural facades". `desktop/c06-arlington` shows recessed lit window grids, separate tower roofs and dormers on the Arlington, a mosaic dome on the Quapaw and a pyramidal skylight on the Fordyce. `desktop/c01-row` shows an arcaded ground floor on one bathhouse and an awning on another. The plinths are plain, the facades aren't.
- **Missed by both:** the ball in `desktop/c03-flippers` is a convincing chrome sphere reflecting the terrazzo and the table. The new sling posts carry black rubber rings, and the clear ramp ribbons with rounded lips read as moulded plastic (`desktop/c05-tower`).
- Net: the critics' 6.5 is fair. The remaining slabs and boxes keep it below the anchor of 7.

### Lighting: critics 6.0 / 6.5 (mean 6.25). Proposed 6.5
- **Concede:**
  - The large blown flare at the top left of `desktop/c04-vapors` (worse than B's in `ab/desktop-c04-vapors`).
  - The Valley star blooms into a white blob over its legend in `desktop/r08-wizard`.
  - Hard white point highlights on the bumper bases (`desktop/c02-springs`).
  - No visible cast shadow on the field under the plinths (`desktop/c01-row`: the plinth faces shade, but nothing falls on the art).
- **Overstated (A):** "hotspots on two bumper caps erase the 143°F lettering" (`desktop/s02-bumpers-5`). The full-size frame shows each hotspot covering one digit ("14·°F"). The left bumper's "143°F" is intact. It's a defect, not erasure.
- **Rebut (A):** "outside the cabinet the room is a pure black void". The 9 anchor is literally "looks like a lit machine in a dark room", so a black room around the cabinet isn't a lighting fault.
- **Rebut (A, animation and lighting):** "no GI sweep or flasher burst is visible" in `strips/s03-multiball`. Frames 0, 1, 2 and 7 show a warm amber flash bleeding over the top-right of the cabinet that's absent in frames 3 to 6. The left-lane lamps also pulse blue between frames 0 to 1 and 2 to 3, and the bathhouse row lamps come up together in frames 2 and 3.
- **Missed:** in `desktop/c01-row` the lit bathhouse inserts (Superior, Hale, Fordyce, Ozark) glow without clipping, their plates stay legible, and lit and unlit are unambiguous. Both critics credit the darker wizard room (`desktop/r08-wizard`, `mobile/r08-wizard`).
- 6.5 is within the mean ±1 and reflects real bloom discipline against real glare and grounding faults.

### Animation: critics 6.5 / 6.5. Proposed 6.5
- **Concede:** no anticipation frames. The steam is soft columns. No camera reaction appears, though stills can't show a nudge that wasn't captured.
- **Partly rebut (A):** "no ... follow-through". In `strips/s01-flip` the flipper snaps in frame 3 and holds raised through frames 4 to 7 while the ball climbs past the inserts. That's the correct held-flipper behaviour.
- **Partly rebut (A):** "the 6 mm sink isn't readable at strip scale". In `strips/s02-bumpers` the right bumper's skirt lights up and its body reads shorter in frame 5 than in frame 4, then goes dark in frame 6. The left-front bumper does the same in frames 5 to 7. It's subtle, as Critic B says, but visible.
- The flasher and lamp chase in `strips/s03-multiball` (see Lighting) is a running light show, which the 7 anchor asks for. I keep 6.5 because the sink is subtle and the steam soft, but the gaps' severities should drop (see below).

### UI: critics 7.0 / 7.5 (mean 7.25). Proposed 7.5
- **Concede:** the DMD has character, with pixel icons per mode: the Arlington towers in `desktop/r06-multiball`, the horse in `desktop/r07-mode` and the steaming mountain in `desktop/r08-wizard`. The menus share one deco frame (`desktop/r01-title`). The phone chip sits on its own row (`mobile/r03-play`). There's dead space below the Menu button on desktop (`desktop/r03-play`).
- **Plainly wrong (A):** the duplicate score and the missing timer graphics (see Summary): `desktop/r03-play`, `desktop/r04-bumpers` and `desktop/r07-mode`. The HUD shows mode, progress and timer ("Derby · 18/100 · 45s"), and the score hands off between the DMD and the panel.
- **Codex's help-fade point:** in `mobile/r09-help` the last bullet fades into the Back footer. That's a standard scroll affordance, not a clipping fault. Codex itself says the capture can't show the final scroll position.
- 7.5 is supported.

### Typography: critics 6.5 / 6.5. Proposed 6.5
- **Concede:**
  - The display slab and UI sans are well paired (`desktop/r01-title`, `mobile/r09-help`).
  - The plates are crisp in close-up (`desktop/c01-row`), illegible at the desktop play camera (`desktop/r02-serve`) and tiny at 390 px (`mobile/r03-play`).
  - The Vapors marquee is small at play scale.
- **Cause challenge (A):** the clipped "MOUNTAIN TOW" comes from the COASTER legend plate overlapping the ramp plate (`mobile/r03-play`, enlarged). Widening the ramp plate alone won't fix it; moving the COASTER legend or the plate will. `desktop/c03-flippers` is a frame-edge crop and should be dropped as evidence.
- Score unchanged.

### Readability: critics 6.0 / 6.5 (mean 6.25). Proposed 6.5
- **Plainly wrong (A):** the ball is about 18 to 20 px in `desktop/r03-play`, not about 10 px.
- **Rebut (A):** "easy to lose against the bright garden art and steam near the top (`desktop/r04-bumpers`, ball at the arch)". The enlarged crop shows the ball against dark foliage and the navy arch with a bright specular rim. It reads.
- **Concede:**
  - Three small balls in `desktop/r06-multiball`. They're findable, not instant.
  - Upper-field white highlights compete (Critic B, `mobile/r06-multiball`).
  - The plates don't read at the play camera.
- **Missed:** lit shot arrows are unmistakable in `desktop/r07-mode` and `desktop/r08-wizard` (blue left orbit, yellow right orbit, green right lane). Lit and unlit mode inserts are clear on both viewports (`mobile/r03-play`, which both critics accept). On the phone the ball and all three multiball balls stand out (`mobile/r06-multiball`: arch, between the flippers, plunger lane).
- Correcting A's measurement moves A's own basis to about 6.5, so I propose 6.5.

### Mobile: critics 6.0 / 6.0. Proposed 6.5
- **Concede:** landscape leaves a wide empty area left of the table and the table is small (`mobile/r11-landscape`).
- **Rebut (A's numbers):** the table covers about 85% of the landscape height and about 51% of the free width, not 40% (see Summary). The "115 px of black above" is 115 px at 2×, about 57 CSS px.
- **On A/B:** `ab/mobile-r11-landscape` is split. B's table is wider and more tilted, while A's top edge sits slightly higher. "Visibly larger" for B is a width-only reading, and Critic B called the same pair the other way.
- **Missed:** portrait meets most of the 7 anchor. In `mobile/r02-serve`, `mobile/r03-play` and `mobile/r06-multiball` the DMD is large, the chip has its own row, the table fills the width, and the Menu and Launch buttons sit on the apron, clear of the flippers and every lane.
- A strong portrait and a mediocre landscape average to 6.5, not 6.0.

### Authenticity: critics 7.5 / 7.5. Proposed 7.5
- **Concede:** all eight bathhouses, labelled in order (`desktop/c01-row`). The twin-towered Arlington (`desktop/c06-arlington`), the lattice Mountain Tower (`desktop/c05-tower`), the 143°F springs (`desktop/c02-springs`) and hedged help copy (`desktop/r09-help`).
- **Correction (A, A/B note):** the "lost BATHHOUSE ROW subline" only left the playfield logo. "BATHHOUSE ROW · HOT SPRINGS, ARKANSAS" is still on the title card (`desktop/r01-title`).

### IP
Both critics found no commercial pinball identity and no text in the paintings. Critic B's `clean: false` rests only on an unverified resemblance question about the Vapors neon script (`desktop/c04-vapors`). Critic A raised the same question and still called it clean. The measured gate passed. A source check is reasonable, but nothing in the captures shows copying.

## Gaps (critics' gaps, re-rated; none added)

| Gap | Critic | Severity | Gain | Reason |
|---|---|---|---|---|
| G-landscape-framing | A | 4 → 3 | 0.5 → 0.4 | Height test already met (about 85%); only width and HUD balance remain |
| G-desktop-table-scale | A | 4 → 2 | 0.5 → 0.2 | Ball is already about 18 to 20 px, so the "at least 14 px" test passes; only side-panel use remains |
| G-grey-slab-walls | A | 3 | 0.5 → 0.4 | Valid for the scoop walls and ramp boxes; the lock frame is chrome tubes plus a back slab |
| G-glare-bloom-clip | A | 3 | 0.5 → 0.4 | Valid for the c04 flare and the r08 star; the s02 hotspots hide one digit, not the lettering |
| G-contact-shadows | A | 3 | 0.5 | Conceded in full |
| G-playfield-text-scale | A | 3 → 2 | 0.5 → 0.3 | MOUNTAIN TOWER is clipped by the overlapping COASTER plate; c03 is a frame crop |
| G-ball-contrast | A | 3 → 2 | 0.4 → 0.2 | Ball has a bright rim and reads on dark foliage (r04) and on the phone (mobile r06) |
| G-animation-legibility | A | 3 → 2 | 0.5 → 0.3 | Sink faintly visible (s02 frames 4 to 6); flasher present in s03; camera reaction can't be tested in stills |
| G-mid-field-and-inserts | A | 2 | 0.4 → 0.2 | Mid-field carries the mode arc and arrows; only the lensed-insert half stands |
| G-flipper-bumper-detail | A | 2 | 0.3 → 0.2 | Bumper caps already have a gold ring and a printed decal; the flippers are the real gap |
| G-desktop-side-panel | A | 2 → 1 | 0.3 → 0.1 | No duplicate score exists; only the empty space remains |
| G-shot-hierarchy | B | 4 → 3 | 1.0 → 0.5 | Lit arrows already isolate the entrances (r07, r08); the gain is overstated |
| G-contact-light | B | 4 → 3 | 1.0 → 0.5 | Duplicate of G-contact-shadows |
| G-mobile-landscape | B | 4 → 3 | 1.0 → 0.4 | Duplicate of G-landscape-framing; portrait is already good |
| G-model-depth | B | 3 → 2 | 1.0 → 0.4 | Facades already have recessed windows, domes and towers (c06); plinths only |
| G-ramp-plastic | B | 3 → 2 | 0.5 → 0.3 | Ball reads on the ramp (r05); the seam and entrance boxes stand |
| G-phone-type | B | 3 → 2 | 0.5 → 0.3 | The DMD already names shots ("RAMPS, ORBITS" in r07, "RAMP JACKPOTS" in mobile r06); the legend size stands |
| G-steam-impact | B | 2 | 0.5 → 0.3 | Steam softness conceded; cap travel partly visible |

```json
{
  "loop": 6,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "art": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r03-play", "note": "mid-field below SPA CITY carries the mode arc, arrows, star and legends; not a large empty patch" },
      { "shot": "desktop/c03-flippers", "note": "fan composed around the flippers; printed sling plastics" },
      { "shot": "desktop/r02-serve", "note": "backglass in the same palette as the playfield" },
      { "shot": "desktop/c02-springs", "note": "conceded: upper garden competes with shots" } ] },
    "toys": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c02-springs", "note": "bumper caps have a gold ring and printed decal, contrary to critic A" },
      { "shot": "desktop/c06-arlington", "note": "recessed lit windows and roof detail; lock sides are chrome tubes; back wall a grey slab" },
      { "shot": "desktop/c03-flippers", "note": "chrome ball reflects the table; plain flippers conceded" },
      { "shot": "desktop/c05-tower", "note": "clear ribbon ramp and lattice tower; brown entrance boxes and floor seam conceded" },
      { "shot": "desktop/c04-vapors", "note": "grey slab scoop walls conceded" } ] },
    "lighting": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c01-row", "note": "lit bathhouse inserts glow without clipping; no cast shadows under the plinths" },
      { "shot": "strips/s03-multiball", "note": "amber flasher bursts in frames 0, 1, 2 and 7; lamp chase" },
      { "shot": "desktop/s02-bumpers-5", "note": "hotspots hide one digit, not the whole legend" },
      { "shot": "desktop/c04-vapors", "note": "blown flare top-left conceded" },
      { "shot": "desktop/r08-wizard", "note": "room dims for the mode; Valley star blob conceded" } ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps at frame 3 and holds through frame 7 as the ball climbs" },
      { "shot": "strips/s02-bumpers", "note": "skirt flash and shorter body frame 5 vs 4; steam soft" },
      { "shot": "strips/s03-multiball", "note": "lamp chase and flasher bursts" } ] },
    "ui": { "score": 7.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r07-mode", "note": "DMD horse icon; HUD shows Derby 18/100 and a 45s timer" },
      { "shot": "desktop/r04-bumpers", "note": "score only in the side panel while the DMD shows SPA CITY; no duplication" },
      { "shot": "desktop/r03-play", "note": "score only in the DMD; side-panel dead space conceded" },
      { "shot": "mobile/r03-play", "note": "chip on its own row under the DMD" } ] },
    "typography": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate slab display and sans pairing" },
      { "shot": "desktop/c01-row", "note": "plates crisp in close-up" },
      { "shot": "mobile/r03-play", "note": "MOUNTAIN TOW clipped by the overlapping COASTER plate; legends tiny at 390 px" } ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r03-play", "note": "ball measures about 18 to 20 px, not 10" },
      { "shot": "desktop/r04-bumpers", "note": "ball at the arch reads against dark foliage with a bright rim" },
      { "shot": "desktop/r08-wizard", "note": "lit shot arrows unmistakable" },
      { "shot": "mobile/r06-multiball", "note": "three balls clearly visible on the phone; upper-field highlights compete" } ] },
    "mobile": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait framed: large DMD, chip row, table fills the width" },
      { "shot": "mobile/r06-multiball", "note": "Menu and Launch on the apron, clear of the lanes and flippers" },
      { "shot": "mobile/r11-landscape", "note": "table covers about 85% of the height and about 51% of the free width; small, conceded" } ] },
    "authenticity": { "score": 7.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in order" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington" },
      { "shot": "desktop/r01-title", "note": "BATHHOUSE ROW · HOT SPRINGS, ARKANSAS still on the title" },
      { "shot": "desktop/r09-help", "note": "hedged facts" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball identity and no text in the paintings, per both critics. The Vapors neon script question is unverified resemblance only; the measured gate passed. A source check is reasonable." },
  "gaps": [
    { "id": "G-landscape-framing", "category": "mobile", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Height already about 85%; enlarge the table into the free width left of the HUD or compact the HUD so the table covers at least 60% of the free width." },
    { "id": "G-desktop-table-scale", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["desktop/r03-play"], "fix": "Ball is already about 18 to 20 px; only consider widening the table viewport or a ball-follow zoom if the side panel is narrowed." },
    { "id": "G-grey-slab-walls", "category": "toys", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c05-tower", "desktop/c06-arlington"], "fix": "Rebuild the Vapors scoop walls and the Arlington lock back wall in the stainless-blade profile; replace the brown ramp-entrance boxes with metal flaps." },
    { "id": "G-glare-bloom-clip", "category": "lighting", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c04-vapors", "desktop/r08-wizard", "desktop/s02-bumpers-5"], "fix": "Remove the c04 flare source, cap the Valley star emissive, reduce the bumper cap specular so 143F stays whole in every s02 frame." },
    { "id": "G-contact-shadows", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c01-row", "desktop/c05-tower", "desktop/c03-flippers"], "fix": "Soft shadow casting or baked contact shadows under the plinths, tower and slings." },
    { "id": "G-playfield-text-scale", "category": "typography", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["mobile/r03-play", "desktop/r02-serve"], "fix": "Move the COASTER legend off the end of the ramp plate so MOUNTAIN TOWER shows whole; raise the minimum plate cap height." },
    { "id": "G-ball-contrast", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r06-multiball"], "fix": "Optional contact shadow under the ball for multiball reads; the rim already separates it from the field." },
    { "id": "G-animation-legibility", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s01-flip"], "fix": "Exaggerate the bumper sink and ring flash so it reads at the play camera; add a sling rubber flash; capture a nudge strip to test camera reaction." },
    { "id": "G-mid-field-and-inserts", "category": "art", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c04-vapors", "desktop/r03-play"], "fix": "Model the arrow and star inserts as bevelled lensed geometry lit from below." },
    { "id": "G-flipper-bumper-detail", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "Deco decal and rubber texture on the flippers; bumper caps already detailed." },
    { "id": "G-desktop-side-panel", "category": "ui", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r03-play"], "fix": "Fill the empty space under Menu with a mode-progress grid; no duplicate score exists to remove." },
    { "id": "G-shot-hierarchy", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["desktop/r03-play", "mobile/r06-multiball"], "fix": "Quiet the art right around each entrance; the lit arrows already carry the cue." },
    { "id": "G-contact-light", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c06-arlington", "desktop/c03-flippers"], "fix": "Duplicate of G-contact-shadows; also reduce the bumper-base reflection peaks." },
    { "id": "G-mobile-landscape", "category": "mobile", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Duplicate of G-landscape-framing." },
    { "id": "G-model-depth", "category": "toys", "expectedGain": 0.4, "severity": 2, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c06-arlington"], "fix": "Bevel and detail the plinths; facades already have recessed windows and roof detail." },
    { "id": "G-ramp-plastic", "category": "toys", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower", "desktop/r05-ramp"], "fix": "Remove the floor seam and the entrance boxes; ball already reads on the ramp." },
    { "id": "G-phone-type", "category": "typography", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["mobile/r03-play", "mobile/r07-mode"], "fix": "Enlarge essential field legends at 390 px; the DMD already names the shots for each mode." },
    { "id": "G-steam-impact", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers"], "fix": "Curling breakup in the steam; clearer cap compression at the play camera." }
  ]
}
```

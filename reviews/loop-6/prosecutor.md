# Prosecutor: loop 6

## Summary of the case

The critics' means total 59.5 (art 6.75, toys 6.5, lighting 6.25, animation 6.5, ui 7.25, typography 6.5,
readability 6.25, mobile 6.0, authenticity 7.5). Both critics described most of the defects correctly, but then
scored as if the improvements this loop (ramp ribbon, sling plastics, thin guides, the phone chip row) outweighed
them. Measured against the rubric anchors, most categories fail several of the conditions that a 7 requires, and
show several of the descriptions attached to a 5. The critics also missed or excused four things:

1. **Ball-sized white decoys.** The bumper base point-lights render as white dots the same size and brightness as
   the ball, in every desktop frame.
2. **A studio reflection on the ball.** The ball carries a crosshair-shaped studio reflection, not a reflection of
   the table.
3. **A landscape regression.** On the evidence of `ab/mobile-r11-landscape`, this build's phone-landscape table is
   smaller than the other build's. Critic B read that pair backwards.
4. **Unsynced bumper flashes.** In `strips/s02-bumpers` the flashes fire after the ball has left the frame.

My proposed total is **54.0**. Every category stays within ±1 of the critic mean. All paths below are relative to
`games/Pinball/screenshots/review-loop-6/`. I made 2x to 4x crops of the full-size files in a scratch folder to
check small details. The crops aren't part of the evidence; the cited files are.

## Category by category

### Art: critics 7.0 / 6.5 (mean 6.75). Proposed **6.0**
- **Two unrelated hands.** The upper third is a lush painted garden with a waterfall, rocks and a spring house
  (`desktop/c02-springs`). The lower two thirds are geometric deco terrazzo (`desktop/c03-flippers`). The two meet
  at the brick-wall arc with no shared motif.
- **The painting ignores the layout.** The bumpers sit on painted rocks. The S·P·A lane guides stand over a painted
  waterfall that flows straight under them (`desktop/c02-springs`). That fits the 5 anchor ("art sits in rectangles
  unrelated to the layout"), not the 7 ("composed around the layout").
- **Clip-art arrows and decal inserts.** The large shot arrows are flat saturated triangles with a thin outline
  (`desktop/c04-vapors`, bottom edge: the blue and orange arrows). The mode and multiplier inserts are flat glyphs on
  black plaques, not lensed inserts that belong to the painting (`desktop/c03-flippers`, `desktop/r08-wizard`). The
  3 anchor names "clip-art". These arrows sit next to the shots the art should be directing the eye to.
- **Empty mid-field.** Between SPA CITY and the mode arc is plain terrazzo (`desktop/r03-play`, `mobile/r03-play`).
- **Accepted:** the backglass is strong, and the lower fan does frame the flippers (`desktop/r02-serve`).
- **Verdict:** "every zone themed" holds, "composed around the layout" does not. 6.0 is the defensible score; Critic
  B's 7 rewards the backglass for the playfield's sins.

### Toys: critics 6.5 / 6.5 (mean 6.5). Proposed **6.0**
- **Ramp entrance (`desktop/c05-tower`, lower centre).**
  - The new clear ribbon walls end in sharp white spikes that stab into two dark walnut boxes. The brief says the
    walnut walls are gone, but these boxes remain.
  - The ramp bed is an opaque frosted-grey slab with a hard seam halfway up, and it has no metal entrance flap.
  - The 7 anchor asks for "a convincing ramp". The upper ribbon is convincing; the entrance, which is the part the
    player looks at, is not.
- **Vapors scoop (`desktop/c04-vapors`).** The walls are flat grey extruded slabs on a plain cream box.
  `ab/desktop-c04-vapors` shows this build traded B's brass tubes for untextured grey: a materials regression at
  this toy.
- **Arlington lock (`desktop/c06-arlington`).** The frame is a flat grey U whose top edge glows as if it were a lamp.
- **Slingshots (`desktop/c03-flippers`).** The printed plastic sits on a cream rectangular block. The black "rubber
  rings" are flat donuts lying on the floor around the block corners, not rubber stretched around posts. The top
  tip of the plastic has no post under it.
- **Flippers (`desktop/c03-flippers`).** Featureless matte white extrusions with no decal, rubber texture or wear,
  and they cast no shadow at all, so they float.
- **Bathhouses (`desktop/c01-row`).** All eight stand on identical beige cube plinths.
- **The ball.** Its highlight is a "+"-shaped window cross (`desktop/r03-play` and `desktop/r05-ramp` at 4x; also
  visible as the cross on every ball in `strips/s01-flip`). It reads as a studio light box, not a chrome ball in a
  cabinet.
- **Verdict:** the 7 anchor wants every toy plausible, a convincing ramp and a chrome ball. Three of the six
  close-ups contain flat grey or untextured parts, so 6.0.

### Lighting: critics 6.0 / 6.5 (mean 6.25). Proposed **5.5**
The 7 anchor sets three conditions: "soft shadows ground every toy", "the ball reflects the table" and "no glare".
This build fails all three on capture evidence.
- **No grounding.** There are no contact shadows under the flippers, slings, ball or bathhouses (`desktop/c03-flippers`,
  `desktop/c01-row`). The ball in `desktop/r03-play` sits on the terrazzo with no darkening beneath it.
- **The ball doesn't reflect the table.** It shows a neutral cross panel (see Toys), not the warm playfield.
- **Glare and blown areas.** The 5 anchor reads "washed-out or blown areas", and this build has them:
  - a large white flare in the top-left of `desktop/c04-vapors`, worse than the other build in `ab/desktop-c04-vapors`;
  - a warm bloom blob in the bottom-left corner of `desktop/c06-arlington`;
  - in `desktop/s02-bumpers-0` a warm halo around the ball that washes out the 143°F caps of two bumpers;
  - the VALLEY OF THE VAPORS star in `desktop/r08-wizard`, a white disc whose glow eats its own legend.
- **No mood shift outside the wizard.** In `desktop/r06-multiball` the GI is the same as in `desktop/r03-play`.
  Arlington Multiball changes only the DMD and one arrow. Only the wizard (`desktop/r08-wizard`) and the Grand Soak
  strip (`strips/s03-multiball`) shift the mood.
- **Accepted:** lamps bloom only when lit, and the bathhouse inserts no longer clip (`desktop/c01-row`).
- **Verdict:** this sits between the 5 and 7 anchors, closer to 5. 5.5.

### Animation: critics 6.5 / 6.5 (mean 6.5). Proposed **6.0**
- **`strips/s01-flip`.** The flipper rises in frame 3 and stays up through frame 7. Not one insert, sling or GI lamp
  changes across the 8 frames: the 2X/3X, SOAK and coaster lamps are pixel-identical. The ball has no motion trail.
  The anchor asks for a table that reacts; here only the flipper and the ball move.
- **`strips/s02-bumpers`.**
  - The ball climbs away from the bumpers in frames 0–4 and leaves the top of the frame in frames 5–7.
  - The teal bumper flashes come in frames 5–7, when the ball is already at the arch (`desktop/s02-bumpers-5`).
    Hit and reaction never appear together, so "bumpers flash and drop" cannot be read from this strip.
  - The new 6 mm sink isn't visible in any frame. I can't see the "cap-height variation" Critic B credits.
  - Steam is soft vertical columns with no billow.
- **`strips/s03-multiball`.** The light show runs. This is the only strip that meets the anchor.
- **No camera reaction** to a hit or nudge appears in any capture.
- **Verdict:** of the five 7-anchor items, flipper snap and light show are shown. Bumper drop, camera reaction and
  steam that reads as steam are not. 6.0.

### UI: critics 7.0 / 7.5 (mean 7.25). Proposed **6.5**
- **Idle DMD.** In three of the seven desktop play frames the DMD shows a static "SPA CITY / BALL 1" while the score
  moves to the side panel (`desktop/r04-bumpers`, `desktop/r05-ramp`). In `desktop/r03-play` the score is on the DMD
  instead. Where the score lives is inconsistent from frame to frame, and the DMD idles in the moments the anchor
  wants it telling the story.
- **No DMD animation in the captures.** Each mode is one static frame: an icon plus two lines (`desktop/r07-mode`,
  `desktop/r08-wizard`).
- **Dead side panel.** Below the Menu button, roughly 250 px of the right panel is empty in every desktop play frame
  (`desktop/r03-play` to `desktop/r08-wizard`).
- **Overlap on phone.** The 7 anchor says "nothing overlapping". On the phone the Menu and Launch buttons sit on top
  of the apron and hide both apron cards (`mobile/r02-serve`, `mobile/r03-play`).
- **Help layout.** On desktop the left column runs under the Back button mid-sentence ("Central Avenue orbit … meter
  for an extra ball") while about 40% of the right column is empty, and no scrollbar is shown (`desktop/r09-help`).
- **Accepted:** the DMD icons have character (horse, Arlington towers, steaming mountain), and the menus share one
  deco style (`desktop/r01-title`, `desktop/r10-scores`).
- **Verdict:** Critic B's 7.5 is not supported. 6.5.

### Typography: critics 6.5 / 6.5 (mean 6.5). Proposed **6.0**
- **Clipped ramp plate.** It reads "MOUNTAIN TOW" in `desktop/r02-serve`, `desktop/c03-flippers`, `mobile/r02-serve`
  and `strips/s01-flip`: a hard, repeated typesetting fault on the main shot.
- **Illegible playfield text at play scale.**
  - The apron cards in `desktop/r02-serve` are blurred serif text about 5 px tall: their body lines can't be read
    even at 3x.
  - The bathhouse plates on the phone are about 5 device px (`mobile/r03-play`).
  - The Vapors marquee is a white smear (`desktop/r02-serve`, `mobile/r03-play`).
- **Bloom over lettering.** In `desktop/r08-wizard` the star's bloom overprints its own legend, so "VALLEY OF THE
  VAPORS" breaks up.
- **Low-contrast About block.** It's small grey type on dark purple (`desktop/r09-help`).
- **Accepted:** the display face and DMD font are deliberate and clean (`desktop/r01-title`, `mobile/r06-multiball`).
- **Verdict:** the 7 anchor's "playfield lettering crisp" fails in every play frame. 6.0.

### Readability: critics 6.0 / 6.5 (mean 6.25). Proposed **5.5**
- **Ball decoys (neither critic raised this).** In `desktop/r02-serve`, `desktop/r03-play` and `desktop/r06-multiball`
  each pop bumper has a bright white base hotspot about 10 px across, about the size and value of the ball. With the
  ball at the arch (`desktop/r04-bumpers`, `desktop/r06-multiball`), the upper field shows four ball-like white
  dots, and only one of them is the ball. The wizard star in `desktop/r08-wizard` is a fifth.
- **Ball on the ramp.** It turns into a dull grey disc behind the frosted ramp floor. At 4x it is visible, but at
  native size it is a faint dot inside a grey slab (`desktop/r05-ramp`). Critic B's "ramp ball visible" overstates
  this.
- **Ball in the steam.** In `desktop/s02-bumpers-3` the ball overlaps a steam column and loses its edge.
- **Multiball.** Three roughly 10 px balls sit on a 460 px-wide table (`desktop/r06-multiball`). The anchor's
  "instant reads even in multiball" belongs to a 9, but the 7 anchor's "ball always stands out" also fails here.
- **Accepted:** lit and unlit mode inserts are distinct (`mobile/r03-play`), and the lower-field ball reads well
  (`desktop/r03-play`).
- **Verdict:** 5.5.

### Mobile: critics 6.0 / 6.0 (mean 6.0). Proposed **5.5**
- **Landscape got worse this loop, and Critic B read the pair backwards.**
  - In `ab/mobile-r11-landscape` build A is this loop's build. I identified it from the thin silver guides in
    `ab/desktop-c04-vapors`, which match the brief's change list.
  - A's table is about 150 px wide in the pair, against about 210 px for B, and is no taller in any useful way.
  - In `mobile/r11-landscape` the table uses about 38% of the 844 px width, with about 115 device px of black above
    it and a right HUD that is about 60% empty below Menu.
  - Critic B credited A with a "taller landscape projection"; the pair shows the opposite.
- **No visible touch zones and no Launch control** in landscape (`mobile/r11-landscape`).
- **Portrait.** The Menu button sits over the bottom-left outlane exit and apron (`mobile/r03-play`, bottom), and both
  buttons hide the apron cards. Playfield legends are unreadable at native size (`mobile/r03-play`).
- **Accepted:** portrait is framed on purpose, and the DMD and chip row are clean (`mobile/r02-serve`).
- **Verdict:** a regression in one of the two required orientations. 5.5.

### Authenticity: critics 7.5 / 7.5 (mean 7.5). Proposed **7.0**
- **The Arlington is in the wrong place.** It sits mid-Row between the Fordyce and the Quapaw as the centre lock
  (`desktop/c01-row`, `desktop/c06-arlington`). The real hotel stands at the north end of Bathhouse Row, past the
  Superior. The 9 anchor is "a local would name every landmark". A local would also notice the Arlington dropped
  into the middle of the Row, and the help text doesn't hedge this (`desktop/r09-help`).
- **Generic spring art.** The upper-field spring is a large cascading waterfall into a pond (`desktop/c02-springs`).
  That's the generic spa-garden image Critic B flagged, not the Row's small display springs and brick Promenade.
- **Simplified models.** The bathhouses are toy blocks on identical beige plinths (`desktop/c01-row`).
- **Accepted:** the eight bathhouses are in correct north-to-south order, and the tower, Vapors and hedged facts are
  all there.
- **Verdict:** 7.0.

## IP check
- **Commercial pinball:** I found no commercial pinball name, logo or art in any capture.
- **Backglass:** I checked it at 2x (`desktop/r02-serve`). It contains no text; the neon canopy at the right is
  blank. A horse-head shape is formed by the steam at the upper right. It's an art artefact, not text.
- **Playfield paintings:** no text in the garden, the spring house or the waterfall (`desktop/c02-springs`). All
  lettering is in separate overlays.
- **Vapors sign:** the neon script "The VAPORS" (`desktop/c04-vapors`) is still unverified against the real venue's
  sign. Like both critics, I don't count it as a hit; it needs a source comparison.
- **Verdict:** clean, with that reservation.

## Gaps the critics missed (or understated)
1. **G-bumper-hotspot-decoys** (readability, severity 4, effort S, WS1, about +0.5)
   - **Problem:** the white base hotspots under each pop bumper are ball-sized and ball-bright (`desktop/r02-serve`,
     `desktop/r06-multiball`, `desktop/c06-arlington`).
   - **Fix:** replace the point-light sprite with a dim teal ring glow that follows the skirt.
   - **Test:** in r02 and r06, no non-ball blob with luminance above 0.9 is larger than half the ball's diameter.
2. **G-ball-env-reflection** (lighting, severity 3, effort M, WS1, about +0.5)
   - **Problem:** the ball shows a "+" studio cross, not the table (`desktop/r03-play`, `desktop/r05-ramp`,
     `strips/s01-flip`).
   - **Fix:** feed the ball an environment map rendered from the playfield (a low-res CubeCamera updated every few
     frames, or a baked playfield cubemap).
   - **Test:** at 4x the ball shows warm playfield colours and no cross shape in r03.
3. **G-landscape-regression** (mobile, severity 4, effort S, WS6, about +0.5)
   - **Problem:** the flatter landscape camera made the table smaller than the other build's
     (`ab/mobile-r11-landscape`, `mobile/r11-landscape`).
   - **Fix:** fit the camera so the table's bounding box fills the free canvas height, and narrow the HUD column.
   - **Test:** the table's bounding-box area in r11 is at least that of build B, and at least 85% of the 390 px
     height.
4. **G-ramp-entrance** (toys, severity 3, effort S, WS2, about +0.5)
   - **Problem:** walnut boxes and spike-ended clear lips at the ramp mouth, and no entrance flap (`desktop/c05-tower`).
   - **Fix:** end each clear ribbon in a rounded return, replace the walnut boxes with stainless blade posts, and add
     a thin metal entrance flap that meets the playfield.
   - **Test:** c05 shows no brown box and no pointed lip end.
5. **G-bumper-hit-sync** (animation, severity 3, effort S, WS3, about +0.4)
   - **Problem:** the bumper flashes fire after the ball has left, and the strip loses the ball in frames 5–7
     (`strips/s02-bumpers`).
   - **Fix:** peak the flash and the 6 mm sink on the contact frame with a 2–3 frame decay, and frame the s02 capture
     on the bumpers for the full hit and recovery.
   - **Test:** one s02 frame shows the ball touching a visibly sunk, flashing bumper.
6. **G-idle-dmd** (ui, severity 2, effort S, WS5, about +0.3)
   - **Problem:** the DMD idles on "SPA CITY / BALL 1" while the score moves to the side panel (`desktop/r04-bumpers`,
     `desktop/r05-ramp`).
   - **Fix:** keep the score on the DMD in all play states, with a progress or next-shot line, and cycle a short
     animation.
   - **Test:** every play frame's DMD shows the score and one live objective.
7. **G-arlington-hedge** (authenticity, severity 2, effort S, WS5, about +0.3)
   - **Problem:** the Arlington sits mid-Row with no explanation (`desktop/c01-row`, `desktop/r09-help`).
   - **Fix:** add a hedged help line ("the Arlington stands at the north end of the Row; here it anchors the lock"),
     or move the Arlington plate and model to the Row's north end.
   - **Test:** the help or layout matches the real geography.

```json
{
  "loop": 6,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c02-springs", "note": "garden painting ignores layout: bumpers on painted rocks, S-P-A guides over a painted waterfall" },
      { "shot": "desktop/c04-vapors", "note": "shot arrows are flat clip-art triangles" },
      { "shot": "desktop/r03-play", "note": "empty mid-field terrazzo; garden and deco terrazzo are two unrelated hands" },
      { "shot": "desktop/c03-flippers", "note": "inserts are flat glyphs on black plaques, not lensed inserts" } ] },
    "toys": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c05-tower", "note": "ramp entrance: walnut boxes, spike-ended clear lips, opaque grey bed with seam, no flap" },
      { "shot": "desktop/c04-vapors", "note": "scoop walls flat grey slabs on a cream box" },
      { "shot": "desktop/c06-arlington", "note": "lock frame is a flat grey U with glowing edge" },
      { "shot": "desktop/c03-flippers", "note": "featureless flippers; sling rubbers are floor donuts around a cream block" },
      { "shot": "desktop/r03-play", "note": "ball highlight is a studio cross, not a chrome reflection" } ] },
    "lighting": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "large blown white flare top-left (worse than other build)" },
      { "shot": "desktop/c03-flippers", "note": "no contact shadows under flippers, slings or ball" },
      { "shot": "desktop/s02-bumpers-0", "note": "warm halo on ball washes out bumper caps" },
      { "shot": "desktop/r08-wizard", "note": "star insert blooms into a white disc over its legend" },
      { "shot": "desktop/r06-multiball", "note": "multiball shows no GI or mood change vs r03" } ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps; no lamp, sling or GI reacts across 8 frames" },
      { "shot": "strips/s02-bumpers", "note": "bumper flashes in frames 5-7 after the ball has left the frame; sink not visible" },
      { "shot": "strips/s03-multiball", "note": "light show runs; only strip meeting the anchor" } ] },
    "ui": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r04-bumpers", "note": "DMD idles on SPA CITY / BALL 1 while score moves to side panel" },
      { "shot": "desktop/r03-play", "note": "about 250 px of dead side panel below Menu" },
      { "shot": "mobile/r02-serve", "note": "Menu and Launch overlap the apron and hide its cards" },
      { "shot": "desktop/r09-help", "note": "left column runs under Back mid-sentence while right column is 40% empty" },
      { "shot": "desktop/r07-mode", "note": "DMD icon has character but is a single static frame" } ] },
    "typography": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r02-serve", "note": "MOUNTAIN TOW clipped; apron cards unreadable; Vapors marquee a smear" },
      { "shot": "mobile/r02-serve", "note": "MOUNTAIN TOW clipped on phone" },
      { "shot": "desktop/r08-wizard", "note": "star bloom overprints VALLEY OF THE VAPORS legend" },
      { "shot": "desktop/r01-title", "note": "display face deliberate and clean" } ] },
    "readability": { "score": 5.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r02-serve", "note": "three ball-sized white bumper hotspots act as ball decoys" },
      { "shot": "desktop/r06-multiball", "note": "three ~10 px balls among four ball-like white dots in the upper field" },
      { "shot": "desktop/r05-ramp", "note": "ball on ramp is a dull grey disc behind the frosted bed" },
      { "shot": "desktop/s02-bumpers-3", "note": "ball loses its edge in a steam column" },
      { "shot": "mobile/r03-play", "note": "lit/unlit mode inserts distinct" } ] },
    "mobile": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "ab/mobile-r11-landscape", "note": "this build (A) landscape table smaller than B: regression" },
      { "shot": "mobile/r11-landscape", "note": "table ~38% of width, black band above, HUD 60% empty, no touch zones or Launch" },
      { "shot": "mobile/r03-play", "note": "Menu button over the left outlane exit and apron; legends unreadable" },
      { "shot": "mobile/r02-serve", "note": "portrait framed on purpose, DMD readable" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in correct order, but the Arlington is placed mid-Row (real: north end)" },
      { "shot": "desktop/c06-arlington", "note": "Arlington silhouette good, geography wrong and unhedged" },
      { "shot": "desktop/c02-springs", "note": "generic cascading waterfall garden, not the Row's display springs" },
      { "shot": "desktop/r09-help", "note": "facts hedged; no note on Arlington placement" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art. Backglass has no text at 2x (horse-head shape in steam is an art artefact, not text). Vapors neon script still needs a source comparison; not counted as a hit." },
  "gaps": [
    { "id": "G-bumper-hotspot-decoys", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "desktop/r06-multiball", "desktop/c06-arlington"], "fix": "Replace the white bumper-base point-light sprites with a dim teal ring glow on the skirt; test: no non-ball blob with luminance above 0.9 larger than half the ball diameter in r02 or r06." },
    { "id": "G-ball-env-reflection", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r05-ramp", "strips/s01-flip"], "fix": "Give the ball an environment map rendered from the playfield (low-res CubeCamera every few frames or a baked playfield cubemap); test: at 4x the ball in r03 shows warm playfield colour and no cross shape." },
    { "id": "G-landscape-regression", "category": "mobile", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["ab/mobile-r11-landscape", "mobile/r11-landscape"], "fix": "Refit the landscape camera so the table bbox fills the free canvas height and narrow the HUD column; test: r11 table bbox area at least the other build's and at least 85% of 390 px height." },
    { "id": "G-ramp-entrance", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "End each clear ribbon in a rounded return, replace the walnut entrance boxes with stainless blade posts, add a metal entrance flap meeting the playfield; test: c05 shows no brown box and no pointed lip end." },
    { "id": "G-bumper-hit-sync", "category": "animation", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "desktop/s02-bumpers-5"], "fix": "Peak the bumper flash and 6 mm sink on the contact frame with a 2-3 frame decay, and frame the s02 capture on the bumpers through hit and recovery; test: one s02 frame shows the ball touching a visibly sunk, flashing bumper." },
    { "id": "G-idle-dmd", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r04-bumpers", "desktop/r05-ramp", "desktop/r03-play"], "fix": "Keep the score on the DMD in every play state with a live objective line and a short cycling animation; drop the side-panel duplicate; test: every play frame's DMD shows score plus one objective." },
    { "id": "G-arlington-hedge", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/c01-row", "desktop/r09-help"], "fix": "Add a hedged help line explaining that the real Arlington stands at the Row's north end and anchors the lock here for play, or move its plate and model to the north end; test: help text or layout matches the geography." }
  ]
}
```

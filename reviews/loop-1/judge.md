# Judge: loop 1

All capture paths are relative to `games/Pinball/screenshots/review-loop-1/` and use the lowercase names on disk.

## What I checked myself

No category has a critic spread above 1.0, and no prosecutor/advocate spread above 1.0 (several sit at exactly 1.0:
toys, lighting, animation, readability, mobile). The reviewers did disagree on several facts, so I opened the
captures behind each one:

| Disputed fact | Captures opened | Ruling |
|---|---|---|
| Camera moves in the multiball strip (Critic A, advocate) | `strips/s03-multiball`, `desktop/s03-multiball-0` to `-7` (measured) | **Prosecutor right.** The table's left edge is at x = 319 / 302 / 284 px (rows y = 200 / 400 / 600) in all eight frames. The camera does not move. Only one ball shows (frames 5 to 7, `desktop/s03-multiball-5`), so no eject can be seen either. |
| Wizard "looks the same as normal play" (Critic A) | `desktop/r08-wizard` against `desktop/r03-play` | **Split.** The advocate is right that many inserts change: all eight Row inserts, all three LOCK lamps, 2X to 5X, the Central Ave lamps and the Vapors star. The prosecutor is right that the blue, red and green shot arrows and the mode arc are no brighter than in R03, even though the DMD says "ALL SHOTS LIT", and the GI colour doesn't shift. At thumbnail size the two frames are nearly the same. |
| R04 ball lost against white water (Critic A) | `desktop/r04-bumpers` | **Advocate right.** The ball is at about (596, 75) against dark foliage, and it reads as a small silver sphere. The prosecutor is also right that this "bumpers" frame shows unlit bumpers and an idle DMD ("SPA CITY / BALL 1"). The strip `strips/s02-bumpers` does show hits, so the frame is a timing miss. |
| THE VAPORS label hidden under the logo (Critic A, prosecutor) | `desktop/c04-vapors`, `desktop/s03-multiball-5`, `mobile/r07-mode` | **Advocate mostly right.** In the close-up the scoop wall hides the label (only "RS" shows). At play distance it reads vertically in full, with only its last letter touching the SPA CITY logo. |
| No wireform (Critic A) | `desktop/c05-tower` | **Advocate right.** Parallel cylindrical wire rails run down the right side. The defect is that they render emissive blue-white and read as neon. The ramp's side walls are stair-stepped (white teeth) and there is a kink at y ≈ 520; both are confirmed. |
| Bumper caps opaque with no flash (Critic A) | `strips/s02-bumpers` | **Advocate right.** The struck caps glow green-white from inside in frames 0 and 1, and the bodies glow orange and then decay. There is still no cap or skirt drop. |
| DMD text "not crammed" (advocate) | `desktop/r08-wizard`, `mobile/r07-mode` | **Prosecutor right.** R08 runs four lines out to the right bezel, and the last line starts with a bullet ("• 60 SECONDS"). R07 breaks mid-phrase ("RAMPS AND / ORBITS: WIN / THE RACE"). The change list's "limited to two lines" does not show in any mode callout. |
| Lamps track mode shots (advocate) | `mobile/r07-mode`, `desktop/r03-play` | **Advocate right.** In Derby Day the left orbit (blue), Reserve St (green) and Mountain Tower (yellow) arrows are lit; none of them is lit in R03. |
| Bathhouse plates truncated (all) | `desktop/c01-row`, `desktop/s03-multiball-5` | **Confirmed.** The plates read "MAURIC", "BUCKSTAF" and "OZARK" (cut by its neighbour). Superior's plate is hidden behind the Vapors lane assembly. Art seams show at y ≈ 285 and y ≈ 600 in C01 and at y ≈ 215 in `desktop/c03-flippers`. |
| Landscape framing | `mobile/r11-landscape` | **Prosecutor's measurement stands.** At mid-height the table covers about a third of the canvas. The side panel is empty below the two buttons, and the upper field is foreshortened. |

## Rulings by category

**Art: 5.5.** The upper springs painting and the backglass (`desktop/r03-play`) are in one confident hand, and the
new apron closes off the bottom. Three captures, though, show the rubric's 5-anchor defect, "art sits in rectangles":
- the fan stops on a ruler-straight edge at y ≈ 215 with flat navy below it (`desktop/c03-flippers`);
- luminance seams cross the whole field at y ≈ 285 and y ≈ 600 (`desktop/c01-row`);
- the waterfall painting stops on a straight line into the hex floor (`strips/s02-bumpers`).

Critic B's 6.5 never addressed these seams. The painting quality lifts the score half a point above 5.

**Toys: 5.5.** The Mountain Tower (`desktop/c05-tower`) and the twin-towered Arlington (`desktop/c06-arlington`) hold
up, and the bathhouses have distinct roofs, Quapaw's dome and Ozark's towers (`desktop/c01-row`), so the advocate is
right that they are not interchangeable. Against that:
- post rubbers render as white crescents (`desktop/c04-vapors`);
- the slings have no rubber band (`desktop/c03-flippers`);
- the ramp walls are stair-stepped and kinked, with an emissive wire return (`desktop/c05-tower`);
- the ball is glass, not chrome (`strips/s02-bumpers`);
- the 143°F decal is upside down (`desktop/c01-row`).

That is the rubric's 5-to-6 band.

**Lighting: 6.0.**
- What works: bloom stays on lit inserts only (2X and 3X glow while 4X and 5X stay flat in `desktop/c03-flippers`), and
  `strips/s03-multiball` runs a real insert and mode-arc chase.
- Wizard (`desktop/r08-wizard`) changes insert states but not the shot arrows, the arc or the GI mood.
- Blown dots sit on the bumper and scoop rings, and a cold wash covers the upper left (`desktop/c04-vapors`,
  `desktop/c01-row`).
- Contact shadows are faint under the bathhouses (`desktop/c01-row`), and the lower field has no GI pools
  (`desktop/r03-play`).

The advocate's 6.5 leaned on wizard lamps that don't include the shots, so it falls.

**Animation: 6.0.** The flipper snaps cleanly (`strips/s01-flip`), and bumper bodies and caps flash and decay while
steam drifts (`strips/s02-bumpers`). `strips/s03-multiball` shows a light show but no camera reaction (I measured it)
and only one ball. That leaves three of the five 7-anchor items, with "bumpers drop" and "camera reacts" missing.
Critic A's 6.0 survives without its camera argument because the strip motion alone supports 6. The advocate's 6.5
depended on the camera claim and is rejected.

**UI: 5.5.** The DMD has character, and its objectives now match lit shot arrows (`mobile/r07-mode`). Against that:
- the title hint is clipped through its glyphs on both viewports (`mobile/r01-title`, `desktop/r01-title`);
- the help's last bullet runs under the pinned Back button (`mobile/r09-help`);
- mode callouts run four lines with mid-phrase breaks and a leading bullet, next to dither art with no nameable
  subject (`desktop/r08-wizard`, `mobile/r07-mode`);
- the phone shows the score twice (`mobile/r07-mode`).

The rubric's 7 asks for "nothing overlapping", and two screens fail that. Critic B's 6.5 skipped the help clip.

**Typography: 5.0.**
- This loop's label plates are a regression: names that were complete in the previous build are now truncated
  (`desktop/c01-row`, confirmed by `ab/desktop-c01-row`), and Superior is hidden.
- The title hint is clipped (`mobile/r01-title`).
- Playfield labels are about 4 to 5 css px at 390 px (`mobile/r02-serve`).
- The display face is good (`desktop/r09-help`), but the rubric's "playfield lettering crisp" plainly fails.

**Readability: 6.0.** The ball reads on the dark lower field and, contrary to Critic A, in R04 (`desktop/r04-bumpers`).
All three multiball balls are findable (`desktop/r06-multiball`), lamps track mode shots (`mobile/r07-mode`), and
lit and unlit inserts are clearly different (`desktop/c03-flippers`). Against that:
- wizard says "ALL SHOTS LIT" while the shot arrows stay unlit (`desktop/r08-wizard`);
- the skill-shot A lamp is a small dot (`mobile/r02-serve`);
- the glass ball turns pale over the water art (`strips/s02-bumpers`);
- the phone labels can't be read.

**Mobile: 5.5.** Portrait is framed well, with a readable DMD, a score plate and Launch clear of the ball's area
(`mobile/r02-serve`). Against that:
- Launch covers the right apron card, whose text shows through it (`mobile/r02-serve`);
- landscape uses about a third of the canvas at mid-height with an empty panel (`mobile/r11-landscape`);
- the title hint is clipped (`mobile/r01-title`).

The rubric requires both orientations to be framed on purpose, and landscape isn't.

**Authenticity: 6.5 (gate met).**
- In favour: the eight bathhouses are in the correct order with differing silhouettes (`desktop/c01-row`), along with
  the twin-towered Arlington (`desktop/c06-arlington`), the lattice Mountain Tower (`desktop/c05-tower`), steam, and
  hedged facts in help (`desktop/r09-help`).
- Against: the largest painted area shows Pamukkale-style turquoise terraces (`strips/s02-bumpers`), the Vapors sign
  is a tiny vertical strip (`desktop/c04-vapors`), and the truncated plates weaken identification.

The critics' consensus holds.

**IP.** All four reviewers report the build clean, and the captures I opened agree: there is no commercial pinball
name, logo or art, and the playfield and backglass paintings contain no legible text (`desktop/r03-play`,
`strips/s02-bumpers`). The measured IP gate passes. Perf passes on all three profiles (`gates.json`).

**Total: 51.5 / 90.** No gated category except authenticity reaches its gate. Verdict: **continue**.

## Ranked gaps (gain ÷ effort; at most one L)

1. **G-label-plates** (typography, sev 4, S, WS4, +0.5): plates truncate MAURICE and BUCKSTAFF, clip OZARK and hide
   SUPERIOR. Fix: size each plate to its text in a condensed face, stagger the two rows, move Superior's plate left
   of the Vapors lane, and rotate the 143°F cap decal 180° so it reads upright to the player. Test: all eight names
   are complete and unoccluded in `desktop/c01-row`, and 143°F is upright in `strips/s02-bumpers`.
2. **G-menu-clip** (ui, sev 3, S, WS5, +0.5): the title hint is clipped and the help's last bullet runs under Back.
   Fix: give the hint its own line box with at least 8 px of clear space above and below; add bottom padding equal to
   the Back button's height plus a 24 px fade mask above it. Test: every hint glyph is whole in `desktop/r01-title`
   and `mobile/r01-title`, and the last help bullet is fully readable when scrolled.
3. **G-chrome-ball** (readability, sev 3, S, WS1, +0.3): the glass ball shows the art through itself. Fix: an
   opaque metal material (metalness 1, roughness ≤ 0.15) with a dark horizon band in the reflection map, plus a soft
   contact shadow under the ball. Test: no playfield art visible through the ball's centre in `strips/s02-bumpers`.
4. **G-landscape-fill** (mobile, sev 4, M, WS6, +0.75): the landscape table covers about 33% of the canvas, and in
   portrait Launch covers the apron card. Fix: reduce the tilt, scale the table to fill the free height and width left
   of the panel, put ball count and mode progress into the empty panel, and make Launch opaque or shrink the right
   card. Test: in `mobile/r11-landscape` the table spans at least 60% of the canvas width at mid-height and no
   panel gap is taller than 40% of its height; no card text shows under Launch in `mobile/r02-serve`.
5. **G-mode-lamps** (lighting, sev 4, M, WS1, +0.5): wizard leaves the shot arrows and mode arc unlit and the GI
   unchanged. Fix: drive every shot arrow and the arc from mode state, and give wizard and each multiball its own GI
   tint plus a field dim between chases. Test: every arrow and arc lamp is lit in `desktop/r08-wizard`, and R08
   differs from `desktop/r03-play` at thumbnail size.
6. **G-rubbers-slings** (toys, sev 4, M, WS2, +0.5): post rubbers render as white crescents and the slings have no
   rubber. Fix: model full black torus rubbers on every post and a rubber band with two posts across each sling face.
   Test: a full ring is visible around each post in `desktop/c04-vapors` and a band across each sling in
   `desktop/c03-flippers`.
7. **G-mechanical-feedback** (animation, sev 3, M, WS3, +0.5): bumpers don't drop, multiball shows no eject, and
   the camera never reacts. Fix: a 2-frame cap and skirt drop with a ring flash on the playfield for each bumper hit,
   a staggered multiball kick-out with an eject flash, and a small camera shake on tilt events. Test: a skirt drop is
   visible in `strips/s02-bumpers`, and at least two balls show in at least four frames of `strips/s03-multiball`.
8. **G-dmd-layout** (ui, sev 3, M, WS5, +0.3): callouts run four lines with mid-phrase breaks and a leading bullet,
   beside dither art with no nameable subject. Fix: show the title alone on line 1 and scroll the objective on line 2,
   with no line starting on punctuation, and replace the dithered paintings with high-contrast silhouettes (horse,
   tower, Arlington). Test: at most two text lines in `desktop/r08-wizard` and `mobile/r07-mode`, with the picture's
   subject nameable.
9. **G-ramp-wireform** (toys, sev 3, M, WS2, +0.3): the ramp walls are stair-stepped, there is a kink at y ≈ 520,
   and the wire return is emissive. Fix: smooth, continuous clear side walls with a thickness edge, remove the kink,
   and render the wire as non-emissive chrome with brackets. Test: in `desktop/c05-tower` the walls show no teeth and
   the wires show highlights and shadows rather than glow.
10. **G-light-grounding** (lighting, sev 3, M, WS1, +0.3): blown dots on the bumper and scoop rings, a cold blue wash
    upper left, faint shadows under the landmarks. Fix: raise ring roughness and cap specular, cut the blue fill in
    the upper left, and darken and widen the contact footprints under the bathhouses, Arlington and tower. Test: no
    clipped-white blobs on the rings, and a visible footprint under each bathhouse in `desktop/c01-row`.
11. **G-shot-entrances** (readability, sev 3, M, WS4, +0.3): the entrances for lock, Vapors and the orbits are
    small, the skill-shot lamp is a dot, and the Vapors sign can't be read. Fix: enlarge the entrance arrow inserts by
    about 1.5×, make the lit S·P·A lane lamp at least 2× the unlit brightness and size, add a horizontal lit Vapors
    marquee, and set phone label plates at a minimum of 8 css px. Test: lane A stands out at a glance in
    `mobile/r02-serve`, and the Vapors marquee reads in `desktop/r03-play`.
12. **G-playfield-repaint** (art, sev 5, L, WS4, +1.0, **big lever**): the art sits in rectangles with hard seams,
    the flipper zone is flat navy, and the springs read as Pamukkale. Fix: compose one continuous playfield painting
    around the layout that carries the fan's colours down through the inlanes to the apron, has feathered,
    exposure-matched joins, and repaints the springs as the Hot Springs tufa cascade and steaming green-grey pools.
    Test: no straight luminance step in `desktop/c01-row`, `desktop/c03-flippers` or `strips/s02-bumpers`, and no flat
    area larger than 5% of the playfield in `desktop/r03-play`.

```json
{
  "loop": 1,
  "role": "judge",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "art": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "fan ends on a straight edge at y≈215; flat navy flipper zone (verified)" },
      { "shot": "desktop/c01-row", "note": "luminance seams across the field at y≈285 and y≈600 (verified)" },
      { "shot": "strips/s02-bumpers", "note": "waterfall painting stops on a straight line into the hex floor" },
      { "shot": "desktop/r03-play", "note": "strong backglass and upper painting in one hand; new apron" } ] },
    "toys": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c05-tower", "note": "tower holds up; wire return exists but emissive; ramp walls stair-stepped with kink at y≈520" },
      { "shot": "desktop/c04-vapors", "note": "post rubbers render as white crescents; Vapors building a white box" },
      { "shot": "desktop/c03-flippers", "note": "flippers with red band; slings without rubber" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington reads" },
      { "shot": "strips/s02-bumpers", "note": "caps glow on hit but no drop; glass ball; decal upside down" } ] },
    "lighting": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "bloom only on lit inserts" },
      { "shot": "strips/s03-multiball", "note": "insert and mode-arc chase" },
      { "shot": "desktop/r08-wizard", "note": "insert states change but shot arrows, arc and GI mood do not" },
      { "shot": "desktop/c01-row", "note": "faint contact shadows under bathhouses; cold wash upper left" } ] },
    "animation": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "clean single-step flipper snap and release" },
      { "shot": "strips/s02-bumpers", "note": "body and cap flash and decay; steam drifts; no drop" },
      { "shot": "strips/s03-multiball", "note": "light show; no camera move (left edge constant at 284/302/319 px); one ball only" } ] },
    "ui": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r01-title", "note": "hint clipped through its glyphs" },
      { "shot": "mobile/r09-help", "note": "last bullet under pinned Back" },
      { "shot": "desktop/r08-wizard", "note": "four DMD lines to the bezel, line starting with a bullet; dither noise" },
      { "shot": "mobile/r07-mode", "note": "objective matches lit arrows; mid-phrase wraps; duplicate score" } ] },
    "typography": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "MAURIC, BUCKSTAF, OZARK clipped; Superior hidden" },
      { "shot": "ab/desktop-c01-row", "note": "previous build had full names: regression" },
      { "shot": "mobile/r01-title", "note": "clipped hint" },
      { "shot": "desktop/r09-help", "note": "good display face" } ] },
    "readability": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r04-bumpers", "note": "ball at (596,75) visible against foliage" },
      { "shot": "mobile/r07-mode", "note": "orbit, Reserve St and ramp arrows lit to match the mode" },
      { "shot": "desktop/r06-multiball", "note": "three balls findable" },
      { "shot": "desktop/r08-wizard", "note": "ALL SHOTS LIT with shot arrows unlit" },
      { "shot": "mobile/r02-serve", "note": "skill-shot lamp a small dot; labels illegible at 390 px" } ] },
    "mobile": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "table about a third of the canvas at mid-height; panel empty below buttons" },
      { "shot": "mobile/r02-serve", "note": "portrait well framed; Launch covers apron card" },
      { "shot": "mobile/r01-title", "note": "clipped hint" } ] },
    "authenticity": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in order with differing silhouettes; plates truncated" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington" },
      { "shot": "desktop/c05-tower", "note": "lattice Mountain Tower" },
      { "shot": "strips/s02-bumpers", "note": "Pamukkale-style terraces, not Hot Springs tufa" },
      { "shot": "desktop/c04-vapors", "note": "Vapors sign tiny vertical strip" } ] }
  },
  "ip": { "clean": true, "notes": "All reviewers and judge agree: no commercial pinball name, logo or art; no legible text in playfield or backglass paintings; real names used as places only." },
  "gaps": [
    { "id": "G-label-plates", "category": "typography", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c01-row", "ab/desktop-c01-row", "desktop/s03-multiball-5"], "fix": "Size each plate to its text in a condensed face, stagger the rows, move Superior's plate clear of the Vapors lane, and rotate the 143°F cap decal upright. Test: all eight names complete and unoccluded in desktop/c01-row; 143°F upright in strips/s02-bumpers." },
    { "id": "G-menu-clip", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title", "mobile/r01-title", "mobile/r09-help"], "fix": "Give the title hint its own line box with at least 8 px clear above and below; pad the help body by the Back button's height plus a 24 px fade mask. Test: hint glyphs whole on both viewports; last help bullet fully readable." },
    { "id": "G-chrome-ball", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["strips/s02-bumpers", "desktop/r04-bumpers"], "fix": "Opaque metal ball (metalness 1, roughness <= 0.15) with a dark horizon band in the reflection map and a soft contact shadow. Test: no playfield art visible through the ball centre in strips/s02-bumpers." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape", "mobile/r02-serve"], "fix": "Reduce the tilt and scale the table to the free area left of the panel; fill the panel with ball count and mode progress; make Launch opaque or shrink the right apron card. Test: table at least 60% of canvas width at mid-height, no panel gap taller than 40% of its height, no card text under Launch." },
    { "id": "G-mode-lamps", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r08-wizard", "desktop/r03-play"], "fix": "Drive every shot arrow and the mode arc from mode state; give wizard and each multiball its own GI tint with a field dim between chases. Test: every arrow and arc lamp lit in desktop/r08-wizard, and R08 differs from R03 at thumbnail size." },
    { "id": "G-rubbers-slings", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c03-flippers"], "fix": "Full black torus rubbers on every post; a rubber band with two posts across each sling face. Test: full rings visible in desktop/c04-vapors and bands across both slings in desktop/c03-flippers." },
    { "id": "G-mechanical-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s03-multiball"], "fix": "2-frame cap and skirt drop with a playfield ring flash per bumper hit; staggered multiball kick-out with an eject flash; small camera shake on tilt events. Test: skirt drop visible in strips/s02-bumpers; at least 2 balls in at least 4 frames of strips/s03-multiball." },
    { "id": "G-dmd-layout", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r08-wizard", "mobile/r07-mode"], "fix": "Title alone on line 1 and the objective scrolling on line 2, with no line starting on punctuation; replace dithered paintings with high-contrast silhouettes (horse, tower, Arlington). Test: at most two text lines in R08 and R07, picture subject nameable." },
    { "id": "G-ramp-wireform", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "Smooth continuous clear side walls with a thickness edge, no entrance kink, and a non-emissive chrome wire return with brackets. Test: no wall teeth in desktop/c05-tower; wires show highlights and shadows, not glow." },
    { "id": "G-light-grounding", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Raise ring roughness and cap specular, cut the blue fill at upper left, and darken and widen contact footprints under the bathhouses, Arlington and tower. Test: no clipped-white blobs on rings; a visible footprint under each bathhouse in desktop/c01-row." },
    { "id": "G-shot-entrances", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["mobile/r02-serve", "desktop/c04-vapors", "desktop/r03-play"], "fix": "Enlarge entrance arrow inserts about 1.5x; lit S-P-A lane lamp at least 2x unlit brightness and size; a horizontal lit Vapors marquee; phone label plates at least 8 css px. Test: lane A stands out in mobile/r02-serve and the Vapors marquee reads in desktop/r03-play." },
    { "id": "G-playfield-repaint", "category": "art", "expectedGain": 1.0, "severity": 5, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c03-flippers", "desktop/c01-row", "strips/s02-bumpers", "desktop/r03-play"], "fix": "Big lever: one continuous playfield painting composed around the layout that carries the fan's colours down through the inlanes to the apron, with feathered, exposure-matched joins, and the springs repainted as the Hot Springs tufa cascade and steaming green-grey pools. Test: no straight luminance step in C01, C03 or S02; no flat area larger than 5% of the playfield in desktop/r03-play." }
  ]
}
```

# Judge: loop 3

Capture paths are relative to `games/Pinball/screenshots/review-loop-3/`. I read the rubric, schema, loop brief,
gates, CHANGES, both critics, the prosecutor and the advocate. I opened these myself: `desktop/r01-title`,
`desktop/r03-play`, `desktop/r08-wizard`, `desktop/c01-row`, `desktop/c02-springs`, `desktop/c03-flippers`,
`desktop/c04-vapors`, `desktop/c05-tower`, `mobile/r02-serve`, `mobile/r07-mode`, `mobile/r09-help`,
`mobile/r11-landscape`, and all three strips. I also made 3–4× crops of the Vapors blade (`desktop/c04-vapors`), the
S·P·A lamps and the MOUNTAIN TOWER plate (`mobile/r02-serve`), the upper field in `desktop/r02-serve`, and the ball in
`desktop/r04-bumpers`. I re-measured mean playfield luminance (greyscale, x 460–820, y 30–740) on six desktop frames.

No category has critics more than 1.0 apart, and no prosecutor/advocate pair is more than 1.0 apart. Six pairs
(lighting, animation, typography, readability, mobile, authenticity) sit exactly 1.0 apart, so I checked the
factual disputes behind them anyway.

## Disputed facts, settled

| Claim | Who | Ruling | Capture checked |
|---|---|---|---|
| Mood frames are brighter than base play | A, prosecutor, advocate | **Confirmed.** I measured 71.3 in r02, 77.5 in r03, 77.0 in r04, 84.0 in r06, 86.8 in r07 and 87.5 in r08. The wizard is 13 % brighter than normal play. CHANGES says it dims. | `desktop/r03-play`, `desktop/r08-wizard` |
| The Vapors blade is mirror text | prosecutor, against the advocate's "reads V-A-P-O-R-S" | **Prosecutor right.** At 4× the glyphs run top to bottom as a "2", R, O, a "b"-shaped P, and an inverted V/A. The texture is flipped. It isn't blank (A overstated that), but no one can read it correctly. | `desktop/c04-vapors` |
| On the phone, S and A are both lit during the skill shot | A, prosecutor | **Wrong (advocate right).** At 3×, S and P are dull olive and only A is bright yellow. On desktop A is clearly the brightest, too. Neither viewport gives the lit lane any bloom or halo, so the cue is correct but weak. | `mobile/r02-serve`, `desktop/r02-serve` |
| The ball is lost in the upper garden | A | **Mostly wrong.** In the 3× crop the ball is findable against the foliage. But it renders as a pale, glassy disc with a dark cross through it, not chrome (prosecutor right on that). The three bumper-base specular blobs below it are the same size and value as the ball, and they act as decoys. | `desktop/r04-bumpers`, `strips/s02-bumpers` |
| The MOUNTAIN TOWER plate is split by its arrow | A, prosecutor | **Cause corrected (advocate right).** The COASTER insert disc sits on top of the plate and hides the N. The arrow tip only touches the final R. The collision is real either way, and the claimed fix did not land. | `mobile/r02-serve`, `mobile/r07-mode` |
| Help text still runs under Back | Codex, prosecutor | **Confirmed.** "what's lit, or pays a mystery award" is cut by the button's top edge. The claimed fix did not land. | `mobile/r09-help` |
| Bumpers have no chrome ring; the wireform has no posts | A | **Wrong (advocate right).** Each bumper stands in a polished chrome base ring. Dark posts stand along the wireform. The peach body, the missing skirt and the missing cross-ties are real. | `desktop/c02-springs`, `desktop/c05-tower` |
| The flippers have no rubber ring | A, prosecutor | **Wrong.** A red rubber band wraps each bat. The SPA CITY decal promised in CHANGES is absent. | `desktop/c03-flippers` |
| The multiball strip shows a launch | advocate | **Prosecutor right.** One ball travels up the right side in frames 5–7. No frame shows a second ball, an eject flash or a camera kick. The strip is a good lamp show, not a launch. | `strips/s03-multiball` |
| Landscape shows half the table and repeats the score | all; dup found by the prosecutor | **Confirmed.** The frame starts at the SPA CITY logo, and 1,234,560 appears in both the DMD and the HUD. | `mobile/r11-landscape` |

## Rulings by category

**Art: 6.5** (A 6.5, Codex 7, prosecutor 6, advocate 7)
- The painting is in one hand. The lower field is a composed deco fan: the advocate is right that it isn't "empty
  terrazzo" (`desktop/c03-flippers`). The brick terrace arcs behind the Row and LOCK (`desktop/c01-row`). The
  backglass is strong and matches the table (`desktop/r03-play`).
- What holds it below 7 is the upper garden. It's a general scene laid under the bumpers and lanes, with nothing
  that leads to S·P·A, Reserve St or the lock (`desktop/r02-serve`, `desktop/c02-springs`). The inserts are also flat
  discs and triangles with no surround.
- The prosecutor's label collisions are real, but I score them under typography.

**Toys: 6.0** (6, 6, 5.5, 6)
- The eight façades and the lattice tower with its lit cab are at a 7 standard (`desktop/c01-row`,
  `desktop/c05-tower`).
- Against that:
  - The rails are matte olive tubes, and their end caps overlap at the corners. The guide walls are tall navy slabs
    (`desktop/c04-vapors`).
  - The ramp walls are stair-stepped, with a seam at the break and no flap (`desktop/c05-tower`).
  - The bumper bodies are peach spools (`desktop/c02-springs`).
  - Each sling end shows two black holes, and the decal is missing (`desktop/c03-flippers`).
  - The ball is a glassy puck in play rather than chrome (`desktop/r04-bumpers`, `strips/s01-flip`).
- The prosecutor's 5.5 discounts the façades too heavily. Six is right.

**Lighting: 6.0** (6, 6.5, 5.5, 6.5)
- Bloom is confined to lit lamps: 2X and 3X glow, 4X and 5X don't (`desktop/c03-flippers`). The GI is warm and the
  blue rim flare is gone.
- But my own measurement confirms that every mood state is brighter than base play, which is the opposite of what
  CHANGES describes (`desktop/r08-wizard` 87.5 vs `desktop/r03-play` 77.5).
- The bumper hit rings are opaque peach annuli that merge into one blob in frames 2–4 (`strips/s02-bumpers`). The
  bumper bases carry hot white specular blobs (`desktop/c02-springs`).
- The advocate's 6.5 concedes the central miss and still rounds up. I don't.

**Animation: 6.5** (6.5, 6.5, 6, 7)
- The flipper snaps between frames 2 and 3, and the ball leaves cleanly (`strips/s01-flip`).
- The caps flash green in frames 0–4, then go dark as the rings expand and fade (`strips/s02-bumpers`).
- A real lamp sequence runs across the bumpers, the Row and the inserts (`strips/s03-multiball`).
- Missing at 7: no visible multiball launch, no camera reaction, no flipper rebound or ball trail, and the steam is
  grey dot sprites (`strips/s03-multiball`, `strips/s02-bumpers`). The advocate's 7 counts the lamp show as the
  launch. It isn't one.

**UI, DMD and HUD: 6.5** (6.5, 7, 6, 6.5)
- The horse, twin-tower and valley silhouettes give the DMD real character (`mobile/r07-mode`, `desktop/r08-wizard`).
- The 7 anchor's "nothing overlapping" fails in three places:
  - Help text runs under Back (`mobile/r09-help`).
  - The ☰ and Launch buttons cover the apron card text (`mobile/r02-serve`).
  - Landscape repeats the score (`mobile/r11-landscape`).
- Every mode and multiball still cuts its objective mid-word: "RAMPS AND ORBI" in `mobile/r07-mode`, "L SHOTS LIT ·"
  in `desktop/r08-wizard`. This is a regression from the previous build, which printed the whole line.
- The title is a tidy deco card over a fully blurred demo (`desktop/r01-title`).

**Typography: 6.0** (6, 6.5, 5.5, 6.5)
- The slab display face with neon (`desktop/r01-title`) and the crisp close-range plates (`desktop/c01-row`,
  `desktop/c03-flippers`) are deliberate.
- But:
  - The signature landmark's sign is flipped mirror text (`desktop/c04-vapors`).
  - The COASTER insert sits on the MOUNTAIN TOWER plate (`mobile/r02-serve`).
  - The Vapors blade hides the SUPERIOR label: only "…C HALE" shows (`desktop/c01-row`).
  - Most playfield labels are about 5 px at the player camera (`desktop/r03-play`).
- Two claimed lettering fixes did not land.

**Readability: 6.5** (6, 6.5, 5.5, 6.5)
- Two of Critic A's main charges fail on inspection:
  - On both viewports only the target S·P·A lamp is lit (`mobile/r02-serve`).
  - The upper-field ball is findable (`desktop/r04-bumpers`).
- The colour-coded arrows sit at their entrances, and all five glow in the wizard (`desktop/r08-wizard`).
- What remains below 7:
  - The lit lane has no bloom or halo.
  - The ball is glassy, and the bumper specular blobs look like balls (`desktop/r04-bumpers`).
  - The inlanes and outlanes have no inserts (`desktop/c03-flippers`).
- The prosecutor's 5.5 rests on the two refuted facts.

**Mobile: 5.5** (6, 5.5, 5, 6)
- Portrait is genuinely framed for the phone. The full-width DMD reads, the progress chip swaps without duplicating
  the score, and the whole table fits (`mobile/r02-serve`, `mobile/r07-mode`).
- One of the two required viewports fails outright: landscape shows nothing above the SPA CITY logo, so no shot can
  be seen, and the score appears twice (`mobile/r11-landscape`).
- Help text also runs under Back (`mobile/r09-help`), and the buttons cover the apron cards.
- The advocate weights portrait by frame count, but the rubric weights the two orientations equally.

**Authenticity: 7.0** (7, 7.5, 6.5, 7.5)
- The eight bathhouses are named and in order, with the Quapaw dome and the Ozark towers (`desktop/c01-row`). The
  lattice tower reads (`desktop/c05-tower`), the springs are 143 °F (`desktop/c02-springs`), and the help text hedges
  its facts.
- The Vapors is a white box carrying mirror text (`desktop/c04-vapors`). The Arlington is twin-towered but small, and
  its label does the work. The gate (≥ 6) is met.

**Total: 56.5 / 90.** No category except authenticity meets its gate. Perf and IP gates pass as measured.

## IP

Clean. All four reviewers found no commercial pinball name, logo or art, and no text in the paintings. My crops of
the backglass and playfield agree. The Arlington and the Vapors are real, operating businesses. They appear by name
and as generic models only, with no logo. The mirrored blade is lettering on a 3D sign, not text in a painting. When it
is fixed, keep it a generic neon "VAPORS" and don't copy the venue's real signage.

## Ranked gaps

The gaps are ranked by expected gain ÷ effort (S=1, M=2, L=4).
- **Merged:**
  - the two landscape gaps, plus the landscape score duplicate;
  - help footer and apron buttons, as G-ui-overlaps;
  - Vapors sign and SUPERIOR occlusion;
  - flipper decal, sling holes, ramp, wireform, guide walls and bumper body, as one L hardware pass.
- **Causes corrected:**
  - MOUNTAIN TOWER is covered by the COASTER insert, not split by its arrow.
  - The skill lamp already has the right contrast; it lacks bloom.
  - The ball isn't low-contrast; it's glassy, and the bumper speculars act as decoys.
- **Dropped as refuted:** G-upper-ball-contrast as written.

1. **G-landscape-full-table** (mobile, sev 5, M, WS6, +1.0)
   - Fit the whole playfield, from the top arch to the apron, into 844×390 using a full-height fit or a tilted
     camera. The HUD column takes the leftover width.
   - Show the score once (DMD or HUD, not both) in landscape and in the desktop idle DMD.
   - Test: in `mobile/r11-landscape` the bumpers, S·P·A lanes, Row, both scoops, ramp entrance and flippers are all
     visible, and 1,234,560 appears once.
2. **G-mood-inverted** (lighting, sev 4, S, WS1, +0.5)
   - The mode, multiball and wizard blends currently raise luminance. Make them scale ambient, key and fill down, and
     let the lit inserts and arrows carry the light.
   - Test: mean greyscale over x 460–820, y 30–740 in `desktop/r08-wizard` is at least 25 % below
     `desktop/r03-play` (now 87.5 vs 77.5), and `r06`/`r07` are at least 10 % below `r03`.
3. **G-dmd-objective-static** (ui, sev 3, S, WS5, +0.4)
   - Show a complete short objective statically beside the silhouette, as the previous build did (shorten or wrap to
     two lines). Scroll only extra detail.
   - Test: `r06`, `r07` and `r08` on both viewports have no word cut at the DMD edge.
4. **G-label-collisions** (typography, sev 3, S, WS4, +0.4)
   - Add a layout check that fails when any label plate's box intersects an insert, arrow, rail or toy.
   - Move MOUNTAIN TOWER clear of the COASTER insert, keep the pink arrow off the BATHHOUSE ROW sub-line, and pull
     THE VAPORS plate out from under the scoop rail.
   - Test: the check reports zero overlaps, and the plate reads unbroken in `mobile/r02-serve`.
5. **G-ui-overlaps** (ui, sev 3, S, WS5, +0.35)
   - Make the help body a scroll container that ends above Back, with bottom padding of at least the button height
     plus 16 px.
   - Inset the apron card text, or fold the ☰ and Launch buttons into blank apron panels.
   - Test: no glyph is drawn under Back in `r09` on both viewports, and no button overlaps card text in any phone
     frame.
6. **G-vapors-sign** (typography, sev 3, S, WS2, +0.3)
   - Fix the flipped UV/flipY on the blade texture. Turn the sign to read toward the player camera, and move or
     shorten it so it no longer hides the SUPERIOR plate. Keep the lettering generic.
   - Test: "VAPORS" reads correctly in a 3× crop of `desktop/c04-vapors`, and both SUPERIOR and HALE are fully
     visible in `desktop/c01-row`.
7. **G-skill-shot-bloom** (readability, sev 2, S, WS4, +0.3)
   - The target lane is already about 1.9× its neighbours. Add a bloom halo and a 2–3 Hz flash, and drop the unlit
     lanes to 15 % emissive or less.
   - Test: in `r02` on both viewports exactly one S·P·A lamp shows a bloom halo.
8. **G-rail-brass-material** (toys, sev 4, M, WS2, +0.5)
   - Use a brass albedo of about #C9A24A, metalness 1 and roughness about 0.3 with a brushed normal. Sweep each guide
     as one tube along its spline, with mitred corners and no exposed end caps.
   - Test: `desktop/c04-vapors` and `desktop/c06-arlington` show no overlapping caps, and a specular streak runs along
     every rail.
9. **G-ball-chrome** (toys, sev 3, M, WS1, +0.4)
   - Make the ball opaque metal (metalness 1, roughness about 0.1) with a playfield-derived env map, a dark Fresnel
     rim and a contact shadow. Remove the dark cross artefact.
   - Cut the bumper-base specular points to half their size and intensity so they stop reading as balls.
   - Test: a 3× crop of `desktop/r04-bumpers` shows an opaque mirrored ball with a dark rim and no cross, and no
     bumper highlight matches the ball in size and value.
10. **G-hardware-construction** (toys, sev 4, **L — the loop's big lever**, WS2, +0.75)
    - Toys has sat at 5–6 for four loops. The façades and tower are already at standard, and the rest of the hardware
      holds the category back. One pass:
      - guide and scoop walls at about half their current height, in lacquered wood with capped ends;
      - ramp walls with 32 or more segments per curve, no break seam, and a metal entrance flap;
      - wireform cross-ties between the existing posts;
      - translucent, internally lit bumper bodies with a skirt (keep the chrome ring);
      - sling end caps without the two holes;
      - the SPA CITY decal visible on the flipper tops.
    - Test: `desktop/c05-tower` shows no stair-steps or seam and has a flap and ties. `desktop/c02-springs` shows a
      lit translucent body. `desktop/c03-flippers` shows the decal and no face-like holes.
11. **G-bumper-rings-light** (lighting, sev 3, M, WS3, +0.3)
    - Replace the opaque peach annuli with soft additive light on the playfield that decays within about 4 frames.
      Keep the cap flash and the sink.
    - Test: no frame of `strips/s02-bumpers` shows solid rings merging over the painting, and the art stays visible
      through the glow.
12. **G-multiball-launch-visible** (animation, sev 2, M, WS3, +0.3)
    - Stagger the lock ejects, each with a kick flash and a short camera shake, so every ball enters inside the
      strip window.
    - Test: at least two balls are visible in two or more frames of `strips/s03-multiball`, with a visible eject flash.

## Verdict

**Continue.** Eight of nine categories are below their gates. The measured perf and IP gates pass. The quickest
gains are the S fixes that the loop claimed but didn't land: mood dimming, label clearance, the help footer and the
Vapors sign. Landscape framing is the largest single gain in any category.

```json
{
  "loop": 3,
  "role": "judge",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "lower deco fan is composed around inserts, not empty terrazzo" },
      { "shot": "desktop/r03-play", "note": "backglass strong and in the same hand; flat disc/triangle inserts" },
      { "shot": "desktop/r02-serve", "note": "upper garden laid under bumpers/lanes; nothing leads to S-P-A, Reserve St or lock" },
      { "shot": "desktop/c01-row", "note": "brick terrace arcs behind Row and LOCK" } ] },
    "toys": { "score": 6.0, "confidence": 0.8, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight distinct façades at 7 standard" },
      { "shot": "desktop/c05-tower", "note": "good lattice tower; stair-stepped ramp walls, seam, no flap; posts present, no ties" },
      { "shot": "desktop/c04-vapors", "note": "matte olive tubes with overlapping end caps; tall navy slab walls" },
      { "shot": "desktop/c02-springs", "note": "chrome base ring present; peach spool body" },
      { "shot": "desktop/c03-flippers", "note": "red rubber band present; no decal; two black holes in sling ends" },
      { "shot": "desktop/r04-bumpers", "note": "ball renders as glassy puck with dark cross" } ] },
    "lighting": { "score": 6.0, "confidence": 0.8, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "judge-measured playfield luma 87.5 vs 77.5 in r03: wizard brighter, not dimmed" },
      { "shot": "desktop/r03-play", "note": "warm GI, bloom only on lit lamps, blue flare gone" },
      { "shot": "strips/s02-bumpers", "note": "opaque peach rings merge into one blob frames 2-4" },
      { "shot": "desktop/c02-springs", "note": "hot white specular blobs on bumper bases" } ] },
    "animation": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "strips/s01-flip", "note": "snap between frames 2-3, ball leaves cleanly; no rebound/trail/camera" },
      { "shot": "strips/s02-bumpers", "note": "caps flash f0-4 then dark; rings expand and fade; steam is dot sprites" },
      { "shot": "strips/s03-multiball", "note": "real lamp sequence; only one ball ever visible, no launch" } ] },
    "ui": { "score": 6.5, "confidence": 0.8, "evidence": [
      { "shot": "mobile/r07-mode", "note": "horse silhouette DMD with character; objective cut 'ORBI'" },
      { "shot": "desktop/r08-wizard", "note": "valley silhouette; objective cut 'L SHOTS LIT'" },
      { "shot": "mobile/r09-help", "note": "last bullet runs under pinned Back" },
      { "shot": "mobile/r11-landscape", "note": "score shown in both DMD and HUD" },
      { "shot": "desktop/r01-title", "note": "tidy deco card over fully blurred demo" } ] },
    "typography": { "score": 6.0, "confidence": 0.8, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "Vapors blade texture flipped: mirror text" },
      { "shot": "mobile/r02-serve", "note": "COASTER insert covers the N of MOUNTAIN TOWER" },
      { "shot": "desktop/c01-row", "note": "crisp plates at close range; Vapors blade hides SUPERIOR" },
      { "shot": "desktop/r01-title", "note": "deliberate neon slab display face" },
      { "shot": "desktop/r03-play", "note": "most playfield labels ~5 px at player camera" } ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r02-serve", "note": "only lane A lit, matching DMD; no bloom halo" },
      { "shot": "desktop/r04-bumpers", "note": "ball findable but glassy; bumper speculars act as ball decoys" },
      { "shot": "desktop/r08-wizard", "note": "five colour-coded arrows glow at their entrances" },
      { "shot": "desktop/c03-flippers", "note": "no inlane/outlane inserts" } ] },
    "mobile": { "score": 5.5, "confidence": 0.8, "evidence": [
      { "shot": "mobile/r02-serve", "note": "portrait framed on purpose: full-width DMD, progress chip, whole table" },
      { "shot": "mobile/r11-landscape", "note": "nothing above SPA CITY logo visible; score duplicated" },
      { "shot": "mobile/r09-help", "note": "text under Back" },
      { "shot": "mobile/r07-mode", "note": "chip swaps to score during callout; menu button over apron card" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses named and in order; Quapaw dome, Ozark towers" },
      { "shot": "desktop/c05-tower", "note": "lattice observation tower" },
      { "shot": "desktop/c02-springs", "note": "143 F spring caps with steam" },
      { "shot": "desktop/c04-vapors", "note": "Vapors a white box with mirror-text sign" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball name, logo or art; no text in backglass or playfield paintings. Arlington and Vapors appear by name and generic model only; the flipped Vapors blade is 3D sign lettering, not painting text. Keep the repaired sign generic." },
  "gaps": [
    { "id": "G-landscape-full-table", "category": "mobile", "expectedGain": 1.0, "severity": 5, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Fit the whole playfield (top arch to apron) into 844x390 via full-height fit or tilted camera; HUD column takes leftover width; show the score once (also in the desktop idle DMD). Test: bumpers, S-P-A lanes, Row, both scoops, ramp entrance and flippers all visible in r11 and 1,234,560 appears once." },
    { "id": "G-mood-inverted", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard"], "fix": "Make mode/multiball/wizard blends scale ambient, key and fill down instead of up; let lit inserts and arrows carry light. Test: mean greyscale over x460-820,y30-740 in r08 at least 25% below r03 (now 87.5 vs 77.5), r06/r07 at least 10% below r03." },
    { "id": "G-dmd-objective-static", "category": "ui", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["mobile/r07-mode", "desktop/r08-wizard", "desktop/r06-multiball"], "fix": "Show a complete short objective statically beside the silhouette (shorten or wrap to two lines), as the previous build did; scroll only extra detail. Test: no word cut at the DMD edge in r06, r07, r08 on both viewports." },
    { "id": "G-label-collisions", "category": "typography", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["mobile/r02-serve", "desktop/r08-wizard", "desktop/c04-vapors"], "fix": "Add a layout check failing when any label plate box intersects an insert, arrow, rail or toy; move MOUNTAIN TOWER clear of the COASTER insert (the real cause), keep the pink arrow off the BATHHOUSE ROW sub-line, pull THE VAPORS plate from under the scoop rail. Test: zero overlaps; plate unbroken in mobile/r02-serve." },
    { "id": "G-ui-overlaps", "category": "ui", "expectedGain": 0.35, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["mobile/r09-help", "mobile/r02-serve"], "fix": "Help body becomes a scroll container ending above Back with bottom padding >= button height + 16 px; inset apron card text or fold the menu/Launch buttons into blank apron panels. Test: no glyph under Back in r09 on both viewports; no button over card text in any phone frame." },
    { "id": "G-vapors-sign", "category": "typography", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Fix the flipped UV/flipY on the blade texture, turn the sign to read toward the player camera, and move or shorten it so it no longer hides the SUPERIOR plate; keep lettering generic. Test: VAPORS reads correctly in a 3x crop of c04; SUPERIOR and HALE fully visible in c01." },
    { "id": "G-skill-shot-bloom", "category": "readability", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Target lane already ~1.9x its neighbours: add a bloom halo and 2-3 Hz flash, drop unlit lanes to <=15% emissive. Test: exactly one S-P-A lamp shows a bloom halo in r02 on both viewports." },
    { "id": "G-rail-brass-material", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Brass albedo ~#C9A24A, metalness 1, roughness ~0.3 with brushed normal; sweep each guide as one tube along its spline with mitred corners and no exposed end caps. Test: no overlapping caps in c04/c06 and a specular streak along every rail." },
    { "id": "G-ball-chrome", "category": "toys", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r04-bumpers", "strips/s01-flip", "desktop/c02-springs"], "fix": "Opaque metal ball (metalness 1, roughness ~0.1) with playfield-derived env map, dark Fresnel rim and contact shadow, no cross artefact; halve size/intensity of bumper-base specular points so they stop reading as balls. Test: 3x crop of r04 shows an opaque mirrored ball with dark rim, no cross, and no bumper highlight matching it in size and value." },
    { "id": "G-hardware-construction", "category": "toys", "expectedGain": 0.75, "severity": 4, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c05-tower", "desktop/c04-vapors", "desktop/c02-springs", "desktop/c03-flippers"], "fix": "Big lever. One hardware pass: guide/scoop walls ~half height in lacquered wood with capped ends; ramp walls >=32 segments per curve, no break seam, metal entrance flap; wireform cross-ties between existing posts; translucent internally lit bumper bodies with skirt (keep chrome ring); sling end caps without the two holes; SPA CITY decal visible on flipper tops. Test: c05 shows no stair-steps or seam, a flap and ties; c02 shows lit translucent bodies; c03 shows the decal and no face-like holes." },
    { "id": "G-bumper-rings-light", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers"], "fix": "Replace opaque peach annuli with soft additive playfield light decaying within ~4 frames; keep cap flash and sink. Test: no frame of s02 shows solid rings merging over the painting; art visible through the glow." },
    { "id": "G-multiball-launch-visible", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s03-multiball"], "fix": "Stagger lock ejects with a kick flash and short camera shake so every ball enters within the strip window. Test: at least two balls visible in two or more frames of s03, plus a visible eject flash." }
  ],
  "verdict": "continue"
}
```

# Judge: loop 2

Inputs: critic-claude (Critic A, 53.0), critic-codex (Critic B, 59.0), prosecutor (51.5), advocate (58.5), gates.json
(perf pass, IP pass), CHANGES.md. HISTORY.md used for trend only. All capture paths are relative to
`games/Pinball/screenshots/review-loop-2/`. No critic pair differs by more than 1.0 in any category, and no
prosecutor/advocate pair differs by more than 1.0. Several pairs differ by exactly 1.0, though, and the advocate and
prosecutor each raised factual claims the other side denies. I opened the full captures and zoomed crops for all of
those and rule on each below.

**Final total: 54.0 / 90. Verdict: continue.** Toys (5.0), lighting (5.5), animation, UI, typography and
readability (6.0 each), plus art and mobile (6.5) are all under their gates of 7. Authenticity (6.5) meets its gate of 6.

## Factual disputes, checked by eye

| Claim | Who said it | Capture checked | Ruling |
|---|---|---|---|
| The flippers have no taper | Critic A; the advocate denies it | `desktop/c03-flippers` | **Advocate is right.** Both bats taper from a broad pivot with a chrome cap to a rounded tip, with a red rubber band along the edge. They are still plain white with no decal or bevel. |
| The bumper bodies are matte skin-coloured plastic | Critic A; the advocate says peach is the lit state | `strips/s02-bumpers` | **Advocate mostly right.** In frames 5–7 the right bumper's skirt goes dark and chrome while the others stay peach, so peach is the lit state. Even lit, it reads as opaque and not translucent. Minor issue. |
| HALE is hidden by the kicker | Critic A; the advocate and prosecutor say it is Superior | `desktop/c01-row`, zoomed | **Advocate and prosecutor are right.** HALE is fully legible. The label to its left (Superior) is cut to "…C" by the Vapors sign housing. |
| The Vapors neon reads "VAPORS" | Advocate; the prosecutor says the glyphs are mirrored | `desktop/c04-vapors`, `desktop/c01-row`, both zoomed 3–4× | **Prosecutor is right.** Read top to bottom, the tube shows "2ЯOb…" with the S drawn as a mirrored "2" and the P flipped to "b". In neither close-up does it read as VAPORS. It is a texture orientation bug, and it hurts the landmark the scoop is named for. |
| The ramp rails are sawtoothed | Prosecutor only | `desktop/c05-tower` | **Prosecutor is right.** Both rails step in offset segments down their whole length. The floor has a hard seam halfway down, and the gold wall shows through the floor. |
| The wireform is emissive lines rather than chrome | Critic A and the prosecutor; the advocate and Critic B say chrome | `desktop/c05-tower` | **Split.** The tubes have a cylindrical shade and a white specular core, but a heavy blue halo swamps them, so at play scale they read as neon. |
| Multiball tints the room | Advocate; Critic A says it doesn't | `strips/s03-multiball` | **Partly true.** Frames 4–6 add a purple cast to the lower field, but it is the spill from the lit arc inserts, not a change of fill or key light. |
| The mode and wizard stills show no change of mood | Critic A and the prosecutor (measured); the advocate concedes | `desktop/r08-wizard` vs `desktop/r03-play` | **Confirmed.** The two frames are almost identical in key and fill. In the wizard still the six arc inserts sit at the same unlit purple as in `r03-play`'s unlit inserts, and the shot arrows are dark while the DMD says "ALL SHOTS LIT". |
| The lit skill-shot lane can't be told apart | Critic A and the prosecutor; the advocate concedes | `desktop/r02-serve`, zoomed 4× | **Confirmed.** Lamp A is only a shade lighter ochre than S and P, with no bloom. |
| The ball is lost on the ramp and over foliage | Critic A and Critic B; the advocate denies it | `desktop/r05-ramp`, zoomed 2×; `desktop/r04-bumpers`, zoomed 2× | **Advocate is right.** In both crops the ball's dark horizon band and highlight separate it cleanly. It is small (about 8 px on desktop) but it isn't lost. |
| The lower terrazzo field is empty | Critic A; the advocate says it is a designed fan | `desktop/c03-flippers`, `mobile/r03-play` | **Advocate mostly right.** Red and blue petals, arch bands and the star form a designed figure that points up-field. Nothing in it is keyed to the lit shots, though. |
| The help dialog overflows | Both critics; the prosecutor adds that the right column is empty | `desktop/r09-help` | **Confirmed, prosecutor's version.** The right column is about 40% empty below "About", while the left column's last bullet ghosts under the pinned Back bar. A cyan browser focus ring also sits on the gold button. |
| The phone landscape view crops the upper field | Critic A and the prosecutor; the advocate says that is by design | `mobile/r11-landscape` | **Both partly right.** The ball sits just above the right sling, and the frame cuts at the SPA CITY logo, so the bumpers, the Row, the lock and the ramp entrance are all off-screen. Following the low ball is designed, but it leaves the player blind to the targets. The side panel is about 60% empty. |

## Rulings by category

### Art: 6.5 (critics 6.5 / 7; prosecutor 6.0, advocate 7.0)
One continuous painting is now composed over the layout. The cascade and spring house sit under the bumpers, the
promenade wall sits behind the banks, and the terrazzo fan resolves between the flippers (`desktop/c02-springs`,
`desktop/c03-flippers`, `ab/desktop-r03-play`). The backglass is by the same hand (`desktop/r03-play`). The anchor
for 7 also asks for "inserts and lettering integrated", and the vector overlays were laid on without a layout pass:
- "THE VAPORS" runs into the SPA CITY logo, so only "RS" shows (`desktop/c04-vapors`).
- Superior is clipped by the Vapors housing (`desktop/c01-row`).
- The Mountain Tower arrow sits on its own label (`mobile/r03-play`, `mobile/r11-landscape`).

The upper field is also even foliage noise at table scale (`desktop/r03-play`). The advocate is right that the fan is
designed, so the prosecutor's 6.0 is too low. The collisions keep this off 7.

### Toys: 5.0 (critics 5.0 / 5.5; prosecutor 5.0, advocate 5.5)
This matches the anchor for 5 almost word for word: "recognisable models in flat materials; rails and walls read as
… blocks".
- The walls and guides are unbevelled black extrusions with flat ochre caps and white half-moon post rubbers
  (`desktop/c04-vapors`, `desktop/c06-arlington`).
- The ramp has sawtoothed segment rails, a floor seam and a wall showing through it (`desktop/c05-tower`).
- The slingshots are plastic triangles on white blocks with no rubber ring (`desktop/c03-flippers`).
- The bathhouses are small and flat-shaded. Their rooflines differ somewhat (dome, gables, twin towers), as the
  advocate says, but the façades are interchangeable (`desktop/c01-row`).

On the credit side: the advocate's corrections about the flippers and bumpers hold, the Mountain Tower lattice is
the best toy on the table (`desktop/c05-tower`), and the chrome ball is good. That is not enough to lift the score
over the walls and the newly found ramp defect.

### Lighting: 5.5 (critics 5.5 / 6.0; prosecutor 5.0, advocate 6.0)
Inserts bloom only where lit (2X and 3X glow, 4X and 5X stay dark), and warm GI lifts the lower field
(`desktop/c03-flippers`). Bumper flashes spill onto the art (`strips/s02-bumpers`). The ball has a convincing chrome
reflection with a horizon band. Against that, three things count:
- A blue-white glare blob about 200 px across sits over the left field (`desktop/c06-arlington`).
- The white rings at the bumper bases are hot (`desktop/c02-springs`).
- The bathhouses, the Arlington and the tower barely cast contact shadows (`desktop/c01-row`, `desktop/c05-tower`).

The promised mode, multiball and wizard lighting does not show in the stills (`desktop/r08-wizard` vs
`desktop/r03-play`; prosecutor's measurement uncontested). The multiball purple is lamp spill
(`strips/s03-multiball`). The bloom discipline lifts this above the prosecutor's 5.0. The glare and the flat moods
cap it below 6.

### Animation: 6.0 (critics 5.5 / 6.5; prosecutor 5.5, advocate 6.5)
The strips show:
- The left flipper snaps between frames 2 and 3 and the ball leaves cleanly (`strips/s01-flip`).
- Bumper caps and skirts flash, decay and light the art; steam drifts (`strips/s02-bumpers`).
- Multiball runs a Row cascade, a purple arc chase, a flash on the flipper-zone inserts and a camera pan
  (`strips/s03-multiball`).

There is no mechanical travel, no ring drop and no anticipation or follow-through. No strip shows a sling contact.
The advocate is right that the missing sling is a coverage gap rather than proof the effect is absent, but the rubric
scores only what the captures show. The midpoint stands: more than the anchor for 5's "little else reacts", less
than the anchor for 7.

### UI: 6.0 (critics 6.0 / 7.0; prosecutor 6.0, advocate 6.5)
The menus share one tidy gold-and-navy deco frame, and the title hint is fixed (`desktop/r01-title`). Each state
has its own DMD objective, and the desktop panel shows progress (`desktop/r07-mode`, `desktop/r03-play`). Against
the anchor for 7, three things fall short:
- The DMD's picture panel is dithered noise in every mode frame, and the wizard text wraps to an orphaned
  "• 60 SECONDS" (`desktop/r08-wizard`).
- The help dialog overflows under Back while its right column sits empty (`desktop/r09-help`, `mobile/r09-help`).
- The score shows twice on the phone (`mobile/r03-play`).

Critic B's 7 does not survive the overlap and the noise panels.

### Typography: 6.0 (critics 6.0 / 6.5; prosecutor 6.0, advocate 6.5)
The slab-serif display lockup and headings are deliberate, and the desktop DMD digits are clean (`desktop/r01-title`,
`desktop/r09-help`, `desktop/r03-play`). At play scale the inserts, apron cards and "SHOOT AGAIN" are smudges a few
pixels high (`desktop/r03-play`, `mobile/r03-play`). The label collisions and the mirrored Vapors neon count here
too (`desktop/c01-row`, `desktop/c04-vapors`). The phone DMD's four lines of type are cramped (`mobile/r07-mode`).
6.0.

### Readability: 6.0 (critics 6.0 / 6.0; prosecutor 5.5, advocate 6.5)
The ball reads wherever it was captured, including on the ramp and over the foliage (`desktop/r05-ramp`,
`desktop/r04-bumpers`). All three multiball balls are findable (`desktop/r06-multiball`, `mobile/r06-multiball`).
Lit and unlit inserts differ clearly (`desktop/c03-flippers`). The lamp language fails twice:
- The lit skill-shot lane can't be told from the unlit ones (`desktop/r02-serve`), even though the help screen calls
  it "flashing".
- In the wizard the DMD says "ALL SHOTS LIT" while the shot arrows and the arc are dark (`desktop/r08-wizard`).

The two cancel out against the ball's good separation, so the critics' agreed 6.0 holds.

### Mobile: 6.5 (critics 6.0 / 7.0; prosecutor 6.0, advocate 7.0)
Portrait fills the width on purpose, and Launch never covers the ball's area (`mobile/r03-play`,
`mobile/r02-serve`). Landscape is several times larger than last build's (`ab/mobile-r11-landscape`) and keeps the
flippers framed. Three things fall short:
- In landscape the targets are out of view while the ball is mid-field, and the side panel is mostly empty
  (`mobile/r11-landscape`).
- The portrait DMD regressed to about half width with four cramped lines (`ab/mobile-r07-mode`, `mobile/r07-mode`).
- The score is duplicated, and the chip touches the arch rail (`mobile/r03-play`).

This is better than "works but cramped", but the anchor for 7 asks for portrait and landscape both framed on
purpose with a readable DMD, and that isn't met yet.

### Authenticity: 6.5 (critics 6.5 / 7.5; prosecutor 6.5, advocate 7.0)
The eight bathhouses are named in order, the help copy hedges its facts, and the twin-towered Arlington, the lattice
Mountain Tower, the tufa cascade and the magnolia backglass are specifically local (`desktop/c01-row`,
`desktop/r09-help`, `desktop/c06-arlington`, `desktop/c05-tower`, `desktop/c02-springs`). Two things fall short:
- The Vapors neon is mirrored and illegible (`desktop/c04-vapors`). The advocate was wrong to call it readable.
- Superior's label is occluded, and most façades are told apart only by their labels (`desktop/c01-row`).

Critic B's 7.5 is not supported. It meets the gate of 6.

## IP
All four reviewers report clean. I checked the backglass neon at right (`desktop/r03-play`) and the playfield
painting (`desktop/c01-row`, `desktop/c02-springs`): there is no legible text in either painting, every word on the
playfield is a vector overlay, and there is no commercial machine name, logo or trade dress. The mirrored Vapors
glyphs belong to a modelled sign texture, not a painting, and name a historic landmark used as setting. **Clean. No
IP gap.**

## Ranked gaps (merged; ranked by expected gain ÷ effort)
1. **G-lamp-truth** (readability, WS1, sev 4, S, +0.75). Merges the prosecutor's skill-shot and wizard-lamp gaps and
   the lane half of Critic A's G-desktop-framing. Fix: flash the lit skill lane at about 4 Hz with bloom and drop the
   unlit lanes to 40%. While the wizard DMD says "ALL SHOTS LIT", flash every shot arrow and keep the arc chasing,
   never all dark. Test: in `desktop/r02-serve` the lit lane's lamp has at least 2× the luminance of S and P, and in
   `desktop/r08-wizard` every shot arrow is lit.
2. **G-mobile-dmd** (mobile, WS6, sev 3, S, +0.5). Merges Critic A's G-mobile-dmd, part of Critic B's
   G-phone-type-scale, and the landscape panel findings. Fix: restore a phone DMD at least 300 css px wide. Move the
   "Modes · Tower" text into the score chip and drop the duplicated chip score. Fill the empty landscape side panel
   with the progress text and a mini lamp map of the off-screen shots. Test: `mobile/r07-mode` DMD is at least 300 css
   px wide, `mobile/r03-play` shows the score once, and `mobile/r11-landscape` has no panel region more than 50% empty.
3. **G-label-layout-pass** (art, WS4, sev 3, S, +0.5). Merges Critic A's G-label-collisions and the prosecutor's
   gap, with the cause corrected: Superior, not HALE. Fix: move the Superior label and insert clear of the Vapors
   housing, end "THE VAPORS" before the SPA CITY logo, move CENTRAL AVENUE off the spinner, and move the Mountain Tower
   arrow and lamps off their label. Test: in `desktop/s03-multiball-0`, `desktop/c01-row` and `desktop/c04-vapors`, no
   overlay letter is covered by a toy, a lamp or another label.
4. **G-insert-type** (typography, WS5, sev 3, S, +0.5). Fix: render insert, apron and playfield labels from a higher
   resolution texture (at least 2× the current size) with a minimum cap height of 7 device px at the play camera on
   both viewports. Replace the broken "SHOOT AGAIN" glyphs. Test: in `desktop/r03-play` and `mobile/r03-play`,
   "SHOOT AGAIN", "2X–5X" and the mode names read without zoom.
5. **G-vapors-sign** (authenticity, WS2, sev 3, S, +0.5). This is the prosecutor's gap, confirmed. Fix: correct the
   neon texture's UV mirroring and flip so that "VAPORS" reads top to bottom from the player camera, and scale the
   sign up about 2×. Test: "VAPORS" is legible in `desktop/c04-vapors` and `desktop/c01-row`.
6. **G-help-layout** (ui, WS5, sev 2, S, +0.25). Merges Critic B's G-help-footer-clearance and the prosecutor's
   G-help-columns. Fix: move "The table" bullets into the empty right column on desktop. On the phone, add bottom
   padding equal to the Back bar's height plus a fade-out scroll cue. Replace the cyan focus ring with a gold one.
   Test: no text under Back in `desktop/r09-help` or `mobile/r09-help`, and no cyan ring in `desktop/r01-title`.
7. **G-mode-light-delta** (lighting, WS1, sev 4, M, +0.75). Merges Critic A's G-mode-lighting and the prosecutor's
   measured version. Fix: give each mode and multiball a GI tint and drop the key light in the wizard so that the
   difference survives into the still frames. Test: over the playfield region (x 450–830, y 20–780), the mean
   luminance of `desktop/r08-wizard` is at least 20% below `desktop/r03-play`, and `desktop/r06-multiball` and
   `desktop/r07-mode` each move at least 10 levels on one channel (today the change is 3.4 levels at most).
8. **G-glare-grounding** (lighting, WS1, sev 4, M, +0.75). Merges Critic A's G-glare and Critic B's
   G-grounding-and-emission. Fix: remove the blue-white glare sprite over the left field, cap the bloom on the
   rollover lamps and the white bumper-base rings, and add a soft contact shadow (blob or AO decal) under every
   bathhouse, the Arlington, the tower, the Vapors and the bumpers. Test: `desktop/c06-arlington` has no glow larger
   than an insert, and a visible dark falloff sits under each toy in `desktop/c01-row` and `desktop/c05-tower`.
9. **G-dmd-art** (ui, WS5, sev 4, M, +0.75). Critic A's gap. Fix: replace the dithered noise panel with real 1-bit
   mode animations (a horse race, a tower climb, steam, the wizard's valley) and limit each screen to two text lines.
   Test: `desktop/r07-mode` and `desktop/r08-wizard` show a recognisable picture and at most two lines.
10. **G-hardware-pass** (toys, WS2, sev 5, L, +1.0). **This loop's big lever.** Merges Critic A's G-wall-materials
    and G-flipper-model with Critic B's G-hardware-construction. Fix: rebuild every wall and guide as a bevelled,
    rounded-top profile in lacquered wood or brushed metal with a running edge highlight. Add chrome bolt heads on the
    posts and real rubber rings with thickness around the slingshots and posts. Give the flippers a top decal and a
    translucent plastic look to the bumper skirts. The walls are the main thing holding toys at 5. Test: in
    `desktop/c04-vapors` and `desktop/c06-arlington` an edge highlight runs along every wall top and the bolt heads
    show, and in `desktop/c03-flippers` the sling rubber is visible.
11. **G-ramp-rebuild** (toys, WS2, sev 3, M, +0.5). Merges Critic A's G-ramp-wireform and the prosecutor's
    G-ramp-segments. Fix: sweep the ramp rails from one continuous profile, remove the floor seam, tint the floor so
    the wall below doesn't show through, add an entrance flap, and cut the wireform's blue halo to let the chrome
    shading read. Test: both rail edges are smooth and the wires show a specular highlight and a shadow in
    `desktop/c05-tower`.
12. **G-mech-reaction** (animation, WS3, sev 3, M, +0.5). Merges Critic A's G-sling-anim and Critic B's
    G-mechanical-reaction. Fix: make the bumper ring drop visibly for 2–3 frames on each hit, give the sling rubber a
    stretch pose with a plastic flash, and add a strip that captures a sling contact. Test: a strip frame shows the
    sling flash and stretch, and `strips/s02-bumpers` shows the ring down in at least one frame.

Dropped or held back:
- Critic A's G-bathhouse-models (L): only one L is allowed, and authenticity already meets its gate.
- Critic B's G-ball-separation: the ball separates on the ramp and over the foliage (see the disputes table).
- Critic A's G-lower-field: the fan is already designed; it is a low-value follow-up.
- Critic A's G-desktop-framing: the table width is set by the portrait aspect; the lane half is merged into gap 1.

```json
{
  "loop": 2,
  "role": "judge",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "continuous painting; terrazzo fan is a designed figure pointing up-field" },
      { "shot": "desktop/c02-springs", "note": "cascade and spring house composed under the bumpers; painting holds up close" },
      { "shot": "desktop/c04-vapors", "note": "THE VAPORS label runs into the SPA CITY logo" },
      { "shot": "desktop/c01-row", "note": "Superior label clipped by the Vapors housing" },
      { "shot": "desktop/r03-play", "note": "backglass in the same hand; upper field is even foliage noise at table scale" }
    ] },
    "toys": { "score": 5.0, "confidence": 0.8, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "unbevelled black box walls, flat ochre caps, half-moon post rubbers" },
      { "shot": "desktop/c05-tower", "note": "ramp rails sawtoothed in segments, floor seam, wall shows through; tower lattice good" },
      { "shot": "desktop/c03-flippers", "note": "flippers taper (Critic A wrong) but plain; slings have no rubber" },
      { "shot": "desktop/c01-row", "note": "small flat-shaded bathhouses; rooflines differ somewhat, facades interchangeable" }
    ] },
    "lighting": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c06-arlington", "note": "~200 px blue-white glare blob; weak contact shadows" },
      { "shot": "desktop/r08-wizard", "note": "no mood change against r03-play; arc inserts unlit in the still" },
      { "shot": "desktop/c03-flippers", "note": "inserts bloom only where lit; warm GI; chrome ball with horizon band" },
      { "shot": "strips/s03-multiball", "note": "purple cast is lamp spill from the arc, not a fill change" }
    ] },
    "animation": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps between frames 2 and 3; no lamp or sling reaction" },
      { "shot": "strips/s02-bumpers", "note": "cap and skirt flash, decay and light spill; no ring travel" },
      { "shot": "strips/s03-multiball", "note": "Row cascade, arc chase, camera pan" }
    ] },
    "ui": { "score": 6.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r01-title", "note": "tidy deco menu, hint fixed; cyan focus ring off palette" },
      { "shot": "desktop/r08-wizard", "note": "DMD picture panel is dithered noise; orphaned '• 60 SECONDS'" },
      { "shot": "desktop/r09-help", "note": "left column overflows under Back while right column is empty" },
      { "shot": "mobile/r03-play", "note": "score duplicated in DMD and chip" }
    ] },
    "typography": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate slab display lockup" },
      { "shot": "desktop/r03-play", "note": "insert, apron and SHOOT AGAIN lettering smudged at play scale" },
      { "shot": "desktop/c04-vapors", "note": "mirrored Vapors neon glyphs; label collision with logo" },
      { "shot": "mobile/r07-mode", "note": "cramped four-line phone DMD" }
    ] },
    "readability": { "score": 6.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r05-ramp", "note": "ramp ball separated by dark band and highlight (advocate right)" },
      { "shot": "desktop/r02-serve", "note": "lit skill lane A barely differs from S and P" },
      { "shot": "desktop/r08-wizard", "note": "DMD says ALL SHOTS LIT while arrows and arc are dark" },
      { "shot": "mobile/r06-multiball", "note": "all three balls findable" }
    ] },
    "mobile": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait framed to width; Launch clear of the ball; score duplicated" },
      { "shot": "mobile/r11-landscape", "note": "large lower field, but bumpers, Row, lock and ramp entrance off-screen; panel mostly empty" },
      { "shot": "ab/mobile-r07-mode", "note": "portrait DMD shrank to about half width this loop" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses named in order; Superior occluded; facades told apart by labels" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington recognisable" },
      { "shot": "desktop/c04-vapors", "note": "Vapors neon mirrored and illegible (advocate wrong)" },
      { "shot": "desktop/r09-help", "note": "facts hedged" }
    ] }
  },
  "ip": { "clean": true, "notes": "All four reviewers report clean; judge checked the backglass neon (desktop/r03-play) and playfield painting (desktop/c01-row, desktop/c02-springs): no text in the paintings, no commercial machine names, logos or art. Mirrored Vapors glyphs are a modelled sign texture naming a historic landmark." },
  "gaps": [
    { "id": "G-lamp-truth", "category": "readability", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "desktop/r08-wizard", "mobile/r02-serve"], "fix": "Flash the lit skill lane at ~4 Hz with bloom and drop unlit lanes to 40%; while the wizard DMD says ALL SHOTS LIT, flash every shot arrow and keep the arc chasing. Test: lit lane lamp >= 2x the luminance of the others in desktop/r02-serve; every shot arrow lit in desktop/r08-wizard." },
    { "id": "G-mobile-dmd", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["ab/mobile-r07-mode", "mobile/r07-mode", "mobile/r03-play", "mobile/r11-landscape"], "fix": "Restore a phone DMD >= 300 css px wide; move Modes/Tower text into the score chip and drop the duplicated score; fill the landscape side panel with progress and a mini lamp map of off-screen shots. Test: DMD >= 300 css px in mobile/r07-mode, score shown once in mobile/r03-play, no landscape panel region more than 50% empty." },
    { "id": "G-label-layout-pass", "category": "art", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c01-row", "desktop/c04-vapors", "desktop/s03-multiball-0", "mobile/r03-play"], "fix": "Move the Superior label and insert clear of the Vapors housing, end THE VAPORS before the SPA CITY logo, move CENTRAL AVENUE off the spinner and the Mountain Tower arrow and lamps off their label. Test: no overlay letter covered by a toy, lamp or label in desktop/s03-multiball-0, desktop/c01-row, desktop/c04-vapors." },
    { "id": "G-insert-type", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r03-play", "mobile/r03-play"], "fix": "Render insert, apron and playfield labels from a texture at least 2x higher resolution with a minimum cap height of 7 device px at the play camera; fix the broken SHOOT AGAIN glyphs. Test: SHOOT AGAIN, 2X-5X and mode names read without zoom in desktop/r03-play and mobile/r03-play." },
    { "id": "G-vapors-sign", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Correct the Vapors neon texture's UV mirroring and flip so VAPORS reads top to bottom from the player camera; scale the sign ~2x. Test: VAPORS legible in desktop/c04-vapors and desktop/c01-row." },
    { "id": "G-help-layout", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help", "desktop/r01-title"], "fix": "Move The table bullets into the empty right column on desktop; on the phone, add bottom padding equal to the Back bar plus a fade scroll cue; replace the cyan focus ring with a gold one. Test: no text under Back in desktop/r09-help or mobile/r09-help; no cyan ring in desktop/r01-title." },
    { "id": "G-mode-light-delta", "category": "lighting", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard"], "fix": "Per-mode and multiball GI tint and a wizard key-light dip that survive into stills. Test: playfield region (x450-830, y20-780) mean luminance of desktop/r08-wizard at least 20% below desktop/r03-play; r06/r07 shifted 10+ levels on one channel (today the shift is 3.4 levels at most)." },
    { "id": "G-glare-grounding", "category": "lighting", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c06-arlington", "desktop/c02-springs", "desktop/c01-row", "desktop/c05-tower"], "fix": "Remove the blue-white glare sprite over the left field; cap bloom on rollover lamps and white bumper-base rings; add a soft contact shadow (blob or AO decal) under every bathhouse, the Arlington, tower, Vapors and bumpers. Test: no glow larger than an insert in desktop/c06-arlington; visible dark falloff under each toy in desktop/c01-row and desktop/c05-tower." },
    { "id": "G-dmd-art", "category": "ui", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r07-mode", "desktop/r08-wizard"], "fix": "Replace the dithered noise panel with real 1-bit mode animations (horse race, tower climb, steam, wizard valley) and at most two text lines per screen. Test: recognisable picture and at most two lines in desktop/r07-mode and desktop/r08-wizard." },
    { "id": "G-hardware-pass", "category": "toys", "expectedGain": 1.0, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c06-arlington", "desktop/c03-flippers"], "fix": "BIG LEVER. Rebuild every wall and guide as a bevelled rounded-top profile in lacquered wood or brushed metal with a running edge highlight; chrome bolt heads on posts; real rubber rings with thickness on slingshots and posts; flipper top decal; translucent bumper-skirt plastic. Test: edge highlight along every wall top and visible bolt heads in desktop/c04-vapors and desktop/c06-arlington; sling rubber visible in desktop/c03-flippers." },
    { "id": "G-ramp-rebuild", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower", "desktop/r05-ramp"], "fix": "Sweep the ramp rails from one continuous profile, remove the floor seam, tint the floor so the wall below doesn't show through, add an entrance flap, and cut the wireform's blue halo so the chrome shading reads. Test: smooth rail edges and wire specular plus shadow in desktop/c05-tower." },
    { "id": "G-mech-reaction", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s01-flip", "strips/s03-multiball"], "fix": "Make the bumper ring drop visibly for 2-3 frames per hit, add a sling rubber stretch pose with a plastic flash, and add a review strip that captures a sling contact. Test: a strip frame shows the sling flash and stretch; strips/s02-bumpers shows the ring down in at least one frame." }
  ],
  "verdict": "continue"
}
```

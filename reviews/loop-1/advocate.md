# Advocate: loop 1

All capture paths are relative to `games/Pinball/screenshots/review-loop-1/`. I opened every frame, close-up and strip the
critics cited, plus the A/B pairs `ab/desktop-c01-row`, `ab/desktop-r08-wizard` and `ab/mobile-r11-landscape`. I
made enlarged crops of the DMD in `desktop/r06-multiball`, `desktop/r07-mode` and `desktop/r08-wizard`, of the
playfield in `desktop/r03-play` against `desktop/r08-wizard`, and of the Vapors lane in `mobile/r03-play`.

## Summary

Most of the critics' defects are real and I concede them: the art-panel seams, the truncated bathhouse plates, the
crescent post rubbers, the slings with no rubber, the ramp kink, the glassy ball, the clipped title hint, the help
text running under Back, the DMD dither noise and the half-empty landscape. Critic A (critic-claude) does get several
facts wrong or overstated, and those errors pull his scores below what the captures show:

- He says wizard mode "looks almost the same as normal play". It doesn't: most of the shot lamps change.
- He says the ramp has "no real wireform". The wire return is there; what's wrong is its emissive material.
- He places the R04 ball "against white water". It sits against dark foliage.
- He says only "RS" of THE VAPORS shows. That's an occlusion from the close-up camera angle; at play distance the label reads in full.
- He calls the bumper caps opaque with no flash. Strip frame 1 shows a cap lighting from inside.
- He calls the bathhouses "interchangeable cream boxes". They have distinct rooflines.

Both critics also mark animation against the 9 anchor (anticipation and follow-through), when the strips show nearly
everything the 7 anchor lists. I propose small raises in lighting, animation, readability, toys and mobile, all
within ±1 of the critic mean, and hold or match the mean everywhere else.

Critic means: art 6.0, toys 5.5, lighting 6.0, animation 6.0, ui 6.0, typography 5.5, readability 6.0, mobile 5.75,
authenticity 6.5. Critic A totals 51.5 and Critic B (critic-codex) 55.0, a mean of 53.25.

## Facts the critics got plainly wrong

1. **Wizard "looks the same as normal play" (Critic A, lighting and readability).** In `desktop/r08-wizard` against
   `desktop/r03-play`, these are lit in R08 and only partly lit in R03: all eight Bathhouse Row inserts (R03 has
   about four), all three LOCK lamps (R03 has one), all four multiplier arrows 2X to 5X (R03 has two), all three
   S·P·A lanes (R03 has two), the blue Central Avenue lamps (unlit in R03) and the white Vapors star (grey in R03).
   He is right that the purple mode arc stays dim and that the GI colour doesn't shift. He is wrong that "nothing
   changes" and that the lamps contradict the DMD for every shot.
2. **"No real wireform" (Critic A, toys).** `desktop/c05-tower` shows a wire return: thin parallel cylindrical rails
   running down the right side, bending at their ends near the bottom right (x≈940 to 1130, y≈560 to 800). The defect
   is that they render emissive blue-white, so they read as neon. The wireform isn't missing.
3. **R04 ball "near the S lane... a pale speck against white water" (Critic A, readability).** In
   `desktop/r04-bumpers` the ball sits at about (596, 75): upper left, inside the arch, above the left bumper,
   against dark green foliage. The S lane is at x≈705 and the white water is to the right. At full size the ball
   reads as a silver sphere with a highlight.
4. **"THE VAPORS... only RS showing" (Critic A, art and typography).** That's what you get from the low close-up
   angle of `desktop/c04-vapors`, where the scoop's wall hides the vertical label. In `mobile/r03-play` and
   `desktop/r03-play` the whole label "THE VAPORS" reads vertically along the scoop's right wall. Only its last
   letter touches the SPA CITY logo.
5. **Bumper caps "opaque", "no lamp flash on the playfield" (Critic A, toys and animation).** In
   `desktop/s02-bumpers-1` the struck upper-right bumper's cap glows green-white from inside, its body is lit orange,
   and warm spill lights the art around the lower bumpers. In `desktop/s02-bumpers-6` the same bumper is dark. The
   effect is weak, but it's there.
6. **Bathhouses are "interchangeable cream boxes" (Critic A, toys and authenticity).** `desktop/c01-row` shows
   different silhouettes and accents: teal and green roofs (Superior, Maurice), red roofs, a red-turreted front
   (Fordyce position), Quapaw's tiled dome, Ozark's twin white towers, Buckstaff's flat columned front and Lamar's red
   trim. They're simple, but they aren't interchangeable. Critic B's "eight differentiated facades" is accurate.
7. **"Four-line DMD crammed edge to edge" (Critic A, ui).** In the enlarged `desktop/r06-multiball` and
   `desktop/r07-mode` DMDs, the text fills about 60% of the text area's width, with a clear margin on the right. The
   title is in a brighter tone and the objective is dimmer: a two-level hierarchy neither critic credits.
8. **"These strips cannot establish... nudge response" (Critic B, animation).** `strips/s03-multiball` shows the
   camera moving sideways across the frames. The table is offset left in frame 0, recentres in frames 1 to 3 and
   drifts again later. This is a camera reacting to an event. Critic A credits it; Critic B doesn't.

## Category by category

### Art: critics 5.5 / 6.5, mean 6.0. Proposed 6.0

- **Concede:** there are seams. `desktop/c01-row` has a straight luminance step across the field at y≈285, above
  the lock, and a hard edge at y≈600 where the hex floor meets the garden painting. `desktop/s02-bumpers-1` has the
  waterfall-to-hex-tile line at y≈630. In `desktop/c03-flippers` the fan painting stops on a straight line at y≈215,
  leaving dark navy with faint rays below it. These are the rubric's "rectangles" at 5.
- **Rebut in part:** Critic A's "Layout collision: THE VAPORS hidden" is a close-up occlusion (fact 4). His lower
  field isn't simply "empty dark space" either. `desktop/r03-play` shows the deco fan with coloured petals, the mode
  arc, the SPA CITY logo plate and a garden band with a bench, all painted. The empty part is the strip from the
  insert row to the apron. The backglass in `desktop/r03-play` (left panel) is the strongest asset on screen, and
  Critic B weighs it properly. The mean is fair.

### Toys: critics 5.5 / 5.5, mean 5.5. Proposed 6.0

- **Concede:** in `desktop/c04-vapors` and `desktop/c06-arlington`, the post rubbers render as two white crescents.
  The slingshots in `desktop/c03-flippers` show no rubber band. The ramp in `desktop/c05-tower` has a kink at y≈520
  and flat panels. The ball in `desktop/s02-bumpers-1` is glassy rather than chrome. The "143°F" decal reads upside
  down to the player in `desktop/c02-springs`.
- **Rebut:** the wireform exists (fact 2). The flippers in `desktop/c03-flippers` aren't bare: a red band runs round
  the whole perimeter where the rubber sits, and the steel pivot caps are visible. Critic B's "weak differentiation"
  is fair; Critic A's "plain white extrusions" undersells it. The caps flash from inside (fact 5).
- **Missed by both:** every landmark the rubric's 7 anchor names now reads at a glance:
  - the Mountain Tower, with lattice legs, an octagonal lit cab and an antenna (`desktop/c05-tower`);
  - the twin-towered Arlington with red roofs and lit windows (`desktop/c06-arlington`);
  - the Vapors building with its teal glow and vertical sign (`desktop/c04-vapors`);
  - the bathhouse silhouettes (fact 6).

  That half of the 7 anchor is met, while the "convincing ramp and chrome ball" half isn't. That puts toys
  between 5 and 7, not on 5.5.

### Lighting: critics 6.0 / 6.0, mean 6.0. Proposed 6.5

- **Concede:** there are no GI pools under the slings or arch in `desktop/r03-play`. In `desktop/c02-springs` and
  `desktop/c06-arlington`, a blue wash covers the upper left and the bumper base rings carry white hotspots. The
  bathhouses in `desktop/c01-row` have almost no contact shadow. Wizard has no mood shift.
- **Rebut:** the wizard frame does change the lamp state across most shots (fact 1). The light show is real.
  `strips/s03-multiball` frames 4 to 6 light the whole purple mode arc, the Vapors star, the Row inserts and the
  Central Avenue lamps in sequence, then drop them in frame 7.
- **Missed:** contact shadows aren't "barely visible" everywhere. In `strips/s01-flip` frames 3 to 7, a soft dark
  shadow follows the raised left flipper. Bloom stays on lit inserts only: `desktop/c03-flippers` shows 2X and 3X
  glowing while 4X and 5X stay flat brass. That meets the first clause of the 7 anchor.
- Half a point above the mean is supported. "Soft shadows ground every toy" isn't met, so I don't propose 7.

### Animation: critics 6.0 / 6.0, mean 6.0. Proposed 6.5

The 7 anchor lists five things. The strips show four, and part of the fifth:

| 7-anchor item | Shown? | Evidence |
|---|---|---|
| Flippers snap | Yes | `strips/s01-flip`: down in frames 0 to 2, fully up in frame 3, ball released cleanly up the field in frames 4 to 7 |
| Bumpers flash and drop | Flash, but no drop | `strips/s02-bumpers`: bodies lit orange in frames 0 to 4, decaying to dark in 5 to 7; no skirt or ring motion |
| Steam rises | Yes | `strips/s02-bumpers`: steam puffs drift upward |
| Light shows run | Yes | `strips/s03-multiball`: sequenced chase |
| Camera reacts | Yes | `strips/s03-multiball`: sideways camera move (fact 8) |

- **Concede:** nothing mechanical recoils, and there's no anticipation, smear or follow-through.
- Both critics then score 6, apparently marking down for the 9 anchor's "anticipation and follow-through". The missing
  bumper drop is a real hole, which is why I propose 6.5 and not 7.

### UI, DMD and HUD: critics 5.5 / 6.5, mean 6.0. Proposed 6.0

- **Concede:**
  - The title hint is clipped through its glyphs: `desktop/r01-title` shows "Shift or Z and / to flip · hold Space to
    plunge" cut at the top, and `mobile/r01-title` shows "Tap the left or right side to flip" cut the same way.
  - The help's last bullet runs under the pinned Back button with no fade (`desktop/r09-help`, `mobile/r09-help`).
  - The DMD paintings are unreadable noise (enlarged `desktop/r07-mode`, `mobile/r07-mode`).
  - The phone shows the score twice (`mobile/r03-play`).
- **Rebut in part:**
  - The DMD text isn't crammed edge to edge (fact 7).
  - The menus aren't generic. In `desktop/r01-title`, `desktop/r10-scores` and `mobile/r09-help`, the dialogs carry
    the same gold double frame as the DMD bezel and the backglass frame, with a gold primary button. It's a modest
    deco treatment, not none.
  - The DMD tells the mode objective in context. `desktop/r07-mode` reads "DERBY DAY / RAMPS AND ORBITS: WIN THE
    RACE", and the matching shot arrows on the playfield are lit (see Readability).
- The mean is fair.

### Typography: critics 5.0 / 6.0, mean 5.5. Proposed 5.5

- **Concede:** the bathhouse plates in `desktop/c01-row` truncate "SUPER(IOR)", "MAURIC(E)" and "BUCKSTAF(F)", and
  "OZARK" is overlapped by its neighbour. `ab/desktop-c01-row` confirms that A printed full names, so this is a
  regression. The clipped title hint is a type and layout failure. At 390 px the mode labels are about 4 to 5 CSS px
  (`mobile/r03-play`).
- **Rebut:** the VAPORS label reads at play distance (fact 4). The display face is used consistently: the slab-serif
  "SPA CITY / PINBALL" logo, the "How to play" and "High scores" headings (`desktop/r09-help`, `desktop/r10-scores`)
  and the playfield's SPA CITY plate share one hand. The body sans is clean and has good contrast (`mobile/r09-help`
  at 390 px is fully legible). The bumper decal being upside down is an orientation defect on the toy, not a
  typography one; it shouldn't be double-counted here and under toys.
- I hold the mean, because the truncation is real and visible in the primary close-up.

### Readability: critics 5.5 / 6.5, mean 6.0. Proposed 6.5

- **Concede:** the skill-shot lamp is one small dot in `mobile/r02-serve` (the A lane), though the DMD names the lane
  ("SKILL SHOT: LANE A"). The wizard's mode arc stays dim (`desktop/r08-wizard`). The entrance graphics are small.
- **Rebut:** the R04 ball isn't lost (fact 3). Both critics missed the lamp language that tracks the modes. In
  `desktop/r07-mode` and `mobile/r07-mode` (Derby Day: "ramps and orbits"), the left orbit arrow lights blue, the
  Reserve St arrow green and the Mountain Tower ramp arrow yellow. None of these is lit in `desktop/r03-play`. That is
  the rubric's "every shot's entrance and lamp is obvious" working for a mode. Multiball reads on both viewports:
  `mobile/r06-multiball` shows three balls (top arch, between the flippers, shooter lane) against dark or neutral
  ground, as does `desktop/r06-multiball`. The ball on the ramp in `desktop/r05-ramp` reads against the grey plastic.
  Lit and unlit inserts are cleanly separated (`desktop/c03-flippers`).

### Mobile: critics 6.0 / 5.5, mean 5.75. Proposed 6.0

- **Concede:** the landscape table spans about x≈260 to 1000 of the 1280 px left of the panel, and the panel below its
  two buttons is empty (`mobile/r11-landscape`). The tilt foreshortens the upper field. Launch covers the right apron
  card in `mobile/r02-serve`. The title hint is clipped on the phone too.
- **Rebut / missed:** in portrait the table fills the full width, framed between a readable DMD and the apron
  (`mobile/r03-play`), and Launch sits over the apron, clear of the ball's area and the shooter lane
  (`mobile/r02-serve`). The phone help (`mobile/r09-help`) is laid out for touch, with large type and touch controls
  first. The landscape table in `ab/mobile-r11-landscape` B already fills the full canvas height, so Critic B's
  "+1.0" for landscape is an overstatement (see gaps). Critic A's 6.0 is the better-supported figure.

### Authenticity: critics 6.5 / 6.5, mean 6.5. Proposed 6.5

- **Concede:** the springs painting in `desktop/c02-springs` reads as turquoise travertine terraces, not Hot Springs
  tufa. The Vapors sign is small at play distance (`desktop/r03-play`). The hedged Arlington multiball fact isn't
  visible in these frames, as Critic B correctly says.
- **Rebut:** the bathhouses differ (fact 6), they're named in the correct order (`desktop/c01-row`, and listed in
  `mobile/r09-help`), and the help's About paragraph hedges the facts explicitly ("about" or "reportedly"; "fact:
  reserved, older", `desktop/r09-help`).
- The critics agree, and I hold.

## Gaps: adjusted

| Gap | Critic | Adjusted severity / gain | Reason |
|---|---|---|---|
| G-lower-field-art | A | 4 / +0.5 | The lower field already carries the fan, the mode arc and the garden band (`desktop/r03-play`). The flat area is the insert-to-apron strip, not the whole lower half. |
| G-art-seams | A | 4 / +0.5 | Conceded. The seams are visible in `desktop/c01-row` and `desktop/s02-bumpers-1`. |
| G-label-truncation | A | 4 / +0.5 | Conceded for the bathhouse plates, a regression per `ab/desktop-c01-row`. The VAPORS part comes from the camera angle. |
| G-wizard-lightshow | A | 3 / +0.3 | Most of the lamps already change in R08 (fact 1). What's left is the mode arc and the GI mood. |
| G-rubbers-slings | A | 3 / +0.3 | Conceded for the crescents and slings. The flippers already have a red rubber band (`desktop/c03-flippers`). |
| G-ramp-wireform | A | 3 / +0.3 | The wireform exists. The cause is its emissive material plus the kink (`desktop/c05-tower`). |
| G-bumper-caps | A | 2 / +0.2 | Rotating the decal is valid. The caps already glow on a hit (`desktop/s02-bumpers-1`). |
| G-menu-clip | A | 3 / +0.3 | Conceded. |
| G-dmd-density | A | 2 / +0.3 | The text has hierarchy and margin. The dither art is the real defect. |
| G-landscape-fill | A | 3 / +0.5 | Conceded. |
| G-ball-upper | A | 2 / +0.2 | The R04 ball is against foliage and visible (fact 3). A glassy rather than chrome ball remains a real point. |
| G-springs-authentic | A | 2 / +0.3 | Conceded. |
| G-menu-style | A | 1 / +0.2 | The dialogs already use the gold double frame shared with the cabinet. |
| G-mechanical-materials | B | 4 / +0.5 | It overlaps G-rubbers-slings and G-ramp-wireform. The landmark toys already read, so +1.0 overstates it. |
| G-landscape-framing | B | 3 / +0.5 | Duplicates G-landscape-fill. B already fills the full height. |
| G-shot-hierarchy | B | 3 / +0.3 | Lamps already track mode shots (`desktop/r07-mode`). Only the entrance graphics are weak. |
| G-dmd-composition | B | 2 / +0.3 | Duplicates G-dmd-density. |
| G-light-grounding | B | 3 / +0.3 | The hotspots are real. The flipper shadow is present in `strips/s01-flip`. |
| G-title-hint-clipping | B | 3 / +0.3 | Duplicates G-menu-clip. One clipped line is worth less than +0.5. |
| G-mechanical-feedback | B | 3 / +0.3 | Conceded that there's no bumper drop or recoil. The flash and decay are already present. |

## Proposed total

6.0 + 6.0 + 6.5 + 6.5 + 6.0 + 5.5 + 6.5 + 6.0 + 6.5 = **55.5 / 90**. Every category is within ±1 of the critic mean.
This still fails every gated category except authenticity, so the verdict stays continue.

```json
{
  "loop": 1,
  "role": "advocate",
  "tier": "high",
  "verdict": "continue",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row.png", "note": "conceded: seams at y≈285 and y≈600" },
      { "shot": "desktop/c03-flippers.png", "note": "conceded: fan ends on a straight edge at y≈215" },
      { "shot": "desktop/r03-play.png", "note": "backglass in the same hand; lower field has fan, mode arc and garden band, not empty" },
      { "shot": "mobile/r03-play.png", "note": "THE VAPORS label reads in full at play distance; C04 hiding is camera occlusion" } ] },
    "toys": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c05-tower.png", "note": "tower holds up; wire return exists but renders emissive; ramp kink at y≈520 conceded" },
      { "shot": "desktop/c06-arlington.png", "note": "twin-towered Arlington reads; crescent post rubbers conceded" },
      { "shot": "desktop/c03-flippers.png", "note": "red rubber band on flipper perimeter; slings lack rubber (conceded)" },
      { "shot": "desktop/s02-bumpers-1.png", "note": "struck cap glows from inside; ball glassy (conceded)" },
      { "shot": "desktop/c01-row.png", "note": "bathhouses have distinct roofs, dome, towers" } ] },
    "lighting": { "score": 6.5, "confidence": 0.55, "evidence": [
      { "shot": "desktop/r08-wizard.png", "note": "all Row, lock, multiplier, SPA and Central Ave lamps lit vs desktop/r03-play; mode arc dim, no GI mood shift" },
      { "shot": "strips/s03-multiball.png", "note": "full mode-arc and insert chase in frames 4-6" },
      { "shot": "strips/s01-flip.png", "note": "soft shadow follows the raised flipper in frames 3-7" },
      { "shot": "desktop/c03-flippers.png", "note": "bloom only on lit inserts" },
      { "shot": "desktop/c02-springs.png", "note": "conceded: blue wash and white hotspots on bumper rings" } ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip.png", "note": "flipper snaps between frames 2 and 3, clean release" },
      { "shot": "strips/s02-bumpers.png", "note": "bumper flash and decay, steam drifts; no skirt drop (conceded)" },
      { "shot": "strips/s03-multiball.png", "note": "light show plus lateral camera reaction" } ] },
    "ui": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r07-mode.png", "note": "two-tone DMD title and objective with right margin; dither art is noise (conceded)" },
      { "shot": "desktop/r01-title.png", "note": "conceded: hint clipped; gold double frame matches DMD bezel" },
      { "shot": "mobile/r09-help.png", "note": "touch-first help; last bullet under Back (conceded)" },
      { "shot": "mobile/r03-play.png", "note": "duplicate score (conceded)" } ] },
    "typography": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row.png", "note": "conceded: SUPER, MAURIC, BUCKSTAF truncated; OZARK overlapped" },
      { "shot": "ab/desktop-c01-row.png", "note": "A had full names: regression" },
      { "shot": "desktop/r09-help.png", "note": "display face consistent with logo; clean body sans" },
      { "shot": "mobile/r01-title.png", "note": "clipped hint (conceded)" } ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r07-mode.png", "note": "Derby Day lights orbit, Reserve St and ramp arrows to match the DMD objective" },
      { "shot": "desktop/r04-bumpers.png", "note": "ball at about (596,75) against dark foliage, not white water" },
      { "shot": "mobile/r06-multiball.png", "note": "three balls findable on phone" },
      { "shot": "desktop/r08-wizard.png", "note": "mode arc dim in wizard (conceded)" } ] },
    "mobile": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r11-landscape.png", "note": "conceded: table about 58% of the free width, panel half empty" },
      { "shot": "mobile/r02-serve.png", "note": "Launch clear of shooter lane; covers apron card (conceded)" },
      { "shot": "mobile/r03-play.png", "note": "portrait framed full width with readable DMD" },
      { "shot": "mobile/r09-help.png", "note": "touch-first help at legible size" } ] },
    "authenticity": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row.png", "note": "eight named, ordered, differentiated bathhouses" },
      { "shot": "desktop/c06-arlington.png", "note": "twin-towered Arlington" },
      { "shot": "desktop/r09-help.png", "note": "hedging stated in About" },
      { "shot": "desktop/c02-springs.png", "note": "terraces read un-Arkansan (conceded)" } ] }
  },
  "gaps": [
    { "id": "G-lower-field-art", "category": "art", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c03-flippers.png", "desktop/r03-play.png"], "fix": "Extend the painting through the insert-to-apron strip with lit insert surrounds; no flat navy area larger than 5% of the playfield." },
    { "id": "G-art-seams", "category": "art", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c01-row.png", "desktop/s02-bumpers-1.png"], "fix": "One continuous playfield texture or feathered, exposure-matched joins; no straight luminance steps in close-ups." },
    { "id": "G-label-truncation", "category": "typography", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c01-row.png", "ab/desktop-c01-row.png"], "fix": "Size each plate to its text and stagger them; all eight names complete and non-overlapping in C01. (The VAPORS label is a C04 camera occlusion, not a layout bug.)" },
    { "id": "G-wizard-lightshow", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r08-wizard.png", "desktop/r03-play.png"], "fix": "Most lamps already change; also light the mode arc and run a colour-shifted GI sweep so R08 differs from R03 at thumbnail size." },
    { "id": "G-rubbers-slings", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors.png", "desktop/c06-arlington.png", "desktop/c03-flippers.png"], "fix": "Full torus post rubbers and black rubber bands across the sling faces; flippers already carry a red rubber band." },
    { "id": "G-ramp-wireform", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower.png"], "fix": "Make the existing wire return non-emissive chrome with brackets and remove the ramp entrance kink." },
    { "id": "G-bumper-caps", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c02-springs.png", "desktop/s02-bumpers-1.png"], "fix": "Rotate the 143°F decal to face the player; cap glow on hit already exists." },
    { "id": "G-menu-clip", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title.png", "mobile/r01-title.png", "mobile/r09-help.png"], "fix": "Give the title hint room below Settings; add a fade and padding above the pinned Back button." },
    { "id": "G-dmd-density", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r06-multiball.png", "mobile/r07-mode.png"], "fix": "Replace dither paintings with nameable silhouettes; the two-tone text hierarchy can stay." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape.png"], "fix": "Zoom so the table spans at least 70% of the free width; use the empty panel space." },
    { "id": "G-ball-upper", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r04-bumpers.png", "desktop/s02-bumpers-1.png"], "fix": "Chrome ball with a dark environment band instead of a glassy see-through look; R04 ball is already findable." },
    { "id": "G-springs-authentic", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c02-springs.png", "desktop/c04-vapors.png"], "fix": "Repaint the springs as Hot Springs tufa cascades and the Grand Promenade; enlarge the Vapors marquee." },
    { "id": "G-menu-style", "category": "ui", "expectedGain": 0.2, "severity": 1, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r10-scores.png", "desktop/r01-title.png"], "fix": "Push the existing gold-framed dialogs further toward deco (corner ornaments, matching label face)." },
    { "id": "G-mechanical-materials", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c03-flippers.png", "desktop/c05-tower.png", "desktop/c06-arlington.png"], "fix": "Bevels and distinct rubber/plastic/metal roughness; overlaps G-rubbers-slings and G-ramp-wireform, gains not additive." },
    { "id": "G-landscape-framing", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape.png", "ab/mobile-r11-landscape.png"], "fix": "Same as G-landscape-fill; reduce lateral margins and upper-field foreshortening." },
    { "id": "G-shot-hierarchy", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c04-vapors.png", "desktop/r07-mode.png"], "fix": "Larger entrance graphics for lock, Vapors and orbits; mode-tracking shot lamps already exist." },
    { "id": "G-dmd-composition", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r06-multiball.png", "mobile/r07-mode.png"], "fix": "Same as G-dmd-density." },
    { "id": "G-light-grounding", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c02-springs.png", "desktop/c06-arlington.png", "strips/s01-flip.png"], "fix": "Tame bumper-ring hotspots and the blue wash; extend the soft shadow seen under flippers to the bathhouses and landmarks." },
    { "id": "G-title-hint-clipping", "category": "typography", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title.png", "mobile/r01-title.png"], "fix": "Same as G-menu-clip." },
    { "id": "G-mechanical-feedback", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers.png", "strips/s03-multiball.png"], "fix": "Add bumper skirt drop and recoil; flash and decay already present." }
  ]
}
```

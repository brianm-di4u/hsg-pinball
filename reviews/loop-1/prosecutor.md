# Prosecutor: loop 1

All capture paths are relative to `games/Pinball/screenshots/review-loop-1/` and use the lowercase names on disk.

## Summary of the charge

The two critics agree on most defects, but both let several of them go without docking points, and Critic B in
particular scored from a handful of play frames without opening the close-ups that show the problems. Five findings
matter most:

1. **The animation 6.0 rests partly on evidence that isn't in the strip.** Critic A calls the camera shift in
   `strips/s03-multiball` the "best evidence for 7". I measured the table's left edge in the source frames
   `desktop/s03-multiball-0/3/5/7`: it sits at x = 270, 269, 272 and 272 px. The camera doesn't move. The same
   "Grand Soak multiball launch" strip shows **one** ball in every frame where any ball shows (frames 5–7), so no
   eject can be seen either.
2. **This loop's label change made the playfield type worse, and the A/B pair proves it.** In
   `ab/desktop-c01-row`, build A shows "MAURICE" and "BUCKSTAFF" in full. Build B (this loop's, the one with the tall
   Arlington) shows "MAURIC" and "BUCKSTAF", and "OZARK" is cut off by its neighbour. Superior's label isn't visible in
   either build: it's covered by the Vapors lane assembly (`desktop/c01-row` x≈200, y≈540; `desktop/s03-multiball-5`
   x≈490, y≈310). Critic B gave typography a 6 and called the labels merely "cramped".
3. **The lamp state doesn't follow the game state.** In `desktop/r04-bumpers` and `mobile/r04-bumpers`, labelled
   "ball in the pop bumpers", the ball is above the bumpers, all three bumpers are unlit, and the DMD reads "SPA
   CITY / BALL 1". In `desktop/r08-wizard` the DMD says "ALL SHOTS LIT", yet the blue, red, green and Reserve St shot
   arrows and five of the six mode-arc lamps are in the same state as in `desktop/r03-play`. The multiball frame
   (`desktop/r06-multiball`, `mobile/r06-multiball`) has no light show at all.
4. **The phone landscape view isn't framed on purpose.** In `mobile/r11-landscape` (1688×780 at 2×) the table spans
   x 358–923 at mid-height. That is 565 px, or 33% of the canvas and 44% of the area left of the panel. The side panel
   is completely empty below y≈300: not one pixel in that region is brighter than luminance 40.
5. **The largest painted area depicts the wrong place.** The upper third (`desktop/c02-springs`,
   `desktop/s02-bumpers-1`) is a field of turquoise travertine terraces in the style of Pamukkale. Both critics noted
   this, then still gave authenticity 6.5.

I argue eight categories down by 0.5 to 1.0 and accept none above the mean. My proposed total is **48.5/90**
(the critic mean is 53.25).

## Category by category

Critic mean in brackets.

### Art: 5.5 (mean 6.0, A 5.5, B 6.5)
Critic B's 6.5 cites only `desktop/r03-play` and `desktop/c03-flippers` and never mentions the panel seams that
prove the art sits in rectangles.
- `desktop/c03-flippers`: the painted fan ends at a ruler-straight horizontal edge at y≈215 across the full width.
  Below it the flipper zone is flat navy with faint rays. This is the rubric's 5-anchor case: "art sits in rectangles
  unrelated to the layout".
- `desktop/c01-row`: there are brightness seams across the field at y≈285 and at y≈600, where the hex-tile floor
  stops dead into the plaza-and-bench painting. In `desktop/s02-bumpers-1` the waterfall painting stops on a straight
  line at y≈630.
- `desktop/c04-vapors`: the SPA CITY logo is printed over the Vapors lane label, so only "RS" shows (x≈920, y≈535).
  The logo was not composed around the shot.
- `desktop/c01-row`: unlit Row inserts are empty gold-outline rectangles, which read as placeholders rather than
  painted inserts.
- The bumpers sit over waterfalls with no painted surround (`desktop/c02-springs`), so the art doesn't direct the eye
  to any shot.
- The backglass (`desktop/r03-play`) is genuinely good and holds the score at 5.5 rather than 5.

### Toys: 5.0 (mean 5.5, A 5.5, B 5.5)
The rubric's 7 needs "a convincing ramp and wireform, a chrome ball", and its 5 says "rails and walls read as grey
blocks". The close-ups match the 5.
- `desktop/c05-tower`: the ramp is flat translucent panels with stair-stepped, segmented side walls (white teeth along
  both edges) and a visible kink at y≈520. The "wireform" is emissive blue-white tubes that read as neon.
- `desktop/c04-vapors`: the walls are black boxes with flat gold caps. Every post rubber renders as two white
  crescents ("eyes") instead of a ring (x≈690, 860 and 200, y≈560). The Vapors scoop toy is a plain white box with
  a cyan strip (x 370–590, y 280–430).
- `desktop/c03-flippers`: the flippers are flat white extrusions with a red stripe and no separate rubber. The slings
  are plastic triangles on white blocks, with no rubber band, kicker or posts.
- `desktop/c02-springs`: the bumper caps are opaque and their "143°F" decals are upside down to the player. The
  S·P·A lane guides are tall plain gold slabs.
- `desktop/s02-bumpers-1`: the ball is a clear glass sphere that shows the painting through itself, not chrome, and it
  has no contact shadow.
- `desktop/c01-row`, `desktop/c06-arlington`: apart from Quapaw's dome and Ozark's towers, the bathhouses are
  cream box-plus-roof blocks perched on top of a black wall like ornaments on a shelf.
- The tower (`desktop/c05-tower`) and the Arlington (`desktop/c06-arlington`) are the only toys that hold up. Two good
  landmarks don't lift every other mechanism out of the 5 band.

### Lighting: 5.5 (mean 6.0, A 6.0, B 6.0)
The 7 anchor needs "GI warms the field, soft shadows ground every toy, the ball reflects the table, no glare". None of
these holds.
- **No reaction where events happen:** the bumper frames `desktop/r04-bumpers` and `mobile/r04-bumpers` have all
  three bumpers unlit and are lit the same as `desktop/r03-play`.
- **No mood change:** `desktop/r08-wizard` differs from `desktop/r03-play` only in the four multiplier inserts and the
  Row inserts, and the shot arrows stay dark despite "ALL SHOTS LIT". `desktop/r07-mode` and `desktop/r06-multiball`
  carry the same field lighting as normal play. Critic A noted this for wizard only, and neither critic docked the
  multiball frame.
- **Glare persists:** there are blown white specular dots on every bumper skirt and scoop ring (`desktop/c02-springs`,
  `desktop/c06-arlington` x≈630, y≈440). A white blown bar sits at the left orbit gate (`desktop/c04-vapors`
  x 0–100, y 115–180). A cold blue wash covers the upper left (`desktop/c06-arlington` x 0–300, y 250–400;
  `desktop/c01-row` top-left rail).
- **No GI on the lower field:** below the inserts, `desktop/c03-flippers` and `mobile/r03-play` are a flat dark plane
  with no warm pools under the slings.
- **Contact shadows barely register:** they can just be seen under the flippers in `strips/s01-flip` frame 4, and not
  at all under the bathhouses in `desktop/c01-row`.

### Animation: 5.5 (mean 6.0, A 6.0, B 6.0)
- `strips/s03-multiball`: **no camera reaction.** The table's left edge measures at x 269–272 px across
  `desktop/s03-multiball-0/3/5/7`, which removes Critic A's "camera shifts sideways" point. The strip is labelled as a
  multiball launch, but only a single ball is visible (frames 5–7, travelling up the right orbit). The only motion is
  inserts toggling: the Row in frames 2–3 and the mode arc in frames 4–6.
- `strips/s02-bumpers`: the bumpers glow orange in frames 0–4, then fade. There is no cap or skirt drop, which the
  7 anchor explicitly needs ("bumpers flash and drop"), and no flash on the playfield around them. The steam is
  grey speckled blobs (frames 0–7, top left).
- `strips/s01-flip`: a single-step flipper snap between frames 2 and 3, held through frame 7. There is no ball trail,
  no impact flash and no score pop-up in any strip.
- Against the 7 list ("flippers snap, bumpers flash and drop, steam rises, light shows run, the camera reacts"), two
  items are absent, and the light show is only insert toggles. That places this above 5 and below 6.

### UI: 5.5 (mean 6.0, A 5.5, B 6.5)
Critic B's 6.5 credits the help screen and does not mention that its last bullet is clipped.
- The title hint is sliced through its glyphs on both viewports (`desktop/r01-title`, `mobile/r01-title`).
- Help on both viewports cuts the last bullet in half behind the pinned Back button, with no fade: "what's lit, or
  pays a mystery award." in `mobile/r09-help`, and the Vapors line in `desktop/r09-help`.
- The brief says "plain callouts limited to two lines", yet every mode or multiball callout in the captures runs to
  four lines that wrap mid-phrase. Examples: "DERBY DAY / RAMPS AND / ORBITS: WIN / THE RACE" (`mobile/r07-mode`),
  "VALLEY OF THE / VAPORS / ALL SHOTS LIT / • 60 SECONDS" with a line starting on a bullet (`desktop/r08-wizard`),
  and "JACKPOTS" touching the bottom bezel (`desktop/r06-multiball`). The dithered pictures beside them have no
  subject that can be named.
- The DMD shows nothing for the bumper or ramp events: it reads "SPA CITY / BALL 1" in both `desktop/r04-bumpers` and
  `desktop/r05-ramp`.
- On the phone the score appears twice, in the DMD and on the plate (`mobile/r03-play`). The menus are generic
  purple pills (`desktop/r10-scores`).

### Typography: 5.0 (mean 5.5, A 5.0, B 6.0)
- **A regression introduced this loop:** `ab/desktop-c01-row` A shows full names, while B, which is this build
  (`desktop/c01-row`), reads "MAURIC", "BUCKSTAF" and "OZARK" with its last letter cut by its neighbour. "HALE" is
  partly occluded, and SUPERIOR is invisible under the Vapors lane assembly.
- "THE VAPORS" sits under the logo (`desktop/c04-vapors`), and "143°F" is upside down (`desktop/c02-springs`).
- The title hint is clipped (`mobile/r01-title`, `desktop/r01-title`). DMD lines break mid-phrase and one starts on a
  bullet (`desktop/r08-wizard`).
- Playfield labels at 390 px are about 4–5 css px and can't be read (`mobile/r03-play`: "MAURIC FORDYCE",
  "QUAPAW OZARK BUCKSTAF LAMAR").
- The display face (`desktop/r09-help`, `desktop/r10-scores`) is good. The rubric's 7 asks for "playfield lettering
  crisp", which is plainly failed here.

### Readability: 5.5 (mean 6.0, A 5.5, B 6.5)
Critic B leaned on `mobile/r05-ramp`, the easiest case of a bright ball on a pale ramp.
- The lamps lie: "ALL SHOTS LIT" with dark shot arrows (`desktop/r08-wizard`, `mobile/r08-wizard`). A player reading
  the lamps gets the wrong answer.
- Skill shot: the DMD says "LANE A", but the A lane lamp is a few pixels of yellow, and lit and unlit S·P·A lamps
  differ only by a faint tint (`desktop/r02-serve` x≈760, y≈125; `mobile/r02-serve` x≈612, y≈432).
- Because the ball is glass, it takes on the colour of the art under it. Over the white water it is a pale speck
  (`desktop/r04-bumpers` x≈595, y≈75; `desktop/s02-bumpers-1`).
- Shot entrances aren't marked. The Vapors scoop's lane label is hidden under the logo (`desktop/c04-vapors`), and at
  phone size the bathhouse targets are tiny cream marks with illegible labels (`mobile/r03-play`).
- Multiball: three balls can be found in `desktop/r06-multiball`, which keeps this above 5.

### Mobile: 5.0 (mean 5.75, A 6.0, B 5.5)
The rubric's 7 asks for the table to be "framed on purpose in portrait **and** landscape". Landscape fails that.
- In `mobile/r11-landscape` the table spans 565 of 1688 px at mid-height (33% of the canvas) and only about 430 px
  at the arch. There is about 300 px of black on each side, and the panel is empty below the buttons (about 62% of its
  height). The apron runs into the bottom edge, and the upper field is foreshortened until the bumpers and labels
  turn to mush.
- In portrait (`mobile/r02-serve`, `mobile/r06-multiball`), Launch sits over the right apron card and its text shows
  through the button. The score is duplicated (`mobile/r03-play`). Labels can't be read at 390 px.
- The title hint is clipped (`mobile/r01-title`), and the last help bullet is clipped behind Back (`mobile/r09-help`).
- Portrait framing and DMD legibility are good. That is half the category, and it keeps the score at 5.0.

### Authenticity: 6.0 (mean 6.5, A 6.5, B 6.5)
The rubric's 7 asks for the "eight bathhouses recognisable and in order". They are in order, but they can't be
recognised.
- `desktop/c01-row`: six of the eight are interchangeable cream blocks. Fordyce, the Row's best-known facade, has no
  feature that sets it apart. The labels that would rescue identification are truncated or hidden (Superior,
  Maurice, Buckstaff, Ozark).
- `desktop/c02-springs`, `desktop/s02-bumpers-1`: the largest painted area shows Pamukkale-style turquoise terraces.
  These are not the Hot Springs tufa cascade or the open Display Spring.
- `desktop/c04-vapors`: the Vapors sign is a vertical neon strip about 15×90 px that can't be read at play distance,
  and the Vapors scoop is a white box.
- In favour: the twin-towered Arlington (`desktop/c06-arlington`), the Mountain Tower lattice (`desktop/c05-tower`),
  the Central Ave and Reserve St labels, and the hedged facts in help (`desktop/r09-help`). These keep the score at the
  gate rather than below it.

## IP check (own)

Clean on what is visible. I found no commercial pinball title, logo or art. The playfield painting (springs,
stairs, plaza with bench) and the backglass painting (domed buildings, tower, neon shapes without letters) contain no
legible text. All lettering, such as labels, apron cards, bumper decals and the SPA CITY logo, is separate designed
type. The DMD dithers are abstract. Real names appear only as places, with a no-affiliation note
(`desktop/r09-help`).

## Gaps the critics missed or under-weighted

1. **G-label-regression** (typography, sev 4, S, WS4, +0.5): the label plates added this loop truncate names that were
   complete in the previous build (`ab/desktop-c01-row`), and Superior is hidden under the Vapors lane assembly.
   Fix: size each plate to its text, or drop it to 90% width with a condensed face. Move Superior's label left of the
   lane assembly. Test: all eight names are complete and unoccluded in `desktop/c01-row`.
2. **G-event-lamps** (lighting, sev 4, M, WS1, +0.5): bumpers are unlit in the bumper frame, and wizard and multiball
   leave the field lamps as in normal play (`desktop/r04-bumpers`, `desktop/r06-multiball`, `desktop/r08-wizard`).
   Fix: drive the shot arrows and arc from the mode state, flash the bumper body and the playfield ring on every hit,
   and give each multiball and wizard a GI colour. Test: R04, R06 and R08 each differ from R03 at thumbnail size, and
   every shot arrow is lit in R08.
3. **G-multiball-eject** (animation, sev 3, M, WS3, +0.5): the multiball launch strip shows one ball and insert
   toggles only (`strips/s03-multiball`). Fix: a staggered kick-out with an eject flash and GI strobe, plus a short ball
   trail on the ejected balls. Test: at least 2 balls are visible in at least 4 of the 8 frames, with an eject flash in
   one of them.
4. **G-glass-ball** (readability, sev 3, S, WS1, +0.5): the ball is transparent glass that shows the art through
   itself (`desktop/s02-bumpers-1`, `desktop/r04-bumpers`). Fix: an opaque chrome material (metalness 1, low roughness)
   with a dark horizon band in the env map, plus a soft contact shadow. Test: the ball shows no playfield art through
   its centre in `desktop/s02-bumpers-1`, and it is found in under 1 s over the white water.
5. **G-vapors-landmark** (authenticity, sev 3, M, WS2, +0.3): the Vapors scoop is a white box, its sign a 15×90 px
   vertical strip, and its lane label is under the logo (`desktop/c04-vapors`). Fix: model a marquee building front
   with a horizontal lit marquee at least 3× the current area, and move the SPA CITY logo clear of the lane. Test: the
   marquee can be read in `desktop/r03-play`.
6. **G-bathhouse-identity** (authenticity, sev 3, L, WS2, +0.5): six of the eight bathhouses are interchangeable cream
   blocks on a shelf (`desktop/c01-row`). Fix: give each a signature feature and colour, for example Fordyce's arched
   windows and red tile roof, Buckstaff's columned portico, Maurice's arched entry and Lamar's flat parapet, and seat
   them on the playfield rather than on top of the wall. Test: a viewer matches at least 6 of the 8 to the help list
   without the labels.
7. **G-landscape-fill** (mobile, sev 4, M, WS6, +0.5): the table covers 33% of the landscape canvas and the panel is
   empty below the buttons (`mobile/r11-landscape`). Fix: drop the tilt back toward top-down, scale the table to the
   free height, and put the ball count and mode progress in the panel. Test: the table is at least 60% of the canvas
   width at mid-height, and the panel has no empty region taller than 40% of its height.
8. **G-launch-card** (mobile, sev 2, S, WS6, +0.2): Launch overlays the apron card with its text showing through
   (`mobile/r02-serve`). Fix: make the button opaque and shrink the right card, or move it. Test: no card text is
   visible under Launch.
9. **G-phone-labels** (typography, sev 3, M, WS4, +0.3): playfield labels are about 5 css px at 390 px
   (`mobile/r03-play`). Fix: render the labels at a minimum of 8 css px on phones, or swap them for icon plates. Test:
   the bathhouse and mode labels can be read in `mobile/r03-play` at 100%.

```json
{
  "loop": 1,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "painted fan ends on a straight edge at y≈215; flat navy flipper zone" },
      { "shot": "desktop/c01-row", "note": "panel seams at y≈285 and y≈600; unlit Row inserts are empty outlines" },
      { "shot": "desktop/s02-bumpers-1", "note": "waterfall painting stops on a straight line at y≈630" },
      { "shot": "desktop/c04-vapors", "note": "SPA CITY logo printed over THE VAPORS label" },
      { "shot": "desktop/r03-play", "note": "backglass strong; lower field empty" } ] },
    "toys": { "score": 5.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c05-tower", "note": "ramp walls stair-stepped and segmented, kink at y≈520, neon tubes instead of wireform; tower good" },
      { "shot": "desktop/c04-vapors", "note": "walls are black boxes with gold caps; post rubbers render as white crescents; Vapors scoop is a white box" },
      { "shot": "desktop/c03-flippers", "note": "flat flippers without rubber; slings without rubber band or kicker" },
      { "shot": "desktop/c02-springs", "note": "opaque caps with upside-down decal; slab lane guides" },
      { "shot": "desktop/s02-bumpers-1", "note": "glass ball shows the art through itself, no contact shadow" } ] },
    "lighting": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r04-bumpers", "note": "bumper frame with all bumpers unlit; same lighting as R03" },
      { "shot": "desktop/r08-wizard", "note": "ALL SHOTS LIT but shot arrows and most of the arc are dark; no mood change" },
      { "shot": "desktop/r06-multiball", "note": "multiball has no light show" },
      { "shot": "desktop/c06-arlington", "note": "blown specular dots on skirts and scoop ring; cold blue wash upper left" },
      { "shot": "desktop/c03-flippers", "note": "no GI on the lower field" } ] },
    "animation": { "score": 5.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/s03-multiball", "note": "no camera shift (table left edge 269–272 px across frames 0/3/5/7); one ball only; insert toggles" },
      { "shot": "strips/s02-bumpers", "note": "glow and fade, no cap or skirt drop, no ring flash" },
      { "shot": "strips/s01-flip", "note": "single-step snap held to frame 7; no trail or impact flash" } ] },
    "ui": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r01-title", "note": "hint clipped through glyphs" },
      { "shot": "mobile/r09-help", "note": "last bullet sliced behind pinned Back, no fade" },
      { "shot": "mobile/r07-mode", "note": "four-line callout wraps mid-phrase despite the two-line claim; noise picture" },
      { "shot": "desktop/r08-wizard", "note": "DMD line starts with a bullet" },
      { "shot": "desktop/r05-ramp", "note": "DMD shows nothing for the ramp event" } ] },
    "typography": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "ab/desktop-c01-row", "note": "A has full names; this build truncates MAURIC and BUCKSTAF and clips OZARK" },
      { "shot": "desktop/c01-row", "note": "Superior label hidden under the Vapors lane assembly" },
      { "shot": "desktop/c02-springs", "note": "143°F upside down" },
      { "shot": "mobile/r01-title", "note": "clipped hint" },
      { "shot": "mobile/r03-play", "note": "labels about 5 css px" } ] },
    "readability": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "lamps contradict the DMD" },
      { "shot": "desktop/r02-serve", "note": "skill-shot lane A lamp is a few pixels; lit and unlit S·P·A barely differ" },
      { "shot": "desktop/r04-bumpers", "note": "glass ball a pale speck over white water" },
      { "shot": "desktop/c04-vapors", "note": "Vapors entrance label hidden under the logo" },
      { "shot": "desktop/r06-multiball", "note": "three balls findable" } ] },
    "mobile": { "score": 5.0, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "table 565 of 1688 px at mid-height; panel empty below the buttons; apron touches the bottom edge" },
      { "shot": "mobile/r02-serve", "note": "Launch overlays the apron card with its text showing through" },
      { "shot": "mobile/r03-play", "note": "portrait fills the width, DMD readable; duplicate score; labels illegible" },
      { "shot": "mobile/r09-help", "note": "last bullet clipped behind Back" } ] },
    "authenticity": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row", "note": "order correct but six interchangeable cream blocks; labels truncated or hidden" },
      { "shot": "desktop/c02-springs", "note": "largest painted area shows Pamukkale-style terraces" },
      { "shot": "desktop/c04-vapors", "note": "Vapors sign about 15×90 px vertical strip; scoop is a white box" },
      { "shot": "desktop/c06-arlington", "note": "twin-towered Arlington reads" },
      { "shot": "desktop/r09-help", "note": "hedged facts" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art; no legible text in the playfield or backglass paintings; lettering is separate designed type; real names used only as places, with a no-affiliation note." },
  "gaps": [
    { "id": "G-label-regression", "category": "typography", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS4", "evidence": ["ab/desktop-c01-row", "desktop/c01-row", "desktop/s03-multiball-5"], "fix": "Size each plate to its text or use a condensed face; move Superior's label clear of the Vapors lane assembly. Test: all eight names complete and unoccluded in desktop/c01-row." },
    { "id": "G-event-lamps", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r04-bumpers", "desktop/r06-multiball", "desktop/r08-wizard"], "fix": "Drive shot arrows and the arc from mode state, flash the bumper body and playfield ring per hit, and give each multiball and wizard a GI colour. Test: R04, R06 and R08 each differ from R03 at thumbnail size; every arrow lit in R08." },
    { "id": "G-multiball-eject", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s03-multiball", "desktop/s03-multiball-5"], "fix": "Staggered kick-out with an eject flash, GI strobe and short ball trails. Test: at least 2 balls visible in at least 4 of 8 strip frames, with an eject flash in one." },
    { "id": "G-glass-ball", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/s02-bumpers-1", "desktop/r04-bumpers"], "fix": "Opaque chrome ball (metalness 1, low roughness) with a dark horizon band in the env map and a soft contact shadow. Test: no art visible through the ball centre in s02-bumpers-1; ball found in under 1 s over white water." },
    { "id": "G-vapors-landmark", "category": "authenticity", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/r03-play"], "fix": "Model a marquee building front with a horizontal lit marquee at least 3x the current area; move the SPA CITY logo off the Vapors lane. Test: marquee readable in desktop/r03-play." },
    { "id": "G-bathhouse-identity", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c06-arlington"], "fix": "Give each bathhouse a signature feature and colour (Fordyce arched windows and red tile roof, Buckstaff portico, Maurice arched entry, Lamar parapet) and seat them on the playfield, not atop the wall. Test: at least 6 of 8 matched to the help list without labels." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Reduce the tilt, scale the table to the free height, and fill the panel with ball count and mode progress. Test: table at least 60% of canvas width at mid-height; no empty panel region taller than 40% of its height." },
    { "id": "G-launch-card", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r02-serve", "mobile/r06-multiball"], "fix": "Opaque Launch button, and shrink or move the right apron card. Test: no card text visible under Launch." },
    { "id": "G-phone-labels", "category": "typography", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["mobile/r03-play", "mobile/r02-serve"], "fix": "Render playfield labels at a minimum of 8 css px on phones, or replace them with icon plates. Test: bathhouse and mode labels legible in mobile/r03-play at 100%." }
  ]
}
```

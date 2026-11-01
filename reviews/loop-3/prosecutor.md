# Prosecutor: loop 3

Capture paths are relative to `games/Pinball/screenshots/review-loop-3/`. I opened every desktop and mobile frame,
all six close-ups, all three strips, several A/B pairs, and 3× crops of the small frames. For measurements I used
the playfield area of the desktop frames (x 460–820, y 30–740).

## Summary of the charge

The critics' means total **57.75**. They were too generous in eight of nine categories. Three problems run through
the evidence, and each one contradicts a change this loop claims to have made:

1. **The mood lighting goes the wrong way.** Mean playfield luminance is 77.5 in normal play (`desktop/r03-play`),
   84.0 in multiball (`desktop/r06-multiball`), 86.8 in Derby Day (`desktop/r07-mode`) and 87.5 in the wizard
   (`desktop/r08-wizard`). The wizard is supposed to dim key and fill, but it is 13 % *brighter* than normal play.
   Critic A measured the wizard. Critic B called it "limited separation" and still gave 6.5. Neither noticed that
   every mood state is brighter than base play.
2. **The lettering fixes did not land.** The brief says MOUNTAIN TOWER moved clear of its arrow. In
   `mobile/r02-serve` (2× crop) the plate still runs under the yellow arrow, which splits it into
   "MOUNTAI|TOWER", and the plate now lies across the COASTER insert. The same collision shows in
   `desktop/r03-play` and in `desktop/s03-multiball-6`.
3. **The help-footer fix did not land.** The brief promises extra space above the pinned Back button, but the last
   bullet still runs underneath Back on both viewports (`desktop/r09-help`: the Vapors bullet is half hidden;
   `mobile/r09-help`: "what's lit, or pays a mystery award" is cut through).

There is also a defect neither critic found. At 3× on `desktop/c04-vapors`, the Vapors neon blade reads
top-to-bottom as "2ROPAV", with the V drawn as ∀ and the P as b. The sign texture is flipped vertically, so the
table's own signature landmark carries mirror text.

## Category by category

### Art: critics 7.0 / 6.5, mean 6.75. Proposed **6.0**
- The 7 anchor requires "inserts and lettering integrated". They are not:
  - The MOUNTAIN TOWER plate overlaps the COASTER insert, and the arrow cuts through its lettering
    (`mobile/r02-serve`, `desktop/r03-play`).
  - In the wizard, the pink shot arrow clips the "B" of the BATHHOUSE ROW sub-line under the SPA CITY logo
    (`desktop/r08-wizard` crop: "ATHHOUSE ROW").
  - The THE VAPORS plate sits half under the scoop's right-hand rail (`desktop/c04-vapors`).
- The inserts are flat purple discs and flat painted triangles, with no insert plastic, bevel or painted surround
  tying them into the art (`desktop/r03-play` crop). The lower fan has large blank terrazzo between the slings and
  the mode row (`desktop/r03-play`).
- Nothing in the garden painting leads to the S·P·A lanes, the Reserve St lane or the lock. The painted pond and
  spring house sit to one side, unrelated to the shots (`desktop/c02-springs`).
- The backglass (`desktop/r03-play`, left) is genuinely good and holds the score up. But it never appears on the
  phone at all (`mobile/r01-title`, `mobile/r02-serve`), so on the target device the table's best art is missing.
- Codex's 7 rests on two captures and a note that the art "competes with hardware", which is an argument against a 7.

### Toys: critics 6.0 / 6.0, mean 6.0. Proposed **5.5**
The 5 anchor says "rails and walls read as grey blocks". The scoop and lock walls are exactly that: tall, matte,
navy-black slabs, several ball-diameters high (`desktop/c04-vapors`, `desktop/c06-arlington`). Beyond what the
critics recorded:
- **Ball.** In play it renders as a translucent glassy puck with a dark cross through it, not a chrome sphere
  reflecting the table (`desktop/r03-play`, `desktop/r06-multiball` crops, every frame of `strips/s01-flip`).
  The 7 anchor names "a chrome ball", and Critic A credited one only from the close-up.
- **Flippers.** The promised SPA CITY decal is missing in both builds (`ab/desktop-c03-flippers`), and the bats have
  no rubber ring.
- **Slingshots.** Each base end shows two black holes. The "rubber band" is a flat dark slab
  (`desktop/c03-flippers`).
- **Posts.** The rubbers are white half-moon blobs sunk into the wall bases (`desktop/c04-vapors`). No chrome dome
  bolt heads are visible on the scoop or lock posts.
- **Ramp and tower.** The ramp walls are literally stair-stepped. The ramp has a visible break seam, no entrance
  flap and no decal, and the wireform has no supports (`desktop/c05-tower`). At the player camera the Mountain Tower
  shrinks to a lantern-sized cab half hidden under the ramp (`desktop/r05-ramp` crop, `mobile/r05-ramp`).
- **Bumpers.** The peach spools have hot specular points on their bases (`desktop/c02-springs`).
- The bathhouses and the tower lattice are the only assets at a 7 standard. They cannot carry the category over
  this list.

### Lighting: critics 6.5 / 6.0, mean 6.25. Proposed **5.5**
- The measurements above show every mood state brighter than base play, with the wizard at +13 %. The 9 anchor
  asks for a mood shift and the 7 anchor for a lit machine. What the captures show is the opposite of a dark-room
  light show.
- The bumper hit rings are opaque orange paint. By frames 2–4 of `strips/s02-bumpers` the three rings merge into
  one peach blob covering the art, which is the "pasted on" language of the 5 anchor.
- The skill-shot lamp has no bloom: in the `desktop/r02-serve` crop, A is barely brighter than S.
- Every bumper base carries hot white LED-like specular points in every frame (`desktop/c02-springs`,
  `desktop/r04-bumpers`).
- The ball shows no playfield reflection (`desktop/r03-play`).
- `desktop/r04-bumpers`, which is labelled "ball in the pop bumpers", shows the ball above the cluster with no
  bumper lit. Its luminance (77.0) is the same as `desktop/r03-play`, so the frame shows no bumper reaction at all.

### Animation: critics 6.5 / 6.5, mean 6.5. Proposed **6.0**
- **`strips/s01-flip`.** The bat goes from down to up between frames 2 and 3 with nothing around the snap: no
  rebound, no flipper-lamp or rubber flash, no ball compression or trail. The ball then climbs at an almost
  constant spacing through frames 4–7. The camera never moves.
- **`strips/s03-multiball`.** It is labelled a three-ball launch, but no frame shows more than one ball. The single
  ball sits beside the tower in frames 5–7 (`desktop/s03-multiball-6`). The strip is a lamp sweep, not a launch,
  and both critics noted as much without marking it down.
- **`strips/s02-bumpers`.** The rings expand and fade, which is the best motion on the table. But the cap sink
  can't be seen, and the steam is grey dot sprites.
- The 7 anchor lists "the camera reacts to nudges" and "steam rises". Neither shows convincingly in any capture.

### UI, DMD and HUD: critics 7.0 / 6.5, mean 6.75. Proposed **6.0**
The 7 anchor says "nothing overlapping". These captures show overlaps in three places, plus other faults:
- **Help.** The text runs under Back on both viewports (`desktop/r09-help`, `mobile/r09-help`). This loop claimed
  to fix it.
- **Phone buttons.** The ☰ and Launch buttons sit on top of the apron card text (`mobile/r02-serve`,
  `mobile/r06-multiball`, `mobile/r08-wizard`).
- **DMD objective lines.** All three mode and multiball stills cut the objective mid-word: "RAMP FOR JACKP"
  (`desktop/r06-multiball`, `mobile/r06-multiball`), "RAMPS AND ORBI" (`desktop/r07-mode`, `mobile/r07-mode`) and
  "L SHOTS LIT ·" (`desktop/r08-wizard`, `mobile/r08-wizard`). This is a regression: in `ab/desktop-r08-wizard`, A
  shows the whole objective, "ALL SHOTS LIT · 60 SECONDS", and B truncates it.
- **Duplicate score.** Desktop shows the score twice (`desktop/r03-play`), and so does phone landscape (DMD and HUD
  both read 1,234,560 in `mobile/r11-landscape`). Neither critic caught the landscape case.
- **Desktop side panel.** About 45 % of the right-hand panel is empty below Launch, and the rest is generic web
  buttons and key-cap hints (`desktop/r02-serve`).
- The silhouettes are a real gain. A DMD with character is worth about a 6.5 on its own, but the overlaps and the
  truncation keep the category off the 7.

### Typography: critics 6.5 / 6.0, mean 6.25. Proposed **5.5**
- **Collisions.**
  - MOUNTAIN TOWER is split by its arrow and laid over COASTER (`mobile/r02-serve`, `desktop/r03-play`).
  - The pink arrow clips the BATHHOUSE ROW sub-line (`desktop/r08-wizard`).
  - THE VAPORS plate is half under a rail (`desktop/c04-vapors`).
- **The Vapors sign** is mirror text, flipped vertically (`desktop/c04-vapors` crop).
- **Small lettering.** The green EXTRA BALL label, THE ARLINGTON, the bathhouse names and the 143°F bumper-cap text
  are all unreadable at the player camera (`desktop/r03-play`, `desktop/r04-bumpers` crop).
- **UI body face.** It is a system sans with no period character (`desktop/r09-help`).
- The 7 anchor asks for "playfield lettering crisp". It is crisp only in the close-ups, and at play scale it
  collides with the art. The slab display face (`desktop/r01-title`) is the one real asset here.

### Readability: critics 6.5 / 6.0, mean 6.25. Proposed **5.5**
- **The skill shot is ambiguous on both viewports.** On the phone, S and A are both lit while the DMD says LANE A
  (`mobile/r02-serve`). On desktop, A has no bloom and barely beats S (`desktop/r02-serve` crop).
- **The ball merges with the steam.** In the upper garden it is a pale translucent disc about the same value as the
  grey steam puffs drifting over it (`desktop/r04-bumpers` 3× crop).
- **The ball washes out on the ramp.** On the milky ramp it is white on pale grey (`desktop/r05-ramp`,
  `mobile/r07-mode` at the ramp foot).
- **Missing and broken shot cues.** There are no inlane or outlane inserts (`desktop/c03-flippers`), and the
  Mountain Tower arrow is tangled in its own label (`mobile/r02-serve`).
- The 5 anchor says "the ball gets lost in the art", and the upper-field captures meet it. Only the lower half earns
  more.

### Mobile: critics 5.5 / 6.0, mean 5.75. Proposed **5.0**
- **Landscape.** It shows only the lower half of the table: the bumpers, Row, lock, lanes and ramp entrance are all
  off-screen (`mobile/r11-landscape`). It also shows the score twice, and the HUD column is empty below its buttons
  (y 380–780).
- **Portrait buttons.** The ☰ and Launch buttons cover the apron card text (`mobile/r02-serve`,
  `mobile/r08-wizard`).
- **Help.** The text runs under Back (`mobile/r09-help`).
- **Backglass.** It is absent on the phone (`mobile/r01-title`, `mobile/r02-serve`).
- **Mountain Tower.** It reads as a speck under the ramp (`mobile/r05-ramp`).
- One of the two required viewports fails outright. The 5 anchor ("works but cramped") is the ceiling for
  landscape, and portrait has its own overlaps.

### Authenticity: critics 7.5 / 7.0, mean 7.25. Proposed **6.5**
- The Row is strong: eight bathhouses, named and in order (`desktop/c01-row`), plus the 143 °F springs and hedged
  facts (`desktop/r09-help`).
- Two of the five landmarks the 7 anchor names fail:
  - **The Vapors** is an anonymous white box whose only sign is mirror text (`desktop/c04-vapors`).
  - **The Arlington** is a small red-roofed toy castle that reads only through its label (`desktop/c06-arlington`).
- **Mountain Tower.** It is convincing in close-up (`desktop/c05-tower`) but nearly invisible at the player camera
  on both viewports (`desktop/r05-ramp`, `mobile/r05-ramp`).
- **Labels.** The Vapors neon blade covers the Superior and Hale labels (`desktop/c01-row`).
- Codex's 7.5 credits "Arlington and Vapors" as establishing the place while conceding that the labels do the
  identifying. That is a 6.5, not a 7.5. The score still clears the gate of 6.

## IP check
Clean on the captures:
- **Commercial pinball.** No machine name, title, logo or recognisable art appears.
- **Paintings.** At 3×, the backglass neon canopy and buildings carry no lettering (`desktop/r03-play` crop), and
  the playfield painting has no text beyond the authored plates.
- **Real businesses.** The Arlington and the Vapors are real, still-operating businesses. They appear by name and
  as generic models only, with no logo, so this passes the rule. The developer should keep the Vapors sign generic
  when fixing it, and not copy the venue's actual signage.

## Proposed total: 51.5 / 90

```json
{
  "loop": 3,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r02-serve", "note": "MOUNTAIN TOWER plate overlaps COASTER insert and is split by its arrow" },
      { "shot": "desktop/r08-wizard", "note": "pink arrow clips the BATHHOUSE ROW sub-line under the logo" },
      { "shot": "desktop/r03-play", "note": "flat disc/triangle inserts with no surround; empty terrazzo between slings and mode row; backglass strong" },
      { "shot": "desktop/c02-springs", "note": "garden painting does not lead to S-P-A lanes, Reserve St or lock" },
      { "shot": "mobile/r01-title", "note": "backglass art never shown on phone" } ] },
    "toys": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "scoop walls are tall matte black slabs; overlapping olive tube ends; white half-moon post blobs; Vapors a white box" },
      { "shot": "desktop/c05-tower", "note": "stair-stepped ramp walls, seam, no flap, unsupported wireform" },
      { "shot": "desktop/c03-flippers", "note": "no SPA CITY decal, no rubber ring; sling ends show two black holes" },
      { "shot": "desktop/r03-play", "note": "ball renders as translucent puck with dark cross, not chrome" },
      { "shot": "strips/s01-flip", "note": "same glassy puck ball in every frame" },
      { "shot": "desktop/c01-row", "note": "bathhouses are the one asset at 7 standard" } ] },
    "lighting": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "playfield mean luma 87.5 vs 77.5 in r03: wizard 13% brighter, not dimmed" },
      { "shot": "desktop/r06-multiball", "note": "multiball luma 84.0, also brighter than base play" },
      { "shot": "strips/s02-bumpers", "note": "opaque orange ring decals merge into one blob frames 2-4" },
      { "shot": "desktop/r02-serve", "note": "skill-shot lamp has no bloom" },
      { "shot": "desktop/c02-springs", "note": "hot white LED-like specular points on every bumper base" } ] },
    "animation": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "snap between frames 2-3 with no rebound, flash or trail; static camera" },
      { "shot": "strips/s03-multiball", "note": "labelled three-ball launch but no frame shows more than one ball; lamp sweep only" },
      { "shot": "strips/s02-bumpers", "note": "ring expand/fade reads; cap sink invisible; steam is grey dots" } ] },
    "ui": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r09-help", "note": "last bullet runs under pinned Back despite claimed fix" },
      { "shot": "mobile/r09-help", "note": "'what's lit, or pays a mystery award' cut by Back" },
      { "shot": "ab/desktop-r08-wizard", "note": "A shows full 'ALL SHOTS LIT - 60 SECONDS'; B truncates to 'L SHOTS LIT'" },
      { "shot": "desktop/r06-multiball", "note": "'RAMP FOR JACKP' truncated; r07 'ORBI' likewise" },
      { "shot": "mobile/r11-landscape", "note": "score shown twice in landscape" },
      { "shot": "mobile/r02-serve", "note": "menu/Launch cover apron card text" },
      { "shot": "desktop/r07-mode", "note": "horse silhouette DMD has character" } ] },
    "typography": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r02-serve", "note": "MOUNTAIN TOWER split by arrow, laid over COASTER" },
      { "shot": "desktop/c04-vapors", "note": "Vapors neon blade text vertically flipped (V as upside-down A, P as b); THE VAPORS plate half under rail" },
      { "shot": "desktop/r08-wizard", "note": "BATHHOUSE ROW sub-line clipped by arrow" },
      { "shot": "desktop/r03-play", "note": "EXTRA BALL, THE ARLINGTON, bathhouse names unreadable at play camera" },
      { "shot": "desktop/r01-title", "note": "slab display face is the one strong asset" } ] },
    "readability": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r02-serve", "note": "S and A both lit while DMD says LANE A" },
      { "shot": "desktop/r02-serve", "note": "A barely brighter than S, no bloom" },
      { "shot": "desktop/r04-bumpers", "note": "ball is a pale translucent disc of the same value as steam puffs" },
      { "shot": "mobile/r07-mode", "note": "ball white on milky ramp at ramp foot" },
      { "shot": "desktop/c03-flippers", "note": "no inlane/outlane inserts" } ] },
    "mobile": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "only lower half of table; score duplicated; HUD column empty below buttons" },
      { "shot": "mobile/r08-wizard", "note": "menu/Launch cover apron card text" },
      { "shot": "mobile/r09-help", "note": "text under Back" },
      { "shot": "mobile/r02-serve", "note": "portrait framing and full-width DMD good; no backglass anywhere on phone" },
      { "shot": "mobile/r05-ramp", "note": "Mountain Tower a speck under the ramp" } ] },
    "authenticity": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses named and in order; Vapors blade hides Superior/Hale labels" },
      { "shot": "desktop/c04-vapors", "note": "Vapors anonymous white box, sign is mirror text" },
      { "shot": "desktop/c06-arlington", "note": "Arlington a small generic castle, label-dependent" },
      { "shot": "desktop/r05-ramp", "note": "tower nearly invisible at player camera" },
      { "shot": "desktop/r09-help", "note": "facts hedged" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art. Backglass and playfield paintings carry no text at 3x. Arlington and Vapors are real operating businesses shown by name and generic model only; keep the repaired Vapors sign generic." },
  "gaps": [
    { "id": "G-mood-inverted", "category": "lighting", "expectedGain": 0.6, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard"], "fix": "Mode, multiball and wizard blends currently raise playfield luminance (77.5 -> 84-87.5). Make the blend scale ambient, key and fill down. Test: mean playfield luma over x460-820,y30-740 in r08 at least 25% below r03, and r06/r07 at least 10% below r03." },
    { "id": "G-vapors-sign-flipped", "category": "typography", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "The Vapors neon blade texture is vertically flipped (reads 2ROPAV with inverted V and P). Fix the UV/flipY and orient the sign so it reads to the player camera without hiding the Superior/Hale labels. Test: VAPORS reads correctly in a 3x crop of c04 and both labels are fully visible in c01." },
    { "id": "G-label-collisions", "category": "typography", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["mobile/r02-serve", "desktop/r03-play", "desktop/r08-wizard", "desktop/c04-vapors"], "fix": "Add a layout check that fails when any label plate's bounding box intersects an insert, arrow or rail. Move MOUNTAIN TOWER off COASTER and its arrow, shift the pink arrow clear of the BATHHOUSE ROW sub-line, and pull THE VAPORS plate out from under the rail. Test: zero overlaps in the check; MOUNTAIN TOWER unbroken in mobile/r02." },
    { "id": "G-ball-chrome", "category": "toys", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r04-bumpers", "strips/s01-flip"], "fix": "The ball renders as a translucent puck with a dark cross. Use an opaque metal material (metalness 1, roughness about 0.1) with a playfield-derived env map, a dark Fresnel rim and a contact shadow. Test: in r04 the ball has a dark rim and a peak/surround luma ratio of at least 2.5, and no cross artefact shows in a 3x crop." },
    { "id": "G-help-footer-regress", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help"], "fix": "The claimed extra space did not take effect. Make the help body a scroll container that ends above the pinned Back button (padding-bottom at least the button height plus 16 px). Test: in r09 on both viewports no glyph is drawn under or behind Back." },
    { "id": "G-dmd-objective-truncation", "category": "ui", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["ab/desktop-r08-wizard", "desktop/r06-multiball", "desktop/r07-mode"], "fix": "Regression from the previous build, which showed the full objective. Show a complete short objective statically beside the silhouette (wrap or shorten to fit), and scroll only overflow detail. Test: r06, r07 and r08 stills contain no word cut at the DMD edge." },
    { "id": "G-multiball-launch-visible", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s03-multiball", "desktop/r06-multiball"], "fix": "Stagger the lock ejects with a kick flash and a short camera shake so all balls appear within the launch window. Test: at least two balls are visible in two or more frames of s03, plus a visible eject flash." },
    { "id": "G-landscape-hud-dup", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Apply the portrait no-duplicate rule in landscape and use the empty HUD column (y 380-780) for mode/progress or a backglass thumbnail. Test: the score appears once in r11 and the column has no empty band over 150 px." },
    { "id": "G-phone-backglass", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r01-title", "mobile/r02-serve"], "fix": "Show the backglass painting on the phone title and pause screens (behind the menu card, unblurred). Test: backglass art visible in mobile/r01." }
  ]
}
```

# Advocate: loop 5

Critic means (A critic-claude / B critic-codex): art 6.75, toys 6.5, lighting 6.5, animation 6.5, ui 7.0, typography
6.25, readability 6.5, mobile 6.25, authenticity 7.25. Total 59.5. Each score I propose stays within ±1 of these means.

## Summary

Both critics are mostly fair, and on the headline lighting change Critic A is right. I measured the stills, and the
mood darkening is nearly invisible in them. But Critic A states several things as fact that the captures contradict:

- that lit bathhouse plates erase their names,
- that the ramp has no transmission and no edge highlights,
- that nothing on the bumpers moves,
- that the GI never shifts in multiball,
- that the help text is about 11 px,
- that the sling plastics are flat colour fills.

Critic B (codex) overstates three things: the ramp hurting ball contrast, wizard bloom merging the inserts, and the
Vapors being "mostly hidden". B also credits mode darkness that the stills do not show. Several gaps blame the wrong
cause, or have tests the current build already passes.

## Plainly wrong facts

1. **Critic A: "Lit building plates blow out to featureless white rectangles … the plate text vanishes" (`desktop/c01-row`).**
   - The glowing rectangles are lamp inserts, and they sit *above* separate dark name tags.
   - In `desktop/c01-row` the tags FORDYCE and OZARK sit directly under the two brightest lit lamps, and both read cleanly. So do MAURICE, QUAPAW, BUCKSTAFF and LAMAR.
   - The test A wrote for G-plate-glare ("FORDYCE and OZARK legible while lit in C01") already passes.
2. **Critic A: the ramp has "no clear-plastic transmission, no edge highlights" (`desktop/c05-tower`).**
   - In `desktop/c05-tower` the brick and tile pattern of the playfield shows through the lower ramp bed (about y 480–740), and a fainter version shows through the upper run.
   - Both side walls carry a row of white bevel highlights along their top edges.
   - The ramp is pale and grey-tinted. It is not an opaque slab.
3. **Critic A: in the bumpers "there is no visible ring or skirt kick" (`strips/s02-bumpers`).**
   - I cropped the left bumper in the full-size frames `desktop/s02-bumpers-0…7` (region 250–450 × 230–430).
   - In frames 0–1 the cap sits low on the chrome skirt, and only a thin teal sliver of the body shows.
   - In frames 2–7 the glowing body band is roughly 1.5–2× taller.
   - That is a mechanical displacement, as Critic B says ("bumper caps change height"). It is small, but it is there.
4. **Critic A: in `strips/s03-multiball` "the GI never shifts".**
   - Median luma of an unlit art patch in the upper left of `desktop/s03-multiball-N` (360–470 × 40–120) falls from 59 in frame 1 to 45 in frames 3–6.
   - That is about a 24% fall as the multiball starts, while the insert arc lights. The GI does dim inside the strip.
5. **Critic A: the desktop help is "a dense two-column block at about 11 px" (`desktop/r09-help`).**
   - The body lines in `desktop/r09-help` run at about a 23 px line pitch, with roughly 15 px type.
   - Only the "About" paragraph is smaller (about 13 px).
6. **Critic A: "the flat coral and teal sling plastics read as colour fills" (`desktop/c03-flippers`).**
   - In `desktop/c03-flippers` both slings show translucent plastic over a dark frame, with diagonal specular streaks and a lighter inner edge.
   - They are undecorated, but they are not flat fills.
7. **Critic B: "Mode darkness helps" (lighting). Critic A is right and B is wrong here, against the build.**
   - Median luma of an unlit lower-field patch (480–600 × 620–700):

     | Frame | Median luma | Share of play |
     |---|---|---|
     | `desktop/r03-play` (normal play) | 81 | 100% |
     | `desktop/r07-mode` (mode) | 79 | ≈ 97% |
     | `desktop/r06-multiball` (multiball) | 75 | ≈ 92% |
     | `desktop/r08-wizard` (wizard) | 73 | ≈ 90% |

   - The other two patches I sampled agree. The stills do not show the stated 75% / 55% / 35%.
8. **Critic B: the balls "lose contrast against the pale ramp" (`mobile/r05-ramp`).**
   - In `mobile/r05-ramp` the ball on the ramp (about 655, 655) is the brightest object in that column, with a warm specular core.
   - It is easier to find than the balls on the painted field.
9. **Critic B: "Wizard bloom merges mode inserts into a violet band" (`mobile/r08-wizard`).**
   - In `mobile/r08-wizard` and `desktop/r08-wizard` the six inserts stay separate discs, and the SOAK…COASTER labels sit legibly under each one at 2×.
   - Some merging happens only in the close-camera `strips/s03-multiball` frames 4–6.

## Category by category

### Art: critics 6.5 / 7.0, I propose 7.0

- **Concede.**
  - The lower half has less narrative than the top.
  - The upper foliage is busy around the bumpers (`strips/s02-bumpers`).
- **Rebut "lush but generic … could be any garden" (A).**
  - `desktop/c02-springs` shows a stone spring-house arch and a stepped tufa cascade into a pool, painted directly behind the Arlington model.
  - That reads as the Arlington Lawn cascade and display springs, not a generic garden.
  - The rail labels (THERMAL SPRINGS, CENTRAL AVENUE, RESERVE ST in `desktop/c01-row` and `desktop/c04-vapors`) tie the painting to real streets.
- **Rebut "plain … colour fills" for the lower field (A).**
  - `desktop/c03-flippers` is a speckled terrazzo with an inlaid deco fan.
  - The fan's rays point up toward the 2X–5X row and the SOAK…COASTER arc, so the art follows the layout.
  - The SPA CITY / BATHHOUSE ROW · HOT SPRINGS centrepiece (`desktop/r03-play`) is integrated lettering, as the 7 anchor asks.
- **Backglass.** Both critics agree it is the strongest asset, in the same hand and palette as the field (`desktop/r02-serve`).
- **Verdict.** Every zone is themed and the inserts are integrated. That meets the 7 anchor short of "art directs the eye".

### Toys: critics 6.5 / 6.5, I propose 7.0

- **Concede.**
  - The plain cream plinths (`desktop/c01-row`).
  - The oversized brass lane guides (`desktop/c04-vapors`, `desktop/c06-arlington`).
  - No wear or weathering.
  - The ramp is pale.
- **Rebut the ramp claim** (fact 2 above): `desktop/c05-tower` shows transmission and edge bevels.
- **Rebut "ball reads as peach glass" as a material fault (A).**
  - The ball is a clean mirror chrome that reflects the terrazzo in `desktop/c03-flippers` (top centre) and in `strips/s01-flip`.
  - The warm cast appears only in `strips/s02-bumpers` frames 0–2, right beside a flashing bumper cap and a warm lane lamp. That is reflection plus bloom, not metalness.
- **Evidence the critics underweight.**
  - Every landmark reads at a glance in `desktop/c01-row` and `desktop/c06-arlington`: Quapaw's tiled dome and lantern, Ozark's twin towers, Hale's red hip roof, Fordyce's glass roof, the Arlington's twin turrets.
  - The bumpers have decal caps and chrome skirts (`desktop/c02-springs`).
  - The lattice tower and wireform hold up (`desktop/c05-tower`).
- **Verdict.** That is the 7 anchor ("every toy reads at a glance … chrome ball"), held back only by the guides and plinths.

### Lighting: critics 6.5 / 6.5, I propose 6.5

- **Concede** the mood darkening in the stills (fact 7). It is the biggest lighting miss.
- **Concede** the Vapors marquee glare (`desktop/c04-vapors`) and the weak contact shadows (`desktop/c06-arlington`).
- **Rebut** the "plate glare erases names" cause (fact 1).
- **Credit what the critics missed.**
  - The GI does dim inside `strips/s03-multiball` (fact 4).
  - Inserts bloom only when lit: compare the dull 4X and 5X with the lit 2X and 3X in `desktop/c03-flippers`.
  - The wire rails no longer streak (`desktop/c05-tower`).
- **Verdict.** It nets out at 6.5.

### Animation: critics 6.5 / 6.5, I propose 7.0

- **Concede.**
  - No camera reaction is shown.
  - No flipper anticipation (`strips/s01-flip`: down in frames 0–2, up in frame 3).
  - Phone steam is still dots (`mobile/r03-play`, `mobile/r11-landscape`).
- **Rebut the bumper and GI claims** (facts 3 and 4).
- **What the strips show.** Against the 7 anchor ("flippers snap, bumpers flash and drop, steam rises, light shows run"), the strips show:
  - the snap (`strips/s01-flip` frame 3),
  - the flash plus a cap or skirt displacement (`strips/s02-bumpers` frames 0–1 against 2–7),
  - large soft steam columns (`strips/s02-bumpers`, `desktop/c02-springs`),
  - a chasing light show with GI dimming (`strips/s03-multiball`).
- **The one missing anchor item.** Camera reaction to nudges has no capture, so its absence is not demonstrated either.

### UI: critics 7.0 / 7.0, I propose 7.0

- **Concede.**
  - The desktop right column is sparse (`desktop/r08-wizard`).
  - Phone steam drifts into the HUD band (`mobile/r03-play`).
- **Rebut** B's G-help.
  - The bottom fade in `desktop/r09-help` and `mobile/r09-help` is itself the scroll cue: the last line visibly fades into the panel, above a full-width Back.
  - The content is complete up to that point.
- **Strengths.**
  - The DMD icons (horse in `desktop/r07-mode`, towers in `mobile/r06-multiball`, steaming mountain in `mobile/r08-wizard`) give each mode a picture.
  - The gold-framed menus (`mobile/r10-scores`, `desktop/r01-title`) are coherent.

### Typography: critics 6.5 / 6.0, I propose 6.5

- **Concede** the playfield micro-type at play scale.
  - In `mobile/r03-play` the insert labels are about 8 device px (about 4 CSS px), and EXTRA BALL is dim green.
  - The SUPERIOR tag is clipped ("SU HALE") in `desktop/c01-row`.
- **Rebut** the 11 px help claim (fact 5) and the vanishing plate text (fact 1).
- **Strengths.**
  - The display faces are deliberate: the neon serif PINBALL with tracked SPA CITY (`desktop/r01-title`), and the slab "How to play" and "High scores" (`mobile/r09-help`, `mobile/r10-scores`).
  - The DMD dot font is clean and fills its panel on phone (`mobile/r08-wizard`).
  - The close-up lettering is crisp: SHOOT AGAIN, THE ARLINGTON, LOCK (`desktop/c03-flippers`, `desktop/c06-arlington`).
- **Verdict.** B's 6.0 weights one failure (gameplay label size) over everything else.

### Readability: critics 6.5 / 6.5, I propose 6.5

- **Concede.**
  - The desktop ball is small (`desktop/r03-play`).
  - Busy foliage around the bumpers (`strips/s02-bumpers`).
  - Multiball is findable rather than instant (`mobile/r06-multiball`: top arch, between the flippers, shooter lane).
- **Rebut** B on ramp contrast and wizard merging (facts 8 and 9).
- **Rebut** A's "blown-out plates erase names" (fact 1).
- **Strengths.**
  - Shot arrows in distinct colours, and a clear lit/unlit contrast (`mobile/r08-wizard` against `mobile/r03-play`).
  - The skill-shot lamp holds (`desktop/r02-serve`).

### Mobile: critics 6.5 / 6.0, I propose 6.5

- **Concede the landscape problems** (`mobile/r11-landscape`).
  - The view is steep and foreshortened.
  - About the top fifth is empty black.
  - The HUD column is sparse.
- **Concede** the micro-type in portrait.
- **Rebut** B's suggestion that portrait shares the problem.
  - `mobile/r03-play` fills the width, with the DMD on top and readable.
  - The ☰ and Launch buttons sit in the apron below the flippers, clear of the ball's area (`mobile/r08-wizard`).
  - The help and scores panels are sized for 390 px, with about 15 CSS px body text (`mobile/r09-help`, `mobile/r10-scores`).
- **Verdict.** One weak frame in eleven should not pull the category to 6.0.

### Authenticity: critics 7.0 / 7.5, I propose 7.5

- **Concede** that at play scale the Row shrinks to small cream blocks (`mobile/r03-play`), and the marquee lettering is washed out (`desktop/c04-vapors`).
- **Rebut A's "garden … not specifically Hot Springs"**: see Art (`desktop/c02-springs`).
- **Rebut B's "mostly hidden club entrance".**
  - In `desktop/c04-vapors` the canopy and marquee face the player.
  - A large THE VAPORS plate sits beside the scoop (`desktop/c01-row`, `desktop/c04-vapors`).
- **Credit what the critics underweight.**
  - The Row order on the table matches the order written in the help: Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff, Lamar (`desktop/c01-row`, `desktop/r09-help`).
  - The facts are hedged, and there is a no-affiliation note (`desktop/r09-help`).
  - 143 °F, Central Avenue, Reserve St and Derby Day ground it further.

## Gaps (no new gaps; severity and gain adjusted)

| Gap | Critic | Original sev / gain | Advocate sev / gain | Reason |
|---|---|---|---|---|
| G-mood-dim-invisible | A | 4 / 0.5 | 4 / 0.4 | Conceded (fact 7). The multiplier does reach the art over time (`strips/s03-multiball`), so the fix is the depth and ramp, not only its scope. |
| G-ramp-material | A | 4 / 0.5 | 3 / 0.3 | Transmission and edge bevels exist (`desktop/c05-tower`). What's missing is a decal and less grey tint. |
| G-plate-glare | A | 3 / 0.3 | 2 / 0.1 | Wrong cause. The names sit on separate tags and stay legible (`desktop/c01-row`), and the test already passes. The real glare is the Vapors marquee, covered below. |
| G-playfield-micro-type | A | 3 / 0.4 | 3 / 0.4 | Conceded (`mobile/r03-play`). |
| G-vapors-marquee-legibility | A | 3 / 0.3 | 3 / 0.3 | Conceded (`desktop/c04-vapors`). |
| G-desktop-table-scale | A | 3 / 0.4 | 2 / 0.2 | The table already spans about 97% of the 800 px height (`desktop/r03-play`). A 45% width target at 1280 × 800 would need cropping or flattening a portrait table. |
| G-landscape-framing | A | 3 / 0.4 | 3 / 0.4 | Conceded (`mobile/r11-landscape`). |
| G-ball-chrome | A | 3 / 0.3 | 2 / 0.15 | The ball is mirror chrome in `desktop/c03-flippers` and `strips/s01-flip`. The tint in S02 is reflection and bloom. |
| G-bumper-kick | A | 3 / 0.3 | 2 / 0.2 | A kick exists (fact 3). The fix should amplify it, not add it. |
| G-brass-guides | A | 2 / 0.3 | 2 / 0.3 | Conceded. |
| G-mobile-steam-dots | A | 2 / 0.2 | 2 / 0.2 | Conceded (`mobile/r03-play`). |
| G-superior-plate | A | 2 / 0.2 | 2 / 0.2 | Conceded ("SU HALE" in `desktop/c01-row`). |
| G-lower-field-art | A | 2 / 0.3 | 1 / 0.1 | Speckled terrazzo and fan, not flat fill (`desktop/c03-flippers`). The test already passes. |
| G-labels | B | 4 / 1.0 | 4 / 0.5 | Real, but it overlaps G-playfield-micro-type, and +1 typography from labels alone is optimistic when menus and DMD are already good. |
| G-materials | B | 4 / 1.0 | 3 / 0.5 | A bundle of several items. The ramp already transmits. |
| G-bloom | B | 4 / 1.0 | 3 / 0.4 | Lit target names stay legible (`desktop/c01-row`). The Vapors marquee glare and contact shadows are real. |
| G-landscape | B | 4 / 1.0 | 3 / 0.5 | One frame in eleven. Duplicates G-landscape-framing. |
| G-art-noise | B | 3 / 0.5 | 3 / 0.3 | Partly conceded (`strips/s02-bumpers`). |
| G-followthrough | B | 3 / 0.5 | 2 / 0.3 | Bumper displacement already exists. Lock-release isn't captured. |
| G-help | B | 2 / 0.5 | 2 / 0.1 | The fade is the cue, and the body reads (`desktop/r09-help`, `mobile/r09-help`). |

**Proposed total: 61.5 / 90.**

```json
{
  "loop": 5,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "art": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c02-springs", "note": "spring-house arch and tufa cascade behind the Arlington: Hot Springs-specific, not a generic garden" },
      { "shot": "desktop/c03-flippers", "note": "speckled terrazzo with a deco fan whose rays point at the 2X-5X row and mode arc; slings translucent, not flat fills" },
      { "shot": "desktop/r02-serve", "note": "backglass in the same hand and palette as the field" },
      { "shot": "desktop/r03-play", "note": "SPA CITY centrepiece and insert arcs integrated with the layout" } ] },
    "toys": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "desktop/c01-row", "note": "every bathhouse reads by its signature; plinths plain (conceded)" },
      { "shot": "desktop/c05-tower", "note": "ramp transmits playfield brick/tile and has white bevel edges; tower and wireform hold up" },
      { "shot": "desktop/c03-flippers", "note": "ball is mirror chrome reflecting the terrazzo" },
      { "shot": "desktop/c06-arlington", "note": "Arlington twin turrets read; brass guides oversized (conceded)" } ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r07-mode", "note": "lower-field median luma 79 vs 81 in r03: mood dim nearly invisible (conceded)" },
      { "shot": "strips/s03-multiball", "note": "upper-left art luma falls 59 -> 45 across frames 1-4: GI does dim in the strip" },
      { "shot": "desktop/c01-row", "note": "lit lamps bloom, but names on separate tags stay legible" },
      { "shot": "desktop/c04-vapors", "note": "Vapors marquee glare (conceded)" } ] },
    "animation": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps up in frame 3, ball leaves cleanly; no anticipation (conceded)" },
      { "shot": "strips/s02-bumpers", "note": "left bumper body band about half as tall in frames 0-1 as 2-7: visible cap/skirt displacement plus flash; soft steam" },
      { "shot": "strips/s03-multiball", "note": "insert arc chase with GI dimming" },
      { "shot": "mobile/r03-play", "note": "phone steam still dots (conceded)" } ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r07-mode", "note": "DMD horse icon, clear two-line layout" },
      { "shot": "mobile/r06-multiball", "note": "Arlington towers DMD art" },
      { "shot": "desktop/r09-help", "note": "bottom fade works as scroll cue above full-width Back" },
      { "shot": "desktop/r08-wizard", "note": "sparse right column (conceded)" } ] },
    "typography": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate neon serif lockup with tracked SPA CITY" },
      { "shot": "desktop/r09-help", "note": "body about 15 px on a 23 px pitch, not 11 px" },
      { "shot": "mobile/r03-play", "note": "insert labels about 4 CSS px, illegible at 1x (conceded)" },
      { "shot": "desktop/c01-row", "note": "SUPERIOR clipped to 'SU' (conceded); FORDYCE/OZARK legible while lit" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r05-ramp", "note": "ball on ramp is the brightest object in the column" },
      { "shot": "mobile/r08-wizard", "note": "six wizard inserts stay separate discs with legible labels" },
      { "shot": "mobile/r06-multiball", "note": "three balls findable, not instant (conceded)" },
      { "shot": "desktop/r03-play", "note": "desktop ball small (conceded)" } ] },
    "mobile": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait fills width, DMD readable, buttons in the apron clear of the ball" },
      { "shot": "mobile/r09-help", "note": "panels sized for 390 px, about 15 CSS px body" },
      { "shot": "mobile/r11-landscape", "note": "steep, squat landscape with empty black above (conceded)" } ] },
    "authenticity": { "score": 7.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c01-row", "note": "Row order matches the help text; signatures readable; THE VAPORS plate" },
      { "shot": "desktop/c02-springs", "note": "spring-house and tufa cascade read as the Arlington Lawn cascade" },
      { "shot": "desktop/c04-vapors", "note": "supper-club canopy and marquee face the player; lettering washed out (conceded)" },
      { "shot": "desktop/r09-help", "note": "facts hedged, no-affiliation note" } ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: no commercial pinball names, logos or art; no text in the paintings." },
  "gaps": [
    { "id": "G-mood-dim-invisible", "category": "lighting", "expectedGain": 0.4, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r07-mode", "desktop/r08-wizard", "desktop/r03-play", "strips/s03-multiball"], "fix": "Conceded. Deepen the mode/multiball/wizard multiplier on playfield and toy ambient/env intensity so stills reach the stated levels; s03 shows the ramp exists but is shallow. Test: unlit art patch in r08 <= 45% of r03, r07 <= 80%." },
    { "id": "G-ramp-material", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "Transmission and edge bevels already exist; reduce the grey tint, add a printed decal or arrow. Test: ramp reads clear with a decal in c05." },
    { "id": "G-plate-glare", "category": "lighting", "expectedGain": 0.1, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c01-row"], "fix": "Wrong cause: names sit on separate tags and stay legible while lit. At most trim lamp bloom radius slightly." },
    { "id": "G-playfield-micro-type", "category": "typography", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["desktop/r03-play", "mobile/r03-play"], "fix": "Conceded. Minimum 7 CSS px cap height at 390 portrait for insert and plate labels; fix EXTRA BALL contrast." },
    { "id": "G-vapors-marquee-legibility", "category": "authenticity", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Conceded. Dark marquee backing, thinner capped-emissive neon. Test: VAPORS legible in c04." },
    { "id": "G-desktop-table-scale", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["desktop/r03-play", "desktop/r08-wizard"], "fix": "Table already spans about 97% of viewport height; at most a slight zoom or flatter pitch. A 45% width target would crop a portrait table at 1280x800." },
    { "id": "G-landscape-framing", "category": "mobile", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Conceded. Flatter pitch filling height, slim score rail." },
    { "id": "G-ball-chrome", "category": "toys", "expectedGain": 0.15, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["strips/s02-bumpers", "desktop/c03-flippers"], "fix": "Ball is already chrome (c03, s01); the warm cast near lit bumpers is reflection and bloom. Limit bloom on the ball, or cool its environment slightly." },
    { "id": "G-bumper-kick", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/s02-bumpers"], "fix": "A cap/skirt displacement already shows (frames 0-1 vs 2-7); amplify it and add a small camera nudge on hard hits." },
    { "id": "G-brass-guides", "category": "toys", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Conceded. Thin wire or flat metal guides on posts." },
    { "id": "G-mobile-steam-dots", "category": "animation", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["mobile/r03-play", "mobile/r11-landscape"], "fix": "Conceded. Scale puff sprites by DPR and tier to match desktop." },
    { "id": "G-superior-plate", "category": "typography", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c01-row"], "fix": "Conceded. Move the SUPERIOR tag clear of the Vapors marquee." },
    { "id": "G-lower-field-art", "category": "art", "expectedGain": 0.1, "severity": 1, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c03-flippers"], "fix": "The lower field is speckled terrazzo with a deco fan, not flat fill, so the test already passes. At most decorate the sling plastics." },
    { "id": "G-labels", "category": "typography", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS5", "evidence": ["mobile/r03-play", "desktop/c01-row"], "fix": "Real but overlaps G-playfield-micro-type. Enlarge mode legends and simplify wording; verify at 390 CSS px." },
    { "id": "G-materials", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c05-tower", "desktop/c06-arlington"], "fix": "Bundle; the ramp already transmits. Lower or detail the plinths, bevel wall ends, add ramp supports." },
    { "id": "G-bloom", "category": "lighting", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Lit target names already read (c01); target the Vapors marquee bloom and add contact shadows under buildings and walls." },
    { "id": "G-landscape", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Duplicate of G-landscape-framing; one frame in eleven. Raise the camera toward overhead and enlarge the table." },
    { "id": "G-art-noise", "category": "art", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS4", "evidence": ["strips/s02-bumpers", "desktop/c02-springs"], "fix": "Partly conceded. Lower foliage contrast directly around the bumpers." },
    { "id": "G-followthrough", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s03-multiball"], "fix": "Bumper displacement already exists; add a visible lock-release and a recovery frame." },
    { "id": "G-help", "category": "ui", "expectedGain": 0.1, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help"], "fix": "The fade already acts as a scroll cue; optionally add bottom padding so the last line clears Back." }
  ]
}
```

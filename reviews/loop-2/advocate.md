# Advocate: loop 2

All capture paths are relative to `games/Pinball/screenshots/review-loop-2/` and match the lowercase names on disk.
Critic means: art 6.75, toys 5.25, lighting 5.75, animation 6.0, ui 6.5, typography 6.25, readability 6.0, mobile 6.5,
authenticity 7.0 (total 56.0). Every proposal below stays within ±1 of those means.

## Summary

Both critics see the same build, and most of their criticism holds. The walls really are flat boxes, the slingshots have
no rubber, the wizard still frame does not change the room, the phone DMD shrank, and the help footer covers the last
line. I concede those points. Where they overreach:
- Critic A gets four things plainly wrong:
  - the flipper shape;
  - what the peach bumper bodies are;
  - which bathhouse label is hidden;
  - whether multiball changes the room.
- Both critics undercount how distinct the bathhouse rooflines are.
- Codex overstates how badly the ball blends into the ramp.
- Two gaps (sling animation and desktop framing) blame the build for things that come from capture coverage or the
  table's portrait aspect ratio.

**Proposed total: 58.5.**

## Facts the critics got plainly wrong

1. **Flipper taper (Critic A, toys).** Critic A said the flippers have "no ... bat-shaped taper". In `desktop/c03-flippers.png`
   both bats taper clearly, from a broad round pivot end with a chrome pivot cap down to a narrow rounded tip. A red
   rubber band runs along the playing edge.
2. **Bumper bodies (Critic A, toys).** Critic A described them as a "matte peach cylinder that looks like skin, not lit
   plastic". In `strips/s02-bumpers.png` the skirts are peach and glowing in frames 0–4, while the lamp is on. By frames
   5–7 they have gone dark and chrome, and the cap glow is gone. So the peach is the lit plastic state. Frame-wide mean
   brightness also drops from about 94 to 77 as the flash decays, which means the bumper flash lights the art around it.
3. **Which label is hidden (Critic A, typography/art).** Critic A wrote that "HALE is still cut off by the left kicker
   housing". In `desktop/c01-row.png`, HALE is fully legible. The label partly hidden is the one to its left
   (Superior), and what hides it is the Vapors neon sign housing, whose vertical "VAPORS" tube is itself readable there.
   The defect is real, but it names the wrong label and the wrong cause.
4. **Multiball changes nothing in the room (Critic A, lighting).** Critic A said "the room around it stays the same" in
   `strips/s03-multiball.png`. In frames 4–6 the whole frame shifts toward purple: mean blue rises from about 39 to
   47–50 while red drops from about 65 to 61. The purple wash over the lower field is visible against frame 3. The mode
   and wizard stills do not show a room change (point 3 under Lighting), but the multiball strip does.

## Category by category

### Art: critics 6.5 / 7, mean 6.75 → propose 7.0
- **Concede:** the label collisions are real.
  - The vertical "THE VAPORS" label runs into the S of the SPA CITY logo (`mobile/r02-serve.png`). In the close-up only
    "RS" shows (`desktop/c04-vapors.png`).
  - The Mountain Tower arrow insert sits on the word TOWER (`mobile/r02-serve.png`).
  - The upper foliage is busy at desktop scale (`desktop/r03-play.png`).
- **Rebut ("lower third is a large, mostly even terrazzo field" with only four inserts and a star):** in
  `desktop/c03-flippers.png` the fan is a designed figure, not an even field:
  - red and blue petals rise from the shoot-again star;
  - concentric gold arch bands frame the 2X–5X row;
  - in `desktop/r03-play.png` the petals point up toward the Valley of the Vapors mode arc and the SPA CITY logo.

  That is art leading the eye to the shots, even if it is not yet shot-coloured.
- Both critics agree, and `ab/desktop-r03-play.png` and `ab/desktop-c03-flippers.png` confirm, that A's continuous
  painting is composed around the layout. The backglass is in the same hand (`desktop/r02-serve.png`). That meets the
  rubric's 7 anchor: "painted art composed around the layout, every zone themed ... backglass in the same hand". The
  collisions are vector-overlay placement faults, not painting faults.

### Toys: critics 5 / 5.5, mean 5.25 → propose 5.5
- **Concede:**
  - Walls and guides are flat, unbevelled dark boxes with flat ochre caps (`desktop/c04-vapors.png`,
    `desktop/c06-arlington.png`).
  - The slingshots sit on white blocks with no visible rubber (`desktop/c03-flippers.png`).
  - The ramp has a visible mid seam and no entrance flap (`desktop/c05-tower.png`).
  - Unlit target inserts are flat rectangles (`desktop/c01-row.png`).

  This is the main gap on the table.
- **Rebut:** the flipper and bumper claims are factually wrong (facts 1 and 2).
- **Rebut:** the bathhouse models are not "interchangeable beige blocks". In `desktop/c01-row.png` and
  `desktop/c06-arlington.png` the rooflines differ:
  - a green hip roof;
  - two red-gabled roofs;
  - a balconied red-trim block;
  - the Quapaw mosaic dome;
  - the twin red-capped white towers;
  - a flat parapet;
  - a low red-tile roof.

  The Arlington has twin towers and red gables. The lattice tower is detailed down to its railing and mast
  (`desktop/c05-tower.png`).
- **Partial rebut, wireform:** Critic A called it "emissive lines"; Codex called it chrome. In `desktop/c05-tower.png`
  the rails show cylinder shading with a white specular core. The blue halo is bloom on top of that, not the whole
  material.
- These are "recognisable models", plus a tapered flipper and lit plastic skirts, sitting above the 5 anchor. The walls
  keep the score well short of 7.

### Lighting: critics 5.5 / 6, mean 5.75 → propose 6.0
- **Concede:**
  - There is a large blue-white glare blob over the left field (`desktop/c06-arlington.png`) and hot white bumper-base
    rings (`desktop/c02-springs.png`).
  - Contact shadows are weak under the bathhouses and the Arlington (`desktop/c01-row.png`).
  - The wizard still frame is not darker than plain play. I measured the playfield mean of `desktop/r08-wizard.png` at
    about 104.9 R against 102.2 for `desktop/r03-play.png`, so the "wizard dims the key light" change is not visible in
    the capture.
- **Rebut:**
  - Lamps bloom only where lit: 2X/3X glow while 4X/5X stay dark (`desktop/c03-flippers.png`).
  - Bumper flashes throw light onto the surrounding art (fact 2, `strips/s02-bumpers.png`).
  - Multiball tints the room (fact 4, `strips/s03-multiball.png`).
  - The ball carries a chrome reflection with a dark horizon band. Both critics accept this, and it is clear in
    `desktop/c03-flippers.png` and on the ramp in `desktop/r05-ramp.png`.

  That is more than "pasted on" lamps. The glare and the flat wizard frame keep it at 6.

### Animation: critics 5.5 / 6.5, mean 6.0 → propose 6.5
- **Concede:**
  - No strip shows mechanical bumper ring travel.
  - `strips/s01-flip.png` shows no lamp reaction.
  - There is no anticipation or follow-through.
- **Rebut ("no slingshot kick or flash appears in any strip"):** this is a capture-coverage fact, not evidence of a
  missing effect. In `strips/s01-flip.png` the ball stays inside the inlane and flipper area and never touches a sling.
  None of the three strips includes a sling contact.
- **What the strips do show:**
  - `strips/s02-bumpers.png`: caps flash green, skirts flash orange, and the flash lights the art, then decays over
    frames 4–7.
  - `strips/s03-multiball.png`:
    - the Row inserts cascade (frames 1–3);
    - the mode arc chases in purple with a frame-wide tint (frames 4–6);
    - the flipper-zone inserts flash;
    - the camera pans with the ball (frame 0 against frame 1).
  - The flipper snaps between frames 2 and 3, and steam drifts.

  The rubric's 7 asks for "flippers snap, bumpers flash ... steam rises, light shows run, the camera reacts". Most of
  that reads in the strips. Mechanical travel and sling proof are missing, so 6.5, not 7.

### UI: critics 6 / 7, mean 6.5 → propose 6.5
- **Concede:**
  - The DMD's left art panel is dithered noise (`desktop/r07-mode.png`, `desktop/r08-wizard.png`).
  - The help footer covers the last bullet on both viewports (`desktop/r09-help.png`, `mobile/r09-help.png`).
  - The score shows twice on the phone (`mobile/r03-play.png`).
- **Rebut ("the DMD does not tell the mode's story"):** every state has its own DMD copy:
  - "SKILL SHOT: LANE A" (`desktop/r02-serve.png`);
  - "ARLINGTON MULTIBALL / RAMP FOR JACKPOTS" (`desktop/r06-multiball.png`);
  - "DERBY DAY / RAMPS AND ORBITS: WIN THE RACE", with a live "Derby · 18/100 · 45s" counter (`desktop/r07-mode.png`);
  - "VALLEY OF THE VAPORS / ALL SHOTS LIT · 60 SECONDS" (`desktop/r08-wizard.png`).

  It falls short of a story, but it does state each objective.
- The title, help and scores screens share one gold-and-navy deco frame (`desktop/r01-title.png`,
  `desktop/r10-scores.png`). The mean is fair.

### Typography: critics 6 / 6.5, mean 6.25 → propose 6.5
- **Concede:**
  - Insert lettering is illegible at desktop table scale (`desktop/r03-play.png`).
  - The phone DMD's four lines are cramped (`mobile/r07-mode.png`).
  - The Mountain Tower arrow covers its label (`mobile/r02-serve.png`).
- **Rebut ("menu body face is a generic system sans"):** the build pairs a slab-serif display face with a UI sans on
  purpose. "How to play" and "High scores" are set in the same slab serif as the PINBALL lockup, over a clean sans body
  (`desktop/r09-help.png`, `desktop/r10-scores.png`, `mobile/r01-title.png`). That is the rubric's "deliberate display
  and UI faces".
- The desktop DMD font is clean and large (`desktop/r03-play.png`, "1,234,560 / BALL 1").
- The bathhouse labels now fit their slots (`desktop/c01-row.png`), apart from the occluded Superior label (fact 3).

### Readability: critics 6 / 6, mean 6.0 → propose 6.5
- **Concede:**
  - The lit skill-shot lane barely differs from the unlit lanes. Zooming `desktop/r02-serve.png`, the A lamp is only
    slightly brighter.
  - Target names are tiny on desktop (`desktop/r03-play.png`).
- **Rebut, ball over foliage (Critic A, `desktop/r04-bumpers.png`):** zoomed, the ball is a bright chrome sphere with a
  dark reflection band, cleanly separated from the dark foliage. It is not lost.
- **Rebut, ramp ball (Codex, "weak separation from pale transparent plastic", `desktop/r05-ramp.png`):** zoomed, the
  ball's dark band and specular highlight separate it clearly from the plastic.
- **Multiball:** all three balls are findable on both viewports. In `desktop/r06-multiball.png` they sit at the top
  arch, between the flippers and in the plunger lane, and `mobile/r06-multiball.png` shows the same.
- Lit and unlit inserts are distinct in `desktop/c03-flippers.png` and `mobile/r07-mode.png`.

  The ball reads everywhere it was captured. The skill-shot lamp is the real miss.

### Mobile: critics 6 / 7, mean 6.5 → propose 7.0
- **Concede:**
  - The portrait DMD shrank. In `ab/mobile-r07-mode.png` A's DMD is roughly half the width of B's.
  - The score is duplicated (`mobile/r03-play.png`).
- **Rebut, landscape "only shows the bottom half" (Critic A, `mobile/r11-landscape.png`):** the brief says the
  landscape camera follows the lowest ball. In this frame the ball is in the lower field, so showing the flippers through
  the mode arc is the designed framing, not a flaw. Codex says the same: the frame cannot prove the transitions either
  way.
- `ab/mobile-r11-landscape.png` shows A's landscape table at several times B's size, and both critics give A 0.8–0.99
  confidence.
- The rubric's 7 asks for three things, and each is met:
  - **Framed on purpose:** portrait fills the width (`mobile/r02-serve.png`, `mobile/r03-play.png`).
  - **Touch controls never cover the ball:** Launch sits below the apron.
  - **DMD readable:** all four lines of `mobile/r07-mode.png` ("DERBY DAY / RAMPS AND / ORBITS: WIN / THE RACE") can be
    read at capture size.

### Authenticity: critics 6.5 / 7.5, mean 7.0 → propose 7.0
- **Concede:**
  - Recognition still leans on labels.
  - The Vapors model is a small white box (`desktop/c04-vapors.png`).
- **Rebut:**
  - The Row's rooflines are distinct (see Toys, `desktop/c01-row.png`).
  - The Vapors has a legible vertical "VAPORS" neon tube in the close-up (`desktop/c01-row.png`).
  - The tufa cascade and spring house (`desktop/c02-springs.png`) and the magnolia backglass (`desktop/r02-serve.png`)
    are specifically local.
  - The help text hedges its facts (`desktop/r09-help.png`).
- 7.0 matches the anchor: the Row recognisable and in order, plus the tower, the Arlington, the Vapors, steam and
  hedged facts.

## Gaps (critics' gaps, adjusted)

| Gap | Critic | Category | Original sev / gain | Adjusted sev / gain | Reason |
|---|---|---|---|---|---|
| G-wall-materials | A | toys | 5 / 1.0 | 5 / 1.0 | Conceded (`desktop/c04-vapors.png`). |
| G-hardware-construction | Codex | toys | 5 / 1.5 | 5 / 1.0 | Duplicates G-wall-materials. The "recess windows" part overlaps G-bathhouse-models. 1.5 in one category is overstated when flippers and bumpers are already past primitive (facts 1–2). |
| G-mode-lighting | A | lighting | 4 / 0.75 | 3 / 0.5 | Real for the mode and wizard stills (measured). The multiball strip already tints the room (fact 4). |
| G-glare | A | lighting | 3 / 0.5 | 3 / 0.5 | Conceded (`desktop/c06-arlington.png`). |
| G-grounding-and-emission | Codex | lighting | 4 / 1.0 | 4 / 0.75 | Real. Overlaps G-glare on the bright bumper bases. |
| G-bathhouse-models | A | authenticity | 4 / 0.75 | 3 / 0.5 | The rooflines are already differentiated (`desktop/c01-row.png`). The remaining need is scale and façade detail. |
| G-dmd-art | A | ui | 4 / 0.75 | 3 / 0.5 | The noise art is real. Per-mode objectives already show (`desktop/r06-multiball.png`, `r07-mode.png`, `r08-wizard.png`). |
| G-mobile-dmd | A | mobile | 3 / 0.5 | 3 / 0.5 | Conceded: a regression this loop (`ab/mobile-r07-mode.png`). |
| G-phone-type-scale | Codex | typography | 4 / 1.0 | 3 / 0.5 | Overlaps G-mobile-dmd. The phone DMD text is legible at capture size (`mobile/r07-mode.png`). |
| G-ramp-wireform | A | toys | 3 / 0.5 | 2 / 0.25 | The wires already show cylinder shading and a specular core. The seam and entrance flap remain (`desktop/c05-tower.png`). |
| G-flipper-model | A | toys | 2 / 0.25 | 1 / 0.1 | The flippers are already tapered with a rubber edge. The bumper skirts are lit plastic (facts 1–2). Only a decal remains. |
| G-label-collisions | A | art | 2 / 0.25 | 2 / 0.25 | Real. The occluded label is Superior, behind the Vapors sign, not HALE (fact 3). |
| G-desktop-framing | A | readability | 3 / 0.5 | 2 / 0.25 | The table already uses the full 800 px height; its width is set by the portrait aspect ratio. The skill-shot flash part is conceded. |
| G-ball-separation | Codex | readability | 4 / 1.0 | 2 / 0.25 | The ball separates on the ramp and in multiball (`desktop/r05-ramp.png` zoom, `mobile/r06-multiball.png`). |
| G-lower-field | A | art | 2 / 0.25 | 1 / 0.1 | The fan petals already point up toward the mode arc (`desktop/c03-flippers.png`, `desktop/r03-play.png`). |
| G-sling-anim | A | animation | 3 / 0.5 | 2 / 0.25 | Mostly a capture gap: no strip includes a sling contact (`strips/s01-flip.png`). |
| G-mechanical-reaction | Codex | animation | 3 / 0.5 | 2 / 0.25 | Overlaps G-sling-anim. The bumper lamp reaction is strong (`strips/s02-bumpers.png`). |
| G-help-footer-clearance | Codex | ui | 3 / 0.5 | 3 / 0.25 | Real on both viewports, but it costs one line. |

```json
{
  "loop": 2,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "art": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c03-flippers.png", "note": "terrazzo fan is a designed figure: petals rise from the star toward the mode arc, arch bands frame the inserts" },
      { "shot": "desktop/r03-play.png", "note": "continuous painting composed around the layout; backglass in the same hand" },
      { "shot": "mobile/r02-serve.png", "note": "conceded: THE VAPORS label runs into SPA CITY; arrow insert on TOWER" }
    ] },
    "toys": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c03-flippers.png", "note": "flippers taper with chrome pivot cap and rubber edge (Critic A wrong); slings lack rubber (conceded)" },
      { "shot": "strips/s02-bumpers.png", "note": "peach bumper skirts are the lit plastic state; dark/chrome when unlit in frames 5-7" },
      { "shot": "desktop/c01-row.png", "note": "bathhouse rooflines differ: green hip, red gables, Quapaw dome, twin towers, parapet, red tile" },
      { "shot": "desktop/c04-vapors.png", "note": "conceded: flat unbevelled box walls with flat caps" },
      { "shot": "desktop/c05-tower.png", "note": "detailed lattice tower; wires shaded with specular core; ramp seam conceded" }
    ] },
    "lighting": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/s03-multiball.png", "note": "frames 4-6 tint the whole frame purple (mean blue 39 -> 47-50)" },
      { "shot": "strips/s02-bumpers.png", "note": "bumper flash lights surrounding art; frame mean 94 -> 77 as it decays" },
      { "shot": "desktop/c03-flippers.png", "note": "inserts bloom only where lit; chrome ball with horizon band" },
      { "shot": "desktop/c06-arlington.png", "note": "conceded: blue glare blob, weak contact shadows" },
      { "shot": "desktop/r08-wizard.png", "note": "conceded: wizard still not darker than r03-play" }
    ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/s03-multiball.png", "note": "Row insert cascade, purple arc chase with room tint, flipper-insert flash, camera pan" },
      { "shot": "strips/s02-bumpers.png", "note": "cap and skirt flash with decay over frames 4-7" },
      { "shot": "strips/s01-flip.png", "note": "flipper snaps between frames 2 and 3; no sling contact in any strip (capture coverage)" }
    ] },
    "ui": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r07-mode.png", "note": "per-mode DMD objective and live counter; dithered art panel conceded" },
      { "shot": "desktop/r01-title.png", "note": "consistent gold-and-navy deco frame across menus" },
      { "shot": "desktop/r09-help.png", "note": "conceded: last bullet under pinned Back" },
      { "shot": "mobile/r03-play.png", "note": "conceded: score duplicated" }
    ] },
    "typography": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r09-help.png", "note": "slab-serif display headings paired with clean UI sans" },
      { "shot": "desktop/r03-play.png", "note": "clean large DMD font; insert lettering tiny (conceded)" },
      { "shot": "desktop/c01-row.png", "note": "labels fit slots; Superior (not HALE) occluded by Vapors sign" },
      { "shot": "mobile/r07-mode.png", "note": "conceded: cramped four-line phone DMD" }
    ] },
    "readability": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r05-ramp.png", "note": "zoomed: ramp ball separated by dark band and highlight" },
      { "shot": "desktop/r04-bumpers.png", "note": "zoomed: ball over foliage reads as bright chrome sphere" },
      { "shot": "mobile/r06-multiball.png", "note": "all three balls findable" },
      { "shot": "desktop/r02-serve.png", "note": "conceded: lit skill-shot lane barely differs" }
    ] },
    "mobile": { "score": 7.0, "confidence": 0.55, "evidence": [
      { "shot": "mobile/r03-play.png", "note": "portrait fills width; Launch below apron, never over the ball" },
      { "shot": "mobile/r11-landscape.png", "note": "follow camera frames the low ball and flippers as designed" },
      { "shot": "mobile/r07-mode.png", "note": "four DMD lines readable at capture size; shrink conceded" },
      { "shot": "ab/mobile-r11-landscape.png", "note": "landscape table several times larger than the previous build" }
    ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row.png", "note": "distinct rooflines in order; legible VAPORS neon tube" },
      { "shot": "desktop/c02-springs.png", "note": "tufa cascade and spring house" },
      { "shot": "desktop/r09-help.png", "note": "eight bathhouses named in order; facts hedged" },
      { "shot": "desktop/c04-vapors.png", "note": "conceded: Vapors model is a small white box" }
    ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics: no commercial machine names, logos or art; no text inside the paintings." },
  "gaps": [
    { "id": "G-wall-materials", "category": "toys", "expectedGain": 1.0, "severity": 5, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors.png", "desktop/c06-arlington.png", "desktop/c03-flippers.png"], "fix": "Bevelled rounded-top guides with lacquered wood or brushed-metal material, chrome bolt heads on posts, real rubber rings on slingshots." },
    { "id": "G-hardware-construction", "category": "toys", "expectedGain": 1.0, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c04-vapors.png", "desktop/c06-arlington.png"], "fix": "Duplicates G-wall-materials: bevel walls, fasteners, plausible rubber attachments, differentiated finishes. Window recesses belong to G-bathhouse-models." },
    { "id": "G-mode-lighting", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r08-wizard.png", "desktop/r07-mode.png", "strips/s03-multiball.png"], "fix": "Extend the multiball room tint (already in s03 frames 4-6) to modes and the wizard; make the wizard key-light dip visible in the still." },
    { "id": "G-glare", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c06-arlington.png", "desktop/c04-vapors.png"], "fix": "Remove the blue glare sprite over the left playfield; cap rollover lamp bloom." },
    { "id": "G-grounding-and-emission", "category": "lighting", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c02-springs.png", "desktop/c06-arlington.png"], "fix": "Soft contact shadows under assemblies; reduce persistent white emission on bumper bases (overlaps G-glare)." },
    { "id": "G-bathhouse-models", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row.png"], "fix": "Rooflines already differ; add scale and signature façade detail (Fordyce canopy, Buckstaff columns, Maurice portico) with contact shadows." },
    { "id": "G-dmd-art", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r07-mode.png", "desktop/r08-wizard.png"], "fix": "Replace the dithered noise panel with real 1-bit mode animations; keep the existing per-mode objective text to two lines." },
    { "id": "G-mobile-dmd", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r07-mode.png", "ab/mobile-r07-mode.png", "mobile/r03-play.png"], "fix": "Restore a >=300 css px phone DMD; move progress into the score-chip row; remove the duplicated score." },
    { "id": "G-phone-type-scale", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["mobile/r02-serve.png", "mobile/r07-mode.png"], "fix": "Overlaps G-mobile-dmd: wider DMD, shorter messages, larger essential target labels at 390 css px." },
    { "id": "G-ramp-wireform", "category": "toys", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower.png"], "fix": "Trim the blue bloom halo on the already-shaded wires; hide the ramp seam and add an entrance flap and thick side rails." },
    { "id": "G-flipper-model", "category": "toys", "expectedGain": 0.1, "severity": 1, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c03-flippers.png", "strips/s02-bumpers.png"], "fix": "Flippers already taper with a rubber edge and bumper skirts are lit plastic; add a top decal only." },
    { "id": "G-label-collisions", "category": "art", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c04-vapors.png", "desktop/c01-row.png", "mobile/r02-serve.png"], "fix": "Move THE VAPORS label clear of the SPA CITY logo, the arrow insert off TOWER, and the Superior label clear of the Vapors sign housing." },
    { "id": "G-desktop-framing", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["desktop/r03-play.png", "desktop/r02-serve.png"], "fix": "Table already fills the 800 px height; make the lit skill-shot lane flash strongly. Widening needs a smaller backglass." },
    { "id": "G-ball-separation", "category": "readability", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r05-ramp.png", "mobile/r06-multiball.png"], "fix": "Ball already separates on ramp and in multiball; minor bloom reduction on competing highlights only." },
    { "id": "G-lower-field", "category": "art", "expectedGain": 0.1, "severity": 1, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c03-flippers.png"], "fix": "Fan petals already point up-field; optionally colour-code them to the lit shots." },
    { "id": "G-sling-anim", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/s01-flip.png"], "fix": "Capture a strip with a sling contact to show the existing flash and dip; strengthen it only if it does not read." },
    { "id": "G-mechanical-reaction", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers.png", "strips/s03-multiball.png"], "fix": "Overlaps G-sling-anim: add visible bumper ring travel alongside the existing strong lamp flash." },
    { "id": "G-help-footer-clearance", "category": "ui", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help.png", "mobile/r09-help.png"], "fix": "Add bottom clearance and a scroll affordance so the last bullet sits fully above Back." }
  ]
}
```

# Prosecutor: loop 4

All capture paths are relative to `games/Pinball/screenshots/review-loop-4/`. I opened every close-up and frame cited
below at full size, plus the three strips and the individual `desktop/s02-bumpers-*` frames. Where I make a numeric
claim I measured it on the PNG: luma 0–255 on the grayscale image.

Critic means: art 6.5, toys 6.25, lighting 6.5, animation 6.25, ui 7.0, typography 6.5, readability 6.5, mobile 6.5,
authenticity 7.25 (total 59.25).

## Summary of the charge
Both critics noticed most of the big defects, then scored as if loop 4's announced changes had landed. Several of
those changes do not show in the captures:
- **Mood darkening.** Using the median rather than the mean luma (so lit lamps can't skew it), the table gets
  *brighter* through the "darker" states. Desktop: r03 77, r06 79, r07 78, r08 81. Phone: 75, 78, 81, 84.
- **The large skill-shot halo.** It isn't there: the lit A lamp is a flat disc, and the unlit S and P sit at half its
  value instead of about 12%.
- **The label layout check.** It passes, but labels are still visibly clipped.

There are also defects neither critic named:
- The gold keylines printed on the playfield don't line up with the 3D slingshots and guides.
- Steam particles draw over the arch rail and the cabinet, and out into the black void.
- The ball reads as a translucent glass marble, not chrome.
- The wizard frame says "ALL SHOTS LIT" while all six mode inserts are dark.

Taken together, most categories belong half a point lower than the critics' means.

## Categories

### Art: mean 6.5, proposed 6.0
- `desktop/c03-flippers`: thin gold keylines on the playfield trace a larger triangle offset from each slingshot. They
  run past its upper and lower corners and show through the translucent sail as crossed lines. The same lines also
  wander alongside the inlane guides without meeting them.
- `desktop/c04-vapors`: the same thing happens at the Vapors. The gold lines run parallel to the brass guides but
  offset from them, and continue about 50 px past the guide ends onto the paving. The printed art was not redrawn
  when the hardware moved, so "art composed around the layout" fails at the very places the 7 anchor names.
- Lettering is not integrated:
  - `desktop/c01-row`: "PERIC HALE", with SUPERIOR hidden under the Vapors post.
  - `desktop/c04-vapors`: CENTRAL AVENUE cut by the lane rail.
  - `desktop/r02-serve` (lower half): "MOUNTAIN TOWE" overflows its plate.
- `desktop/r02-serve`: the plaza between the Row and the SPA CITY logo is mostly bare brick and terrazzo, an empty
  patch in the 5 anchor's sense. The upper third is a generic garden-and-waterfall painting with the bumpers dropped
  on foliage. Nothing in it leads to the orbit or ramp mouths.
- In favour: the lower deco fan (`desktop/c03-flippers`) is composed around the flippers, and the backglass is strong.
  That holds the score at 6.0, not lower.

### Toys and materials: mean 6.25, proposed 5.5
- `desktop/c03-flippers`, slingshots: a translucent sail on a walnut-and-white block. The kicker end is a white box
  with two black hexagonal holes punched in its face. There are no posts, no rubber and no plastic cover; it reads as
  a placeholder primitive. The left outlane wall at upper left is a blue-grey and white block. That is the 5 anchor's
  "rails and walls read as grey blocks", word for word.
- The ball is not chrome:
  - `desktop/c03-flippers` (top): a see-through glassy sphere.
  - `desktop/s02-bumpers-0` to `-2`: a peach-tinted translucent marble.
  - `desktop/r05-ramp`: a beige glassy disc on the ramp.
  - The 7 anchor explicitly requires "a chrome ball".
- `desktop/c04-vapors` and `desktop/c06-arlington`: the brass guides are full cylinders about as thick as the ball,
  sitting on walnut blocks, with marshmallow-like white post rubbers at the ends. Both scoops are bare black holes
  with a chrome ring and no scoop housing or lip. In `desktop/c04-vapors` the Vapors building is a white box with a
  cyan strip, wedged into the guide U with the brass tube cap overlapping its corner.
- `desktop/c01-row` and `desktop/c06-arlington`: the bathhouses and the Arlington are extruded boxes standing on
  cream plinths, with flat window decals and pyramid roofs. There are no cornices or reveals, and no contact shadow.
- `desktop/c05-tower`: the ramp floor has a visible seam and kink at the bend, and the wall tops are beaded ticks. In
  the top-down frames (`desktop/r02-serve`, `desktop/r05-ramp`) the wire return's cross-ties and supports read as
  random slanted white dashes.
- In favour: the teal bumper bodies (`desktop/c02-springs`) and the Mountain Tower lattice are good.
- On the whole this sits closer to "recognisable models in flat materials" (5) than to 7.

### Lighting: mean 6.5, proposed 6.0
- The announced mood darkening is not in the frames. Median table luma:
  - desktop `desktop/r03-play` 77, `desktop/r06-multiball` 79, `desktop/r07-mode` 78, `desktop/r08-wizard` 81;
  - phone `mobile/r03-play` 75, `mobile/r06-multiball` 78, `mobile/r07-mode` 81, `mobile/r08-wizard` 84.
  - The wizard should be the darkest frame and is the brightest. Only `strips/s03-multiball` shows a dimmed table.
- `desktop/r04-bumpers`, `desktop/c02-springs` and `desktop/c06-arlington`: each bumper base has a persistent
  white-out hotspot even when the bumper is unlit. These are the brightest pixels in the upper field and sit right
  next to the ball. Two more persistent glare sources:
  - a white streak on the left-orbit spinner (`desktop/r03-play` at about x 465, y 268; also `mobile/r03-play`);
  - white emissive bars on the wireform (`desktop/c05-tower`, and `mobile/r03-play` lower right).
- The ball, the buildings and the guides cast essentially no contact shadow (`desktop/c01-row`,
  `desktop/c03-flippers`). The 7 anchor requires "soft shadows ground every toy".
- In `strips/s03-multiball` frames 0, 1 and 7, an orange light leak glows in the black void at the upper right,
  outside the cabinet.
- In favour: the interior bumper glow in `strips/s02-bumpers` and the light show in `strips/s03-multiball` keep this
  at 6.0.

### Animation and game feel: mean 6.25, proposed 6.0
- `strips/s01-flip`: the flipper snaps once (frame 3) and the ball rises. Nothing else changes in eight frames: no
  sling, no lamp response, no camera reaction.
- `strips/s02-bumpers` (checked frame by frame in `desktop/s02-bumpers-0` to `-7`):
  - Hits read only as a body brightness pulse. The cap legend blows out to an orange blob ("14●F").
  - I can't confirm the cap movement Critic B credits; the cap-height differences are within the frame-to-frame
    perspective change.
  - The ball passes up and out of the bumpers by frame 3 rather than ricocheting among them.
- Steam is a column of discrete dots, and it isn't occluded. In `desktop/r02-serve` (top edge) and
  `mobile/r11-landscape` the dots draw over the gold arch rail and the cabinet wood and float above the cabinet into
  the void. Steam rising is part of the 7 anchor, and this is a visible effects bug.
- In favour: `strips/s03-multiball` has a real purple chase around the mode arc. That is the one event with
  follow-through.

### UI, DMD and HUD: mean 7.0, proposed 6.5
- In favour: the DMD is the strongest part of the game. `desktop/r07-mode` and `desktop/r06-multiball` show
  silhouettes with complete objectives, and the score appears once.
- The rest of the 7 anchor ("menus in the same deco style") isn't met:
  - `desktop/r01-title`, `desktop/r09-help`, `desktop/r10-scores`, `mobile/r01-title`, `mobile/r09-help`: every menu
    is plain rounded web buttons in system sans. Every one carries the browser-default cyan focus ring on its gold
    button, which clashes with the gold-and-navy palette.
  - `desktop/r09-help`: the scroll area cuts a line in half ("meter for an extra ball") with no fade, arrow or
    scrollbar. A player can't tell that more text exists. `mobile/r09-help` cuts mid-sentence too ("collects").
  - `desktop/r02-serve` to `desktop/r08-wizard`: the lower 40% of the right panel is empty. A dead, grey "Launch"
    button sits on screen through normal play.
  - `mobile/r11-landscape`: the bottom 55% of the side panel is blank.

### Typography: mean 6.5, proposed 6.0
- The 7 anchor requires "playfield lettering crisp". The captures show it clipped and illegible:
  - "MOUNTAIN TOWE" overflows its plate (`desktop/r02-serve`, `mobile/r03-play`, `mobile/r08-wizard`);
  - "PERIC" for SUPERIOR (`desktop/c01-row`, `desktop/c04-vapors`);
  - CENTRAL AVENUE cut by the rail (`desktop/c04-vapors`);
  - the Vapors sign is unreadable even in the close-up `desktop/c04-vapors`: a pink outlined bar of 3 px glyphs;
  - "EXTRA BALL", the bathhouse plates and "143°F" are 3–4 px blobs at play size (`mobile/r03-play`).
- The new layout check passed while all of this is on screen.
- The UI type is two faces only: a slab display face for headings and the system sans for everything else.
- `desktop/r09-help`: the About text is small, low-contrast grey, and ends in what reads like a developer note:
  "(fact: reserved, older)".
- In favour: the title wordmark and the DMD dot font are good (`desktop/r01-title`, `mobile/r07-mode`).

### Readability: mean 6.5, proposed 6.0
- Skill shot (`desktop/r02-serve`, `mobile/r02-serve`):
  - The lit A lamp measures 161 luma against 82 for S and P, on both viewports.
  - There is no halo. The lamp is a flat yellow disc, dimmer than the unlit bumper-base hotspots.
  - The DMD says "SKILL SHOT: LANE A", but the table doesn't show it.
- Wizard (`desktop/r08-wizard`, `mobile/r08-wizard`): the DMD reads "ALL SHOTS LIT", yet all six mode inserts are
  dark purple and the GI is at full brightness. Lamp language contradicts the DMD in the game's biggest moment.
- The ball competes with persistent white hotspots: the bumper bases in `desktop/r04-bumpers`, the spinner streak and
  wireform bars in `mobile/r03-play`.
- Being glassy rather than chrome, the ball takes on the colour of what's under it: beige on the pale ramp in
  `desktop/r05-ramp`.
- The ball in `desktop/r04-bumpers` is surrounded by steam dots of similar value.
- In favour: the lit mode arrows in `desktop/r07-mode` and the multipliers in `desktop/c03-flippers` are clear.

### Mobile: mean 6.5, proposed 6.0
- The 7 anchor requires framing on purpose in portrait *and* landscape.
- `mobile/r11-landscape`:
  - The table fills about 38% of the 1688 px width, with black void on both sides and above.
  - The upper field (bumpers, the Row, the Arlington) is foreshortened to a band about 120 px tall.
  - The apron runs into the bottom edge of the viewport.
  - Steam dots float in the void above the arch.
  - The side panel is half empty.
  - That is "works but cramped" (5), not "framed on purpose".
- Portrait (`mobile/r03-play`, `mobile/r02-serve`): this is good. The DMD is big and the buttons stay on the apron.
  But the playfield text is clipped or illegible at 390 px.
- The average of a near-7 portrait and a near-5 landscape is 6.0.

### Authenticity: mean 7.25, proposed 6.5
- The 7 anchor lists five things: the Row in order, the tower, the Arlington, the Vapors, and the springs' steam.
  Two of the five fail:
  - **The Vapors** (`desktop/c04-vapors`, `desktop/c01-row`): a white box with a cyan stripe and an illegible pink
    vertical bar. No local would name it.
  - **Steam** (`desktop/c02-springs`, `strips/s02-bumpers`): stacked round dots that leak outside the cabinet
    (`desktop/r02-serve`). It doesn't read as vapour.
- The upper third (`desktop/c02-springs`) is a lush European garden with a stone grotto and waterfall. It is generic
  "spa", not recognisably Hot Springs.
- In favour: the Row is named in order and the Quapaw dome and Ozark towers are right (`desktop/c01-row`). The Mountain
  Tower is recognisable (`desktop/c05-tower`), and the help facts are hedged (`desktop/r09-help`).
- Critic B's 7.5 credits the Vapors as "a specific local venue", but the capture doesn't support it.

## IP check
Clean, checked myself:
- The backglass painting (`desktop/r03-play`, left panel, enlarged) contains no lettering. The neon canopy at its right
  is blank, and the title is HTML.
- The playfield paintings (`desktop/c02-springs`, `desktop/c01-row`) contain no embedded text. Every word on the table
  is a game-rendered plate.
- I found no commercial pinball name, logo or art, and no real business logo.

## Gaps the critics missed or under-weighted
1. **G-keyline-misregister** (art, sev 3, S, WS4, +0.5). The printed gold keylines are offset from the slingshots and
   guides and run past their ends (`desktop/c03-flippers`, `desktop/c04-vapors`). Fix: regenerate the keylines from
   the current hardware footprints. Test: in a geometry-over-texture overlay, every keyline sits within 1 mm of its
   guide or sling edge, and none extends more than 2 mm past a part.
2. **G-ball-chrome** (toys, sev 3, S, WS1, +0.5). The ball renders as translucent glass (`desktop/c03-flippers`,
   `desktop/s02-bumpers-0`, `desktop/r05-ramp`). Fix: an opaque material with metalness 1 and roughness ≤ 0.1, using a
   cube capture of the playfield as the environment map. Test: in the `desktop/c03-flippers` close-up the ball is
   opaque and reflects the flippers and inserts.
3. **G-steam-occlusion** (animation, sev 2, S, WS3, +0.3). Steam dots draw over the arch rail and the cabinet, and into
   the void (`desktop/r02-serve`, `mobile/r11-landscape`). Fix: depth-test the particles against the cabinet, clip
   them to the playfield volume, and use soft billboards that widen and fade. Test: zero particle pixels outside the
   cabinet silhouette in `desktop/r02-serve` and `mobile/r11-landscape`.
4. **G-wizard-lamp-language** (readability, sev 3, S, WS1, +0.5). The DMD says "ALL SHOTS LIT" while the mode inserts
   are dark and GI is full (`desktop/r08-wizard`, `mobile/r08-wizard`). Fix: in the wizard, light or flash every
   shot's arrow and all six mode inserts, and drop GI to the stated 35%. Test: all six inserts are lit in r08, and
   median table luma in r08 is ≤ 0.6× r03.
5. **G-mood-darkening-missing** (lighting, sev 4, M, WS1, +0.5). Median table luma rises from r03 to r08 on both
   viewports. Fix: apply the mood GI scale for any active mode, multiball or wizard, including states set directly by
   the capture script. Test: median luma r06 ≤ 0.75× r03 and r08 ≤ 0.6× r03, with lit-insert peaks unchanged.
6. **G-persistent-hotspots** (lighting, sev 3, S, WS1, +0.3). Unlit bumper bases, the spinner and the wireform bars
   blow out to white (`desktop/r04-bumpers`, `desktop/r03-play`, `mobile/r03-play`). Fix: cap the specular and
   emissive output of unlit hardware. Test: in `desktop/r04-bumpers` no pixel of unlit hardware reaches ≥ 245 luma,
   and the ball is the brightest object in the upper field.
7. **G-skill-shot-halo** (readability, sev 3, S, WS1, +0.5). The lit A lamp measures 161 against 82 for the unlit
   lanes, with no halo (`desktop/r02-serve`, `mobile/r02-serve`). Test: lit lane ≥ 3× the unlit lanes, with a halo at
   least 2 lane-widths across, on both viewports.
8. **G-sling-and-scoop-models** (toys, sev 3, M, WS2, +0.5). The slingshot is a sail on a block with a holed kicker,
   and both scoops are bare holes (`desktop/c03-flippers`, `desktop/c04-vapors`, `desktop/c06-arlington`). Fix: model
   posts and rubbers with a plastic cover for the slings, and a metal scoop housing with a lip. Thin the brass guides
   to under half the ball's diameter. Test: the close-ups show rubber bands and scoop lips.
9. **G-label-clip** (typography, sev 3, S, WS4, +0.5). MOUNTAIN TOWE, PERIC and CENTRAL AVENUE are clipped, and the
   Vapors sign is illegible (`desktop/r02-serve`, `desktop/c01-row`, `desktop/c04-vapors`). Fix: extend
   check-layout to fail on text overflowing its plate and on labels occluded by meshes from the review camera poses.
10. **G-menu-deco-and-help** (ui, sev 2, S, WS5, +0.3). The browser-default focus ring shows on every menu, the help
    text cuts mid-line with no scroll affordance, and the right panel is empty (`desktop/r01-title`,
    `desktop/r09-help`, `mobile/r09-help`, `desktop/r02-serve`). Fix: a gold deco focus style, a bottom fade plus a
    scroll indicator on help, and remove the dead Launch button during play. Test: no default outline in any capture,
    and the last visible help line is never cut without a fade.
11. **G-landscape-fill** (mobile, sev 3, M, WS6, +0.5). The table fills about 38% of the width
    (`mobile/r11-landscape`). Fix: the playfield fills at least 60% of the canvas, the upper field gets at least 25% of
    the table height, and the apron clears the bottom edge.

Proposed total: **54.5** (critic mean 59.25).

```json
{
  "loop": 4,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "printed gold keylines offset from slingshots and inlane guides, extending past them and visible through the sail" },
      { "shot": "desktop/c04-vapors", "note": "keylines misregistered with the Vapors guides, running ~50 px past their ends; CENTRAL AVENUE cut" },
      { "shot": "desktop/c01-row", "note": "'PERIC HALE': SUPERIOR hidden under the Vapors post" },
      { "shot": "desktop/r02-serve", "note": "bare plaza between Row and logo; upper garden painting not composed around shots; 'MOUNTAIN TOWE' overflow" } ] },
    "toys": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "sling is a sail on a block with a holed kicker box, no posts or rubber; left wall a grey-white block; glassy see-through ball" },
      { "shot": "desktop/s02-bumpers-1", "note": "ball reads as peach translucent marble, not chrome" },
      { "shot": "desktop/c04-vapors", "note": "ball-thick brass tubes, marshmallow post rubbers, bare hole scoop, white-box Vapors intersecting a guide cap" },
      { "shot": "desktop/c06-arlington", "note": "box buildings on cream plinths, flat window decals; lock is a bare hole with a ring" },
      { "shot": "desktop/c05-tower", "note": "good lattice tower; ramp floor seam and kink, beaded wall tops" } ] },
    "lighting": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "median table luma 81 vs 77 in r03: wizard brighter, not darker" },
      { "shot": "mobile/r08-wizard", "note": "median luma 84 vs 75 in mobile r03" },
      { "shot": "desktop/r04-bumpers", "note": "unlit bumper bases blow out to white, brightest pixels near the ball" },
      { "shot": "desktop/r03-play", "note": "white glare streak on left-orbit spinner; no contact shadows" },
      { "shot": "strips/s03-multiball", "note": "only capture with a dimmed table; orange light leak in the void at upper right" },
      { "shot": "strips/s02-bumpers", "note": "interior bumper glow is good" } ] },
    "animation": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "one flipper snap; no sling, lamp or camera reaction" },
      { "shot": "strips/s02-bumpers", "note": "body brightness pulse only; cap legend blows to an orange blob; ball exits by frame 3; steam dots" },
      { "shot": "desktop/r02-serve", "note": "steam particles drawn over arch rail and cabinet into the void" },
      { "shot": "strips/s03-multiball", "note": "purple chase around mode arc, the one event with follow-through" } ] },
    "ui": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r07-mode", "note": "DMD silhouette plus complete objective, strong" },
      { "shot": "desktop/r01-title", "note": "plain web buttons in system sans; browser-default cyan focus ring" },
      { "shot": "desktop/r09-help", "note": "scroll area cuts 'meter for an extra ball' mid-line, no affordance" },
      { "shot": "mobile/r09-help", "note": "cuts mid-sentence above Back; default focus ring" },
      { "shot": "desktop/r02-serve", "note": "lower 40% of right panel empty; dead grey Launch button during play" } ] },
    "typography": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r03-play", "note": "'MOUNTAIN TOWE' overflow; bathhouse plates, EXTRA BALL and 143°F are 3-4 px blobs" },
      { "shot": "desktop/c04-vapors", "note": "Vapors sign unreadable even in the close-up; CENTRAL AVENUE cut; 'PERIC'" },
      { "shot": "desktop/r09-help", "note": "slab heading plus system sans; About text small low-contrast grey with '(fact: reserved, older)'" },
      { "shot": "desktop/r01-title", "note": "title wordmark good" } ] },
    "readability": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r02-serve", "note": "lit A lamp 161 luma vs 82 for S and P; no halo; dimmer than unlit bumper hotspots" },
      { "shot": "mobile/r02-serve", "note": "same measurements on phone; DMD promises a lane the table doesn't show" },
      { "shot": "mobile/r08-wizard", "note": "'ALL SHOTS LIT' while all six mode inserts are dark and GI full" },
      { "shot": "desktop/r05-ramp", "note": "glassy ball turns beige on pale ramp" },
      { "shot": "desktop/r07-mode", "note": "lit mode arrows clear" } ] },
    "mobile": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "table ~38% of width, upper field a ~120 px band, apron into bottom edge, steam in void, side panel half empty" },
      { "shot": "mobile/r03-play", "note": "portrait framed well, big DMD; playfield text clipped or illegible" },
      { "shot": "mobile/r02-serve", "note": "buttons on apron clear of the ball" } ] },
    "authenticity": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "Vapors is a white box with an illegible bar; unrecognisable" },
      { "shot": "desktop/c02-springs", "note": "steam is dots; upper art is a generic European garden and grotto" },
      { "shot": "desktop/c01-row", "note": "eight bathhouses named in order, Quapaw dome and Ozark towers right" },
      { "shot": "desktop/c05-tower", "note": "Mountain Tower recognisable" } ] }
  },
  "ip": { "clean": true, "notes": "Backglass painting enlarged: no lettering, neon canopy blank, title is HTML. Playfield paintings contain no text; all words are game plates. No commercial pinball or real business marks." },
  "gaps": [
    { "id": "G-keyline-misregister", "category": "art", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c03-flippers", "desktop/c04-vapors"], "fix": "Regenerate printed keylines from current hardware footprints. Test: geometry-over-texture overlay shows every keyline within 1 mm of its part and none extending more than 2 mm past it." },
    { "id": "G-ball-chrome", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c03-flippers", "desktop/s02-bumpers-0", "desktop/r05-ramp"], "fix": "Opaque ball, metalness 1, roughness <= 0.1, playfield cube-capture env map. Test: in the c03 close-up the ball is opaque and reflects flippers and inserts." },
    { "id": "G-steam-occlusion", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["desktop/r02-serve", "mobile/r11-landscape", "desktop/c02-springs"], "fix": "Depth-test steam against the cabinet, clip to the playfield volume, use soft widening and fading billboards. Test: zero particle pixels outside the cabinet silhouette in r02 and r11." },
    { "id": "G-wizard-lamp-language", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r08-wizard", "mobile/r08-wizard"], "fix": "In the wizard, light or flash every shot arrow and all six mode inserts and drop GI to 35%. Test: all six inserts lit in r08; median table luma r08 <= 0.6x r03." },
    { "id": "G-mood-darkening-missing", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard", "mobile/r08-wizard"], "fix": "Apply mood GI scale for any active mode, multiball or wizard, including capture-script states. Test: median luma r06 <= 0.75x r03 and r08 <= 0.6x r03 with lit-insert peaks unchanged." },
    { "id": "G-persistent-hotspots", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r04-bumpers", "desktop/r03-play", "mobile/r03-play", "desktop/c05-tower"], "fix": "Cap specular and emissive output of unlit bumper bases, spinner and wireform bars. Test: in r04 no unlit hardware pixel reaches >= 245 luma and the ball is the brightest object in the upper field." },
    { "id": "G-skill-shot-halo", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Make the skill-lane halo render at serve. Test: lit lane >= 3x unlit lanes (currently 161 vs 82) with a halo at least 2 lane-widths across on both viewports." },
    { "id": "G-sling-and-scoop-models", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers", "desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Model sling posts, rubbers and a plastic cover; give scoops a metal housing with a lip; thin brass guides below half the ball's diameter. Test: close-ups show rubber bands and scoop lips." },
    { "id": "G-label-clip", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/r02-serve", "desktop/c01-row", "desktop/c04-vapors", "mobile/r03-play"], "fix": "Extend check-layout to fail on text overflowing its plate and on labels occluded by meshes from review camera poses; fix MOUNTAIN TOWER, SUPERIOR, CENTRAL AVENUE and the Vapors sign." },
    { "id": "G-menu-deco-and-help", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title", "desktop/r09-help", "mobile/r09-help", "desktop/r02-serve"], "fix": "Gold deco focus style, bottom fade and scroll indicator on help, hide the dead Launch button in play. Test: no default outline in any capture; the last visible help line never cut without a fade." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Playfield fills >= 60% of canvas width, upper field >= 25% of table height, apron clears the bottom edge; use the empty side panel for status." }
  ]
}
```

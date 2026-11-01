# Judge: loop 7

Inputs read: rubric, schema, loop brief, gates (perf pass: desktop 60.4 fps / 3.94 ms, throttled 36.8 fps, SwiftShader
55.7 fps at Low; IP pass), CHANGES.md, both critics, prosecutor, advocate. HISTORY.md used for trend only.
Paths are relative to `games/Pinball/screenshots/review-loop-7/`.

No category has the critics more than 1.0 apart, and prosecutor and advocate are never more than 1.0 apart. They
are exactly 1.0 apart on readability (6.0 / 7.0) and authenticity (7.0 / 8.0), and Critic B is 1.0 above Critic A on
authenticity. I opened every disputed capture anyway. I measured or cropped these: the ball in `desktop/r03-play`
(8× crop) and on the ramp in `desktop/r05-ramp` and `mobile/r05-ramp` (luminance crop), the spinner in
`desktop/r03-play`, plus `desktop/c01-row`, `desktop/c03-flippers`, `desktop/c04-vapors`, `desktop/c05-tower`,
`desktop/c06-arlington`, `desktop/r01-title`, `desktop/r04-bumpers`, `desktop/r06-multiball`, `desktop/r08-wizard`,
`desktop/r10-scores`, `mobile/r06-multiball`, `mobile/r09-help`, `mobile/r11-landscape` and all three strips.

## Factual disputes settled

- **Desktop ball size: the advocate is right.** In the 8× crop of `desktop/r03-play`, the ball measures about
  18 px. It sits on the blue fan beside the MOUNTAIN TOWER plate, not on it, and has a dark rim. Critic A's "12 px"
  and the gap built on it (G-desktop-ball-size) are dropped.
- **Top ball in multiball: the advocate is right.** In `desktop/r06-multiball` the top ball is a clean chrome disc
  on the arch rail. All three balls read, on the phone as well (`mobile/r06-multiball`).
- **Ball on the ramp: the prosecutor is partly right.** In the luminance crop of `mobile/r05-ramp`, the ball's body
  has almost the same value as the frosted ramp. Only its highlight and a thin rim separate it. It can be found, but
  it is the weakest ball read in the set (also `desktop/r05-ramp`). The advocate's "bright chrome disc" overstates
  it.
- **Bathhouses: the advocate is right.** In `desktop/c01-row` each house has its own roofline: Maurice has a green
  roof over an arcade, Hale a red hipped roof, Ozark twin red spires, and Quapaw a tiled dome. Critic A's
  "interchangeable cream boxes" is wrong. All of them do still stand on identical cream box plinths, which every
  reviewer concedes.
- **Flippers and slings: the advocate is right.** In `desktop/c03-flippers` the flippers carry a red rubber band,
  and the slings have black post rubbers. What is genuinely missing is rubber along the sling's kicking face and a
  visible kicker.
- **Help list: the advocate is right.** In `mobile/r09-help` the list ends in a fade mask, not a mid-line clip. The
  remaining fault is that nothing shows the list scrolls.
- **Glare: the critics and the prosecutor are right.** These are all real:
  - a hard white line about 30×2 px with a halo on the spinner (crop of `desktop/r03-play`);
  - a large blown blob at the top left of `desktop/c04-vapors`;
  - the lock-wall rim clipping white and white-hot bumper base rings (`desktop/c06-arlington`);
  - yellow bloom spilling into the off-table black in `strips/s03-multiball` frames 0, 1 and 7.
- **Bumper frame: the prosecutor is right.** `desktop/r04-bumpers` catches the ball at the top arch, not in the
  bumpers, with no bumper lit. `strips/s02-bumpers` does show real hits: the body flashes in frames 1 and 6, and
  steam rises.
- **Multiball strip: all four reviewers agree.** `strips/s03-multiball` is badly framed: the flippers are cropped,
  the right half of every frame is black, and a ball is visible only in frames 5 to 7.
- **Wizard mode grid.** `desktop/r08-wizard` shows only Soak won while the wizard runs, but the help says all six
  are needed. The advocate's explanation (a staged save state) is plausible, since the grid matches r03, r06 and r07.
  Either way the capture shows a contradiction, so it stays as a small gap, fixed at the staging or HUD level.
- **Landscape: everyone is right.** In `mobile/r11-landscape` the table fills about 42% of the width, with black
  voids on both sides and a mostly empty HUD column.

## Rulings by category

**Art: 6.5.** The backglass and the deco terrazzo fan are strong, and in one hand (`desktop/r03-play`,
`desktop/c03-flippers`). The upper painting is themed, a spring house and cascade, so the advocate is right that it
is not "generic garden". It still is not composed around the layout: bumpers and lane guides sit on foliage
(`desktop/c02-springs`). Shot names sit on floating black pills, the arrows are flat vector shapes
(`desktop/c04-vapors`), and the apron is a blank purple slab with two plain cards (`desktop/r02-serve`). The 7
anchor's "inserts and lettering integrated" is not met. The painting is unchanged from last loop.

**Toys: 6.5.** These read well: the tower, the Arlington, the Quapaw dome, Ozark's spires, the satin bumpers, the
new stainless ramp blades and the chrome ball (`desktop/c05-tower`, `desktop/c06-arlington`, `desktop/c02-springs`).
These hold it below 7:
- cream box plinths under every house (`desktop/c01-row`);
- plain grey bar scoop and lock walls (`desktop/c04-vapors`);
- sling faces with no rubber (`desktop/c03-flippers`);
- a ladder-like wireform and a black void beyond the rail (`desktop/c05-tower`).

The prosecutor's 6.0 rests partly on "no flipper rubber", which is wrong.

**Lighting: 6.5.** The lit and unlit insert split is clean (`desktop/c03-flippers`). Wizard mode drops the GI and
lights every insert, a real mood shift (`desktop/r08-wizard`). This loop's glare cuts are visible: the satin
bumpers, the smaller spinner flare, the tamer star. Even so, blown areas remain:
- `desktop/c04-vapors` top left;
- the lock rim (`desktop/c06-arlington`);
- the spinner line (`desktop/r03-play`);
- bloom spill (`strips/s03-multiball`).

The new contact shadows are faint (`desktop/c01-row`), and bumper flashes light the body but not the field
(`strips/s02-bumpers`). This is between the 5 and 7 anchors, at 6.5, not 6.0: the defects are local, not a washed-out
frame.

**Animation: 6.5.** The flipper snaps and the ball leaves cleanly (`strips/s01-flip`), with no in-between pose.
Bumpers flash and steam rises (`strips/s02-bumpers`). An insert chase runs (`strips/s03-multiball`). Missing from
the 7 anchor: a bumper skirt drop, any camera reaction, and a readable multiball launch, since the S03 framing hides
the release. Critic B and the advocate credit "cap displacement", but it is a few pixels at most. That is not
enough for 7.

**UI: 7.0.** The DMD has real character, with a horse for Derby, the Arlington towers for multiball and steam over
the mountain for the wizard (`desktop/r07-mode`, `mobile/r06-multiball`, `desktop/r08-wizard`). The desktop progress
line and the new six-lamp grid make the HUD clear. The menus share the purple and gold frame and the neon slab title
(`desktop/r01-title`, `desktop/r10-scores`), but the buttons and the scores table are plain web controls. Other
faults: no scroll cue in help (`mobile/r09-help`), the wizard grid contradiction, and no mode numbers on the phone
(`mobile/r07-mode`). That meets the anchor at its floor.

**Typography: 6.5.** All four reviewers agree. The neon slab display face and the DMD face are deliberate
(`desktop/r01-title`, `mobile/r06-multiball`), and close-up lettering is crisp (`desktop/c03-flippers`). At play
view the bathhouse tags, mode labels and EXTRA BALL / VALLEY OF THE VAPORS are about 5 px (`desktop/r03-play`,
`mobile/r03-play`). The body copy reads as a stock system-style sans (`mobile/r09-help`), and the apron cards use a
plain serif (`desktop/r02-serve`).

**Readability: 6.5.** Critic A's chief evidence (the 12 px ball and the lost multiball ball) is wrong. The ball
reads in `desktop/r03-play` and `desktop/r06-multiball`. The satin bumpers no longer pose as balls
(`mobile/r06-multiball`), and lit and unlit inserts are clear. Against a 7:
- The ramp ball has almost no value contrast (`mobile/r05-ramp`, `desktop/r05-ramp`).
- In `desktop/r04-bumpers` the ball is a faint dot among foliage and steam.
- The skill-shot cue is one small lamp (`desktop/r02-serve`).
- Shot legends are too small to read at play view.

"The ball always stands out" is not yet true.

**Mobile: 6.5.** Portrait is designed: the DMD is large, the table fills the width, and the buttons sit in the
apron band (`mobile/r06-multiball`, `mobile/r09-help`). Landscape is not (`mobile/r11-landscape`). Labels are
unreadable and mode progress is missing in portrait (`mobile/r03-play`, `mobile/r07-mode`). The prosecutor's 6.0
overweights one frame of eleven, but the anchor names landscape explicitly, so the score can't reach 7.

**Authenticity: 7.5.** Eight bathhouses in the correct north-to-south order, each with its own roofline
(`desktop/c01-row`). Also present: the twin-towered Arlington and the Quapaw dome (`desktop/c06-arlington`), the
lattice Mountain Tower (`desktop/c05-tower`), the Vapors neon (`desktop/c04-vapors`), 143°F springs with steam, and
hedged facts (`desktop/r09-help`). Two things keep it from 8: the Arlington is placed mid-Row rather than at the north
end across Central Avenue, and the upper painting is a generic spring grotto rather than the Promenade or Hot
Springs Mountain (`desktop/c02-springs`). Critic B's and the advocate's 8 is one step generous.

**Total: 60.0 / 90.**

## IP

Clean. No commercial pinball name, logo or art. I found no text in the backglass, the upper painting or the
terrazzo (`desktop/r03-play`, `desktop/c02-springs`). The Vapors sign (`desktop/c04-vapors`) is a generic neon
treatment of a local place name: a script "The" over block capitals, shown as setting, with a no-affiliation note
in help. Nothing in the captures shows it copies the venue's own mark. This is not a gap; the developer should keep
the provenance note.

## Ranked gaps (expected gain ÷ effort)

1. **G-glare-bloom-clamp** (lighting, S, WS1): clamp or roughen these, and mask bloom to the cabinet silhouette:
   - the spinner edge specular;
   - the lock and scoop wall rims;
   - the Central Avenue emitter that blows out the top left of c04;
   - the bumper base rings.

   **Test:** no non-insert region of 20 px or more above 0.95 luminance in r03, c04 and c06, and off-table pixels
   in s03 below 0.1.
2. **G-ramp-ball-contrast** (readability, S, WS1): drop the ramp plastic to about 35% opacity with a faint tint, so
   the art shows through. Darken the floor under the ball path and add a ball contact shadow on the ramp.
   **Test:** at least 3:1 luminance contrast between the ball body and the surrounding ramp pixels in r05 on both
   viewports.
3. **G-landscape-framing** (mobile, M, WS6): in 844×390, lower the camera tilt and fit the playfield's projected
   bounds to the left 70% of the viewport. Put the DMD at column width, Launch and the six-lamp grid in the HUD
   column, and inset the apron 12 px from the bottom edge. **Test:** the playfield is at least 60% of the width, no
   black band is over 40 px, and no HUD-column gap is over 120 px in r11.
4. **G-bumper-light-pool** (lighting, S, WS1): on a hit, pulse an additive light decal or short-range point light
   on the playfield under each bumper, and recapture r04 on a hit tick. **Test:** playfield pixels within one bumper
   radius rise at least 20% in luminance in the hit frame against the frame before.
5. **G-multiball-strip-framing** (animation, S, WS3): frame s03 on the full field, flippers included and no black
   half, at ticks where two or three balls leave the lock and the shooter lane. **Test:** at least two balls
   visible in at least four of the eight frames.
6. **G-hud-truth-and-help** (ui, S, WS5): make the mode grid derive from game state, and stage the wizard capture
   with all six won. Use lamp-style dim, lit and flashing states instead of fill against outline. Add the mode count
   and timer to the phone score pill. Add a visible scrollbar or chevron above Back in help. **Test:** in r08 all
   six lamps show won, and r07 on the phone shows "18/100 · 45s".
7. **G-bumper-skirt-followthrough** (animation, S, WS3): drop the bumper skirt and ring 3 to 4 px on a hit, with a
   two-frame recovery, and add a short ball trail above a speed threshold. **Test:** the skirt offset is visible
   between consecutive frames of s02.
8. **G-toy-plinths-walls** (toys, M, WS2): replace the cream box plinths with bevelled stone stoops matched to each
   facade, or sink the models onto the playfield. Give the scoop and lock walls the rolled stainless profile already
   used for the ramp blades. **Test:** c01, c04 and c06 show no plain cream boxes and no flat grey bars.
9. **G-table-legend-size** (typography, M, WS5): enlarge the bathhouse tags, mode labels and EXTRA BALL / VALLEY
   legends to at least 8 CSS px cap height at 390 px, on quiet dark backings. Load a deliberate body face for the
   menus and help. **Test:** in mobile/r03 every shot name is legible at native size.
10. **G-sling-rubber** (toys, S, WS2): model a black rubber band along each sling's kicking face and a visible
    kicker arm, beyond the existing post rubbers. **Test:** the c03 close-up shows a rubber face and a kicker on
    both slings.
11. **G-skill-shot-cue** (readability, S, WS5): give the lit S·P·A skill lane a pulsing halo and a chevron at the
    plunger lane exit while the skill shot is live. **Test:** the cue is visible at native size in r02 on both
    viewports.
12. **G-upper-field-repaint** (art, L, WS4), **the big lever**: repaint the upper playfield as the Grand Promenade
    and Display Spring cascade under Hot Springs Mountain. Compose it around the bumpers, the lanes and the ball
    paths, with lower value contrast under the paths, and keep it text-free. Paint the apron as a deco border with a
    bathhouse menu-board rule card. Restyle the four arrows as framed inserts in one family. This is the main thing
    holding art at 6.5, and it also lifts readability and authenticity. **Test:** a reviewer names the Promenade and
    the spring in c02 without labels, and no lane guide or bumper sits on unrelated foliage.

## Verdict

**Continue.** Art, toys, lighting, animation, typography, readability and mobile are below their gate of 7. UI (7.0)
and authenticity (7.5) meet theirs. Perf and IP pass.

```json
{
  "loop": 7,
  "role": "judge",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r03-play", "note": "strong backglass in the same hand; deco terrazzo fan" },
      { "shot": "desktop/c02-springs", "note": "themed spring grotto, but bumpers and lane guides sit on foliage, not composed around the layout" },
      { "shot": "desktop/c04-vapors", "note": "flat vector arrows and floating pill plates, not integrated inserts" },
      { "shot": "desktop/r02-serve", "note": "blank purple apron with plain cards" } ] },
    "toys": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c01-row", "note": "distinct rooflines (Ozark spires, Maurice arcade, Quapaw dome) on identical cream box plinths" },
      { "shot": "desktop/c05-tower", "note": "tower and stainless ramp blades read; ladder-like wireform; void beyond rail" },
      { "shot": "desktop/c03-flippers", "note": "flippers carry red rubber; sling kicking faces have no rubber or kicker" },
      { "shot": "desktop/c04-vapors", "note": "plain grey bar scoop walls" } ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "GI drops and every insert lights: real mood shift" },
      { "shot": "desktop/c04-vapors", "note": "large blown blob top left" },
      { "shot": "desktop/c06-arlington", "note": "lock rim clips; bumper base rings white-hot" },
      { "shot": "desktop/r03-play", "note": "spinner hard white line about 30x2 px (judge crop)" },
      { "shot": "strips/s03-multiball", "note": "bloom spills into the off-table void in frames 0, 1, 7" } ] },
    "animation": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps to full stroke, clean ball exit; no in-between pose" },
      { "shot": "strips/s02-bumpers", "note": "body flash in frames 1 and 6, steam rises; no skirt drop" },
      { "shot": "strips/s03-multiball", "note": "insert chase runs; flippers cropped, half frame black, no readable ball release" } ] },
    "ui": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r07-mode", "note": "horse DMD icon, progress line, six-lamp grid" },
      { "shot": "mobile/r06-multiball", "note": "Arlington towers DMD icon, large phone DMD" },
      { "shot": "desktop/r01-title", "note": "consistent purple and gold frame and neon title; plain web buttons" },
      { "shot": "desktop/r08-wizard", "note": "grid shows only Soak won during the wizard" },
      { "shot": "mobile/r09-help", "note": "fade, not clip, but no scroll cue" } ] },
    "typography": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate neon slab display face" },
      { "shot": "desktop/c03-flippers", "note": "crisp close-up lettering" },
      { "shot": "mobile/r03-play", "note": "shot legends about 5 px, unreadable at play view" },
      { "shot": "mobile/r09-help", "note": "stock system-style body sans" } ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r03-play", "note": "ball about 18 px with dark rim, beside the plate (judge 8x crop)" },
      { "shot": "desktop/r06-multiball", "note": "all three balls read, including the top one on the arch rail" },
      { "shot": "mobile/r05-ramp", "note": "ball body near the ramp's value; only highlight and thin rim separate it (luminance crop)" },
      { "shot": "desktop/r04-bumpers", "note": "ball a faint dot among foliage and steam at the arch" },
      { "shot": "desktop/r02-serve", "note": "skill-shot cue is one small lamp" } ] },
    "mobile": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r06-multiball", "note": "portrait framed on purpose; buttons in the apron band" },
      { "shot": "mobile/r11-landscape", "note": "table about 42% of width, black voids, empty HUD column" },
      { "shot": "mobile/r07-mode", "note": "no mode count or timer on the phone" },
      { "shot": "mobile/r09-help", "note": "help fits and reads at 390 px" } ] },
    "authenticity": { "score": 7.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in correct order, each with its own roofline" },
      { "shot": "desktop/c06-arlington", "note": "twin-tower Arlington and Quapaw dome; Arlington placed mid-Row" },
      { "shot": "desktop/c05-tower", "note": "lattice Mountain Tower" },
      { "shot": "desktop/c02-springs", "note": "upper field a generic spring grotto, not the Promenade or the mountain" },
      { "shot": "desktop/r09-help", "note": "hedged facts and no-affiliation note" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball name, logo or art; no text in the backglass, upper painting or terrazzo. The Vapors sign is a generic neon treatment of the place name with a no-affiliation note; not shown to copy the venue's mark." },
  "gaps": [
    { "id": "G-glare-bloom-clamp", "category": "lighting", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/c04-vapors", "desktop/c06-arlington", "strips/s03-multiball"], "fix": "Clamp or roughen the spinner edge specular, the lock and scoop wall rims, the Central Avenue emitter and the bumper base rings, and mask bloom to the cabinet silhouette; test that no non-insert region of 20 px or more exceeds 0.95 luminance in r03, c04 and c06 and that off-table pixels in s03 stay below 0.1." },
    { "id": "G-ramp-ball-contrast", "category": "readability", "expectedGain": 0.4, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["mobile/r05-ramp", "desktop/r05-ramp"], "fix": "Drop the ramp plastic to about 35% opacity with a faint tint so the art shows through, darken the floor under the ball path and add a ball contact shadow on the ramp; test for at least 3:1 luminance contrast between the ball body and the surrounding ramp pixels in r05 on both viewports." },
    { "id": "G-landscape-framing", "category": "mobile", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "In 844x390 lower the camera tilt and fit the playfield's projected bounds to the left 70% of the viewport; put a column-width DMD, Launch and the six-lamp grid in the HUD column and inset the apron 12 px from the bottom; test that the playfield is at least 60% of the width, no black band exceeds 40 px and no HUD-column gap exceeds 120 px in r11." },
    { "id": "G-bumper-light-pool", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["strips/s02-bumpers", "desktop/r04-bumpers"], "fix": "Pulse an additive light decal or short-range point light on the playfield under each bumper on a hit and recapture r04 on a hit tick; test that playfield pixels within one bumper radius rise at least 20% in luminance in the hit frame." },
    { "id": "G-multiball-strip-framing", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/s03-multiball"], "fix": "Frame s03 on the full field (flippers in, no black half) at ticks where balls leave the lock and shooter lane; test that at least two balls are visible in at least four of the eight frames." },
    { "id": "G-hud-truth-and-help", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r08-wizard", "mobile/r07-mode", "mobile/r09-help"], "fix": "Derive the mode grid from game state and stage the wizard capture with all six won, use lamp-style dim, lit and flashing states, add the mode count and timer to the phone score pill, and add a visible scrollbar or chevron above Back in help; test that r08 shows six won lamps and phone r07 shows the mode count and timer." },
    { "id": "G-bumper-skirt-followthrough", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s01-flip"], "fix": "Drop the bumper skirt and ring 3 to 4 px on a hit with a two-frame recovery and add a short ball trail above a speed threshold; test that the skirt offset is visible between consecutive s02 frames." },
    { "id": "G-toy-plinths-walls", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Replace the cream box plinths with bevelled stone stoops matched to each facade or sink the models onto the playfield, and give the scoop and lock walls the rolled stainless profile of the ramp blades; test that c01, c04 and c06 show no plain cream boxes or flat grey bars." },
    { "id": "G-table-legend-size", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["mobile/r03-play", "desktop/r03-play", "mobile/r09-help"], "fix": "Enlarge the bathhouse tags, mode labels and EXTRA BALL / VALLEY legends to at least 8 CSS px cap height at 390 px on quiet dark backings, and load a deliberate body face for menus and help; test that every shot name in mobile/r03 is legible at native size." },
    { "id": "G-sling-rubber", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "Model a black rubber band along each sling's kicking face and a visible kicker arm beyond the existing post rubbers; test that c03 shows a rubber face and kicker on both slings." },
    { "id": "G-skill-shot-cue", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Give the lit S·P·A skill lane a pulsing halo and a chevron at the plunger lane exit while the skill shot is live; test that the cue is visible at native size in r02 on both viewports." },
    { "id": "G-upper-field-repaint", "category": "art", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c02-springs", "desktop/r02-serve", "desktop/c04-vapors"], "fix": "Big lever: repaint the upper playfield as the Grand Promenade and Display Spring cascade under Hot Springs Mountain, composed around the bumpers, lanes and ball paths with lower value contrast under the paths and no text; paint the apron as a deco border with a menu-board rule card; restyle the four arrows as framed inserts in one family. Test that a reviewer names the Promenade and spring in c02 without labels and no lane guide or bumper sits on unrelated foliage." }
  ],
  "verdict": "continue"
}
```

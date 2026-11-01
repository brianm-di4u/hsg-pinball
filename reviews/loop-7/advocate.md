# Advocate: loop 7

I re-opened the captures to test the critics' claims; I did not take either critic's word for them. Paths are relative to `games/Pinball/screenshots/review-loop-7/`, and coordinates are pixels in the named file.

Critic means: art 6.75, toys 6.5, lighting 6.5, animation 6.75, ui 6.75, typography 6.5, readability 6.5, mobile 6.5, authenticity 7.5 (total 60.5).

**Proposed total: 62.0 / 90.**

Both critics are right about the big defects, and I concede them:
- the cream box plinths under the bathhouses;
- the phone landscape framing;
- the blank apron;
- the small playfield lettering at play distance;
- the glare left on the spinner edge and the lock rim.

My gains come from Critic A's readability and authenticity markdowns, which rest on claims the captures contradict:
- **Ball size:** the desktop ball is about 18–19 px, not 12 px.
- **Bathhouses:** they are not "near-interchangeable". Ozark already has the twin towers that A proposes adding.
- **Smaller misreads:** A also misread the "empty" midfield and the missing flipper rubber.

## Plain factual errors

1. **A: the desktop ball is "about 12 px".** Wrong.
   - At 4× zoom, the ball in `desktop/r03-play` (about 692,553) spans about 75 zoomed pixels, so about 18–19 px across.
   - The table is about 400 px wide, so the ball is about 4.5% of the table's width. A real 1 1/16 in ball on a 20.25 in playfield is 5.2%, so this is close to true scale.
   - The ball sits on the blue fan to the right of the MOUNTAIN TOWER plate, not on it. It has a dark rim and a reflected highlight.
   - A's own test for the gap (a ball of at least 16 px at 1280×800) already passes.
2. **A: in `desktop/r06-multiball` "the top ball is lost against the arch".** Wrong. That ball (about 606,44) is a clean chrome disc on the dark wood arch rail. The other two balls, at 624,709 between the flippers and at 826,703 in the shooter lane, read just as clearly.
3. **A: "Hale, Maurice, Ozark, Buckstaff and Lamar are near-interchangeable cream boxes", with the fix "Ozark's twin towers".** Wrong. In `desktop/c01-row`:
   - Ozark (about 940,360) already has two red-spired towers.
   - Maurice (about 340,370) has a green mansard roof and a ground-floor row of arches. That is the "arched loggia" A asks for.
   - Hale has a red hipped roof.
   - Superior has a green flat roof with a rooftop structure.
   - Buckstaff has a flat cornice over a pilastered front.
   - Lamar has a red-trimmed roof.

   Every one has its own roofline and colour.
4. **A: "mid-field between the Vapors and the ramp foot is empty terrazzo".** Wrong. In `desktop/r03-play`, that band (x 500–740, y 380–440) holds:
   - the SPA CITY logo (635,390);
   - the blue and coral shot arrows (515,405 and 572,410);
   - the star insert (625,432);
   - the EXTRA BALL and VALLEY OF THE VAPORS legends.
5. **A: the flippers have "no rubber texture"; the slings have "no rubber ring".** Partly wrong.
   - In `desktop/c03-flippers`, each white flipper has a continuous red rubber band around its edge. That is the standard white-bat, red-rubber look.
   - Each slingshot has black post rubbers at its corners (about 120,255; 265,330; 1010,330; 1160,255) and a dark band along its base.
   - What is genuinely missing is rubber along the kicking face.
6. **A: the help list is "cut off mid-line behind the Back bar".** Wrong cause. The list scrolls under a fade mask that signals more content; nothing is clipped. In `mobile/r09-help` the fade falls on the start of a new item ("The Vapors scoop starts modes…"), after a complete line. Codex describes this correctly as a fade. Its weakness is that there is no scrollbar, not that layout is broken.
7. **A: the ramp floor is "not clear plastic over art".** Partly wrong. In `desktop/c05-tower`, the lower ramp section (y 520–720) shows the terrazzo and brick pattern through the floor. The upper section is frosted.
8. **Codex: "wizard bloom obscures local labels" in `mobile/r08-wizard`.** Overstated. All six mode labels (SOAK, DERBY, RAID, TOWER, TUBS, COASTER) read under their lit inserts in that frame. Only the 2X–5X tags under the bonus lamps go faint.
9. **Codex: "arrows sit away from actual entrances".** Mostly wrong. In `desktop/r03-play`:
   - The red lock arrow (626,305) sits directly under the Arlington lock.
   - The gold ramp arrow (718,463) has a dotted trail that runs up to the ramp mouth (about 740,430).
   - The coral arrow (572,410) points straight at the Vapors scoop.
10. **A: "LANE A" on the DMD is cryptic.** In `desktop/r02-serve`, the lit lane lamp (760,127) sits directly above the printed "A" of S·P·A (773,141). The DMD names the lane exactly as the playfield labels it.

## Category by category

### Art: critics 6.5 / 7.0 → proposed 7.0
- **Concede:** the apron is a blank purple slab with two cream cards (`desktop/r02-serve`, bottom). The shot arrows are flat vector shapes laid over the painting (`desktop/c04-vapors`, bottom).
- **Rebut:** the claim that the upper painting is a "generic garden" ignoring the layout.
  - `desktop/c02-springs` shows a thermal-spring grotto: a stone arched spring house at top centre between the bumpers and the lanes, and a cascade that flows under the S·P·A lanes into a pool. The theme is placed around the lanes.
  - The 143°F bumper caps and the rising steam continue it.
  - The lower field's deco fan is composed around the 2X–5X inserts and the flippers (`desktop/c03-flippers`), and both critics credit it.
- **Rebut:** "empty mid-field" is false (error 4).
- **Concede in part:** the four arrow colours are flat. They are a per-shot colour code, which is normal pinball lamp language and not random.
- The backglass (`desktop/r03-play`, left) is in the same hand.
- That meets the 7 anchor's "every zone themed, backglass in the same hand", with the apron as the one unthemed zone.

### Toys: critics 6.5 / 6.5 → proposed 6.5
- **Concede:** cream box plinths under every bathhouse (`desktop/c01-row`). Scoop and lock walls are plain brushed-grey bars (`desktop/c04-vapors`, `desktop/c06-arlington`). The ramp has angular facets with a visible seam (`desktop/c05-tower`).
- **Rebut:** "featureless flippers / no sling rubber" (error 5), and "no clear plastic" (error 7).
- **Credit both critics give but undersell:**
  - lattice Mountain Tower with an octagonal lit cab and a mast (`desktop/c05-tower`);
  - twin-towered Arlington with gabled red roofs (`desktop/c06-arlington`);
  - tiled Quapaw dome with a lantern;
  - Fordyce's blue skylight;
  - satin teal bumpers with gold-rimmed 143°F decals (`desktop/c02-springs`);
  - the new stainless ramp-mouth blades.
- The plinths keep this under 7. I hold the mean.

### Lighting: critics 6.5 / 6.5 → proposed 6.5
- **Concede:**
  - The spinner edge renders as a hard white line on both viewports (`desktop/r03-play` about 460–490,268; `mobile/r03-play` about 70–125,770).
  - The Arlington lock wall top rim blows out (`desktop/c06-arlington`, y about 365).
  - The bumper base rings still glow hot (`desktop/c02-springs`).
  - Contact shadows under the plinths are faint (`desktop/c01-row`).
- **Severity:** the spinner defect is small. On desktop only about 30 pixels exceed luminance 242: a line about 30×1 px, not a flare.
- **Credit:**
  - In `desktop/r08-wizard` and `mobile/r08-wizard`, the GI drops and every mode insert, all four bonus lamps and the three S·P·A lamps light. That is a real mood shift toward the 9 anchor.
  - Lit and unlit inserts are cleanly separated (`desktop/c03-flippers`: 2X and 3X glow; 4X and 5X are dark).
  - `strips/s02-bumpers` frames 1, 2, 4 and 6 show the struck bumper's body flash.
- With the remaining glare, the mean is right.

### Animation: critics 6.5 / 7.0 → proposed 7.0
- **Concede:** `strips/s03-multiball` is badly framed. The table is pushed left, the flippers are cropped, and a ball is only clearly visible in frames 5–7 (shooter lane and wireform). There is no camera reaction in any strip.
- **Cause:** the S03 framing is a capture-camera choice, not a game defect, though it still costs evidence.
- **Credit:**
  - `strips/s01-flip`: the left flipper is up in frames 2–3, and the ball leaves cleanly up the centre in frames 3–7.
  - `strips/s02-bumpers`: the ball strikes the upper-right bumper; its body flashes in frames 1, 2, 4 and 6; steam plumes change shape across frames.
  - `strips/s03-multiball`: a sweep runs across the inserts. Blue arrows pulse on in frames 0, 1, 6 and 7, the teal arrow on in frames 2–4, the purple mode row on in frames 4–6, and the bonus lamps on in frames 1–3.
- "Flippers snap, bumpers flash, steam rises, light shows run" matches four of the five items in the 7 anchor. I take Codex's 7.0.

### UI: critics 6.5 / 7.0 → proposed 7.0
- **Concede:**
  - Menu buttons are rounded panels, not deco (`desktop/r01-title`).
  - The right column has dead space below Menu (`desktop/r03-play`, y about 585–800).
  - There is no scroll affordance in help beyond the fade.
- **Rebut the HUD contradiction's cause and weight.**
  - The mode grid shows the same state in `desktop/r03-play`, `desktop/r06-multiball`, `desktop/r07-mode` and `desktop/r08-wizard`: Soak gold (won), Derby outlined (played).
  - The wizard frame was staged from that same save state, so the grid reports the state truthfully; the capture forced the wizard.
  - It's worth noting, but it's a staging artefact more than a HUD design fault.
- **Rebut "mode timer and progress disappear" on the phone.** `mobile/r07-mode` shows the DMD's horse icon with "DERBY DAY / RAMPS, ORBITS", plus lit DERBY and SOAK inserts on the table. The mode and its goal are shown; only the 18/100 and 45s numbers are missing.
- **Credit:**
  - The DMD tells each mode with its own icon: horse for Derby (`desktop/r07-mode`), twin towers for Arlington Multiball (`desktop/r06-multiball`), steam-over-mountain for the wizard (`desktop/r08-wizard`).
  - The desktop progress line "Derby · 18/100 · 45s" (`desktop/r07-mode`).
  - A clean title stack (`desktop/r01-title`).
- That matches the 7 anchor's "DMD with character and readable animations, a clear HUD".

### Typography: critics 6.5 / 6.5 → proposed 6.5
- **Concede:** at play distance, bathhouse names, mode legends and EXTRA BALL / VALLEY OF THE VAPORS are about 5 px (`desktop/r03-play`, `mobile/r03-play`). The apron cards are plain.
- **Rebut in part:** the "system UI body face" isn't shown by the captures. The help body (`mobile/r09-help`) is a consistent humanist sans paired with the slab display face. The "cut off" is a fade (error 6).
- **Credit:**
  - The neon slab-serif display (`desktop/r01-title`, `desktop/r10-scores`).
  - A clean DMD face (`mobile/r08-wizard`).
  - Crisp close-up lettering: SHOOT AGAIN and 2X–5X (`desktop/c03-flippers`), THE ARLINGTON and LOCK (`desktop/c01-row`).
- The small table type keeps this at the mean.

### Readability: critics 6.5 / 6.5 → proposed 7.0
- **Rebut A's main evidence:** errors 1 and 2. The desktop ball is 18–19 px with a dark rim and a highlight (`desktop/r03-play`), and all three multiball balls read (`desktop/r06-multiball`).
- **Rebut Codex's "grey ramp competes with the ball".** The ramp ball in `desktop/r05-ramp` (about 783,240) is a bright chrome disc with a dark edge against the frosted floor.
- **Rebut "arrows away from entrances"** (error 9).
- **Concede:**
  - The skill-shot cue is one small lamp (`desktop/r02-serve`), though "LANE A" matches the printed A (error 10).
  - The upper grotto painting is busy at ball scale (`mobile/r03-play`).
- **Credit:**
  - Lit and unlit inserts are distinct on both viewports (`desktop/c03-flippers`, `mobile/r07-mode`).
  - With satin bumpers, the bumpers no longer pose as balls (`mobile/r06-multiball`; both critics agree).
- Ball always visible, entrance arrows at the mouths, clear lit and unlit states: that meets the 7 anchor. The busy upper field keeps it from higher.

### Mobile: critics 6.5 / 6.5 → proposed 6.5
- **Concede in full:** `mobile/r11-landscape` puts the table in about 42% of the width (about x 330–1040 of 1688 at its widest), with a black void on the left. `ab/mobile-r11-landscape` shows the slimmer HUD barely changes this.
- **Credit:**
  - Portrait is framed on purpose: the DMD is large at the top, the table fills the width, and the ☰ and Launch buttons sit in the apron band, clear of play (`mobile/r08-wizard`, `mobile/r07-mode`).
  - The help screen fits and reads well at 390 px (`mobile/r09-help`).
- Landscape holds this at the mean.

### Authenticity: critics 7.0 / 8.0 → proposed 8.0
- **Rebut A's main markdown** (error 3). The five "interchangeable" bathhouses each have a distinct roofline and colour in `desktop/c01-row`, including Ozark's twin towers and Maurice's arcade.
- **Concede in part:** the Arlington is drawn behind the middle of the Row as the lock, not at the north end across Central Avenue. This is a layout abstraction: it still sits "across" the Row from the player, between the two halves.
- **Credit:**
  - All eight bathhouses are labelled in the correct north-to-south order (`desktop/c01-row`).
  - Quapaw's dome, Fordyce's skylight and the twin-towered Arlington (`desktop/c06-arlington`).
  - The lattice Mountain Tower (`desktop/c05-tower`).
  - The Vapors neon (`desktop/c04-vapors`).
  - 143°F springs with steam (`desktop/c02-springs`).
  - Central Avenue and Reserve St legends.
  - Hedged facts and the 1832 reservation note (`desktop/r09-help`).
- That meets every item in the 7 anchor and reaches toward "a local would name every landmark".

## IP
- Both critics found it clean, and I agree.
- Codex flags the Vapors sign as "potentially logo-like". `desktop/c04-vapors` shows a generic script-plus-block neon treatment of the place name, presented as setting, with a no-affiliation note in `desktop/r09-help`.
- The measured IP gate passed.

## Gaps (adjusted)
I add no new gaps. Where the two critics' gaps overlap (plinths and model finish; spinner glare and light grounding), I have trimmed the gains so the overlap is not counted twice.

```json
{
  "loop": 7,
  "role": "advocate",
  "tier": "high",
  "scores": {
    "art": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c02-springs", "note": "thermal-spring grotto with spring house and cascade running under the S·P·A lanes; themed, not a generic garden" },
      { "shot": "desktop/r03-play", "note": "mid-field holds SPA CITY logo, arrows, star and legends; backglass in the same hand" },
      { "shot": "desktop/c03-flippers", "note": "deco fan composed around inserts and flippers" },
      { "shot": "desktop/r02-serve", "note": "conceded: blank purple apron with plain cards" } ] },
    "toys": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "conceded: cream box plinths; bathhouse rooflines distinct" },
      { "shot": "desktop/c03-flippers", "note": "flippers carry red rubber bands; sling post rubbers present; no rubber on the kicking face" },
      { "shot": "desktop/c05-tower", "note": "lattice tower and cab, stainless blades; lower ramp floor shows art through it" },
      { "shot": "desktop/c06-arlington", "note": "twin-tower Arlington, Quapaw dome; plain grey lock walls" } ] },
    "lighting": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "GI drops, every insert lit: a real mood shift" },
      { "shot": "desktop/r03-play", "note": "conceded: spinner edge white line, about 30 px over 0.95 luminance" },
      { "shot": "desktop/c06-arlington", "note": "conceded: lock rim clips" },
      { "shot": "strips/s02-bumpers", "note": "struck bumper flashes in frames 1, 2, 4, 6" } ] },
    "animation": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper up in frames 2-3, clean ball exit" },
      { "shot": "strips/s02-bumpers", "note": "contact, body flash, changing steam" },
      { "shot": "strips/s03-multiball", "note": "insert sweep runs; framing crops the flippers (capture camera)" } ] },
    "ui": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r07-mode", "note": "horse DMD icon, 'Derby · 18/100 · 45s' progress, mode grid" },
      { "shot": "desktop/r06-multiball", "note": "twin-tower DMD icon for Arlington Multiball" },
      { "shot": "mobile/r07-mode", "note": "phone DMD names the mode and its goal; only the numbers are missing" },
      { "shot": "desktop/r08-wizard", "note": "grid matches the staged save state shown in r03, r06 and r07" },
      { "shot": "desktop/r01-title", "note": "conceded: plain rounded buttons" } ] },
    "typography": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r01-title", "note": "neon slab-serif display" },
      { "shot": "desktop/c03-flippers", "note": "crisp close-up lettering" },
      { "shot": "mobile/r09-help", "note": "readable body, fade not clip" },
      { "shot": "desktop/r03-play", "note": "conceded: about 5 px table legends at play view" } ] },
    "readability": { "score": 7.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r03-play", "note": "ball about 18-19 px with dark rim, about 4.5% of table width; beside the plate, not on it" },
      { "shot": "desktop/r06-multiball", "note": "all three balls read, including the top one on the arch rail" },
      { "shot": "desktop/r05-ramp", "note": "ramp ball reads against the frosted floor" },
      { "shot": "mobile/r06-multiball", "note": "satin bumpers no longer pose as balls" },
      { "shot": "desktop/r02-serve", "note": "conceded: single small skill-shot lamp, though it matches 'LANE A'" } ] },
    "mobile": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "conceded: table in about 42% of the width, black void" },
      { "shot": "mobile/r08-wizard", "note": "portrait framed on purpose; buttons in the apron band" },
      { "shot": "mobile/r09-help", "note": "help fits and reads at 390 px" } ] },
    "authenticity": { "score": 8.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in order, each with its own roofline (Ozark twin towers, Maurice arcade)" },
      { "shot": "desktop/c06-arlington", "note": "twin-tower Arlington, Quapaw dome, Fordyce skylight" },
      { "shot": "desktop/c05-tower", "note": "lattice Mountain Tower" },
      { "shot": "desktop/r09-help", "note": "hedged facts, 1832 note, no-affiliation note" } ] }
  },
  "ip": { "clean": true, "notes": "Agree with both critics. The Vapors sign is a generic neon treatment of the place name, presented as setting with a no-affiliation note; the measured IP gate passed." },
  "gaps": [
    { "id": "G-landscape-framing", "category": "mobile", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape", "ab/mobile-r11-landscape"], "fix": "Conceded in full (both critics). Fit the playfield's projected bounds to about 70% of the 844 px width with lower tilt; no black band wider than 40 px." },
    { "id": "G-toy-plinths-walls", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Conceded for the plinths and walls: replace the cream box plinths with stoops or sink the models, and give the scoop and lock walls a rolled metal profile. Drop the 'signature feature' items for Ozark (twin towers) and Maurice (arcade); they already exist in c01." },
    { "id": "G-model-finish", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c05-tower"], "fix": "Overlaps G-toy-plinths-walls, so gain cut from 1.0. Bevel edges and smooth the ramp facets and seam." },
    { "id": "G-shot-hierarchy", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["mobile/r03-play", "desktop/r03-play"], "fix": "Cause partly wrong: the arrows already sit at the lock, scoop and ramp mouths (r03). Remaining: quiet the grotto painting's contrast under the ball paths." },
    { "id": "G-table-type", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS5", "evidence": ["desktop/r03-play", "mobile/r03-play"], "fix": "Conceded. Enlarge the key legends and give them quiet backing; verify at 390 CSS px." },
    { "id": "G-light-grounding", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/c02-springs", "desktop/c01-row"], "fix": "Conceded; overlaps G-spinner-rim-glare, so gain cut. Tame the bumper base-ring glow and darken the contact shadows under the plinths." },
    { "id": "G-spinner-rim-glare", "category": "lighting", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r03-play", "mobile/r03-play", "desktop/c06-arlington"], "fix": "Conceded, but small: about 30 px over luminance 242 on desktop. Clamp the spinner-edge and lock-rim specular below bloom." },
    { "id": "G-multiball-strip-framing", "category": "animation", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["strips/s03-multiball"], "fix": "Conceded; this is a capture-camera framing fault. Frame the full field with two or three balls in view." },
    { "id": "G-event-followthrough", "category": "animation", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS3", "evidence": ["strips/s02-bumpers", "strips/s03-multiball"], "fix": "Add a bumper skirt drop and a clearer multiball release beat." },
    { "id": "G-apron-and-midfield-art", "category": "art", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["desktop/r02-serve"], "fix": "Apron conceded. 'Empty mid-field' is false (r03 shows the logo, arrows and star there); restyling the arrows is optional." },
    { "id": "G-hud-state-truth", "category": "ui", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r08-wizard", "mobile/r07-mode"], "fix": "The wizard grid reflects the staged save state (same in r03, r06, r07). Stage the wizard capture with all six won; optionally add mode numbers to the phone pill." },
    { "id": "G-desktop-ball-size", "category": "readability", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS6", "evidence": ["desktop/r03-play", "desktop/r06-multiball"], "fix": "Cause wrong: the ball is already about 18-19 px and near true scale, so the critic's 16 px test passes. At most, add a faint contact shadow." },
    { "id": "G-flipper-sling-rubber", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "The flippers already have red rubber and the slings have post rubbers. Only add rubber along the sling kicking face and a kicker arm." },
    { "id": "G-help-scroll", "category": "ui", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help"], "fix": "A fade mask already signals more content. Add a visible scrollbar or chevron." },
    { "id": "G-menu-deco-type", "category": "typography", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r01-title", "desktop/r09-help"], "fix": "Deco frames on the buttons. The help is a fade, not a clip, and the captures don't show the body face is a system font." },
    { "id": "G-skill-shot-cue", "category": "readability", "expectedGain": 0.1, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r02-serve"], "fix": "'LANE A' matches the printed A under the lit lamp. Add a halo or flash to that lamp only." }
  ]
}
```

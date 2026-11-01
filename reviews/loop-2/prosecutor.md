# Prosecutor: loop 2

Critic means: art 6.75, toys 5.25, lighting 5.75, animation 6.0, ui 6.5, typography 6.25, readability 6.0,
mobile 6.5, authenticity 7.0 (56.0). Critic B (codex) wrote 59 and Critic A (claude) wrote 53. Most of the gap comes
from B giving credit the captures don't support: 7s in art, UI and mobile, 7.5 in authenticity, 6.5 in animation.
All paths are relative to `games/Pinball/screenshots/review-loop-2/`. I opened every close-up, every desktop frame,
the key phone frames and all three strips, and zoomed into the disputed regions.

**Proposed total: 51.5 / 90.**

## Measured check: mode lighting
I took the mean RGB of the playfield region (x 450–830, y 20–780) in the desktop frames:

| Frame | R | G | B |
|---|---|---|---|
| `desktop/r03-play` | 99.7 | 77.9 | 65.0 |
| `desktop/r04-bumpers` | 99.4 | 77.4 | 64.6 |
| `desktop/r06-multiball` | 102.1 | 79.2 | 64.2 |
| `desktop/r07-mode` | 103.1 | 81.1 | 67.6 |
| `desktop/r08-wizard` | 102.1 | 79.6 | 63.7 |

The change list says "each mode and multiball tints the fill light, and the wizard dims the key light". The numbers
say otherwise. The wizard frame is *brighter* than plain play, and no frame moves more than 3.4 levels on any
channel. Whatever the code does, the captures show no mood shift.

## Category by category

### Art: 6.0 (mean 6.75, argued down)
The painting is good, and composing it over the layout was the right move (`desktop/c02-springs`,
`desktop/c03-flippers`). The rubric's 7 also asks for "inserts and lettering integrated", and the zooms show the
lettering laid over the art without a layout pass:
- `desktop/s03-multiball-0` and `desktop/c04-vapors`: the painted vertical "THE VAPORS" label runs into the SPA CITY
  logo, and its last letters sit under the "S".
- `desktop/s03-multiball-0`: the Central Avenue spinner sits on the word, so the label reads "CENTRAL … NUE".
- `desktop/s03-multiball-0`, `mobile/r02-serve`: the Mountain Tower arrow covers the "W" of "TOWER", and its three
  lamp dots sit on top of "MOUNTAIN".
- `desktop/c01-row` (zoomed), `desktop/s03-multiball-0`: the SUPERIOR label is jammed under HALE, so it reads
  "SUPERI HALE", and the Superior insert is buried under the Vapors sign housing.

That makes four collisions in one frame. On top of that, the upper third reads as even foliage noise behind the
bumpers (`desktop/r03-play`), and nothing in the terrazzo field points at a shot (`desktop/c03-flippers`). Critic B's
7 says the lettering is "separate graphic elements" and stops there. Being separate is exactly the problem: the
lettering isn't integrated with the art.

### Toys: 5.0 (mean 5.25, argued down)
This sits on the 5 anchor ("recognisable models in flat materials; rails and walls read as grey blocks"):
- `desktop/c04-vapors`, `desktop/c06-arlington`: the walls are unbevelled black extrusions with flat ochre caps, and
  the post rubbers are white half-moons.
- `desktop/c05-tower` (zoomed): a defect neither critic reported. The ramp's side walls are built from offset
  segments, and their edges step like a sawtooth along both rails. The ramp floor has a hard seam halfway down, and
  the gold playfield wall shows straight through it. The habitrail is a set of emissive blue-white lines with no
  shading. Critic B calls this a "chrome wireform"; it is unlit glow, not chrome.
- `desktop/c03-flippers`: the flippers are flat white slabs with no taper, and the slings have no rubber.
  `desktop/c02-springs`: the bumper bodies are matte, opaque peach.
- `desktop/c04-vapors` (zoomed): the Vapors toy is a plain grey box topped by a white block.

The tower and the chrome ball are the only parts near 7. B's 5.5 is generous.

### Lighting: 5.0 (mean 5.75, argued down)
The rubric's 5 reads "lamps light but look pasted on; washed-out or blown areas", and the captures meet it:
- `desktop/c06-arlington`: a blue-white glare blob about 200 px across sits over the left field.
  `desktop/c04-vapors`: a blown white rollover lamp at top left.
- The table above shows no mood shift. In `desktop/r08-wizard` (zoomed against `r03-play`), the six mode-arc
  inserts are all *unlit* and the shot arrows are dark. The wizard frame lights only the Row, the lock and the
  multipliers.
- No toy is grounded. The bathhouse blocks (`desktop/c01-row`), the Arlington (`desktop/c06-arlington`) and the
  tower (`desktop/c05-tower`) cast no visible contact shadow on the art.
- `desktop/r04-bumpers`: in the frame named for the pop bumpers, the bumpers aren't flashing and the ball is above
  them.

Inserts do bloom only where lit (`desktop/c03-flippers`), which keeps this off 4.5.

### Animation: 5.5 (mean 6.0, argued down)
- `strips/s01-flip`: one flipper snaps between frames 2 and 3. The other flipper, the slings and the lamps don't
  react at all, and there is no ball trail.
- `strips/s02-bumpers`: the caps flash and decay. No ring drop or skirt travel is visible, and the ball has left the
  frame by frames 5 to 7, so half the strip shows the decay with nothing hitting.
- `strips/s03-multiball`: the arc chase is the best motion in the build, but no ball is in view until frame 5.

Against the 7 anchor's list: flippers snap (yes), bumpers flash (yes) and drop (no), light shows run (yes), steam
rises (grey dots, `desktop/c02-springs`), the camera reacts to nudges (not shown). The new slingshot flash and dip
appear in no strip. B's 6.5 credits "steam changes position" and "lamp decay" as game feel. That is the 5 anchor's
"little else reacts", plus one chase.

### UI: 6.0 (mean 6.5, argued down)
The rubric's 7 requires "nothing overlapping" and "a DMD with character and readable animations":
- `desktop/r09-help`: a two-column dialog. The right column is about 40% empty below "About", while the left
  column's last bullet runs under the pinned Back bar. This overflow is avoidable on a 1280×800 screen. The same
  overflow happens in `mobile/r09-help` ("what's lit, or pays a mystery award." is half under Back).
- `desktop/r07-mode`, `desktop/r08-wizard`, `mobile/r06-multiball`: the DMD's picture panel is dithered noise. The
  wizard text wraps into "VALLEY OF THE / VAPORS / ALL SHOTS LIT / • 60 SECONDS", with an orphaned bullet line.
- The score shows twice: in the DMD and the side panel on desktop (`desktop/r03-play`), and in the DMD and the chip
  on mobile (`mobile/r03-play`). The desktop side panel is empty below the buttons.
- `desktop/r01-title`, `desktop/r10-scores`: the browser's cyan focus ring sits around the gold buttons, outside the
  deco palette.

The menus are tidy, which is a 6, not B's 7.

### Typography: 6.0 (mean 6.25, accept Critic A)
The slab "PINBALL" lockup is deliberate (`desktop/r01-title`), and the body face is a generic system sans
(`desktop/r09-help`). At play scale, playfield lettering is not crisp. In `desktop/r03-play` (zoomed), "SHOOT AGAIN"
renders as broken glyphs ("SHOO'' AGAIN"), and the apron cards and insert labels are unreadable smudges. The phone
DMD's four lines of 5×7 type are cramped (`mobile/r07-mode`). The lettering collisions listed under Art also cost
here. 6.0 holds; B's 6.5 overlooks the play-scale breakage.

### Readability: 5.5 (mean 6.0, argued down)
The rubric's 7 reads "every shot's entrance and lamp is obvious, lit vs unlit inserts are clear on both viewports".
- `desktop/r02-serve` (zoomed), `mobile/r02-serve`: the DMD says "SKILL SHOT: LANE A", but the A lamp is only a shade
  lighter ochre than S and P, with no bloom and no flash. At native size you can't tell which lane is lit.
- `desktop/r08-wizard`: the DMD says "ALL SHOTS LIT" while the shot arrows (left orbit, centre, Mountain Tower) and
  the whole mode arc are dark. The lamps contradict the DMD in the one mode built around lit shots.
- `desktop/r05-ramp`: the ball on the clear ramp is about 8 px and pale on pale. `desktop/r04-bumpers`: the ball is
  small over dark foliage.

The multiball balls are findable (`desktop/r06-multiball`, `mobile/r06-multiball`), which keeps this at 5.5.

### Mobile: 6.0 (mean 6.5, accept Critic A)
Portrait is framed well (`mobile/r03-play`, `mobile/r06-multiball`), and Launch sits below the apron
(`mobile/r02-serve`). Against that:
- `mobile/r11-landscape`: the top of the frame cuts at the SPA CITY logo. The bumpers, the Row, the Arlington lock
  and the ramp entrance are all off-screen while the ball is mid-field, so the player can't see what they are aiming
  at. The right panel is about half empty below the buttons.
- `mobile/r07-mode`: the DMD is about half the screen width, with four cramped lines.
- The score chip slightly overlaps the gold arch rail at top left (`mobile/r06-multiball`, zoomed).

The rubric's 7 asks that the table be "framed on purpose in portrait **and** landscape". Landscape isn't, so B's 7
does not hold.

### Authenticity: 6.5 (mean 7.0, argued down)
- `desktop/c04-vapors` (zoomed), `desktop/c01-row` (zoomed): the Vapors neon sign, the landmark the scoop is named
  for, reads backwards. The glyphs are mirrored and inverted ("2BO…"), so "VAPORS" cannot be read in either close-up.
  Neither critic saw this.
- `desktop/c01-row`: no SUPERIOR label is legible, because the label is overlapped by HALE and its insert sits under
  the sign housing. The first bathhouse of the Row is therefore unreadable in the frame meant to show the Row.
- Most bathhouse models are beige blocks that you identify by their labels. Only the Quapaw dome and the twin-towered
  Ozark read without a label (`desktop/c01-row`, `desktop/c06-arlington`).
- The springs' steam is grey dots (`desktop/c02-springs`, `desktop/r03-play`).

The Arlington, the tower, the tufa cascade and the hedged help text (`desktop/r09-help`) are real strengths. The
rubric's 7 asks for "the Row's eight bathhouses recognisable" and "the Vapors". Both fall short, so B's 7.5 is the
least defensible score in either review.

## IP check
Clean on my inspection. I saw no commercial pinball title, logo or trade dress. The backglass neon at right
(`desktop/r03-play`) carries no legible words. The playfield painting has no text baked in: every word on it is a
vector overlay, as the overlaps above show. The help text disclaims business affiliation. "Valley of the Vapors" is
a local place nickname and is used generically.

## Added gaps (missed or under-specified by both critics)
1. **G-label-layout-pass** (art, WS4, sev 3, S, +0.5): move the overlays so none of them collides. Separate SUPERIOR
   from HALE and move the Superior insert out from under the Vapors housing. Move the Central Avenue label off the
   spinner and the Mountain Tower lamps and arrow off their label. End "THE VAPORS" before the SPA CITY logo.
   Test: in `desktop/s03-multiball-0`, no overlay letter is covered by a toy, a lamp or another label.
2. **G-vapors-sign-readable** (authenticity, WS2, sev 3, S, +0.5): fix the neon texture's mirroring and orientation
   so that "VAPORS" reads from the player camera, and enlarge the sign about twice. Test: "VAPORS" is legible in
   `desktop/c04-vapors` and `desktop/c01-row`.
3. **G-mode-light-delta** (lighting, WS1, sev 4, M, +0.75): make modes actually visible in the frame. Test (measured,
   using the region in the table above): `desktop/r08-wizard` mean luminance at least 20% below `r03-play`, and
   `r06-multiball`/`r07-mode` hue-shifted by 10 or more levels on one channel. Today the delta is ≤ 3.4.
4. **G-wizard-lamp-truth** (readability, WS3, sev 3, S, +0.5): while the DMD says "ALL SHOTS LIT", flash every shot
   arrow and keep the mode arc chasing, never all dark. Test: every shot arrow is lit in `desktop/r08-wizard`.
5. **G-skill-shot-lamp** (readability, WS1, sev 3, S, +0.5): flash the lit skill lane at about 4 Hz with bloom and
   darken the unlit lanes. Test: in `desktop/r02-serve`, the lit lane's lamp is at least 2× the luminance of the
   others.
6. **G-ramp-segments** (toys, WS2, sev 3, M, +0.5): build the ramp rails from one continuous swept profile instead of
   offset segments, remove the floor seam, and give the floor a tint so the wall below doesn't show through. Test:
   both rail edges are smooth in `desktop/c05-tower`.
7. **G-help-columns** (ui, WS5, sev 2, S, +0.25): rebalance the desktop help so the left column ends above Back,
   moving the Table bullets into the empty right column. Test: no text under Back in `desktop/r09-help` at
   1280×800.

```json
{
  "loop": 2,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/s03-multiball-0", "note": "four lettering collisions: THE VAPORS under logo, spinner on CENTRAL AVENUE, arrow and lamps on MOUNTAIN TOWER, SUPERIOR jammed under HALE" },
      { "shot": "desktop/c04-vapors", "note": "VAPORS label runs into SPA CITY logo" },
      { "shot": "desktop/r03-play", "note": "upper third even foliage noise; art does not lead to shots" },
      { "shot": "desktop/c03-flippers", "note": "terrazzo field has no shot cues" }
    ] },
    "toys": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/c05-tower", "note": "ramp rails built from offset segments with sawtooth edges, floor seam, wall shows through; habitrail is emissive lines" },
      { "shot": "desktop/c04-vapors", "note": "unbevelled black walls, flat caps, white half-moon post rubbers, Vapors a plain box" },
      { "shot": "desktop/c03-flippers", "note": "slab flippers, slings without rubber" },
      { "shot": "desktop/c02-springs", "note": "opaque matte peach bumper bodies" }
    ] },
    "lighting": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "playfield mean RGB within 3.4 levels of r03 (wizard brighter, not dimmer); mode arc and shot arrows unlit" },
      { "shot": "desktop/c06-arlington", "note": "~200 px blue-white glare blob; no contact shadows" },
      { "shot": "desktop/c04-vapors", "note": "blown white rollover lamp" },
      { "shot": "desktop/c05-tower", "note": "tower casts no shadow" },
      { "shot": "desktop/c03-flippers", "note": "inserts bloom only where lit" }
    ] },
    "animation": { "score": 5.5, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "one flipper snaps; no sling, lamp or trail reaction" },
      { "shot": "strips/s02-bumpers", "note": "cap flash and decay only; no ring drop; ball gone by frames 5-7" },
      { "shot": "strips/s03-multiball", "note": "arc chase runs; no ball visible until frame 5" }
    ] },
    "ui": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r09-help", "note": "right column 40% empty while left column runs under pinned Back" },
      { "shot": "mobile/r09-help", "note": "last bullet half under Back" },
      { "shot": "desktop/r08-wizard", "note": "DMD art dithered noise; orphaned '• 60 SECONDS' line" },
      { "shot": "mobile/r03-play", "note": "score duplicated in DMD and chip" }
    ] },
    "typography": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate slab lockup; generic body sans" },
      { "shot": "desktop/r03-play", "note": "SHOOT AGAIN renders as broken glyphs; apron and insert labels unreadable" },
      { "shot": "mobile/r07-mode", "note": "cramped four-line phone DMD" }
    ] },
    "readability": { "score": 5.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r02-serve", "note": "lit skill lane A barely lighter than S and P; no bloom or flash" },
      { "shot": "desktop/r08-wizard", "note": "DMD says ALL SHOTS LIT while shot arrows and mode arc are dark" },
      { "shot": "desktop/r05-ramp", "note": "ball ~8 px, pale on pale ramp" },
      { "shot": "mobile/r06-multiball", "note": "three balls findable" }
    ] },
    "mobile": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "upper half (bumpers, Row, lock, ramp entrance) off-screen mid-play; side panel half empty" },
      { "shot": "mobile/r03-play", "note": "portrait framed well" },
      { "shot": "mobile/r07-mode", "note": "DMD half width, four cramped lines" }
    ] },
    "authenticity": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "Vapors neon glyphs mirrored and inverted; VAPORS unreadable" },
      { "shot": "desktop/c01-row", "note": "SUPERIOR label illegible (overlapped, insert under sign); most bathhouses interchangeable blocks" },
      { "shot": "desktop/c06-arlington", "note": "Arlington twin towers recognisable" },
      { "shot": "desktop/r09-help", "note": "facts hedged" }
    ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art; no text inside the paintings (all lettering is vector overlay); backglass neon has no legible words." },
  "gaps": [
    { "id": "G-label-layout-pass", "category": "art", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/s03-multiball-0", "desktop/c01-row", "desktop/c04-vapors", "mobile/r02-serve"], "fix": "Separate SUPERIOR from HALE and move the Superior insert from under the Vapors housing; move CENTRAL AVENUE off the spinner and the Mountain Tower lamps and arrow off their label; end THE VAPORS before the SPA CITY logo. Test: no overlay letter is covered in desktop/s03-multiball-0." },
    { "id": "G-vapors-sign-readable", "category": "authenticity", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c01-row"], "fix": "Fix the neon texture mirroring and orientation so VAPORS reads from the player camera; enlarge the sign about 2x. Test: VAPORS legible in desktop/c04-vapors." },
    { "id": "G-mode-light-delta", "category": "lighting", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard"], "fix": "Make mode lighting visible. Test: playfield-region (x450-830, y20-780) mean luminance in r08-wizard at least 20% below r03-play, and r06/r07 shifted 10+ levels on one channel (today the delta is <=3.4)." },
    { "id": "G-wizard-lamp-truth", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS3", "evidence": ["desktop/r08-wizard"], "fix": "While the DMD says ALL SHOTS LIT, flash every shot arrow and keep the mode arc chasing, never all dark. Test: every shot arrow lit in desktop/r08-wizard." },
    { "id": "G-skill-shot-lamp", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Flash the lit skill lane at about 4 Hz with bloom; darken unlit lanes. Test: in desktop/r02-serve the lit lane lamp is >= 2x the luminance of the others." },
    { "id": "G-ramp-segments", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c05-tower"], "fix": "Build the ramp rails from one continuous swept profile, remove the floor seam, and tint the floor so the wall below doesn't show through. Test: both rail edges smooth in desktop/c05-tower." },
    { "id": "G-help-columns", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "mobile/r09-help"], "fix": "Rebalance the desktop help columns (move the Table bullets right) and give the phone dialog bottom clearance. Test: no text under Back in desktop/r09-help or mobile/r09-help." }
  ]
}
```

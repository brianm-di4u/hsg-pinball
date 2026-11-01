# Judge: loop 4

All capture paths are relative to `games/Pinball/screenshots/review-loop-4/`. I opened at full size: `desktop/c01-row`,
`desktop/c03-flippers`, `desktop/c04-vapors`, `desktop/r02-serve`, `desktop/r08-wizard`, `desktop/r09-help`,
`mobile/r03-play`, `mobile/r11-landscape`, `strips/s02-bumpers` and `strips/s03-multiball`. I took my own luma
measurements (0–255 grayscale) where reviewers disputed lighting and the skill-shot lamp.

## Spread and where I had to rule
Critic A / Codex / prosecutor / advocate: art 6.5/6.5/6.0/6.5, toys 6.0/6.5/5.5/6.5, lighting 6.5/6.5/6.0/6.5,
animation 6.0/6.5/6.0/6.5, ui 7.0/7.0/6.5/7.0, typography 6.5/6.5/6.0/6.5, readability 6.5/6.5/6.0/6.5, mobile
6.5/6.5/6.0/6.5, authenticity 7.0/7.5/6.5/7.5. No category has a gap of more than 1.0 between the critics or between
the prosecutor and the advocate. Toys and authenticity sit at exactly 1.0, so I checked those close-ups anyway, along
with every disputed factual claim.

### Factual disputes, checked
- **Mood darkening.** All four agree it doesn't show in the frames. The advocate has the cause right. On a lamp-free
  patch left of the left sling (desktop x 470–500, y 560–640) the median is 73 / 74 / 72 / 72 across r03, r06, r07 and
  r08. A phone lower-left patch is 77 in all four. So GI is never scaled in these states. Over the whole table the
  median goes 78 → 81 → 80 → 83, because lamps add spill on top of an undimmed GI. Test this on an unlit patch, not
  on the frame mean.
- **Skill-shot halo.** It is absent (`desktop/r02-serve`). The peak luma is 179 at the lit A lamp against 125 at S
  and 116 at P: about 1.5×, nowhere near "unlit at about 12%". I see no halo. All four reviewers are right.
- **The ball.** In `desktop/c03-flippers` the ball is a see-through glass sphere, and in `strips/s02-bumpers` it is a
  warm, peach-glowing pearl. The prosecutor's "glass marble, not chrome" is the most accurate description. The
  advocate is right that it picks up some table colour, and Critic A's "X-pattern" shows only at play scale. Either
  way it fails the 7 anchor's "a chrome ball".
- **Keyline misregister** (raised only by the prosecutor). Confirmed. In `desktop/c03-flippers` thin gold printed
  lines run beside and past both slingshots and the inlane guides. In `desktop/c04-vapors` they continue well past the
  ends of the brass guides onto the paving.
- **Bumper facets** (Codex). Not supported. In `desktop/c01-row` and `strips/s02-bumpers` the teal bodies are smooth
  translucent cylinders. The advocate is right.
- **Bumper cap drop** (Codex). I can't see it in `strips/s02-bumpers`, so I don't credit it. The flash and decay are
  real: bright in frames 0–2, settled by 4–6.
- **CENTRAL AVENUE clip.** It occurs only in the `desktop/c04-vapors` close-up, behind the glaring white harlequin
  block, and the label is whole in play view. The advocate is right; I drop it from the label gap. "PERIC HALE"
  (`desktop/c01-row`) and "MOUNTAIN TOW" cut by its plate (`mobile/r03-play`, `desktop/r02-serve`) are confirmed.
- **Wizard "ALL SHOTS LIT"** (prosecutor). Partly right. In `desktop/r08-wizard` the shot arrows (blue orbit, pink
  centre, yellow ramp, green right) are lit, so "shots dark" overstates it. But all six mode inserts are dark purple,
  and the help screen says playing all six is what lights the wizard. The lamp state contradicts the rules in the
  game's biggest moment. That stands as a readability defect.
- **Steam leak.** Confirmed. Particles draw above the arch and out into the black void in `desktop/r02-serve` (top
  edge) and `mobile/r11-landscape`.
- **Help.** Confirmed in `desktop/r09-help`: the body cuts mid-line ("meter for an extra ball") with no fade, Back
  carries the browser-default cyan focus ring, and the About text ends in "(fact: reserved, older)", which reads as a
  leftover developer note.
- **Landscape width.** The advocate's apron and arch measurements (about 52% and 27%) match what I see in
  `mobile/r11-landscape`. The table is whole and sits left of a large dark gap, the upper field is compressed, and the
  side panel is blank below the buttons.

## IP
Everyone reported clean, and nobody raised a commercial pinball name, logo or art. I checked the backglass in
`desktop/r02-serve` and `desktop/r08-wizard`: the painting has no lettering, the neon canopy is blank, and the title is
HTML. The playfield paintings in `desktop/c01-row` and `strips/s02-bumpers` carry no embedded text; every word is a
game-rendered plate. Ruling: clean, which agrees with the measured IP gate.

## Rulings by category

### Art: 6.5
The lower deco fan frames the multipliers and SHOOT AGAIN (`desktop/c03-flippers`). The backglass is a strong
painting of the Row at night (`desktop/r02-serve`). The mid-plaza has fan bands behind the logo: sparse, but designed,
so the advocate is right there. Against that:
- The upper garden isn't composed around the orbit or the ramp mouth.
- The printed keylines no longer match the hardware (`desktop/c03-flippers`, `desktop/c04-vapors`), which is exactly
  the "composed around the layout" test.

The keylines are a real defect, but they're subtle at play scale. The critics' 6.5 holds.

### Toys and materials: 6.0
Two things are good:
- the teal bumper bodies (`desktop/c01-row`);
- the lattice tower and the cross-tied wireform (`desktop/r02-serve`, `mobile/r03-play`).

Against them:
- The ball is glass, not chrome (`desktop/c03-flippers`).
- The slingshots are sails on blocks with a holed kicker box: no posts, rubber or cover (`desktop/c03-flippers`).
- Both scoops are bare holes with a ring, and the brass tubes are about as thick as the ball (`desktop/c04-vapors`).
- The bathhouses are clean extrusions with flat window decals and no grounding (`desktop/c01-row`).

Every landmark reads at a glance, so this is above the 5 anchor. But two named items of the 7 anchor (the chrome
ball, plausible rubber) fail. I side with Critic A over Codex and the advocate.

### Lighting: 6.0
Credit:
- the interior bumper glow and soft pool (`strips/s02-bumpers`);
- inserts that bloom only when lit (`desktop/c03-flippers`);
- a real dark-room look in `strips/s03-multiball`.

Against, all confirmed on the captures:
- The stated mood GI drop isn't applied in the frames (my patch numbers above).
- White hotspots sit on unlit bumper bases.
- There is a white spinner streak and glaring wireform bars (`mobile/r03-play`).
- No toy has a contact shadow (`desktop/c01-row`).
- An orange leak glows in the void (`strips/s03-multiball`, frames 0 and 7).

Two clauses of the 7 anchor fail outright ("soft shadows ground every toy", "no glare"). I agree with the prosecutor
here over the critics' 6.5. The critics didn't weigh the glare and the missing shadows against the anchor.

### Animation and game feel: 6.5
What the strips show:
- `strips/s01-flip`: a clean flipper snap and the ball's travel up the field.
- `strips/s02-bumpers`: hit flash and decay, and a lane lamp in frame 7.
- `strips/s03-multiball`: a real purple chase around the mode arc with arrow flashes.

The steam is a dot column that leaks outside the cabinet (`desktop/r02-serve`), and no secondary mechanical motion
(sling kick, cap drop) is visible. Three of the 7 anchor's items are met and two aren't, so I side with the advocate
and Codex at 6.5.

### UI, DMD and HUD: 7.0
The DMD meets the 7 anchor: silhouettes with complete objectives, and the score shown once (`desktop/r08-wizard`,
`mobile/r03-play`). The menus share the gold-on-navy frame. The blemishes are all small fixes:
- the browser focus ring;
- help truncated with no affordance, and a developer-note line (`desktop/r09-help`);
- an empty lower right panel with a dead Launch button (`desktop/r02-serve`).

Taken together they don't pull this below the anchor. The critics' 7.0 stands.

### Typography: 6.5
The display wordmark and the DMD dot font are good (`desktop/r08-wizard`, `mobile/r03-play`). Playfield lettering
isn't crisp:
- MOUNTAIN TOW is cut by its plate (`mobile/r03-play`);
- PERIC HALE (`desktop/c01-row`);
- an illegible Vapors neon (`desktop/c04-vapors`);
- 3–4 px plates at play size.

The critics' 6.5 is right.

### Readability: 6.5
In favour:
- The ball stands out on the warm lower field (`mobile/r03-play`).
- The mode arrows and the lit/unlit multipliers are clear (`desktop/c03-flippers`).

Against:
- The skill-shot lamp is only 1.5× its neighbours, with no halo (`desktop/r02-serve`).
- The wizard's mode inserts are dark (`desktop/r08-wizard`).
- The glass ball takes on underlying colours and competes with hotspots.

These are specific, cheap defects, not a general failure of shot language, so I hold 6.5.

### Mobile: 6.5
Portrait is framed on purpose (`mobile/r03-play`): a big DMD, and buttons on the apron clear of the ball's area. It
sits at the 7 anchor. Landscape is whole but cramped (`mobile/r11-landscape`):
- arch width about 27%;
- the upper field compressed;
- steam in the void;
- a blank side panel.

On balance it lands at 6.5.

### Authenticity: 7.0
The Row is named in correct order, with the Quapaw dome and the Ozark towers (`desktop/c01-row`). The Arlington, the
lattice Mountain Tower and the 143°F caps are all present (`desktop/c01-row`, `desktop/r02-serve`). Two of the anchor's
items are weak:
- the Vapors is a small block with an illegible vertical neon (`desktop/c04-vapors`);
- the steam reads as dots.

That rules out the advocate's 7.5. The landmarks that matter most are right, which rules out the prosecutor's 6.5.

**Total: 58.5 / 90.** Seven categories are below their gate (art, toys, lighting, animation, typography,
readability, mobile), so the verdict is **continue**.

## Ranked gaps (expected gain ÷ effort)
1. **G-mood-gi-scale** (lighting, sev 4, S, WS1, +0.5). GI is never scaled in the mode, multiball or wizard states the
   game reaches (unlit patch 73/74/72/72). Apply the mood scale from game state each frame, not only on transition,
   so the capture script's direct state set also gets it. Test: on the lamp-free patch left of the left sling, the
   median is ≤ 0.8× r03 in r07, ≤ 0.6× in r06 and ≤ 0.4× in r08, with lit-insert peaks unchanged.
2. **G-skill-shot-halo** (readability, sev 3, S, WS1, +0.5). The A lamp is 179 against 125 for S and 116 for P, with
   no halo (`desktop/r02-serve`, `mobile/r02-serve`). Render the announced halo and dim the unlit lanes. Test: lit
   lane peak ≥ 3× each unlit lane, halo ≥ 2 lane-widths across, on both viewports.
3. **G-label-clip** (typography, sev 3, S, WS4, +0.5). MOUNTAIN TOW is cut by its plate, and SUPERIOR is hidden under
   the Vapors post as "PERIC" (`mobile/r03-play`, `desktop/c01-row`). Fit MOUNTAIN TOWER inside its plate and move
   SUPERIOR clear of the guide. Extend `tools/check-layout.mjs` to fail on glyphs overflowing their plate and on
   labels occluded by meshes from the play and close-up cameras.
4. **G-ball-chrome** (toys, sev 3, S, WS1, +0.5). The ball is translucent glass (`desktop/c03-flippers`,
   `strips/s02-bumpers`). Make it opaque, metalness 1, roughness ≤ 0.1, with a playfield cube-capture env map and a
   soft contact shadow. Test: in c03 the ball is opaque, mirrors the flippers and inserts, and casts a visible shadow.
5. **G-wizard-lamp-state** (readability, sev 3, S, WS1, +0.3). In the wizard all six mode inserts are dark, though
   completing them is what lit it (`desktop/r08-wizard`, `mobile/r08-wizard`). In the wizard, light (or chase) all six
   mode inserts and flash every shot arrow. Test: all six inserts are lit in r08 on both viewports.
6. **G-glare-hotspots** (lighting, sev 3, S, WS1, +0.3). Unlit bumper bases blow out, and there is a white spinner
   streak and glaring wireform bars (`strips/s02-bumpers`, `mobile/r03-play`, `desktop/c04-vapors` harlequin block).
   Cap specular and emissive output on unlit hardware and drop the emissive wireform bars. Test: no unlit-hardware
   pixel ≥ 245 luma in r03 or r04, and the ball is the brightest object in the upper field.
7. **G-keyline-misregister** (art, sev 3, S, WS4, +0.3). Printed gold keylines are offset from the slings and guides
   and run past them (`desktop/c03-flippers`, `desktop/c04-vapors`). Regenerate them from the current hardware
   footprints. Test: in a geometry-over-texture overlay every keyline is within 1 mm of its part and ends within 2 mm
   of the part's end.
8. **G-menu-polish** (ui, sev 2, S, WS5, +0.3). There is a browser-default cyan focus ring on every menu, help cuts
   mid-line with no affordance, the About text ends in a developer note, and a dead Launch button sits in play
   (`desktop/r09-help`, `desktop/r02-serve`). Fix with a gold deco `:focus-visible` style, a bottom fade plus scroll
   cue on help, the "(fact: reserved, older)" text removed, and Launch hidden once the ball is in play. Test: no
   default outline in any capture, and no help line is cut without a fade.
9. **G-hardware-models** (toys, sev 3, M, WS2, +0.5). The slings are sails on blocks with a holed kicker, the scoops
   are bare holes, the brass tubes are ball-thick, and the ramp floor has a seam and kink at the bend
   (`desktop/c03-flippers`, `desktop/c04-vapors`, `desktop/c01-row`). Model slings with 3 posts, rubber rings, a white
   band and a plastic cover. Give both scoops a metal housing with a lip, thin the brass to under half the ball's
   diameter, and smooth the ramp floor. Test: the c03 and c04 close-ups show rubber bands and scoop lips.
10. **G-landscape-fill** (mobile, sev 3, M, WS6, +0.5). In `mobile/r11-landscape` the arch spans about 27% of the
    width, the upper field is compressed, and the side panel is blank. Retune target, distance and tilt so the
    playfield averages ≥ 60% of the canvas width between arch and apron and the upper field gets ≥ 25% of the table
    height. Use the blank panel area for status.
11. **G-steam-plume** (animation, sev 3, M, WS3, +0.5). The steam is a dot column drawn over the arch and into the void
    (`desktop/r02-serve`, `mobile/r11-landscape`, `strips/s02-bumpers`). Depth-test and clip the particles to the
    cabinet volume and replace the dots with soft noise billboards that rise, widen and fade. Add a visible bumper cap
    drop on hits. Test: zero particle pixels outside the cabinet silhouette in r02 and r11, and a cap drop measurable
    between strip frames.
12. **G-landmark-detail** (toys, sev 3, **L**, WS2, +0.5). **Big lever for toys** (it also lifts authenticity). The
    bathhouses, the Arlington and the Vapors are flat extrusions with window decals and no grounding (`desktop/c01-row`,
    `desktop/c04-vapors`). Add cornices, window reveals, roof trim and baked AO contact shadows. Rebuild the Vapors as
    a recognisable facade with a horizontal neon VAPORS marquee. Test: in the c01 close-up each facade shows trim and
    a contact shadow, and the marquee is ≥ 20 px tall in c04 and legible at 1280 in play.

## Verdict
**continue.** Seven categories are below gate. The perf and IP gates pass. Items 1–8 are all S and target the defects
that most directly fail the 7 anchors in lighting, readability, typography and toys.

```json
{
  "loop": 4,
  "role": "judge",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "lower deco fan frames multipliers and SHOOT AGAIN; printed keylines offset from slings and guides" },
      { "shot": "desktop/r02-serve", "note": "strong backglass; mid-plaza sparse but designed; upper garden not composed around orbit or ramp" },
      { "shot": "desktop/c04-vapors", "note": "keylines run well past the brass guide ends" } ] },
    "toys": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c03-flippers", "note": "glass, not chrome, ball; slings are sails on blocks with holed kicker, no posts or rubber" },
      { "shot": "desktop/c04-vapors", "note": "ball-thick brass tubes, bare-hole scoop, tiny white-block Vapors" },
      { "shot": "desktop/c01-row", "note": "smooth teal bumper bodies good; bathhouses flat extrusions without grounding" },
      { "shot": "mobile/r03-play", "note": "lattice tower and cross-tied wireform read well" } ] },
    "lighting": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "unlit patch median 72 vs 73 in r03: GI never scaled; whole table brighter from spill" },
      { "shot": "strips/s02-bumpers", "note": "interior bumper glow and soft pool good; unlit bases blow out" },
      { "shot": "mobile/r03-play", "note": "white spinner streak and glaring wireform bars" },
      { "shot": "strips/s03-multiball", "note": "dark table carried by inserts; orange leak in the void frames 0 and 7" },
      { "shot": "desktop/c01-row", "note": "no contact shadows under toys" } ] },
    "animation": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper snaps frame 2-3, ball travels up field; nothing else reacts" },
      { "shot": "strips/s02-bumpers", "note": "hit flash frames 0-2, decay by 4-6, lane lamp frame 7; no visible cap drop" },
      { "shot": "strips/s03-multiball", "note": "purple chase around mode arc with arrow flashes" },
      { "shot": "desktop/r02-serve", "note": "steam dots drawn above the arch into the void" } ] },
    "ui": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "DMD silhouette with complete objective; score once" },
      { "shot": "desktop/r09-help", "note": "deco frame; default cyan focus ring, mid-line cut, developer-note text" },
      { "shot": "desktop/r02-serve", "note": "empty lower right panel, dead Launch button" } ] },
    "typography": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r03-play", "note": "MOUNTAIN TOW cut by plate; tiny plates; DMD font clean" },
      { "shot": "desktop/c01-row", "note": "PERIC HALE: SUPERIOR hidden under Vapors post" },
      { "shot": "desktop/r08-wizard", "note": "neon wordmark with character" } ] },
    "readability": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r02-serve", "note": "skill lamp A peak 179 vs S 125 and P 116, no halo" },
      { "shot": "desktop/r08-wizard", "note": "shot arrows lit, but all six mode inserts dark in the wizard" },
      { "shot": "mobile/r03-play", "note": "ball stands out on lower field; mode arrows clear" },
      { "shot": "desktop/c03-flippers", "note": "lit vs unlit multipliers clear" } ] },
    "mobile": { "score": 6.5, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait framed on purpose, big DMD, buttons on apron" },
      { "shot": "mobile/r11-landscape", "note": "whole table but ~27% width at arch, compressed upper field, blank side panel, steam in void" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses named in order, Quapaw dome, Ozark towers, Arlington, 143F caps" },
      { "shot": "desktop/c04-vapors", "note": "Vapors unrecognisable: small block, illegible vertical neon" },
      { "shot": "desktop/r02-serve", "note": "backglass Row and tower on the ridge; steam reads as dots" } ] }
  },
  "ip": { "clean": true, "notes": "Checked backglass (r02, r08) and playfield paintings (c01, s02): no embedded text, no commercial pinball or business marks; all words are game plates." },
  "gaps": [
    { "id": "G-mood-gi-scale", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r06-multiball", "desktop/r07-mode", "desktop/r08-wizard", "mobile/r08-wizard"], "fix": "Apply the mood GI scale from game state every frame (not only on transition) so directly set capture states get it. Test: lamp-free patch left of the left sling has median <= 0.8x r03 in r07, <= 0.6x in r06, <= 0.4x in r08, lit-insert peaks unchanged." },
    { "id": "G-skill-shot-halo", "category": "readability", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r02-serve", "mobile/r02-serve"], "fix": "Render the skill-lane halo and dim unlit S/P lanes at serve. Test: lit lane peak >= 3x each unlit lane (now 179 vs 125/116), halo >= 2 lane-widths, both viewports." },
    { "id": "G-label-clip", "category": "typography", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["mobile/r03-play", "desktop/r02-serve", "desktop/c01-row"], "fix": "Fit MOUNTAIN TOWER inside its plate and move SUPERIOR clear of the Vapors post; extend tools/check-layout.mjs to fail on glyph overflow past the plate and on mesh occlusion from the play and close-up cameras." },
    { "id": "G-ball-chrome", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c03-flippers", "strips/s02-bumpers", "desktop/r05-ramp"], "fix": "Opaque ball, metalness 1, roughness <= 0.1, playfield cube-capture env map, soft contact shadow. Test: in c03 the ball is opaque, mirrors flippers and inserts, and casts a visible shadow." },
    { "id": "G-wizard-lamp-state", "category": "readability", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r08-wizard", "mobile/r08-wizard"], "fix": "In the wizard, light or chase all six mode inserts and flash every shot arrow. Test: all six inserts lit in r08 on both viewports." },
    { "id": "G-glare-hotspots", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["strips/s02-bumpers", "mobile/r03-play", "desktop/c04-vapors"], "fix": "Cap specular and emissive output on unlit bumper bases, spinner, harlequin block and wireform bars; remove the emissive wireform bars. Test: no unlit-hardware pixel >= 245 luma in r03 or r04 and the ball is the brightest object in the upper field." },
    { "id": "G-keyline-misregister", "category": "art", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/c03-flippers", "desktop/c04-vapors"], "fix": "Regenerate printed keylines from current sling and guide footprints. Test: geometry-over-texture overlay shows each keyline within 1 mm of its part and ending within 2 mm of the part's end." },
    { "id": "G-menu-polish", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r09-help", "desktop/r01-title", "desktop/r02-serve"], "fix": "Gold deco :focus-visible style replacing the default cyan ring; bottom fade plus scroll cue in help; delete '(fact: reserved, older)'; hide Launch while the ball is in play. Test: no default outline in any capture; no help line cut without a fade." },
    { "id": "G-hardware-models", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers", "desktop/c04-vapors", "desktop/c01-row"], "fix": "Slings with 3 posts, rubber rings, white band and plastic cover; metal scoop housings with a lip; brass guides thinned below half the ball diameter; smooth the ramp floor seam and kink. Test: c03 and c04 close-ups show rubber bands and scoop lips." },
    { "id": "G-landscape-fill", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Retune camera target, distance and tilt so the playfield averages >= 60% of canvas width between arch and apron and the upper field gets >= 25% of table height; use the blank side-panel area for status." },
    { "id": "G-steam-plume", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["desktop/r02-serve", "mobile/r11-landscape", "strips/s02-bumpers"], "fix": "Depth-test and clip steam to the cabinet volume; replace dots with soft noise billboards that rise, widen and fade; add a bumper cap drop on hits. Test: zero particle pixels outside the cabinet silhouette in r02 and r11; cap drop measurable between strip frames." },
    { "id": "G-landmark-detail", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c01-row", "desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Big lever: add cornices, window reveals, roof trim and baked AO contact shadows to the bathhouses and the Arlington; rebuild the Vapors with a horizontal neon VAPORS marquee. Test: c01 facades show trim and contact shadows; marquee >= 20 px tall in c04 and legible at 1280 in play." }
  ],
  "verdict": "continue"
}
```

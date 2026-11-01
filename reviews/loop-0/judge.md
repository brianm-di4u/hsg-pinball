# Judge ruling: Spa City Pinball, loop 0 (tier high)

Capture paths are relative to `games/Pinball/screenshots/review-loop-0/`. I opened these at full size: `desktop/r01-title`,
`desktop/r03-play`, `desktop/r06-multiball`, `desktop/c01-row`, `desktop/c03-flippers`, `desktop/c04-vapors`,
`desktop/c05-tower`, `desktop/c06-arlington`, `desktop/s02-bumpers-1`, `mobile/r02-serve`, `mobile/r04-bumpers`,
`mobile/r07-mode`, `mobile/r08-wizard`, `mobile/r09-help`, `mobile/r11-landscape`, and all three strips.

**Spread check.** No category has critics more than 1.0 apart: the widest gap is 0.5. No category has the prosecutor
and advocate more than 1.0 apart either: art, ui, readability, mobile and authenticity are exactly 1.0 apart. I still
checked every factual dispute between them against the captures, and I rule on each below.

**Measured gates.** Perf passes: desktop 60.2 fps at 3.9 ms, throttled phone 36.3 fps, SwiftShader at Low 29.5 fps.
IP passes.

## Factual disputes, ruled

| Claim | Who was right | Capture checked |
|---|---|---|
| The backglass "reads as the Riviera" (Critic A) | **Advocate.** The backglass shows a mosaic dome, a twin-towered hotel, a lattice tower on a wooded ridge, steam rising from the hillside and magnolias in the foreground. The palms and the neon canopy on the right are the only off notes. | `desktop/r03-play` (left panel) |
| The ramp is opaque (Codex) | **Advocate.** The tower lattice and the amber floor stripe show through the ramp wall. The faceted, stepped wall segments are real. | `desktop/c05-tower` |
| The scoop's VAPORS lettering is hidden (Critic A) | **Advocate.** In the player view, "THE VAPORS" runs in red along the scoop's right wall. It is tiny, though. | `mobile/r02-serve` (~285, 890) |
| The phone hides the score in ordinary play, not only in modes (prosecutor) | **Prosecutor.** The DMD shows "SPA CITY / BALL 1" with no score anywhere on screen, and in mode it shows "DERBY DAY" alone. | `mobile/r04-bumpers`, `mobile/r07-mode` |
| Launch covers the ball's area (A, prosecutor) | **Mostly advocate.** The resting ball (~735, 1500) sits just above the button. The button covers the bottom of the shooter lane and the plunger, which is a minor defect. | `mobile/r02-serve`, `mobile/r08-wizard` |
| The blue-white glare is a close-up artefact (advocate) | **Advocate.** The glare is visible in the close-ups but in no player-view frame I opened. | `desktop/c06-arlington` vs `desktop/r03-play`, `mobile/r07-mode` |
| The ball looks like the steam (prosecutor) | **Prosecutor.** In the bumpers the ball is a translucent glass bubble with a white highlight, which is the same vocabulary as the steam bubbles drifting top-left. | `desktop/s02-bumpers-1` (~530, 360) |
| The bumpers have no metal ring (prosecutor) | **Advocate.** Each bumper has a chrome base ring. There is no skirt and no rubber. | `desktop/s02-bumpers-1`, `desktop/c06-arlington` |
| The slings have no rubber (prosecutor) | **Prosecutor.** Each sling is a coloured plastic over a white block, with no rubber on the kicking face and no sling posts. | `desktop/c03-flippers` |
| A stray rod stands on a wall cap (prosecutor) | **Prosecutor.** A small orange rod stands on the gold cap. | `desktop/c06-arlington` (~975, 580) |
| The spinner flag is mirrored in gameplay views (prosecutor) | **Prosecutor.** It reads "NOSAES HT5" in the phone play frames as well as in the close-ups. | `mobile/r04-bumpers`, `mobile/r07-mode`, `desktop/c04-vapors` |
| The "ball in the pop bumpers" frame doesn't show that (prosecutor) | **Prosecutor.** The ball is at the top arch and no cap is flashing. No credit for bumper action from that frame. | `mobile/r04-bumpers` |
| Flasher bloom glows in the void beyond the cabinet (prosecutor) | **Prosecutor.** There is an amber glow top-right in frames 0 and 7. | `strips/s03-multiball` |
| The desktop table is needlessly narrow (Codex, prosecutor) | **Advocate.** The table already fills the full 800 px height, so its width is set by its aspect, not by the backglass. I drop the G-desktop-table-scale gap. | `desktop/r03-play` |

## Category rulings

**Art: 5.5.** The paintings are good on their own. The backglass is in the same hand and palette as the playfield
(`desktop/r03-play`, `desktop/s02-bumpers-1`), and the SPA CITY lettering and the pinstripes sit well in the layout.
But the zones are masked rectangles:
- straight seams at y≈285 and y≈600 in `desktop/c01-row`, and at y≈215 under the multipliers in `desktop/c03-flippers`;
- a dim flipper well with only faint rays, and a blank navy apron (`desktop/c03-flippers`);
- an undecorated ramp across the right third of the field (`desktop/r03-play`).

That is the 5 anchor carried half a step by the quality of the painting. The advocate's 6 credits more composition
than the seams allow, and the prosecutor's 5 ignores how strong the paintings themselves are.

**Toys: 5.0.**
- **What reads:** the bathhouses are differentiated and recognisable (the Quapaw dome and the Ozark towers in
  `desktop/c06-arlington`). The wireform chrome is convincing (`desktop/c05-tower`), and the bumpers have chrome bases.
- **What fails the 7 anchor's "reads at a glance":** the Arlington is a red roof strip (`desktop/c06-arlington`), the
  tower is a small lattice inside the ramp (`desktop/c05-tower`), and the Vapors sign is a thumb-sized neon sliver
  (`desktop/c04-vapors`).
- **Hardware:** the guides are flat lacquer boxes, the posts render as white crescents, the slings have no rubber, a
  stray rod stands on a wall cap, and the ramp walls are stepped.

This is squarely the 5 anchor. The bathhouses and the wireform keep it from the prosecutor's 4.5.

**Lighting: 5.0.**
- **Blown areas:** the halos are soft discs that look pasted on. With all eight Row targets lit they fuse into one
  white bar that buries the names and models (`mobile/r08-wizard`), and the mode arc fuses the same way in
  `strips/s03-multiball` frames 4–6. Flasher glow also spills into the void.
- **Grounding and mood:** no toy casts a contact shadow (`desktop/c01-row`, `desktop/s02-bumpers-1`), and the GI is
  identical in play, mode and wizard (`desktop/r03-play`, `mobile/r07-mode`, `mobile/r08-wizard`).
- **Credit:** the light-show sweep, a warm night mood, and bloom that is mostly confined to lamps. The glare is a
  close-up artefact and I don't count it.

The 5 anchor ("pasted on; washed-out or blown areas") fits better than 5.5.

**Animation: 6.0.**
- **What the strips show:** the flipper snaps in one step (`strips/s01-flip` frames 2→3), the bumper bodies flash and
  decay (`strips/s02-bumpers`: all lit in frame 0, top-right dark by frame 6), steam rises, and a light chase runs
  (`strips/s03-multiball`).
- **What's missing:** no cap or skirt drop, and the steam reads as bubbles, not wisps.
- **Untested:** no capture contains a sling hit or a nudge, so the camera reaction and the sling kick earn no credit,
  but they aren't proven absent either. I agree with the advocate on this, and the gap asks for those strips.

About half the 7 list is met, which gives 6.0.

**UI: 5.5.**
- **Credit:** the DMD has real character in its dot rendering and gold bezel, and the menus are consistent and clean
  (`desktop/r01-title`).
- **Score:** the phone shows no score in ordinary play or in mode (`mobile/r04-bumpers`, `mobile/r07-mode`). That is a
  core HUD failure the critics under-counted.
- **DMD copy:** the wizard copy repeats itself (`mobile/r08-wizard`), and multiball crams three lines of trivia with no
  jackpot instruction (`desktop/r06-multiball`).
- **Help screen:** the phone help screen has no close control and cuts off mid-list (`mobile/r09-help`).

5.5 sits between the prosecutor's 5.0 and the advocate's 6.0.

**Typography: 5.5.**
- **Credit:** the glowing slab display face is deliberate and good (`desktop/r01-title`), and the DMD font is clean at
  two lines (`mobile/r07-mode`).
- **Playfield lettering has real errors:**
  - the spinner flag is mirrored in every gameplay view (`mobile/r04-bumpers`);
  - the bumper decal renders "143°" as roughly "rt3o" (`desktop/s02-bumpers-1`);
  - SUPERIOR is cut to "…OR" under a halo (`desktop/c01-row`);
  - the mode labels can't be read at 390 px (`mobile/r02-serve`).
- **Body face:** the help body looks like a system sans (`mobile/r09-help`), a minor point.

The display and DMD faces keep this above 5. The broken playfield text keeps it well below 7.

**Readability: 5.0.**
- **Ball:** it is the problem. In the bumpers it turns into a translucent bubble that matches the steam
  (`desktop/s02-bumpers-1`), and at the top arch it is a faint glass sphere against busy painting
  (`mobile/r04-bumpers`). It reads fine on the darker lower field (`desktop/r03-play`) and keeps a dark rim on the
  ramp (`mobile/r07-mode`).
- **Multiball:** the three balls can only be found by search (`desktop/r06-multiball`).
- **Lamps:** the Row lamps fuse into a white bar in the wizard (`mobile/r08-wizard`). The skill-shot lamp is one small
  dot, rescued only by the DMD text "SKILL SHOT: LANE A" (`mobile/r02-serve`). The shape coding works.

The 5 anchor ("the ball gets lost in the art") is met in the busiest zone, which is where it matters most.

**Mobile: 4.5.**
- **Landscape fails outright.** The table spans about 450 of 1688 px against the left edge, and a DMD three times its
  width fills the rest (`mobile/r11-landscape`).
- **Portrait is framed sensibly:** the full table and a clear DMD band (`mobile/r02-serve`).
- **Portrait problems:** no score in play (`mobile/r04-bumpers`), and the help screen has no close control
  (`mobile/r09-help`). Launch overlaps the shooter-lane bottom, a minor defect.

With one orientation failing and the phone HUD losing the score, I agree with Codex's 4.5.

**Authenticity: 6.0.**
- **Credit:** the eight bathhouses are in the correct Row order with differentiated silhouettes (`desktop/c01-row`).
  The backglass carries the tower, the dome, a twin-towered hotel and steaming wooded hills (`desktop/r03-play`), and
  the help text is local and hedged.
- **Against:** the largest painting on the playfield shows turquoise travertine terraces that read as Pamukkale
  (`desktop/s02-bumpers-1`), the backglass has palms, and the Arlington, tower and Vapors aren't recognisable as toys
  (`desktop/c06-arlington`, `desktop/c05-tower`). "Arlington rebuilt in 11 months" is unhedged
  (`desktop/r06-multiball`).

This sits on the gate, not above it.

**Total: 48.0 / 90.** Only authenticity meets its gate, so the verdict is **continue**.

## IP
All four reviewers report the build clean, and I agree. There is no commercial pinball name, logo or art. I found no
text in the backglass (`desktop/r03-play`) or in the playfield paintings (`desktop/s02-bumpers-1`, `desktop/c01-row`).
All the lettering is code-drawn, and the real place names appear only as labels and as an original toy sign.

## Ranked gaps (by gain ÷ effort)

1. **G-ball-chrome** (readability, WS1, severity 4, effort S, +1.0). Make the ball opaque chrome: no transmission,
   metalness 1, roughness ≤0.1, and a dark Fresnel rim. Add a soft contact shadow. Re-draw the steam as soft wisps at
   alpha ≤0.35 with no specular.
   - Test: in every `s02` frame, the ball is the only object with a hard highlight and a dark edge.
2. **G-playfield-lettering** (typography, WS4, effort S, +0.75). Flip the spinner flag's player-facing texture. Draw the
   bumper "143°" decal from a font that has the glyphs. Move SUPERIOR clear of its halo and the scoop. Enlarge the mode
   and Row labels to a cap height of at least 2.5% of the table width, on a dark backing plate.
   - Test: every label reads correctly at native size in `mobile/r03-play`.
3. **G-phone-score** (ui, WS5, severity 4, effort S, +0.5). The DMD's idle state is score plus ball. Callouts last 2 s
   or less, or keep a one-line score strip under them.
   - Test: the score is visible in every phone gameplay frame (r02–r08).
4. **G-lamp-halos** (lighting, WS1, severity 4, effort S, +0.5). Cut the halo radius by about 40% and cap the additive
   intensity so neighbouring halos never merge. Keep flasher light and bloom inside the cabinet silhouette.
   - Test: with all eight Row targets lit, as in `mobile/r08-wizard`, each name stays legible. No bloom pixels fall
     outside the cabinet in `strips/s03-multiball`.
5. **G-mobile-layout** (mobile, WS6, severity 5, effort M, +1.0). Make landscape table-first: the table centred at full
   height, and the DMD in a side panel no wider than 25% of the viewport. In portrait, move Launch off the
   shooter-lane bottom, or make the lane itself the touch target.
   - Test: at 844×390 the table is at least 40% of the viewport width, and no control overlaps the shooter lane.
6. **G-dmd-copy-help** (ui, WS5, severity 3, effort S, +0.5). The DMD copy:
   - two lines maximum, with long facts scrolled;
   - rewrite the repeated wizard text;
   - show the jackpot objective before any trivia in multiball;
   - add ramp and bumper callouts;
   - hedge "rebuilt in 11 months".

   The help screen gets a sticky Back/close footer and a scrolling body capped at 90vh, with touch controls listed first
   on phones.
   - Test: in `mobile/r09-help` and `desktop/r09-help` the close control is fully visible.
7. **G-contact-shadows** (lighting, WS1, severity 3, effort S, +0.5). Add a soft blob or AO contact shadow under each
   bathhouse, bumper, post, sling and flipper.
   - Test: every toy base in `desktop/c01-row` and `desktop/c02-springs` shows a darkened footprint.
8. **G-art-seams-lower** (art, WS4, severity 4, effort M, +0.75). Feather the zone masks along the guide geometry, or
   edge them with gold pinstripe. Carry the fan and promenade art into the flipper well. Add apron cards and a decal on
   the ramp.
   - Test: no straight seams at y≈285, 600 or 215 in c01 and c03, and no flat-colour region larger than 5% of the
     playfield.
9. **G-rubber-hardware** (toys, WS2, severity 3, effort M, +0.5). Model torus post rubbers in place of the white
   crescents, and sling rubbers stretched over three posts. Chamfer the guide edges and give them a lacquer clearcoat.
   Smooth the stepped ramp walls into one continuous curved wall. Delete the stray rod.
   - Test: `desktop/c03-flippers` and `desktop/c06-arlington` show continuous black rubber on every post and sling.
10. **G-mode-lighting** (lighting, WS1, severity 3, effort M, +0.5). Tint the GI per mode (Derby Day warm green, for
    example). For the wizard mode, drop the GI to about 40% and run chases and flasher pulses.
    - Test: the mean frame colour of `r07-mode` and `r08-wizard` differs visibly from `r03-play`.
11. **G-event-feedback** (animation, WS3, severity 3, effort M, +0.5). Make the bumper cap and skirt drop and recover
    over about 3 ticks. Add a sling kick with plastic flash and rubber flex, and a 2–4 px camera shake on nudges. Add
    strips that capture a sling hit, a nudge and the flipper's return.
12. **G-landmark-toys** (toys, WS2, severity 5, effort L, +1.0; **this loop's big lever** for toys, with +0.5 to
    authenticity). Build a twin-towered Arlington standup behind the lock at least 2× its current height, and stand
    the Mountain Tower outside the ramp footprint at least 3× its current height. Enlarge the Vapors sign until its
    letters read in the player view.
    - Test: with the labels hidden, each landmark is identifiable in `desktop/r03-play` and `mobile/r03-play`.

**Left off the list:**
- The Pamukkale-terrace repaint and the backglass palms (authenticity, L). Authenticity already meets its gate, so
  these wait for a later loop.
- The skill-shot flash, which the DMD already covers.
- The UI body face (minor).
- The desktop table scale, which is set by the table's aspect.

```json
{
  "loop": 0,
  "role": "judge",
  "tier": "high",
  "scores": {
    "art": { "score": 5.5, "confidence": 0.8, "evidence": [
      { "shot": "desktop/c01-row", "note": "straight zone seams at y~285 and y~600; grey placeholder targets" },
      { "shot": "desktop/c03-flippers", "note": "seam at y~215; dim flipper well; blank navy apron" },
      { "shot": "desktop/r03-play", "note": "backglass in same hand; integrated SPA CITY lettering; undecorated ramp" } ] },
    "toys": { "score": 5.0, "confidence": 0.8, "evidence": [
      { "shot": "desktop/c06-arlington", "note": "Arlington is a roof strip; crescent posts; stray rod ~(975,580); bathhouses differentiated" },
      { "shot": "desktop/c05-tower", "note": "clear but stepped ramp; tower tiny inside it; wireform chrome good" },
      { "shot": "desktop/c03-flippers", "note": "slings have no rubber; plain flippers; chrome ball" },
      { "shot": "desktop/c04-vapors", "note": "box guides; Vapors sign a tiny sliver" } ] },
    "lighting": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r08-wizard", "note": "Row halos fuse into a white bar; no GI mood change" },
      { "shot": "strips/s03-multiball", "note": "light chase runs; mode halos fuse; flasher glow in void frames 0 and 7" },
      { "shot": "desktop/c01-row", "note": "no contact shadows; halo erases SUPERIOR" },
      { "shot": "mobile/r07-mode", "note": "mode GI identical to play" } ] },
    "animation": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "strips/s01-flip", "note": "one-step flipper snap frames 2-3; no sling or nudge captured" },
      { "shot": "strips/s02-bumpers", "note": "bumper bodies flash and decay; no cap drop; steam as bubbles" },
      { "shot": "strips/s03-multiball", "note": "insert chase and mode arc wash" } ] },
    "ui": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "mobile/r04-bumpers", "note": "phone shows no score in ordinary play" },
      { "shot": "mobile/r08-wizard", "note": "DMD repeats VALLEY OF THE VAPORS" },
      { "shot": "desktop/r06-multiball", "note": "three cramped lines of trivia, no jackpot objective" },
      { "shot": "mobile/r09-help", "note": "no close control, content clipped" },
      { "shot": "desktop/r01-title", "note": "clean consistent gold-card menu" } ] },
    "typography": { "score": 5.5, "confidence": 0.75, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate glowing slab display face" },
      { "shot": "mobile/r04-bumpers", "note": "spinner flag mirrored in gameplay view" },
      { "shot": "desktop/s02-bumpers-1", "note": "143 degree decal renders as wrong glyphs" },
      { "shot": "desktop/c01-row", "note": "SUPERIOR clipped under halo" } ] },
    "readability": { "score": 5.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/s02-bumpers-1", "note": "ball is a translucent bubble matching the steam" },
      { "shot": "mobile/r04-bumpers", "note": "faint glass ball against busy top painting" },
      { "shot": "desktop/r06-multiball", "note": "three small balls found only by search" },
      { "shot": "desktop/r03-play", "note": "ball reads on darker lower field; shape coding works" } ] },
    "mobile": { "score": 4.5, "confidence": 0.85, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "table ~27% of width against left edge; DMD dominates" },
      { "shot": "mobile/r04-bumpers", "note": "no score visible in play" },
      { "shot": "mobile/r02-serve", "note": "portrait framed sensibly; Launch overlaps shooter-lane bottom" },
      { "shot": "mobile/r09-help", "note": "no close control" } ] },
    "authenticity": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in correct Row order, differentiated" },
      { "shot": "desktop/r03-play", "note": "backglass tower, dome, twin-towered hotel, steaming hills; palms off" },
      { "shot": "desktop/s02-bumpers-1", "note": "top painting reads as Pamukkale travertine" },
      { "shot": "desktop/c06-arlington", "note": "Arlington not recognisable as a toy" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art; no business logos; no text in the backglass or playfield paintings. All lettering code-drawn." },
  "gaps": [
    { "id": "G-ball-chrome", "category": "readability", "expectedGain": 1.0, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/s02-bumpers-1", "mobile/r04-bumpers"], "fix": "Opaque chrome ball (no transmission, metalness 1, roughness <=0.1, dark Fresnel rim) with soft contact shadow; steam as soft wisps alpha <=0.35 with no specular. Test: in every s02 frame the ball is the only object with a hard highlight and dark edge." },
    { "id": "G-playfield-lettering", "category": "typography", "expectedGain": 0.75, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["mobile/r04-bumpers", "desktop/s02-bumpers-1", "desktop/c01-row", "mobile/r02-serve"], "fix": "Flip the spinner flag's player-facing texture; draw the bumper 143 degree decal from a font with the glyphs; move SUPERIOR clear of halo and scoop; mode and Row labels at cap height >=2.5% of table width on a dark backing plate. Test: every label reads correctly at native size in mobile/r03-play." },
    { "id": "G-phone-score", "category": "ui", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS5", "evidence": ["mobile/r04-bumpers", "mobile/r07-mode"], "fix": "DMD idle state is score + ball; callouts last <=2 s or keep a one-line score strip under them. Test: score visible in every phone gameplay frame r02-r08." },
    { "id": "G-lamp-halos", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["mobile/r08-wizard", "strips/s03-multiball", "desktop/c01-row"], "fix": "Halo radius -40% and additive intensity capped so neighbouring halos never merge; flasher lights and bloom confined to the cabinet silhouette. Test: all eight Row names legible with every target lit as in mobile/r08-wizard; no bloom pixels outside the cabinet in s03." },
    { "id": "G-mobile-layout", "category": "mobile", "expectedGain": 1.0, "severity": 5, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape", "mobile/r02-serve"], "fix": "Landscape: table centred at full height, DMD in a side panel <=25% of viewport width; portrait: move Launch off the shooter-lane bottom or make the lane the touch target. Test: at 844x390 table >=40% of viewport width; no control overlaps the shooter lane." },
    { "id": "G-dmd-copy-help", "category": "ui", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["mobile/r08-wizard", "desktop/r06-multiball", "mobile/r09-help"], "fix": "DMD max two lines with scrolling for long facts; rewrite repeated wizard text; jackpot objective before trivia in multiball; ramp and bumper callouts; hedge 'rebuilt in 11 months'. Help: sticky Back/close footer, body max-height 90vh, touch controls first on phones. Test: close control fully visible in mobile/r09-help and desktop/r09-help." },
    { "id": "G-contact-shadows", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c01-row", "desktop/s02-bumpers-1"], "fix": "Soft blob/AO contact shadow under every bathhouse, bumper, post, sling and flipper. Test: each toy base in c01 and c02 shows a darkened footprint." },
    { "id": "G-art-seams-lower", "category": "art", "expectedGain": 0.75, "severity": 4, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c01-row", "desktop/c03-flippers", "desktop/r03-play"], "fix": "Feather zone masks along guide geometry or edge them with gold pinstripe; carry fan/promenade art into the flipper well; add apron cards and a ramp decal. Test: no straight seams at y~285/600 (c01) or y~215 (c03); no flat-colour region >5% of the playfield." },
    { "id": "G-rubber-hardware", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c03-flippers", "desktop/c06-arlington", "desktop/c05-tower"], "fix": "Torus post rubbers replacing the white crescents; sling rubbers stretched over three posts; chamfered, clear-coated guides; smooth the stepped ramp walls into one continuous curved wall; delete the stray rod at ~(975,580). Test: c03 and c06 show continuous black rubber on every post and sling." },
    { "id": "G-mode-lighting", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["mobile/r07-mode", "mobile/r08-wizard"], "fix": "Per-mode GI tint; wizard drops GI to ~40% with chases and flasher pulses. Test: mean frame colour of r07-mode and r08-wizard visibly differs from r03-play." },
    { "id": "G-event-feedback", "category": "animation", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS3", "evidence": ["strips/s01-flip", "strips/s02-bumpers"], "fix": "Bumper cap and skirt drop and recover over ~3 ticks; sling kick with plastic flash and rubber flex; 2-4 px camera shake on nudges; add strips capturing a sling hit, a nudge and the flipper return." },
    { "id": "G-landmark-toys", "category": "toys", "expectedGain": 1.0, "severity": 5, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c06-arlington", "desktop/c05-tower", "desktop/c04-vapors"], "fix": "BIG LEVER for toys (also +0.5 authenticity): twin-towered Arlington standup behind the lock at >=2x current height; Mountain Tower outside the ramp footprint at >=3x height; Vapors sign enlarged until its letters read in the player view. Test: with labels hidden, each landmark identifiable in desktop/r03-play and mobile/r03-play." }
  ],
  "verdict": "continue"
}
```

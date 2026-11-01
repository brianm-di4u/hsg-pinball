# Prosecutor: loop 7

Critic means: art 6.75, toys 6.5, lighting 6.5, animation 6.75, UI 6.75, typography 6.5, readability 6.5, mobile 6.5,
authenticity 7.5 (total 60.5). I opened every frame, close-up and strip at full size, cropped and magnified the
ones the critics described from the small frames (r03 mid-field, r04 bumper area, r05 ramp, the backglass, the
apron), measured mean frame luminance across the bumper strip, and checked the A/B pairs that bear on the changes.

**Proposed total: 57.0 / 90** (−3.5 against the critic mean). The critics were generous on toys, lighting,
readability and mobile, each of which has defects that match the rubric's 5 anchor, not its 7. They were mildly
generous on art, animation, UI and authenticity, where Critic B's 7s and 8 lean on things the captures don't show.
I accept typography.

All paths are relative to `games/Pinball/screenshots/review-loop-7/`.

---

## Art: 6.75 → 6.5

Critic B's 7 needs "inserts and lettering integrated" and "every zone themed". The captures show otherwise:
- **Lettering sits on top of the art.** Shot names are black pill plates floating over the painting (THE VAPORS,
  MOUNTAIN TOWER, the eight bathhouse tags) in `desktop/c01-row` and `desktop/c03-flippers`. The shot arrows are
  flat vector triangles in four unrelated colours (blue, orange, green, yellow), with no bezel, frame or insert cut
  (`desktop/c04-vapors`, bottom of frame).
- **The upper painting ignores the layout.** It is a generic garden grotto, and foliage and rocks run straight
  under the bumpers and lane guides (`desktop/c02-springs`).
- **Empty zones.** The mid-field between the Vapors scoop and the ramp foot is plain terrazzo apart from the
  SPA CITY wordmark (my 3× crop of `desktop/r03-play`). The apron is a purple slab with two cream cards set in a
  default bold serif (3× crop of `desktop/r02-serve`).
- **Backglass.** It is a strong painting and in the same hand as the playfield, but it is a framed poster
  (`desktop/r03-play`, left column). The title is HTML text floating above the frame, not a composed backglass.
  The phone has no backglass at all (`mobile/r03-play`).

Critic A's 6.5 is right. The A/B pairs show the painting unchanged (`ab/desktop-r03-play`).

## Toys: 6.5 → 6.0

The rubric's 5 anchor says "rails and walls read as grey blocks". That is literally what several close-ups show:
- **`desktop/c04-vapors`:** the scoop walls are two plain grey extruded bars on posts, with no rolled top, bevel or
  fastener. The Vapors sign sits on a featureless cream box.
- **`desktop/c06-arlington`:** the lock walls are the same grey bars. The Arlington sits on a slab.
- **`desktop/c01-row`:** all eight bathhouses stand on identical cream box plinths, joined by grey bar walls. In
  `ab/desktop-c01-row`, the new "darker footprint" is hard to tell apart from the old build.
- **`desktop/c03-flippers`:**
  - The flippers are blank white extrusions with a red stripe, with no rubber or moulding.
  - The slingshots are painted wedges with no rubber ring and no kicker. A slingshot without rubber is not a
    plausible material for a pinball table.
  - The inlane guides are grey bars.
- **`desktop/c05-tower`:**
  - The ramp floor is opaque frosted grey with a hard kink and visible panel seams. It is not clear plastic.
  - The wireform reads as a ladder of evenly spaced rods with right-angle rungs.
  - The cabinet side beyond the rail is a black void.
- **Bumpers** have no skirts (`desktop/c02-springs`).

Several things genuinely reach the 7 anchor: the tower, the Arlington, the Quapaw dome, Ozark's twin towers, the
satin bumpers, the stainless ramp blades and the chrome ball. With half the models at 7 and the walls, flippers,
slings and ramp floor at 5, the honest score is 6.0.

## Lighting: 6.5 → 6.0

The 7 anchor asks for "no glare" and "soft shadows ground every toy". The captures still show the 5 anchor's
"blown areas":
- **Spinner:** it still renders a hard white bar in `desktop/r03-play` (about 465–495, 270), in `mobile/r03-play`
  (about 70–125, 770) and in `mobile/r05-ramp`. This loop's spinner change did not remove it at play view.
- **`desktop/c04-vapors`:** a large blown white blob in the top-left corner beside CENTRAL AVENUE.
- **`desktop/c06-arlington`:**
  - The lock wall's top edge clips to a white line.
  - An orange bloom blob in the bottom-left corner sits over the start of THE ARLINGTON legend.
- **Bumper base rings** still glow white-hot under satin caps (`desktop/c02-springs`, `desktop/s02-bumpers-0`).
- **Bloom spills off the table.** In `strips/s03-multiball` frames 0, 1 and 7, a yellow haze bleeds into the black
  void beyond the cabinet's top-right corner.
- **Contact shadows** are close to invisible at the close-up camera, let alone at play view (`desktop/c01-row`;
  `ab/desktop-c01-row` shows almost no difference).
- **Bumper hits don't light the table.** The flash brightens the bumper body, but no light pools on the playfield
  around it (`desktop/s02-bumpers-1` against `-0`). The new GI pulse is real but small: mean frame luminance rises
  from 65.1 to 69.5 in frame 1, about 7%.
- **Wizard.** `desktop/r08-wizard` is "all inserts on, GI down". That is a real mood shift, but a static one, with
  no colour wash.

Lit against unlit inserts is good (`desktop/c03-flippers`), and the A/B gain is real. Still, the frame does not yet
meet "no glare". Score 6.0.

## Animation: 6.75 → 6.5

Critic B's 7 relies on "cap displacement", which is a few pixels at most between `desktop/s02-bumpers-0` and `-1`.
On the other side:
- **`strips/s01-flip`:** only the flipper and the ball change. No sling, lamp or insert reacts to the shot, and the
  flipper jumps from rest to full stroke between frames 1 and 2, with no in-between pose.
- **`strips/s03-multiball`:**
  - Flippers cropped off; the right half of every frame is black.
  - Only one ball is visible in the whole "multiball launch" (frames 5–7).
  - The light chase is the only thing that reads.
- **The bumper frames show no hit.** In `desktop/r04-bumpers` and `mobile/r04-bumpers` the ball sits above the
  bumpers at the top arch, and no bumper is flashing. These frames show no bumper event at all.
- **Not shown:** no skirt drop, no ball trail and no camera reaction anywhere.

`strips/s02-bumpers` is a genuine improvement (a hit, a flash and steam in frame), which is why this isn't 6.0.
Score 6.5.

## UI: 6.75 → 6.5

The DMD is the best thing in the game (`desktop/r07-mode`, `mobile/r06-multiball`). Against it:
- **The HUD contradicts the rules.** `desktop/r08-wizard` shows the wizard running while the mode grid marks only
  Soak as won. `desktop/r09-help` says "Play all six to light the wizard mode".
- **The phone drops mode progress.** "Derby · 18/100 · 45s" on desktop becomes a bare score pill on the phone
  (`mobile/r07-mode`).
- **The help list is cut mid-line** behind the Back bar, with no scroll cue (`desktop/r09-help`, `mobile/r09-help`).
- **Menus are not deco.**
  - High scores is a plain web table (`desktop/r10-scores`).
  - The menu buttons are generic rounded rectangles (`desktop/r01-title`).
  - The mode grid looks like form buttons, with no legend for the gold fill against the purple outline.
- **Dead space.** The desktop right column is empty for about 200 px above the DMD and about 220 px below Menu
  (`desktop/r03-play`).

The 7 anchor's "menus in the same deco style" isn't met. Score 6.5.

## Typography: 6.5 → 6.5 (accepted)

Both critics already marked down the small playfield labels and the system-looking body face. More evidence that
supports their score:
- At play view, the "143°F" bumper caps smear into an illegible blob (3× crop of `desktop/r04-bumpers`).
- The apron cards use a default bold serif (3× crop of `desktop/r02-serve`).

The display slab serif and the DMD font are genuinely good (`desktop/r01-title`, `mobile/r03-play`), so I accept
6.5.

## Readability: 6.5 → 6.0

The 7 anchor is "the ball always stands out". The captures show the 5 anchor, "the ball gets lost", in several
frames:
- **`desktop/r05-ramp` and `mobile/r05-ramp`:** on the ramp, the ball is a grey-white sphere on a grey-white
  frosted ramp, with almost no value contrast (my 3× crop of `desktop/r05-ramp`).
- **`desktop/r04-bumpers` and `mobile/r04-bumpers`:** the ball sits among foliage and steam wisps at the top arch.
  At native size it is a faint grey dot about 12 px across.
- **`desktop/r03-play`:** the ball is on the MOUNTAIN TOWER plate and terrazzo, at about 12 px.
- **`desktop/r06-multiball`:** the top ball is lost against the arch rim.
- **Skill shot (`desktop/r02-serve`):** the only cue is one small lane lamp plus "LANE A" on the DMD.
- **Mode labels:** SOAK, DERBY and the other mode labels are about 5 px.

Lit against unlit inserts and the lit mode arrows are clear (`desktop/r07-mode`), and on the phone the ball usually
reads (`mobile/r07-mode`). Readability fails on two of the three frames the brief built to test it (ramp and
bumpers). Score 6.0.

## Mobile: 6.5 → 6.0

The 7 anchor requires the table to be "framed on purpose in portrait **and** landscape":
- **Landscape (`mobile/r11-landscape`):**
  - The table covers x 330–1040 of 1688, about 42% of the width.
  - There is a black void about 330 px wide on the left and another between the table and the HUD.
  - The HUD column below Menu is about 450 px of nothing.
  - The apron runs into the bottom edge of the screen.
  - No Launch control is visible, and there is no mode grid.
  - The DMD is about 300 px wide and its second line is dim.
- **Portrait** is good, but it has holes:
  - No backglass anywhere.
  - Mode progress and the timer are gone (`mobile/r07-mode`).
  - Every playfield label is unreadable (`mobile/r03-play`).
  - The ☰ and Launch buttons sit directly under the flipper tips, about 30 px from a ball resting between the
    flippers (`mobile/r06-multiball`).

Portrait reaches about 7 and landscape about 4–5. Score 6.0.

## Authenticity: 7.5 → 7.0

Critic B's 8 is close to the 9 anchor, "a local would name every landmark". The captures don't support that:
- **Bathhouses.** All eight are correctly ordered and labelled (`desktop/c01-row`). Only Quapaw (dome), Ozark (twin
  towers) and perhaps Fordyce (skylight) are recognisable without their tags. Superior, Hale, Maurice, Buckstaff
  and Lamar are cream boxes with windows, all on the same plinth. Buckstaff has no colonnade.
- **The Arlington is misplaced.** It sits in the middle of the Row, between Fordyce and Quapaw (`desktop/c01-row`,
  `desktop/c06-arlington`). The real hotel stands at the Row's north end, across the street. A local would notice.
- **The upper playfield is a generic garden grotto** with a stone arch (`desktop/c02-springs`), not the Grand
  Promenade, Hot Springs Mountain or the Display Spring. Half the playfield is "generic spa".

The tower, the Vapors, the 143°F springs, the street names and the hedged facts (`desktop/r09-help`) earn the 7
anchor. Score 7.0.

---

## IP check

- **Clean on what the captures show.**
  - No commercial pinball name, logo or art.
  - The apron and plates use only SPA CITY PINBALL and landmark names.
  - The backglass painting has no text (2× crop of `desktop/r03-play`): its neon canopy has no letters.
  - The upper painting (`desktop/c02-springs`) and the terrazzo have no text.
- **Risk to note, not a violation:**
  - "The Vapors" is a real, operating venue name. The sign (`desktop/c04-vapors`) is a generic neon treatment, a
    small script "The" over block capitals, and the help screen carries a no-affiliation note.
  - The Arlington DMD silhouette (`mobile/r06-multiball`) depicts a building, not a logo.
  - The developer should confirm that the Vapors sign does not copy the venue's actual script mark.

## Gaps the critics missed

1. **G-ramp-ball-contrast** (readability, severity 4, effort S, WS1, gain +0.4)
   - **Problem:** the ball disappears on the frosted grey ramp (`desktop/r05-ramp`, `mobile/r05-ramp`).
   - **Fix:** make the ramp plastic clear, at no more than 35% opacity with a faint tint, so the art shows through.
     Darken the ramp floor under the ball path, and give the ball a contact shadow on the ramp surface.
   - **Test:** luminance contrast of at least 3:1 between the ball and the ramp pixels around it in r05 on both
     viewports.
2. **G-bumper-light-pool** (lighting, severity 3, effort S, WS1, gain +0.3)
   - **Problem:** bumper flashes don't light the playfield (`desktop/s02-bumpers-1`). The r04 frames on both
     viewports catch no bumper event at all.
   - **Fix:** add an additive light decal or a short-range point light under each bumper that pulses on hit.
     Capture r04 on a hit tick.
   - **Test:** in the hit frame, playfield pixels within one bumper radius rise at least 20% in luminance over the
     frame before.
3. **G-bloom-containment** (lighting, severity 3, effort S, WS1, gain +0.3)
   - **Problem:** bloom bleeds into the off-table void (`strips/s03-multiball` frames 0, 1 and 7) and blows out the
     top-left of `desktop/c04-vapors`.
   - **Fix:** mask bloom to the cabinet silhouette and clamp the emitter responsible.
   - **Test:** pixels outside the cabinet stay below 0.1 luminance, and no non-insert region of 20 px or more is
     above 0.95.
4. **G-landscape-controls** (mobile, severity 3, effort S, WS6, gain +0.3)
   - **Problem:** this sits on top of the framing gap. Landscape shows no Launch control and no mode lamps, the
     apron runs into the screen edge, and the HUD column is mostly empty (`mobile/r11-landscape`).
   - **Fix:** put Launch and the six-lamp grid in the landscape HUD column, enlarge the DMD to the column's width,
     and inset the table 12 px from the bottom edge.
   - **Test:** all three elements are visible in r11, and no HUD-column gap is taller than 120 px.
5. **G-arlington-and-upper-field** (authenticity, severity 2, effort M, WS4, gain +0.3)
   - **Problem:** the Arlington sits mid-Row, and the upper painting is a generic grotto (`desktop/c01-row`,
     `desktop/c02-springs`).
   - **Fix:** move the Arlington lock to the north (left) end of the Row, or add a plate that hedges the placement.
     Repaint the upper field as the Grand Promenade and Hot Springs Mountain, with the Display Spring cascade.
     Keep the paintings text-free.
   - **Test:** a reviewer can name the Promenade and the spring in c02 without labels.
6. **G-backglass-composition** (art, severity 2, effort M, WS4, gain +0.2)
   - **Problem:** the backglass is a poster with an HTML title above it, and the phone has no backglass
     (`desktop/r03-play`, `mobile/r03-play`).
   - **Fix:** compose a deco title cartouche as a separate overlay inside the backglass frame (not painted into the
     art), with lamp-chase trim. On the phone, show a backglass strip during attract.
   - **Test:** the title sits inside the frame in r01–r03, and the phone attract frame shows backglass art.

```json
{
  "loop": 7,
  "role": "prosecutor",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "flat vector arrows in four unrelated colours, no insert framing; lettering on floating black plates" },
      { "shot": "desktop/c02-springs", "note": "generic garden grotto runs under bumpers and lane guides without regard to the layout" },
      { "shot": "desktop/r02-serve", "note": "blank purple apron with default-serif cream cards; empty mid-field terrazzo" },
      { "shot": "desktop/r03-play", "note": "backglass is a strong painting but a framed poster with an HTML title above it" } ] },
    "toys": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "scoop walls are plain grey extruded bars; sign on a featureless cream box" },
      { "shot": "desktop/c01-row", "note": "eight identical cream box plinths joined by grey bar walls" },
      { "shot": "desktop/c03-flippers", "note": "blank white flippers; slingshots with no rubber ring or kicker" },
      { "shot": "desktop/c05-tower", "note": "tower good; ramp floor opaque frosted grey with a kink and seams; wireform reads as a ladder" },
      { "shot": "desktop/c06-arlington", "note": "Arlington, Quapaw dome and Ozark towers read; lock walls grey bars" } ] },
    "lighting": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r03-play", "note": "spinner still a hard white bar at play view (also mobile/r03-play, mobile/r05-ramp)" },
      { "shot": "desktop/c04-vapors", "note": "blown white blob in the top-left" },
      { "shot": "desktop/c06-arlington", "note": "lock wall top edge clips; orange bloom blob over THE ARLINGTON legend" },
      { "shot": "strips/s03-multiball", "note": "bloom haze bleeds into the off-table void in frames 0, 1, 7" },
      { "shot": "strips/s02-bumpers", "note": "bumper flash lights the body only, no light pool on the field; GI pulse about 7%" },
      { "shot": "desktop/r08-wizard", "note": "GI dims and all inserts light; static, no colour wash" } ] },
    "animation": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "strips/s01-flip", "note": "flipper jumps rest to full stroke; nothing but flipper and ball reacts" },
      { "shot": "strips/s02-bumpers", "note": "real hit, flash and steam; cap displacement a few px at most; no skirt drop" },
      { "shot": "strips/s03-multiball", "note": "flippers cropped, half the frame black, one ball visible in a multiball launch" },
      { "shot": "desktop/r04-bumpers", "note": "ball above the bumpers, no bumper flashing (same on mobile/r04-bumpers)" } ] },
    "ui": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "mode grid shows only Soak won while the wizard runs, contradicting the help text" },
      { "shot": "mobile/r07-mode", "note": "mode progress and timer dropped on the phone" },
      { "shot": "desktop/r09-help", "note": "rule list cut mid-line behind Back, no scroll cue (also mobile/r09-help)" },
      { "shot": "desktop/r10-scores", "note": "plain web table, not deco" },
      { "shot": "desktop/r07-mode", "note": "DMD horse and mode line are strong" } ] },
    "typography": { "score": 6.5, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate slab-serif neon display face" },
      { "shot": "desktop/r04-bumpers", "note": "143°F caps smear illegibly at play view" },
      { "shot": "desktop/r02-serve", "note": "apron cards in a default bold serif; mode labels about 5 px" },
      { "shot": "mobile/r03-play", "note": "DMD font clean; playfield labels unreadable" } ] },
    "readability": { "score": 6.0, "confidence": 0.6, "evidence": [
      { "shot": "desktop/r05-ramp", "note": "grey-white ball on a grey-white frosted ramp, little value contrast (also mobile/r05-ramp)" },
      { "shot": "desktop/r04-bumpers", "note": "ball a faint dot among foliage and steam at the top arch" },
      { "shot": "desktop/r06-multiball", "note": "top ball lost against the arch" },
      { "shot": "desktop/r02-serve", "note": "skill shot cue is one small lane lamp plus LANE A" },
      { "shot": "desktop/r07-mode", "note": "lit mode arrows and lit against unlit inserts are clear" } ] },
    "mobile": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "mobile/r11-landscape", "note": "table about 42% of width, black voids, empty HUD column, apron at screen edge, no Launch or mode grid" },
      { "shot": "mobile/r07-mode", "note": "no mode progress on the phone; no backglass anywhere" },
      { "shot": "mobile/r03-play", "note": "portrait fill and DMD good; playfield labels unreadable" },
      { "shot": "mobile/r06-multiball", "note": "buttons in the apron band, about 30 px below a ball between the flippers" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses in correct order; five are interchangeable cream boxes recognisable only by tags" },
      { "shot": "desktop/c06-arlington", "note": "Arlington placed mid-Row, not at the north end" },
      { "shot": "desktop/c02-springs", "note": "upper field is a generic garden grotto, not the Promenade or the mountain" },
      { "shot": "desktop/c05-tower", "note": "Mountain Tower specific and recognisable" },
      { "shot": "desktop/r09-help", "note": "facts hedged; 1832 note correct" } ] }
  },
  "ip": { "clean": true, "notes": "No commercial pinball names, logos or art; no text in the backglass, upper painting or terrazzo. The Vapors is a real venue name, shown as a generic neon treatment with a no-affiliation note; confirm it does not copy the venue's script mark." },
  "gaps": [
    { "id": "G-ramp-ball-contrast", "category": "readability", "expectedGain": 0.4, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/r05-ramp", "mobile/r05-ramp"], "fix": "Make the ramp plastic clear (opacity no more than 35%, faint tint) so the art shows through, darken the floor under the ball path, and add a ball contact shadow on the ramp; test for at least 3:1 luminance contrast between the ball and the surrounding ramp pixels in r05 on both viewports." },
    { "id": "G-bumper-light-pool", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["strips/s02-bumpers", "desktop/r04-bumpers", "mobile/r04-bumpers"], "fix": "Add an additive light decal or short-range point light under each bumper that pulses on hit, and capture r04 on a hit tick; test that playfield pixels within one bumper radius rise at least 20% in luminance in the hit frame." },
    { "id": "G-bloom-containment", "category": "lighting", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS1", "evidence": ["strips/s03-multiball", "desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Mask bloom to the cabinet silhouette and clamp the emitters responsible; test that pixels outside the cabinet stay below 0.1 luminance and that no non-insert region of 20 px or more exceeds 0.95." },
    { "id": "G-landscape-controls", "category": "mobile", "expectedGain": 0.3, "severity": 3, "effort": "S", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Put Launch and the six-lamp mode grid in the landscape HUD column, enlarge the DMD to the column's width, and inset the table 12 px from the bottom edge; test that all three are visible in r11 and no HUD-column gap is taller than 120 px." },
    { "id": "G-arlington-and-upper-field", "category": "authenticity", "expectedGain": 0.3, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["desktop/c01-row", "desktop/c06-arlington", "desktop/c02-springs"], "fix": "Move the Arlington lock to the north (left) end of the Row or hedge the placement with a plate, and repaint the upper field as the Grand Promenade and Hot Springs Mountain with the Display Spring cascade, text-free; test that a reviewer names the Promenade and spring in c02 without labels." },
    { "id": "G-backglass-composition", "category": "art", "expectedGain": 0.2, "severity": 2, "effort": "M", "workstream": "WS4", "evidence": ["desktop/r03-play", "mobile/r03-play"], "fix": "Compose a deco title cartouche as a separate overlay inside the backglass frame (not painted into the art) with lamp-chase trim, and show a backglass strip during the phone attract mode; test that the title sits inside the frame in r01 to r03 and the phone attract frame shows backglass art." }
  ]
}
```

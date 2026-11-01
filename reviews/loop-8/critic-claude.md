# Critic A (critic-claude): loop 8

## Verdict

Spa City Pinball now looks like a coherent, themed digital table. The pinball still loses to a shipped Zen or VPX table when you look closely. The upper repaint works. In `desktop/c02-springs` and `desktop/c06-arlington` the bumpers and the Arlington stand on a calm pool instead of busy foliage. The backglass (`desktop/r03-play`, left panel) is the best single asset and is clearly in the same hand as the playfield. The DMD has real character, with pixel-art Arlington, horse and steaming-mountain icons (`mobile/r06-multiball`, `mobile/r07-mode`, `mobile/r08-wizard`). Every Bathhouse Row landmark is present and in order. Three things hold the score down:
- **Models and materials.** The toys are low-poly blocks in flat materials: grey slab guide walls, cream box plinths and plain white flippers (`desktop/c04-vapors`, `desktop/c06-arlington`, `desktop/c03-flippers`).
- **Lower plaza art.** The bottom third is a soft, sparse terrazzo field. It does not match the lush upper painting and blurs at close range (`desktop/c03-flippers`).
- **Motion and framing.** The strips show a ball, a one-frame flipper snap and bumper flashes, and little else. On desktop the table fills only about 36% of the width, so the ball is a 12 px dot (`desktop/r06-multiball`).

Phone portrait is well composed. Phone landscape is better laid out this loop but the table is still small. Total: **58.0 / 90**. Art, toys, lighting, animation, UI, typography, readability and mobile all miss their gate of 7; only authenticity passes its gate of 6.

## Scores

### Art: 6.5
- **Upper playfield.** `desktop/c02-springs` and `desktop/c01-row` show a properly painted, composed upper third. The pool, tufa and cascade, the brick promenade with its iron railing, and the lamp posts all sit around the bumpers and the Arlington lock. They no longer fight with them.
- **Backglass.** The backglass in `desktop/r03-play` (dome, twin towers, the Mountain Tower on the ridge, steam, neon canopy, wet street, magnolias) is strong, matches the playfield's hand and contains no text.
- **Lower plaza.** It is a different, flatter graphic language: a deco fan over mottled terrazzo (`desktop/c03-flippers`, crop of `desktop/r03-play`). Large areas around the inlanes and the outer edges are empty pink speckle, and at close range the texture is visibly soft and upscaled (`desktop/c03-flippers`).
- **Transition.** The "SPA CITY" banner is where painterly meets flat graphic, and it reads as a seam.
- **Inserts.** They are labelled, but they are plain rectangles, circles and triangles laid on the art without painted halos or surrounds (`desktop/c01-row`: olive rectangles for unlit bathhouse inserts).
- **Verdict.** The art does not yet direct the eye to the shots. It is a 7-anchor upper half on a 5.5-anchor lower half.

### Toys: 6.0
- **What reads.** Every landmark reads at a glance:
  - The Arlington's twin towers (`desktop/c06-arlington`).
  - The Quapaw's mosaic dome, the Ozark's towers and the Fordyce skylight (`desktop/c01-row`).
  - The lattice Mountain Tower with its octagonal deck (`desktop/c05-tower`).
  - The Vapors neon sign (`desktop/c04-vapors`).
  - The bumpers, with teal caps and chrome skirts (`desktop/c02-springs`).
  - The chrome ball (`desktop/c03-flippers`).
- **Construction.**
  - The bathhouses are box extrusions with flat window textures, sitting on featureless cream plinths. Sinking them slightly into the field did not make the plinths read as stoops (`desktop/c06-arlington`).
  - The guide walls around the Vapors scoop and the Arlington lock are untextured grey slabs with no bevel, cap or trim (`desktop/c04-vapors`, `desktop/c06-arlington`). That is the anchor-5 "rails and walls read as grey blocks".
  - The flippers are plain white bars with a red rubber stripe, with no decal, bevel or bat detail (`desktop/c03-flippers`).
  - The slingshot rubbers are a dark brown bar, not rubber rings around posts (`desktop/c03-flippers`).
- **Ramp and wireform.** The clearer ramp plastic helps (`desktop/c05-tower`). The wireform tubes are convincing. But a grey slab still shows under the ramp entrance (bottom of `desktop/c05-tower`).
- **Verdict.** Recognisable models in mostly flat materials: between the 5 and 7 anchors.

### Lighting: 6.5
- **What works.**
  - Lamps bloom only where lit. Compare the lit 2X/3X triangles with the dull 4X/5X in `desktop/c03-flippers`, and the purple mode inserts in `desktop/r03-play`.
  - The wizard drops the GI and lights everything, a real mood shift (`desktop/r08-wizard`, `mobile/r08-wizard`).
  - A bumper hit throws a warm pool onto the water (`desktop/s02-bumpers-1`, `strips/s02-bumpers` frames 1, 2, 5 and 6).
  - Glare on the guide tops and the lock wall is down (`desktop/c06-arlington`).
- **What doesn't.**
  - The base GI is a flat, dim brown over the lower field (`desktop/r03-play`). Nothing reads as warm GI pools along the lanes or under the slings.
  - Toys have little contact shadow or AO. The bathhouses and the Arlington look pasted onto the art (`desktop/c01-row`).
  - Hot white specular streaks remain on the wireform and the rail tops (`desktop/c05-tower`, lower right).
  - The spinner still flashes as a white bar at some angles (`mobile/r03-play`, left orbit at about y=770).
  - Derby Day changes only inserts, not the mood (`desktop/r07-mode`).

### Animation: 6.0
- **Flip strip.** `strips/s01-flip` shows the left flipper going from rest to fully up between frames 2 and 3, and the ball travelling cleanly up the right side. There is no anticipation, no flipper motion blur, no ball trail, and nothing else on the table reacts.
- **Bumper strip.** `strips/s02-bumpers` is the best of the three. The struck bumper's cap flashes and a warm light pool spreads (frames 1, 2 and 6). But the skirt and ring never visibly drop. The steam is a set of near-static vertical streaks that change little across eight frames.
- **Multiball strip.** In `strips/s03-multiball` the insert chase visibly runs: the purple mode arc lights up across frames 4 to 7, and the 2X–5X insert row lights in frames 1 to 3. The balls are tiny and the top of the field (bumpers, arch) is still cut off (`desktop/s03-multiball-4`), so the "whole field" framing claim is not met.
- **Verdict.** Things move and light, but there is no follow-through on any event.

### UI: 6.5
- **DMD.** It has real character: pixel icons per mode, with clear two-line layouts (`desktop/r06-multiball`, `desktop/r07-mode`, `desktop/r08-wizard`).
- **Wizard mode grid.** It now lights all six, which is consistent (`desktop/r08-wizard`).
- **Menus.** Title, Help and Scores share a gold-and-plum deco card (`desktop/r01-title`, `desktop/r09-help`, `desktop/r10-scores`), and Help now has its "Scroll for more" cue.
- **Desktop right panel.**
  - About 200 px of dead space sits above the DMD and about 200 px below Menu.
  - The mode chips are small, flat rounded rectangles that don't look like part of the deco world (`desktop/r03-play`).
  - Score placement flips between frames: in the DMD in `desktop/r03-play`, in the HUD in `desktop/r04-bumpers`.
- **Phone chip.** It shows only the score during Derby Day (`mobile/r07-mode`: "1,274,560"). The claimed mode progress and timer chip is not visible on the phone; desktop shows "Derby · 18/100 · 45s" (`desktop/r07-mode`).

### Typography: 6.5
- **What works.**
  - There is a deliberate display slab-serif with neon glow for "SPA CITY PINBALL" (`desktop/r01-title`, `mobile/r01-title`).
  - The DMD dot font is clean and readable at phone size (`mobile/r03-play`).
  - The body sans is legible in Help at both sizes (`desktop/r09-help`, `mobile/r09-help`).
  - The apron cards use a fitting serif (`desktop/r03-play`).
- **Playfield lettering.**
  - At desktop gameplay scale the lane and insert labels ("EXTRA BALL", "VALLEY OF THE VAPORS", the bathhouse names, "SOAK/DERBY/RAID") are about 5 to 6 px and can't be read (`desktop/r03-play`).
  - In the close-ups the same labels are crisp (`desktop/c01-row`).
- **Mixing faces.** The Help body mixes a bold sans with a slab title. It is fine but generic.

### Readability: 6.5
- **What works.**
  - The chrome ball stands out against the brown plaza and the pool (`desktop/r03-play`, ball by the Mountain Tower label).
  - It also reads through the clearer ramp (`desktop/r05-ramp`, ball at about 785,240).
  - Lit and unlit inserts are clearly different (purple and gold against dim, `desktop/r07-mode`).
  - The calmer pool makes the bumpers read instantly (`desktop/c02-springs`).
- **What doesn't.**
  - At 1280×800 the table is only about 380 to 460 px wide, so in `desktop/r06-multiball` the three balls are about 12 px dots. One sits in the arch at the very top, where it is easy to lose.
  - The shot arrows are small and mostly unlit in normal play, so shot entrances aren't obvious (`desktop/r03-play`).
  - Phone portrait reads better than desktop (`mobile/r06-multiball`).

### Mobile: 6.5
- **Portrait.** It is framed on purpose (`mobile/r03-play`, `mobile/r06-multiball`):
  - The table fills the width.
  - The DMD is large and readable.
  - The menu and Launch buttons sit on the apron, not over the flippers or the ball's area.
- **Landscape.** It now uses a cabinet layout: backglass on the left, table in the centre, DMD and a two-column mode grid on the right (`mobile/r11-landscape`).
  - But the table occupies only about 470 of 1688 px in width, with large black gutters on either side within its column.
  - Playfield lettering is unreadable.
  - The apron is an empty purple band.
- **Phone chip.** The running-mode progress and timer chip is missing (`mobile/r07-mode`).

### Authenticity: 7.0
- **The Row.** All eight bathhouses sit in correct order with their names (Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff, Lamar; `desktop/c01-row`). Each has a distinguishing feature: the Quapaw's mosaic dome, the Ozark's twin towers and the Fordyce skylight.
- **Other landmarks.**
  - The twin-towered Arlington (`desktop/c06-arlington`).
  - The lattice Mountain Tower (`desktop/c05-tower`).
  - The Vapors neon (`desktop/c04-vapors`).
  - Steaming springs, with 143 °F on the bumper caps (`desktop/c02-springs`).
  - Central Avenue and Reserve St labels, and the Display Spring and tufa painting.
- **Copy.** Derby Day and Raid! 1967 are local hooks. The Help copy hedges facts and gets the 1832 reservation date right (`desktop/r09-help`).
- **Why not higher.** A local would name the landmarks, but the toy bathhouses are generic boxes rather than faithful façades.

## IP check

Clean.
- **Paintings.** The backglass painting (`desktop/r03-play` left panel, `mobile/r11-landscape`) has no lettering in the painted neon or buildings. The "SPA CITY PINBALL" title is set as type above or over it, not painted in. The upper playfield painting (`desktop/c02-springs`) has no text.
- **Playfield lettering.** All of it ("THE ARLINGTON", "LOCK", "SHOOT AGAIN", the lane names, "SPA CITY") is applied type, not painted.
- **Trademarks.** Nothing resembles a commercial pinball machine's name, logo or art. "The Vapors" is a real historical venue name, used as a place label in an original neon design, with no real logo.

## Ranked gaps

1. **G-walls-grey-slabs** (toys, WS2, severity 4, effort M, +0.5)
   - **Defect.** The guide, scoop and lock walls are untextured grey slabs (`desktop/c04-vapors`, `desktop/c06-arlington`).
   - **Fix.** Give them a bevelled profile with a satin metal top trim and a printed side decal or a wood-laminate face, plus a rubber or post detail at the ends.
   - **Test.** No flat untextured grey face in c04 or c06.
2. **G-lower-plaza-art** (art, WS4, severity 4, effort L, +0.5)
   - **Defect.** The lower third is sparse, soft terrazzo in a flatter style than the upper painting (`desktop/c03-flippers`, `desktop/r03-play`).
   - **Fix.** Repaint the lower plaza at 2× texel density in the same painterly hand: Central Avenue paving, magnolias at the outlanes, and painted insert surrounds or halos around 2X–5X and the mode arc.
   - **Test.** c03 shows no blurred speckle, and no empty patch larger than a flipper's area.
3. **G-desktop-table-scale** (readability, WS6, severity 4, effort M, +0.5)
   - **Defect.** The table fills only about 36% of the width at 1280×800, the ball is about 12 px, and the side panels hold about 400 px of dead space (`desktop/r06-multiball`, `desktop/r03-play`).
   - **Fix.** Raise the table to at least 50% of the viewport width, or use a slight follow-cam zoom. Compress the backglass panel and move the controls hint below the DMD to remove the empty bands.
   - **Test.** The ball is at least 16 px in r06.
4. **G-event-followthrough** (animation, WS3, severity 4, effort M, +0.5)
   - **Defect.** The flipper jumps in one frame, there's no ball trail, the bumper rings never drop, and the slings never kick (`strips/s01-flip`, `strips/s02-bumpers`).
   - **Fix.** Add:
     - a bumper ring drop and cap scale pulse over 2 to 3 ticks;
     - a sling plastic and rubber flex plus a flash;
     - a short additive ball streak above a speed threshold;
     - a small camera kick on nudge, tilt warning and multiball start.
   - **Test.** The ring drop is visible in s02, and a streak is visible in s01 frames 3 to 5.
5. **G-gi-and-contact-shadows** (lighting, WS1, severity 3, effort M, +0.5)
   - **Defect.** The GI is flat brown, and the bathhouses, Arlington and bumpers have no grounding shadow (`desktop/r03-play`, `desktop/c01-row`).
   - **Fix.** Add warm GI point and area pools along the inlanes, slings and promenade, plus baked AO or contact-shadow decals under every toy.
   - **Test.** A visible dark contact band under each façade in c01.
6. **G-bathhouse-detail** (toys, WS2, severity 3, effort L, +0.5)
   - **Defect.** The bathhouses are box extrusions on cream plinths with flat window textures (`desktop/c06-arlington`, `desktop/c01-row`).
   - **Fix.** Model the façade features (cornices, entablatures, arcades and awnings, stoop steps) with stucco or brick normal maps, and replace the plinths with stepped stoops.
   - **Test.** Every façade in c06 shows depth and relief.
7. **G-flipper-sling-materials** (toys, WS2, severity 3, effort S, +0.25)
   - **Defect.** The flippers are plain white bars and the slings have a dark bar instead of rubber rings (`desktop/c03-flippers`).
   - **Fix.** Give the flippers a bevelled bat with a printed decal (a gold "SPA CITY" or a steam motif) and a separate rubber, and the slings real ring rubbers around posts.
8. **G-landscape-table-size** (mobile, WS6, severity 3, effort M, +0.5)
   - **Defect.** The landscape table is about 470/1688 px wide with black gutters (`mobile/r11-landscape`).
   - **Fix.** Fit the table to the full height of the centre column with less tilt and no inner black margins, and put apron cards in the empty apron band.
   - **Test.** The table spans at least 85% of its column.
9. **G-phone-mode-chip** (ui, WS5, severity 3, effort S, +0.25)
   - **Defect.** The phone chip shows only the score during Derby Day (`mobile/r07-mode`).
   - **Fix.** Show "Derby · 18/100 · 45s" in the chip, or in a second chip, while a mode runs.
   - **Test.** Visible in `mobile/r07-mode`.
10. **G-desktop-panel-deadspace** (ui, WS5, severity 2, effort S, +0.25)
    - **Defect.** Empty bands sit above the DMD and below Menu, and the score jumps between the DMD and the HUD (`desktop/r03-play`, `desktop/r04-bumpers`).
    - **Fix.** Top-align the DMD with the backglass header, keep the score always in the HUD line, and style the mode chips as deco insert plates.
11. **G-wireform-spinner-glare** (lighting, WS1, severity 2, effort S, +0.25)
    - **Defect.** White specular streaks show on the wireform and rail tops (`desktop/c05-tower`), and the spinner still flashes white edge-on (`mobile/r03-play`).
    - **Fix.** Clamp specular on the tube material (roughness ≥ 0.25) and darken the spinner's edge and back faces.
12. **G-steam-streaks** (animation, WS3, severity 2, effort S, +0.25)
    - **Defect.** The steam reads as static vertical light shafts (`desktop/c02-springs`).
    - **Fix.** Use soft billowing particles with curl-noise drift, expansion and fade.
    - **Test.** The silhouette changes visibly across the s02 frames.
13. **G-playfield-label-size** (typography, WS4, severity 2, effort S, +0.25)
    - **Defect.** The lane and insert labels are about 5 px at desktop gameplay scale (`desktop/r03-play`).
    - **Fix.** Enlarge them 1.5× with higher-contrast plates on the key shots, and drop decorative labels that can never be read.
14. **G-multiball-strip-framing** (animation, WS6, severity 2, effort S, +0.25)
    - **Defect.** The top arch and bumpers are cut off in the multiball strip (`strips/s03-multiball`, `desktop/s03-multiball-4`).
    - **Fix.** Fit the strip camera to the full playfield bounds.
    - **Test.** The arch and all balls are visible in every frame.

## A/B

A is better in most categories:
- **Art and readability.** A has the calm pool behind the bumpers (`ab/desktop-c02-springs`, `ab/desktop-c06-arlington`) and the wider desktop table (`ab/desktop-r02-serve`, `ab/desktop-r03-play`).
- **Toys and lighting.** A has less guide and spinner glare (`ab/desktop-c04-vapors`, `ab/desktop-c06-arlington`) and the clearer ramp (`ab/desktop-c05-tower`).
- **UI.** A has the wizard grid fully lit (`ab/desktop-r08-wizard`) and the Help scroll cue.
- **Mobile.** A has the much better landscape layout (`ab/mobile-r11-landscape`).

Animation is close: A's bumper pool is warmer and its multiball frame wider, but B shows stronger flasher bloom in `ab/strips-s03-multiball`. Typography is identical.

```json
{
  "loop": 8,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c02-springs", "note": "upper repaint composed: calm pool, tufa, cascade around bumpers" },
      { "shot": "desktop/r03-play", "note": "backglass strong and same hand; lower plaza sparse terrazzo, style seam at SPA CITY banner" },
      { "shot": "desktop/c03-flippers", "note": "lower terrazzo soft/upscaled, empty speckle areas" },
      { "shot": "desktop/c01-row", "note": "inserts are plain rectangles without painted surrounds" } ] },
    "toys": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c04-vapors", "note": "scoop guide walls flat grey slabs; neon Vapors sign good" },
      { "shot": "desktop/c06-arlington", "note": "Arlington twin towers read; bathhouses box extrusions on cream plinths; lock walls grey" },
      { "shot": "desktop/c05-tower", "note": "lattice tower and wireform convincing; clearer ramp; grey slab under ramp entrance" },
      { "shot": "desktop/c03-flippers", "note": "plain white flippers, slings lack rubber rings; chrome ball good" } ] },
    "lighting": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r08-wizard", "note": "GI drop and full light show: real mood shift" },
      { "shot": "desktop/s02-bumpers-1", "note": "warm pool from bumper hit" },
      { "shot": "desktop/r03-play", "note": "flat dim brown GI on lower field; no contact shadows on toys" },
      { "shot": "desktop/c05-tower", "note": "white specular streaks on wireform/rail tops" },
      { "shot": "mobile/r03-play", "note": "spinner still flashes as white bar" } ] },
    "animation": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "strips/s01-flip", "note": "one-frame flipper snap, no blur/trail, nothing else reacts" },
      { "shot": "strips/s02-bumpers", "note": "cap flash and light pool; no ring drop; steam nearly static" },
      { "shot": "strips/s03-multiball", "note": "insert chase runs; balls tiny; top of field cut off" } ] },
    "ui": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r06-multiball", "note": "DMD with pixel-art icon and clear text" },
      { "shot": "desktop/r08-wizard", "note": "all six mode chips lit, consistent" },
      { "shot": "desktop/r03-play", "note": "dead bands in right panel; plain flat chips" },
      { "shot": "mobile/r07-mode", "note": "phone chip shows only score, no mode progress/timer" } ] },
    "typography": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/r01-title", "note": "deliberate slab display face with neon glow" },
      { "shot": "mobile/r03-play", "note": "DMD dot font clean at 390px" },
      { "shot": "desktop/r03-play", "note": "playfield labels ~5px, unreadable at gameplay scale" },
      { "shot": "mobile/r09-help", "note": "body legible" } ] },
    "readability": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "desktop/r05-ramp", "note": "ball reads through clear ramp" },
      { "shot": "desktop/r06-multiball", "note": "three balls ~12px dots on a narrow table" },
      { "shot": "desktop/r07-mode", "note": "lit vs unlit inserts clearly distinct" },
      { "shot": "mobile/r06-multiball", "note": "phone portrait reads better" } ] },
    "mobile": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "mobile/r03-play", "note": "portrait framed on purpose, DMD large, buttons on apron" },
      { "shot": "mobile/r11-landscape", "note": "cabinet layout but table ~470/1688px, black gutters, empty apron" },
      { "shot": "mobile/r07-mode", "note": "mode progress chip missing" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/c01-row", "note": "eight bathhouses named and in correct order, Quapaw dome, Ozark towers, Fordyce skylight" },
      { "shot": "desktop/c05-tower", "note": "lattice Mountain Tower with octagonal deck" },
      { "shot": "desktop/c02-springs", "note": "143 F springs, steam, Display Spring/tufa" },
      { "shot": "desktop/r09-help", "note": "hedged facts, 1832 reservation" } ] }
  },
  "ab": {
    "art": { "winner": "A", "confidence": 0.6, "pairs": ["ab/desktop-c02-springs", "ab/desktop-c06-arlington", "ab/desktop-r03-play", "ab/mobile-r03-play"], "note": "calm pool composition lets bumpers and Arlington read; B busier cascade foliage" },
    "toys": { "winner": "A", "confidence": 0.6, "pairs": ["ab/desktop-c04-vapors", "ab/desktop-c05-tower", "ab/desktop-c06-arlington", "ab/desktop-c03-flippers"], "note": "satin guide tops, painted spinner flag, clearer ramp" },
    "lighting": { "winner": "A", "confidence": 0.6, "pairs": ["ab/desktop-c04-vapors", "ab/desktop-c06-arlington", "ab/strips-s02-bumpers", "ab/desktop-r08-wizard"], "note": "B has blown glare on spinner bracket and lock wall; A warmer bumper pool" },
    "animation": { "winner": "tie", "confidence": 0.5, "pairs": ["ab/strips-s01-flip", "ab/strips-s02-bumpers", "ab/strips-s03-multiball"], "note": "A bumper pool stronger and multiball frame wider; B multiball shows stronger flasher bloom" },
    "ui": { "winner": "A", "confidence": 0.7, "pairs": ["ab/desktop-r08-wizard", "ab/desktop-r09-help", "ab/mobile-r09-help", "ab/mobile-r11-landscape"], "note": "wizard grid all lit, scroll cue, landscape mode grid" },
    "typography": { "winner": "tie", "confidence": 0.7, "pairs": ["ab/desktop-r01-title", "ab/desktop-r10-scores", "ab/mobile-r10-scores"], "note": "identical type" },
    "readability": { "winner": "A", "confidence": 0.65, "pairs": ["ab/desktop-r02-serve", "ab/desktop-r03-play", "ab/desktop-c02-springs", "ab/desktop-r06-multiball"], "note": "wider desktop table, calmer field behind bumpers" },
    "mobile": { "winner": "A", "confidence": 0.85, "pairs": ["ab/mobile-r11-landscape", "ab/mobile-r03-play", "ab/mobile-r06-multiball"], "note": "landscape cabinet layout with backglass and mode grid vs B's small, steeply tilted table" },
    "authenticity": { "winner": "tie", "confidence": 0.5, "pairs": ["ab/desktop-c01-row", "ab/desktop-c02-springs", "ab/desktop-c06-arlington"], "note": "same landmarks; Display Spring pool vs cascade roughly equal" }
  },
  "ip": { "clean": true, "notes": "No text in backglass or playfield paintings; all lettering is applied type; nothing resembling a commercial pinball name, logo or art; The Vapors used as an original neon place label." },
  "gaps": [
    { "id": "G-walls-grey-slabs", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/c04-vapors", "desktop/c06-arlington"], "fix": "Bevelled guide/scoop/lock walls with satin metal top trim and printed decal or wood-laminate face; no flat untextured grey face in c04/c06." },
    { "id": "G-lower-plaza-art", "category": "art", "expectedGain": 0.5, "severity": 4, "effort": "L", "workstream": "WS4", "evidence": ["desktop/c03-flippers", "desktop/r03-play"], "fix": "Repaint lower plaza at 2x texel density in the upper painting's hand, with outlane magnolias, paving detail and painted insert surrounds; no blurred speckle or flipper-sized empty patch in c03." },
    { "id": "G-desktop-table-scale", "category": "readability", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS6", "evidence": ["desktop/r06-multiball", "desktop/r03-play"], "fix": "Table to >=50% of viewport width at 1280x800 (or a gentle follow zoom); compress side panels; ball >=16px in r06." },
    { "id": "G-event-followthrough", "category": "animation", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS3", "evidence": ["strips/s01-flip", "strips/s02-bumpers"], "fix": "Bumper ring drop + cap pulse over 2-3 ticks, sling kick flex + flash, ball speed streak, camera kick on nudge/multiball; visible ring drop in s02 and streak in s01 frames 3-5." },
    { "id": "G-gi-and-contact-shadows", "category": "lighting", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/r03-play", "desktop/c01-row"], "fix": "Warm GI pools along inlanes/slings/promenade and baked AO or contact-shadow decals under every toy; dark contact band under each facade in c01." },
    { "id": "G-bathhouse-detail", "category": "toys", "expectedGain": 0.5, "severity": 3, "effort": "L", "workstream": "WS2", "evidence": ["desktop/c06-arlington", "desktop/c01-row"], "fix": "Model cornices, arcades, awnings and stoop steps with stucco/brick normal maps; replace cream box plinths with stepped stoops." },
    { "id": "G-flipper-sling-materials", "category": "toys", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS2", "evidence": ["desktop/c03-flippers"], "fix": "Bevelled flipper bat with printed decal and separate rubber; real ring rubbers around sling posts." },
    { "id": "G-landscape-table-size", "category": "mobile", "expectedGain": 0.5, "severity": 3, "effort": "M", "workstream": "WS6", "evidence": ["mobile/r11-landscape"], "fix": "Fit table to full centre-column height with less tilt and no black inner margins; apron cards in the apron; table spans >=85% of its column." },
    { "id": "G-phone-mode-chip", "category": "ui", "expectedGain": 0.25, "severity": 3, "effort": "S", "workstream": "WS5", "evidence": ["mobile/r07-mode"], "fix": "Show running mode progress and timer (e.g. Derby 18/100 45s) in the phone chip during modes." },
    { "id": "G-desktop-panel-deadspace", "category": "ui", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/r03-play", "desktop/r04-bumpers"], "fix": "Top-align DMD with backglass header, keep score always in HUD, style mode chips as deco insert plates; no empty band >80px in right panel." },
    { "id": "G-wireform-spinner-glare", "category": "lighting", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS1", "evidence": ["desktop/c05-tower", "mobile/r03-play"], "fix": "Clamp specular on wireform tubes (roughness >=0.25) and darken spinner edge/back faces so it never reads as a white bar." },
    { "id": "G-steam-streaks", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS3", "evidence": ["desktop/c02-springs", "strips/s02-bumpers"], "fix": "Billowing soft steam particles with curl-noise drift, expansion and fade; silhouette visibly changes across s02 frames." },
    { "id": "G-playfield-label-size", "category": "typography", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS4", "evidence": ["desktop/r03-play"], "fix": "Enlarge key lane/insert labels 1.5x on higher-contrast plates; drop labels that can never be read at gameplay scale." },
    { "id": "G-multiball-strip-framing", "category": "animation", "expectedGain": 0.25, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["strips/s03-multiball", "desktop/s03-multiball-4"], "fix": "Fit strip camera to full playfield bounds; arch and all balls visible in every frame." }
  ],
  "verdict": "continue"
}
```

# Critic A (critic-claude): loop 3

## Verdict

Spa City Pinball now looks like a coherent, themed digital table, but it is not yet at shipped Zen or Pro Pinball level. The strongest parts are the backglass painting, the Bathhouse Row miniatures (eight distinct façades, in the right order and labelled), the lattice Mountain Tower, and the new 1-bit DMD silhouettes, which give the DMD real character. The weak parts are the hardware and the material read. The new "brass" rails are dull olive cylinders with crude overlapping mitre ends, so they look like plumbing, not brushed brass. Bumpers are peach spools. The flippers are plain white, and the promised SPA CITY decal does not show in `desktop/C03-flippers`. The Vapors sign can't be read. The wireform floats with no supports. Lighting is warm and clean, but mood barely shifts: the wizard frame is measurably brighter than normal play, not dimmer. Readability suffers in the dark upper garden, where the ball blends in (`desktop/R04-bumpers`) and the skill-shot lane doesn't clearly flash (`desktop/R02-serve`). Phone landscape (`mobile/R11-landscape`) shows only the lower half of the table. Every category improved over the other build in the A/B pairs, and B is consistently better. Most categories still sit at 6 to 6.5, below the 7 gate.

## Scores

### Art: 6.5
- The painted playfield is in one hand. The upper half is a lush night garden with a spring house, cascades and a pool (`desktop/C02-springs`). The lower half is a deco terrazzo fan with inlaid arches (`desktop/C03-flippers`). The two zones are joined by a brick terrace wall behind the Row (`desktop/C01-row`). The backglass (`desktop/R03-play`, left) is the best art in the game: the Arlington, a domed bathhouse, the tower on the ridge, steam, wet street reflections, magnolias. It sits clearly in the same palette.
- What holds it at 6.5: the garden painting is a generic Kinkade-style picture that runs under the bumpers and lanes without being composed around them. Nothing in it points at the S·P·A lanes, the Arlington lock or the ramp entrance (`desktop/R02-serve`). The lower fan has large empty terrazzo areas between the slings and the mode inserts (`desktop/R03-play`). Insert lettering such as VALLEY OF THE VAPORS, CENTRAL AVENUE and THERMAL SPRINGS is too small at the player camera to work as part of the art.
- B's larger SHOOT AGAIN plate and multiplier plates (`ab/desktop-c03-flippers`) are a clear step up from A's floating text.

### Toys: 6.0
- Reads well: the eight bathhouses are distinct miniatures. The Quapaw has its mosaic dome, the Ozark its twin white towers, the Fordyce its skylight roof (`desktop/C01-row`, `desktop/C06-arlington`). The Mountain Tower is a convincing lattice with a lit observation cab (`desktop/C05-tower`). The ball is a chrome sphere (`desktop/C03-flippers`, top).
- Fails at a close camera:
  - The new half-round rails are matte olive-brown, not brushed brass. At corners the cylinders overlap with visible end caps instead of mitring, so the Vapors guide looks like plumbing (`desktop/C04-vapors`, `desktop/C06-arlington`).
  - The pop bumpers are flat peach cylinders under a green cap. There's no skirt, ring or translucent body, so they read as cartoon spools (`desktop/C02-springs`).
  - The flippers are plain white with a red stripe and carry no SPA CITY decal, although one was promised (`desktop/C03-flippers`).
  - The slingshot base ends show two black holes that read as a face. The rubber "band" is a flat dark slab, not a rubber ring (`desktop/C03-flippers`).
  - The ramp side walls are visibly stair-stepped along the curve, there's a seam at the ramp break, and there's no metal entrance flap. The wireform is two chrome tubes with no cross-ties or posts (`desktop/C05-tower`).
  - The Vapors is a white box with a hairline teal strip. Its sign is a thin pink blade whose lettering can't be read (`desktop/C04-vapors`).
  - The Arlington is a small low-poly block behind the lock, and the lock itself is just a chrome ring between rails (`desktop/C06-arlington`).

### Lighting: 6.0
- Good: lamps bloom only where lit (the 2X/3X inserts and the SOAK and DERBY inserts in `desktop/R03-play`). Warm GI pools around the Row (`desktop/C01-row`). Toys sit on contact shadows (the bathhouse bases in `desktop/C06-arlington`). B removes A's blown blue rim flare (`ab/desktop-c06-arlington`, `ab/desktop-c02-springs`).
- Weak: mood barely moves. The mean colour over the playfield area is R/G/B 94/72/59 in `desktop/R03-play` and 103/83/65 in `desktop/R08-wizard`. The wizard, which is supposed to dim both key and fill, is brighter than normal play. Derby Day (`desktop/R07-mode`) shifts only a few percent warmer. The upper garden is murky, while the bumper bases have hot white specular points that look like LEDs stuck to the base, not reflections (`desktop/C02-springs`). The ball shows little playfield reflection, just a cross-shaped highlight (`desktop/R03-play`). It's not yet "a lit machine in a dark room".

### Animation: 6.5
- `strips/S01-flip`: the left flipper is down in frames 0–2, snaps up in frame 3, and the ball leaves cleanly up the centre by frames 5–7. The snap reads, but there's no motion blur, no ball trail and no flipper rebound.
- `strips/S02-bumpers`: the new playfield ring flash expands and fades over about 6 frames per bumper (frames 0–7), and the ball travels around the cluster. It's the best motion on the table. The cap sink is hard to see, and the ring is a flat orange decal rather than light.
- `strips/S03-multiball`: the lamp state clearly sequences. The bumper rings fire in frames 0–2, the Row lights flash, the mode inserts sweep purple in frames 4–6 and the lanes chase. The camera never reacts, and no ball-launch effect is visible.
- Steam is a set of grey sprite puffs drifting above the bumpers (`strips/S02-bumpers`). It reads, but it's crude.

### UI, DMD and HUD: 6.5
- The DMD now has character. The authored silhouettes (horse and rider in `desktop/R07-mode`, twin towers in `desktop/R06-multiball`, steaming valley in `desktop/R08-wizard`) beat A's dithered mush by a mile (`ab/desktop-r07-mode`, `ab/mobile-r06-multiball`).
- Problems:
  - On desktop the score is still shown twice, in the DMD and again in the HUD (1,234,560 in `desktop/R03-play`).
  - The scrolling objective line freezes mid-word in stills ("RAMPS AND ORBI", "L SHOTS LIT ·" in `mobile/R07-mode`, `mobile/R08-wizard`).
  - The side panel is generic web UI: rounded purple buttons and key-cap hints (`desktop/R03-play`).
  - The title (`desktop/R01-title`) is a plain card over a fully blurred attract demo, so the demo plays no part in the look.
  - The menus (`desktop/R09-help`, `desktop/R10-scores`) are tidy and share the gold-border deco frame, but they're plain.

### Typography: 6.0
- The display face is a deliberate Clarendon-style slab ("SPA CITY / PINBALL" with a neon glow, `desktop/R01-title`). The DMD dot font is clean (`desktop/R03-play`). The apron cards use a fitting period serif (`mobile/R11-landscape`).
- Weak:
  - The UI body is the system sans with nothing period about it (`desktop/R09-help`).
  - Playfield lettering at the player camera is mostly illegible: VALLEY OF THE VAPORS, CENTRAL AVENUE, THERMAL SPRINGS, RESERVE ST and the bathhouse names in `desktop/R03-play` are about 4–6 px tall.
  - The MOUNTAIN TOWER label still collides with its arrow on the phone ("MOUNTAI" and "TOWER" crowd each other in `mobile/R02-serve`).
  - The ☰ and Launch buttons sit on top of the apron card text (`mobile/R08-wizard`).
  - The help screen's About paragraph is small grey text on navy (`desktop/R09-help`).

### Readability: 6.0
- In the lower half the ball reads well against the terrazzo (`desktop/R03-play`, `mobile/R11-landscape`). In multiball all balls are findable (`desktop/R06-multiball`).
- Failures:
  - In the dark upper garden the ball is a low-contrast grey disc among painted flowers (`desktop/R04-bumpers`, upper left of the bumpers).
  - The skill-shot lane does not visibly flash at full strength: S·P·A all look like similar dull gold discs, with A only marginally brighter (`desktop/R02-serve`). On the phone S and A both look lit while the DMD says LANE A (`mobile/R02-serve`).
  - Shot entrances in the upper half (Central Avenue orbit, Reserve St lane, Arlington lock) have no strong arrow inserts at play scale (`desktop/R02-serve`).
  - The inlanes and outlanes carry no lane inserts at all (`desktop/C03-flippers`).
  - On the plus side, the wizard keeps every shot arrow lit in B (`ab/mobile-r08-wizard`).

### Mobile: 6.0
- Portrait is now framed on purpose. The DMD spans the full width with large dots, the corner chip shows progress or score without duplication, and the table fills the width (`mobile/R02-serve`, `mobile/R06-multiball`). The ☰ and Launch buttons float over the apron, away from the ball's area (`mobile/R08-wizard`), but they cover the apron cards.
- Landscape is the problem. `mobile/R11-landscape` shows only the lower half of the table: bumpers, Row, ramp top and lanes are all off-screen, and the right-hand column of HUD is mostly empty below the buttons. A player in landscape can't see what they're shooting at.
- The title and help screens fit and read at 390 px (`mobile/R01-title`, `mobile/R09-help`).

### Authenticity: 7.0
- The eight bathhouses are named and in the correct order: Superior, Hale, Maurice, Fordyce, Quapaw, Ozark, Buckstaff, Lamar (`desktop/C01-row`). The Quapaw dome and Ozark towers are recognisable. The tower is a lattice observation tower (`desktop/C05-tower`). Thermal springs carry 143 °F caps (`desktop/C02-springs`), and the steam rises off the springs. Central Avenue and Reserve St are labelled. The help text hedges facts properly ("about", "reportedly", `desktop/R09-help`).
- Holding it back:
  - The Vapors is an anonymous white box with an unreadable sign (`desktop/C04-vapors`).
  - The Arlington is tiny and generic, a red-roofed toy castle (`desktop/C06-arlington`).
  - Superior and Hale labels are partly hidden behind the Vapors neon blade (`desktop/C01-row`).

## IP check

Clean. No commercial machine names, titles or logos appear anywhere. The backglass painting (checked at 3× crop of `desktop/R03-play`) has no lettering on its neon canopy or buildings. The playfield painting has no text other than the authored insert labels. The DMD silhouettes are generic (horse, towers, steam). No real business logo is visible.

## Ranked gaps

1. **G-landscape-full-table** (mobile, sev 4, S, WS6, +0.75). `mobile/R11-landscape` crops the table at the SPA CITY logo. Fix: in landscape, fit the whole playfield height (tilted camera or full-height fit) and let the HUD column take the leftover width. Test: in the landscape capture the bumpers and the S·P·A lanes are fully in view.
2. **G-rail-brass-material** (toys, sev 4, M, WS2, +0.5). The rails are matte olive cylinders with overlapping end caps (`desktop/C04-vapors`, `desktop/C06-arlington`). Fix: brighter brass albedo (about #C9A24A), metalness 1, roughness 0.3 with an anisotropic or brushed normal, and mitred or swept-tube joints along a single spline per guide. Test: no visible cylinder end caps at corners in `C04` or `C06`, and a specular streak along every rail.
3. **G-bumper-body** (toys, sev 3, M, WS2, +0.4). The peach spool bumpers (`desktop/C02-springs`) need a translucent coloured body with an internal lamp, a chrome ring and a skirt. Test: the `C02` close-up shows three separate parts per bumper and a lit glow through the body.
4. **G-mood-lighting** (lighting, sev 4, S, WS1, +0.5). The wizard frame is brighter than normal play (mean R 103 vs 94). Fix: drop ambient and key by 40–50 % in wizard and multiball, and let the inserts and a coloured sweep carry the light. Test: mean playfield luminance in `R08` is at least 25 % below `R03`.
5. **G-skill-shot-lamp** (readability, sev 3, S, WS4, +0.4). The skill lane is not distinct in `desktop/R02-serve` or `mobile/R02-serve`. Fix: unlit lanes at 15 % or less, the target lane at full emissive with bloom plus a halo decal; check the phone frame. Test: in `R02` only one S·P·A lamp shows bloom.
6. **G-upper-ball-contrast** (readability, sev 3, M, WS1, +0.4). The ball is lost in the dark garden (`desktop/R04-bumpers`). Fix: lift the upper GI or add a soft ball-follow light and a darker contact shadow under the ball; consider a subtle rim on the ball. Test: in `R04` the ball's peak-to-surround luminance ratio is at least 2.5.
7. **G-flipper-decal** (toys, sev 2, S, WS2, +0.2). The SPA CITY decal is absent in `desktop/C03-flippers`. Fix: apply the decal to the top face, and add a real rubber ring with a slight bevel. Test: the decal can be read in `C03`.
8. **G-vapors-sign** (authenticity, sev 3, M, WS2, +0.4). Make the Vapors a recognisable club façade with a horizontal, readable neon "THE VAPORS" sign facing the camera (`desktop/C04-vapors`). Test: the sign can be read in `C04` and in `R03`.
9. **G-playfield-lettering-scale** (typography, sev 3, S, WS4, +0.4). The insert labels are 4–6 px at the player camera (`desktop/R03-play`). Fix: raise the label plates to at least 10 px cap height at 1280×800, and drop or merge labels that can't grow. Also fix the MOUNTAIN TOWER collision on the phone (`mobile/R02-serve`). Test: every label can be read in `R03` without zooming.
10. **G-ramp-wireform-detail** (toys, sev 3, M, WS2, +0.3). Fix: smooth the ramp side walls (more segments), add a metal entrance flap, and add wireform cross-ties and posts (`desktop/C05-tower`). Test: no visible stair-steps on the ramp walls in `C05`, and posts visible on the wireform.
11. **G-desktop-score-dup** (ui, sev 2, S, WS5, +0.3). Desktop shows the score in both the DMD and the HUD (`desktop/R03-play`). Fix: apply the phone rule on desktop, and use the HUD slot for mode or progress info. Also hold the scrolling line on a whole word for still frames. Test: the score appears once in `R03`.
12. **G-apron-button-overlap** (mobile, sev 2, S, WS6, +0.2). The ☰ and Launch buttons cover the apron cards (`mobile/R08-wizard`). Fix: move the apron card text inward or make the buttons part of the apron art. Test: no button overlaps card text in the phone frames.
13. **G-art-shot-direction** (art, sev 3, L, WS4, +0.4). Compose the upper garden around the shots, with painted paths and light beams leading into the S·P·A lanes, the orbit and the lock. Fill the empty terrazzo between the slings and the mode inserts (`desktop/R02-serve`, `desktop/R03-play`). Test: every shot has a painted lead-in.

## A/B

B is the better build in every category. It has round rails, taller façades, ring flashes, DMD silhouettes, a full-width phone DMD and larger plates. A has the flat slabs, dithered DMD paintings and the small phone DMD.

```json
{
  "loop": 3,
  "role": "critic-claude",
  "tier": "high",
  "scores": {
    "art": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/R03-play", "note": "coherent painted garden + deco terrazzo; backglass strong; empty terrazzo between slings and mode inserts" },
      { "shot": "desktop/C02-springs", "note": "garden painting runs under bumpers/lanes without composing around shots" },
      { "shot": "desktop/C03-flippers", "note": "deco fan and inserts integrated, larger plates" },
      { "shot": "desktop/R02-serve", "note": "nothing in art leads to S-P-A lanes, orbit or lock" } ] },
    "toys": { "score": 6.0, "confidence": 0.75, "evidence": [
      { "shot": "desktop/C01-row", "note": "eight distinct bathhouse miniatures read well" },
      { "shot": "desktop/C04-vapors", "note": "olive matte rails with overlapping cylinder end caps; Vapors a white box, sign illegible" },
      { "shot": "desktop/C02-springs", "note": "bumpers are peach spools, no skirt/ring/translucent body" },
      { "shot": "desktop/C03-flippers", "note": "plain flippers, no SPA CITY decal; slingshot ends show two black holes" },
      { "shot": "desktop/C05-tower", "note": "good lattice tower; stair-stepped ramp walls, unsupported wireform" },
      { "shot": "desktop/C06-arlington", "note": "small low-poly Arlington, lock is a chrome ring" } ] },
    "lighting": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/R03-play", "note": "bloom only on lit inserts, warm GI; mean RGB 94/72/59" },
      { "shot": "desktop/R08-wizard", "note": "wizard brighter (103/83/65) than normal play, not dimmed" },
      { "shot": "desktop/R07-mode", "note": "Derby mood shift barely visible" },
      { "shot": "desktop/C02-springs", "note": "hot white LED-like specular points on bumper bases; murky upper field" } ] },
    "animation": { "score": 6.5, "confidence": 0.65, "evidence": [
      { "shot": "strips/S01-flip", "note": "flipper snaps frame 3, ball leaves cleanly; no trail/blur/rebound" },
      { "shot": "strips/S02-bumpers", "note": "ring flash expands/fades over ~6 frames; steam sprite puffs" },
      { "shot": "strips/S03-multiball", "note": "lamp sequence and insert sweep read; camera static" } ] },
    "ui": { "score": 6.5, "confidence": 0.7, "evidence": [
      { "shot": "desktop/R07-mode", "note": "horse-and-rider silhouette DMD with character" },
      { "shot": "desktop/R03-play", "note": "score duplicated DMD + HUD on desktop; generic web side panel" },
      { "shot": "mobile/R07-mode", "note": "scroll line frozen mid-word 'ORBI'" },
      { "shot": "desktop/R01-title", "note": "plain card over fully blurred attract" },
      { "shot": "desktop/R09-help", "note": "tidy deco frame but plain" } ] },
    "typography": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/R01-title", "note": "deliberate slab display face with neon" },
      { "shot": "desktop/R03-play", "note": "playfield labels 4-6 px, illegible at player camera" },
      { "shot": "mobile/R02-serve", "note": "MOUNTAIN TOWER crowds its arrow" },
      { "shot": "desktop/R09-help", "note": "system sans body, small grey About text" } ] },
    "readability": { "score": 6.0, "confidence": 0.65, "evidence": [
      { "shot": "desktop/R04-bumpers", "note": "ball low-contrast in dark garden" },
      { "shot": "desktop/R02-serve", "note": "skill-shot lane not clearly flashing; S-P-A look alike" },
      { "shot": "mobile/R02-serve", "note": "S and A both appear lit while DMD says LANE A" },
      { "shot": "desktop/R06-multiball", "note": "all balls findable" },
      { "shot": "desktop/C03-flippers", "note": "no inlane/outlane inserts" } ] },
    "mobile": { "score": 6.0, "confidence": 0.7, "evidence": [
      { "shot": "mobile/R02-serve", "note": "full-width DMD, table fills width, chip without score duplication" },
      { "shot": "mobile/R08-wizard", "note": "menu/Launch float over apron cards, clear of ball area" },
      { "shot": "mobile/R11-landscape", "note": "only lower half of table visible; bumpers/Row/ramp off-screen" },
      { "shot": "mobile/R09-help", "note": "help fits and reads at 390 px" } ] },
    "authenticity": { "score": 7.0, "confidence": 0.7, "evidence": [
      { "shot": "desktop/C01-row", "note": "eight bathhouses named, correct order, Quapaw dome and Ozark towers recognisable" },
      { "shot": "desktop/C05-tower", "note": "lattice observation tower" },
      { "shot": "desktop/C04-vapors", "note": "Vapors anonymous, sign illegible" },
      { "shot": "desktop/R09-help", "note": "facts hedged" } ] }
  },
  "ab": {
    "art": { "winner": "B", "confidence": 0.65, "pairs": ["ab/desktop-c03-flippers", "ab/desktop-r03-play", "ab/desktop-c04-vapors"], "note": "larger SHOOT AGAIN and multiplier plates, cleaner label placement" },
    "toys": { "winner": "B", "confidence": 0.75, "pairs": ["ab/desktop-c01-row", "ab/desktop-c04-vapors", "ab/desktop-c06-arlington", "ab/desktop-c05-tower"], "note": "taller façades read far better; round rails and bolt heads beat flat slabs despite the olive tint" },
    "lighting": { "winner": "B", "confidence": 0.6, "pairs": ["ab/desktop-c02-springs", "ab/desktop-c06-arlington", "ab/desktop-r08-wizard", "ab/mobile-r07-mode"], "note": "A's blown blue rim flare gone; wizard arrows glow in B" },
    "animation": { "winner": "B", "confidence": 0.7, "pairs": ["ab/strips-s02-bumpers", "ab/strips-s03-multiball", "ab/strips-s01-flip"], "note": "bumper ring flashes add a visible hit reaction" },
    "ui": { "winner": "B", "confidence": 0.85, "pairs": ["ab/desktop-r07-mode", "ab/desktop-r06-multiball", "ab/mobile-r06-multiball", "ab/mobile-r08-wizard"], "note": "1-bit silhouettes vs unreadable dithered paintings" },
    "typography": { "winner": "B", "confidence": 0.65, "pairs": ["ab/desktop-c03-flippers", "ab/mobile-r03-play", "ab/mobile-r07-mode"], "note": "larger plates and much larger phone DMD text" },
    "readability": { "winner": "B", "confidence": 0.6, "pairs": ["ab/mobile-r08-wizard", "ab/desktop-r08-wizard", "ab/mobile-r02-serve", "ab/desktop-r03-play"], "note": "wizard arrows all lit, plates larger" },
    "mobile": { "winner": "B", "confidence": 0.75, "pairs": ["ab/mobile-r02-serve", "ab/mobile-r03-play", "ab/mobile-r06-multiball", "ab/mobile-r11-landscape"], "note": "full-width DMD, no duplicate score, table larger; landscape crop unchanged" },
    "authenticity": { "winner": "B", "confidence": 0.65, "pairs": ["ab/desktop-c01-row", "ab/desktop-c06-arlington", "ab/desktop-r07-mode"], "note": "bathhouse façades and DMD silhouettes more recognisable" }
  },
  "ip": { "clean": true, "notes": "No commercial machine names/logos/art; backglass and playfield paintings carry no text on inspection; DMD silhouettes generic." },
  "gaps": [
    { "id": "G-landscape-full-table", "category": "mobile", "expectedGain": 0.75, "severity": 4, "effort": "S", "workstream": "WS6", "evidence": ["mobile/R11-landscape"], "fix": "Fit the full playfield height in landscape (tilted/fit camera); HUD column takes remaining width. Test: bumpers and S-P-A lanes fully visible in R11." },
    { "id": "G-rail-brass-material", "category": "toys", "expectedGain": 0.5, "severity": 4, "effort": "M", "workstream": "WS2", "evidence": ["desktop/C04-vapors", "desktop/C06-arlington"], "fix": "Brass albedo ~#C9A24A, metalness 1, roughness ~0.3 with brushed normal; sweep each guide as one tube along a spline with mitred corners. Test: no cylinder end caps at corners, specular streak along rails." },
    { "id": "G-mood-lighting", "category": "lighting", "expectedGain": 0.5, "severity": 4, "effort": "S", "workstream": "WS1", "evidence": ["desktop/R08-wizard", "desktop/R03-play", "desktop/R07-mode"], "fix": "Drop ambient/key 40-50% in wizard and multiball; let inserts and a coloured sweep carry light. Test: mean playfield luminance in R08 at least 25% below R03." },
    { "id": "G-bumper-body", "category": "toys", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/C02-springs"], "fix": "Replace peach cylinder with translucent coloured body lit from inside, chrome ring and skirt. Test: three distinct parts and internal glow in C02." },
    { "id": "G-skill-shot-lamp", "category": "readability", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/R02-serve", "mobile/R02-serve"], "fix": "Unlit lanes at <=15% emissive; target lane full emissive with bloom and halo decal. Test: exactly one S-P-A lamp blooms in R02 on both viewports." },
    { "id": "G-upper-ball-contrast", "category": "readability", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS1", "evidence": ["desktop/R04-bumpers"], "fix": "Lift upper-field GI or add soft ball-follow light and darker contact shadow; subtle ball rim. Test: ball peak/surround luminance >= 2.5 in R04." },
    { "id": "G-vapors-sign", "category": "authenticity", "expectedGain": 0.4, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/C04-vapors", "desktop/C01-row"], "fix": "Model a recognisable club façade with a horizontal camera-facing neon THE VAPORS sign; keep it from occluding the Superior/Hale labels. Test: sign readable in C04 and R03." },
    { "id": "G-playfield-lettering-scale", "category": "typography", "expectedGain": 0.4, "severity": 3, "effort": "S", "workstream": "WS4", "evidence": ["desktop/R03-play", "mobile/R02-serve"], "fix": "Raise label plates to >=10 px cap height at 1280x800; merge/drop labels that cannot grow; separate MOUNTAIN TOWER from its arrow. Test: every label legible in R03 unzoomed." },
    { "id": "G-art-shot-direction", "category": "art", "expectedGain": 0.4, "severity": 3, "effort": "L", "workstream": "WS4", "evidence": ["desktop/R02-serve", "desktop/R03-play"], "fix": "Repaint upper garden with paths/light leading into each shot; fill empty terrazzo between slings and mode inserts. Test: every shot has a painted lead-in." },
    { "id": "G-ramp-wireform-detail", "category": "toys", "expectedGain": 0.3, "severity": 3, "effort": "M", "workstream": "WS2", "evidence": ["desktop/C05-tower"], "fix": "More segments on ramp walls, metal entrance flap, wireform cross-ties and posts. Test: no stair-stepping and visible supports in C05." },
    { "id": "G-desktop-score-dup", "category": "ui", "expectedGain": 0.3, "severity": 2, "effort": "S", "workstream": "WS5", "evidence": ["desktop/R03-play", "mobile/R07-mode"], "fix": "Show score once on desktop (HUD slot shows mode/progress); hold scroll line on word boundaries. Test: score appears once in R03." },
    { "id": "G-flipper-decal", "category": "toys", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS2", "evidence": ["desktop/C03-flippers"], "fix": "Make the SPA CITY decal visible on the bat top face; add a beveled rubber ring. Test: decal legible in C03." },
    { "id": "G-apron-button-overlap", "category": "mobile", "expectedGain": 0.2, "severity": 2, "effort": "S", "workstream": "WS6", "evidence": ["mobile/R08-wizard"], "fix": "Inset apron card text or integrate buttons into apron art. Test: no button overlaps card text in phone frames." }
  ]
}
```
